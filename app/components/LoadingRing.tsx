type Props = {
  className?: string | null;
};

export default function LoadingRing({ className }: Props) {
  return (
    <div className={className ? className : ''}>
      <span className="loading loading-ring loading-lg" />
    </div>
  );
}
