"use client";

import React, { useContext } from "react";
import { Tooltip } from "react-tooltip";

import PdfViewer from "@/components/pdf/pdf-viewer";
import CloseIcon from "@/components/ui/icons/CloseIcon";
import DownloadIcon from "@/components/ui/icons/DownloadIcon";
import { DocumentsContext } from "@/context/documents-context/document-context";
import Link from "next/link";
import { getDocumentOriginUrl } from "@/utils/documents";

type Tab = {
  text: string;
  id: string;
  onClickClose: () => void;
  onClick: () => void;
};
const tabsLabels = ["First", "Second", "Third"];
function Tabs({ tabs }: { tabs: Tab[] }) {
  return (
    <div className="flex w-full divide-x">
      {tabs.map((tab) => {
        return (
          <button
            key={tab.id}
            onClick={tab.onClick}
            className="flex w-48 p-2 items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  bg-background shadow-sm hover:bg-accent hover:text-accent-foreground  whitespace-pre-wrap"
          >
            {tab.text}
            <button
              onClick={(e) => {
                e.stopPropagation();
                tab.onClickClose();
              }}
            >
              <CloseIcon />
            </button>
          </button>
        );
      })}
    </div>
  );
}

export default function PdfViewLayout() {
  const { selected, items, removeItem, setSelectedDocument } =
    useContext(DocumentsContext);
  console.debug("--->", items);
  return selected ? (
    <div className="flex flex-col justify-between w-full h-full">
      <div className="flex flex-coll w-full min-h-10 border-b border-r">
        <Tabs
          tabs={items.map((d, i) => ({
            text: `${tabsLabels[i]} document`,
            id: d.file_name,
            onClickClose: () => removeItem(d),
            onClick: () => setSelectedDocument(d),
          }))}
        />
        <div className="flex items-center mr-4">
          <Link
            data-tooltip-id={`PdfViewLayout-download`}
            data-tooltip-content="Download"
            target="_blank"
            href={getDocumentOriginUrl(selected.file_name)}
          >
            <DownloadIcon />
          </Link>
          <Tooltip id={`PdfViewLayout-download`} />
        </div>
      </div>
      <div className="flex w-full px-2 mt-2">
        <PdfViewer
          document={{
            ...selected,
            originUrl: getDocumentOriginUrl(selected.file_name),
          }}
        />
      </div>
    </div>
  ) : null;
}
