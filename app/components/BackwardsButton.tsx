import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';

export default function BackwardsButton(
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
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
