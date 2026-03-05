import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddExpense() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    fetch("http://localhost:5001/expenses")
      .then(res => res.json())
      .then(data => {
        const unique = [...new Set(data.map(e => e.category))];
        setCategories(unique);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5001/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
      }),
    });

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <input
        type="date"
        required
        onChange={e => setForm({...form, date: e.target.value})}
      /><br/>

      <select
        required
        value={form.category}
        onChange={e => setForm({...form, category: e.target.value})}
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select><br/>

      <input
        placeholder="Description"
        required
        onChange={e => setForm({...form, description: e.target.value})}
      /><br/>

      <input
        type="number"
        placeholder="Amount"
        required
        onChange={e => setForm({...form, amount: e.target.value})}
      /><br/>

      <button type="submit">Save</button>
    </form>
  );
}

export default AddExpense;
