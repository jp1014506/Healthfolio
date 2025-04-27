import Papa from 'papaparse';

export const parseCSVData = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processedData = processCMSData(results.data);
          resolve(processedData);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error.message);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error('Error loading or parsing CSV data:', error);
    return [];
  }
};

const processCMSData = (rawData) => {
  const procedureMap = new Map();
  const locationMap = new Set();

  rawData.forEach((row) => {
    if (!row.DRG_Cd || !row.DRG_Desc || !row.Avg_Tot_Pymt_Amt || !row.Rndrng_Prvdr_Geo_Desc) {
      console.warn("Skipping invalid row:", row);
      return;
    }

    const code = row.DRG_Cd.trim();
    const name = row.DRG_Desc.trim();
    const location = row.Rndrng_Prvdr_Geo_Desc?.trim() || 'National';
    const cost = parseFloat(row.Avg_Tot_Pymt_Amt.replace(/[^0-9.]/g, ''));

    if (isNaN(cost)) {
      console.warn("Invalid cost value for row:", row);
      return;
    }

    locationMap.add(location);

    if (!procedureMap.has(code)) {
      procedureMap.set(code, {
        id: code,
        code,
        name,
        nationalAvgCost: 0,
        locations: {}
      });
    }

    const procedure = procedureMap.get(code);

    if (location === 'National') {
      procedure.nationalAvgCost = cost;
    } else {
      procedure.locations[location] = cost;
    }
  });

  const availableLocations = Array.from(locationMap).filter(Boolean);
  availableLocations.unshift('National');

  return {
    procedures: Array.from(procedureMap.values()),
    availableLocations,
  };
};

export default parseCSVData;