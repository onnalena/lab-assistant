import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/User.service";
import Validation from "../Validation";
import {NzModalService} from "ng-zorro-antd/modal";
import {ErrorModel} from "../model/ErrorModel";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {UserContact} from "../model/UserContact";
import {NewPassword} from "../model/NewPassword";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  public updatePasswordFormGroup: FormGroup;
  public isLogin = false;
  public userContacts: UserContact[] = []
  @Input() loggedInUser?: User;
  public user = new User('','','','',UserStatus.INACTIVE, UserType.USER,this.userContacts);
  constructor(private userService: UserService, private modal: NzModalService) {
    this.updatePasswordFormGroup = new FormBuilder().group({
      password: ['', [Validators.required, Validators.pattern('[A-Za-z0-9!?`~@#$%^&*+=!]+'),
        Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', Validators.required]},{
      validators: [Validation.match('password', 'confirmPassword')]
    });
  }

  ngOnInit(): void {
    if(this.loggedInUser !== undefined){
      this.user = this.loggedInUser;
    }
  }
  get formControl(): { [key: string]: AbstractControl } {
    return this.updatePasswordFormGroup.controls;
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

  onSubmit() {
    console.log(this.updatePasswordFormGroup.value);
console.log(this.user.idnumber);
    if (this.formControl['confirmPassword'].value != "") {
      let newPassword = new NewPassword(this.user.idnumber, this.formControl['password'].value);
      this.userService.updateUserPassword({ idNumber: this.user.idnumber, password: this.formControl['password'].value}).subscribe(result => {
        if (result instanceof ErrorModel) {
          return this.err(result.error);
        } else {
          this.isLogin = true;
        }
      });
    }
  }
}
