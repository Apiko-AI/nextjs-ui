import { createContext, type FC, useCallback, useState } from "react";
import type { PropsWithChildren } from "react";

import type { DocumentType } from "@/types/document";

interface IDocumentsContextValue {
  items: Array<DocumentType>;
  selected: DocumentType | null;
  setSelectedDocument: (document: DocumentType) => void;
  pushItem: (document: DocumentType) => void;
  removeItem: (document: DocumentType) => void;
}
interface IDocumentsProviderProps extends PropsWithChildren {}

// todo: remove mocDocument
const mocDocument = {
  file_name: "d5dcd54c-b1ce-4bea-b715-5a03f0c05d64_Generative AI.pdf",
  highlight:
    " 1.1.1.1. Narrow AI (Weak AI) is a type of artificial intelligence (AI) that is designed and trained for a specific task or range of tasks.",
  originUrl:
    "http://localhost:8000/documents/download/d5dcd54c-b1ce-4bea-b715-5a03f0c05d64_Generative AI.pdf",
  page: 4,
};
const defaultContextValue = {
  items: [],
  selected: null,
  setSelectedDocument: () => {},
  pushItem: () => {},
  removeItem: () => {},
};
const MAX_COUNT = 3;
const DocumentsContext =
  createContext<IDocumentsContextValue>(defaultContextValue);

const DocumentsProvider: FC<IDocumentsProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Array<DocumentType>>(
    defaultContextValue.items,
  );
  const [selected, setSelected] = useState<DocumentType | null>(
    defaultContextValue.selected,
  );

  const setSelectedDocument = useCallback(
    (document: DocumentType) => {
      setSelected(document);
    },
    [setSelected],
  );

  const pushItem = useCallback((document: DocumentType) => {
    setItems((old) => {
      if (old.length === MAX_COUNT) {
        const [_, ...rest] = old;
        return [document, ...rest];
      }
      const newDocument = [...old];
      newDocument.push(document);
      return newDocument;
    });
  }, []);

  const removeItem = useCallback(
    (document: DocumentType) => {
      const index = items.map((d) => d.file_name).indexOf(document.file_name);
      if (index > -1) {
        // only splice array when item is found
        items.splice(index, 1); // 2nd parameter means remove one item only
      }
      if (items.length === 0) {
        setSelected(null);
      }
      setItems([...items]);
    },
    [setItems, items, setSelected],
  );

  return (
    <DocumentsContext.Provider
      value={{ items, selected, setSelectedDocument, pushItem, removeItem }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export { DocumentsContext, DocumentsProvider };
