import React from "react";

const InitialDataTable = ({ sheets, currentSheet, onSheetChange }) => {
  const headers = sheets[currentSheet]?.headers || [];
  const rows = sheets[currentSheet]?.rows || [];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>
          <strong>Dummy Sheet:</strong>
        </label>
        <select value={currentSheet} onChange={(e) => onSheetChange(e.target.value)}>
          {Object.keys(sheets).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="6"
          style={{ borderCollapse: "collapse", minWidth: 600, width: "100%" }}
        >
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} style={{ background: "#111", color: "#fff", textAlign: "left" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 50).map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j}>{cell ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <small>Showing first 50 rows.</small>
    </>
  );
};

export default InitialDataTable;
