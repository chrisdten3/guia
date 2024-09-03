import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/landingPage'; // Import the LandingPage component
import Home from './pages/home';
import SubmitRepo from './pages/submitRepo';
import { ContextProvider} from './context';

function App() {
  return (
    <ContextProvider>
      <div className="App">
        <div className='bg-white'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/repo" element={<SubmitRepo/>} />
          </Routes>
        </div>
      </div>
    </ContextProvider>

  );
}

export default App;

