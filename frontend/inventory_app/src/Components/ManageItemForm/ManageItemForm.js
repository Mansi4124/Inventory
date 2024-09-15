import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageItemForm.css';

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

const Item_Management = () => {
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [compositeSearchTerm, setCompositeSearchTerm] = useState(""); // New state for composite search
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [currentComposite, setCurrentComposite] = useState(null); // For editing composite items

    useEffect(() => {
        const fetchUserId = async () => {
            const user_id = getCookie('userId');
            if (user_id) {
                setUserId(user_id);
                await fetchItems(user_id);
            } else {
                console.error('User ID not found in cookies');
            }
        };
        fetchUserId();
    }, []);

    const fetchItems = async (userId) => {
        try {
            const response = await axios.post('http://localhost:8000/get_items/', { user_id: userId });
            if (response.data.success) {
                setItems(response.data.user_items.products);
            } else {
                console.error('Error fetching items:', response.data.message);
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setErrorMessage('Error fetching items');
        }
    };

    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentItem({ ...currentItem, [name]: value });
    };
// Function to check if the item name already exists
const isItemNameTaken = (product_name) => {
    return items.some(item => item.product_name.toLowerCase() === product_name.toLowerCase());
};

const handleEditItem = async () => {
    if (currentItem && currentItem.product_name) {
        const originalProductName = currentItem.originalProductName || currentItem.product_name;

        // Check if the new product name is already taken, excluding the original name
        if (currentItem.product_name.toLowerCase() !== originalProductName.toLowerCase() && isItemNameTaken(currentItem.product_name)) {
            setErrorMessage('Item name already exists. Please choose a different name.');
            return; // Exit the function to prevent the update
        }

        try {
            const response = await axios.put(`http://localhost:8000/edit_item/${originalProductName}/`, {
                user_id: userId,
                product_details: currentItem
            });

            if (response.data.message === "Item updated successfully") {
                setItems(items.map(item =>
                    item.product_name.toLowerCase() === originalProductName.toLowerCase() ? { ...currentItem } : item
                ));
                setCurrentItem(null);
                setErrorMessage('');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage('Error updating item');
        }
    }
};
const handleEditCompositeItem = async () => {
    if (currentComposite && currentComposite.product_name) {
        const originalProductName = currentComposite.originalProductName || currentComposite.product_name;

        // Check if the new composite name is already taken, excluding the original name
        if (currentComposite.product_name.toLowerCase() !== originalProductName.toLowerCase() && isItemNameTaken(currentComposite.product_name)) {
            setErrorMessage('Composite item name already exists. Please choose a different name.');
            return; // Exit the function to prevent the update
        }

        // Log to check the payload being sent
        console.log("Editing Composite Item:", currentComposite);

        try {
            const response = await axios.put(`http://localhost:8000/edit_item/${originalProductName}/`, {
                user_id: userId,
                product_details: currentComposite // Ensure new product_name is here
            });

            console.log("API Response:", response);

            if (response.data.success) {
                setItems(items.map(item =>
                    item.product_name.toLowerCase() === originalProductName.toLowerCase() ? { ...currentComposite } : item
                ));
                setCurrentComposite(null);
                setErrorMessage('');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error updating composite item:", error);
            setErrorMessage('Error updating composite item');
        }
    }
};


    const handleEditClick = (item) => {
        setCurrentItem({ ...item, originalProductName: item.product_name });
    };

    const handleDeleteItem = async (product_name) => {
        try {
            const response = await axios.delete(`http://localhost:8000/delete_item/${product_name}/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { user_id: userId }
            });
            if (response.data.success) {
                setItems(items.filter(item => item.product_name.toLowerCase() !== product_name.toLowerCase()));
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage('Error deleting item');
        }
    };

    const handleFilter = () => {
        if (searchTerm === "") {
            return items.filter(item => item.category !== "Composite"); // Filter out Composite items
        }
        return items.filter(item =>
            item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) && item.category !== "Composite"
        );
    };

    const handleCompositeFilter = () => {
        if (compositeSearchTerm === "") {
            return items.filter(item => item.category === "Composite"); // Filter for Composite items
        }
        return items.filter(item =>
            item.product_name && item.product_name.toLowerCase().includes(compositeSearchTerm.toLowerCase()) && item.category === "Composite"
        );
    };

    const handleCompositeEditClick = (item) => {
        setCurrentComposite({ ...item, originalProductName: item.product_name });
    };

    const handleCompositeEditInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentComposite({ ...currentComposite, [name]: value });
    };

    const handleCompositeQuantities = (key, value) => {
        setCurrentComposite({
            ...currentComposite,
            quantities: {
                ...currentComposite.quantities, // Spread existing quantities
                [key]: value // Update the specific key in quantities
            }
        });
    };


    return (
        <div className='item-management'>
            <div className="item-management-container">
                <h2>Manage Item</h2>

                <div className="search-item">
                    <input
                        type="text"
                        placeholder="Search Item by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {currentItem && (
                    <div className="edit-item-container">
                        <fieldset className="edit-item-fieldset">
                            <legend>Edit Item</legend>
                            <table className="edit-item-table">
                                <tbody>
                                    {/* Edit item fields */}
                                    <tr>
                                        <td>
                                            <label htmlFor="product_name">Item Name:</label>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="product_name"
                                                placeholder="Item Name"
                                                value={currentItem.product_name}
                                                onChange={handleEditInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="category">Category:</label>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="category"
                                                placeholder="Category"
                                                value={currentItem.category}
                                                onChange={handleEditInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="weight">Weight:</label>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="weight"
                                                placeholder="Weight"
                                                value={currentItem.weight}
                                                onChange={handleEditInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="selling_price">Selling Price:</label>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="selling_price"
                                                placeholder="Selling Price"
                                                value={currentItem.selling_price}
                                                onChange={handleEditInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="cost_price">Cost Price:</label>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="cost_price"
                                                placeholder="Cost Price"
                                                value={currentItem.cost_price}
                                                onChange={handleEditInputChange}
                                            />
                                        </td>
                                    </tr>

                                    {/* Other fields */}
                                    <tr>
                                        <td colSpan="2">
                                            <div className='editSaveBtn'>
                                                <button onClick={handleEditItem}>Save</button>
                                            </div>
                                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                )}

                <div className="items-list">
                    <h3>Items List</h3>
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Weight</th>
                                <th>Selling Price</th>
                                <th>Cost Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {handleFilter().map(item => (
                                <tr key={item.product_name}>
                                    <td>{item.product_name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.weight}</td>
                                    <td>{item.selling_price}</td>
                                    <td>{item.cost_price}</td>
                                    <td>
                                        <button className="edit" onClick={() => handleEditClick(item)}>Edit</button>
                                        <button className="delete" onClick={() => handleDeleteItem(item.product_name)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Search input for composite items */}
                <div className="search-composite-item">
                    <input
                        type="text"
                        placeholder="Search Composite Item by Name"
                        value={compositeSearchTerm}
                        onChange={(e) => setCompositeSearchTerm(e.target.value)} // Update composite search term
                    />
                </div>
                {/* Composite Items Table */}
                {currentComposite && (
                    <div className="edit-composite-item-container">
                        <fieldset className="edit-item-fieldset">
                            <legend>Edit Composite Item</legend>
                            <table className="edit-item-table">
                                <tbody>
                                    {/* Edit composite item fields */}
                                    <tr>
                                        <td>
                                            <label htmlFor="product_name">Item Name:</label>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="product_name"
                                                placeholder="Item Name"
                                                value={currentComposite.product_name}
                                                onChange={handleCompositeEditInputChange}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <label htmlFor="selling_price">Selling Price:</label>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="selling_price"
                                                placeholder="Selling Price"
                                                value={currentComposite.selling_price}
                                                onChange={handleCompositeEditInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="cost_price">Cost Price:</label>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="cost_price"
                                                placeholder="Cost Price"
                                                value={currentComposite.cost_price}
                                                onChange={handleCompositeEditInputChange}
                                            />
                                        </td>
                                    </tr>
                                    {Object.entries(currentComposite.quantities).map(([key, value]) => (
                                        <tr>
                                            <td>
                                                <label htmlFor="quantity">{key}:</label>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    placeholder="Quantity"
                                                    value={value}
                                                    onChange={(e) => handleCompositeQuantities(key, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Other fields */}
                                    <tr>
                                        <td colSpan="2">
                                            <div className='editSaveBtn'>
                                                <button onClick={handleEditCompositeItem}>Save</button>
                                            </div>
                                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                )}
                <div className="composite-items-list">
                    <h3>Composite Items List</h3>
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Selling Price</th>
                                <th>Cost Price</th>
                                <th>Items Contained</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {handleCompositeFilter().map(item => (
                                <tr key={item.product_name}>
                                    <td>{item.product_name}</td>
                                    <td>{item.selling_price}</td>
                                    <td>{item.cost_price}</td>
                                    <td>
                                        {Object.entries(item.quantities).map(([key, value]) => (
                                            <div key={key}>
                                                <span>{key}:</span> {value}
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        <button className="edit" onClick={() => handleCompositeEditClick(item)}>Edit</button>
                                        <button className="delete" onClick={() => handleDeleteItem(item.product_name)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    );
};

export default Item_Management;
