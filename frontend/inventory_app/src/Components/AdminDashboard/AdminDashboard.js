import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [queries, setQueries] = useState([]);
  const [repliedQueries, setRepliedQueries] = useState([]);
  const [reply, setReply] = useState({});
  const [activeTab, setActiveTab] = useState('clientQueries'); // State to manage the active tab
  const [notification, setNotification] = useState(''); // State for notification

  useEffect(() => {
    // Fetch all contact queries
    const fetchQueries = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get_contact_queries/');
        if (response.data.success) {
          const allQueries = response.data.queries;
          const nonReplied = allQueries.filter(query => !query.reply_sent);
          const replied = allQueries.filter(query => query.reply_sent);

          setQueries(nonReplied);
          setRepliedQueries(replied);
        }
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };

    fetchQueries();
  }, []);

  const handleReplyChange = (email, value) => {
    setReply({
      ...reply,
      [email]: value,
    });
  };

  const sendReply = (email, message) => {
    // Find the contact_id to update the status after sending the reply
    const contact = queries.find(query => query.email === email);
    const contactId = contact?._id;
  
    console.log('Sending reply:', { email, message, contactId }); // Debugging line
  
    axios.post('http://localhost:8000/send_email/', { email, message, contact_id: contactId })
      .then((response) => {
        console.log('Server response:', response.data);
        
        // Check if the response indicates success
        if (response.data.success) {
          // Update states: move the query from non-replied to replied
          const updatedQueries = queries.filter(query => query.email !== email);
          const updatedRepliedQueries = [
            ...repliedQueries,
            {
              ...contact,
              reply: message,
              reply_sent: true
            }
          ];
  
          setQueries(updatedQueries);
          setRepliedQueries(updatedRepliedQueries);
          setReply(prevReply => {
            const updatedReply = { ...prevReply };
            delete updatedReply[email];
            return updatedReply;
          });
  
          // Set notification
          setNotification('Reply sent successfully!');
          setTimeout(() => {
            setNotification('');
          }, 3000); // Hide notification after 3 seconds
        } else {
          console.error('Failed to send reply:', response.data.message); // Error message from backend
        }
      })
      .catch((error) => {
        console.error('Error sending reply:', error);
      });
  };
  

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Queries Of Clients</h1>
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'clientQueries' ? 'active' : ''}`} 
          onClick={() => setActiveTab('clientQueries')}
        >
          Client Queries
        </button>
        <button 
          className={`tab-button ${activeTab === 'pastReplies' ? 'active' : ''}`} 
          onClick={() => setActiveTab('pastReplies')}
        >
          Past Replies
        </button>
      </div>
      <div className="queries-container">
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
        {activeTab === 'clientQueries' && (
          <>
            {queries.length === 0 ? (
              <p>No new queries</p>
            ) : (
              queries.map((query) => (
                <div key={query._id} className="query-card">
                  <h3>{query.fullName}</h3>
                  <p><strong>Email:</strong> {query.email}</p>
                  <p><strong>Messages:</strong></p>
                  <ul>
                    <li>{query.message}</li>
                  </ul>

                  <textarea
                    placeholder="Write your reply"
                    value={reply[query.email] || ''}
                    onChange={(e) => handleReplyChange(query.email, e.target.value)}
                  />
                  <button
                    onClick={() => sendReply(query.email, reply[query.email] || '')}
                    className="reply-button"
                  >
                    Send Reply
                  </button>
                </div>
              ))
            )}
          </>
        )}
        {activeTab === 'pastReplies' && (
          <>
            {repliedQueries.length === 0 ? (
              <p>No replied queries</p>
            ) : (
              repliedQueries.map((query) => (
                <div key={query._id} className="query-card">
                  <h3>{query.fullName}</h3>
                  <p><strong>Email:</strong> {query.email}</p>
                  <p><strong>Messages:</strong></p>
                  <ul>
                    <li>{query.message}</li>
                  </ul>
                  <p><strong>Reply:</strong></p>
                  <p>{query.reply}</p> {/* Displaying the reply */}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
