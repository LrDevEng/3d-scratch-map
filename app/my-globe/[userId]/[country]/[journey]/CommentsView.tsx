import { type UserComment } from '../../../../../migrations/00007-createTableComments';

type Props = {
  diaryComments: UserComment[];
};

export default function CommentsView({ diaryComments }: Props) {
  return <div>CommentsView</div>;
}
