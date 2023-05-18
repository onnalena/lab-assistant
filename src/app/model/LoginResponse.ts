import {LoginType} from "./enum/LoginType";
import {User} from "./User";

export class LoginResponse{
  constructor(
    public user: User,
    public loginType: LoginType
  ) {
  }
}
