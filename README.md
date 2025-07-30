# FER - Portail RH 🏢

Système de digitalisation de la fonction RH pour FER (Ferme d'Exploitation Rurale) en Côte d'Ivoire.

## 📋 Description

Cette application Angular moderne permet la gestion complète des ressources humaines avec trois portails distincts :

- **🔧 Personnel Opérationnel** : Gestion des demandes, pointage, congés
- **👔 Direction** : Vue d'ensemble, supervision, validation des demandes  
- **🏢 Équipe RH** : Gestion complète du personnel, recrutement, administration

## ✨ Fonctionnalités

### Pour le Personnel Opérationnel
- 📝 Soumission de demandes (matériel, formation, etc.)
- ⏰ Système de pointage numérique
- 📅 Demandes de congés et suivi
- 📊 Tableau de bord personnel

### Pour la Direction
- 📈 Tableau de bord exécutif
- 👥 Vue d'ensemble du personnel
- ✅ Validation des demandes importantes
- 📊 Rapports et statistiques

### Pour l'Équipe RH
- 👥 Gestion complète du trombinoscope
- 🔍 Processus de recrutement
- 📋 Administration des utilisateurs
- 📊 Analyses RH avancées

## 🚀 Technologies Utilisées

- **Frontend** : Angular 20.1.3
- **Styling** : Tailwind CSS 3.4.0
- **Language** : TypeScript
- **Architecture** : Standalone Components with Signals
- **State Management** : Angular Signals
- **Authentication** : Service-based with role management
- **Routing** : Protected routes with guards

## 🛠️ Installation et Configuration

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Angular CLI

### Installation

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/themitnick/FER-RH.git
cd FER-RH
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
# Copier le fichier d'environnement
cp src/environments/environment.example.ts src/environments/environment.ts
```

## 🖥️ Serveur de Développement

Pour démarrer le serveur de développement local :

```bash
ng serve
```

L'application sera accessible sur `http://localhost:4200/`. Le rechargement automatique est activé lors de la modification des fichiers source.

## 🔐 Comptes de Démonstration

Pour tester l'application, utilisez les comptes suivants :

| Rôle | Email | Mot de passe | Fonctionnalités |
|------|-------|--------------|-----------------|
| **Personnel** | `Konan.Kouassi@fer.ci` | `demo123` | Demandes, pointage, congés |
| **RH** | `Koné.jean@fer.ci` | `demo123` | Gestion personnel, recrutement |
| **Direction** | `fatou.kobenan@fer.ci` | `demo123` | Vue exécutive, validations |

## 🏗️ Architecture du Projet

```
src/
├── app/
│   ├── components/          # Composants de l'interface
│   │   ├── dashboard/       # Tableaux de bord
│   │   ├── demandes/        # Gestion des demandes
│   │   ├── conges/          # Gestion des congés
│   │   ├── pointage/        # Système de pointage
│   │   ├── trombinoscope/   # Gestion du personnel
│   │   └── login/           # Authentification
│   ├── services/            # Services Angular
│   │   ├── auth.service.ts  # Gestion authentification
│   │   └── ...
│   ├── models/              # Interfaces TypeScript
│   ├── guards/              # Guards de routing
│   └── utils/               # Utilitaires
├── assets/                  # Ressources statiques
└── styles/                  # Styles globaux
```

## 🎨 Développement

### Génération de Code

Pour créer un nouveau composant :

```bash
ng generate component components/nom-composant
```

Pour créer un service :

```bash
ng generate service services/nom-service
```

Liste complète des schématiques disponibles :

```bash
ng generate --help
```

### Build et Styles

Le projet utilise **Tailwind CSS** pour le styling. Les classes utilitaires sont configurées dans `tailwind.config.js`.

## 📦 Build de Production

Pour construire le projet pour la production :

```bash
ng build
```

Les fichiers de build seront générés dans le dossier `dist/`. La build de production optimise automatiquement l'application pour les performances.

### Build avec optimisations avancées

```bash
ng build --configuration production --aot --build-optimizer
```

## 🧪 Tests

### Tests unitaires

Exécuter les tests avec Karma :

```bash
ng test
```

### Tests end-to-end

Pour les tests e2e :

```bash
ng e2e
```

## 🚀 Déploiement

### Serveur de développement
```bash
ng serve --host 0.0.0.0 --port 4200
```

### Production
1. Build de production : `ng build`
2. Déployer le contenu du dossier `dist/` sur votre serveur web
3. Configurer le serveur pour servir `index.html` pour toutes les routes (SPA)

## 🤝 Contribution

1. **Fork** le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

## 🐛 Signalement de Bugs

Pour signaler un bug, veuillez :
1. Vérifier qu'il n'existe pas déjà dans les issues
2. Créer une nouvelle issue avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Captures d'écran si pertinentes

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement** : themitnick
- **Design** : Équipe FER
- **Tests** : Équipe QA FER

## 📞 Support

Pour toute question ou support :
- **Email** : support@fer.ci
- **Localisation** : Abidjan, Côte d'Ivoire
- **Issues GitHub** : [Créer une issue](https://github.com/themitnick/FER-RH/issues)

## 🔄 Changelog

### Version 1.0.0 (2025-07-30)
- ✅ Système d'authentification avec rôles
- ✅ Tableau de bord personnalisé par rôle
- ✅ Gestion des demandes et congés
- ✅ Système de pointage
- ✅ Trombinoscope complet
- ✅ Interface responsive avec Tailwind CSS
- ✅ Localisation pour la Côte d'Ivoire

---

**FER - Digitalisation de la fonction RH** 🚀
