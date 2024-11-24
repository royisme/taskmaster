/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {
          hostname: 'lh3.googleusercontent.com',
        },
        {
          hostname: 'localhost',
        },
        {
          hostname: 'unsplash.com',
        },
    ],
  },
};

export default nextConfig;
