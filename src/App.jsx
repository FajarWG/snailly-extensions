import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect } from "react";

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <h1 style={{ color: "red" }}>Hello World!</h1>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
