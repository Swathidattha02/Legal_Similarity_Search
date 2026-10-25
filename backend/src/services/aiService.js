const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const TIMEOUT_MS = 120_000; // 2 minutes — AI processing can be slow

const client = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Check whether the Python AI service is reachable.
 * @returns {Promise<boolean>}
 */
const checkHealth = async () => {
  try {
    const { data } = await client.get('/health');
    return data.status === 'ok';
  } catch {
    return false;
  }
};

/**
 * Search by plain text query.
 * @param {string} queryText
 * @returns {Promise<object>} AI service response
 */
const searchByText = async (queryText) => {
  const { data } = await client.post('/api/v1/research/search', { query_text: queryText });
  return data;
};

/**
 * Extract and search by uploaded document.
 * @param {string} filePath  Absolute path to the uploaded PDF on disk
 * @param {string} documentId  MongoDB Document ID for traceability
 * @returns {Promise<object>} AI service response
 */
const searchByDocument = async (filePath, documentId) => {
  const FormData = require('form-data');
  const fs = require('fs');

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('document_id', documentId);

  const { data } = await client.post('/api/v1/documents/extract', form, {
    headers: form.getHeaders(),
    timeout: 180_000, // OCR can be slower
  });
  return data;
};

/**
 * Generate a RAG summary for a set of retrieved cases.
 */
const generateSummary = async (queryText, cases) => {
  const { data } = await client.post('/api/v1/research/summarize', {
    query_text: queryText,
    cases,
  });
  return data;
};

module.exports = { checkHealth, searchByText, searchByDocument, generateSummary };
