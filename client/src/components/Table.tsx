import TableModule from "./Table.module.css";

type Props = {
  thead: JSX.Element;
  rows: JSX.Element[];
};

export const Table = ({ thead, rows }: Props): JSX.Element => {
  for (const r of rows) {
  }
  return (
    <table>
      <thead className={TableModule.header}>{thead}</thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
