import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Editor from './components/Editor/Editor';
import Login from './components/Login';
import Register from './components/Register';
import Submission from './components/Submission';
import MyAttempts from './components/MyAttempts';
import './App.css';

const DashboardPage = () => (
  <div className="app-container">
    <Navbar />
    <main>
      <Hero />
      <Dashboard />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attempts"
            element={
              <ProtectedRoute>
                <MyAttempts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:problemId"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submission/:submissionId"
            element={
              <ProtectedRoute>
                <Submission />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
