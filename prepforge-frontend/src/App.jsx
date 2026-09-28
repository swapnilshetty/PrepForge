import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Main pages
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Learning pages
import LearnCategories from "./pages/learn/LearnCategories";
import LearnTopics from "./pages/learn/LearnTopics";
import LearnLesson from "./pages/learn/LearnLesson";
import LearnContent from "./pages/learn/LearnContent";

// Coding pages
import CodingList from "./pages/coding/CodingList";
import CodingProblem from "./pages/coding/CodingProblem";

// Interview pages
import InterviewList from "./pages/interviews/InterviewList";
import InterviewDetail from "./pages/interviews/InterviewDetail";

// Authentication pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Authentication protection
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:uidb64/:token"
          element={<ResetPassword />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            {/* Root */}
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* =========================
                LEARNING
            ========================== */}

            <Route
              path="/learn"
              element={<LearnCategories />}
            />

            <Route
              path="/learn/:categorySlug"
              element={<LearnTopics />}
            />

            <Route
              path="/learn/topic/:topicSlug"
              element={<LearnLesson />}
            />

            <Route
              path="/learn/content/:id"
              element={<LearnContent />}
            />


            {/* =========================
                PRACTICE
            ========================== */}

            <Route
              path="/practice"
              element={<Practice />}
            />


            {/* =========================
                CODING
            ========================== */}

            <Route
              path="/coding"
              element={<CodingList />}
            />

            <Route
              path="/coding/:slug"
              element={<CodingProblem />}
            />


            {/* =========================
                INTERVIEWS
            ========================== */}

            <Route
              path="/interviews"
              element={<InterviewList />}
            />

            <Route
              path="/interviews/:id"
              element={<InterviewDetail />}
            />


            {/* =========================
                USER
            ========================== */}

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />


            {/* =========================
                404
            ========================== */}

            <Route
              path="*"
              element={<NotFound />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}