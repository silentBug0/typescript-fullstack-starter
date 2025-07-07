// src/pages/ProfilePage.tsx
import { useAppSelector } from "../store/hooks";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>
        <strong>Email:</strong> {user?.email || "N/A"}
      </p>
      <p>
        <strong>Role:</strong> {user?.role || "N/A"}
      </p>
    </div>
  );
};

export default ProfilePage;
