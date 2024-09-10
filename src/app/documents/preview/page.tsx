"use client";

import React from "react";
import { pdfjs } from "react-pdf";
import { useSearchParams } from "next/navigation";
import PdfViewer from "@/components/pdf/pdf-viewer";
import { Button } from "@/components/ui/button";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function Preview() {
  const searchParams = useSearchParams();
  const originUrl = searchParams.get("originUrl");
  const page = parseInt(searchParams.get("page") || "1");
  const fileName = searchParams.get("fileName");
  const highlight = searchParams.get("highlight") || "";

  if (!originUrl) {
    return null;
  }
  return (
    <main className="flex flex-col items-center">
      <div className="flex w-full flex-row justify-between mt-1">
        <div className="flex">
          <p className="text-sm">{fileName}</p>
        </div>
        <div className="flex">
          <Button className="h-6 px-2 rounded">
            <Link target="_blank" href={originUrl} />
            Download
          </Button>
        </div>
      </div>
      <PdfViewer originUrl={originUrl} page={page || 1} highlight={highlight} />
    </main>
  );
}
