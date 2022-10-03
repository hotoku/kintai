export class InvalidFormat extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export const parseDateTime = (s: string): Date => {
  const rex =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\+(\d{2}):(\d{2})$/;
  const match = s.match(rex);
  if (match === null) {
    throw new InvalidFormat(`parseDateTime: invalid format ${s}`);
  }
  return new Date();
};
