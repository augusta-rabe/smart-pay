## 
<p align="left" style="display: flex; align-items: center; gap: 12px;">
  <img src="./assets/icon.png" alt="SmartPay" width="50" height="50" style="vertical-align: middle; margin-right: 10px;" />
  <span style="font-size: 1.7em; font-weight: bold; vertical-align: middle;">SmartPay</span>
</p>

Application locale pour comptable permettant de calculer rapidement la combinaison minimale de billets Malagasy (MGA) pour un montant donné, avec la possibilité d’exclure précisément les coupures non disponibles.

### Fonctionnalités
- **Calcul minimal**: renvoie toujours le nombre minimal de billets pour atteindre le montant (algorithme optimal).
- **Sélection précise des coupures**: cochez/décochez les billets que vous avez réellement (20 000 → 100 Ar).
- **Rapide et local**: fonctionne entièrement dans le navigateur, sans serveur ni installation.
- **Accessibilité et clavier**: champ montant focusable, validation claire, touche Entrée pour lancer le calcul.

### Coupures prises en charge
| Billets |
|---|
| 20 000 Ar |
| 10 000 Ar |
| 5 000 Ar |
| 2 000 Ar |
| 1 000 Ar |
| 500 Ar |
| 200 Ar |
| 100 Ar |

## Prise en main
- Ouvrez simplement le fichier `index.html` dans votre navigateur.
- Sur Windows, vous pouvez aussi lancer:
```bash
start index.html
```

## Utilisation
1. Entrez un montant en Ariary (multiple de 100).
2. (Optionnel) Cochez « Sélection précise des coupures disponibles » et décochez les billets indisponibles.
3. Cliquez sur « Calculer » ou appuyez sur Entrée.
4. Le résultat affiche le détail par coupure et le total de billets utilisés.

Exemple rapide:
- Montant: `45 000 Ar`
- Coupures: toutes disponibles → résultat minimal typique: `2 × 20 000 Ar` + `1 × 5 000 Ar`.
- Si vous décochez `10 000` et `5 000`, SmartPay recomposera avec `2 000`, `1 000`, `500`, etc., toujours au minimum de billets.

## Détails techniques
- **Algorithme**: Programmation dynamique (problème du rendu de monnaie) pour garantir la solution minimale, même si les coupures sont restreintes de manière arbitraire. Complexité ~ O(N × M), avec N = nombre de coupures actives et M = montant/100.
- **Validation**: le montant doit être un multiple de `100 Ar` (plus petite unité gérée).
- **Technos**: HTML + CSS + JavaScript pur. Aucune dépendance externe.

## Personnalisation
- **Modifier les coupures**: dans `app.js`, ajustez le tableau `DENOMINATIONS` si nécessaire.
- **Styles**: les couleurs sont centralisées dans `styles.css` via des variables CSS (`:root`). Les composants principaux: champs, boutons, grilles de résultats, carte.
- **Logo/icone**: placez vos fichiers dans `assets/` et ajustez les liens dans `index.html`.

## Structure du projet
- `index.html` — Interface de l’application.
- `styles.css` — Styles et mise en page (thème, cartes, grilles, boutons, cases à cocher).
- `app.js` — Logique (validation, sélection des coupures, algorithme DP, rendu des résultats).
- `assets/` — Icônes et ressources (optionnel).

## Accessibilité
- Libellés explicites, focus visible, messages d’erreur concis.
- Navigation clavier: le champ montant accepte Entrée pour lancer le calcul.

## Pistes d’amélioration
- **Mode sombre** pour un meilleur confort visuel la nuit.
- **Historique** des derniers montants saisis.
- **Export** du résultat (PDF/PNG ou impression).

---
Made with ❤️ pour faciliter les paiements en Ariary (MGA). 