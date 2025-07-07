// src/pages/Users.tsx
import DashboardLayout from "../components/DashboardLayout";

export default function Users() {
    console.log("✅ Users page loaded");

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <p>This is the user management screen.</p>
    </DashboardLayout>
  );
}
