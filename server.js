// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let leadData = [];

// Load leads data from file on server start
fs.readFile('leadData.js', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading leadData.js:', err);
  } else {
    try {
      leadData = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing leadData.js:', parseError);
    }
  }
});

// Save leads data to file
const saveLeadDataToFile = () => {
  fs.writeFile('leadData.js', JSON.stringify(leadData), 'utf8', (err) => {
    if (err) {
      console.error('Error writing leadData.js:', err);
    }
  });
};

// Endpoint to get leads
app.get('/api/leads', (req, res) => {
  res.json(leadData);
});

// Endpoint to add a new lead
app.post('/api/leads', (req, res) => {
  const newLead = req.body;
  newLead.id = leadData.length + 1;
  leadData.push(newLead);
  res.json(newLead);
  saveLeadDataToFile(); // Save leads data to file after adding a new lead
});

// Endpoint to update lead status
app.put('/api/leads/:id/status', (req, res) => {
  const leadId = parseInt(req.params.id);
  const newStatus = req.body.status;

  leadData = leadData.map((lead) =>
    lead.id === leadId ? { ...lead, status: newStatus } : lead
  );

  res.json({ message: 'Lead status updated successfully' });
  saveLeadDataToFile(); // Save leads data to file after updating lead status
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
