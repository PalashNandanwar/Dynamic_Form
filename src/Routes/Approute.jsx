import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import FormPage from '../Pages/FormPage'
import FormViewer from '../Pages/FormViewer'

const Approute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/form/:id" element={<FormViewer />} />
        </Routes>
    )
}

export default Approute