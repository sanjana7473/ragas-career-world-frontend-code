import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import UserRegistration from "./pages/UserRegistration";

import PartnerLogin from "./pages/PartnerLogin";

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";

import Dashboard from "./admin/Dashboard";
import ChatbotLogs from "./admin/ChatbotLogs";
import ChatbotLogDetails from "./admin/ChatbotLogDetails";
import Candidates from "./admin/Candidates";
import CandidateDetails from "./admin/CandidateDetails";
import EmployerDetails from "./admin/EmployerDetails";
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

// Partner Panel
import PartnerLayout from "./partner/PartnerLayout";
import PartnerDashboard from "./partner/PartnerDashboard";


function ProtectedRoute({ children }) {
  const location = useLocation();
  const isLoggedIn =
    localStorage.getItem("ragasUserLoggedIn") === "true" ||
    sessionStorage.getItem("ragasUserLoggedIn") === "true";

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


function AdminRoute() {
  const token = localStorage.getItem("ragasAdminToken");

  const isLoggedIn =
    localStorage.getItem("ragasAdminLoggedIn") === "true";

  let admin = null;

  try {
    const savedAdmin = localStorage.getItem("ragasAdmin");

    if (savedAdmin) {
      admin = JSON.parse(savedAdmin);
    }
  } catch (error) {
    console.error("Invalid admin data:", error);

    localStorage.removeItem("ragasAdmin");
    localStorage.removeItem("ragasAdminToken");
    localStorage.removeItem("ragasAdminLoggedIn");
    localStorage.removeItem("ragasUserRole");

    admin = null;
  }

  const isAdmin =
    isLoggedIn &&
    !!token &&
    admin?.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout />;
}


function PartnerRoute() {
  const token = localStorage.getItem("ragasPartnerToken");

  const isLoggedIn =
    localStorage.getItem("ragasPartnerLoggedIn") === "true";

  let partner = null;

  try {
    const savedPartner = localStorage.getItem("ragasPartner");

    if (savedPartner) {
      partner = JSON.parse(savedPartner);
    }
  } catch (error) {
    console.error("Invalid partner data:", error);

    localStorage.removeItem("ragasPartner");
    localStorage.removeItem("ragasPartnerToken");
    localStorage.removeItem("ragasPartnerLoggedIn");

    partner = null;
  }

  const isPartner =
    isLoggedIn &&
    !!token &&
    partner?.role === "partner";

  if (!isPartner) {
    return <Navigate to="/partner-login" replace />;
  }

  return <PartnerLayout />;
}


function PublicWebsite() {
  const location = useLocation();
  const hidePublicShell =
    location.pathname === "/user-login" ||
    location.pathname === "/user-registration";

  return (
    <>
      {!hidePublicShell && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/international-jobs" element={<InternationalJobs />} />
        <Route path="/domestic-jobs" element={<DomesticJobs />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/current-openings" element={<CurrentOpenings />} />
        <Route path="/employers" element={<Employers />} />
        <Route path="/job-seekers" element={<JobSeekers />} />
        <Route
          path="/upload-resume"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-a-job"
          element={
            <ProtectedRoute>
              <PostAJob />
            </ProtectedRoute>
          }
        />
        <Route path="/partner-with-us" element={<PartnerWithUs />} />
        <Route path="/recruitment-process" element={<RecruitmentProcess />} />
        <Route path="/visa-support" element={<VisaSupport />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />

        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-registration" element={<UserRegistration />} />

        <Route path="/partner-login" element={<PartnerLogin />} />

        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute>
              <JobApplication />
            </ProtectedRoute>
          }
        />

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


function AdminWebsite() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route element={<AdminRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chatbot-logs" element={<ChatbotLogs />} />
        <Route path="chatbot-logs/:id" element={<ChatbotLogDetails />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/:id" element={<CandidateDetails />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="resumes" element={<Resumes />} />
        <Route path="resumes/:id" element={<ResumeDetails />} />
        <Route path="partners" element={<Partners />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/:id" element={<ApplicationDetails />} />
        <Route path="contact-messages" element={<ContactMessages />} />
        <Route path="contact-messages/:id" element={<ContactMessageDetails />} />
        <Route path="add-candidate" element={<AddCandidate />} />
      </Route>
    </Routes>
  );
}


function PartnerWebsite() {
  return (
    <Routes>
      <Route path="/" element={<PartnerRoute />}>
        <Route index element={<PartnerDashboard />} />

        <Route
          path="post-job"
          element={
            <div>
              Post New Job
            </div>
          }
        />

        <Route
          path="jobs"
          element={
            <div>
              My Jobs
            </div>
          }
        />

        <Route
          path="applications"
          element={
            <div>
              Applications
            </div>
          }
        />

        <Route
          path="profile"
          element={
            <div>
              My Profile
            </div>
          }
        />
      </Route>
    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Panel */}
        <Route path="/admin/*" element={<AdminWebsite />} />

        {/* Partner Panel */}
        <Route
          path="/partner-dashboard/*"
          element={<PartnerWebsite />}
        />

        <Route
          path="/partner/*"
          element={<PartnerWebsite />}
        />

        {/* Public Website */}
        <Route path="/*" element={<PublicWebsite />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;