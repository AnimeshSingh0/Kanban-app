import React from 'react';
import './TicketCard.css';  

const TicketCard = ({ ticket }) => {
  const { id, title, priority, status, tag } = ticket;

  // Function to get the appropriate status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Todo': return `${process.env.PUBLIC_URL}/icons/To-do.svg`;
      case 'Backlog': return `${process.env.PUBLIC_URL}/icons/Backlog.svg`;
      case 'In progress': return `${process.env.PUBLIC_URL}/icons/inprogress.svg`;
      case 'Cancelled': return `${process.env.PUBLIC_URL}/icons/Cancelled.svg`;
      case 'Done': return `${process.env.PUBLIC_URL}/icons/Done.svg`;
      default: return `${process.env.PUBLIC_URL}/icons/No-priority.svg`;
    }
  };

  // Function to get the appropriate priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 4: return `${process.env.PUBLIC_URL}/icons/SVG - Urgent Priority grey.svg`;
      case 3: return `${process.env.PUBLIC_URL}/icons/Img - High Priority.svg`;
      case 2: return `${process.env.PUBLIC_URL}/icons/Img - Medium Priority.svg`;
      case 1: return `${process.env.PUBLIC_URL}/icons/Img - Low Priority.svg`;
      default: return `${process.env.PUBLIC_URL}/icons/No-priority.svg`;
    }
  };

  return (
    <div className="ticket-card">
      {/* Ticket ID on the top left */}
      <p className="ticket-id">{id}</p>

      {/* Status icon and title */}
      <div className="ticket-title-container">
        <img src={getStatusIcon(status)} alt={status} className="status-icon" />
        <h4 className="ticket-title">{title}</h4>
      </div>

      {/* Priority icon and tag */}
      <div className="ticket-meta">
        <img src={getPriorityIcon(priority)} alt={`Priority ${priority}`} className="priority-icon" />
        {tag && <span className="ticket-tag">{tag}</span>}
      </div>
    </div>
  );
};

export default TicketCard;
