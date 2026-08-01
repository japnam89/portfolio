// Minimal type shim for the `aws4` CommonJS module (no published types).
declare module "aws4" {
  export interface Aws4Request {
    host?: string;
    path?: string;
    url?: string;
    [key: string]: unknown;
  }
  export interface Aws4Credentials {
    accessKeyId?: string;
    secretAccessKey?: string;
    sessionToken?: string;
    region?: string;
    service?: string;
    host?: string;
    path?: string;
    signQuery?: boolean;
    expires?: number;
    [key: string]: unknown;
  }
  export function sign(
    opts: Aws4Credentials,
    credentials?: Aws4Credentials,
  ): Aws4Request;
  const _default: { sign: typeof sign };
  export default _default;
}
