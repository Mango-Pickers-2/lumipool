export {};

declare global {
  interface Window {
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };

    $chatwoot?: {
      toggle: (state?: "open" | "close") => void;
    };

    chatwootSettings?: {
      hideMessageBubble?: boolean;
    };
  }
}
