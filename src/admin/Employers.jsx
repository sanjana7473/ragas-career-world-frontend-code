import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Employers.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function Employers() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH EMPLOYEES
  // =========================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ragasAdminToken");

      const response = await fetch(
        `${API_URL}/api/employees`,
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to load employees."
        );
      }

      setEmployees(data.data || []);
    } catch (err) {
      console.error("Employees error:", err);

      setError(
        err.message || "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =========================================
  // FILTER EMPLOYEES
  // =========================================

  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.name
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.email
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.department
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.designation
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [employees, search]);

  // =========================================
  // EMPLOYEE ID
  // =========================================

  const getEmployeeId = (employee, index) => {
    if (employee._id) {
      return `EMP-${employee._id
        .slice(-4)
        .toUpperCase()}`;
    }

    return `EMP-${String(index + 1).padStart(4, "0")}`;
  };

  // =========================================
  // AVATAR
  // =========================================

  const getInitials = (name = "Employee") => {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================================
  // VIEW EMPLOYEE
  // =========================================

  const handleViewEmployee = (employee) => {
    if (!employee?._id) {
      return;
    }

    navigate(`/admin/employees/${employee._id}`);
  };

  // =========================================
  // NEW EMPLOYEES THIS MONTH
  // =========================================

  const newEmployeesThisMonth = employees.filter(
    (employee) => {
      if (!employee.createdAt) {
        return false;
      }

      const created = new Date(employee.createdAt);
      const now = new Date();

      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }
  ).length;

  // =========================================
  // ACTIVE EMPLOYEES
  // =========================================

  const activeEmployees = employees.filter(
    (employee) =>
      !employee.status ||
      employee.status === "Active"
  ).length;

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="employers-page">

      {/* HEADER */}

      <div className="employers-heading">
        <div>
          <p>EMPLOYEE MANAGEMENT</p>

          <h2>Employees</h2>

          <span>
            Create, manage and monitor employee accounts
            and access.
          </span>
        </div>

        <button
          className="add-employer-btn"
          type="button"
          onClick={() =>
            navigate("/admin/employers/add")
          }
        >
          + Add Agent
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="employers-error">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="employer-stats">

        <div className="employer-stat">
          <span>Total Employees</span>

          <strong>
            {loading ? "..." : employees.length}
          </strong>

          <small>
            Registered employees
          </small>
        </div>

        <div className="employer-stat">
          <span>New This Month</span>

          <strong>
            {loading
              ? "..."
              : newEmployeesThisMonth}
          </strong>

          <small>
            Employees added this month
          </small>
        </div>

        <div className="employer-stat">
          <span>Active Employees</span>

          <strong>
            {loading ? "..." : activeEmployees}
          </strong>

          <small>
            Currently active accounts
          </small>
        </div>

        <div className="employer-stat">
          <span>Inactive Employees</span>

          <strong>
            {loading
              ? "..."
              : employees.filter(
                  (employee) =>
                    employee.status === "Disabled" ||
                    employee.status === "Inactive"
                ).length}
          </strong>

          <small>
            Disabled accounts
          </small>
        </div>

      </div>

      {/* TABLE CARD */}

      <section className="employers-card">

        {/* TOOLBAR */}

        <div className="employer-toolbar">

          <div className="employer-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search employee, email or phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <button
            className="employer-filter-btn"
            type="button"
            onClick={() => setSearch("")}
          >
            Reset
          </button>

        </div>

        {/* TABLE */}

        <div className="employers-table-wrapper">

          <table className="employers-table">

            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="table-message"
                  >
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="table-message"
                  >
                    {employees.length === 0
                      ? "No employees found."
                      : "No employees match your search."}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(
                  (employee, index) => {

                    const employeeId =
                      getEmployeeId(
                        employee,
                        index
                      );

                    const employeeStatus =
                      employee.status ||
                      "Active";

                    const isActive =
                      employeeStatus === "Active";

                    return (
                      <tr
                        key={
                          employee._id ||
                          employeeId
                        }
                      >

                        {/* EMPLOYEE */}

                        <td>
                          <div className="employer-company">

                            <div className="company-avatar">
                              {getInitials(
                                employee.name
                              )}
                            </div>

                            <div>
                              <strong>
                                {employee.name ||
                                  "—"}
                              </strong>

                              <small>
                                {employeeId}
                              </small>
                            </div>

                          </div>
                        </td>

                        {/* EMAIL */}

                        <td>
                          <span className="employer-email">
                            {employee.email || "—"}
                          </span>
                        </td>

                        {/* PHONE */}

                        <td>
                          {employee.phone || "—"}
                        </td>

                        {/* DEPARTMENT */}

                        <td>
                          {employee.department || "—"}
                        </td>

                        {/* DESIGNATION */}

                        <td>
                          {employee.designation || "—"}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`employer-status ${
                              isActive
                                ? "verified"
                                : "inactive"
                            }`}
                          >
                            {employeeStatus}
                          </span>
                        </td>

                        {/* ACTION */}

                        <td>
                          <button
                            className="employer-view-btn"
                            type="button"
                            onClick={() =>
                              handleViewEmployee(
                                employee
                              )
                            }
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="employer-pagination">

          <span>
            Showing{" "}
            {filteredEmployees.length} of{" "}
            {employees.length} employees
          </span>

          <div>
            <button disabled>
              ‹
            </button>

            <button className="employer-page-active">
              1
            </button>

            <button disabled>
              ›
            </button>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Employers;