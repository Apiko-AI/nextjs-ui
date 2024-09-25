"use client";

import React, { useContext } from "react";
import { Circle } from "rc-progress";

import DocumentIcon from "@/components/ui/icons/DocumentIcon";
import CheckIcon from "@/components/ui/icons/CheckIcon";

import { UploadContext } from "@/components/ui/upload/context";
import type { UploadFile } from "@/components/ui/upload/context";
import { humanFileSize } from "@/lib/utils";

const typeMap: Record<string, string> = {
  "application/pdf": "PDF",
};
function UploadListItem({ item, index }: { item: UploadFile; index: number }) {
  const { progress, items } = useContext(UploadContext);

  const indexProgress = (progress * 100) / (items.length - index || 1);
  const indexTotal = 100 / (items.length / index);
  const itemProgress = Math.round((indexProgress / indexTotal) * 100);

  return (
    <div className="flex w-full justify-between border rounded-md p-2 px-4 mt-2">
      <div className="flex truncate">
        <div className="flex flex-col justify-center items-center">
          <DocumentIcon className="w-4 h-4" />
          <span className="text-xs antialiased mt-1 text-gray-400">
            {typeMap[item.type] || "DOC"}
          </span>
        </div>
        <div className="flex truncate flex-col ml-4">
          <div className="flex truncate">
            <p className="text-md truncate text-ellipsis">{item.fileName}</p>
          </div>
          <div className="flex truncate">
            <p className="text-xs antialiased text-gray-400 truncate text-ellipsis">
              {humanFileSize(item.size)} -{" "}
              {itemProgress < 100 ? `${itemProgress} %` : ""} uploaded
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {itemProgress < 100 ? (
          <Circle className="w-4 h-4" percent={itemProgress} strokeWidth={6} />
        ) : (
          <CheckIcon className="w-4 h-4 text-green-500" />
        )}
      </div>
    </div>
  );
}
function UploadList() {
  const { items } = useContext(UploadContext);

  return (
    <>
      {items.map((item, index) => (
        <UploadListItem key={item.id} item={item} index={index + 1} />
      ))}
    </>
  );
}

export { UploadList };
