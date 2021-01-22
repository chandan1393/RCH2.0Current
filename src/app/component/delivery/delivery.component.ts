import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl, Validators } from '@angular/forms';
import { isEmpty } from 'rxjs/operators';
import { HierarchyModel } from 'src/app/Core/Model/hierarchyModel';
import { BackendAPIService } from '../service/backend-api.service';
import { ErrroMessage } from 'src/app/utility/ErrorMessages';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

 constructor(private formBuilder: FormBuilder,private backendApiService: BackendAPIService,public datepipe: DatePipe) { }


  submitted : boolean=false;
  deliveryForm : FormGroup;
  selectedVillage;
  selectedSubCentre;
  selectedFacilityCode;
  selectedHealthBlock;
  selectedDistrict;
  selectedState;
  selectedFacilityType;
  fill_hierarchy: boolean = false;
  RuralUrban: string;
  talukacode: string;
  wardcode: number
  preUpdateVisitDate : String 
  pragnantEdit =false
  hierarchyMobj = new HierarchyModel();
  rchId: number;
  typeId : number;
  msg: string;
  showNotFoundMsg: boolean = false;
  responseLength : number
  editFlag : Boolean = false;
  beneficiaryDetails : Array<any>;
  healthProviderAsha: Array<any>;
  healthProvider: Array<any>;
  healthFac : Array<any>;
  deliveryComplication : Array<any>=[];
  deliveryType: Array<any>;
  deliveryPlace : Array<any>;
  deliveryConductedBy : Array<any>;
  maternalDeathCause : Array<any>;
  tabMisoDiv :Boolean = false;
  deliveryPlaceDiv : Boolean =false;
  deliveryLoc : Array<any>
  placeAvailable : Boolean=false
  deliveryConductDiv : Boolean =false;
  deliveryComplicationDiv : Boolean =false;
  jsyBeneficiaryDiv : Boolean =false;
  liveBirthDiv : Boolean =false
  stillBirthDiv : Boolean =false
  maternalDeathDiv : Boolean =true;
  MdeathPlaceOtherDiv : Boolean=false;
  MdeathPlaceDiv : Boolean=false;
  deliveryOutcomeSelected ;
  invalidControls :[];
  required : String =ErrroMessage.REQUIRED;

 // multiOther : Number =3
 settingsDeliveryOutcomes = {
  text: "Select",
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  classes: "multidropdown",
enableCheckAll:false,
clearAll:false,
autoUnselect:true,
limitSelection:100,
disabled: false
    };


  
  minDate = { year: 2011, month: 4, day: 1 };
  //maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  maxDate={year: 2030, month: 4, day: 1}


  // required :String = this.errorMessageService.;


  ngOnInit(): void {

    
  this.DeliveryForm();
  this.getBeneficiaryDetails(104000287002,1);
  this.getHealthFacility();
  this.deliveryComplications();
  this.typeDelivery();
  this.placeDelivery();
  this.deliveryConducted();
  this.motherDeathCause();

  

  
  }







  DeliveryForm() {
    this.deliveryForm = this.formBuilder.group(
      {
        
   registrationNo :  new FormControl(''),
   womanName: new FormControl(''),
   husbandName : new FormControl(''),
   regisDate : new FormControl(''),
   womenAge : new FormControl(''),
   mobileNo : new FormControl('',Validators.required),
   lmpDate : new FormControl(''),
   lastAncVisitDate : new FormControl(''),
  // healthProviderID: new FormControl('',Validators.required),
  // ashaID          : new FormControl('',Validators.required),
   sno  :  new FormControl(''),
   stateCode:  new FormControl(''),
   districtCode :  new FormControl(''),
   ruralUrban :  new FormControl(''),
   healthBlockCode :  new FormControl(''),
   talukaCode :   new FormControl(''),
   healthFacilityType :  new FormControl(''),
   healthFacilityCode : new FormControl(''),
   healthSubFacilityCode :  new FormControl(''),
   villageCode :  new FormControl(''),
   financialYr :  new FormControl(''),
   financialYear :  new FormControl(''),
   idNo :  new FormControl(''),
   deliveryDate :   new FormControl('',Validators.required),
   deliveryPlace :  new FormControl('',Validators.required),
   deliveryLocation :   new FormControl('',Validators.required),
   deliveryConductedBy :  new FormControl('',Validators.required),
   deliveryConductedOther :   new FormControl(''),
   deliveryType :  new FormControl('',Validators.required),
   deliveryComp1 :   new FormControl(''),
   deliveryComp2 :   new FormControl(''),
   deliveryComp3 :  new FormControl(''),
   deliveryComp4 :   new FormControl(''),
   deathCause : new FormControl(''),
   deathOther :   new FormControl(''),
   deliveryOutcomes : new FormControl('',Validators.required),
   dischargeDate :   new FormControl('',Validators.required),
   jsyBenificiary :  new FormControl('',Validators.required),
   jsyPaidDate :   new FormControl(''),
   jsyChequeNo :   new FormControl(''),
   anmId :  new FormControl('',Validators.required),
   ashaId : new FormControl('',Validators.required),
   caseNo :  new FormControl(''),
   ipAddress :   new FormControl(''),
   createdBy : new FormControl(''),
   createdOn :   new FormControl(''),

   dischargeTime :  new FormControl(''),
   dischargeHH :   new FormControl(''),
   dischargeMM :   new FormControl(''),
   dischargeMeridiem :   new FormControl(''),
   deliveryTime :   new FormControl(''),
   deliveryHH :   new FormControl(''),
   deliveryMM :   new FormControl(''),
   deliveryMeridiem :   new FormControl(''),
   higherFacility :   new FormControl(''),
   deliveryComp5 :   new FormControl(''),
   otherComp :   new FormControl(''),
   deliveryLocationId :  new FormControl(''),
   liveBirth :  new FormControl('',Validators.required),
   stillBirth : new FormControl('',Validators.required),
   deliveryComplication :  new FormControl('',Validators.required),
   mobileId :  new FormControl(''),
   deliveryCompLength :  new FormControl(''),
   updatedBy : new FormControl(''),
   updatedOn :   new FormControl(''),
   sourceId : new FormControl(''),
   pretermDelivery : new FormControl(''),
   wardNo :  new FormControl(''),
   rurUrbHierarchy :  new FormControl(''),
   isIliSymptom :  new FormControl('',Validators.required),
   isContactCovid :  new FormControl('',Validators.required),
   covidTestDone :  new FormControl('',Validators.required),
   covidTestResult :  new FormControl('',Validators.required),
   sDistrictCode :  new FormControl(''),
   sHealthBlockCode :  new FormControl(''),
   sTalukaCode :  new FormControl(''),
   sHealthFacilityCode :  new FormControl(''),
   sHealthSubFacilityCode :  new FormControl(''),
   mpwId :  new FormControl(''),
   notificationByAsha :  new FormControl(''),
   fbirByAnm :  new FormControl(''),
   jsybenificiaryPayment :  new FormControl(''),
   tabMisoprostol : new FormControl(''),
   maternalDeath :  new FormControl('',Validators.required),
   maternalDeathDate :   new FormControl(''),
   pregnancyWeek :  new FormControl(''),
   maternalDeathPlace :  new FormControl(''),
   maternalDeathLocationId :  new FormControl(''),
   maternalDeathLocation :   new FormControl(''),
   nonObstetricComplications :   new FormControl('')
      
      },
      { 
        validator: [this.validDeliveryDate('lmpDate', 'lastAncVisitDate', 'deliveryDate')]
      }

    
      
      )
          }


          validDeliveryDate(lmpDate: any ,lastAncVisitDate: any,deliveryDate: any)
          {
            return (formGroup: FormGroup) => {

              const lmpdate = formGroup.controls[lmpDate];
              const deliveryNgbdate = formGroup.controls[deliveryDate];
              const lastAncDate = formGroup.controls[lastAncVisitDate];

              const deliverydate = deliveryNgbdate.value ? new Date(deliveryNgbdate.value.year, deliveryNgbdate.value.month-1, deliveryNgbdate.value.day) :  new Date();
              const LMPdate: Date = new Date(this.datepipe.transform(lmpdate.value, 'yyyy-MM-dd'));
              const ANCDate: Date = new Date(this.datepipe.transform(lastAncDate.value, 'yyyy-MM-dd'))
          
              if (!lmpdate || !deliveryNgbdate || !lastAncDate) {
                return null;
              }
              if (deliveryNgbdate.errors && !deliveryNgbdate.errors.DeliveryLMPflag) {
                return null;
              }
              if (deliveryNgbdate.errors && !deliveryNgbdate.errors.DeliveryANCflag) {
                return null;
              }

              if (deliveryNgbdate.value != isEmpty && deliveryNgbdate.value != '' && deliveryNgbdate.value != null) {
             
                if (((deliverydate.getTime() - LMPdate.getTime()) / (1000 * 60 * 60 * 24)) <147) {
       
                  //    if (visitdate.getTime() < registrationDate.getTime()) {
                    deliveryNgbdate.setErrors({ DeliveryLMPflag: true });
              
                      }
                      else if (  (((ANCDate.getTime() - deliverydate.getTime()) / (1000 * 60 * 60 * 24))  >=1) ){

                        deliveryNgbdate.setErrors({ DeliveryANCflag: true });
              
                      }
                      else
                      {

                      }
             
              }
              else{
                deliveryNgbdate.setErrors(null);
              
              }

          }}
    
  get mfg() {

    return this.deliveryForm.controls;
  }



    getBeneficiaryDetails(rchId : number , caseNo : number)
    {
      this.backendApiService.getBeneficiaryForDelivery(rchId, caseNo).subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        console.log("Hello Beneficiary")
        console.log(response)
        this.beneficiaryDetails = response;
        this.deliveryForm.controls['registrationNo'].setValue(response.registrationNo);
        this.deliveryForm.controls['womanName'].setValue(response.beneficiaryNmae);
        this.deliveryForm.controls['husbandName'].setValue(response.husbandName);
        this.deliveryForm.controls['regisDate'].setValue(response.ecRegDate);
        this.deliveryForm.controls['womenAge'].setValue(response.age);
        this.deliveryForm.controls['mobileNo'].setValue(response.mobileNumber);
        this.deliveryForm.controls['caseNo'].setValue(response.caseNo);
        this.deliveryForm.controls['lmpDate'].setValue(response.lmpDate);
        console.log("Hello ANC");
        this.deliveryForm.controls['lastAncVisitDate'].setValue( this.datepipe.transform("2011-01-01T00:00:00", 'yyyy-MM-dd'));
   
        console.log(response);
       // console.log("Hello ANC"+ this.datepipe.transform(response.lastANCVisitDate, 'yyyy-MM-dd'));
       console.log("Hello ANC"+ this.datepipe.transform("2011-01-01T00:00:00", 'yyyy-MM-dd'));
      
      //  console.log("Hello"+this.deliveryForm.get('lastAncVisitDate').value)
  
    })
  }


  getHealthFacility() {
    this.backendApiService.getHealthFacility().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.healthFac = response;
      console.log(response);
    })
  }


  deliveryComplications() {
    this.backendApiService.getDeliveryComlicationAPI().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log("ASHUTOSH SHARMA")
      console.log(response);

      let count=0;
      for (var val of response) {
         
       this.deliveryComplication[count] = {id:val.id, itemName: val.name , namedId:val.namedId,codeSystem:val.codeSystem,codeValue:val.codeValue}; 
      
       count++;
         } 
   
   
//      this.deliveryComplication = response;
   //   console.log(response);
  //    console.log(   this.deliveryComplication[0]);


    })
  }

  typeDelivery() {
    this.backendApiService.getDeliveryType().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.deliveryType = response;
      console.log(response);
    })
  }
 

  placeDelivery() {
    this.backendApiService.getDeliveryPlace().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.deliveryPlace = response;
      console.log(response);
    })
  }

  deliveryConducted() {
    this.backendApiService.getDeliveryConductedBy().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.deliveryConductedBy = response;
      console.log(response);
    })
  }

  motherDeathCause()
  {
    this.backendApiService.getMdeathCause().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.maternalDeathCause = response;
      console.log(response);
    })
  }


  healthFaclityType(typeId: any) {
    this.backendApiService.getHealthFacilityTypeByAshutosh(1, typeId).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
     this.deliveryLoc = response;
      console.log(response);
      if(response.length==0)
      {
        this.placeAvailable=true;

      }
      else
      {
       this.placeAvailable=false
}
   

    })
  }





  deliveryFacilityChange()
  {
    this.tabMisoDiv=false;
    this.deliveryPlaceDiv=false;
    this.deliveryForm.controls['deliveryLocationId'].clearValidators()
    this.deliveryForm.controls['deliveryLocationId'].updateValueAndValidity()
    this.deliveryForm.controls['tabMisoprostol'].clearValidators()
    this.deliveryForm.controls['tabMisoprostol'].updateValueAndValidity()
    this.typeId =this.deliveryForm.get('deliveryPlace').value
    this.deliveryLoc=[];
    if ( this.typeId==22)
    {
      this.tabMisoDiv=true;
      this.deliveryForm.controls['tabMisoprostol'].setValidators([Validators.required])
      this.deliveryForm.controls['tabMisoprostol'].updateValueAndValidity()
    
   }
else
{
  this.deliveryPlaceDiv=true;
  
  this.deliveryForm.controls['deliveryLocationId'].setValidators([Validators.required])
  this.deliveryForm.controls['deliveryLocationId'].updateValueAndValidity()

  this.healthFaclityType(this.typeId)
  
}
  


  }


  deliveryConductChange()
  {
this.deliveryConductDiv=false;
this.deliveryForm.controls['deliveryConductedOther'].clearValidators()
this.deliveryForm.controls['deliveryConductedOther'].updateValueAndValidity()


   if(this.deliveryForm.controls['deliveryConductedBy'].value == 99)
   {
this.deliveryConductDiv=true;
this.deliveryForm.controls['deliveryConductedOther'].setValidators([Validators.required])
this.deliveryForm.controls['deliveryConductedOther'].updateValueAndValidity()

   }
  }


  deliveryComplicationSelect(e)
  {
  //  alert("Hello")
this.deliveryComplicationDiv=false;
this.deliveryForm.controls['otherComp'].clearValidators()
this.deliveryForm.controls['otherComp'].updateValueAndValidity()

console.log(this.deliveryForm.controls['deliveryComplication'].value)

   if(e.id == "H")
   {
this.deliveryComplicationDiv=true;
//this.deliveryForm.controls['deliveryComplication'].setValue('Z');

this.deliveryForm.controls['otherComp'].setValidators([Validators.required])
this.deliveryForm.controls['otherComp'].updateValueAndValidity()

   }


else if (e.id=="J")
{
  this.deliveryOutcomeSelected=[{"id":"J" , "itemName":"None"}];
  this.settingsDeliveryOutcomes=
  {
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: "multidropdown",
  enableCheckAll:false,
  clearAll:false,
  autoUnselect:true,
  limitSelection:1,
  disabled: false


  }
}



  }


  deliveryComplicationDeSelect(e)
  {

    if (e.id=="J")
    {
    this.settingsDeliveryOutcomes=
    {
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "multidropdown",
    enableCheckAll:false,
    clearAll:false,
    autoUnselect:true,
    limitSelection:100,
    disabled: false
  
  
    }}
    else if (e.id=="H")
    {
      
        this.deliveryComplicationDiv=false;
        //this.deliveryForm.controls['deliveryComplication'].setValue('Z');
        
        this.deliveryForm.controls['otherComp'].clearValidators();
        this.deliveryForm.controls['otherComp'].updateValueAndValidity()
        
    }
  }

  jsyBeneficiaryChange()
  {
this.jsyBeneficiaryDiv=false;
this.deliveryForm.controls['jsybenificiaryPayment'].clearValidators()
this.deliveryForm.controls['jsybenificiaryPayment'].updateValueAndValidity()


   if(this.deliveryForm.controls['jsyBenificiary'].value == "Y")
   {
this.jsyBeneficiaryDiv=true;
this.deliveryForm.controls['jsybenificiaryPayment'].setValidators([Validators.required])
this.deliveryForm.controls['jsybenificiaryPayment'].updateValueAndValidity()

   }
  }

  deliveryOutcomeChange()
  {
    this.liveBirthDiv=false;
    this.stillBirthDiv=false;
this.deliveryForm.controls['liveBirth'].clearValidators()
this.deliveryForm.controls['liveBirth'].updateValueAndValidity()
this.deliveryForm.controls['stillBirth'].clearValidators()
this.deliveryForm.controls['stillBirth'].updateValueAndValidity()


   if(this.deliveryForm.controls['deliveryOutcomes'].value == 1)
   {
this.liveBirthDiv=true;
this.deliveryForm.controls['liveBirth'].setValidators([Validators.required])
this.deliveryForm.controls['liveBirth'].updateValueAndValidity()

  }

  if(this.deliveryForm.controls['deliveryOutcomes'].value == 3)
  {
this.stillBirthDiv=true;
this.deliveryForm.controls['stillBirth'].setValidators([Validators.required])
this.deliveryForm.controls['stillBirth'].updateValueAndValidity()

 }  }


 maternalDeathChange()
 {

//  this.maternalDeathDiv=false;
  this.deliveryForm.controls['maternalDeathDate'].clearValidators()
this.deliveryForm.controls['maternalDeathDate'].updateValueAndValidity()

this.deliveryForm.controls['pregnancyWeek'].clearValidators()
this.deliveryForm.controls['pregnancyWeek'].updateValueAndValidity()

this.deliveryForm.controls['maternalDeathPlace'].clearValidators()
this.deliveryForm.controls['maternalDeathPlace'].updateValueAndValidity()

this.deliveryForm.controls['maternalDeathLocationId'].clearValidators()
this.deliveryForm.controls['maternalDeathLocationId'].updateValueAndValidity()

this.deliveryForm.controls['maternalDeathLocation'].clearValidators()
this.deliveryForm.controls['maternalDeathLocation'].updateValueAndValidity()

this.deliveryForm.controls['deathCause'].clearValidators()
this.deliveryForm.controls['deathCause'].updateValueAndValidity()

this.deliveryForm.controls['nonObstetricComplications'].clearValidators()
this.deliveryForm.controls['nonObstetricComplications'].updateValueAndValidity()

this.deliveryForm.controls['notificationByAsha'].clearValidators()
this.deliveryForm.controls['notificationByAsha'].updateValueAndValidity()

this.deliveryForm.controls['fbirByAnm'].clearValidators()
this.deliveryForm.controls['fbirByAnm'].updateValueAndValidity()





 }

 mDeathReasonChange()
 {

 }


 public findInvalidControls() {
  const invalid = [];
  const controls = this.deliveryForm.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
  }
  console.log(invalid)
  return invalid;
}

  submitDelivery(deliveryForm : FormGroup)
  {
    this.submitted = true;

   console.log(this.findInvalidControls())



    console.log( "Inside Delivery Submit"  )
    if (this.deliveryForm.invalid) {
      console.log("Invalid Form Check Validation");
      console.log(JSON.stringify(this.deliveryForm.value))

      return;
    }

console.log(this.deliveryForm.value)


    alert( "Delivery cant be saved ")

    const deliveryDate = this.deliveryForm.get('deliveryDate').value;
    const dischargeDate = this.deliveryForm.get('dischargeDate').value;
    const mdeathDate = this.deliveryForm.get('dischargeDate').value;
    




    const deliveryDatePatch: any = deliveryDate ?  this.datepipe.transform(new Date(deliveryDate.year, deliveryDate.month - 1, deliveryDate.day), 'yyyy-MM-dd')  : null;
    const dischargeDatePatch: any = dischargeDate ? this.datepipe.transform(new Date(dischargeDate.year, dischargeDate.month - 1, dischargeDate.day), 'yyyy-MM-dd') : null;
    const mdeathDatePatch: any = mdeathDate ? this.datepipe.transform(new Date(mdeathDate.year, mdeathDate.month - 1, mdeathDate.day), 'yyyy-MM-dd') : null;
 


    this.deliveryForm.patchValue({
      sno:0,
      stateCode: this.selectedState,
      districtCode: this.selectedDistrict,
      healthBlockCode: this.selectedHealthBlock,
      healthFacilityCode: this.selectedFacilityCode,
      healthSubFacilityCode: this.selectedSubCentre,
      talukaCode: this.talukacode,
      healthFacilityType: this.selectedFacilityType,
      ruralUrban: "r",
      rurUrbHierarchy: "R",
      villageCode: this.selectedVillage,
  financialYear: new Date().getFullYear(),
  deliveryOutcomes: Number(this.deliveryForm.get('deliveryOutcomes').value),

deliveryDate : deliveryDatePatch,
dischargeDate :  dischargeDatePatch,
maternalDeathDate : mdeathDatePatch,



    })




    console.log(JSON.stringify(this.deliveryForm.value))


   
  }



  getHealthProviderAnm(subcentrecode: number, typeid: number) {
    this.backendApiService.getHealthProvideratSubcentre(subcentrecode, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.healthProvider = response;
      console.log(response);

if (this.healthProvider.length<1)
{
  this.healthProvider=[{id:0 , name:  "Not Available",contact_No:""}]
}      


    })
  }

  getHealthProviderAsha(subcentrecode: number, typeid: number) {
    this.backendApiService.getHealthProvideratSubcentre(subcentrecode, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.healthProviderAsha = response;


      if (this.healthProviderAsha.length<1)
      {
        this.healthProviderAsha=[{id:0 , name:  "Not Available",contact_No:""}]
      }    

      console.log(response);
    })
  }









  usehierarchyHandler(hierarchyMobj: HierarchyModel) {
   
    this.hierarchyMobj = hierarchyMobj;

    this.selectedVillage =this.hierarchyMobj.villageid
    this.selectedSubCentre = this.hierarchyMobj.subfacilityid
    this.selectedFacilityCode = this.hierarchyMobj.facilityid
    this.selectedFacilityType = this.hierarchyMobj.facilitytypeid
    this.selectedHealthBlock = this.hierarchyMobj.blockid
    this.selectedDistrict = this.hierarchyMobj.districtid
    this.selectedState = this.hierarchyMobj.stateid
    this.RuralUrban = this.hierarchyMobj.RuralUrban
    this.talukacode = this.hierarchyMobj.talukacode
    this.wardcode = this.hierarchyMobj.ward

    console.log("state : " + this.selectedState + " District : " + this.selectedDistrict + " Block : " +
      this.selectedHealthBlock + " Facility Type : " + this.selectedFacilityType + " Facility : " + this.selectedFacilityCode +
      " sub facility : " + this.selectedSubCentre + " village : " + this.selectedVillage + "ward:  " + this.wardcode + "taluka:  " + this.talukacode + "rualurabn:  " + this.RuralUrban)


    if (this.selectedState == undefined
      || this.selectedDistrict == undefined || this.selectedHealthBlock == undefined || this.selectedFacilityType == undefined
      || this.selectedFacilityCode == undefined || this.selectedSubCentre == undefined || this.selectedVillage == undefined
    ) {

      this.showNotFoundMsg = true;
    
      this.msg =  "Select Hierarchy" ;
    
    
      this.fill_hierarchy = false
    }
    if (this.selectedVillage !== undefined) {
      this.showNotFoundMsg = false;
      this.msg = null;
      this.fill_hierarchy = true
if(this.hierarchyMobj.subfacilityid!==undefined)
{

     this.getHealthProviderAnm( this.hierarchyMobj.subfacilityid, 2);
    this.getHealthProviderAsha( this.hierarchyMobj.subfacilityid, 1);

}

    }}


    deathFacilityChange()
    {
      this.MdeathPlaceOtherDiv=false;
      this.MdeathPlaceDiv=false;
      this.deliveryForm.controls['maternalDeathLocationId'].clearValidators()
      this.deliveryForm.controls['maternalDeathLocationId'].updateValueAndValidity()
     
      this.typeId =this.deliveryForm.get('maternalDeathPlace').value
      this.deliveryLoc=[];
      if ( this.typeId==99)
      {
        this.MdeathPlaceOtherDiv=true;
        this.deliveryForm.controls['maternalDeathLocation'].setValidators([Validators.required])
        this.deliveryForm.controls['maternalDeathLocation'].updateValueAndValidity()
      
     }
  else
  {
    this.MdeathPlaceDiv=true;
    
    this.deliveryForm.controls['maternalDeathLocationId'].setValidators([Validators.required])
    this.deliveryForm.controls['maternalDeathLocationId'].updateValueAndValidity()
  
    this.healthFaclityType(this.typeId)
    
  }
    
  
  
    }
  
  






  
}
