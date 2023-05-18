import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/User.service";
import {NewPassword} from "../model/NewPassword";
import Validation from "../Validation";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  public updatePasswordFormGroup: FormGroup;
  @Input() IDNumber = "";
  constructor(private userService: UserService) {
    this.updatePasswordFormGroup = new FormBuilder().group({
      password: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_@./#&+-]+'),
        Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_@./#&+-]+'),
        Validators.minLength(8), Validators.maxLength(16)]],
    },{
      validators: [Validation.match('password', 'confirmPassword')]
    });
  }

  ngOnInit(): void {
  }
  get formControl(): { [key: string]: AbstractControl } {
    return this.updatePasswordFormGroup.controls;
  }

  cancel(){
  }

  onSubmit() {
    console.log(this.IDNumber);
    let newPassword = new NewPassword(this.IDNumber, this.formControl['password'].value);
    let response: any;
    this.userService.updateUserPassword(newPassword).subscribe(result => {
      response = result;
      console.log(response);
    })
  }
}
