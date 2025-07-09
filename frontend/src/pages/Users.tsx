import { useAppSelector } from "../store/hooks";

export default function Users() {
  const auth = useAppSelector((state) => state.auth);
  console.log("🔍 Auth in Users:", auth);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">✅ USERS PAGE</h2>
    </div>
  );
}
