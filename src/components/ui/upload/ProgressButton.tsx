import React, { useCallback, useContext } from "react";
import axios, { AxiosProgressEvent, AxiosResponse } from "axios";
import { DocumentType } from "@/types/document";
import { UploadContext } from "@/components/ui/upload/context";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

function ProgressButton({
  api,
  onSuccess,
  onError,
}: {
  api: string;
  onSuccess: (documents: Array<DocumentType>) => void;
  onError: (error: Error) => void;
}) {
  const { isUploading, setIsUploading, items, setProgress, setItems } =
    useContext(UploadContext);
  const onUploadProgress = useCallback(
    (progressEvent: AxiosProgressEvent) => {
      const progress = progressEvent.loaded / (progressEvent?.total || 1);
      setProgress(Math.min(progress, 0.98));
    },
    [setProgress],
  );

  const onProgress = useCallback(
    (e) => {
      e.preventDefault();
      const files = items.map((item) => item.file);
      if (!files.length) return;

      const formData = new FormData();
      Array.from({ length: files.length }).forEach((_, index: number) => {
        const file = files[index];
        formData.append("files", file, file.name);
      });
      setIsUploading(true);
      axios
        .post(api, formData, {
          onUploadProgress: onUploadProgress,
        })
        .then(({ data }: AxiosResponse<Array<DocumentType>>) => {
          setProgress(1);
          setTimeout(() => {
            setIsUploading(false);
            onSuccess(data);
            setItems([]);
          }, 200);
        })
        .catch((error) => {
          setIsUploading(false);
          console.error("--> ProgressButton error: ", error);
          onError(error);
        });
    },
    [setIsUploading, items, setItems],
  );
  return (
    <Button disabled={isUploading} onClick={onProgress}>
      Progress
      {isUploading && <Spinner className="ml-2" />}
    </Button>
  );
}

export { ProgressButton };
