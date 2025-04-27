import Papa from 'papaparse';

// Function to parse CSV data
export const parseCSVData = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          // Process the data into the format needed by the application
          const processedData = processCMSData(results.data);
          resolve(processedData);
        }
      });
    });
  } catch (error) {
    console.error('Error loading or parsing CSV data:', error);
    return [];
  }
};

// Process the raw CMS data into the format needed by the application
const processCMSData = (rawData) => {
  // This implementation will depend on the exact structure of your CMS data
  // Here's a simplified example assuming certain columns exist
  
  const processedData = [];
  const locationMap = new Map();
  
  // First pass: identify all unique locations
  rawData.forEach(row => {
    if (row.Geography && !locationMap.has(row.Geography)) {
      locationMap.set(row.Geography, true);
    }
  });
  
  // Convert to array (excluding any empty values)
  const locations = Array.from(locationMap.keys()).filter(Boolean);
  
  // Add National as the default
  locations.unshift('National');
  
  // Second pass: organize by procedure
  const procedureMap = new Map();
  
  rawData.forEach(row => {
    // Skip rows with missing essential data
    if (!row.DRG_Code || !row.DRG_Description || !row.Average_Total_Payments) {
      return;
    }
    
    const code = row.DRG_Code;
    const name = row.DRG_Description;
    const location = row.Geography || 'National';
    const cost = parseFloat(row.Average_Total_Payments.replace(/[^0-9.]/g, ''));
    
    if (isNaN(cost)) return;
    
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
  
  return {
    procedures: Array.from(procedureMap.values()),
    availableLocations: locations
  };
};

export default parseCSVData;