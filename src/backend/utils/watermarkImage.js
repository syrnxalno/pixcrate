import sharp from "sharp";
import fs from "fs/promises";

async function watermarkImage(job) {
    try {
        
        const { inputPath, outputPath } = job.data;

        console.log("Watermarking image:", inputPath, "->", outputPath);

        
        const inputExists = await fs.access(inputPath).then(() => true).catch(() => false);
        if (!inputExists) {
            throw new Error(`Input file does not exist: ${inputPath}`);
        }

        // Create a watermark as an SVG text (example watermark)
        const watermark = Buffer.from(
            `<svg width="300" height="100">
                <text x="0" y="50" font-size="24" fill="white" opacity="0.5">© watermark</text>
            </svg>`
        );

        
        const inputImage = await sharp(inputPath).metadata();

        
        let watermarkSharp = sharp(watermark);
        const watermarkMetadata = await watermarkSharp.metadata();

        // dynamic watermark scaling
        if (watermarkMetadata.width > inputImage.width || watermarkMetadata.height > inputImage.height) {
            const scale = Math.min(inputImage.width / watermarkMetadata.width, inputImage.height / watermarkMetadata.height);
            watermarkSharp = watermarkSharp.resize(Math.floor(watermarkMetadata.width * scale), Math.floor(watermarkMetadata.height * scale));
        }

        
        const processedImage = await sharp(inputPath)
            .composite([{ input: await watermarkSharp.toBuffer(), gravity: 'southeast' }]) 
            .toFile(outputPath); 

        console.log("Watermarked image created:", processedImage);

       
        const outputExists = await fs.access(outputPath).then(() => true).catch(() => false);
        if (!outputExists) {
            throw new Error(`Watermarked file was not created: ${outputPath}`);
        }

        return { status: "success", outputPath }; 
    } catch (err) {
        console.error("Error in watermarking image:", err);
        throw err; 
    }
}

export default watermarkImage;
