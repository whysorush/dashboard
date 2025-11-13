const PREFERRED_VALUE_HEADERS = [
  "value",
  "values",
 "amount",
  "revenue",
  "sales",
  "total",
  "totals",
  "quantity",
  "qty",
  "count",
  "counts",
  "score",
  "metric",
  "metrics",
  "volume",
  "profit",
  "margin",
];

const PREFERRED_CATEGORY_HEADERS = [
  "name",
  "label",
  "category",
  "segment",
  "type",
  "product",
  "item",
  "region",
  "country",
  "state",
  "city",
  "month",
  "date",
  "period",
  "week",
  "day",
  "department",
  "channel",
];

const CLEAN_NUMERIC_CHARS_REGEX = /[^0-9.-]+/g;
const TEMPORAL_KEYWORDS = [
  "date",
  "time",
  "day",
  "week",
  "month",
  "quarter",
  "year",
  "hour",
  "minute",
  "second",
];
const DISALLOWED_ID_KEYWORDS = [
  "id",
  "sku",
  "customer",
  "order",
  "category",
  "channel",
  "code",
  "state",
  "name",
  "particular",
  "product",
];

export const coerceNumber = (value) => {
  if (value === null || value === undefined) return NaN;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return NaN;

    // Handle parentheses for negatives e.g. (123)
    const isNegative = trimmed.startsWith("(") && trimmed.endsWith(")");
    const normalized = trimmed
      .replace(/[()%]/g, "")
      .replace(/,/g, "")
      .replace(CLEAN_NUMERIC_CHARS_REGEX, "");

    if (!normalized) return NaN;
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) return NaN;
    return isNegative ? -parsed : parsed;
  }
  if (typeof value === "object") {
    // Attempt to read primitive value (e.g. Date, BigInt not supported)
    const primitive = Number(value);
    return Number.isFinite(primitive) ? primitive : NaN;
  }
  return NaN;
};

const sanitizeHeaders = (headers) =>
  Array.isArray(headers)
    ? headers
        .map((header) => (header == null ? "" : String(header).trim()))
        .filter((header) => header.length > 0)
    : [];

const getRowArray = (rows) => (Array.isArray(rows) ? rows : []);

const computeHeaderStats = (rowArray, header) => {
  const stats = {
    header,
    numericCount: 0,
    stringCount: 0,
    emptyCount: 0,
    numericSum: 0,
    numericMaxAbs: 0,
    samples: new Set(),
  };

  rowArray.forEach((row) => {
    const cell = row?.[header];
    if (cell === null || cell === undefined || cell === "") {
      stats.emptyCount += 1;
      return;
    }

    const coerced = coerceNumber(cell);
    if (!Number.isNaN(coerced)) {
      stats.numericCount += 1;
      stats.numericSum += coerced;
      stats.numericMaxAbs = Math.max(stats.numericMaxAbs, Math.abs(coerced));
    } else {
      stats.stringCount += 1;
      stats.samples.add(String(cell));
    }
  });

  stats.totalCount = rowArray.length;
  stats.numericRatio =
    rowArray.length === 0 ? 0 : stats.numericCount / rowArray.length;
  stats.sampleStrings = Array.from(stats.samples);
  stats.uniqueStringCount = stats.samples.size;

  return stats;
};

const scorePreferredHeader = (header, preferredList) => {
  const idx = preferredList.indexOf(header.toLowerCase());
  return idx === -1 ? Number.POSITIVE_INFINITY : idx;
};

const inferValueHeaders = (statsList, { exclude = new Set(), maxSeries = 2 } = {}) => {
  const candidates = statsList
    .filter((stats) => !exclude.has(stats.header) && stats.numericCount > 0)
    .map((stats) => ({
      header: stats.header,
      stats,
      preferredScore: scorePreferredHeader(stats.header, PREFERRED_VALUE_HEADERS),
    }))
    .sort((a, b) => {
      if (a.preferredScore !== b.preferredScore) {
        return a.preferredScore - b.preferredScore;
      }
      if (b.stats.numericRatio !== a.stats.numericRatio) {
        return b.stats.numericRatio - a.stats.numericRatio;
      }
      if (b.stats.numericMaxAbs !== a.stats.numericMaxAbs) {
        return b.stats.numericMaxAbs - a.stats.numericMaxAbs;
      }
      return b.stats.numericSum - a.stats.numericSum;
    });

  return candidates.slice(0, Math.max(1, maxSeries)).map((c) => c.header);
};

const inferCategoryHeader = (statsList, { exclude = new Set() } = {}) => {
  const candidates = statsList
    .filter((stats) => !exclude.has(stats.header))
    .map((stats) => ({
      header: stats.header,
      stats,
      preferredScore: scorePreferredHeader(stats.header, PREFERRED_CATEGORY_HEADERS),
    }))
    .sort((a, b) => {
      if (a.preferredScore !== b.preferredScore) {
        return a.preferredScore - b.preferredScore;
      }
      if (b.stats.stringCount !== a.stats.stringCount) {
        return b.stats.stringCount - a.stats.stringCount;
      }
      if (b.stats.uniqueStringCount !== a.stats.uniqueStringCount) {
        return b.stats.uniqueStringCount - a.stats.uniqueStringCount;
      }
      if (a.stats.numericRatio !== b.stats.numericRatio) {
        return a.stats.numericRatio - b.stats.numericRatio;
      }
      return a.stats.emptyCount - b.stats.emptyCount;
    });

  return candidates.length > 0 ? candidates[0].header : null;
};

export const prepareChartSeries = (
  excelData,
  excelHeaders,
  {
    limit,
    categoryHeader: explicitCategory,
    valueHeaders: explicitValueHeaders,
    maxValueSeries = 2,
  } = {}
) => {
  const headers = sanitizeHeaders(excelHeaders);
  const rows = getRowArray(excelData);

  if (!headers.length || !rows.length) {
    return {
      hasExcelData: false,
      data: [],
      categoryHeader: null,
      valueHeaders: [],
      headerStats: [],
    };
  }

  const headerStats = headers.map((header) => computeHeaderStats(rows, header));
  const headerSet = new Set(headers);
  const exclude = new Set();

  let categoryHeader = null;
  if (explicitCategory && headerSet.has(explicitCategory)) {
    categoryHeader = explicitCategory;
  } else {
    categoryHeader = inferCategoryHeader(headerStats);
  }
  if (categoryHeader) {
    exclude.add(categoryHeader);
  }

  let valueHeaders = [];
  if (Array.isArray(explicitValueHeaders) && explicitValueHeaders.length > 0) {
    valueHeaders = explicitValueHeaders.filter(
      (header) => headerSet.has(header) && !exclude.has(header)
    );
  }

  if (!valueHeaders.length) {
    valueHeaders = inferValueHeaders(headerStats, {
      exclude,
      maxSeries: maxValueSeries,
    });
  }

  if (!valueHeaders.length) {
    // As a last resort, pick the first non-excluded header
    valueHeaders = headers.filter((header) => !exclude.has(header)).slice(0, 1);
  }

  const sliceLimit =
    typeof limit === "number" && limit > 0 ? Math.min(limit, rows.length) : rows.length;

  const data = rows.slice(0, sliceLimit).map((row, index) => {
    const entry = {};
    if (categoryHeader) {
      const raw = row?.[categoryHeader];
      entry.name =
        raw === undefined || raw === null || raw === ""
          ? `Row ${index + 1}`
          : String(raw);
    } else {
      entry.name = `Row ${index + 1}`;
    }

    valueHeaders.forEach((header, idx) => {
      const key = idx === 0 ? "value" : `value${idx + 1}`;
      const num = coerceNumber(row?.[header]);
      entry[key] = Number.isFinite(num) ? num : 0;
    });

    return entry;
  });

  return {
    hasExcelData: true,
    data,
    categoryHeader,
    valueHeaders,
    headerStats,
  };
};

export const computeKPIValues = (
  excelData,
  excelHeaders,
  {
    valueHeaders: explicitValueHeaders,
    aggregation = "total",
    allowedHeaders = null,
  } = {}
) => {
  const rows = getRowArray(excelData);
  const headers = sanitizeHeaders(excelHeaders);

  if (!rows.length || !headers.length) {
    return {
      hasExcelData: false,
      valueHeader: null,
      total: 0,
      latest: 0,
      previous: 0,
      change: 0,
      average: 0,
      values: [],
      rejectedByAllowedHeaders: false,
      rejectedTemporalHeader: false,
      rejectedByIdLikeHeader: false,
    };
  }

  const headerStats = headers.map((header) => computeHeaderStats(rows, header));

  const matchHeader = (target) => {
    if (typeof target !== "string") return null;
    const lower = target.trim().toLowerCase();
    return headers.find((header) => header.toLowerCase() === lower) || null;
  };

  const allowedHeadersArray =
    Array.isArray(allowedHeaders) && allowedHeaders.length > 0
      ? allowedHeaders
      : null;
  const allowedSet = allowedHeadersArray
    ? new Set(allowedHeadersArray.map((header) => header.toLowerCase()))
    : null;
  const allowedOrder = allowedHeadersArray
    ? allowedHeadersArray.map((header) => header.toLowerCase())
    : [];

  const candidateHeaders = [];
  const temporalBlocks = new Set();
  const idBlocks = new Set();
  const isTemporalHeader = (header) => {
    if (!header) return false;
    const lower = header.toLowerCase();
    return TEMPORAL_KEYWORDS.some((keyword) => lower.includes(keyword));
  };
  const isIdLikeHeader = (header) => {
    if (!header) return false;
    const lower = header.toLowerCase();
    return DISALLOWED_ID_KEYWORDS.some((keyword) => lower.includes(keyword));
  };
  const collectCandidate = (header) => {
    if (!header) return;
    const lower = header.toLowerCase();
    if (allowedSet && !allowedSet.has(lower)) return;
    if (candidateHeaders.some((existing) => existing.toLowerCase() === lower))
      return;
    if (isTemporalHeader(header)) {
      temporalBlocks.add(header);
      return;
    }
    if (!allowedSet && isIdLikeHeader(header)) {
      idBlocks.add(header);
      return;
    }
    candidateHeaders.push(header);
  };

  if (Array.isArray(explicitValueHeaders) && explicitValueHeaders.length > 0) {
    explicitValueHeaders.forEach((header) => {
      const matched = matchHeader(header);
      collectCandidate(matched);
    });
  } else if (typeof explicitValueHeaders === "string") {
    collectCandidate(matchHeader(explicitValueHeaders));
  }

  if (!candidateHeaders.length) {
    if (allowedSet) {
      const searchOrder = allowedOrder.length
        ? allowedOrder
        : Array.from(allowedSet);
      searchOrder.some((allowedName) => {
        const stat = headerStats.find(
          (stats) =>
            stats.header.toLowerCase() === allowedName &&
            stats.numericCount > 0
        );
        if (stat) {
          collectCandidate(stat.header);
          return true;
        }
        return false;
      });
    } else {
      const inferred = inferValueHeaders(headerStats, { maxSeries: 1 });
      inferred.forEach(collectCandidate);
    }
  }

  if (!candidateHeaders.length && !allowedSet) {
    const firstNumeric = headerStats.find((stats) => stats.numericCount > 0);
    if (firstNumeric) {
      collectCandidate(firstNumeric.header);
    }
  }

  if (candidateHeaders.length === 0 && temporalBlocks.size > 0) {
    const blockedHeader = temporalBlocks.values().next().value || null;
    return {
      hasExcelData: true,
      valueHeader: blockedHeader,
      total: 0,
      latest: 0,
      previous: 0,
      change: 0,
      average: 0,
      primaryValue: 0,
      values: [],
      rejectedByAllowedHeaders: false,
      rejectedTemporalHeader: true,
      rejectedByIdLikeHeader: idBlocks.size > 0,
    };
  }

  if (allowedSet && candidateHeaders.length === 0) {
    return {
      hasExcelData: false,
      valueHeader: null,
      total: 0,
      latest: 0,
      previous: 0,
      change: 0,
      average: 0,
      values: [],
      rejectedByAllowedHeaders: true,
      rejectedTemporalHeader: temporalBlocks.size > 0,
      rejectedByIdLikeHeader: idBlocks.size > 0,
    };
  }

  if (candidateHeaders.length === 0 && idBlocks.size > 0) {
    const blockedHeader = idBlocks.values().next().value || null;
    return {
      hasExcelData: true,
      valueHeader: blockedHeader,
      total: 0,
      latest: 0,
      previous: 0,
      change: 0,
      average: 0,
      primaryValue: 0,
      values: [],
      rejectedByAllowedHeaders: false,
      rejectedTemporalHeader: temporalBlocks.size > 0,
      rejectedByIdLikeHeader: true,
    };
  }

  const valueHeader = candidateHeaders[0];
  if (!valueHeader) {
    return {
      hasExcelData: false,
      valueHeader: null,
      total: 0,
      latest: 0,
      previous: 0,
      change: 0,
      average: 0,
      values: [],
      rejectedByAllowedHeaders: false,
      rejectedTemporalHeader: false,
      rejectedByIdLikeHeader: false,
    };
  }

  const values = rows
    .map((row) => coerceNumber(row?.[valueHeader]))
    .filter((num) => Number.isFinite(num));

  if (!values.length) {
    return {
      hasExcelData: false,
      valueHeader,
      total: 0,
      latest: 0,
      previous: 0,
      change: 0,
      average: 0,
      values: [],
      rejectedByAllowedHeaders: false,
      rejectedTemporalHeader: false,
      rejectedByIdLikeHeader: false,
    };
  }

  const total = values.reduce((acc, val) => acc + val, 0);
  const latest = values[values.length - 1];
  const previous = values.length > 1 ? values[values.length - 2] : 0;
  const average = values.length > 0 ? total / values.length : 0;
  const change =
    values.length > 1 && previous !== 0
      ? ((latest - previous) / Math.abs(previous)) * 100
      : 0;

  let primaryValue = total;
  if (aggregation === "latest") {
    primaryValue = latest;
  } else if (aggregation === "average") {
    primaryValue = average;
  }

  return {
    hasExcelData: true,
    valueHeader,
    total,
    latest,
    previous,
    change,
    average,
    primaryValue,
    values,
    rejectedByAllowedHeaders: false,
    rejectedTemporalHeader: false,
    rejectedByIdLikeHeader: false,
  };
};

