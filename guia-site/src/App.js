import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/landingPage'; // Import the LandingPage component
import Home from './pages/home';
import CodeReader from './pages/codeReader'; // Import the CodeReader component

function App() {
  return (
    <div className="App">
      <div className='bg-white'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/code-reader" element={<CodeReader />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

