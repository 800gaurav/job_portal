import React, { useState } from 'react';
import './Applyjob.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Applyjob = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { title, responsibilities } = location.state || {}; 

  const [formData, setFormData] = useState({
    name: '',
    education: '', 
    phone: '',
    experience: '',
    resume: null,
    jobtitle: title || '', 
    responsibilites: responsibilities || '' 
  });

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      id: localStorage.getItem('id'),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSubmit.append(key, formData[key]);
    });

    try {
      const response = await axios.post('https://job-protal-4.onrender.com/api/application/apply', formDataToSubmit, {
        headers,
      });
      if (response.data.success) {
        alert("Application submitted successfully!");
        navigate('/'); 
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    }
  };

  return (
    <div className="application-form-container">
      <form className="application-form" onSubmit={handleSubmit}>
        <h2>Job Application Form</h2>
        
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Education:
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
          >
            <option value="">Select your education level</option>
            <option value="diploma">Diploma</option>
            <option value="bachelor's">Bachelor's</option>
            <option value="pg">PG</option>
            <option value="phd">PhD</option>
          </select>
        </label>
        
        <label>
          Phone Number:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Experience:
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Upload Resume:
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </label>
        
        <button type="submit" className="submit-button">Submit Application</button>
      </form>
    </div>
  );
};

export default Applyjob;
