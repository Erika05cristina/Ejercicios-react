import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCountry = (name) => {
  const [country, setCountry] = useState({ found: null, data: null, error: null });

  useEffect(() => {
    if (!name) return;

    console.log(`Buscando país: ${name}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name.toLowerCase()}`
        );
        console.log('Respuesta de la API:', response.data);
        if (response.data && response.data[0]) {
          setCountry({
            found: true,
            data: response.data[0],
            error: null,
          });
        } else {
          setCountry({
            found: false,
            data: null,
            error: 'Not found...',
          });
        }
      } catch (error) {
        console.error(error);
        setCountry({
          found: false,
          data: null,
          error: 'Failed to fetch country data.',
        });
      }
    };

    fetchData();
  }, [name]);

  return country;
};
