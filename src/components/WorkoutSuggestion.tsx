import FitnessCard from "./FitnessCard";

const WorkoutSuggestion = ({ workouts }: any) => {

  const types = workouts.map((w:any)=>w.type);

  let suggestion = "Try a light cardio workout today";

  if(!types.includes("Running"))
    suggestion="Try running today 🏃"

  else if(!types.includes("HIIT"))
    suggestion="Add HIIT workout 🔥"

  else if(!types.includes("Yoga"))
    suggestion="Recovery yoga session 🧘"

  return (
    <div className="mb-8">
      <FitnessCard title="AI Workout Suggestion" icon="🤖">
        <p>{suggestion}</p>
      </FitnessCard>
    </div>
  );
};

export default WorkoutSuggestion;