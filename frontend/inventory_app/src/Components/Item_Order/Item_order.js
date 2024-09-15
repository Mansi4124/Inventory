import React, { useState } from 'react';
import "../Item_order/Item_order.css";

export default function Item_orderForm() {
  const [rows, setRows] = useState([{ quantity: '', costPrice: '' }]);

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

  // Restrict input for quantity to disallow zero
  const handleQuantityKeyPress = (event) => {
    handleKeyPress(event);
    if (event.target.value === '' && event.which === 48) {
      event.preventDefault(); // Prevent entering 0 as the first digit
    }
  };

  // Calculate totals
  const calculateTotal = (type) => {
    return rows.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row[type]) || 0;
      return acc + quantity * price;
    }, 0).toFixed(2);
  };

  return (
    <>
      <form className="myform-container">
        <fieldset className="myform-fieldset">
         <legend className="myform-legend">Composite Product</legend> 
        
          <table className="myform-table">
            <tbody>
              <tr className="myform-row">
                <td className="myform-label">
                  <label htmlFor="name" className="myform-label">Manufacturer Name:</label>
                </td>
                <td>
                  <input type="text" id="name" name="name" className="myform-input myform-input-full-width" />
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
                          <td><input type="text" name="item" className="myform-input" /></td>
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
                              onKeyPress={handleKeyPress}
                              min="1"
                              step="1" // Step set to 1 for cost price
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
                            <a href="#" className="myform-add-row-button" onClick={addNewRow}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon icon-sm text-open fill-azure-blue align-middle">
                                <path d="M256 15C122.9 15 15 122.9 15 256s107.9 241 241 241 241-107.9 241-241S389.1 15 256 15zm122 263H278v100c0 12.2-9.8 22-22 22s-22-9.8-22-22V278H134c-12.2 0-22-9.8-22-22s9.8-22 22-22h100V134c0-12.2 9.8-22 22-22s22 9.8 22 22v100h100c12.2 0 22-9.8 22-22s-9.8-22-22-22z"></path>
                                <path fill="#FFF" d="M378 234H278V134c0-12.2-9.8-22-22-22s-22 9.8-22 22v100H134c-12.2 0-22 9.8-22 22s9.8 22 22 22h100v100c0 12.2 9.8 22 22 22s22-9.8 22-22V256h100c12.2 0 22-9.8 22-22s-9.8-22-22-22z"></path>
                              </svg>
                              <span>Add New Row</span>
                            </a>
                          </div>
                        </td>
                        <td className="myform-button-cell">Total:</td>
                        <td className="myform-button-cell">{calculateTotal('costPrice')}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td className="purchase-info">Cost Price: {calculateTotal('costPrice')}</td>
              </tr>
              <tr>

              <td colSpan="2" className="myform-button-cell">
                <button type="submit" className="myform-button myform-button-save">
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


