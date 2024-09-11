"use client";

import React, { useCallback, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { Document, Page } from "react-pdf";
import MinusIcon from "@/components/ui/icons/MinusIcon";
import ResetIcon from "@/components/ui/icons/ResetIcon";
import PlusIcon from "@/components/ui/icons/PlusIcon";
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/components/ui/icons/ArrowRightIcon";
function highlightPattern(text: string, pattern: string) {
  console.debug('--pattern->', pattern)
  if (text && pattern.includes(text)) {
    return `<mark>${text}</mark>`;
  }
  return text;
}

export default function PdfViewer({
  fileName,
  originUrl,
  page,
  highlight,
}: {
  fileName: string;
  originUrl: string;
  page?: number;
  highlight?: string;
}) {
  const pageRefs = useRef<HTMLCanvasElement[]>([]);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const documentHeaderRef = useRef<HTMLDivElement>(null);
  const [isDocumentLoad, setIsDocumentLoad] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>((page || 1) - 1);
  const [scale, setScale] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setTimeout(() => setIsDocumentLoad(true), 10);
  }

  const textRenderer = useCallback(
    ({ str }: { str: string }) => {
      return highlightPattern(str, highlight || "");
    },
    [highlight],
  );
  const increaseScale = useCallback(
    () => setScale((old) => Math.min(old + old * 0.1, 3)),
    [setScale],
  );
  const resetScale = useCallback(() => setScale(1), [setScale]);
  const decreaseScale = useCallback(
    () => setScale((old) => Math.max(old - old * 0.1, 0.5)),
    [setScale],
  );

  const moveToPage = useCallback((pageNumber: number) => {
    const pageRef = pageRefs.current[pageNumber];
    const container = pageContainerRef.current?.firstChild as HTMLDivElement;
    if (pageRef && container) {
      const offset = (documentHeaderRef?.current?.clientHeight ?? 0) * -1;
      const y =
        pageRef.getBoundingClientRect().top + container.scrollTop + offset;
      container.scrollTo({ top: y });
    }
  }, []);

  const movePageLeft = useCallback(
    () => moveToPage(Math.max(currentPage - 1, 0)),
    [currentPage, moveToPage],
  );

  const movePageRight = useCallback(
    () => moveToPage(Math.min(currentPage + 1, numPages)),
    [moveToPage, currentPage, numPages],
  );

  const onScroll = useCallback(
    (e) => {
      if (pageRefs.current) {
        const current = pageRefs.current
          .map(
            (elementRef) =>
              elementRef.getBoundingClientRect().bottom <=
              e.target.clientHeight - elementRef.clientHeight / 2,
          )
          .filter(Boolean).length;
        setCurrentPage(current);
      }
    },
    [isDocumentLoad, setCurrentPage],
  );

  useLayoutEffect(() => {
    if (isDocumentLoad && page) {
      moveToPage(page - 1);
    }
  }, [numPages, page, isDocumentLoad, moveToPage]);

  return (
    <div className="flex w-full flex-col">
      <div
        ref={documentHeaderRef}
        className="flex w-full flex-row justify-between"
      >
        <div className="flex">
          <p className="text-sm">{fileName}</p>
        </div>
        <div className="flex">
          <div className="flex items-center justify-between w-20 mr-4">
            <button
              onClick={decreaseScale}
              data-tooltip-id="pdf-viewer-toolbar-zoom-out"
              data-tooltip-content="Zoom Out"
            >
              <MinusIcon />
            </button>
            <button
              onClick={resetScale}
              data-tooltip-id="pdf-viewer-toolbar-zoom-reset"
              data-tooltip-content="Reset Zoom"
            >
              <ResetIcon />
            </button>
            <button
              onClick={increaseScale}
              data-tooltip-id="pdf-viewer-toolbar-zoom-in"
              data-tooltip-content="Zoom In"
            >
              <PlusIcon />
            </button>
          </div>
          <div className="flex items-center justify-between w-24">
            <button
              onClick={movePageLeft}
              data-tooltip-id="pdf-viewer-toolbar-prev-page"
              data-tooltip-content="Previois Page"
            >
              <ArrowLeftIcon />
            </button>
            <p>
              {currentPage + 1} / {numPages}
            </p>
            <button
              onClick={movePageRight}
              data-tooltip-id="pdf-viewer-toolbar-next-page"
              data-tooltip-content="Next Page"
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={pageContainerRef}
        className="flex w-full mt-2 h-screen  justify-center"
      >
        <Document
          className="overflow-scroll"
          file={originUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onScroll={onScroll}
        >
          {Array.from({ length: numPages }).map((_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              canvasRef={(el) => {
                if (el) {
                  pageRefs.current[index] = el;
                }
              }}
              customTextRenderer={index + 1 === parseInt(page) ? textRenderer : undefined}
              scale={scale}
            />
          ))}
        </Document>
      </div>
      <Tooltip id={`pdf-viewer-toolbar-zoom-in`} />
      <Tooltip id={`pdf-viewer-toolbar-zoom-reset`} />
      <Tooltip id={`pdf-viewer-toolbar-zoom-out`} />
      <Tooltip id={`pdf-viewer-toolbar-prev-page`} />
      <Tooltip id={`pdf-viewer-toolbar-next-page`} />
    </div>
  );
}
