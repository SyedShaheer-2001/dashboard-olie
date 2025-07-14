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
  const [editId, setEditId] = useState(null); // <-- For editing

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
    setShowForm(false);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        await axios.put(`${BASE_URL}/admin/content/updateFaqs/${editId}`, {
          question,
          options,
        }, {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        });
        setMessage("? Question updated successfully!");
      } else {
        // Create
        await axios.post(`${BASE_URL}/admin/content/createFaqs`, {
          question,
          options,
        }, {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        });
        setMessage("? Question created successfully!");
      }
      resetForm();
      fetchFaqs();
    } catch (error) {
      console.error("Error saving question:", error);
      setMessage("? An error occurred.");
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
      setMessage("??? Question deleted.");
      fetchFaqs();
    } catch (error) {
      console.error("Failed to delete:", error);
      setMessage("? Delete failed.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
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
                    {opt.text} {opt.isCorrect && <strong>(? Correct)</strong>}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleEdit(faq)}>?? Edit</button>
              <button onClick={() => handleDelete(faq.id)} style={{ marginLeft: 10, color: "red" }}>
                ??? Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => {
        setShowForm(!showForm);
        resetForm();
      }} style={{ marginTop: 20 }}>
        {showForm ? "Cancel" : "? Add Question"}
      </button>

      {showForm && (
        <form onSubmit={handleCreateOrUpdate} style={{ marginTop: 20 }}>
          <div>
            <label>Question:</label><br />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
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
                style={{ width: "60%", marginRight: 10 }}
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
                  ?
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addOption}>
            ? Add Option
          </button>

          <br /><br />
          <button type="submit">{editId ? "? Update Question" : "? Create Question"}</button>
        </form>
      )}

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
};

export default FAQ;
