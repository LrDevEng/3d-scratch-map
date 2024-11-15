import { type ButtonHTMLAttributes } from 'react';

interface LikeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  liked: boolean;
}

export default function LikeButton({ liked, ...props }: LikeButtonProps) {
  // w3 svg icon overview: https://iconsvg.xyz/
  const fill = liked ? '#ff0000' : 'none';

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
        fill={fill}
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
