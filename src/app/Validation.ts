import {AbstractControl, ValidationErrors} from "@angular/forms";

export default class Validation {
  public static match(original: string, confirm: string): ValidationErrors | null {
    return (controls: AbstractControl) => {
      const originalControl = controls.get(original);
      const confirmControl = controls.get(confirm);

      if (confirmControl?.errors && confirmControl.errors['matching']) {
        return null;
      }

      if (confirmControl?.value !== originalControl?.value) {
        controls.get(confirm)?.setErrors({matching: true});
        return {matching: true};
      }
      return null;
    };
  }
}
