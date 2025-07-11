import FeedList from '@/components/FeedList';

export default function DashboardPage() {
  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">CrisisWatch Dashboard</h1>
      <FeedList />
    </div>
  );
}
