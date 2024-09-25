import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ChatMessage from "@/components/chat/chat-message";

import type { Message } from "@/types/message";

export default function ChatList({
  messages,
  isLoading,
  loadingSubmit,
  messageDataRender,
}: {
  messages: Message[];
  isLoading: boolean;
  loadingSubmit: boolean;
  messageDataRender?: (message: Message) => React.JSX.Element | null;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [name, setName] = React.useState<string>("");
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const username = localStorage.getItem("user_name");
    if (username) {
      setName(username);
    }
  }, []);

  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="relative flex flex-col gap-4 items-center justify-center w-full">
          <div></div>
          <div className="flex flex-col gap-4 items-center">
            <Image
              src="/apiko.svg"
              alt="AI"
              width={60}
              height={60}
              className="h-20 w-14 object-contain dark:invert"
            />
            <p className="text-center text-lg text-muted-foreground">
              How can I help you today?
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="scroller"
      className="w-full overflow-y-scroll overflow-x-hidden h-full justify-end"
    >
      <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            countOfMessages={messages.length}
            index={index}
            userName={name}
            isLoading={isLoading}
            messageDataRender={messageDataRender}
          />
        ))}
        {loadingSubmit && (
          <div className="flex pl-4 pb-4 gap-2 items-center">
            <Avatar className="flex justify-start items-center">
              <AvatarImage
                src="/apiko.svg"
                alt="AI"
                width={6}
                height={6}
                className="object-contain dark:invert"
              />
            </Avatar>
            <div className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
