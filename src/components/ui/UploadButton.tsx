import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../../../server/uploadthing"; // adjust path as needed
import { useState } from "react";
import { Alert } from "../Alert";

const RawUploadButton = generateUploadButton();

interface Props {
  endpoint: keyof OurFileRouter;
  onUploadComplete: (url: string) => void;
  label?: string;
}

export function UploadButton({
  endpoint,
  onUploadComplete,
  label = "Upload File",
}: Props) {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <RawUploadButton
        endpoint={endpoint}
        appearance={{
          button:
            "bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition",
          container: "mt-2",
          allowedContent: "text-sm text-gray-500",
        }}
        content={{
          button({ isUploading }) {
            return isUploading ? "Uploading..." : label;
          },
        }}
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            onUploadComplete(res[0].url);
          }
        }}
        onUploadError={(err: Error) => {
          setAlert({ type: "error", message: `Upload failed: ${err.message}` });
        }}
      />
    </>
  );
}
