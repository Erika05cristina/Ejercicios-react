import React, { useState, useEffect } from 'react';
import { useCountry } from './hooks/useCountry';

const Country = ({ countryName }) => {
  const { found, data, error } = useCountry(countryName);

  if (!countryName) {
    return <p>Please enter a country name.</p>;
  }

  if (found === false) {
    return <p>{error || 'Country not found. Please check the name and try again.'}</p>;
  }

  return (
    <div>
      <h2>{data.name.common}</h2>
      <p>Capital: {data.capital ? data.capital[0] : 'No capital available'}</p>
      <p>Population: {data.population}</p>
      <img src={data.flags.png} alt={`Flag of ${data.name.common}`} />
    </div>
  );
};

export default Country;
