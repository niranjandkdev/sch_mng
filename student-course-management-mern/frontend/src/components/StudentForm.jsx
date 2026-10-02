import { useEffect, useState } from 'react';
const empty = { name:'', email:'', phone:'', course:'', dateOfJoining:'' };
export default function StudentForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { setForm(editing ? { ...editing, dateOfJoining: editing.dateOfJoining?.slice(0,10) || '' } : empty); setError(''); }, [editing]);
  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  async function submit(e) { e.preventDefault(); setError(''); if (Object.values(form).some(v => !String(v).trim())) return setError('Please complete every field.'); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.'); if (!/^\d{10}$/.test(form.phone)) return setError('Phone number must contain exactly 10 digits.'); setSaving(true); try { await onSave(form); if (!editing) setForm(empty); } catch (err) { setError(err.message); } finally { setSaving(false); } }
  return <form className="panel form" onSubmit={submit}><div className="panel-head"><div><span className="eyebrow">{editing ? 'EDIT RECORD' : 'NEW RECORD'}</span><h2>{editing ? 'Update student' : 'Add student'}</h2></div>{editing && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}</div>{error && <div className="error">{error}</div>}
    <label>Full name<input name="name" value={form.name} onChange={change} placeholder="e.g. Ananya Rao" /></label>
    <div className="grid2"><label>Email<input name="email" type="email" value={form.email} onChange={change} placeholder="student@email.com" /></label><label>Phone<input name="phone" value={form.phone} onChange={change} maxLength="10" inputMode="numeric" placeholder="10-digit number" /></label></div>
    <label>Course<input name="course" value={form.course} onChange={change} placeholder="e.g. Full Stack Development" /></label>
    <label>Date of joining<input name="dateOfJoining" type="date" value={form.dateOfJoining} onChange={change} /></label>
    <button className="primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Add student'}</button>
  </form>;
}
