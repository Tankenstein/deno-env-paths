# env-paths for deno

This is a straight port of [Sindre Sorhus' env-paths node library](https://github.com/sindresorhus/env-paths). Use it to correct OS-specific paths for storing things like data, config, cache etc.

## Usage:

To use this library, you need to run deno with the `--allow-env` permission.

```typescript
import { envPaths } from "./mod.ts"; // TODO: add deno.land url once there

const paths = envPaths("MyApp");

paths.data;
//=> '/Users/uku.tammet/Library/Application Support/MyApp-deno'

paths.config;
//=> '/Users/uku.tammet/Library/Preferences/MyApp-deno'
```

## API

### paths = envPaths(name, options?)

Note: It only generates the path strings. It doesn't create the directories for you.

#### name

Type: `string`

Name of your project. Used to generate the paths.

#### options

Type: `object`

##### suffix

Type: `string`<br>
Default: `'deno'`

**Don't use this option unless you really have to!**<br>
Suffix appended to the project name to avoid name conflicts with native
apps. Pass an empty string to disable it.

### paths.data

Directory for data files.

### paths.config

Directory for config files.

### paths.cache

Directory for non-essential data files.

### paths.log

Directory for log files.

### paths.temp

Directory for temporary files.

## License

MIT licensed under Sindre Sorhus, as this is a straight port (basically copy) of their work.
