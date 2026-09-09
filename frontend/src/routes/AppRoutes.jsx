import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import MyTasks from "../pages/MyTasks";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/projects/:projectId"
          element={<ProjectDetails />}
        />
        <Route path="/my-tasks" element={<MyTasks />} />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;