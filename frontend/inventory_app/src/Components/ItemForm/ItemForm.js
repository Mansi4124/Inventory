import React, { useState, useEffect } from 'react';
import '../ItemForm/Item_form.css';

function MyForm() {
  const [manufacturers, setManufacturers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');

  // Load manufacturers and brands from localStorage on component mount
  useEffect(() => {
    const storedManufacturers = localStorage.getItem('manufacturers');
    const storedBrands = localStorage.getItem('brands');
    if (storedManufacturers) {
      setManufacturers(JSON.parse(storedManufacturers));
    } else {
      setManufacturers(['Manufacturer 1', 'Manufacturer 2']);
    }
    if (storedBrands) {
      setBrands(JSON.parse(storedBrands));
    } else {
      setBrands(['Brand 1', 'Brand 2']);
    }
  }, []);

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
    if (/^\d*\.?\d*$/.test(value) && value >= 0) {
      setPrice(value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (newManufacturer && !manufacturers.includes(newManufacturer)) {
      const updatedManufacturers = [...manufacturers, newManufacturer];
      setManufacturers(updatedManufacturers);
      localStorage.setItem('manufacturers', JSON.stringify(updatedManufacturers));
    }

    if (newBrand && !brands.includes(newBrand)) {
      const updatedBrands = [...brands, newBrand];
      setBrands(updatedBrands);
      localStorage.setItem('brands', JSON.stringify(updatedBrands));
    }

    // Reset form fields
    setSelectedManufacturer('');
    setNewManufacturer('');
    setSelectedBrand('');
    setNewBrand('');
    setSellingPrice('');
    setCostPrice('');

    alert('Form submitted!');
  };

  return (
    <form className="myform-container" onSubmit={handleFormSubmit}>
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

            <tr>
              <td className="myform-label-cell">
                <label htmlFor="name" className="myform-label">Category:</label>
              </td>
              <td className="myform-input-cell">
                <input type="text" id="name" name="name" className="myform-input" required />
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
                    <option value="mg">mg</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                    <option value="t">t</option>
                    <option value="MT">MT</option>
                    <option value="st">st</option>
                    <option value="ct">ct</option>
                    <option value="µg">µg</option>
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
                  {manufacturers.map((manufacturer, index) => (
                    <option key={index} value={manufacturer}>
                      {manufacturer}
                    </option>
                  ))}
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
                  {brands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
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
