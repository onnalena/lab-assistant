import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactPreference} from "../model/enum/ContactPreference";
import {UserContact} from "../model/UserContact";
import {UserContactOption} from "../model/enum/UserContactOption";
import {ErrorModel} from "../model/ErrorModel";
import {NewPassword} from "../model/NewPassword";
import {UserService} from "../service/User.service";
import {NzModalService} from "ng-zorro-antd/modal";
import Validation from "../Validation";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {ReportCriteria} from "../model/ReportCriteria";
import {ReportType} from "../model/enum/ReportType";
import {DownloadReportService} from "../service/download-report.service";
import { formatDate } from '@angular/common';
import {Feedback} from "../model/Feedback";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  activePage: string = 'dashboard';
  isProfileSelected: boolean = false;
  public user = new User('','Kopano','Rakodi','', UserStatus.ACTIVE,UserType.ADMIN,
    [new UserContact('','natasharakodi@gmail.com',ContactPreference.EMAIL, UserContactOption.SECONDARY),
      new UserContact('','0648785074',ContactPreference.SMS, UserContactOption.PRIMARY)]);
  public editProfileFormGroup: FormGroup;
  public updatePasswordFormGroup: FormGroup;
  public oneTimePinFormGroup: FormGroup;
  public reportDate: FormGroup;
  public feedbackFormGroup: FormGroup;
  public primaryContactOption: ContactPreference[] = [];
  public userContactEmail: UserContact;
  public userContactCellPhoneNumber: UserContact;
  public reportCriteria = new ReportCriteria(ReportType.USER, '', '');
  @Input() loggedInUser = this.user;
  isEditVisible = false;
  isPasswordVisible = false;
  isOTPVisible = false;
  isBooking = false;
  isFeedback = false;
  comment = '';
  rateValue = 0;
  tooltips = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];
  error ='';

  constructor(private userService: UserService, private modal: NzModalService, private downloadService: DownloadReportService) {
    this.editProfileFormGroup = new FormBuilder().group({
      email:['', Validators.email],
      cellPhoneNumber:['', [Validators.pattern('[0-9]+'),
        Validators.minLength(10), Validators.maxLength(10)]],
      primaryContact: ['']
    });
    this.userContactEmail = new UserContact('','',ContactPreference.EMAIL, UserContactOption.PRIMARY);
    this.userContactCellPhoneNumber = new UserContact('','',ContactPreference.EMAIL, UserContactOption.PRIMARY);

    this.updatePasswordFormGroup = new FormBuilder().group({
      password: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_@./#&+-]+'),
        Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_@./#&+-]+'),
        Validators.minLength(8), Validators.maxLength(16)]],
    },{
      validators: [Validation.match('password', 'confirmPassword')]
    });
    this.oneTimePinFormGroup = new FormBuilder().group({
      oneTimePin: ['', Validators.required]
    });
    this.reportDate = new FormBuilder().group({
      reportDate: ['', Validators.required]
    });
    this.feedbackFormGroup = new FormBuilder().group({
      stars: ['', Validators.required],
      comment: ['']
    });
  }

  ngOnInit(): void {
    let userContact = this.loggedInUser.userContacts.find(z => z.status === UserContactOption.PRIMARY);
    if (userContact !== undefined) {
      this.primaryContactOption.push(userContact.contactPreference);
      let secondaryContact = this.loggedInUser.userContacts.find(z => z.contactPreference !== userContact?.contactPreference);
      if (secondaryContact) {
        this.primaryContactOption.push(secondaryContact?.contactPreference);
      }
    }
  }

  setActivePage(page: string) {
    if (page === 'profile') {
      this.isProfileSelected = true;
    } else {
      this.activePage = page;
    }
  }
  /*getUserDetails(){
    this.userService.getUserDetails("216153804").subscribe(result =>{
      //this.user = result;
      console.log(this.user);
    });
  }*/

  //Open Dialogs
  showEditModal(): void {
    this.isEditVisible = true;
  }
  showModal(): void {
    this.isPasswordVisible = true;
  }
  showConfirmEdit(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to save these changes?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.onSubmit(),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  showConfirmPassword(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to reset your password?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.onSubmitPassword(),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  showFeedBack(): void {
    console.log("Set feedback.")
    this.isFeedback = true;
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
  handleCancelEdit(): void {
    this.isEditVisible = false;
  }
  handleCancel(): void {
    this.isPasswordVisible = false;
  }
  handleCancelOTP(): void {
    this.isOTPVisible = false;
  }
  handleReportBooking(): void {
    this.isBooking = false;
  }
  handleFeedback(): void {
    this.isFeedback = false;
  }
  closeProfile() {
    this.isProfileSelected = false;
  }

  //FormControls
  get formControl(): { [key: string]: AbstractControl } {
    return this.editProfileFormGroup.controls;
  }
  get formControlP(): { [key: string]: AbstractControl } {
    return this.updatePasswordFormGroup.controls;
  }
  get formControlO(): { [key: string]: AbstractControl } {
    return this.oneTimePinFormGroup.controls;
  }

  //Processing
  onSubmit(){
    let userContactEmail = this.user.userContacts.find(x => x.contactPreference === ContactPreference.EMAIL);
    let userContactNumber = this.user.userContacts.find(x => x.contactPreference === ContactPreference.SMS);
    let newContacts = [];

    if(this.formControl['primaryContact'].value !== ''){
      let selectedPrimaryContact = this.formControl['primaryContact'].value.trim();

      if(userContactEmail !== undefined && userContactNumber !== undefined){
        if(selectedPrimaryContact === ContactPreference.EMAIL){
          userContactEmail.status = UserContactOption.PRIMARY;
          userContactNumber.status = UserContactOption.SECONDARY;
        }else{
          userContactNumber.status = UserContactOption.PRIMARY;
          userContactEmail.status = UserContactOption.SECONDARY;
        }

        newContacts.push(userContactNumber,userContactEmail);
        this.user.userContacts = newContacts;
        console.log(this.user.userContacts);
      }
    }else {
      if (userContactEmail !== undefined && userContactNumber !== undefined) {
        newContacts.push(userContactNumber, userContactEmail);
        this.user.userContacts = newContacts;
        console.log(this.user.userContacts);
      }
    }

    this.userService.updateUser(this.user).subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      }else{
        this.success('Successfully updated profile.');
        window.location.reload();
      }
    });
  }
  otpSubmit(){
    this.userService.verifyUser(this.formControlO['oneTimePin'].value, this.user.idnumber).subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      } else{
        this.success("OTP was successfully verified.");
        this.userService.updateUser(this.user).subscribe(results => {
          if(results instanceof ErrorModel){
            this.err(result.error);
          } else {
            this.success("Successfully updated profile.");
          }
        });
        window.location.reload();
      }
    });
  }
  onSubmitPassword() {
    let newPassword = new NewPassword("216153804", this.formControl['password'].value);

    this.userService.updateUserPassword(newPassword).subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      }else {
        this.success("Successfully updated password.");
        window.location.reload();
      }
    });
  }

  getContact(user: User, contactPreference: string) {
    return user.userContacts.find(x => x.contactPreference === contactPreference)?.contact;
  }

  getPrimaryContract(user: User) {
    return user.userContacts.find(x => x.status === UserContactOption.PRIMARY)?.contactPreference;
  }

  downloadReport(reportType: string, downloadFileType: string) {
    if(ReportType.USER === reportType.trim()){
      this.reportCriteria.reportType = ReportType.USER;
      this.reportCriteria.downloadFileType = downloadFileType.trim();

    } else if(ReportType.COMPUTER === reportType.trim()){
      this.reportCriteria.reportType = ReportType.COMPUTER;
      this.reportCriteria.downloadFileType = downloadFileType.trim();

    }else if(ReportType.COMPUTER_LAB === reportType.trim()){
      this.reportCriteria.reportType = ReportType.COMPUTER_LAB;
      this.reportCriteria.downloadFileType = downloadFileType.trim();

    }else if(ReportType.BOOKING === reportType.trim()){
      this.reportCriteria.reportType = ReportType.BOOKING;
      this.reportCriteria.downloadFileType = downloadFileType.trim();
    }

    if(this.reportCriteria.reportType !== ReportType.BOOKING){
      this.download(this.reportCriteria);
    }else {
      this.isBooking = true;
      console.log(this.reportCriteria);
    }
  }

  downloadBookingReport(): void{
    console.log(this.reportCriteria);
    this.reportCriteria.reportDate = this.reportDate.controls['reportDate'].value;
    console.log(this.reportCriteria);
    this.download(this.reportCriteria);
  }

  private download(reportCriteria: ReportCriteria): void {
    this.downloadService.downloadReport(reportCriteria).subscribe(result => {
      /*if(result instanceof ErrorModel){
        this.error = result.error;
        this.err(this.error);
      } else{*/
      let contentType = reportCriteria.downloadFileType === "EXCEL" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/pdf"
      let file = new Blob([result._body], { type: contentType });
      let fileUrl = URL.createObjectURL(file);
      let date = formatDate(new Date(), 'ddMMyyyy.HH:mm:SS', 'en-US')
      let fileExtension = contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? date + "_" + reportCriteria.reportType.toLowerCase() + ".csv" : date + "_" + reportCriteria.reportType.toLowerCase() + ".pdf"
      //this.success("Download successful.");}
    });
  }

  feedback(stars: number, comment: string): void{
    let feedback = new Feedback(this.loggedInUser.idnumber, stars, comment);
    console.log(feedback);
    this.userService.userFeedback(feedback).subscribe(result => {
      if(result instanceof ErrorModel){
        this.error = result.error;
      }else{
        this.success("Thank you for your feedback!");
      }
    });
  }

}
