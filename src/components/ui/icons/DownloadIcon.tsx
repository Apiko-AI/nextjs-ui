import * as React from "react";
import classNames from "classnames";

const DownloadIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={classNames("h-4 w-4", className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {" "}
      <path stroke="none" d="M0 0h24v24H0z" />{" "}
      <path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4" />{" "}
      <line x1="12" y1="13" x2="12" y2="22" />{" "}
      <polyline points="9 19 12 22 15 19" />
    </svg>
  );
};

export default DownloadIcon;
