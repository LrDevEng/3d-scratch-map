'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { type UserComment } from '../../../../../migrations/00007-createTableComments';
import type { CommentResponseBodyCud } from '../../../../api/comments/[journeyUserId]/route';

type Props = {
  diaryId: number;
  diaryComments: UserComment[];
  journeyUserId: number;
  currentUserId: number;
};

export default function CommentsView({
  diaryId,
  diaryComments,
  journeyUserId,
  currentUserId,
}: Props) {
  const router = useRouter();
  const [post, setPost] = useState('');

  return (
    <div className="w-full p-4">
      {diaryComments.map((diaryComment) => {
        return (
          <div
            key={`comment-${diaryComment.id}`}
            className="chat chat-start px-4"
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full ">
                <Image
                  className="rounded-full object-contain border-2 border-white"
                  src={
                    diaryComment.imageUrl
                      ? diaryComment.imageUrl
                      : '/icons/userIcon.svg'
                  }
                  alt="logo"
                  fill={true}
                  sizes="(max-width: 40px)"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-2">
                {diaryComment.createdAt.toLocaleDateString()}
              </time>
              <time className="text-xs opacity-50 ml-2">
                {diaryComment.createdAt.toLocaleTimeString()}
              </time>
            </div>
            <div className="chat-bubble chat-bubble-primary">
              {diaryComment.post}
            </div>
            <div className="chat-footer mt-1 ml-2">
              {diaryComment.givenName}
            </div>
          </div>
        );
      })}
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const cachedPost = post;
          setPost('');

          // Create comment
          const response = await fetch(`/api/comments/${journeyUserId}`, {
            method: 'POST',
            body: JSON.stringify({
              userId: currentUserId,
              diaryId: diaryId,
              post: cachedPost,
            }),
          });

          const responseBody: CommentResponseBodyCud = await response.json();

          if ('error' in responseBody) {
            toast.error('Error: Could not create comment.');
          }

          router.refresh();
        }}
        className="flex"
      >
        <input
          value={post}
          onChange={(event) => setPost(event.currentTarget.value)}
          placeholder="type here"
          className="input input-bordered input-primary w-full mt-2"
        />
        <button className="group ml-4">
          <svg
            className="group-hover:stroke-[#66b14e]"
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
            <path d="M16 12l-4-4-4 4M12 16V9" />
          </svg>
        </button>
      </form>
    </div>
  );
}
