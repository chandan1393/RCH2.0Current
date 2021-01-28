import { AfterViewInit, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ECModel } from 'src/app/Core/Model/ec-model';
import { ectEntity } from 'src/app/ECTentity';
import { BackendAPIService } from '../service/backend-api.service';
import { HierarchyModel } from '../../Core/Model/hierarchyModel'
import { HierarchyComponent } from '../hierarchy/hierarchy.component'
import { TokenStorageService, TokenstoreageService } from 'src/app/Core/service/token/tokenstoreage.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { IpServiceService } from 'src/app/component/service/ip-service.service';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { ChangeDetectionStrategy } from "@angular/core";
import { isEmpty } from 'rxjs/operators';
import { error } from 'protractor';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ectrack',
  templateUrl: './ectrack.component.html',
  styleUrls: ['./ectrack.component.css']
})
export class EctrackComponent implements OnInit {



  constructor(private formBuilder: FormBuilder, private backendApiService: BackendAPIService, private token: TokenstoreageService, public datepipe: DatePipe, private route: ActivatedRoute, public router: Router, private tokenservice: TokenStorageService,private http: HttpClient, private ipservice: IpServiceService, private ngzone: NgZone) {

  }


  
  

  ngOnInit(): void {

/*
if (window.localStorage.getItem("H_KEY")===null || window.localStorage.getItem("H_KEY")==="")
{
  alert("Please Select Hierachy First")
}

 let RCHID: string = this.route.snapshot.queryParamMap.get('ID')
   this.rchId = Number(this.route.snapshot.queryParamMap.get('ID'));

  this.createECTform();
  //   this.createMethodArray();
 
     this.usehierarchyHandler(this.hierarchyMobj);
     this.getHealthProviderAnm(this.selectedSubCentre, 2);
     this.getHealthProviderAsha(this.selectedSubCentre, 1);
     this.getHealthFacility();
     this.getContraMethods();
     this.getecdetails(this.rchId);
     this.getectdetails(this.rchId);

      */  
     let Page_Code = window.localStorage.getItem("PageCode")
     

     

switch(Page_Code)
{
case  'HOMESEARCH' :
 let RCHID: string =window.localStorage.getItem("HomeSearch")
 this.rchId = Number(RCHID)
 console.log(this.rchId);
 this.createECTform();
//this.createMethodArray();
  
     this.usehierarchyHandler(this.hierarchyMobj);
     this.getHealthProviderAnm(this.selectedSubCentre, 2);
     this.getHealthProviderAsha(this.selectedSubCentre, 1);
     this.getHealthFacility();
     this.getContraMethods();
     this.getecdetails(this.rchId);
       
     this.getectdetails(this.rchId);

    window.localStorage.removeItem("PageCode")
      
//window.localStorage.removeItem("ECPROFILE")

   break;

     case  'ECPROFILE' :
let RCHID_EC: string =window.localStorage.getItem("ID")
this.rchId = Number(RCHID_EC)
console.log(this.rchId);
this.createECTform();
//this.createMethodArray();
 
     this.usehierarchyHandler(this.hierarchyMobj);
     this.getHealthProviderAnm(this.selectedSubCentre, 2);
     this.getHealthProviderAsha(this.selectedSubCentre, 1);
     this.getHealthFacility();
     this.getContraMethods();
     this.getecdetails(this.rchId);
     this.getectdetails(this.rchId);
   
     console.log(this.rchId);
          
//window.localStorage.removeItem("HOMESEARCH")

  window.localStorage.removeItem("PageCode")


     break;


     case  'ECSEARCH' :
      let RCHID_ECS: string =window.localStorage.getItem("ID")
      this.rchId = Number(RCHID_ECS)
      console.log(this.rchId);
      this.createECTform();
      //this.createMethodArray();
       
           this.usehierarchyHandler(this.hierarchyMobj);
           this.getHealthProviderAnm(this.selectedSubCentre, 2);
           this.getHealthProviderAsha(this.selectedSubCentre, 1);
           this.getHealthFacility();
           this.getContraMethods();
           this.getecdetails(this.rchId);
           this.getectdetails(this.rchId);
         
           console.log(this.rchId);
                
      //window.localStorage.removeItem("HOMESEARCH")
      
      window.localStorage.removeItem("PageCode")
      
      
           break;
      
      
           
      

     case (""||null) :
        this.router.navigate(['home']);
     break;
    
 



}

/*
 if (String(window.localStorage.getItem("HomeSearch"))=="" )
{
  window.localStorage.removeItem("HomeSearch")
   this.router.navigate(['home']);

}
 if (String(window.localStorage.getItem("ID"))=="" )
{
  
window.localStorage.removeItem("rchid")
window.localStorage.removeItem("ID")

  this.router.navigate(['home/ecprofile']);
}
   */

  
} 




  hierarchyMobj = new HierarchyModel();
  submitted: boolean = false;
  Method: Array<any>;
  rchId: number;
  msg: string;
  showNotFoundMsg: boolean = false;
  responseLength : number
  lastLMPdateMsg : String ;
  editFlag : Boolean = false;
  otherChanging : boolean =false;




  DiscontinueReason: Array<any> = [
    { id: 'U', name: 'Unsatisfied with the method' },
    { id: 'E', name: 'Effective Lifespan of IUCD has ended (10 years for IUCD 380A and 5 years for IUCD 375)' },
    { id: 'C', name: 'Wants to conceive' },
    { id: 'M', name: 'Menopause' },
    { id: 'I', name: 'IUCD displacement' },
    { id: 'P', name: 'Personal Reason' },
    { id: 'O', name: 'Others' }
  ];


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
      if(Number(window.localStorage.getItem("HomeSearch"))>0)
    {
      this.msg = "To view beneficiary data kindly set location hierarchy";
    }
    else
    {
      this.msg = "Select Hierarchy";
    
    }
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




  ecmodel = new ECModel();
  ectmodel = new ectEntity();
  healthFac: Array<any>;
  healthProvider: Array<any>;
  ectArray: Array<any>;
  ectGridArray : Array<any>;
  healthProviderAsha: Array<any>;
  place: Array<any>;
  //ectVisitDetails : Array<any>;
  ectForm: FormGroup;
  ECregistrationDetails: Array<any>;
  div2: boolean = false;
  div1: boolean = true;
  qtyPieces: boolean = false;
  qtyStrips: boolean = false;
  typeId: number;
  placeDropDown: boolean = false;
  placeInput: boolean = false;
  methodValue: any;
  IUCD: boolean = false;
  InjContraceptive: boolean = false;
  sterlization: boolean = false;
  otherMethodInput: boolean = false;
  ecdeathDetail: boolean = false;  //
  bpWrite: boolean;
  LmpDate: boolean;
  //----temporary--//
  contraceptiveMethod: boolean = false;
  discontinueSwitch: boolean = false;
  methodArray: any;
  ectMethod: any;
  userId: number;
  currentdate = new Date();
  lastLmpDate: Date;
  public selectedDate: NgbDate;
  pragnantStatus: string;
  pragnantTest : string;
  continueFlag: boolean = false;
  ecDeathStatus: string;
  womenDob: Date;
  ipAddress: string;
  placeAvailable : boolean=false;


  minDate = { year: 2011, month: 4, day: 1 };
  maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };


  createECTform() {
    this.ectForm = this.formBuilder.group(
      {
        stateCode: new FormControl(''),
        districtCode: new FormControl(''),
        healthBlockCode: new FormControl(''),
        healthFacilityCode: new FormControl(''),
        healthSubFacilityCode: new FormControl(''),
        talukaCode: new FormControl(''),
        healthFacilityType: new FormControl(''),
        rurUrbHierarchy: new FormControl(''),
        ruralUrban: new FormControl(''),
        villageCode: new FormControl(''),
        registrationNo: new FormControl(''),
        idNo: new FormControl(''),
        nameWife: new FormControl(''),
        other: new FormControl(''),
        wifeAge: new FormControl(''),
        nameHusband: new FormControl(''),
        mobileNo: new FormControl(''),
        visitNo: new FormControl(''),
        dateRegis: new FormControl(''),
        financialYr: new FormControl(''),
        financialYear: new FormControl(''),
        anmId: new FormControl('', Validators.required),
        ashaId: new FormControl('', Validators.required),
        caseNo: new FormControl(''),
        ipAddress: new FormControl(''),
        createdBy: new FormControl(''),
        createdOn: new FormControl(''),
        mobileId: new FormControl(''),
        updatedBy: new FormControl(''),
        updatedOn: new FormControl(''),
        sourceId: new FormControl(''),
        wardNo: new FormControl(''),
        mpwId: new FormControl(''),
        visitDate: new FormControl('', Validators.required),
        lastVisitDate: new FormControl(''),
        ecLmpDate: new FormControl('', Validators.required),
        LAcheck: new FormControl(''),
        pregnant: new FormControl('', Validators.required),
        pregnantTest: new FormControl('', Validators.required),
        facilityType: new FormControl('', Validators.required),
        placeName: new FormControl(''),
        otherPlaceName: new FormControl(''),
        ecDeath: new FormControl('', Validators.required),
        deathDate: new FormControl(''),
        deathPlace: new FormControl(''),
        deathReason: new FormControl(''),
        otherDeathCause: new FormControl(''),
        method: new FormControl('', Validators.required),

        tEctMethod: 
     //   new FormArray([
          this.createMethodArray()    //---formFroup---tEctMethod---//
     //   ])
      },
     {
       validator: [this.validVisitDate('dateRegis', 'visitDate', 'lastVisitDate'), this.validLmpDate('visitDate', 'ecLmpDate'),
       this.validDeathDate('lastVisitDate', 'deathDate','dateRegis','visitDate')
       ],

      }
      )
  }



  createMethodArray(): FormGroup {

    return this.formBuilder.group({
      registrationNo: new FormControl(''),
      caseNo: new FormControl(''),
      visitDate: new FormControl(''),         
      methodId: new FormControl(''),
      visitNo: new FormControl(''),
      quantityPieces: new FormControl(''),
      quantityStrips: new FormControl(''),
      iucdinsertionDate: new FormControl(''),
      iucdType: new FormControl(''),
      pspvFindings: new FormControl(''),
      followVisit: new FormControl(''),
      visitFacility: new FormControl(''),
      sterilizationInsurance: new FormControl(''),
      otherMethod: new FormControl(''),
      mpainjectionDate: new FormControl(''),
      noOfDose: new FormControl(''),
      mpainjectionType: new FormControl(''),
      weightWomen: new FormControl(''),
      bpSystolic: new FormControl(''),
      bpDistolic: new FormControl(''),
      bpCheck: new FormControl(''),
      bleedingChanging: new FormControl(''),
      otherChanging: new FormControl(''),
      sterilizationDate: new FormControl(''),
      sterilizationType: new FormControl(''),
      switchingMonth: new FormControl(''),
      alternativeMethod: new FormControl(''),
      discontinuationReason: new FormControl(''),
      createdBy: new FormControl(''),
      createdOn: new FormControl(''),
      updatedBy: new FormControl(''),
      updatedOn: new FormControl(''),
      modernMethod: new FormControl(''),

    },
      {
      validator: [this.validateBp('bpSystolic', 'bpDistolic'), this.validateMpaDate('visitDate', 'mpainjectionDate'),
        this.validateIUCD('iucdinsertionDate', 'visitDate'), this.validSterilizationDate('sterilizationDate', 'visitDate'),
        ]
     }
     )

  }


/*
  parseDate(selectedDate: NgbDate): String {

    // let  dateObject: Date = new Date();
    if (selectedDate != null) {
      //dateObject.setDate(selectedDate.day);
      //dateObject.setFullYear(selectedDate.year);
      //dateObject.setMonth(selectedDate.month - 1);
      //return dateObject;
      return selectedDate.year + "," + (selectedDate.month - 1) + "," + selectedDate.day
    }
    else {
      //this.dateObject= new Date(selectedDate.year,selectedDate.month,selectedDate.day);
      // return new Date("1995-01-01");
      //return new Date("2021-01-01");
      return JSON.stringify({
        year: "",
        month: "",
        day: "",
      });


    }

  }

*/







  //########################## LMP DATE VALIDATION ####################//

  validLmpDate(vDate: any, lmpdate: any) {
    return (formGroup: FormGroup) => {

      const visitNgbdate = formGroup.controls[vDate];
      const lmpNgbDate = formGroup.controls[lmpdate];
      const visitdate = visitNgbdate.value ? new Date(visitNgbdate.value.year, visitNgbdate.value.month - 1, visitNgbdate.value.day) : new Date();
      const LmpDate = lmpNgbDate.value ? new Date(lmpNgbDate.value.year, lmpNgbDate.value.month - 1, lmpNgbDate.value.day) :  new Date();
      const lastLmpDate = new Date(this.lastLmpDate);
      if (!lmpNgbDate || !visitNgbdate) {
        return null;
      }

      if (lmpNgbDate.errors && !lmpNgbDate.errors.validLmpDateFlag) {
        return null;
      }

      if (lmpNgbDate.value != isEmpty && lmpNgbDate.value != '' && lmpNgbDate.value != null) {

        if (LmpDate.getTime() > visitdate.getTime()) {
          lmpNgbDate.setErrors({ validLmpDateFlag: true })
        }
        else if (LmpDate.getTime() < lastLmpDate.getTime()) {
          lmpNgbDate.setErrors({ validLastLmpDateFlag: true })
        }

        else {
            lmpNgbDate.setErrors(null);
        }
      }
      else {
        lmpNgbDate.setErrors(null);
      }
    }

  }



  //###################### VALID VISIT DATE #######################//

  validVisitDate(regdate: any, vDate: any, lDate: any) {
    return (formGroup: FormGroup) => {

      const regisdate = formGroup.controls[regdate];
      const visitNgbdate = formGroup.controls[vDate];
      const lastVisit = formGroup.controls[lDate];

      const visitdate = visitNgbdate.value ? new Date(visitNgbdate.value.year, visitNgbdate.value.month-1, visitNgbdate.value.day) :  new Date();
      const registrationDate: Date = new Date(this.datepipe.transform(regisdate.value, 'yyyy-MM-dd'));
      const lastVisitDate: Date = new Date(this.datepipe.transform(lastVisit.value, 'yyyy-MM-dd'))
  
      if (!regisdate || !visitNgbdate || !lastVisit) {
        return null;
      }

      if (regisdate.errors && !visitNgbdate.errors.validVisitFlag) {
        return null;
      }
      if (lastVisit.errors && !visitNgbdate.errors.lastValidVisitFlag) {
        return null;
      }
      if (visitNgbdate.errors && !visitNgbdate.errors.validVisitFlag) {
        return null;
      }
      if (visitNgbdate.errors && !visitNgbdate.errors.lastValidVisitFlag) {
        return null;
      }


      if (visitNgbdate.value != isEmpty && visitNgbdate.value != '' && visitNgbdate.value != null) {

       if (((registrationDate.getTime() - visitdate.getTime()) / (1000 * 60 * 60 * 24)) >=1) {
       
    //    if (visitdate.getTime() < registrationDate.getTime()) {
          visitNgbdate.setErrors({ validVisitFlag: true });

        }
    //    else if (registrationDate.getTime()!=lastVisitDate.getTime())
         else if (((visitdate.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)) <28) {
          visitNgbdate.setErrors({ lastValidVisitFlag: true });
        }
        else {

          visitNgbdate.setErrors(null);

        }
      }
      else {
        visitNgbdate.setErrors(null);
      }
    }



  }


  validateIUCD(iucdDate: any, visitDate: any) {
    return (formGroup: FormGroup) => {

      const iucd = formGroup.controls[iucdDate];
      const visit = formGroup.controls[visitDate];
      const iucddate = iucd.value ? new Date(iucd.value.year, iucd.value.month - 1, iucd.value.day) : new Date()
      const visitdate = visit.value ? new Date(visit.value.year, visit.value.month - 1, visit.value.day) : new Date()

      if (!iucd || !visit) {
        iucd.setErrors(null);
      }

      if (iucd.errors && !iucd.errors.validIUCD) {
        iucd.setErrors(null);
      }

      if (iucd.value != isEmpty && iucd.value != '' && iucd.value != null) {

        if (iucddate.getTime() > visitdate.getTime()) {
          iucd.setErrors({ validIUCD: true });
        }
        else {
          iucd.setErrors(null);
        }

      }
      else {
        iucd.setErrors(null);
      }
    }
  }



  validSterilizationDate(sterileDate: any, visitDate: any) {
    return (formGroup: FormGroup) => {
      const sterilizationDate = formGroup.controls[sterileDate];
      const visit = formGroup.controls[visitDate];
      const strlDate = sterilizationDate.value ? new Date(sterilizationDate.value.year, sterilizationDate.value.month - 1, sterilizationDate.value.day) : new Date()
      const visitdate = visit.value ? new Date(visit.value.year, visit.value.month - 1, visit.value.day) : new Date()


      if (!sterilizationDate || !visit) {
        sterilizationDate.setErrors(null);

      }

      if (sterilizationDate.errors && !sterilizationDate.errors.validSTRL) {
        sterilizationDate.setErrors(null);

      }


      if (sterilizationDate.value != isEmpty && sterilizationDate.value != '' && sterilizationDate != null) {


        if (strlDate.getTime() > visitdate.getTime()) {
          sterilizationDate.setErrors({ validSTRL: true });
        }

        else {
          sterilizationDate.setErrors(null);
        }
      }
      else {
        sterilizationDate.setErrors(null);
      }
    }
  }

  validateMpaDate(visitDate: any, mpaDate: any) {
    return (formGroup: FormGroup) => {

      const visit = formGroup.controls[visitDate];
      const mpaInjectDate = formGroup.controls[mpaDate];
      const visitdate = visit.value ? new Date(visit.value.year, visit.value.month - 1, visit.value.day) : new Date()
      const MPAdate = mpaInjectDate.value ? new Date(mpaInjectDate.value.year, mpaInjectDate.value.month - 1, mpaInjectDate.value.day) : new Date()

      if (!mpaInjectDate || !visit) {
        mpaInjectDate.setErrors(null);
      }

      if (mpaInjectDate.errors && !mpaInjectDate.errors.validMPA) {
        mpaInjectDate.setErrors(null);
      }


      if (mpaInjectDate.value != isEmpty && mpaInjectDate.value != null && mpaInjectDate.value != '') {


        if (MPAdate.getTime() > visitdate.getTime()) {
          mpaInjectDate.setErrors({ validMPA: true });
        }

        else {
          mpaInjectDate.setErrors(null);
        }
      }
      else {
        mpaInjectDate.setErrors(null);

      }

    }

  }



  //###########################//Valid Death Date//##################//



  validDeathDate(lastVisitDate: any, dDate: any , dateRegis : any , visitDate : any) {

    return (formGroup: FormGroup) => {
      const lastdate = formGroup.controls[lastVisitDate];
      const deathNgbdate = formGroup.controls[dDate];
      const regisdate =  formGroup.controls[dateRegis];
      const visit =  formGroup.controls[visitDate];
      if (deathNgbdate.value === '' || deathNgbdate.value === null) {
   //     deathNgbdate.setErrors(null);
   return;
      }
      else {
        const deathdate = new Date(deathNgbdate.value.year, deathNgbdate.value.month - 1, deathNgbdate.value.day);
       // const lastVDate: Date = lastdate.value?  new Date(lastdate.value) :  new Date(regisdate.value)
       const lastVDate: Date =  new Date(lastdate.value) 
       const rDate: Date =  new Date(regisdate.value) 
       const visitdate = visit.value ? new Date(visit.value.year, visit.value.month - 1, visit.value.day) : new Date()


        console.log("Death date" + deathdate + "-----" + "Last Visit Date" + lastVDate);

        if (!lastdate || !deathNgbdate) {
          return null;
        }


        if (deathNgbdate.errors && !deathNgbdate.errors.validDeathFlag) {
          return null;
        }

        if (deathNgbdate.errors && !deathNgbdate.errors.validDeathVisit) {
          return null;
        }


        if( (((lastVDate.getTime()-deathdate.getTime())/ (1000 * 60 * 60 * 24)) >=1) || (((rDate.getTime()-deathdate.getTime())/ (1000 * 60 * 60 * 24)) >=1))
{
     //   if (deathdate.getTime() < lastVDate.getTime() || deathdate.getTime() < rDate.getTime()) {
          deathNgbdate.setErrors({ validDeathFlag: true });
        }

        else if (deathdate.getTime() > visitdate.getTime()) {
          deathNgbdate.setErrors({ validDeathVisit: true });
        }


        else {
          deathNgbdate.setErrors({ validDeathFlag: false });
          deathNgbdate.setErrors({ validDeathVisit: false });
          deathNgbdate.setErrors(null);
        }


      }
    }
  }


  validateBp(systolicBp: any, distolicBp: any) {
    return (formGroup: FormGroup) => {
      const bpSystolic = formGroup.controls[systolicBp];
      const bpDistolic = formGroup.controls[distolicBp];

    //  console.log((bpSystolic.value || bpDistolic.value))


      if (!bpSystolic || !bpDistolic) {
      //  bpDistolic.setErrors(null);
      return
      }

      if (bpSystolic.errors && !bpDistolic.errors.validBp) {
     //   bpDistolic.setErrors(null);
     return
      }
    if (bpDistolic.errors && !bpDistolic.errors.validBp) {
     //   bpDistolic.setErrors(null);
        return
      }

    
     
      if (bpSystolic.value != '' && bpSystolic.value != null && bpDistolic.value != '' && bpDistolic.value != null) {
        if (Number(bpSystolic.value) < Number(bpDistolic.value)) {
          bpDistolic.setErrors({ validBp: true });

        } else {
          bpDistolic.setErrors(null);
        }

      }
      else {
       bpDistolic.setErrors(null);
  }
    }

  }

  

  get mfg() {

    return this.ectForm.controls;
  }


  getControls() {
    return (this.ectForm.get('tEctMethod') as FormArray).controls;
  }


  getmethodControls() {
   // const outerArray: FormArray = this.ectForm.controls.tEctMethod as FormArray;
  //  const innerFormGroup: FormGroup = outerArray.controls[0] as FormGroup;
  const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup
    return innerFormGroup.controls;
  }

  
  /*
  addItem(): void {
    this.methodArray = this.ectForm.get('tEctMethod') as FormArray;
    this.methodArray.push(this.createMethodArray());
  }
*/


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



  getHealthFacility() {
    this.backendApiService.getHealthFacility().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.healthFac = response;
      console.log(response);
    })
  }



checkEctInsertUpdate(_registrationId: Number,_caseNoParam : Number ,_visitDateParam : String  ) 
{

 
  this.backendApiService.getEctVisitdetails(_registrationId, _caseNoParam, _visitDateParam).subscribe((res: Response) => {
  let response = JSON.parse(JSON.stringify(res));

 console.log("Data At Ect Edit If Exists")
  console.log(response)
  this.responseLength= response.length;  
  console.log(response.length)
  
  
  },
  error => {
    console.log(error);
    this.responseLength=0;
  }
  )
 

}



getGriddetails(registrationId: number)
{
  this.backendApiService.getECTbyRegNo(registrationId).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
/*      this.ngzone.run(()=>{
      this.ectmodel = response;
      console.log(this.ectmodel);
    }*/
         
 //   this.ectArray=response;
   this.ectGridArray=response;

    console.log(response);



  }
  )


  return ;

}
  




  getectdetails(registrationId: number) {
  

    let maxVisitId: number = 0;
    //let maxDate : Date = new Date('1990-10-03');
    let maxdate: String;
    //let lastVisitdate: Array<Date>;
    this.backendApiService.getECTbyRegNo(registrationId).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
    this.ectmodel = response;      
      this.ectArray=response;
        this.ectGridArray=response;

      console.log(response);
      console.log("ASHUTOSH SHARMA" + "     " + response.length)

      if (response.length != 0) {
        for (let i of response) {
          if (i.visitNo > maxVisitId) {
            maxVisitId = i.visitNo;
            maxdate = this.datepipe.transform(i.visitDate, 'yyyy-MM-dd');
            // maxdate =i.visitDate;
            this.lastLmpDate = i.ecLmpDate;
            this.pragnantStatus = i.pregnant;
            this.ecDeathStatus = i.ecDeath;
            this.pragnantTest = i.pregnantTest;

            console.log("Pragnant Status---" + this.pragnantStatus + " ---Death Status --" + this.ecDeathStatus);
            if (this.pragnantStatus === "Yes" && this.ecDeathStatus==='No' && this.pragnantTest===("Positive" || "Not Done")) {
              this.continueFlag = true;
            }
            else
            {
              this.continueFlag = false;
            }


          }
        }
      }
     /*  else if (response.length == 0)
     {
        maxdate = this.ectForm.get('dateRegis').value;
       }
    */

      console.log("LastVisitDate-----------" + maxdate);

      this.ectForm.controls['lastVisitDate'].setValue(maxdate);
      this.ectForm.controls['visitNo'].setValue(maxVisitId + 1);
    
      
    })


  }


  getecdetails(registrationId: number) {
     this.backendApiService.getECbyRegNo(registrationId).subscribe((res: Response) => {
     let response = JSON.parse(JSON.stringify(res))[0];
     this.ecmodel=response
     this.bindformEC(this.ecmodel );   
  
  console.log(response);
      //console.log(this.ecmodel.registrationNo)
      //   window.alert(response) ;

    })
  }

  getContraMethods() {
    this.backendApiService.getMethods().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.Method = response;
      console.log(this.Method)
    })
  }



  bindformEC(ecmodel: ECModel) {
    let womenFirstName : String = ecmodel.nameWife? ecmodel.nameWife : ""
    let womenMiddleName : String =ecmodel.middleNameWife?  ecmodel.middleNameWife : ""
    let womenLastName : String = ecmodel.lastNameWife ?  ecmodel.lastNameWife  : ""
    let registrationDate : Date = new Date(ecmodel.dateRegis)
    let husbandFirstName : String = ecmodel.nameHusband? ecmodel.nameHusband: ""
    let husbandMiddleName : String = ecmodel.middleNameHusband ? ecmodel.middleNameHusband: ""
    let husbandLastName : String =ecmodel.lastNameHusband? ecmodel.lastNameHusband : ""
    const wifeName = womenFirstName+" "+womenMiddleName+" "+womenLastName;
    const husbandName= husbandFirstName+" "+husbandMiddleName+" "+husbandLastName;


    this.ectForm.controls['registrationNo'].setValue(ecmodel.registrationNo);
    this.ectForm.controls['nameWife'].setValue(wifeName);
    this.ectForm.controls['nameHusband'].setValue(husbandName);
//this.ectForm.controls['dateRegis'].setValue(this.datepipe.transform(ecmodel.dateRegis, 'dd/MM/yyyy'));
this.ectForm.controls['dateRegis'].setValue(this.datepipe.transform(new Date(ecmodel.dateRegis), 'yyyy-MM-dd'));
//this.ectForm.controls['dateRegis'].setValue( registrationDate);
//this.ectForm.controls['dateRegis'].setValue(ecmodel.dateRegis);
 
    this.ectForm.controls['mobileNo'].setValue(ecmodel.mobileNo);
    this.ectForm.controls['caseNo'].setValue(ecmodel.caseNo);
    this.ectForm.controls['financialYr'].setValue(ecmodel.financialYr);
  //this.ectForm.controls['wifeAge'].setValue(ecmodel.wifeCurrentAge);
    this.ectForm.controls['anmId'].setValue(ecmodel.anmId);
    this.ectForm.controls['ashaId'].setValue(ecmodel.ashaId);
    this.womenDob = ecmodel.pwDob;
  //window.alert("Women DOB"+ ecmodel.pwDob);


  }




  keydownfunction(e) {
    var charCode = e.keyCode;

    var invalidChars = [
      "-",
      "+",
      "e",
    
    ];

    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
   // (charCode <96 && charCode>105 ) || (charCode <48 && charCode>57)
    if ((charCode > 64 && charCode < 91) || (charCode > 106 && charCode < 123) && charCode == 187) {

      e.preventDefault();
    }

  }


  getNewIP() {
    this.http.get<{ ip: string }>('https://jsonip.com')
      .subscribe(data => {
        this.ipAddress = data.ip;

      })

  } 




  findWomenAge() {

    const visitNgbDate = this.ectForm.controls['visitDate'].value
    const visitdate = visitNgbDate ? new Date(visitNgbDate.year, visitNgbDate.month - 1, visitNgbDate.day) : new Date();
    const womenDOB = new Date(this.womenDob);
    const Age = (visitdate.getTime() - womenDOB.getTime()) / ((1000 * 60 * 60 * 24) * 365);
    this.ectForm.controls['wifeAge'].setValue(Number(Age).toFixed());
    
  }
  


  beneficiaryDetails() {

   // this.router.navigate(['home/ecprofile'], { queryParams: { ID: this.rchId } });

   window.localStorage.removeItem("ECT-EC")
   window.localStorage.setItem("ECT-EC",String(this.rchId))
   this.router.navigate(['home/ecprofile'])




  }





  onLAcheck() {

  //  const outerArray: FormArray = this.ectForm.controls.tEctMethod as FormArray;
   // const innerFormGroup: FormGroup = outerArray.controls[0] as FormGroup;
    this.ectForm.controls['ecLmpDate'].setValue(null);
    console.log(this.ectForm.get('LAcheck').value);
    if (this.ectForm.get('LAcheck').value === true) {
  //    this.ectForm.controls['ecLmpDate'].setValue(null);
   
  //    this.ectForm.get('ecLmpDate').setErrors(null);
      this.ectForm.get('ecLmpDate').disable();
      this.ectForm.controls['ecLmpDate'].clearValidators();
      this.ectForm.controls['ecLmpDate'].updateValueAndValidity();
     
      //  this.LmpDate=true;
    }
    else if (this.ectForm.get('LAcheck').value === false) {
  
      this.ectForm.controls['ecLmpDate'].setValidators(Validators.required);
      this.ectForm.controls['ecLmpDate'].updateValueAndValidity();
      this.ectForm.get('ecLmpDate').enable();
      //  this.LmpDate=false;
    }
    else {
      this.ectForm.get('ecLmpDate').enable();
      // this.LmpDate=false;
    }
  }



  bleedingChange()
  {
    const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup
    innerFormGroup.controls['otherChanging'].setValue('');
    innerFormGroup.controls['otherChanging'].clearValidators();
    innerFormGroup.controls['otherChanging'].updateValueAndValidity();
    this.otherChanging=false
    if (innerFormGroup.controls['bleedingChanging'].value === "O")
    {
   this.otherChanging=true
   innerFormGroup.controls['otherChanging'].setValidators([Validators.required,Validators.maxLength(50)])
   innerFormGroup.controls['otherChanging'].updateValueAndValidity();

    }
  
  }







  onBPcheck() {
  //  const outerArray: FormArray = this.ectForm.controls.tEctMethod as FormArray;
   // const innerFormGroup: FormGroup = outerArray.controls[0] as FormGroup;
   const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup


    if (innerFormGroup.controls['bpCheck'].value === true) {
      innerFormGroup.controls['bpDistolic'].setValue('');
      innerFormGroup.controls['bpSystolic'].setValue('');
      innerFormGroup.controls['bpDistolic'].clearValidators();
      innerFormGroup.controls['bpDistolic'].updateValueAndValidity();
      innerFormGroup.controls['bpSystolic'].clearValidators();
      innerFormGroup.controls['bpSystolic'].updateValueAndValidity();
      this.bpWrite = true;

    }
    else if (innerFormGroup.controls['bpCheck'].value === false) {
      innerFormGroup.controls['bpDistolic'].setValidators([Validators.max(300), Validators.min(30)]);
      innerFormGroup.controls['bpDistolic'].updateValueAndValidity();
      innerFormGroup.controls['bpSystolic'].setValidators([Validators.max(400), Validators.min(40)]);
      innerFormGroup.controls['bpSystolic'].updateValueAndValidity();
      this.bpWrite = false;
    }
    else {
      this.bpWrite = false;

    }


  }


  healthFaclityType(typeId: any) {
    this.backendApiService.getHealthFacilityTypeByAshutosh(1, typeId).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.place = response;
      console.log(response);

      if(response.length==0)
      {
        this.placeAvailable=true;

      }
      else
      {this.placeAvailable=false}
   

    })
  }






  onFacilityChange() {

    this.ectForm.controls['placeName'].setValue("");
    this.ectForm.controls['otherPlaceName'].setValue("");
    this.ectForm.controls['placeName'].clearValidators();
    this.ectForm.controls['placeName'].updateValueAndValidity();
    this.ectForm.controls['otherPlaceName'].clearValidators();
    this.ectForm.controls['otherPlaceName'].updateValueAndValidity();
    this.place=[];
    this.typeId = this.ectForm.get('facilityType').value;
    console.log(this.typeId);
    if (this.typeId !== 100) {
      this.placeDropDown = true;
      this.ectForm.controls['placeName'].setValidators(Validators.required);
      this.ectForm.controls['placeName'].updateValueAndValidity();

      this.placeInput = false;

      //this.ectForm.get('placeName').enable();
      this.healthFaclityType(this.typeId);

    }
    else if (this.ectForm.get('facilityType').value === 100) {

      this.placeDropDown = false;
      this.placeInput = true;
      this.ectForm.controls['otherPlaceName'].setValidators([Validators.required, Validators.maxLength(50)]);
      this.ectForm.controls['otherPlaceName'].updateValueAndValidity();
      this.ectForm.controls['placeName'].clearValidators();
      this.ectForm.controls['placeName'].updateValueAndValidity();
      //this.ectForm.get('otherPlaceName').enable();
    }

  }

   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  clearEct() {

    this.ectForm.get('ecLmpDate').setErrors(null);
    this.ectForm.get('visitDate').setErrors(null);
    this.ectForm.get('ecLmpDate').enable();
    this.ectForm.get('pregnant').enable();
    this.ectForm.get('visitDate').enable();
    this.ectForm.get('ecDeath').enable();
    this.ectForm.controls['wifeAge'].setValue('');

    this.preUpdateVisitDate=null;
    this.editFlag=false;
    this.submitted = false;
//debugger;

   this.ectForm.reset();

  this.ectForm.clearValidators();
  this.ectForm.updateValueAndValidity();
  
  //this.ectForm.clearAsyncValidators();
  //this.ectForm.markAsPristine();
  //this.ectForm.markAsUntouched();

   this.createECTform();
   //this.createMethodArray();
   this.usehierarchyHandler(this.hierarchyMobj);
   this.getHealthProviderAnm(this.selectedSubCentre, 2);
   this.getHealthProviderAsha(this.selectedSubCentre, 1);

  this.getHealthFacility();
  this.getContraMethods();
  this.getecdetails(this.rchId);
   
  this.getectdetails(this.rchId);
 
  //this.getGriddetails(this.rchId);


  
    //this.getecdetails(104000000710);
    //this.getectdetails(104000000710); 
   //this.ectForm.get('ecLmpDate').enable();
   //this.ectForm.get('pregnant').enable();
   //this.ectForm.get('visitDate').enable();
   //this.ectForm.get('ecDeath').enable();
    
    this.qtyStrips = false;
    this.qtyPieces = false;
    this.IUCD = false;
    this.InjContraceptive = false;
    this.sterlization = false;
    this.otherMethodInput = false;
    this.ecdeathDetail = false;
    this.contraceptiveMethod = false;
    this.discontinueSwitch = false;
    this.placeDropDown = false;
    this.placeInput = false;

  }


  editEctClear(rchId: any, subcentre: any) {

    this.submitted = false;
    this.ectForm.reset();
    //this.ectForm.clearValidators();
    //this.ectForm.clearAsyncValidators();
    //this.ectForm.updateValueAndValidity();
    //this.ectForm.markAsPristine();
    //this.ectForm.markAsUntouched();
   // this.createECTform();
   // this.createMethodArray();
    this.getecdetails(rchId);
   //this.bindformEC(this.ecmodel );
    //this.getectdetails(rchId);

    this.getHealthFacility();
    this.getContraMethods();
    this.getHealthProviderAnm(subcentre, 2);
    this.getHealthProviderAsha(subcentre, 1);

   
   
    this.qtyStrips = false;
    this.qtyPieces = false;
    this.IUCD = false;
    this.InjContraceptive = false;
    this.sterlization = false;
    this.otherMethodInput = false;
    this.ecdeathDetail = false;
    this.contraceptiveMethod = false;
    this.discontinueSwitch = false;
    this.placeDropDown = false;
    this.placeInput = false;

  }

  //---------------Methods Controls--------------//
  //---------------EC Death---------------------//

  onSelectEcDeath() {
    this.ectForm.controls['deathDate'].setValue('');
    this.ectForm.controls['deathPlace'].setValue("");
    this.ectForm.controls['deathReason'].setValue("");
    //this.ectForm.controls['otherDeathCause'].setValue("");
    this.ectForm.controls['deathDate'].clearValidators();
    this.ectForm.controls['deathDate'].updateValueAndValidity();
    this.ectForm.controls['deathPlace'].clearValidators();
    this.ectForm.controls['deathPlace'].updateValueAndValidity();
    this.ectForm.controls['deathReason'].clearValidators();
    this.ectForm.controls['deathReason'].updateValueAndValidity();


    if (this.ectForm.get('ecDeath').value === 'Y') {
      this.ecdeathDetail = true;

      this.ectForm.controls['deathDate'].setValidators(Validators.required);
      this.ectForm.controls['deathDate'].updateValueAndValidity();
      this.ectForm.controls['deathPlace'].setValidators(Validators.required);
      this.ectForm.controls['deathPlace'].updateValueAndValidity();
      this.ectForm.controls['deathReason'].setValidators(Validators.required);
      this.ectForm.controls['deathReason'].updateValueAndValidity();
    }
    else if (this.ectForm.get('ecDeath').value === 'N') {
      //this.ectForm.controls['deathDate'].setValue("");
      this.ecdeathDetail = false;
    }
    else {
      this.ecdeathDetail = false;
    }

  }


  onSelectPregnant() {
    this.ectForm.controls['pregnantTest'].setValue("");
    //----------------------------//Pragnant Logic //----------------------------//
    if (this.ectForm.get('pregnant').value === 'N') {
    
      this.ectForm.get('pregnantTest').disable();
    }

    else if (this.ectForm.get('pregnant').value === 'Y' || this.ectForm.get('pregnant').value === 'D') 
    {
    
       this.ectForm.get('pregnantTest').enable(); }
    else {
   
      this.ectForm.get('pregnantTest').disable();
    }

  }


  onSelectDiscontinue() {
  //  const outerArray: FormArray = this.ectForm.controls.tEctMethod as FormArray;
   // const innerFormGroup: FormGroup = outerArray.controls[0] as FormGroup;
   const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup

    this.contraceptiveMethod = false;
    innerFormGroup.controls['modernMethod'].setValue("");
    //innerFormGroup.controls['alternativeMethod'].setValue("");
    innerFormGroup.controls['discontinuationReason'].setValue("");
    innerFormGroup.get('modernMethod').disable();


    if (innerFormGroup.get('switchingMonth').value === 'Y') {
      this.contraceptiveMethod = true;

    }
    else if (innerFormGroup.get('switchingMonth').value === 'N') {
      this.contraceptiveMethod = false;
    }
    else {
      this.contraceptiveMethod = false;
    }
    //----------------//Alternative Method//----------------//
    if (innerFormGroup.get('alternativeMethod').value === 'Y') {
      innerFormGroup.get('modernMethod').enable();
    }
    else if (innerFormGroup.get('alternativeMethod').value === 'N') {
      innerFormGroup.controls['modernMethod'].setValue("");
      innerFormGroup.get('modernMethod').disable();
    }
    else {
      innerFormGroup.controls['modernMethod'].setValue("");
      innerFormGroup.get('modernMethod').disable();
    }
    //--------------contraceptiveType-------------//
  }




  onSelectChange() {
  //  const outerArray: FormArray = this.ectForm.controls.tEctMethod as FormArray;
   // const innerFormGroup: FormGroup = outerArray.controls[0] as FormGroup;
   const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup
    this.methodValue = this.ectForm.get('method').value;

    this.qtyStrips = false;
    this.qtyPieces = false;
    this.IUCD = false;
    this.InjContraceptive = false;
    this.sterlization = false;
    this.otherMethodInput = false;
    //this.ecdeathDetail = false;
    this.contraceptiveMethod = false;
    this.discontinueSwitch = false;
    this.otherChanging=false;

    innerFormGroup.controls['quantityStrips'].setValue('');
    innerFormGroup.controls['quantityPieces'].setValue('');
    innerFormGroup.controls["quantityStrips"].clearValidators();
    innerFormGroup.controls["quantityPieces"].clearValidators();
    innerFormGroup.controls["quantityStrips"].updateValueAndValidity();
    innerFormGroup.controls["quantityPieces"].updateValueAndValidity();
    innerFormGroup.controls['otherMethod'].clearValidators();
    innerFormGroup.controls['otherMethod'].updateValueAndValidity();
    innerFormGroup.controls['noOfDose'].clearValidators();
    innerFormGroup.controls['noOfDose'].updateValueAndValidity();
    innerFormGroup.controls['weightWomen'].clearValidators();
    innerFormGroup.controls['weightWomen'].updateValueAndValidity();
    innerFormGroup.controls['bpSystolic'].clearValidators();
    innerFormGroup.controls['bpSystolic'].updateValueAndValidity();
    innerFormGroup.controls['bpDistolic'].clearValidators();
    innerFormGroup.controls['bpDistolic'].updateValueAndValidity();
    innerFormGroup.controls['switchingMonth'].clearValidators();
    innerFormGroup.controls['switchingMonth'].updateValueAndValidity();
    //-------------set Intjectable Contraceptive Fields Null--------//
    innerFormGroup.controls['mpainjectionDate'].setValue('');
    innerFormGroup.controls['mpainjectionType'].setValue('');
    innerFormGroup.controls['noOfDose'].setValue('');
    innerFormGroup.controls['weightWomen'].setValue('');
    innerFormGroup.controls['bpDistolic'].setValue('');
    innerFormGroup.controls['bpSystolic'].setValue('');
    innerFormGroup.controls['bpSystolic'].setValue('');
    innerFormGroup.controls['bleedingChanging'].setValue('');
    //-------------set Male/Female Sterilization Fields Null-------//
    innerFormGroup.controls['sterilizationDate'].setValue('');
    innerFormGroup.controls['sterilizationType'].setValue('');
    innerFormGroup.controls['visitFacility'].setValue('');
    innerFormGroup.controls['sterilizationInsurance'].setValue('');
    //-------------set Iucd fields null----//
    innerFormGroup.controls['iucdinsertionDate'].setValue('');
    innerFormGroup.controls['iucdType'].setValue('');
    innerFormGroup.controls['pspvFindings'].setValue('');
    innerFormGroup.controls['followVisit'].setValue('');
    //-------------Any Other Specify ----//
    innerFormGroup.controls['otherMethod'].setValue('');
    //--------------Discontinuation-----//
    innerFormGroup.controls['switchingMonth'].setValue('');
    innerFormGroup.controls['modernMethod'].setValue('');
    innerFormGroup.controls['alternativeMethod'].setValue('');
    innerFormGroup.controls['discontinuationReason'].setValue('');

    innerFormGroup.controls['otherChanging'].setValue('');
    innerFormGroup.controls['otherChanging'].clearValidators();
    innerFormGroup.controls['otherChanging'].updateValueAndValidity();
    

    //---------Method----------//
    if (this.methodValue === "A") {
      this.qtyPieces = true;
      innerFormGroup.controls['quantityPieces'].setValidators([Validators.required, Validators.max(100), Validators.min(0), Validators.pattern('^[0-9]*$')]);
      innerFormGroup.controls["quantityPieces"].updateValueAndValidity();

    }
    else if (this.methodValue === ("B") || this.methodValue === ("G") ||
      this.methodValue === ("J") || this.methodValue === ("K") || this.methodValue === ("L")) {
      this.qtyStrips = true;
      innerFormGroup.controls['quantityStrips'].setValidators([Validators.required, Validators.max(12), Validators.min(0), Validators.pattern('^[0-9]*$')]);
      innerFormGroup.controls["quantityStrips"].updateValueAndValidity();
    }
    else if (this.methodValue === ("D") || this.methodValue === ("C")) {
      this.IUCD = true;

    }
    else if (this.methodValue === ("M")) {
      this.InjContraceptive = true;
      innerFormGroup.controls['noOfDose'].setValidators([Validators.max(100), Validators.min(1), Validators.pattern('^[0-9]*$')])
      innerFormGroup.controls['noOfDose'].updateValueAndValidity();
      innerFormGroup.controls['weightWomen'].setValidators([Validators.max(200), Validators.min(30), Validators.pattern('^[0-9]*$')])
      innerFormGroup.controls['weightWomen'].updateValueAndValidity();
      innerFormGroup.controls['bpSystolic'].setValidators([Validators.max(400), Validators.min(40), Validators.pattern('^[0-9]*$')])
      innerFormGroup.controls['bpSystolic'].updateValueAndValidity();
      innerFormGroup.controls['bpDistolic'].setValidators([Validators.max(300), Validators.min(30), Validators.pattern('^[0-9]*$')])
      innerFormGroup.controls['bpDistolic'].updateValueAndValidity();

    }
    else if (this.methodValue === ("F") || this.methodValue === ("E")) {
      this.sterlization = true;
    }
    else if (this.methodValue === ("I")) {
      
      innerFormGroup.controls['otherMethod'].setValidators([Validators.required, Validators.maxLength(50), Validators.pattern("[A-Za-z]^+$")]);
      innerFormGroup.controls['otherMethod'].updateValueAndValidity();
      this.otherMethodInput = true;

    }

    else if (this.methodValue === ("N")) {

      this.discontinueSwitch = true;
      innerFormGroup.controls['switchingMonth'].setValidators([Validators.required]);
      innerFormGroup.controls['switchingMonth'].updateValueAndValidity();
      this.contraceptiveMethod = false;
    }

    else {
      this.qtyStrips = false;
      this.qtyPieces = false;
      this.IUCD = false;
      this.InjContraceptive = false;
      this.sterlization = false;
      this.otherMethodInput = false;
      this.discontinueSwitch = false;
      this.contraceptiveMethod = false;
    }
    //------------------------//Contraceptive Method//----------------------//


  }


  continueEct() {

    if (this.pragnantStatus === "Yes") {
  //    alert("Pregnant Women page is not currently available")
  window.localStorage.setItem("RCH_ID", String(this.rchId))
  window.localStorage.setItem("caseNo",String(this.ectForm.get('caseNo').value))
  this.router.navigate(['home/pwregistration'])

/*
    if (this.pragnantStatus === "Yes") {
      //alert("Pregnant Women page is not currently available")
	  window.localStorage.setItem("RCH_ID", String(this.rchId))
   // window.localStorage.setItem("caseNo",String(this.ectForm.get('caseNo').value))
    this.router.navigate(['home/pwregistration'])
    }

*/

    }
  }



  //########################EDIT EC TRACKING####################//
  getEditVisit(visitNo: any, visitDate: Date, caseNo: any) {
   // const outerArray: FormArray = this.ectForm.controls.tEctMethod as FormArray;
   // const innerFormGroup: FormGroup = outerArray.controls[0] as FormGroup;
   const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup

    let ectVisistdate: any
    let ectLmpDate: any
    let ectLastLmpDate : any  
    let ectlastVisitDate :any 
    let ectDeathDate: any
    let iucdDate: any
    let mpaDate: any
    let sterilizDate: any
    let ectVisitDetails: Array<any>;
    let maximumVisitNo : Number ;

  
    this.backendApiService.getECTbyRegNo(this.rchId).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
    //this.ectmodel = response;
    this.ectArray=response;
    console.log(response);
    console.log("ASHUTOSH SHARMA" + "------" + response.length)
    console.log(this.ectArray)
    })

//################## Finding the last visitDate and Last Lmp Date ##############//

   maximumVisitNo=this.ectArray.length
  //ectLastVisitDetails= this.ectArray.filter(x=>x.visitNo==2)
  if (visitNo>1)
  {
    const index =   this.ectArray.findIndex(x=>x.visitNo==(visitNo-1)) 
    ectlastVisitDate=this.ectArray[index].visitDate ;
  //  ectLastLmpDate= this.ectArray[index].ecLmpDate;     

  for(let i=visitNo-2; i>=0;i--)
  {

    if(this.ectArray[i].ecLmpDate!=null )
    {
      ectLastLmpDate= this.ectArray[i].ecLmpDate;
      i=0;
     
}}}

else
  {
 //   ectlastVisitDate=this.ectForm.get('dateRegis').value ;
 //  ectLastLmpDate= this.ectArray[0].ecLmpDate;
 ectlastVisitDate="";
 ectLastLmpDate="";
  }
  
  
  this.lastLMPdateMsg=ectLastLmpDate+"-----VisitNo--"+visitNo+"---Maximum VisitNo--"+maximumVisitNo;


//######################## Making Last Visit Editable element ###############//

if(visitNo===maximumVisitNo)
{
this.pragnantEdit=true;
this.ectForm.get('pregnant').enable();
this.ectForm.get('ecDeath').enable();
this.ectForm.get('ecLmpDate').enable();
this.ectForm.get('visitDate').enable();
//this.ectForm.get('LAcheck').enable();
}
else
{
  this.pragnantEdit=false;
  this.ectForm.get('pregnant').disable();
  this.ectForm.get('ecDeath').disable();
  this.ectForm.get('ecLmpDate').disable();
  this.ectForm.get('visitDate').disable();
  //this.ectForm.get('LAcheck').disable();
}





 
  console.log("Ect Visit Date Details"+ ectlastVisitDate + "Last LMP Date"+ectLastLmpDate);
    
      this.backendApiService.getEctVisitdetails(this.rchId, caseNo, visitDate).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      ectVisitDetails = response;
      console.log("EC Tracking Visit Details -------------------Ashutosh Sharma");
      console.log(response)
      console.log(ectVisitDetails.values)
      //  this.clearEct(); 
      this.editEctClear(response[0].registrationNo, response[0].healthSubFacilityCode);



      this.qtyStrips = false;
      this.qtyPieces = false;
      this.IUCD = false;
      this.InjContraceptive = false;
      this.sterlization = false;
      this.otherMethodInput = false;
      //this.ecdeathDetail = false;
      this.contraceptiveMethod = false;
      this.discontinueSwitch = false;
      
      this.ectForm.controls['otherPlaceName'].setValue('');
      this.ectForm.controls['otherPlaceName'].clearValidators();
      this.ectForm.controls['otherPlaceName'].updateValueAndValidity();
      

      innerFormGroup.controls['quantityStrips'].setValue('');
      innerFormGroup.controls['quantityPieces'].setValue('');
      innerFormGroup.controls["quantityStrips"].clearValidators();
      innerFormGroup.controls["quantityPieces"].clearValidators();
      innerFormGroup.controls["quantityStrips"].updateValueAndValidity();
      innerFormGroup.controls["quantityPieces"].updateValueAndValidity();
      innerFormGroup.controls['otherMethod'].clearValidators();
      innerFormGroup.controls['otherMethod'].updateValueAndValidity();
      innerFormGroup.controls['noOfDose'].clearValidators();
      innerFormGroup.controls['noOfDose'].updateValueAndValidity();
      innerFormGroup.controls['weightWomen'].clearValidators();
      innerFormGroup.controls['weightWomen'].updateValueAndValidity();
      innerFormGroup.controls['bpSystolic'].clearValidators();
      innerFormGroup.controls['bpSystolic'].updateValueAndValidity();
      innerFormGroup.controls['bpDistolic'].clearValidators();
      innerFormGroup.controls['bpDistolic'].updateValueAndValidity();
      innerFormGroup.controls['switchingMonth'].clearValidators();
      innerFormGroup.controls['switchingMonth'].updateValueAndValidity();
      //-------------set Intjectable Contraceptive Fields Null--------//
      innerFormGroup.controls['mpainjectionDate'].setValue('');
      innerFormGroup.controls['mpainjectionType'].setValue('');
      innerFormGroup.controls['noOfDose'].setValue('');
      innerFormGroup.controls['weightWomen'].setValue('');
      innerFormGroup.controls['bpDistolic'].setValue('');
      innerFormGroup.controls['bpSystolic'].setValue('');
      innerFormGroup.controls['bpSystolic'].setValue('');
      innerFormGroup.controls['bleedingChanging'].setValue('');
      innerFormGroup.controls['otherChanging'].setValue('');
      //-------------set Male/Female Sterilization Fields Null-------//
      innerFormGroup.controls['sterilizationDate'].setValue('');
      innerFormGroup.controls['sterilizationType'].setValue('');
      innerFormGroup.controls['visitFacility'].setValue('');
      innerFormGroup.controls['sterilizationInsurance'].setValue('');
      //-------------set Iucd fields null----//
      innerFormGroup.controls['iucdinsertionDate'].setValue('');
      innerFormGroup.controls['iucdType'].setValue('');
      innerFormGroup.controls['pspvFindings'].setValue('');
      innerFormGroup.controls['followVisit'].setValue('');
      //-------------Any Other Specify ----//
      innerFormGroup.controls['otherMethod'].setValue('');
      //--------------Discontinuation-----//
      innerFormGroup.controls['switchingMonth'].setValue('');
      innerFormGroup.controls['modernMethod'].setValue('');
      innerFormGroup.controls['alternativeMethod'].setValue('');
      innerFormGroup.controls['discontinuationReason'].setValue('');
    
  

      this.ectForm.controls['deathDate'].setValue('');
      this.ectForm.controls['deathPlace'].setValue("");
      this.ectForm.controls['deathReason'].setValue("");
      //this.ectForm.controls['otherDeathCause'].setValue("");
      this.ectForm.controls['deathDate'].clearValidators();
      this.ectForm.controls['deathDate'].updateValueAndValidity();
      this.ectForm.controls['deathPlace'].clearValidators();
      this.ectForm.controls['deathPlace'].updateValueAndValidity();
      this.ectForm.controls['deathReason'].clearValidators();
      this.ectForm.controls['deathReason'].updateValueAndValidity();
     
      innerFormGroup.controls['otherChanging'].clearValidators();
       innerFormGroup.controls['otherChanging'].updateValueAndValidity();








const noOfDose =response[0].noOfDose
const bpSystolic= response[0].bpSystolic
const bpDistolic=response[0].bpDistolic
const weightWomen= response[0].weightWomen



//const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup
this.ectForm.controls['createdOn'].setValue(response[0].createdOn)
this.ectForm.controls['createdBy'].setValue(response[0].createdBy)
innerFormGroup.controls['createdOn'].setValue(response[0].createdOn)
innerFormGroup.controls['createdBy'].setValue(response[0].createdBy)


//this.ectForm.controls['updatedOn'].setValue(this.currentdate)
//this.ectForm.controls['updatedBy'].setValue(response[0].updatedBy)
//innerFormGroup.controls['updatedOn'].setValue(this.currentdate)
//innerFormGroup.controls['updatedBy'].setValue(this.tokenservice.getUserId()),





      // Get Hierarchy 
      this.ectForm.controls['stateCode'].setValue(response[0].stateCode);
      this.ectForm.controls['districtCode'].setValue(response[0].districtCode);
      this.ectForm.controls['ruralUrban'].setValue(response[0].ruralUrban);
      this.ectForm.controls['healthBlockCode'].setValue(response[0].healthBlockCode);
      this.ectForm.controls['talukaCode'].setValue(response[0].talukaCode);
      this.ectForm.controls['healthFacilityType'].setValue(response[0].healthFacilityType);
      this.ectForm.controls['healthFacilityCode'].setValue(response[0].healthFacilityCode);
      this.ectForm.controls['healthSubFacilityCode'].setValue(response[0].healthSubFacilityCode);
      this.ectForm.controls['villageCode'].setValue(response[0].villageCode);
      this.ectForm.controls['financialYr'].setValue(response[0].financialYr);
      this.ectForm.controls['visitNo'].setValue(response[0].visitNo);
      this.ectForm.controls['registrationNo'].setValue(response[0].registrationNo);
      this.ectForm.controls['anmId'].setValue(response[0].anmId);
      this.ectForm.controls['ashaId'].setValue(response[0].ashaId);
      this.ectForm.controls['caseNo'].setValue(response[0].caseNo);
      this.ectForm.controls['mobileId'].setValue(response[0].mobileId);
      this.ectForm.controls['lastVisitDate'].setValue(this.datepipe.transform(ectlastVisitDate, 'yyyy-MM-dd'));
      this.lastLmpDate=ectLastLmpDate;
   
      console.log("EC Tracking Visist Date---------" + response[0].visitDate)
      ectVisistdate = response[0].visitDate
      this.preUpdateVisitDate= response[0].visitDate;
      ectLmpDate = response[0].ecLmpDate
      ectDeathDate = response[0].deathDate
      iucdDate = response[0].iucdinsertionDate
      mpaDate = response[0].mpainjectionDate
      sterilizDate = response[0].sterilizationDate

      this.ectForm.controls['visitDate'].setValue(
        {
          year: new Date(ectVisistdate).getFullYear(),
          month: new Date(ectVisistdate).getMonth() + 1,
          day: new Date(ectVisistdate).getDate()
        }
      );
      this.findWomenAge()

if (ectLmpDate=="" || ectLmpDate==null)
{
  this.ectForm.controls['LAcheck'].setValue(true);

  this.onLAcheck() 

}

else
{
  
  this.ectForm.controls['ecLmpDate'].setValue(
    {
      year: ectLmpDate ? new Date(ectLmpDate).getFullYear() : '',
      month: ectLmpDate ? new Date(ectLmpDate).getMonth() +1 : '',
      day: ectLmpDate ? new Date(ectLmpDate).getDate() : ''
    }

  );

}
      /*
 switch(ectLmpDate) 
 {
  case ("" || null) :
 this.ectForm.controls['LAcheck'].setValue(true);

 this.onLAcheck() 
/*this.ectForm.controls['ecLmpDate'].setValue(
  {
    year: '',
    month:  '',
    day:  ''
  }

);


  default : 
 
      this.ectForm.controls['ecLmpDate'].setValue(
        {
          year: ectLmpDate ? new Date(ectLmpDate).getFullYear() : '',
          month: ectLmpDate ? new Date(ectLmpDate).getMonth() +1 : '',
          day: ectLmpDate ? new Date(ectLmpDate).getDate() : ''
        }

      );

   }

*/

      this.ectForm.controls['pregnant'].setValue(response[0].pregnant);
      switch (response[0].pregnant) {
        case 'Y':
          this.ectForm.controls['pregnantTest'].setValue(response[0].pregnantTest);
          break;
        case 'N':
          this.ectForm.controls['pregnantTest'].setValue('');
          this.ectForm.controls['pregnantTest'].disable();
          break;
      }
      this.ectForm.controls['pregnantTest'].setValue(response[0].pregnantTest);
      this.ectForm.controls['facilityType'].setValue(response[0].facilityType);

      if(response[0].facilityType===100)
      {
        this.placeInput=true
        this.ectForm.controls['otherPlaceName'].setValue(response[0].otherPlaceName); 
        this.ectForm.controls['otherPlaceName'].setValidators([Validators.required,Validators.maxLength(50)])
        this.ectForm.controls['otherPlaceName'].updateValueAndValidity();
      }
      else
      {
        this.placeDropDown = true;
        this.healthFaclityType(response[0].facilityType);
        this.ectForm.controls['placeName'].setValue(response[0].placeName);
        this.ectForm.controls['placeName'].setValidators(Validators.required)
        this.ectForm.controls['placeName'].updateValueAndValidity();
      }

      switch (response[0].ecDeath) {
        case 'Y':
          this.ecdeathDetail = true;
          this.ectForm.controls['ecDeath'].setValue(response[0].ecDeath);
          this.ectForm.controls['deathDate'].setValue(
            {
              year: ectDeathDate ? new Date(ectDeathDate).getFullYear() : '',
              month: ectDeathDate ? new Date(ectDeathDate).getMonth() + 1 : '',
              day: ectDeathDate ? new Date(ectDeathDate).getDate() : ''
            }
          );
          this.ectForm.controls['deathPlace'].setValue(response[0].deathPlace);
          this.ectForm.controls['deathReason'].setValue(response[0].deathReason);


          this.ectForm.controls['deathDate'].setValidators(Validators.required);
          this.ectForm.controls['deathDate'].updateValueAndValidity();
          this.ectForm.controls['deathPlace'].setValidators(Validators.required);
          this.ectForm.controls['deathPlace'].updateValueAndValidity();
          this.ectForm.controls['deathReason'].setValidators(Validators.required);
          this.ectForm.controls['deathReason'].updateValueAndValidity();

          break;
        case 'N':
          this.ectForm.controls['ecDeath'].setValue(response[0].ecDeath);
          break;
      }
      this.ectForm.controls['method'].setValue(response[0].method);

      switch (response[0].method) {
        case 'A':
          this.qtyPieces = true

          innerFormGroup.controls['quantityPieces'].setValue(response[0].quantityPieces)
          innerFormGroup.controls['quantityPieces'].setValidators([Validators.required, Validators.max(100), Validators.min(0)]);
          innerFormGroup.controls["quantityPieces"].updateValueAndValidity();
    
    
          break;
        case 'B':
        case 'G':
        case 'K':
        case 'J':
        case 'L':
          this.qtyStrips = true
          innerFormGroup.controls['quantityStrips'].setValue(response[0].quantityStrips)
          innerFormGroup.controls['quantityStrips'].setValidators([Validators.required, Validators.max(12), Validators.min(0)]);
          innerFormGroup.controls["quantityStrips"].updateValueAndValidity();
        
          
          break;
        case 'D':
        case 'C':
          this.IUCD = true;
          innerFormGroup.controls['iucdinsertionDate'].setValue(
            {
              year: iucdDate ? new Date(iucdDate).getFullYear() : '',
              month: iucdDate ? new Date(iucdDate).getMonth() + 1 : '',
              day: iucdDate ? new Date(iucdDate).getDate() : ''
            })
          innerFormGroup.controls['iucdType'].setValue(response[0].iucdType)
          innerFormGroup.controls['pspvFindings'].setValue(response[0].ispvFindings)
          innerFormGroup.controls['followVisit'].setValue(response[0].followVisit)
          break;
          case 'M':
          this.InjContraceptive = true;
          //this.ectForm.controls['method'].setValue(response[0].method);
          innerFormGroup.controls['mpainjectionDate'].setValue(

            {
              year: mpaDate ? new Date(mpaDate).getFullYear() : '',
              month: mpaDate ? new Date(mpaDate).getMonth() + 1 : '',
              day: mpaDate ? new Date(mpaDate).getDate() : ''
            })
          innerFormGroup.controls['noOfDose'].setValue(noOfDose>0 ? noOfDose : "" )
          innerFormGroup.controls['mpainjectionType'].setValue(response[0].mpainjectionType)
          innerFormGroup.controls['bpSystolic'].setValue(bpSystolic>0 ? bpSystolic : "")
          innerFormGroup.controls['bpDistolic'].setValue(bpDistolic>0 ? bpDistolic : "")
          innerFormGroup.controls['weightWomen'].setValue(weightWomen>0 ? weightWomen: "")
          innerFormGroup.controls['bleedingChanging'].setValue(response[0].bleedingChanging)

          innerFormGroup.controls['noOfDose'].setValidators([Validators.max(100), Validators.min(1)])
          innerFormGroup.controls['noOfDose'].updateValueAndValidity();
          innerFormGroup.controls['weightWomen'].setValidators([Validators.max(200), Validators.min(30)])
          innerFormGroup.controls['weightWomen'].updateValueAndValidity();
         innerFormGroup.controls['bpSystolic'].setValidators([Validators.max(400), Validators.min(40)])
         innerFormGroup.controls['bpSystolic'].updateValueAndValidity();
          innerFormGroup.controls['bpDistolic'].setValidators([Validators.max(300), Validators.min(30)])
          innerFormGroup.controls['bpDistolic'].updateValueAndValidity();
          if(response[0].bleedingChanging=='O')
          {
            this.otherChanging=true
            innerFormGroup.controls['otherChanging'].setValue(response[0].otherChanging)
            innerFormGroup.controls['otherChanging'].setValidators([Validators.required,Validators.maxLength(50)]);
             innerFormGroup.controls['otherChanging'].updateValueAndValidity();
            
          }


          break;
        case 'F':
        case 'E':
          this.sterlization = true;
          innerFormGroup.controls['sterilizationDate'].setValue(

            {
              year: sterilizDate ? new Date(sterilizDate).getFullYear() : '',
              month: sterilizDate ? new Date(sterilizDate).getMonth() + 1 : '',
              day: sterilizDate ? new Date(sterilizDate).getDate() : ''
            })
          innerFormGroup.controls['sterilizationType'].setValue(response[0].sterilizationType)
          innerFormGroup.controls['visitFacility'].setValue(response[0].visitFacility)
          innerFormGroup.controls['sterilizationInsurance'].setValue(response[0].sterilizationInsurance)
          break;
        case 'I':
          this.otherMethodInput = true;
          innerFormGroup.controls['otherMethod'].setValue(response[0].other)
            innerFormGroup.controls['otherMethod'].setValidators([Validators.required, Validators.maxLength(50), Validators.pattern("[A-Za-z]^+$")]);
            innerFormGroup.controls['otherMethod'].updateValueAndValidity();
          break;
        case 'N':
          this.discontinueSwitch = true;
          innerFormGroup.controls['switchingMonth'].setValue(response[0].switchingMonth)
         innerFormGroup.controls['switchingMonth'].setValidators([Validators.required]);
         innerFormGroup.controls['switchingMonth'].updateValueAndValidity();
          switch (response[0].switchingMonth) {
            case 'Y':
              this.contraceptiveMethod = true;
              innerFormGroup.controls['alternativeMethod'].setValue(response[0].alternativeMethod)
              innerFormGroup.controls['modernMethod'].setValue(response[0].modernMethod)
              innerFormGroup.controls['discontinuationReason'].setValue(response[0].discontinuationReason) 
              break;
          }


          break;
      }



      this.editFlag=true;

    },

      error => {
        console.log(error);

        alert("Problem while getting EC Tracking  Visit Details" + error);

        // this.clearEct();  

      });


  }


  //---------------------setting Value of Visit-----------------//



    submitECTform(ectForm: FormGroup) {

    this.submitted = true;
    console.log("Inside ECT Submit");
 //   const outerArray: FormArray = this.ectForm.controls.tEctMethod as FormArray;
  //  const innerFormGroup: FormGroup = outerArray.controls[0] as FormGroup;
  const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup
    innerFormGroup.controls['visitDate'].setValue(this.ectForm.get('visitDate').value)

    if (this.ectForm.invalid) {
      console.log("Invalid Form Check Validation");
      console.log(this.ectForm.value)

      return;
    }

    this.ectForm.get('pregnant').enable();
    this.ectForm.get('ecDeath').enable();
    this.ectForm.get('ecLmpDate').enable();
    this.ectForm.get('visitDate').enable();



    console.log("Setting value");
    const deathDate = this.ectForm.get('deathDate').value;
    const visitDate = this.ectForm.get('visitDate').value;
    const ecLmpDate  = this.ectForm.get('ecLmpDate').value;
    const iucdDate = innerFormGroup.get('iucdinsertionDate').value;
    const mpaDate = innerFormGroup.get('mpainjectionDate').value;
    const sterDate = innerFormGroup.get('sterilizationDate').value;
    let bpSystolicPatch : Number = Number(innerFormGroup.get('bpSystolic').value)
    let bpDistolicPatch: Number= Number(innerFormGroup.get('bpDistolic').value)
    let weightWomenPatch: Number= Number(innerFormGroup.get('weightWomen').value)
    let noOfDosePatch  : Number = Number(innerFormGroup.get('noOfDose').value)
    let visitNoPatch :  Number=  Number(this.ectForm.get('visitNo').value)
   
 
    console.log("EC LMP DATE BUG CHECK "+this.ectForm.get('ecLmpDate').value);
    

    const deathDatePatch: any = deathDate ?  this.datepipe.transform(new Date(deathDate.year, deathDate.month - 1, deathDate.day), 'yyyy-MM-dd')  : null;
    const visitdatepatch: any = visitDate ? this.datepipe.transform(new Date(visitDate.year, visitDate.month - 1, visitDate.day), 'yyyy-MM-dd') : null;
 //   const preupdatevisitdatepatch : any = this.preUpdateVisitDate ? this.datepipe.transform(this.preUpdateVisitDate, 'yyyy-MM-dd') : "";
    //const ecLmpDatePatch: any = ecLmpDate ? new Date(ecLmpDate.year, ecLmpDate.month - 1, ecLmpDate.day) : null;
    const ecLmpDatePatch: any = ecLmpDate ? this.datepipe.transform(new Date(ecLmpDate.year, ecLmpDate.month - 1, ecLmpDate.day),'yyyy-MM-dd') : null;
   
  //  const iucdinsertionDatePatch: any = iucdDate ? new Date(iucdDate.year, iucdDate.month - 1, iucdDate.day) : null;
  const iucdinsertionDatePatch: any = iucdDate ? this.datepipe.transform(new Date(iucdDate.year, iucdDate.month - 1, iucdDate.day),'yyyy-MM-dd'): null;
 // const iucdinsertionDatePatch: any = iucdDate.year ? iucdDate.year+"-"+iucdDate.month+"-"+iucdDate.day : null;
  
  
  //  const mpainjectionDatePatch: any = mpaDate ? new Date(mpaDate.year, mpaDate.month - 1, mpaDate.day) : null;
  
    const mpainjectionDatePatch: any = mpaDate ? this.datepipe.transform(new Date(mpaDate.year, mpaDate.month - 1, mpaDate.day),'yyyy-MM-dd') : null;
 
  //  const sterilizationDatePatch: any = sterDate ? new Date(sterDate.year, sterDate.month - 1, sterDate.day) : null;


  const sterilizationDatePatch: any = sterDate ?  this.datepipe.transform(new Date(sterDate.year, sterDate.month - 1, sterDate.day),'yyyy-MM-dd') : null;

//this.getNewIP();

    console.log("Patching value");
   
    console.log("LMP DATE MODIFIED ---"+ecLmpDatePatch)
    this.ectForm.patchValue({

      stateCode: this.selectedState,
      districtCode: this.selectedDistrict,
      healthBlockCode: this.selectedHealthBlock,
      healthFacilityCode: this.selectedFacilityCode,
      healthSubFacilityCode: this.selectedSubCentre,
      talukaCode: this.talukacode,
      healthFacilityType: this.selectedFacilityType,
      ruralUrban: "r",
      caseNo: this.ectForm.get('caseNo').value,
      rurUrbHierarchy: "R",
      villageCode: this.selectedVillage,
      financialYear: Number(this.ectForm.get('financialYear').value),
      mobileId: Number(this.ectForm.get('mobileNo').value),
      placeName: Number(this.ectForm.get('placeName').value),
      visitNo: Number(this.ectForm.get('visitNo').value),
      visitDate: visitdatepatch,
      ecLmpDate: ecLmpDatePatch,
      sourceId: 0,
      other: innerFormGroup.get('otherMethod').value,
      mpwId: 0,
      deathDate: deathDatePatch,
      ipAddress: this.ipAddress,
      //this.ipservice.getIPAddress(),

      updatedBy: 0,
     updatedOn: null,
    //  createdBy: this.tokenservice.getUserId(),
    //  createdOn: this.currentdate,
      wardNo: 0,
      tEctMethod: 
        {
          caseNo: this.ectForm.get('caseNo').value,
          registrationNo: this.ectForm.get('registrationNo').value,
          visitDate: visitdatepatch,
     //     createdBy: this.tokenservice.getUserId(),
        updatedBy: 0,
          visitNo:visitNoPatch,
          quantityStrips: Number(innerFormGroup.get('quantityStrips').value),
          quantityPieces: Number(innerFormGroup.get('quantityPieces').value),
          bpSystolic:  bpSystolicPatch>0 ? bpSystolicPatch: null ,
          bpDistolic: bpDistolicPatch>0 ? bpDistolicPatch: null,
          weightWomen:  weightWomenPatch>0 ? weightWomenPatch : null,
          methodId: this.ectForm.get('method').value,
     //     createdOn: this.currentdate,
       updatedOn:null,
          iucdinsertionDate: iucdinsertionDatePatch,
          mpainjectionDate: mpainjectionDatePatch,
          noOfDose:    noOfDosePatch>0 ? noOfDosePatch: null,
          sterilizationDate: sterilizationDatePatch,
        }
    });

   let RchID : any = this.ectForm.get('registrationNo').value;
   let caseNo : any = this.ectForm.get('caseNo').value;
   console.log("ECLMPDATE BUG "+ this.ectForm.get('ecLmpDate').value + "Control Value"+ this.ectForm.controls['ecLmpDate'].value)
  // debugger
   console.log(JSON.stringify(this.ectForm.value));
  // this.checkEctInsertUpdate(RchID,caseNo,preupdatevisitdatepatch)



/*
let responseLength :number=0 ;
this.backendApiService.getEctVisitdetails(RchID, caseNo, visitdatepatch).subscribe((res: Response) => {
let response = JSON.parse(JSON.stringify(res));

console.log("Data At Ect Edit If Exists")
console.log(response)
responseLength= response.length;  
console.log(responseLength)

})

*/
//debugger;
 //alert(RchID+"        "+responseLength)

  // if (this.responseLength !=0)
 
  if( this.editFlag==true)
   {
    console.log("Inside Ect Edit Function")
    const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup
    this.ectForm.controls['updatedOn'].setValue(this.currentdate)
    this.ectForm.controls['updatedBy'].setValue(this.tokenservice.getUserId())
    innerFormGroup.controls['updatedOn'].setValue(this.currentdate)
    innerFormGroup.controls['updatedBy'].setValue(this.tokenservice.getUserId()),

    this.backendApiService.editEctVisitDetails(RchID ,caseNo,visitNoPatch,ectForm.value).subscribe((res: Response) => {
    let editResponse = JSON.parse(JSON.stringify(res));
    console.log("Response When EC Tracking Edited ---" + editResponse.title);
   // alert("EC Tracking Record Edited Successsfully")
    alert(editResponse.title);
    this.clearEct();
 //   document.getElementById("visitIcon");
// document.getElementById("visitIcon").click();
    },
    error => {
      console.log(error);

      alert("Problem with Ec Tracking Edited Please contact Administrator " + error);

      this.clearEct();

    })
   }
 //  else if (this.responseLength==0)
 else if ( this.editFlag==false)
   {
    console.log("Inside Ect save Function")


    const innerFormGroup: FormGroup = this.ectForm.controls.tEctMethod as FormGroup
    this.ectForm.controls['createdOn'].setValue(this.currentdate)
    this.ectForm.controls['createdBy'].setValue(this.tokenservice.getUserId())
    innerFormGroup.controls['createdOn'].setValue(this.currentdate)
    innerFormGroup.controls['createdBy'].setValue(this.tokenservice.getUserId()),

    this.backendApiService.postEctdetails(ectForm.value).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
    console.log("Response When EC Tracking Posted ---" + response);
    alert(response.title)
  
    this.clearEct();
  //  document.getElementById("visitIcon").click();
 //   document.getElementById("anmId").onchange;
  
 //  d.toggle()
 /* this.ectForm.controls['LAcheck'].setValue(true);

  this.onLAcheck();
  this.ectForm.controls['LAcheck'].setValue(false);
 */
 
  //  alert("Next Visit Will be done after 28 Days")

    },
      error => {
      console.log(error);
      alert("Problem with Ec Tracking Save Please contact Administrator " + error);
      this.clearEct();

      })
    }

//    this.clearEct();

  }


  changeUrban() {
    console.log("inside rural change")
    this.div2 = true;
    this.div1 = false;

  }

  changeRural() {
    console.log("inside rural change")
    this.div2 = false;
    this.div1 = true;

  }
}
