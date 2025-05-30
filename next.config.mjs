/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**'
            },
            {
                protocol: 'http',
                hostname: '**'
            }
        ],
        unoptimized: true,
    },
    async rewrites() {
        return [
            {
                source: '/nvl/:path*',
                destination: 'https://novelfull.net/:path*',
            },
            {
                source: '/fwn/:path*',
                destination: 'https://freewebnovel.com/:path*'
            }
        ]
    },
    env: {
        password: process.env.PASSWORD,
    }
};

export default nextConfig;
