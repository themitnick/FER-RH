# Instructions de Déploiement - FER-RH

## Problème de routage SPA (Single Page Application)

Lors du déploiement d'une application Angular, le serveur web doit être configuré pour rediriger toutes les routes vers `index.html` afin que le routeur Angular puisse prendre le relais.

## Solutions par type de serveur

### 1. Apache (.htaccess)
- Le fichier `.htaccess` est automatiquement inclus dans le build
- Assurez-vous que le module `mod_rewrite` est activé sur votre serveur Apache

### 2. Nginx
- Utilisez le fichier `nginx.conf` fourni
- Adaptez les chemins selon votre configuration

### 3. IIS (Internet Information Services)
- Le fichier `web.config` est automatiquement inclus dans le build
- Assurez-vous que le module URL Rewrite est installé sur IIS

### 4. Node.js/Express
- Utilisez le fichier `server.js` fourni
- Installez express : `npm install express`
- Démarrez avec : `node server.js`

## Étapes de déploiement

1. **Build de production :**
   ```bash
   npm run build
   ```

2. **Uploadez le contenu du dossier `dist/fer-rh/` sur votre serveur**

3. **Configurez votre serveur web selon le type utilisé**

## Configuration de base d'URL (optionnel)

Si votre application n'est pas déployée à la racine du domaine, modifiez la base href :

```bash
ng build --base-href /votre-chemin/
```

Ou dans `src/index.html` :
```html
<base href="/votre-chemin/">
```

## Vérification

Après déploiement, testez :
1. L'accès direct à votre application
2. Le rafraîchissement sur différentes routes
3. La navigation entre les pages

## Problèmes courants

- **404 sur refresh** : Configuration serveur manquante
- **Assets non trouvés** : Vérifiez la base href
- **Erreurs CORS** : Configurez votre API backend
