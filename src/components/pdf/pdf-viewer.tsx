"use client";

import React, { useCallback } from "react";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { Pagination } from "react-headless-pagination";

function highlightPattern(text: string, pattern: string) {
  if (text && pattern.includes(text)) {
    return `<mark>${text}</mark>`;
  }
  return text;
}
export default function PdfViewer({
  originUrl,
  page,
  highlight,
}: {
  originUrl: string;
  page?: number;
  highlight?: string;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>((page || 1) - 1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const textRenderer = useCallback(
    ({ str }: { str: string }) => {
      return highlightPattern(str, highlight || "");
    },
    [highlight],
  );

  return (
    <div>
      <Document file={originUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={currentPage + 1} customTextRenderer={textRenderer} />
      </Document>
      <Pagination
        totalPages={numPages}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        className="flex"
        edgePageCount={2}
        middlePagesSiblingCount={2}
        truncableText="..."
        truncableClassName=""
      >
        <Pagination.PrevButton className="">Previous</Pagination.PrevButton>

        <nav className="flex justify-center flex-grow mt-4">
          <ul className="flex items-center">
            <Pagination.PageButton
              activeClassName="border-solid border-2 border-sky-500"
              inactiveClassName=""
              className="px-2 py-1"
            />
          </ul>
        </nav>

        <Pagination.NextButton className="">Next</Pagination.NextButton>
      </Pagination>
    </div>
  );
}
