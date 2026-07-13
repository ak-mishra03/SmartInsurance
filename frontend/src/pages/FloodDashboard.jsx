import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";

import PropertySidebar from "../components/PropertySidebar";
import PropertyDetails from "../components/PropertyDetails";
import AnalysisForm from "../components/AnalysisForm";
import ResultsCard from "../components/ResultsCard";
import FloodMap from "../components/FloodMap";
import AssessmentHistory from "../components/AssessmentHistory";

import api from "../lib/api";

export default function Dashboard() {

    const [historyVersion, setHistoryVersion] =
    useState(0);

    const refreshHistory = () => {
        setHistoryVersion(v => v + 1);
    };

    const routerLocation = useLocation();

    /* -------------------------
       Property State
    -------------------------- */

    const [properties, setProperties] = useState([]);

    const [propertiesLoading, setPropertiesLoading] =
        useState(true);

    const [selectedProperty, setSelectedProperty] =
        useState(routerLocation.state?.property ?? null);

    /* -------------------------
       Assessment State
    -------------------------- */

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    /* -------------------------
       Map State
    -------------------------- */

    const [location, setLocation] = useState({
        lat: null,
        lon: null,
    });

    /* -------------------------
       Fetch Properties
    -------------------------- */

const refreshProperties = async () => {

    try {

        const response =
            await api.get("/properties/");

        const propertyList =
            response.data;

        setProperties(propertyList);

        if (propertyList.length === 0) {

            setSelectedProperty(null);

            setResult(null);

            setLocation({
                lat: null,
                lon: null,
            });

            return;

        }

        if (selectedProperty) {

            const updated =
                propertyList.find(
                    (p) => p.id === selectedProperty.id
                );

            if (updated) {

                setSelectedProperty(updated);

            } else {

                // Selected property was deleted
                setSelectedProperty(propertyList[0]);

            }

        } else {

            setSelectedProperty(propertyList[0]);

        }

    }

    catch (err) {

        console.error(err);

    }

    finally {

        setPropertiesLoading(false);

    }

};


  useEffect(() => {

    refreshProperties();

  }, []);

    /* -------------------------
       Selected Property Changed
    -------------------------- */

    useEffect(() => {

        if (!selectedProperty) {

            setLocation({
                lat: null,
                lon: null,
            });

            setResult(null);

            return;

        }

        setLocation({

            lat: selectedProperty.latitude,

            lon: selectedProperty.longitude,

        });

        setResult(null);

    }, [selectedProperty]);

    /* -------------------------
       Delete Property
    -------------------------- */
    
const deleteProperty = async (id) => {

    if (!window.confirm("Delete this property?")) {
        return;
    }

    try {

        console.log("Deleting property...");

        const response = await api.delete(
            `/properties/${id}/`
        );

        console.log("Delete response:", response);

        console.log("Refreshing properties...");

        await refreshProperties();

        console.log("Refresh complete");

    }

    catch (err) {

        console.error("Delete failed:", err);

        console.error(err.response);

        alert("Unable to delete property.");

    }

};
    // const deleteProperty = async (id) => {
    //
    //     if (
    //         !window.confirm(
    //             "Delete this property?"
    //         )
    //     )
    //         return;
    //
    //     try {
    //
    //         await api.delete(
    //             `/properties/${id}/`
    //         );
    //
    //         await api.delete(`/properties/${id}/`);
    //
    //         await refreshProperties();
    //
    //         if (updated.length === 0) {
    //
    //             setSelectedProperty(null);
    //
    //             return;
    //
    //         }
    //
    //         if (
    //             selectedProperty?.id === id
    //         ) {
    //
    //             setSelectedProperty(
    //                 updated[0]
    //             );
    //
    //         }
    //
    //     }
    //
    //     catch (err) {
    //
    //         console.error(err);
    //
    //         alert(
    //             "Unable to delete property."
    //         );
    //
    //     }
    //
    // };

    return (

        <>
            <Navbar />

            <section className="min-h-screen bg-slate-100 px-8 py-10">

                <div className="max-w-screen-2xl mx-auto">

                    <div className="grid lg:grid-cols-12 gap-8">

                        {/* Sidebar */}

                        <div className="lg:col-span-3">

                            <div className="sticky top-24">

                              <PropertySidebar
                                  properties={properties}
                                  loading={propertiesLoading}
                                  selectedProperty={selectedProperty}
                                  setSelectedProperty={setSelectedProperty}
                                  refreshProperties={refreshProperties}
                              />
                            </div>

                        </div>

                        {/* Main */}

                        <div className="lg:col-span-9 space-y-8">

                            <PropertyDetails

                                property={selectedProperty}

                                onDelete={
                                    deleteProperty
                                }

                            />

                            <div className="grid lg:grid-cols-2 gap-8">

                                <AnalysisForm
                                    property={selectedProperty}
                                    setResult={setResult}
                                    setLocation={setLocation}
                                    loading={loading}
                                    setLoading={setLoading}
                                    onAssessmentComplete={refreshHistory}
                                />
                                <ResultsCard

                                    result={result}

                                    loading={loading}

                                />

                            </div>

                            {/* Map */}

                            {location.lat &&
                            location.lon ? (

                                <FloodMap

                                    lat={location.lat}

                                    lon={location.lon}

                                    radius={3000}

                                />

                            ) : (

                                <div
                                    className="
                                        bg-white
                                        rounded-3xl
                                        shadow
                                        h-[520px]
                                        flex
                                        flex-col
                                        justify-center
                                        items-center
                                    "
                                >

                                    <div className="text-7xl">

                                        🗺️

                                    </div>

                                    <h2
                                        className="
                                            text-3xl
                                            font-bold
                                            mt-4
                                            text-blue-950
                                        "
                                    >

                                        Select a Property

                                    </h2>

                                    <p className="text-gray-500 mt-3">

                                        Choose one of your
                                        insured properties to
                                        display its flood
                                        assessment area.

                                    </p>

                                </div>

                            )}

                            {/* History */}

                          <AssessmentHistory
                              property={selectedProperty}
                              refreshKey={historyVersion}
                              onSelectAssessment={setResult}
                          />
                        </div>

                    </div>

                </div>

            </section>

        </>

    );

}
