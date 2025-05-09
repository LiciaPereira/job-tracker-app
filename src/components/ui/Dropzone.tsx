import { generateUploadDropzone } from "@uploadthing/react";
import { genUploader } from "uploadthing/client";
import { useImperativeHandle, useState, forwardRef } from "react";
import { Alert } from "../Alert";

//initialize upload client and dropzone component
export const { uploadFiles } = genUploader();
const UploadDropzone = generateUploadDropzone();

export interface DropzoneRef {
  uploadManually: () => Promise<string | undefined>;
}

interface Props {
  endpoint: "resumeUploader" | "coverLetterUploader";
  onUploadComplete: (url: string) => void;
  label?: string;
  variant?: "default" | "subtle";
}

const InnerDropzone = (
  {
    endpoint,
    onUploadComplete,
    label = "Upload File",
    variant = "default",
  }: Props,
  ref: ForwardedRef<DropzoneRef>
  ) => {
    const [file, setFile] = useState<File | null>(null);
    const [alert, setAlert] = useState<{
      type: "success" | "error";
      message: string;
    } | null>(null);

    const getContainerClasses = () => {
      switch (variant) {
        case "subtle":
          return "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300";
        case "default":
        default:
          return (
            "rounded border-2 border-dashed p-4 mt-2 text-center transition-colors " +
            "bg-white text-gray-700 border-indigo-400 " +
            "dark:bg-gray-800 dark:text-gray-200 dark:border-indigo-600 " +
            "hover:bg-indigo-50 dark:hover:bg-gray-700"
          );
      }
    };

    //expose uploadManually() to parent via ref
    useImperativeHandle(ref, () => ({
    async uploadManually(): Promise<string | undefined> {
        if (!file) return;
        try {
          const res = await uploadFiles(endpoint, { files: [file] });
          const url = res?.[0]?.url;
          if (url) {
            console.log("File uploaded. URL:", url);
            onUploadComplete(url);
            setAlert({
              type: "success",
              message: "File uploaded successfully!",
            });
return url;
          }
        } catch (err: any) {
          setAlert({
            type: "error",
            message: `Upload failed: ${err.message}`,
          });
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
          onChange={(files) => setFile(files?.[0] || null)}
          appearance={{
            container: getContainerClasses(),
            label: "text-sm font-medium",
          }}
          content={{
            label,
          }}
        />
      </div>
    );
};
export const Dropzone = forwardRef(InnerDropzone);
