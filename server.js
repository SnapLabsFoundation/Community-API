const { createProject, updateProject, accessMetadata, updateMetadata } = require('./projects');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/', createProject);
app.use('/', updateProject);
app.use('/', accessMetadata);
app.use('/', updateMetadata);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
