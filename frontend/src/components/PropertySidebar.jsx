import { useState } from "react";

import AddPropertyModal from "./AddPropertyModal";

export default function PropertySidebar({

    properties,

    loading,

    selectedProperty,

    setSelectedProperty,

    refreshProperties,

}) {

    const [showModal, setShowModal] =
        useState(false);

    const getIcon = (type) => {

        switch (type) {

            case "HOUSE":
                return "🏠";

            case "FARM":
                return "🌾";

            case "COMMERCIAL":
                return "🏢";

            case "INDUSTRIAL":
                return "🏭";

            default:
                return "📍";

        }

    };

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow
                p-6
                h-fit
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

                <div>

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-blue-950
                        "
                    >
                        Properties
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                        "
                    >

                        {properties.length}{" "}
                        {properties.length === 1
                            ? "Property"
                            : "Properties"}

                    </p>

                </div>

                <button

                    onClick={() =>
                        setShowModal(true)
                    }

                    className="
                        bg-blue-900
                        text-white
                        px-4
                        py-2
                        rounded-xl
                        hover:bg-blue-800
                    "

                >

                    +

                </button>

            </div>

            {loading ? (

                <div className="space-y-4">

                    {[1,2,3].map((i)=>(

                        <div

                            key={i}

                            className="
                                h-24
                                rounded-2xl
                                bg-slate-100
                                animate-pulse
                            "

                        />

                    ))}

                </div>

            ) : properties.length === 0 ? (

                <div
                    className="
                        text-center
                        text-gray-500
                        py-12
                    "
                >

                    No properties yet.

                </div>

            ) : (

                <div className="space-y-4">

                    {properties.map((property)=>(

                        <button

                            key={property.id}

                            onClick={() =>
                                setSelectedProperty(property)
                            }

                            className={`
                                w-full
                                text-left
                                rounded-2xl
                                p-4
                                transition
                                border

                                ${
                                    selectedProperty?.id === property.id

                                        ? "border-blue-900 bg-blue-50"

                                        : "border-slate-200 hover:bg-slate-50"
                                }
                            `}

                        >

                            <div
                                className="
                                    flex
                                    justify-between
                                    items-center
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <span className="text-2xl">

                                        {getIcon(
                                            property.property_type
                                        )}

                                    </span>

                                    <div>

                                        <h3
                                            className="
                                                font-semibold
                                                text-blue-950
                                            "
                                        >

                                            {property.name}

                                        </h3>

                                        <p
                                            className="
                                                text-sm
                                                text-gray-500
                                            "
                                        >

                                            {property.address}

                                        </p>

                                    </div>

                                </div>

                                <span
                                    className="
                                        text-xs
                                        bg-blue-100
                                        text-blue-900
                                        px-2
                                        py-1
                                        rounded-full
                                    "
                                >

                                    {property.property_type}

                                </span>

                            </div>

                        </button>

                    ))}

                </div>

            )}

            {showModal && (

           <AddPropertyModal
              refreshProperties={refreshProperties}
              onClose={() => setShowModal(false)}
          />           
            )}

        </div>

    );

}
