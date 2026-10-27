import { useState } from "react";
import api from "../services/api";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function Register() {


    const navigate = useNavigate();



    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });



    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            const response = await api.post(

                "/auth/register",

                formData

            );



            console.log(response.data);



            alert("Account created successfully");



            // Redirect to login page after registration

            navigate("/login");



        } catch(error) {


            console.log(error);


            alert("Registration failed");


        }


    };




    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">


            <div className="bg-white shadow-xl rounded-xl p-8 w-96">


                <h1 className="text-3xl font-bold text-center">

                    Cloud Task Platform

                </h1>



                <p className="text-gray-500 text-center mt-2 mb-6">

                    Create your account

                </p>




                <form onSubmit={handleSubmit}>


                    <div className="flex items-center border rounded-lg p-3 mb-4">


                        <FaUser className="text-gray-400 mr-3"/>



                        <input

                            className="outline-none w-full"

                            type="text"

                            name="name"

                            placeholder="Name"

                            value={formData.name}

                            onChange={handleChange}

                        />


                    </div>





                    <div className="flex items-center border rounded-lg p-3 mb-4">


                        <FaEnvelope className="text-gray-400 mr-3"/>



                        <input

                            className="outline-none w-full"

                            type="email"

                            name="email"

                            placeholder="Email"

                            value={formData.email}

                            onChange={handleChange}

                        />


                    </div>





                    <div className="flex items-center border rounded-lg p-3 mb-5">


                        <FaLock className="text-gray-400 mr-3"/>



                        <input

                            className="outline-none w-full"

                            type="password"

                            name="password"

                            placeholder="Password"

                            value={formData.password}

                            onChange={handleChange}

                        />


                    </div>





                    <button

                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"

                    >

                        Register


                    </button>



                </form>



                <p className="text-center mt-5 text-gray-500">

                    Already have an account?

                    <button

                        className="text-blue-600 ml-2 hover:underline"

                        onClick={() => navigate("/login")}

                    >

                        Login

                    </button>


                </p>



            </div>



        </div>

    );


}


export default Register;