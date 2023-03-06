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
            // CSP: restrict resource origins to known safe sources.
            // 'unsafe-eval' and 'unsafe-inline' are required by Next.js dev mode and Tailwind.
            // connect-src covers Alchemy endpoints called server-side via /api routes.
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://effigy.im",
              "connect-src 'self' https://*.alchemyapi.io https://*.g.alchemy.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
