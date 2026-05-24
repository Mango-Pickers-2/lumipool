export {};

declare global {
  interface Window {
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };

    $chatwoot: {
      toggle: (state?: "open" | "close") => void;
      setUser: (
        identifier: string,
        user: {
          email?: string;
          name?: string;
          avatar_url?: string;
        },
      ) => void;

      setCustomAttributes: (attributes: Record<string, any>) => void;
    };
  }
}
