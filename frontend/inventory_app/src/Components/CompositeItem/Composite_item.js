import React, { useCallback, useEffect, useState } from 'react';
import "../CompositeItem/Composite_item.css";
import axios from 'axios';

function MyForm1() {
  const [rows, setRows] = useState([{ name: '', quantity: 0, sellingPrice: '', costPrice: '' }]);
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [error, setError] = useState('');
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

  const calculateTotal = useCallback((type) => {
    return rows.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row[type]) || 0;
      return acc + quantity * price;
    }, 0).toFixed(2);
  }, [rows]);


  const updateSelect = useCallback(async () => {
    const userId = getCookie('userId');
    const res = await axios.post("http://localhost:8000/get_items/", { 'user_id': userId });
    var items = res.data.success ? res.data.user_items.products : [];
    items = items.filter((item) => item['category'] !== 'Composite');
    setItems(items);
  }, []);

  useEffect(() => {
    updateSelect();
  }, [updateSelect]);

  useEffect(() => {
    setSellingPrice(calculateTotal('sellingPrice'));
    setCostPrice(calculateTotal('costPrice'));
  }, [rows, calculateTotal]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const addNewRow = (event) => {
    event.preventDefault();
    setRows([...rows, { name: '', quantity: 0, sellingPrice: '', costPrice: '' }]);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleCompositeSave = async (e) => {
    if (newName == "") {
      setError("Item name cannot be empty!")
    }
    e.preventDefault();
    const userId = getCookie('userId');
    const month = new Date().getMonth()
    const month_text = monthNames[month]
    const year = new Date().getFullYear()
    const month_year = month_text + "-" + year
    const quantities = {}
    const cost_prices = {}
    const selling_prices = {}
    for (var row of rows) {
      quantities[row.name] = row.quantity
      cost_prices[row.name] = row.costPrice
      selling_prices[row.name] = row.sellingPrice
    }
    const data = {
      'user_id': userId,
      'product_details': {
        'product_name': newName,
        'category': "Composite",
        'selling_price': parseInt(sellingPrice),
        'cost_price': parseInt(costPrice),
        'quantities': quantities,
        'cost_prices': cost_prices,
        'selling_prices': selling_prices,
        'month-year': month_year
      }
    }

    if (newName) {
      const res = await axios.post("http://localhost:8000/add_item/", data);

      if (res.data.success === false) {
        setError(res.data.error)
      } else {
        setError('')
        setNewName('');
        setRows([{ name: '', quantity: 0, sellingPrice: '', costPrice: '' }]);
        setSellingPrice(0);
        setCostPrice(0);
        updateSelect();
        alert('Form submitted!');
      }
    }
  }

  const handleItemSelect = (index, event) => {
    const selectedItem = items.find(item => item.product_name === event.target.value);
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      name: selectedItem.product_name,
      sellingPrice: selectedItem.selling_price,
      costPrice: selectedItem.cost_price
    };
    setRows(newRows);
  };

  const handleQuantityKeyPress = (event) => {
    if (event.target.value === '' && event.which === 48) {
      event.preventDefault();
    }
  };

  return (
    <>
      <form className="myform-container" onSubmit={handleCompositeSave}>
        <fieldset className="myform-fieldset">
          <legend className="myform-legend">Composite Product</legend>

          <table className="myform-table">
            <tbody>
              <tr className="myform-row">
                <td className="myform-label">
                  <label htmlFor="name" className="myform-label" required>Name:</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="myform-input myform-input-full-width"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                  {error !== "" && <p style={{ color: 'red' }}>{error}</p>}
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  <label htmlFor="name" className="myform-label">Associate items:</label>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <td>Item Details</td>
                        <td>Quantity</td>
                        <td>Selling Price</td>
                        <td>Cost Price</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <select name='name' className="myform-input" value={row.name} onChange={event => handleItemSelect(index, event)}>
                              <option value='' hidden>Select Items</option>
                              {items.length === 0 && <option disabled>No Items Found</option>}
                              {items.map((item, idx) => (
                                <option value={item.product_name} key={idx}>{item.product_name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              name="quantity"
                              value={row.quantity}
                              className="myform-input"
                              onChange={event => handleInputChange(index, event)}
                              onKeyPress={handleQuantityKeyPress}
                              min="1"
                              step="1" // Step set to 1 for quantity
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="sellingPrice"
                              value={row.sellingPrice}
                              className="myform-input"
                              onChange={event => handleInputChange(index, event)}
                              min="1"
                              step="1" // Step set to 1 for selling price
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="costPrice"
                              value={row.costPrice}
                              className="myform-input"
                              onChange={event => handleInputChange(index, event)}
                              min="1"
                              step="1"
                            />
                          </td>
                          <td>
                            <button type="button" className="myform-remove-row-button" onClick={() => removeRow(index)}>
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <div className="pt-2">
                            <button className="myform-add-row-button" onClick={addNewRow}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon icon-sm text-open fill-azure-blue align-middle">
                                <path d="M256 15C122.9 15 15 122.9 15 256s107.9 241 241 241 241-107.9 241-241S389.1 15 256 15zm122 263H278v100c0 12.2-9.8 22-22 22s-22-9.8-22-22V278H134c-12.2 0-22-9.8-22-22s9.8-22 22-22h100V134c0-12.2 9.8-22 22-22s22 9.8 22 22v100h100c12.2 0 22-9.8 22-22s-9.8-22-22-22z"></path>
                                <path fill="#FFF" d="M378 234H278V134c0-12.2-9.8-22-22-22s-22 9.8-22 22v100H134c-12.2 0-22 9.8-22 22s9.8 22 22 22h100v100c0 12.2 9.8 22 22 22s22-9.8 22-22V256h100c12.2 0 22-9.8 22-22s-9.8-22-22-22z"></path>
                              </svg>
                              <span>Add New Row</span>
                            </button>
                          </div>
                        </td>
                        <td className="myform-button-cell">Total:</td>
                        <td className="myform-button-cell">{calculateTotal('sellingPrice')}</td>
                        <td className="myform-button-cell">{calculateTotal('costPrice')}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  {items.length === 0 && <div className='no-items alert alert-danger'>No items Found , Please add some first!</div>}
                </td>
              </tr>
              <tr>
                <td className="sales-info">Selling Price: {calculateTotal('sellingPrice')}</td>
                <td className="purchase-info">Cost Price: {calculateTotal('costPrice')}</td>
              </tr>
              <tr>

                <td colSpan="2" className="myform-button-cell">
                  <button type="submit" className="myform-button myform-button-save" onClick={handleCompositeSave}>
                    Save
                  </button>
                  <button type="button" className="myform-button myform-button-cancel">
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </form>
    </>
  );
}

export default MyForm1;