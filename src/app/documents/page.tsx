import React from "react";
import { DocumentsPageLayout } from "@/components/pages/documents/documents-page-layout";

export default function Home() {
  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <DocumentsPageLayout />
    </main>
  );
}
