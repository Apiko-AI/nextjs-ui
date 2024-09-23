export const getDocumentOriginUrl = (fileName: string) =>
  `${location.origin}/api/documents/preview/${fileName}`;
