import { useEffect, useState } from "react";

import api from "../lib/api";

export default function AssessmentHistory({

  property,

  refreshKey,

  onSelectAssessment,

}) {

  const [assessments, setAssessments] =
    useState([]);

  const [page,setPage] = useState(1);
  const [count,setCount] = useState(0);
  const [next,setNext] = useState(null);  
  const [previous,setPrevious] = useState(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (!property) {

      setAssessments([]);

      return;

    }

    fetchHistory();

  }, [property, refreshKey]);


  const fetchHistory = async (pageNumber = 1) => {

    setLoading(true);

    try {

      const response =
        await api.get(

          `/assessments/?property=${property.id}&page=${pageNumber}`

        );

      setAssessments(
        response.data.results
      );

      setCount(
        response.data.count
      );

      setNext(
        response.data.next
      );

      setPrevious(
        response.data.previous
      );

      setPage(pageNumber);

    }

    finally {

      setLoading(false);

    }

  };

  const severityColor = (severity) => {

    switch (severity) {

      case "NONE":
        return "bg-green-100 text-green-700";

      case "MINOR":
        return "bg-green-100 text-green-700";

      case "MODERATE":
        return "bg-yellow-100 text-yellow-700";

      case "MAJOR":
        return "bg-orange-100 text-orange-700";

      case "SEVERE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";

    }

  };
  useEffect(() => {

    if (!property) {

        setAssessments([]);

        return;

    }

    fetchHistory(1);

}, [property, refreshKey]);

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow
                p-8
            "
        >

            <div
                className="
                    flex
                    justify-between
                    items-center
                    mb-6
                "
            >

                <h2
                    className="
                        text-2xl
                        font-bold
                        text-blue-950
                    "
                >

                    Assessment History

                </h2>

                {property && (

                    <span
                        className="
                            text-sm
                            text-gray-500
                        "
                    >

                        {count} Assessments

                    </span>

                )}

            </div>

            {!property && (

                <div
                    className="
                        text-center
                        text-gray-500
                        py-12
                    "
                >

                    Select a property.

                </div>

            )}

            {loading && (

                <div className="space-y-4">

                    {[1,2,3].map((i)=>(

                        <div
                            key={i}
                            className="
                                h-20
                                bg-slate-100
                                rounded-2xl
                                animate-pulse
                            "
                        />

                    ))}

                </div>

            )}

            {!loading &&
            property &&
            assessments.length === 0 && (

                <div
                    className="
                        text-center
                        text-gray-500
                        py-12
                    "
                >

                    No assessments yet.

                </div>

            )}

            {!loading &&
            assessments.map((assessment)=>(

                <button

                    key={assessment.id}

                    onClick={() =>
                        onSelectAssessment(
                            assessment
                        )
                    }

                    className="
                        w-full
                        text-left
                        p-5
                        rounded-2xl
                        border
                        border-slate-200
                        hover:bg-slate-50
                        transition
                        mb-4
                    "

                >

                    <div
                        className="
                            flex
                            justify-between
                            items-center
                        "
                    >

                        <div>

                            <h3
                                className="
                                    font-semibold
                                "
                            >

                                Assessment
                                #{assessment.id}

                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >

                                {new Date(
                                    assessment.completed_at ??
                                    assessment.created_at
                                ).toLocaleString()}

                            </p>

                        </div>

                        <span
                            className={`
                                px-3
                                py-1
                                rounded-full
                                text-sm
                                font-medium
                                ${severityColor(
                                    assessment.severity
                                )}
                            `}
                        >

                            {assessment.severity}

                        </span>

                    </div>

                    <div
                        className="
                            flex
                            justify-between
                            mt-5
                            text-sm
                        "
                    >

                        <span>

                            Flood

                            <strong>

                                {" "}
                                {Number(
                                    assessment.flooded_area_percent ?? 0
                                ).toFixed(2)}%

                            </strong>

                        </span>

                        <span>

                            {assessment.recommendation}

                        </span>

                    </div>

                </button>

            ))}
            <div
              className="
                  flex
                  justify-between
                  mt-6
              "
            >

              <button

                  disabled={!previous}

                  onClick={()=>
                      fetchHistory(page-1)
                  }

                  className="
                      px-4
                      py-2
                      rounded-xl
                      border
                      disabled:opacity-40
                  "
              >

                  ← Previous

              </button>

              <span>

                  Page {page}

              </span>

              <button

                  disabled={!next}

                  onClick={()=>
                      fetchHistory(page+1)
                  }

                  className="
                      px-4
                      py-2
                      rounded-xl
                      border
                      disabled:opacity-40
                  "
              >

                  Next →

              </button>

          </div>

        </div>

    );

}
