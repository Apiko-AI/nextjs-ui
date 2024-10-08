import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import CodeDisplayBlock from "../code-display-block";

import type { Message } from "@/types/message";

export default function ChatMessage({
  message,
  userName,
  index,
  countOfMessages,
  isLoading,
  messageDataRender,
}: {
  message: Message;
  userName: string;
  index: number;
  countOfMessages: number;
  isLoading: boolean;
  messageDataRender?: (message: Message) => React.JSX.Element | null;
}) {
  const data = message.data;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
          duration: index * 0.05 + 0.2,
        },
      }}
      className={cn(
        "flex flex-col gap-2 p-4 whitespace-pre-wrap",
        message.role === "user" ? "items-end" : "items-start",
      )}
    >
      <div className="flex gap-3 items-center">
        {message.role === "user" && (
          <div className="flex items-end gap-3">
            <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
              {message.content}
            </span>
            <Avatar className="flex justify-start items-center overflow-hidden">
              <AvatarImage
                src="/"
                alt="user"
                width={6}
                height={6}
                className="object-contain"
              />
              <AvatarFallback>
                {userName && userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        {message.role === "assistant" && (
          <div className="flex items-end gap-2">
            <Avatar className="flex justify-start items-center">
              <AvatarImage
                src="/apiko.svg"
                alt="AI"
                width={6}
                height={6}
                className="object-contain dark:invert"
              />
            </Avatar>
            <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
              {/* Check if the message content contains a code block */}
              {message.content.split("```").map((part, index) => {
                if (index % 2 === 0) {
                  return (
                    <Markdown
                      key={index}
                      remarkPlugins={[remarkGfm]}
                      components={{ p: "span" }}
                    >
                      {part}
                    </Markdown>
                  );
                } else {
                  return (
                    <pre className="whitespace-pre-wrap" key={index}>
                      <CodeDisplayBlock code={part} lang="" />
                    </pre>
                  );
                }
              })}
              {data && messageDataRender ? messageDataRender(message) : null}
              {isLoading && index === countOfMessages - 1 && (
                <span className="animate-pulse" aria-label="Typing">
                  ...
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
