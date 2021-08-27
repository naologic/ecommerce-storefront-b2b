export namespace NaoHttp2Interface {
  export interface ApiSettings {
    $id: string; // 'server',
    protocol: string; // 'http',
    port: number; // 3010,
    url: string; // 'localhost',
    prefix: string; // 'api/v2/',
    ssl: boolean; // false
  }
}
