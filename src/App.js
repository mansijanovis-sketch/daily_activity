import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Dashboard from './pages/dashboard.jsx';
import Login from './pages/login.jsx';
import Registration from './pages/registration.jsx';
import Activities from './pages/activities.jsx';
import Calendar from './pages/calendar.jsx';
import Analytics from './pages/analytics.jsx';
import History from './pages/history.jsx';
import Profile from './pages/profile.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login  />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
