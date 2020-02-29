import { Component, OnInit , ViewChild , OnDestroy,} from '@angular/core';
import {DataService} from '../data.service'
import {Subject} from 'rxjs'
import { DataTableDirective } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
const datePipe = new DatePipe('en-US');


@Component({
  selector: 'app-rides-list',
  templateUrl: './rides-list.component.html',
  styleUrls: ['./rides-list.component.css']
})
export class RidesListComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ride_status:string = "-1"
  rides:any
  isLoading:boolean=true;
  constructor(private dataService:DataService,private router:Router) { }

  ngOnInit() {
    this.dtOptions = {
      columnDefs: [
        {
          render: function (data, type, full, meta) {
            return '<div class="text-wrap width-200">' + data + '</div>';
          },
          targets: [2,3,4]
        }
      ]
    };
  
    this.dataService.getRides(this.ride_status).subscribe((data:any)=>{
      this.rides=data
      this.dtTrigger.next()
      this.isLoading = false;
    });
    
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onRideChange(ride_status:string){
    //alert(ride_status)
    this.dataService.getRides(ride_status).subscribe((data:any)=>{
      this.rides = data
      this.rerender()
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  navigateToRideDetail(id:string){
    this.router.navigate(["rides/"+id])
  }

  getRideStatusText(id:number){
    var status = ["Waiting","Driver Assigned","Driver Arrived","Started","Completed","Driver Unavailable","Cancelled"]
    return status[id]
  }
  getStatusColor(id: number) {
    var status = ["#e67e22", "#3498db", "#2980b9", "#2ecc71", "#1abc9c", "#d35400", "#e74c3c"]
    return status[id]
  }

  getFormattedDateTime(date:string){
    return datePipe.transform(date, 'EE, MMMM d, hh:mm a');
  }
}
