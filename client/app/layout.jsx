/* oxlint-disable react/only-export-components */

import '../src/site.css'

export const metadata = {
  title: 'Sidama Regional State',
  description: 'Discover Sidama Regional State — our people, culture, public services, investment opportunities, and regional news.',
  icons: {
    icon: '/sidama-mark.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
