const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define the note schema
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Define the Note model
const Note = mongoose.model('Note', noteSchema);

// Create a note
app.post('/notes', async (req, res) => {
  const { title, content } = req.body;

  try {
    const insertedNote = await Note.create({ title, content });
    res.json(insertedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    console.error('Error retrieving notes:', error);
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

// Get a single note
app.get('/notes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json(note);
    }
  } catch (error) {
    console.error('Error retrieving note:', error);
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
});

// Update a note
app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });

    if (!updatedNote) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json(updatedNote);
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json(deletedNote);
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
