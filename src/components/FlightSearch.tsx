import React, { useState } from 'react';
import axios from 'axios';

interface Flight {
  id: number;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  price: number;
}

const FlightSearch: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchFlights = async () => {
    setLoading(true);
    setError('');
    try {
      const params: { origin?: string; destination?: string; date?: string } = {};
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;
      if (date) params.date = date;
      const response = await axios.get('http://localhost:8080/flights/search', { params });
      setFlights(response.data);
    } catch (err) {
      console.log(err, 'Error finding flights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Book flight</h1>
      <div>
        <label>
          From:
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          To:
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Depart:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>
      <button onClick={searchFlights}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            {flight.origin} - {flight.destination} ({flight.departureDate} {flight.departureTime}) - {flight.price} €
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;
