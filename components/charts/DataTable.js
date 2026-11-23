// Table-view twin for a chart: every value stays reachable without hover.
export default function DataTable({ caption = 'View the data', columns, rows, highlight }) {
  return (
    <details className="table-toggle">
      <summary>{caption}</summary>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={highlight === i ? 'is-hl' : undefined}>
                {r.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
