'use client';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import { max } from 'moment';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, IconButton,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomizerContext } from '@/app/context/customizerContext';



const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Event Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    eventAddress: '',
    eventStates: '',
    eventCity: '',
    eventCountry: '',
    image: null,
  });

  // Update Event Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateEventId, setUpdateEventId] = useState(null);
  const [updateEventData, setUpdateEventData] = useState({ ...newEvent });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [viewEvent, setViewEvent] = useState(null); // to show single event
  const [feedback, setFeedback] = useState({ message: '', success: true, open: false });
    const { activeMode } = useContext(CustomizerContext);
  
    const backgroundColor = activeMode === 'dark' ? '#1e1e2f' : '#ffffff';
    const textColor = activeMode === 'dark' ? '#ffffff' : '#000000';
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedEvents = events.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );




  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
  const token = user?.data?.adminToken;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/event/showAllEvents`, {
        headers: { 'x-access-token': token },
      });
      if (res.data.success) setEvents(res.data.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      const formData = new FormData();
      formData.append('eventName', newEvent.eventName);
      formData.append('eventDescription', newEvent.eventDescription);
      const isoDateTime = new Date(`${newEvent.eventDate}T${newEvent.eventTime}`).toISOString();
      formData.append('eventDateAndTime', isoDateTime);
      formData.append('eventAddress', newEvent.eventAddress);
      formData.append('eventStates', newEvent.eventStates);
      formData.append('eventCity', newEvent.eventCity);
      formData.append('eventCountry', newEvent.eventCountry);
      if (newEvent.image) formData.append('image', newEvent.image);

      await axios.post(`${BASE_URL}/admin/event/createEvent`, formData, {
        headers: {
          'x-access-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowAddModal(false);
      setNewEvent({ ...newEvent, image: null });
      fetchEvents();
      setFeedback({ message: 'Event created successfully!', success: true, open: true });

    } catch (error) {
      console.error('Failed to add event:', error);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to create Event',
        success: false,
        open: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${BASE_URL}/admin/event/deleteEvent/${id}`, {
        headers: { 'x-access-token': token },
      });
      fetchEvents();
      setFeedback({ message: 'Event Deleted successfully!', success: true, open: true });
    } catch (error) {
      console.error('Delete failed:', error);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to Delete Event',
        success: false,
        open: true,
      });
    }
  };

  const openUpdateModal = (event) => {
    const [date, time] = event.eventDateAndTime.split('T');
    setUpdateEventId(event.id);
    setUpdateEventData({
      ...event,
      eventDate: date,
      eventTime: time.slice(0, 5),
      image: null,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append('eventName', updateEventData.eventName);
      formData.append('eventDescription', updateEventData.eventDescription);
      const isoDateTime = new Date(`${updateEventData.eventDate}T${updateEventData.eventTime}`).toISOString();
      formData.append('eventDateAndTime', isoDateTime);
      formData.append('eventAddress', updateEventData.eventAddress);
      formData.append('eventStates', updateEventData.eventStates);
      formData.append('eventCity', updateEventData.eventCity);
      formData.append('eventCountry', updateEventData.eventCountry);
      if (updateEventData.image) formData.append('image', updateEventData.image);

      await axios.put(`${BASE_URL}/admin/event/updateEvent/${updateEventId}`, formData, {
        headers: {
          'x-access-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowUpdateModal(false);
      fetchEvents();
      setFeedback({ message: 'Event updated successfully!', success: true, open: true });

      
    } catch (error) {
      console.error('Update failed:', error);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to update Event',
        success: false,
        open: true,
      });
    }
  };

  console.log('updateEventData:', updateEventData.image);
  console.log('newEvent:', newEvent.image);

  const renderInput = (stateObj, setState, key, type = 'text') => (
    <input
      type={type}
      placeholder={key}
      value={stateObj[key]}
      onChange={(e) => setState({ ...stateObj, [key]: e.target.value })}
      style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 4, border: '#c5bdbdff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', outline: 'none' }}
    />
  );

  const modalStyle = {
  position: 'fixed', top: 20, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const modalContent = {
  backgroundColor: backgroundColor, padding: 20, borderRadius: 8, minWidth: 300,
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)', maxWidth: 600
};

const cancelBtn = {
  marginRight: 10, padding: '8px 12px', borderRadius: 4, backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer',
};

const saveBtn = {
  padding: '8px 12px', borderRadius: 4, backgroundColor: '#28a745', color: 'white', border: 'none'
};

const styles = {
  cardGrid: {
    maxWidth: '800px',
    margin: 'auto',
  },
  card: {
    backgroundColor: backgroundColor,
    padding: '20px',
    paddingBottom: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
    transition: 'transform 0.2s',
    maxWidth: '100%',
  },
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
    transition: 'transform 0.3s ease-in-out',
  },
  title: {
    margin: '30px 0',
    fontSize: '40px',
    fontWeight: 600,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  updateBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};


  return (
    <div style={{ margin: 'auto', maxWidth: '950px'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
        <h1>Event Management</h1>
      <button
        onClick={() => setShowAddModal(true)}
        className='addBtn'
        style={{ maxHeight: '40px', marginTop:'10px' }}
      >
        Add Event
      </button>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        {!viewEvent ? (
  <>
    <TableContainer
  component={Paper}
  sx={{
    mt: 2,
    maxWidth: '950px',
    margin: 'auto',
    boxShadow: '0 2px 4px rgba(0,0,0,0.7)',
  }}
>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell><strong>Name</strong></TableCell>
        <TableCell><strong>Image</strong></TableCell>
        <TableCell><strong>Country</strong></TableCell>
        <TableCell><strong>Address</strong></TableCell>
        <TableCell align="right"><strong>Actions</strong></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {events
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.eventName}</TableCell>
            <TableCell>
              <img
                src={event.image}
                alt="event"
                style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }}
              />
            </TableCell>
            <TableCell>{event.eventCountry}</TableCell>
            <TableCell>
              {event.eventStates}, {event.eventCity}, {event.eventAddress}
            </TableCell>
            <TableCell align="right">
              <IconButton onClick={() => setViewEvent(event)} color="primary">
                <VisibilityIcon />
              </IconButton>
              <IconButton onClick={() => openUpdateModal(event)} color="secondary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(event.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
  <TablePagination
    component="div"
    count={events.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[4, 10, 15, 20, 50, 100]}
  />
</TableContainer>
  </>
) : (
  <div style={styles.cardGrid}>
    <div key={viewEvent.id} style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p><b>Date:</b> {new Date(viewEvent.eventDateAndTime).toLocaleDateString('en-US')}</p>
        <p><b>Time:</b> {new Date(viewEvent.eventDateAndTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div style={styles.imageWrapper}>
        <img
          src={viewEvent.image}
          alt="event"
          style={styles.image}
        />
      </div>

      <h1 style={styles.title}>{viewEvent.eventName}</h1>
      <p>{viewEvent.eventDescription}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <div>
          <p><b>Country:</b> {viewEvent.eventCountry}</p>
      <p><b>City:</b> {viewEvent.eventCity}</p>

        </div>
        <div>
          <p><b>State:</b> {viewEvent.eventStates}</p>
      <p><b>Address:</b> {viewEvent.eventAddress}</p>
        </div>
      </div>
      
      <div style={styles.buttonGroup}>
        {/* <button onClick={() => openUpdateModal(viewEvent)} className='updateBtn'>Edit</button>
        <button onClick={() => handleDelete(viewEvent.id)} className='deleteBtn'>Delete</button> */}
        <button onClick={() => setViewEvent(null)} className='canclenbtn'>Back to Table</button>
      </div>
    </div>
  </div>
)}

        </>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h3>Add Event</h3>
            {renderInput(newEvent, setNewEvent, 'eventName')}
            {renderInput(newEvent, setNewEvent, 'eventDescription')}
            {renderInput(newEvent, setNewEvent, 'eventDate', 'date')}
            {renderInput(newEvent, setNewEvent, 'eventTime', 'time')}
            {renderInput(newEvent, setNewEvent, 'eventAddress')}
            {renderInput(newEvent, setNewEvent, 'eventStates')}
            {renderInput(newEvent, setNewEvent, 'eventCity')}
            {renderInput(newEvent, setNewEvent, 'eventCountry')}
            <input type="file" onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })} />
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddModal(false)} style={cancelBtn}>Cancel</button>
              <button onClick={handleAddEvent} className='addBtn'>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Event Modal */}
      {showUpdateModal && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h3>Update Event</h3>
            {renderInput(updateEventData, setUpdateEventData, 'eventName')}
            {renderInput(updateEventData, setUpdateEventData, 'eventDescription')}
            {renderInput(updateEventData, setUpdateEventData, 'eventDate', 'date')}
            {renderInput(updateEventData, setUpdateEventData, 'eventTime', 'time')}
            {renderInput(updateEventData, setUpdateEventData, 'eventAddress')}
            {renderInput(updateEventData, setUpdateEventData, 'eventStates')}
            {renderInput(updateEventData, setUpdateEventData, 'eventCity')}
            {renderInput(updateEventData, setUpdateEventData, 'eventCountry')}
            <input type="file" onChange={(e) => setUpdateEventData({ ...updateEventData, image: e.target.files[0] })} />
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowUpdateModal(false)} style={cancelBtn}>Cancel</button>
              <button className='updateBtn' onClick={handleUpdateEvent}>Update</button>
            </div>
          </div>
        </div>
      )}
      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={feedback.success ? 'success' : 'error'}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Events;



