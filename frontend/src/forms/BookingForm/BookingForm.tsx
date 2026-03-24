import { useForm } from "react-hook-form";
import type { UserType } from "../../../../backend/src/shared/types";
import * as apiClient from "../../../api-client";
import { useNavigate } from "react-router-dom";

type Props = {
  currentUser: UserType;
  pricePerNight: number;
  numberOfNights: number;
  totalCost: number;
  paymentIntentId?: string;
  hotelId?: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const BookingForm = ({
  currentUser,
  pricePerNight,
  numberOfNights,
  totalCost,
  paymentIntentId,
  hotelId,
  checkIn,
  checkOut,
  adultCount,
  childCount,
}: Props) => {
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    try {
      if (!paymentIntentId) {
        console.error("❌ No payment intent");
        return;
      }

      if (!hotelId) {
        console.error("❌ No hotel ID");
        return;
      }

      // Create the booking with all required data
      await apiClient.createBooking({
        paymentIntentId,
        hotelId,
        ...formData,
        totalCost,
        numberOfNights,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        adultCount,
        childCount,
      });

      console.log("✅ Booking success");
      navigate("/my-bookings"); // Redirect to bookings page on success
    } catch (error) {
      console.error("❌ Booking failed", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-4xl font-bold">Confirm Your Details</span>

      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First name
          <input
            className="mt-1 border rounded w-full py-2 px-3 bg-gray-200"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 bg-gray-200"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 bg-gray-200"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold">Your Price Summary</p>
        <div className="rounded bg-blue-200 p-4">
          <p className="text-xl font-semibold">
            Total Cost: ${totalCost.toFixed(2)}
          </p>
          <p className="text-sm">
            ${pricePerNight} x {numberOfNights} nights
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold">Payment Details</p>
        <div className="border rounded w-full p-3 bg-gray-100 text-sm">
          {/* This would typically be replaced with a real payment form like Stripe Elements */}
          <p className="text-gray-600">Payment will be processed securely</p>
          <p className="text-xs text-gray-500 mt-1">
            Payment Intent ID: {paymentIntentId}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 font-bold hover:bg-blue-500 rounded-md transition-colors"
        >
          Confirm Booking
        </button>
      </div>
    </form>
  );
};

export default BookingForm;