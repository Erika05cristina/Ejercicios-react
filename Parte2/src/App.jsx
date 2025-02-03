import { useState, useEffect } from 'react';
import axios from 'axios';

const Country = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Área: {country.area} km²</p>
    <h3>Idiomas:</h3>
    <ul>
      {Object.values(country.languages).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={`Bandera de ${country.name.common}`} width="150" />
  </div>
);

const CountriesList = ({ countries, setFilter }) => (
  <div>
    {countries.map(country => (
      <p key={country.name.common}>
        {country.name.common} <button onClick={() => setFilter(country.name.common)}>Mostrar</button>
      </p>
    ))}
  </div>
);

const App = () => {
  const [filter, setFilter] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data));
  }, []);

  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Buscar Países</h1>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Escribe un país..." 
      />
      {filteredCountries.length > 10 && <p>Demasiadas coincidencias, haz la búsqueda más específica.</p>}
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && 
        <CountriesList countries={filteredCountries} setFilter={setFilter} />
      }
      {filteredCountries.length === 1 && <Country country={filteredCountries[0]} />}
    </div>
  );
};

export default App;
