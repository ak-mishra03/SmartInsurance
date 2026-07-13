import { useState } from "react";
import api from "../lib/api";

export default function AnalysisForm({

  property,

  setResult,

  setLocation,

  loading,

  setLoading,

  onAssessmentComplete,

}) {

  const [error, setError] = useState("");

  const pollAssessment = async (assessmentId) => {

    const interval = setInterval(async () => {

      try {

        const response =
          await api.get(
            `/assessments/${assessmentId}/`
          );

        const assessment = response.data;

        if (
          assessment.status === "PENDING" ||
          assessment.status === "RUNNING"
        ) {
          return;
        }

        if (
          assessment.status === "COMPLETED"
        ) {

          clearInterval(interval);

          setResult(assessment);

          if (onAssessmentComplete) {
            onAssessmentComplete();
          }

          setLoading(false);

          return;
        }

        if (
          assessment.status === "FAILED"
        ) {

          clearInterval(interval);

          setLoading(false);

          setError("Assessment failed.");
        }

      }

      catch (err) {

        clearInterval(interval);

        console.error(err);

        setLoading(false);

        setError(
          "Unable to fetch assessment."
        );

      }

    }, 2000);

    setTimeout(() => {

      clearInterval(interval);

    }, 180000);

  };


  const analyzeFlood = async () => {

    if (!property) {

      setError(
        "No property selected."
      );

      return;

    }

    setError("");

    setLoading(true);

    setResult(null);

    setLocation({

      lat: property.latitude,

      lon: property.longitude,

    });

    try {

      const response =
        await api.post(
          "/assessments/",
          {
            property_id: property.id,
          }
        );

      const assessment = response.data;

      pollAssessment(
        assessment.id
      );
    }

    catch (err) {

      console.error(err);

      setLoading(false);

      setError(
        err.response?.data?.detail ||
        "Assessment failed."
      );

    }

  };

    return (

        <div
            className="
                bg-white
                rounded-3xl
                p-8
                shadow
            "
        >

            <h2
                className="
                    text-2xl
                    font-semibold
                    mb-2
                "
            >
                Flood Assessment
            </h2>

            <p
                className="
                    text-gray-500
                    mb-8
                "
            >
                Satellite imagery will be selected
                automatically.
            </p>

            {property && (

                <div
                    className="
                        bg-slate-50
                        rounded-xl
                        p-4
                        mb-6
                    "
                >

                    <h3 className="font-semibold">
                        {property.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {property.address}
                    </p>

                    <div className="mt-3 text-sm text-gray-600">

                        <p>
                            Latitude: {property.latitude.toFixed(5)}
                        </p>

                        <p>
                            Longitude: {property.longitude.toFixed(5)}
                        </p>

                    </div>

                </div>

            )}

            <button

                onClick={analyzeFlood}

                disabled={loading}

                className="
                    w-full
                    bg-blue-900
                    text-white
                    py-3
                    rounded-xl
                    hover:bg-blue-800
                    disabled:bg-slate-400
                    disabled:cursor-not-allowed
                "

            >

                {loading
                    ? "Analyzing Satellite Imagery..."
                    : "Analyze Property"}

            </button>

            {error && (

                <div className="text-red-600 mt-4">

                    {error}

                </div>

            )}

        </div>

    );

}
