import {AbstractControl, ValidationErrors} from "@angular/forms";

export default class Validation {
  public static match(password: string, confirmPassword: string): ValidationErrors | null{
    return (controls: AbstractControl) => {
      const passwordControl = controls.get(password);
      const confirmPasswordControl = controls.get(confirmPassword);

      if(confirmPasswordControl?.errors && confirmPasswordControl.errors['matching']){
        return null;
      }

      if(confirmPasswordControl?.value !== passwordControl?.value){
        controls.get(confirmPassword)?.setErrors({matching: true});
        return {matching: true};
        }
      return null;
    };
  }
}
