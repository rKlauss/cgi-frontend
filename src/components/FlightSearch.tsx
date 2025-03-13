import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      setFlights(response.data);
    } catch (err) {
      console.log(err, "Error finding flights.");
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    navigate(`/seat-selection`, { state: { flight } });
  };

  // Kuupäeva ja kellaaeg
  const formatDateTime = (dateTime: string) => {
    const dateObj = new Date(dateTime);
    const dateStr = dateObj.toISOString().split("T")[0];
    const timeStr = dateObj.toTimeString().split(" ")[0].slice(0, 5);
    return { dateStr, timeStr };
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
        <button
          onClick={searchFlights}
          className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-600"
        >
          Search Flights
        </button>

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
            const { dateStr, timeStr } = formatDateTime(flight.departureTime);
            return (
              <li
                key={flight.id}
                className="border-b py-2 cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-between text-sm"
                onClick={() => handleFlightSelect(flight)}
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
