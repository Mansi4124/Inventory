import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../AddOrganization/Add_organization.css'; // Importing the same CSS file
import '../MyOrganization/MyOrganization.css'; // Importing the same CSS file


function MyOrganization() {
    const [organization, setOrganization] = useState({
        orgName: '',
        industry: '',
        startDate: '',
        location: '',
        currency: '',
        org_id: ''
    });
    const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode
    const navigate = useNavigate();

    useEffect(() => {
        const userId = getCookie('userId'); // Function to get user_id from cookies
        if (!userId) {
            navigate("/sign_in");  // Redirect to sign-in if not authenticated
        } else {
            fetchOrganizationData(userId);
        }
    }, []);

    const fetchOrganizationData = async (userId) => {
        try {
            const response = await axios.post("http://localhost:8000/get_organization_data/", { user_id: userId });
            if (response.data.success) {
                const orgData = response.data.org;
                setOrganization({
                    orgName: orgData.orgName,
                    industry: orgData.industry,
                    startDate: orgData.startDate,
                    location: orgData.location,
                    currency: orgData.currency,
                    org_id: orgData._id
                });
            }
        } catch (error) {
            console.error("Error fetching organization data", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrganization({ ...organization, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/update_organization/", organization);
            if (response.data.success) {
                alert("Organization updated successfully!");
                setIsEditing(false); // Switch back to view mode after saving
                fetchOrganizationData(getCookie('userId')); // Refresh the data
            }
        } catch (error) {
            console.error("Error updating organization", error);
            alert("An error occurred while updating the organization. Please try again.");
        }
    };

    return (
        <div className="myform-container">
            {!isEditing ? (
                // View mode
                <div>
                <h2>Your Organization Details</h2>
                <div className='view-org'>
                    
                   
                    <p><strong>Name:</strong> {organization.orgName}</p>
                    <p><strong>Industry:</strong> {organization.industry}</p>
                    <p><strong>Start Date:</strong> {organization.startDate}</p>
                    <p><strong>Location:</strong> {organization.location}</p>
                    <p><strong>Currency:</strong> {organization.currency}</p>
                    <button className="myform-button myform-button-save" onClick={() => setIsEditing(true)}>
                        Edit Organization
                    </button>
                    <button className="myform-button myform-button-cancel" onClick={() => navigate('/dashboard')}>
                        Go-back
                    </button>
                   
                   
                </div>
                </div>
            ) : (
                // Edit mode
                <form onSubmit={handleSubmit}>
                    <fieldset className="myform-fieldset">
                        <legend className="myform-legend">Edit Organization</legend>
                        <table className="myform-table">
                            <tbody>
                                <tr>
                                    <td className="myform-label-cell">
                                        <label htmlFor="name" className="myform-label">Organization Name:</label>
                                    </td>
                                    <td className="myform-input-cell">
                                        <input
                                            type="text"
                                            id="name"
                                            name="orgName"
                                            className="myform-input"
                                            value={organization.orgName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="myform-label-cell">
                                        <label htmlFor="industry" className="myform-label">Industry:</label>
                                    </td>
                                    <td className="myform-input-cell">
                                        <select
                                            id="industry"
                                            name="industry"
                                            className="myform-input"
                                            value={organization.industry}
                                            onChange={handleChange}
                                            required
                                        >
                                            {/* Options */}
                                            <option value="Grocery">Grocery</option>
                                            <option value="Fashion">Fashion</option>
                                            {/* Add other options */}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="myform-label-cell">
                                        <label htmlFor="date" className="myform-label">Start Date:</label>
                                    </td>
                                    <td className="myform-input-cell">
                                        <input
                                            type="date"
                                            id="date"
                                            name="startDate"
                                            className="myform-input"
                                            value={organization.startDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="myform-label-cell">
                                        <label htmlFor="loc" className="myform-label">Location:</label>
                                    </td>
                                    <td className="myform-input-cell">
                                        <input
                                            type="text"
                                            id="loc"
                                            name="location"
                                            className="myform-input"
                                            value={organization.location}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="myform-label-cell">
                                        <label htmlFor="currency" className="myform-label">Currency:</label>
                                    </td>
                                    <td className="myform-input-cell">
                                        <select
                                            id="currency"
                                            name="currency"
                                            className="myform-input"
                                            value={organization.currency}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="INR">INR</option>
                                            <option value="USD">USD</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="myform-button-cell">
                                        <button type="submit" className="myform-button myform-button-save">
                                            Save Changes
                                        </button>
                                        <button type="button" className="myform-button myform-button-cancel" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                </form>
            )}
        </div>
    );
}

// Utility function to get a cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export default MyOrganization;
