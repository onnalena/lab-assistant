import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
    return this.http.post(environment.backendEndpoint + "report/download", reportCriteria).pipe(
      catchError(err=> this.handleError(err)));
  }

  public handleError(err: any) : Observable<any> {
    return of(new ErrorModel(err.error));
  }
}
