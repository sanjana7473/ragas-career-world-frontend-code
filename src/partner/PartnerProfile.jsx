import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PartnerProfile.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EDITABLE_FIELDS = [
  ["contactPerson", "Contact Person"],
  ["phone", "Phone"],
  ["alternatePhone", "Alternate Phone"],
  ["website", "Website"],
  ["address", "Address"],
  ["city", "City"],
  ["state", "State"],
  ["country", "Country"],
  ["postalCode", "Postal Code"],
];

function PartnerProfile() {
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("ragasPartnerToken");

      if (!token) {
        navigate("/partner-login");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/partners/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load your profile.");
        }

        setPartner(data.data);
        setForm({
          contactPerson: data.data.contactPerson || "",
          phone: data.data.phone || "",
          alternatePhone: data.data.alternatePhone || "",
          website: data.data.website || "",
          address: data.data.address || "",
          city: data.data.city || "",
          state: data.data.state || "",
          country: data.data.country || "",
          postalCode: data.data.postalCode || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("ragasPartnerToken");

      const response = await fetch(
        `${API_BASE_URL}/api/partners/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save your profile.");
      }

      setPartner(data.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="partner-profile-page">
        <div className="partner-profile-loading">Loading your profile...</div>
      </div>
    );
  }

  if (error && !partner) {
    return (
      <div className="partner-profile-page">
        <div className="partner-profile-error">{error}</div>
      </div>
    );
  }

  const status = partner?.status || "Pending";
  const isVerified = status === "Verified";

  return (
    <div className="partner-profile-page">
      <div className="partner-profile-header">
        <div>
          <span className="partner-profile-eyebrow">PARTNER ACCOUNT</span>
          <h1>{partner?.companyName}</h1>
          <p>
            {partner?.partnerType}
            {partner?.email ? ` - ${partner.email}` : ""}
          </p>
        </div>

        <span
          className={`partner-profile-status ${
            isVerified ? "verified" : status === "Rejected" ? "rejected" : "pending"
          }`}
        >
          {isVerified ? "Verified" : status === "Rejected" ? "Rejected" : "Pending Verification"}
        </span>
      </div>

      {!isVerified && status !== "Rejected" && (
        <div className="partner-profile-note">
          Your account is active, but job publishing stays locked until an
          administrator verifies your partnership.
        </div>
      )}

      {message && <div className="partner-profile-success">{message}</div>}

      {error && <div className="partner-profile-error">{error}</div>}

      <form className="partner-profile-form" onSubmit={handleSave}>
        <h2>Company Information (read only)</h2>

        <div className="partner-profile-grid">
          <div className="partner-profile-item">
            <span>Company Name</span>
            <strong>{partner?.companyName || "-"}</strong>
          </div>

          <div className="partner-profile-item">
            <span>Partner Type</span>
            <strong>{partner?.partnerType || "-"}</strong>
          </div>

          <div className="partner-profile-item">
            <span>Specialization</span>
            <strong>{partner?.specialization || "-"}</strong>
          </div>

          <div className="partner-profile-item">
            <span>Geography</span>
            <strong>{partner?.geography || "-"}</strong>
          </div>

          <div className="partner-profile-item">
            <span>Email (login)</span>
            <strong>{partner?.email || "-"}</strong>
          </div>

          <div className="partner-profile-item">
            <span>Registration No.</span>
            <strong>{partner?.registrationNumber || "-"}</strong>
          </div>
        </div>

        <h2>Contact &amp; Address (editable)</h2>

        <div className="partner-profile-grid">
          {EDITABLE_FIELDS.map(([name, label]) => (
            <label key={name} className="partner-profile-field">
              <span>{label}</span>
              <input
                type="text"
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>

        <button type="submit" className="partner-profile-save" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default PartnerProfile;
