export type DocumentType = {
  originUrl: string;
  page: number;
  file_name: string;
  display_name: string;
  highlight?: string;
};

export type DocumentListItemType = {
  id: string;
  originUrl: string;
  file_name: string;
  display_name: string;
  type: string;
  size: number;
};