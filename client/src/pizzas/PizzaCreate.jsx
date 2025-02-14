import { useState } from "react";
import PageHeader from "../header/PageHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PizzaCreate() {
    const [pizza, setPizza] = useState({id:'', name:'', 
            size:'', category:'', price: 0.0})
    const OnBoxChange = (event) => {
        const newPizza = {...pizza};
        newPizza[event.target.id] = event.target.value;
        setPizza(newPizza);
    }
    const navigate = useNavigate();
    const OnCreate = async () => {
        try {
            const baseUrl = 'http://localhost:8080'
            const response = await axios.post(`${baseUrl}/pizzas`, {...pizza,
                                        capacity:parseInt(pizza.capacity),
                                        price:parseFloat(pizza.price)});
            alert(response.data.message)
            navigate('/pizzas/list');
        } catch(error) {
            alert('Server Error');
        }
    }
    return (
        <>
            <PageHeader PageNumber={2}/>
            <h3><a href="/pizzas/list" className="btn btn-light">Go Back</a>New Pizza</h3>
            <div className="container">
                <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">Pizza Number:</label>
                    <input type="text" className="form-control" id="name" 
                        placeholder="Please enter pizza name"
                        value={pizza.name} onChange={OnBoxChange}/>
                </div>
                
                <div className="form-group mb-3">
                    <label htmlFor="size" className="form-label">Size:</label>
                    <input type="text" className="form-control" id="size" 
                        placeholder="Please enter size"
                        value={pizza.size} onChange={OnBoxChange}/>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="category" className="form-label">Category:</label>
                    <input type="text" className="form-control" id="category" 
                        placeholder="Please enter category"
                        value={pizza.category} onChange={OnBoxChange}/>
                </div>
                
                <div className="form-group mb-3">
                    <label htmlFor="price" className="form-label">Price of Pizza:</label>
                    <input type="text" className="form-control" id="price" 
                        placeholder="Please enter ticket price"                                                
                        value={pizza.price} onChange={OnBoxChange}/>
                </div>
                <button className="btn btn-success"
                    onClick={OnCreate}>Create Pizza</button>
            </div>
        </>
    );
}

export default PizzaCreate;