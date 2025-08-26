"use client";

export default function GuidePage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Getting Started Guide</h1>
      <div className="space-y-4">
        <p>Welcome to TripBoard! Here's how to create your first board:</p>
        <ol className="list-decimal pl-6">
          <li>Go to My Boards</li>
          <li>Click Create New Board</li>
          <li>Add lists and cards</li>
        </ol>
        {/* Add more content or embed video */}
      </div>
    </div>
  );
}