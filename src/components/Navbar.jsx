import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, UserRound, X } from "lucide-react";
import ragasLogo from "../assets/ragas-logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isUserLoggedIn =
    localStorage.getItem("ragasUserLoggedIn") === "true" ||
    sessionStorage.getItem("ragasUserLoggedIn") === "true";
  const savedUser =
    localStorage.getItem("ragasUser") ||
    sessionStorage.getItem("ragasUser");
  let user = null;
  let userName = "Profile";

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
    userName = user?.fullName || user?.name || user?.email || "Profile";
  } catch {
    userName = "Profile";
  }
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      setMobileMenuOpen(false);
      setMobileDropdown(null);
      setDesktopDropdown(null);
      navigate(`/#${id}`);
      return;
    }

    const section = document.getElementById(id);
    if (!section) {
      console.warn(`Section #${id} not found`);
      return;
    }

    setActiveSection(id);
    setMobileMenuOpen(false);
    setMobileDropdown(null);
    setDesktopDropdown(null);

    setTimeout(() => {
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 0;

      const sectionTop =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({
        top: Math.max(0, sectionTop),
        behavior: "smooth",
      });
    }, 50);
  };

  const toggleMobileDropdown = (name) => {
    setMobileDropdown((prev) => (prev === name ? null : name));
  };

  const toggleDesktopDropdown = (name) => {
    setDesktopDropdown((prev) => (prev === name ? null : name));
  };

  const handleLogout = () => {
    [localStorage, sessionStorage].forEach((storage) => {
      storage.removeItem("ragasUserToken");
      storage.removeItem("ragasUserLoggedIn");
      storage.removeItem("ragasUser");
    });

    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const sectionIds = [
      "home",
      "about",
      "services",
      "international-jobs",
      "domestic-jobs",
      "industries",
      "current-openings",
      "employers",
      "job-seekers",
      "upload-resume",
      "post-a-job",
      "partner-with-us",
      "recruitment-process",
      "visa-immigration",
      "blog",
      "testimonials",
      "contact",
      "careers",
    ];

    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 80;

      let current = "home";
      let smallestDistance = Infinity;

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - navbarHeight);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          current = id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".navbar-dropdown, .navbar-profile-menu")) {
        setDesktopDropdown(null);
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () =>
      document.removeEventListener("click", handleOutsideClick);
  }, []);

  const servicesActive = [
    "services",
    "international-jobs",
    "domestic-jobs",
    "recruitment-process",
    "visa-immigration",
  ].includes(activeSection);

  const jobsActive = [
    "international-jobs",
    "domestic-jobs",
    "current-openings",
  ].includes(activeSection);

  const candidatesActive = [
    "job-seekers",
    "upload-resume",
  ].includes(activeSection);

  const employersActive = [
    "employers",
    "post-a-job",
    "partner-with-us",
  ].includes(activeSection);

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
        >
          <img
            src={ragasLogo}
            alt="RAGAS Career World"
            className="navbar-logo-image"
          />

          <div className="navbar-brand-text">
            <span className="logo-title">RAGAS</span>
            <span className="logo-subtitle">CAREER WORLD</span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="navbar-links">

          <a
            href="#home"
            className={activeSection === "home" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            Home
          </a>

          <a
            href="#about"
            className={activeSection === "about" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
          >
            About
          </a>

          {/* SERVICES DROPDOWN */}
          <div
            className={`navbar-dropdown ${
              desktopDropdown === "services"
                ? "dropdown-open"
                : ""
            }`}
          >
            <button
              type="button"
              className={`services-button ${
                servicesActive ? "active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDesktopDropdown("services");
              }}
            >
              Services
              <ChevronDown
                size={15}
                className={
                  desktopDropdown === "services"
                    ? "rotate-arrow"
                    : ""
                }
              />
            </button>

            {desktopDropdown === "services" && (
              <div className="dropdown-menu">
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("services");
                  }}
                >
                  Recruitment Services
                </a>

                <a
                  href="#international-jobs"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("international-jobs");
                  }}
                >
                  International Jobs
                </a>

                <a
                  href="#domestic-jobs"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("domestic-jobs");
                  }}
                >
                  Domestic Jobs
                </a>

                <a
                  href="#recruitment-process"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("recruitment-process");
                  }}
                >
                  Recruitment Process
                </a>

                <a
                  href="#visa-immigration"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("visa-immigration");
                  }}
                >
                  Visa Support
                </a>
              </div>
            )}
          </div>

          {/* JOBS DROPDOWN */}
          <div
            className={`navbar-dropdown ${
              desktopDropdown === "jobs"
                ? "dropdown-open"
                : ""
            }`}
          >
            <button
              type="button"
              className={jobsActive ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                toggleDesktopDropdown("jobs");
              }}
            >
              Jobs
              <ChevronDown
                size={15}
                className={
                  desktopDropdown === "jobs"
                    ? "rotate-arrow"
                    : ""
                }
              />
            </button>

            {desktopDropdown === "jobs" && (
              <div className="dropdown-menu">
                <a
                  href="#international-jobs"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("international-jobs");
                  }}
                >
                  International Jobs
                </a>

                <a
                  href="#domestic-jobs"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("domestic-jobs");
                  }}
                >
                  Domestic Jobs
                </a>

                <a
                  href="/current-openings"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/current-openings");
                  }}
                >
                  Current Openings
                </a>
              </div>
            )}
          </div>

          <a
            href="#industries"
            className={
              activeSection === "industries"
                ? "active"
                : ""
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("industries");
            }}
          >
            Industries
          </a>

          {/* CANDIDATES DROPDOWN */}
          <div
            className={`navbar-dropdown ${
              desktopDropdown === "candidates"
                ? "dropdown-open"
                : ""
            }`}
          >
            <button
              type="button"
              className={candidatesActive ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                toggleDesktopDropdown("candidates");
              }}
            >
              Candidates
              <ChevronDown
                size={15}
                className={
                  desktopDropdown === "candidates"
                    ? "rotate-arrow"
                    : ""
                }
              />
            </button>

            {desktopDropdown === "candidates" && (
              <div className="dropdown-menu">
                <a
                  href="#job-seekers"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("job-seekers");
                  }}
                >
                  For Candidates
                </a>

                <a
                  href="#upload-resume"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("upload-resume");
                  }}
                >
                  Upload Resume
                </a>
              </div>
            )}
          </div>

          {/* EMPLOYERS DROPDOWN */}
          <div
            className={`navbar-dropdown ${
              desktopDropdown === "employers"
                ? "dropdown-open"
                : ""
            }`}
          >
            <button
              type="button"
              className={employersActive ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                toggleDesktopDropdown("employers");
              }}
            >
              Employers
              <ChevronDown
                size={15}
                className={
                  desktopDropdown === "employers"
                    ? "rotate-arrow"
                    : ""
                }
              />
            </button>

            {desktopDropdown === "employers" && (
              <div className="dropdown-menu">
                <a
                  href="#employers"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("employers");
                  }}
                >
                  For Employers
                </a>

                <a
                  href="/post-a-job"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/post-a-job");
                  }}
                >
                  Post a Job
                </a>

                <a
                  href="#partner-with-us"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("partner-with-us");
                  }}
                >
                  Partner With Us
                </a>
              </div>
            )}
          </div>

          <a
            href="#blog"
            className={activeSection === "blog" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("blog");
            }}
          >
            Blog
          </a>

          <a
            href="#testimonials"
            className={
              activeSection === "testimonials"
                ? "active"
                : ""
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("testimonials");
            }}
          >
            Testimonials
          </a>

          <a
            href="#careers"
            className={
              activeSection === "careers" ? "active" : ""
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("careers");
            }}
          >
            Careers
          </a>

          <a
            href="#contact"
            className={
              activeSection === "contact" ? "active" : ""
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            Contact
          </a>
        </nav>

        <div className="navbar-actions">
          {/* DESKTOP CTA */}
          <button
            type="button"
            className="navbar-cta"
            onClick={() => scrollToSection("job-seekers")}
          >
            Get Started
          </button>

          {isUserLoggedIn && (
            <div className="navbar-profile-menu">
              <button
                type="button"
                className="navbar-profile"
                onClick={() => setProfileOpen((isOpen) => !isOpen)}
                aria-label="Open profile details"
                aria-expanded={profileOpen}
              >
                {userName.charAt(0).toUpperCase()}
              </button>

              {profileOpen && (
                <div className="navbar-profile-dropdown">
                  <div className="navbar-profile-heading">
                    <UserRound size={18} aria-hidden="true" />
                    <strong>{userName}</strong>
                  </div>
                  <p><span>Email</span>{user?.email || "Not available"}</p>
                  <p><span>Phone</span>{user?.phone || user?.phoneNumber || "Not available"}</p>
                  <button
                    type="button"
                    className="navbar-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => {
            setMobileMenuOpen((prev) => !prev);
            setMobileDropdown(null);
            setDesktopDropdown(null);
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          mobileMenuOpen ? "mobile-menu-open" : ""
        }`}
      >
        <a
          href="#home"
          className={
            activeSection === "home" ? "active" : ""
          }
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
        >
          Home
        </a>

        <a
          href="#about"
          className={
            activeSection === "about" ? "active" : ""
          }
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("about");
          }}
        >
          About
        </a>

        <div className="mobile-dropdown">
          <button
            type="button"
            onClick={() =>
              toggleMobileDropdown("services")
            }
          >
            Services
            <ChevronDown
              size={17}
              className={
                mobileDropdown === "services"
                  ? "rotate-arrow"
                  : ""
              }
            />
          </button>

          {mobileDropdown === "services" && (
            <div className="mobile-submenu">
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                }}
              >
                Recruitment Services
              </a>

              <a
                href="#international-jobs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("international-jobs");
                }}
              >
                International Jobs
              </a>

              <a
                href="#domestic-jobs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("domestic-jobs");
                }}
              >
                Domestic Jobs
              </a>

              <a
                href="#recruitment-process"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("recruitment-process");
                }}
              >
                Recruitment Process
              </a>

              <a
                href="#visa-immigration"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("visa-immigration");
                }}
              >
                Visa Support
              </a>
            </div>
          )}
        </div>

        <div className="mobile-dropdown">
          <button
            type="button"
            onClick={() => toggleMobileDropdown("jobs")}
          >
            Jobs
            <ChevronDown
              size={17}
              className={
                mobileDropdown === "jobs"
                  ? "rotate-arrow"
                  : ""
              }
            />
          </button>

          {mobileDropdown === "jobs" && (
            <div className="mobile-submenu">
              <a
                href="#international-jobs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("international-jobs");
                }}
              >
                International Jobs
              </a>

              <a
                href="#domestic-jobs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("domestic-jobs");
                }}
              >
                Domestic Jobs
              </a>

              <a
                href="/current-openings"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/current-openings");
                }}
              >
                Current Openings
              </a>
            </div>
          )}
        </div>

        <a
          href="#industries"
          className={
            activeSection === "industries"
              ? "active"
              : ""
          }
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("industries");
          }}
        >
          Industries
        </a>

        <div className="mobile-dropdown">
          <button
            type="button"
            onClick={() =>
              toggleMobileDropdown("candidates")
            }
          >
            Candidates
            <ChevronDown
              size={17}
              className={
                mobileDropdown === "candidates"
                  ? "rotate-arrow"
                  : ""
              }
            />
          </button>

          {mobileDropdown === "candidates" && (
            <div className="mobile-submenu">
              <a
                href="#job-seekers"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("job-seekers");
                }}
              >
                For Candidates
              </a>

              <a
                href="#upload-resume"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("upload-resume");
                }}
              >
                Upload Resume
              </a>
            </div>
          )}
        </div>

        <div className="mobile-dropdown">
          <button
            type="button"
            onClick={() =>
              toggleMobileDropdown("employers")
            }
          >
            Employers
            <ChevronDown
              size={17}
              className={
                mobileDropdown === "employers"
                  ? "rotate-arrow"
                  : ""
              }
            />
          </button>

          {mobileDropdown === "employers" && (
            <div className="mobile-submenu">
              <a
                href="#employers"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("employers");
                }}
              >
                For Employers
              </a>

              <a
                href="/post-a-job"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/post-a-job");
                }}
              >
                Post a Job
              </a>

              <a
                href="#partner-with-us"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("partner-with-us");
                }}
              >
                Partner With Us
              </a>
            </div>
          )}
        </div>

        <a
          href="#blog"
          className={
            activeSection === "blog" ? "active" : ""
          }
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("blog");
          }}
        >
          Blog
        </a>

        <a
          href="#testimonials"
          className={
            activeSection === "testimonials"
              ? "active"
              : ""
          }
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("testimonials");
          }}
        >
          Testimonials
        </a>

        <a
          href="#careers"
          className={
            activeSection === "careers" ? "active" : ""
          }
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("careers");
          }}
        >
          Careers
        </a>

        <a
          href="#contact"
          className={
            activeSection === "contact" ? "active" : ""
          }
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("contact");
          }}
        >
          Contact
        </a>

        <button
          type="button"
          className="mobile-get-started"
          onClick={() =>
            scrollToSection("job-seekers")
          }
        >
          Get Started
        </button>
      </div>
    </header>
  );
}

export default Navbar;
