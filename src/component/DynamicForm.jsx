import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const FormBuilder = () => {
    const [fields, setFields] = useState([]);
    const navigate = useNavigate();

    const addField = (type) => {
        setFields([...fields, { id: uuidv4(), type, label: "" }]);
    };

    const handleLabelChange = (id, newLabel) => {
        setFields(fields.map(field => field.id === id ? { ...field, label: newLabel } : field));
    };

    const saveForm = () => {
        const formId = uuidv4();
        const storedForms = JSON.parse(localStorage.getItem("forms")) || {};
        storedForms[formId] = fields;
        localStorage.setItem("forms", JSON.stringify(storedForms));
        navigate(`/form/${formId}`);
    };

    return (
        <div>
            <h2>Form Builder</h2>
            <button onClick={() => addField("text")}>Add Text Field</button>
            <button onClick={() => addField("checkbox")}>Add Checkbox</button>
            <button onClick={saveForm}>Save Form</button>
            <div>
                <h3>Preview</h3>
                {fields.map(field => (
                    <div key={field.id}>
                        <input
                            type="text"
                            placeholder="Enter label"
                            value={field.label}
                            onChange={(e) => handleLabelChange(field.id, e.target.value)}
                        />
                        {field.type === "text" && <input type="text" placeholder={field.label} disabled />}
                        {field.type === "checkbox" && <input type="checkbox" disabled />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormBuilder;