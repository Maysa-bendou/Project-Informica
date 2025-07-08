const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from client/public at root URL
app.use(express.static(path.join(__dirname, "client", "public")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
// Middleware
app.use(cors()); // Allow cross-origin requests (from your frontend)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection (XAMPP)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // XAMPP default: empty password
  database: "informica_db"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
    process.exit(1); // Stop server if can't connect
  }
  console.log("✅ Connected to MySQL");
});

// POST route to receive form data
app.post("/api/form", (req, res) => {
  console.log("Received form data:", req.body);

  const { entreprise, responsable, fonction, email, phone, message } = req.body;

  if (!entreprise || !email || !phone || !message) {
    return res.status(400).send("❌ Veuillez remplir tous les champs obligatoires.");
  }

  const sql = `
    INSERT INTO dmd_info_entreprise 
    (entreprise, nom_responsable, fonction, email, phone, message) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [entreprise, responsable || null, fonction || null, email, phone, message],
    (err) => {
      if (err) {
        console.error("❌ Insert error:", err);
        return res.status(500).send("Erreur lors de l'envoi du formulaire.");
      }
      res.send("✅ Formulaire envoyé avec succès !");
    }
  );
});

app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
