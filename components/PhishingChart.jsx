'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Mon', detections: 2 },
  { name: 'Tue', detections: 5 },
  { name: 'Wed', detections: 3 },
  { name: 'Thu', detections: 7 },
  { name: 'Fri', detections: 4 },
  { name: 'Sat', detections: 1 },
  { name: 'Sun', detections: 3 },
];

export default function PhishingChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#888" />
        <XAxis dataKey="name" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="detections"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
