import {UserContact} from "./UserContact";
import {UserStatus} from "./enum/UserStatus";
import {UserType} from "./enum/UserType";

export class User {
  public idnumber: string;
  public firstname: string;
  public lastname: string;
  public userContacts: UserContact[];
  public password: string;
  public status: UserStatus;
  public userType: UserType;

  constructor(IDNumber: string, firstname: string, lastname: string, password: string, status: UserStatus, userType: UserType, userContacts: UserContact[]) {
    this.idnumber = IDNumber;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.status = status;
    this.userType = userType;
    this.userContacts = userContacts;

  }

}
