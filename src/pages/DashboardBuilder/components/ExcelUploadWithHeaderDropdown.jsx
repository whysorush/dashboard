import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

export default function ExcelUploadWithHeaderDropdown({ onApply }) {
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [checks, setChecks] = useState({});
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📂 Upload Excel
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      setWorkbook(wb);
      setSheetNames(wb.SheetNames);
      // Reset
      setSelectedSheet("");
      setHeaders([]);
      setRows([]);
      setChecks({});
      setSelectedHeaders([]);
    };
    reader.readAsBinaryString(file);
  };

  // 📑 Select Sheet
  const handleSheetSelect = (name) => {
    setSelectedSheet(name);
    const ws = workbook.Sheets[name];
    const grid = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const hdr = (grid[0] || []).map((h) => String(h ?? ""));
    const body = grid.slice(1);
    setHeaders(hdr);
    setRows(body);

    const init = {};
    hdr.forEach((h) => (init[h] = false));
    setChecks(init);
    setSelectedHeaders([]);
  };

  // ✅ Toggle header checkbox
  const toggleHeader = (h) => {
    setChecks((prev) => ({ ...prev, [h]: !prev[h] }));
  };

  // ✅ Select / Deselect all
  const toggleAll = (checked) => {
    const next = {};
    headers.forEach((h) => (next[h] = checked));
    setChecks(next);
  };

  // ✅ Apply (Done)
  const applySelection = () => {
    const chosen = headers.filter((h) => checks[h]);
    setSelectedHeaders(chosen);
    setDropdownOpen(false);

    // Emit selected data as array of objects keyed by chosen headers
    if (typeof onApply === "function") {
      const headerToIndex = new Map(headers.map((h, i) => [h, i]));
      const dataObjects = rows.map((row) => {
        const obj = {};
        chosen.forEach((h) => {
          const idx = headerToIndex.get(h);
          obj[h] = idx != null ? row[idx] : "";
        });
        return obj;
      });
      onApply({ headers, selectedHeaders: chosen, rows, data: dataObjects, sheet: selectedSheet });
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
       {/* Upload Excel */}
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

      {/* Sheet Selection */}
      {sheetNames.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <label style={{ marginRight: 8 }}>Sheet:</label>
          <select
            value={selectedSheet}
            onChange={(e) => handleSheetSelect(e.target.value)}
          >
            <option value="">-- Choose Sheet --</option>
            {sheetNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dropdown for Select Columns */}
      {headers.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <label>
            <strong>Select Columns:</strong>
          </label>
          <div
            ref={dropdownRef}
            style={{
              position: "relative",
              display: "inline-block",
              width: "100%",
              maxWidth: 350,
              marginTop: 8,
            }}
          >
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                border: "1px solid #999",
                padding: "8px",
                borderRadius: 4,
                cursor: "pointer",
                background: "#f2f2f2",
              }}
            >
              {selectedHeaders.length > 0
                ? selectedHeaders.join(", ")
                : "Select columns..."}
            </div>

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 10,
                  width: "100%",
                  background: "#f2f2f2",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  marginTop: 4,
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <button onClick={() => toggleAll(true)}>Select All</button>
                  <button onClick={() => toggleAll(false)}>Clear</button>
                  <button onClick={applySelection}>Done</button>
                </div>

                <div style={{ padding: 8 }}>
                  {headers.map((h) => (
                    <label
                      key={h}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "4px 0",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!checks[h]}
                        onChange={() => toggleHeader(h)}
                      />
                      <span
                        title={h}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {h || "(blank header)"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Table */}
      {/* {selectedHeaders.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4>Preview</h4>
          <div style={{ overflowX: "auto" }}>
            <table
              border="1"
              cellPadding="6"
              style={{ borderCollapse: "collapse", minWidth: 600 }}
            >
              <thead>
                <tr>
                  {selectedHeaders.map((h) => (
                    <th
                      key={h}
                      style={{
                        background: "red",
                        color: "#fff",
                        textAlign: "left",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 50).map((r, i) => (
                  <tr key={i}>
                    {selectedHeaders.map((h) => {
                      const idx = headers.indexOf(h);
                      return <td key={h}>{r[idx] ?? ""}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <small>Showing first 50 rows.</small>
        </div>
      )} */}
    </div>
  );
}
