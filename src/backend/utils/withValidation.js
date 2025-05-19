import fs from "fs";

export default function withValidation(jobHandler, schemaValidator) {
    return async function (job) {
        if (!schemaValidator(job.data)) {
            throw new Error("Job validation failed.");
        }

        const { inputPath } = job.data;

        if (!fs.existsSync(inputPath)) {
            throw new Error("Input image file does not exist.");
        }

        const stats = fs.statSync(inputPath);
        if (stats.size === 0) {
            throw new Error("Image file is empty or corrupted.");
        }

        return await jobHandler(job);
    };
}
