import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

/* =========================================
   PUBLIC WEBSITE
========================================= */

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import InternationalJobs from "./pages/InternationalJobs";
import DomesticJobs from "./pages/DomesticJobs";
import Industries from "./pages/Industries";
import CurrentOpenings from "./pages/CurrentOpenings";
import Employers from "./pages/Employers";
import JobSeekers from "./pages/JobSeekers";
import UploadResume from "./pages/UploadResume";
import PostAJob from "./pages/PostAJob";
import PartnerWithUs from "./pages/PartnerWithUs";
import RecruitmentProcess from "./pages/RecruitmentProcess";
import VisaSupport from "./pages/VisaSupport";
import Blog from "./pages/Blog";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";

import JobApplication from "./pages/JobApplication";
import EmployerRegistration from "./pages/EmployerRegistration";

import UserLogin from "./pages/UserLogin";
import ForgotPassword from "./pages/ForgotPassword";
import UserRegistration from "./pages/UserRegistration";

import ApplicationStatus from "./components/ApplicationStatus";

import PartnerLogin from "./pages/PartnerLogin";

/* =========================================
   ADMIN PANEL
========================================= */

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";

import Dashboard from "./admin/Dashboard";
import ChatbotLogs from "./admin/ChatbotLogs";
import ChatbotLogDetails from "./admin/ChatbotLogDetails";
import Candidates from "./admin/Candidates";
import CandidateDetails from "./admin/CandidateDetails";
import Jobs from "./admin/Jobs";
import JobDetails from "./admin/JobDetails";
import Resumes from "./admin/Resumes";
import ResumeDetails from "./admin/ResumeDetails";
import Partners from "./admin/Partners";
import Applications from "./admin/Applications";
import ApplicationDetails from "./admin/ApplicationDetails";
import ContactMessages from "./admin/ContactMessages";
import ContactMessageDetails from "./admin/ContactMessageDetails";
import AddCandidate from "./admin/AddCandidate";

/* Employee management inside Admin */
import AdminEmployees from "./admin/Employers";
import AddEmployee from "./admin/AddEmployee";
import EmployeeDetails from "./admin/EmployerDetails";

/* =========================================
   PARTNER PANEL
========================================= */

import PartnerLayout from "./partner/PartnerLayout";
import PartnerDashboard from "./partner/PartnerDashboard";
import PartnerPostJob from "./partner/PartnerPostJob";
import PartnerJobs from "./partner/PartnerJobs";
import PartnerJobDetails from "./partner/PartnerJobDetails";
import PartnerApplications from "./partner/PartnerApplication";
import PartnerApplicationDetails from "./partner/PartnerApplicationDetails";
import PartnerProfile from "./partner/PartnerProfile";

/* =========================================
   EMPLOYEE PANEL
========================================= */

import EmployeeLogin from "./pages/EmployeeLogin";

import EmployeeLayout from "./employee/EmployeeLayout";

import EmployeeDashboard from "./employee/EmployeeDashboard";
import EmployeeJobs from "./employee/EmployeeJobs";
import EmployeePostJob from "./employee/EmployeePostJob";
import EmployeeApplications from "./employee/EmployeeApplications";
import EmployeeCandidates from "./employee/EmployeeCandidates";
import EmployeeProfile from "./employee/EmployeeProfile";
import EmployeeJobDetails from "./employee/EmployeeJobDetails";
import EmployeeApplicationDetails from "./employee/EmployeeApplicationDetails";
import EmployeeCandidateDetails from "./employee/EmployeeCandidateDetails";

/* =========================================
   SCROLL MANAGER
========================================= */

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [
    location.pathname,
    location.search,
    location.hash,
  ]);

  return null;
}

/* =========================================
   USER PROTECTED ROUTE
========================================= */

function ProtectedRoute({ children }) {
  const location = useLocation();

  const token =
    localStorage.getItem("ragasUserToken") ||
    sessionStorage.getItem("ragasUserToken");

  let isLoggedIn = false;

  if (token) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      isLoggedIn =
        !payload.exp ||
        payload.exp * 1000 >= Date.now();
    } catch (error) {
      console.error(
        "Invalid user token:",
        error
      );

      isLoggedIn = false;
    }
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/user-login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

/* =========================================
   ADMIN PROTECTED ROUTE
========================================= */

function AdminRoute() {
  const token =
    localStorage.getItem("ragasAdminToken");

  const isLoggedIn =
    localStorage.getItem(
      "ragasAdminLoggedIn"
    ) === "true";

  let admin = null;

  try {
    const savedAdmin =
      localStorage.getItem("ragasAdmin");

    if (savedAdmin) {
      admin = JSON.parse(savedAdmin);
    }
  } catch (error) {
    console.error(
      "Invalid admin data:",
      error
    );

    localStorage.removeItem("ragasAdmin");
    localStorage.removeItem(
      "ragasAdminToken"
    );
    localStorage.removeItem(
      "ragasAdminLoggedIn"
    );
    localStorage.removeItem(
      "ragasUserRole"
    );

    admin = null;
  }

  const isAdmin =
    isLoggedIn &&
    !!token &&
    admin?.role === "admin";

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <AdminLayout />;
}

/* =========================================
   PARTNER PROTECTED ROUTE
========================================= */

function PartnerRoute() {
  const token =
    localStorage.getItem(
      "ragasPartnerToken"
    );

  const isLoggedIn =
    localStorage.getItem(
      "ragasPartnerLoggedIn"
    ) === "true";

  let partner = null;

  try {
    const savedPartner =
      localStorage.getItem("ragasPartner");

    if (savedPartner) {
      partner = JSON.parse(savedPartner);
    }
  } catch (error) {
    console.error(
      "Invalid partner data:",
      error
    );

    localStorage.removeItem(
      "ragasPartner"
    );

    localStorage.removeItem(
      "ragasPartnerToken"
    );

    localStorage.removeItem(
      "ragasPartnerLoggedIn"
    );

    partner = null;
  }

  const isPartner =
    isLoggedIn &&
    !!token &&
    partner?.role === "partner";

  if (!isPartner) {
    return (
      <Navigate
        to="/partner-login"
        replace
      />
    );
  }

  return <PartnerLayout />;
}

/* =========================================
   EMPLOYEE PROTECTED ROUTE
========================================= */

function EmployeeRoute() {
  const token =
    localStorage.getItem(
      "ragasEmployeeToken"
    );

  const isLoggedIn =
    localStorage.getItem(
      "ragasEmployeeLoggedIn"
    ) === "true";

  let employee = null;

  try {
    const savedEmployee =
      localStorage.getItem(
        "ragasEmployee"
      );

    if (savedEmployee) {
      employee = JSON.parse(savedEmployee);
    }
  } catch (error) {
    console.error(
      "Invalid employee data:",
      error
    );

    localStorage.removeItem(
      "ragasEmployee"
    );

    localStorage.removeItem(
      "ragasEmployeeToken"
    );

    localStorage.removeItem(
      "ragasEmployeeLoggedIn"
    );

    localStorage.removeItem(
      "ragasUserRole"
    );

    employee = null;
  }

  const isEmployee =
    isLoggedIn &&
    !!token &&
    employee?.role === "employee";

  if (!isEmployee) {
    return (
      <Navigate
        to="/employee-login"
        replace
      />
    );
  }

  return <Outlet />;
}

/* =========================================
   PUBLIC WEBSITE
========================================= */

function PublicWebsite() {
  const location = useLocation();

  const hidePublicShell =
    location.pathname === "/user-login" ||
    location.pathname === "/user-registration";

  return (
    <>
      {!hidePublicShell && <Navbar />}

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* SERVICES */}
        <Route
          path="/services"
          element={<Services />}
        />

        {/* INTERNATIONAL JOBS */}
        <Route
          path="/international-jobs"
          element={<InternationalJobs />}
        />

        {/* DOMESTIC JOBS */}
        <Route
          path="/domestic-jobs"
          element={<DomesticJobs />}
        />

        {/* INDUSTRIES */}
        <Route
          path="/industries"
          element={<Industries />}
        />

        {/* CURRENT OPENINGS */}
        <Route
          path="/current-openings"
          element={<CurrentOpenings />}
        />

        {/* PUBLIC EMPLOYERS PAGE */}
        <Route
          path="/employers"
          element={<Employers />}
        />

        {/* JOB SEEKERS */}
        <Route
          path="/job-seekers"
          element={<JobSeekers />}
        />

        {/* UPLOAD RESUME */}
        <Route
          path="/upload-resume"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />

        {/* POST A JOB */}
        <Route
          path="/post-a-job"
          element={
            <ProtectedRoute>
              <PostAJob />
            </ProtectedRoute>
          }
        />

        {/* PARTNER WITH US */}
        <Route
          path="/partner-with-us"
          element={<PartnerWithUs />}
        />

        {/* RECRUITMENT PROCESS */}
        <Route
          path="/recruitment-process"
          element={<RecruitmentProcess />}
        />

        {/* VISA SUPPORT */}
        <Route
          path="/visa-support"
          element={<VisaSupport />}
        />

        {/* BLOG */}
        <Route
          path="/blog"
          element={<Blog />}
        />

        {/* TESTIMONIALS */}
        <Route
          path="/testimonials"
          element={<Testimonials />}
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* CAREERS */}
        <Route
          path="/careers"
          element={<Careers />}
        />

        {/* APPLICATION STATUS */}
        <Route
          path="/application-status"
          element={
            <ProtectedRoute>
              <ApplicationStatus />
            </ProtectedRoute>
          }
        />

        {/* USER LOGIN */}
        <Route
          path="/user-login"
          element={<UserLogin />}
        />

        {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* USER REGISTRATION */}
        <Route
          path="/user-registration"
          element={<UserRegistration />}
        />

        {/* PARTNER LOGIN */}
        <Route
          path="/partner-login"
          element={<PartnerLogin />}
        />

        {/* JOB APPLICATION */}
        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute>
              <JobApplication />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYER REGISTRATION */}
        <Route
          path="/employer-registration"
          element={
            <ProtectedRoute>
              <EmployerRegistration />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hidePublicShell && <Chatbot />}
      {!hidePublicShell && <Footer />}
    </>
  );
}

/* =========================================
   ADMIN WEBSITE
========================================= */

function AdminWebsite() {
  return (
    <Routes>
      {/* ADMIN LOGIN */}
      <Route
        path="login"
        element={<AdminLogin />}
      />

      {/* ADMIN REGISTER DISABLED */}
      <Route
        path="register"
        element={
          <Navigate
            to="/admin/login"
            replace
          />
        }
      />

      {/* PROTECTED ADMIN AREA */}
      <Route element={<AdminRoute />}>
        {/* DASHBOARD */}
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        {/* CHATBOT */}
        <Route
          path="chatbot-logs"
          element={<ChatbotLogs />}
        />

        <Route
          path="chatbot-logs/:id"
          element={<ChatbotLogDetails />}
        />

        {/* CANDIDATES */}
        <Route
          path="candidates"
          element={<Candidates />}
        />

        <Route
          path="candidates/:id"
          element={<CandidateDetails />}
        />

        {/* JOBS */}
        <Route
          path="jobs"
          element={<Jobs />}
        />

        <Route
          path="jobs/:id"
          element={<JobDetails />}
        />

        {/* RESUMES */}
        <Route
          path="resumes"
          element={<Resumes />}
        />

        <Route
          path="resumes/:id"
          element={<ResumeDetails />}
        />

        {/* PARTNERS */}
        <Route
          path="partners"
          element={<Partners />}
        />

        {/* APPLICATIONS */}
        <Route
          path="applications"
          element={<Applications />}
        />

        <Route
          path="applications/:id"
          element={<ApplicationDetails />}
        />

        {/* CONTACT MESSAGES */}
        <Route
          path="contact-messages"
          element={<ContactMessages />}
        />

        <Route
          path="contact-messages/:id"
          element={<ContactMessageDetails />}
        />

        {/* ADD CANDIDATE */}
        <Route
          path="add-candidate"
          element={<AddCandidate />}
        />

        {/* =================================
            EMPLOYEE MANAGEMENT
        ================================= */}

        {/* NEW EMPLOYEE URL */}
        <Route
          path="employees"
          element={<AdminEmployees />}
        />

        <Route
          path="employees/add"
          element={<AddEmployee />}
        />

        <Route
          path="employees/:id"
          element={<EmployeeDetails />}
        />

        {/* =================================
            OLD EMPLOYER URLS
            KEPT FOR COMPATIBILITY
        ================================= */}

        <Route
          path="employers"
          element={<AdminEmployees />}
        />

        <Route
          path="employers/add"
          element={<AddEmployee />}
        />

        <Route
          path="employers/:id"
          element={<EmployeeDetails />}
        />
      </Route>
    </Routes>
  );
}

/* =========================================
   PARTNER WEBSITE
========================================= */

function PartnerWebsite() {
  return (
    <Routes>
      <Route
        path="/"
        element={<PartnerRoute />}
      >
        {/* DASHBOARD */}
        <Route
          index
          element={<PartnerDashboard />}
        />

        {/* POST JOB */}
        <Route
          path="post-job"
          element={<PartnerPostJob />}
        />

        {/* JOBS */}
        <Route
          path="jobs"
          element={<PartnerJobs />}
        />

        {/* JOB DETAILS */}
        <Route
          path="jobs/:id"
          element={<PartnerJobDetails />}
        />

        {/* APPLICATIONS */}
        <Route
          path="applications"
          element={<PartnerApplications />}
        />

        {/* APPLICATION DETAILS */}
        <Route
          path="applications/:id"
          element={
            <PartnerApplicationDetails />
          }
        />

        {/* PROFILE */}
        <Route
          path="profile"
          element={<PartnerProfile />}
        />
      </Route>
    </Routes>
  );
}

/* =========================================
   EMPLOYEE WEBSITE
========================================= */

function EmployeeWebsite() {
  return (
    <Routes>
      <Route
        path="/"
        element={<EmployeeRoute />}
      >
        {/* COMMON EMPLOYEE LAYOUT */}
        <Route element={<EmployeeLayout />}>
          {/* DASHBOARD */}
          <Route
            index
            element={<EmployeeDashboard />}
          />

          {/* MY JOBS */}
          <Route
            path="jobs"
            element={<EmployeeJobs />}
          />

          {/* POST A JOB */}
          <Route
            path="post-job"
            element={<EmployeePostJob />}
          />

          {/* JOB DETAILS */}
          <Route
            path="jobs/:id"
            element={<EmployeeJobDetails />}
          />

          {/* APPLICATIONS */}
          <Route
            path="applications"
            element={<EmployeeApplications />}
          />

          {/* APPLICATION DETAILS */}
          <Route
            path="applications/:id"
            element={
              <EmployeeApplicationDetails />
            }
          />

          {/* CANDIDATES */}
          <Route
            path="candidates"
            element={<EmployeeCandidates />}
          />

          {/* CANDIDATE DETAILS */}
          <Route
            path="candidates/:id"
            element={
              <EmployeeCandidateDetails />
            }
          />

          {/* PROFILE */}
          <Route
            path="profile"
            element={<EmployeeProfile />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

/* =========================================
   MAIN APP
========================================= */

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />

      <Routes>
        {/* =================================
            ADMIN PANEL
        ================================= */}
        <Route
          path="/admin/*"
          element={<AdminWebsite />}
        />

        {/* =================================
            PARTNER PANEL
        ================================= */}
        <Route
          path="/partner-dashboard/*"
          element={<PartnerWebsite />}
        />

        <Route
          path="/partner/*"
          element={<PartnerWebsite />}
        />

        {/* =================================
            EMPLOYEE LOGIN
        ================================= */}
        <Route
          path="/employee-login"
          element={<EmployeeLogin />}
        />

        {/* =================================
            EMPLOYEE DASHBOARD
        ================================= */}
        <Route
          path="/employee-dashboard/*"
          element={<EmployeeWebsite />}
        />

        {/* =================================
            PUBLIC WEBSITE
        ================================= */}
        <Route
          path="/*"
          element={<PublicWebsite />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;