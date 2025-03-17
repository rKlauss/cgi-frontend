import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlightSearch from "./components/FlightSearch";
import SeatSelection from "./components/SeatSelection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlightSearch />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
