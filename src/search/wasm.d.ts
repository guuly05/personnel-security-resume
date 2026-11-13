declare module '*portfolio_search.js' {
  export default function init(): Promise<unknown>;
  export class WasmSearch {
    constructor(json: string);
    search(query: string, limit: number): string;
  }
}
