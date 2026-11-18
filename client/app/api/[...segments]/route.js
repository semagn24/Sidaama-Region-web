import { NextResponse } from 'next/server'
import { assistantKnowledge } from '../../../lib/assistant-knowledge.js'
import { getPool, initializeDatabase } from '../../../lib/db.js'

export const runtime = 'nodejs'

const MAX_REQUEST_SIZE = 20 * 1024
const CHAT_RATE_LIMIT = 50
const CHAT_RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60 * 1000
const MAX_CHAT_QUESTION_LENGTH = 1000
const CHAT_LANGUAGES = {
  en: 'English',
  am: 'Amharic',
  sid: 'Sidaamu Afoo (Sidama language)',
}
const API_SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-XSS-Protection': '0',
}
const chatRateLimits = new Map()
let lastRateLimitCleanup = 0
let searchGroundingUnavailableUntil = 0

function json(data, status = 200, headers) {
  return NextResponse.json(data, {
    status,
    headers: { ...API_SECURITY_HEADERS, ...headers },
  })
}

async function readJson(request) {
  const contentLength = Number(request.headers.get('content-length'))
  if (contentLength > MAX_REQUEST_SIZE) {
    return { error: json({ error: 'Request body is too large.' }, 413) }
  }

  const body = await request.text()
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_SIZE) {
    return { error: json({ error: 'Request body is too large.' }, 413) }
  }

  try {
    return { data: JSON.parse(body) }
  } catch {
    return { error: json({ error: 'Request body must be valid JSON.' }, 400) }
  }
}

function getClientIp(request) {
  return request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || 'unknown'
}

function handleError(error) {
  console.error('API request failed:', error)
  return json({ error: 'An unexpected server error occurred.' }, 500)
}

export async function GET(request, context) {
  try {
    const { segments = [] } = await context.params
    const [resource, id] = segments

    if (resource === 'health' && !id) {
      await initializeDatabase()
      await getPool().query('SELECT 1')
      return json({ status: 'ok', database: 'connected' })
    }

    if (resource === 'news' && !id) {
      await initializeDatabase()
      const { rows } = await getPool().query(
        'SELECT id, title, category, summary, published_at FROM news ORDER BY published_at DESC, id DESC',
      )
      return json(rows)
    }

    if (resource === 'news' && id) {
      const newsId = Number(id)
      if (!Number.isSafeInteger(newsId) || newsId < 1) {
        return json({ error: 'News ID must be a positive integer.' }, 400)
      }

      await initializeDatabase()
      const { rows } = await getPool().query(
        'SELECT id, title, category, summary, published_at FROM news WHERE id = $1',
        [newsId],
      )
      if (!rows[0]) return json({ error: 'News story not found.' }, 404)
      return json(rows[0])
    }

    if (resource === 'services' && !id) {
      await initializeDatabase()
      const { rows } = await getPool().query(
        'SELECT id, name, description, category FROM services ORDER BY id',
      )
      return json(rows)
    }

    return json({ error: 'Not found' }, 404)
  } catch (error) {
    return handleError(error)
  }
}

async function handleChat(request, body) {
  const { question, language = 'en' } = body ?? {}
  if (typeof question !== 'string' || !question.trim() || question.trim().length > MAX_CHAT_QUESTION_LENGTH) {
    return json({ error: `Question must be between 1 and ${MAX_CHAT_QUESTION_LENGTH} characters.` }, 400)
  }
  if (!Object.hasOwn(CHAT_LANGUAGES, language)) {
    return json({ error: 'Language must be en, am, or sid.' }, 400)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return json({ error: 'The AI assistant is not configured. Set GEMINI_API_KEY in the server environment.' }, 503)
  }

  const now = Date.now()
  const clientIp = getClientIp(request)
  let rateLimit = chatRateLimits.get(clientIp)
  if (!rateLimit || rateLimit.resetAt <= now) {
    rateLimit = { count: 0, resetAt: now + CHAT_RATE_WINDOW_MS }
    chatRateLimits.set(clientIp, rateLimit)
  }
  if (rateLimit.count >= CHAT_RATE_LIMIT) {
    return json(
      { error: 'Assistant request limit reached. Please try again later.' },
      429,
      { 'Retry-After': String(Math.ceil((rateLimit.resetAt - now) / 1000)) },
    )
  }
  rateLimit.count += 1

  if (now - lastRateLimitCleanup > RATE_LIMIT_CLEANUP_INTERVAL_MS) {
    for (const [ip, entry] of chatRateLimits) {
      if (entry.resetAt <= now) chatRateLimits.delete(ip)
    }
    lastRateLimitCleanup = now
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
  const prompt = [
    `Comprehensive regional knowledge base for Sidama Regional State:\n${JSON.stringify(assistantKnowledge)}`,
    `Visitor question:\n${question.trim()}`,
  ].join('\n\n')

  const systemText = [
    'You are the official Sidama Regional State website assistant.',
    `Answer in ${CHAT_LANGUAGES[language]}.`,
    'Be welcoming, factual, concise, and helpful.',
    'Use the provided regional knowledge base to answer questions about Sidama history, statehood, culture (Fichee–Chambalaalla, Luwa, Seera, Enset), tourism (Lake Hawassa, Wondo Genet, Logita Falls), language (Sidaamu Afoo), economy (specialty coffee, Hawassa Industrial Park), education, health, and government.',
    'If the question asks about something not explicitly covered in the knowledge base, answer accurately based on your broad knowledge of Ethiopia and the Sidama people.',
    'Do not invent facts or claim to be an official government spokesperson.',
  ].join(' ')

  const contents = [{ role: 'user', parts: [{ text: prompt }] }]
  const generationConfig = {
    temperature: 0.2,
    maxOutputTokens: 700,
  }

  async function requestGemini(withSearchGrounding) {
    const payload = {
      systemInstruction: { parts: [{ text: systemText }] },
      contents,
      generationConfig,
    }
    if (withSearchGrounding) {
      payload.tools = [{ googleSearch: {} }]
    }

    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      },
    )
  }

  let modelResponse

  try {
    const canAttemptSearch = now >= searchGroundingUnavailableUntil
    if (canAttemptSearch) {
      modelResponse = await requestGemini(true)
      if (modelResponse.status === 429 || modelResponse.status === 400) {
        // Google Search Grounding quota reached; disable search grounding for 15 minutes and immediately answer using local knowledge
        searchGroundingUnavailableUntil = Date.now() + 15 * 60 * 1000
        console.warn(`[AI Assistant] Search grounding returned HTTP ${modelResponse.status}; falling back immediately to regional knowledge base.`)
        modelResponse = await requestGemini(false)
      }
    } else {
      modelResponse = await requestGemini(false)
    }

    // If transient 503, retry once
    if (modelResponse.status === 503) {
      await new Promise((resolve) => setTimeout(resolve, 750))
      modelResponse = await requestGemini(false)
    }
  } catch (err) {
    console.error('[AI Assistant] Connection error calling Gemini:', err)
    return json({ error: 'The AI assistant could not be reached. Please try again shortly.' }, 502)
  }

  if (!modelResponse.ok) {
    let providerStatus = 'unknown'
    let providerDetails = []
    try {
      const errorData = await modelResponse.json()
      providerStatus = errorData.error?.status || providerStatus
      providerDetails = Array.isArray(errorData.error?.details) ? errorData.error.details : []
    } catch {
      console.error(`Gemini returned a non-JSON error for model ${model}.`)
    }
    console.error(`Gemini request failed with HTTP ${modelResponse.status} (${providerStatus}) for model ${model}.`)
    const retryInfo = providerDetails.find((detail) => detail['@type']?.endsWith('.RetryInfo'))
    const retryDelay = retryInfo?.retryDelay?.match(/^(\d+(?:\.\d+)?)s$/)?.[1]
    const retryAfter = Number(modelResponse.headers.get('retry-after') || retryDelay)
    const headers = Number.isFinite(retryAfter) && retryAfter > 0
      ? { 'Retry-After': String(Math.ceil(retryAfter)) }
      : undefined
    const errors = {
      400: 'Gemini rejected the request. Check that GEMINI_MODEL is a text-generation model supported by your API key.',
      401: 'Gemini did not accept the API key. Create a valid Gemini API key and update GEMINI_API_KEY on the server.',
      403: 'Gemini denied access. Check that the key is valid and the Generative Language API is enabled for its project.',
      404: `Gemini model "${model}" is not available to this API key. Set GEMINI_MODEL to an available model in the root .env file.`,
      429: 'The AI assistant is temporarily busy due to general API rate limits. Please wait a moment and try again.',
      503: 'Gemini is temporarily unavailable or overloaded. Please retry shortly.',
    }
    const error = errors[modelResponse.status] || 'The AI service returned an unexpected error. Check the server logs and try again.'
    const status = [400, 401, 403, 404, 429, 503].includes(modelResponse.status)
      ? modelResponse.status
      : 502
    return json({ error }, status, headers)
  }

  let modelData
  try {
    modelData = await modelResponse.json()
  } catch {
    console.error('Gemini returned an invalid JSON response.')
    return json({ error: 'The AI assistant returned an invalid response. Please try again shortly.' }, 502)
  }

  const candidate = modelData.candidates?.[0]
  const answer = candidate?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
  if (typeof answer !== 'string' || !answer.trim()) {
    console.error('Gemini returned no answer text.')
    return json({ error: 'The AI assistant returned an empty answer. Please try again.' }, 502)
  }

  const chunks = candidate.groundingMetadata?.groundingChunks || []
  const seenUrls = new Set()
  const sources = chunks.flatMap((chunk) => {
    const { uri, title } = chunk.web || {}
    if (typeof uri !== 'string' || typeof title !== 'string') return []
    try {
      const url = new URL(uri)
      if ((url.protocol !== 'https:' && url.protocol !== 'http:') || seenUrls.has(url.href)) return []
      seenUrls.add(url.href)
      return [{ title, url: url.href, snippet: '' }]
    } catch {
      return []
    }
  }).slice(0, 5)

  // When web grounding is unavailable, link matching official regional topics
  if (sources.length === 0) {
    const qLower = question.toLowerCase()
    const relevant = assistantKnowledge.filter((k) => {
      const id = k.id.toLowerCase()
      if (id === 'about' && (qLower.includes('where') || qLower.includes('sidama') || qLower.includes('capital') || qLower.includes('history'))) return true
      if (id === 'culture' && (qLower.includes('fichee') || qLower.includes('culture') || qLower.includes('luwa') || qLower.includes('seera') || qLower.includes('enset'))) return true
      if (id === 'tourism' && (qLower.includes('tour') || qLower.includes('lake') || qLower.includes('hawassa') || qLower.includes('falls') || qLower.includes('wondo'))) return true
      if (id === 'economy' && (qLower.includes('coffee') || qLower.includes('economy') || qLower.includes('trade') || qLower.includes('park'))) return true
      if (id === 'language' && (qLower.includes('language') || qLower.includes('afoo') || qLower.includes('words') || qLower.includes('speak') || qLower.includes('number'))) return true
      if (id === 'health' && (qLower.includes('health') || qLower.includes('hospital') || qLower.includes('doctor'))) return true
      if (id === 'education' && (qLower.includes('school') || qLower.includes('university') || qLower.includes('college'))) return true
      return false
    })
    for (const item of relevant.slice(0, 2)) {
      sources.push({
        title: item.title,
        url: item.url,
        snippet: item.summary,
      })
    }
  }

  const searchUrl = new URL('https://www.google.com/search')
  searchUrl.searchParams.set('q', `${question.trim()} Sidama Ethiopia`)
  return json({ answer: answer.trim(), sources, searchUrl: searchUrl.href })
}

async function handleContact(body) {
  const { name, email, subject, message } = body ?? {}
  const fields = [name, email, subject, message]
  if (fields.some((value) => typeof value !== 'string')) {
    return json({ error: 'Name, email, subject, and message are required.' }, 400)
  }

  const values = fields.map((value) => value.trim())
  const [cleanName, cleanEmail, cleanSubject, cleanMessage] = values
  if (
    !cleanName || cleanName.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254 ||
    !cleanSubject || cleanSubject.length > 180 ||
    cleanMessage.length < 10 || cleanMessage.length > 3000
  ) {
    return json({ error: 'Please provide valid contact details and a message between 10 and 3000 characters.' }, 400)
  }

  await initializeDatabase()
  const { rows } = await getPool().query(
    `INSERT INTO contact_messages (name, email, subject, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    values,
  )
  return json({ message: 'Your message has been received.', id: rows[0].id }, 201)
}

export async function POST(request, context) {
  try {
    const { segments = [] } = await context.params
    const [resource] = segments
    const parsed = await readJson(request)
    if (parsed.error) return parsed.error

    if (resource === 'chat') return await handleChat(request, parsed.data)
    if (resource === 'contact') return await handleContact(parsed.data)
    return json({ error: 'Not found' }, 404)
  } catch (error) {
    return handleError(error)
  }
}
