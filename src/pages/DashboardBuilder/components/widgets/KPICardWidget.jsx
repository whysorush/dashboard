// src/pages/DashboardBuilder/components/widgets/KPICardWidget.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiActivity } from "react-icons/fi";
import { useThemeStyles } from "../../../../utils/themeUtils";
import { useExcelData } from "../ExcelDataContext";
import { computeKPIValues } from "../../utils/excelDataTransforms";

const KPICardWidget = ({ widget, isSelected, onClick }) => {
  const { getChartColors, getStyleProperties, getCSSVariables } =
    useThemeStyles();
  const { excelData, excelHeaders } = useExcelData();

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();

  // Static fallback KPI data (used when no API URL is configured)
  const fallbackData = useMemo(() => ({
    value: 42567,
    previousValue: 38234,
    label: widget.config?.title || "Total Revenue",
    change: (((42567 - 38234) / 38234) * 100).toFixed(1),
    trend: [65, 72, 68, 75, 82, 79, 88, 92, 85, 95, 98, 102],
  }), [widget.config?.title]);

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = widget?.config?.apiUrl;

  const excelKpi = useMemo(() => {
    return computeKPIValues(excelData, excelHeaders, {
      valueHeaders: widget?.config?.valueHeaders,
      aggregation: widget?.config?.aggregation || "total",
      allowedHeaders: [
        "unit_cost_price",
        "unit_sale_price",
        "total_sale_price",
      ],
    });
  }, [
    excelData,
    excelHeaders,
    widget?.config?.valueHeaders,
    widget?.config?.aggregation,
  ]);

  const excelDerivedData = useMemo(() => {
    if (!excelKpi.hasExcelData || excelKpi.rejectedByAllowedHeaders) return null;
    const sparklineValues = excelKpi.values.slice(-Math.max(12, excelKpi.values.length));

    return {
      value: excelKpi.primaryValue,
      previousValue: excelKpi.previous,
      label: widget.config?.title || "",
      change: Number.isFinite(excelKpi.change) ? excelKpi.change.toFixed(1) : "0.0",
      trend: sparklineValues.length ? sparklineValues : [excelKpi.primaryValue],
    };
  }, [excelKpi, widget.config?.title]);

  useEffect(() => {
    if (!apiUrl) {
      // No API configured → use fallback
      setApiData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(apiUrl, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // Normalize and basic validation: accept object or array[0]
        const normalized = Array.isArray(json) ? json[0] : json;
        const hasData = normalized && Object.keys(normalized || {}).length > 0;
        if (isMounted) setApiData(hasData ? normalized : null);
      } catch (e) {
        if (isMounted && e.name !== "AbortError") {
          setError(e.message || "Failed to load");
          setApiData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [apiUrl]);

  const formatValue = (value) => {
    const format = widget.config?.numberFormat || "number";

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value}%`;
      case "abbreviated":
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
      default:
        return value.toLocaleString();
    }
  };

  // Decide which data to render
  const effectiveData = apiUrl
    ? apiData
    : excelDerivedData || (excelKpi.rejectedByAllowedHeaders ? null : fallbackData);
  const isBlank = apiUrl
    ? !loading && (!effectiveData || error)
    : !effectiveData;
  const blankMessage = excelKpi.rejectedByAllowedHeaders
    ? "Select unit_cost_price, unit_sale_price, or total_sale_price"
    : "No data available";
  const isPositive = !isBlank && parseFloat((effectiveData?.change ?? 0)) > 0;

  return (
    <div 
      style={cssVariables} 
      className="chart-container"
      onClick={onClick}
      data-selected={Boolean(isSelected)}
    >
      {/* Blank state when API configured but no data or error */}
      {isBlank && (
        <div className="flex items-center justify-center h-24 text-sm text-gray-400">
          {blankMessage}
        </div>
      )}

      {!isBlank && (
        <>
        {/* Icon */}
      <div className="mb-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: `${colors.primary}20`,
            borderRadius: styleProps.borderRadius,
          }}
        >
          <FiActivity
            className="w-6 h-6"
            style={{ color: colors.primary }}
          />
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        <div
          className="text-3xl font-bold"
          style={{
            color: colors.text,
            fontFamily: styleProps.fontFamily,
          }}
        >
          {formatValue(effectiveData?.value ?? 0)}
        </div>
      </div>

      {/* Change Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center gap-1 text-sm font-medium"
          style={{
            color: isPositive ? "#22c55e" : "#ef4444",
          }}
        >
          {isPositive ? (
            <FiTrendingUp className="w-4 h-4" />
          ) : (
            <FiTrendingDown className="w-4 h-4" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {(effectiveData?.change ?? 0)}%
          </span>
        </div>
        <span className="text-xs" style={{ color: colors.textSecondary }}>
          vs last period
        </span>
      </div>

      {/* Sparkline */}
      {widget.config?.showSparkline !== false && (
        <div className="h-12 w-full">
          <svg className="w-full h-full">
            <polyline
              fill="none"
              stroke={colors.primary}
              strokeWidth="2"
              points={(() => {
                const trendArray = effectiveData?.trend || [];
                if (!trendArray.length) return "";
                const denom = Math.max(trendArray.length - 1, 1);
                return trendArray
                  .map(
                    (value, index) =>
                      `${index * (100 / denom)},${50 - (value - 50) * 0.4}`
                  )
                  .join(" ");
              })()}
              className="opacity-50"
            />
          </svg>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default KPICardWidget;
