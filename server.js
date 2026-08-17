require('dotenv').config();
const express = require('express');
const cors = require('cors');
const leaveRoutes = require('./Routes/leaveRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/timeoff', leaveRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node + SQL server running on http://localhost:${PORT}`));
