import { useEffect, useState } from "react";
import { Home, FileText, Waves, TriangleAlert } from "lucide-react";

import api from "../../lib/api";
import StatCard from "./StatCard";
import RecommendationChart from "./charts/RecommendationChart";

function AnalyticsDashboard() {

    const [stats, setStats] = useState(null);

    useEffect(() => {

        async function fetchAnalytics() {

            const response = await api.get("/dashboard/");

            setStats(response.data);
        }

        fetchAnalytics();

    }, []);
    
    if (!stats)
        return (
            <div className="text-center py-10">
                Loading dashboard...
            </div>
        );
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatCard
              title="Properties"
              value={stats.properties}
              icon={<Home size={34} />}
              color="text-blue-600"
              trend={`${stats.assessment_trend.value >= 0 ? "+" : ""}${stats.assessment_trend.value}`}
              trendLabel={stats.assessment_trend.label}
              trendType={stats.assessment_trend.type}
          />

          <StatCard
              title="Assessments"
              value={stats.assessments}
              icon={<FileText size={34} />}
              color="text-green-600"
              trend={`${stats.assessment_trend.value >= 0 ? "+" : ""}${stats.assessment_trend.value}`}
              trendLabel={stats.assessment_trend.label}
              trendType={stats.assessment_trend.type}
          />

          <StatCard
              title="Average Flood %"
              value={`${stats.average_flood_percent}%`}
              icon={<Waves size={34} />}
              color="text-cyan-600"
              trend={`${stats.assessment_trend.value >= 0 ? "+" : ""}${stats.assessment_trend.value}`}
              trendLabel={stats.assessment_trend.label}
              trendType={stats.assessment_trend.type}
          />

          <StatCard
              title="High Risk"
              value={stats.high_risk}
              icon={<TriangleAlert size={34} />}
              color="text-red-600"
              trend={`${stats.assessment_trend.value >= 0 ? "+" : ""}${stats.assessment_trend.value}`}
              trendLabel={stats.assessment_trend.label}
              trendType={stats.assessment_trend.type}
          />
          <div className="mt-8">
            <RecommendationChart recommendations={stats.recommendations}/>
          </div>
        </div>

    );

}

export default AnalyticsDashboard;
