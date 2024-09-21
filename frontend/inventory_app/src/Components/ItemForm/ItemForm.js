import React, { useState, useEffect } from 'react';
import '../ItemForm/Item_form.css';
import axios from 'axios';

function MyForm() {
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('g');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handlePriceChange = (e, setPrice) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) && value >= 0) {
      setPrice(value);
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

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = getCookie('userId');

    const data = {
      'user_id': userId,
      'product_details': {
        'product_name': name,
        'category': category,
        'weight': weight,
        'unit': weightUnit,
        'selling_price': parseInt(sellingPrice),
        'cost_price': parseInt(costPrice),
        'profit_margin': sellingPrice - costPrice,
        'remaining_stock': 0,
        'bought_quantity': 0,
        'sold_quantity': 0,
        'invested_amount': 0,
        'profit_amount': 0,
      }
    }

    const res = await axios.post("http://localhost:8000/add_item/", data);

    if (res.data.success === false) {
      setError(res.data.error)
    } else {
      setError('')
      setSellingPrice('');
      setCostPrice('');
      setName('');
      setWeight('');
      setCategory('');
      alert('Form submitted!');
    }
  }

  return (
    <section id="itemform" className="itemform-section">
      <div className="itemform-container">
    <form className="myform-container" onSubmit={handleSave}>
      <fieldset className="myform-fieldset">
        <legend className="myform-legend">Product Information</legend>

        <table className="myform-table">
          <tbody>
            {/* Name Row */}
            <tr>
              <td className="myform-label-cell">
                <label htmlFor="name" className="myform-label" >Name:</label>
              </td>
              <td className="myform-input-cell">
                <input type="text" id="name" name="name" className="myform-input" value={name} onChange={(e) => setName(e.target.value)} required />
                {error !== "" && <p style={{color:'red'}}>{error}</p>}
              </td>
            </tr>

            <tr>
              <td className="myform-label-cell">
                <label htmlFor="name" className="myform-label">Category:</label>
              </td>
              <td className="myform-input-cell">
                <input type="text" id="name" name="name" className="myform-input" value={category} onChange={(e) => setCategory(e.target.value)} required />
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
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="myform-input myform-weight-input"
                  />
                  <select
                    id="weightUnit"
                    name="weightUnit"
                    className="myform-unit-select myform-weight-select"
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
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
                <button type="submit" className="myform-button myform-button-save" >
                  Save
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

export default MyForm;