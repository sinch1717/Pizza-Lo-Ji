import { useEffect, useState } from "react";
import PageHeader from "../header/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function PizzaEdit() {
    const [pizza, setPizza] = useState({id:'', name:'', 
                size:'', category:'',  price: 0.0})
    const OnBoxChange = (event) => {
        const newPizza = {...pizza};
        newPizza[event.target.id] = event.target.value;
        setPizza(newPizza);
    }
    const params = useParams();
    const readPizzaById = async () => {
        alert(params.id);
        try {
            const baseUrl = 'http://localhost:8080'
            const response = await axios.get(`${baseUrl}/pizzas/${params.id}`);
            setPizza(response.data);
            
        } catch(error) {
            alert('Server Error');
        }
    };
    useEffect(()=>{ readPizzaById(); },[]);
    const navigate = useNavigate();
    const OnUpdate = async () => {
        try {
            const baseUrl = 'http://localhost:8080'
            const response = await axios.put(`${baseUrl}/pizzas/${params.id}`, {...pizza,
                                        price:parseFloat(pizza.price)});
            alert(response.data.message)
            navigate('/pizzas/list');
        } catch(error) {
            alert('Server Error');
        }
    }
    return (
        <>
            <PageHeader  PageNumber={1}/>
            <h3><a href="/pizzas/list" className="btn btn-light">Go Back</a>Edit Pizza Price</h3>
            <div className="container">
                <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">Pizza Name:</label>
                    <div className="form-control" id="name">{pizza.name}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="size" className="form-label">Size:</label>
                    <div className="form-control" id="size">{pizza.size}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="category" className="form-label">Category:</label>
                    <div className="form-control" id="category">{pizza.category}</div>
                </div>
                
                <div className="form-group mb-3">
                    <label htmlFor="price" className="form-label">Pizza Price:</label>
                    <input type="text" className="form-control" id="price" 
                        placeholder="Please enter ticket price"                                                
                        value={pizza.price} onChange={OnBoxChange} />
                </div>
                <button className="btn btn-warning"
                    onClick={OnUpdate}>Update Price</button>
            </div>
        </>
    );
}

export default PizzaEdit;