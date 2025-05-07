import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { PrivateRoute } from "./routes/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import AddJobPage from "./pages/AddJobPage";
import JobListPage from "./pages/JobListPage";
import JobDetailsPage from "./pages/JobDetailsPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/add-job"
            element={
              <PrivateRoute>
                <AddJobPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/jobs"
            element={
              <PrivateRoute>
                <JobListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/job/:jobId"
            element={
              <PrivateRoute>
                <JobDetailsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
