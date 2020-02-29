import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {environment} from '../../environments/environment';
import {DatePipe} from '@angular/common';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

const datePipe = new DatePipe('en-US');

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  assetsUrl = environment.assetsUrl;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ride: any;
  details: any;
  driverId: any;
  docDetails = [];
  rides: any;
  isLoading: boolean = true;

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private notifier: NotifierService, private router: Router) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.driverId = params.id;
      this.getDetails();
      this.dataService.getRidesByDriver(this.driverId).subscribe((data: any) => {
        this.rides = data;
        this.dtTrigger.next();
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      })
    });
  }

  getDocStatus(isProfileCompleted: boolean) {
    let value = 'Submitted';
    if (!isProfileCompleted) {
      value = 'Not Submitted';
    }
    return value;
  }

  disableDriver() {
    this.dataService.disableDriver(this.details.DriverDetails.ID).subscribe(data => {
      console.log(data);
      this.notifier.show({
        type: 'warning',
        message: this.details.DriverDetails.Name + ' Driver disabled successfully',
      });
      this.getDetails();
    });
  }

  enableDriver() {
    this.dataService.enableDriver(this.details.DriverDetails.ID).subscribe(data => {
      console.log(data);
      this.notifier.show({
        type: 'success',
        message: this.details.DriverDetails.Name + ' Driver Approved successfully',

      });
      this.getDetails();
    });

  }

  getApprovalStatus(isActive: boolean) {
    let value = 'Approved';
    if (!isActive) {
      value = 'Not Approved';
    }
    return value;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getDetails() {
    this.dataService.getDriverDetails(this.driverId).subscribe((data: any) => {
      this.details = data;

      data.DocsRequired.forEach((item) => {
        const docData = {
          Document: {},
          UploadedDocument: {},
        };
        docData.Document = item;

        data.UploadedDocs.forEach((uploadedDoc) => {
          if (uploadedDoc.DocID === item.ID) {
            docData.UploadedDocument = uploadedDoc;
          }
        });

        this.docDetails.push(docData);
      });

      console.log(this.details);
    });
  }

  getStatusColor(id: number) {
    const status = ['#e67e22', '#3498db', '#2980b9', '#2ecc71', '#1abc9c', '#d35400', '#e74c3c'];
    return status[id];
  }

  downloadFile(url, name, doc, ext) {
    // this.dataService.downloadFile(url, `${name}-${document}.${ext}`);
    this.dataService.getDriverDocument(url)
      .subscribe(data => {
        console.log(data);
        let url = window.URL.createObjectURL(data);
        const element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', `${name}-${doc}.${ext}`);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      });
    // console.log(document.getElementById(doc));
    console.log(`${name}-${doc}.${ext}`);

    // let img = document.getElementById(doc) as HTMLImageElement;
    // blobUtil.imgSrcToBlob(img.src).then(function (blob) {
    //   let url = window.URL.createObjectURL(blob);
    //   const element = document.createElement('a');
    //   element.setAttribute('href', url);
    //   element.setAttribute('download', `${name}-${doc}`);
    //
    //   element.style.display = 'none';
    //   document.body.appendChild(element);
    //
    //   element.click();
    //
    //   document.body.removeChild(element);
    // });
  }

  getRideStatusText(id: number) {
    var status = ['Waiting', 'Driver Assigned', 'Driver Arrived', 'Started', 'Completed', 'Driver Unavailable', 'Cancelled'];
    return status[id];
  }

  getFormattedDateTime(date: string) {
    return datePipe.transform(date, 'EE, MMMM d, hh:mm a');
  }
}
