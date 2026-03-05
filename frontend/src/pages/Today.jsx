import { useEffect, useState } from "react";

function Today() {
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetch("http://localhost:5001/expenses")
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  const changeDate = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const filtered = expenses.filter(exp => {
    const expDate = new Date(exp.date).toISOString().split("T")[0];
    return expDate === selectedDate;
  });

  const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <h2>Daily View</h2>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={() => changeDate(-1)}>⬅ Previous</button>

        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />

        <button onClick={() => changeDate(1)}>Next ➡</button>
      </div>

      <h3 style={{ marginTop: 20 }}>
        Total: <span style={{ color: "red" }}>${total}</span>
      </h3>

      {filtered.length === 0 && (
        <p style={{ marginTop: 10 }}>No expenses for this day.</p>
      )}

      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(exp => (
            <tr key={exp._id}>
              <td>{exp.category}</td>
              <td>{exp.description}</td>
              <td style={{ color: "red" }}>{exp.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Today;
