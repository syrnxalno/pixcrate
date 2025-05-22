import sharp from "sharp";
import fs from "fs/promises";

async function compressImg(job) {
    try {
        const { inputPath, outputPath } = job.data;

        console.log("Inside compressImg utility function", job.data);

        await sharp(inputPath)
            .jpeg({ quality: 100 }) // todo: Adjust quality later
            .toFile(outputPath);

        // file existence check
        let attempts = 0;
        while (attempts < 5) {
            try {
                await fs.access(outputPath);
                break;
            } catch {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 100)); // wait time of 100ms between every retry
            }
        }

        if (attempts === 5) {
            throw new Error(`Compressed file not found at ${outputPath} after waiting`);
        }

        console.log("Compressed image verified:", outputPath);
        return { status: 'compressed', outputPath };
    } catch (err) {
        console.error("Error compressing image:", err);
        throw err;
    }
}

export default compressImg;
