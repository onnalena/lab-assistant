import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {catchError, Observable, of} from "rxjs";
import {ErrorModel} from "../model/ErrorModel";
import {ReportCriteria} from "../model/ReportCriteria";
@Injectable({
  providedIn: 'root'
})
export class DownloadReportService {

  constructor(private http: HttpClient) { }

  public downloadReport(reportCriteria: ReportCriteria):Observable<any>{
    const headers = new HttpHeaders({
      'content-type' : 'application/json'
    });
    return this.http.post(environment.backendEndpoint + "report/download", reportCriteria, {headers, responseType: 'blob'})
  }

  public downloadFile(reportCriteria: ReportCriteria){

  }

  public handleError(err: any) : Observable<any> {
    return of(new ErrorModel(err.error));
  }
}
