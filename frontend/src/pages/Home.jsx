import { useEffect, useState } from "react";

function Home() {
  const [bills, setBills] = useState([]);
  const [debts, setDebts] = useState([]);

  const fetchBills = async () => {
    const res = await fetch("http://localhost:5001/bills");
    const data = await res.json();
    setBills(data);
  };

  const fetchDebts = async () => {
    const res = await fetch("http://localhost:5001/debts");
    const data = await res.json();
    setDebts(data);
  };

  useEffect(() => {
    fetchBills();
    fetchDebts();
  }, []);

  const getNextDueDate = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let next = new Date(dueDate);
    next.setHours(0, 0, 0, 0);

    while (next < today) {
      next.setMonth(next.getMonth() + 1);
    }

    return next;
  };

  const getDaysUntilNext = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next = getNextDueDate(dueDate);

    return Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  };

  // ✅ TOTAL DEBT
  const totalDebt = debts.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const boxStyle = {
    width: 240,
    background: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
  };

  const itemStyle = {
    fontSize: 13,
    marginTop: 6,
    paddingBottom: 4,
    borderBottom: "1px solid #ddd",
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: 12,
        }}
      >
        {/* 📌 BILLS */}
        <div style={boxStyle}>
          <strong>📌 Bills</strong>

          {bills.length === 0 && (
            <div style={{ fontSize: 13 }}>No bills</div>
          )}

          {bills
            .sort(
              (a, b) =>
                getDaysUntilNext(a.dueDate) - getDaysUntilNext(b.dueDate)
            )
            .slice(0, 5)
            .map((bill) => {
              const nextDate = getNextDueDate(bill.dueDate);
              const days = getDaysUntilNext(bill.dueDate);

              return (
                <div key={bill._id} style={itemStyle}>
                  <div>
                    <strong>{bill.name}</strong>
                  </div>

                  <div style={{ color: "red" }}>
                    ${bill.amount}
                  </div>

                  <div style={{ fontSize: 12 }}>
                    Next: {nextDate.toLocaleDateString()}
                  </div>

                  <div style={{ fontSize: 11, color: "gray" }}>
                    {days} days
                  </div>
                </div>
              );
            })}
        </div>

        {/* 💳 DEBT */}
        <div style={boxStyle}>
          {/* ✅ TITLE + SUBTLE TOTAL */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <strong>💳 Debt</strong>
            <span style={{ fontSize: 11, color: "#999" }}>
              (${totalDebt})
            </span>
          </div>

          {debts.length === 0 && (
            <div style={{ fontSize: 13 }}>No debt</div>
          )}

          {debts.slice(0, 5).map((debt) => (
            <div key={debt._id} style={itemStyle}>
              <div>
                <strong>{debt.name}</strong>
              </div>

              <div style={{ color: "red" }}>
                ${debt.amount}
              </div>

              {debt.note && (
                <div style={{ fontSize: 12 }}>
                  {debt.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;