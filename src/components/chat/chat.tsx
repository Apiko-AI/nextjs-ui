import React from "react";
import { ChatRequestOptions } from "ai";
import ChatTopbar from "./chat-topbar";
import ChatList from "./chat-list";
import ChatBottombar from "./chat-bottombar";
import type { Message } from "@/types/message";

export interface ChatProps {
  chatId?: string;
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  isLoading: boolean;
  loadingSubmit?: boolean;
  error: undefined | Error;
  stop: () => void;
  formRef: React.RefObject<HTMLFormElement>;
  isMobile?: boolean;
  setInput?: React.Dispatch<React.SetStateAction<string>>;
  messageDataRender?: (message: Message) => React.JSX.Element | null;
}

export default function Chat({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  chatId,
  loadingSubmit,
  formRef,
  isMobile,
  setInput,
  messageDataRender,
}: ChatProps) {
  return (
    <div className="flex flex-col justify-between w-full max-w-3xl h-full">
      <ChatList
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        stop={stop}
        formRef={formRef}
        isMobile={isMobile}
        messageDataRender={messageDataRender}
      />

      <ChatBottombar
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        stop={stop}
        formRef={formRef}
        setInput={setInput}
      />
    </div>
  );
}
