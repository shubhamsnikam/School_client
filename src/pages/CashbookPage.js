import React, { useState, useEffect } from 'react';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().slice(0, 10);
};

const CashMemo = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    type: 'expense',
    description: '',
    amount: '',
    date: getTodayDate(),
  });
  const [report, setReport] = useState({ month: '', year: '' });
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [reportType, setReportType] = useState('monthly');

  // 🆕 Fetch entries from backend on component mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cashbook`) // 🔄 UPDATED
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Error fetching entries:', err));
  }, []);

  // 🆕 Save new entry to backend
  const addEntry = () => {
    if (!form.description || !form.amount || !form.date) {
      alert('कृपया सर्व फील्ड भरा');
      return;
    }

    const newEntry = {
      ...form,
      amount: parseFloat(form.amount),
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cashbook`, { // 🔄 UPDATED
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    })
      .then(res => res.json())
      .then(savedEntry => {
        setEntries(prev => [...prev, savedEntry]); // 🔄 UPDATED
        setForm({ type: 'expense', description: '', amount: '', date: getTodayDate() });
      })
      .catch(err => {
        console.error('Failed to save entry:', err);
        alert('Saving failed');
      });
  };

  // 🔄 Filter entries based on report settings
  useEffect(() => {
    if (!report.year) {
      setFilteredEntries(entries);
      return;
    }
    if (reportType === 'monthly' && report.month) {
      const filtered = entries.filter(e => {
        const d = new Date(e.date);
        return (
          d.getFullYear() === parseInt(report.year) &&
          d.getMonth() + 1 === parseInt(report.month)
        );
      });
      setFilteredEntries(filtered);
    } else if (reportType === 'yearly') {
      const filtered = entries.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === parseInt(report.year);
      });
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [report, reportType, entries]);

  const totalIncome = filteredEntries
    .filter(e => e.type === 'income')
    .reduce((acc, cur) => acc + cur.amount, 0);
  const totalExpense = filteredEntries
    .filter(e => e.type === 'expense')
    .reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Cash Memo (नाणी व्यवहार)</h2>

      {/* Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <div className="row g-3 align-items-center">
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense (खर्च)</option>
              <option value="income">Income (उत्पन्न)</option>
            </select>
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Description (वर्णन)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Amount (रक्कम)"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" onClick={addEntry}>
              Add Entry (नोंद करा)
            </button>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h4>Expenses (खर्च)</h4>
            <ul className="list-group list-group-flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {entries.filter(e => e.type === 'expense').length === 0 && <li className="list-group-item text-muted">No expenses recorded</li>}
              {entries
                .filter(e => e.type === 'expense')
                .map(e => (
                  <li key={e._id || e.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>{e.date} - {e.description}</div>
                    <span className="badge bg-danger rounded-pill">₹{e.amount.toFixed(2)}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h4>Incomes (उत्पन्न)</h4>
            <ul className="list-group list-group-flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {entries.filter(e => e.type === 'income').length === 0 && <li className="list-group-item text-muted">No incomes recorded</li>}
              {entries
                .filter(e => e.type === 'income')
                .map(e => (
                  <li key={e._id || e.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>{e.date} - {e.description}</div>
                    <span className="badge bg-success rounded-pill">₹{e.amount.toFixed(2)}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reports */}
      <div className="card p-4 shadow-sm">
        <h3 className="mb-4">Reports (अहवाल)</h3>

        <div className="row g-3 align-items-center mb-3">
          <div className="col-md-3">
            <label htmlFor="yearInput" className="form-label">Year (वर्ष):</label>
            <input
              id="yearInput"
              type="number"
              className="form-control"
              placeholder="उदा. 2024"
              value={report.year}
              onChange={e => setReport({ ...report, year: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="monthInput" className="form-label">Month (महिना):</label>
            <input
              id="monthInput"
              type="number"
              min="1"
              max="12"
              className="form-control"
              placeholder="1-12"
              value={report.month}
              onChange={e => setReport({ ...report, month: e.target.value })}
              disabled={reportType === 'yearly'}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="reportTypeSelect" className="form-label">Report Type:</label>
            <select
              id="reportTypeSelect"
              className="form-select"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="monthly">Monthly Report (महिन्याचा अहवाल)</option>
              <option value="yearly">Yearly Report (वार्षिक अहवाल)</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <strong>Total Income: </strong>₹{totalIncome.toFixed(2)} <br />
          <strong>Total Expense: </strong>₹{totalExpense.toFixed(2)}
        </div>

        <div>
          <h5>Entries:</h5>
          <ul className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredEntries.length === 0 && <li className="list-group-item text-muted">No entries for selected report</li>}
            {filteredEntries.map(e => (
              <li key={e._id || e.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  [{e.date}] {e.type === 'income' ? 'Income (उत्पन्न)' : 'Expense (खर्च)'} - {e.description}
                </div>
                <span className={`badge rounded-pill ${e.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                  ₹{e.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CashMemo;
