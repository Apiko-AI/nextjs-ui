"use client";

import React from "react";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { Pagination } from "react-headless-pagination";

export default function PdfViewer({
  originUrl,
  page,
}: {
  originUrl: string;
  page?: number;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>((page || 1) - 1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  console.debug("--currentPage->", currentPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Document file={originUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={currentPage + 1} />
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
