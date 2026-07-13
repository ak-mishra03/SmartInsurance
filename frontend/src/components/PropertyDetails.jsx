export default function PropertyDetails({

    property,

    onAnalyze,

    onDelete,

}) {

    if (!property) {

        return (

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow
                    p-10
                    text-center
                "
            >

                <div className="text-6xl mb-6">
                    🏠
                </div>

                <h2
                    className="
                        text-2xl
                        font-bold
                        text-blue-950
                    "
                >
                    No Property Selected
                </h2>

                <p className="text-gray-500 mt-4">

                    Select one of your insured
                    properties from the sidebar.

                </p>

            </div>

        );

    }

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
                    items-start
                "
            >

                <div>

                    <div className="flex items-center gap-3">

                        <div className="text-4xl">

                            🏠

                        </div>

                        <div>

                            <h2
                                className="
                                    text-3xl
                                    font-bold
                                    text-blue-950
                                "
                            >

                                {property.name}

                            </h2>

                            <p className="text-gray-500">

                                {property.address}

                            </p>

                        </div>

                    </div>

                </div>

                <span
                    className="
                        bg-blue-100
                        text-blue-900
                        px-4
                        py-2
                        rounded-full
                        font-medium
                    "
                >

                    {property.property_type}

                </span>

            </div>

            <div
                className="
                    grid
                    md:grid-cols-2
                    gap-6
                    mt-8
                "
            >

                <div
                    className="
                        bg-slate-50
                        rounded-2xl
                        p-5
                    "
                >

                    <p
                        className="
                            text-sm
                            text-gray-500
                        "
                    >
                        Latitude
                    </p>

                    <p
                        className="
                            text-lg
                            font-semibold
                            mt-1
                        "
                    >
                        {property.latitude.toFixed(6)}
                    </p>

                </div>

                <div
                    className="
                        bg-slate-50
                        rounded-2xl
                        p-5
                    "
                >

                    <p
                        className="
                            text-sm
                            text-gray-500
                        "
                    >
                        Longitude
                    </p>

                    <p
                        className="
                            text-lg
                            font-semibold
                            mt-1
                        "
                    >
                        {property.longitude.toFixed(6)}
                    </p>

                </div>

            </div>

            <div
                className="
                    flex
                    gap-4
                    mt-8
                "
            >


                <button

                    onClick={() =>
                        onDelete(property.id)
                    }

                    className="
                        bg-red-600
                        text-white
                        px-6
                        rounded-xl
                        hover:bg-red-700
                        transition
                    "

                >

                    Delete

                </button>

            </div>

        </div>

    );

}
