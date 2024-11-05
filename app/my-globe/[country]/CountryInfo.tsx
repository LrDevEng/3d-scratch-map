'use client';

import { useEffect } from 'react';
import { useCountryInfos } from '../../stores/useCountry';

type Props = {
  countryIsoA2: string;
};

export default function CountryInfo({ countryIsoA2 }: Props) {
  const countryInfos = useCountryInfos((state) => state.countryInfos);
  const updateCountryInfos = useCountryInfos((state) => state.update);

  console.log('Country info rendered with: ', countryIsoA2);

  // Country api
  // https://restcountries.com/v3.1/alpha/fr
  useEffect(() => {
    if (countryIsoA2.length === 2) {
      fetch(`https://restcountries.com/v3.1/alpha/${countryIsoA2}`)
        .then((response) => response.json())
        .then((data) => {
          updateCountryInfos(data);
        })
        .catch((error) =>
          console.error(
            'Error fetching data from https://restcountries.com:',
            error,
          ),
        );
    }
  }, [countryIsoA2, updateCountryInfos]);

  return (
    <div className="w-full">
      <table className="table-fixed">
        <tbody>
          <tr>
            <td>Capital:</td>
            <td className="px-4">{countryInfos[0]?.capital}</td>
          </tr>
          <tr>
            <td>Population:</td>
            <td className="px-4">{countryInfos[0]?.population}</td>
          </tr>
          <tr>
            <td>Area:</td>
            <td className="px-4">{countryInfos[0]?.area} km²</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
