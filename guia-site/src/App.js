import logo from './logo.svg';
import './App.css';
import {Routes, Route } from "react-router-dom";
import Home from './pages/home';

function App() {
  return (
    <div className="App">
      <div className='bg-white'>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
