import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    formFields: [],
};

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        addField: (state, action) => {
            if (state.formFields.length < 10) {
                state.formFields.push(action.payload);
            }
            localStorage.setItem("formFields", JSON.stringify(state.formFields));
        },
        removeField: (state, action) => {
            state.formFields = state.formFields.filter(
                (_, index) => index !== action.payload
            );
            localStorage.setItem("formFields", JSON.stringify(state.formFields));
        },
        updateField: (state, action) => {
            const { index, newField } = action.payload;
            state.formFields[index] = newField;
            localStorage.setItem("formFields", JSON.stringify(state.formFields));
        },
        reorderFields: (state, action) => {
            state.formFields = action.payload;
            localStorage.setItem("formFields", JSON.stringify(state.formFields));
        },
        clearFields: (state) => {
            state.formFields = [];
            localStorage.removeItem("formFields");  // Reset storage on new form
        },
    },
});

export const { addField, removeField, updateField, reorderFields, clearFields } = formSlice.actions;

export const store = configureStore({
    reducer: {
        form: formSlice.reducer,
    },
});
