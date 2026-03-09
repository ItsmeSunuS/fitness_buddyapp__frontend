import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Globe, Lock, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/services/api";

interface Group {
  _id: string;
  name: string;
  description?: string;
  memberCount?: number;
  type?: "public" | "private";
  category?: string;
  joined?: boolean;
}

interface GroupsSectionProps {
  groups: Group[];
  onJoined?: () => void;
}

const MOCK_GROUPS: Group[] = [
  { _id: "g1", name: "Morning Runners NYC", description: "Early morning run club", memberCount: 124, type: "public", category: "Running", joined: true },
  { _id: "g2", name: "HIIT Warriors", description: "High intensity interval training", memberCount: 89, type: "public", category: "HIIT", joined: true },
  { _id: "g3", name: "Weight Loss Support", description: "Community for weight loss journey", memberCount: 230, type: "public", category: "General", joined: false },
  { _id: "g4", name: "Yoga & Mindfulness", description: "Connect mind and body", memberCount: 56, type: "public", category: "Yoga", joined: false },
  { _id: "g5", name: "Powerlifters Club", description: "Strength training community", memberCount: 72, type: "private", category: "Weights", joined: false },
];

const categoryColors: Record<string, string> = {
  Running: "bg-fitness-orange/15 text-fitness-orange",
  HIIT: "bg-fitness-violet/15 text-fitness-violet",
  General: "bg-fitness-teal/15 text-fitness-teal",
  Yoga: "bg-fitness-gold/15 text-fitness-gold",
  Weights: "bg-fitness-red/15 text-fitness-red",
  Cycling: "bg-fitness-teal/15 text-fitness-teal",
};

const AVATAR_COLORS = ["bg-fitness-teal/20 text-fitness-teal", "bg-fitness-violet/20 text-fitness-violet", "bg-fitness-orange/20 text-fitness-orange", "bg-fitness-gold/20 text-fitness-gold"];

const GroupsSection: React.FC<GroupsSectionProps> = ({ groups, onJoined }) => {
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  const displayGroups: Group[] = groups.length > 0 ? groups : MOCK_GROUPS;
  const myGroups = displayGroups.filter((g) => g.joined || joinedIds.has(g._id));
  const availableGroups = displayGroups.filter((g) => !g.joined && !joinedIds.has(g._id));

  const handleJoin = async (id: string) => {
    try {
      await api.post(`/api/groups/${id}/join`);
    } catch (_) {}
    setJoinedIds((prev) => new Set([...prev, id]));
    onJoined?.();
  };

  const handleCreate = async () => {
    if (!newGroupName.trim()) return;
    try {
      await api.post("/api/groups", { name: newGroupName, description: newGroupDesc });
    } catch (_) {}
    setNewGroupName("");
    setNewGroupDesc("");
    setShowCreate(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-fitness-teal" />
          <h3 className="font-bold text-foreground text-sm">Groups</h3>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Create
        </button>
      </div>

      {/* Create group form */}
      {showCreate && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-3 py-3 border-b border-border bg-muted/30"
        >
          <input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group name *"
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary mb-2"
          />
          <input
            value={newGroupDesc}
            onChange={(e) => setNewGroupDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreate(false)}
              className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newGroupName.trim()}
              className="flex-1 py-1.5 text-xs font-medium rounded-lg gradient-hero text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Create Group
            </button>
          </div>
        </motion.div>
      )}

      <div className="p-3 h-72 overflow-y-auto scrollbar-thin space-y-2">
        {/* My groups */}
        {myGroups.length > 0 && (
          <>
            <div className="text-xs text-muted-foreground font-medium px-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> MY GROUPS ({myGroups.length})
            </div>
            {myGroups.map((group, i) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border border-l-2 border-l-fitness-teal"
              >
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className={`text-xs font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                    {group.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{group.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[group.category || ""] || "bg-muted text-muted-foreground"}`}>
                      {group.category || "General"}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5" />{group.memberCount}
                    </span>
                    {group.type === "private" ? (
                      <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                    ) : (
                      <Globe className="w-2.5 h-2.5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}

        {/* Available groups */}
        {availableGroups.length > 0 && (
          <>
            <div className="text-xs text-muted-foreground font-medium px-1 mt-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> DISCOVER GROUPS
            </div>
            {availableGroups.map((group, i) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border hover:border-primary/20 transition-all"
              >
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className={`text-xs font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                    {group.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{group.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[group.category || ""] || "bg-muted text-muted-foreground"}`}>
                      {group.category || "General"}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5" />{group.memberCount}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleJoin(group._id)}
                  className="flex-shrink-0 text-xs font-semibold px-2.5 py-1.5 gradient-hero text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Join
                </button>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupsSection;
