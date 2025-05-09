//Express server configuration for handling file uploads
//Uses UploadThing for secure file storage
import express from "express";
import cors from "cors";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing.js";
import "dotenv/config";
const app = express();
app.use(cors()); // allow requests from frontend
// Parse JSON bodies
app.use(express.json());
// expose uploadthing API route
app.use("/api/uploadthing", createRouteHandler({
    router: uploadRouter,
}));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
