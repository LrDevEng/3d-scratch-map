export const metadata = {
  title: 'About',
  description: 'Information about Terra Scratch.',
};

export default function About() {
  return (
    <div
      className="relative px-8 pt-24 flex flex-col items-center min-h-full"
      style={{
        backgroundImage: "url('/images/bg-image.jpg')",
        backgroundSize: '700px 700px',
        backgroundRepeat: 'repeat',
      }}
    >
      About page
    </div>
  );
}
