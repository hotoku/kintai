export const parseQuery = (query: string): { [keys: string]: string } => {
  if (query === "" || query === undefined) {
    return {};
  }
  if (query[0] !== "?") {
    throw Error(`parseQuery: first letter must be '?' => ${query}`);
  }
  const body = query.slice(1);
  const pairs = body.split("&").map((s) => {
    const pair = s.split("=");
    if (pair.length !== 2) {
      throw Error(`parseQuery: splitted by '=' must be of length 2 => ${s}`);
    }
    return pair;
  });
  const ret: { [keys: string]: string } = {};
  for (const pair of pairs) {
    ret[pair[0]] = pair[1];
  }
  return ret;
};
