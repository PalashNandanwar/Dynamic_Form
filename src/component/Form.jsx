/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Form = () => {
    const { id } = useParams();
    const [fields, setFields] = useState([]);
    const [formDetails, setFormDetails] = useState(null);
    const [copied, setCopied] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const storedForms = JSON.parse(localStorage.getItem("savedForms")) || [];
        const selectedForm = storedForms.find(form => form.id === id);

        if (selectedForm) {
            setFormDetails(selectedForm);
            setFields(selectedForm.fields || []);
            setFormData(selectedForm.fields.reduce((acc, field) => {
                acc[field.id] = field.type === "Checkboxes" ? [] : "";
                return acc;
            }, {}));
        }
    }, [id]);

    const handleCopyLink = () => {
        const formLink = `${window.location.origin}/form/${id}`;
        navigator.clipboard.writeText(formLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChange = (fieldId, value, isCheckbox = false) => {
        setFormData(prevData => {
            if (isCheckbox) {
                const newValues = prevData[fieldId].includes(value)
                    ? prevData[fieldId].filter(item => item !== value)
                    : [...prevData[fieldId], value];

                return { ...prevData, [fieldId]: newValues };
            }
            return { ...prevData, [fieldId]: value };
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newResponse = {
            responses: fields.map(field => ({
                label: field.label,
                input: formData[field.id] || ""
            }))
        };

        try {
            // Step 1: Fetch existing form entry from the server
            const response = await fetch(`https://json-server-db-o00h.onrender.com/responses/${id}`);

            let existingForm;
            if (response.ok) {
                existingForm = await response.json();
            } else {
                existingForm = null;
            }

            let updatedFormData;

            if (existingForm) {
                // Step 2: Append new response to existing responses array
                updatedFormData = {
                    ...existingForm,
                    responses: [...existingForm.responses, newResponse]
                };

                // Step 3: Update the existing form entry in the JSON server
                await fetch(`https://json-server-db-o00h.onrender.com/responses/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedFormData)
                });
            } else {
                // Step 4: Create a new form entry if it doesn't exist
                updatedFormData = {
                    id: id,
                    title: formDetails?.title || "",
                    description: formDetails?.description || "",
                    responses: [newResponse]
                };

                await fetch("https://json-server-db-o00h.onrender.com/responses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedFormData)
                });
            }

            console.log("Form submitted successfully:", updatedFormData);

            // Step 5: Reset form and set success message
            setSubmitted(true);
            setTimeout(() => {
                setFormData(fields.reduce((acc, field) => {
                    acc[field.id] = field.type === "Checkboxes" ? [] : "";
                    return acc;
                }, {}));
                setSubmitted(false);
            }, 2000);

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };



    return (
        <div className="p-[4rem] w-full mx-auto bg-white shadow-md rounded">
            <div className="bg-gray-100 p-[3rem] rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Generated Form</h2>

                {!formDetails ? (
                    <p>No form found with this ID.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold">Title: {formDetails.title}</h3>
                            {formDetails.description && (
                                <p className="text-gray-600">Description: {formDetails.description}</p>
                            )}
                        </div>

                        {/* ✅ Render Fields */}
                        {fields.map(field => (
                            <div key={field.id} className="flex flex-col gap-2">
                                <label className="font-medium">{field.label}</label>

                                {(field.type === "Short Answer" || field.type === "Password" || field.type === "Email" || field.type === "Number") && (
                                    <input
                                        type={
                                            field.type === "Password" ? "password" :
                                                field.type === "Email" ? "email" :
                                                    field.type === "Number" ? "number" :
                                                        "text"
                                        }
                                        className="border p-2 rounded"
                                        placeholder={`Enter ${field.type.toLowerCase()}`}
                                        value={formData[field.id] || ""}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                    />
                                )}

                                {field.type === "Paragraph" && (
                                    <textarea
                                        className="border p-2 rounded w-full h-32 resize-none overflow-auto"
                                        placeholder="Enter detailed response"
                                        value={formData[field.id]}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                    ></textarea>

                                )}

                                {field.type === "Checkboxes" && (
                                    <div>
                                        {field.options?.map((opt, i) => (
                                            <label key={i} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    value={opt}
                                                    checked={formData[field.id]?.includes(opt)}
                                                    onChange={() => handleChange(field.id, opt, true)}
                                                />
                                                {opt}
                                            </label>
                                        ))}

                                    </div>
                                )}

                                {field.type === "Single Choice" && (
                                    <div>
                                        {field.options?.map((opt, i) => (
                                            <label key={i} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={field.id}
                                                    value={opt}
                                                    checked={formData[field.id] === opt}
                                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                                />
                                                {opt}
                                            </label>
                                        ))}

                                    </div>
                                )}

                                {field.type === "dropdown" && (
                                    <select
                                        className="border p-2 rounded"
                                        value={formData[field.id]}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                    >
                                        <option value="">Select an option</option>
                                        {field.options?.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>

                                )}
                            </div>
                        ))}

                        {/* ✅ Submit Button */}
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Submit
                        </button>

                        {/* ✅ Submission Success Message */}
                        {submitted && (
                            <p className="text-green-600 font-medium mt-3">
                                ✅ Form submitted successfully!
                            </p>
                        )}
                    </form>
                )}

                <div className="flex items-center justify-between mt-6">
                    <button onClick={handleCopyLink} className="bg-blue-500 text-white px-4 py-2 rounded">
                        {copied ? "Copied!" : "Copy Form Link"}
                    </button>
                    <Link to="/" className="text-blue-600">Go Back</Link>
                </div>
            </div>
        </div>
    );
};

export default Form;