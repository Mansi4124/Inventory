import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
    const [profile, setProfile] = useState({
        fname: "",
        lname: "",
        email: "",
    });
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const userId = getCookie("userId");
        if (!userId) {
            navigate("/sign_in");
        } else {
            fetchProfileData(userId);
        }
    }, []);

    const fetchProfileData = async (userId) => {
        try {
            const res = await axios.post("http://localhost:8000/get_profile/", { user_id: userId });
            if (res.data.success) {
                setProfile(res.data.user);
            } else {
                setFormErrors({ message: "Unable to fetch profile data." });
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setFormErrors({ message: "An error occurred. Please try again." });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in profile) {
            setProfile({ ...profile, [name]: value });
        } else {
            setPasswords({ ...passwords, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const profileData = {
                ...profile,
                user_id: getCookie("userId"),
                old_password: passwords.oldPassword,
                new_password: passwords.newPassword,
                confirm_password: passwords.confirmPassword,
            };

            const profileRes = await axios.post("http://localhost:8000/update_profile/", profileData);
            if (profileRes.data.success) {
                setIsEditing(false);
                alert("Profile updated successfully!");
                setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setFormErrors({});
            } else {
                setFormErrors(profileRes.data);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setFormErrors({
                message: error.response ? error.response.data.message : "An error occurred. Please try again.",
            });
        }
    };

    return (
        <div className="myform-container">
            {!isEditing ? (
                <div>
                    <h2>Your Profile Details</h2>
                    <div className="view-profile">
                        <p><strong>First Name:</strong> {profile.fname}</p>
                        <p><strong>Last Name:</strong> {profile.lname}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <button className="myform-button myform-button-save" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                        <button className="myform-button myform-button-cancel" onClick={() => navigate('/dashboard')}>
                            Go-back
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <fieldset className="myform-fieldset">
                        <legend className="myform-legend">Edit Profile</legend>
                        <table className="myform-table">
                            <tbody>
                                <tr>
                                    <td className="myform-label-cell">
                                        <label htmlFor="fname" className="myform-label">First Name:</label>
                                    </td>
                                    <td className="myform-input-cell">
                                        <input
                                            type="text"
                                            id="fname"
                                            name="fname"
                                            className="myform-input"
                                            value={profile.fname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="myform-label-cell">
                                        <label htmlFor="lname" className="myform-label">Last Name:</label>
                                    </td>
                                    <td className="myform-input-cell">
                                        <input
                                            type="text"
                                            id="lname"
                                            name="lname"
                                            className="myform-input"
                                            value={profile.lname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="myform-label-cell">
                                        <label htmlFor="email" className="myform-label">Email:</label>
                                    </td>
                                    <td className="myform-input-cell">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="myform-input"
                                            value={profile.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>

                                {isEditing && (
                                    <>
                                        <tr>
                                            <td className="myform-label-cell">
                                                <label htmlFor="oldPassword" className="myform-label">Old Password:</label>
                                            </td>
                                            <td className="myform-input-cell">
                                                <input
                                                    type="password"
                                                    id="oldPassword"
                                                    name="oldPassword"
                                                    className="myform-input"
                                                    value={passwords.oldPassword}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="myform-label-cell">
                                                <label htmlFor="newPassword" className="myform-label">New Password:</label>
                                            </td>
                                            <td className="myform-input-cell">
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    className="myform-input"
                                                    value={passwords.newPassword}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="myform-label-cell">
                                                <label htmlFor="confirmPassword" className="myform-label">Confirm New Password:</label>
                                            </td>
                                            <td className="myform-input-cell">
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    className="myform-input"
                                                    value={passwords.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                    </>
                                )}

                                <tr>
                                    <td colSpan="2" className="myform-button-cell">
                                        {formErrors.message && <p className="error">{formErrors.message}</p>}
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
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export default Profile;