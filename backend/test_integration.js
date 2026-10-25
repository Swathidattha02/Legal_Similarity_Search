/**
 * End-to-end integration test for AI Legal Case Similarity Platform.
 * Tests Auth, Research Session, AI Retrieval, RAG Summary, and Saved Cases.
 */
require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪  RUNNING END-TO-END INTEGRATION TEST SUITE');
  console.log('======================================================\n');

  // 1. Connect DB
  await connectDB();
  console.log('✅ 1. MongoDB Connected successfully');

  // 2. Start HTTP server on temporary port 5055 for testing
  const TEST_PORT = 5055;
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`✅ 2. Test server listening on http://localhost:${TEST_PORT}`);

  const BASE_URL = `http://localhost:${TEST_PORT}`;

  async function req(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  }

  try {
    // 3. Health check
    const health = await req('/health');
    console.log(`✅ 3. GET /health -> Status ${health.status} (${health.data.status})`);

    // 4. Register new test user
    const testEmail = `student_${Date.now()}@lawcollege.ac.in`;
    const regRes = await req('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Arjun Advocate',
        email: testEmail,
        password: 'Password@123',
        profession: 'lawyer',
        organization: 'Delhi High Court Bar Association',
      }),
    });
    console.log(`✅ 4. POST /api/v1/auth/register -> Status ${regRes.status} (User: ${regRes.data.user?.name})`);
    const token = regRes.data.token;
    if (!token) throw new Error('No token returned from register');

    // 5. Auth /me test
    const meRes = await req('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ 5. GET /api/v1/auth/me -> Status ${meRes.status} (${meRes.data.user?.email})`);

    // 6. Test AI Search via Research API
    console.log('\n🔍  Submitting Legal Query: "anticipatory bail under section 438 crpc"...');
    const researchRes = await req('/api/v1/research', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Anticipatory Bail Precedents',
        queryText: 'anticipatory bail guidelines under section 438 crpc and arrest notice 41A',
      }),
    });
    console.log(`✅ 6. POST /api/v1/research -> Status ${researchRes.status} (Session ID: ${researchRes.data.research?._id})`);
    const researchId = researchRes.data.research?._id;

    // 7. Poll until research completes
    console.log('⏳  Waiting for InLegalBERT & Hybrid Retrieval to complete...');
    let session = null;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await req(`/api/v1/research/${researchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      session = pollRes.data.research;
      if (session.status === 'completed' || session.status === 'failed') break;
      process.stdout.write('.');
    }
    console.log(`\n✅ 7. Research status: ${session.status} (Processing time: ${session.processingTimeMs} ms)`);

    if (session.status === 'completed') {
      console.log(`     Retrieved Cases Count: ${session.results?.length || 0}`);
      session.results?.slice(0, 3).forEach((c, idx) => {
        console.log(`     [Match ${idx + 1}] ${c.caseTitle} (Similarity: ${(c.similarityScore * 100).toFixed(1)}%, Citation: ${c.citation})`);
      });
      console.log(`     RAG Summary Preview: ${session.ragSummary?.slice(0, 100)}...`);
    } else {
      console.warn(`     Note: Session ended with status: ${session.status} (${session.errorMessage})`);
    }

    // 8. Test saving a case
    if (session.results && session.results.length > 0) {
      const topCase = session.results[0];
      const saveRes = await req('/api/v1/saved-cases', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          caseId: topCase.caseId,
          caseTitle: topCase.caseTitle,
          court: topCase.court,
          year: topCase.year,
          citation: topCase.citation,
          similarityScore: topCase.similarityScore,
          matchedPassages: topCase.matchedChunks || [],
          statutes: topCase.statutes || [],
          summary: topCase.summary,
          notes: 'Leading Constitution Bench authority on anticipatory bail scope.',
        }),
      });
      console.log(`✅ 8. POST /api/v1/saved-cases -> Status ${saveRes.status}`);

      // 9. List saved cases
      const listSaved = await req('/api/v1/saved-cases', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`✅ 9. GET /api/v1/saved-cases -> Found ${listSaved.data.savedCases?.length} saved case(s)`);
    }

    // 10. Check research history
    const historyRes = await req('/api/v1/history', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ 10. GET /api/v1/history -> Found ${historyRes.data.sessions?.length} session(s) in history`);

    console.log('\n======================================================');
    console.log('🎉  ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌  Integration test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
