'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';


const Interest = () => {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [editInterest, setEditInterest] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
  const token = user?.data?.adminToken;

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/interest/getUserInterest`, {
        headers: { 'x-access-token': token },
      });
      if (res.data.success) {
        setInterests(res.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const createInterest = async () => {
    if (!newInterest.trim()) return;
    try {
      await axios.post(`${BASE_URL}/admin/interest/createUserInterest`, {
        userInterest: newInterest,
      }, {
        headers: { 'x-access-token': token },
      });
      setNewInterest('');
      fetchInterests();
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const deleteInterest = async (id) => {
    if (!confirm("Are you sure you want to delete this interest?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/interest/deleteUserInterest/${id}`, {
        headers: { 'x-access-token': token },
      });
      fetchInterests();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEditModal = (interest) => {
    setEditInterest(interest.name);
    setEditId(interest.id);
    setShowModal(true);
  };

  const updateInterest = async () => {
    if (!editInterest.trim() || !editId) return;
    try {
      await axios.put(`${BASE_URL}/admin/interest/updateUserInterest/${editId}`, {
        userInterest: editInterest,
      }, {
        headers: { 'x-access-token': token },
      });
      setShowModal(false);
      setEditId(null);
      setEditInterest('');
      fetchInterests();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2 >User Interests</h2>

      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Add new interest"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          style={{ flex: 1, padding: 12,  marginRight: 10, borderRadius: 4, border: '#c5bdbdff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' , backgroundColor: '#f9f9f9', outline: "none" }}
        />
        <button
          onClick={createInterest}
          style={{
            padding: '8px 16px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>

      {interests.map((item) => (
        <div
          key={item.id}
          style={{
            padding: 10,
            marginBottom: 10,
            border: '1px solid #ddd',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '#c5bdbdff', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' , 
            backgroundColor: '#f9f9f9', outline: "none"
          }}
        >
          <span>{item.name}</span>
          <div>
            <button
              onClick={() => openEditModal(item)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                marginRight: 10,
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteInterest(item.id)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%',
          height: '100%', backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff', padding: 20, borderRadius: 8, minWidth: 300,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}>
            <h3>Edit Interest</h3>
            <input
              type="text"
              value={editInterest}
              onChange={(e) => setEditInterest(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                marginBottom: 10,borderRadius: 4, border: '#c5bdbdff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' , backgroundColor: '#f9f9f9', outline: "none"
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  marginRight: 10,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={updateInterest}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interest;
