/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
  // swcMinify: true,
  experimental:{
    appDir: true,
  },
	// output: 'export',
	// distDir: 'public_html',
	images: {
		unoptimized: true
	}
}

module.exports = nextConfig
