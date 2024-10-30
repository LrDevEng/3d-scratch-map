import { Button } from '@/components/ui/button';
import { getCountries } from '../util/localdata';
import NavBar from './components/NavBar';
import Space from './components/Space';

export default async function Home() {
  const countryData = await getCountries();

  return (
    // <div style={{ width: '80vw', height: '90vh', backgroundColor: '#0f0f0f' }}>
    //   <Space countryData={countryData} />
    // </div>
    <div className="h-screen flex flex-col">
      <header>
        <NavBar />
      </header>
      <main className="flex-grow">
        <div className="flex h-full">
          <div className="h-[calc(100vh-5rem)] min-h-[300px] w-9/12 bg-[#0f0f0f]">
            <Space countryData={countryData} />
          </div>
          <div className=" h-[calc(100vh-5rem)] min-h-[300px] w-3/12 overflow-y-auto">
            <h3>welcome to</h3>
            <h1>TERRA Scratch</h1>
            <h4>your digital 3D scratch map</h4>
            <Button>register</Button>
            <Button>sign in</Button>
          </div>
        </div>
      </main>
    </div>
    // <div className="h-screen">
    //   <header>
    //     <NavBar />
    //   </header>
    //   <main>
    //     <div className="flex h-full">
    //       <div>
    //         <Space countryData={countryData} />
    //       </div>
    //       <div>
    //         <h1>Hello</h1>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
}
