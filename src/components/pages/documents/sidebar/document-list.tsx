"use client";

import React, { useCallback, useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import DocumentIcon from "@/components/ui/icons/DocumentIcon";
import TrashIcon from "@/components/ui/icons/TrashIcon";
import Spinner from "@/components/ui/spinner";
import { DocumentListContext } from "@/context/documents-context/document-list-context";
import type { DocumentListItemType } from "@/types/document";
import { humanFileSize } from "@/lib/utils";
import { DocumentsContext } from "@/context/documents-context/document-context";
import { getDocumentOriginUrl } from "@/utils/documents";
import { Skeleton } from "@/components/ui/skeleton";

const typeMap: Record<string, string> = {
  ".pdf": "PDF",
};
function UploadListItem({ item }: { item: DocumentListItemType }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedDocument, pushItem, removeItem } =
    useContext(DocumentsContext);
  const { removeItem: removeItemFromList } = useContext(DocumentListContext);
  const { display_name, file_name } = item;

  const onPress = useCallback(() => {
    const document = {
      display_name,
      file_name,
      originUrl: getDocumentOriginUrl(file_name),
      page: 0,
    };
    setSelectedDocument(document);
    pushItem(document);
  }, [setSelectedDocument]);

  const onRemove = useCallback(
    (e) => {
      e.stopPropagation();
      const document = {
        display_name,
        file_name,
        originUrl: getDocumentOriginUrl(file_name),
        page: 0,
      };
      setIsLoading(true);
      axios
        .delete(`/api/documents/${document.file_name}`)
        .then(({ data }: { data: string }) => {
          setIsLoading(false);
          // remove from UI
          removeItem(document);
          removeItemFromList(item);
          toast.error(`Document ${data} was removed successfully.`);
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error("Something went wrong.");
          console.error(error);
        });
    },
    [removeItem, removeItemFromList, item],
  );

  return (
    <button
      onClick={onPress}
      className="flex w-full justify-between items-center  border rounded-md p-2 px-4 mt-2"
    >
      <div className="flex truncate">
        <div className="flex flex-col justify-center items-center">
          <DocumentIcon className="w-4 h-4" />
          <span className="text-xs antialiased mt-1 text-gray-400">
            {typeMap[item.type] || "DOC"}
          </span>
        </div>
        <div className="flex truncate flex-col ml-4">
          <div className="flex truncate">
            <p className="text-md truncate text-ellipsis">
              {item.display_name}
            </p>
          </div>
          <div className="flex truncate">
            <p className="text-xs antialiased text-gray-400 truncate text-ellipsis">
              {humanFileSize(item.size)} - uploaded
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button onClick={onRemove}>
          {!isLoading ? (
            <TrashIcon className="w-4 h-4 text-red-400" />
          ) : (
            <Spinner />
          )}
        </button>
      </div>
    </button>
  );
}

export default function DocumentListSkeleton() {
  return (
    <div className="flex h-16 w-full justify-between items-center border rounded-md p-2 px-4 mt-2">
      <div className="flex w-full">
        <div className="flex flex-col justify-center items-center">
          <Skeleton className="w-6 h-6" />
        </div>
        <div className="flex w-full flex-col ml-4">
          <div className="flex">
            <Skeleton className="h-2 w-full rounded-sm" />
          </div>
          <div className="flex mt-2">
            <Skeleton className="h-1 w-1/2 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
function DocumentList() {
  const { isLoading, items } = useContext(DocumentListContext);

  if (isLoading) {
    return (
      <>
        <DocumentListSkeleton />
        <DocumentListSkeleton />
        <DocumentListSkeleton />
      </>
    );
  }
  return (
    <>
      {items.map((item) => (
        <UploadListItem key={item.id} item={item} />
      ))}
    </>
  );
}

export { DocumentList };
