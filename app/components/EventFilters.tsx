"use client";

interface EventFiltersProps {
  searchName: string;
  searchDate: string;
  onSearchNameChange: (value: string) => void;
  onSearchDateChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function EventFilters({
  searchName,
  searchDate,
  onSearchNameChange,
  onSearchDateChange,
  onClearFilters,
}: EventFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Search Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search by Name */}
        <div>
          <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-2">
            Event Name
          </label>
          <input
            type="text"
            id="searchName"
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Search by Date */}
        <div>
          <label htmlFor="searchDate" className="block text-sm font-medium text-gray-700 mb-2">
            Event Date
          </label>
          <input
            type="date"
            id="searchDate"
            value={searchDate}
            onChange={(e) => onSearchDateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
