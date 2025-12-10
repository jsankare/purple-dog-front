# Purple Dog — README

Plateforme de mise en relation pour la vente et l’achat d’objets de valeur entre particuliers vendeurs et professionnels du marché de l’art.

## Objectif
Centraliser la publication, l’évaluation, l’achat et la logistique d’objets de valeur via trois espaces distincts :
- Dashboard Professionnels
- Dashboard Particuliers
- Back Office Administrateur

## Structure générale
Application web responsive (PWA), servie via un domaine public HTTPS.
Architecture conteneurisée Docker :
- Frontend statique
- API backend
- Base de données
- Conteneur Ollama pour l’IA interne
  Aucune API IA externe autorisée.

## Parcours utilisateur

### Homepage
Bloc marketing modulable.
Header : logo, connexion, inscription.
Carrousel + descriptifs.
Catégories visuelles.
Présentation Purple Dog.
Newsletter.
Footer légal et contact.

### Inscription
**Particuliers**
Profil basique, données anonymisées, validation email, RGPD, majorité obligatoire.
Aucune information personnelle visible hormis le prénom.

**Professionnels**
Identité + entreprise + SIRET + documents officiels + marketing.
Validation email, RGPD, CGV, mandat d’apport d’affaires.
API gouvernementale possible pour vérifier l’entreprise.

### Forfaits
Particuliers : gratuit.
Professionnels : 1 mois gratuit puis 49€/mois.
Modèles modifiables via Back Office.

### Connexion
Mail + mot de passe pour tous les rôles.

## Dashboard Professionnels

### Feature 1 — Mettre en vente
Formulaire complet : nom, catégorie, dimensions, poids, description, documents, 10+ photos, prix souhaité.
Mode de vente : enchères ou vente rapide.
Recommandation de prix via IA locale + données d’enchères.

#### Système d’enchères
Démarrage auto à -10%.
Durée 1 semaine.
Paliers automatiques.
Enchère automatique.
Extensions de temps en cas de bataille.

#### Vente rapide
Prix fixe. Première offre validée = vente.

### Feature 2 — Mes objets en vente
Liste, offres, questions.
Notifications mail et visuelles.
Modération IA des messages (anti-contact direct).

### Feature 3 — Favoris / Historique
Objets likés, enchères posées, achats, ventes ratées.

### Feature 4 — Recherche
Filtres : prix, mode, catégorie, disponibilité.
Recherche textuelle avec suggestions.
Temps réel pour les enchères.
Notifications enchères et ventes rapides.

### Feature 5 — Profil
Édition des données essentielles.

### Feature 6 — Avis
Étoiles, NPS, commentaires.

## Dashboard Particuliers
Même logique que professionnels mais uniquement orienté vente.
Tendances des recherches pros visibles.

- Vendre un objet
- Suivi des ventes
- Profil
- Avis

## Back Office
- Gestion commissions
- Gestion catégories
- Modification formulaires
- Comptes utilisateurs
- Blocage comptes
- Suivi ventes rapides et enchères
- Gestion Stripe
- Gestion transporteurs (simulés)
- Comptabilité
- Avis utilisateurs

## Paiement et logistique
- Coordonnées livraison/facturation + paiement Stripe
- Choix transporteur (mock via Adapter)
- Fonds bloqués
- Notifications vendeur
- Collecte transporteur
- Signature réception acheteur
- Déblocage paiement 3–5 jours

## Contraintes techniques
1. PWA responsive
2. Docker obligatoire
3. Technologies libres mais documentées
4. IA interne via Ollama uniquement
5. Stripe (test)
6. Transporteurs simulés via Adapter
7. Temps réel : SSE ou WebSockets (polling interdit)

## Lexique
Particuliers : vendent exclusivement.
Professionnels : vendent et achètent.
Catégories : bijoux, montres, meubles, art, collection, vins, mode, etc.
Commissions : acheteur +3%, vendeur –2%.
