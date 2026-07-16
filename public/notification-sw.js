self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = typeof payload.title === "string" ? payload.title : "Vintra";
  const body =
    typeof payload.body === "string" ? payload.body : "Une nouvelle information est disponible.";
  const url =
    typeof payload.url === "string" && payload.url.startsWith("/") ? payload.url : "/notifications";
  const tag = typeof payload.tag === "string" ? payload.tag : "vintra-notification";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      data: { url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const path = event.notification.data?.url;
  const destination = typeof path === "string" && path.startsWith("/") ? path : "/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const matchingClient = clients.find(
        (client) => new URL(client.url).origin === self.location.origin,
      );
      if (matchingClient) {
        return matchingClient
          .navigate(destination)
          .then((navigatedClient) => navigatedClient?.focus());
      }
      return self.clients.openWindow(destination);
    }),
  );
});
