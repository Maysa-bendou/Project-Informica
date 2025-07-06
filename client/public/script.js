const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB (adjust URL if you're using MongoDB Atlas)
mongoose.connect('mongodb+srv://cedra:<db_password>@cluster1.asir4uv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Schema
const FormationSchema = new mongoose.Schema({
  category: String,
  formations: [
    {
      title: String,
      items: [String],
    },
  ],
});

// Model
const Formation = mongoose.model('Formation', FormationSchema);

// View engine setup
app.set('view engine', 'ejs');

// Serve static files like CSS/images from "public" folder
app.use(express.static('public'));

// Show category page when user clicks
app.get('/formations/:category', async (req, res) => {
  const category = req.params.category.toLowerCase(); // e.g. 'informatique'
  const data = await Formation.findOne({ category: category });

  if (!data) {
    return res.send('No formations found for this category.');
  }

  res.render('formations', { data });
});

// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
