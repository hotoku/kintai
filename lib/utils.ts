export const parseDateTime = (s: string): Date => {
  const rex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;
  if (s.match(rex) === null) {
    throw Error(`parseDateTime: invalid format ${s}`);
  }
  return new Date();
};
