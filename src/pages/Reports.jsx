import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes
} from "react-icons/fa";
import {
  useNavigate,
  useLocation
} from "react-router-dom";
import { supabase } from "../supabase";
import "../App.css";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchStudents();
  }, [location]);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*");

    if (error) {
      console.error(error.message);
    } else {
      setStudents(data || []);
    }
  };

  const total = students.length;

  const present = students.filter(
    (student) => !!student.attendance?.[todayStr]
  ).length;

  const absent = total - present;

  const attendanceRate =
    total > 0 ? (present / total) * 100 : 0;

  const percentage =
    total > 0
      ? Math.round((present / total) * 100)
      : 0;

  return (
    <div className="layout">

      {/* Sidebar */}
      <div className="sidebar">

        <h2 className="logo">
          EduTrack
        </h2>

        <div className="menu">

          <p
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </p>

          <p
            onClick={() =>
              navigate("/reports")
            }
          >
            Reports
          </p>

        </div>

      </div>

      {/* Main */}
      <div className="main">

        <h1>
          📈 Attendance Reports
        </h1>

        <div className="reportGrid">

          <div className="progressBar">
            <div
              className="progressFill"
              style={{
                width: `${attendanceRate}%`
              }}
            ></div>
          </div>

          <p>
            {attendanceRate.toFixed(1)}%
            {" "}Attendance Rate
          </p>

          <div className="reportCard">
            <FaUsers size={28} />
            <h2>{total}</h2>
            <p>Total Students</p>
          </div>

          <div className="reportCard green">
            <FaUserCheck size={28} />
            <h2>{present}</h2>
            <p>Present</p>
          </div>

          <div className="reportCard red">
            <FaUserTimes size={28} />
            <h2>{absent}</h2>
            <p>Absent</p>
          </div>

          <div className="reportCard blue">
            <h2>{percentage}%</h2>
            <p>Attendance Rate</p>
          </div>

        </div>

        <div className="reportTable">

          <h2>Student Report</h2>

          {students.length === 0 ? (
            <p>
              No student data available.
            </p>
          ) : (
            students.map((student) => {

              const totalDays =
                Object.keys(
                  student.attendance || {}
                ).length;

              const presentDays =
                Object.values(
                  student.attendance || {}
                ).filter(Boolean).length;

              const percent =
                totalDays > 0
                  ? Math.round(
                      (presentDays / totalDays) * 100
                    )
                  : 0;

              const isPresentToday =
                !!student.attendance?.[todayStr];

              return (
                <div
                  key={student.id}
                  className="reportRow"
                >
                  <span>
                    {student.name}
                  </span>

                  <span className="studentPercent">
                    ({percent}%)
                  </span>

                  <span
                    className={
                      isPresentToday
                        ? "greenText"
                        : "redText"
                    }
                  >
                    {isPresentToday
                      ? "Present"
                      : "Absent"}
                  </span>
                </div>
              );
            })
          )}

        </div>

      </div>

      <div
        className="mobileReportsBtn"
        onClick={() => navigate("/reports")}
      >
        📊 Reports
      </div>

    </div>
  );
}