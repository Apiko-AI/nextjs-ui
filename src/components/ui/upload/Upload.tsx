"use client";

import React, { useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { UploadContext, UploadFile } from "@/components/ui/upload/context";
import UploadIcon from "@/components/ui/icons/UploadIcon";

function Upload({
  onDrop,
  disabled = false,
}: {
  onDrop: (items: Array<UploadFile>) => void;
  disabled?: boolean;
}) {
  const { setItems } = useContext(UploadContext);

  const onDropSpy = useCallback(
    (acceptedFiles: File[]) => {
      const newItems = acceptedFiles.map((file) => ({
        id: uuidv4(),
        fileName: file.name,
        size: file.size,
        type: file.type,
        file: file,
      }));
      setItems(newItems);
      if (onDrop) {
        onDrop(newItems);
      }
    },
    [setItems],
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropSpy,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col border-md border rounded-md p-6 px-4 mt-2 cursor-pointer"
    >
      <div className="flex justify-center items-center">
        <UploadIcon className="h-8 w-8" />
      </div>
      <div className="flex flex-col justify-center items-center mt-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Drop your file here or, <span className="text-blue-700">browse</span>
          <span>
            <input {...getInputProps()} />
          </span>
        </p>
        <p
          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          id="file_input_help"
        >
          Limit 200MB per file • PDF, DOCX
        </p>
      </div>
    </div>
  );
}

export { Upload };
