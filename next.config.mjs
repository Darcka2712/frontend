/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const backendProxyUrl =
  process.env.BACKEND_PROXY_URL?.trim() ||
  process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
  'http://localhost:3002'

function getBackendOrigin(url) {
  try {
    return new URL(url).origin
  } catch {
    return 'http://localhost:3002'
  }
}

const backendOrigin = getBackendOrigin(backendProxyUrl)
const cspConnectExtra = process.env.NEXT_PUBLIC_CSP_CONNECT_EXTRA?.trim() || ''

const csp = isProd
  ? [
    "default-src 'self'",
    "script-src 'self' 'strict-dynamic' https:",
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    `connect-src 'self' https: ${backendOrigin}${cspConnectExtra ? ` ${cspConnectExtra}` : ''}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  : [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${backendOrigin} ws: http: https:${cspConnectExtra ? ` ${cspConnectExtra}` : ''}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const backendBase = backendProxyUrl.replace(/\/$/, '')

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendBase}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
