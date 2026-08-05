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
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
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
