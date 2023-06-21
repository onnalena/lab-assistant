import {Component, Input, OnInit} from '@angular/core';
import {Booking} from "../model/Booking";
import {BookingService} from "../service/booking.service";
import {ContactPreference} from "../model/enum/ContactPreference";
import {ErrorModel} from "../model/ErrorModel";
import {NzModalService} from "ng-zorro-antd/modal";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {UserContact} from "../model/UserContact";
import {UserContactOption} from "../model/enum/UserContactOption";
@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.css']
})
export class ViewBookingsComponent implements OnInit {

  public user = new User("","","","", UserStatus.ACTIVE,UserType.USER,
    [new UserContact("","",ContactPreference.EMAIL, UserContactOption.SECONDARY),
      new UserContact("","",ContactPreference.SMS, UserContactOption.PRIMARY)]);

  public bookingColumns: string[] = ['ID Number', 'Date And Time','Computer Name','Computer Lab', 'Status', 'Action'];
  public bookings: Booking[] = [];
@Input() loggedInUser?: User;
  constructor(private bookingService: BookingService, private modal: NzModalService) { }

  ngOnInit(): void {
if(this.loggedInUser !== undefined){
this.user = this.loggedInUser;
}
if(this.user.userType === 'USER'){
this.bookingService.getUserBookings(this.user.idnumber).subscribe(result => {
      this.bookings = result;
    });
}else{
    this.bookingService.getBookings().subscribe(result => {
      this.bookings = result;
    });
}
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
  err(error: string): void{
    this.modal.error({
      nzTitle: 'Error',
      nzContent: error,
      nzOnOk: ()=>console.log('OK')
    })
  }
  success(): void{
    this.modal.success({
      nzTitle: 'Success',
      nzContent: 'Booking entry has been successfully cancelled.',
      nzOnOk: ()=>console.log('OK')
    })
  }


  //Processing
  deleteBooking(booking: Booking){
    this.bookingService.deleteBooking(booking).subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      } else{
        this.success();
      }
    })
  }
}
