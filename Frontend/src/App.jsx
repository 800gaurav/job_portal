
import { Routes, Route, } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Navbar from './components/Navbar';
import Applyjob from './components/Jobapply.jsx/Applyjob';
import Application from './Pages/Application';




function App() {

  return (
    <>
    <Navbar/>
      <Routes>
           <Route path='/' element={<Home/>} />
           <Route path="/login" element={<Login/>} />
           <Route path="/signup" element={<Signup/>} />
           <Route path="/apply" element={<Applyjob/>} />
           <Route path="/application" element={<Application/>} />
      </Routes>

     
    </>
  );
}

export default App;

