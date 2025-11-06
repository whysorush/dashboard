import React, { createContext, useContext, useState, useMemo } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const ExcelDataContext = createContext({ excelData: [], excelHeaders: [], setExcelData: () => {}, setExcelHeaders: () => {} });

export const ExcelDataProvider = ({ children }) => {
  const [excelData, setExcelData] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const value = useMemo(() => ({ excelData, excelHeaders, setExcelData, setExcelHeaders }), [excelData, excelHeaders]);
  return <ExcelDataContext.Provider value={value}>{children}</ExcelDataContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useExcelData = () => useContext(ExcelDataContext);
