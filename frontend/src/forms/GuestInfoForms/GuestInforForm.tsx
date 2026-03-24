import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/appContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

export const GuestInfoForm = ({ hotelId: _hotelId, pricePerNight }: Props) => {
  const navigate = useNavigate();
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const location = useLocation();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount,
    );
    navigate("/sign-in", { state: {from :location}})
  };



  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount,
    );
    navigate(`/hotel/${_hotelId}/booking`);
  };

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">${pricePerNight}</h3>

      <form onSubmit={isLoggedIn ? handleSubmit(onSubmit): handleSubmit(onSignInClick)}>
        <div className="grid grid-cols-1 gap-4 items-center">
          <div className="">
            <DatePicker
              required
              selected={checkIn}
              onChange={(date: Date | null) => {
                if (date) setValue("checkIn", date);
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

          <div className="">
            <DatePicker
              required
              selected={checkOut}
              onChange={(date: Date | null) => {
                if (date) setValue("checkOut", date);
              }}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="min-w-full bg-transparent p-2 text-sm focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>

          <div className="flex bg-gray-50 border border-gray-200 rounded px-3 py-2 gap-4">
            <label className="flex items-center gap-1 text-sm text-gray-600">
              Adults:
              <input
                className="w-12 p-1 focus:outline-none font-bold bg-transparent text-sm"
                type="number"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="flex items-center gap-1 text-sm text-gray-600">
              Children:
              <input
                className="w-12 p-1 focus:outline-none font-bold bg-transparent text-sm"
                type="number"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
