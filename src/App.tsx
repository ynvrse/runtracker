import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/Home";
import RunTrackingPage from "./features/run-tracking/RunTrackingPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="run-tracker-theme">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracking" element={<RunTrackingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
