import React from 'react';
import Home from './components/pages/Home';
import Products from './components/pages/Products';
import AdminUpload from './components/pages/AdminUpload';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/products/:ProductId" element={<Products />}></Route>
        <Route path="/Admin" element={<AdminUpload />}></Route>
      </Routes>
    </div>
  );
}

export default App;
