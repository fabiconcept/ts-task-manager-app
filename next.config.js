/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'taskify.sirv.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}


module.exports = nextConfig
