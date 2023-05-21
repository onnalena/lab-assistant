import {Component, Input, OnInit} from '@angular/core';
import {User} from "../model/User";
import {UserService} from "../service/User.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactPreference} from "../model/enum/ContactPreference";
import {UserContact} from "../model/UserContact";
import {UserContactOption} from "../model/enum/UserContactOption";
import {ErrorModel} from "../model/ErrorModel";
import Validation from "../Validation";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  public userColumns: string[] = ['ID Number', 'First Name', 'Last Name', 'Email', 'Cellphone Number', 'Contact Preference',
    'Status', 'User Type','Actions'];
  public user = new User("21600000", "Kopano", "Rakodi", "", UserStatus.ACTIVE, UserType.ADMIN,
    [new UserContact("", "natasharakodi@gmail.com", ContactPreference.EMAIL, UserContactOption.PRIMARY),
      new UserContact("", "0648785074", ContactPreference.SMS, UserContactOption.SECONDARY)]);
  public userRegistrationFormGroup: FormGroup;
  public oneTimePinFormGroup: FormGroup;
  public editProfileFormGroup: FormGroup;
  public userRegistration: User;
  public users: User[] = [this.user];
  public userContactEmail: UserContact;
  public userContactCellPhoneNumber: UserContact;
  public primaryContactOption: ContactPreference[] = [];
  public error = "";
  public IDNumber = "";
  public userTypeOptions = [UserType.USER, UserType.ADMIN];
  isVisible = false;
  isEditVisible = false;
  isAddVisible = false;
  isOTPVisible = false;
  public selectedUser = this.user;
  @Input() loggedInUser = this.user;

  constructor(private userService: UserService, private modal: NzModalService) {
    this.userRegistrationFormGroup = new FormBuilder().group({
      IDNumber: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(10)]],
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(2), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      cellPhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(10), Validators.minLength(10)]],
      confirmCellPhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(10), Validators.minLength(10)]],
      userType: ['', Validators.required],
      primaryContact: ['', Validators.required]
    }, {
      validators: [Validation.match('password', 'confirmPassword'),
        Validation.match('email', 'confirmEmail'),
        Validation.match('cellPhoneNumber', 'confirmCellPhoneNumber')]
    });

    this.userContactEmail = new UserContact("216153804", "natasharakodi@gmail.com",
      ContactPreference.EMAIL, UserContactOption.PRIMARY);

    this.userContactCellPhoneNumber = new UserContact("216153804", "0648185074",
      ContactPreference.SMS, UserContactOption.SECONDARY);

    this.userRegistration = new User("216153804", "Onalenna", "Rakodi",
      "", UserStatus.INACTIVE, UserType.USER, [this.userContactEmail, this.userContactCellPhoneNumber]);

    this.editProfileFormGroup = new FormBuilder().group({
      email: ['', Validators.email],
      cellPhoneNumber: ['', [Validators.pattern('[0-9]+'),
        Validators.minLength(10), Validators.maxLength(10)]],
      primaryContact: ['']
    });

    this.oneTimePinFormGroup = new FormBuilder().group({
      oneTimePin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(result => {
      this.users = result;
      console.log(result);
    });

    let userContact = this.user.userContacts.find(z => z.status === UserContactOption.PRIMARY);
    if (userContact !== undefined) {
      this.primaryContactOption.push(userContact.contactPreference);
      let secondaryContact = this.user.userContacts.find(z => z.contactPreference !== userContact?.contactPreference);
      if (secondaryContact) {
        this.primaryContactOption.push(secondaryContact?.contactPreference);
      }
    }
  }
  get formControl(): { [key: string]: AbstractControl } {
    return this.userRegistrationFormGroup.controls;
  }
  get formControlO(): { [key: string]: AbstractControl } {
    return this.oneTimePinFormGroup.controls;
  }
  get formControlE(): { [key: string]: AbstractControl } {
    return this.editProfileFormGroup.controls;
  }

  //Open Dialogs
  showModal(): void {
    this.isVisible = true;
  }
  showEditModal(): void {
    this.isEditVisible = true;
  }
  showAddModal(): void {
    this.isAddVisible = true;
  }
  showConfirmDelete(user: User): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to delete this user?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => this.removeUser(user),
      nzOnCancel: () => console.log('Cancel')
    });
  }

  showConfirmEdit(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to save these changes?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.editUser(),
      nzOnCancel: () => console.log('Cancel')
    });
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
    console.log('Button ok clicked!');
    this.isVisible = false;
  }
  handleCancelAdd(): void {
    this.isAddVisible = false;
  }
  handleCancelOTP(): void {
    this.isOTPVisible = false;
  }
  handleCancelEdit(): void {
    this.isEditVisible = false;
  }

  //Processing
  regAdminUser(): void {
    let userContacts = [];
    this.IDNumber = this.formControl["IDNumber"].value;
    let email = this.formControl["email"].value;
    let cellPhoneNumber = this.formControl["cellPhoneNumber"].value;

    if (this.formControl['primaryContact'].value === ContactPreference.EMAIL) {
      this.userContactEmail = new UserContact(this.IDNumber, email, ContactPreference.EMAIL, UserContactOption.PRIMARY);
      this.userContactCellPhoneNumber = new UserContact(this.IDNumber, cellPhoneNumber, ContactPreference.SMS,
        UserContactOption.SECONDARY);
    } else {
      this.userContactCellPhoneNumber = new UserContact(this.IDNumber, cellPhoneNumber, ContactPreference.SMS,
        UserContactOption.PRIMARY);
      this.userContactEmail = new UserContact(this.IDNumber, email, ContactPreference.EMAIL,
        UserContactOption.SECONDARY);
    }

    userContacts.push(this.userContactEmail, this.userContactCellPhoneNumber);

    this.userRegistration.idnumber = this.IDNumber;
    this.userRegistration.firstname = this.formControl["firstname"].value;
    this.userRegistration.lastname = this.formControl["lastname"].value;
    this.userRegistration.userContacts = userContacts;
    this.userRegistration.userType = this.formControl["userType"].value;

    console.log(this.userRegistration);

    this.userService.addAdmin(this.userRegistration).subscribe(result => {
      if (result instanceof ErrorModel) {
        this.error = result.error;
        this.err(this.error);
      } else {
        this.userRegistration = result;
        this.success("Successfully added user.");
        console.log(this.userRegistration);
      }
    });
  }
  editUser() {
    let userContactEmail = this.userRegistration.userContacts.find(x => x.contactPreference === ContactPreference.EMAIL);
    let userContactNumber = this.userRegistration.userContacts.find(x => x.contactPreference === ContactPreference.SMS);
    let newContacts = [];

    if(this.formControlE['primaryContact'].value !== ''){
      let selectedPrimaryContact = this.formControlE['primaryContact'].value.trim();

      if(userContactEmail !== undefined && userContactNumber !== undefined){
        if(selectedPrimaryContact === ContactPreference.EMAIL){
          console.log("Selected primary contact == " + selectedPrimaryContact);
          userContactEmail.status = UserContactOption.PRIMARY;
          userContactNumber.status = UserContactOption.SECONDARY;
        }else{
          console.log("Selected primary contact == " + selectedPrimaryContact);
          userContactNumber.status = UserContactOption.PRIMARY;
          userContactEmail.status = UserContactOption.SECONDARY;
        }

        newContacts.push(userContactNumber,userContactEmail);
        this.userRegistration.userContacts = newContacts;
        console.log(this.userRegistration.userContacts);
      }
    }else {
      if (userContactEmail !== undefined && userContactNumber !== undefined) {
        newContacts.push(userContactNumber, userContactEmail);
        this.userRegistration.userContacts = newContacts;
        console.log(this.userRegistration.userContacts);
      }
    }

    this.userService.updateUser(this.userRegistration).subscribe(result => {
      if(result instanceof ErrorModel){
        this.error = result.error;
        this.err(this.error);
      }else{
        this.success("Successfully updated.");
        this.isOTPVisible = true;
      }
    });

  }
  otpSubmit(): void {
    console.log(this.formControlO['oneTimePin'].value);
    this.userService.verifyUser(this.formControlO['oneTimePin'].value, this.user.idnumber).subscribe(result => {
      if (result instanceof ErrorModel) {
        this.error = result.error;
        this.err(this.error);
      } else {
        this.success("Successfully verified.");
      }
    });
  }
  removeUser(user: User) {
    this.userService.deleteUser(user).subscribe(result => {
      if (result instanceof ErrorModel) {
        this.error = result.error;
        this.err(this.error);
      } else {
        this.success("Successfully removed.");
        window.location.reload();
      }
    });
  }
}
