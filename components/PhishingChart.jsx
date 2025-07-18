// components/PhishingChart.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      label: 'Phishing Incidents',
      data: [2, 4, 3, 6, 5, 8],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

export default function PhishingChart() {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2 text-white">Phishing Detection</h3>
      <Line data={data} options={options} />
    </div>
  );
}



