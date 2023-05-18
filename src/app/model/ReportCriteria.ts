import {ReportType} from "./enum/ReportType";

export class ReportCriteria {
  public reportType: ReportType;
  public reportDate: string;
  public downloadFileType: string;


  constructor(reportType: ReportType, reportDate: string, downloadFileType: string) {
    this.reportType = reportType;
    this.reportDate = reportDate;
    this.downloadFileType = downloadFileType;
  }

}
