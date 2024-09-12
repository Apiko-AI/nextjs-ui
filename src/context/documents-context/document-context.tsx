import { createContext, type FC, useCallback, useState } from "react";
import type { PropsWithChildren } from "react";

import type { DocumentType } from "@/types/document";

interface IDocumentsContextValue {
  items: Array<DocumentType>;
  selected: DocumentType | null;
  setSelectedDocument: (document: DocumentType) => void;
  pushItem: (document: DocumentType) => void;
  pushItems: (documents: Array<DocumentType>) => void;
  removeItem: (document: DocumentType) => void;
}
interface IDocumentsProviderProps extends PropsWithChildren {}


const defaultContextValue = {
  items: [],
  selected: null,
  setSelectedDocument: () => {},
  pushItem: () => {},
  pushItems: () => {},
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

  const pushItems = useCallback((documents: Array<DocumentType>) => {
    setItems([...documents.splice(0, MAX_COUNT)]);
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
      value={{
        items,
        selected,
        setSelectedDocument,
        pushItem,
        removeItem,
        pushItems,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export { DocumentsContext, DocumentsProvider };
