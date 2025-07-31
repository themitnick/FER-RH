# 🚀 Guide de Déploiement GitHub Pages

## ⚡ Configuration Rapide

### 1. Activer GitHub Pages dans votre Repository

1. **Allez dans votre repository GitHub** : `https://github.com/VOTRE-USERNAME/FER-RH`
2. **Cliquez sur "Settings"** (onglet en haut)
3. **Scrollez jusqu'à "Pages"** dans le menu de gauche
4. **Configurez la source** :
   - Source : **"GitHub Actions"** ⚠️ (PAS "Deploy from a branch")
   - Cette option est cruciale pour que le workflow fonctionne

### 2. Vérifier les Permissions

Dans **Settings > Actions > General** :
- ✅ **Workflow permissions** : "Read and write permissions"
- ✅ **Allow GitHub Actions to create and approve pull requests** : Coché

### 3. Pousser le Code

```bash
git add .
git commit -m "Configuration GitHub Pages"
git push origin main
```

## 🔍 Vérification du Déploiement

### Workflow en cours
- Allez dans l'onglet **"Actions"** de votre repository
- Vous devriez voir le workflow **"Deploy to GitHub Pages"** en cours

### Statut du déploiement
- ✅ **Build** : Compilation de l'application Angular
- ✅ **Deploy** : Déploiement sur GitHub Pages
- 🌐 **URL finale** : `https://VOTRE-USERNAME.github.io/FER-RH/`

## 🔧 Résolution des Problèmes

### Erreur "not found deploy key or tokens"
✅ **Résolu** : Utilisation du workflow GitHub Pages officiel

### Erreur 404 sur les routes
✅ **Résolu** : Fichier `404.html` configuré pour les SPA

### Application ne se charge pas
- Vérifiez que le `base-href` est correct : `/FER-RH/`
- Vérifiez la source GitHub Pages : doit être "GitHub Actions"

## 📁 Structure de Déploiement

```
Repository GitHub
├── .github/workflows/deploy.yml   # Workflow automatique
├── 404.html                       # Redirection SPA
├── public/.nojekyll               # Désactive Jekyll
└── dist/FER-RH/                   # Fichiers buildés (auto-généré)
```

## 🎯 URL de Production

Une fois déployé avec succès :
**https://VOTRE-USERNAME.github.io/FER-RH/**

## 🔄 Redéploiement

Chaque push sur la branche `main` déclenche automatiquement un nouveau déploiement.

```bash
# Faire des modifications
git add .
git commit -m "Mise à jour"
git push origin main
# Le déploiement se lance automatiquement !
```

---

**🎉 Votre application FER-RH sera accessible en ligne en quelques minutes !**
