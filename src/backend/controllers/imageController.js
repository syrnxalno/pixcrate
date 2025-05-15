import { FlowProducer } from "bullmq";
import redisConnect from "../config/redisConfig.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let flow;
let isWorkersReady = false;

export const initializeFlowProducer = () => {
    flow = new FlowProducer({ connection: redisConnect });
};

export const markWorkersAsReady = () => {
    isWorkersReady = true;
};

// ensure directory exists
const ensureDirectoryExists = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

export const processImagePipeline = async (req, res) => {
    try {
        if (!isWorkersReady) {
            return res.status(503).json({ message: "Workers are not ready. Try again later." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const inputPath = req.file.path;

        const resizedPath = path.resolve(__dirname, '../test/resized.png');
        const compressedPath = path.resolve(__dirname, '../test/compressed.png');
        const watermarkedPath = path.resolve(__dirname, '../test/watermarked.png');
        const savedPath = path.resolve(__dirname, '../test/saved.png');

        // ensure output directories exist before job processing
        [
            resizedPath,
            compressedPath,
            watermarkedPath,
            savedPath
        ].forEach(ensureDirectoryExists);

        // validate uploaded file exists before proceeding
        if (!fs.existsSync(inputPath)) {
            return res.status(400).json({ message: `Uploaded file not found at path: ${inputPath}` });
        }

        // FlowProducer tree
        const jobTree = await flow.add({
            name: 'saveImage',
            queueName: 'saveImageQueue',
            data: { inputPath: watermarkedPath, destinationPath: savedPath },
            children: [
                {
                    name: 'watermarkImage',
                    queueName: 'watermarkQueue',
                    data: { inputPath: compressedPath, outputPath: watermarkedPath },
                    children: [
                        {
                            name: 'compressImage',
                            queueName: 'compressQueue',
                            data: { inputPath: resizedPath, outputPath: compressedPath },
                            children: [
                                {
                                    name: 'resizeImage',
                                    queueName: 'resizeQueue',
                                    data: { inputPath, outputPath: resizedPath }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        res.status(200).json({
            message: "Image pipeline started",
            jobIds: {
                save: jobTree.job.id,
                watermark: jobTree.children[0].job.id,
                compress: jobTree.children[0].children[0].job.id,
                resize: jobTree.children[0].children[0].children[0].job.id
            }
        });

    } catch (err) {
        console.error("Pipeline Error:", err); 
        res.status(500).json({ message: "Pipeline failed", error: err.message });
    }
};
