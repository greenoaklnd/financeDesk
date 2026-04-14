import { useEffect, useState } from "react";

function Debt() {
  const [debts, setDebts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    note: ""
  });

  const fetchDebts = async () => {
    const res = await fetch("http://localhost:5001/debts");
    const data = await res.json();
    setDebts(data);
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5001/debts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount)
      })
    });

    setForm({ name: "", amount: "", note: "" });
    fetchDebts();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5001/debts/${id}`, {
      method: "DELETE"
    });
    fetchDebts();
  };

  // ✅ TOTAL DEBT (simple + clean)
  const totalDebt = debts.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  return (
    <div>
      <h2>
        Debts{" "}
        <span style={{ fontSize: 13, color: "#999" }}>
          (${totalDebt})
        </span>
      </h2>

      {/* ADD FORM (UNCHANGED STYLE) */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <input
          placeholder="Note"
          value={form.note}
          onChange={(e) =>
            setForm({ ...form, note: e.target.value })
          }
        />

        <button>Add</button>
      </form>

      {/* LIST (UNCHANGED STYLE) */}
      <ul>
        {debts.map((d) => (
          <li key={d._id}>
            {d.name} - ${d.amount}
            <button onClick={() => handleDelete(d._id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Debt;