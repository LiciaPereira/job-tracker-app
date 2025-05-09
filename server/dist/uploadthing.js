//server configuration for uploadthing file uploads
import { createUploadthing } from "uploadthing/express";
const f = createUploadthing();
export const uploadRouter = {
    resumeUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(({ req }) => {
        return { timestamp: Date.now() };
    })
        .onUploadComplete(({ metadata, file }) => {
        console.log("upload complete:", { metadata, fileUrl: file.url });
        return { url: file.url };
    }),
    coverLetterUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(({ req }) => {
        return { timestamp: Date.now() };
    })
        .onUploadComplete(({ metadata, file }) => {
        console.log("upload complete:", { metadata, fileUrl: file.url });
        return { url: file.url };
    }),
};
