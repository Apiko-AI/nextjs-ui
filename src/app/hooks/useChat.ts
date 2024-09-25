import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Message } from "@/types/message";
import type { ChatRequestOptions } from "ai";

export const useChat = ({ api }: { api: string }) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const handleInputChange = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const value = e.currentTarget?.value || "";
      setInput(value);
    },
    [setInput],
  );

  const handleSubmit = useCallback(
    (
      e: React.FormEvent<HTMLFormElement>,
      requestOptions: ChatRequestOptions,
    ) => {
      setIsLoading(true);
      const newMessages = [
        ...messages,
        {
          id: uuidv4(),
          createdAt: new Date(),
          content: input,
          role: "user",
        },
      ];
      setMessages(newMessages);

      fetch(api, {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          messages: newMessages,
          ...(requestOptions.options?.body || {}),
        }),
      })
        .then((res) => res.json())
        .then((messageData) => {
          setMessages((_messages) => [
            ..._messages,
            {
              id: uuidv4(),
              createdAt: new Date(),
              content: messageData.content,
              role: "assistant",
              data: messageData.data,
            },
          ]);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setError(error);
        });
    },
    [setIsLoading, input, messages],
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    // todo: implement stop
    stop: () => {},
    setMessages,
    setInput,
  };
};
