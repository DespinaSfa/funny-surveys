import './App.css';
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import SelectTemplate from "./pages/SelectTemplate";
import PartyTemplate from "./pages/PartyTemplate";
import PlanningTemplate from "./pages/PlanningTemplate";
import WeddingTemplate from "./pages/WeddingTemplate";
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './context/ProtectedRoute';
import PollResultsPage from "./pages/PollResultsPage";
import Polls from './pages/Polls';

export default function App() {
  return (
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<Login />} />
              <Route path="polls/:id" element={<Polls />} />
              <Route path="results/:id" element={<PollResultsPage />} />

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
                  path="select-template/party"
                  element={
                    <ProtectedRoute>
                      <PartyTemplate />
                    </ProtectedRoute>
                  }
              />
              <Route
                  path="select-template/planning"
                  element={
                    <ProtectedRoute>
                      <PlanningTemplate />
                    </ProtectedRoute>
                  }
              />
              <Route
                  path="select-template/wedding"
                  element={
                    <ProtectedRoute>
                      <WeddingTemplate />
                    </ProtectedRoute>
                  }
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
  );
}
