// src/App.js
// Component from https://react-select.com/creatable

import CategorySelect from "./components/Categories/CategorySelect";
import CategoryTable from "./components/Categories/CategoryTable";

function App() {
  return (
    <>
      <CategoryTable />
      <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial" }}>
        <h2>Select or Create a Tag</h2>
        <CategorySelect />
      </div>
    </>
  );
}

export default App;
