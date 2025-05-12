interface IClusterRequestTranslator {
  toYaml(request: object): string;
  fromYaml(yaml: string): object;
}

export { IClusterRequestTranslator };
