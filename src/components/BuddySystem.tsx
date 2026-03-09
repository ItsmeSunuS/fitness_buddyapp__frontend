import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, UserCheck, Search, Sparkles, X, MapPin, Dumbbell, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";

interface Buddy {
  _id: string;
  name: string;
  fitnessGoals?: string[];
  preferredWorkouts?: string[];
  location?: string;
  workoutCount?: number;
  matchScore?: number;
}

interface BuddySystemProps {
  myBuddies: Buddy[];
  onBuddyAdded?: () => void;
}

const AVATAR_COLORS = [
  "bg-fitness-teal/20 text-fitness-teal",
  "bg-fitness-violet/20 text-fitness-violet",
  "bg-fitness-orange/20 text-fitness-orange",
  "bg-fitness-gold/20 text-fitness-gold",
  "bg-fitness-red/20 text-fitness-red",
];

const MOCK_SUGGESTIONS: Buddy[] = [
  { _id: "s1", name: "Jordan Lee", fitnessGoals: ["Lose Weight"], preferredWorkouts: ["Running", "HIIT"], location: "New York", workoutCount: 24, matchScore: 95 },
  { _id: "s2", name: "Sam Rivera", fitnessGoals: ["Build Muscle"], preferredWorkouts: ["Weight Training"], location: "LA", workoutCount: 31, matchScore: 88 },
  { _id: "s3", name: "Taylor Kim", fitnessGoals: ["Endurance"], preferredWorkouts: ["Cycling", "Running"], location: "Chicago", workoutCount: 18, matchScore: 82 },
  { _id: "s4", name: "Morgan Chen", fitnessGoals: ["Flexibility"], preferredWorkouts: ["Yoga", "Pilates"], location: "Miami", workoutCount: 12, matchScore: 76 },
  { _id: "s5", name: "Casey Park", fitnessGoals: ["Lose Weight", "Cardio"], preferredWorkouts: ["HIIT", "Swimming"], location: "Seattle", workoutCount: 22, matchScore: 91 },
];

const BuddyCard: React.FC<{
  buddy: Buddy;
  index: number;
  isAdded: boolean;
  showMatch?: boolean;
  onAdd: (id: string) => void;
  onView: (buddy: Buddy) => void;
}> = ({ buddy, index, isAdded, showMatch, onAdd, onView }) => {
  const initials = buddy.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-all"
    >
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarFallback className={`text-sm font-bold ${colorClass}`}>{initials}</AvatarFallback>
        </Avatar>
        {showMatch && buddy.matchScore && (
          <div className="absolute -top-1 -right-1 bg-fitness-teal text-xs text-card font-bold rounded-full w-5 h-5 flex items-center justify-center text-[9px]">
            {buddy.matchScore}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onView(buddy)}>
        <div className="text-sm font-semibold text-foreground truncate">{buddy.name}</div>
        <div className="flex items-center gap-1 flex-wrap mt-0.5">
          {buddy.preferredWorkouts?.slice(0, 2).map((w) => (
            <span key={w} className="text-xs bg-card border border-border px-1.5 py-0.5 rounded text-muted-foreground">{w}</span>
          ))}
          {buddy.location && (
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />{buddy.location}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => !isAdded && onAdd(buddy._id)}
        className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
          isAdded
            ? "bg-fitness-teal/20 text-fitness-teal cursor-default"
            : "bg-primary/20 text-primary hover:bg-primary/30"
        }`}
      >
        {isAdded ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
      </button>
    </motion.div>
  );
};

const BuddyModal: React.FC<{ buddy: Buddy | null; onClose: () => void; index: number }> = ({ buddy, onClose, index }) => {
  if (!buddy) return null;
  const initials = buddy.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-card"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-14 h-14">
                <AvatarFallback className={`text-lg font-bold ${colorClass}`}>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-foreground text-lg">{buddy.name}</div>
                {buddy.location && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{buddy.location}
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {buddy.matchScore && (
            <div className="flex items-center gap-2 bg-fitness-teal/10 rounded-lg p-3 mb-4 border border-fitness-teal/20">
              <Star className="w-4 h-4 text-fitness-teal" />
              <span className="text-sm text-fitness-teal font-semibold">{buddy.matchScore}% Match Score</span>
            </div>
          )}

          <div className="space-y-3">
            {buddy.fitnessGoals && buddy.fitnessGoals.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-1.5 font-medium">FITNESS GOALS</div>
                <div className="flex flex-wrap gap-1.5">
                  {buddy.fitnessGoals.map((g) => (
                    <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
                  ))}
                </div>
              </div>
            )}
            {buddy.preferredWorkouts && buddy.preferredWorkouts.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-1.5 font-medium">PREFERRED WORKOUTS</div>
                <div className="flex flex-wrap gap-1.5">
                  {buddy.preferredWorkouts.map((w) => (
                    <Badge key={w} variant="outline" className="text-xs border-border text-foreground">{w}</Badge>
                  ))}
                </div>
              </div>
            )}
            {buddy.workoutCount !== undefined && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Dumbbell className="w-4 h-4 text-primary" />
                <span>{buddy.workoutCount} workouts completed</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-5">
            <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors">
              Message
            </button>
            <button className="flex-1 py-2 text-sm font-semibold rounded-lg gradient-hero text-primary-foreground hover:opacity-90 transition-opacity">
              Add Buddy
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const BuddySystem: React.FC<BuddySystemProps> = ({ myBuddies, onBuddyAdded }) => {
  const [tab, setTab] = useState<"my" | "suggestions" | "match">("my");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);
  const [selectedBuddyIndex, setSelectedBuddyIndex] = useState(0);
  const [matchSearch, setMatchSearch] = useState("");

  const handleAdd = async (id: string) => {
    try {
      await api.post(`/api/buddies/${id}`);
    } catch (_) {}
    setAddedIds((prev) => new Set([...prev, id]));
    onBuddyAdded?.();
  };

  const handleView = (buddy: Buddy, index: number) => {
    setSelectedBuddy(buddy);
    setSelectedBuddyIndex(index);
  };

  const filteredMatches = MOCK_SUGGESTIONS
    .filter((b) => b.name.toLowerCase().includes(matchSearch.toLowerCase()) ||
      b.preferredWorkouts?.some((w) => w.toLowerCase().includes(matchSearch.toLowerCase())))
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const displayBuddies: Buddy[] = myBuddies.length > 0
    ? myBuddies
    : [
        { _id: "b1", name: "Jordan Lee", preferredWorkouts: ["Running"], location: "New York" },
        { _id: "b2", name: "Sam Rivera", preferredWorkouts: ["Weight Training"], location: "LA" },
      ];

  const tabs = [
    { id: "my" as const, label: `My Buddies (${displayBuddies.length})` },
    { id: "suggestions" as const, label: "Suggested" },
    { id: "match" as const, label: "Find Match" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-bold text-foreground text-sm">Buddy System</h3>
        <span className="text-xs text-muted-foreground">{displayBuddies.length} buddies</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 text-xs font-medium py-2.5 transition-colors relative ${
              tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="p-3 h-72 overflow-y-auto scrollbar-thin space-y-2">
        {tab === "my" && (
          <>
            {displayBuddies.map((buddy, i) => (
              <BuddyCard
                key={buddy._id}
                buddy={buddy}
                index={i}
                isAdded={true}
                onAdd={handleAdd}
                onView={(b) => handleView(b, i)}
              />
            ))}
          </>
        )}

        {tab === "suggestions" && (
          <>
            <div className="flex items-center gap-1.5 bg-fitness-violet/10 rounded-lg px-3 py-2 border border-fitness-violet/20 mb-2">
              <Sparkles className="w-3 h-3 text-fitness-violet flex-shrink-0" />
              <span className="text-xs text-fitness-violet">People with similar fitness goals</span>
            </div>
            {MOCK_SUGGESTIONS.slice(0, 5).map((buddy, i) => (
              <BuddyCard
                key={buddy._id}
                buddy={buddy}
                index={i}
                isAdded={addedIds.has(buddy._id)}
                showMatch
                onAdd={handleAdd}
                onView={(b) => handleView(b, i)}
              />
            ))}
          </>
        )}

        {tab === "match" && (
          <>
            <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1.5 mb-2">
              <Search className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <input
                value={matchSearch}
                onChange={(e) => setMatchSearch(e.target.value)}
                placeholder="Search by name or workout..."
                className="bg-transparent text-xs w-full outline-none text-foreground placeholder:text-muted-foreground"
              />
              {matchSearch && (
                <button onClick={() => setMatchSearch("")}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
            {filteredMatches.map((buddy, i) => (
              <BuddyCard
                key={buddy._id}
                buddy={buddy}
                index={i}
                isAdded={addedIds.has(buddy._id)}
                showMatch
                onAdd={handleAdd}
                onView={(b) => handleView(b, i)}
              />
            ))}
          </>
        )}
      </div>

      <BuddyModal
        buddy={selectedBuddy}
        index={selectedBuddyIndex}
        onClose={() => setSelectedBuddy(null)}
      />
    </div>
  );
};

export default BuddySystem;
