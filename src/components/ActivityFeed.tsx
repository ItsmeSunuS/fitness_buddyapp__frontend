import FitnessCard from "./FitnessCard";

const ActivityFeed = ({ workouts }: any) => {

  return (
    <div className="mb-8">
      <FitnessCard title="Activity Feed" icon="📢">

        {workouts.slice(0,5).map((w:any)=>(
          <div key={w._id} className="p-2 border rounded mb-2">

            <p>You completed {w.type}</p>

            <p className="text-xs text-muted-foreground">
              {new Date(w.date).toDateString()}
            </p>

          </div>
        ))}

      </FitnessCard>
    </div>
  )
}

export default ActivityFeed