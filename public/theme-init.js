(() => {
  const cookie = document.cookie.split("; ").find((entry) => entry.startsWith("vintra-theme="));
  const theme = cookie?.slice("vintra-theme=".length);

  if (theme === "LIGHT" || theme === "DARK" || theme === "SYSTEM") {
    document.documentElement.dataset.theme = theme.toLowerCase();
  }
})();
