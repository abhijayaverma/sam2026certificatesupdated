import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { fontFamily: { sans: ['var(--font-inter)'], serif: ['Georgia', 'Cambria', 'serif'] }, boxShadow: { glow: '0 24px 80px rgba(30,64,175,.18)' } } }, plugins: [] };
export default config;
