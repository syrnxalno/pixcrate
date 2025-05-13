import sharp from "sharp";

async function resizeImage(job) {
    try {
        const { inputPath, outputPath } = job.data;  // Data is already passed to the job by FlowProducer

        console.log("Inside resizeImage utility function", job.data);

        
        const resizeImg = await sharp(inputPath).resize({ width: 120, height: 120 })
            .toFile(outputPath); 

        return resizeImg;
    } catch (err) {
        console.error("Error resizing image:", err);
        throw err;  
    }
}

export default resizeImage;
