import { useNavigate } from "react-router-dom";


function Navbar() {


    const navigate = useNavigate();



    const logout = () => {

    localStorage.removeItem("token");

    navigate("/login", { replace: true });

};



    return (

        <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center">


            <h1 className="text-xl font-bold">

                ☁ Cloud Task Platform

            </h1>



            <div className="flex items-center gap-5">


                <button

                    className="hover:underline"

                    onClick={() => navigate("/dashboard")}

                >

                    Dashboard

                </button>




                <button

                    className="bg-white text-blue-600 px-4 py-2 rounded-lg"

                    onClick={logout}

                >

                    Logout

                </button>


            </div>



        </nav>

    );


}


export default Navbar;