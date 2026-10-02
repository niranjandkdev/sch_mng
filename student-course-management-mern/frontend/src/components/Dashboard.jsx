export default function Dashboard({ students, courses, enrollments }) {
  const counts = courses.map(course => ({ name: course.courseName, count: enrollments.filter(e => e.course?._id === course._id).length }));
  return <section className="dashboard">
    <div className="hero"><div><span className="eyebrow light">CAMPUSFLOW • ADMIN CONSOLE</span><h1>Student & Course Management</h1><p>Manage student records, courses and enrollments from one workspace.</p></div><div className="hero-mark">CF</div></div>
    <div className="stats">
      <div className="stat"><span>Total Students</span><b>{students.length}</b><small>Student records</small></div>
      <div className="stat"><span>Total Courses</span><b>{courses.length}</b><small>Course catalog</small></div>
      <div className="stat"><span>Total Enrollments</span><b>{enrollments.length}</b><small>Registrations</small></div>
      <div className="stat accent"><span>Top Course</span><b>{counts.length ? Math.max(...counts.map(x => x.count)) : 0}</b><small>{counts.length ? counts.reduce((a,b) => b.count > a.count ? b : a).name : 'No courses yet'}</small></div>
    </div>
  </section>;
}
