import fs from "fs/promises";

async function saveImage(job) {
    try {
        
        const { inputPath, destinationPath } = job.data;

        console.log("Inside saveImage utility function", job.data);

        
        const exists = await fs.access(inputPath).then(() => true).catch(() => false);
        if (!exists) throw new Error(`Input path does not exist: ${inputPath}`);

        
        await fs.copyFile(inputPath, destinationPath);

        return { status: 'success', destinationPath }; // Return the destination path
    } catch (err) {
        console.error("Error saving image:", err);
        throw err; 
    }
}

export default saveImage;
