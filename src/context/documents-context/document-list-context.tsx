import {
  createContext,
  type FC,
  useCallback,
  useState,
  useEffect,
} from "react";
import type { PropsWithChildren } from "react";

import type { DocumentListItemType } from "@/types/document";

interface IDocumentListContextValue {
  isLoading: boolean;
  items: Array<DocumentListItemType>;
  pushItem: (document: DocumentListItemType) => void;
  pushItems: (documents: Array<DocumentListItemType>) => void;
  removeItem: (document: DocumentListItemType) => void;
}
interface IDocumentListProviderProps extends PropsWithChildren {}

const defaultContextValue = {
  isLoading: false,
  items: [],
  pushItem: () => {},
  pushItems: () => {},
  removeItem: () => {},
};
const MAX_COUNT = 20;
const DocumentListContext =
  createContext<IDocumentListContextValue>(defaultContextValue);

const DocumentListProvider: FC<IDocumentListProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Array<DocumentListItemType>>(
    defaultContextValue.items,
  );

  const pushItem = useCallback((document: DocumentListItemType) => {
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

  const pushItems = useCallback((documents: Array<DocumentListItemType>) => {
    setItems([...documents.splice(0, MAX_COUNT)]);
  }, []);

  const removeItem = useCallback(
    (document: DocumentListItemType) => {
      const index = items.map((d) => d.file_name).indexOf(document.file_name);
      if (index > -1) {
        // only splice array when item is found
        items.splice(index, 1); // 2nd parameter means remove one item only
      }
      setItems([...items]);
    },
    [setItems, items],
  );

  useEffect(() => {
    setIsLoading(true);

    fetch("api/documents")
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setItems(data);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error in api/documents fetch", error);
      });
  }, [setIsLoading]);

  return (
    <DocumentListContext.Provider
      value={{
        isLoading,
        items,
        pushItem,
        removeItem,
        pushItems,
      }}
    >
      {children}
    </DocumentListContext.Provider>
  );
};

export { DocumentListContext, DocumentListProvider };
