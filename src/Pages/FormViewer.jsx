import { useState } from "react";
import Form from "../component/Form";
import Response from "../component/Response";

const FormViewer = () => {
    const [activeTab, setActiveTab] = useState("form");

    return (
        <div className="w-full flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-[80%]">
                {/* Tabs */}
                <div className="flex">
                    <button
                        className={` w-1/2 text-center font-semibold ${activeTab === "form" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
                        onClick={() => setActiveTab("form")}
                    >
                        Form
                    </button>
                    <button
                        className={`p-3 w-1/2 text-center font-semibold ${activeTab === "responses" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
                        onClick={() => setActiveTab("responses")}
                    >
                        Responses
                    </button>
                </div>

                {/* Tab Content */}
                <div className="">
                    {activeTab === "form" && (
                        <div className="p-0">
                            <Form />
                        </div>
                    )}
                    {activeTab === "responses" && (
                        <div>
                            <Response />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormViewer;
