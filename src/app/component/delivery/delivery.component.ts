import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { isEmpty } from 'rxjs/operators';
import { HierarchyModel } from 'src/app/Core/Model/hierarchyModel';
import { BackendAPIService } from '../service/backend-api.service';
import { ErrroMessage } from 'src/app/utility/ErrorMessages';
import { TokenStorageService } from 'src/app/Core/service/token/tokenstoreage.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,  private route: ActivatedRoute,private backendApiService: BackendAPIService, public datepipe: DatePipe, private tokenservice: TokenStorageService) { }


  submitted: boolean = false;
  deliveryForm: FormGroup;
  selectedVillage: string | number;
  selectedSubCentre: string | number;
  selectedFacilityCode: string | number;
  selectedHealthBlock: string | number;
  selectedDistrict: string | number;
  selectedState: string | number;
  selectedFacilityType: string | number;
  fill_hierarchy: boolean = false;
  RuralUrban: string;
  talukacode: string;
  wardcode: number
  preUpdateVisitDate: String
  pragnantEdit = false
  hierarchyMobj = new HierarchyModel();
  rchId: number;
  typeId: number;
  msg: string;
  showNotFoundMsg: boolean = false;
  responseLength: number
  editFlag: Boolean = false;
  beneficiaryDetails: Array<any>;
  healthProviderAsha: Array<any>;
  healthProvider: Array<any>;
  healthFac: Array<any>;
  deliveryComplication: Array<any> = [];
  deliveryType: Array<any>;
  deliveryPlace: Array<any>;
  deliveryConductedBy: Array<any>;
  maternalDeathCause: Array<any>;
  tabMisoDiv: Boolean = false;
  deliveryPlaceDiv: Boolean = false;
  deliveryLoc: Array<any>
  placeAvailable: Boolean = false
  deliveryConductDiv: Boolean = false;
  deliveryComplicationDiv: Boolean = false;
  jsyBeneficiaryDiv: Boolean = false;
  liveBirthDiv: Boolean = false
  stillBirthDiv: Boolean = false
  maternalDeathDiv: Boolean = false;
  MdeathPlaceOtherDiv: Boolean = false;
  MdeathPlaceDiv: Boolean = false;
  deliveryComplicationSelected =[];
  invalidControls: [];
  required: String = ErrroMessage.REQUIRED;
  nonObstericComplication: Array<any>;
  nonObstericComplicationDiv: Boolean = false;
  otherMdeathCauseDiv: Boolean = false;
  otherdeliveryLocationDiv: Boolean = false;
  currentdate = new Date(); 
  deathPlaceAvailable: Boolean = false;
  deathLoc: Array<any>;
  deliveryDateSelected: any ;


parentState: any;
parentDistrict: any;
parentTaluka: any; 
parentBlock: any;
parentFacility: any; 
parentSubcenter: any; 
parentVillage: any; 
parentFacilityType: any;
parentStateName: string;
parentDistrictName: any; 
parentTalukaName: any; 
parentBlockName: any; 
parentFacilityName: any;
parentSubcenterName: any;
parentVillageName: any;

   

  // multiOther : Number =3
    settingsComplication = {
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: "multidropdown",
    enableCheckAll: false,
    clearAll: false,
    autoUnselect: true,
    limitSelection: 100,
    disabled: false
  };



  minDate = { year: 2005, month: 1, day: 1 };
  //maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  maxDate = { year: 2021, month: 4, day: 1 }


  // required :String = this.errorMessageService.;


ngOnInit(): void {

//window.localStorage.setItem("HomeSearch", String(response.registrationNo))
const NEWRCHID: string = this.route.snapshot.queryParamMap.get('RCHID');
const CASENO: string = "2";//this.route.snapshot.queryParamMap.get('CASENO');
const RCHID: String =window.localStorage.getItem("HomeSearch") || window.localStorage.getItem("RCH_ID") ;


if (RCHID!==null && CASENO!==null)
{

    this.DeliveryForm();
    //this.InfantForm();
    this.getBeneficiaryDetails(RCHID, CASENO);
    this.getHealthFacility();
    this.deliveryComplications();
    this.typeDelivery();
    this.placeDelivery();
    this.deliveryConducted();
    this.motherDeathCause();
    this.getnonObstericComplications();
    this.InfantFormArray();
    this.editPWDeliveryForm(RCHID,CASENO);
    this.editFlag=true;

}
else

{ 
    this.DeliveryForm();
    //this.InfantForm();
    this.getBeneficiaryDetails(NEWRCHID, 2);
    this.getHealthFacility();
    this.deliveryComplications();
    this.typeDelivery();
    this.placeDelivery();
    this.deliveryConducted();
    this.motherDeathCause();
    this.getnonObstericComplications();
    this.InfantFormArray();
    this.editFlag=false;
 


}
  }

//######################FORM OBJETS #######################//
  DeliveryForm() {
    this.deliveryForm = this.formBuilder.group(
      {

        registrationNo: new FormControl(''),
        womanName: new FormControl(''),
        husbandName: new FormControl(''),
        regisDate: new FormControl(''),
        womenAge: new FormControl(''),
        mobileNo: new FormControl('', Validators.required),
        lmpDate: new FormControl(''),
        lastAncVisitDate: new FormControl(''),
        // healthProviderID: new FormControl('',Validators.required),
        // ashaID          : new FormControl('',Validators.required),
        stateCode: new FormControl(''),
        districtCode: new FormControl(''),
        ruralUrban: new FormControl(''),
        healthBlockCode: new FormControl(''),
        talukaCode: new FormControl(''),
        healthFacilityType: new FormControl(''),
        healthFacilityCode: new FormControl(''),
        healthSubFacilityCode: new FormControl(''),
        villageCode: new FormControl(''),
        financialYr: new FormControl(''),
        financialYear: new FormControl(''),
        idNo: new FormControl(''),
        deliveryDate: new FormControl('', Validators.required),
        deliveryPlace: new FormControl('', Validators.required),
        deliveryLocation: new FormControl('', Validators.required),
        deliveryConductedBy: new FormControl('', Validators.required),
        deliveryConductedOther: new FormControl(''),
        deliveryType: new FormControl('', Validators.required),
        deliveryComp1: new FormControl(''),
        deliveryComp2: new FormControl(''),
        deliveryComp3: new FormControl(''),
        deliveryComp4: new FormControl(''),
        deathCause: new FormControl(''),
        deathOther: new FormControl(''),
        deliveryOutcomes: new FormControl('', Validators.required),
        dischargeDate: new FormControl('', Validators.required),
        jsyBenificiary: new FormControl('', Validators.required),
        jsyPaidDate: new FormControl(''),
        jsyChequeNo: new FormControl(''),
        anmId: new FormControl('', Validators.required),
        ashaId: new FormControl('', Validators.required),
        caseNo: new FormControl(''),
        ipAddress: new FormControl(''),
        createdBy: new FormControl(''),
        createdOn: new FormControl(''),
        fresh:new FormControl(''),
        macerated:new FormControl(''),
        dischargeTime: new FormControl(''),
        dischargeHH: new FormControl(''),
        dischargeMM: new FormControl(''),
        dischargeMeridiem: new FormControl(''),
        deliveryTime: new FormControl(''),
        deliveryHH: new FormControl(''),
        deliveryMM: new FormControl(''),
        deliveryMeridiem: new FormControl(''),
        higherFacility: new FormControl(''),
        deliveryComp5: new FormControl(''),
        otherComp: new FormControl(''),
        deliveryLocationId: new FormControl(''),
        liveBirth: new FormControl('', Validators.required),
        stillBirth: new FormControl('', Validators.required),
        deliveryComplication: new FormControl('', Validators.required),
        mobileId: new FormControl(''),
        updatedBy: new FormControl(''),
        updatedOn: new FormControl(''),
        sourceId: new FormControl(''),
      //  pretermDelivery: new FormControl(''),
      //  wardNo: new FormControl(''),
        rurUrbHierarchy: new FormControl(''),
        isIliSymptom: new FormControl('', Validators.required),
        isContactCovid: new FormControl('', Validators.required),
        covidTestDone: new FormControl('', Validators.required),
        covidTestResult: new FormControl('', Validators.required),
      //  sDistrictCode: new FormControl(''),
      //  sHealthBlockCode: new FormControl(''),
     //   sTalukaCode: new FormControl(''),
     //   sHealthFacilityCode: new FormControl(''),
     //   sHealthSubFacilityCode: new FormControl(''),
      //  mpwId: new FormControl(''),
        notificationByAsha: new FormControl(''),
        fbirByAnm: new FormControl(''),
        jsybenificiaryPayment: new FormControl(''),
        tabMisoprostol: new FormControl(''),
        maternalDeath: new FormControl('', Validators.required),
        maternalDeathDate: new FormControl(''),
        pregnancyWeek: new FormControl(''),
        maternalDeathPlace: new FormControl(''),
        maternalDeathLocationId: new FormControl(''),
        maternalDeathLocation: new FormControl(''),
        nonObstetricComplications: new FormControl('')

      },
      {
        validator: [this.validDeliveryDate('lmpDate', 'lastAncVisitDate', 'deliveryDate'),
        this.validDischargeDate('dischargeDate','deliveryDate')]
      }



    )
  }

  //###################### Validation and Logics ####################//


  validDeliveryDate(lmpDate: any, lastAncVisitDate: any, deliveryDate: any) {
    return (formGroup: FormGroup) => {

      const lmpdate = formGroup.controls[lmpDate];
      const deliveryNgbdate = formGroup.controls[deliveryDate];
      const lastAncDate = formGroup.controls[lastAncVisitDate];

      const deliverydate = deliveryNgbdate.value ? new Date(deliveryNgbdate.value.year, deliveryNgbdate.value.month - 1, deliveryNgbdate.value.day) : new Date();
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

         if ((((ANCDate.getTime() - deliverydate.getTime()) / (1000 * 60 * 60 * 24)) >= 1)) {

          deliveryNgbdate.setErrors({ DeliveryANCflag: true });

        }
        else if (((deliverydate.getTime() - LMPdate.getTime()) / (1000 * 60 * 60 * 24)) < 147) {

       
          deliveryNgbdate.setErrors({ DeliveryLMPflag: true });

        }
     
        else {
          deliveryNgbdate.setErrors(null);
  
        }  }   } }



        validDischargeDate(dischargeDate: any , deliveryDate : any)
        {

          return (formGroup: FormGroup) => {

            const dischargeNgbdate = formGroup.controls[dischargeDate];
            const deliveryNgbdate = formGroup.controls[deliveryDate];
            const dischdate = dischargeNgbdate.value ? new Date(dischargeNgbdate.value.year, dischargeNgbdate.value.month - 1, dischargeNgbdate.value.day) : new Date();
            const delvdate = deliveryNgbdate.value ? new Date(deliveryNgbdate.value.year, deliveryNgbdate.value.month - 1, deliveryNgbdate.value.day) : new Date();
    

           if (!dischargeNgbdate || !deliveryNgbdate ) {
              return null;
            }
  /*      if (dischargeNgbdate.errors && !deliveryNgbdate.errors) {
              return null;
            }  */
            if (dischargeNgbdate.errors && !dischargeNgbdate.errors.valiDischargeMinDateFlag) {
              return null;
            }
            if (dischargeNgbdate.errors && !dischargeNgbdate.errors.valiDischargeMaxDateFlag) {
              return null;
            }  
            
         if ((dischargeNgbdate.value != isEmpty && dischargeNgbdate.value != '' && dischargeNgbdate.value != null)&&
            (deliveryNgbdate.value != isEmpty && deliveryNgbdate.value != '' && deliveryNgbdate.value != null)) {
            
               if ((((delvdate.getTime() - dischdate.getTime()) / (1000 * 60 * 60 * 24)) >= 1)) {

                dischargeNgbdate.setErrors({ valiDischargeMinDateFlag: true });
     
             }
           else  if (((dischdate.getTime() - delvdate.getTime()) / (1000 * 60 * 60 * 24)) > 42) {
          
                dischargeNgbdate.setErrors({ valiDischargeMaxDateFlag: true });
       
               }

           
           
             else
             {
              dischargeNgbdate.setErrors(null);
     
             }
            }
       }
      }



  pragnancyWeekCal( )
  {



    const mDeathNgbDate= this.deliveryForm.controls["maternalDeathDate"].value;
    const lmpdate =  this.deliveryForm.controls["lmpDate"].value;
    const matDeathdate = mDeathNgbDate ? new Date(mDeathNgbDate.year, mDeathNgbDate.month - 1, mDeathNgbDate.day) : new Date();
    const LMPdate: Date = new Date(this.datepipe.transform(lmpdate, 'yyyy-MM-dd'));
    let pragnancyWeek = Math.floor(((matDeathdate.getTime()-LMPdate.getTime())/(1000*60*60*24))/7)
    if(matDeathdate.getTime()>LMPdate.getTime())
    this.deliveryForm.controls['pregnancyWeek'].setValue(Number(pragnancyWeek).toFixed());
    else
    {
      this.deliveryForm.controls['pregnancyWeek'].setValue('');
      this.deliveryForm.controls['maternalDeathDate'].setValue('');
      alert('Maternal Death Date must be greater than LMP Date');
    }
  }



  liveBirthChange()
  {
let infantArray : FormArray= this.infantForm.get('infantFormArray') as FormArray
this.clearFormArray(infantArray);
    
    let a= this.deliveryForm.get('liveBirth').value
    for (let i=0 ; i<a;i++)
    {
   this.addInfants()
  }
}






//############################### Validations and Logics ##################//


  get mfg() {

    return this.deliveryForm.controls;
  }



  getBeneficiaryDetails(rchId: any, caseNo: any) {
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
      this.deliveryForm.controls['lastAncVisitDate'].setValue(this.datepipe.transform(response.lastANCVisitDate, 'yyyy-MM-dd'));
  
   
  this.parentState 
  this.parentDistrict=response.districtCode
  // parentTaluka; 
   this.parentBlock =response.healthBlockCode
    this.parentFacility=response.healthBlockCode
   // parentSubcenter; 
    this.parentVillage=response.villageCode
    this.parentFacilityType=response.healthFacilityType
this.parentStateName="Chadigarh"
this.parentDistrictName=response.Chandigarh
//parentTalukaName; 
this.parentBlockName=response.healthBlockName
 this.parentFacilityName=response.healthFacilityName
this.parentSubcenterName;
this.parentVillageName=response.villageName




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

      let count = 0;
      for (var val of response) {

        this.deliveryComplication[count] = { id: val.id, itemName: val.name, namedId: val.namedId };

        count++;
      }

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

  motherDeathCause() {
    this.backendApiService.getMdeathCause().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.maternalDeathCause = response;
      console.log(response);
    })
  }

  getnonObstericComplications() {
    this.backendApiService.getNonObstericComplication().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.nonObstericComplication = response;
      console.log("NON OBSTERIC COMPLICATION");
      console.log(response);
    })
  }



  healthFaclityType(typeId: any) {
    this.backendApiService.getHealthFacilityTypeByAshutosh(1, typeId).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.deliveryLoc = response;
      console.log(response);
      if (response.length == 0) {
        this.placeAvailable = true;

      }
      else {
        this.placeAvailable = false
      }


    })
  }

  mDeathHealthFaclityType(typeId: any) {
    this.backendApiService.getHealthFacilityTypeByAshutosh(1, typeId).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.deathLoc = response;
      console.log(response);
      if (response.length == 0) {
        this.deathPlaceAvailable = true;

      }
      else {
        this.deathPlaceAvailable = false
      }


    })
  }



  deliveryFacilityChange() {
    this.tabMisoDiv = false;
    this.deliveryPlaceDiv = false;
    this.otherdeliveryLocationDiv = false;``
    this.deliveryForm.controls['deliveryLocationId'].clearValidators()
    this.deliveryForm.controls['deliveryLocationId'].updateValueAndValidity()
    this.deliveryForm.controls['tabMisoprostol'].clearValidators()
    this.deliveryForm.controls['tabMisoprostol'].updateValueAndValidity()
    this.deliveryForm.controls['deliveryLocation'].setValue('')
   
    this.deliveryForm.controls['deliveryLocation'].clearValidators()
    this.deliveryForm.controls['deliveryLocation'].updateValueAndValidity()
    this.typeId = this.deliveryForm.get('deliveryPlace').value
    this.deliveryLoc = [];
    if (this.typeId == 22) {
      this.tabMisoDiv = true;
      this.deliveryForm.controls['tabMisoprostol'].setValidators([Validators.required])
      this.deliveryForm.controls['tabMisoprostol'].updateValueAndValidity()

    }
    if (this.typeId == 99) {
      this.otherdeliveryLocationDiv = true;
      this.deliveryForm.controls['deliveryLocation'].setValidators([Validators.required])
      this.deliveryForm.controls['deliveryLocation'].updateValueAndValidity()
    }

    if (this.typeId !== 22 && this.typeId !== 99) {
      this.deliveryPlaceDiv = true;
      this.deliveryForm.controls['deliveryLocationId'].setValidators([Validators.required])
      this.deliveryForm.controls['deliveryLocationId'].updateValueAndValidity()
      this.healthFaclityType(this.typeId)

    }



  }


  deliveryConductChange() {
    this.deliveryConductDiv = false;
    this.deliveryForm.controls['deliveryConductedOther'].setValue('')
    this.deliveryForm.controls['deliveryConductedOther'].clearValidators()
    this.deliveryForm.controls['deliveryConductedOther'].updateValueAndValidity()


    if (this.deliveryForm.controls['deliveryConductedBy'].value == 99) {
      this.deliveryConductDiv = true;
      this.deliveryForm.controls['deliveryConductedOther'].setValidators([Validators.required])
      this.deliveryForm.controls['deliveryConductedOther'].updateValueAndValidity()

    }
  }


  deliveryComplicationSelect(e: any) {


    if (e.id == "H") {
      this.deliveryComplicationDiv = true;
       this.deliveryForm.controls['otherComp'].setValidators([Validators.required])
      this.deliveryForm.controls['otherComp'].updateValueAndValidity()

    }
    else if (e.id == "J") {
      this.deliveryComplicationDiv = false;
      this.deliveryForm.controls['otherComp'].setValue('')
      this.deliveryForm.controls['otherComp'].clearValidators()
       this.deliveryForm.controls['otherComp'].updateValueAndValidity()
   
      this.deliveryComplicationSelected = [{ "id": "J", "itemName": "None" }];
      this.settingsComplication =
      {
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "multidropdown",
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 1,
        disabled: false


      }
    }



  }


  deliveryComplicationDeSelect(e: any) {

    if (e.id == "J") {
      this.settingsComplication =
      {
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "multidropdown",
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
        disabled: false


      }
    }
    else if (e.id == "H") {

      this.deliveryComplicationDiv = false;
      //this.deliveryForm.controls['deliveryComplication'].setValue('Z');
      this.deliveryForm.controls['otherComp'].setValue('')
      this.deliveryForm.controls['otherComp'].clearValidators();
      this.deliveryForm.controls['otherComp'].updateValueAndValidity()

    }
  }

  jsyBeneficiaryChange() {
    this.jsyBeneficiaryDiv = false;
    this.deliveryForm.controls['jsybenificiaryPayment'].clearValidators()
    this.deliveryForm.controls['jsybenificiaryPayment'].updateValueAndValidity()


    if (this.deliveryForm.controls['jsyBenificiary'].value == 1) {
      this.jsyBeneficiaryDiv = true;
      this.deliveryForm.controls['jsybenificiaryPayment'].setValidators([Validators.required])
      this.deliveryForm.controls['jsybenificiaryPayment'].updateValueAndValidity()

    }
  }

  deliveryOutcomeChange() {
    this.liveBirthDiv = false;
    this.stillBirthDiv = false;
    this.deliveryForm.controls['liveBirth'].clearValidators()
    this.deliveryForm.controls['liveBirth'].updateValueAndValidity()
    this.deliveryForm.controls['stillBirth'].clearValidators()
    this.deliveryForm.controls['stillBirth'].updateValueAndValidity()


    if (this.deliveryForm.controls['deliveryOutcomes'].value == 1) {
      this.liveBirthDiv = true;
      this.deliveryForm.controls['liveBirth'].setValidators([Validators.required])
      this.deliveryForm.controls['liveBirth'].updateValueAndValidity()

    }

    if (this.deliveryForm.controls['deliveryOutcomes'].value == 3) {
      this.stillBirthDiv = true;
      this.deliveryForm.controls['stillBirth'].setValidators([Validators.required])
      this.deliveryForm.controls['stillBirth'].updateValueAndValidity()

    }
  }


  maternalDeathChange() {

    this.maternalDeathDiv=false;
    this.nonObstericComplicationDiv = false
    this.otherMdeathCauseDiv = false;
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


    this.deliveryForm.controls['nonObstetricComplications'].clearValidators()
    this.deliveryForm.controls['nonObstetricComplications'].updateValueAndValidity()


    this.deliveryForm.controls['deathOther'].clearValidators()
    this.deliveryForm.controls['deathOther'].updateValueAndValidity()

    
if (this.deliveryForm.get("maternalDeath").value==1)
{
  this.maternalDeathDiv=true;
}
    
else
{
  this.maternalDeathDiv=false;
}
    

  }

  mDeathReasonChange() {
    this.nonObstericComplicationDiv = false
    this.otherMdeathCauseDiv = false;

    this.deliveryForm.controls['nonObstetricComplications'].clearValidators()
    this.deliveryForm.controls['nonObstetricComplications'].updateValueAndValidity()
    this.deliveryForm.controls['deathOther'].setValue('')
    this.deliveryForm.controls['deathOther'].clearValidators()
    this.deliveryForm.controls['deathOther'].updateValueAndValidity()

    if (this.deliveryForm.get('deathCause').value == 8) {
      this.nonObstericComplicationDiv = true;

      this.deliveryForm.controls['nonObstetricComplications'].setValidators(Validators.required)
      this.deliveryForm.controls['nonObstetricComplications'].updateValueAndValidity()

    }
    else if (this.deliveryForm.get('deathCause').value == 5) {
      this.otherMdeathCauseDiv = true;

      this.deliveryForm.controls['deathOther'].setValidators(Validators.required)
      this.deliveryForm.controls['deathOther'].updateValueAndValidity()


    }

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

  submitDelivery(deliveryForm: FormGroup) {
    this.submitted = true;
    let complicationID: String = "";
    console.log(this.findInvalidControls())

    for (let i = 0; i < this.deliveryComplicationSelected.length; i++) {
      complicationID = complicationID + String(this.deliveryComplicationSelected[i].id)
      //  console.log(this.deliveryComplicationSelected.);

      //

    }
  //  this.deliveryForm.controls['deliveryComplication'].setValue(complicationID);
    console.log("Delivery Complication Array" + this.deliveryForm.get('deliveryComplication').value)
    console.log("Inside Delivery Submit")
    if (this.deliveryForm.invalid) {
      console.log("Invalid Form Check Validation");
      console.log(JSON.stringify(this.deliveryForm.value))
      return;
    }

    console.log(this.deliveryForm.value)


    alert( "Delivery can be saved ")

    const deliveryDate = this.deliveryForm.get('deliveryDate').value;
    const dischargeDate = this.deliveryForm.get('dischargeDate').value;
    const mdeathDate = this.deliveryForm.get('dischargeDate').value;


    const deliveryDatePatch: any = deliveryDate ? this.datepipe.transform(new Date(deliveryDate.year, deliveryDate.month - 1, deliveryDate.day), 'yyyy-MM-dd') : null;
    const dischargeDatePatch: any = dischargeDate ? this.datepipe.transform(new Date(dischargeDate.year, dischargeDate.month - 1, dischargeDate.day), 'yyyy-MM-dd') : null;
    const mdeathDatePatch: any = mdeathDate ? this.datepipe.transform(new Date(mdeathDate.year, mdeathDate.month - 1, mdeathDate.day), 'yyyy-MM-dd') : null;



    this.deliveryForm.patchValue({

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
      deliveryDate: deliveryDatePatch,
      dischargeDate: dischargeDatePatch,
      maternalDeathDate: mdeathDatePatch,
      jsyBenificiary: Number(this.deliveryForm.get('jsyBenificiary').value),
      jsybenificiaryPayment: Number(this.deliveryForm.get('jsybenificiaryPayment').value),
      liveBirth: Number(this.deliveryForm.get('liveBirth').value),
      stillBirth: Number(this.deliveryForm.get('stillBirth').value),
      isIliSymptom: Number(this.deliveryForm.get('isIliSymptom').value),
      isContactCovid: Number(this.deliveryForm.get('isContactCovid').value),
      covidTestDone: Number(this.deliveryForm.get('covidTestDone').value),
      covidTestResult: Number(this.deliveryForm.get('covidTestResult').value),
      maternalDeath: Number(this.deliveryForm.get('maternalDeath').value),
      notificationByAsha: Number(this.deliveryForm.get('notificationByAsha').value),
      fbirByAnm: Number(this.deliveryForm.get('fbirByAnm').value),
      jsyPaidDate : null,
      deliveryComplication : complicationID,
    // createdBy: 1,
    // createdOn: this.currentdate,
      updatedBy: null,
      updatedOn: null,
      mobileId: 78,
      sourceId : 0,
      tabMisoprostol : this.deliveryForm.get('tabMisoprostol').value ? Number(this.deliveryForm.get('tabMisoprostol').value) : null,
      nonObstetricComplications :  this.deliveryForm.get('nonObstetricComplications').value ? Number(this.deliveryForm.get('nonObstetricComplications').value) : null,
      deathCause : this.deliveryForm.get('deathCause').value ? Number(this.deliveryForm.get('deathCause').value) : null,
      maternalDeathPlace :  this.deliveryForm.get('maternalDeathPlace').value ? Number(this.deliveryForm.get('maternalDeathPlace').value) : null,
      maternalDeathLocationId :  this.deliveryForm.get('maternalDeathLocationId').value ? Number(this.deliveryForm.get('maternalDeathLocationId').value) : null,
    
    })

debugger
if(this.editFlag==false)
{
    //################ SAVE PW DELIVERY ##############//
    this.deliveryForm.controls['createdOn'].setValue(this.currentdate)
    this.deliveryForm.controls['createdBy'].setValue(this.tokenservice.getUserId())
    console.log(JSON.stringify(this.deliveryForm.value))

     this.backendApiService.postPWDelivery(deliveryForm.value).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log("Response When PW Delivery Save Posted ---" + response);
      alert(response.title)
    
     // this.clearEct();
      },
        error => {
        console.log(error);
        if (error.status==409)
        {
          alert("Pragnant Women Delivery has already been Saved ");
  
        }
        else
        {
          alert("Problem with PW Delivery Save  Please contact Administrator " +error.status );
     
        }
   
        }); 
      }

    

      if(this.editFlag==true)
      {
        const RCHID = this.deliveryForm.get('registrationNo').value;
        const CASENO = this.deliveryForm.get('caseNo').value;
        this.deliveryForm.controls['updatedOn'].setValue(this.currentdate)
        this.deliveryForm.controls['updatedBy'].setValue(this.tokenservice.getUserId())
        console.log(JSON.stringify(this.deliveryForm.value))
        this.backendApiService.editPWDeliveryDetails(RCHID,CASENO,deliveryForm.value).subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        console.log("Response When PW Delivery updated ---" + response);
        alert(response.title)
        
         // this.clearEct();
     
      
          },
            error => {
            console.log(error);
            if (error.status==409)
            {
              alert("Pragnant Women Delivery has already Edited ");
      
            }
            else
            {
              alert("Problem with PW Delivery Edit  Please contact Administrator " +error.status );
         
            }
       
            }); 
       
      }

    }
      

  

   
  editPWDeliveryForm(RCHID : any ,CASEID : any)
  {

    this.backendApiService.getPWDdetails(RCHID,CASEID).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
    this.deliveryConductDiv=false
    this.deliveryForm.controls['deliveryConductedOther'].setValue('');
    this.deliveryForm.controls['deliveryConductedOther'].clearValidators()
    this.deliveryForm.controls['deliveryConductedOther'].updateValueAndValidity()
    this.liveBirthDiv = false
    this.deliveryForm.controls['liveBirth'].setValue('');
    this.deliveryForm.controls['liveBirth'].clearValidators()
    this.deliveryForm.controls['liveBirth'].updateValueAndValidity()
    this.stillBirthDiv = false;
    this.deliveryForm.controls['stillBirth'].setValue('');
    this.deliveryForm.controls['stillBirth'].clearValidators()
    this.deliveryForm.controls['stillBirth'].updateValueAndValidity()
    this.tabMisoDiv = false;
    this.deliveryForm.controls['tabMisoprostol'].setValue('');
    this.deliveryForm.controls['tabMisoprostol'].clearValidators()
    this.deliveryForm.controls['tabMisoprostol'].updateValueAndValidity()
    this.otherdeliveryLocationDiv = false;
    this.deliveryForm.controls['deliveryLocation'].setValue('');
    this.deliveryForm.controls['deliveryLocation'].clearValidators()
    this.deliveryForm.controls['deliveryLocation'].updateValueAndValidity()
    this.deliveryPlaceDiv = false;
    this.deliveryForm.controls['deliveryLocationId'].setValue('');
    this.deliveryForm.controls['deliveryLocationId'].clearValidators()
    this.deliveryForm.controls['deliveryLocationId'].updateValueAndValidity()
    this.MdeathPlaceOtherDiv = false;
    this.deliveryForm.controls['maternalDeathLocation'].clearValidators()
    this.deliveryForm.controls['maternalDeathLocation'].updateValueAndValidity()
    this.MdeathPlaceDiv = false;
    this.deliveryForm.controls['maternalDeathLocationId'].clearValidators()
    this.deliveryForm.controls['maternalDeathLocationId'].updateValueAndValidity()
 

        

     console.log("PW DELIVERY DETAILS ")
     console.log(response);
     this.deliveryForm.controls['stateCode'].setValue(response[0].stateCode);
     this.deliveryForm.controls['districtCode'].setValue(response[0].districtCode);
     this.deliveryForm.controls['ruralUrban'].setValue(response[0].ruralUrban);
     this.deliveryForm.controls['healthBlockCode'].setValue(response[0].healthBlockCode);
     this.deliveryForm.controls['talukaCode'].setValue(response[0].talukaCode);
     this.deliveryForm.controls['healthFacilityType'].setValue(response[0].healthFacilityType);
     this.deliveryForm.controls['healthFacilityCode'].setValue(response[0].healthFacilityCode);
     this.deliveryForm.controls['healthSubFacilityCode'].setValue(response[0].healthSubFacilityCode);
     this.deliveryForm.controls['villageCode'].setValue(response[0].villageCode);
     this.deliveryForm.controls['financialYr'].setValue(response[0].financialYr);
     this.deliveryForm.controls['anmId'].setValue(response[0].anmId);
     this.deliveryForm.controls['ashaId'].setValue(response[0].ashaId);
     this.deliveryForm.controls['deliveryTime'].setValue(response[0].deliveryTime);
     this.deliveryForm.controls['deliveryType'].setValue(response[0].deliveryType);
     this.deliveryForm.controls['jsyBenificiary'].setValue(response[0].jsyBenificiary);
     this.deliveryForm.controls['deliveryConductedBy'].setValue(response[0].deliveryConductedBy);
     this.deliveryForm.controls['dischargeTime'].setValue(response[0].dischargeTime);
     this.deliveryForm.controls['isIliSymptom'].setValue(response[0].isIliSymptom);
     this.deliveryForm.controls['isContactCovid'].setValue(response[0].isContactCovid);
     this.deliveryForm.controls['covidTestDone'].setValue(response[0].covidTestDone);
     this.deliveryForm.controls['covidTestResult'].setValue(response[0].covidTestResult);
  
   
     switch (response[0].deliveryConductedBy)
    {
      case 99 :
        this.deliveryConductDiv=true
        
        this.deliveryForm.controls['deliveryConductedOther'].setValue(response[0].deliveryConductedOther);
        this.deliveryForm.controls['deliveryConductedOther'].setValidators([Validators.required])
        this.deliveryForm.controls['deliveryConductedOther'].updateValueAndValidity()
      break
     }



    this.deliveryForm.controls['deliveryPlace'].setValue( response[0].deliveryPlace);
    
    this.deliveryForm.controls['deliveryOutcomes'].setValue( response[0].deliveryOutcomes);

   switch(response[0].deliveryOutcomes)
   {
case  1 : 
this.liveBirthDiv = true
this.deliveryForm.controls['liveBirth'].setValue( response[0].liveBirth);
this.deliveryForm.controls['liveBirth'].setValidators([Validators.required])
this.deliveryForm.controls['liveBirth'].updateValueAndValidity()
 
break

  case  2 :
  this.stillBirthDiv = true;
  this.deliveryForm.controls['stillBirth'].setValue( response[0].stillBirth);
  this.deliveryForm.controls['stillBirth'].setValidators([Validators.required])
  this.deliveryForm.controls['stillBirth'].updateValueAndValidity()
break

   }
  

     switch(response[0].deliveryPlace)
     {
       case  22 :
        this.tabMisoDiv = true;
        this.deliveryForm.controls['tabMisoprostol'].setValue(response[0].tabMisoprostol);
        this.deliveryForm.controls['tabMisoprostol'].setValidators([Validators.required])
        this.deliveryForm.controls['tabMisoprostol'].updateValueAndValidity()
        break

        case  99 :
          this.otherdeliveryLocationDiv = true;
          this.deliveryForm.controls['deliveryLocation'].setValue(response[0].deliveryLocation);
          this.deliveryForm.controls['deliveryLocation'].setValidators([Validators.required])
          this.deliveryForm.controls['deliveryLocation'].updateValueAndValidity()
        break
    
        default:
         this.deliveryPlaceDiv = true;
         this.healthFaclityType(response[0].deliveryPlace);
         this.deliveryForm.controls['deliveryLocationId'].setValue( response[0].deliveryLocationId);
         this.deliveryForm.controls['deliveryLocationId'].setValidators([Validators.required])
         this.deliveryForm.controls['deliveryLocationId'].updateValueAndValidity()
         
       
        }
    
 
     this.deliveryForm.controls['deliveryDate'].setValue(
      {
        year: new Date(response[0].deliveryDate).getFullYear(),
        month: new Date(response[0].deliveryDate).getMonth() + 1,
        day: new Date(response[0].deliveryDate).getDate()
      }
    );

    this.deliveryForm.controls['dischargeDate'].setValue(
      {
        year: new Date(response[0].dischargeDate).getFullYear(),
        month: new Date(response[0].dischargeDate).getMonth() + 1,
        day: new Date(response[0].dischargeDate).getDate()
      }
    );


     
const   deliveryComplication =String(response[0].deliveryComplication).split("")
let  deliveryCompArray : Array<any>=[]
for (var i=0;i< deliveryComplication.length;i++)
{
  const index =this.deliveryComplication.findIndex(x=>x.id==(deliveryComplication[i]))
  deliveryCompArray[index] = { id: this.deliveryComplication[index].id, itemName: this.deliveryComplication[index].itemName, namedId: this.deliveryComplication[index].namedId };
 }


 this.deliveryForm.controls['deliveryComplication'].setValue(deliveryCompArray) ;
 this.deliveryForm.controls['maternalDeath'].setValue(response[0].maternalDeath); 

 
 switch(response[0].maternalDeath)
 {
case  1 :
this. maternalDeathDiv=true;
this.deliveryForm.controls['deathCause'].setValue(response[0].maternalDeathPlace);
this.deliveryForm.controls['notificationByAsha'].setValue(response[0].notificationByAsha);
this.deliveryForm.controls['fbirByAnm'].setValue(response[0].fbirByAnm); 
 this.deliveryForm.controls['maternalDeathDate'].setValue(
  {
    year: new Date(response[0].maternalDeathDate).getFullYear(),
    month: new Date(response[0].maternalDeathDate).getMonth() + 1,
    day: new Date(response[0].maternalDeathDate).getDate()
  })
this.pragnancyWeekCal();
this.deliveryForm.controls['maternalDeathPlace'].setValue(response[0].maternalDeathPlace); 
//###########
switch(response[0].maternalDeathPlace)
{
  case  99: 
    this.MdeathPlaceOtherDiv = true;
    this.deliveryForm.controls['maternalDeathLocation'].setValidators([Validators.required])
    this.deliveryForm.controls['maternalDeathLocation'].updateValueAndValidity()
break
 default:
    this.MdeathPlaceDiv = true;

    this.deliveryForm.controls['maternalDeathLocationId'].setValidators([Validators.required])
    this.deliveryForm.controls['maternalDeathLocationId'].updateValueAndValidity()

    this.mDeathHealthFaclityType(response[0].maternalDeathPlace)
    this.deliveryForm.controls['maternalDeathLocationId'].setValue(response[0].maternalDeathLocationId); 

  }
//#############
break 

case  2 :

  this. maternalDeathDiv=false;
  break


}




  })
}

 

  


  



  getHealthProviderAnm(subcentrecode: number, typeid: number) {
    this.backendApiService.getHealthProvideratSubcentre(subcentrecode, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.healthProvider = response;
      console.log(response);

      if (this.healthProvider.length < 1) {
        this.healthProvider = [{ id: 0, name: "Not Available", contact_No: "" }]
      }


    })
  }

  getHealthProviderAsha(subcentrecode: number, typeid: number) {
    this.backendApiService.getHealthProvideratSubcentre(subcentrecode, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.healthProviderAsha = response;


      if (this.healthProviderAsha.length < 1) {
        this.healthProviderAsha = [{ id: 0, name: "Not Available", contact_No: "" }]
      }

      console.log(response);
    })
  }



  usehierarchyHandler(hierarchyMobj: HierarchyModel) {

    this.hierarchyMobj = hierarchyMobj;

    this.selectedVillage = this.hierarchyMobj.villageid
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

      this.msg = "Select Hierarchy";


      this.fill_hierarchy = false
    }
    if (this.selectedVillage !== undefined) {
      this.showNotFoundMsg = false;
      this.msg = null;
      this.fill_hierarchy = true
      if (this.hierarchyMobj.subfacilityid !== undefined) {

        this.getHealthProviderAnm(this.hierarchyMobj.subfacilityid, 2);
        this.getHealthProviderAsha(this.hierarchyMobj.subfacilityid, 1);

      }

    }
  }


  deathFacilityChange() {
    this.MdeathPlaceOtherDiv = false;
    this.MdeathPlaceDiv = false;
    this.deliveryForm.controls['maternalDeathLocation'].setValue('')
    this.deliveryForm.controls['maternalDeathLocationId'].clearValidators()
    this.deliveryForm.controls['maternalDeathLocationId'].updateValueAndValidity()
    this.deliveryForm.controls['maternalDeathLocation'].clearValidators()
    this.deliveryForm.controls['maternalDeathLocation'].updateValueAndValidity()


    this.typeId = this.deliveryForm.get('maternalDeathPlace').value
    this.deathLoc = [];
    if (this.typeId == 99) {
      this.MdeathPlaceOtherDiv = true;
      this.deliveryForm.controls['maternalDeathLocation'].setValidators([Validators.required])
      this.deliveryForm.controls['maternalDeathLocation'].updateValueAndValidity()

    }
    if (this.typeId != 99)
    {
      this.MdeathPlaceDiv = true;
      this.deliveryForm.controls['maternalDeathLocationId'].setValidators([Validators.required])
      this.deliveryForm.controls['maternalDeathLocationId'].updateValueAndValidity()

      this.mDeathHealthFaclityType(this.typeId)

    }



  }

//############################################## INFANT FORM ##########################################//

infantForm : FormGroup;
infantFormArray : FormArray;

InfantFormArray()
{
  this.infantForm= this.formBuilder.group({
  infantFormArray : this.formBuilder.array( [   ])
    
});
}


InfantForm(): FormGroup {
  return this.formBuilder.group({
      infantName: new FormControl(''),
      infantRchId: new FormControl(''),
      infantTerm: new FormControl(''),
      dateOfBirth: new FormControl(''),
      timeOfBirth: new FormControl(''),
      typeOfBirth: new FormControl(''),
      corticosteroidReceived: new FormControl(''),
      noOfDoses: new FormControl(''),
      infantSex: new FormControl(''),
      babyCried: new FormControl(''),
      referHigher: new FormControl(''),
      sncuNumber: new FormControl(''),
      physicalDefect: new FormControl(''),
      infantWeight: new FormControl(''),
      breastFeed: new FormControl(''),
      opv: new FormControl(''),
      bcg: new FormControl(''),
      hep: new FormControl(''),
      vitk: new FormControl(''),
      neoNatalDeath: new FormControl(''),
      natalDeathDate: new FormControl(''),
      infantDeathfacility: new FormControl('', Validators.required),
      infantPlaceDeath: new FormControl('', Validators.required),
      otherDeathPlace: new FormControl('', Validators.required),
      infantDeathReason: new FormControl('', Validators.required),
      infantOtherDeathReason: new FormControl(''),
      notifyAsha: new FormControl('', Validators.required),
      FBIRcompleteANM: new FormControl(''),
      neonatalDeathNo: new FormControl(''),
    
    })
}


addInfants(): void {
  this.infantFormArray = this.infantForm.get('infantFormArray') as FormArray;
  this.infantFormArray.push(this.InfantForm());
}

removeInfants(i : number )
{
    this.infantFormArray.removeAt(i);  
}

clearFormArray = (formArray: FormArray) => {
  while (formArray.length !== 0) {
    formArray.removeAt(0)
  }
}
 
getControls() {
  return (this.infantForm.get('infantFormArray') as FormArray).controls;
}



submitInfants(infantForm : FormGroup)
{

}




}









