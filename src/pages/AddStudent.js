import React, { useState } from 'react';
import axios from 'axios';
import './AddStudent.css'; // Import the CSS

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: '',
    parentName: '',
    dob: '',
    className: '',
    address: '',
    admissionDate: '',
    aadharNumber: '',
    contactNumber: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/students`, student, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Student added successfully!');
      setStudent({
        name: '',
        parentName: '',
        dob: '',
        className: '',
        address: '',
        admissionDate: '',
        aadharNumber: '',
        contactNumber: '',
      });
    } catch (err) {
      alert('❌ Failed to add student');
    }
  };

  return (
    <div className="student-bg d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg rounded-4 w-100" style={{ maxWidth: '750px', backgroundColor: '#ffffffcc' }}>
        <h3 className="text-center text-primary mb-4">
          <i className="fas fa-user-graduate me-2"></i>Student Admission Form
        </h3>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Form Fields */}
          <div className="col-md-6">
            <label className="form-label"><i className="fas fa-user me-1"></i> Full Name</label>
            <input type="text" className="form-control rounded-3" value={student.name}
              onChange={(e) => setStudent({ ...student, name: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label"><i className="fas fa-users me-1"></i> Parent Name</label>
            <input type="text" className="form-control rounded-3" value={student.parentName}
              onChange={(e) => setStudent({ ...student, parentName: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label"><i className="fas fa-calendar-alt me-1"></i> DOB</label>
            <input type="date" className="form-control rounded-3" value={student.dob}
              onChange={(e) => setStudent({ ...student, dob: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label"><i className="fas fa-graduation-cap me-1"></i> Class</label>
            <input type="text" className="form-control rounded-3" value={student.className}
              onChange={(e) => setStudent({ ...student, className: e.target.value })} required />
          </div>
          <div className="col-12">
            <label className="form-label"><i className="fas fa-map-marker-alt me-1"></i> Address</label>
            <input type="text" className="form-control rounded-3" value={student.address}
              onChange={(e) => setStudent({ ...student, address: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label"><i className="fas fa-calendar-check me-1"></i> Admission Date</label>
            <input type="date" className="form-control rounded-3" value={student.admissionDate}
              onChange={(e) => setStudent({ ...student, admissionDate: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label"><i className="fas fa-id-card me-1"></i> Aadhaar Number</label>
            <input type="text" className="form-control rounded-3" value={student.aadharNumber}
              onChange={(e) => setStudent({ ...student, aadharNumber: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label"><i className="fas fa-phone me-1"></i> Contact Number</label>
            <input type="text" className="form-control rounded-3" value={student.contactNumber}
              onChange={(e) => setStudent({ ...student, contactNumber: e.target.value })} required />
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-outline-primary btn-lg px-5 mt-3 rounded-pill">
              <i className="fas fa-paper-plane me-2"></i>Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
