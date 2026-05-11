/// <reference types="astro/client" />

declare module "*.mp3" {
  const src: string;
  export default src;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}