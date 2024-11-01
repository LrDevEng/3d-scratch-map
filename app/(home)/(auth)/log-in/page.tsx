import RegisterLogIn from '../../RegisterLogIn';

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] flex-grow flex-col items-center justify-evenly overflow-y-auto overflow-x-hidden px-8">
      <RegisterLogIn isLogIn={true} />
    </div>
  );
}
