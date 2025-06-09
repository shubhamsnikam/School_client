import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Certificate.css';

const CertificatePage = () => {
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'Leaving',
    reason: '',
    conduct: '',
    admissionDate: '',
    leavingDate: '',
  });

  const printRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetchCertificates();
    fetchStudents();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/certificates`);
      setCertificates(res.data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/students`);
      setStudents(res.data);
      if (res.data.length > 0) {
        setFormData((prev) => ({ ...prev, studentId: res.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const issueDate = new Date().toISOString();

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/certificates`, {
        ...formData,
        issueDate,
      });

      alert('Certificate issued successfully!');
      fetchCertificates();
      setFormData((prev) => ({
        ...prev,
        reason: '',
        conduct: '',
        admissionDate: '',
        leavingDate: '',
      }));
    } catch (err) {
      console.error('Error issuing certificate:', err);
      alert('Failed to issue certificate.');
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setSelectedIndex(null),
  });

  useEffect(() => {
    if (selectedIndex !== null) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedIndex, handlePrint]);

  const handleDownloadPDF = async (index) => {
    if (!certificates[index]) return;
    const element = document.getElementById(`certificate-${index}`);
    if (!element) return;

    try {
      await new Promise((r) => setTimeout(r, 300));
      const canvas = await html2canvas(element, { scale: 3, useCORS: true, scrollY: -window.scrollY });

      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const width = 595.28;
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${certificates[index].type}_Certificate_${certificates[index].studentId?.name || 'student'}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Issue Certificate</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Student</label>
          <select
            className="form-control"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            required
          >
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} (Class: {student.className})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Certificate Type</label>
          <select
            className="form-control"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="Leaving">Leaving</option>
            <option value="Transfer">Transfer</option>
            <option value="Bonafide">Bonafide</option>
          </select>
        </div>

        {(formData.type === 'Leaving' || formData.type === 'Transfer') && (
          <>
            <div className="mb-3">
              <label>Date of Admission</label>
              <input
                type="date"
                className="form-control"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label>Date of Leaving</label>
              <input
                type="date"
                className="form-control"
                value={formData.leavingDate}
                onChange={(e) => setFormData({ ...formData, leavingDate: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label>Reason (optional)</label>
              <textarea
                className="form-control"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Conduct/Remarks (optional)</label>
              <textarea
                className="form-control"
                value={formData.conduct}
                onChange={(e) => setFormData({ ...formData, conduct: e.target.value })}
              />
            </div>
          </>
        )}

        <button className="btn btn-primary">Issue</button>
      </form>

      <h3 className="mt-5">Certificates</h3>
      <ul className="list-group">
        {certificates.map((cert, index) => (
          <li key={cert._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {cert.type} Certificate for Student: {cert.studentId?.name || 'N/A'} (Class: {cert.studentId?.className || 'N/A'}) issued on {new Date(cert.issueDate).toLocaleDateString()}
            </div>
            <div>
              <button className="btn btn-primary btn-sm me-2" onClick={() => setSelectedIndex(index)}>Print</button>
              <button className="btn btn-success btn-sm" onClick={() => handleDownloadPDF(index)}>Download PDF</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedIndex !== null && certificates[selectedIndex] && (
        <div style={{ position: 'absolute', left: '-9999px' }}>
          <div ref={printRef}>
            <CertificateTemplate certificate={certificates[selectedIndex]} />
          </div>
        </div>
      )}

      {certificates.map((cert, index) => (
        <div key={cert._id} id={`certificate-${index}`} style={{ position: 'absolute', left: '-9999px' }}>
          <CertificateTemplate certificate={cert} />
        </div>
      ))}
    </div>
  );
};

const CertificateTemplate = ({ certificate }) => {
  const student = certificate.studentId || {};
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-IN') : 'N/A';

  const templateStyle = {
    width: '794px',
    height: '1123px',
    padding: '40px',
    border: '5px solid #000',
    backgroundColor: 'white',
    fontFamily: "'Times New Roman', Times, serif",
    color: '#000',
  };

  const commonHeader = (
    <>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>Shubham English Medium School</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>Shiv City Center, Near KFC, Vijaynagar, Sangli | Phone: +91 9209312828</p>
    </>
  );

  if (certificate.type === 'Leaving' || certificate.type === 'Transfer') {
    return (
      <div className="certificate" style={templateStyle}>
        {commonHeader}
        <h2 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '30px' }}>{certificate.type} Certificate</h2>
        <p>This is to certify that the following student was enrolled at our school:</p>
        <table style={{ width: '100%', fontSize: '18px', marginBottom: '40px' }}>
          <tbody>
            <tr><td><strong>Name:</strong></td><td>{student.name || 'N/A'}</td></tr>
            <tr><td><strong>Date of Birth:</strong></td><td>{formatDate(student.dob)}</td></tr>
            <tr><td><strong>Class / Grade:</strong></td><td>{student.className || 'N/A'}</td></tr>
            <tr><td><strong>Parent Name:</strong></td><td>{student.parentName || 'N/A'}</td></tr>
            <tr><td><strong>Date of Admission:</strong></td><td>{formatDate(certificate.admissionDate)}</td></tr>
            <tr><td><strong>Date of Leaving:</strong></td><td>{formatDate(certificate.leavingDate)}</td></tr>
            {certificate.reasonForLeaving && <tr><td><strong>Reason:</strong></td><td>{certificate.reasonForLeaving}</td></tr>}
            {certificate.conduct && <tr><td><strong>Remarks:</strong></td><td>{certificate.conduct}</td></tr>}
          </tbody>
        </table>
        <p>Date of Issue: {formatDate(certificate.issueDate)}</p>
        <p style={{ marginTop: '60px' }}>Signature: ___________________</p>
      </div>
    );
  }

  if (certificate.type === 'Bonafide') {
    return (
      <div className="certificate" style={templateStyle}>
        {commonHeader}
        <h2 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '30px' }}>Bonafide Certificate</h2>
        <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
          This is to certify that <strong>{student.name || '__________'}</strong>,
          son/daughter of <strong>{student.parentName || '__________'}</strong>,
          is a bonafide student of our school. He/She is studying in class{' '}
          <strong>{student.className || '__________'}</strong> during the academic year{' '}
          <strong>{new Date().getFullYear()}</strong>.
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.8', marginTop: '20px' }}>
          His/Her date of birth as per school records is <strong>{formatDate(student.dob)}</strong>.
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.8', marginTop: '20px' }}>
          This certificate is issued on request for the purpose of <strong>{certificate.reasonForLeaving || 'submission to concerned authorities'}</strong>.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px' }}>
          <div>
            <p>_________________________</p>
            <p><strong>Principal / Headmaster</strong></p>
          </div>
          <div>
            <p>Date: {formatDate(certificate.issueDate)}</p>
          </div>
        </div>
      </div>
    );
  }

  return <div>No certificate template available.</div>;
};

export default CertificatePage;
