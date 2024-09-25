"use client";
import React, { useCallback, useContext } from "react";
import { toast } from "sonner";
import axios, { AxiosProgressEvent, AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserSettings from "@/components/user-settings";
import { DocumentsContext } from "@/context/documents-context/document-context";
import { Upload } from "@/components/ui/upload/Upload";
import { DocumentList } from "@/components/pages/documents/sidebar/document-list";
import { UploadList } from "@/components/pages/documents/sidebar/upload-list";
import { UploadContext } from "@/components/ui/upload/context";
import { DocumentListContext } from "@/context/documents-context/document-list-context";
import { DocumentListItemType } from "@/types/document";

interface SidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const router = useRouter();

  const { setSelectedDocument, pushItems } = useContext(DocumentsContext);
  const { pushItem: pushDocumentListItem } = useContext(DocumentListContext);
  const { isUploading, setIsUploading, setProgress, setItems } =
    useContext(UploadContext);

  const onSuccess = useCallback(
    (uploadedFiles: Array<DocumentListItemType>) => {
      const fileNames = uploadedFiles.map((d) => d.display_name).join(",");
      pushItems(uploadedFiles.map((d) => ({ ...d, page: 1 })));
      uploadedFiles.forEach((item) => pushDocumentListItem(item));
      setSelectedDocument({ ...uploadedFiles[0], page: 0 });

      toast.success(`Files: ${fileNames} uploaded successfully`);
    },
    [setSelectedDocument, pushItems, pushDocumentListItem],
  );

  const onUploadProgress = useCallback(
    (progressEvent: AxiosProgressEvent) => {
      const progress = progressEvent.loaded / (progressEvent?.total || 1);
      setProgress(Math.min(progress, 0.98));
    },
    [setProgress],
  );

  const onDrop = useCallback(
    (items) => {
      const files = items.map((item) => item.file);
      if (!files.length) return;

      const formData = new FormData();
      Array.from({ length: files.length }).forEach((_, index: number) => {
        const file = files[index];
        formData.append("files", file, file.name);
      });
      setIsUploading(true);
      axios
        .post("/api/documents", formData, {
          onUploadProgress: onUploadProgress,
        })
        .then(({ data }: AxiosResponse<Array<DocumentListItemType>>) => {
          setProgress(1);
          setTimeout(() => {
            setIsUploading(false);
            onSuccess(data);
            setItems([]);
          }, 200);
        })
        .catch((error) => {
          setIsUploading(false);
          toast.error("Something went wrong.");
          console.error(error);
        });
    },
    [setIsUploading, setItems],
  );

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        <button
          onClick={() => {
            router.push("/documents");
          }}
          variant="ghost"
          className="flex w-full items-center px-2"
        >
          <Image
            src="/logo-apiko.png"
            alt="AI"
            width={128}
            height={64}
            className="dark:invert hidden md:block"
          />
          <Image
            src="/logo-ai.png"
            alt="AI"
            width={48}
            height={48}
            className="hidden md:block"
          />
        </button>
        <div className="hidden md:flex flex-col pt-10 gap-2 ">
          <p className="pl-4 text-lg text-muted-foreground">Knowledge base</p>
          <p className="pl-4 text-xs text-muted-foreground">
            Upload your documents here.
          </p>
          <Upload onDrop={onDrop} disabled={isUploading} />
          <div className="mt-4">
            <div className="flex flex-col">
              <p className="text-md">Documents List</p>
              <div className="flex flex-col min-w-10 max-h-64 overflow-scroll">
                <DocumentList />
                <UploadList />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex justify-end px-2 py-2 w-full border-t">
        <UserSettings />
      </div>
    </div>
  );
}
