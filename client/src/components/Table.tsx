import TableModule from "./Table.module.css";

type Props = {
  thead: JSX.Element;
  rows: JSX.Element[][];
};

export const Table = ({ thead, rows }: Props): JSX.Element => {
  const makeTr = (cells: JSX.Element[], i: number): JSX.Element => {
    return (
      <tr className={i % 2 !== 0 ? TableModule.rowOdd : ""} key={i}>
        {cells.map((c, i) => (
          <td key={i}>{c}</td>
        ))}
      </tr>
    );
  };
  return (
    <table>
      <thead className={TableModule.header}>{thead}</thead>
      <tbody>{rows.map((v, i) => makeTr(v, i))}</tbody>
    </table>
  );
};
