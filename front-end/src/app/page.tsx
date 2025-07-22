export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-700 mb-12">The Main Page</h1>
      <div className="flex gap-8">
        <div className="w-40 h-40 bg-red-400 rounded-lg flex items-center justify-center text-white font-semibold">
          Box 1
        </div>
        <div className="w-40 h-40 bg-green-400 rounded-lg flex items-center justify-center text-white font-semibold">
          Box 2
        </div>
        <div className="w-40 h-40 bg-purple-400 rounded-lg flex items-center justify-center text-white font-semibold">
          Box 3
        </div>
      </div>
    </main>
  );
}
