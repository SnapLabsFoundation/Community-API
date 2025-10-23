const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const multer = require('multer');

// Set up multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/projects/:projectId/update', upload.single('file'), async (req, res) => {
    const projectId = req.params.projectId;
    const fileBuffer = req.file?.buffer;

    if (!fileBuffer) {
        return res.status(400).send('No file uploaded');
    }

    try {
        // Directories
        const rootDir = process.cwd();
        const projectJsonDir = path.join(rootDir, 'prisma', 'projects', 'projectJson');
        const assetsDir = path.join(rootDir, 'prisma', 'projects', 'assets');

        // Ensure directories exist
        fs.mkdirSync(projectJsonDir, { recursive: true });
        fs.mkdirSync(assetsDir, { recursive: true });

        // Load SB3 as zip
        const zip = new AdmZip(fileBuffer);
        const zipEntries = zip.getEntries();

        // Extract project.json and rename
        const projectEntry = zipEntries.find(e => e.entryName === 'project.json');
        if (!projectEntry) return res.status(400).send('project.json not found in SB3');

        const projectJsonPath = path.join(projectJsonDir, `${projectId}.json`);
        fs.writeFileSync(projectJsonPath, projectEntry.getData());

        // Extract other media files
        const mediaExtensions = ['.png', '.jpeg', '.jpg', '.svg', '.mp3', '.mp4'];
        zipEntries.forEach(entry => {
            const ext = path.extname(entry.entryName).toLowerCase();
            if (entry.entryName !== 'project.json' && mediaExtensions.includes(ext)) {
                const targetPath = path.join(assetsDir, path.basename(entry.entryName));
                fs.writeFileSync(targetPath, entry.getData());
            }
        });

        return res.status(200).send('Project updated successfully');
    } catch (err) {
        console.error('Error processing SB3:', err);
        return res.status(500).send('Server error processing SB3');
    }
});

module.exports = router;
