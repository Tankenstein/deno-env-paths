import { path } from "./deps.ts";

export interface EnvPaths {
  data: string;
  config: string;
  cache: string;
  log: string;
  temp: string;
}

export interface Options {
  suffix?: string | null | false;
}

/** Retrieve environment paths for your application on your current platform.
 *
 *      const envPaths = getEnvPaths('my-application');
 *
 * Requires `allow-env` permission. */
export function envPaths(name: string, options: Options = {}): EnvPaths {
  options = Object.assign({ suffix: "deno" }, options);
  if (options.suffix) {
    name += `-${options.suffix}`;
  }
  switch (Deno.build.os) {
    case "darwin":
      return macOsEnvPaths(name);
    case "linux":
      return linuxEnvPaths(name);
    case "windows":
      return windowsEnvPaths(name);
  }
}

function macOsEnvPaths(name: string): EnvPaths {
  const home = getHomeDir();
  const tmp = getTmpDir();
  const library = path.join(home, "Library");
  return {
    data: path.join(library, "Application Support", name),
    config: path.join(library, "Preferences", name),
    cache: path.join(library, "Caches", name),
    log: path.join(library, "Logs", name),
    temp: path.join(tmp, name),
  };
}

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
function linuxEnvPaths(name: string): EnvPaths {
  const tmpdir = getTmpDir();
  const homedir = getHomeDir();
  const username = path.basename(getHomeDir());
  return {
    data: path.join(
      Deno.env.get("XDG_DATA_HOME") || path.join(homedir, ".local", "share"),
      name
    ),
    config: path.join(
      Deno.env.get("XDG_CONFIG_HOME") || path.join(homedir, ".config"),
      name
    ),
    cache: path.join(
      Deno.env.get("XDG_CACHE_HOME") || path.join(homedir, ".cache"),
      name
    ),
    log: path.join(
      Deno.env.get("XDG_STATE_HOME") || path.join(homedir, ".local", "state"),
      name
    ),
    temp: path.join(tmpdir, username, name),
  };
}

function windowsEnvPaths(name: string): EnvPaths {
  const homedir = getHomeDir();
  const tmpdir = getTmpDir();
  const appData =
    Deno.env.get("APPDATA") || path.join(homedir, "AppData", "Roaming");
  const localAppData =
    Deno.env.get("LOCALAPPDATA") || path.join(homedir, "AppData", "Local");

  return {
    // Data/config/cache/log are invented by sindre as Windows isn't opinionated about this
    data: path.join(localAppData, name, "Data"),
    config: path.join(appData, name, "Config"),
    cache: path.join(localAppData, name, "Cache"),
    log: path.join(localAppData, name, "Log"),
    temp: path.join(tmpdir, name),
  };
}

function getHomeDir(): string {
  // TODO: implement fully (https://nodejs.org/api/os.html#os_os_homedir)
  return Deno.env.get("HOME")!;
}

function getTmpDir(): string {
  return Deno.env.get("TMPDIR")!;
}
