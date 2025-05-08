import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { PrivateRoute } from "./routes/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import AddJobPage from "./pages/AddJobPage";
import JobListPage from "./pages/JobListPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <div>
      {user && <Navbar />}
      <main
        className={`min-h-screen bg-gradient-to-br from-indigo-50 to-white ${
          user ? "pt-16" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}

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
            path="/job/:jobId"
            element={
              <PrivateRoute>
                <JobDetailsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
