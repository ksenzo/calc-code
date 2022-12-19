/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ImportMeta {
    env: {
      VITE_API_KEY: string
      VITE_APP_NAME: string
    }
  }
}
