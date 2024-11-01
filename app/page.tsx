import { getCountries } from '../util/localdata';
import Space from './components/Space';

export default async function Home() {
  const countryData = await getCountries();

  return (
    // <div style={{ width: '80vw', height: '90vh', backgroundColor: '#0f0f0f' }}>
    //   <Space countryData={countryData} />
    // </div>

    <div className="flex h-full w-full">
      <div className="h-[calc(100vh-5rem)] min-h-[300px] w-9/12 bg-[#0f0f0f]">
        <Space earthProps={{ countryData: countryData }} />
      </div>
      <div className=" h-[calc(100vh-5rem)] min-h-[300px] flex-grow overflow-y-auto flex flex-col justify-evenly items-center">
        <div className="text-center">
          <h3>welcome to</h3>
          <h1>TERRA Scratch</h1>
          <h4>your digital 3D scratch map</h4>
        </div>
        <div className="card bg-neutral text-neutral-content w-96">
          <div className="card-body items-center text-center">
            <h2 className="card-title">join the community</h2>
            <p>create your account for free</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">register</button>
              <button className="btn btn-primary">sign in</button>
            </div>
          </div>
        </div>
      </div>
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
