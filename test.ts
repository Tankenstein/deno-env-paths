import { assert } from "https://deno.land/std@0.50.0/testing/asserts.ts";
import { envPaths } from "./mod.ts";

Deno.test("uses default deno suffix", () => {
  const name = "unicorn";
  const paths = envPaths(name);

  for (const [key, value] of Object.entries(paths)) {
    assert(value.endsWith("unicorn-deno"));
  }
});

Deno.test("uses custom suffix when provided", () => {
  const name = "unicorn";
  const opts = { suffix: "horn" };
  const paths = envPaths(name, opts);
  for (const [key, value] of Object.entries(paths)) {
    assert(value.endsWith("unicorn-horn"));
  }
});

Deno.test("works with no suffix", () => {
  const name = "unicorn";
  const opts = { suffix: null };
  const paths = envPaths(name, opts);
  for (const [key, value] of Object.entries(paths)) {
    assert(value.endsWith("unicorn"));
  }
});

if (Deno.build.os === "linux") {
  Deno.test("correct paths with XDG_*_HOME set", () => {
    const envVars = {
      data: "XDG_DATA_HOME",
      config: "XDG_CONFIG_HOME",
      cache: "XDG_CACHE_HOME",
      log: "XDG_STATE_HOME",
    };

    for (const env of Object.values(envVars)) {
      Deno.env.set(env, `/tmp/${env}`);
    }

    const name = "unicorn";
    const paths = envPaths(name);

    for (const [key, value] of Object.entries(envVars)) {
      const expectedPath = Deno.env.get(value)!;
      const path = paths[key as keyof typeof paths];
      assert(path.startsWith(expectedPath) && path.endsWith("unicorn-deno"));
    }
  });
}
