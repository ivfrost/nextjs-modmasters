import dotenv from 'dotenv';
import { afterEach, beforeEach, vi } from 'vitest';

// Load base test env first, then local overrides written by global setup
dotenv.config({ quiet: true, path: '.env.test' });
dotenv.config({ quiet: true, path: '.env.test.local' });

// Mock auth server module to avoid importing @neondatabase/auth (which requires next/headers)
vi.mock('@/lib/auth/server', () => ({
	__esModule: true,
	auth: {
		getSession: vi.fn(),
	},
}));

// Mock Next.js redirect function
vi.mock('next/navigation', () => ({
	redirect: vi.fn(),
	useRouter: vi.fn(() => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
	})),
	usePathname: vi.fn(),
}));

// Mock the AI summarize service globally
vi.mock('@/ai/summarize', () => ({
	__esModule: true,
	default: vi.fn().mockResolvedValue('This is a test summary.'),
	summarizeArticle: vi.fn().mockResolvedValue('This is a test summary.'),
}));

// Mock Redis cache eviction globally
vi.mock('@/cache', () => ({
	__esModule: true,
	default: {
		del: vi.fn().mockResolvedValue(1),
	},
}));

beforeEach(async () => {});

afterEach(async () => {
	// Resets call counts without restoring implementations
	vi.clearAllMocks();
});
