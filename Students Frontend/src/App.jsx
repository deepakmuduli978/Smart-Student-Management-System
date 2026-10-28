import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Student from './pages/Students';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import Fees from './pages/Fees';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import RegistrationApproval from './pages/RegistrationApproval';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/student-dashboard" element={<StudentDashboard />}/>
        <Route path="/fees" element={<Fees />} />
        <Route path="/results" element={<Results />} />
        <Route path='/registration-approve' element={<RegistrationApproval/>}/>
        <Route path='/students' element={<Student />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/attendance" element={<Attendance/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;