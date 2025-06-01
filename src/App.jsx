// src/App.js
// Component from https://react-select.com/creatable

// import CategorySelect from './components/Categories/CategorySelect';
import CategoryTable from './components/Categories/CategoryTable';

import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
      <CategoryTable />
      {/* <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'Arial' }}>
        <h2>Select or Create a Tag</h2>
        <CategorySelect />
      </div> */}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
}

export default App;
