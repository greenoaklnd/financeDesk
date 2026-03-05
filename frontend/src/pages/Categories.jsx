import { useEffect, useState } from "react";

function Categories() {
  const [expenses, setExpenses] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/expenses")
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  const categories = [...new Set(expenses.map(e => e.category))];

  const filtered = selected
    ? expenses.filter(e => e.category === selected)
    : [];

  return (
    <div>
      <h2>Categories</h2>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <div
            key={cat}
            onClick={() => setSelected(cat)}
            style={{
              padding: 15,
              border: "1px solid black",
              cursor: "pointer",
              minWidth: 100
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {selected && (
        <>
          <h3 style={{ marginTop: 20 }}>{selected}</h3>
          <table border="1" cellPadding="5">
            <tbody>
              {filtered.map(exp => (
                <tr key={exp._id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.description}</td>
                  <td>{exp.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Categories;
