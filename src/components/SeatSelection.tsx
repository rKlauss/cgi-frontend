import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface Seat {
  id: number;
  seatNumber: string;
  occupied: boolean;
  businessClass: boolean;
  price: number;
}

const SeatSelection: React.FC = () => {
  const location = useLocation();
  const flight = location.state?.flight;
  const flightId = flight?.id;

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [recommendedSeats, setRecommendedSeats] = useState<Seat[]>([]);
  const [filters, setFilters] = useState({
    isWindow: false,
    hasExtraLegroom: false,
    isNearExit: false,
  });

  useEffect(() => {
    if (!flightId) return;

    const fetchSeatPlan = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/seats/plan?flightId=${flightId}`
        );
        setSeats(response.data);
      } catch (error) {
        console.error("Error fetching seat plan:", error);
      }
    };

    fetchSeatPlan();
  }, [flightId]);

  useEffect(() => {
    if (!flightId) return;

    const fetchRecommendedSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/flights/${flightId}/seats/recommend`,
          { params: { ...filters, count: 3 } }
        );
        setRecommendedSeats(response.data);
      } catch (error) {
        console.error("Error fetching recommended seats:", error);
      }
    };

    fetchRecommendedSeats();
  }, [filters, flightId]);

  const groupedSeats: { [key: string]: Seat[] } = {};
  seats.forEach((seat) => {
    const row = seat.seatNumber.match(/\d+/)?.[0];
    if (row) {
      if (!groupedSeats[row]) {
        groupedSeats[row] = [];
      }
      groupedSeats[row].push(seat);
    }
  });

  const sortedRows = Object.keys(groupedSeats).sort(
    (a, b) => Number(a) - Number(b)
  );

  const toggleSeatSelection = (seat: Seat) => {
    if (seat.occupied) return;

    setSelectedSeats((prevSelected) =>
      prevSelected.some((s) => s.id === seat.id)
        ? prevSelected.filter((s) => s.id !== seat.id)
        : [...prevSelected, seat]
    );
  };

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const totalPrice = selectedSeats
    .reduce((sum, seat) => sum + seat.price, 0)
    .toFixed(2);

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Seat Selection for Flight {flightId}
      </h1>
      <h2 className="text-lg mb-4">
        {flight?.origin} → {flight?.destination}
      </h2>

      {/* Filtrid */}
      <div className="mb-4 flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.isWindow}
            onChange={() => handleFilterChange("isWindow")}
          />
          <span>Window Seat</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.hasExtraLegroom}
            onChange={() => handleFilterChange("hasExtraLegroom")}
          />
          <span>Extra Legroom</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.isNearExit}
            onChange={() => handleFilterChange("isNearExit")}
          />
          <span>Near Exit</span>
        </label>
      </div>

      <div className="flex">
        {/* Istmete paigutus */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {sortedRows.map((row, index) => (
            <div
              key={row}
              className={`flex items-center space-x-2 ${
                index === 1 ? "mb-6" : "mb-2"
              }`}
            >
              <span className="font-bold w-6 text-center">{row}</span>
              <div className="flex">
                {groupedSeats[row]
                  .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                  .map((seat) => {
                    const isC = seat.seatNumber.endsWith("C");
                    const isSelected = selectedSeats.some(
                      (s) => s.id === seat.id
                    );
                    const isRecommended = recommendedSeats.some(
                      (s) => s.id === seat.id
                    );

                    return (
                      <div
                        key={seat.id}
                        className={`w-12 h-12 flex items-center justify-center border rounded text-sm font-semibold cursor-pointer
                          ${
                            seat.occupied
                              ? "bg-red-500 text-white"
                              : isSelected
                              ? "bg-blue-500 text-white"
                              : isRecommended
                              ? "bg-orange-500 text-white"
                              : seat.businessClass
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          }
                          ${isC ? "mr-8" : ""} 
                        `}
                        onClick={() => toggleSeatSelection(seat)}
                      >
                        {seat.seatNumber.replace(/\d+/, "")}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Valitud istmed */}
        <div className="ml-8 p-4 bg-white rounded-lg shadow-lg w-64">
          <h2 className="text-xl font-semibold mb-2">Your Selection</h2>
          {selectedSeats.length > 0 ? (
            <ul className="mb-2">
              {selectedSeats.map((seat) => (
                <li key={seat.id} className="text-sm">
                  Seat {seat.seatNumber} - {seat.price} €
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No seats selected</p>
          )}
          <hr className="my-2" />
          <p className="text-lg font-bold">Total: {totalPrice} €</p>
          <button className="mt-4 w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-600">
            Book Now
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex space-x-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-yellow-500 border rounded mr-2"></div>
          <span>Business Class</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-500 border rounded mr-2"></div>
          <span>Economy Class</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-orange-500 border rounded mr-2"></div>
          <span>Recommended</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 border rounded mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-red-500 border rounded mr-2"></div>
          <span>Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
