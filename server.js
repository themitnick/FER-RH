const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques depuis le dossier dist
app.use(express.static(path.join(__dirname, 'dist/fer-rh')));

// Gérer les routes Angular - rediriger tout vers index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/fer-rh/index.html'));
});

// Démarrer le serveur
const port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Serveur démarré sur le port ' + port);
});
