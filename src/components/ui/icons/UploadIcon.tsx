import * as React from "react";
import classNames from "classnames";

const UploadIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={classNames("h-4 w-4", className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {" "}
      <polyline points="16 16 12 12 8 16" />{" "}
      <line x1="12" y1="12" x2="12" y2="21" />{" "}
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />{" "}
      <polyline points="16 16 12 12 8 16" />
    </svg>
  );
};

export default UploadIcon;
