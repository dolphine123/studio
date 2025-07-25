import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.5 12.5C6.5 11.1193 7.61929 10 9 10H15C16.3807 10 17.5 11.1193 17.5 12.5V12.5C17.5 13.8807 16.3807 15 15 15H9C7.61929 15 6.5 13.8807 6.5 12.5V12.5Z" />
      <path d="M9 10V10C7.61929 10 6.5 8.88071 6.5 7.5V7.5C6.5 6.11929 7.61929 5 9 5H15C16.3807 5 17.5 6.11929 17.5 7.5V7.5C17.5 8.88071 16.3807 10 15 10V10" />
      <path d="M9 15V15C7.61929 15 6.5 16.1193 6.5 17.5V17.5C6.5 18.8807 7.61929 20 9 20H15C16.3807 20 17.5 18.8807 17.5 17.5V17.5C17.5 16.1193 16.3807 15 15 15V15" />
    </svg>
  ),
};
