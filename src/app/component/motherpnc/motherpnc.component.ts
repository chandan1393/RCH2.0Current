import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup,ValidatorFn, AbstractControl } from '@angular/forms';
import { ECModel } from 'src/app/Core/Model/ec-model';
import { ectEntity } from 'src/app/ECTentity';
import { BackendAPIService } from '../service/backend-api.service';
import { HierarchyModel } from '../../Core/Model/hierarchyModel'
import { HierarchyComponent } from '../hierarchy/hierarchy.component'
import { TokenStorageService} from 'src/app/Core/service/token/tokenstoreage.service';
import { DatePipe } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-motherpnc',
  templateUrl: './motherpnc.component.html',
  styleUrls: ['./motherpnc.component.css']
})
export class MotherpncComponent implements OnInit {
	

 constructor(private fb: FormBuilder, private backendApiService: BackendAPIService, private tokenservice:TokenStorageService, public datepipe: DatePipe, private route: ActivatedRoute,public router: Router,private toastr: ToastrService) { }
 
 usehierarchyHandler(hierarchyMobj: HierarchyModel) {
    this.hierarchyMobj = hierarchyMobj;
    this.selectedVillage = this.hierarchyMobj.villageid
    this.selectedSubCentre = this.hierarchyMobj.subfacilityid
    this.selectedFacilityCode = this.hierarchyMobj.facilityid
    this.selectedHealthBlock = this.hierarchyMobj.blockid
    this.selectedDistrict = this.hierarchyMobj.districtid
    this.selectedState = this.hierarchyMobj.stateid
    this.selectedFacilityType = this.hierarchyMobj.facilitytypeid;
    console.log("state : " + this.selectedState + " District : " + this.selectedDistrict + "Block :"
      + this.selectedHealthBlock + "FacilityType" +
      this.selectedFacilityType + "Facility : " + this.selectedFacilityCode + " sub facility : " +
      this.selectedSubCentre + " village : " + this.selectedVillage)
this.fetchHealthProviderOnSubcentreAndVillage()



   //////// bs code start here /////////////
   
  
 
  }
  
  hierarchyMobj = new HierarchyModel();
 
  Method: Array<any>;
  rchId : number;

  selectedVillage;
  selectedSubCentre;
  selectedFacilityCode;
  selectedHealthBlock;
  selectedDistrict;
  selectedState;
  selectedFacilityType;
  
  motherpncForm: FormGroup;
  submitted = false;
  
   healthProviderANM: Array<any>;
   healthProviderASHA: Array<any>;

  ngOnInit(): void {
	  
	  
	   this.motherpncForm = this.fb.group({
			healthproviderName: ['', [Validators.required]],
          
			
        }
		
		);
		
  }
  
  get f() { return this.motherpncForm.controls; }
  
  onSubmit(motherpncForm) {
	  
	  
	  
	  this.submitted = true;
	  
	  if (this.motherpncForm.invalid) {
            return;
        }
		
		alert('yes form submitted');
  }
  
  
  fetchHealthProviderOnSubcentreAndVillage()
		{
		if (this.selectedSubCentre != null) {
		 this.getHealthProviderByANMType(this.selectedSubCentre, 2);
		  this.getHealthProviderByASHAType(this.selectedSubCentre, 1);
		 
		}
		}
	
	
	getHealthProviderByANMType(subcentre: number, typeid: number): void {
    this.backendApiService.getHealthProvideratSubcentre(subcentre, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);
      this.healthProviderANM = response;

    })
  }
  
  getHealthProviderByASHAType(subcentre: number, typeid: number): void {
    this.backendApiService.getHealthProvideratSubcentre(subcentre, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      //console.log(response);
      this.healthProviderASHA = response;

    })
  }
  

}
