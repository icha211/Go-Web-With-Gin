# Tests API avec Bruno

Ce dossier contient les tests d'API pour le projet Go avec Gin, organisés pour être utilisés avec l'outil Bruno.

## Structure des tests

```
Test_request_gin/
├── bruno.json                    # Configuration de la collection
├── environments/                 # Variables d'environnement
│   ├── local.bru                # Environnement local
│   └── production.bru           # Environnement de production
└── albums/                      # Tests pour les endpoints albums
    ├── get-all-albums.bru       # GET /albums
    ├── get-album-by-id.bru      # GET /albums/:id
    ├── create-new-album.bru     # POST /albums
    ├── get-album-not-found.bru  # Test d'erreur 404
    ├── create-album-invalid-data.bru # Test de validation
    └── verify-album-created.bru # Vérification après création
```

## Prérequis

1. **Bruno** : Installez Bruno depuis [bruno.app](https://www.bruno.app/)
2. **Serveur API** : Assurez-vous que votre serveur Go est démarré sur `localhost:8082`

## Utilisation

### 1. Ouvrir la collection dans Bruno

1. Lancez Bruno
2. Cliquez sur "Open Collection"
3. Sélectionnez le dossier `Test_request_gin`

### 2. Configurer l'environnement

1. Dans Bruno, sélectionnez l'environnement "local" dans le menu déroulant
2. Vérifiez que `baseUrl` est défini sur `http://localhost:8082`

### 3. Exécuter les tests

#### Tests individuels
- Cliquez sur n'importe quel fichier `.bru` dans l'interface
- Cliquez sur "Send" pour exécuter la requête
- Consultez les résultats des tests dans l'onglet "Tests"

#### Tests en lot
- Sélectionnez le dossier "albums"
- Cliquez sur "Run Collection" pour exécuter tous les tests

## Description des tests

### GET /albums
- **Fichier** : `get-all-albums.bru`
- **Objectif** : Récupérer tous les albums
- **Tests** : Vérification du statut 200, structure de réponse, données requises

### GET /albums/:id
- **Fichier** : `get-album-by-id.bru`
- **Objectif** : Récupérer un album spécifique
- **Tests** : Vérification du statut 200, données correctes de l'album

### POST /albums
- **Fichier** : `create-new-album.bru`
- **Objectif** : Créer un nouvel album
- **Tests** : Vérification du statut 201, données de l'album créé

### Gestion d'erreurs
- **Fichier** : `get-album-not-found.bru`
- **Objectif** : Tester la gestion d'erreur 404
- **Tests** : Vérification du statut 404, message d'erreur

### Validation des données
- **Fichier** : `create-album-invalid-data.bru`
- **Objectif** : Tester la validation des données invalides
- **Tests** : Vérification de la gestion des erreurs de validation

### Vérification post-création
- **Fichier** : `verify-album-created.bru`
- **Objectif** : Vérifier qu'un album a été correctement ajouté
- **Tests** : Vérification de la présence de l'album dans la liste

## Variables d'environnement

### Local
- `baseUrl` : http://localhost:8082
- `timeout` : 5000ms

### Production
- `baseUrl` : https://your-api-domain.com
- `timeout` : 10000ms

## Intégration CI/CD

Bruno peut être intégré dans vos pipelines CI/CD :

```bash
# Exécuter tous les tests
bruno test Test_request_gin

# Exécuter avec un environnement spécifique
bruno test Test_request_gin --env local

# Exécuter un test spécifique
bruno test Test_request_gin/albums/get-all-albums.bru
```

## Personnalisation

Pour ajouter de nouveaux tests :

1. Créez un nouveau fichier `.bru` dans le dossier approprié
2. Suivez la structure des fichiers existants
3. Ajoutez vos tests dans la section `tests`
4. Utilisez les variables d'environnement définies

## Notes importantes

- Assurez-vous que le serveur API est démarré avant d'exécuter les tests
- Les tests de création d'albums peuvent affecter l'état des données
- Pour les tests de production, mettez à jour l'URL dans `environments/production.bru`
