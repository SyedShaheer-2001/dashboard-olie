'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from '@/utils/api';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", isCorrect: false }]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
  const token = user?.data?.adminToken;

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/content/showFaqs`, {
        headers: { 'x-access-token': token },
      });
      if (res.data.success) {
        setFaqs(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    if (field === "isCorrect") {
      updatedOptions.forEach((opt, i) => {
        updatedOptions[i].isCorrect = i === index;
      });
    } else {
      updatedOptions[index][field] = value;
    }
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const removeOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const resetForm = () => {
    setQuestion("");
    setOptions([{ text: "", isCorrect: false }]);
    setEditId(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/admin/content/updateFaqs/${editId}`, {
          question,
          options,
        }, {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        });
        setMessage("✅ Question updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/admin/content/createFaqs`, {
          question,
          options,
        }, {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        });
        setMessage("✅ Question created successfully!");
      }
      resetForm();
      setShowForm(false); // Close modal
      fetchFaqs();
    } catch (error) {
      console.error("Error saving question:", error);
      setMessage("❌ An error occurred.");
    }
  };

  const handleEdit = (faq) => {
    setQuestion(faq.question);
    setOptions(faq.Option.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })));
    setEditId(faq.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/content/deleteFaqs/${id}`, {
        headers: { 'x-access-token': token },
      });
      setMessage("Question deleted.");
      fetchFaqs();
    } catch (error) {
      console.error("Failed to delete:", error);
      setMessage("❌ Delete failed.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800,  }}>
      <h2>FAQ</h2>

      {loading ? (
        <p>Loading FAQs...</p>
      ) : (
        <div>
          {faqs.map((faq) => (
            <div key={faq.id} style={{ marginBottom: 20, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
              <strong>Q:</strong> {faq.question}
              <ul>
                {faq.Option.map((opt) => (
                  <li key={opt.id}>
                    {opt.text} {opt.isCorrect && <strong>(✔ Correct)</strong>}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleEdit(faq)}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#424242';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'black';
                }}
              > Edit</button>
              <button onClick={() => handleDelete(faq.id)} style={{
                marginLeft: 10,
                backgroundColor: 'red',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#d91717';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'red';
                }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        style={{
          marginTop: 10,
          backgroundColor: '#027951',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#0e6d0eff';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor =  '#027951';
                }}
      >
        Add Question
      </button>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <form onSubmit={handleCreateOrUpdate}>
              <h3>{editId ? "Update Question" : "Add Question"}</h3>

              <div>
                <label className="mb-16">Question:</label><br />
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  style={{ width: "100%", padding: 8, marginBottom: 10 , borderRadius: 4, border: '#c5bdbdff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' , backgroundColor: '#f9f9f9', outline: "none", padding: 12 }}
                />
              </div>

              <h4>Options:</h4>
              {options.map((option, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(index, "text", e.target.value)
                    }
                    required
                    style={{ width: "60%", marginRight: 10 , borderRadius: 4, border: '#c5bdbdff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' , backgroundColor: '#f9f9f9', outline: "none", padding: 10 }}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() =>
                        handleOptionChange(index, "isCorrect", !option.isCorrect)
                      }
                    />{" "}
                    Correct
                  </label>
                  {options.length > 1 && (
                    <button type="button" onClick={() => removeOption(index)}>
                      ❌
                    </button>
                  )}
                </div>
              ))}

              <button type="button" onClick={addOption}
              style={{
                backgroundColor: '#44d7f1ff',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
                Add Option
              </button>

              <br /><br />
              <button type="submit"
                style={{
                  marginRight: 10,
                  backgroundColor: editId ? '#268fe6' : 'green',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = editId ? '#0981b9ff' : '#006400';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = editId ? '#268fe6' : 'green';
                }}
              >{editId ? " Update" : " Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                marginLeft: 10,
                backgroundColor: 'red',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#d91717';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'red';
                }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* {message && <p style={{ marginTop: 20 }}>{message}</p>} */}

      {/* Modal Styles */}
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .modal {
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default FAQ;
