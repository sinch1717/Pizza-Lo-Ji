import { useEffect, useState } from "react";
import PageHeader from "../header/PageHeader";
import axios from 'axios';

function PizzaList() {
    const [pizzas, setPizzas] = useState([]);
    const readAllPizzas = async () => {
        try {
            const baseUrl = 'http://localhost:8080'
            const response = await axios.get(`${baseUrl}/pizzas`);
            setPizzas(response.data);
            
        } catch(error) {
            alert('Server Error');
        }
    };
    useEffect(()=>{ readAllPizzas(); },[]);
    //deleteing the pizza
    const onDelete = async (id) => {
        if (!confirm("Are you sure to delete?")) {
            return;
        }
    
        try {
            const baseUrl = 'http://localhost:8080';
            await axios.delete(`${baseUrl}/pizzas/${id}`);
            
            // Update the state by filtering out the deleted pizza
            setPizzas(pizzas.filter((pizza) => pizza.id !== id));
        } catch (error) {
            alert('Failed to delete the pizza. Server Error.');
        }
    };
    
    return (
        <>
            <PageHeader PageNumber={1}/>
            <h3>List of Pizzas</h3>
            <div className="container">
                <table className="table table-info table-striped">
                    <thead className="table-danger">
                        <tr>
                            <th scope="col">Pizza ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Size</th>
                            <th scope="col">Category</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { pizzas.map( (pizza) => {
                            return (
                            <tr>
                                <th scope="row">{pizza.id}</th>
                                <td>{pizza.name}</td>
                                <td>{pizza.size}</td>
                                <td>{pizza.category}</td>
                                <td>
                                    <a href={`/pizzas/edit/${pizza.id}`} className="btn btn-warning me-3">Edit Pizza</a>
                                    <button className="btn btn-danger" onClick={() => onDelete(pizza.id)}>Delete</button>
                                </td>
                            </tr>
                            );
                        } ) 
                        }
                        
                        
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default PizzaList;
