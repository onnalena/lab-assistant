import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {environment} from "../../environments/environment";
import {catchError, Observable, of} from "rxjs";
import {NewPassword} from "../model/NewPassword";
import {ErrorModel} from "../model/ErrorModel";
import {Feedback} from "../model/Feedback";
import {Login} from "../model/Login";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }
  public save(user: User):  Observable<any>{
    return this.http.post(environment.backendEndpoint + "user/add-user", user).pipe(
      catchError(err => this.handleError(err))
    );
  }

  public addAdmin(user: User):  Observable<any>{
    return this.http.post(environment.backendEndpoint + "user/add-admin-user", user).pipe(
      catchError(err => this.handleError(err))
    );
  }

  public verifyUser(oneTimePin: string, IDNumber: string) : Observable<any>{
    return this.http.get(environment.backendEndpoint + "user/verify-otp/"+IDNumber+ "/" + oneTimePin).pipe(
      catchError(err => this.handleError(err))
    );
  }
  public logIn(loggedInStudent: Login): Observable<any>{
    return this.http.post(environment.backendEndpoint + "user/login", loggedInStudent).pipe(
      catchError(err => this.handleError(err))
    );
  }
  public forgotPassword(IDNumber: string): Observable<any>{
    return this.http.get(environment.backendEndpoint + "user/forgot-password/" + IDNumber).pipe(
      catchError(err=> this.handleError(err))
    );
  }

  public updateUser(user: User): Observable<any>{
    return this.http.put(environment.backendEndpoint + "user/update-user", user).pipe(
      catchError(err => this.handleError(err))
    );
  }
  public verifyPassword(login: Login) : Observable<any>{
    return this.http.post(environment.backendEndpoint + "user/verify-password", login).pipe(
      catchError(err => this.handleError(err))
    );
  }

  public adminUpdateUser(user: User):Observable<any>{
    return this.http.put(environment.backendEndpoint + "user/admin-update-user/", user).pipe(
      catchError(err => this.handleError(err))
    );
  }

  public getAllUsers(): Observable<any>{
    return this.http.get(environment.backendEndpoint + "user/get-all-users");
  }

  public updateUserPassword(newPassword: any):Observable<any>{
    return this.http.put(environment.backendEndpoint + "user/update-password", newPassword).pipe(
      catchError(err => this.handleError(err))
    );
  }

  public userFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(environment.backendEndpoint + "user/feedback", feedback).pipe(
      catchError(err => this.handleError(err))
    );
  }
  public getFeedback(): Observable<any>{
    return this.http.get(environment.backendEndpoint + "user/get-feedback").pipe(
      catchError(err => this.handleError(err))
    );
  }
  public deactivateUser(IDNumber: string): Observable<any>{
    return this.http.post(environment.backendEndpoint + "user/deactivate", IDNumber).pipe(
      catchError(err => this.handleError(err))
    );
  }

  public reactivateUser(IDNumber: string): Observable<any>{
    return this.http.post(environment.backendEndpoint + "user/reactivate", IDNumber).pipe(
      catchError(err => this.handleError(err))
    );
  }

  public handleError(err: any) : Observable<any> {
    return of(new ErrorModel(err.error));
  }
}
