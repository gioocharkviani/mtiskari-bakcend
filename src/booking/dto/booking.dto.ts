export class NewBooking {
  userId?: number;
  guestId?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  checkInDate: Date;
  checkOutDate: Date;
  nightsCount: number;
  guestsCount: number;
  totalPrice: number;
  basePrice?: number;
  bookingStatus: BookingStatus = "PENDING";
  specialRequests?: string;
  paymentMethod?: "CREDIT_CARD" | "PAYPAL" | "STRIPE" | "BANK_TRANSFER";
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}

// Standard status enum
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "REJECTED"
  | "REFUNDED";

export enum BookingStatusEnum {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  REFUNDED = "REFUNDED",
  EXPIRED = "EXPIRED",
  MODIFIED = "MODIFIED",
}
