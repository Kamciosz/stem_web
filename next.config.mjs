import createMDX from "@next/mdx";

const isDev = process.env.NODE_ENV === "development";
const cspScriptSrc = isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval';" : "script-src 'self' 'unsafe-inline';";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            }
        ]
    },
    async redirects() {
        return [
            { source: "/projects", destination: "/projekty", permanent: true },
            { source: "/project/:slug", destination: "/projekt/:slug", permanent: true },
            { source: "/group/:slug", destination: "/zespol", permanent: true },
            { source: "/profile/:slug", destination: "/zespol", permanent: true }
        ];
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    {
                        key: "Content-Security-Policy",
                        value:
                            `default-src 'self'; img-src 'self' https://images.unsplash.com data: blob:; style-src 'self' 'unsafe-inline'; ${cspScriptSrc} font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';`
                    }
                ]
            }
        ];
    }
};

const withMDX = createMDX({
    extension: /\.(md|mdx)$/
});

export default withMDX(nextConfig);
