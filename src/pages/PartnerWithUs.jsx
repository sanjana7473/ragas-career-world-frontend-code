import { useState } from "react";
import { Link } from "react-router-dom";
import "./PartnerWithUs.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function PartnerWithUs() {
  const [formData, setFormData] = useState({
    companyName: "",
    partnerType: "",
    yearsInOperation: "",
    registrationNumber: "",
    specialization: "",
    geography: "",
    contactPerson: "",
    email: "",
    phone: "",
  });

  const [registrationFile, setRegistrationFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setRegistrationFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC or DOCX file.");
      setRegistrationFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Registration certificate must be less than 5 MB.");
      setRegistrationFile(null);
      return;
    }

    setError("");
    setRegistrationFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const data = new FormData();

      data.append("companyName", formData.companyName);
      data.append("partnerType", formData.partnerType);
      data.append("yearsInOperation", formData.yearsInOperation);
      data.append("registrationNumber", formData.registrationNumber);
      data.append("specialization", formData.specialization);
      data.append("geography", formData.geography);
      data.append("contactPerson", formData.contactPerson);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (registrationFile) {
        data.append("registrationCertificate", registrationFile);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit partner registration."
        );
      }

      setSuccess(
        "Your partner registration has been submitted successfully."
      );

      setFormData({
        companyName: "",
        partnerType: "",
        yearsInOperation: "",
        registrationNumber: "",
        specialization: "",
        geography: "",
        contactPerson: "",
        email: "",
        phone: "",
      });

      setRegistrationFile(null);

      e.target.reset();
    } catch (err) {
      console.error("Partner registration error:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="partner-page">
      <section className="partner-main">

        {/* LEFT SIDE */}
        <div className="partner-info">

          <p className="partner-eyebrow">
            RECRUITMENT PARTNER PROGRAM
          </p>

          <h1>Partner With Us</h1>

          <p className="partner-description">
            Register your agency or consultancy for a verified partner
            account — share job orders, track referrals, and see commission
            terms up front.
          </p>

          <Link
            to="/partner-login"
            className="partner-login-link"
          >
            Partner Login
          </Link>

          <div className="partner-steps">

            <div className="partner-step">
              <strong>1. Register</strong>
              <span>
                Submit company &amp; compliance details
              </span>
            </div>

            <div className="partner-step">
              <strong>2. Verify</strong>
              <span>
                Admin reviews registration documents
              </span>
            </div>

            <div className="partner-step">
              <strong>3. Collaborate</strong>
              <span>
                Receive shared job orders &amp; refer candidates
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="partner-card">

          <h2>Partner Registration Form</h2>

          <form
            className="partner-form"
            onSubmit={handleSubmit}
          >

            <div className="partner-field">
              <label>Company / Consultancy Name</label>

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="partner-field">
              <label>Business Type</label>

              <select
                name="partnerType"
                value={formData.partnerType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select
                </option>

                <option>Recruitment Agency</option>
                <option>Consultancy</option>
                <option>Staffing Company</option>
                <option>Other</option>
              </select>
            </div>

            <div className="partner-field">
              <label>Years in Operation</label>

              <input
                type="number"
                name="yearsInOperation"
                value={formData.yearsInOperation}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="partner-field">
              <label>
                GST / CIN or Equivalent Reg. No.
              </label>

              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
            </div>

            <div className="partner-field">
              <label>
                Registration Certificate Upload
              </label>

              <input
                type="file"
                name="registrationCertificate"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

              {registrationFile && (
                <small>
                  Selected: {registrationFile.name}
                </small>
              )}
            </div>

            <div className="partner-field">
              <label>Areas of Specialisation</label>

              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select
                </option>

                <option>IT &amp; Technology</option>
                <option>Healthcare</option>
                <option>Engineering</option>
                <option>Construction</option>
                <option>Hospitality</option>
                <option>Other</option>
              </select>
            </div>

            <div className="partner-field">
              <label>Service Geography</label>

              <select
                name="geography"
                value={formData.geography}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select
                </option>

                <option>India</option>
                <option>International</option>
                <option>India &amp; International</option>
              </select>
            </div>

            <div className="partner-field">
              <label>Contact Person — Name</label>

              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
              />
            </div>

            <div className="partner-field">
              <label>Work Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="partner-field">
              <label>Phone / WhatsApp Number</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: "#fff1f1",
                  color: "#b42318",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: "#ecfdf3",
                  color: "#027a48",
                  fontSize: "14px",
                }}
              >
                {success}
              </div>
            )}

            <p className="partner-form-note">
              All fields are labelled and validated with clear,
              specific inline error messages.
            </p>

            <button
              type="submit"
              className="partner-submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit for Verification"}
            </button>

          </form>

        </div>

      </section>
    </main>
  );
}

export default PartnerWithUs;