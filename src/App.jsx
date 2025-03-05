// import React from 'react'

import { Provider } from "react-redux"
import { store } from "./Redux/store"
import DynamicFormBuilder from "./component/DynamicFormBuilder"
import DynamicForm from "./component/DynamicForm"
import { BrowserRouter } from "react-router-dom"
import Approute from "./Routes/Approute"

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Approute />
      </Provider>
    </BrowserRouter>
  )
}

export default App