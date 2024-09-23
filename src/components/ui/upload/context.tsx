"use client";

import { useState, createContext, type PropsWithChildren } from "react";
import { Dispatch, SetStateAction } from "react";

export type UploadFile = {
  id: string;
  fileName: string;
  type: string;
  size: number;
  file: File;
};

type UploadContextType = {
  isUploading: boolean;
  items: UploadFile[];
  progress: number;
  setProgress: (p: number) => void;
  setItems: Dispatch<SetStateAction<UploadFile[]>>;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  setAttachmentComment: Dispatch<SetStateAction<Record<string, string>>>;
  attachmentComments: Record<string, string>;
};

const defaultContextValue: UploadContextType = {
  isUploading: false,
  items: [],
  progress: 0,
  setProgress: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setItems: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsUploading: () => {},
  attachmentComments: {},
  setAttachmentComment: () => null,
};

const UploadContext = createContext<UploadContextType>(defaultContextValue);

function UploadProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [attachmentComments, setAttachmentComment] = useState<
    Record<string, string>
  >({});

  return (
    <UploadContext.Provider
      value={{
        isUploading,
        items,
        setItems,
        setIsUploading,
        attachmentComments,
        setAttachmentComment,
        setProgress,
        progress,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export { UploadProvider, UploadContext };
