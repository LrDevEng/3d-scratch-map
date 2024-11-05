import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';

export default function AddButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  // w3 svg icon overview: https://iconsvg.xyz/
  return (
    <button className="btn btn-circle bg-black" {...props}>
      <svg
        className="bg-black hover:stroke-[#66b14e]"
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
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    </button>
  );
}