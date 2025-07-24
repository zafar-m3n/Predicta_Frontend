import React from "react";

const Table = ({
  columns = [],
  data = [],
  renderCell,
  emptyMessage = "No records found.",
  className = "",
  mobileBreakpoint = "md",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Table */}
      <div className={`hidden ${mobileBreakpoint}:block overflow-x-auto rounded shadow`}>
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-accent/20 dark:bg-accent/30">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-800 dark:text-gray-100 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-700 dark:text-gray-300">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-gray-100 dark:bg-gray-900" : "bg-gray-200 dark:bg-gray-800"}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {renderCell ? renderCell(row, col) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Layout */}
      <div className={`${mobileBreakpoint}:hidden space-y-4`}>
        {data.length === 0 ? (
          <div className="p-4 text-center text-gray-700 dark:text-gray-300 bg-accent/10 dark:bg-accent/20 rounded shadow">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={row.id || rowIndex}
              className={`rounded shadow divide-y ${
                rowIndex % 2 === 0 ? "bg-gray-100 dark:bg-gray-900" : "bg-gray-200 dark:bg-gray-800"
              } divide-gray-300 dark:divide-gray-700`}
            >
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between px-4 py-2">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase">{col.label}</span>
                  <span className="text-sm text-gray-800 dark:text-gray-200 text-right max-w-[60%] truncate">
                    {renderCell ? renderCell(row, col) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Table;
