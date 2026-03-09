import React, { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { format, subDays, startOfWeek, parseISO } from "date-fns";

interface Workout {
  id?: string;
  _id?: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}

interface WorkoutAnalyticsProps {
  workouts: Workout[];
}

const COLORS = ["hsl(24,95%,55%)", "hsl(171,80%,40%)", "hsl(260,70%,60%)", "hsl(45,95%,55%)", "hsl(0,85%,55%)"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-card text-xs">
        <div className="text-muted-foreground mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const WorkoutAnalytics: React.FC<WorkoutAnalyticsProps> = ({ workouts }) => {
  // Weekly calories (last 7 days)
  const weeklyCalories = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayWorkouts = workouts.filter((w) => w.date?.startsWith(dateStr));
      return {
        day: format(date, "EEE"),
        calories: dayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
        duration: dayWorkouts.reduce((s, w) => s + w.duration, 0),
      };
    });
  }, [workouts]);

  // Type distribution
  const typeDist = useMemo(() => {
    const map: Record<string, number> = {};
    workouts.forEach((w) => { map[w.type] = (map[w.type] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [workouts]);

  // Monthly progress (last 4 weeks)
  const monthlyProgress = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const weekStart = subDays(new Date(), (3 - i) * 7 + 6);
      const weekEnd = subDays(new Date(), (3 - i) * 7);
      const weekWorkouts = workouts.filter((w) => {
        const d = new Date(w.date);
        return d >= weekStart && d <= weekEnd;
      });
      return {
        week: `W${i + 1}`,
        workouts: weekWorkouts.length,
        calories: weekWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
        duration: weekWorkouts.reduce((s, w) => s + w.duration, 0),
      };
    });
  }, [workouts]);

  // Mock data if empty
  const effectiveWeekly = weeklyCalories.some((d) => d.calories > 0)
    ? weeklyCalories
    : [
        { day: "Mon", calories: 320, duration: 35 },
        { day: "Tue", calories: 0, duration: 0 },
        { day: "Wed", calories: 540, duration: 55 },
        { day: "Thu", calories: 420, duration: 45 },
        { day: "Fri", calories: 380, duration: 40 },
        { day: "Sat", calories: 620, duration: 65 },
        { day: "Sun", calories: 280, duration: 30 },
      ];

  const effectiveTypeDist = typeDist.length > 0
    ? typeDist
    : [
        { name: "Running", value: 8 },
        { name: "HIIT", value: 5 },
        { name: "Weights", value: 6 },
        { name: "Cycling", value: 3 },
        { name: "Yoga", value: 2 },
      ];

  const effectiveMonthly = monthlyProgress.some((d) => d.workouts > 0)
    ? monthlyProgress
    : [
        { week: "W1", workouts: 4, calories: 1500, duration: 180 },
        { week: "W2", workouts: 5, calories: 1900, duration: 220 },
        { week: "W3", workouts: 3, calories: 1200, duration: 160 },
        { week: "W4", workouts: 6, calories: 2400, duration: 270 },
      ];

  const chartStyle = {
    fontSize: "11px",
    fill: "hsl(220, 10%, 50%)",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Workout Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Calories - Area Chart */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Weekly Calories Burned</h3>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={effectiveWeekly}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(24,95%,55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(24,95%,55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
              <XAxis dataKey="day" tick={chartStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="calories"
                name="Calories"
                stroke="hsl(24,95%,55%)"
                strokeWidth={2}
                fill="url(#calGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Duration - Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Daily Duration (min)</h3>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={effectiveWeekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
              <XAxis dataKey="day" tick={chartStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="duration" name="Minutes" fill="hsl(171,80%,40%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Type - Pie Chart */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Workout Type Distribution</h3>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie
                  data={effectiveTypeDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {effectiveTypeDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 flex-1">
              {effectiveTypeDist.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground flex-1 truncate">{item.name}</span>
                  <span className="text-xs font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Progress - Line Chart */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Monthly Progress</h3>
            <p className="text-xs text-muted-foreground">Workouts per week</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={effectiveMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
              <XAxis dataKey="week" tick={chartStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="workouts"
                name="Workouts"
                stroke="hsl(260,70%,60%)"
                strokeWidth={2.5}
                dot={{ fill: "hsl(260,70%,60%)", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="calories"
                name="Calories"
                stroke="hsl(24,95%,55%)"
                strokeWidth={2}
                dot={{ fill: "hsl(24,95%,55%)", r: 3 }}
                activeDot={{ r: 5 }}
                yAxisId={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WorkoutAnalytics;
