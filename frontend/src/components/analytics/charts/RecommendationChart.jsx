import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = [
    "#22c55e", // Approve
    "#f59e0b", // Manual Review
    "#ef4444", // Reject
];

function RecommendationChart({ recommendations }) {

    const data = [
        {
            name: "Approve",
            value: recommendations.AUTO_APPROVE,
        },
        {
            name: "Manual Review",
            value: recommendations.MANUAL_REVIEW,
        },
        {
            name: "Reject",
            value: recommendations.AUTO_REJECT,
        },
    ];

  console.log(data);

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6">

            <h2 className="text-lg font-semibold mb-6">
                Recommendation Distribution
            </h2>

            <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={110}
                            label
                        >

                            {data.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={COLORS[index]}
                                />

                            ))}

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default RecommendationChart;
