import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ResultMarksheet.css'; // For print styling

const defaultSubjects = [
  { subject: 'Mathematics', marksObtained: '', maxMarks: '100' },
  { subject: 'Science', marksObtained: '', maxMarks: '100' },
  { subject: 'English', marksObtained: '', maxMarks: '100' },
];

const ResultMarksheet = () => {
  const [student, setStudent] = useState({
    name: '',
    className: '',
    rollNo: '',
    schoolName: 'Shubham English School',
  });

  const [subjects, setSubjects] = useState(defaultSubjects);
  const certificateRef = useRef();

  const handleStudentChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (index, e) => {
    const newSubjects = [...subjects];
    const value = e.target.value;
    const name = e.target.name;

    if (name === "marksObtained") {
      const max = Number(newSubjects[index].maxMarks || 0);
      if (Number(value) > max) {
        alert("Marks obtained cannot exceed Max Marks.");
        return;
      }
    }

    newSubjects[index][name] = value;
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { subject: '', marksObtained: '', maxMarks: '' }]);
  };

  const removeSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const totalMarksObtained = subjects.reduce((acc, curr) => acc + Number(curr.marksObtained || 0), 0);
  const totalMaxMarks = subjects.reduce((acc, curr) => acc + Number(curr.maxMarks || 0), 0);

  const getPercentage = () => totalMaxMarks ? ((totalMarksObtained / totalMaxMarks) * 100).toFixed(2) : 0;

  const getGrade = (percentage) => {
    const percent = parseFloat(percentage);
    if (percent >= 90) return 'A+';
    if (percent >= 75) return 'A';
    if (percent >= 60) return 'B';
    if (percent >= 45) return 'C';
    if (percent >= 33) return 'D';
    return 'F';
  };

  const saveToBackend = () => {
    const payload = { ...student, subjects };

    fetch('http://localhost:5000/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        alert('✅ Result saved to database.');
        console.log('Saved result:', data);
      })
      .catch(err => {
        console.error('❌ Error saving result:', err);
        alert('Failed to save result');
      });
  };

  const generatePDF = () => {
    const input = certificateRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${student.name}_Marksheet.pdf`);
    });
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3 text-center">📄 Digital Result Marksheet</h2>

      <div className="card p-3 mb-4">
        <h5>Student Details</h5>
        <input
          type="text"
          name="schoolName"
          placeholder="School Name"
          className="form-control mb-2"
          value={student.schoolName}
          onChange={handleStudentChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          className="form-control mb-2"
          value={student.name}
          onChange={handleStudentChange}
        />
        <input
          type="text"
          name="className"
          placeholder="Class"
          className="form-control mb-2"
          value={student.className}
          onChange={handleStudentChange}
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll No"
          className="form-control"
          value={student.rollNo}
          onChange={handleStudentChange}
        />
      </div>

      <h5 className="mb-2">📘 Enter Subject Marks</h5>
      {subjects.map((subj, index) => (
        <div className="row g-2 mb-2 align-items-center" key={index}>
          <div className="col-md-5">
            <input
              type="text"
              name="subject"
              placeholder="Subject Name"
              className="form-control"
              value={subj.subject}
              onChange={(e) => handleSubjectChange(index, e)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="marksObtained"
              placeholder="Marks Obtained"
              className="form-control"
              value={subj.marksObtained}
              onChange={(e) => handleSubjectChange(index, e)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="maxMarks"
              placeholder="Max Marks"
              className="form-control"
              value={subj.maxMarks}
              onChange={(e) => handleSubjectChange(index, e)}
            />
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-danger"
              onClick={() => removeSubject(index)}
              disabled={subjects.length === 1}
              title="Remove Subject"
            >
              &times;
            </button>
          </div>
        </div>
      ))}

      <button className="btn btn-success mb-4" onClick={addSubject}>
        + Add Subject
      </button>

      {/* Marksheet Preview */}
      <div
        ref={certificateRef}
        className="print-area p-4 mb-4 bg-white shadow"
        style={{
          border: '2px solid #000',
          width: '210mm',
          minHeight: '297mm',
          boxSizing: 'border-box',
        }}
      >
        <h2 className="text-center">{student.schoolName || 'School Name'}</h2>
        <h4 className="text-center mb-4">Result Marksheet</h4>

        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Class:</strong> {student.className}</p>
        <p><strong>Roll No:</strong> {student.rollNo}</p>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Max Marks</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subj, i) => (
              <tr key={i}>
                <td>{subj.subject}</td>
                <td>{subj.marksObtained}</td>
                <td>{subj.maxMarks}</td>
              </tr>
            ))}
            <tr>
              <th>Total</th>
              <th>{totalMarksObtained}</th>
              <th>{totalMaxMarks}</th>
            </tr>
          </tbody>
        </table>

        <p><strong>Percentage:</strong> {getPercentage()}%</p>
        <p><strong>Grade:</strong> {getGrade(getPercentage())}</p>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-3">
        <button
          className="btn btn-warning"
          onClick={saveToBackend}
          disabled={!student.name || subjects.length === 0}
        >
          💾 Save to Database
        </button>

        <button
          className="btn btn-primary"
          onClick={generatePDF}
          disabled={!student.name || subjects.length === 0}
        >
          📥 Download Marksheet PDF
        </button>
      </div>
    </div>
  );
};

export default ResultMarksheet;
