import { Component, OnInit } from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { StorefinderService } from "../../storefinder/storefinder.service";
import { SingletonService } from "../../services/singleton.service";
import { profileComponentService } from "../../component/profile-form/profile.service";
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
declare var document:any;
import { 
  Router, 
  ActivatedRoute 
} from "@angular/router";
@Component({
  selector: 'app-bi-report',
  templateUrl: './bi-report.component.html',
  styleUrls: ['./bi-report.component.scss']
})
export class BiReportComponent implements OnInit {
  model: NgbDateStruct;
  model1: NgbDateStruct;
  startDate:any;
  EndDate:any;
  token:any;
  date: {year: number, month: number};
  fileUrl:any;
  firstlist:boolean;
  secondlist:boolean;
  reporttype:boolean;
  endDateForExtension:any;
  excelFileName:any;
  constructor(
    private calendar: NgbCalendar,
    public router: Router,
    public storeServ: StorefinderService,
    public singletonServ: SingletonService,
    public checkoutserv:profileComponentService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.firstlist=true;
   
  }
  fromdate(){
    let startday=this.model1.day;
    let startmonth=this.model1.month;
    let startyear =this.model1.year;
    this.firstlist=false;
    this.secondlist=true;
  }
  selectToday() {
    // this.acctoken();
    const baseSite = this.singletonServ.catalogVersion;
    let startday=this.model1.day;
    let startmonth=this.model1.month;
    let startyear =this.model1.year;
    let endday=this.model.day;
    let endmonth=this.model.month;
    let endyear =this.model.year;
    var reportId = document.getElementById("ReportType").value;
    this.excelFileName=reportId;
    this.endDateForExtension=endday+"-"+endmonth +"-"+endyear;
    this.startDate=startyear+"-"+startmonth +"-"+startday+" "+"00:00:00.000";
    this.EndDate=endyear+"-"+endmonth +"-"+endday+" "+"23:59:00.000";
    let body={
      "fromDate":this.startDate,
      "toDate":this.EndDate,
      "reportType":reportId
    }
    
      this.checkoutserv.generateToken(baseSite).subscribe(resp=>{
        this.storeServ.biReport(baseSite,body,resp['access_token']).subscribe((response:any)=>{
          let data=JSON.parse(response);
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
          const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, this.excelFileName);

        },
        err=>{
        }
        );
      },
      err=>{
      }
      );

  }
  goHome(){
    this.router.navigate(['/store','index']);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + this.endDateForExtension + EXCEL_EXTENSION);
  }
}
