/* tslint:disable */
/* eslint-disable */
/**
*/
export class Perlin {
  free(): void;
/**
* @param {number} seed
*/
  constructor(seed: number);
/**
* Set a new seed value
* @param {number} seed
*/
  setSeed(seed: number): void;
/**
* 2D Perlin Noise Matrix
* @param {number} x
* @param {number} y
* @param {number} scale
* @returns {Array<any>}
*/
  perlin2Matrix(x: number, y: number, scale: number): Array<any>;
/**
* 2D Perlin Noise
* @param {number} x
* @param {number} y
* @returns {number}
*/
  perlin2(x: number, y: number): number;
/**
* 3D Perlin Noise Matrix
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} scale
* @returns {Array<any>}
*/
  perlin3Matrix(x: number, y: number, z: number, scale: number): Array<any>;
/**
* 3D Perlin Noise
* @param {number} x
* @param {number} y
* @param {number} z
* @returns {number}
*/
  perlin3(x: number, y: number, z: number): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_perlin_free: (a: number, b: number) => void;
  readonly perlin_new: (a: number) => number;
  readonly perlin_setSeed: (a: number, b: number) => void;
  readonly perlin_perlin2Matrix: (a: number, b: number, c: number, d: number) => number;
  readonly perlin_perlin2: (a: number, b: number, c: number) => number;
  readonly perlin_perlin3Matrix: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly perlin_perlin3: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
