import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const HOST = "127.0.0.1";
const PORT = 13_015;
const APPLICATION_URL = `http://localhost:${PORT}`;
const HEALTHCHECK_URL = `http://${HOST}:${PORT}`;
const NEXT_CLI = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));

if (await isVintraRunning()) {
  process.stdout.write(`Vintra est déjà accessible sur ${APPLICATION_URL}\n`);
  process.exit(0);
}

const server = spawn(
  process.execPath,
  [NEXT_CLI, "dev", "--turbopack", "--hostname", HOST, "--port", String(PORT)],
  { stdio: "inherit" },
);

server.on("error", (error) => {
  process.stderr.write(`Le serveur local n’a pas pu démarrer : ${error.message}\n`);
  process.exitCode = 1;
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}

async function isVintraRunning() {
  try {
    const response = await fetch(HEALTHCHECK_URL, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(1_500),
    });
    const page = await response.text();

    return response.ok && page.includes("<title>Vintra");
  } catch {
    return false;
  }
}
