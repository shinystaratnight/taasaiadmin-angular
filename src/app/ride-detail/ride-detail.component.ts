import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { AgmMap } from '@agm/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';

import { DatePipe } from '@angular/common';
const datePipe = new DatePipe('en-US');

@Component({
  selector: 'app-ride-detail',
  templateUrl: './ride-detail.component.html',
  styleUrls: ['./ride-detail.component.css']
})
export class RideDetailComponent implements OnInit {

  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  @ViewChild(AgmMap) map: any;

  locationForm: FormGroup;
  submitted: boolean = false

  polygon: any;
  latitude: number
  longitude: number
  name: string
  currency: string
  addres: string
  distance: number = 10 * 1000
  ride_locations: Array<any>
  polyline:any
  ride_id:string
  ride:any
  constructor(private dataService: DataService,private activatedRoute:ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private notifier: NotifierService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.ride_id = params['id'];
      this.dataService.getRideDetail(this.ride_id).subscribe((data: any) => {
        this.ride = data
        console.log(this.ride)
      });
      this.dataService.getRideLocations(this.ride_id).subscribe((data: any) => {
        this.ride_locations = data
        console.log(data)
        this.latitude = this.ride_locations[0].lat
        this.longitude = this.ride_locations[0].lng
      });
    })
  }

  getRideStatusText(id: number) {
    var status = ["Waiting", "Driver Assigned", "Driver Arrived", "Started", "Completed", "Driver Unavailable", "Cancelled"]
    return status[id]
  }
  getFormattedDateTime(date: string) {
    return datePipe.transform(date, 'EE, MMMM d, hh:mm a');
  }
  getStatusColor(id: number) {
    var status = ["#e67e22", "#3498db", "#2980b9", "#2ecc71", "#1abc9c", "#d35400", "#e74c3c"]
    return status[id]
  }
}
