import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, Observable, of} from "rxjs";
import {Booking} from "../model/Booking";
import {SelectedBookingDate} from "../model/SelectedBookingDate";
import {ErrorModel} from "../model/ErrorModel";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  public createBooking(userBooking: Booking):Observable<any>{
    return this.http.post(environment.backendEndpoint + "booking/book-computer", userBooking).pipe(
      catchError(err=> this.handleError(err)));
  }

  public getUserContacts(IDNumber: string): Observable<any> {
    return this.http.get(environment.backendEndpoint + "booking/get-contacts/" + IDNumber);
  }

  public getBookings():Observable<any>{
    return this.http.get(environment.backendEndpoint + "booking/get-all-bookings");
  }

  public getUserBookings(IDNumber: string): Observable<any>{
    return this.http.get(environment.backendEndpoint + "booking/get-user-bookings/" + IDNumber);
  }

  public getAvailableTimeSlots(bookingDate: SelectedBookingDate):Observable<any>{
    return this.http.post(environment.backendEndpoint + "booking/get-available-time-slots", bookingDate).pipe(
      catchError(err=> this.handleError(err)));
  }

  public deleteBooking(booking: Booking){
    return this.http.post(environment.backendEndpoint + "booking/delete-booking", booking).pipe(
      catchError(err => this.handleError(err)));
  }

  public handleError(err: any) : Observable<any> {
    return of(new ErrorModel(err.error));
  }
}
