import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Bills from "./pages/Bills";
import AddExpense from "./pages/AddExpense";
import Today from "./pages/Today";
import Debt from "./pages/Debt";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Desk Money</h1>

      <nav style={{ marginBottom: 20 }}>
        <Link to="/">All</Link> |{" "}
        <Link to="/today">Today</Link> |{" "}
        <Link to="/categories">Categories</Link> |{" "}
        <Link to="/bills">Bills</Link> |{" "}
        <Link to="/debt">Debt</Link> | {" "}
        <Link to="/add">Add Expense</Link> 
        

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/debt" element={<Debt />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/today" element={<Today />} />

      </Routes>
    </div>
  );
}

export default App;
