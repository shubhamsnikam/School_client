import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      alert('Error fetching students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.className?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Student deleted successfully');
      fetchStudents();
    } catch (err) {
      alert('Error deleting student');
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editingStudent.aadharNumber && !/^\d{12}$/.test(editingStudent.aadharNumber)) {
      alert('Aadhaar number must be 12 digits.');
      return;
    }
    if (editingStudent.contactNumber && !/^\d{10}$/.test(editingStudent.contactNumber)) {
      alert('Contact number must be 10 digits.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/students/${editingStudent._id}`, editingStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Student updated successfully');
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert('Error updating student');
    }
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="container mt-4">
      <h2 className="text-center">📋 Student List</h2>

      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by name, parent or class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="input-group-append d-flex">
          <button
            className="btn btn-primary ms-2"
            type="button"
            onClick={() => {
              const filtered = students.filter((s) =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.className?.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setFilteredStudents(filtered);
              setCurrentPage(1);
            }}
          >
            Search
          </button>
          <button
            className="btn btn-danger ms-2"
            type="button"
            onClick={() => {
              setSearchTerm('');
              setFilteredStudents(students);
              setCurrentPage(1);
            }}
          >
            Clear
          </button>
        </div>
      </div>


      {currentStudents.length === 0 ? (
        <p className="text-center">No students found.</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table table-bordered table-striped align-middle w-100">
              <thead className="table-dark text-nowrap">
                <tr>
                  <th>Name</th>
                  <th>Parent</th>
                  <th>DOB</th>
                  <th>Class</th>
                  <th>Address</th>
                  <th>Admission</th>
                  <th>Aadhaar</th>
                  <th>Contact</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
                  <tr key={student._id}>
                    <td className="text-break">{student.name}</td>
                    <td className="text-break">{student.parentName}</td>
                    <td>{new Date(student.dob).toLocaleDateString()}</td>
                    <td>{student.className}</td>
                    <td className="text-break">{student.address}</td>
                    <td>{new Date(student.admissionDate).toLocaleDateString()}</td>
                    <td>{student.aadharNumber}</td>
                    <td>{student.contactNumber}</td>
                    <td className="text-nowrap text-center">
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(student)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* Pagination */}
          <nav className="mt-3">
            <ul className="pagination justify-content-center flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* Edit Modal */}
      {showModal && editingStudent && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <form onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Student</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label>Name</label>
                    <input type="text" name="name" className="form-control" value={editingStudent.name} onChange={handleEditChange} required />
                  </div>
                  <div className="col-md-6">
                    <label>Parent Name</label>
                    <input type="text" name="parentName" className="form-control" value={editingStudent.parentName || ''} onChange={handleEditChange} />
                  </div>
                  <div className="col-md-6">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" className="form-control" value={editingStudent.dob?.substring(0, 10)} onChange={handleEditChange} required />
                  </div>
                  <div className="col-md-6">
                    <label>Class</label>
                    <input type="text" name="className" className="form-control" value={editingStudent.className} onChange={handleEditChange} required />
                  </div>
                  <div className="col-12">
                    <label>Address</label>
                    <input type="text" name="address" className="form-control" value={editingStudent.address} onChange={handleEditChange} required />
                  </div>
                  <div className="col-md-6">
                    <label>Admission Date</label>
                    <input type="date" name="admissionDate" className="form-control" value={editingStudent.admissionDate?.substring(0, 10)} onChange={handleEditChange} required />
                  </div>
                  <div className="col-md-6">
                    <label>Aadhaar Number</label>
                    <input type="text" name="aadharNumber" className="form-control" value={editingStudent.aadharNumber || ''} onChange={handleEditChange} />
                  </div>
                  <div className="col-md-6">
                    <label>Contact Number</label>
                    <input type="text" name="contactNumber" className="form-control" value={editingStudent.contactNumber || ''} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
