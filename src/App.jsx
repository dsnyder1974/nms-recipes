// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import Home from './pages/Home';
import ManageCategories from './pages/ManageCategories';
import ManageBuffs from './pages/ManageBuffs';
import './App.css'; // Import global styles

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="manage-categories" element={<ManageCategories />} />
          <Route path="manage-buffs" element={<ManageBuffs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

// <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'Arial' }}>
//  <h2>Select or Create a Tag</h2>
//  <CategorySelect />
// </div>
