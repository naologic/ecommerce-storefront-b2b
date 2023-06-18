import { NaoHttp2Interface } from './nao-http2.interface';

/**
 * Generate the API route from environment config
 */
const generateApiRoute = (server: NaoHttp2Interface.ApiSettings): string => {
  return `${server.protocol}://${server.url}:${server.port}/${server.prefix}`;
};

export {
  generateApiRoute
};
