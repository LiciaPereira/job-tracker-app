//client configuration for uploadthing file uploads
import { generateUploadButton } from "@uploadthing/react";
import type { UploadThingRouter } from "../types/upload";

//define api endpoint based on environment
const endpoint =
  process.env.NODE_ENV === "production"
    ? (process.env.REACT_APP_PRODUCTION_ENDPOINT as string)
    : (process.env.REACT_APP_DEVELOPMENT_ENDPOINT as string);

//generate typed upload buttons
export const ResumeUploadButton = generateUploadButton<UploadThingRouter>({
  url: endpoint,
});

export const CoverLetterUploadButton = generateUploadButton<UploadThingRouter>({
  url: endpoint,
});
