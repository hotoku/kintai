type Props = {
  thead: JSX.Element;
  rows: JSX.Element[];
};

export const Table = ({ thead, rows }: Props): JSX.Element => {
  return (
    <table>
      <thead>{thead}</thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
