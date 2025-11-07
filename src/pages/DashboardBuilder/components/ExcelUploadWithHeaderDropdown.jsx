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
      onApply({
        headers,
        selectedHeaders: chosen,
        rows,
        data: dataObjects,
        sheet: selectedSheet,
      });
    }
  };

  return (
    <div
      style={{
        padding: 10,
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "var(--theme-surface)",
          color: "var(--theme-text)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--style-borderRadius)",
          boxShadow: "var(--style-shadow)",
          padding: 10,
          transition:
            "background var(--style-animationDuration) ease, color var(--style-animationDuration) ease, border-color var(--style-animationDuration) ease",
        }}
      >
        {/* Upload Excel */}
        <div

        // style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          {/* <div>
            <label
              htmlFor="excel-file-input"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--theme-primary)",
                color: "#fff",
                border: "1px solid var(--theme-primary)",
                borderRadius: "calc(var(--style-borderRadius))",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "filter var(--style-animationDuration) ease",
              }}
              title="Upload Excel file"
            >
              Upload Excel
            </label>
          </div>
          <input
            id="excel-file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <small style={{ color: "var(--theme-textSecondary)" }}>
            Supported: .xlsx, .xls
          </small> */}

          {/* ************************************** */}

          <label
            htmlFor="excel-file-input"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--theme-text)",
              transition: "color var(--style-animationDuration) ease",
            }}
          >
            Upload Excel File
          </label>
          <input
            id="excel-file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            style={{
              display: "block",
              width: "100%",
              fontSize: "14px",
              color: "var(--theme-text)",
              border: "1px solid var(--theme-border)",
              borderRadius: "var(--style-borderRadius)",
              cursor: "pointer",
              background: "var(--theme-surface)",
              padding: "8px 12px",
              outline: "none",
              transition:
                "border-color var(--style-animationDuration) ease, background var(--style-animationDuration) ease, color var(--style-animationDuration) ease",
            }}
          />
          <small style={{ color: "var(--theme-textSecondary)" }}>
            Supported: .xlsx, .xls
          </small>
        </div>

        {/* Sheet Selection */}
        {sheetNames.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <label style={{ marginRight: 8, color: "var(--theme-text)" }}>
              Select Sheet:
            </label>
            <select
              value={selectedSheet}
              onChange={(e) => handleSheetSelect(e.target.value)}
              style={{
                background: "var(--theme-surface)",
                color: "var(--theme-text)",
                border: "1px solid var(--theme-border)",
                borderRadius: "var(--style-borderRadius)",
                padding: "8px 10px",
                outline: "none",
                transition:
                  "border-color var(--style-animationDuration) ease, background var(--style-animationDuration) ease",
              }}
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
          <div style={{ marginTop: 20 }}>
            <label style={{ color: "var(--theme-text)", fontWeight: 600 }}>
              Select Columns
            </label>
            <div
              ref={dropdownRef}
              style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
                maxWidth: 420,
                marginTop: 8,
              }}
            >
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  border: "1px solid var(--theme-border)",
                  padding: "10px 12px",
                  borderRadius: "var(--style-borderRadius)",
                  cursor: "pointer",
                  background: "var(--theme-surface)",
                  color: "var(--theme-text)",
                  transition:
                    "border-color var(--style-animationDuration) ease, background var(--style-animationDuration) ease",
                }}
                title="Select which columns to include"
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
                    zIndex: 20,
                    width: "100%",
                    background: "var(--theme-surface)",
                    border: "1px solid var(--theme-border)",
                    borderRadius: "var(--style-borderRadius)",
                    boxShadow: "var(--style-shadow)",
                    marginTop: 6,
                    maxHeight: 260,
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      padding: 8,
                      borderBottom: "1px solid var(--theme-border)",
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      background: "var(--theme-surface)",
                    }}
                  >
                    <button
                      onClick={() => toggleAll(true)}
                      style={{
                        background: "transparent",
                        color: "var(--theme-text)",
                        border: "1px solid var(--theme-border)",
                        borderRadius: "calc(var(--style-borderRadius) - 2px)",
                        padding: "5px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => toggleAll(false)}
                      style={{
                        background: "transparent",
                        color: "var(--theme-text)",
                        border: "1px solid var(--theme-border)",
                        borderRadius: "calc(var(--style-borderRadius) - 2px)",
                        padding: "5px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={applySelection}
                      style={{
                        background: "var(--theme-primary)",
                        color: "#fff",
                        border: "1px solid var(--theme-primary)",
                        borderRadius: "calc(var(--style-borderRadius) - 2px)",
                        padding: "5px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Done
                    </button>
                  </div>

                  <div style={{ padding: 8 }}>
                    {headers.map((h) => (
                      <label
                        key={h}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "6px 4px",
                          color: "var(--theme-text)",
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
                            color: "var(--theme-text)",
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
      </div>

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
