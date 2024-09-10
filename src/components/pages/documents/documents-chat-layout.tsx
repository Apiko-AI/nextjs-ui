"use client";

import React, { useEffect, useRef } from "react";
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
import { ChatRequestOptions } from "ai";

interface DocumentsChatLayoutProps {
  defaultLayout: number[];
  isMobile: boolean;
}

export function DocumentsChatLayout({
  defaultLayout,
  isMobile,
}: DocumentsChatLayoutProps) {
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
        className={cn(
          isCollapsed
            ? "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
            : "hidden md:block",
        )}
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
        className="h-full w-full flex justify-center"
        defaultSize={defaultLayout[1]}
      >
        <PdfViewLayout />
      </ResizablePanel>
      <ResizablePanel
        className="h-full w-full flex justify-center"
        defaultSize={defaultLayout[2]}
      >
        <Chat
          chatId={chatId}
          messages={messages}
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
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
