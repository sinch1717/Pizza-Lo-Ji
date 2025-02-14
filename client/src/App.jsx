import PizzaList from "./pizzas/PizzaList"
import PizzaCreate from "./pizzas/PizzaCreate"
import PizzaEdit from "./pizzas/PizzaEdit"

import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>     
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="" element={<PizzaList/>}/>
            <Route path="/pizzas/list" element={<PizzaList/>}/>
            <Route path="/pizzas/create" element={<PizzaCreate/>}/>
            <Route path="/pizzas/edit/:id" element={<PizzaEdit/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      
    </>
  )
}

export default App
