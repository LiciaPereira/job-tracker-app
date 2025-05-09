//type definitions for upload functionality
import type { FileRouter as UTFileRouter } from "uploadthing/next";

export interface UploadRouter extends UTFileRouter {
  [key: string]: {
    data: { userId: string };
    file: {
      maxFileSize: "4MB";
      accept: "application/pdf";
    };
    $types: any;
    routerConfig: any;
    routeOptions: any;
    inputParser: any;
    middleware: any;
    onUploadError: any;
    errorFormatter: any;
    onUploadComplete: any;
  };
}
