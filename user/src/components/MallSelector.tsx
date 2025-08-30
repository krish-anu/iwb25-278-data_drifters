import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Mall {
  mallId: string;
  mallName: string;
  address: string;
}

interface MallSelectorProps {
  selectedMall: string;
  onMallChange: (mallId: string) => void;
}

const MallSelector = ({ selectedMall, onMallChange }: MallSelectorProps) => {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMalls = async () => {
      try {
        // For now, we'll use mock data since we don't have a dedicated malls endpoint
        // In a real implementation, you'd fetch from /malls endpoint
        const mockMalls: Mall[] = [
          { mallId: "M1", mallName: "Central Mall", address: "Downtown" },
          { mallId: "M2", mallName: "Westside Mall", address: "West District" },
          { mallId: "M3", mallName: "East Plaza", address: "East District" },
        ];
        setMalls(mockMalls);
      } catch (error) {
        console.error("Error fetching malls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMalls();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">Loading malls...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium">Select Mall:</label>
      <select
        value={selectedMall}
        onChange={(e) => {
          const mallId = e.target.value;
          onMallChange(mallId);
          navigate(`/mall/${mallId}`);
        }}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      >
        {malls.map((mall) => (
          <option key={mall.mallId} value={mall.mallId}>
            {mall.mallName} - {mall.address}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MallSelector;
