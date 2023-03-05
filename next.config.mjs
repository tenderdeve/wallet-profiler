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
};

export default nextConfig;
