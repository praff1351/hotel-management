import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../../api-client.ts";
import { BsBuilding } from "react-icons/bs";
import { BiHotel, BiMap, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {},
    },
  );

  if (!hotelData) {
    return <span>No Hotels Found</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">My Hotels</h1>
        <Link
          to={"/add-hotel"}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gray-600 px-3 py-2 text-base font-bold text-white hover:bg-gray-500 sm:w-auto sm:text-lg"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            className="flex flex-col justify-between gap-5 rounded-lg border border-slate-300 p-4 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl font-bold sm:text-2xl">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <div className="flex items-center rounded-sm border border-slate-300 p-3 text-sm sm:text-base">
                <BiMap className="mr-2 shrink-0 text-lg sm:text-xl" />
                <span className="wrap-break-word">
                  {hotel.city}, {hotel.country}
                </span>
              </div>

              <div className="flex items-center rounded-sm border border-slate-300 p-3 text-sm sm:text-base">
                <BsBuilding className="mr-2 shrink-0 text-base" />
                {hotel.type}
              </div>

              <div className="flex items-center rounded-sm border border-slate-300 p-3 text-sm sm:text-base">
                <BiMoney className="mr-2 shrink-0 text-base" />$
                {hotel.pricePerNight} per night
              </div>

              <div className="flex items-center rounded-sm border border-slate-300 p-3 text-sm sm:text-base">
                <BiHotel className="mr-2 shrink-0 text-base" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>

              <div className="flex items-center rounded-sm border border-slate-300 p-3 text-sm sm:text-base">
                <BiStar className="mr-2 shrink-0 text-base" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="inline-flex w-full items-center justify-center rounded-lg bg-gray-600 px-3 py-2 text-base font-bold text-white hover:bg-gray-500 sm:w-auto sm:text-lg"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
