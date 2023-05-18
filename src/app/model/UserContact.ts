import {UserContactOption} from "./enum/UserContactOption";
import {ContactPreference} from "./enum/ContactPreference";


export class UserContact {
  public IDNumber: string;
  public contact: string;
  public  contactPreference: ContactPreference;
  public  status: UserContactOption;

  constructor(IDNumber: string, contact: string, contactPreference: ContactPreference, status: UserContactOption) {
    this.IDNumber = IDNumber;
    this.contactPreference = contactPreference;
    this.contact = contact;
    this.status = status;
  }
}
