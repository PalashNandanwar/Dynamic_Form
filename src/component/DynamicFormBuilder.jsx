import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addField, removeField, reorderFields, clearFields } from "../Redux/store";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TextField, Button, Select, MenuItem, IconButton, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const fieldTypes = ["Short Answer", "Password", "Paragraph", "Single Choice", "Checkboxes", "Number", "Email"];

const DynamicFormBuilder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formFields = useSelector((state) => state.form.formFields);

    const [formDetails, setFormDetails] = useState({
        title: "Untitled Form",
        description: "Form description",
    });

    const [newField, setNewField] = useState({
        label: "Untitled Question",
        type: "Short Answer",
        options: [],
        answer: ""
    });

    const [optionInput, setOptionInput] = useState("");

    const handleAddField = () => {
        const newQuestion = {
            id: uuidv4(), // Generate a unique ID
            label: newField.label,
            type: newField.type,
            options: newField.options,
            answer: ""
        };

        dispatch(addField(newQuestion));
        setNewField({ label: "Untitled Question", type: "Short Answer", options: [], answer: "" });
    };


    const handleRemoveField = (index) => {
        dispatch(removeField(index));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return; // If dropped outside, do nothing

        const reorderedFields = [...formFields];
        const [movedItem] = reorderedFields.splice(result.source.index, 1);
        reorderedFields.splice(result.destination.index, 0, movedItem);

        dispatch(reorderFields(reorderedFields)); // Update Redux state
    };

    const handleAddOption = () => {
        if (optionInput.trim()) {
            setNewField({ ...newField, options: [...newField.options, optionInput] });
            setOptionInput("");
        }
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = newField.options.filter((_, i) => i !== index);
        setNewField({ ...newField, options: updatedOptions });
    };

    const handleNewForm = () => {
        setFormDetails({ title: "Untitled Form", description: "Form description" });

        // Clear form fields in Redux store
        dispatch(clearFields());
    };

    const handleSaveForm = () => {
        let storedForms = JSON.parse(localStorage.getItem("savedForms")) || [];

        const uniqueFormId = uuidv4();

        const newForm = {
            id: uniqueFormId,
            title: formDetails.title || `Form-${storedForms.length + 1}`,
            description: formDetails.description,
            fields: formFields.map(field => ({ ...field, id: field.id || uuidv4() })), // Ensure each field has an ID
        };

        storedForms.push(newForm);
        localStorage.setItem("savedForms", JSON.stringify(storedForms));

        handleNewForm();
        navigate("/");
    };


    return (
        <div>
            <h1 className=" text-2xl font-extrabold mb-6">Dynamic Form Builder</h1>
            <div className="w-[90%] flex flex-col gap-[2rem] mx-auto p-4 bg-gray-200 shadow-md rounded-lg">
                <div className="flex flex-col gap-6 bg-gray-100 shadow-md p-4">
                    <TextField
                        label="Form Title"
                        variant="outlined"
                        fullWidth
                        value={formDetails.title}
                        onChange={(e) => setFormDetails({ ...formDetails, title: e.target.value })}
                        className="mb-2"
                    />
                    <TextField
                        label="Form Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        value={formDetails.description}
                        onChange={(e) => setFormDetails({ ...formDetails, description: e.target.value })}
                        className="mb-4"
                    />
                </div>

                <div className="flex flex-col bg-gray-100 shadow-md p-4 rounded-xs gap-6">
                    <div className="flex gap-4">
                        <TextField
                            label="Question Title"
                            fullWidth
                            value={newField.label}
                            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                            className="mb-2"
                        />
                        <Select
                            value={newField.type}
                            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                            fullWidth
                            className="mb-2"
                        >
                            {fieldTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </div>

                    {(newField.type === "Dropdown" || newField.type === "Single Choice" || newField.type === "Checkboxes") && (
                        <div className="flex flex-col gap-2">
                            <TextField
                                label="Enter your option"
                                fullWidth
                                value={optionInput}
                                onChange={(e) => setOptionInput(e.target.value)}
                                className="mb-2"
                            />
                            <Button className="w-fit" onClick={handleAddOption} variant="contained">Add Option</Button>
                            <ul>
                                {newField.options.map((opt, i) => (
                                    <li key={i} className="flex justify-between items-center">
                                        {opt}
                                        <IconButton size="small" onClick={() => handleRemoveOption(i)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </li>
                                ))}
                            </ul>

                            {/* Selection for Multiple Choice and Checkboxes */}
                            <div className="mt-3">
                                {newField.type === "Single Choice" && (
                                    <div className="flex flex-col gap-1">
                                        {newField.options.map((opt, i) => (
                                            <label key={i} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="multipleChoice"
                                                    value={opt}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {newField.type === "Checkboxes" && (
                                    <div className="flex flex-col gap-1">
                                        {newField.options.map((opt, i) => (
                                            <label key={i} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    value={opt}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <Button onClick={handleAddField} variant="contained" color="primary" className="mt-2">Add Question</Button>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="fields">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                                {formFields.map((field, index) => (
                                    <Draggable key={index} draggableId={index.toString()} index={index}>
                                        {(provided) => (
                                            <Paper
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="p-4 flex flex-col space-y-2"
                                                elevation={3}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold">{field.label} ({field.type})</p>
                                                    <IconButton onClick={() => handleRemoveField(index)} color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>

                                                {/* {(field.type === "Short Answer" || field.type === "Paragraph" || field.type === "Password" || field.type === "Number" || field.type === "Email") && (
                                                    // <TextField
                                                    //     label="Answer"
                                                    //     fullWidth
                                                    //     type={
                                                    //         field.type === "Password" ? "password" :
                                                    //             field.type === "Number" ? "number" :
                                                    //                 field.type === "Email" ? "email" :
                                                    //                     "text"
                                                    //     }
                                                    // />
                                                )} 
                                                    {(field.type === "Dropdown" || field.type === "Single Choice" || field.type === "Checkboxes") && (
                                                    <div className="text-sm text-gray-600">
                                                        {field.type === "Dropdown" ? (
                                                            <select className="border p-2 w-full rounded">
                                                                {field.options.map((opt, i) => (
                                                                    <option key={i} value={opt}>{opt}</option>
                                                                ))}
                                                            </select>
                                                        ) : field.type === "Single Choice" ? (
                                                            <ul className="flex flex-col gap-1">
                                                                {field.options.map((opt, i) => (
                                                                    <li key={i} className="flex items-center gap-2">
                                                                        <input type="radio" name={`singleChoice-${field.id}`} value={opt} />
                                                                        {opt}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : field.type === "Checkboxes" ? (
                                                            <ul className="flex flex-col gap-1">
                                                                {field.options.map((opt, i) => (
                                                                    <li key={i} className="flex items-center gap-2">
                                                                        <input type="checkbox" value={opt} />
                                                                        {opt}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : null}
                                                    </div>
                                                )} */}

                                            </Paper>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <div className="flex justify-center items-center">
                    <Button onClick={handleSaveForm} variant="contained" color="success" className="mt-4 w-fit text-center">Save Form</Button>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormBuilder;
