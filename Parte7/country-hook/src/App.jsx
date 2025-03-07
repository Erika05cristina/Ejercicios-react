import React, { useState } from 'react';
import Country from './Country';

const App = () => {
  const [countryName, setCountryName] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleInputChange = (event) => {
    setCountryName(event.target.value);
  };

  const handleSearch = () => {
    if (countryName.trim() !== '') {
      setSearchTriggered(true);
    }
  };

  return (
    <div>
      <h1>Country Search</h1>
      <input
        type="text"
        value={countryName}
        onChange={handleInputChange}
        placeholder="Enter country name"
      />
      <button onClick={handleSearch}>Find</button>
      {searchTriggered && countryName && <Country countryName={countryName} />}
    </div>
  );
};

export default App;
