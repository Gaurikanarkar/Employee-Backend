const Document = require('../models/Document');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

exports.upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Create a new document (upload)
exports.createDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const { projectName, userId } = req.body;

    if (!projectName || !userId) {
       // if we fail validation, delete the uploaded file
       fs.unlinkSync(req.file.path);
       return res.status(400).json({ msg: 'Project name and userId are required' });
    }

    const newDoc = new Document({
      projectName,
      uploadedBy: userId,
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

    await newDoc.save();
    res.status(201).json({ msg: 'Document uploaded successfully', data: newDoc });
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get all documents (Admin)
exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ data: docs });
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get my documents (Employee)
exports.getMyDocuments = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ msg: 'userId is required' });
    }

    const docs = await Document.find({ uploadedBy: userId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ data: docs });
  } catch (err) {
    console.error('Error fetching my documents:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Update document status (Admin)
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status, adminComment },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    res.status(200).json({ msg: 'Status updated', data: doc });
  } catch (err) {
    console.error('Error updating document status:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Delete the file from filesystem
    if (fs.existsSync(doc.file.path)) {
      fs.unlinkSync(doc.file.path);
    }

    await doc.deleteOne();
    res.status(200).json({ msg: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    const filePath = doc.file.path;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: 'File not found on server' });
    }

    res.download(filePath, doc.file.originalName);
  } catch (err) {
    console.error('Error downloading document:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
