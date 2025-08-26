"use client";

import { useSession } from "@/store/useSession";

export default function ProfilePage() {
  const { user } = useSession();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      {user ? (
        <div className="space-y-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          {/* Add form for updating profile later */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}