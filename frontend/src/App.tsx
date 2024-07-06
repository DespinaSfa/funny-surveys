import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import SelectTemplate from "./pages/SelectTemplate";
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './context/ProtectedRoute';
import Results from "./pages/Results";
import Polls from './pages/Polls';
import PageNotFound from './pages/PageNotFound';
import Templates from './pages/Templates';

export default function App() {
  return (
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<Login />} />
              <Route path="polls/:id" element={<Polls />} />
              <Route path="results/:id" element={<Results />} />
              <Route path="*" element={<PageNotFound />} />

              <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
              />
              <Route
                  path="select-template"
                  element={
                    <ProtectedRoute>
                      <SelectTemplate />
                    </ProtectedRoute>
                  }
              />
              <Route
                  path="template/:pollType"
                  element={
                    <ProtectedRoute>
                      <Templates />
                    </ProtectedRoute>
                  }
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
  );
}
