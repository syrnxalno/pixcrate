import sharp from "sharp";
import fs from "fs/promises";

async function watermarkImage(job) {
    try {
        const { inputPath, outputPath } = job.data;

        console.log("Watermarking image:", inputPath, "->", outputPath);

        // input file validation
        const inputExists = await fs.access(inputPath).then(() => true).catch(() => false);
        if (!inputExists) {
            throw new Error(`Input file does not exist: ${inputPath}`);
        }

        // watermark SVG
        const watermark = Buffer.from(
            `<svg width="300" height="100">
                <text x="0" y="50" font-size="24" fill="white" opacity="0.5">© watermark</text>
            </svg>`
        );

        const inputImage = await sharp(inputPath).metadata();
        let watermarkSharp = sharp(watermark);
        const watermarkMetadata = await watermarkSharp.metadata();

        
        if (watermarkMetadata.width > inputImage.width || watermarkMetadata.height > inputImage.height) {
            const scale = Math.min(
                inputImage.width / watermarkMetadata.width,
                inputImage.height / watermarkMetadata.height
            );
            watermarkSharp = watermarkSharp.resize( //scale watermark
                Math.floor(watermarkMetadata.width * scale),
                Math.floor(watermarkMetadata.height * scale)
            );
        }

        // Composite watermark on image
        await sharp(inputPath)
            .composite([{ input: await watermarkSharp.toBuffer(), gravity: 'southeast' }])
            .toFile(outputPath);

        // Wait for file to be accessible
        let attempts = 0;
        while (attempts < 5) {
            try {
                await fs.access(outputPath);
                break;
            } catch {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms
            }
        }

        if (attempts === 5) {
            throw new Error(`Watermarked file not found at ${outputPath} after waiting`);
        }

        console.log("Watermarked image verified:", outputPath);
        return { status: "success", outputPath };
    } catch (err) {
        console.error("Error in watermarking image:", err);
        throw err;
    }
}

export default watermarkImage;
