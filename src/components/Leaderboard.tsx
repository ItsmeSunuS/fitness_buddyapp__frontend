import FitnessCard from "./FitnessCard";

const Leaderboard = () => {

  const users=[
    {name:"Alex",cal:5000},
    {name:"Sarah",cal:4200},
    {name:"Mike",cal:3900}
  ]

  return(
    <div className="mb-8">

      <FitnessCard title="Leaderboard" icon="🥇">

        {users.map((u,i)=>(
          <div key={u.name} className="flex justify-between p-2 border rounded mb-2">

            <span>{i+1}. {u.name}</span>

            <span>🔥 {u.cal}</span>

          </div>
        ))}

      </FitnessCard>

    </div>
  )
}

export default Leaderboard