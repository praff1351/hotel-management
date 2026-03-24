import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount,
    );
    navigate("/search")
  };

  const handleClear = () => {
    setDestination("");
    setAdultCount(1);
    setChildCount(0);
    setCheckIn(new Date());
    setCheckOut(new Date());
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-white rounded-lg shadow-lg grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-3"
    >
      {/* Destination */}
      <div className="flex flex-row items-center bg-gray-50 border border-gray-200 rounded p-2">
        <MdTravelExplore size={22} className="mr-2 text-gray-400 shrink-0" />
        <input
          placeholder="Where are you going?"
          className="text-sm w-full focus:outline-none bg-transparent"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      {/* Guests */}
      <div className="flex bg-gray-50 border border-gray-200 rounded px-3 py-2 gap-4">
        <label className="flex items-center gap-1 text-sm text-gray-600">
          Adults:
          <input
            className="w-12 p-1 focus:outline-none font-bold bg-transparent text-sm"
            type="number"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => setAdultCount(parseInt(event.target.value))}
          />
        </label>
        <label className="flex items-center gap-1 text-sm text-gray-600">
          Children:
          <input
            className="w-12 p-1 focus:outline-none font-bold bg-transparent text-sm"
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => setChildCount(parseInt(event.target.value))}
          />
        </label>
      </div>

      {/* Check-in */}
      <div className="bg-gray-50 border border-gray-200 rounded">
        <DatePicker
          selected={checkIn}
          onChange={(date: Date | null) => {
            if (date) setCheckIn(date);
          }}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in Date"
          className="min-w-full bg-transparent p-2 text-sm focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>

      {/* Check-out */}
      <div className="bg-gray-50 border border-gray-200 rounded">
        <DatePicker
          selected={checkOut}
          onChange={(date: Date | null) => {
            if (date) setCheckOut(date);
          }}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn}
          maxDate={maxDate}
          placeholderText="Check-out Date"
          className="min-w-full bg-transparent p-2 text-sm focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="w-2/3 bg-orange-400 text-white py-2 px-3 rounded font-bold text-sm hover:bg-orange-500 transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-1/3 bg-gray-200 text-gray-700 py-2 px-3 rounded font-bold text-sm hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
