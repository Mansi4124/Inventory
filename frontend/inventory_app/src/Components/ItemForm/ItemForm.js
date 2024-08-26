import React, { useState } from 'react';
import '../ItemForm/Item_form.css';

function MyForm() {
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
 
  const handleSelectChange = (e) => {
    setSelectedManufacturer(e.target.value);
    if (e.target.value === 'add-new') {
      setNewManufacturer('');
    }
  };

  const handleSelectChange1 = (e) => {
    setSelectedBrand(e.target.value);
    if (e.target.value === 'add-new1') {
      setNewBrand('');
    }
  };

  const handleInputChange = (e) => {
    setNewManufacturer(e.target.value);
  };

  const handleInputChange1 = (e) => {
    setNewBrand(e.target.value);
  };

  const handlePriceChange = (e, setPrice) => {
    const value = e.target.value;
    // Allow only numbers and decimals, and prevent negative values
    if (/^\d*\.?\d*$/.test(value) && value >= 0) {
      setPrice(value);
    }
  };

  return (
    <form className="myform-container">
      <fieldset className="myform-fieldset">
        <legend className="myform-legend">Product Information</legend>

        <table className="myform-table">
          <tbody>
            {/* Name Row */}
            <tr>
              <td className="myform-label-cell">
                <label htmlFor="name" className="myform-label">Name:</label>
              </td>
              <td className="myform-input-cell">
                <input type="text" id="name" name="name" className="myform-input" required />
              </td>
            </tr>

            {/* Unit Row */}
            <tr>
              <td className="myform-label-cell">
                <label htmlFor="unit" className="myform-label">Unit:</label>
              </td>
              <td className="myform-input-cell">
                <select id="unit" name="unit" className="myform-input">
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </td>
            </tr>

            {/* Weight Row */}
            <tr>
              <td className="myform-label-cell">
                <label htmlFor="weight" className="myform-label">Weight:</label>
              </td>
              <td className="myform-input-cell">
                <div className="myform-weight-row">
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    className="myform-input myform-weight-input"
                  />
                  <select
                    id="weightUnit"
                    name="weightUnit"
                    className="myform-unit-select myform-weight-select"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </td>
            </tr>

            {/* Manufacturer Row */}
            <tr>
              <td className="myform-label-cell">
                <label htmlFor="manufacturer" className="myform-label">Manufacturer:</label>
              </td>
              <td className="myform-input-cell">
                <select
                  id="manufacturer"
                  name="manufacturer"
                  value={selectedManufacturer}
                  onChange={handleSelectChange}
                  className="myform-input"
                >
                  <option value="">Select a manufacturer</option>
                  <option value="manufacturer1">Manufacturer 1</option>
                  <option value="manufacturer2">Manufacturer 2</option>
                  <option value="add-new">Add new manufacturer</option>
                </select>
                {selectedManufacturer === 'add-new' && (
                  <input
                    type="text"
                    placeholder="Enter new manufacturer"
                    value={newManufacturer}
                    onChange={handleInputChange}
                    className="myform-input myform-new-entry"
                  />
                )}
              </td>
            </tr>

            {/* Brand Row */}
            <tr>
              <td className="myform-label-cell">
                <label htmlFor="brand" className="myform-label">Brand:</label>
              </td>
              <td className="myform-input-cell">
                <select
                  id="brand"
                  name="brand"
                  value={selectedBrand}
                  onChange={handleSelectChange1}
                  className="myform-input"
                >
                  <option value="">Select a brand</option>
                  <option value="brand1">Brand 1</option>
                  <option value="brand2">Brand 2</option>
                  <option value="add-new1">Add new brand</option>
                </select>
                {selectedBrand === 'add-new1' && (
                  <input
                    type="text"
                    placeholder="Enter new brand"
                    value={newBrand}
                    onChange={handleInputChange1}
                    className="myform-input myform-new-entry"
                  />
                )}
              </td>
            </tr>

            {/* Selling Price Row */}
            <tr>
              <td className="myform-label-cell">
                <label htmlFor="sellingPrice" className="myform-label">Selling Price:</label>
              </td>
              <td className="myform-input-cell">
                <input
                  type="text"
                  id="sellingPrice"
                  name="sellingPrice"
                  placeholder="Enter selling price"
                  className="myform-input"
                  required
                  value={sellingPrice}
                  onChange={(e) => handlePriceChange(e, setSellingPrice)}
                />
                <textarea
                  id="sellingPriceDescription"
                  name="sellingPriceDescription"
                  placeholder="Enter description for selling price"
                  className="myform-textarea"
                />
              </td>
            </tr>

            {/* Cost Price Row */}
            <tr>
              <td className="myform-label-cell">
                <label htmlFor="costPrice" className="myform-label">Cost Price:</label>
              </td>
              <td className="myform-input-cell">
                <input
                  type="text"
                  id="costPrice"
                  name="costPrice"
                  placeholder="Enter cost price"
                  className="myform-input"
                  required
                  value={costPrice}
                  onChange={(e) => handlePriceChange(e, setCostPrice)}
                />
                <textarea
                  id="costPriceDescription"
                  name="costPriceDescription"
                  placeholder="Enter description for cost price"
                  className="myform-textarea"
                />
              </td>
            </tr>

            {/* Action Buttons Row */}
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
  );
}

export default MyForm;
