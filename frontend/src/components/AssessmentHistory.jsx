import { useEffect, useState } from "react";
import api from "../lib/api";

export default function AssessmentHistory({

    property,

    refreshKey,

    onSelectAssessment,

}) {

    const [assessments, setAssessments] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [count, setCount] =
        useState(0);

    const [next, setNext] =
        useState(null);

    const [previous, setPrevious] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    const [severity, setSeverity] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [ordering, setOrdering] =
        useState("-created_at");

    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedSearch(search);

        }, 400);

        return () => clearTimeout(timer);

    }, [search]);

    useEffect(() => {

        if (!property) {

            setAssessments([]);

            return;

        }

        fetchHistory(1);

    }, [

        property,

        refreshKey,

        debouncedSearch,

        severity,

        status,

        ordering,

    ]);

    const fetchHistory = async (
        pageNumber = 1
    ) => {

        if (!property)
            return;

        setLoading(true);

        try {

            const params =
                new URLSearchParams();

            params.append(
                "property",
                property.id
            );

            params.append(
                "page",
                pageNumber
            );

            if (debouncedSearch)
                params.append(
                    "search",
                    debouncedSearch
                );

            if (severity)
                params.append(
                    "severity",
                    severity
                );

            if (status)
                params.append(
                    "status",
                    status
                );

            if (ordering)
                params.append(
                    "ordering",
                    ordering
                );

            const response =
                await api.get(

                    `/assessments/?${params.toString()}`

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

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    const severityColor = (severity) => {

        switch (severity) {

            case "NONE":
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

    return (

        <div className="bg-white rounded-3xl shadow p-8">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold text-blue-950">

                    Assessment History

                </h2>

                {property && (

                    <span className="text-sm text-gray-500">

                        {count} Assessments

                    </span>

                )}

            </div>

            {property && (

                <div className="space-y-4 mb-8">

                    <input

                        type="text"

                        placeholder="Search..."

                        value={search}

                        onChange={(e)=>

                            setSearch(
                                e.target.value
                            )

                        }

                        className="w-full border rounded-xl p-3"

                    />

                    <div className="grid md:grid-cols-3 gap-3">

                        <select

                            value={severity}

                            onChange={(e)=>

                                setSeverity(
                                    e.target.value
                                )

                            }

                            className="border rounded-xl p-3"

                        >

                            <option value="">
                                All Severity
                            </option>

                            <option value="NONE">
                                None
                            </option>

                            <option value="MINOR">
                                Minor
                            </option>

                            <option value="MODERATE">
                                Moderate
                            </option>

                            <option value="MAJOR">
                                Major
                            </option>

                            <option value="SEVERE">
                                Severe
                            </option>

                        </select>

                        <select

                            value={status}

                            onChange={(e)=>

                                setStatus(
                                    e.target.value
                                )

                            }

                            className="border rounded-xl p-3"

                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="RUNNING">
                                Running
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>

                        </select>

                        <select

                            value={ordering}

                            onChange={(e)=>

                                setOrdering(
                                    e.target.value
                                )

                            }

                            className="border rounded-xl p-3"

                        >

                            <option value="-created_at">
                                Latest
                            </option>

                            <option value="created_at">
                                Oldest
                            </option>

                            <option value="-flooded_area_percent">
                                Highest Flood %
                            </option>

                            <option value="flooded_area_percent">
                                Lowest Flood %
                            </option>

                            <option value="-flooded_area_m2">
                                Largest Area
                            </option>

                            <option value="flooded_area_m2">
                                Smallest Area
                            </option>

                        </select>

                    </div>

                </div>

            )}

            {!property && (

                <div className="text-center py-12 text-gray-500">

                    Select a property.

                </div>

            )}

            {loading && (

                <div className="space-y-4">

                    {[1,2,3].map((i)=>(

                        <div

                            key={i}

                            className="h-24 rounded-2xl bg-slate-100 animate-pulse"

                        />

                    ))}

                </div>

            )}

            {!loading &&
            property &&
            assessments.length === 0 && (

                <div className="text-center py-12 text-gray-500">

                    No assessments found.

                </div>

            )}

            {!loading &&
            assessments.map((assessment)=>(

                <button

                    key={assessment.id}

                    onClick={()=>

                        onSelectAssessment(
                            assessment
                        )

                    }

                    className="w-full text-left p-5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition mb-4"

                >

                    <div className="flex justify-between items-center">

                        <div>

                            <h3 className="font-semibold">

                                Assessment #{assessment.id}

                            </h3>

                            <p className="text-sm text-gray-500 mt-1">

                                {new Date(

                                    assessment.completed_at ??
                                    assessment.created_at

                                ).toLocaleString()}

                            </p>

                        </div>

                        <span
                            className={`
                                px-3 py-1 rounded-full text-sm font-medium
                                ${severityColor(
                                    assessment.severity
                                )}
                            `}
                        >

                            {assessment.severity}

                        </span>

                    </div>

                    <div className="flex justify-between mt-5 text-sm">

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

            {property && (

                <div className="flex justify-between items-center mt-8">

                    <button

                        disabled={!previous}

                        onClick={()=>

                            fetchHistory(page - 1)

                        }

                        className="px-4 py-2 border rounded-xl disabled:opacity-40"

                    >

                        ← Previous

                    </button>

                    <span className="font-medium">

                        Page {page} of {Math.max(1, Math.ceil(count / 5))}

                    </span>

                    <button

                        disabled={!next}

                        onClick={()=>

                            fetchHistory(page + 1)

                        }

                        className="px-4 py-2 border rounded-xl disabled:opacity-40"

                    >

                        Next →

                    </button>

                </div>

            )}

        </div>

    );

}
