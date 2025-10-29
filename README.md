# API RESTful Go avec Gin

Ce projet est une API RESTful simple construite avec Go et le framework Gin pour gérer une collection d'albums de musique.

## Fonctionnalités

- **GET /albums** - Récupère tous les albums
- **GET /albums/:id** - Récupère un album spécifique par son ID
- **POST /albums** - Ajoute un nouvel album

## Structure des données

Un album contient les champs suivants :
- `id` (string) - Identifiant unique
- `title` (string) - Titre de l'album
- `artist` (string) - Nom de l'artiste
- `price` (float64) - Prix de l'album

## Installation et exécution

1. Assurez-vous d'avoir Go installé (version 1.16 ou plus récente)

2. Clonez ou téléchargez ce projet

3. Installez les dépendances :
```bash
go get .
```

4. Lancez le serveur :
```bash
go run .
```

Le serveur démarrera sur `localhost:8082`

## Utilisation

### Récupérer tous les albums
```bash
curl http://localhost:8082/albums
```

### Récupérer un album spécifique
```bash
curl http://localhost:8082/albums/1
```

### Ajouter un nouvel album
```bash
curl -X POST http://localhost:8082/albums \
  -H "Content-Type: application/json" \
  -d '{"id": "5", "title": "Kind of Blue", "artist": "Miles Davis", "price": 45.99}'
```

## Exemples de réponses

### GET /albums
```json
[
  {
    "id": "1",
    "title": "Blue Train",
    "artist": "John Coltrane",
    "price": 56.99
  },
  {
    "id": "2",
    "title": "Jeru",
    "artist": "Gerry Mulligan",
    "price": 17.99
  }
]
```

### GET /albums/1
```json
{
  "id": "1",
  "title": "Blue Train",
  "artist": "John Coltrane",
  "price": 56.99
}
```

### POST /albums
```json
{
  "id": "4",
  "title": "The Modern Sound of Betty Carter",
  "artist": "Betty Carter",
  "price": 49.99
}
```

## Notes

- Les données sont stockées en mémoire et seront perdues à chaque redémarrage du serveur
- Pour un usage en production, il est recommandé d'utiliser une base de données
