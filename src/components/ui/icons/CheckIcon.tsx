import * as React from "react";
import classNames from "classnames";

const CheckIcon = ({ className }: { className?: string }) => {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

export default CheckIcon;
