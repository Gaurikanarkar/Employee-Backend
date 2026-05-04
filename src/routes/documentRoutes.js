const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Define routes
router.post('/', documentController.upload.single('file'), documentController.createDocument);
router.get('/', documentController.getAllDocuments);
router.get('/my-documents', documentController.getMyDocuments);
router.put('/:id/status', documentController.updateDocumentStatus);
router.delete('/:id', documentController.deleteDocument);
router.get('/:id/download', documentController.downloadDocument);

module.exports = router;
