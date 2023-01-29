# Spotted : Découvre et partage les best spots photos de Suisse !

Bienvenue sur la partie FrontEnd de notre App "Spotted".

Spotted est une application web et mobile, basée sur Ionic et Angular, et permettant aux amateurs de photographie de découvrir et partager
les best spots photo en Suisse, afin que d'autres passionnés y aient accès. L'app permet de créer de nouvelles places, de les noter, de laisser un avis et de leur donner un tag (+ d'ajouter des photos mais bug en cours de résolution)

En tant qu'utilisateur, notre app possède plusieurs features :

- La possibilité de se log pour un compte existant (username "Flow" et password "Flow" pour tester)
- La possiblité d'observer les spots déjà créés et de choisir entre une obsrvation via une vue map ou sur une vue liste.
- La possibilité de filtrer les endroits par canton ou par tag (liste de 15-20 tags) --> en fonction des filtres, cela resitue les utilisateurs sur la map
    - en filtrant par tag, cela replace l'utilisateur au centre de la Suisse, avec du recul (via Zoom large) afin qu'il puisse observer toutes les places correspondant à ce tag en Suisse
    - en filtrant par canton, cela replace l'utilisateur au centre de ce canton (via geocoding), afin qu'il ait une vue d'ensemble sur les places répondant à ce filtre dans le canton choisi
- En cliquant sur un spot, nous avons les informations liées à la place, comprenant le nom du spot, la distance qui nous sépare de ce spot, le canton, la note (1-5), les divers avis des utilisateurs, ainsi que la possiblité de laisser une nouvelle note (1-5) ainsi qu'un nouvel avis.
  Une gallerie photo est également affichée, mais nous avons un soucis avec l'envoi de photo sous format Buffer à notre back-end (cela fonctionne via Postman pourtant).
- La possiblité de créer une place possédant un nom, son canton (automatique par geocoding), un tag, une note (1-5) ainsi qu'un avis écrit (et une photo quand le bug sera fix)
- La possibilité, pour un visiteur d'une place, de la noter (1-5) et de laisser un avis
_ La possibilité, uniquement pour le créateur de la place, de modifier le nom de la place, au cas où il se serait trompé
- La possibilité, uniquement pour le créateur d'un avis écrit sur une place, de supprimer son avis

L'utilisateur peut également, via son profil, consulter ses photos (quand prise de photo sera fixée (mais cela marche si l'on push via postman une photo depuis un compte user). La visualisation de la galerie photo fonctionne, mais pas l'envoi des photos depuis l'app.
Il peut aussi, dans son profil, voir les lieux qu'il a visités avec toutes les infos liées à ces places.

En tant qu'utilisateur, tu as la possiblité, à tout moment en naviguant sur la map, de revenir à ton emplacement via le bouton "Me trouver".
Et afin d'ajouter une nouvelle place, rien n'est plus simple : il te suffit de cliquer sur le bouton "Ajouter un spot", et de cliquer sur l'emplacement de ton choix sur la map. Une fenêtre s'ouvrira ensuite avec les informations à rentrer.
Et pour ajouter une note et éventuellement un avis sur une place déjà existante que tu aurais visitée, il te suffit de cliquer sur ce lieu dans l'onglet map (avec la vue map ou la vue liste) et de remplir le formulaire te demandant la note que tu attribues à ce lieu et ton avis si tu le souhaites. Uniquement la note est obligatoire si tu remplis ce formulaire.

Dans le cadre de cette application, nous avons :
- Utilisé la géolocalisation pour que l'utilisateur sache où il est, et à quelle distance se trouvent les spots photos déjà créés
- Utilisé Leaflet pour afficher et gérer la map sur l'application
- Fait appel à la librairie Turf pour obtenir la distance entre notre géolocalisation et les spots photos (afin que l'utilisateur puisse voir si le spot est loin ou non)
- Utilisé l'API de Mapbox afin de faire du forward et reverse géocoding, pour faire la liaison entre les coordonnées géographiques des cantons et les noms de ces derniers (recentrage map via filtre, envoi des coordonnées pin sur la carte à notre database). Le but était d'éviter que l'utilisateur puisse choisir le canton (et que ce soit automatique), afin d'éviter des erreurs.
- Utilisé le plugin "Camera" de Capacitor pour gérer la prise de photo depuis la camera du smartphone.

PS : Si vous souhaitez voir une place présentant toutes les fonctionnalités, vous pouvez soit chercher "Carrefour illarsaz" dans la barre de recherche, soit créer votre place et commencer à ajouter des notes et avis à des places existantes !


