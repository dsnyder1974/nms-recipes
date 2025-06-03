// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ManageCategories from './pages/ManageCategories';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="manage-categories" element={<ManageCategories />} />
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
