import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function StatCard({
    title,
    value,
    icon,
    color = "text-blue-600",
    trend,
    trendLabel,
    trendType = "neutral",
}) {

    const trendStyles = {
        positive: {
            icon: <TrendingUp size={16} />,
            className: "text-green-600 bg-green-100",
        },
        negative: {
            icon: <TrendingDown size={16} />,
            className: "text-red-600 bg-red-100",
        },
        neutral: {
            icon: <Minus size={16} />,
            className: "text-gray-600 bg-gray-100",
        },
    };

    const currentTrend = trendStyles[trendType];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </h2>

                </div>

                <div className={color}>
                    {icon}
                </div>

            </div>

            {trend != null && (
                <div className="mt-5 flex items-center gap-2">

                    <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${currentTrend.className}`}
                    >
                        {currentTrend.icon}
                        {trend}
                    </div>

                    <span className="text-xs text-gray-500">
                        {trendLabel}
                    </span>

                </div>
            )}

        </div>
    );
}

export default StatCard;
