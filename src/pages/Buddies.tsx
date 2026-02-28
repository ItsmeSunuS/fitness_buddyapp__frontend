import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import FitnessCard from "@/components/FitnessCard";
import {
  getSuggestedBuddies,
  getMyBuddies,
  addBuddy as addBuddyService,
} from "@/services/buddyService";

interface Buddy {
  id: string;
  name: string;
  fitnessGoals: string[];
  preferredWorkouts: string[];
  location: string;
  isBuddy?: boolean;
}

const Buddies: React.FC = () => {
  const [suggested, setSuggested] = useState<Buddy[]>([]);
  const [myBuddies, setMyBuddies] = useState<Buddy[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Buddy | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        const [suggestedData, myData] = await Promise.all([
          getSuggestedBuddies(),
          getMyBuddies(),
        ]);

        setSuggested(suggestedData);
        setMyBuddies(myData);
      } catch (error) {
        console.error("Failed to fetch buddies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuddies();
  }, []);

  const handleAddBuddy = async (buddy: Buddy) => {
    try {
      setAddingId(buddy.id);

      await addBuddyService(buddy.id);

      setMyBuddies((prev) => [...prev, { ...buddy, isBuddy: true }]);
      setSuggested((prev) => prev.filter((s) => s.id !== buddy.id));
    } catch (err) {
      console.error("Failed to add buddy:", err);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-16">
          <p className="text-muted-foreground text-lg">Loading buddies...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">
        Workout Buddies 🤝
      </h1>

      {/* Profile Modal */}
      {selectedProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
          onClick={() => setSelectedProfile(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-fitness-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {selectedProfile.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-card-foreground">
                  {selectedProfile.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  📍 {selectedProfile.location}
                </p>
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1 text-sm font-medium text-foreground">
                Fitness Goals
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedProfile.fitnessGoals.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-1 text-sm font-medium text-foreground">
                Preferred Workouts
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedProfile.preferredWorkouts.map((w) => (
                  <span
                    key={w}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedProfile(null)}
              className="w-full rounded-xl bg-muted py-2.5 text-sm font-medium text-foreground hover:bg-muted/80"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Suggested Buddies */}
        <FitnessCard title="Suggested Buddies" icon="✨">
          <div className="space-y-3">
            {suggested.length === 0 && (
              <p className="py-4 text-center text-muted-foreground">
                No suggestions right now
              </p>
            )}

            {suggested.map((b) => {
              const alreadyAdded = myBuddies.some(
                (buddy) => buddy.id === b.id
              );

              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/50 p-4"
                >
                  <div
                    className="flex cursor-pointer items-center gap-3"
                    onClick={() => setSelectedProfile(b)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">
                        📍 {b.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddBuddy(b)}
                    disabled={alreadyAdded || addingId === b.id}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {addingId === b.id ? "Adding..." : "Add Buddy"}
                  </button>
                </div>
              );
            })}
          </div>
        </FitnessCard>

        {/* My Buddies */}
        <FitnessCard title="My Buddies" icon="💪">
          <div className="space-y-3">
            {myBuddies.length === 0 && (
              <p className="py-4 text-center text-muted-foreground">
                No buddies yet. Add some!
              </p>
            )}

            {myBuddies.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl border border-border bg-muted/50 p-4"
              >
                <div
                  className="flex cursor-pointer items-center gap-3"
                  onClick={() => setSelectedProfile(b)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 font-bold text-success">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.preferredWorkouts.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </div>

                <button className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                  Share
                </button>
              </div>
            ))}
          </div>
        </FitnessCard>
      </div>
    </DashboardLayout>
  );
};

export default Buddies;