import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Application = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const headers = {
          id: localStorage.getItem('id'),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        const response = await axios.get(`https://job-protal-4.onrender.com/api/application/singleapplication`, { headers });
        
        // Check if applications exist
        if (response.data.applications && response.data.applications.length > 0) {
          setApplications(response.data.applications);
        } else {
          setError("No applications found");
        }
      } catch (err) {
        setError("Error fetching applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const getStatusClass = (status) => {
    if (status === 'accepted') return 'status accepted';
    if (status === 'rejected') return 'status rejected';
    return 'status pending'; // For any other status
  };

  return (
    <div className="single-application-container">
      <h2>Applications Details</h2>
      {applications.map((application) => (
        <div key={application._id} className="application-detail">
          <p><strong>Name:</strong> {application.name}</p>
          <p><strong>Job Title:</strong> {application.jobtitle}</p>
          <p><strong>Responsibilities:</strong> {application.responsibilites}</p>
          <p><strong>Education:</strong> {application.education}</p>
          <p><strong>Phone:</strong> {application.phone}</p>
          <p><strong>Experience:</strong> {application.experience}</p>
          <p><strong>Resume:</strong> <a href={`https://job-protal-4.onrender.com${application.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a></p>
          
          <div className={`status-container ${getStatusClass(application.status)}`}>
            <span className="status">states: {application.status}</span>
          </div>

          {application.feedback && (
            <div className="feedback">
              <strong>Feedback:</strong> {application.feedback}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Application;
