export class InvalidFormat extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export const parseDateTime = (s: string): Date => {
  const rex =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})\+(\d{2}):(\d{2})$/;
  const match = s.match(rex);
  if (match === null) {
    throw new InvalidFormat(`parseDateTime: invalid format ${s}`);
  }
  const vals = match.slice(1, 8).map((e) => parseInt(e));
  return new Date(
    vals[0],
    vals[1] - 1,
    vals[2],
    vals[3],
    vals[4],
    vals[5],
    vals[6]
  );
};
