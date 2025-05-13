import { FlowProducer } from "bullmq";
import redisConnect from "../config/redisConfig.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const flow = new FlowProducer({ connection: redisConnect });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const processImagePipeline = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ message: "No file uploaded" });
        }
        const inputPath = req.file.path;
        const resizedPath = path.resolve(__dirname, '../test/resized.png');
        const compressedPath = path.resolve(__dirname, '../test/compressed.png');
        const watermarkedPath = path.resolve(__dirname, '../test/watermarked.png');
        const savedPath = path.resolve(__dirname, '../test/saved.png');

        // Start from the final job, chaining dependencies as children
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
        res.status(500).json({ message: "Pipeline failed", error: err.message });
    }
};
