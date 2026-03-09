import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import FitnessCard from "@/components/FitnessCard";
import { getNearbyGyms } from "@/services/gymService";


interface Gym {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  hours: string;
}

// Mock gym data
const mockGyms: Record<string, Gym[]> = {
  "Chennai": [
    { id: "1", name: "Iron Fitness NYC", address: "Anna Nagar, Chennai", rating: 4.8, distance: "0.5 mi", hours: "5AM - 11PM" },
    { id: "2", name: "Equinox Hudson Yards", address: "Buzz Street Banglore", rating: 4.9, distance: "1.2 mi", hours: "5AM - 10PM" },
    { id: "3", name: "Planet Fitness Midtown", address: "Trivandrum Kerala", rating: 4.3, distance: "0.8 mi", hours: "24/7" },
  ],
  "Kerala": [
    { id: "4", name: "Gold's Gym Venice", address: "Kerala", rating: 4.7, distance: "0.3 mi", hours: "4AM - 12AM" },
    { id: "5", name: "Barry's Bootcamp", address: "Kerala, CA", rating: 4.6, distance: "1.5 mi", hours: "6AM - 9PM" },
  ],
  default: [
    { id: "6", name: "FitLife Gym", address: "Banglore", rating: 4.5, distance: "0.7 mi", hours: "6AM - 10PM" },
    { id: "7", name: "PowerHouse Fitness", address: "Chennai", rating: 4.4, distance: "1.0 mi", hours: "5AM - 11PM" },
    { id: "8", name: "CrossFit Box", address: "Kerala", rating: 4.6, distance: "1.3 mi", hours: "6AM - 9PM" },
  ],
};

const GymFinder: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Gym[]>([]);
  const [searched, setSearched] = useState(false);

 const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const gyms = await getNearbyGyms(query);
    setResults(gyms);
  } catch (err) {
    console.error("Error fetching gyms", err);
  }

  setSearched(true);
};

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return "⭐".repeat(full) + (rating % 1 >= 0.5 ? "½" : "");
  };

  return (
    <DashboardLayout>
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Find Nearby Gyms 📍</h1>

      <FitnessCard className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-theme"
            placeholder="Enter city or postal code..."
            required
          />
          <button type="submit" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-primary-glow hover:opacity-90">
            Search
          </button>
        </form>
      </FitnessCard>

      {searched && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((gym) => (
            <FitnessCard key={gym.id}>
              <h3 className="mb-1 font-display text-lg font-bold text-card-foreground">{gym.name}</h3>
              <p className="mb-2 text-sm text-muted-foreground">{gym.address}</p>
              <div className="mb-3 flex items-center gap-4 text-sm">
                <span className="text-foreground">{renderStars(gym.rating)} {gym.rating}</span>
                <span className="text-muted-foreground">📍 {gym.distance}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Hours</span>
                <span className="font-medium text-foreground">{gym.hours}</span>
              </div>
            </FitnessCard>
          ))}
        </div>
      )}

      {searched && results.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <span className="mb-2 block text-4xl">🔍</span>
          No gyms found. Try a different location.
        </div>
      )}
    </DashboardLayout>
  );
};

export default GymFinder;
