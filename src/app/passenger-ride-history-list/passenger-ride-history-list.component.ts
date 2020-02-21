import { Component, OnInit , ViewChild , OnDestroy,} from '@angular/core';
import {DataService} from '../data.service'
import {Subject} from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { Router, ActivatedRoute} from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
const datePipe = new DatePipe('en-US');

@Component({
  selector: 'app-passenger-ride-history-list',
  templateUrl: './passenger-ride-history-list.component.html',
  styleUrls: ['./passenger-ride-history-list.component.css']
})
export class PassengerRideHistoryListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  
  passenger_id:number;
  passenger_name:string;
  passenger_ride:any;

  constructor(private router:ActivatedRoute,private dataService:DataService,private notifier:NotifierService,private modalService: BsModalService,private routers:Router ) { }

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
    this.router.params.subscribe(params => {
      this.passenger_id = +params['id'];
      this.passenger_name = params['name'];
      console.log(this.passenger_id+this.passenger_name);
      this.dataService.getRidesForPassenger(this.passenger_id).subscribe(data => {
        this.passenger_ride = data
        console.log(this.passenger_ride)
        this.dtTrigger.next()
      //  this.isLoading = false;
      });
    });
    
    
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  navigateToRideDetail(id:string){
    this.routers.navigate(["admin/rides/"+id])
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

  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }



}
