//wrapper component for the upload button ui elements
import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { UploadIcon } from "./icons";
import { Text } from "./Text";

interface UploadUIProps {
  label: string;
  isUploading: boolean;
  fileName: string | null;
}

export const UploadUI: React.FC<UploadUIProps> = ({
  label,
  isUploading,
  fileName,
}) => {
  const { theme } = useTheme();

  const getMessage = () => {
    if (isUploading) return "uploading...";
    if (fileName) return `${fileName} (click to replace)`;
    return `upload ${label}`;
  };

  return (
    <div className="flex items-center gap-2">
      <UploadIcon isUploading={isUploading} />
      <Text variant="body" className={theme.colors.text.body}>
        {getMessage()}
      </Text>
    </div>
  );
};
