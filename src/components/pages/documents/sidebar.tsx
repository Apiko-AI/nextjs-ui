"use client";
import React, { useCallback, useContext } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserSettings from "@/components/user-settings";
import { DocumentsContext } from "@/context/documents-context/document-context";
import type { DocumentType } from "@/types/document";
import { Upload } from "@/components/ui/upload/Upload";
import { UploadList } from "@/components/ui/upload/UploadList";
import { UploadProvider } from "@/components/ui/upload/context";
import { ProgressButton } from "@/components/ui/upload/ProgressButton";

interface SidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
}

export function Sidebar({ isCollapsed, isMobile }: SidebarProps) {
  const router = useRouter();

  const { setSelectedDocument, pushItems } = useContext(DocumentsContext);

  const onSuccess = useCallback(
    (uploadedFiles: Array<DocumentType>) => {
      const fileNames = uploadedFiles.map((d) => d.display_name).join(",");
      toast.success(`Files: ${fileNames} uploaded successfully`);

      pushItems(uploadedFiles.map((d) => ({ ...d, page: 1 })));
      setSelectedDocument(uploadedFiles[0]);
    },
    [setSelectedDocument, pushItems],
  );

  const onError = useCallback((error: Error) => {
    toast.error("Something went wrong.");
    console.error(error);
  }, []);

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
          <UploadProvider>
            <Upload />
            <div className="mt-4">
              <UploadList />
            </div>

            <ProgressButton
              api="/api/documents/upload"
              onError={onError}
              onSuccess={onSuccess}
            />
          </UploadProvider>
        </div>
      </div>

      <div className="justify-end px-2 py-2 w-full border-t">
        <UserSettings />
      </div>
    </div>
  );
}
