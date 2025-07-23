import { Pie } from "react-chartjs-2";import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
const getVerdictStats = submissions =>
  submissions.reduce((acc, s) => {
    acc[s.verdict] = (acc[s.verdict] || 0) + 1;
    return acc;
  }, {});



export const PieStats = ({ submissions }) => {
  const stats = getVerdictStats(submissions);
  const pieData = {
    labels: Object.keys(stats),
    datasets: [{
      data: Object.values(stats),
      backgroundColor: ["#EF4444","#22C55E","#6366F1","#6B7280","#E11D48"],
    }],
  };
  return (
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-700 shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
        Submission Verdicts
      </h3>
      {!submissions.length ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No submissions yet.</p>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="w-full md:w-1/2 h-64">
            <Pie data={pieData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: ctx => `${pieData.labels[ctx.dataIndex]}: ${ctx.dataset.data[ctx.dataIndex]}`,
                  },
                },
              },
            }} />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            {pieData.labels.map((lbl, idx) => (
              <div key={lbl} className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: pieData.datasets[0].backgroundColor[idx] }} />
                <span className="text-gray-700 dark:text-gray-300">{lbl}</span>
                <span className="ml-auto text-gray-500 dark:text-gray-400">
                  {pieData.datasets[0].data[idx]} submission{pieData.datasets[0].data[idx] > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};