
/** @type {import('next').NextConfig} */
const nextConfig = {
    scripts: {
        postbuild: "npm run convert-data"
    }
}

module.exports = nextConfig
