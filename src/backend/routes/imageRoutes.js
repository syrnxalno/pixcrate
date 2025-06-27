import express from 'express'
import {processImagePipeline, getFinalImage} from '../controllers/imageController.js'
import multer from 'multer'
import cors from 'cors'
const router = express.Router();
const upload = multer({ dest: 'uploads/' })
router.use(cors());

//POST route to start pipeline
router.post('/admin/upload', upload.single('image'), processImagePipeline);

// Route to get the processed image
router.post('/download/:uuid', getFinalImage);

export default router;
