import Signup from "./pages/Signup";
import Login from "./pages/Login";
import './App.css'
import { Routes, Route } from 'react-router-dom'
import AddProducts from "./pages/AddProducts";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<AddProducts />} />
    </Routes>
  )
}

export default App
