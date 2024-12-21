const express = require('express');
const app = express();
const port = 3000; // Change this to any available port you prefer

// Define a route to serve your static files (e.g., HTML, CSS, and JavaScript files)
app.use(express.static('public')); // Assuming your files are in a 'public' folder

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});