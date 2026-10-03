import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  FileText,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./EmployeeSidebar.css";
import "./employee-mobile-drawer.css"; // keep this AFTER EmployeeSidebar.css

const navItems = [
  { to: "/employee-dashboard", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/employee-dashboard/jobs", label: "My Jobs", Icon: BriefcaseBusiness, end: true },
  { to: "/employee-dashboard/post-job", label: "Post a Job", Icon: PlusCircle, end: true },
  { to: "/employee-dashboard/applications", label: "Applications", Icon: FileText },
  { to: "/employee-dashboard/candidates", label: "Candidates", Icon: Users },
  { to: "/employee-dashboard/profile", label: "Profile", Icon: UserCircle, end: true },
];

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  let employee = null;

  try {
    const savedEmployee = localStorage.getItem("ragasEmployee");

    if (savedEmployee) {
      employee = JSON.parse(savedEmployee);
    }
  } catch (error) {
    console.error("Unable to read employee data:", error);
  }

  const employeeName = employee?.name || "Employee";
  const employeeRole = employee?.role || "Employee";

  const handleLogout = () => {
    localStorage.removeItem("ragasEmployee");
    localStorage.removeItem("ragasEmployeeToken");
    localStorage.removeItem("ragasEmployeeLoggedIn");
    localStorage.removeItem("ragasUserRole");

    navigate("/employee-login", { replace: true });
  };

  // Close with Escape key + lock page scroll while the drawer is open
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* MOBILE TOP BAR (hidden on desktop by CSS) */}
      <header className="employee-mobile-topbar">
        <button
          type="button"
          className="employee-menu-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu size={20} />
        </button>

        <span className="employee-topbar-title">RAGAS</span>
      </header>

      {/* DARK OVERLAY (tap to close) */}
      <div
        className={`employee-sidebar-overlay ${open ? "show" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside className={`employee-sidebar ${open ? "open" : ""}`}>
        {/* CLOSE BUTTON (mobile only) */}
        <button
          type="button"
          className="employee-sidebar-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        {/* LOGO / BRAND */}
        <div className="employee-sidebar-brand">
          <div className="employee-sidebar-brand-text">
            <h2>RAGAS</h2>
            <span>CAREER WORLD</span>
          </div>
        </div>

        {/* EMPLOYEE INFO */}
        <div className="employee-sidebar-profile">
          <div className="employee-sidebar-avatar">
            {employeeName.charAt(0).toUpperCase()}
          </div>

          <div className="employee-sidebar-user-info">
            <strong>{employeeName}</strong>
            <span>{employeeRole}</span>
          </div>
        </div>

        {/* NAVIGATION (tapping a link closes the drawer) */}
        <nav className="employee-sidebar-nav" onClick={closeMenu}>
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `employee-sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="employee-sidebar-bottom">
          <button
            type="button"
            className="employee-sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default EmployeeSidebar;