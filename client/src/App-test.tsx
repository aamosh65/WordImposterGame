import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <h1>Word Imposter Game - Test</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <p>Backend URL would be: {window.location.hostname}</p>
    </div>
  );
}

export default App;
