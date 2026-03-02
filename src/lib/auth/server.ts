import assert from 'node:assert';
import { createNeonAuth } from '@neondatabase/auth/next/server';

assert(process.env.NEON_AUTH_BASE_URL, 'NEON_AUTH_BASE_URL is not defined');
assert(
	process.env.NEON_AUTH_COOKIE_SECRET,
	'NEON_AUTH_COOKIE_SECRET is not defined',
);

// to use in react server components, server actions, and API routes
export const auth = createNeonAuth({
	baseUrl: process.env.NEON_AUTH_BASE_URL,
	cookies: {
		secret: process.env.NEON_AUTH_COOKIE_SECRET,
	},
});
