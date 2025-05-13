import express from 'express'
import {processImagePipeline} from '../controllers/imageController.js'
import multer from 'multer'
import cors from 'cors'
const router = express.Router();
const upload = multer({ dest: 'uploads/' })
router.use(cors());

//POST route to start pipeline
router.post('/admin/upload', upload.single('image'), processImagePipeline);

export default router;
