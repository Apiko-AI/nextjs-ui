"use client";

import React from "react";

import PdfViewer from "@/components/pdf/pdf-viewer";
import CloseIcon from "@/components/ui/icons/CloseIcon";

// todo: move tabs to ui
const tabsLabels = ["First", "Second", "Third"];
type Tab = {
  text: string;
  id: string;
};
function Tabs({ tabs }: { tabs: Tab[] }) {
  return (
    <div className="flex w-full divide-x">
      {tabs.map((tab) => {
        return (
          <button
            key={tab.id}
            className="flex w-48 p-2 items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  bg-background shadow-sm hover:bg-accent hover:text-accent-foreground  whitespace-pre-wrap"
          >
            {tab.text}
            <CloseIcon />
          </button>
        );
      })}
    </div>
  );
}

// todo: add pages context
export default function PdfViewLayout() {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div className="flex flex-coll w-full min-h-10 border-b border-r">
        <Tabs
          tabs={tabsLabels.map((label, i) => ({
            text: `${label} document`,
            id: i.toString(),
          }))}
        />
      </div>
      <div className="flex w-full px-2 mt-2">
        <PdfViewer
          fileName={"test.pdf"}
          originUrl="http://localhost:3000/api/documents/preview/d5dcd54c-b1ce-4bea-b715-5a03f0c05d64_Generative%20AI.pdf"
          page={4}
          highlight="1.1.1.1. Narrow AI (Weak AI)"
        />
      </div>
    </div>
  );
}
