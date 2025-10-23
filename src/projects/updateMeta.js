const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/projects/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const metaUpdates = req.body;

    // Root of the project
    const rootDir = process.cwd();
    const metadataDir = path.join(rootDir, 'prisma', 'projects', 'metadata');
    
    // Ensure directories exist
    fs.mkdir(metadataDir, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directories:', err);
            return res.status(500).send('Server error creating directories');
        }

        // Full path to the JSON file
        const filePath = path.join(metadataDir, `${projectId}.json`);

        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // File does not exist
                return res.status(404).send({ error: `Metadata file for project ${projectId} does not exist.` });
            }

            // Overwrite existing file with new JSON data
            fs.writeFile(filePath, JSON.stringify(metaUpdates, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    return res.status(500).send('Server error writing file');
                }

                res.status(200).send({ message: `Metadata for project ${projectId} updated.` });
            });
        });
    });
});

module.exports = router;
