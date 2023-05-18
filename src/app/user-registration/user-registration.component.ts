import {Component, OnInit} from '@angular/core';
import {User} from "../model/User";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserContact} from "../model/UserContact";
import {UserService} from "../service/User.service";
import {UserContactOption} from "../model/enum/UserContactOption";
import Validation from "../Validation";
import {ContactPreference} from "../model/enum/ContactPreference";
import {UserStatus} from "../model/enum/UserStatus";
import {ErrorModel} from "../model/ErrorModel";
import {UserType} from "../model/enum/UserType";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  public userRegistrationFormGroup: FormGroup;
  public oneTimePinFormGroup: FormGroup;
  public userRegistration: User;
  public userContactEmail: UserContact;
  public userContactCellPhoneNumber: UserContact;
  public isFormSubmitted = false;
  public isFormValid = false;
  public primaryContactOption: string[] = ["EMAIL", "SMS"];
  isOTPVisible = false;
  public backendError = false;
  public error = "";
  public IDNumber = "";

  constructor(private userService: UserService, private formBuilder: FormBuilder, private modal: NzModalService) {

    this.userRegistrationFormGroup = new FormBuilder().group({
      IDNumber: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(10)]],
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(2), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      cellPhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(10), Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_@./#&+-]+'), Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_@./#&+-]+'), Validators.minLength(8), Validators.maxLength(16)]],
      primaryContact: ['']
    }, {
      validators: [Validation.match('password', 'confirmPassword')]
    });
    this.userContactEmail = new UserContact("", "",
      ContactPreference.EMAIL, UserContactOption.PRIMARY);

    this.userContactCellPhoneNumber = new UserContact("", "",
      ContactPreference.SMS, UserContactOption.SECONDARY);

    this.userRegistration = new User("", "", "",
      "", UserStatus.INACTIVE, UserType.USER,[this.userContactEmail,this.userContactCellPhoneNumber]);

    this.oneTimePinFormGroup = new FormBuilder().group({
      oneTimePin: ['', Validators.required]
    });
  }
  ngOnInit(): void {
  }

  get formControl(): { [key: string]: AbstractControl } {
    return this.userRegistrationFormGroup.controls;
  }
  get formControlO(): { [key: string]: AbstractControl } {
    return this.oneTimePinFormGroup.controls;
  }

  //Open Dialog
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
      nzOnOk: ()=>this.handleCancelOTP()
    })
  }

  //Close Dialogs
  handleCancelOTP(): void {
    this.isOTPVisible = false;
    this.isFormValid = true;
  }

  //Processing
  public onSubmit(): void{
    this.isFormSubmitted = true;
    let userContacts = [];
    let IDNumber = this.formControl["IDNumber"].value;
    let email = this.formControl["email"].value;
    let cellPhoneNumber = this.formControl["cellPhoneNumber"].value;

    if(this.formControl['primaryContact'].value === ContactPreference.EMAIL){
      this.userContactEmail = new UserContact(IDNumber,email, ContactPreference.EMAIL, UserContactOption.PRIMARY);
      this.userContactCellPhoneNumber = new UserContact(IDNumber, cellPhoneNumber, ContactPreference.SMS,
        UserContactOption.SECONDARY);
    } else {
      this.userContactCellPhoneNumber = new UserContact(IDNumber, cellPhoneNumber, ContactPreference.SMS,
        UserContactOption.PRIMARY);
      this.userContactEmail = new UserContact(IDNumber, email, ContactPreference.EMAIL,
        UserContactOption.SECONDARY);
    }

    userContacts.push(this.userContactEmail, this.userContactCellPhoneNumber);

    this.userRegistration.idnumber = this.formControl["IDNumber"].value;
    this.userRegistration.firstname = this.formControl["firstname"].value;
    this.userRegistration.lastname = this.formControl["lastname"].value;
    this.userRegistration.userContacts = userContacts;
    this.userRegistration.password = this.formControl["password"].value;

    console.log(this.userRegistration);

    this.userService.save(this.userRegistration).subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
        this.err(this.error);
      } else{
        this.userRegistration = result;
        this.IDNumber = this.userRegistration.idnumber;
        if(this.userRegistrationFormGroup.status === 'VALID'){
          this.isOTPVisible = true;
        };
        console.log(this.userRegistration);
      }
    });
  }
  otpSubmit(){
    this.userService.verifyUser(this.formControlO['oneTimePin'].value, this.userRegistration.idnumber).subscribe(result => {
      if(result instanceof ErrorModel){
        this.error = result.error;
        this.err(this.error);
      } else{
        this.success("OTP was successfully verified.");
      }
    });
  }
  goToLogin() {
    this.isFormValid = true;
  }
}
