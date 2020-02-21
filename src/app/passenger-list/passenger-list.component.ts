import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {DataService} from '../data.service';
import { DataTableDirective } from 'angular-datatables';
import {Subject} from 'rxjs';
import {Router} from '@angular/router'

@Component({
  selector: 'app-passenger-list',
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.css']
})
export class PassengerListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  Passengers:any;
  isLoading =true;

  constructor(private dataservice:DataService,private router:Router) { }

  ngOnInit() {
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'copy',
        'print',
        'excel'
      ]
    }
    this.dataservice.getPassenger().subscribe(data =>{
      this.Passengers = data
      this.dtTrigger.next();
      this.isLoading =false;
      console.log(this.Passengers);
    })
  }

  onViewPassengerHistory(id:number,name:string){
    this.router.navigate(["admin/passengerRideHistory/" + id + "/" + name])
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
