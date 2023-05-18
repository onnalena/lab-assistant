import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, Observable, of} from "rxjs";
import {Computer} from "../model/Computer";
import {ErrorModel} from "../model/ErrorModel";


@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor(private http: HttpClient) { }

  public getAllComputers(): Observable<any>{
    return this.http.get(environment.backendEndpoint + "computer/get-all-computers").pipe(
      catchError(err=> this.handleErrors(err)));
  }

  public addComputer(computer: Computer){
    return this.http.post(environment.backendEndpoint + "computer/add-computer", computer).pipe(
      catchError(err=> this.handleErrors(err)));
  }

  public updateComputer(computer: Computer){
    return this.http.put(environment.backendEndpoint + "computer/update-computer", computer).pipe(
      catchError(err=> this.handleErrors(err))
    );
  }

  public deleteComputer(computer: Computer){
    return this.http.post(environment.backendEndpoint + "computer/delete-computer", computer).pipe(
      catchError(err=> this.handleErrors(err))
    );
  }

  public handleErrors(err: any): Observable<any>{
    return of(new ErrorModel(err.error));
  }
}
