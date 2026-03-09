import FitnessCard from "./FitnessCard";

const Achievements = ({ workouts, calories, streak }: any) => {

  const achievements = [
    { name:"First Workout", unlocked:workouts.length>=1 },
    { name:"5 Workouts", unlocked:workouts.length>=5 },
    { name:"2000 Calories", unlocked:calories>=2000 },
    { name:"7 Day Streak", unlocked:streak>=7 }
  ]

  return (
    <div className="mb-8">
      <FitnessCard title="Achievements" icon="🏅">

        <div className="grid grid-cols-2 gap-2">

        {achievements.map((a:any)=>(
          <div key={a.name} className="p-2 border rounded">

            {a.unlocked ? "🏆" : "🔒"} {a.name}

          </div>
        ))}

        </div>

      </FitnessCard>
    </div>
  )
}

export default Achievements