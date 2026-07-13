import { Link } from "react-router-dom";

export default function LoginRequired() {

    return (

        <div
            className="
                absolute
                inset-0
                z-50
                bg-black/40
                backdrop-blur-sm
                flex
                items-center
                justify-center
            "
        >

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    p-12
                    w-full
                    max-w-xl
                    text-center
                "
            >

                <div className="text-6xl mb-6">
                    🛡️
                </div>

                <h1 className="text-4xl font-bold text-blue-950">

                    Login Required

                </h1>

                <p className="mt-5 text-gray-600 leading-relaxed">

                    Sign in to access your properties,
                    flood assessments,
                    AI claim recommendations
                    and reports.

                </p>

                <div
                    className="
                        mt-8
                        bg-slate-50
                        rounded-2xl
                        p-5
                        text-left
                    "
                >

                    <ul className="space-y-3">

                        <li>🏠 Manage insured properties</li>

                        <li>🛰️ Satellite flood analysis</li>

                        <li>📄 Assessment history</li>

                        <li>🤖 AI claim recommendations</li>

                    </ul>

                </div>

                <div className="flex justify-center gap-4 mt-8">

                    <Link

                        to="/login"

                        className="
                            bg-blue-900
                            text-white
                            px-8
                            py-3
                            rounded-xl
                            hover:bg-blue-800
                        "

                    >

                        Login

                    </Link>

                    <Link

                        to="/register"

                        className="
                            border
                            border-blue-900
                            text-blue-900
                            px-8
                            py-3
                            rounded-xl
                        "

                    >

                        Register

                    </Link>

                </div>

            </div>

        </div>

    );

}
