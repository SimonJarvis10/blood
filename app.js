const { useMemo, useState } = React;

const sampleDonors = [
  {
    id: 1,
    name: "Amina Patel",
    blood: "O+",
    location: "Brooklyn, NY",
    availability: true,
    lastDonation: "3 weeks ago",
    totalDonations: 7,
    compatibilityScore: 96,
  },
  {
    id: 2,
    name: "Marcus Lee",
    blood: "A-",
    location: "Jersey City, NJ",
    availability: true,
    lastDonation: "2 months ago",
    totalDonations: 5,
    compatibilityScore: 92,
  },
  {
    id: 3,
    name: "Sofia Gomez",
    blood: "B+",
    location: "Queens, NY",
    availability: false,
    lastDonation: "6 weeks ago",
    totalDonations: 10,
    compatibilityScore: 88,
  },
  {
    id: 4,
    name: "Noah Wilson",
    blood: "O-",
    location: "Manhattan, NY",
    availability: true,
    lastDonation: "5 days ago",
    totalDonations: 15,
    compatibilityScore: 98,
  },
];

const sampleRequests = [
  {
    id: "REQ-401",
    recipient: "City Hospital",
    blood: "O+",
    location: "Manhattan, NY",
    status: "Pending",
    urgency: "High",
    units: 3,
  },
  {
    id: "REQ-402",
    recipient: "Brooklyn Med Center",
    blood: "A-",
    location: "Brooklyn, NY",
    status: "Accepted",
    urgency: "Medium",
    units: 2,
  },
  {
    id: "REQ-403",
    recipient: "Queens Care",
    blood: "B+",
    location: "Queens, NY",
    status: "Completed",
    urgency: "Low",
    units: 1,
  },
];

const initialMessages = [
  { id: 1, sender: "Coordinator", text: "Hi! Thanks for responding to the request." },
  { id: 2, sender: "You", text: "Happy to help. I can arrive in 45 minutes." },
  { id: 3, sender: "Coordinator", text: "Great! Please check in at the donor desk." },
];

const metrics = [
  { label: "Donations Made", value: 24 },
  { label: "Lives Saved", value: 72 },
  { label: "Active Requests", value: 6 },
  { label: "Next Appointment", value: "May 12" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "donors", label: "Donor Management" },
  { id: "requests", label: "Blood Requests" },
  { id: "chat", label: "Live Chat" },
  { id: "profile", label: "Profile & History" },
];

function getStatusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "Accepted") return "accepted";
  return "completed";
}

function getAvailabilityClass(active) {
  return active ? "active" : "inactive";
}

function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [role, setRole] = useState("Donor");
  const [authStage, setAuthStage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [requests, setRequests] = useState(sampleRequests);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "Jordan Rivers",
    blood: "O+",
    location: "Manhattan, NY",
    phone: "+1 (555) 928-4091",
    email: "jordan@lifelink.org",
  });
  const [requestForm, setRequestForm] = useState({
    recipient: "",
    blood: "O+",
    location: "",
    urgency: "High",
    units: 1,
  });

  const recommendedDonors = useMemo(() => {
    return sampleDonors
      .filter((donor) => donor.availability)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 3);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "You", text: newMessage },
    ]);
    setNewMessage("");
  };

  const handleRequestSubmit = (event) => {
    event.preventDefault();
    const newRequest = {
      id: `REQ-${410 + requests.length}`,
      recipient: requestForm.recipient,
      blood: requestForm.blood,
      location: requestForm.location,
      status: "Pending",
      urgency: requestForm.urgency,
      units: requestForm.units,
    };
    setRequests((prev) => [newRequest, ...prev]);
    setRequestForm({
      recipient: "",
      blood: "O+",
      location: "",
      urgency: "High",
      units: 1,
    });
    setActiveNav("requests");
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" role="form" aria-label="LifeLink authentication">
          <div className="logo">
            <span>LL</span> LifeLink
          </div>
          <h2>{authStage === "login" ? "Welcome back" : "Create your account"}</h2>
          <p>
            {authStage === "login"
              ? "Securely access donor availability, requests, and analytics."
              : "Join the community to coordinate life-saving donations."}
          </p>
          <div className="input-field">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@lifelink.org" />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" />
          </div>
          {authStage === "register" && (
            <div className="input-field">
              <label htmlFor="confirm">Confirm password</label>
              <input id="confirm" type="password" placeholder="••••••••" />
            </div>
          )}
          <div>
            <span>Role</span>
            <div className="role-toggle" role="radiogroup" aria-label="Select your role">
              {["Donor", "Recipient", "Admin"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={role === item ? "active" : ""}
                  onClick={() => setRole(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            className="primary-btn"
            type="button"
            onClick={authStage === "login" ? handleLogin : handleRegister}
          >
            {authStage === "login" ? "Sign in" : "Create account"}
          </button>
          <button
            className="ghost-btn"
            type="button"
            onClick={() =>
              setAuthStage(authStage === "login" ? "register" : "login")
            }
          >
            {authStage === "login"
              ? "New here? Create account"
              : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <span>LL</span> LifeLink
        </div>
        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${activeNav === item.id ? "active" : ""}`}
              onClick={() => setActiveNav(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="profile-card">
          <strong>{profile.name}</strong>
          <small>{role}</small>
          <small>{profile.location}</small>
        </div>
      </aside>

      <main className="main">
        <header className="top-bar">
          <div className="search" aria-label="Search">
            <span aria-hidden="true">🔎</span>
            <input type="text" placeholder="Search requests, donors, or hospitals" />
          </div>
          <button className="primary-btn" type="button" onClick={() => setActiveNav("requests")}>
            New Request
          </button>
        </header>

        {activeNav === "dashboard" && (
          <>
            <section className="section-grid">
              {metrics.map((metric) => (
                <div className="card" key={metric.label}>
                  <h3>{metric.value}</h3>
                  <p>{metric.label}</p>
                </div>
              ))}
            </section>
            <section className="split">
              <div className="card">
                <h3>Recent Requests</h3>
                <table className="table" aria-label="Recent blood requests">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Blood</th>
                      <th>Status</th>
                      <th>Urgency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 3).map((req) => (
                      <tr key={req.id}>
                        <td>{req.id}</td>
                        <td>{req.blood}</td>
                        <td>
                          <span className={`status-pill ${getStatusClass(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>{req.urgency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card">
                <h3>Community Updates</h3>
                <ul>
                  <li>City Hospital shared a 24-hour response goal.</li>
                  <li>LifeLink reached 500 matched donors in the region.</li>
                  <li>Reminder: schedule post-donation wellness check.</li>
                </ul>
              </div>
            </section>
          </>
        )}

        {activeNav === "donors" && (
          <>
            <section className="card">
              <div className="flex" style={{ justifyContent: "space-between" }}>
                <div>
                  <h3>Donor Availability</h3>
                  <p>Toggle your availability so recipients can request help in real time.</p>
                </div>
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => setAvailability((prev) => !prev)}
                >
                  {availability ? "Set Unavailable" : "Set Available"}
                </button>
              </div>
              <p>
                Status:
                <span className={`status-pill ${getAvailabilityClass(availability)}`}>
                  {availability ? "Available" : "Unavailable"}
                </span>
              </p>
            </section>
            <section className="card">
              <h3>Donor Profiles</h3>
              <table className="table" aria-label="Donor profiles">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Blood Type</th>
                    <th>Location</th>
                    <th>Last Donation</th>
                    <th>Total Donations</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleDonors.map((donor) => (
                    <tr key={donor.id}>
                      <td>{donor.name}</td>
                      <td>
                        <span className="badge">{donor.blood}</span>
                      </td>
                      <td>{donor.location}</td>
                      <td>{donor.lastDonation}</td>
                      <td>{donor.totalDonations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {activeNav === "requests" && (
          <>
            <section className="card">
              <h3>Create Blood Request</h3>
              <form onSubmit={handleRequestSubmit} className="form-grid">
                <label className="input-field">
                  Recipient / Hospital
                  <input
                    value={requestForm.recipient}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        recipient: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="input-field">
                  Blood type
                  <select
                    value={requestForm.blood}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        blood: event.target.value,
                      }))
                    }
                  >
                    {[
                      "O+",
                      "O-",
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                    ].map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="input-field">
                  Location
                  <input
                    value={requestForm.location}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="input-field">
                  Urgency
                  <select
                    value={requestForm.urgency}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        urgency: event.target.value,
                      }))
                    }
                  >
                    {["High", "Medium", "Low"].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="input-field">
                  Units Needed
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={requestForm.units}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        units: Number(event.target.value),
                      }))
                    }
                  />
                </label>
                <div className="footer-actions">
                  <button className="primary-btn" type="submit">
                    Submit Request
                  </button>
                  <button className="ghost-btn" type="button">
                    Save Draft
                  </button>
                </div>
              </form>
            </section>
            <section className="card">
              <h3>Request Tracker</h3>
              <table className="table" aria-label="Blood request tracker">
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Blood</th>
                    <th>Status</th>
                    <th>Units</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <strong>{req.recipient}</strong>
                        <div>{req.location}</div>
                      </td>
                      <td>{req.blood}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>{req.units}</td>
                      <td>
                        <button className="ghost-btn" type="button">
                          {req.status === "Pending" ? "Respond" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {activeNav === "chat" && (
          <section className="card">
            <h3>Live Coordination Chat</h3>
            <div className="chat-box" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.sender === "You" ? "you" : ""}`}
                >
                  <strong>{message.sender}</strong>
                  <div>{message.text}</div>
                </div>
              ))}
            </div>
            <div className="footer-actions">
              <input
                className="ghost-btn"
                style={{ flex: 1 }}
                value={newMessage}
                placeholder="Type a message"
                onChange={(event) => setNewMessage(event.target.value)}
              />
              <button className="primary-btn" type="button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </section>
        )}

        {activeNav === "profile" && (
          <section className="split">
            <div className="card">
              <h3>Edit Profile</h3>
              <div className="form-grid">
                <label className="input-field">
                  Full name
                  <input
                    value={profile.name}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </label>
                <label className="input-field">
                  Blood type
                  <select
                    value={profile.blood}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, blood: event.target.value }))
                    }
                  >
                    {[
                      "O+",
                      "O-",
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                    ].map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="input-field">
                  Location
                  <input
                    value={profile.location}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, location: event.target.value }))
                    }
                  />
                </label>
                <label className="input-field">
                  Phone
                  <input
                    value={profile.phone}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, phone: event.target.value }))
                    }
                  />
                </label>
                <label className="input-field">
                  Email
                  <input
                    value={profile.email}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="footer-actions">
                <button className="primary-btn" type="button">
                  Save changes
                </button>
                <button className="ghost-btn" type="button">
                  Reset
                </button>
              </div>
            </div>
            <div className="card">
              <h3>Donation & Request History</h3>
              <ul>
                <li>Apr 11 · Donated 1 unit (O+) at City Hospital</li>
                <li>Mar 18 · Accepted request REQ-401 (O+) at Manhattan</li>
                <li>Feb 03 · Donated 2 units (O+) at Queens Care</li>
                <li>Jan 19 · Completed request REQ-388 (O+)</li>
              </ul>
              <h3>AI Donor Suggestions</h3>
              <p>Ranked by blood type, distance, and recent donation history.</p>
              {recommendedDonors.map((donor) => (
                <div key={donor.id} className="card" style={{ marginBottom: "12px" }}>
                  <strong>{donor.name}</strong>
                  <div className="flex" style={{ justifyContent: "space-between" }}>
                    <span>{donor.blood} · {donor.location}</span>
                    <span className="badge">Score {donor.compatibilityScore}</span>
                  </div>
                  <small>Last donation: {donor.lastDonation}</small>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
