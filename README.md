# New Tab • Minimal Weather & Clock

Un tableau de bord minimaliste, sombre et élégant pour votre nouvel onglet Google Chrome, conçu avec React, TypeScript, Tailwind CSS, Open-Meteo et WebGL (React Bits).

## ✨ Fonctionnalités

- **Horloge digitale grand format** : Affichage temps réel avec secondes et date complète en français.
- **Bande météo 15 jours Paris (Brutaliste & Continue)** :
  - Découpage en 3 moments de la journée : **Matin (9h)**, **Midi (15h)** et **Soir (21h)** avec icônes colorées et probabilités de pluie.
  - Graphiques 24h intégrés directement dans chaque colonne :
    - Bâtons de probabilité de pluie heure par heure.
    - Courbe spline de température continue sur 24h avec indicateurs min/max dédupliqués.
  - Horaires solaires : Lever (`🌅`) et coucher (`🌇`) du soleil, humidité, vent et indice UV.
- **Palette thermique continue par degré** :
  - **Froid (< 18°C)** : Spectre de bleu progressif (du bleu nuit saphir au cyan polaire givré avec cristaux de gel).
  - **Doux / Tempéré (18°C à 26°C)** : Spectre de vert émeraude / menthe éclatant.
  - **Chaleur (> 26°C)** : Rouge vif incandescent avec badges flammes animés (`🔥`).
- **Arrière-plan dynamique Topography** : Rendu de courbes de niveau en WebGL 2 à 50% d'opacité avec déformation interactive à la souris.
- **Extension Google Chrome native (Manifest V3)** : Remplace instantanément chaque nouvel onglet (`Cmd + T`).

---

## 🚀 Installation dans Google Chrome

1. Clonez et compilez le projet :
   ```bash
   pnpm install
   pnpm build
   ```
2. Ouvrez Google Chrome et rendez-vous sur : `chrome://extensions`
3. Activez le **"Mode développeur"** (en haut à droite).
4. Cliquez sur **"Charger l'extension non empaquetée"** et sélectionnez le dossier `dist/` du projet :
   ```
   /Users/vava/Documents/GitHub/newtab/dist
   ```
5. Ouvrez un nouvel onglet (`Cmd + T`) !

---

## 🛠️ Développement local

```bash
# Lancer le serveur de dev
pnpm dev

# Compiler pour la production / extension Chrome
pnpm build
```
