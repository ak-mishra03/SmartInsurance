import { useState } from "react";

import api from "../lib/api";

import {
    MapContainer,
    TileLayer,
} from "react-leaflet";

import LocationPicker from "./LocationPicker";

import "leaflet/dist/leaflet.css";

export default function AddPropertyModal({

    onClose,
    refreshProperties,

}) {

    const [form, setForm] = useState({

        name: "",

        address: "",

        property_type: "HOUSE",

    });

    const [position, setPosition] = useState({

        lat: 25.2900559,

        lon: 82.9739144,

    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const createProperty = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            await api.post(

                "/properties/",

                {

                    ...form,

                    lat: position.lat,

                    lon: position.lon,

                }

            );

            await refreshProperties();

            onClose();

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.detail ||

                "Failed to create property."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/40
                flex
                items-center
                justify-center
                z-50
            "
        >

            <form

                onSubmit={createProperty}

                className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    w-full
                    max-w-2xl
                    p-8
                    max-h-[90vh]
                    overflow-y-auto
                "

            >

                <h2
                    className="
                        text-3xl
                        font-bold
                        text-blue-950
                        mb-6
                    "
                >

                    Add Property

                </h2>

                <div className="space-y-5">

                    <input

                        required

                        placeholder="Property Name"

                        value={form.name}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                name:e.target.value,

                            })

                        }

                        className="
                            w-full
                            border
                            rounded-xl
                            p-3
                        "

                    />

                    <input

                        required

                        placeholder="Address"

                        value={form.address}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                address:e.target.value,

                            })

                        }

                        className="
                            w-full
                            border
                            rounded-xl
                            p-3
                        "

                    />

                    <select

                        value={form.property_type}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                property_type:e.target.value,

                            })

                        }

                        className="
                            w-full
                            border
                            rounded-xl
                            p-3
                        "

                    >

                        <option value="HOUSE">
                            House
                        </option>

                        <option value="FARM">
                            Farm
                        </option>

                        <option value="COMMERCIAL">
                            Commercial
                        </option>

                        <option value="INDUSTRIAL">
                            Industrial
                        </option>

                    </select>

                    <div>

                        <label
                            className="
                                font-medium
                                block
                                mb-3
                            "
                        >

                            Select Property Location

                        </label>

                        <MapContainer

                            center={[
                                position.lat,
                                position.lon,
                            ]}

                            zoom={13}

                            className="
                                h-72
                                rounded-2xl
                            "

                        >

                            <TileLayer
                                attribution="&copy; OpenStreetMap contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <LocationPicker

                                position={position}

                                setPosition={setPosition}

                            />

                        </MapContainer>

                        <div
                            className="
                                mt-3
                                text-sm
                                text-gray-600
                            "
                        >

                            Latitude: {position.lat.toFixed(5)}

                            <br />

                            Longitude: {position.lon.toFixed(5)}

                        </div>

                    </div>

                </div>

                {error && (

                    <p
                        className="
                            text-red-600
                            mt-5
                        "
                    >

                        {error}

                    </p>

                )}

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        mt-8
                    "
                >

                    <button

                        type="button"

                        onClick={onClose}

                        className="
                            px-5
                            py-2
                            border
                            rounded-xl
                        "

                    >

                        Cancel

                    </button>

                    <button

                        type="submit"

                        disabled={loading}

                        className="
                            bg-blue-900
                            text-white
                            px-5
                            py-2
                            rounded-xl
                            hover:bg-blue-800
                            disabled:bg-slate-400
                        "

                    >

                        {

                            loading

                            ? "Creating..."

                            : "Create Property"

                        }

                    </button>

                </div>

            </form>

        </div>

    );

}
