const Research = require('../models/Research');
const Document = require('../models/Document');
const aiService = require('../services/aiService');
const path = require('path');

// ── POST /api/v1/research ───────────────────────────────────────────────────
const createResearch = async (req, res, next) => {
  try {
    const { queryText, title } = req.body;
    const isDocumentQuery = !!req.file;

    // 1. If a PDF was uploaded, create a Document record first
    let documentRecord = null;
    if (isDocumentQuery) {
      documentRecord = await Document.create({
        user: req.user._id,
        originalName: req.file.originalname,
        storedName: req.file.filename,
        fileSizeBytes: req.file.size,
        mimeType: req.file.mimetype,
        processingStatus: 'uploaded',
      });
    }

    // 2. Create a Research session (status: pending)
    const research = await Research.create({
      user: req.user._id,
      title: title || (isDocumentQuery ? req.file.originalname : queryText?.slice(0, 80)),
      queryText: isDocumentQuery ? null : queryText,
      queryType: isDocumentQuery ? 'document' : 'text',
      document: documentRecord?._id,
      status: 'processing',
    });

    // 3. Call the Python AI service asynchronously (fire-and-forget pattern)
    // The AI service updates Research and Document via callbacks — for Phase 2
    // we trigger the call but do not block the HTTP response.
    (async () => {
      try {
        const startTime = Date.now();
        let searchResults = [];
        let summaryText = '';

        if (isDocumentQuery) {
          // Update document status
          await Document.findByIdAndUpdate(documentRecord._id, { processingStatus: 'extracting' });

          const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
          const extractResponse = await aiService.searchByDocument(filePath, documentRecord._id.toString());

          await Document.findByIdAndUpdate(documentRecord._id, {
            processingStatus: 'ready',
            extractionMethod: extractResponse.extractionMethod || 'unknown',
            pageCount: extractResponse.pageCount,
            wordCount: extractResponse.wordCount,
            chromaDocumentIds: extractResponse.chromaDocumentIds || [],
          });

          // Search using the extracted document text (first 3000 chars for semantic relevance)
          const searchText = extractResponse.extractedText ? extractResponse.extractedText.slice(0, 3000) : '';
          if (searchText) {
            const searchResponse = await aiService.searchByText(searchText);
            searchResults = searchResponse.results || [];
          }
        } else {
          const searchResponse = await aiService.searchByText(queryText);
          searchResults = searchResponse.results || [];
        }

        // Generate RAG summary if results were retrieved
        if (searchResults.length > 0) {
          try {
            const summaryQuery = isDocumentQuery ? (title || req.file?.originalname || 'Uploaded Document Case Analysis') : queryText;
            const summaryResponse = await aiService.generateSummary(summaryQuery, searchResults);
            summaryText = summaryResponse.ragSummary || '';
          } catch (sumErr) {
            console.warn('RAG summarisation failed, proceeding with case results:', sumErr.message);
          }
        }

        await Research.findByIdAndUpdate(research._id, {
          status: 'completed',
          results: searchResults,
          ragSummary: summaryText,
          processingTimeMs: Date.now() - startTime,
        });
      } catch (aiErr) {
        console.error(`AI service error for research ${research._id}:`, aiErr.message);
        await Research.findByIdAndUpdate(research._id, {
          status: 'failed',
          errorMessage: aiErr.message,
        });
        if (documentRecord) {
          await Document.findByIdAndUpdate(documentRecord._id, {
            processingStatus: 'failed',
            processingError: aiErr.message,
          });
        }
      }
    })();

    // 4. Return the session immediately — client polls /api/v1/research/:id for results
    res.status(202).json({
      success: true,
      message: 'Research session started. Poll the status endpoint for results.',
      research: {
        _id: research._id,
        status: research.status,
        queryType: research.queryType,
        title: research.title,
        createdAt: research.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/research/:id ────────────────────────────────────────────────
const getResearch = async (req, res, next) => {
  try {
    const research = await Research.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('document', 'originalName processingStatus pageCount wordCount');

    if (!research) {
      return res.status(404).json({ success: false, message: 'Research session not found' });
    }
    res.json({ success: true, research });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/research ────────────────────────────────────────────────────
const listResearch = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, parseInt(req.query.limit || '20', 10));

    const [sessions, total] = await Promise.all([
      Research.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-results -ragSummary') // lighter response for list view
        .populate('document', 'originalName'),
      Research.countDocuments({ user: req.user._id }),
    ]);

    res.json({ success: true, total, page, limit, sessions });
  } catch (err) {
    next(err);
  }
};

module.exports = { createResearch, getResearch, listResearch };
