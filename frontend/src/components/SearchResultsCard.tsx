import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import type { HotelType } from "../../../backend/src/models/hotel";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  return (
    <div className="group grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
      
      {/* Image */}
      <div className="relative w-full h-[240px] xl:h-full overflow-hidden">
        <img
          src={hotel.imageUrls[0]}
          alt={hotel.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Price badge overlaid on image */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow">
          <span className="text-gray-900 font-bold text-base">£{hotel.pricePerNight}</span>
          <span className="text-gray-500 text-xs ml-1">/ night</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 gap-4">
        
        {/* Top: stars, type, name, location */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <AiFillStar key={i} className="fill-amber-400 w-4 h-4" />
                ))}
              </div>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full">
                {hotel.type}
              </span>
            </div>
          </div>

          <Link
            to={`/detail/${hotel._id}`}
            className="text-xl font-bold text-gray-900 hover:text-orange-500 transition-colors leading-tight mt-1"
          >
            {hotel.name}
          </Link>

          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <MdLocationOn size={15} />
            <span>{hotel.city}, {hotel.country}</span>
          </div>
        </div>

        {/* Middle: description */}
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
          {hotel.description}
        </p>

        {/* Bottom: facilities + CTA */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {hotel.facilities.slice(0, 3).map((facility) => (
              <span
                key={facility}
                className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {facility}
              </span>
            ))}
            {hotel.facilities.length > 3 && (
              <span className="text-gray-400 text-xs font-medium px-2 py-1">
                +{hotel.facilities.length - 3} more
              </span>
            )}
          </div>

          <Link
            to={`/detail/${hotel._id}`}
            className="shrink-0 bg-orange-400 hover:bg-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors duration-200"
          >
            View More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;