# 🖼️ Script d'optimisation des images

# Instructions pour optimiser les images lourdes détectées :

## Images à traiter immédiatement :

1. **profile.jpg (20.4 MB) → Cible : < 200 KB**
2. **projet3.jpg (7.4 MB) → Cible : < 500 KB**
3. **projet4.jpg (875 KB) → Cible : < 300 KB**

## Outils d'optimisation recommandés :

### Option 1 : En ligne (gratuit)

- TinyPNG.com (PNG/JPG)
- Squoosh.app (Google - tous formats)

### Option 2 : Conversion vers formats modernes

- **WebP** : 25-35% plus léger que JPEG
- **AVIF** : 50% plus léger que JPEG (navigateurs récents)

### Option 3 : Script automatique

```bash
# Installation ImageMagick (Windows)
# Puis conversion automatique :
magick profile.jpg -quality 85 -resize 1920x1080> profile-optimized.jpg
magick projet3.jpg -quality 80 -resize 1200x800> projet3-optimized.jpg
magick projet4.jpg -quality 80 -resize 1200x800> projet4-optimized.jpg
```

## Formats de remplacement recommandés :

- profile.jpg → profile.webp (pour hero/about)
- projet*.jpg → projet*.webp (pour portfolio)

## Impact attendu :

- **Avant** : ~28.8 MB d'images
- **Après** : ~2-3 MB d'images
- **Gain** : ~90% de réduction ⚡

## Implémentation dans le code :

Utilisez déjà LazyImage qui supporte WebP avec fallback automatique.
