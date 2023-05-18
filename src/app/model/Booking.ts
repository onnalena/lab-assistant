import {ContactPreference} from "./enum/ContactPreference";
import {Computer} from "./Computer";
import {BookingStatus} from "./enum/BookingStatus";

export class Booking{
  constructor(
    public computerLabName: string,
    public idnumber: string,
    public dateTime: string,
    public contactPreference: ContactPreference,
    public computer: Computer,
    public status: BookingStatus
  ) {
  }
}
