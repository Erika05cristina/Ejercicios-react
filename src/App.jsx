import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    <p>
      {text} {value}
    </p>
  );
}
const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = (good / all) * 100;

  return (
    <div>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive + " %"} />
    </div>
  );
};

  const Button = ({ onClick, text }) => (
    <button onClick={onClick}>
    {text}
    </button>
  )
  
  const App = () => {
    // guarda los clics de cada botón en su propio estado
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    
    const handleGoodClick = () => {
      setGood(good + 1);
      console.log('Good:', good + 1);
    };
  
    const handleNeutralClick = () => {
      setNeutral(neutral + 1);
      console.log('Neutral:', neutral + 1);
    };
  
    const handleBadClick = () => {
      setBad(bad + 1);
      console.log('Bad:', bad + 1);
    };
  
  return ( 
    <div>
        <h1>Give Feedback</h1>
        <Button onClick={handleGoodClick} text='Good' />
        <Button onClick={handleNeutralClick} text='Neutral' />
        <Button onClick={handleBadClick} text='Bad' />
        <p>good {good }</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>

        <p>-----------------------------------</p>
        <h2>Statistics</h2>
        <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App