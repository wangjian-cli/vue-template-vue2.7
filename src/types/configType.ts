enum Env {
  dev = 'dev',
  test = 'test',
  release = 'release'
}
type Result = Record<'stat' | 'api' | 'url', any>;
export type { Result };
export { Env };
