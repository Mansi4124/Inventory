import React, { useCallback, useEffect, useState } from 'react';
import "../SalesOrder/SalesOrder.css";
import axios from 'axios'

function MyForm4() {
  const [rows, setRows] = useState([{ quantity: '', amount: '' }]);
  const [customerName, setCustomerName] = useState('')
  const [applyGST, setApplyGST] = useState('no');
  const [discount, setDiscount] = useState('');
  const [items, setItems] = useState([]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];

    newRows[index][name] = value;

    if (name === 'quantity' || name === 'rate') {
      const quantity = parseFloat(newRows[index].quantity) || 0;
      const rate = parseFloat(newRows[index].sellingPrice) || 0;
      newRows[index].amount = (quantity * rate).toFixed(2);
    }

    setRows(newRows);
  };

  const getCookie = (name) => {
    const cookieName =`${name}=`;
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

  const updateSelect = useCallback(async () => {
    const userId = getCookie('userId');
    const res = await axios.post("http://localhost:8000/get_items/", { 'user_id': userId });
    const items = res.data.success ? res.data.user_items.products : [];
    setItems(items);
  }, []);

  const addNewRow = (event) => {
    event.preventDefault();
    setRows([...rows, { quantity: '', amount: '' }]);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

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

  const handleQuantityKeyPress = (event) => {
    handleKeyPress(event);
    if (event.target.value === '' && event.which === 48) {
      event.preventDefault(); // Prevent entering 0 as the first digit
    }
  };

  const calculateSubtotal = () => {
    return rows.reduce((acc, row) => {
      const amount = parseFloat(row.amount) || 0;
      return acc + amount;
    }, 0).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const gstRate = 0.18; // 18%
    const discountPercentage = parseFloat(discount) || 0;

    let grandTotal = subtotal;

    if (applyGST === 'yes') {
      grandTotal += subtotal * gstRate;
    }

    grandTotal -= (grandTotal * discountPercentage) / 100;

    return grandTotal.toFixed(2);
  };

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

  useEffect(() => {
    updateSelect();
  }, [updateSelect]);

  const handleSalesSave = async (e) => {
    e.preventDefault();
    const data = { 'customer_name': customerName, 'grand_total': calculateGrandTotal(), 'items': rows, 'user_id': getCookie('userId') }
    await axios.post("http://localhost:8000/add_sales/", data);
  }

  return (
    <>
      <div>
        <form className="myform-container">
          <fieldset className="myform-fieldset">
            <legend className="myform-legend">Sales Order</legend>

            <table className="myform-table">
              <tbody>
                <tr className="myform-row">
                  <td className="myform-label">
                    <label htmlFor="name" className="myform-label">Customer Name:</label>
                  </td>
                  <td>
                    <input type="text" id="name" name="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="myform-input myform-input-full-width" required />
                  </td>
                </tr>

                <tr>
                  <td colSpan="2">
                    <label htmlFor="name" className="myform-label">Item table:</label>
                    <table className="table">
                      <thead>
                        <tr>
                          <td>Item Name</td>
                          <td>Quantity</td>
                          <td>Rate</td>
                          <td>Amount</td>
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
                                name="rate"
                                value={row.sellingPrice}
                                className="myform-input"
                                onChange={event => handleInputChange(index, event)}
                                onKeyPress={handleKeyPress}
                                min="1"
                                step="1" // Step set to 1 for rate
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="amount"
                                value={row.amount}
                                className="myform-input"
                                readOnly
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
                          <td></td>
                          <td className="myform-button-cell" colSpan="2">
                            <table className="table subtotal-table">
                              <tbody>
                                <tr>
                                  <td>Sub Total:</td>
                                  <td>{calculateSubtotal()}</td>
                                </tr>
                                <tr>
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
                                        value="18%"
                                        readOnly
                                        className="gst-textbox"
                                      />
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Discount (%):</td>
                                  <td>
                                    <input
                                      type="text"
                                      name="discount"
                                      value={discount}
                                      onChange={e => setDiscount(e.target.value)}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>Grand Total:</td>
                                  <td>{calculateGrandTotal()}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  {items.length === 0 && <div className='no-items alert alert-danger'>No items Found , Please add some first!</div>}
                </tr>
                <tr>
                  <td colSpan="2" className="myform-button-cell">
                    <button type="submit" className="myform-button myform-button-save" onClick={handleSalesSave}>Save</button>
                    <button type="button" className="myform-button myform-button-cancel">Cancel</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default MyForm4;