import { useEffect, useState } from 'react';
import './App.css';

const rooms = [
  { name: 'Oceanfront villa', detail: 'Private pool · 2 guests', price: 680, image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=900&q=80' },
  { name: 'Garden suite', detail: 'Outdoor shower · 3 guests', price: 420, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80' },
  { name: 'Cliffside residence', detail: 'Two bedrooms · 5 guests', price: 950, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80' },
];

const navItems = ['Stay', 'The island', 'Experiences', 'Gallery', 'Contact', 'Admin'];
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

const pad = (value) => String(value).padStart(2, '0');
const formatPickerValue = (date, hour, minute) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hour)}:${pad(minute)}`;
const pickerDateLabel = (value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

function DateTimePicker({ label, value, onChange }) {
  const current = new Date(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(new Date(current.getFullYear(), current.getMonth(), 1));
  const hour24 = current.getHours();
  const hour12 = hour24 % 12 || 12;
  const meridiem = hour24 >= 12 ? 'PM' : 'AM';
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
  const calendarDays = Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : index - firstDay + 1);
  const changeDate = (day) => onChange(formatPickerValue(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day), hour24, current.getMinutes()));
  const changeTime = (nextHour, nextMinute, nextMeridiem) => {
    const hour = nextMeridiem === 'PM' ? (nextHour % 12) + 12 : nextHour % 12;
    onChange(formatPickerValue(current, hour, nextMinute));
  };
  return <div className="picker-field"><span className="picker-label">{label}</span><button type="button" className={open ? 'picker-trigger is-open' : 'picker-trigger'} onClick={() => setOpen(!open)}><span className="picker-date">▣ {pickerDateLabel(value)}</span><span className="picker-time">{pad(hour12)}:{pad(current.getMinutes())} {meridiem} <b>⌄</b></span></button>{open && <div className="date-picker-popover"><div className="picker-calendar"><div className="calendar-heading"><button type="button" aria-label="Previous month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>←</button><strong>{visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong><button type="button" aria-label="Next month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>→</button></div><div className="calendar-weekdays">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="calendar-days">{calendarDays.map((day, index) => day ? <button type="button" className={day === current.getDate() && visibleMonth.getMonth() === current.getMonth() && visibleMonth.getFullYear() === current.getFullYear() ? 'selected' : ''} key={day} onClick={() => changeDate(day)}>{day}</button> : <span key={`empty-${index}`} />)}</div></div><div className="picker-time-panel"><span>TIME</span><div className="time-selects"><select aria-label={`${label} hour`} value={hour12} onChange={(event) => changeTime(Number(event.target.value), current.getMinutes(), meridiem)}>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{pad(index + 1)}</option>)}</select><b>:</b><select aria-label={`${label} minute`} value={current.getMinutes()} onChange={(event) => changeTime(hour12, Number(event.target.value), meridiem)}>{[0, 15, 30, 45].map((minute) => <option key={minute} value={minute}>{pad(minute)}</option>)}</select><select aria-label={`${label} AM or PM`} value={meridiem} onChange={(event) => changeTime(hour12, current.getMinutes(), event.target.value)}><option>AM</option><option>PM</option></select></div><button type="button" className="picker-today" onClick={() => { const now = new Date(); setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1)); onChange(formatPickerValue(now, hour24, current.getMinutes())); }}>Today</button></div></div>}</div>;
}

function App() {
  return (
    <div className="resort-app">
      <ResortExperience />
    </div>
  );
}

function ResortExperience() {
  const [activeView, setActiveView] = useState('Stay');
  const [menuOpen, setMenuOpen] = useState(false);

  const showBooking = () => {
    setActiveView('Stay');
    setMenuOpen(false);
    window.setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" onClick={() => setActiveView('Stay')}>
          <span className="brand-mark">S</span>
          <span><strong>Solara</strong><small>ISLAND RETREAT</small></span>
        </a>
        <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          {navItems.map((item) => <button key={item} className={activeView === item ? 'active' : ''} onClick={() => { setActiveView(item); setMenuOpen(false); }}>{item}</button>)}
        </nav>
        <button className="outline-button header-book" onClick={showBooking}>Book your stay <span>↗</span></button>
      </header>

      <main id="top">
        {activeView === 'Stay' && <HomeView onBook={showBooking} />}
        {activeView === 'The island' && <InfoView />}
        {activeView === 'Experiences' && <ExperiencesView />}
        {activeView === 'Gallery' && <GalleryView />}
        {activeView === 'Contact' && <ContactView />}
        {activeView === 'Admin' && <AdminView />}
      </main>
      <footer><span>© 2025 Solara Island Retreat</span><span>Quietly yours, somewhere in the Indian Ocean.</span><span>Instagram&nbsp;&nbsp; Journal</span></footer>
    </>
  );
}

function HomeView({ onBook }) {
  return <>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">Welcome to the other side of ordinary</p><h1>Arrive at<br /><em>yourself.</em></h1><p className="hero-note">A private island retreat shaped by salt air, slow mornings, and the generous beauty of the wild.</p><button className="solid-button" onClick={onBook}>Find your room <span>↗</span></button></div>
      <div className="hero-stamp">EST.<br /><strong>2018</strong><br />NORTH ATOLL</div>
      <div className="hero-scroll">↓ <span>Scroll to explore</span></div>
    </section>
    <section className="intro-band"><div className="section-kicker">01 / A little further</div><div><h2>Space to hear<br /><em>the quiet.</em></h2><p>Solara is an intimate collection of villas tucked between an ancient reef and a forest of palms. Come for the views. Stay for the feeling of having nowhere else to be.</p><button className="text-button">Discover Solara <span>↗</span></button></div></section>
    <section className="rooms-section" id="booking"><div className="section-heading"><div><div className="section-kicker">02 / Choose your horizon</div><h2>Rooms with<br /><em>room to breathe.</em></h2></div><p>Every stay is private, unhurried, and connected to the sea.</p></div><div className="room-grid">{rooms.map((room) => <article className="room-card" key={room.name}><img src={room.image} alt={room.name} /><div className="room-meta"><div><h3>{room.name}</h3><p>{room.detail}</p></div><strong>${room.price}<small> / night</small></strong></div></article>)}</div><BookingPanel /></section>
    <section className="quote-section"><span className="quote-mark">“</span><blockquote>The kind of place where a week feels like a season.</blockquote><cite>— Mira, returning guest</cite></section>
  </>;
}

function BookingPanel() {
  const [checkIn, setCheckIn] = useState('2026-09-12T15:00');
  const [checkOut, setCheckOut] = useState('2026-09-17T11:00');
  const [selectedRoom] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [roomsFromApi, setRoomsFromApi] = useState([]);

  useEffect(() => {
    apiRequest('/rooms').then(setRoomsFromApi).catch(() => setRoomsFromApi([]));
  }, []);

  const availableRooms = roomsFromApi.length ? roomsFromApi : rooms.map((room, index) => ({ ...room, id: index + 1 }));
  const activeRoom = availableRooms.find((room) => String(room.id) === String(selectedRoom)) || availableRooms[0];
  const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const price = Number(activeRoom?.price || 420);
  return <>
    <div className="booking-panel"><div><span className="section-kicker">Plan your stay</span><h3>Make a little<br /><em>space for you.</em></h3></div><DateTimePicker label="Check in" value={checkIn} onChange={setCheckIn} /><DateTimePicker label="Check out" value={checkOut} onChange={setCheckOut} /><label>Guests<select defaultValue="2"><option>2 guests</option><option>3 guests</option><option>4 guests</option></select></label><div className="estimate"><span>{nights} night{nights !== 1 ? 's' : ''} · from</span><strong>${nights * price}</strong></div><button className="solid-button" onClick={() => setModalOpen(true)}>Check availability <span>↗</span></button></div>
    {modalOpen && <ReservationModal rooms={availableRooms} selectedRoom={activeRoom?.id} checkIn={checkIn} checkOut={checkOut} onClose={() => setModalOpen(false)} />}
  </>;
}

function ReservationModal({ rooms: availableRooms, selectedRoom, checkIn, checkOut, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', room_id: selectedRoom || '', check_in: checkIn, check_out: checkOut });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      let users = await apiRequest(`/users?email=${encodeURIComponent(form.email)}`);
      let user = users[0];
      if (!user) user = await apiRequest('/users', { method: 'POST', body: JSON.stringify({ name: form.name, email: form.email, password: `guest-${Date.now()}` }) });
      await apiRequest('/reservations', { method: 'POST', body: JSON.stringify({ user_id: user.id, room_id: Number(form.room_id), check_in: form.check_in, check_out: form.check_out }) });
      setStatus({ type: 'success', message: 'Your request is saved. We will be in touch shortly.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="reservation-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-title"><button className="modal-close" aria-label="Close reservation form" onClick={onClose}>×</button><span className="section-kicker">Reserve your horizon</span><h2 id="reservation-title">A little time<br /><em>for yourself.</em></h2>{status.message ? <div className={`form-status ${status.type}`}>{status.message}</div> : <form onSubmit={submit}><label>Your name<input name="name" value={form.name} onChange={update} required /></label><label>Email address<input name="email" type="email" value={form.email} onChange={update} required /></label><label>Room<select name="room_id" value={form.room_id} onChange={update} required>{availableRooms.map((room) => <option key={room.id} value={room.id}>{room.name} · ${room.price}/night</option>)}</select></label><div className="modal-dates"><DateTimePicker label="Check in" value={form.check_in} onChange={(value) => setForm({ ...form, check_in: value })} /><DateTimePicker label="Check out" value={form.check_out} onChange={(value) => setForm({ ...form, check_out: value })} /></div><button className="solid-button" type="submit" disabled={saving}>{saving ? 'Saving reservation...' : 'Request reservation'} <span>↗</span></button></form>}</div></div>;
}

function InfoView() { return <SimplePage kicker="03 / The island" title={<>A small world,<br /><em>all your own.</em></>} intro="There are no clocks in the lobby and no dress code at dinner. Just 42 acres of green, a living reef, and the kind of welcome that makes you exhale." image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80" />; }
function ExperiencesView() { return <SimplePage kicker="04 / Experiences" title={<>Follow your<br /><em>curiosity.</em></>} intro="Swim with manta rays before breakfast. Learn the language of spice. Sail out at golden hour and let the horizon do the talking." image="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80" />; }
function GalleryView() { return <section className="page-view gallery-view"><div className="section-kicker">05 / Gallery</div><h1>Postcards from<br /><em>the present.</em></h1><div className="gallery-grid">{rooms.concat(rooms).map((room, index) => <img key={`${room.name}-${index}`} src={room.image} alt="Solara island retreat" />)}</div></section>; }
function ContactView() { return <section className="page-view contact-view"><div><div className="section-kicker">06 / Contact</div><h1>Let’s make a plan<br /><em>to disappear.</em></h1></div><form onSubmit={(event) => event.preventDefault()}><input aria-label="Your name" placeholder="Your name" /><input aria-label="Email address" type="email" placeholder="Email address" /><textarea aria-label="Message" placeholder="Tell us what you’re dreaming of..." rows="4" /><button className="solid-button" type="submit">Send inquiry <span>↗</span></button></form></section>; }
function AdminView() {
  const [adminData, setAdminData] = useState({ rooms: [], reservations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const loadData = () => {
    setLoading(true);
    Promise.all([apiRequest('/rooms'), apiRequest('/reservations')]).then(([loadedRooms, reservations]) => setAdminData({ rooms: loadedRooms, reservations })).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false));
  };
  useEffect(loadData, []);
  const totalRevenue = adminData.reservations.reduce((total, reservation) => {
    const room = adminData.rooms.find((item) => item.id === reservation.room_id);
    const nights = Math.max(1, Math.ceil((new Date(reservation.check_out) - new Date(reservation.check_in)) / 86400000));
    return total + nights * Number(room?.price || 0);
  }, 0);
  return <section className="page-view admin-view"><div className="section-heading"><div><div className="section-kicker">07 / Operations</div><h2>Good morning,<br /><em>Solara team.</em></h2></div><div className="admin-actions"><button className="outline-button" onClick={loadData}>Refresh <span>↻</span></button><button className="solid-button" onClick={() => setRoomModalOpen(true)}>Add a room <span>＋</span></button></div></div>{error && <div className="form-status error">{error} Make sure the API and database are running.</div>}<div className="admin-stats"><div><span>Room inventory</span><strong>{adminData.rooms.length}</strong><small>{adminData.rooms.filter((room) => room.availability).length} currently available</small></div><div><span>Reservations</span><strong>{adminData.reservations.length}</strong><small>Saved in PostgreSQL</small></div><div><span>Booked revenue</span><strong>${totalRevenue.toLocaleString()}</strong><small>Based on reservation dates</small></div></div>{loading ? <p className="admin-empty">Loading live resort data...</p> : <><div className="admin-table"><div className="table-head"><span>Room inventory</span><span>Status</span><span>Rate</span></div>{adminData.rooms.map((room) => <div className="table-row" key={room.id}><strong>{room.name}</strong><span><i className={room.availability ? 'dot' : 'dot muted'}></i>{room.availability ? 'Available' : 'Unavailable'}</span><span>${room.price} / night</span></div>)}</div><div className="admin-table reservation-table"><div className="table-head"><span>Guest / room</span><span>Dates</span><span>Status</span></div>{adminData.reservations.length ? adminData.reservations.map((reservation) => <div className="table-row" key={reservation.id}><strong>{reservation.user_name || `Guest #${reservation.user_id}`}<small>{reservation.room_name || `Room #${reservation.room_id}`}</small></strong><span>{formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}</span><span>{reservation.status}</span></div>) : <p className="admin-empty">No reservations have been saved yet.</p>}</div></>}{roomModalOpen && <RoomModal onClose={() => setRoomModalOpen(false)} onSaved={() => { setRoomModalOpen(false); loadData(); }} />}</section>;
}

function formatDate(value) { return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }

function RoomModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '' });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); setSaving(true); setStatus(''); try { await apiRequest('/rooms', { method: 'POST', body: JSON.stringify(form) }); onSaved(); } catch (error) { setStatus(error.message); } finally { setSaving(false); } };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="reservation-modal" role="dialog" aria-modal="true" aria-labelledby="room-title"><button className="modal-close" aria-label="Close room form" onClick={onClose}>×</button><span className="section-kicker">Room inventory</span><h2 id="room-title">Add a new<br /><em>place to land.</em></h2>{status && <div className="form-status error">{status}</div>}<form onSubmit={submit}><label>Room name<input name="name" value={form.name} onChange={update} required /></label><label>Description<textarea name="description" value={form.description} onChange={update} rows="3" /></label><label>Nightly price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={update} required /></label><label>Image URL<input name="image_url" value={form.image_url} onChange={update} /></label><button className="solid-button" type="submit" disabled={saving}>{saving ? 'Saving room...' : 'Save room'} <span>↗</span></button></form></div></div>;
}
function SimplePage({ kicker, title, intro, image }) { return <section className="page-view simple-view"><div className="simple-copy"><div className="section-kicker">{kicker}</div><h1>{title}</h1><p>{intro}</p><button className="text-button">Start exploring <span>↗</span></button></div><img src={image} alt="Solara resort" /></section>; }

export default App;
