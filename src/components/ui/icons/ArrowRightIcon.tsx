import * as React from "react";
import classNames from "classnames";

const ArrowRightIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={classNames("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {" "}
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
};

export default ArrowRightIcon;
