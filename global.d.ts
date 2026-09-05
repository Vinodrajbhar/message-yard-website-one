export {};

declare global {
  interface Window {
    copyConsolePayload?: (el: HTMLElement) => void;
  }
}
