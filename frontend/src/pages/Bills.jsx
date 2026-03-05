import { useEffect, useState } from "react";

function Bills() {
  const [bills, setBills] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    dueDate: "",
    intervalType: "none",
    intervalDays: "",
  });

  const fetchBills = () => {
    fetch("http://localhost:5001/bills")
      .then(res => res.json())
      .then(data => setBills(data));
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
      intervalDays: Number(form.intervalDays) || 0,
    };

    if (editingId) {
      await fetch(`http://localhost:5001/bills/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditingId(null);
    } else {
      await fetch("http://localhost:5001/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({
      name: "",
      amount: "",
      dueDate: "",
      intervalType: "none",
      intervalDays: "",
    });

    fetchBills();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5001/bills/${id}`, {
      method: "DELETE",
    });
    fetchBills();
  };

  const handleEdit = (bill) => {
    setEditingId(bill._id);
    setForm({
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate.split("T")[0],
      intervalType: bill.intervalType || "none",
      intervalDays: bill.intervalDays || "",
    });
  };

  const daysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = due - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <h2>Bills</h2>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Bill Name"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({...form, amount: e.target.value})}
        />

        <input
          type="date"
          value={form.dueDate}
          onChange={e => setForm({...form, dueDate: e.target.value})}
        />

        <select
          value={form.intervalType}
          onChange={e => setForm({...form, intervalType: e.target.value})}
        >
          <option value="none">One-time</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom Days</option>
        </select>

        {form.intervalType === "custom" && (
          <input
            type="number"
            placeholder="Days interval"
            value={form.intervalDays}
            onChange={e => setForm({...form, intervalDays: e.target.value})}
          />
        )}

        <button>{editingId ? "Update Bill" : "Add Bill"}</button>
      </form>

      {/* Bills List */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Due</th>
            <th>Days Left</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill._id}>
              <td>{bill.name}</td>
              <td style={{ color: "red" }}>${bill.amount}</td>
              <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
              <td>{daysRemaining(bill.dueDate)} days</td>
              <td>
                <button onClick={() => handleEdit(bill)}>Edit</button>
                <button onClick={() => handleDelete(bill._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bills;
