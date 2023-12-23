export function resolvePath(currenAbsolutePath: string, relativePath: string) {
  if (/^\//.test(relativePath)) {
    return relativePath;
  }

  return '/' + [currenAbsolutePath, '/', relativePath]
    .join('')
    .split(/\/+/)
    .reduce<string[]>((fragments, fragment) => {
      if (fragment === '.') {
        return fragments;
      }

      if (fragment === '..') {
        fragments.pop();
      } else if (fragment) {
        fragments.push(fragment);
      }

      return fragments;
    }, [])
    .join('/');
}
