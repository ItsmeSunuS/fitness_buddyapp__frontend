import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CHART_COLORS = [
  "hsl(185,85%,48%)", "hsl(258,78%,68%)", "hsl(142,70%,45%)",
  "hsl(38,90%,55%)", "hsl(0,72%,58%)", "hsl(215,80%,60%)",
];

const mockSignupData = [
  { month: "Jan", users: 12 }, { month: "Feb", users: 19 }, { month: "Mar", users: 28 },
  { month: "Apr", users: 35 }, { month: "May", users: 42 }, { month: "Jun", users: 58 },
];
const mockActivityData = [
  { day: "Mon", workouts: 45, challenges: 12 }, { day: "Tue", workouts: 52, challenges: 18 },
  { day: "Wed", workouts: 61, challenges: 15 }, { day: "Thu", workouts: 40, challenges: 20 },
  { day: "Fri", workouts: 55, challenges: 22 }, { day: "Sat", workouts: 70, challenges: 30 },
  { day: "Sun", workouts: 48, challenges: 14 },
];
const mockEngagementData = [
  { name: "Active", value: 65 }, { name: "Moderate", value: 20 }, { name: "Inactive", value: 15 },
];
const mockRevenueData = [
  { month: "Jan", revenue: 2400 }, { month: "Feb", revenue: 3200 },
  { month: "Mar", revenue: 4100 }, { month: "Apr", revenue: 3800 },
  { month: "May", revenue: 5200 }, { month: "Jun", revenue: 6100 },
];
const recentActivity = [
  { user: "Sarah Chen", action: "Completed 30-Day Challenge", time: "2 min ago", type: "challenge" },
  { user: "Mike Johnson", action: "Logged 45min cardio workout", time: "15 min ago", type: "workout" },
  { user: "John Doe", action: "Joined a new group", time: "1 hr ago", type: "group" },
  { user: "Emma Wilson", action: "Found a new buddy", time: "2 hr ago", type: "buddy" },
  { user: "Alex Park", action: "Updated profile", time: "3 hr ago", type: "profile" },
];
const activityIcons: Record<string, string> = {
  challenge: "🏆", workout: "🏋️", group: "👥", buddy: "🤝", profile: "👤",
};

interface User { id: string; name: string; email: string; role: string; profileCompleted: boolean; createdAt: string; lastActive: string; workoutsCount: number; }
interface Gym { id: string; name: string; location: string; members: number; status: "active" | "inactive"; createdAt: string; }
interface Challenge { id: string; title: string; participants: number; duration: string; status: "active" | "completed" | "draft"; createdAt: string; }
interface Group { id: string; name: string; members: number; category: string; createdAt: string; }
interface Workout { id: string; user: string; type: string; duration: string; calories: number; date: string; }

const initialUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "user", profileCompleted: true, createdAt: "2024-01-15", lastActive: "2 hr ago", workoutsCount: 34 },
  { id: "2", name: "Sarah Chen", email: "sarah@example.com", role: "user", profileCompleted: true, createdAt: "2024-02-10", lastActive: "5 min ago", workoutsCount: 67 },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "user", profileCompleted: false, createdAt: "2024-03-05", lastActive: "1 day ago", workoutsCount: 12 },
  { id: "4", name: "Admin User", email: "admin@example.com", role: "admin", profileCompleted: true, createdAt: "2024-01-01", lastActive: "Just now", workoutsCount: 89 },
  { id: "5", name: "Emma Wilson", email: "emma@example.com", role: "user", profileCompleted: true, createdAt: "2024-04-20", lastActive: "30 min ago", workoutsCount: 45 },
  { id: "6", name: "Alex Park", email: "alex@example.com", role: "moderator", profileCompleted: true, createdAt: "2024-02-28", lastActive: "1 hr ago", workoutsCount: 56 },
];
const initialGyms: Gym[] = [
  { id: "1", name: "FitZone Downtown", location: "New York, NY", members: 234, status: "active", createdAt: "2023-06-01" },
  { id: "2", name: "PowerHouse Gym", location: "Los Angeles, CA", members: 189, status: "active", createdAt: "2023-08-15" },
  { id: "3", name: "Iron Temple", location: "Chicago, IL", members: 156, status: "inactive", createdAt: "2023-09-20" },
  { id: "4", name: "Apex Fitness", location: "Houston, TX", members: 302, status: "active", createdAt: "2023-11-05" },
  { id: "5", name: "Peak Performance", location: "Phoenix, AZ", members: 98, status: "active", createdAt: "2024-01-12" },
];
const initialChallenges: Challenge[] = [
  { id: "1", title: "30-Day Abs Challenge", participants: 145, duration: "30 days", status: "active", createdAt: "2024-01-10" },
  { id: "2", title: "10K Steps Daily", participants: 289, duration: "7 days", status: "active", createdAt: "2024-02-05" },
  { id: "3", title: "Summer Shred", participants: 67, duration: "60 days", status: "completed", createdAt: "2023-06-01" },
  { id: "4", title: "Beginner Yoga Journey", participants: 112, duration: "21 days", status: "active", createdAt: "2024-03-01" },
  { id: "5", title: "Marathon Prep", participants: 34, duration: "90 days", status: "draft", createdAt: "2024-04-15" },
];
const initialGroups: Group[] = [
  { id: "1", name: "Morning Warriors", members: 45, category: "Cardio", createdAt: "2024-01-08" },
  { id: "2", name: "Powerlifters Unite", members: 28, category: "Strength", createdAt: "2024-02-14" },
  { id: "3", name: "Yoga & Mindfulness", members: 67, category: "Flexibility", createdAt: "2024-01-22" },
  { id: "4", name: "Cycling Enthusiasts", members: 53, category: "Endurance", createdAt: "2024-03-05" },
  { id: "5", name: "HIIT Addicts", members: 89, category: "HIIT", createdAt: "2024-02-28" },
];
const workouts: Workout[] = [
  { id: "1", user: "Sarah Chen", type: "Cardio", duration: "45 min", calories: 420, date: "Today 09:00" },
  { id: "2", user: "Mike Johnson", type: "Strength", duration: "60 min", calories: 380, date: "Today 07:30" },
  { id: "3", user: "John Doe", type: "HIIT", duration: "30 min", calories: 510, date: "Yesterday 18:00" },
  { id: "4", user: "Emma Wilson", type: "Yoga", duration: "50 min", calories: 190, date: "Yesterday 07:00" },
  { id: "5", user: "Alex Park", type: "Cycling", duration: "75 min", calories: 650, date: "2 days ago" },
  { id: "6", user: "Admin User", type: "Swimming", duration: "40 min", calories: 350, date: "2 days ago" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color }: { icon: string; label: string; value: number | string; sub?: string; color: string; }) => (
  <div className="card-glass rounded-2xl p-5 flex items-center gap-4 animate-fade-in hover:glow-primary transition-all duration-300">
    <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-foreground text-2xl font-display font-bold">{value}</p>
      {sub && <p className="text-muted-foreground text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

const SectionCard = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="card-glass rounded-2xl p-5 animate-fade-in">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display font-semibold text-foreground">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const Badge = ({ label, variant }: { label: string; variant: "success" | "warning" | "destructive" | "muted" | "primary" | "accent" }) => {
  const cls = {
    success: "bg-success/15 text-success", warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive", muted: "bg-muted text-muted-foreground",
    primary: "bg-primary/15 text-primary", accent: "bg-accent/15 text-accent",
  }[variant];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
};

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="rounded-lg px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">Delete</button>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-glass rounded-xl p-3 text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
type Tab = "overview" | "users" | "gyms" | "challenges" | "groups" | "workouts" | "analytics";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [gyms, setGyms] = useState<Gym[]>(initialGyms);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddGym, setShowAddGym] = useState(false);
  const [newGym, setNewGym] = useState({ name: "", location: "" });

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "gyms", label: "Gyms", icon: "🏋️" },
    { id: "challenges", label: "Challenges", icon: "🏆" },
    { id: "groups", label: "Groups", icon: "🫂" },
    { id: "workouts", label: "Workouts", icon: "💪" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  const addGym = () => {
    if (!newGym.name || !newGym.location) return;
    setGyms([...gyms, { id: Date.now().toString(), name: newGym.name, location: newGym.location, members: 0, status: "active", createdAt: new Date().toISOString().split("T")[0] }]);
    setNewGym({ name: "", location: "" });
    setShowAddGym(false);
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalWorkouts = users.reduce((s, u) => s + u.workoutsCount, 0);
  const activeUsers = users.filter(u => u.profileCompleted).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
              <span className="text-primary">⚡</span> Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">Platform management & analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg glow-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ──────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="👤" label="Total Users" value={users.length} sub={`${activeUsers} active`} color="bg-primary/10" />
              <StatCard icon="🏋️" label="Total Gyms" value={gyms.length} sub={`${gyms.filter(g=>g.status==="active").length} active`} color="bg-accent/10" />
              <StatCard icon="🏆" label="Challenges" value={challenges.length} sub={`${challenges.filter(c=>c.status==="active").length} running`} color="bg-success/10" />
              <StatCard icon="💪" label="Total Workouts" value={totalWorkouts} sub="across all users" color="bg-warning/10" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="🫂" label="Groups" value={groups.length} color="bg-primary/10" />
              <StatCard icon="✅" label="Completed Profiles" value={activeUsers} color="bg-success/10" />
              <StatCard icon="🛡️" label="Admins" value={users.filter(u=>u.role==="admin").length} color="bg-warning/10" />
              <StatCard icon="📊" label="Avg Workouts" value={Math.round(totalWorkouts / users.length)} sub="per user" color="bg-accent/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <SectionCard title="Weekly Activity">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={mockActivityData}>
                      <defs>
                        <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(185,85%,48%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(185,85%,48%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(258,78%,68%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(258,78%,68%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,18%)" />
                      <XAxis dataKey="day" tick={{ fill: "hsl(215,16%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(215,16%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="workouts" name="Workouts" stroke="hsl(185,85%,48%)" fill="url(#wGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="challenges" name="Challenges" stroke="hsl(258,78%,68%)" fill="url(#cGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </SectionCard>
              </div>
              <SectionCard title="Engagement">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={mockEngagementData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}>
                      {mockEngagementData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </SectionCard>
            </div>

            <SectionCard title="Recent Activity">
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <span className="text-xl">{activityIcons[a.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground"><span className="font-medium">{a.user}</span> {a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                    <Badge label={a.type} variant="muted" />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── USERS ──────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search users..." className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Email", "Role", "Profile", "Last Active", "Workouts", "Actions"].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs">{u.name.charAt(0)}</div>
                            <span className="font-medium text-foreground">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <Badge label={u.role} variant={u.role === "admin" ? "warning" : u.role === "moderator" ? "accent" : "muted"} />
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge label={u.profileCompleted ? "Complete" : "Pending"} variant={u.profileCompleted ? "success" : "warning"} />
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs">{u.lastActive}</td>
                        <td className="px-5 py-3.5 text-foreground font-medium">{u.workoutsCount}</td>
                        <td className="px-5 py-3.5">
                          {u.role !== "admin" && <DeleteButton onClick={() => setUsers(users.filter(x => x.id !== u.id))} />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{filteredUsers.length} users</span>
              </div>
            </div>
          </div>
        )}

        {/* ── GYMS ───────────────────────────────────── */}
        {activeTab === "gyms" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowAddGym(!showAddGym)}
                className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-all glow-primary">
                + Add Gym
              </button>
            </div>

            {showAddGym && (
              <div className="card-glass rounded-2xl p-5 animate-scale-in">
                <h3 className="font-display font-semibold text-foreground mb-4">Add New Gym</h3>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <input value={newGym.name} onChange={e => setNewGym({ ...newGym, name: e.target.value })}
                    placeholder="Gym name" className="rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <input value={newGym.location} onChange={e => setNewGym({ ...newGym, location: e.target.value })}
                    placeholder="Location (City, State)" className="rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
                <div className="flex gap-2">
                  <button onClick={addGym} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">Add Gym</button>
                  <button onClick={() => setShowAddGym(false)} className="rounded-xl bg-muted text-muted-foreground px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gyms.map(gym => (
                <div key={gym.id} className="card-glass rounded-2xl p-5 animate-fade-in hover:border-primary/30 border border-border transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-display font-semibold text-foreground">{gym.name}</h4>
                      <p className="text-muted-foreground text-xs mt-0.5">📍 {gym.location}</p>
                    </div>
                    <Badge label={gym.status} variant={gym.status === "active" ? "success" : "muted"} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{gym.members} members</span>
                    <DeleteButton onClick={() => setGyms(gyms.filter(g => g.id !== gym.id))} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Added {gym.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHALLENGES ─────────────────────────────── */}
        {activeTab === "challenges" && (
          <div className="space-y-4">
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Challenge", "Participants", "Duration", "Status", "Created", "Actions"].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {challenges.map((c, i) => (
                      <tr key={c.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏆</span>
                            <span className="font-medium text-foreground">{c.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-foreground font-medium">{c.participants}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{c.duration}</td>
                        <td className="px-5 py-3.5">
                          <Badge label={c.status} variant={c.status === "active" ? "success" : c.status === "completed" ? "primary" : "muted"} />
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs">{c.createdAt}</td>
                        <td className="px-5 py-3.5">
                          <DeleteButton onClick={() => setChallenges(challenges.filter(x => x.id !== c.id))} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">{challenges.length} challenges total</span>
              </div>
            </div>
          </div>
        )}

        {/* ── GROUPS ─────────────────────────────────── */}
        {activeTab === "groups" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <div key={group.id} className="card-glass rounded-2xl p-5 animate-fade-in hover:border-accent/30 border border-border transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-display font-semibold text-foreground">{group.name}</h4>
                    <p className="text-muted-foreground text-xs mt-0.5">{group.category}</p>
                  </div>
                  <span className="text-2xl">🫂</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{group.members} members</span>
                  <DeleteButton onClick={() => setGroups(groups.filter(g => g.id !== group.id))} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Created {group.createdAt}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── WORKOUTS ───────────────────────────────── */}
        {activeTab === "workouts" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🏃", label: "Total Logged", value: workouts.length + "k" },
                { icon: "🔥", label: "Avg Calories", value: Math.round(workouts.reduce((s,w)=>s+w.calories,0)/workouts.length) },
                { icon: "⏱️", label: "Avg Duration", value: "48 min" },
                { icon: "📅", label: "This Week", value: 4 },
              ].map((s, i) => <StatCard key={i} icon={s.icon} label={s.label} value={s.value} color={["bg-primary/10","bg-accent/10","bg-success/10","bg-warning/10"][i]} />)}
            </div>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["User", "Type", "Duration", "Calories", "Date"].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map((w, i) => (
                      <tr key={w.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">{w.user.charAt(0)}</div>
                            <span className="text-foreground font-medium">{w.user}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge label={w.type} variant={w.type==="Cardio"?"primary":w.type==="Strength"?"warning":w.type==="HIIT"?"destructive":"muted"} />
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{w.duration}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-foreground font-medium">{w.calories}</span>
                          <span className="text-muted-foreground text-xs ml-1">kcal</span>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs">{w.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ──────────────────────────────── */}
        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-4">
            <SectionCard title="User Signups">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockSignupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,18%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(215,16%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215,16%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="users" name="Users" fill="hsl(185,85%,48%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard title="Monthly Revenue">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(258,78%,68%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(258,78%,68%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,18%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(215,16%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215,16%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(258,78%,68%)" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard title="Daily Activity">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={mockActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,18%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215,16%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215,16%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend formatter={v => <span style={{ color: "hsl(215,16%,55%)", fontSize: "12px" }}>{v}</span>} />
                  <Line type="monotone" dataKey="workouts" name="Workouts" stroke="hsl(185,85%,48%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="challenges" name="Challenges" stroke="hsl(142,70%,45%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard title="User Engagement">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={mockEngagementData} cx="50%" cy="50%" outerRadius={90}
                    dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {mockEngagementData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
