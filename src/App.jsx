import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center gap-8 mb-8">
          <a
            href="https://vite.dev"
            target="_blank"
            className="hover:scale-110 transition-transform"
          >
            <img src={viteLogo} className="w-24 h-24" alt="Vite logo" />
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            className="hover:scale-110 transition-transform"
          >
            <img
              src={reactLogo}
              className="w-24 h-24 animate-spin-slow"
              alt="React logo"
            />
          </a>
        </div>

        <h1 className="text-5xl font-bold text-white mb-8">Vite + React</h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            count is {count}
          </button>
          <p className="text-gray-300 mt-4">
            Edit{" "}
            <code className="bg-gray-800 px-2 py-1 rounded text-yellow-300">
              src/App.jsx
            </code>{" "}
            and save to test HMR
          </p>
        </div>

        <p className="text-gray-400 text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;
