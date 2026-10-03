import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./AddEmployee.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const department = formData.department.trim();
    const designation = formData.designation.trim();
    const password = formData.password;

    if (
      !name ||
      !email ||
      !phone ||
      !department ||
      !designation ||
      !password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("ragasAdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/employees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            department,
            designation,
            password,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      console.log("Create employee response:", data);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to create employee."
        );
      }

      setSuccess("Employee created successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/admin/employers");
      }, 700);
    } catch (err) {
      console.error("Create employee error:", err);

      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-page">

      <div className="add-employee-header">
        <div>
          <p>EMPLOYEE MANAGEMENT</p>

          <h2>Add Employee</h2>

          <span>
            Create login credentials and employee details.
          </span>
        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/admin/employers")}
        >
          ← Back
        </button>
      </div>

      <div className="add-employee-card">
        <form onSubmit={handleSubmit}>

          {/* EMPLOYEE NAME */}
          <div className="form-group">
            <label htmlFor="name">
              Employee Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter employee name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter employee email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* DEPARTMENT */}
          <div className="form-group">
            <label htmlFor="department">
              Department
            </label>

            <input
              id="department"
              type="text"
              name="department"
              placeholder="e.g. Recruitment, HR, IT"
              value={formData.department}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* DESIGNATION */}
          <div className="form-group">
            <label htmlFor="designation">
              Designation
            </label>

            <input
              id="designation"
              type="text"
              name="designation"
              placeholder="e.g. Recruitment Executive"
              value={formData.designation}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter employee password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="form-success">
              {success}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="create-employee-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Employee..."
              : "Create Employee"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddEmployee;