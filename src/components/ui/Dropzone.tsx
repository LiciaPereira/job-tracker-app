import { generateUploadDropzone } from "@uploadthing/react";
import { genUploader } from "uploadthing/client";
import { useImperativeHandle, useState, forwardRef, ForwardedRef } from "react";
import { Alert } from "../Alert";

//initialize upload client and dropzone component
export const { uploadFiles } = genUploader();
const UploadDropzone = generateUploadDropzone();

export interface DropzoneRef {
  uploadManually: () => Promise<string | undefined>;
}

interface Props {
  endpoint: "resumeUploader" | "coverLetterUploader";
  onUploadComplete: (url: string, name: string) => void;
  label?: string;
  variant?: "default" | "subtle";
  onFileSelected?: () => void;
}

const InnerDropzone = (
  {
    endpoint,
    onUploadComplete,
    label = "Upload File",
    variant = "default",
    onFileSelected,
  }: Props,
  ref: ForwardedRef<DropzoneRef>
) => {
  const [file, setFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const getContainerClasses = () => {
    return variant === "subtle"
      ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
      : "rounded border-2 border-dashed p-4 mt-2 text-center transition-colors bg-white text-gray-700 border-indigo-400 dark:bg-gray-800 dark:text-gray-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700";
  };

  useImperativeHandle(ref, () => ({
    async uploadManually(): Promise<string | undefined> {
      if (!file) {
        console.log("No file selected");
        return;
      }

      try {
        const res = await uploadFiles(endpoint, { files: [file] });
        const uploaded = res?.[0];
        if (uploaded?.url && uploaded?.name) {
          onUploadComplete(uploaded.url, uploaded.name);
          setAlert({ type: "success", message: "File uploaded successfully!" });
          return uploaded.url;
        }
      } catch (err: any) {
        console.error("upload failed:", err);
        setAlert({ type: "error", message: `Upload failed: ${err.message}` });
      }
    },
  }));

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <UploadDropzone
        endpoint={endpoint}
        config={{ mode: "manual" }}
        onChange={(file) => {
          const selected = file?.[0] || null;
          setFile(selected);
          if (selected && onFileSelected) onFileSelected();
        }}
        appearance={{
          container: getContainerClasses(),
          label: "text-sm font-medium",
        }}
        content={{ label }}
      />
    </div>
  );
};

export const Dropzone = forwardRef(InnerDropzone);
