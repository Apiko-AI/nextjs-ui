import React, { useCallback, useContext } from "react";
import type { Message } from "@/types/message";
import { DocumentsContext } from "@/context/documents-context/document-context";

export function ChatMessageDocumentData({ data }: Message) {
  const { setSelectedDocument, pushItem } = useContext(DocumentsContext);

  const onPress = useCallback(() => {
    if (data) {
      setSelectedDocument(data);
      pushItem(data);
    }
  }, [setSelectedDocument, data]);

  return data ? (
    <button
      onClick={onPress}
      className="inline-flex items-center rounded-lg bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
    >
      {data.page}
    </button>
  ) : null;
}
