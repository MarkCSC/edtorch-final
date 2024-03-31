import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CreateAccount.css'

const CreateAccount = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		school: '',
		grade: '',
	});

  const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false); // state for submission 
	const navigate = useNavigate(); // for redirecting user after creating account

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

		setIsSubmitting(true)

    // Validate the form data here and set errors if any
    const validationErrors = {};
    // Add validation checks here...
    // Example: Check if the username is provided
    // Check if the username is provided
		if (!formData.username.trim()) {
			validationErrors.username = 'Username is required';
		}

		// Check if the email is provided and valid
		if (!formData.email.trim()) {
			validationErrors.email = 'Email is required';
		} else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			validationErrors.email = 'Email is invalid';
		}

		// Check if the password is provided
		if (!formData.password) {
			validationErrors.password = 'Password is required';
		} else if (formData.password.length < 6) {
			validationErrors.password = 'Password must be at least 6 characters long';
		}

		// Check if the confirmPassword is provided and matches the password
		if (!formData.confirmPassword) {
			validationErrors.confirmPassword = 'Confirming password is required';
		} else if (formData.password !== formData.confirmPassword) {
			validationErrors.confirmPassword = 'Passwords do not match';
		}

		// Add other validation checks here for profile fields if necessary...
		// Check if the firstName is provided
		if (!formData.firstName || formData.firstName.trim().length === 0) {
			validationErrors.firstName = 'First name cannot be empty';
		}

		if (!formData.lastName || formData.lastName.trim().length === 0) {
			validationErrors.lastName = 'Last name cannot be empty';
		}

		if (!formData.school || formData.school.trim().length === 0) {
			validationErrors.school = 'School cannot be empty';
		}

		if (!formData.grade || formData.grade.trim().length === 0) {
			validationErrors.grade = 'Grade cannot be empty';
		}

    setErrors(validationErrors);

    // If no errors, submit the data to server or handle it accordingly
    if (Object.keys(validationErrors).length === 0) {
      
			// console.log('Form data submitted:', formData);
      // Submit logic here...

			// Define the URL where the backend expects the POST request
			const submitUrl = 'http://localhost:8000/api/user/create-user';

			// Use axios to send a POST request to your backend
			axios.post(submitUrl, formData)
				.then(response => {
					// Handle success
					console.log('Success:', response.data);

					// Display a success message (could be a toast or modal)
          alert('Account created successfully! Redirecting to login...');

          // Redirect after a delay
          setTimeout(() => {
            navigate('/login', { state: { fromCreateAccount: true } });
          }, 2000); // Delay of 2 seconds

				})
				.catch(error => {
					// Handle errors
					if (error.response && error.response.status === 409) {
						// Handle duplicate email error
						setErrors({ email: "An account with this email already exists." });
					} else {
						// Handle other errors
						setErrors({ general: "An error occurred. Please try again later." });
					}

					console.error('Error:', error.response ? error.response.data : error.message);
					// You can provide feedback to the user here, 
					// such as displaying a notification or error message

					setIsSubmitting(false)
					
				});
    } else {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="create-account-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

				<div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="school">School</label>
          <input
            type="text"
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
          />
          {errors.school && <p className="error">{errors.school}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade</label>
          <input
            type="number"
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
          />
          {errors.grade && <p className="error">{errors.grade}</p>}
        </div>
				{errors.general && <p className="error">{errors.general}</p>}
        <div className="form-group">
          <button type="submit" disabled={isSubmitting} >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;