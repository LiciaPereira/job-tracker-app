//type definitions for upload functionality
import type { FileRouter } from "uploadthing/express";

//upload response from the server
export interface UploadResponse {
  url: string;
}

//configuration for the file router
export type UploadThingRouter = FileRouter & {
  resumeUploader: {
    config: { maxFileSize: "4MB" };
    response: UploadResponse;
  };
  coverLetterUploader: {
    config: { maxFileSize: "4MB" };
    response: UploadResponse;
  };
};
