import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CertificatePage from './pages/CertificatePage';
import ResultPage from './pages/ResultPage';
import CashbookPage from './pages/CashbookPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import Navbar from './components/Navbar';
import SchoolProject from './components/SchoolProject';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/certificates" element={<CertificatePage />} />
          <Route path="/results" element={<ResultPage />} />
          <Route path="/cashbook" element={<CashbookPage />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/' element={<SchoolProject/>} />
          <Route path="*" element={<h3>Page Not Found</h3>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
