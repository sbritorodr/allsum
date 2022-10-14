import type * as TauriApiTypes from "@tauri-apps/api";

declare global {
  interface Window {
    __TAURI__: typeof TauriApiTypes;
  }
  interface OutputHash{
    Hash: string;
  }
}
/*export type OutputHash = 
  | {
    [x: string]:string;"tag": "Hash"
}
*/