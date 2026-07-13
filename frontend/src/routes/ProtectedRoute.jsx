import { useAuth } from "../context/AuthContext";

import LoginRequired from "../components/LoginRequired";

export default function ProtectedRoute({

    children,

}) {

    const {

        user,

        loading,

    } = useAuth();

    if (loading) {

        return (

            <div
                className="
                    min-h-screen
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        w-12
                        h-12
                        border-4
                        border-blue-900
                        border-t-transparent
                        rounded-full
                        animate-spin
                    "
                />

            </div>

        );

    }

    return (

        <div className="relative">

            {children}

            {!user && <LoginRequired />}

        </div>

    );

}
