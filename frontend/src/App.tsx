import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TaskListPage from "./pages/TaskListPage";
import MainPage from "./pages/MainPage";

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({
  element,
}) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/register" />;
  }
  return <>{element}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/" element={<ProtectedRoute element={<div>Dashboard</div>} />} /> */}
          <Route path="/" element={<MainPage />} />
          <Route path="/task-list/:id" element={<TaskListPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
