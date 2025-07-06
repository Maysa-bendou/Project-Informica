const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/formationdb');

const FormationSchema = new mongoose.Schema({
  category: String,
  formations: [
    {
      title: String,
      items: [String]
    }
  ]
});

const Formation = mongoose.model('Formation', FormationSchema);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/formations/:category', async (req, res) => {
  const category = req.params.category;
  const data = await Formation.findOne({ category: new RegExp(category, 'i') });

  if (!data) {
    return res.send("No formations found for this category.");
  }

  res.render('formations', { data });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
