const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/projects/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    // Root of the project
    const rootDir = process.cwd();
    const metadataDir = path.join(rootDir, 'prisma', 'projects', 'metadata');
    const filePath = path.join(metadataDir, `${projectId}.json`);
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return res.status(404).send({ error: `Metadata file for project ${projectId} does not exist.` });
        }
        // Read the existing file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).send('Server error reading file');
            }
            try {
                const jsonData = JSON.parse(data);
                res.status(200).send(jsonData);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return res.status(500).send('Server error parsing JSON');
            }
        });
    });
});

module.exports = router;