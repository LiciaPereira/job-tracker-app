import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { PrivateRoute } from "./routes/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import AddJobPage from "./pages/AddJobPage";
import JobListPage from "./pages/JobListPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import { Layout } from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-job"
            element={
              <PrivateRoute>
                <AddJobPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <PrivateRoute>
                <JobListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs/:jobId"
            element={
              <PrivateRoute>
                <JobDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
