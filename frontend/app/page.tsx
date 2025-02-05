export default async function Home() {
  const res = await fetch("http://localhost:3000/api/v1/bulk", {
    cache: "no-store", 
  });

  const data = await res.json();
  console.log("Fetched Data:", data); // Debugging

  const users: { username: string; name: string; _id: string }[] = data.users; // Extract users array

  return (
    <div >
      {users.length > 0 ? (
        users.map((u) => <div key={u._id} className="text-white">{u.name}</div>)
      ) : (
        <p className="text-white">No users found</p>
      )}
    </div>
  );
}
