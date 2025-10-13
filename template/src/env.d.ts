interface ImportMetaEnv {
  readonly SECRET_ENVIRONMENT_STATUS: "live"|"maintenance";
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}