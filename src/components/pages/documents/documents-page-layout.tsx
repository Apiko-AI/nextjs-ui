"use client";
import { pdfjs } from "react-pdf";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ChatLayout } from "@/components/pages/documents/chat/chat-layout";
import { DocumentsProvider } from "@/context/documents-context/document-context";
import { DocumentListProvider } from "@/context/documents-context/document-list-context";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";

import UsernameForm from "@/components/username-form";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "react-tooltip/dist/react-tooltip.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function DocumentsPageLayout() {
  const [open, setOpen] = React.useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [, setCookie] = useCookies(["user_id"]);

  useEffect(() => {
    if (!localStorage.getItem("user_name")) {
      setOpen(true);
    }
    if (!localStorage.getItem("user_id")) {
      const userId = uuidv4();
      localStorage.setItem("user_id", userId);
      setCookie("user_id", userId);
    }
  }, []);

  const onOpenChange = (isOpen: boolean) => {
    const username = localStorage.getItem("user_name");
    if (username) return setOpen(isOpen);

    localStorage.setItem("user_name", "Anonymous");
    window.dispatchEvent(new Event("storage"));
    setOpen(isOpen);
  };

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 1023);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <DocumentListProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DocumentsProvider>
          <ChatLayout isMobile={isMobile} defaultLayout={[30, 0, 60]} />
        </DocumentsProvider>

        <DialogContent className="flex flex-col space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Welcome to Apiko AI!</DialogTitle>
            <DialogDescription>
              Enter your name to get started. This is just to personalize your
              experience.
            </DialogDescription>
            <UsernameForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DocumentListProvider>
  );
}
