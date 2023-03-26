import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { TitleCasePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, interval, map,pipe, pluck, switchMap, take } from 'rxjs';
import { dataType } from './interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-datacomponent',
  templateUrl: './datacomponent.component.html',
  styleUrls: ['./datacomponent.component.scss']
})
export class DatacomponentComponent implements OnInit {

  loading = false;
  error = "";
  employees:dataType[]=[];
  dropdown = false;
  tempemployees:dataType[]=[];
  unique:String[]=[];

  viewStart = 0;
  viewEnd = 10;
  searchText="";

  @ViewChild('close') close!: ElementRef;

  constructor(private empdata : DataService) { }

  @HostListener('document:click',['$event'])
  clickOutside(event: { target: any; }){
    if(!this.close.nativeElement.contains(event.target)){
     this.dropdown = false;
    }
  }

  openSubMenu(){
    this.dropdown=!this.dropdown;
  }

  

  viewMore(){
    this.viewStart += 10;
    this.viewEnd += 10;
    
    this.getEmpData();
  }

  filter(event: any) {

    if(event=='all'){
      this.tempemployees=this.employees;
    }else{
      this.tempemployees = this.employees
      let filteredEmployees: dataType[] = [];
  
      filteredEmployees = this.employees.filter((val, index) => {
        let targetKey = val.designation.toLowerCase();
        let searchKey = event.toLowerCase();
        return targetKey.includes(searchKey);
      });
      this.tempemployees = filteredEmployees;
    }
    this.dropdown=!this.dropdown;
  }

  getEmpData(){
    this.loading = false
    this.empdata.getData().
    pipe(take(10)).
    subscribe(
    (res)=>{
      // console.log(res)
      this.employees = res;
      this.tempemployees = res;
      this.loading = true;

      this.unique = Array.from(new Set(res.map((item) => item.designation)));
      // console.log(this.unique);
      this.unique.sort();
    },
    (err)=>{
      this.error = "Please try again later => "+ err;
      // console.log("Please try again later => "+this.error);
    });
  }

  ngOnInit(): void {

    this.getEmpData();
  }


}
