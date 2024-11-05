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
    <div>
      <table>
        <tbody>
          <tr>
            <td>Capital:</td>
            <td>{countryInfos[0]?.capital}</td>
          </tr>
          <tr>
            <td>Population:</td>
            <td>{countryInfos[0]?.population}</td>
          </tr>
          <tr>
            <td>Size:</td>
            <td>{countryInfos[0]?.area} km²</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
