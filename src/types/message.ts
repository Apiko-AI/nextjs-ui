export type DocumentMessageData = {
  originUrl: string;
  page: number;
  file_name: string;
};

export type Message = {
  id: string;
  tool_call_id?: string;
  createdAt?: Date;
  content: string;
  ui?: string | JSX.Element | JSX.Element[] | null | undefined;
  role: "system" | "user" | "assistant" | "function" | "data" | "tool";
  /**
   * If the message has a role of `function`, the `name` field is the name of the function.
   * Otherwise, the name field should not be set.
   */
  name?: string;
  data?: never;
};
