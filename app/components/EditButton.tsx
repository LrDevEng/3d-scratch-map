import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';

export default function EditButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  // w3 svg icon overview: https://iconsvg.xyz/
  return (
    <button
      className="bg-red btn btn-circle border-none bg-transparent hover:bg-transparent"
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
        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
      </svg>
    </button>
  );
}
