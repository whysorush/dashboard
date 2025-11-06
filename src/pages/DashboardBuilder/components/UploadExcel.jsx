import React from "react";

const UploadExcel = ({ onUpload }) => {
  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (onUpload) onUpload(file);
    console.log(file);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <input type="file" accept=".xlsx,.xls" onChange={handleChange} />
    </div>
  );
};

export default UploadExcel;
