const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

router.post('/projects/create', (req, res) => {
    const projectJsonDir = path.join(process.cwd(), 'prisma', 'projects', 'metadata');
    const assetsDir = path.join(process.cwd(), 'prisma', 'projects', 'assets');
    const pJsonPath = path.join(process.cwd(), 'prisma', 'projects', 'projectJson');

    fs.mkdirSync(projectJsonDir, { recursive: true });
    fs.mkdirSync(assetsDir, { recursive: true });
    fs.mkdirSync(pJsonPath, { recursive: true });

    // Determine projectId
    const files = fs.readdirSync(projectJsonDir);
    const projectId = files.length + 1;

    // Generate a new MD5 hash for the SVG asset
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">
  <rect width="480" height="360" fill="white"/>
  <text x="50%" y="50%" font-size="200" text-anchor="middle" dominant-baseline="middle" fill="black" stroke="white" stroke-width="10" font-family="Arial, sans-serif">S</text>
</svg>`;

    const newMd5 = crypto.createHash('md5').update(svgContent).digest('hex');
    const svgFileName = `${newMd5}.svg`;
    const svgFilePath = path.join(assetsDir, svgFileName);

    // Write the SVG asset
    fs.writeFileSync(svgFilePath, svgContent);

    // Build project JSON
    const projectJson = {
        id: projectId,
        title: "Untitled Project",
        description: "",
        instructions: "",
        visibility: "visible",
        public: false,
        comments_allowed: false,
        is_published: false,
        author: { id: 67, username: "admin", scratchteam: false, history: { joined: "" }, profile: { id: null, images: {} } },
        image: "",
        images: {},
        history: { created: "", modified: "", shared: "" },
        stats: { views: 0, loves: 0, favorites: 0, remixes: 0 },
        remix: { parent: null, root: null },
        project_token: "63gv9yu50wwej8g0gg0kgw0wwg0kgg",
    };

    const projectJsonPath = path.join(projectJsonDir, `${projectId}.json`);
    fs.writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 2));

    const pJson = {
  "targets": [
    {
      "isStage": true,
      "name": "Stage",
      "variables": {
        "`jEk@4|i[#Fk?(8x)AV.-my variable": [
          "my variable",
          0
        ]
      },
      "lists": {},
      "broadcasts": {},
      "blocks": {},
      "comments": {},
      "currentCostume": 0,
      "costumes": [
        {
          "name": "backdrop1",
          "dataFormat": "svg",
          "assetId": `${newMd5}`,
          "md5ext": `${newMd5}.svg`,
          "rotationCenterX": 240,
          "rotationCenterY": 180
        }
      ],
      "sounds": [],
      "volume": 100,
      "layerOrder": 0,
      "tempo": 60,
      "videoTransparency": 50,
      "videoState": "on",
      "textToSpeechLanguage": null
    }
  ],
  "monitors": [],
  "extensions": [],
  "meta": {
    "semver": "3.0.0",
    "vm": "11.1.0",
    "agent": "Mozilla/5.0"
  }
};
    const pJsonFilePath = path.join(pJsonPath, `${projectId}.json`);
    fs.writeFileSync(pJsonFilePath, JSON.stringify(pJson, null, 2));
    res.status(200).json({ projectId });
});

module.exports = router;
