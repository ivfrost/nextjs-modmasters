import { dirname } from 'node:path';
import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
	turbopack: {
		root: dirname(__filename),
	},
	images: {
		remotePatterns: [
			new URL(`${process.env.BLOB_BASE_URL}/**`),
			{
				protocol: 'https',
				hostname: 'placehold.co',
			},
			{
				protocol: 'https',
				hostname: 'media.moddb.com',
			},
		],
	},
};

export default nextConfig;
