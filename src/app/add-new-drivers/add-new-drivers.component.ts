import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {Location} from '@angular/common';

interface MobileNumber {
  number: string;
  internationalNumber: string;
  countryCode: string;
}

@Component({
  selector: 'app-add-new-drivers',
  templateUrl: './add-new-drivers.component.html',
  styleUrls: ['./add-new-drivers.component.css']
})
export class AddNewDriversComponent implements OnInit {
  // companyList: any;
  public locationList: any;
  public location_id: string;

  vehicle_categories: any;
  vehicle_types: any;
  operators: any;

  id: string;
  operator_id: string;
  name: string;
  mobile_number: any;
  license_number: string;
  vehicle_name: string;
  vehicle_type_id: number;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_number: string;

  enableImages: boolean = false;

  vehicle_image: string = 'Choose Vehicle Image';
  _vehicle_image: File = null;
  driver_image: string = 'Choose Driver Image';
  _driver_image: File = null;

  driverForm: FormGroup;
  submitted: boolean = false;
  company_id: string;
  company_name: string;

  constructor(private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private notifier: NotifierService,
              private location: Location) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.company_id = params['id'];
      this.company_name = params['name'];
      // this.dataService.getActiveLocationsForCompany(this.company_id).subscribe(data => {
      //   this.locationList = data;
      // });
      !!params['id'] && this.dataService.getDriverDetails(params["id"]).subscribe((data: any) => {
        const {DriverDetails} = data;

        this.id = DriverDetails.ID;
        this.operator_id = DriverDetails.OperatorID;
        this.name = DriverDetails.Name;
        this.mobile_number = `+${DriverDetails.DialCode}${DriverDetails.MobileNumber}`;
        this.license_number = DriverDetails.LicenseNumber;
        this.vehicle_name = DriverDetails.VehicleName;
        this.vehicle_type_id = DriverDetails.VehicleTypeID;
        this.vehicle_brand = DriverDetails.VehicleBrand;
        this.vehicle_model = DriverDetails.VehicleModel;
        this.vehicle_color = DriverDetails.VehicleColor;
        this.vehicle_number = DriverDetails.VehicleNumber;
        // this.vehicle_image = DriverDetails.VehicleImage;
        // this.driver_image = DriverDetails.DriverImage;
        // console.log(DriverDetails);
      });
    });
    this.dataService.getVehicleTypes().subscribe(data => {
      this.vehicle_types = data;
    });

    this.dataService.getLocations().subscribe(data => {
      this.operators = data;
    });


    this.driverForm = this.formBuilder.group({
      id: [''],
      operator_id: ['', Validators.required],
      name: ['', Validators.required],
      // dialCode: ['', Validators.required],
      // location_id: ['', Validators.required],
      mobile_number: ['', Validators.required],
      license_number: ['', Validators.required],
      vehicle_name: ['', Validators.required],
      vehicle_type_id: ['', Validators.required],
      vehicle_brand: ['', Validators.required],
      vehicle_model: ['', Validators.required],
      vehicle_color: ['', Validators.required],
      vehicle_number: ['', Validators.required],
      // vehicle_image: ['', Validators.required],
      // driver_image: ['', Validators.required],
      enableImages: [false],
      vehicle_image: [''],
      driver_image: [''],
    });
  }

  vehicleImage(files: FileList) {
    this._vehicle_image = files.item(0);
    this.vehicle_image = files.item(0).name;
  }

  driverImage(files: FileList) {
    this._driver_image = files.item(0);
    this.driver_image = files.item(0).name;
  }

  onClick() {

  }

  get f() {
    return this.driverForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.driverForm.invalid) {
      if (!this.driverForm.get('mobile_number').valid) {
        this.notifier.show({
          type: 'error',
          message: 'Sorry ! The mobile number is invalid',
        });
      }
      return;
    }
    if (this.enableImages) {
      if (!this._vehicle_image) {
        this.notifier.show({
          type: 'error',
          message: 'Sorry ! The vehicle image is invalid',
        });
        return;
      } else if (!this._driver_image) {
        this.notifier.show({
          type: 'error',
          message: 'Sorry ! The driver image is invalid',
        });
        return;
      }
    }
    let code = this.mobile_number.internationalNumber;
    let x = code.split(' ');
    let dial_code = x[0];

    let mobile_number = this.mobile_number.number.substr(dial_code.length)

    let formData: FormData = new FormData();
    !!this.id && formData.append('id', this.id);
    formData.append('operator_id', this.operator_id);
    formData.append('name', this.name);
    // formData.append('location_id', this.location_id);
    formData.append('dial_code', dial_code);
    formData.append('mobile_number', mobile_number);
    formData.append('license_number', this.license_number);
    formData.append('vehicle_name', this.vehicle_name);
    formData.append('vehicle_type_id', String(this.vehicle_type_id));
    formData.append('vehicle_brand', this.vehicle_brand);
    formData.append('vehicle_model', this.vehicle_model);
    formData.append('vehicle_color', this.vehicle_color);
    formData.append('vehicle_number', this.vehicle_number);
    formData.append('vehicle_image', this._vehicle_image);
    formData.append('driver_image', this._driver_image);
    //  console.log(this.name,this.location_id,this.dial_code,this.mobile_number,this.license_number,this.image)
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.dataService.addNewDriver(formData, headers).subscribe((data: any) => {
      if (data.Status) {
        this.notifier.show({
          type: 'success',
          message: this.name + ' ' + data.Message,
        });
        if (!this.id) {
          this.id = data.ID;
        }
        // this.navigateToDriverList();
      } else {
        this.notifier.show({
          type: 'error',
          message: data.Message,
        });

      }
    });
  }

  onCancel() {
    this.goBack();
    // this.navigateToDriverList();
  }

  goBack() {
    this.location.back();
  }

  // navigateToDriverList() {
  //   this.router.navigate(['admin/companies/' + this.company_id + '/' + this.company_name + '/drivers']);
  // }
}
