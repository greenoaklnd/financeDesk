import { useEffect, useState } from "react";

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [file, setFile] = useState(null);

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:5001/expenses");
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5001/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(`Import complete. ${data.count || 0} rows added.`);

    fetchExpenses();
  };

  return (
    <div>
      <h2>All Expenses</h2>

      {/* CSV IMPORT SECTION */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Import CSV</button>
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
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

export default Home;
