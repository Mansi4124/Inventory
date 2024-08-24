import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AddOrganization/AddOrganization.css'
const AddOrganization = ({ setOrganizationName }) => {
    const [orgName, setOrgName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setOrganizationName(orgName); // Update the organization name in the parent component
        navigate('/'); // Redirect back to the home page or another appropriate route
    };

    return (
        <div className='add-organization'>
            <h2>Add Your Organization</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Organization Name:
                    <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Add Organization</button>
            </form>
        </div>
    );
};

export default AddOrganization;
