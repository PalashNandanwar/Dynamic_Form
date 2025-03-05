// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const Home = () => {
//     const [savedForms, setSavedForms] = useState([]);

//     useEffect(() => {
//         const storedForms = JSON.parse(localStorage.getItem("savedForms")) || [];
//         setSavedForms(storedForms);

//     }, []);
//     console.log(savedForms);

//     return (
//         <div className="px-[4rem] py-[4rem]">
//             <div className=" mb-[2rem]">
//                 <h1 className="text-4xl font-bold">Dynamic Forms Builder</h1>
//                 <p className=" text-base font-semibold ">application where creating form are made simple </p>
//             </div>
//             <p className="text-gray-600 mb-4">Click on a form to view its details.</p>

//             {savedForms.length > 0 ? (
//                 <div className="flex flex-wrap gap-[2rem]">
//                     {savedForms.map((form, index) => (
//                         <div className=" w-[300px] h-[100px] bg-gray-200 shadow-lg rounded-lg flex justify-center items-center">
//                             <Link to={`/form/${form.id}`} className="">
//                                 Form {index + 1}
//                                 <div>
//                                     <p>Title :- {form.title}</p>
//                                     <p> Description :- {form.description}</p>
//                                 </div>
//                             </Link>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No forms found. Create a new one!</p>
//             )}

//             <Link to="/form" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
//                 Create New Form
//             </Link>
//         </div>
//     );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [savedForms, setSavedForms] = useState([]);

    useEffect(() => {
        const storedForms = JSON.parse(localStorage.getItem("savedForms")) || [];
        setSavedForms(storedForms);
    }, []);
    console.log(savedForms);

    // Function to delete a form
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this form?");
        if (confirmDelete) {
            const updatedForms = savedForms.filter((form) => form.id !== id);
            setSavedForms(updatedForms);
            localStorage.setItem("savedForms", JSON.stringify(updatedForms));
            alert("Form deleted successfully!");
        }
    };


    return (
        <div className="px-[4rem] py-[4rem]">
            <div className="mb-[2rem]">
                <h1 className="text-4xl font-bold">Dynamic Forms Builder</h1>
                <p className="text-base font-semibold">Application where creating forms is made simple</p>
            </div>
            <p className="text-gray-600 mb-4">Click on a form to view its details.</p>

            {savedForms.length > 0 ? (
                <div className="flex flex-wrap gap-[2rem]">
                    {savedForms.map((form, index) => (
                        <div key={form.id} className="w-[300px] h-auto bg-gray-200 shadow-lg rounded-lg p-4">
                            <Link to={`/form/${form.id}`} className="block">
                                <h2 className="font-bold text-lg">Form {index + 1}</h2>
                                <p>Title: {form.title}</p>
                                <p>Description: {form.description}</p>
                            </Link>
                            <button
                                onClick={() => handleDelete(form.id)}
                                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No forms found. Create a new one!</p>
            )}

            <Link to="/form" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                Create New Form
            </Link>
        </div>
    );
};

export default Home;
