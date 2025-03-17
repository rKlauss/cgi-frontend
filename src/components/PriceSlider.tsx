import React from "react";

interface PriceSliderProps {
  maxPrice: number;
  setMaxPrice: (value: number) => void;
}

const PriceSlider: React.FC<PriceSliderProps> = ({ maxPrice, setMaxPrice }) => {
  return (
    <div className="mb-4 flex flex-col items-center w-full">
      <span className="font-semibold mb-1">Max Price: {maxPrice}€</span>

      <div className="relative w-3/5 h-10 flex items-center">
        {/* riba */}
        <div className="absolute left-0 right-0 h-2 bg-gray-300 rounded-full"></div>

        <div
          className="absolute h-2 bg-yellow-500 rounded-full"
          style={{
            left: 0,
            width: `${(maxPrice / 350) * 100}%`,
          }}
        ></div>

        <input
          type="range"
          min="0"
          max="350"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
          style={{
            zIndex: 10,
          }}
        />
      </div>

      <div className="w-3/5 flex justify-between text-sm mt-1">
        <span>0€</span>
        <span>350€</span>
      </div>
    </div>
  );
};

export default PriceSlider;
