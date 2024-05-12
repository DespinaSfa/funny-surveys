import './App.css';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import SelectTemplate from "./pages/SelectTemplate";
import PartyTemplate from "./pages/PartyTemplate";
import RoomTemplate from "./pages/RoomTemplate";
import WeddingTemplate from "./pages/WeddingTemplate";
import PollResultsPageWedding from "./pages/PollResultsPageWedding";
import PollResultsPageParty from "./pages/PollResultsPageParty";
import PollResultsPageRoom from "./pages/PollResultsPageRoom";


export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="selectTemplate" element={<SelectTemplate />} />
          <Route path="selectTemplate/partyTemplate" element={<PartyTemplate />} />
          <Route path="selectTemplate/roomTemplate" element={<RoomTemplate />} />
          <Route path="selectTemplate/weddingTemplate" element={<WeddingTemplate />} />
          <Route path="pollResultsPageWedding" element={<PollResultsPageWedding />} />
          <Route path="pollResultsPageParty" element={<PollResultsPageParty />} />
          <Route path="pollResultsPageRoom" element={<PollResultsPageRoom />} />
        </Route>
      </Routes>
    </div>
  );
}

