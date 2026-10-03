import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  FileText,
  MapPin,
  Save,
  Send,
} from "lucide-react";

import "./EmployeePostJob.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const initialForm = {
  jobTitle: "",
  companyName: "",
  department: "",
  industry: "",
  jobType: "Full-time",
  workMode: "On-site",
  location: "",
  experience: "",
  salaryMin: "",
  salaryMax: "",
  openings: "1",
  deadline: "",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: "",
};

export default function EmployeePostJob() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState(initialForm);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [draftLoading, setDraftLoading] =
    useState(false);

  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  /* =========================================
     VALIDATION
  ========================================= */

  const validateForm = () => {
    if (!form.jobTitle.trim()) {
      return "Job title is required.";
    }

    if (!form.companyName.trim()) {
      return "Company name is required.";
    }

    if (!form.department.trim()) {
      return "Department is required.";
    }

    if (!form.industry.trim()) {
      return "Industry is required.";
    }

    if (!form.location.trim()) {
      return "Location is required.";
    }

    if (!form.experience.trim()) {
      return "Experience is required.";
    }

    if (!form.description.trim()) {
      return "Job description is required.";
    }

    if (!form.responsibilities.trim()) {
      return "Key responsibilities are required.";
    }

    if (!form.requirements.trim()) {
      return "Job requirements are required.";
    }

    if (
      form.openings &&
      Number(form.openings) < 1
    ) {
      return "Number of openings must be at least 1.";
    }

    if (
      form.salaryMin &&
      form.salaryMax &&
      form.salaryMin.trim() &&
      form.salaryMax.trim()
    ) {
      // No numeric comparison here because
      // salary values may contain text such as ₹10 LPA.
    }

    return "";
  };

  /* =========================================
     SUBMIT JOB
  ========================================= */

  const submitJob = async (
    event,
    requestedStatus
  ) => {
    if (event) {
      event.preventDefault();
    }

    const validationError =
      validateForm();

    /*
      Drafts can also be saved with partially
      completed information.
    */
    if (
      requestedStatus !== "Draft" &&
      validationError
    ) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    const token =
      localStorage.getItem(
        "ragasEmployeeToken"
      );

    if (!token) {
      setMessage(
        "Employee authentication required. Please log in again."
      );

      setMessageType("error");

      return;
    }

    try {
      if (requestedStatus === "Draft") {
        setDraftLoading(true);
      } else {
        setLoading(true);
      }

      setMessage("");
      setMessageType("");

      const response = await fetch(
        `${API_BASE_URL}/api/employee/jobs`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            jobTitle:
              form.jobTitle,

            companyName:
              form.companyName,

            department:
              form.department,

            industry:
              form.industry,

            jobType:
              form.jobType,

            workMode:
              form.workMode,

            location:
              form.location,

            experience:
              form.experience,

            salaryMin:
              form.salaryMin,

            salaryMax:
              form.salaryMax,

            openings:
              form.openings,

            deadline:
              form.deadline,

            description:
              form.description,

            responsibilities:
              form.responsibilities,

            requirements:
              form.requirements,

            skills:
              form.skills,

            status:
              requestedStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to submit job."
        );
      }

      setMessage(
        data.message ||
          (
            requestedStatus === "Draft"
              ? "Job saved as draft successfully."
              : "Job submitted successfully and is pending admin approval."
          )
      );

      setMessageType("success");

      /*
        Clear the form after successful
        backend submission.
      */
      setForm(initialForm);

    } catch (error) {
      console.error(
        "Employee job submission error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to submit job. Please try again."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
      setDraftLoading(false);
    }
  };

  /* =========================================
     POST JOB
  ========================================= */

  const handleSubmit = (event) => {
    submitJob(
      event,
      "Pending"
    );
  };

  /* =========================================
     SAVE DRAFT
  ========================================= */

  const handleSaveDraft = () => {
    submitJob(
      null,
      "Draft"
    );
  };

  return (
    <div className="employee-layout">

      {/* =====================================
          MAIN
      ====================================== */}

      <main className="employee-main employee-post-job-main">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="employee-post-job-header">

          <button
            type="button"
            className="employee-back-button"
            onClick={() =>
              navigate(
                "/employee-dashboard/jobs"
              )
            }
          >
            <ArrowLeft size={18} />
            Back to My Jobs
          </button>

          <div className="employee-page-heading">

            <span>
              AGENT WORKSPACE
            </span>

            <h1>
              Post a New Job
            </h1>

            <p>
              Create a new job opening and
              add complete hiring requirements.
            </p>

          </div>

        </div>

        {/* =====================================
            MESSAGE
        ====================================== */}

        {message && (
          <div
            className={`employee-form-message ${
              messageType === "error"
                ? "error"
                : "success"
            }`}
          >
            {message}
          </div>
        )}

        {/* =====================================
            FORM
        ====================================== */}

        <form
          className="employee-job-form"
          onSubmit={handleSubmit}
        >

          {/* =====================================
              BASIC JOB INFORMATION
          ====================================== */}

          <section className="employee-form-card">

            <div className="employee-form-card-header">

              <div className="employee-form-section-icon">
                <Briefcase size={20} />
              </div>

              <div>

                <span>
                  SECTION 01
                </span>

                <h2>
                  Basic Job Information
                </h2>

                <p>
                  Add the main information about
                  the job opening.
                </p>

              </div>

            </div>

            <div className="employee-form-grid">

              {/* JOB TITLE */}

              <div className="employee-form-group full">

                <label htmlFor="jobTitle">
                  Job Title <b>*</b>
                </label>

                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  placeholder="e.g. Senior Software Developer"
                  value={form.jobTitle}
                  onChange={handleChange}
                />

              </div>

              {/* COMPANY */}

              <div className="employee-form-group">

                <label htmlFor="companyName">
                  Company Name <b>*</b>
                </label>

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter company name"
                  value={form.companyName}
                  onChange={handleChange}
                />

              </div>

              {/* DEPARTMENT */}

              <div className="employee-form-group">

                <label htmlFor="department">
                  Department <b>*</b>
                </label>

                <input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="e.g. Information Technology"
                  value={form.department}
                  onChange={handleChange}
                />

              </div>

              {/* INDUSTRY */}

              <div className="employee-form-group">

                <label htmlFor="industry">
                  Industry <b>*</b>
                </label>

                <select
                  id="industry"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                >

                  <option value="">
                    Select industry
                  </option>

                  <option value="Information Technology">
                    Information Technology
                  </option>

                  <option value="Human Resources">
                    Human Resources
                  </option>

                  <option value="Healthcare">
                    Healthcare
                  </option>

                  <option value="Banking & Finance">
                    Banking & Finance
                  </option>

                  <option value="Engineering">
                    Engineering
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Sales & Marketing">
                    Sales & Marketing
                  </option>

                  <option value="Construction">
                    Construction
                  </option>

                  <option value="Manufacturing">
                    Manufacturing
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* JOB TYPE */}

              <div className="employee-form-group">

                <label htmlFor="jobType">
                  Job Type
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                >

                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Temporary">
                    Temporary
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                </select>

              </div>

              {/* WORK MODE */}

              <div className="employee-form-group">

                <label htmlFor="workMode">
                  Work Mode
                </label>

                <select
                  id="workMode"
                  name="workMode"
                  value={form.workMode}
                  onChange={handleChange}
                >

                  <option value="On-site">
                    On-site
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>

                  <option value="Remote">
                    Remote
                  </option>

                </select>

              </div>

              {/* LOCATION */}

              <div className="employee-form-group">

                <label htmlFor="location">
                  Location <b>*</b>
                </label>

                <div className="employee-input-with-icon">

                  <MapPin size={17} />

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Bangalore, India"
                    value={form.location}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* EXPERIENCE */}

              <div className="employee-form-group">

                <label htmlFor="experience">
                  Experience <b>*</b>
                </label>

                <input
                  id="experience"
                  name="experience"
                  type="text"
                  placeholder="e.g. 3-5 Years"
                  value={form.experience}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>

          {/* =====================================
              COMPENSATION
          ====================================== */}

          <section className="employee-form-card">

            <div className="employee-form-card-header">

              <div className="employee-form-section-icon">
                <FileText size={20} />
              </div>

              <div>

                <span>
                  SECTION 02
                </span>

                <h2>
                  Compensation & Vacancy
                </h2>

                <p>
                  Add salary information and
                  vacancy details.
                </p>

              </div>

            </div>

            <div className="employee-form-grid">

              {/* SALARY MIN */}

              <div className="employee-form-group">

                <label htmlFor="salaryMin">
                  Minimum Salary
                </label>

                <input
                  id="salaryMin"
                  name="salaryMin"
                  type="text"
                  placeholder="e.g. ₹10 LPA"
                  value={form.salaryMin}
                  onChange={handleChange}
                />

              </div>

              {/* SALARY MAX */}

              <div className="employee-form-group">

                <label htmlFor="salaryMax">
                  Maximum Salary
                </label>

                <input
                  id="salaryMax"
                  name="salaryMax"
                  type="text"
                  placeholder="e.g. ₹16 LPA"
                  value={form.salaryMax}
                  onChange={handleChange}
                />

              </div>

              {/* OPENINGS */}

              <div className="employee-form-group">

                <label htmlFor="openings">
                  Number of Openings
                </label>

                <input
                  id="openings"
                  name="openings"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={form.openings}
                  onChange={handleChange}
                />

              </div>

              {/* DEADLINE */}

              <div className="employee-form-group">

                <label htmlFor="deadline">
                  Application Deadline
                </label>

                <div className="employee-input-with-icon">

                  <Calendar size={17} />

                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =====================================
              JOB DESCRIPTION
          ====================================== */}

          <section className="employee-form-card">

            <div className="employee-form-card-header">

              <div className="employee-form-section-icon">
                <FileText size={20} />
              </div>

              <div>

                <span>
                  SECTION 03
                </span>

                <h2>
                  Job Description
                </h2>

                <p>
                  Describe the position and what
                  the selected candidate will do.
                </p>

              </div>

            </div>

            <div className="employee-form-stack">

              {/* DESCRIPTION */}

              <div className="employee-form-group">

                <label htmlFor="description">
                  Job Description <b>*</b>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  placeholder="Write a detailed overview of the role..."
                  value={form.description}
                  onChange={handleChange}
                />

              </div>

              {/* RESPONSIBILITIES */}

              <div className="employee-form-group">

                <label htmlFor="responsibilities">
                  Key Responsibilities <b>*</b>
                </label>

                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows="6"
                  placeholder={`Add responsibilities, one per line.

Example:
Develop and maintain web applications
Collaborate with cross-functional teams
Review code and improve application performance`}
                  value={
                    form.responsibilities
                  }
                  onChange={handleChange}
                />

              </div>

              {/* REQUIREMENTS */}

              <div className="employee-form-group">

                <label htmlFor="requirements">
                  Requirements <b>*</b>
                </label>

                <textarea
                  id="requirements"
                  name="requirements"
                  rows="6"
                  placeholder={`Add candidate requirements, one per line.

Example:
Bachelor's degree in Computer Science
3+ years of development experience
Strong JavaScript knowledge`}
                  value={
                    form.requirements
                  }
                  onChange={handleChange}
                />

              </div>

              {/* SKILLS */}

              <div className="employee-form-group">

                <label htmlFor="skills">
                  Required Skills
                </label>

                <textarea
                  id="skills"
                  name="skills"
                  rows="4"
                  placeholder="Enter skills separated by commas, e.g. React.js, Node.js, MongoDB"
                  value={form.skills}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>

          {/* =====================================
              FORM ACTIONS
          ====================================== */}

          <div className="employee-form-actions">

            <button
              type="button"
              className="employee-cancel-button"
              onClick={() =>
                navigate(
                  "/employee-dashboard/jobs"
                )
              }
            >
              Cancel
            </button>

            <div className="employee-form-actions-right">

              {/* SAVE DRAFT */}

              <button
                type="button"
                className="employee-draft-button"
                onClick={
                  handleSaveDraft
                }
                disabled={
                  draftLoading ||
                  loading
                }
              >

                <Save size={17} />

                {draftLoading
                  ? "Saving..."
                  : "Save Draft"}

              </button>

              {/* POST JOB */}

              <button
                type="submit"
                className="employee-submit-button"
                disabled={
                  loading ||
                  draftLoading
                }
              >

                <Send size={17} />

                {loading
                  ? "Submitting..."
                  : "Post Job"}

              </button>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
}