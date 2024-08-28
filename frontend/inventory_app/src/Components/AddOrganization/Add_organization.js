import React, { useEffect, useState } from 'react';
import '../AddOrganization/Add_organization.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Add_organization() {

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);

    useEffect(() => {
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

        const fetchData = getCookie('userId')

        if (!fetchData) {
            navigate("/sign_in")
        } else {
            setUserId(fetchData.toString())
        }
    }, []);

    const [org, setOrg] = useState({
        orgName: "",
        industry: "Grocery",
        startDate: formattedDate,
        location: "",
        currency: "INR"
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        org['org_user_id'] = userId
        setOrg({ ...org, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8000/add_organization/", org)
        navigate('/dashboard');
    };

    return (
        <form className="myform-container">
            <fieldset className="myform-fieldset">
                <legend className="myform-legend">Organization Details</legend>

                <table className="myform-table">
                    <tbody>
                        <tr>
                            <td className="myform-label-cell">
                                <label htmlFor="name" className="myform-label" >Organization Name:</label>

                            </td>
                            <td className="myform-input-cell">
                                <input type="text" id="name" name="orgName" className="myform-input" value={org.orgName}
                                    onChange={changeHandler} required />
                            </td>
                        </tr>

                        <tr>
                            <td className="myform-label-cell">
                                <label htmlFor="industry" className="myform-label">Industry:</label>
                            </td>
                            <td className="myform-input-cell">
                                <select id="industry" name="industry" className="myform-input" value={org.industry} onChange={changeHandler}>
                                    <option value="Grocery" selected>Grocery</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Education">Education</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Automotive">Automotive</option>
                                    <option value="Telecommunications">Telecommunications</option>
                                    <option value="Energy">Energy</option>
                                    <option value="Hospitality">Hospitality</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Transport and Logistics">Transport and Logistics</option>
                                    <option value="Legal">Legal</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                                    <option value="Non-Profit">Non-Profit</option>
                                    <option value="Consulting">Consulting</option>
                                    <option value="Media">Media</option>
                                </select>

                            </td>
                        </tr>

                        <tr>
                            <td className="myform-label-cell">
                                <label htmlFor="date" className="myform-label">Start Date:</label>
                            </td>
                            <td className="myform-input-cell">
                                <input type="text" id="date" name="startDate" className="myform-input" value={org.startDate} required />
                            </td>
                        </tr>

                        <tr>
                            <td className="myform-label-cell">
                                <label htmlFor="loc" className="myform-label">Location:</label>
                            </td>
                            <td className="myform-input-cell">
                                <input type="text" id="loc" name="location" className="myform-input" value={org.location} onChange={changeHandler} required />
                            </td>
                        </tr>
                        <tr>
                            <td className="myform-label-cell">
                                <label htmlFor="currency" className="myform-label" >Currency:</label>
                            </td>
                            <td className="myform-input-cell">
                                <select id="currency" name="currency" className="myform-input" value={org.currency} onChange={changeHandler}>
                                    <option value="INR" selected>INR</option>
                                    <option value="USD">USD</option>
                                </select>

                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="myform-button-cell">
                                <button type="submit" className="myform-button myform-button-save" onClick={handleSubmit}>
                                    Get-Started
                                </button>
                                <button type="button" className="myform-button myform-button-cancel">
                                    Go-back
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </fieldset>
        </form>
    );
}

export default Add_organization;
