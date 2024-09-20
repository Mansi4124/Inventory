import React, { useState, useEffect, useCallback } from 'react';
import "../ItemOrder/Item_order.css";
import axios from 'axios';

export default function Item_orderForm() {
  const [rows, setRows] = useState([{ quantity: '', costPrice: '' }]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  // Handle input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  // Handle adding a new row
  const addNewRow = (event) => {
    event.preventDefault();
    setRows([...rows, { quantity: '', costPrice: '' }]);
  };

  // Handle removing a row
  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  // Restrict input to numbers only and prevent entering zero
  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode < 48 || charCode > 57) && // Not a number
      charCode !== 46 && // Not a period (for decimals)
      charCode !== 8 &&  // Not backspace
      charCode !== 9     // Not tab
    ) {
      event.preventDefault();
    }
  };
  const [applyGST, setApplyGST] = useState('no');
  // Restrict input for quantity to disallow zero
  const handleQuantityKeyPress = (event) => {
    handleKeyPress(event);
    if (event.target.value === '' && event.which === 48) {
      event.preventDefault(); // Prevent entering 0 as the first digit
    }
  };

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

  // Calculate totals
  const calculateTotal = () => {
    const total = rows.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row['costPrice']) || 0;
      return acc + quantity * price;
    }, 0);

    // Apply GST if required
    if (applyGST === 'yes') {
      return (total * 1.18).toFixed(2); // Adding 18% GST
    }

    return total.toFixed(2);
  };

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

  const handleItemSelect = (index, event) => {
    const selectedItem = items.find(item => item.product_name === event.target.value);
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      name: selectedItem.product_name,
      costPrice: selectedItem.cost_price
    };
    setRows(newRows);
  };

  const handleItemOrder = async (e) => {
    e.preventDefault();
    const data = {
      'user_id': getCookie('userId'),
      'order_details': {
        'manufacturer_name': newName,
        'items': rows,
        'total': calculateTotal()
      }
    }

    const res = await axios.post("http://localhost:8000/add_item_order/", data);
    if (res.data.success) {
      setRows([{ quantity: '', costPrice: '', name: '' }]);
      setError('');
      setNewName('');
      setApplyGST('no')
    }
  }

  return (
    <section id='itemorder' className='itemorder-section'>
      <div className='itemorder-container'>
      <form className="myform-container">
        <fieldset className="myform-fieldset">
          <legend className="myform-legend">Add Order Details</legend>

          <table className="myform-table">
            <tbody>
              <tr className="myform-row">
                <td className="myform-label">
                  <label htmlFor="name" className="myform-label" >Manufacturer Name:</label>
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
                        <td className="myform-button-cell">{calculateTotal('costPrice')}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  {items.length === 0 && <div className='no-items alert alert-danger'>No itemsFound , Please add some first!</div>}
                </td>
              </tr>
              <tr>
                <td className="purchase-info">Cost Price: {calculateTotal('costPrice')}</td>
                <td>GST:</td>
                <td>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="yes"
                        name="gst"
                        value="yes"
                        checked={applyGST === 'yes'}
                        onChange={() => setApplyGST('yes')}
                        className="form-check-input"
                      />
                      <label htmlFor="yes" className="form-check-label">Yes</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="no"
                        name="gst"
                        value="no"
                        checked={applyGST === 'no'}
                        onChange={() => setApplyGST('no')}
                        className="form-check-input"
                      />
                      <label htmlFor="no" className="form-check-label">No</label>
                    </div>
                    <input
                      type="text"
                      value={applyGST === 'yes' ? '18%' : '0%'}
                      readOnly
                      className="gst-textbox"
                    /> 
                  </div>
                </td>
              </tr>

              <tr>

                <td colSpan="2" className="myform-button-cell">
                  <button type="submit" className="myform-button myform-button-save" onClick={handleItemOrder}>
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
    </div>
    </section>
  );
}