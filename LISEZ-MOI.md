# Fichiers des vidéos de cours

Cette branche ne contient que les fichiers servis dans `/videos/` par l'hébergement : pour chaque vidéo du catalogue
(`videos/catalogue.json`, branche `main`), sa version allégée `.mp4` et sa vignette `.jpg`. Elle est séparée de `main`
pour que le dépôt de travail reste léger. Le job « ovh » de la publication copie ces fichiers dans `site/videos/`
avant l'envoi. On y ajoute des fichiers, on ne réécrit jamais son historique. Voir `MEMO_atlas_videos.md`, §10.
