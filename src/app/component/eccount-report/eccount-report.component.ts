import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Form, Validators, RequiredValidator } from '@angular/forms';
import {BackendAPIService} from '../service/backend-api.service';
import { HierarchyModel } from '../../Core/Model/hierarchyModel';
import{HierarchyComponent} from '../hierarchy/hierarchy.component';

@Component({
  selector: 'app-eccount-report',
  templateUrl: './eccount-report.component.html',
  styleUrls: ['./eccount-report.component.css']
})
export class ECCountReportComponent implements OnInit {

  @ViewChild(HierarchyComponent) hc;
  hierarchyMobj =new HierarchyModel();
  
  selectedDistrict;
  selectedState;
  constructor(private formBuilder: FormBuilder, private backendApiService: BackendAPIService) {
    
   }
 

  ngOnInit(): void {
    this,this.createForm()
  }


  selectdYear:number

  bulkprofiledatalist:any;
  bid:number;
  phcid:number;
  subphcid:number;
  vcode:number;

ecdatalist:any;

financial_year:Array<any>=[
  {code:2014, name:"2014"},
  {code:2015, name:"2015"},
  {code:2016, name:"2016"},
  {code:2017, name:"2017"},
  {code:2018, name:"2018"},
  {code:2019, name:"2019"},
  {code:2020, name:"2020"}
];

month:Array<any>=[
  {code:0, name:"All"},
  {code:1, name:"January"},
  {code:2, name:"February"},
  {code:3, name:"March"},
  {code:4, name:"April"},
  {code:5, name:"May"},
  {code:6, name:"June"},
  {code:7, name:"July"},
  {code:8, name:"August"},
  {code:9, name:"September"},
  {code:10, name:"October"},
  {code:11, name:"November"},
  {code:12, name:"December"}
  
];

myForm: FormGroup;

useSeachHandler(e){ 

  
    if(e.districtid!==undefined){
this.selectedState=e.stateid;
this.selectedDistrict=e.districtid

    }

}  

private createForm() {

  this.myForm = this.formBuilder.group({
    
    
    financialYr: new FormControl( ''),
    month:new FormControl( ''),
  } );
}

  

submitForm(myForm) {
  console.log(myForm)
  if(this.selectedDistrict==undefined){
    alert("Select District")
  }
  //alert("inside submit")

 /* let f= Number(this.myForm.get('finanacialYr').value;
 let m= Number(this.myForm.get('month').value */

  this.getECCountReport(this.selectedState,this.selectedDistrict,Number(this.myForm.get('month').value),Number(this.myForm.get('financialYr').value))

}


getECCountReport(state:number,district:number,month:number,year:number){

    this.backendApiService.getECCountReport(state,district,month,year)
.subscribe((res:Response)=>{
let response=JSON.parse(JSON.stringify(res));
console.log(response);
this.ecdatalist=response;
});
 
}





}
