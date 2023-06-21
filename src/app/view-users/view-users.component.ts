import {Component, OnInit} from '@angular/core';
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
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  public userColumns: string[] = ['ID Number', 'First Name', 'Last Name', 'Email', 'Cellphone Number', 'Contact Preference',
    'Status', 'User Type','Actions'];
  public user = new User("", "", "", "", UserStatus.ACTIVE, UserType.ADMIN,
    [new UserContact("", "natasharakodi@gmail.com", ContactPreference.EMAIL, UserContactOption.PRIMARY),
      new UserContact("", "0729785442", ContactPreference.SMS, UserContactOption.SECONDARY)]);
  public userRegistrationFormGroup: FormGroup;
  public editProfileFormGroup: FormGroup;
  public userRegistration: User;
  public users: User[] = [];
  public userContactEmail: UserContact;
  public userContactCellPhoneNumber: UserContact;
  public primaryContactOption: ContactPreference[] = [];
  public userTypeOptions = [UserType.USER, UserType.ADMIN];
  isEditVisible = false;
  originalContactEmail? = "";
  originalContactNumber? = "";
  isAddVisible = false;
  public selectedUser = this.user;

  constructor(private userService: UserService, private modal: NzModalService, private message: NzMessageService) {
    this.userRegistrationFormGroup = new FormBuilder().group({
      IDNumber: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(13), Validators.minLength(13)]],
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(2), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      cellPhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(10), Validators.minLength(10)]],
      confirmCellPhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(10), Validators.minLength(10)]],
      userType: ['', Validators.required],
      primaryContact: ['', Validators.required]
    }, {
      validators: [Validation.match('email', 'confirmEmail'),
        Validation.match('cellPhoneNumber', 'confirmCellPhoneNumber')]
    });

    this.userContactEmail = new UserContact("", "",
      ContactPreference.EMAIL, UserContactOption.PRIMARY);

    this.userContactCellPhoneNumber = new UserContact("", "",
      ContactPreference.SMS, UserContactOption.SECONDARY);

    this.userRegistration = new User("", "", "",
      "", UserStatus.INACTIVE, UserType.USER, [this.userContactEmail, this.userContactCellPhoneNumber]);

    this.editProfileFormGroup = new FormBuilder().group({
      email: ['', Validators.email],
      confirmEmail: ['', Validators.email],
      cellPhoneNumber: ['', [Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
      confirmCellPhoneNumber: ['', [Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]]
    }, {
      validators: [Validation.match('email', 'confirmEmail'),
        Validation.match('cellPhoneNumber', 'confirmCellPhoneNumber')]
    });

  }

  ngOnInit(): void {
    this.getUsers();
    let userContact = this.user.userContacts.find(z => z.status === UserContactOption.PRIMARY);
    if (userContact !== undefined) {
      this.primaryContactOption.push(userContact.contactPreference);
      let secondaryContact = this.user.userContacts.find(z => z.contactPreference !== userContact?.contactPreference);
      if (secondaryContact) {
        this.primaryContactOption.push(secondaryContact?.contactPreference);
      }
    }
  }

  getUsers(){
    this.userService.getAllUsers().subscribe(result => {
      this.users = result;
    });
  }
  get formControl(): { [key: string]: AbstractControl } {
    return this.userRegistrationFormGroup.controls;
  }
  get formControlE(): { [key: string]: AbstractControl } {
    return this.editProfileFormGroup.controls;
  }


  //Open Dialogs
  showEditModal(data: User): void {
    this.isEditVisible = true;
    this.selectedUser = data;
    this.originalContactEmail = this.selectedUser.userContacts.find(x => x.contactPreference === ContactPreference.EMAIL)?.contact;
    this.originalContactNumber = this.selectedUser.userContacts.find(x => x.contactPreference === ContactPreference.SMS)?.contact;
  }
  showAddModal(): void {
    this.isAddVisible = true;
  }

  showConfirmEdit(user: User): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to save these changes?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.editUser(user),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  showConfirmDeactivation(user: User): void {
    console.log(user);
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to deactivate user?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.deactivateUser(user),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  showConfirmReactivation(user: User): void {
    console.log(user);
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to reactivate user?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.reactivateUser(user),
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
  handleCancelAdd(): void {
    this.isAddVisible = false;
    this.userRegistrationFormGroup.reset()
  }
  handleCancelEdit(): void {
    this.isEditVisible = false;
    this.getUsers();
  }

  //Processing
  regAdminUser(): void {
    let userContacts: UserContact[] = [];
    let IDNumber = this.formControl["IDNumber"].value;
    let email = this.formControl["email"].value;
    let cellPhoneNumber = this.formControl["cellPhoneNumber"].value;

    if (this.formControl['primaryContact'].value === ContactPreference.EMAIL) {
      this.userContactEmail = new UserContact(IDNumber, email, ContactPreference.EMAIL, UserContactOption.PRIMARY);
      this.userContactCellPhoneNumber = new UserContact(IDNumber, cellPhoneNumber, ContactPreference.SMS,
        UserContactOption.SECONDARY);
    } else {
      this.userContactCellPhoneNumber = new UserContact(IDNumber, cellPhoneNumber, ContactPreference.SMS,
        UserContactOption.PRIMARY);
      this.userContactEmail = new UserContact(IDNumber, email, ContactPreference.EMAIL,
        UserContactOption.SECONDARY);
    }

    userContacts.push(this.userContactEmail, this.userContactCellPhoneNumber);

    this.userRegistration.idnumber = IDNumber;
    this.userRegistration.firstname = this.formControl["firstname"].value;
    this.userRegistration.lastname = this.formControl["lastname"].value;
    this.userRegistration.userContacts = userContacts;
    this.userRegistration.userType = this.formControl["userType"].value;

    console.log(this.userRegistration);
    this.users.push(this.userRegistration);

    this.userService.addAdmin(this.userRegistration).subscribe(result => {
      if (result instanceof ErrorModel) {
        this.err(result.error);
      } else {
        this.success("Successfully added user - " + this.userRegistration.idnumber + ". A temporary login password will be sent to the user.");
        this.getUsers();
      }
    });
  }
  editUser(updatedUser: User) {
    let userContactEmail = updatedUser.userContacts.find(x => x.contactPreference === ContactPreference.EMAIL);
    let userContactNumber = updatedUser.userContacts.find(x => x.contactPreference === ContactPreference.SMS);
    let newContacts = [];

    if (userContactEmail !== undefined && userContactNumber !== undefined) {
      newContacts.push(userContactNumber, userContactEmail);
      updatedUser.userContacts = newContacts;
      console.log(updatedUser.userContacts);
    }

    this.userService.adminUpdateUser(updatedUser).subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      }else{
        this.success("Successfully updated user - " + updatedUser.idnumber + ".");
        this.getUsers();
      }
    });

  }
  deactivateUser(user: User) {
    console.log(user);
    this.userService.deactivateUser(user.idnumber).subscribe(result => {
      if (result instanceof ErrorModel) {
        this.err(result.error);
      } else {
        this.success("Successfully deactivated user - " + user.idnumber + ".");
        this.users = result;
      }
    });
  }
  reactivateUser(user: User) {
    console.log(user);
    this.userService.reactivateUser(user.idnumber).subscribe(result => {
      if (result instanceof ErrorModel) {
        this.err(result.error);
      } else {
        this.success("Successfully reactivated user - " + user.idnumber + ". A temporary login password will be sent to the user.");
        this.getUsers();
      }
    });
  }
}
