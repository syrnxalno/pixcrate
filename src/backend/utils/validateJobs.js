export default function validateResizeJob(data) {
    return (
        data &&
        typeof data.inputPath === "string" &&
        typeof data.outputPath === "string" 
        // typeof data.width === "number" &&
        // typeof data.height === "number" &&
        // data.width > 0 &&
        // data.height > 0 &&
        // data.width <= 10000 &&
        // data.height <= 10000
    );
}