import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/navbar';
import AddExpense from './components/addExpense';
import ExpenseList from './components/expenseList';
import ExpenseChart from './components/expenseChart';
import Login from './pages/Login';
import Register from './pages/Registration';
import ProtectedRoute from './components/protectedRoute';

function AppContent() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('authToken');

  return (
    <>
      {isLoggedIn && location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}
      <Routes>
        <Route path="/" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
        <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
        <Route path="/expense-chart" element={<ProtectedRoute><ExpenseChart /></ProtectedRoute>} />
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;