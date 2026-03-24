import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../../api-client.ts";
import BookingForm from "../forms/BookingForm/BookingForm.tsx";
import { useSearchContext } from "../contexts/SearchContext";
import { MdLocationOn, MdNightlight, MdPeople } from "react-icons/md";
import { BsCalendarCheck, BsCalendarX } from "react-icons/bs";

const Booking = () => {
  const { hotelId } = useParams();
  const search = useSearchContext();

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
  );

  // Calculate nights first
  const numberOfNights = Math.ceil(
    (search.checkOut.getTime() - search.checkIn.getTime()) /
      (1000 * 60 * 60 * 24),
  ) || 0;

  // Fetch hotel details
  const { data: hotel, isLoading: hotelLoading } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    { enabled: !!hotelId },
  );

  // Create payment intent - only when hotel and nights are available
  const { data: paymentIntentData, isLoading: paymentIntentLoading } = useQuery(
    "createPaymentIntent",
    () => apiClient.createPaymentIntent(
      hotelId as string, 
      numberOfNights.toString()
    ),
    { 
      enabled: !!hotelId && numberOfNights > 0 && !!hotel,
    },
  );

  const totalCost = (hotel?.pricePerNight || 0) * Math.max(numberOfNights, 0);

  // Store booking details in localStorage for the form
  const storeBookingDetails = () => {
    if (search.checkIn && search.checkOut) {
      localStorage.setItem("checkIn", search.checkIn.toISOString());
      localStorage.setItem("checkOut", search.checkOut.toISOString());
      localStorage.setItem("adultCount", search.adultCount.toString());
      localStorage.setItem("childCount", search.childCount.toString());
    }
  };

  // Call this when data is available
  if (hotel && !hotelLoading) {
    storeBookingDetails();
  }

  if (hotelLoading || paymentIntentLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr] items-start">
      {/* Booking Summary Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-gray-900 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Your Booking Summary</h2>
        </div>

        {hotel ? (
          <div className="p-6 space-y-5">
            {/* Location */}
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <MdLocationOn className="text-orange-400" size={17} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Location</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">
                  {hotel.name}
                </p>
                <p className="text-gray-500 text-xs">{hotel.city}, {hotel.country}</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2.5 items-start">
                <div className="mt-0.5 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <BsCalendarCheck className="text-orange-400" size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Check-in</p>
                  <p className="font-semibold text-gray-800 text-sm mt-0.5">
                    {search.checkIn.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="mt-0.5 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <BsCalendarX className="text-orange-400" size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Check-out</p>
                  <p className="font-semibold text-gray-800 text-sm mt-0.5">
                    {search.checkOut.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Nights */}
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <MdNightlight className="text-orange-400" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Length of Stay</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">
                  {Math.max(numberOfNights, 0)} {numberOfNights === 1 ? "night" : "nights"}
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Guests */}
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <MdPeople className="text-orange-400" size={17} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Guests</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">
                  {search.adultCount} {search.adultCount === 1 ? "adult" : "adults"}
                  {search.childCount > 0 && ` & ${search.childCount} ${search.childCount === 1 ? "child" : "children"}`}
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Total Cost */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">Total Cost</p>
              <p className="text-xl font-bold text-gray-900">
                £{totalCost.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg" />
            ))}
          </div>
        )}
      </div>

      {/* Booking Form */}
      {currentUser && hotel && paymentIntentData && (
        <BookingForm
          currentUser={currentUser}
          pricePerNight={hotel.pricePerNight}
          numberOfNights={numberOfNights}
          totalCost={totalCost}
          paymentIntentId={paymentIntentData.paymentIntentId}
          hotelId={hotel._id}
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
        />
      )}
    </div>
  );
};

export default Booking;