import { useEffect, useMemo, useState } from 'react';
import api from './services/api';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import CoursePanel from './components/CoursePanel';
import EnrollmentPanel from './components/EnrollmentPanel';

function apiMessage(error, fallback) { return error?.response?.data?.message || (error?.code === 'ERR_NETWORK' ? 'Cannot reach the backend. Start Node.js and MongoDB, then refresh.' : fallback); }

export default function App() {
  const [students,setStudents]=useState([]), [courses,setCourses]=useState([]), [enrollments,setEnrollments]=useState([]), [editing,setEditing]=useState(null), [search,setSearch]=useState(''), [loading,setLoading]=useState(true), [error,setError]=useState('');
  async function load(){setLoading(true);try{const [s,c,e]=await Promise.all([api.get('/students'),api.get('/courses'),api.get('/enrollments')]);setStudents(s.data);setCourses(c.data);setEnrollments(e.data);setError('')}catch(err){setError(apiMessage(err,'Could not load application data.'))}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  const visible=useMemo(()=>{const q=search.trim().toLowerCase();return q?students.filter(s=>[s.name,s.email,s.phone,s.course].join(' ').toLowerCase().includes(q)):students},[students,search]);
  async function saveStudent(data){try{if(editing)await api.put(`/students/${editing._id}`,data);else await api.post('/students',data);setEditing(null);await load()}catch(err){throw new Error(apiMessage(err,'Could not save student.'))}}
  async function createCourse(data){try{await api.post('/courses',data);await load()}catch(err){throw new Error(apiMessage(err,'Could not create course.'))}}
  async function enroll(data){try{await api.post('/enrollments',data);await load()}catch(err){throw new Error(apiMessage(err,'Could not enroll student.'))}}
  async function removeStudent(id){if(!window.confirm('Delete this student and all of their enrollment records?'))return;try{await api.delete(`/students/${id}`);if(editing?._id===id)setEditing(null);await load()}catch(err){window.alert(apiMessage(err,'Could not delete student.'))}}
  return <main><Dashboard students={students} courses={courses} enrollments={enrollments}/>{error&&<div className="global-error"><b>Connection error:</b> {error}<button onClick={load}>Retry</button></div>}<div className="layout"><div><StudentForm editing={editing} onSave={saveStudent} onCancel={()=>setEditing(null)}/><CoursePanel courses={courses} onCreate={createCourse}/></div><div><section className="panel"><div className="panel-head directory-head"><div><span className="eyebrow">STUDENT DIRECTORY</span><h2>Students</h2></div><div className="search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, course..."/></div></div>{loading?<div className="empty">Loading records...</div>:visible.length?<div className="table-wrap"><table><thead><tr><th>Student</th><th>Contact</th><th>Course</th><th>Joining</th><th>Actions</th></tr></thead><tbody>{visible.map(s=><tr key={s._id}><td><b>{s.name}</b><small>ID: {s._id.slice(-6).toUpperCase()}</small></td><td><b>{s.email}</b><small>{s.phone}</small></td><td><span className="course-tag">{s.course}</span></td><td>{new Date(s.dateOfJoining).toLocaleDateString()}</td><td className="actions"><button onClick={()=>setEditing(s)}>Edit</button><button className="danger" onClick={()=>removeStudent(s._id)}>Delete</button></td></tr>)}</tbody></table></div>:<div className="empty">No students found. Add the first student.</div>}</section><EnrollmentPanel students={students} courses={courses} enrollments={enrollments} onEnroll={enroll}/></div></div><footer>CampusFlow • MERN Assignment 2 • MongoDB powered</footer></main>;
}
