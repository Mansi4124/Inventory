import React, { useState } from 'react';
import "../Composite_item/Composite_item.css";

function MyForm() {
  const [rows, setRows] = useState([
    { quantity: '', sellingPrice: '', costPrice: '' }
  ]);

  // Handle input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  // Calculate totals
  const calculateTotal = (type) => {
    return rows.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row[type]) || 0;
      return acc + (quantity * price);
    }, 0).toFixed(2);
  };

  return (
    <form>
      <fieldset className="form-fieldset">
        <legend className="form-legend">Composite Product</legend>

        <table className="form-table">
          <tbody>
            <tr>
              <td>
                <label htmlFor="name" className="form-label">Name:</label>
              </td>
              <td>
                <input type="text" id="name" name="name" className="form-input" required />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="unit" className="form-label">Unit:</label>
              </td>
              <td>
                <select id="unit" name="unit" className="form-select">
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </td>
            </tr>
            <label htmlFor="name" className="form-label">Associate items:</label>
            <tr>
              <table className="table table-bordered">
                  <tr>
                    <td>Item Details</td>
                    <td>Quantity</td>
                    <td>Selling Price</td>
                    <td>Cost Price</td>
                  </tr>
                
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td><input type="text" name="item" className="form-input" /></td>
                      <td><input type="number" name="quantity" value={row.quantity} className="form-input" onChange={event => handleInputChange(index, event)} /></td>
                      <td><input type="number" name="sellingPrice" value={row.sellingPrice} className="form-input" onChange={event => handleInputChange(index, event)} /></td>
                      <td><input type="number" name="costPrice" value={row.costPrice} className="form-input" onChange={event => handleInputChange(index, event)} /></td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td>Total:</td>
                    <td>{calculateTotal('sellingPrice')}</td>
                    <td>{calculateTotal('costPrice')}</td>
                  </tr>
                
              </table>
            </tr>
            <tr>
              <table>
              <tr>
              <td><label htmlFor="name" className="form-label">Sales Information</label></td>
              <td><label htmlFor="name" className="form-label">Purchase Information</label></td>
              </tr>
              <tr>
              <td>Selling Price:{calculateTotal('sellingPrice')}</td>
              <td>Cost Price:{calculateTotal('costPrice')}</td>
              </tr>
              </table>
            </tr>
            {/* Action Buttons */}
            <div className="form-buttons">
              <button type="submit" className="btn-save">Save</button>
              <button type="button" className="btn-cancel">Cancel</button>
            </div>
          </tbody>
        </table>
      </fieldset>
    </form>
  );
}

export default MyForm;

