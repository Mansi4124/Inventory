import React, { useState } from 'react';
import '../ItemForm/ItemForm.css'
function ItemForm() {
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [newBrand, setNewBrand] = useState('');

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

  return (
    <form className='form'>
      <fieldset style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', margin: '0 auto', maxWidth: '1200px' }}>
        <legend style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>Product Information</legend>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {/* Name Row */}
            <tr>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <label htmlFor="name" style={{ display: 'block', fontWeight: 'bold' }}>Name:</label>
              </td>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <input type="text" id="name" name="name" style={{ width: '195%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} required />
              </td>
            </tr>

            {/* Unit Row */}
            <tr>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <label htmlFor="unit" style={{ display: 'block', fontWeight: 'bold' }}>Unit:</label>
              </td>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <select id="unit" name="unit" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </td>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <label htmlFor="weight" style={{ display: 'block', fontWeight: 'bold' }}>Weight:</label>
              </td>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <input type="text" id="weight" name="weight" style={{ width: 'calc(100% - 80px)', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }} />
                <select id="weightUnit" name="weightUnit" style={{ width: '70px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </td>
            </tr>

            {/* Weight Row */}
            <tr>
              
            </tr>

            {/* Manufacturer Row */}
            <tr>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <label htmlFor="manufacturer" style={{ display: 'block', fontWeight: 'bold' }}>Manufacturer:</label>
              </td>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <select
                  id="manufacturer"
                  name="manufacturer"
                  value={selectedManufacturer}
                  onChange={handleSelectChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
                    style={{ marginTop: '10px', display: 'block', width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                )}
              </td>
            </tr>

            {/* Brand Row */}
            <tr>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <label htmlFor="brand" style={{ display: 'block', fontWeight: 'bold' }}>Brand:</label>
              </td>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <select
                  id="brand"
                  name="brand"
                  value={selectedBrand}
                  onChange={handleSelectChange1}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
                    style={{ marginTop: '10px', display: 'block', width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                )}
              </td>
            </tr>

            {/* Selling Price Row */}
            <tr>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <label htmlFor="sellingPrice" style={{ display: 'block', fontWeight: 'bold' }}>Selling Price:</label>
              </td>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <input
                  type="text"
                  id="sellingPrice"
                  name="sellingPrice"
                  placeholder="Enter selling price"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  required
                />
                <textarea
                  id="sellingPriceDescription"
                  name="sellingPriceDescription"
                  placeholder="Enter description for selling price"
                  style={{ marginTop: '10px', width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }}
                />
              </td>
            </tr>

            {/* Cost Price Row */}
            <tr>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <label htmlFor="costPrice" style={{ display: 'block', fontWeight: 'bold' }}>Cost Price:</label>
              </td>
              <td style={{ padding: '10px', verticalAlign: 'top' }}>
                <input
                  type="text"
                  id="costPrice"
                  name="costPrice"
                  placeholder="Enter cost price"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  required
                />
                <textarea
                  id="costPriceDescription"
                  name="costPriceDescription"
                  placeholder="Enter description for cost price"
                  style={{ marginTop: '10px', width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }}
                />
              </td>
            </tr>

            {/* Action Buttons Row */}
            <tr>
              <td colSpan="2" style={{ padding: '10px', textAlign: 'right' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginRight: '10px',
                    borderRadius: '4px',
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
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

export default ItemForm;
