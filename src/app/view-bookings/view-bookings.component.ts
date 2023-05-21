import {Component, Input, OnInit} from '@angular/core';
import {Booking} from "../model/Booking";
import {BookingService} from "../service/booking.service";
import {ContactPreference} from "../model/enum/ContactPreference";
import {Computer} from "../model/Computer";
import {ComputerLab} from "../model/ComputerLab";
import {ErrorModel} from "../model/ErrorModel";
import {NzModalService} from "ng-zorro-antd/modal";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {UserContact} from "../model/UserContact";
import {UserContactOption} from "../model/enum/UserContactOption";
import {BookingStatus} from "../model/enum/BookingStatus";
@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.css']
})
export class ViewBookingsComponent implements OnInit {

  public user = new User("21600000","Kopano","Rakodi","", UserStatus.ACTIVE,UserType.USER,
    [new UserContact("","natasharakodi@gmail.com",ContactPreference.EMAIL, UserContactOption.SECONDARY),
      new UserContact("","0648785074",ContactPreference.SMS, UserContactOption.PRIMARY)]);

  public bookingColumns: string[] = ['ID Number', 'Date And Time','Computer Name','Computer Lab', 'Status', 'Action'];
  public bookings: Booking[] = [new Booking("Lab-1","216153804","",ContactPreference.EMAIL, "Lab-1", BookingStatus.IN_USE),
    new Booking("Lab-1","216153804","",ContactPreference.EMAIL, "PC-1", BookingStatus.UPCOMING),
    new Booking("Lab-1","216153804","",ContactPreference.EMAIL, "PC-1", BookingStatus.EXPIRED)] ;
  public error = "";
  public isVisible = false;
  public selectedBooking = this.bookings[0];
  @Input() loggedInUser = this.user;
  constructor(private bookingService: BookingService, private modal: NzModalService) { }

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe(result => {
      this.bookings = result;
    })
  }

  //Open Dialogs
  showConfirm(booking: Booking): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to cancel this booking entry?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => this.deleteBooking(booking),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  err(): void{
    this.modal.error({
      nzTitle: 'Error',
      nzContent: 'Failed to delete booking entry.',
      nzOnOk: ()=>console.log('OK')
    })
  }
  success(): void{
    this.modal.success({
      nzTitle: 'Success',
      nzContent: 'Booking entry has been successfully deleted.',
      nzOnOk: ()=>console.log('OK')
    })
  }

  //Close Dialogs
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  //Processing
  deleteBooking(booking: Booking){
    console.log("I am here!");
    this.bookingService.deleteBooking(booking).subscribe(result => {
      if(result instanceof ErrorModel){
        this.error = result.error;
        this.err();
      } else{
        //Do something maybe
        this.success();
      }
    })
  }
}
