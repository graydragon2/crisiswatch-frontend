// File: components/SourceToggle.jsx
import { useState } from 'react';

export default function SourceToggle({ mode, setMode }) {
  return (
    <select
      className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
      value={mode}
      onChange={(e) => setMode(e.target.value)}
    >
      <option value="Hybrid">Hybrid</option>
      <option value="RSS">RSS Only</option>
      <option value="GDELT">GDELT Only</option>
    </select>
  );
}
