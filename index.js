const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const generalRoutes = require('./routes/general');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', generalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
