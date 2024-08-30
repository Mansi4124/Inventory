import React, { useState } from 'react';
import "../SalesOrder/SalesOrder.css";

function MyForm4() {
  const [rows, setRows] = useState([{ quantity: '', rate: '', amount: '' }]);
  const [applyGST, setApplyGST] = useState('no');
  const [discount, setDiscount] = useState('');

  // Handle input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];

    // Update the specific field
    newRows[index][name] = value;

    // Recalculate the amount
    if (name === 'quantity' || name === 'rate') {
      const quantity = parseFloat(newRows[index].quantity) || 0;
      const rate = parseFloat(newRows[index].rate) || 0;
      newRows[index].amount = (quantity * rate).toFixed(2);
    }

    setRows(newRows);
  };

  // Handle adding a new row
  const addNewRow = (event) => {
    event.preventDefault();
    setRows([...rows, { quantity: '', rate: '', amount: '' }]);
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

  // Calculate subtotal
  const calculateSubtotal = () => {
    return rows.reduce((acc, row) => {
      const amount = parseFloat(row.amount) || 0;
      return acc + amount;
    }, 0).toFixed(2);
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const gstRate = 0.18; // 18%
    const discountPercentage = parseFloat(discount) || 0;

    let grandTotal = subtotal;

    // Add GST if applicable
    if (applyGST === 'yes') {
      grandTotal += subtotal * gstRate;
    }

    // Subtract discount
    grandTotal -= (grandTotal * discountPercentage) / 100;

    return grandTotal.toFixed(2);
  };

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
                    <input type="text" id="name" name="name" className="myform-input myform-input-full-width" required />
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
                                name="rate"
                                value={row.rate}
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
                              <a href="#" className="myform-add-row-button" onClick={addNewRow}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon icon-sm text-open fill-azure-blue align-middle">
                                  <path d="M256 15C122.9 15 15 122.9 15 256s107.9 241 241 241 241-107.9 241-241S389.1 15 256 15zm122 263H278v100c0 12.2-9.8 22-22 22s-22-9.8-22-22V278H134c-12.2 0-22-9.8-22-22s9.8-22 22-22h100V134c0-12.2 9.8-22 22-22s22 9.8 22 22v100h100c12.2 0 22-9.8 22-22s-9.8-22-22-22z"></path>
                                  <path fill="#FFF" d="M378 234H278V134c0-12.2-9.8-22-22-22s-22 9.8-22 22v100H134c-12.2 0-22 9.8-22 22s9.8 22 22 22h100v100c0 12.2 9.8 22 22 22s22-9.8 22-22V256h100c12.2 0 22-9.8 22-22s-9.8-22-22-22z"></path>
                                </svg>
                                <span>Add New Row</span>
                              </a>
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
                  <td colSpan="2" className="myform-button-cell">
                    <button type="submit" className="myform-button myform-button-save">Save</button>
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
