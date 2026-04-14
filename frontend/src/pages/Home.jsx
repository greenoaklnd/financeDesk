import { useEffect, useState } from "react";

function Home() {
  const [bills, setBills] = useState([]);

  const fetchBills = async () => {
    try {
      const res = await fetch("http://localhost:5001/bills");
      const data = await res.json();
      setBills(data);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh" }}>

      {/* FLOATING BILLS BOX */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 240,
          background: "#f5f5f5",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ddd"
        }}
      >
        <strong>📌 Bills</strong>

        {bills.length === 0 && (
          <div style={{ fontSize: 13 }}>No bills</div>
        )}

        {bills
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5)
          .map((bill) => {
            const daysLeft = Math.ceil(
              (new Date(bill.dueDate) - new Date()) /
              (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={bill._id}
                style={{
                  fontSize: 13,
                  marginTop: 6,
                  paddingBottom: 4,
                  borderBottom: "1px solid #ddd"
                }}
              >
                <div><strong>{bill.name}</strong></div>

                <div style={{ color: "red" }}>
                  ${bill.amount}
                </div>

                <div style={{ fontSize: 12 }}>
                  {new Date(bill.dueDate).toLocaleDateString()}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: daysLeft <= 2 ? "red" : "gray"
                  }}
                >
                  {daysLeft} days
                </div>
              </div>
            );
          })}
      </div>

    </div>
  );
}

export default Home;