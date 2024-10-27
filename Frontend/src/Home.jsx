
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setAllApplications] = useState([]);
  const [applicationsSendByReviewer, setApplicationsSendByReviewer] = useState([]);
  const [approverId, setApproverId] = useState('');
  const [feedback, setFeedback] = useState(''); 

  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const headers = {
    id: localStorage.getItem('id'),
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  const token = localStorage.getItem('token');

  const handleApply = (job) => {
    {token ? (
        navigate('/apply', { state: { title: job.title, responsibilities: job.details.responsibilities } })
    ):(
        navigate('/login')
    )}
 
  };

  const jobs = [
     {
       id: 1,
       title: "Frontend Developer",
       description: "Join our team to create stunning UI/UX.",
       details: {
         responsibilities: "Develop UI, ensure responsiveness, collaborate with designers.",
         requirements: "3+ years of experience in React, CSS skills, experience with REST APIs."
       }
     },
     {
       id: 2,
       title: "Backend Developer",
       description: "Build robust server-side applications.",
       details: {
         responsibilities: "Design APIs, manage database, work with frontend team.",
         requirements: "Proficiency in Node.js, database management, REST API experience."
       }
     },
     {
       id: 3,
       title: "Full Stack Developer",
       description: "Combine frontend and backend expertise.",
       details: {
         responsibilities: "Full stack development, deployment, collaboration.",
         requirements: "React and Node.js, database knowledge, teamwork skills."
       }
     }
   ]
   const handleViewDetails = (job) => {
     setSelectedJob(selectedJob?.id === job.id ? null : job);
   };



  const fetchReviewerApplications = async () => {
    try {
      const res = await axios.get('https://job-protal-4.onrender.com/api/application/allapplication', { headers });
      setAllApplications(res.data.applications);
      console.log("reviewer", res.data)
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };


  const fetchApprover = async () => {
    const res = await axios.get('https://job-protal-4.onrender.com/api/application/getapprover');
    if (res.data.success) {
      setApproverId(res.data.approvers[0]?._id);
    }
  };

  // Send Application to Approver
  const handleSend = async (applicationId) => {
    try {
      const res = await axios.post(`https://job-protal-4.onrender.com/api/application/sendapplication/${applicationId}`, {
        approverId,
      }, { headers });
      if (res.data.success) {
        toast.success('Sent application to approver successfully');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  // Fetch Applications for Approvers
  const fetchApplicationsForApprover = async () => {
    try {
      const res = await axios.get('https://job-protal-4.onrender.com/api/application/getbyapprover', { headers });
      if (res.data.success) {
        setApplicationsSendByReviewer(res.data.application);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Reject Application with Feedback
  const handleReject = async (applicationId) => {
   if (role === "reviewer") {
    try {
        const res = await axios.post(
          `https://job-protal-4.onrender.com/api/application/review/${applicationId}`,
          { status: 'Rejected', feedback },
          { headers }
        );
        if (res.data.success) {
          toast.success('Application rejected with feedback');
          fetchReviewerApplications(); // Refresh applications after update
        }
      } catch (error) {
        toast.error('Error rejecting application');
      }
    }else{
    try {
        const res = await axios.post(
          `https://job-protal-4.onrender.com/api/application/approver/${applicationId}`,
          { status: 'Rejected' },
          { headers }
        );
        if (res.data.success) {
          toast.success('Application rejected with feedback');
          fetchReviewerApplications(); 
        }
      } catch (error) {
        toast.error('Error rejecting application');
      }
   }
  };

  // Accept Application
  const handleAccept = async (applicationId) => {
    if (role === "reviewer") {
        try {
            const res = await axios.post(
              `https://job-protal-4.onrender.com/api/application/review/${applicationId}`,
              { status: 'Under Review'},
              { headers }
            );
            if (res.data.success) {
              toast.success('Application send for approver successfully');
              fetchReviewerApplications(); // Refresh applications after update
            }
          } catch (error) {
            toast.error('Error send application');
          }
}else{
    try {
        const res = await axios.post(
          `https://job-protal-4.onrender.com/api/application/approver/${applicationId}`,
          { status: 'Accepted'},
          { headers }
        );
        if (res.data.success) {
          toast.success('Application accepted successfully');
          fetchReviewerApplications();
        }
      } catch (error) {
        toast.error('Error accepting application');
      }
}
  };

  useEffect(() => {
    if (role === 'reviewer') {
      fetchReviewerApplications();
    } else if (role === 'approver') {
      fetchApplicationsForApprover();
    }
  }, [role]);

  useEffect(() => {
    fetchApprover();
  }, []);

  return (
    <>
      {role === 'reviewer' ? (
        <div className="applications-container">
          <h1>Applications</h1>
          <div className="applications-list">
            {applications.length > 0 ? (
              applications.map((app, i) => (
                <div className="application-card" key={i}>
                  <h2>{app.jobtitle}</h2>
                  <p><strong>Responsibility:</strong> {app.responsibilites}</p>
                  <p><strong>name:</strong> {app.name}</p>
                  <p><strong>Education:</strong> {app.education}</p>
                  <p><strong>Phone:</strong> {app.phone}</p>
                  <p><strong>Experience:</strong> {app.experience}</p>
                  <p><strong>Resume:</strong> <a href={`https://job-protal-4.onrender.com${app.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                  <p><strong>Status:</strong> {app.status}</p>
                  <p><strong>Remarks:</strong> {app.remarks || 'N/A'}</p>
                  
                  <textarea 
                    rows="3" 
                    placeholder="Enter feedback here..." 
                    onChange={(e) => {
                      setFeedback(e.target.value);
                      setCurrentApplicationId(app._id); 
                    }} 
                  />
                  <div className="application-actions">
                    <button className="accept-button" onClick={() => handleSend(app._id)}>Send to Approver</button>
                    <button className="reject-button" onClick={() => handleReject(app._id)}>Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No applications available.</p>
            )}
          </div>
        </div>
      ) : role === 'approver' ? (
        <div className="applications-container">
          <h1>Applications</h1>
          <div className="applications-list">
            {applicationsSendByReviewer.length > 0 ? (
              applicationsSendByReviewer.map((application, i) => (
                <div className="application-card" key={i}>
                   <h2>{app.jobtitle}</h2>
                  <p><strong>responsibility</strong> {app.responsibilites}</p>
                  <p><strong>name:</strong> {app.name}</p>
                  <p><strong>Education:</strong> {application.education}</p>
                  <p><strong>Phone:</strong> {application.phone}</p>
                  <p><strong>Experience:</strong> {application.experience}</p>
                  <p><strong>Resume:</strong> <a href={`https://job-protal-4.onrender.com${application.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                  <p><strong>Status:</strong> {application.status}</p>
                  <div className="application-actions">
                    <button className="accept-button" onClick={() => handleAccept(application._id)}>Accept</button>
                    <button className="reject-button" onClick={() => handleReject(application._id)}>Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No applications available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="job-container">
                   <div className="job-cards">
                     {jobs.map((job) => (
                       <div className="job-card" key={job.id}>
                         <h2 className="job-title">{job.title}</h2>
                         <p className="job-description">{job.description}</p>
                         <div className="job-buttons">
                           <button className="job-button apply-button" onClick={() => handleApply(job)}>
                             Apply
                           </button>
                           <button className="job-button view-button" onClick={() => handleViewDetails(job)}>
                             {selectedJob?.id === job.id ? "Hide Details" : "View Details"}
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
    
                   {selectedJob && (
                     <div className="job-details">
                       <h3>{selectedJob.title} - Responsibilities:</h3>
                       <p>{selectedJob.details.responsibilities}</p>
                       <h3>Requirements:</h3>
                       <p>{selectedJob.details.requirements}</p>
                     </div>
                   )}
                 </div>
      )}
    </>
  );
};

export default Home;
