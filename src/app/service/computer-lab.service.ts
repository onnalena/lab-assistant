import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, Observable, of} from "rxjs";
import {ComputerLab} from "../model/ComputerLab";
import {ErrorModel} from "../model/ErrorModel";

@Injectable({
  providedIn: 'root'
})
export class ComputerLabService {
  constructor(private http: HttpClient) { }
  public getComputerLab(computerLabName: string): Observable<any>{
    return this.http.get(environment.backendEndpoint + "{" + computerLabName + "}");
  }
  public getComputerLabs():Observable<any>{
    return this.http.get(environment.backendEndpoint + "computer-lab/get-computer-labs").pipe(
      catchError(err=> this.handleErrors(err))
    );
  }
  public addComputerLab(computerLab: ComputerLab){
    return this.http.post(environment.backendEndpoint + "computer-lab/add-computer-lab", computerLab).pipe(
      catchError(err=> this.handleErrors(err))
    );
  }

  public updateComputerLab(computerLab: ComputerLab){
    return this.http.put(environment.backendEndpoint + "computer-lab/update-computer-lab", computerLab).pipe(
      catchError(err=> this.handleErrors(err))
    );
  }

  public deleteComputerLab(computerLabName: string){
    return this.http.get(environment.backendEndpoint + "computer-lab/delete-computer-lab/" + computerLabName).pipe(
      catchError(err=> this.handleErrors(err))
    );
  }

  public handleErrors(err: any):Observable<any>{
    return of(new ErrorModel(err.error));
  }
}
