/**
 * Environment Configuration & Startup Security Verification
 */
export function validateEnvironment() {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    console.error(`❌ CRITICAL: Missing required environment variables: ${missing.join(', ')}`);
    console.error('Check your backend/.env configuration before starting the server.');
    process.exit(1);
  }

  const jwtSecret = process.env.JWT_SECRET!.trim();
  if (process.env.NODE_ENV === 'production') {
    if (
      jwtSecret.length < 32 ||
      /development_only|change_in_production|placeholder|your_jwt|change_me/i.test(jwtSecret)
    ) {
      console.error('❌ CRITICAL: Insecure or placeholder JWT_SECRET detected in production.');
      process.exit(1);
    }
  }

  const dbUrl = process.env.DATABASE_URL!.trim();
  if (!dbUrl.startsWith('mysql://')) {
    console.warn('⚠️ WARNING: DATABASE_URL should use MySQL protocol (mysql://user:pass@host:port/db).');
  }
}
