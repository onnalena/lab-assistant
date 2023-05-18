import {Component, OnInit} from '@angular/core';
import {Login} from "../model/Login";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginResponse} from "../model/LoginResponse";
import {LoginType} from "../model/enum/LoginType";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {ErrorModel} from "../model/ErrorModel";
import {UserType} from "../model/enum/UserType";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../service/User.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginPayload = new Login("","");
  public loginResponse = new LoginResponse(new User("","","","",UserStatus.ACTIVE, UserType.USER,
    []),LoginType.LOGIN);
  public loginFormGroup: FormGroup;
  public forgotPasswordFormGroup: FormGroup;
  public isForgotVisible = false;
  public isLogin = false;
  public isReg = false;
  public isReset = false;
  public error = "";
  constructor(private userService: UserService, private route: Router, private modal: NzModalService) {
    this.loginFormGroup = new FormBuilder().group({
      IDNumber: ['', [Validators.required, Validators.pattern('[0-9]+'),
        Validators.minLength(9), Validators.maxLength(9)]],
      password: ['', Validators.required]
    });
    this.forgotPasswordFormGroup = new FormBuilder().group({
      IDNumber: ['', [Validators.required, Validators.pattern('[0-9]+'),
        Validators.minLength(9), Validators.maxLength(9)]]
    });
  }

  ngOnInit(): void {
  }

  //Open Dialogs
  showForgotModal(): void {
    this.isForgotVisible = true;
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
    this.isForgotVisible = false;
  }

  //Processing
  logIn():void{

    this.loginPayload.idnumber = this.loginFormGroup.controls['IDNumber'].value;
    this.loginPayload.password = this.loginFormGroup.controls['password'].value;

    this.userService.logIn(this.loginPayload).subscribe((result) => {
      if (result instanceof ErrorModel) {
        // handle error
        this.error = result.error;
        this.err(this.error);
      } else {
        this.loginResponse = result;
        if (this.loginResponse.loginType === LoginType.LOGIN) {
          this.isLogin = true;
        } else {
          this.isReset = true;
          console.log(this.loginResponse);
        }
      }
    });
  }
  passwordReset() {
    this.userService.forgotPassword(this.forgotPasswordFormGroup.controls['IDNumber'].value).subscribe(
      result => {
        if(result instanceof ErrorModel){
          this.error = result.error;
          this.err(this.error);
        } else{
          this.success("A Temporary Login Pin will be sent to you shortly. A password change will be required upon logging in.");
        }
      }
    );
  }
  goToReg() {
    this.isReg = true;
  }
}
