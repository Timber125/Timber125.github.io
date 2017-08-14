version = "v3";


self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.showNotification('Weather notification', {
      body: event.data.text();
   }));
});



self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(version).then(function (cache) {
            return cache.addAll([
                "/",
                "/manifest.json",
                "/index.html",
                "/assets/css/font_awesome.css",
                "/assets/css/Raleway.css",
                "/assets/css/reset.css",
                "/assets/css/screen.css",
                "/assets/css/template.css",
                "/assets/js/script.js",
                "/assets/js/countrycodes.js",
                "/assets/js/meteox.js",
                "/assets/media/icon.png",
                "/assets/fonts/fontawesome-webfont.eot",
                "/assets/fonts/FontAwesome.otf",
                "/assets/fonts/fontawesome-webfont.svg",
                "/assets/fonts/fontawesome-webfont.ttf",
                "/assets/fonts/fontawesome-webfont.woff",
                "/assets/fonts/fontawesome-webfont.woff2"
            ])
        })
    );
    console.log("Installed Tunder");
});

self.addEventListener("fetch", function (event) {
	console.log("fetchevent");
    event.respondWith(
    	caches.match(event.request).then(function(response) {
      		return response || fetch(event.request);
    	})
  	);
});

self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("https://timber125.github.io");
    );
});