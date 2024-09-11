"use client";

import React, { useContext, useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/pages/documents/sidebar";
import Chat from "@/components/chat/chat";
import PdfViewLayout from "@/components/pages/documents/pdf-view-layout";
import { useChat } from "@/app/hooks/useChat";
import { DocumentsContext } from "@/context/documents-context/document-context";
import { ChatMessageDocumentData } from "@/components/pages/documents/chat-message-document-data";

import type { ChatRequestOptions } from "ai";

interface DocumentsChatLayoutProps {
  defaultLayout: number[];
  isMobile: boolean;
}

export function DocumentsChatLayout({
  defaultLayout,
  isMobile,
}: DocumentsChatLayoutProps) {
  const { selected } = useContext(DocumentsContext);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [chatId, setChatId] = React.useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
    setInput,
  } = useChat({
    api: "api/documents/chat",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessages([...messages]);

    // Prepare the options object with additional body data, to pass the model.
    const requestOptions: ChatRequestOptions = {
      options: {
        body: {
          chatId,
        },
      },
    };

    // Call the handleSubmit function with the options
    handleSubmit(e, requestOptions);
  };

  useEffect(() => {
    if (messages.length < 1) {
      setChatId(uuidv4());
    }
  }, [messages]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes,
        )}`;
      }}
      className="h-screen items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={10}
        collapsible={true}
        minSize={isMobile ? 0 : 12}
        maxSize={isMobile ? 0 : 16}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true,
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false,
          )}`;
        }}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          messages={messages}
          isMobile={isMobile}
          chatId={chatId}
          setMessages={setMessages}
        />
      </ResizablePanel>
      <ResizableHandle className={cn("hidden md:flex")} withHandle />
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        collapsible={false}
        minSize={isMobile ? 0 : 50}
        maxSize={isMobile ? 0 : 100}
        className={cn(
          "h-full flex justify-center",
          selected
            ? "w-full transition-all duration-300 ease-in-out"
            : "hidden",
        )}
      >
        <PdfViewLayout />
      </ResizablePanel>
      {selected && <ResizableHandle withHandle={Boolean(selected)} />}
      <ResizablePanel
        className="h-full w-full flex flex-col"
        defaultSize={defaultLayout[2]}
        collapsible={false}
        minSize={20}
      >
        <div className="flex flex-coll w-full min-h-10 border-b items-center">
          <p className="text-md ml-2">Chat</p>
        </div>
        <div className="flex w-full h-full px-2 mt-2 justify-center">
          <Chat
            chatId={chatId}
            messages={messages}
            messageDataRender={ChatMessageDocumentData}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={onSubmit}
            isLoading={isLoading}
            loadingSubmit={isLoading}
            error={error}
            stop={stop}
            formRef={formRef}
            isMobile={isMobile}
            setInput={setInput}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
