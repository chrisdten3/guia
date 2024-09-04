import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/landingPage'; // Import the LandingPage component
import Home from './pages/home';
import SubmitRepo from './pages/submitRepo';
import { ContextProvider} from './context';
import CodeReader from './pages/codeReader';
import Overview from './pages/overview';

function App() {
  return (
    <ContextProvider>
      <div className="App">
        <div className='bg-white'>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/repo" element={<SubmitRepo/>} />
            <Route path="/code-reader" element={<CodeReader/>} />
            <Route path="/home" element={<Home />} />
            <Route path="/overview" element={<Overview />} />
          </Routes>
        </div>
      </div>
    </ContextProvider>

  );
}

export default App;

