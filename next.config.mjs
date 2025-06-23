/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [new URL('https://imagedelivery.net/**')],
    }
};

export default nextConfig;
