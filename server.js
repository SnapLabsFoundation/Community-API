const { createProject, updateProject, accessMetadata, updateMetadata } = require('./src/projects/index');
const { createUser, accessUser } = require('./src/users/index');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

app.use(bodyParser.json());
app.use('/', createProject);
app.use('/', updateProject);
app.use('/', accessMetadata);
app.use('/', updateMetadata);
app.use('/', createUser);
app.use('/', accessUser);

app.get('/', (req, res) => {
    return res.json({ "message": "SnapLabs API Online" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
