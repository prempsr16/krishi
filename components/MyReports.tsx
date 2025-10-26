
import React from 'react';
import type { DiagnosisReport } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MyReportsProps {
  reports: DiagnosisReport[];
}

// Mock data for the chart
const healthData = [
  { name: 'Jan', healthScore: 60 },
  { name: 'Feb', healthScore: 65 },
  { name: 'Mar', healthScore: 75 },
  { name: 'Apr', healthScore: 70 },
  { name: 'May', healthScore: 85 },
  { name: 'Jun', healthScore: 90 },
];

const severityStyles = {
    Mild: 'bg-yellow-100 text-yellow-800',
    Moderate: 'bg-orange-100 text-orange-800',
    Severe: 'bg-red-100 text-red-800',
};

const MyReports: React.FC<MyReportsProps> = ({ reports }) => {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Crop Health Trend</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="healthScore" fill="#4ade80" name="Crop Health Score (%)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Diagnosis History</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">You have no saved reports. Diagnose a crop to see it here.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex flex-col md:flex-row items-start p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-4">
                <img src={report.imageUrl} alt="diagnosed crop" className="w-full md:w-32 h-32 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{report.timestamp}</p>
                  <p className="font-semibold text-lg text-gray-800">{report.diagnosis?.issue}</p>
                  {report.diagnosis && (
                    <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${severityStyles[report.diagnosis.severity]}`}>
                      {report.diagnosis.severity}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
