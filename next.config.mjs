const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'effigy.im',
        pathname: '/a/**',
      },
    ],
  },

  // FIX 6 — Security headers applied to every response.
  // Strict-Transport-Security is omitted — Vercel injects it automatically on deployment.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            // Prevent this page from being embedded in iframes (clickjacking protection).
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Stop browsers from MIME-sniffing responses away from the declared Content-Type.
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Send full origin on same-origin requests; send only origin on cross-origin.
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Disable hardware APIs this read-only dApp has no need for.
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            // CSP: permissive enough for Next.js hydration + Alchemy API calls.
            // unsafe-eval/inline required by Next.js client runtime in production.
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://effigy.im",
              "font-src 'self'",
              "connect-src 'self' https://*.alchemyapi.io https://*.g.alchemy.com https://*.vercel.app",
            ].join('; '),
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        // CORS — restrict API routes to same-origin only
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'same-origin' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
    ];
  },
};

export default nextConfig;
