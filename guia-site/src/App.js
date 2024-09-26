import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/landingPage'; // Import the LandingPage component
import Home from './pages/home';
import SubmitRepo from './pages/submitRepo';
import { ContextProvider} from './context';
import CodeReader from './pages/codeReader';
import Overview from './pages/overview';
import NavBar from './pages/navbar';
import AboutUs from './pages/aboutus';
import FlowChart from './pages/render';
import Cases from './pages/cases';

function App() {
  return (
    <ContextProvider>
      <div className="App">
        <div className='bg-white'>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/repo" element={<SubmitRepo/>} />
            <Route path="/code-reader" element={<CodeReader/>} />
            <Route path="/home" element={<Home />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/flowchart" element={<FlowChart />} />
            <Route path="/cases" element={<Cases />} /> 
          </Routes>
        </div>
      </div>
    </ContextProvider>

  );
}

export default App;

