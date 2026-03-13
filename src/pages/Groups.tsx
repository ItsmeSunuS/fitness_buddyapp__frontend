import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import FitnessCard from "@/components/FitnessCard";
import ProgressBar from "@/components/ProgressBar";
import AnimatedPage from "@/components/AnimatedPage";
import AnimatedCard from "@/components/AnimatedCard";
import CountUp from "@/components/CountUp";
import api from "@/services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { joinGroup, updateProgress, getGroup,createGroup  } from "@/services/groupService";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

interface GroupMember {
  name: string;
  caloriesBurned: number;
}

interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  totalCalories: number;
  weeklyGoal: number;
}

const MEMBER_COLORS = [
  "hsl(160, 84%, 39%)", "hsl(172, 66%, 50%)", "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)", "hsl(217, 91%, 60%)",
];

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/groups")

const formatted = res.data.map((g: any) => ({
  id: g.id,
  name: g.name,
  weeklyGoal: g.weekly_goal || 5000,
  totalCalories: g.total_calories || 0,
  members: g.members || []
}))

setGroups(formatted)
      } catch {
        setGroups([
          {
            id: "1", name: "Morning Runners", weeklyGoal: 5000,
            totalCalories: 3200,
            members: [
              { name: "You", caloriesBurned: 1200 },
              { name: "Sarah", caloriesBurned: 1100 },
              { name: "Mike", caloriesBurned: 900 },
            ],
          },
          {
            id: "2", name: "Iron Squad", weeklyGoal: 8000,
            totalCalories: 4500,
            members: [
              { name: "You", caloriesBurned: 1500 },
              { name: "Alex", caloriesBurned: 1800 },
              { name: "Emily", caloriesBurned: 1200 },
            ],
          },
        ]);
      }
    };
    fetch();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      members: [{ name: "You", caloriesBurned: 0 }],
      totalCalories: 0,
      weeklyGoal: 5000,
    };
    try {
      const res = await api.post("/api/groups/create", {
  name: newGroupName,
  description: "",
  goalType: "calories",
  targetValue: 5000,
  startDate: new Date(),
  endDate: new Date()
});
    } catch {
      setGroups([newGroup, ...groups]);
    }
    setNewGroupName("");
    setShowCreate(false);
  };

  const handleJoin = async (groupId: string) => {
  try {
    await joinGroup(groupId);
    toast.success("Joined group successfully!");
  } catch (err) {
    toast.success("Could not join group");
  }
};

const viewGroup = async (groupId: string) => {
  try {
    const group = await getGroup(groupId);
    setSelectedGroup(group);   // save group details
  } catch (err) {
    console.error("Failed to load group");
  }
};
  // Aggregated stats for overview chart
  const overviewBarData = groups.map((g) => ({
    name: g.name,
    burned: g.totalCalories,
    goal: g.weeklyGoal,
  }));

//   const handleProgress = async (groupId: string) => {
//   const amount = prompt("Enter calories burned:");

//   if (!amount) return;

//   try {
//     await updateProgress(groupId, Number(amount));
//     toast.success("Progress updated!");
//   } catch {
//     toast.error("Failed to update progress");
//   }
// };


const handleProgress = async (groupId: string) => {

  const result = await Swal.fire({
    title: "Enter calories burned",
    input: "number",
    inputPlaceholder: "Calories burned",
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed || !result.value) return;

  const amount = Number(result.value);

  try {
    await updateProgress(groupId, amount);
    toast.success("Progress updated!");
  } catch {
    toast.error("Failed to update progress");
  }
};

  return (
    <DashboardLayout>
      <AnimatedPage>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">Group Workouts 👥</h1>
          <motion.button
            onClick={() => setShowCreate(!showCreate)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-primary-glow hover:opacity-90"
          >
            {showCreate ? "Cancel" : "+ New Group"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <FitnessCard className="mb-6">
                <form onSubmit={handleCreate} className="flex gap-3">
                  <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} required
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-theme"
                    placeholder="Group name (3-5 members)" />
                 
                 <button type="submit" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">Create</button>
                </form>
              </FitnessCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overview Chart */}
        {groups.length > 0 && (
          <AnimatedCard index={0} className="mb-6">
            <FitnessCard title="Group Performance Overview" icon="📊">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 90%)" opacity={0.4} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(160, 10%, 45%)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(160, 10%, 45%)" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(160, 15%, 90%)" }} />
                    <Bar dataKey="burned" name="Burned" fill="hsl(160, 84%, 39%)" radius={[6, 6, 0, 0]} animationDuration={1200} />
                    <Bar dataKey="goal" name="Goal" fill="hsl(160, 84%, 39%)" opacity={0.2} radius={[6, 6, 0, 0]} animationDuration={1200} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </FitnessCard>
          </AnimatedCard>
        )}

        {/* Group cards with pie charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {groups.map((group, gi) => {
            const pieData = group.members.map((m) => ({ name: m.name, value: m.caloriesBurned }));
            return (
              <AnimatedCard key={group.id} index={gi + 1}>
                <FitnessCard title={group.name} icon="👥">
                  {/* Combined progress */}
                  <ProgressBar
                    value={(group.totalCalories / group.weeklyGoal) * 100}
                    label={`${group.totalCalories.toLocaleString()} / ${group.weeklyGoal.toLocaleString()} cal`}
                    size="lg"
                    color="accent"
                  />
                  <div className="flex gap-2 mt-2">
            <button
            onClick={() => handleProgress(group.id)}
            className="rounded-md bg-green-500 px-3 py-1 text-sm text-white"
             >
                Add Progress
              </button>

              <button
                onClick={() => handleJoin(group.id)}
                className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white"
              >
                Join Group
              </button>

              <button
                onClick={() => viewGroup(group.id)}
                className="rounded-md bg-purple-500 px-3 py-1 text-sm text-white"
              >
                View Details
              </button>
            </div>
                              {/* Member pie chart */}
                              <div className="mt-4 flex items-center">
                                <div className="h-40 w-1/2">
                                {selectedGroup?.id === group.id && (
              <FitnessCard className="mt-4">
                <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
                <p>{selectedGroup.description}</p>

                <p><b>Goal:</b> {selectedGroup.goal_type}</p>
                <p><b>Target:</b> {selectedGroup.target_value}</p>
                <p><b>Start:</b> {selectedGroup.start_date}</p>
                <p><b>End:</b> {selectedGroup.end_date}</p>
              </FitnessCard>
            )}
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value" animationDuration={1200}>
                            {pieData.map((_, i) => <Cell key={i} fill={MEMBER_COLORS[i % MEMBER_COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: "12px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 space-y-2">
                      <p className="text-sm font-medium text-foreground mb-2">Contributions</p>
                      {group.members.map((m, i) => (
                        <div key={m.name} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length] }} />
                          <span className="text-sm text-muted-foreground flex-1">{m.name}</span>
                          <span className="text-sm font-semibold text-foreground">
                            <CountUp end={m.caloriesBurned} duration={1} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FitnessCard>
              </AnimatedCard>
            );
          })}
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
};

export default Groups;
