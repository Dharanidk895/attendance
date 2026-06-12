import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaChartBar,
  FaSignOutAlt,
  FaUserGraduate
} from "react-icons/fa";
import { supabase } from "../supabase"; // Connection bridge import
import "../App.css";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split("T")[0];

  // 1. READ: Fetch live data from Supabase cloud on load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*");

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setStudents(data || []);
    }
  };

  // 2. CREATE: Add student row to Supabase
  const addStudent = async () => {
    if (!name.trim()) return;

    const { data, error } = await supabase
      .from("students")
      .insert([{ name: name, attendance: {} }])
      .select();

    if (error) {
      toast.error("Failed to add student: " + error.message);
    } else {
      toast.success("Student added to database!");
      if (data) setStudents([...students, data[0]]);
      setName("");
    }
  };

  // 3. UPDATE: Sync individual attendance changes with cloud
  const toggleAttendance = async (id, currentAttendance) => {
    const updatedAttendance = { ...currentAttendance };
    updatedAttendance[todayStr] = !updatedAttendance[todayStr];

    const { error } = await supabase
      .from("students")
      .update({ attendance: updatedAttendance })
      .eq("id", id);

    if (error) {
      toast.error("Error updating attendance: " + error.message);
    } else {
      setStudents(
        students.map((s) =>
          s.id === id ? { ...s, attendance: updatedAttendance } : s
        )
      );
    }
  };

  // 4. UPDATE ALL: Batch mark everybody present
  const markAllPresent = async () => {
    const updatePromises = students.map((s) => {
      const updatedAttendance = { ...s.attendance, [todayStr]: true };
      return supabase
        .from("students")
        .update({ attendance: updatedAttendance })
        .eq("id", s.id);
    });

    try {
      await Promise.all(updatePromises);
      toast.success("All marked present!");
      fetchStudents(); // Refresh data layout safely
    } catch (err) {
      toast.error("Bulk update failed");
    }
  };

  // 5. UPDATE NAME: Change data row item name values
  const editStudent = async (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    const { error } = await supabase
      .from("students")
      .update({ name: newName })
      .eq("id", id);

    if (error) {
      toast.error("Failed to edit: " + error.message);
    } else {
      setStudents(students.map((s) => (s.id === id ? { ...s, name: newName } : s)));
      toast.success("Name updated!");
    }
  };

  // 6. DELETE: Remove targeted database row item permanently
  const deleteStudent = async (id) => {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete: " + error.message);
    } else {
      setStudents(students.filter((s) => s.id !== id));
      toast.error("Student deleted from database");
    }
  };

  // UI Filtering Utilities
  const filteredStudents = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const isPresentToday = !!s.attendance?.[todayStr];

    if (filter === "present") return isPresentToday && matchSearch;
    if (filter === "absent") return !isPresentToday && matchSearch;
    return matchSearch;
  });

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Attendance Tracker</h2>
        <div className="menu">
          <p onClick={() => navigate("/dashboard")}>
            <FaTachometerAlt /> Dashboard
          </p>
          <p onClick={() => navigate("/reports")}>
            <FaChartBar /> Reports
          </p>
          <p className="logout" onClick={logout}>
            <FaSignOutAlt /> Logout
          </p>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="main">
        <div className="topbar">
          <div className="summaryCards">
            <div className="card">Total: {students.length}</div>
            <div className="card green">
              Present: {students.filter((s) => !!s.attendance?.[todayStr]).length}
            </div>
            <div className="card red">
              Absent: {students.filter((s) => !s.attendance?.[todayStr]).length}
            </div>
          </div>
          <h1>📊 Attendance</h1>
        </div>

        <div className="toolbar">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        <button className="markAllBtn" onClick={markAllPresent}>
          Mark All Present
        </button>

        <div className="inputBox">
          <input
            type="text"
            placeholder="Enter student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={addStudent}>Add Student</button>
        </div>

        <div className="table">
          {students.length === 0 ? (
            <p>No students added yet.</p>
          ) : (
            filteredStudents.map((student) => {
              const isPresentToday = !!student.attendance?.[todayStr];
              return (
                <motion.div
                  key={student.id}
                  className="row"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="studentName">
                    <FaUserGraduate /> {student.name}
                  </div>

                  <button
                    className={isPresentToday ? "present" : "absent"}
                    onClick={() => toggleAttendance(student.id, student.attendance)}
                  >
                    {isPresentToday ? "Present" : "Absent"}
                  </button>

                  <button onClick={() => editStudent(student.id)}>Edit</button>
                  <button onClick={() => deleteStudent(student.id)}>Delete</button>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <div className="mobileReportsBtn" onClick={() => navigate("/reports")}>
        📊 Reports
      </div>
      <ToastContainer />
    </div>
  );
}