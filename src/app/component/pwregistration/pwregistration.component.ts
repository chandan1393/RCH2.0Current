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
  selector: 'app-pwregistration',
  templateUrl: './pwregistration.component.html',
  styleUrls: ['./pwregistration.component.css']
})
export class PwregistrationComponent implements OnInit {
	
	
	   bsdate: Date;
       selectedPastIllness = [];
		selectedLastPregnancy = [];
		selectedLasttoLastPregnancy = [];
		
		selectedDeliveryPlace;
		selectedDeliveryPlaceName;
		selecteHBaAgTestResult;
        selecteHIVScreeningResult;
        selecteVDRLTestResult;
		
		
		
		
		
		settingsPastIllness = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "multidropdown",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
					
		settingsLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
        };
		
		settingsLasttoLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
        };

		/*/
        settings = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			//disabled:true,
			//limitSelection:2,
        };
		*/

  hierarchyMobj = new HierarchyModel();
 
  Method: Array<any>;
  rchId : number;
  
  
    msg: string;
  showNotFoundMsg: boolean = false;
  
  isAgeReadOnly: boolean = false;
  

  selectedVillage;
  selectedSubCentre;
  selectedFacilityCode;
  selectedHealthBlock;
  selectedDistrict;
  selectedState;
  selectedFacilityType;
  
  pwregistrationForm: FormGroup;
  submitted = false;
  
   healthProviderANM: Array<any>;
   healthProviderASHA: Array<any>;
   
   AllDeliveryPlaceName:Array<any>;
   
   BloodGroupList:Array<any>;
   
   PWregistrationData;
   
   
    continueFlag: boolean = false;
   
    showLastTwoPregnancy: boolean = false;
	
	showLastOnePregnancy: boolean = false;
	
	showFacilityDelivery: boolean = true;
	
	showOtherFacilityDelivery: boolean = false;
	
	showPastIllnessOther: boolean = false;
	
	showLastPregnancyOther: boolean = false;
	
	showLasttoLastPregnancyOther: boolean = false;
   
    whosemobile: Array<any> = [{ id: 'W', whosemobile: 'Woman' }, { id: 'H', whosemobile: 'Husband' }, { id: 'N', whosemobile: 'Neighbour' }, { id: 'R', whosemobile: 'Relative' }, { id: 'O', whosemobile: 'Other' }];
	
	noChildren: Array<any> = [{ id: '1', val: '1' }, { id: '2', val: '2' }, { id: '3', val: '3' }, { id: '4', val: '4' }, { id: '5', val: '5' }, { id: '6', val: '6' }];
	
     pastIllnessList: Array<any> = [];
	 
	 lastPregnancyList: Array<any> = [];
	 
	 //////////// dob 10-60 years//////////
	 
	 minYear:number = new Date().getFullYear()-60;
     maxYear:number = new Date().getFullYear()-10;
     startYear:number = new Date().getFullYear()-10;
	 
	 minDate_dob = {year: this.minYear, month: 1, day: 1};
     maxDate_dob={year: this.maxYear, month: 12, day: 31};
     startDate_dob = {year: this.startYear, month: 12, day: 31};
		
	maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
	
	maxDateLMP = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
	
	minDateLMP = {};
	
	maxDateANC = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
	
	minDateANC = {};
	
	maxDateExam = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
	
	minDateExam = {};
	
	
	
	todayDate =new Date().getFullYear()+','+new Date().getMonth() + 1+','+new Date().getDate(); 
       



    constructor(private fb: FormBuilder, private backendApiService: BackendAPIService, private tokenservice:TokenStorageService, public datepipe: DatePipe, private route: ActivatedRoute,public router: Router,private toastr: ToastrService) { }
	
	
	l  
	
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
    if (this.selectedState == undefined
      || this.selectedDistrict == undefined || this.selectedHealthBlock == undefined || this.selectedFacilityType == undefined
      || this.selectedFacilityCode == undefined || this.selectedSubCentre == undefined 
    ) {

      this.showNotFoundMsg = true;
      this.msg = "Select Hierarchy";
     
    }
	
	else{
		this.showNotFoundMsg = false;
      this.msg = "";
	}
  
 
 
  }
  
  
      
    
	
    ngOnInit() {
		
		

       this.selectedDeliveryPlace='';
	   this.selectedDeliveryPlaceName='';
	   this.selecteHBaAgTestResult='';
	   this.selecteHIVScreeningResult='';
	   this.selecteVDRLTestResult='';
		
		  this.pwregistrationForm = this.fb.group({
			healthproviderName: ['', [Validators.required]],
            ashaName: ['', [Validators.required]],
            pwBloodGroup: ['', [Validators.required]],
            //pwWeight: ['', [Validators.required,Validators.pattern("^[0-9]+([.][0-9]{0,3})?$")]], // only integer and decimal value
			pwWeight: ['', [Validators.required,Validators.pattern("^[0-9]{1,}$"),this.patternWeightValidator()]],
			pwHeight: ['', [Validators.required,Validators.pattern("^[0-9]{1,}$"),this.patternHeightValidator()]],
           
            mobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?^[6-9][0-9]{9}$"),this.patternMobValidator()]],			
            whosemobileNo: ['', [Validators.required]],
           // weekNo: ['', [Validators.required]],
			weekNo: [null],
			LMPDate: ['', [Validators.required]],
            eddDate: ['', [Validators.required]],
            ancDate: ['', [Validators.required]],			
			
            pastIllness: [[], Validators.required],
			
			totalPregnancy: ['', [Validators.required,Validators.pattern("^[0-9]{1,}$"),this.patternPregnancyValidator()]],
		    lastPregnancy: [null],
			lasttolastPregnancy: [null],
			
			
			VDRLTestDone: ['', [Validators.required]],
           // VRDLTestDate: [null],
			VRDLTestDate: [{value:'', disabled:true}],
			//VDRLTestResult: [null],
			VDRLTestResult: [{value:'', disabled:true}],
			HIVScreeningDone: ['', [Validators.required]],
            //HIVScreeningDate: [null],
			HIVScreeningDate: [{value:'', disabled:true}],
			//HIVScreeningResult: [null],
			HIVScreeningResult: [{value:'', disabled:true}],
			HBaAgTestDone: ['', [Validators.required]],
            //HBaAgTestDate: [null],
			HBaAgTestDate: [{value:'', disabled:true}],
			//HBaAgTestResult: [null],
			HBaAgTestResult: [{value:'', disabled:true}],
			DeliveryPlace: ['', [Validators.required]],
			DeliveryPlaceName: [null],
			DeliveryPlaceNameOther: [null],
			PastIllnessOther: [null],
			LastPregnancyOther: [null],
			LasttoLastPregnancyOther: [null],
			LPlive: [null],
			LPstill: [null],
			LPabortion: [null],
			LLPlive: [null],
			LLPstill: [null],
			LLPabortion: [null],
			LPTotalOutcome: [null],
			LLPTotalOutcome: [null],
			
			dobDate: [{value:'', disabled:true}],
			
			RCHID: [null],
			WomanName: [null],
			HusbandName: [null],
			DateofRegistration: [null],
			LastVisitDate: [null],
			PWAge: ['', [Validators.required]],
			
		
			
        },
		 { 
         validator: [this.ancDateValidator('ancDate', 'LastVisitDate'),this.LMPDateValidator('LMPDate', 'ancDate'),this.VDRLTestValidator('VRDLTestDate', 'LMPDate', 'eddDate'),this.HIVScreeningDateValidator('HIVScreeningDate', 'LMPDate', 'eddDate'),this.HBaAgTestDateValidator('HBaAgTestDate', 'LMPDate', 'eddDate')]
        }
		
		);
		
		
		
		this.handleFormChangesCondition();
		
						
        //this.GetPWregistrationData('104000155296','1');  // Please Note : id and caseid value come from previous page
				
		if( (this.route.snapshot.queryParams.regid) && (this.route.snapshot.queryParams.caseid) )
		{
		this.GetPWregistrationData((this.route.snapshot.queryParams.regid),(this.route.snapshot.queryParams.caseid));
		
		}
		/*else if(window.localStorage.getItem("PageCode"))
		{
		this.GetPWregistrationData(window.localStorage.getItem("HomeSearch"),'1');	
		}*/
		else if(window.localStorage.getItem("RCH_ID"))
		{
		this.GetPWregistrationData(window.localStorage.getItem("RCH_ID"),'1');	
		}
		else
		{
		this.GetPWregistrationData('104000287002','1');	
		}
		 
				 
		 this.getBloodGroupList();
         this.getpastIllnessList();
		 this.getlastPregnancyList();
		 
		 
		 
		     }
			 
			  LMPDateValidator(controlName: any, matchingControlName: any){ 
    return (pwregistrationForm: FormGroup) => {
        const LMPcontrol = pwregistrationForm.controls[controlName];
        const ancControl = pwregistrationForm.controls[matchingControlName];
		
		
		
		if (LMPcontrol.errors && !LMPcontrol.errors.LMPDateValidator) {
            return;
        }
		console.log('LMP date value===');
		console.log(LMPcontrol.value)
		console.log(pwregistrationForm.value.LMPDate.year)
		
		
			let LMPDate_validation = LMPcontrol.value;
		
		 if(LMPDate_validation.month<10)
  {
	  var month_validation:string ="0" + LMPDate_validation.month;
	  
  }
  else{
	 var month_validation:string =LMPDate_validation.month; 
  }
  if(LMPDate_validation.day<10)
  {
	  var day_validation:string="0" + LMPDate_validation.day; 
	  
  }
  else{
	var day_validation:string=LMPDate_validation.day;
  }
 
  let LMPDate_modified_validation=LMPDate_validation.year+','+month_validation+','+day_validation;
  
  
         ////////////// anc data ///////////
		 
		 let ancDate_validation = ancControl.value;
		
		 if(ancDate_validation.month<10)
  {
	  var month_validation:string ="0" + ancDate_validation.month;
	  
  }
  else{
	 var month_validation:string =ancDate_validation.month; 
  }
  if(ancDate_validation.day<10)
  {
	  var day_validation:string="0" + ancDate_validation.day; 
	  
  }
  else{
	var day_validation:string=ancDate_validation.day;
  }
 
  let ancDate_modified_validation=ancDate_validation.year+','+month_validation+','+day_validation;
  
        	    	 
		 //////// end /////////////
  
		var daysDiff=this.dateDiffInDays(new Date(LMPDate_modified_validation), new Date(ancDate_modified_validation)); //4 days till XMAS
		
		console.log('date difference value===');
		console.log(daysDiff)
		
		if(daysDiff=>35 && daysDiff<=322)
		{
			LMPcontrol.setErrors(null);
		
	   }else{
			LMPcontrol.setErrors({ LMPDateValidator: true });
		}
		
		
		//alert(daysDiff);
		
		/*
        if (control.errors && !control.errors.LMPDateValidator) {
            return;
        }
        if (control.value !== RegControl.value) {
            control.setErrors({ LMPDateValidator: true });
        } else {
            control.setErrors(null);
        }
		
		*/
    }
}


VDRLTestValidator(controlName: any, controlName2: any, controlName3: any){ 
    return (pwregistrationForm: FormGroup) => {
        const VRDLTestcontrol = pwregistrationForm.controls[controlName];
        const LMPDateControl = pwregistrationForm.controls[controlName2];
		const eddDateControl = pwregistrationForm.controls[controlName3];
		
		
		
		if (VRDLTestcontrol.errors && !VRDLTestcontrol.errors.VRDLTestDateValidator) {
            return;
        }
		
		
		console.log('LMP date value===');
		console.log(VRDLTestcontrol.value)
				
		/////////// VRDL test validation ////
		
			let VRDLTest_validation = VRDLTestcontrol.value;
			
			//alert(VRDLTest_validation);
			
			if(VRDLTest_validation==null || VRDLTest_validation=='')
			{
				VRDLTestcontrol.setErrors(null);
				return;
			}
		
		 if(VRDLTest_validation.month<10)
  {
	  var month_validation:string ="0" + VRDLTest_validation.month;
	  
  }
  else{
	 var month_validation:string =VRDLTest_validation.month; 
  }
  if(VRDLTest_validation.day<10)
  {
	  var day_validation:string="0" + VRDLTest_validation.day; 
	  
  }
  else{
	var day_validation:string=VRDLTest_validation.day;
  }
 
  let VRDLTest_modified_validation=VRDLTest_validation.year+','+month_validation+','+day_validation;
  
  
  //////////// LMP data validation /////////
  
  let LMPDate_validation = LMPDateControl.value;
			
			if(LMPDate_validation==null)
			{
				VRDLTestcontrol.setErrors(null);
				return;
			}
		
		 if(LMPDate_validation.month<10)
  {
	  var month_validation:string ="0" + LMPDate_validation.month;
	  
  }
  else{
	 var month_validation:string =LMPDate_validation.month; 
  }
  if(LMPDate_validation.day<10)
  {
	  var day_validation:string="0" + LMPDate_validation.day; 
	  
  }
  else{
	var day_validation:string=LMPDate_validation.day;
  }
 
  let LMPDate_modified_validation=LMPDate_validation.year+','+month_validation+','+day_validation;
  
  
  ////////////////// edd date validation /////////////
  
  
  let eddDate_validation = eddDateControl.value;
			
			if(eddDate_validation==null)
			{
				VRDLTestcontrol.setErrors(null);
				return;
			}
		
		 if(eddDate_validation.month<10)
  {
	  var month_validation:string ="0" + eddDate_validation.month;
	  
  }
  else{
	 var month_validation:string =eddDate_validation.month; 
  }
  if(eddDate_validation.day<10)
  {
	  var day_validation:string="0" + eddDate_validation.day; 
	  
  }
  else{
	var day_validation:string=eddDate_validation.day;
  }
 
  let eddDate_modified_validation=eddDate_validation.year+','+month_validation+','+day_validation;
  
         ////////// cheak value ////
		 
		 if ( (new Date(LMPDate_modified_validation).getTime() <= new Date(VRDLTest_modified_validation).getTime() ) && (new Date(VRDLTest_modified_validation).getTime() <= new Date(eddDate_modified_validation).getTime() ) ) 
			 
			 {
				VRDLTestcontrol.setErrors(null); 
			 }
			 else{
				 VRDLTestcontrol.setErrors({ VRDLTestDateValidator: true });
			 }
		
		
    }
}

HIVScreeningDateValidator(controlName: any, controlName2: any, controlName3: any){ 
    return (pwregistrationForm: FormGroup) => {
        const HIVScreeningcontrol = pwregistrationForm.controls[controlName];
		
        const LMPDateControl = pwregistrationForm.controls[controlName2];
		const eddDateControl = pwregistrationForm.controls[controlName3];
		
		
		
		if (HIVScreeningcontrol.errors && !HIVScreeningcontrol.errors.HIVScreeningDateValidator) {
            return;
        }
		
		
		console.log('LMP date value===');
		console.log(HIVScreeningcontrol.value)
				
		/////////// VRDL test validation ////
		
			let HIVScreening_validation = HIVScreeningcontrol.value;
			
			if(HIVScreening_validation==null  || HIVScreening_validation=='')
			{
				HIVScreeningcontrol.setErrors(null);
				return;
			}
		
		 if(HIVScreening_validation.month<10)
  {
	  var month_validation:string ="0" + HIVScreening_validation.month;
	  
  }
  else{
	 var month_validation:string =HIVScreening_validation.month; 
  }
  if(HIVScreening_validation.day<10)
  {
	  var day_validation:string="0" + HIVScreening_validation.day; 
	  
  }
  else{
	var day_validation:string=HIVScreening_validation.day;
  }
 
  let HIVScreening_modified_validation=HIVScreening_validation.year+','+month_validation+','+day_validation;
  
  
  //////////// LMP data validation /////////
  
  let LMPDate_validation = LMPDateControl.value;
			
			if(LMPDate_validation==null)
			{
				HIVScreeningcontrol.setErrors(null);
				return;
			}
		
		 if(LMPDate_validation.month<10)
  {
	  var month_validation:string ="0" + LMPDate_validation.month;
	  
  }
  else{
	 var month_validation:string =LMPDate_validation.month; 
  }
  if(LMPDate_validation.day<10)
  {
	  var day_validation:string="0" + LMPDate_validation.day; 
	  
  }
  else{
	var day_validation:string=LMPDate_validation.day;
  }
 
  let LMPDate_modified_validation=LMPDate_validation.year+','+month_validation+','+day_validation;
  
  
  ////////////////// edd date validation /////////////
  
  
  let eddDate_validation = eddDateControl.value;
			
			if(eddDate_validation==null)
			{
				HIVScreeningcontrol.setErrors(null);
				return;
			}
		
		 if(eddDate_validation.month<10)
  {
	  var month_validation:string ="0" + eddDate_validation.month;
	  
  }
  else{
	 var month_validation:string =eddDate_validation.month; 
  }
  if(eddDate_validation.day<10)
  {
	  var day_validation:string="0" + eddDate_validation.day; 
	  
  }
  else{
	var day_validation:string=eddDate_validation.day;
  }
 
  let eddDate_modified_validation=eddDate_validation.year+','+month_validation+','+day_validation;
  
         ////////// cheak value ////
		 
		 if ( (new Date(LMPDate_modified_validation).getTime() <= new Date(HIVScreening_modified_validation).getTime() ) && (new Date(HIVScreening_modified_validation).getTime() <= new Date(eddDate_modified_validation).getTime() ) ) 
			 
			 {
				HIVScreeningcontrol.setErrors(null); 
			 }
			 else{
				 HIVScreeningcontrol.setErrors({ HIVScreeningDateValidator: true });
			 }
		
		
    }
}

HBaAgTestDateValidator(controlName: any, controlName2: any, controlName3: any){ 
    return (pwregistrationForm: FormGroup) => {
        const HBaAgTestcontrol = pwregistrationForm.controls[controlName];
		
        const LMPDateControl = pwregistrationForm.controls[controlName2];
		const eddDateControl = pwregistrationForm.controls[controlName3];
		
		
		
		if (HBaAgTestcontrol.errors && !HBaAgTestcontrol.errors.HBaAgTestDateValidator) {
            return;
        }
		
		
		console.log('LMP date value===');
		console.log(HBaAgTestcontrol.value)
				
		/////////// VRDL test validation ////
		
			let HBaAgTest_validation = HBaAgTestcontrol.value;
			
			if(HBaAgTest_validation==null || HBaAgTest_validation=='')
			{
				HBaAgTestcontrol.setErrors(null);
				return;
			}
		
		 if(HBaAgTest_validation.month<10)
  {
	  var month_validation:string ="0" + HBaAgTest_validation.month;
	  
  }
  else{
	 var month_validation:string =HBaAgTest_validation.month; 
  }
  if(HBaAgTest_validation.day<10)
  {
	  var day_validation:string="0" + HBaAgTest_validation.day; 
	  
  }
  else{
	var day_validation:string=HBaAgTest_validation.day;
  }
 
  let HBaAgTest_modified_validation=HBaAgTest_validation.year+','+month_validation+','+day_validation;
  
  
  //////////// LMP data validation /////////
  
  let LMPDate_validation = LMPDateControl.value;
			
			if(LMPDate_validation==null)
			{
				HBaAgTestcontrol.setErrors(null);
				return;
			}
		
		 if(LMPDate_validation.month<10)
  {
	  var month_validation:string ="0" + LMPDate_validation.month;
	  
  }
  else{
	 var month_validation:string =LMPDate_validation.month; 
  }
  if(LMPDate_validation.day<10)
  {
	  var day_validation:string="0" + LMPDate_validation.day; 
	  
  }
  else{
	var day_validation:string=LMPDate_validation.day;
  }
 
  let LMPDate_modified_validation=LMPDate_validation.year+','+month_validation+','+day_validation;
  
  
  ////////////////// edd date validation /////////////
  
  
  let eddDate_validation = eddDateControl.value;
			
			if(eddDate_validation==null)
			{
				HBaAgTestcontrol.setErrors(null);
				return;
			}
		
		 if(eddDate_validation.month<10)
  {
	  var month_validation:string ="0" + eddDate_validation.month;
	  
  }
  else{
	 var month_validation:string =eddDate_validation.month; 
  }
  if(eddDate_validation.day<10)
  {
	  var day_validation:string="0" + eddDate_validation.day; 
	  
  }
  else{
	var day_validation:string=eddDate_validation.day;
  }
 
  let eddDate_modified_validation=eddDate_validation.year+','+month_validation+','+day_validation;
  
         ////////// cheak value ////
		 
		 if ( (new Date(LMPDate_modified_validation).getTime() <= new Date(HBaAgTest_modified_validation).getTime() ) && (new Date(HBaAgTest_modified_validation).getTime() <= new Date(eddDate_modified_validation).getTime() ) ) 
			 
			 {
				HBaAgTestcontrol.setErrors(null); 
			 }
			 else{
				 HBaAgTestcontrol.setErrors({ HBaAgTestDateValidator: true });
			 }
		
		
    }
}

ancDateValidator(controlName: any, controlName3: any){ 
    return (pwregistrationForm: FormGroup) => {
		
		const ancDatecontrol = pwregistrationForm.controls[controlName];
		
		const LastVisitDateControl = pwregistrationForm.controls[controlName3];
		
		if (ancDatecontrol.errors && !ancDatecontrol.errors.ancDateValidator) {
            return;
        }
		
		/////////// anc date ///////
		let ancDate_validation = ancDatecontrol.value;
			
			if(ancDate_validation==null || ancDate_validation=='')
			{
				ancDatecontrol.setErrors(null);
				return;
			}
			
			if(ancDate_validation.month<10)
  {
	  var month_validation:string ="0" + ancDate_validation.month;
	  
  }
  else{
	 var month_validation:string =ancDate_validation.month; 
  }
  if(ancDate_validation.day<10)
  {
	  var day_validation:string="0" + ancDate_validation.day; 
	  
  }
  else{
	var day_validation:string=ancDate_validation.day;
  }
 
  let ancDate_modified_validation=ancDate_validation.year+','+month_validation+','+day_validation;
  
  
        
  
  ////////// last visit date ////////////
  
 
		 
		 let lvdyear_val=new Date(this.PWregistrationData.lastECVisitDate).getFullYear();
	   let lvdmonth_val=this.pad((new Date(this.PWregistrationData.lastECVisitDate).getMonth()+1),2);
	   
	   let lvdday_val=this.pad(new Date(this.PWregistrationData.lastECVisitDate).getDate(),2);
	   
	   let LastVisitDate_modified_validation=lvdyear_val+','+lvdmonth_val+','+lvdday_val; //dynemic set
	   
	   /// ehck value ///////
	   
	  
	   
	   if ( ( new Date(LastVisitDate_modified_validation).getTime() <= new Date(ancDate_modified_validation).getTime() ) && ( new Date(ancDate_modified_validation).getTime() <= new Date(this.todayDate).getTime() ))  
			 
			 {
				ancDatecontrol.setErrors(null); 
			 }
			 else{
				ancDatecontrol.setErrors({ ancDateValidator: true });
			 }
		
	   	   
	  
		
		
	}
}




  
dateDiffInDays(date1, date2) {  
    // round to the nearest whole number
    return Math.round((date2-date1)/(1000*60*60*24));
}
	
	 handleFormChangesCondition() {
		 
		  this.pwregistrationForm.get('totalPregnancy').valueChanges
  .subscribe(value => {
    if(value) {
		if(Number(value)==1)
		{
			 this.showLastOnePregnancy=true;
			 
			  //this.pwregistrationForm.get('lastPregnancy').setValidators(Validators.required); 
              // this.pwregistrationForm.get('lastPregnancy').updateValueAndValidity();
			   
			   // this.pwregistrationForm.get('lasttolastPregnancy').setValidators([]); // or clearValidators()
               // this.pwregistrationForm.get('lasttolastPregnancy').updateValueAndValidity();
		 
		 
			 this.showLastTwoPregnancy=false;
		}
		else if(Number(value)>1)
		{
			this.showLastOnePregnancy=true;
			this.showLastTwoPregnancy=true;
			
			 //this.pwregistrationForm.get('lastPregnancy').setValidators(Validators.required); 
             //  this.pwregistrationForm.get('lastPregnancy').updateValueAndValidity();
			   
			  //  this.pwregistrationForm.get('lasttolastPregnancy').setValidators(Validators.required); 
              // this.pwregistrationForm.get('lasttolastPregnancy').updateValueAndValidity();
		}
		else
		{
			
		// this.pwregistrationForm.get('lastPregnancy').setValidators([]); // or clearValidators()
         //this.pwregistrationForm.get('lastPregnancy').updateValueAndValidity();
		 
		 //this.pwregistrationForm.get('lasttolastPregnancy').setValidators([]); // or clearValidators()
         //this.pwregistrationForm.get('lasttolastPregnancy').updateValueAndValidity();
		 
		 this.showLastTwoPregnancy=false;
         this.showLastOnePregnancy=false;		 
		}
		}
		 });
		 
		 
		 this.pwregistrationForm.get('VDRLTestDone').valueChanges
  .subscribe(value => {
    if(value) {
		if(Number(value)==1)
		{
			
		 this.pwregistrationForm.get('VRDLTestDate').setValidators(Validators.required); 
         this.pwregistrationForm.get('VRDLTestDate').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('VDRLTestResult').setValidators(Validators.required); 
         this.pwregistrationForm.get('VDRLTestResult').updateValueAndValidity();
		 
		}
		else
		{
		 this.pwregistrationForm.get('VRDLTestDate').setValidators([]); // or clearValidators()
         this.pwregistrationForm.get('VRDLTestDate').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('VDRLTestResult').setValidators([]); // or clearValidators()
         this.pwregistrationForm.get('VDRLTestResult').updateValueAndValidity();
		 
		  this.pwregistrationForm.get('VRDLTestDate').setValue('');	
		  this.pwregistrationForm.get('VDRLTestResult').setValue('');
		 
		}
		}
		 });
		 
		 this.pwregistrationForm.get('HIVScreeningDone').valueChanges
  .subscribe(value => {
    if(value) {
		if(Number(value)==1)
		{
		 this.pwregistrationForm.get('HIVScreeningDate').setValidators(Validators.required); 
         this.pwregistrationForm.get('HIVScreeningDate').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('HIVScreeningResult').setValidators(Validators.required); 
         this.pwregistrationForm.get('HIVScreeningResult').updateValueAndValidity();
		 
		}
		else
		{
		 this.pwregistrationForm.get('HIVScreeningDate').setValidators([]); // or clearValidators()
         this.pwregistrationForm.get('HIVScreeningDate').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('HIVScreeningResult').setValidators([]); // or clearValidators()
         this.pwregistrationForm.get('HIVScreeningResult').updateValueAndValidity();
		 
		  this.pwregistrationForm.get('HIVScreeningDate').setValue('');	
		  this.pwregistrationForm.get('HIVScreeningResult').setValue('');
		 
		}
		}
		 });
		 
		 
		 this.pwregistrationForm.get('HBaAgTestDone').valueChanges
  .subscribe(value => {
    if(value) {
		if(Number(value)==1)
		{
		 this.pwregistrationForm.get('HBaAgTestDate').setValidators(Validators.required); 
         this.pwregistrationForm.get('HBaAgTestDate').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('HBaAgTestResult').setValidators(Validators.required); 
         this.pwregistrationForm.get('HBaAgTestResult').updateValueAndValidity();
		 
		}
		else
		{
		 this.pwregistrationForm.get('HBaAgTestDate').setValidators([]); // or clearValidators()
         this.pwregistrationForm.get('HBaAgTestDate').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('HBaAgTestResult').setValidators([]); // or clearValidators()
         this.pwregistrationForm.get('HBaAgTestResult').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('HBaAgTestDate').setValue('');	
		 this.pwregistrationForm.get('HBaAgTestResult').setValue('');	
		 
		}
		}
		
		
		 });
		 
		 this.pwregistrationForm.get('DeliveryPlace').valueChanges
  .subscribe(value => {
    if(value) {
		if(Number(value)==5 || Number(value)==7)
		{
			
		 this.pwregistrationForm.get('DeliveryPlaceName').setValidators([]); // or clearValidators()
         this.pwregistrationForm.get('DeliveryPlaceName').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('DeliveryPlaceNameOther').setValidators(Validators.required); 
         this.pwregistrationForm.get('DeliveryPlaceNameOther').updateValueAndValidity();
		 
		 
		}
		else
		{
		 		 
		 this.pwregistrationForm.get('DeliveryPlaceNameOther').setValidators([]); // or clearValidators()
         this.pwregistrationForm.get('DeliveryPlaceNameOther').updateValueAndValidity();
		 
		 this.pwregistrationForm.get('DeliveryPlaceName').setValidators(Validators.required); 
         this.pwregistrationForm.get('DeliveryPlaceName').updateValueAndValidity();
		 
		}
		}
		
		
		 });
		 
		 
		 ////////// change date according to changes  //////////////
		 
		  this.pwregistrationForm.get('ancDate').valueChanges
  .subscribe(value => {
    if(value) {
		
		
		let ancDate_change_val =value.year+','+value.month+','+value.day+' 12:00:00';
		
				
		this.bsdate = new Date(ancDate_change_val);
		
		this.bsdate.setDate( this.bsdate.getDate() - 322 );
		
		this.minDateLMP = { year: this.bsdate.getUTCFullYear(), month: (this.bsdate.getMonth() + 1), day: (this.bsdate.getUTCDate()) };
		
		this.bsdate = new Date(ancDate_change_val);
		this.bsdate.setDate( this.bsdate.getDate() - 35 );
		
		this.maxDateLMP = { year: this.bsdate.getUTCFullYear(), month: (this.bsdate.getMonth() + 1), day: (this.bsdate.getUTCDate()) };
		
		}
		
		 });
		 
		 this.pwregistrationForm.get('eddDate').valueChanges
  .subscribe(value => {
    if(value) {
		
		let changeDateLMP = this.pwregistrationForm.controls['LMPDate'].value;
		
				
		this.minDateExam = { year: changeDateLMP.year, month: changeDateLMP.month, day: changeDateLMP.day };
		this.maxDateExam = { year: value.year, month: value.month, day: value.day };
		}
		
		 });
		 
		 
		 
	 }
	 
	patternMobValidator(): ValidatorFn { 
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
	  
    
   let valid: number;
	 
	
	 
	 if(control.value=='9999999999' || control.value=='8888888888' || control.value=='7777777777')
	 {
		valid =0;   
	 }
	 else{
		valid =1; 
	 }
    
      return valid ? null : { pattern: true };
    };
  }
  
  patternPregnancyValidator(): ValidatorFn { 
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
	  
    
   let valid: number;
	 
	
	 
	 if(control.value>30)
	 {
		valid =0;   
	 }
	 else{
		valid =1; 
	 }
    
      return valid ? null : { Pregnancypattern: true };
    };
  }
  
  patternWeightValidator(): ValidatorFn { 
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
	  
    
   let valid: number;
	 
	
	 
	 if(control.value<30 || control.value>200)
	 {
		valid =0;   
	 }
	 else{
		valid =1; 
	 }
    
      return valid ? null : { Pwweightpattern: true };
    };
  }
  
  patternHeightValidator(): ValidatorFn { 
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
	  
    
   let valid: number;
	 
	
	 
	 if(control.value<30 || control.value>200)
	 {
		valid =0;   
	 }
	 else{
		valid =1; 
	 }
    
      return valid ? null : { PwHeightpattern: true };
    };
  }
	
	 get f() { return this.pwregistrationForm.controls;  }
  
  onSubmit(pwregistrationForm) {
	  
	  
	  
	  this.submitted = true;
	  
	  if (this.pwregistrationForm.invalid) {
            return;
        }
		
		//alert('form submited...');
		console.log('form submited value=== ');
		console.log(pwregistrationForm.value);
		
		console.log('Past Illness value=== ');
		console.log(pwregistrationForm.pastIllness);
		console.log(this.selectedPastIllness);
		
		
		
		
		//alert(pwregistrationForm.value.healthproviderName);
		
		///////// modified formate ///////
		
		////// registration date ////
		
		let	RegDate_modified=""
		
		let doryear=new Date(this.PWregistrationData.ecRegDate).getFullYear();
	   let dormonth=this.pad((new Date(this.PWregistrationData.ecRegDate).getMonth()+1),2);
	   
	   let dorday=this.pad(new Date(this.PWregistrationData.ecRegDate).getDate(),2);
	   
	   RegDate_modified=doryear+'-'+dormonth+'-'+dorday; 
		
		
		
		//////////lmpDate////////////
		
		let	LMPDate_modified_date="2020-12-24T08:42:15.826Z"
		
		if(this.pwregistrationForm.controls['LMPDate'].value)
		{
			
			let LMPDate_Val = this.pwregistrationForm.controls['LMPDate'].value;
			if (LMPDate_Val.month < 10) {
      var month_val: string = "0" + LMPDate_Val.month;

    }
    else {
      var month_val: string = LMPDate_Val.month;
    }
    if (LMPDate_Val.day < 10) {
      var day_val: string = "0" + LMPDate_Val.day;

    }
    else {
      var day_val: string = LMPDate_Val.day;
    }

     LMPDate_modified_date = LMPDate_Val.year + '-' + month_val + '-' + day_val;
		}
		
	
		
		///////////////dobDate ///////////////////
		
		let	dobDate_modified_date="2020-12-24T08:42:15.826Z"
		
		if(this.pwregistrationForm.controls['dobDate'].value)
		{
			
			let dobDate_Val = this.pwregistrationForm.controls['dobDate'].value;
			if (dobDate_Val.month < 10) {
      var month_val: string = "0" + dobDate_Val.month;

    }
    else {
      var month_val: string = dobDate_Val.month;
    }
    if (dobDate_Val.day < 10) {
      var day_val: string = "0" + dobDate_Val.day;

    }
    else {
      var day_val: string = dobDate_Val.day;
    }

     dobDate_modified_date = dobDate_Val.year + '-' + month_val + '-' + day_val;
		}	
		
		
		/////////////////// ancDate //////////////
		
		let	ancDate_modifiedfinal_date="2020-12-24T08:42:15.826Z"
		
		if(this.pwregistrationForm.controls['ancDate'].value)
		{
			
			let ancDate_Val = this.pwregistrationForm.controls['ancDate'].value;
			if (ancDate_Val.month < 10) {
      var month_val: string = "0" + ancDate_Val.month;

    }
    else {
      var month_val: string = ancDate_Val.month;
    }
    if (ancDate_Val.day < 10) {
      var day_val: string = "0" + ancDate_Val.day;

    }
    else {
      var day_val: string = ancDate_Val.day;
    }

     ancDate_modifiedfinal_date = ancDate_Val.year + '-' + month_val + '-' + day_val;
		}	
		
		
		/////////////////// eddDate //////////
		
		let	eddDate_modified_date="2020-12-24T08:42:15.826Z"
		
		if(this.pwregistrationForm.controls['eddDate'].value)
		{
			
			let eddDate_Val = this.pwregistrationForm.controls['eddDate'].value;
			if (eddDate_Val.month < 10) {
      var month_val: string = "0" + eddDate_Val.month;

    }
    else {
      var month_val: string = eddDate_Val.month;
    }
    if (eddDate_Val.day < 10) {
      var day_val: string = "0" + eddDate_Val.day;

    }
    else {
      var day_val: string = eddDate_Val.day;
    }

     eddDate_modified_date = eddDate_Val.year + '-' + month_val + '-' + day_val;
		}	
		
		//////////VRDLTestDate////////
		
		let	VRDLTestDate_modified_date="2020-12-24T08:42:15.826Z"
		
		if(this.pwregistrationForm.controls['VRDLTestDate'].value)
		{
			
			let VRDLTestDate_Val = this.pwregistrationForm.controls['VRDLTestDate'].value;
			if (VRDLTestDate_Val.month < 10) {
      var month_val: string = "0" + VRDLTestDate_Val.month;

    }
    else {
      var month_val: string = VRDLTestDate_Val.month;
    }
    if (VRDLTestDate_Val.day < 10) {
      var day_val: string = "0" + VRDLTestDate_Val.day;

    }
    else {
      var day_val: string = VRDLTestDate_Val.day;
    }

     VRDLTestDate_modified_date = VRDLTestDate_Val.year + '-' + month_val + '-' + day_val;
		}	
		
	///////////// HIVScreeningDate /////////////
	
	let	HIVScreeningDate_modified_date="2020-12-24T08:42:15.826Z"
		
		if(this.pwregistrationForm.controls['HIVScreeningDate'].value)
		{
			
			let HIVScreeningDate_Val = this.pwregistrationForm.controls['HIVScreeningDate'].value;
			if (HIVScreeningDate_Val.month < 10) {
      var month_val: string = "0" + HIVScreeningDate_Val.month;

    }
    else {
      var month_val: string = HIVScreeningDate_Val.month;
    }
    if (HIVScreeningDate_Val.day < 10) {
      var day_val: string = "0" + HIVScreeningDate_Val.day;

    }
    else {
      var day_val: string = HIVScreeningDate_Val.day;
    }

     HIVScreeningDate_modified_date = HIVScreeningDate_Val.year + '-' + month_val + '-' + day_val;
		}

    /////////// HBaAgTestDate ////////////////	

     let HBaAgTestDate_modified_date="2020-12-24T08:42:15.826Z"
		
		if(this.pwregistrationForm.controls['HBaAgTestDate'].value)
		{
			
			let HBaAgTestDate_Val = this.pwregistrationForm.controls['HBaAgTestDate'].value;
			if (HBaAgTestDate_Val.month < 10) {
      var month_val: string = "0" + HBaAgTestDate_Val.month;

    }
    else {
      var month_val: string = HBaAgTestDate_Val.month;
    }
    if (HBaAgTestDate_Val.day < 10) {
      var day_val: string = "0" + HBaAgTestDate_Val.day;

    }
    else {
      var day_val: string = HBaAgTestDate_Val.day;
    }

     HBaAgTestDate_modified_date = HBaAgTestDate_Val.year + '-' + month_val + '-' + day_val;
		}	
		
		
		////////// ANC Date ////////////////	

     let ANCDate_modified_date="2020-12-24T08:42:15.826Z"
		
		if(this.pwregistrationForm.controls['ancDate'].value)
		{
			
			let ANCDate_Val = this.pwregistrationForm.controls['ancDate'].value;
			if (ANCDate_Val.month < 10) {
      var month_val: string = "0" + ANCDate_Val.month;

    }
    else {
      var month_val: string = ANCDate_Val.month;
    }
    if (ANCDate_Val.day < 10) {
      var day_val: string = "0" + ANCDate_Val.day;

    }
    else {
      var day_val: string = ANCDate_Val.day;
    }

     ANCDate_modified_date = ANCDate_Val.year + '-' + month_val + '-' + day_val;
		}	
	
	
	
	/////////// past illness ////
	
	  console.log('Finel value selectedPastIllness==========');
	 console.log(this.selectedPastIllness)
	 let modified_PastIllness=""
	 for (var val of this.selectedPastIllness) 
	 {  
              modified_PastIllness=modified_PastIllness+val.id;
			  
			                			  
              }
			  
			  
			  /////////// past selectedLastPregnancy ////
	
	  console.log('Finel value selectedLastPregnancy==========');
	 console.log(this.selectedLastPregnancy)
	 let modified_LastPregnancy=""
	 for (var val of this.selectedLastPregnancy) 
	 {
              modified_LastPregnancy=modified_LastPregnancy+val.id;
			  
			                			  
              }
			  
			  /////////// past selectedLastPregnancy ////
	
	  console.log('Finel value LasttoLastPregnancy==========');
	 console.log(this.selectedLasttoLastPregnancy)
	 let modified_LasttoLastPregnancy=""
	 for (var val of this.selectedLasttoLastPregnancy) 
	 {
              modified_LasttoLastPregnancy=modified_LasttoLastPregnancy+val.id;
			  
			                			  
              }
		
		
		//////// end modified formate ///////////
		
		 let userId = this.tokenservice.getUserId();
		 
		 
		 /*
		
		let  data  = {
  "sno": 0,
  "stateCode": Number(this.selectedState),
  "districtCode": Number(this.selectedDistrict),
  "ruralUrban": "R",
  "healthBlockCode": Number(this.selectedHealthBlock),
  "talukaCode": "",
  "healthFacilityType": Number(this.selectedFacilityType),
  "healthFacilityCode": Number(this.selectedFacilityCode),
  "healthSubFacilityCode": Number(this.selectedSubCentre),
  "villageCode": Number(this.selectedVillage),
  "financialYr": "",
  "financialYear": 0,
  "registrationNo": Number(pwregistrationForm.value.RCHID),
  "idNo": "",
  "registerSrno": 0,
  "namePw": (pwregistrationForm.value.WomanName).toString(),
  "nameH": (pwregistrationForm.value.HusbandName).toString(),
  "address": "",
  "registrationDate": "1997-01-01",
  "mobileNo": (pwregistrationForm.value.mobileNo).toString(),
  "mobileRelatesTo":(pwregistrationForm.value.whosemobileNo).toString(),
  "religionCode": 0,
  "caste": 0,
  "bplApl": 0,
  "birthDate": dobDate_modified_date,
  "age": Number(pwregistrationForm.value.PWAge),
  "pwWeight": Number(pwregistrationForm.value.pwWeight),
  "anmId": Number(pwregistrationForm.value.healthproviderName),
  "ashaId": Number(pwregistrationForm.value.ashaName),
  "caseNo": 1,
  "ipAddress": "127.0.0.1",
  "flag": 0,
  "createdBy": Number(userId),
  "createdOn": "",
  "jsyBeneficiary": "",
  "jsyPaymentReceived": "",
  "deleteMother": 0,
  "reasonForDeletion": "",
  "deletedOn": "",
  "pregnancyWeeks": Number(pwregistrationForm.value.weekNo),
  "updatedOn": "",
  "updatedBy": Number(userId),
  "cpsmsFlag": 0,
  "mobileId": 0,
  "sourceId": 0,
  "entryType": 0,
  "entryTypeUpdateFlag": "",
  "oldEntryType": "",
  "dupCase": 0,
  "dupRank": 0,
  "mctsFullAnc": 0,
  "dupMotherDelete": 0,
  "wardNo": 0,
  "rurUrbHierarchy": "",
  "mpwId": 0,
  "pwHeight": Number(pwregistrationForm.value.pwHeight),
  "tMotherMedical": {
    "sno": 0,
    "stateCode": Number(this.selectedState),
    "districtCode": Number(this.selectedDistrict),
    "ruralUrban": "R",
    "healthBlockCode": Number(this.selectedHealthBlock),
    "talukaCode": "0001",
    "healthFacilityType": Number(this.selectedFacilityType),
    "healthFacilityCode": Number(this.selectedFacilityCode),
    "healthSubFacilityCode": Number(this.selectedSubCentre),
    "villageCode": Number(this.selectedVillage),
    "financialYr": "",
    "financialYear": 0,
    "registrationNo": Number(pwregistrationForm.value.RCHID),
    "idNo": "",
    "lmpDate": (LMPDate_modified_date).toString(),
    "reg12weeks": 0,
    "eddDate": (eddDate_modified_date).toString(),
     "bloodGroup": Number(pwregistrationForm.value.pwBloodGroup),
    "pastIllness": this.selectedPastIllness,
    "otherPastIllness": pwregistrationForm.value.PastIllnessOther,
    "noOfPregnancy": Number(pwregistrationForm.value.totalPregnancy),
    "lastPregComplication": this.selectedLastPregnancy,
    "otherLastComplication": pwregistrationForm.value.LastPregnancyOther,
    "outcomeLastPreg": Number(pwregistrationForm.value.LPTotalOutcome),
    "l2lPregComplication": this.selectedLasttoLastPregnancy,  
    "otherL2lComplication": pwregistrationForm.value.LasttoLastPregnancyOther,
    "outcomeL2lPreg": Number(pwregistrationForm.value.LLPTotalOutcome),
    "expectedDeliveryPlace": 0,
    "placeName": "",
    "vdrlTest": Number(pwregistrationForm.value.HIVScreeningDone),
    "vdrlDate": (VRDLTestDate_modified_date).toString(),
    "vdrlResult": (pwregistrationForm.value.VDRLTestResult).toString(),
    "hivTest": Number(pwregistrationForm.value.VDRLTestDone),
    "hivDate": (HIVScreeningDate_modified_date).toString(),
	"anmId": Number(pwregistrationForm.value.healthproviderName),
    "ashaId": Number(pwregistrationForm.value.ashaName),
    "caseNo": 0,
    "ipAddress": "string",
    "createdBy": Number(userId),
    "createdOn": "",
    "lastPregComplicationLength": 0,
    "l2lPregComplicationLength": 0,
    "pastIllnessLength": 0,
    "hivResult": "string",
    "deliveryLocationId": Number(pwregistrationForm.value.DeliveryPlace),
    "mobileId": 0,
    "updatedBy": Number(userId),
    "updatedOn": "",
    "sourceId": 0,
    "bloodGroupTest": "",
    "lmpUpdatedOn": "",
    "lmpUpdatedBy": 0,
    "wardNo": 0,
    "rurUrbHierarchy": "",
    "mpwId": 0,
    "hbTest": 0,
    "hbDate": "",
    "hbResult": "string",
    "lastPregLiveBirth": Number(pwregistrationForm.value.LPlive),
    "lastPregStillBirth": Number(pwregistrationForm.value.LPstill),
    "lastPregAbortion": Number(pwregistrationForm.value.LPabortion),
    "l2lpregLiveBirth": Number(pwregistrationForm.value.LLPlive),
    "l2lpregStillBirth": Number(pwregistrationForm.value.LLPstill),
    "l2lpregAbortion": Number(pwregistrationForm.value.LLPabortion),
  }
}
*/


let  data  = {
    "sno": 0,
    "stateCode": Number(this.selectedState),
    "districtCode": Number(this.selectedDistrict),
    "ruralUrban": "R",
    "healthBlockCode": Number(this.selectedHealthBlock),
    "talukaCode": "",
    "healthFacilityType": Number(this.selectedFacilityType),
    "healthFacilityCode": Number(this.selectedFacilityCode),
    "healthSubFacilityCode": Number(this.selectedSubCentre),
    "villageCode": Number(this.selectedVillage),
    "financialYr": "",
    "financialYear": 0,
    "registrationNo": Number(pwregistrationForm.value.RCHID),
    "idNo": "",
    "registerSrno": 0,
    "namePw": (pwregistrationForm.value.WomanName).toString(),
    "nameH": (pwregistrationForm.value.HusbandName).toString(),
    "address": "",
    "registrationDate": (ancDate_modifiedfinal_date).toString(),
    "mobileNo": (pwregistrationForm.value.mobileNo).toString(),
    "mobileRelatesTo": (pwregistrationForm.value.whosemobileNo).toString(),
    "religionCode": 0,
    "caste": 0,
    "bplApl": 0,
    "birthDate": dobDate_modified_date,
    "age": (Number(pwregistrationForm.value.PWAge)) > 0 ? Number(pwregistrationForm.value.PWAge) :0 ,
    "pwWeight": Number(pwregistrationForm.value.pwWeight),
    "anmId": Number(pwregistrationForm.value.healthproviderName),
    "ashaId": Number(pwregistrationForm.value.ashaName),
    "caseNo": 1,
    "ipAddress": "127.0.0.1",
    "flag": 0,
    "createdBy": Number(userId),
    "createdOn": "2020-12-30",
    "jsyBeneficiary": "",
    "jsyPaymentReceived": "",
    "deleteMother": 0,
    "reasonForDeletion": "",
    "deletedOn": null,
    "pregnancyWeeks": Number(pwregistrationForm.value.weekNo),
    "updatedOn": "2020-12-30",
    "updatedBy": Number(userId),
    "cpsmsFlag": 0,
    "mobileId": 0,
    "sourceId": 0,
    "entryType": 0,
    "entryTypeUpdateFlag": "",
    "oldEntryType": "",
    "dupCase": 0,
    "dupRank": 0,
    "mctsFullAnc": 0,
    "dupMotherDelete": 0,
    "wardNo": 0,
    "rurUrbHierarchy": "",
    "mpwId": 0,
    "pwHeight": Number(pwregistrationForm.value.pwHeight),
    "tMotherMedical": {
        "sno": 0,
        "stateCode": Number(this.selectedState),
        "districtCode": Number(this.selectedDistrict),
        "ruralUrban": "R",
        "healthBlockCode": Number(this.selectedHealthBlock),
        "talukaCode": "0001",
        "healthFacilityType": Number(this.selectedFacilityType),
        "healthFacilityCode": Number(this.selectedFacilityCode),
        "healthSubFacilityCode": Number(this.selectedSubCentre),
        "villageCode": Number(this.selectedVillage),
        "financialYr": "",
        "financialYear": 0,
        "registrationNo": Number(pwregistrationForm.value.RCHID),
        "idNo": "",
        "lmpDate": (LMPDate_modified_date).toString(),
        "reg12weeks": 0,
        "eddDate": (eddDate_modified_date).toString(),
        "bloodGroup": Number(pwregistrationForm.value.pwBloodGroup),
        "pastIllness": (modified_PastIllness).toString(),
        "otherPastIllness": null,
        "noOfPregnancy": Number(pwregistrationForm.value.totalPregnancy),
        "lastPregComplication": (modified_LastPregnancy).toString(),
        "outcomeLastPreg": Number(pwregistrationForm.value.LPTotalOutcome),
        "l2lPregComplication": (modified_LasttoLastPregnancy).toString(),
        "outcomeL2lPreg": Number(pwregistrationForm.value.LLPTotalOutcome),
        "expectedDeliveryPlace": 0,
        "placeName": "",
        "vdrlTest": Number(pwregistrationForm.value.HIVScreeningDone),
    "vdrlDate": (VRDLTestDate_modified_date),
    "vdrlResult": (pwregistrationForm.value.VDRLTestResult),
    "hivTest": Number(pwregistrationForm.value.VDRLTestDone),
    "hivDate": (HIVScreeningDate_modified_date).toString(),
	"anmId": Number(pwregistrationForm.value.healthproviderName),
    "ashaId": Number(pwregistrationForm.value.ashaName),
        "caseNo": 1,
        "ipAddress": "string",
        "createdBy": Number(userId),
        "createdOn": "2020-12-30",
        "lastPregComplicationLength": 0,
        "l2lPregComplicationLength": 0,
        "pastIllnessLength": 0,
        "hivResult": null,
        "deliveryLocationId": Number(pwregistrationForm.value.DeliveryPlace),
        "mobileId": 0,
        "updatedBy": Number(userId),
        "updatedOn": null,
        "sourceId": 0,
        "bloodGroupTest": "",
        "lmpUpdatedOn": null,
        "lmpUpdatedBy": 0,
        "wardNo": 0,
        "rurUrbHierarchy": "",
        "mpwId": 0,
        "hbTest": 0,
        "hbDate": null,
        "hbResult": null,
        "lastPregLiveBirth": Number(pwregistrationForm.value.LPlive),
    "lastPregStillBirth": Number(pwregistrationForm.value.LPstill),
    "lastPregAbortion": Number(pwregistrationForm.value.LPabortion),
    "l2lpregLiveBirth": Number(pwregistrationForm.value.LLPlive),
    "l2lpregStillBirth": Number(pwregistrationForm.value.LLPstill),
    "l2lpregAbortion": Number(pwregistrationForm.value.LLPabortion),
    }
}		
		
		this.savepwUser(data);
	  
	  }
	  
	   savepwUser(data: any){
		   
	   console.log('this pass');
	   console.log(JSON.stringify(data))

  this.backendApiService.savepwUserAPI(data).subscribe((res:Response)=> {
	  
	  console.log('this is coming');
	  
   // let response=JSON.parse(JSON.stringify(res));
   
     console.log(res);
	
	//let response=JSON.parse((res));
	
    //console.log(response);
	
//this.registraionArray = response;

console.log('user created successfully');

if(Object.keys(res).length>0){
	
	 this.continueFlag = true;
  alert('Data successfully saved ');
  this.toastr.success('Data successfully saved');
//this.router.navigate(['/login']);
	
  

}else{
	
// bs please not need to check below code according to return	
 
 //this.errorresponse="Something went wrong. Please try again later"; 
	// this.showServerresponseMsgWrong= false;
	//this.continueFlag = true;
	 alert('Something went wrong. Please try again later ');

}

     },(error) => { 
	 
	 if(error=='Error:409-Conflict')
	 {
		 //this.continueFlag = true;
		 alert('User already exist');
	// this.errorresponse="Conflict: User already exist";
	this.toastr.error('User already exist'); 
      //this.notifyService.showError("Conflict: User already exist.","")	 
	 }
	 else
	 {
		// this.continueFlag = true;
		 alert('Something went wrong. Please try again later ');
		 this.toastr.error('Something went wrong. Please try again later'); 
		 //this.errorresponse="Something went wrong. Please try again later"; 
		 //this.notifyService.showError("Something went wrong. Please try again later.","")
	 }
	 console.log(error);
	 // alert('Something went wrong. Please try again later ');
	// this.showServerresponseMsgWrong= false;
	 }
	 )

}
	
	
    onItemSelect(item: any) { 
        console.log(item);
        console.log(this.selectedPastIllness);
    }
    OnItemDeSelect(item: any) {
        console.log(item);
        console.log(this.selectedPastIllness);
    }
    onSelectAll(items: any) {
        console.log(items);
    }
    onDeSelectAll(items: any) {
        console.log(items);
    }
	
	///// past illness event start here ///////
	onItemSelectPastIllness(item: any) { 
	
	   // alert(item.id);
        console.log(item);
        console.log(this.selectedPastIllness);
		if(item.id=='Z')
		{
			
		this.showPastIllnessOther= true;
		
		this.pwregistrationForm.get('PastIllnessOther').setValidators(Validators.required); 
        this.pwregistrationForm.get('PastIllnessOther').updateValueAndValidity();
		
		
		
		/*alert(this.selectedPastIllness.length);
		 for (var i = 0; i < this.selectedPastIllness.length; i++) { alert('kaam to ho raha hai');
      this.selectedPastIllness[i].isSelected = false;
	  
    }*/
	
	   /*
	    this.selectedPastIllness = [{"id":"Z","itemName":"Any Other (Specify)"}];
		
		
		this.settingsPastIllness = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:1,
			        };
					
					*/
  				
        
		}
		else if(item.id=='J')
		{
			this.pwregistrationForm.get('PastIllnessOther').setValidators([]); // or clearValidators()
        this.pwregistrationForm.get('PastIllnessOther').updateValueAndValidity();
			this.showPastIllnessOther= false;
			this.selectedPastIllness = [{"id":"J","itemName":"None"}];
		
		
		this.settingsPastIllness = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:1,
			        };
			
		}
		
		
    }
	
	
    OnItemDeSelectPastIllness(item: any) {
        console.log(item);
        console.log(this.selectedPastIllness);
		
		if(item.id=="Z")
		{
			this.pwregistrationForm.get('PastIllnessOther').setValidators([]); // or clearValidators()
        this.pwregistrationForm.get('PastIllnessOther').updateValueAndValidity();
		this.showPastIllnessOther= false; 
		this.settingsPastIllness = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
        
		}
		else if(item.id=='J')
		{
			this.settingsPastIllness = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
			
		}
		
		
    }
	
	///////////// past illness event end here ////////////
	
	///////// last prgenency event start here //////
	
	
	
	onItemSelectLastPregnancy(item: any) { 
	
	   // alert(item.id);
        console.log(item);
        console.log(this.selectedLastPregnancy);
		if(item.id=='H')
		{
			
		this.showLastPregnancyOther= true;
		this.pwregistrationForm.get('LastPregnancyOther').setValidators(Validators.required); 
         this.pwregistrationForm.get('LastPregnancyOther').updateValueAndValidity();
	
	    /*
	    this.selectedLastPregnancy = [{"id":"H","itemName":"Any Other (Specify)"}];
		
		
		this.settingsLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:1,
			        };
					
					*/
  				
        
		}
		else if(item.id=='J')
		{
			this.pwregistrationForm.get('LastPregnancyOther').setValidators([]); // or clearValidators()
            this.pwregistrationForm.get('LastPregnancyOther').updateValueAndValidity();
			this.showLastPregnancyOther= false;
			this.selectedLastPregnancy = [{"id":"J","itemName":"None"}];
		
		
		this.settingsLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:1,
			        };
			
		}
		
		else if(item.id=='I')
		{
			this.pwregistrationForm.get('LastPregnancyOther').setValidators([]); // or clearValidators()
            this.pwregistrationForm.get('LastPregnancyOther').updateValueAndValidity();
			this.showLastPregnancyOther= false;
			this.selectedLastPregnancy = [{"id":"I","itemName":"Dont Know"}];
		
		
		this.settingsLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:1,
			        };
			
		}
		
		
    }
	
	
    OnItemDeSelectLastPregnancy(item: any) {
        console.log(item);
        console.log(this.selectedLastPregnancy);
		
		if(item.id=="H")
		{
			this.pwregistrationForm.get('LastPregnancyOther').setValidators([]); // or clearValidators()
            this.pwregistrationForm.get('LastPregnancyOther').updateValueAndValidity();
		this.showLastPregnancyOther= false; 
		this.settingsLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
        
		}
		else if(item.id=='J')
		{
			this.settingsLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
			
		}
		else if(item.id=='I')
		{
			this.settingsLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
			
		}
		
		
    }
	
	//////// last pregnancy event end here      /////
	
	
	//////////// last to last prgenency event start here ///////
	
	onItemSelectLasttoLastPregnancy(item: any) { 
	
	   // alert(item.id);
        console.log(item);
        console.log(this.selectedLasttoLastPregnancy);
		if(item.id=='H')
		{
		
       		
		this.showLasttoLastPregnancyOther= true;
		 this.pwregistrationForm.get('LasttoLastPregnancyOther').setValidators(Validators.required); 
        this.pwregistrationForm.get('LasttoLastPregnancyOther').updateValueAndValidity();
	    
		/*
	
	    this.selectedLasttoLastPregnancy = [{"id":"H","itemName":"Any Other (Specify)"}];
		
		
		this.settingsLasttoLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:1,
			        };
					
		*/
  				
        
		}
		else if(item.id=='J')
		{
			this.pwregistrationForm.get('LasttoLastPregnancyOther').setValidators([]); // or clearValidators()
            this.pwregistrationForm.get('LasttoLastPregnancyOther').updateValueAndValidity();
			this.showLasttoLastPregnancyOther= false;
			
			this.selectedLasttoLastPregnancy = [{"id":"J","itemName":"None"}];
		
		
		this.settingsLasttoLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:1,
			        };
			
		}
		
		else if(item.id=='I')
		{   
	        this.pwregistrationForm.get('LasttoLastPregnancyOther').setValidators([]); // or clearValidators()
            this.pwregistrationForm.get('LasttoLastPregnancyOther').updateValueAndValidity();
			this.showLasttoLastPregnancyOther= false;
			
			this.selectedLasttoLastPregnancy = [{"id":"I","itemName":"Dont Know"}];
		
		
		this.settingsLasttoLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:1,
			        };
			
		}
		
		
    }
	
	
    OnItemDeSelectLasttoLastPregnancy(item: any) {
        console.log(item);
        console.log(this.selectedLasttoLastPregnancy);
		
		if(item.id=="H")
		{
			this.pwregistrationForm.get('LasttoLastPregnancyOther').setValidators([]); // or clearValidators()
            this.pwregistrationForm.get('LasttoLastPregnancyOther').updateValueAndValidity();
		this.showLasttoLastPregnancyOther= false; 
		this.settingsLasttoLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
        
		}
		else if(item.id=='J')
		{
			this.settingsLasttoLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
			
		}
		else if(item.id=='I')
		{
			this.settingsLasttoLastPregnancy = {
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class",
			enableCheckAll:false,
			clearAll:false,
			autoUnselect:true,
			limitSelection:100,
			        };
			
		}
		
		
    }
	
	
	//////////////// end last ot last pregnancy here //////
	
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
  
  getpastIllnessList(): void { 
    this.backendApiService.getpastIllnessListAPI().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      //console.log(response);
      //this.pastIllnessList = response;
	  let count=0;
	  for (var val of response) {
       
	   this.pastIllnessList[count] = {id:val.id, itemName: val.name,codeSystem:val.codeSystem, codeValue:val.codeValue}; 
	   count++;
       }

    })
  }
  
    getlastPregnancyList(): void { 
    this.backendApiService.getlastPregnancyListAPI().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      //console.log(response);
      //this.lastPregnancyList = response;
	  let count=0;
	  for (var val of response) {
       
	   if(val.id!='G')
	   {
	   this.lastPregnancyList[count] = {id:val.id, itemName: val.name,namedId:val.namedId, codeValue:val.codeValue}; 
	   count++;
	   }
	   
       }

    })
  }
  
  
  getBloodGroupList(): void { 
    this.backendApiService.getBloodGroupListAPI().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      //console.log(response);
      this.BloodGroupList = response;
	  

    })
  }
  
   GetPWregistrationData(id:string,caseno:string): void { 
   
	 
   /*
  this.backendApiService.GetPWregistrationDataAPI(id,caseno).subscribe((res:Response)=> {
		 
      let response=JSON.parse(JSON.stringify(res));
      
      console.log('GetPWregistrationData=');
     console.log(response);
	 
	  this.PWregistrationData=response;
	
	
    })
	*/
	
	this.backendApiService.GetPWregistrationDataAPI(id,caseno)
      .then((res:Response) => {
         let response=JSON.parse(JSON.stringify(res));
      
      console.log('GetPWregistrationData=');
     console.log(response);
	   this.PWregistrationData=response;
	   
	   
	   
	    /*		 
		 this.pwregistrationForm.controls['dobDate'].setValue(
        {
       	  
	  year: new Date(this.PWregistrationData.birthDate).getFullYear(),
      month: new Date(this.PWregistrationData.birthDate).getMonth()+1,
      day: new Date(this.PWregistrationData.birthDate).getDate()
       });
	   */
	   
	   
	  
	   this.pwregistrationForm.controls['RCHID'].setValue(this.PWregistrationData.registrationNo);
	   this.pwregistrationForm.controls['WomanName'].setValue(this.PWregistrationData.beneficiaryNmae);
	   this.pwregistrationForm.controls['HusbandName'].setValue(this.PWregistrationData.husbandName);
	   this.pwregistrationForm.controls['PWAge'].setValue(this.PWregistrationData.age);
	   this.pwregistrationForm.controls['mobileNo'].setValue(this.PWregistrationData.mobileNumber);
	   
	   if(this.PWregistrationData.husbandName=='')  // overwrite whose mobile if hasband not exist remove hasband
	   { 
		    this.whosemobile = [{ id: 'W', whosemobile: 'Woman' }, { id: 'N', whosemobile: 'Neighbour' }, { id: 'R', whosemobile: 'Relative' }, { id: 'O', whosemobile: 'Other' }];
	   }
	  
	   
	   let doryear=new Date(this.PWregistrationData.ecRegDate).getFullYear();
	   let dormonth=this.pad((new Date(this.PWregistrationData.ecRegDate).getMonth()+1),2);
	   
	   let dorday=this.pad(new Date(this.PWregistrationData.ecRegDate).getDate(),2);
	   
	   this.pwregistrationForm.controls['DateofRegistration'].setValue(dorday+'-'+dormonth+'-'+doryear); //dynemic set
	   
	  // this.pwregistrationForm.controls['DateofRegistration'].setValue('01'+'-'+'08'+'-'+'2020');  // static set
	   
	   
	   let lastvisityear=new Date(this.PWregistrationData.lastECVisitDate).getFullYear();
	   let lastvisitmonth=this.pad((new Date(this.PWregistrationData.lastECVisitDate).getMonth()+1),2);
	   
	   let lastvisitday=this.pad(new Date(this.PWregistrationData.lastECVisitDate).getDate(),2);
	   
	   this.pwregistrationForm.controls['LastVisitDate'].setValue(lastvisitday+'-'+lastvisitmonth+'-'+lastvisityear);
	   
	   ////////// set date range for ANC according to last visit date ////////
	   
	   let LastVisit_change_val =lastvisityear+','+lastvisitmonth+','+lastvisitday+' 12:00:00';
		
				
      this.bsdate = new Date(LastVisit_change_val);
		
      this.bsdate.setDate( this.bsdate.getDate() );
		
      this.minDateANC = { year: this.bsdate.getUTCFullYear(), month: (this.bsdate.getMonth() + 1), day: (this.bsdate.getUTCDate()) };
	  
	  
	  ////////// set date of birth range according to registration date /////////
	  
	   let doregistrationyear=new Date(this.PWregistrationData.ecRegDate).getFullYear();
	 this.minDate_dob = {year: (doregistrationyear-60), month: 1, day: 1};
     this.maxDate_dob={year:(doregistrationyear-10), month: 12, day: 31};
     this.startDate_dob = {year: (doregistrationyear-10), month: 12, day: 31};
	
	   
      })
      .catch((error) => {
        console.log("Promise rejected with " + JSON.stringify(error));
      });
	
	
  }
  
  
  ////// onChange event////
  
  changeDeliveryPlace() {
  
    
  if(this.selectedDeliveryPlace==7 || this.selectedDeliveryPlace==5)
  {
	this.showFacilityDelivery= false; 
this.showOtherFacilityDelivery= true;	
  }
  else{
	 this.showOtherFacilityDelivery= false; 
	 this.showFacilityDelivery= true; 
	 
	  this.getDeliveryPlaceName(this.selectedDeliveryPlace,this.selectedHealthBlock);
  }
  //alert(this.selectedDeliveryPlace);
  

    }
	
	
	
	getDeliveryPlaceName(DeliveryPlace:string,HealthBlock:string): void {
		
  this.backendApiService.getDeliveryPlaceNameAPI(DeliveryPlace,HealthBlock).subscribe((res:Response)=> {
    let response=JSON.parse(JSON.stringify(res));
	 console.log('this is DeliveryPlaceName list =========');
    console.log(response);
	
    this.AllDeliveryPlaceName=response;
	
	
   
     })
}

findTotalLPOutcome()
{
	let LPlive_val = this.pwregistrationForm.value.LPlive;
	let LPstill_val = this.pwregistrationForm.value.LPstill;
	let LPabortion_val = this.pwregistrationForm.value.LPabortion;
	
	let LPTotalOutcome = Number(LPlive_val) + Number(LPstill_val) + Number(LPabortion_val);
	
	this.pwregistrationForm.get('LPTotalOutcome').setValue(LPTotalOutcome);	
}

findTotalLLPOutcome()
{
	let LLPlive_val = this.pwregistrationForm.value.LLPlive;
	let LLPstill_val = this.pwregistrationForm.value.LLPstill;
	let LLPabortion_val = this.pwregistrationForm.value.LLPabortion;
	
	let LLPTotalOutcome = Number(LLPlive_val) + Number(LLPstill_val) + Number(LLPabortion_val);
	
	this.pwregistrationForm.get('LLPTotalOutcome').setValue(LLPTotalOutcome);	
}

changeLMPDate($event) {
	
	
	
	let bsLMPDate=$event.year+'-'+$event.month+'-'+$event.day+' 12:00:00';

  // alert(bsLMPDate);	
	
	this.bsdate = new Date(bsLMPDate);
	
	//alert(this.bsdate.getUTCDate());
	
	 //alert(this.bsdate);
   this.bsdate.setDate( this.bsdate.getDate() + 280 );
  

		
	this.pwregistrationForm.controls['eddDate'].setValue(
        {
          year: this.bsdate.getUTCFullYear(),
          month: (this.bsdate.getMonth() + 1),
          day: (this.bsdate.getUTCDate()),
        });
	
	/*
	let doryear_val=new Date(this.PWregistrationData.ecRegDate).getFullYear();
	   let dormonth_val=this.pad((new Date(this.PWregistrationData.ecRegDate).getMonth()+1),2);
	   
	   let dorday_val=this.pad(new Date(this.PWregistrationData.ecRegDate).getDate(),2);
	   
	   let RegDate_modified_validation=doryear_val+','+dormonth_val+','+dorday_val; //dynemic set
	   
	   */
	   
	   
	   
	 let ANCDate_modified_validation =this.pwregistrationForm.controls['ancDate'].value.year+'-'+this.pwregistrationForm.controls['ancDate'].value.month+'-'+this.pwregistrationForm.controls['ancDate'].value.day;  
	   
	var daysDiff=this.dateDiffInDays(new Date(bsLMPDate), new Date(ANCDate_modified_validation));
	
	var no_of_week=  Math.round(daysDiff/7);
	
	//alert(no_of_week);
	if(no_of_week>3 && no_of_week< 48){  //
	this.pwregistrationForm.controls['weekNo'].setValue(no_of_week);
		}
		else
		{
			this.pwregistrationForm.controls['weekNo'].setValue('');
		}
		
		
  
    
	
}

pad(num:number, size:number): string { 
       let s = num+"";
       while (s.length < size) s = "0" + s;
       return s;
       }
	   


       rdpwage = true; 
  SelectPWAge(e) {
    //console.log(e.target.value + " PWage");
    if (e.target.value == 'pwage') {
	
       this.pwregistrationForm.get('dobDate').setValidators([]);
         this.pwregistrationForm.get('dobDate').updateValueAndValidity(); 	
		
      //this.pwregistrationForm.controls['PWAge'].enable();
	  this.isAgeReadOnly = false;
      this.pwregistrationForm.controls['dobDate'].disable();
      this.rdpwage = true;
	  
	  this.pwregistrationForm.get('PWAge').setValidators(Validators.required); 
      this.pwregistrationForm.get('PWAge').updateValueAndValidity(); 
	  
	   
    }
    else {
		
		 this.pwregistrationForm.get('PWAge').setValidators([]);
         this.pwregistrationForm.get('PWAge').updateValueAndValidity(); 		 
		
     // this.pwregistrationForm.controls['PWAge'].disable();
	  this.isAgeReadOnly = true;
	  
      this.pwregistrationForm.controls['dobDate'].enable();
      this.rdpwage = false
	  
	   this.pwregistrationForm.get('dobDate').setValidators(Validators.required); 
      this.pwregistrationForm.get('dobDate').updateValueAndValidity();

         
	  
    }
  }
  
  SelectedVDRLTestDone(e) {
	  
	  if(e.target.value==1)
	  {
		 this.pwregistrationForm.controls['VRDLTestDate'].enable();
         this.pwregistrationForm.controls['VDRLTestResult'].enable();		 
	  }
	  else
	  {
		 this.pwregistrationForm.controls['VRDLTestDate'].disable();
		 this.pwregistrationForm.controls['VDRLTestResult'].disable();
		  
	  }
	  
  }
  
  SelectedHIVScreeningDone(e) {
	  
	  if(e.target.value==1)
	  {
		 this.pwregistrationForm.controls['HIVScreeningDate'].enable();
         this.pwregistrationForm.controls['HIVScreeningResult'].enable();		 
	  }
	  else
	  {
		 this.pwregistrationForm.controls['HIVScreeningDate'].disable();
		 this.pwregistrationForm.controls['HIVScreeningResult'].disable();
		  
	  }
	  
  }
  
  SelectedHBaAgTestDone(e) {
	  
	  if(e.target.value==1)
	  {
		 this.pwregistrationForm.controls['HBaAgTestDate'].enable();
         this.pwregistrationForm.controls['HBaAgTestResult'].enable();		 
	  }
	  else
	  {
		 this.pwregistrationForm.controls['HBaAgTestDate'].disable();
		 this.pwregistrationForm.controls['HBaAgTestResult'].disable();
		  
	  }
	  
  }
  
  continuePW() {

        
	  window.localStorage.setItem("RCH_ID", String(this.PWregistrationData.registrationNo))
   // window.localStorage.setItem("caseNo",String(this.ectForm.get('caseNo').value))
    this.router.navigate(['home/motherpnc'])
  
  }
  
 
 changePWage() {
	 
	if (this.pwregistrationForm.controls['PWAge'].value != "") {
		
		 if (this.pwregistrationForm.controls['PWAge'].value < 10 || this.pwregistrationForm.controls['PWAge'].value > 60) {
          alert('Age Should be between 10 to 60 years')
          this.pwregistrationForm.controls['dobDate'].setValue('');
          this.pwregistrationForm.controls['PWAge'].setValue('');
        } 
		else{
			
			 let PWage_val = Number(this.pwregistrationForm.controls['PWAge'].value);
			 
			  let doregyear=new Date(this.PWregistrationData.ecRegDate).getFullYear();
			 
			   let birthyear = [doregyear - PWage_val]
			 
            this.pwregistrationForm.controls.dobDate.setValue({
              year: birthyear[0],
              month: 1,
              day: 1
            });
            
          
		}

	}		
	 
 }
 
  changePWDOB() {
   
        let doregyear=new Date(this.PWregistrationData.ecRegDate).getFullYear();
		
      let diff = ( doregyear - ((this.pwregistrationForm.controls['dobDate'].value)).year)
      if (diff < 10 || diff > 60) {
		  
		   alert('Age Should be between 10 to 60 years');
		   this.pwregistrationForm.controls['dobDate'].setValue("");
		
      }
      else {
		 
        this.pwregistrationForm.controls['PWAge'].setValue(diff);
      }
   
  }
  
   changeHusband() {
   
        if(this.pwregistrationForm.controls['HusbandName'].value=='')  // overwrite whose mobile if hasband not exist remove hasband
	   { 
		    this.whosemobile = [{ id: 'W', whosemobile: 'Woman' }, { id: 'N', whosemobile: 'Neighbour' }, { id: 'R', whosemobile: 'Relative' }, { id: 'O', whosemobile: 'Other' }];
	   }
	   else
	   {
		     this.whosemobile =  [{ id: 'W', whosemobile: 'Woman' }, { id: 'H', whosemobile: 'Husband' }, { id: 'N', whosemobile: 'Neighbour' }, { id: 'R', whosemobile: 'Relative' }, { id: 'O', whosemobile: 'Other' }];
	   }
   
  }
  
  
  
  
}
