import fs from "fs/promises";

async function saveImage(job) {
    try {
        const { inputPath, destinationPath } = job.data;

        console.log("Inside saveImage utility function", job.data);

        // input file validation
        const inputExists = await fs.access(inputPath).then(() => true).catch(() => false);
        if (!inputExists) {
            throw new Error(`Input path does not exist: ${inputPath}`);
        }

        // copy the file
        await fs.copyFile(inputPath, destinationPath);

        // wait until the destination file actually exists
        let attempts = 0;
        while (attempts < 5) {
            try {
                await fs.access(destinationPath);
                break;
            } catch {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms
            }
        }

        if (attempts === 5) {
            throw new Error(`Saved file not found at ${destinationPath} after waiting`);
        }

        console.log("Image successfully saved to:", destinationPath);
        return { status: 'success', destinationPath };
    } catch (err) {
        console.error("Error saving image:", err);
        throw err;
    }
}

export default saveImage;
