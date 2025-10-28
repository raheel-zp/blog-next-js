'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="text-center text-red-600 mt-6">
      <h2>Error: {error.message}</h2>
    </div>
  );
}
