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
	
	
	
       selectedPastIllness = [];
		selectedLastPregnancy = [];
		selectedLasttoLastPregnancy = [];
		
		selectedDeliveryPlace;
		selectedDeliveryPlaceName;
		
		
		
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
   
   PWregistrationData:Array<any>;
   
   
   
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
		
	maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
       

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
   
  
 
  }
  
  
      
    
	
    ngOnInit() {
		
		

       this.selectedDeliveryPlace='';
	   this.selectedDeliveryPlaceName='';
		
		  this.pwregistrationForm = this.fb.group({
			healthproviderName: ['', [Validators.required]],
            ashaName: ['', [Validators.required]],
            pwBloodGroup: ['', [Validators.required]],
            pwWeight: ['', [Validators.required,Validators.pattern("^[0-9]+([.][0-9]{0,3})?$")]],
			pwHeight: ['', [Validators.required,Validators.pattern("^[0-9]{1,}$")]],
           
            mobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?^[6-9][0-9]{9}$"),this.patternMobValidator()]],			
            whosemobileNo: ['', [Validators.required]],
            weekNo: ['', [Validators.required]],
			LMPDate: ['', [Validators.required]],
            eddDate: ['', [Validators.required]],				
			
            pastIllness: [[], Validators.required],
			
			totalPregnancy: ['', [Validators.required,Validators.pattern("^[1-9]{1,}$")]],
		    lastPregnancy: [null],
			lasttolastPregnancy: [null],
			
			VDRLTestDone: [null],
            VRDLTestDate: [null],
			VDRLTestResult: [null],
			HIVScreeningDone: [null],
            HIVScreeningDate: [null],
			HIVScreeningResult: [null],
			HBaAgTestDone: [null],
            HBaAgTestDate: [null],
			HBaAgTestResult: [null],
			DeliveryPlace: ['', [Validators.required]],
			DeliveryPlaceName: [null],
			DeliveryPlaceNameOther: [null],
			PastIllnessOther: [null],
			LPlive: [null],
			LPstill: [null],
			LPabortion: [null],
			LLPlive: [null],
			LLPstill: [null],
			LLPabortion: [null],
			LPTotalOutcome: [null],
			LLPTotalOutcome: [null],
			 ancDate: [null],
			 dobDate: [null],
			
			RCHID: [null],
			WomanName: [null],
			HusbandName: [null],
			DateofRegistration: [null],
			LastVisitDate: [null],
			PWAge: [null],
		
			
        },
		 { 
         validator: this.LMPDateValidator('LMPDate', 'DateofRegistration')
        }
		
		);
		
		
		
		this.handleFormChangesCondition();
		
        //this.GetPWregistrationData('104000155296','1');  // Please Note : id and caseid value come from previous page
		this.GetPWregistrationData('104000287030','1');
		 
		 //alert('hello how are u');
		 
		
		 
		 this.getBloodGroupList();
         this.getpastIllnessList();
		 this.getlastPregnancyList();
		 
		 
		 
		     }
			 
			  LMPDateValidator(controlName: any, matchingControlName: any){ //alert('hello');
    return (pwregistrationForm: FormGroup) => {
        const LMPcontrol = pwregistrationForm.controls[controlName];
        const RegControl = pwregistrationForm.controls[matchingControlName];
		
		
		
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
  
         ////////// rgisistration data ////
		 
		 let doryear_val=new Date(this.PWregistrationData.ecRegDate).getFullYear();
	   let dormonth_val=this.pad((new Date(this.PWregistrationData.ecRegDate).getMonth()+1),2);
	   
	   let dorday_val=this.pad(new Date(this.PWregistrationData.ecRegDate).getDate(),2);
	   
	   let RegDate_modified_validation=doryear_val+','+dormonth_val+','+dorday_val;
	   
	    	 
		 //////// end /////////////
  
		var daysDiff=this.dateDiffInDays(new Date(LMPDate_modified_validation), new Date(RegDate_modified_validation)); //4 days till XMAS
		
		console.log('date difference value===');
		console.log(daysDiff)
		
		if(daysDiff>35 && daysDiff<322)
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
			 this.showLastTwoPregnancy=false;
		}
		else if(Number(value)>1)
		{
			this.showLastOnePregnancy=true;
			this.showLastTwoPregnancy=true;
		}
		else
		{
		 this.showLastTwoPregnancy=false;
         this.showLastOnePregnancy=false;		 
		}
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
	
	 get f() { return this.pwregistrationForm.controls; }
  
  onSubmit(pwregistrationForm) {
	  
	  
	  
	  this.submitted = true;
	  
	  if (this.pwregistrationForm.invalid) {
            return;
        }
		
		alert('form submited...');
		console.log('form submited value=== ');
		console.log(pwregistrationForm.value);
		
		console.log('Past Illness value=== ');
		console.log(pwregistrationForm.pastIllness);
		console.log(this.selectedPastIllness);
		
		
		
		
		alert(pwregistrationForm.value.healthproviderName);
		
		///////// modified formate ///////
		
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
		
		let	ancDate_modified_date="2020-12-24T08:42:15.826Z"
		
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

     ancDate_modified_date = ancDate_Val.year + '-' + month_val + '-' + day_val;
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
	
	
		
		
		//////// end modified formate ///////////
		
		 let userId = this.tokenservice.getUserId();
		
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
  "financialYr": "2020-21",
  "financialYear": 0,
  "registrationNo": Number(pwregistrationForm.value.RCHID),
  "idNo": null,
  "registerSrno": 99,
  "namePw": (pwregistrationForm.value.WomanName).toString(),
  "nameH": (pwregistrationForm.value.HusbandName).toString(),
  "address": "C2/88 NEW ASHOK NAGAR",
  "registrationDate": "1997-01-01",
  "mobileNo": (pwregistrationForm.value.mobileNo).toString(),
  "mobileRelatesTo": (pwregistrationForm.value.whosemobileNo).toString(),
  "religionCode": 0,
  "caste": 99,
  "bplApl": 1,
  "birthDate": dobDate_modified_date,
  "age": Number(pwregistrationForm.value.PWAge),
  "pwWeight": Number(pwregistrationForm.value.pwWeight),
  "anmId": Number(pwregistrationForm.value.healthproviderName),
  "ashaId": Number(pwregistrationForm.value.ashaName),
  "caseNo": 1,
  "ipAddress": "164.100.128.19",
  "flag": 0,
  "createdBy": Number(userId),
  "createdOn": "2020-12-16T05:55:56.473Z",
  "jsyBeneficiary": "",
  "jsyPaymentReceived": null,
  "deleteMother": 0,
  "reasonForDeletion": null,
  "deletedOn": null,
  "pregnancyWeeks": Number(pwregistrationForm.value.weekNo),
  "updatedOn": "2020-12-16T05:55:56.476Z",
  "updatedBy": 0,
  "cpsmsFlag": 0,
  "mobileId": 0,
  "sourceId": 0,
  "entryType": 4,
  "entryTypeUpdateFlag": null,
  "oldEntryType": null,
  "dupCase": null,
  "dupRank": null,
  "mctsFullAnc": null,
  "dupMotherDelete": null,
  "wardNo": null,
  "rurUrbHierarchy": null,
  "mpwId": null,
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
    "financialYr": "2020-21",
    "financialYear": 2020,
    "registrationNo": Number(pwregistrationForm.value.RCHID),
    "idNo": null,
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
    "placeName": null,
    "vdrlTest": Number(pwregistrationForm.value.HIVScreeningDone),
    "vdrlDate": (VRDLTestDate_modified_date).toString(),
    "vdrlResult": (pwregistrationForm.value.VDRLTestResult).toString(),
    "hivTest": Number(pwregistrationForm.value.VDRLTestDone),
    "hivDate": (HIVScreeningDate_modified_date).toString(),
	"anmId": Number(pwregistrationForm.value.healthproviderName),
    "ashaId": Number(pwregistrationForm.value.ashaName),
    "caseNo": 0,
    "ipAddress": null,
    "createdBy": Number(userId),
    "createdOn": "2020-12-16T05:55:56.476Z",
    "lastPregComplicationLength": 0,
    "l2lPregComplicationLength": 0,
    "pastIllnessLength": 0,
    "hivResult": null,
    "deliveryLocationId": Number(pwregistrationForm.value.DeliveryPlace),
    "mobileId": 0,
    "updatedBy": 0,
    "updatedOn": "2020-12-16T05:55:56.476Z",
    "sourceId": 0,
    "bloodGroupTest": null,
    "lmpUpdatedOn": "2020-12-16T05:55:56.476Z",
    "lmpUpdatedBy": 0,
    "wardNo": 0,
    "rurUrbHierarchy": null,
    "mpwId": 0,
    "hbTest": 0,
    "hbDate": "2020-12-16T05:55:56.476Z",
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
	
  alert('Data successfully saved ');
//this.router.navigate(['/login']);
	
  

}else{
	
// bs please not need to check below code according to return	
 
 //this.errorresponse="Something went wrong. Please try again later"; 
	// this.showServerresponseMsgWrong= false;
	
	 alert('Something went wrong. Please try again later ');

}

     },(error) => { 
	 
	 if(error=='Error:409-Conflict')
	 {
		 alert('User already exist');
	// this.errorresponse="Conflict: User already exist";
	this.toastr.error('Conflict: User already exist'); 
      //this.notifyService.showError("Conflict: User already exist.","")	 
	 }
	 else
	 {
		 alert('Something went wrong. Please try again later ');
		 this.toastr.error('Something went wrong. Please try again later'); 
		 //this.errorresponse="Something went wrong. Please try again later"; 
		 //this.notifyService.showError("Something went wrong. Please try again later.","")
	 }
	 console.log(error);
	  alert('Something went wrong. Please try again later ');
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
		
		/*alert(this.selectedPastIllness.length);
		 for (var i = 0; i < this.selectedPastIllness.length; i++) { alert('kaam to ho raha hai');
      this.selectedPastIllness[i].isSelected = false;
	  
    }*/
	
	
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
  				
        
		}
		else if(item.id=='J')
		{
			
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
  				
        
		}
		else if(item.id=='J')
		{
			
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
  				
        
		}
		else if(item.id=='J')
		{
			
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
       
	   this.lastPregnancyList[count] = {id:val.id, itemName: val.name,namedId:val.namedId, codeValue:val.codeValue}; 
	   count++;
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
	  
	   
	   let doryear=new Date(this.PWregistrationData.ecRegDate).getFullYear();
	   let dormonth=this.pad((new Date(this.PWregistrationData.ecRegDate).getMonth()+1),2);
	   
	   let dorday=this.pad(new Date(this.PWregistrationData.ecRegDate).getDate(),2);
	   
	   this.pwregistrationForm.controls['DateofRegistration'].setValue(dorday+'-'+dormonth+'-'+doryear);
	   
	   
	   let lastvisityear=new Date(this.PWregistrationData.lastECVisitDate).getFullYear();
	   let lastvisitmonth=this.pad((new Date(this.PWregistrationData.lastECVisitDate).getMonth()+1),2);
	   
	   let lastvisitday=this.pad(new Date(this.PWregistrationData.lastECVisitDate).getDate(),2);
	   
	   this.pwregistrationForm.controls['LastVisitDate'].setValue(lastvisitday+'-'+lastvisitmonth+'-'+lastvisityear);
	
	   
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

pad(num:number, size:number): string { 
       let s = num+"";
       while (s.length < size) s = "0" + s;
       return s;
       }

}