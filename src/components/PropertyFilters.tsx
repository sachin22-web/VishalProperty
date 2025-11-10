import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFilterValues) => void;
}

export interface PropertyFilterValues {
  type: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const handleChange = (key: keyof PropertyFilterValues, value: string) => {
    const currentFilters = {
      type: (document.getElementById('filter-type') as HTMLSelectElement)?.value || "all",
      location: (document.getElementById('filter-location') as HTMLInputElement)?.value || "",
      minPrice: (document.getElementById('filter-min-price') as HTMLInputElement)?.value || "",
      maxPrice: (document.getElementById('filter-max-price') as HTMLInputElement)?.value || "",
      minArea: (document.getElementById('filter-min-area') as HTMLInputElement)?.value || "",
      maxArea: (document.getElementById('filter-max-area') as HTMLInputElement)?.value || "",
    };
    currentFilters[key] = value;
    onFilterChange(currentFilters);
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Filter Properties</h3>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Property Type</label>
          <Select defaultValue="all" onValueChange={(value) => handleChange('type', value)}>
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="flat">Flats</SelectItem>
              <SelectItem value="plot">Plots</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <Input 
            id="filter-location"
            placeholder="Search location..."
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Min Price (₹L)</label>
            <Input 
              id="filter-min-price"
              type="number"
              placeholder="Min"
              onChange={(e) => handleChange('minPrice', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Max Price (₹L)</label>
            <Input 
              id="filter-max-price"
              type="number"
              placeholder="Max"
              onChange={(e) => handleChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Min Area (sq.ft)</label>
            <Input 
              id="filter-min-area"
              type="number"
              placeholder="Min"
              onChange={(e) => handleChange('minArea', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Max Area (sq.ft)</label>
            <Input 
              id="filter-max-area"
              type="number"
              placeholder="Max"
              onChange={(e) => handleChange('maxArea', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
