import sharp from "sharp";

async function compressImg(job) {
    try {
        const { inputPath, outputPath } = job.data;

        console.log("Inside compressImg utility function", job.data);

       
        const compressedImg = await sharp(inputPath)
            .jpeg({ quality: 100 }) // TODO: Adjust quality later
            .toFile(outputPath); 

        console.log("Compressed image created:", compressedImg);

        return compressedImg;
    } catch (err) {
        console.error("Error compressing image:", err);
        throw err; 
    }
}

export default compressImg;
