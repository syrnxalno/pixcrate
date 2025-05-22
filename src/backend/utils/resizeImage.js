import fs from "fs/promises";
import sharp from "sharp";

async function resizeImage(job) {
    try {
        const { inputPath, outputPath } = job.data;
        console.log("Inside resizeImage utility function", job.data);

        await sharp(inputPath).resize({ width: 120, height: 120 })
            .toFile(outputPath);

        // wait until the file actually exists
        let attempts = 0;
        while (attempts < 5) {
            try {
                await fs.access(outputPath);
                break; // file found
            } catch {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms
            }
        }

        if (attempts === 5) {
            throw new Error(`Resized file not found at ${outputPath} after waiting`);
        }

        return { status: 'resized', outputPath };
    } catch (err) {
        console.error("Error resizing image:", err);
        throw err;
    }
}

export default resizeImage;
