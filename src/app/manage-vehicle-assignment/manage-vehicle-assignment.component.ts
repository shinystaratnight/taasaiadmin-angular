import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {Subject} from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import {DataService} from '../data.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { shiftInitState } from '@angular/core/src/view';
import { NotifierService } from 'angular-notifier';
import { resolveRendererType2 } from '@angular/core/src/view/util';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-manage-vehicle-assignment',
  templateUrl: './manage-vehicle-assignment.component.html',
  styleUrls: ['./manage-vehicle-assignment.component.css']
})
export class ManageVehicleAssignmentComponent implements OnInit {
  assetsUrl = environment.assetsUrl;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();

  driver_id: number;
  private sub: any;
  //vehicles:any
  vehicles: any;
  assigns:any
  vehicle_id:string
  driver_name:any
  company_name:string
  company_id:string
  assignVehicleForm:FormGroup;
  submitted:boolean = false;
  isLoading:boolean;
  modalRef: BsModalRef;
  Vehicle_name:string;

  constructor(private route:ActivatedRoute,private dataService:DataService,private formBuilder:FormBuilder,private notifier:NotifierService,private router:Router,private modalService: BsModalService) { }

  ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
        this.driver_id = +params['id'];
        this.driver_name = params['name'];

        this.company_id = params['companyId'];
        this.dataService.getVehiclesOfCompany(this.company_id).subscribe(data => {
          this.vehicles = data;
          console.log(this.vehicles)
        });
      // console.log(this.driver_id,this.driver_name)
    });
     
    this.dataService.getVehicleAssignments(this.driver_id).subscribe(data => {
      this.assigns = data
      console.log(data)
      this.dtTrigger.next()
      this.isLoading = false
      console.log(this.assigns)
    });
    this.assignVehicleForm = this.formBuilder.group({
      vehicle_id:['',Validators.required]
    })
  }

  getVehicleAssignments(){
    this.dataService.getVehicleAssignments(this.driver_id).subscribe(data => {
      this.assigns = data
      console.log(data)
      this.rerender()
      this.isLoading = false
      console.log(this.assigns)
    });
  }

  disableVehicleAssign(id:number,name:string){
    this.isLoading = true
    this.dataService.disableDriverAssignment(id).subscribe(data=> {
    console.log(data)
    this.notifier.show({
      type: 'warning',
      message: name +' - Vehicle assignment disabled',
     });
    this.getVehicleAssignments()
    });
}

enableVehicleAssign(id: number,name:string) {
   this.isLoading = true
  this.dataService.enableDriverAssignment(id).subscribe(data => {
    console.log(data)
    this.notifier.show({
      type: 'success',
      message: name +' - Vehicle assignment enabled successfully',

    });
    this.getVehicleAssignments()
  })
}
  get f(){
    return this.assignVehicleForm.controls;
  }

  onCancel(){
    this.router.navigate(["admin/drivers"])
  }

  onSubmit(){
    this.submitted=true
    if(this.assignVehicleForm.invalid){
      return
    }
    this.isLoading = true  
    this.dataService.addNewVehicleAssignment(this.vehicle_id,this.driver_id).subscribe((data:any) => {
      console.log(data)
      //alert(data.Message)
      if(data.Status){
        this.notifier.show({
        type: 'success',
        message: data.Message,
       });
      }else{
        this.notifier.show({
          type: 'warning',
          message: data.Message,
        });
      }
      this.isLoading = false
        this.dataService.getVehicleAssignments(this.driver_id).subscribe(data => {
          this.assigns = data
          this.rerender()
          console.log(this.assigns)
        });
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

  openModal(manageVehicleAssignment_disable_modal) {
    this.modalRef = this.modalService.show(manageVehicleAssignment_disable_modal);
  }
}
