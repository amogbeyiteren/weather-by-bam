import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";


// Define the shape of a single suggestion returned from LocationIQ
export interface LocationIQSuggestion {
  display_name: string;
  display_place?: string;
  display_address: string;
  address:{
    name?: string;
    city?: string;
    country: string;
  }
  lat: string;
  lon: string;
  // ... any additional fields as needed
}

// Define the API response type (an array of suggestions)
type AutocompleteResponse = LocationIQSuggestion[];

// Define a type for our transformed suggestion
interface Suggestion {
  value: string;
  data: LocationIQSuggestion;
}

// Props for the LocationSearch component
interface LocationSearchProps {
  assetIcons: {
    searchIcon: string;
  };
  onSelect?: (data: LocationIQSuggestion) => void;
}

// A simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Helper function to highlight matching parts of the suggestion text
function highlight(text: string, query: string): string {
  if (!text || !query) return text;
  const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  assetIcons,
  onSelect,
}) => {
  const [query, setQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const debouncedQuery = useDebounce(query, 250);

  // Replace with your own LocationIQ API key
  const locationiqKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;

  // Use React Query to fetch autocomplete suggestions
  const { data, isLoading, error } = useQuery<AutocompleteResponse, Error>({
    queryKey: ["autocomplete", debouncedQuery],
    queryFn: async () => {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${locationiqKey}&q=${encodeURIComponent(
          debouncedQuery
        )}&format=json&limit=5`
      );
      if (!response.ok) {
        throw new Error("Error fetching autocomplete data");
      }
      return response.json();
    },
    enabled: debouncedQuery.length >= 2,
  });

  // Transform the API response into our Suggestion type
  const suggestions: Suggestion[] = data
    ? data.map((item) => ({
        value: item.display_name,
        data: item,
      }))
    : [];

  // Handle selection of a suggestion
  const handleSelect = (suggestion: Suggestion): void => {
    setQuery(suggestion.value);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(suggestion.data);
    } else {

    }
  };

  // Add handler for input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div className="relative">
      <form
        onSubmit={(e: FormEvent) => e.preventDefault()}
        className=" border border-white/30 font-rubik rounded-lg w-[300px] h-[40px] flex items-center justify-start px-4 py-2 gap-1"
      >
        <img src={assetIcons.searchIcon} alt="Search" className="w-3 h-3" />
        <input
          type="text"
          placeholder="Search Location"
          className="w-full h-full bg-transparent border-none outline-none text-start text-[#CCCCCC] text-[14px] placeholder-[#CCCCCC]"
          value={query}
          onChange={handleInputChange}
        />
      </form>

      {/* Display loading or error states if applicable */}
      {showSuggestions && isLoading && (
        <div className="absolute top-[40px] flex justify-center items-center z-10 bg-[rgba(1,24,78,0.95)] rounded-md w-[300px] mt-1 p-2 text-white">
          <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}
      {showSuggestions && error && (
        <div className="absolute top-[40px] z-10 bg-[rgba(1,24,78,0.95)] rounded-md w-[300px] mt-1 p-2 text-red-500">
          Error loading suggestions.
        </div>
      )}

      {/* Render suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-[40px] z-10  bg-[rgba(1,24,78,0.95)] rounded-[8px] w-[300px] mt-1 overflow-y-auto">
          {suggestions.slice(0, 5).map((sugg, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-[rgba(23,38,92,0.6)] w-full border-b border-white/30"
              onClick={() => handleSelect(sugg)}
            >
              <div
                className="autocomplete-suggestion-name text-[16px] text-white text-start tracking-[0.03em] "
                dangerouslySetInnerHTML={{
                  __html: highlight(
                    sugg.data.display_place || sugg.value,
                    query
                  ),
                }}
              />
              <div
                className="autocomplete-suggestion-address text-[14px] text-white/80 text-start tracking-[0.03em] "
                dangerouslySetInnerHTML={{
                  __html: highlight(sugg.data.display_address || "", query),
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
