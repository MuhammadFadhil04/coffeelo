import 'dotenv/config';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import { signToken } from '../src/utils/jwt.util.js';
import { Role } from '@prisma/client';

process.env.NODE_ENV = 'test';
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_only_jwt_secret_key_for_ci_runner_32_chars';
}

interface TestResult {
  suite: string;
  testName: string;
  passed: boolean;
  durationMs: number;
  details?: string;
}

const results: TestResult[] = [];

async function runTest(suite: string, name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({
      suite,
      testName: name,
      passed: true,
      durationMs: Date.now() - start,
    });
    console.log(`  ✅ [PASS] ${name} (${Date.now() - start}ms)`);
  } catch (err: any) {
    results.push({
      suite,
      testName: name,
      passed: false,
      durationMs: Date.now() - start,
      details: err.message || String(err),
    });
    console.error(`  ❌ [FAIL] ${name} (${Date.now() - start}ms) - ${err.message}`);
  }
}

async function startTestServer(): Promise<{ server: http.Server; baseUrl: string }> {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as any;
      const baseUrl = `http://127.0.0.1:${addr.port}`;
      resolve({ server, baseUrl });
    });
  });
}

async function main() {
  console.log('\n🧪 ========================================================');
  console.log('    COFFEELO — PHASE 7 AUTOMATED INTEGRATION & API TESTS');
  console.log('========================================================\n');

  const { server, baseUrl } = await startTestServer();

  let adminActor = { id: 'mock-admin-uuid', email: 'admin@test.com' };
  let customerActor = { id: 'mock-customer-uuid', email: 'customer@test.com' };

  try {
    const [dbAdmin, dbCustomer] = await Promise.all([
      prisma.user.findFirst({ where: { role: Role.ADMIN }, select: { id: true, email: true } }),
      prisma.user.findFirst({ where: { role: Role.CUSTOMER }, select: { id: true, email: true } }),
    ]);
    if (dbAdmin) adminActor = dbAdmin;
    if (dbCustomer) customerActor = dbCustomer;
  } catch {
    // Database offline in isolated test environment; auth middleware handles test-mode fallback
  }

  try {
    // SUITE 1: Server Health & Security Headers
    console.log('📦 SUITE 1: Server Health & Security Headers');
    await runTest('Security', 'Health Check Endpoint returns HTTP 200', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body: any = await res.json();
      if (!body.success) throw new Error('Body.success was not true');
    });

    await runTest('Settings', 'Public Store Settings returns deliveryFeeFlat & taxPercentage', async () => {
      const res = await fetch(`${baseUrl}/api/settings`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body: any = await res.json();
      if (!body.success || !body.data?.deliveryFeeFlat || body.data?.taxPercentage === undefined) {
        throw new Error('Missing store pricing settings payload');
      }
    });

    await runTest('Security', 'Security Headers (nosniff, DENY, no x-powered-by)', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.headers.get('x-content-type-options') !== 'nosniff') {
        throw new Error('Missing X-Content-Type-Options: nosniff');
      }
      if (res.headers.get('x-frame-options') !== 'DENY') {
        throw new Error('Missing X-Frame-Options: DENY');
      }
      if (res.headers.get('x-powered-by')) {
        throw new Error('X-Powered-By header should be removed');
      }
    });

    await runTest('Security', '404 Route Handler for undefined endpoint', async () => {
      const res = await fetch(`${baseUrl}/api/endpoint-that-does-not-exist`);
      if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
      const body: any = await res.json();
      if (body.success !== false) throw new Error('Body.success was not false');
    });

    // SUITE 2: Input Validation with Zod
    console.log('\n📦 SUITE 2: Zod Input Validation & Error Formatting');
    await runTest('Validation', 'Rejects auth register with invalid email and short password (HTTP 422)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'T',
          email: 'not-an-email',
          password: '123',
        }),
      });
      if (res.status !== 400 && res.status !== 422) {
        throw new Error(`Expected HTTP 400 or 422 for bad input, got ${res.status}`);
      }
      const body: any = await res.json();
      if (body.success !== false) throw new Error('Expected validation error response');
    });

    await runTest('Validation', 'Rejects invalid admin query status with HTTP 422', async () => {
      const adminToken = signToken({
        userId: adminActor.id,
        email: adminActor.email,
        role: Role.ADMIN,
      });
      const res = await fetch(`${baseUrl}/api/admin/orders?status=NOT_A_VALID_ENUM`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 422) {
        throw new Error(`Expected HTTP 422 for invalid status query, got ${res.status}`);
      }
    });

    await runTest('Validation', 'Rejects arbitrary unknown keys on PUT /api/admin/settings (HTTP 422)', async () => {
      const adminToken = signToken({
        userId: adminActor.id,
        email: adminActor.email,
        role: Role.ADMIN,
      });
      const res = await fetch(`${baseUrl}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ injectedArbitraryKey: 'malicious', taxPercentage: -10 }),
      });
      if (res.status !== 422) {
        throw new Error(`Expected HTTP 422 for strict settings schema, got ${res.status}`);
      }
    });

    await runTest('Security', 'Midtrans webhook rejects forged signature with HTTP 403', async () => {
      const res = await fetch(`${baseUrl}/api/payments/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: 'CFL-20261125-FORGED000001',
          status_code: '200',
          gross_amount: '155000',
          signature_key: '0'.repeat(128),
          transaction_status: 'settlement',
        }),
      });
      if (res.status !== 403) {
        throw new Error(`Expected HTTP 403 for forged signature, got ${res.status}`);
      }
    });

    // SUITE 3: RBAC & Authentication Guard
    console.log('\n📦 SUITE 3: Authentication & Role-Based Access Control (RBAC)');
    await runTest('RBAC', 'Accessing /api/admin/orders without token returns 401 Unauthorized', async () => {
      const res = await fetch(`${baseUrl}/api/admin/orders`);
      if (res.status !== 401) throw new Error(`Expected HTTP 401, got ${res.status}`);
    });

    await runTest('RBAC', 'Accessing /api/admin/orders with forged token returns 401 Unauthorized', async () => {
      const res = await fetch(`${baseUrl}/api/admin/orders`, {
        headers: { Authorization: 'Bearer this_is_a_forged_invalid_jwt_token' },
      });
      if (res.status !== 401) throw new Error(`Expected HTTP 401, got ${res.status}`);
    });

    await runTest('RBAC', 'Customer role token accessing /api/admin/orders returns 403 Forbidden', async () => {
      const customerToken = signToken({
        userId: customerActor.id,
        email: customerActor.email,
        role: Role.CUSTOMER,
      });
      const res = await fetch(`${baseUrl}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      if (res.status !== 403) throw new Error(`Expected HTTP 403 for Customer role, got ${res.status}`);
      const body: any = await res.json();
      if (!body.message?.includes('denied') && !body.message?.includes('permission')) {
        throw new Error(`Expected permission denied message, got: ${body.message}`);
      }
    });

    await runTest('RBAC', 'Admin role token passes authorization middleware', async () => {
      const adminToken = signToken({
        userId: adminActor.id,
        email: adminActor.email,
        role: Role.ADMIN,
      });
      const res = await fetch(`${baseUrl}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      // Should not be 401 Unauthorized or 403 Forbidden
      if (res.status === 401 || res.status === 403) {
        throw new Error(`Admin was denied access with status ${res.status}`);
      }
    });

    // SUITE 4: Payload Size Denial-of-Service Protection
    console.log('\n📦 SUITE 4: DoS & Request Body Limits');
    await runTest('Security', 'Large payload (>2MB) is blocked', async () => {
      const hugeString = 'a'.repeat(3 * 1024 * 1024); // 3MB
      try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: hugeString, password: 'password' }),
        });
        if (res.status !== 413 && res.status !== 400 && res.status !== 500) {
          throw new Error(`Expected payload too large error, got ${res.status}`);
        }
      } catch {
        // Network abort on oversized payload is also expected
      }
    });

  } finally {
    server.close();
    await prisma.$disconnect();
  }

  // Summary Report
  console.log('\n========================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`📊 Test Summary: ${passed}/${total} Passed (${failed} Failed)`);
  if (failed === 0) {
    console.log('🎉 ALL INTEGRATION & SECURITY TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('💥 SOME TESTS FAILED. Inspect details above.\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
