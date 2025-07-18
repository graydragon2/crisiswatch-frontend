import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Mon', threats: 2 },
  { name: 'Tue', threats: 3 },
  { name: 'Wed', threats: 4 },
  { name: 'Thu', threats: 6 },
  { name: 'Fri', threats: 3 },
  { name: 'Sat', threats: 2 },
  { name: 'Sun', threats: 5 },
];

export function PhishingChart() {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow h-64">
      <h3 className="text-lg font-semibold mb-2 text-white">Phishing Detection</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis dataKey="name" stroke="#cbd5e0" />
          <YAxis stroke="#cbd5e0" />
          <Tooltip />
          <Line type="monotone" dataKey="threats" stroke="#63b3ed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}




