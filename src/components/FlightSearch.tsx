import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PriceSlider from "./PriceSlider";

interface Flight {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  price: number;
}

const FlightSearch: React.FC = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [maxPrice, setMaxPrice] = useState(350);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const searchFlights = async () => {
    try {
      const params: { origin?: string; destination?: string; date?: string } =
        {};
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;
      if (date) params.date = date;

      const response = await axios.get("http://localhost:8080/flights/search", {
        params,
      });

      const allFlights: Flight[] = response.data;

      if (date && allFlights.length === 0) {
        setErrorMessage("No flights this day!");
        setFlights([]);
        return;
      }

      const filteredFlights = allFlights.filter(
        (flight) => flight.price <= maxPrice
      );

      setFlights(filteredFlights);

      if (filteredFlights.length === 0) {
        setErrorMessage("Max Price too low - No flights found!");
      } else {
        setErrorMessage(""); 
      }
    } catch (err) {
      console.log(err, "Error finding flights.");
    }
  };

  const clearFilters = () => {
    setOrigin("");
    setDestination("");
    setDate("");
    setMaxPrice(350);
    setFlights([]);
    setErrorMessage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Book Flights
        </h1>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="From"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="To"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <PriceSlider maxPrice={maxPrice} setMaxPrice={setMaxPrice} />

        {errorMessage && (
          <div className="text-red-500 text-center font-semibold mb-2">
            {errorMessage}
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={searchFlights}
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-600"
          >
            Search Flights
          </button>

          <button
            onClick={clearFilters}
            className="w-full bg-gray-300 text-black font-bold py-2 rounded hover:bg-gray-400"
          >
            Clear Filters
          </button>
        </div>

        {flights.length > 0 && (
          <div className="mt-4 bg-gray-200 p-2 rounded font-semibold flex justify-between text-sm">
            <span className="w-2/5">Location</span>
            <span className="w-1/5 text-center">Date</span>
            <span className="w-1/5 text-center">Time</span>
            <span className="w-1/5 text-right">Price</span>
          </div>
        )}

        <ul className="mt-2">
          {flights.map((flight) => {
            const dateObj = new Date(flight.departureTime);
            const dateStr = dateObj.toISOString().split("T")[0];
            const timeStr = dateObj.toTimeString().split(" ")[0].slice(0, 5);

            return (
              <li
                key={flight.id}
                className="border-b py-2 cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-between text-sm"
                onClick={() =>
                  navigate(`/seat-selection`, { state: { flight } })
                }
              >
                <span className="w-2/5">
                  {flight.origin} - {flight.destination}
                </span>
                <span className="w-1/5 text-center">{dateStr}</span>
                <span className="w-1/5 text-center">{timeStr}</span>
                <span className="w-1/5 text-right font-bold">
                  {flight.price} €
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FlightSearch;
