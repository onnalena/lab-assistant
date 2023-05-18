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

  public user = new User("21600000","Kopano","Rakodi","", UserStatus.ACTIVE,UserType.ADMIN,
    [new UserContact("","natasharakodi@gmail.com",ContactPreference.EMAIL, UserContactOption.SECONDARY),
      new UserContact("","0648785074",ContactPreference.SMS, UserContactOption.PRIMARY)]);

  public computerLabs: ComputerLab[] = [new ComputerLab("Lab 2", "B20", "Library",
    "08:00", "17:00", 20, 30, 50),new ComputerLab("Lab 2", "B20", "Johannesburg",
    "08:00", "17:00", 10, 30, 40),new ComputerLab("Lab 2", "B25", "Activity",
    "08:00", "17:00", 100, 0, 100),new ComputerLab("Lab 2", "B55", "Library Bozza",
    "08:00", "17:00", 0, 100, 100), new ComputerLab("Lab 2", "B120", "Gizmo",
    "08:00", "17:00", 25, 25, 50), new ComputerLab("Lab 2", "B250", "Mentors Lab",
    "08:00", "17:00", 12, 58, 70), new ComputerLab("Lab 2", "B40", "Bob",
    "08:00", "17:00", 60, 20, 80)];
  public selectedDate = new SelectedBookingDate("", new Date());
  public computer = new Computer("PC-0","","",this.computerLabs[0]);
  public userBooking = new Booking("Lab-2", "", "", ContactPreference.EMAIL, this.computer, BookingStatus.UPCOMING);

  public bookingFormGroup: FormGroup;
  public isVisible = false;
  public isBookingVisible = false;
  public timeSlots: string[] = ['08:00', '09:00'];
  public error = "";

  //Navigation variables
  public selectedLab = "";
  @Input() loggedInUser = this.user;


  constructor(private formBuilder: FormBuilder, private computerLabService: ComputerLabService, private modal: NzModalService,
              private bookingService: BookingService) {
    this.bookingFormGroup = new FormBuilder().group({
      date:['', Validators.required],
      availableTime: ['', Validators.required],
      contactPreference:['', Validators.required]
    });
  }

  ngOnInit(): void  {
    console.log(this.loggedInUser)
    this.computerLabService.getComputerLabs().subscribe(result => {
      if(result instanceof ErrorModel){
        this.error = result.error;
        //this.err("Failed to load dashboard.");
      } else{
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
  showBookingModal():void{
    this.isBookingVisible = true;
  }
  err(message: string): void{
    this.modal.error({
      nzTitle: 'Error',
      nzContent: message,
      nzOnOk: ()=>console.log('OK')
    })
  }
  success(message: string): void{
    this.modal.success({
      nzTitle: 'Success',
      nzContent: message,
      nzOnOk: ()=>console.log('OK')
    })
  }

  //Close Dialogs
  handleOk(): void {
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isBookingVisible = false;
  }

  //Processing
  getTimeSlots(labName: string) {
    this.selectedDate.computerLabName = labName;
    this.selectedDate.selectedDate = this.formControl['date'].value;
    this.showBookingModal();
    console.log(this.selectedDate);
    this.bookingService.getAvailableTimeSlots(this.selectedDate).subscribe(result => {
      if(result instanceof ErrorModel){
        this.error = result.error;
        this.err(this.error);
      }else {
        this.timeSlots = result;
        this.showBookingModal();
      }
    });
  }
  bookComputer() {
    console.log('timeSlots', this.timeSlots);
    if(this.formControl['availableTime'].value === ''){
      this.err("Please select a time slot.");
    }else if(this.formControl['contactPreference'].value === ''){
      this.err("Please select contact preference.");
    } else{
      let date = this.selectedDate.selectedDate.toString()  + "T" + this.formControl['availableTime'].value;

      this.userBooking.dateTime = date;
      this.userBooking.contactPreference = this.formControl['contactPreference'].value;
      this.userBooking.idnumber = "216153804";
      this.userBooking.computerLabName = this.selectedDate.computerLabName;

      console.log(this.userBooking);

      this.bookingService.createBooking(this.userBooking).subscribe(result => {
        if(result instanceof ErrorModel){
          this.error = result.error;
          this.err(this.error);
        } else{
          this.success("Booking successful. An access code will be sent to you shorty.");
        }
      });}
  }
  validateIfLabIsAvailableForBooking(lab: ComputerLab) {
    return lab.numberOfComputersBooked === lab.numberOfComputers;
  }
}
