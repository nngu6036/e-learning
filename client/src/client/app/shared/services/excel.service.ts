import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import * as XLSX from 'xlsx';
export const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
declare var saveAs: any;

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);

  }

  public importFromExcelFile(file: any): Observable<any> {
    return Observable.create(function (observer) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        var data = new Uint8Array(e.target.result);
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, { type: 'array' });
        var sheetName = workbook.SheetNames[0];
        var sheet = workbook.Sheets[sheetName];
        observer.next(XLSX.utils.sheet_to_json(sheet));
        observer.complete();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  public importFromJsonFile(file: any): Observable<any> {
    return Observable.create(function (observer) {
      var reader = new FileReader();
      var textType = /application.json/;
      if (file.type.match(textType)) {
        reader.onload = function (e) {
          var data = reader.result;
          observer.next(data);
          observer.complete();
        }
        reader.readAsText(file);
      }
    });
  }
}