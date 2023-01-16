import React from 'react';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Admin from './pages/Admin.jsx';
import { Routes, Route } from 'react-router-dom';
import './css/App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/products/:ProductId" element={<Products />}></Route>
        <Route path="/Admin" element={<Admin />}></Route>
      </Routes>
    </div>
  );
}

export default App;
