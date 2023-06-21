import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactPreference} from "../model/enum/ContactPreference";
import {UserContact} from "../model/UserContact";
import {UserContactOption} from "../model/enum/UserContactOption";
import {ErrorModel} from "../model/ErrorModel";
import {UserService} from "../service/User.service";
import {NzModalService} from "ng-zorro-antd/modal";
import Validation from "../Validation";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {ReportCriteria} from "../model/ReportCriteria";
import {ReportType} from "../model/enum/ReportType";
import {DownloadReportService} from "../service/download-report.service";
import {formatDate} from '@angular/common';
import {Feedback} from "../model/Feedback";
import {Login} from "../model/Login";
import {Router} from "@angular/router";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  private contentType = [
    {type: 'pdf', contentType: 'application/pdf', extension: 'pdf'},
    {type: 'excel', contentType: 'application/csv', extension: 'xlsx'}
  ];

  activePage: string = 'dashboard';
  isProfileSelected: boolean = false;
  public user = new User('216153804', '', '', '', UserStatus.ACTIVE, UserType.ADMIN,
    [new UserContact('', 'natasharakodi@gmail.com', ContactPreference.EMAIL, UserContactOption.SECONDARY),
      new UserContact('', '0648785074', ContactPreference.SMS, UserContactOption.PRIMARY)]);
  public editProfileFormGroup: FormGroup;
  public updatePasswordFormGroup: FormGroup;
  public oneTimePinFormGroup: FormGroup;
  public reportDate: FormGroup;
  public feedbackFormGroup: FormGroup;
  public primaryContactOption: ContactPreference[] = [];
  public userContactEmail: UserContact;
  public userContactCellPhoneNumber: UserContact;
  public reportCriteria = new ReportCriteria(ReportType.USER, '', '');
  @Input("loggedInUser") loggedInUser?: User;
  isEditVisible = false;
  isPasswordVisible = false;
  isConfirmPassword = false;
  isOTPVisible = false;
  isBooking = false;
  isFeedback = false;
  logout = false;
  comment = '';
  rateValue = 0;
  tooltips = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];
  error = '';
  originalContactEmail? = "";
  originalContactNumber? = "";
  originalPrimaryContact? = "";

  constructor(private userService: UserService, private modal: NzModalService, private downloadService: DownloadReportService, private route: Router) {
    this.editProfileFormGroup = new FormBuilder().group({
      email: ['', Validators.email],
      confirmEmail: ['', Validators.email],
      cellPhoneNumber: ['', [Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
      confirmCellPhoneNumber: ['', [Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]]
    }, {
      validators: [Validation.match('email', 'confirmEmail'),
        Validation.match('cellPhoneNumber', 'confirmCellPhoneNumber')]
    });
    this.userContactEmail = new UserContact('', '', ContactPreference.EMAIL, UserContactOption.PRIMARY);
    this.userContactCellPhoneNumber = new UserContact('', '', ContactPreference.EMAIL, UserContactOption.PRIMARY);

    this.updatePasswordFormGroup = new FormBuilder().group({
      password: ['', [Validators.required, Validators.pattern('[A-Za-z0-9!?`~@#$%^&*+=!]+'),
        Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.pattern('[A-Za-z0-9!?`~@#$%^&*+=!]+')]],
      currentPassword: ['', [Validators.required]]
    }, {
      validators: [Validation.match('password', 'confirmPassword')]
    });
    this.oneTimePinFormGroup = new FormBuilder().group({
      oneTimePin: ['', Validators.required]
    });
    this.reportDate = new FormBuilder().group({
      reportDate: ['']
    });
    this.feedbackFormGroup = new FormBuilder().group({
      stars: ['', Validators.required],
      comment: ['']
    });
  }

  ngOnInit(): void {
    if (this.loggedInUser !== undefined) {
      this.user = this.loggedInUser;
    }
    let userContact = this.user.userContacts.find(z => z.status === UserContactOption.PRIMARY);
    if (userContact !== undefined) {
      this.primaryContactOption.push(userContact.contactPreference);
      let secondaryContact = this.user.userContacts.find(z => z.contactPreference !== userContact?.contactPreference);
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

  isLogout(){
    return this.logout = true;
    //this.route.navigateByUrl('/login');
  }

  //Open Dialogs
  showEditModal(): void {
    this.isEditVisible = true;
    this.originalContactEmail = this.user?.userContacts.find(x => x.contactPreference === ContactPreference.EMAIL)?.contact;
    this.originalContactNumber = this.user?.userContacts.find(x => x.contactPreference === ContactPreference.SMS)?.contact;
    this.originalPrimaryContact = this.user?.userContacts.find(x => x.status === UserContactOption.PRIMARY)?.status;
  }

  showCurrentConfirmPassword(): void {
    this.isConfirmPassword = true;
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
      nzOnOk: () => this.onSubmit()
    });
  }

  showConfirmPassword(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to reset your password?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.showCurrentConfirmPassword()
    });
  }

  showFeedBack(): void {
    this.isFeedback = true;
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
  handleCancelEdit(): void {
    this.isEditVisible = false;
  }

  handleCancel(): void {
    this.isPasswordVisible = false;
    this.updatePasswordFormGroup.reset();
  }

  handleCancelPass(): void {
    this.isPasswordVisible = false;
    this.isConfirmPassword = false;
    this.updatePasswordFormGroup.reset();
  }

  handleCancelOTP(): void {
    this.isOTPVisible = false;
    this.isEditVisible = false;

  }

  handleReportBooking(): void {
    this.isBooking = false;
  }

  handleFeedback(): void {
    this.isFeedback = false;
    this.feedbackFormGroup.reset();
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
  onSubmit() {
    let userContactEmail = this.loggedInUser?.userContacts.find(x => x.contactPreference === ContactPreference.EMAIL);
    let userContactNumber = this.loggedInUser?.userContacts.find(x => x.contactPreference === ContactPreference.SMS);
    let newContacts = [];

    if (userContactEmail !== undefined && userContactNumber !== undefined) {
      newContacts.push(userContactNumber, userContactEmail);
      if (this.loggedInUser !== undefined) {
        this.loggedInUser.userContacts = newContacts;
	this.userService.updateUser(this.loggedInUser).subscribe(result => {
           if (result instanceof ErrorModel) {
                this.err(result.error);
              } else {
                this.isOTPVisible = true;
              }
            });
      }else {
	     
	}
      console.log(this.loggedInUser?.userContacts);
    }
  }

  otpSubmit() {
    if (this.loggedInUser !== undefined) {
      this.userService.verifyUser(this.formControlO['oneTimePin'].value, this.loggedInUser?.idnumber).subscribe(result => {
        if (result instanceof ErrorModel) {
          this.err(result.error);
        } else {
          this.success("Successfully verified OTP.");
         
        }
      });
    }

  }

  onSubmitPassword() {
    if (this.formControlP['currentPassword'].value != "") {
      if (this.loggedInUser !== undefined) {
        let loginDetails = new Login(this.loggedInUser.idnumber, this.formControlP['currentPassword'].value);
        console.log(loginDetails);
        this.userService.verifyPassword(loginDetails).subscribe(result => {
          if (result instanceof ErrorModel) {
            this.err(result.error);
          } else {
            if (this.loggedInUser !== undefined) {
              let newPassword = new Login(this.loggedInUser.idnumber, this.formControlP['password'].value);
              console.log(newPassword);
              this.userService.updateUserPassword(newPassword).subscribe(result => {
                if (result instanceof ErrorModel) {
                  this.err(result.error);
                } else {
                  this.success("Successfully updated password.");
                  
                }
              });
            }
          }
        });
      }

    }
  }

  getContact(user: User, contactPreference: string) {
    return user.userContacts.find(x => x.contactPreference === contactPreference)?.contact;
  }

  getPrimaryContract(user: User) {
    return user.userContacts.find(x => x.status === UserContactOption.PRIMARY)?.contactPreference;
  }

  downloadReport(reportType: string, downloadFileType: string) {
if (ReportType.FEEDBACK === reportType.trim()) {
      this.reportCriteria.reportType = ReportType.FEEDBACK;
      this.reportCriteria.downloadFileType = downloadFileType.trim();
    } else if (ReportType.USER === reportType.trim()) {
      this.reportCriteria.reportType = ReportType.USER;
      this.reportCriteria.downloadFileType = downloadFileType.trim();
    } else if (ReportType.COMPUTER === reportType.trim()) {
      this.reportCriteria.reportType = ReportType.COMPUTER;
      this.reportCriteria.downloadFileType = downloadFileType.trim();
    } else if (ReportType.COMPUTER_LAB === reportType.trim()) {
      this.reportCriteria.reportType = ReportType.COMPUTER_LAB;
      this.reportCriteria.downloadFileType = downloadFileType.trim();
    } else if (ReportType.BOOKING === reportType.trim()) {
      this.reportCriteria.reportType = ReportType.BOOKING;
      this.reportCriteria.downloadFileType = downloadFileType.trim();
    } else if (ReportType.FEEDBACK === reportType.trim()) {
      this.reportCriteria.reportType = ReportType.FEEDBACK;
      this.reportCriteria.downloadFileType = downloadFileType.trim();
    }

    if (this.reportCriteria.reportType !== ReportType.BOOKING) {
      this.downloadFile(this.reportCriteria);
    } else {
      this.isBooking = true;
      console.log(this.reportCriteria);
    }
  }

  downloadBookingReport(): void {
    console.log(this.reportCriteria);
    this.reportCriteria.reportDate = this.reportDate.controls['reportDate'].value;
    console.log(this.reportCriteria);
    this.downloadFile(this.reportCriteria);
  }

  private downloadFile(reportCriteria: ReportCriteria): void {
    this.downloadService.downloadReport(reportCriteria).subscribe(response => {
      let downloadTypeDetails = this.contentType.find(x => x.type.toUpperCase() === reportCriteria.downloadFileType);
      let date = formatDate(new Date(), 'ddMMyyyy.HHmmSS', 'en-US')
      let fileName = reportCriteria.reportType.toLowerCase() + "_" + date + "." + downloadTypeDetails?.extension;
      let blob = new Blob([response], {type: downloadTypeDetails?.contentType});
      let a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.click();
    })
  }

  feedback(stars: number, comment: string): void {
    if (this.user !== undefined) {
      let feedback = new Feedback(this.user.idnumber, stars, comment, "");
      console.log(feedback);
      this.userService.userFeedback(feedback).subscribe(result => {
        if (result instanceof ErrorModel) {
          this.error = result.error;
        } else {
          this.success("Thank you for your feedback!");
        }
      });
    }

  }

}
