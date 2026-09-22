import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  MapPin,
  Building2,
  Clock3,
  DollarSign,
  FileText,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import "./PartnerPostJob.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PARTNER_JOBS_API = `${API_BASE_URL}/api/jobs`;

function PartnerPostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    jobType: "Full-time",
    industry: "",
    salary: "",
    experience: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* -----------------------------------------
     PARTNER VERIFICATION STATE

     The account works instantly, but publishing a job
     requires admin verification. An unverified partner can
     still save the job as a private draft.
  ----------------------------------------- */

  let partner = null;

  try {
    partner = JSON.parse(
      localStorage.getItem("ragasPartner") || "null"
    );
  } catch (parseError) {
    console.error("Invalid partner data:", parseError);
    partner = null;
  }

  const isVerified = partner?.status === "Verified";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -----------------------------------------
     SUBMIT

     publish = true  -> send the job to the admin queue
     publish = false -> keep it as a private draft
  ----------------------------------------- */

  const submitJob = async ({ publish }) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("ragasPartnerToken");

      if (!token) {
        setError("Partner authentication required.");
        setLoading(false);
        return;
      }

      const response = await fetch(PARTNER_JOBS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobTitle: formData.title,
          description: formData.description,
          jobType: formData.jobType,
          category: formData.industry,
          location: formData.location,
          salary: formData.salary,
          experience: formData.experience,
          skills: formData.skills,
          publish,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save the job."
        );
      }

      setMessage(
        publish
          ? "Job published successfully and sent for admin approval."
          : "Job saved as a draft. You can publish it once your partner account is verified."
      );

      setFormData({
        title: "",
        description: "",
        company: "",
        location: "",
        jobType: "Full-time",
        industry: "",
        salary: "",
        experience: "",
        skills: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------
     FORM SUBMIT

     A verified partner publishes straight away, an
     unverified partner saves a draft with the same button.
  ----------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    await submitJob({ publish: isVerified });
  };

  const handleSaveDraft = async () => {
    await submitJob({ publish: false });
  };

  return (
    <div className="partner-post-job">

      <div className="partner-post-job-heading">

        <div>
          <button
            type="button"
            className="partner-back-btn"
            onClick={() => navigate("/partner-dashboard")}
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

          <p className="partner-post-job-eyebrow">
            JOB MANAGEMENT
          </p>

          <h2>Post New Job</h2>

          <p className="partner-post-job-description">
            Create a new job vacancy for your recruitment
            requirements.
          </p>
        </div>

      </div>

      {/* VERIFICATION NOTICE */}

      {isVerified ? (
        <div className="partner-form-success">
          <ShieldCheck size={16} /> Your partner account is verified.
          You can publish jobs directly for admin approval.
        </div>
      ) : (
        <div className="partner-form-warning">
          <ShieldAlert size={16} />
          <span>
            Your partner account is awaiting admin verification.
            You can save this job as a draft now and publish it
            once your account is verified.
          </span>
        </div>
      )}

      <form
        className="partner-job-form"
        onSubmit={handleSubmit}
      >

        <div className="partner-form-section">

          <div className="partner-form-section-title">
            <BriefcaseBusiness size={18} />

            <div>
              <h3>Job Information</h3>
              <p>
                Enter the basic details of the job vacancy.
              </p>
            </div>
          </div>

          <div className="partner-form-grid">

            <div className="partner-form-group partner-full-width">
              <label htmlFor="title">
                Job Title *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>

            <div className="partner-form-group">
              <label htmlFor="company">
                Company Name *
              </label>

              <div className="partner-input-icon">
                <Building2 size={16} />

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  required
                />
              </div>
            </div>

            <div className="partner-form-group">
              <label htmlFor="location">
                Location *
              </label>

              <div className="partner-input-icon">
                <MapPin size={16} />

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  required
                />
              </div>
            </div>

            <div className="partner-form-group">
              <label htmlFor="jobType">
                Job Type *
              </label>

              <div className="partner-input-icon">
                <Clock3 size={16} />

                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
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
            </div>

            <div className="partner-form-group">
              <label htmlFor="industry">
                Industry
              </label>

              <input
                id="industry"
                name="industry"
                type="text"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. IT & Software"
              />
            </div>

            <div className="partner-form-group">
              <label htmlFor="salary">
                Salary
              </label>

              <div className="partner-input-icon">
                <DollarSign size={16} />

                <input
                  id="salary"
                  name="salary"
                  type="text"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹8-12 LPA"
                />
              </div>
            </div>

            <div className="partner-form-group">
              <label htmlFor="experience">
                Experience
              </label>

              <input
                id="experience"
                name="experience"
                type="text"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 3-5 years"
              />
            </div>

          </div>
        </div>

        <div className="partner-form-section">

          <div className="partner-form-section-title">
            <FileText size={18} />

            <div>
              <h3>Job Description</h3>
              <p>
                Provide complete information about the role.
              </p>
            </div>
          </div>

          <div className="partner-form-group">
            <label htmlFor="description">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write the job description..."
              rows="7"
              required
            />
          </div>

          <div className="partner-form-group">
            <label htmlFor="skills">
              Required Skills
            </label>

            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB, JavaScript"
              rows="4"
            />
          </div>
        </div>

        {message && (
          <div className="partner-form-success">
            {message}
          </div>
        )}

        {error && (
          <div className="partner-form-error">
            {error}
          </div>
        )}

        <div className="partner-form-actions">

          <button
            type="button"
            className="partner-cancel-btn"
            onClick={() => navigate("/partner-dashboard")}
          >
            Cancel
          </button>

          {/* Save as draft - always available */}
          <button
            type="button"
            className="partner-cancel-btn"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>

          {/* Publish - verified partners only */}
          <button
            type="submit"
            className="partner-submit-job-btn"
            disabled={loading || !isVerified}
            title={
              isVerified
                ? "Publish this job for admin approval"
                : "Publishing is enabled once the admin verifies your account"
            }
          >
            {loading
              ? "Submitting..."
              : isVerified
                ? "Publish Job"
                : "Publish (Verification Pending)"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default PartnerPostJob;