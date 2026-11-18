/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/*': ['./schema.sql'],
  },
}

export default nextConfig
