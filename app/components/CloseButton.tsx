import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';

export default function CloseButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  // w3 svg icon overview: https://iconsvg.xyz/
  return (
    <button
      className="btn btn-circle border-none bg-transparent hover:bg-transparent"
      {...props}
    >
      <svg
        className="hover:stroke-[#66b14e]"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </button>
  );
}
