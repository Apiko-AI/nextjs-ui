"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useCallback, useContext } from "react";
import UserSettings from "@/components/user-settings";
import Spinner from "@/components/ui/spinner";
import { DocumentsContext } from "@/context/documents-context/document-context";
import type { DocumentType } from "@/types/document";

interface SidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
}

export function Sidebar({ isCollapsed, isMobile }: SidebarProps) {
  const router = useRouter();
  const fileInputRef = useRef<{ files: File[] }>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setSelectedDocument, pushItems } = useContext(DocumentsContext);

  const onProgress = useCallback(
    (e) => {
      e.preventDefault();
      if (!fileInputRef.current) return;
      const { files } = fileInputRef.current;
      if (!files.length) return;

      const formData = new FormData();
      Array.from({ length: files.length }).forEach((_, index: number) => {
        const file = files[index];
        formData.append("files", file, file.name);
      });
      setIsUploading(true);
      fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((uploadedFiles: Array<DocumentType>) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          fileInputRef.current.value = null;
          const fileNames = uploadedFiles.map((d) => d.display_name).join(",");
          toast.success(`Files: ${fileNames} uploaded successfully`);
          setIsUploading(false);

          pushItems(uploadedFiles.map((d) => ({ ...d, page: 1 })));
          setSelectedDocument(uploadedFiles[0]);
        })
        .catch((error) => {
          toast.error("Something went wrong.");
          setIsUploading(false);
          console.error(error);
        });
    },
    [setIsUploading],
  );

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        <Button
          onClick={() => {
            router.push("/documents");
          }}
          variant="ghost"
          className="flex justify-start w-full h-14 text-sm xl:text-lg font-normal items-center"
        >
          <div className="flex w-full">
            {!isMobile && (
              <Image
                src="/apiko.svg"
                alt="AI"
                width={28}
                height={28}
                className="dark:invert hidden 2xl:block"
              />
            )}
            Apiko AI
          </div>
        </Button>
        <div className="flex flex-col pt-10 gap-2">
          <p className="pl-4 text-lg text-muted-foreground">Knowledge base</p>
          <p className="pl-4 text-xs text-muted-foreground">
            Upload your documents here and click on Process button.
          </p>

          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            ref={fileInputRef}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            multiple
          />
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            Limit 200MB per file • PDF, DOCX
          </p>
          <Button disabled={isUploading} onClick={onProgress}>
            Progress
            {isUploading && <Spinner className="ml-2" />}
          </Button>
        </div>
      </div>

      <div className="justify-end px-2 py-2 w-full border-t">
        <UserSettings />
      </div>
    </div>
  );
}
