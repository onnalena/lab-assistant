import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ComputerLab} from "../model/ComputerLab";
import {ComputerLabService} from "../service/computer-lab.service";
import {ErrorModel} from "../model/ErrorModel";
import {NzModalService} from "ng-zorro-antd/modal";
import {SelectedBookingDate} from "../model/SelectedBookingDate";
import {BookingService} from "../service/booking.service";
import {Booking} from "../model/Booking";
import {ContactPreference} from "../model/enum/ContactPreference";
import {Computer} from "../model/Computer";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {UserContact} from "../model/UserContact";
import {UserContactOption} from "../model/enum/UserContactOption";
import {BookingStatus} from "../model/enum/BookingStatus";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public user = new User("","","","", UserStatus.ACTIVE,UserType.ADMIN,
    [new UserContact("","",ContactPreference.EMAIL, UserContactOption.SECONDARY),
      new UserContact("","",ContactPreference.SMS, UserContactOption.PRIMARY)]);
  public selectedDate = new SelectedBookingDate("", new Date());
  public computerLabs: ComputerLab[] = [];
  public computer = new Computer("","","",this.computerLabs[0]);
  public userBooking = new Booking("", "", "", ContactPreference.EMAIL, this.computer.computerName, BookingStatus.UPCOMING);
  public primaryContactOption = ['EMAIL','SMS'];
  public bookingFormGroup: FormGroup;
  public isVisible = false;
  public isBookingVisible = false;
  public timeSlots: string[] = [];


  //Navigation variables
  public selectedLab = "";
  @Input() loggedInUser?: User;


  constructor(private formBuilder: FormBuilder, private computerLabService: ComputerLabService, private modal: NzModalService,
              private bookingService: BookingService) {
    this.bookingFormGroup = new FormBuilder().group({
      date: ['', Validators.required],
      availableTime: ['', Validators.required],
      contactPreference: ['']
    });
  }

  ngOnInit(): void {
    if(this.loggedInUser !== undefined){
      this.user = this.loggedInUser;
    }
    this.computerLabService.getComputerLabs().subscribe(result => {
      if (result instanceof ErrorModel) {
        this.err(result.error);
      } else {
        this.computerLabs = result;
        console.log(this.computerLabs);
      }
    })
  }

  get formControl(): { [key: string]: AbstractControl } {
    return this.bookingFormGroup.controls;
  }

  //Open Dialogs
  showModal(labName: string): void {
    this.isVisible = true;
    this.selectedLab = labName;
  }

  showBookingModal(): void {
    this.isBookingVisible = true;
  }

  err(message: string): void {
    this.modal.error({
      nzTitle: 'Error',
      nzContent: message,
      nzOnOk: () => console.log('OK')
    })
  }

  success(message: string): void {
    this.modal.success({
      nzTitle: 'Success',
      nzContent: message,
      nzOnOk: () => console.log('OK')
    })
  }

  //Close Dialogs
  handleOk(): void {
    this.isVisible = false;
    this.bookingFormGroup.reset();
  }

  handleCancel(): void {
    this.isBookingVisible = false;
    this.isVisible = false;
    this.bookingFormGroup.reset();
  }

  //Processing
  getTimeSlots(labName: string) {
    this.selectedDate.computerLabName = labName;
    this.selectedDate.selectedDate = this.formControl['date'].value;

    console.log(this.selectedDate);

    this.bookingService.getAvailableTimeSlots(this.selectedDate).subscribe(result => {
      if (result instanceof ErrorModel) {
        this.err(result.error);
      } else {
        this.timeSlots = result;
        console.log(this.timeSlots);
        this.showBookingModal();
      }
    });
  }

  bookComputer() {
    console.log(this.formControl['contactPreference'].value);
    let date = this.selectedDate?.selectedDate.toString() + "T" + this.formControl['availableTime'].value;

    this.userBooking.dateTime = date;
    this.userBooking.contactPreference = this.formControl['contactPreference'].value;
    this.userBooking.idnumber = this.user.idnumber;
    this.userBooking.computerLabName = this.selectedDate.computerLabName;

    console.log(this.userBooking);

    this.bookingService.createBooking(this.userBooking).subscribe(result => {
      if (result instanceof ErrorModel) {
        return this.err(result.error);
      } else {
        this.success("Booking successful. An access code will be sent to you shorty.");
      }
    });
  }

  validateIfLabIsAvailableForBooking(lab: ComputerLab) {
    return lab.numberOfComputersBooked === 100;
  }
}
