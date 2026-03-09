import FitnessCard from "./FitnessCard";

const WorkoutStreak = ({ streak }: any) => {
  return (
    <div className="mb-8">
      <FitnessCard title="Workout Streak" icon="🔥">
        <h2 className="text-4xl font-bold">{streak} days</h2>
        <p className="text-sm text-muted-foreground">
          Keep your streak alive!
        </p>
      </FitnessCard>
    </div>
  );
};

export default WorkoutStreak;