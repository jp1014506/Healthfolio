import { useState, useEffect } from 'react';
import { Search, MapPin, Plus, X, DollarSign } from 'lucide-react';
import { parseCSVData } from '../utils/dataParser';

export default function MedicalCostLookup() {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('National');
  const [procedures, setProcedures] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [isUsingLocation, setIsUsingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState(['National']);
  const [error, setError] = useState(null);

  // Search functionality
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const data = await parseCSVData('/data/2022_cms_data.csv');
        console.log(data);
        setProcedures(data.procedures);
        setAvailableLocations(data.availableLocations);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load medical procedure data. Please try again later.");
        setIsLoading(false);

        loadMockData();
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = procedures.filter(p =>
      p.name.toLowerCase().includes(term) || p.code.includes(term)
    );

    setSearchResults(results);
  }, [searchTerm, procedures]);

  const loadMockData = () => {
    const mockProcedures = [
      { id: 1, code: "039", name: "Extracranial Procedures", nationalAvgCost: 15892, locations: { "California": 18245, "New York": 19432, "Texas": 14567 } },
      { id: 2, code: "057", name: "Degenerative Nervous System Disorders", nationalAvgCost: 9324, locations: { "California": 10754, "New York": 11342, "Texas": 8945 } },
      { id: 3, code: "064", name: "Intracranial Hemorrhage or Stroke", nationalAvgCost: 12654, locations: { "California": 14567, "New York": 15243, "Texas": 11876 } },
      { id: 4, code: "103", name: "Heart Failure & Shock", nationalAvgCost: 7432, locations: { "California": 8765, "New York": 9243, "Texas": 6987 } },
      { id: 5, code: "193", name: "Simple Pneumonia & Pleurisy", nationalAvgCost: 6543, locations: { "California": 7653, "New York": 8123, "Texas": 6214 } },
      { id: 6, code: "207", name: "Respiratory System Diagnosis", nationalAvgCost: 5678, locations: { "California": 6432, "New York": 7123, "Texas": 5432 } },
      { id: 7, code: "233", name: "Coronary Bypass", nationalAvgCost: 28456, locations: { "California": 32456, "New York": 34123, "Texas": 26754 } },
      { id: 8, code: "234", name: "Coronary Angioplasty", nationalAvgCost: 18543, locations: { "California": 21456, "New York": 22876, "Texas": 17654 } },
      { id: 9, code: "292", name: "Heart Catheterization", nationalAvgCost: 7865, locations: { "California": 9126, "New York": 9653, "Texas": 7432 } },
      { id: 10, code: "301", name: "Hip Replacement", nationalAvgCost: 23456, locations: { "California": 27654, "New York": 28965, "Texas": 22123 } },
      { id: 11, code: "302", name: "Knee Replacement", nationalAvgCost: 19876, locations: { "California": 23456, "New York": 24789, "Texas": 18765 } },
      { id: 12, code: "470", name: "Major Joint Replacement", nationalAvgCost: 21543, locations: { "California": 25432, "New York": 26789, "Texas": 20432 } },
    ];

    setProcedures(mockProcedures);
    setAvailableLocations(['National', 'California', 'New York', 'Texas']);
  };

  // Handle procedure selection
  const addProcedure = (procedure) => {
    if (!selectedProcedures.some(p => p.id === procedure.id)) {
      setSelectedProcedures([...selectedProcedures, procedure]);
    }
  };

  // Remove procedure from selection
  const removeProcedure = (id) => {
    setSelectedProcedures(selectedProcedures.filter(p => p.id !== id));
  };

  // Calculate total cost of selected procedures
  const calculateTotalCost = () => {
    return selectedProcedures.reduce((total, procedure) => {
      if (isUsingLocation && location !== 'National' && procedure.locations && procedure.locations[location]) {
        return total + procedure.locations[location];
      }
      return total + procedure.nationalAvgCost;
    }, 0);
  };

  // Get cost based on location
  const getProcedureCost = (procedure) => {
    if (isUsingLocation && location !== 'National' && procedure.locations && procedure.locations[location]) {
      return procedure.locations[location];
    }
    return procedure.nationalAvgCost;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <>
      {/* Banner image */}
      <header className="pb-6 text-center">
        <img
          src="/assets/image/Banner.png"
          alt="Healthfolio Banner"
          className="mx-auto w-full h-auto rounded-lg shadow-md mb-6"
        />
      </header>

      <div className="max-w-4xl mx-auto p-6 h-full" style = {{ paddingBottom: "200px"}}>
        <header className="pb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-blue-800">Healthfolio</h1>
            <img
              src="/assets/image/healthfolioLogo.png"
              alt="Folder Icon"
              style={{ width: '50px', height: '50px', cursor: 'pointer' }}
            />
          </div>
          <p className="text-gray-600 mt-2">
            Search for medical procedures to see their costs based on CMS Medicare data
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Loading procedure data...</div>
          </div>
        ) : (
          <div>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for procedures by name or code..."
                  className="w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <MapPin className="text-blue-500 mr-2" size={20} />
                <label className="mr-4 font-medium">Use Location Data:</label>
                <input
                  type="checkbox"
                  checked={isUsingLocation}
                  onChange={() => setIsUsingLocation(!isUsingLocation)}
                  className="mr-6 h-4 w-4"
                />

                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!isUsingLocation}
                  className={`p-2 border rounded ${!isUsingLocation ? 'bg-gray-200' : 'bg-white'}`}
                >
                  {availableLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {isUsingLocation 
                  ? `Showing prices for ${location} location`
                  : 'Using national average data (enable location data for region-specific prices)'}
              </p>
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Search Results</h2>
                {searchResults.length > 0 ? (
                  <div className="bg-white border rounded-lg overflow-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Cost</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider\">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {searchResults.map(procedure => (
                          <tr key={procedure.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{procedure.code}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{procedure.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(getProcedureCost(procedure))}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => addProcedure(procedure)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Plus size={16} className="mr-1" /> Add
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No procedures found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Selected Procedures */}
            <div className="bg-blue-50 rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="text-blue-600 mr-2" size={20} />Your Cost Estimate
              </h2>
              
              {selectedProcedures.length > 0 ? (
                <div>
                  <div className="bg-white rounded-lg border overflow-hidden mb-4">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedProcedures.map(procedure => (
                          <tr key={procedure.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{procedure.code} - {procedure.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(getProcedureCost(procedure))}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button onClick={() => removeProcedure(procedure.id)} className="text-red-500 hover:text-red-700">
                                <X size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg">
                    <span className="text-lg font-medium">Total Estimated Cost:</span>
                    <span className="text-xl font-bold text-blue-800">{formatCurrency(calculateTotalCost())}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <p className="text-gray-500">Search for procedures and add them to your cost estimate</p>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-10 pt-4 border-t text-sm text-gray-500">
          <p>Data Source: CMS Medicare Inpatient Hospitals - by Geography and Service</p>
          <p className="mt-1">Note: These costs are estimates based on Medicare data and may not reflect your actual costs.</p>
        </footer>
      </div>
    </>
  );
}