import express from "express";
import type { Request, Response } from "express";
import Hotel from "../models/hotel.ts";
import type { BookingType, HotelSearchResponse } from "../shared/types.ts";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth.ts";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(req.query.page?.toString() || "1");
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    res.json({
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const hotel = await Hotel.findById(req.params.id);
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hotel" });
    }
  },
);

// ✅ CREATE PAYMENT INTENT
router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

      const { numberOfNights } = req.body;
      const hotel = await Hotel.findById(req.params.hotelId);

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      const totalCost = hotel.pricePerNight * numberOfNights;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "gbp",
        metadata: {
          hotelId: req.params.hotelId,
          userId: req.userId,
        },
      });

      res.send({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        totalCost,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating payment intent" });
    }
  },
);

// ✅ CREATE BOOKING
router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

      const paymentIntent = await stripe.paymentIntents.retrieve(
        req.body.paymentIntentId,
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment not completed: ${paymentIntent.status}`,
        });
      }

      const booking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findByIdAndUpdate(
        req.params.hotelId,
        { $push: { bookings: booking } },
        { new: true },
      );

      res.status(200).send(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Booking failed" });
    }
  },
);

const constructSearchQuery = (queryParams: any) => {
  let query: any = {};

  if (queryParams.destination) {
    query.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    query.adultCount = { $gte: parseInt(queryParams.adultCount) };
  }

  if (queryParams.childCount) {
    query.childCount = { $gte: parseInt(queryParams.childCount) };
  }

  return query;
};

export default router;
