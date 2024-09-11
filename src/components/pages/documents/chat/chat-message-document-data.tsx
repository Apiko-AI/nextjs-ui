import React, { useCallback, useContext } from "react";
import { Tooltip } from "react-tooltip";
import { DocumentsContext } from "@/context/documents-context/document-context";

import type { Message } from "@/types/message";

export function ChatMessageDocumentData({ data, id }: Message) {
  const { setSelectedDocument, pushItem } = useContext(DocumentsContext);

  const onPress = useCallback(() => {
    if (data) {
      setSelectedDocument(data);
      pushItem(data);
    }
  }, [setSelectedDocument, data]);

  return data ? (
    <>
      <button
        data-tooltip-id={`message-${id}`}
        data-tooltip-content={`Read more on page ${data.page}`}
        onClick={onPress}
        className="inline-flex items-center rounded-lg bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
      >
        {data.page}
      </button>
      <Tooltip id={`message-${id}`} />
    </>
  ) : null;
}
