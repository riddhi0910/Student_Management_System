import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch students from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Add / Update Student
  const addStudent = async () => {
    if (name === "" || course === "" || marks === "") {
      alert("Please fill all the fields before adding a student!");
      return;
    }

    const studentData = {
      name,
      course,
      age: parseInt(marks)
    };

    try {
      if (editId !== null) {
        // Update student
        await axios.put(`http://localhost:8080/students/${editId}`, studentData);
        alert("Student updated successfully!");
        setEditId(null);
      } else {
        // Add student
        await axios.post("http://localhost:8080/students", studentData);
        alert("Student added successfully!");
      }

      setName("");
      setCourse("");
      setMarks("");

      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  // Edit Student
  const editStudent = (student) => {
    setName(student.name);
    setCourse(student.course);
    setMarks(student.age);
    setEditId(student.id);
  };

  // Delete Student
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/students/${id}`);
      fetchStudents();
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Student Management App</h2>

      <div className="row mt-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Enter course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>

        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="Enter marks"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
        </div>

        <div className="col">
          <button onClick={addStudent} className="btn btn-secondary">
            {editId !== null ? "Update Student" : "Add Student"}
          </button>
        </div>
      </div>

      <table className="table table-bordered mt-4 text-center">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Name</th>
            <th>Course</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.course}</td>
              <td>{student.age}</td>
              <td>
                <button
                  onClick={() => editStudent(student)}
                  className="btn btn-primary btn-sm me-2"
                >
                  Update
                </button>

                <button
                  onClick={() => deleteStudent(student.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;