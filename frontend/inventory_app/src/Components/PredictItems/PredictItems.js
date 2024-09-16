import React, { useState } from "react";
import axios from 'axios';
import "./PredictItems.css"

const PredictItems = () => {

    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);
    const [userItems, setUserItems] = useState([]);

    const getCookie = (name) => {
        const cookieName = `${name}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    };

    const fetchSuggestions = async (e) => {
        e.preventDefault();

        const date_res = await axios.post("http://localhost:8000/get_sales/", { 'user_id': getCookie("userId") });

        const salesDate = new Date(date_res.data.date);

        const today = new Date();

        const timeDiff = today - salesDate;

        const days_diff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        console.log(days_diff)

        const res = await axios.post("http://localhost:8000/get_suggestions/", {
            'user_id': getCookie("userId"),
            'budget': budget,
            'days_diff': days_diff
        });

        if (res.data.success) {
            setItems(res.data.data);
            setUserItems(res.data.user_items.filter((item) => item['category'] !== 'Composite'));
            setBudget('')
            setError('')
        } else {
            setError(res.data.error)
        }
    };


    return (
        <div className="predicted-div">
            <h1 className="text-center">Have a budget in mind?</h1>
            <h3 style={{ color: 'black', marginTop: '20px' }}>Get suggested inventory</h3>
            <div className="predicted-input-div">
                <div>
                    <input className="get-suggestion-input" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Enter your Budget" required />
                </div>
                {error !== '' && <div className="predicted-error-div">{error}</div>}
            </div>
            <div className="predictedBtnDiv">
                <button className="get-suggestions-btn" onClick={fetchSuggestions}>Get Suggestions</button>
            </div>
            <div className="mt-4">
                {items.length !== 0 &&
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Weight</th>
                                <th>Selling Price</th>
                                <th>Cost Price</th>
                                <th>Profit Margin</th>
                                <th>Predicted Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userItems && userItems.map((userItem, index) => (
                                <tr key={index}>
                                    <td>{userItem.product_name}</td>
                                    <td>{userItem.category}</td>
                                    <td>{userItem.weight}</td>
                                    <td>{userItem.selling_price}</td>
                                    <td>{userItem.cost_price}</td>
                                    <td>{userItem.profit_margin}</td>
                                    <td>{Math.round(items[index])}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    );
};

export default PredictItems;
