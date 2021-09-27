import React from "react";
import { useTable } from "react-table";

export default function({ events }) {
  const data = React.useMemo(
    () =>
      events.map((event) => {
        return {
          col1: event.blockNumber,
          col2: event.event,
          col3: event.args[1],
          col4: Number(event.args[2]["_hex"]),
          col5: Number(event.args[3]["_hex"]),
        };
      }),
    [events]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Block Number",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Voilation Type",
        accessor: "col2",
      },
      {
        Header: "Voilation Message",
        accessor: "col3",
      },
      {
        Header: "Actual Value",
        accessor: "col4",
      },
      {
        Header: "Optimum Value",
        accessor: "col5",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  border: "solid 1px gray",
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "solid 1px gray",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
