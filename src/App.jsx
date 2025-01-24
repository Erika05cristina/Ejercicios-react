import { useState } from 'react'

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return ( 
    <div>
        <h1>Give Feedback</h1>
        <button onClick={() => { setGood(good + 1); console.log('Good:', good + 1); }}>Good</button>
        <button onClick={() => { setNeutral(neutral + 1); console.log('Neutral:', neutral + 1); }}>Neutral</button>
        <button onClick={() => { setBad(bad + 1); console.log('Bad:', bad + 1); }}>Bad</button>

        <h2>Statistics</h2>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>

    </div>
  )
}

export default App