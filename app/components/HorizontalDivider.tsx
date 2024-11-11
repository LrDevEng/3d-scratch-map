import { type DetailedHTMLProps } from 'react';

export default function HorizontalDivider(
  props: DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
) {
  return <div className="h-[2px] w-full bg-white" {...props} />;
}
