

import React, { useEffect, useState } from 'react';
import TicketCard from './TicketCard';
import './KanbanBoard.css'; 

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('status'); 
  const [sortOrder, setSortOrder] = useState('priority'); 
  const [users, setUsers] = useState([]);  
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false); // State to toggle dropdown visibility

  // Toggle dropdown visibility
  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => {
        console.log('API Data:', data);
        setTickets(data.tickets || []);  
        setUsers(data.users || []);      
      })
      .catch(error => console.error('Error fetching tickets:', error));
  }, []);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('sortOrder', sortOrder);
  }, [grouping, sortOrder]);

  const groupTickets = (tickets, grouping, users) => {
    if (!Array.isArray(tickets)) return {};

    switch (grouping) {
      case 'status':
        return tickets.reduce((acc, ticket) => {
          (acc[ticket.status] = acc[ticket.status] || []).push(ticket);
          return acc;
        }, {});
      case 'user':
        return tickets.reduce((acc, ticket) => {
          const user = users.find(u => u.id === ticket.userId);  
          const userName = user ? user.name : 'Unknown User';
          (acc[userName] = acc[userName] || []).push(ticket);
          return acc;
        }, {});
      case 'priority':
        return tickets.reduce((acc, ticket) => {
          const priority = ticket.priority;
          const priorityLabel = 
            priority === 4 ? 'Urgent' :
            priority === 3 ? 'High' :
            priority === 2 ? 'Medium' :
            priority === 1 ? 'Low' : 'No Priority';
          (acc[priorityLabel] = acc[priorityLabel] || []).push(ticket);
          return acc;
        }, {});
      default:
        return {};
    }
  };

  const sortTickets = (tickets, sortOrder) => {
    return tickets.sort((a, b) => {
      if (sortOrder === 'priority') {
        return b.priority - a.priority; 
      } else if (sortOrder === 'title') {
        return a.title.localeCompare(b.title); 
      }
      return 0;
    });
  };

  const getStatusIcon = (groupName) => {
    switch (groupName) {
      case 'Todo': return `${process.env.PUBLIC_URL}/icons/To-do.svg`;
      case 'Backlog': return `${process.env.PUBLIC_URL}/icons/Backlog.svg`;
      case 'In progress': return `${process.env.PUBLIC_URL}/icons/inprogress.svg`;
      case 'Cancelled': return `${process.env.PUBLIC_URL}/icons/Cancelled.svg`;
      case 'Done': return `${process.env.PUBLIC_URL}/icons/Done.svg`;
      default: return `${process.env.PUBLIC_URL}/icons/No-priority.svg`;
    }
  };

  const getPriorityIcon = (priority) => {
    console.log(priority)
    switch (priority) {
      case 'Urgent': return `${process.env.PUBLIC_URL}/icons/SVG - Urgent Priority colour.svg`;
      case 'High': return `${process.env.PUBLIC_URL}/icons/Img - High Priority.svg`;
      case 'Medium': return `${process.env.PUBLIC_URL}/icons/Img - Medium Priority.svg`;
      case 'Low': return `${process.env.PUBLIC_URL}/icons/Img - Low Priority.svg`;
      default: return `${process.env.PUBLIC_URL}/icons/No-priority.svg`;
    }
  };

  // Render tickets for each group
  const renderTickets = (groupedTickets) => {
    return Object.entries(groupedTickets).map(([groupName, tickets]) => (
      <div key={groupName} className="group-column">
        <div className="group-header">
             {/* Conditional rendering for the icon based on grouping type */}
                {grouping === "status" ? (
                <img src={getStatusIcon(groupName)} alt={groupName} className="group-status-icon" />
                ) : grouping === "priority" ? (
                <img src={getPriorityIcon(groupName)} alt={groupName} className="group-priority-icon" />
                ) : null}
            {/* Group title and ticket count */}
            <div className="group-header-title">
                <span className="group-title">{groupName}</span>
                <span className="group-count">({tickets.length})</span> 
            </div>
            {/* Add and 3-dot menu icons */}
            <div className="group-actions">
                <img src={`${process.env.PUBLIC_URL}/icons/add.svg`} alt="Add" className="action-icon" />
                <img src={`${process.env.PUBLIC_URL}/icons/3 dot menu.svg`} alt="Options" className="action-icon" />
            </div>
            </div>
        {/* Render TicketCard for each ticket */}
        {tickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    ));
  };

  return (
    <div className="kanban-container">
      {/* Filter Container */}
      <div className='filter-bg-color'>
      <div className="filter-container">
        <div className="filter-display" onClick={toggleFilterDropdown}>
          <img src={`${process.env.PUBLIC_URL}/icons/Display.svg`} alt="Display" className="filter-icon" />
          <span className="filter-title">Display</span>
        </div>

        {isFilterDropdownOpen && (  
          <div className="filter-dropdown">
            <div className="filter-group">
              <label>Grouping</label>
              <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div className="filter-ordering">
              <label>Ordering</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
      </div>

      <div className="kanban-board">
        {renderTickets(groupTickets(sortTickets(tickets, sortOrder), grouping, users))}
      </div>
    </div>
  );
};

export default KanbanBoard;