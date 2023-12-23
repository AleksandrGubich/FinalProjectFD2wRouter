export function createPathRegExp(pathTemplate: string): RegExp {
  return new RegExp('/' + pathTemplate.replace(/:([A-z]+)/g, (_, paramName) => {
    return `(?<${paramName}>[^?/]+)`;
  }) + '$');
}
