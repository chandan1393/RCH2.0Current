import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BackendAPIService } from '../service/backend-api.service';
import { HierarchyModel } from '../../Core/Model/hierarchyModel'
import { HierarchyComponent } from '../hierarchy/hierarchy.component'
import { TokenStorageService } from 'src/app/Core/service/token/tokenstoreage.service';
import { DatePipe } from '@angular/common';
import { ANCModel } from '../../Core/Model/ANC-Model'
import { ActivatedRoute, Router } from '@angular/router';
import { PGModel } from 'src/app/Core/Model/PG-Model';
import { IfStmt } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';


@Component({
  selector: 'app-motheranc',
  templateUrl: './motheranc.component.html',
  styleUrls: ['./motheranc.component.css']
})
export class MotherancComponent implements OnInit {

  motherancForm: FormGroup;
  ANCModel = new ANCModel();
  parentState; parentDistrict; parentTaluka; parentBlock; parentFacility; parentSubcenter; parentVillage; parentFacilityType;
  parentStateName; parentDistrictName; parentTalukaName; parentBlockName; parentFacilityName; parentSubcenterName; parentVillageName;

  ServiceState; ServiceDistrict; ServiceTaluka; ServiceBlock; ServiceFacility; ServiceSubcenter; ServiceVillage; ServiceFacilityType;
  ServiceStateName; ServiceDistrictName; ServiceTalukaName; ServiceBlockName; ServiceFacilityName; ServiceSubcenterName; ServiceVillageName;
 
  hierarchyMsg: boolean = false; hmsg: string = ''; fill_page = true;  h: boolean = false;
  rchId: number; gen_rchid;
  
  ANCGridArray: Array<any>;
  healthProviderANM: Array<any>;
  healthProviderASHA: Array<any>;
  FacilityType: Array<any>; DeathFacilityType: Array<any>; HighRiskFacilityType: Array<any>;
  healthFacility: Array<any>; healthFacility_HighRisk: Array<any>; healthFacility_Death: Array<any>;
  MMethodUsed: Array<any>;
  AbortionTypeArray: Array<any>;
  AbortionInducedTypeArray: Array<any>;

  MTtArray: Array<any>;
  MFoetalMovementsArray: Array<any>;
  MSymptomshighriskArray: Array<any>;
  MDeathcauseArray: Array<any>;

  hierarchyMobj = new HierarchyModel();
  selectedVillage;
  selectedSubCentre;
  selectedFacilityCode;
  selectedFacilityType;
  selectedHealthBlock;
  selectedDistrict;
  selectedState;
  selectedTaluka;
  selectedRuralUreban;
  selectedWard;

  RuralUrban: string; talukacode: string; wardcode: number

  Show_anc: boolean = true; Show_HighRish: boolean = true; Show_PCM: boolean = true; Show_AbortionDetails: boolean = false;
  Show_DeathDetails: boolean = false; btncontinue: boolean = false; Show_DeathCause: boolean = false; Show_AbortionType: boolean = false;
  Show_FacilityList: boolean = false; show_Facility_textbox: boolean = false; Show_UrineTestdiv: boolean = false; Show_BloodTestdiv: boolean = false;
  Show_DeathFacilityList: boolean = false; show_DeathFacility_textbox: boolean = false; Show_OGTT2: boolean = false;Show_TTDatediv: boolean = false
  Show_referralFacilityList: boolean = false; show_referralFacility_textbox: boolean = false; Show_UltrasoundDetails: boolean = false;
  facilityExists: boolean = false; DeathfacilityExists: boolean = false; HighRiskfacilityExists: boolean = false; Show_HighRiskDetails: boolean = false;

  Anc_1_start_date: Date; Anc_1_end_date: Date; Anc_2_start_date: any; Anc_2_end_date: any; Anc_3_start_date: any; Anc_3_end_date: any; Anc_4_start_date: any; Anc_4_end_date: any;
  bsLMPDate; bsdate: Date; caseid;
  minDate; minDate_Abortion;
  maxDate; maxDate_Abortion;
  ipAddress: string
  selectedFinencialYear;
  TT_Grid; TTDate_Grid;

  constructor(private fb: FormBuilder, private backendApiService: BackendAPIService,
    private tokenservice: TokenStorageService, private route: ActivatedRoute, public router: Router, private http: HttpClient) { }


  submitted = false;

  MMethodsPpmcPpcArray: Array<any>; selectedPAC = []; showOtherPAC: boolean = false;
  settingsPAC = {
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: "multidropdown",
    enableCheckAll: false,
    clearAll: false,
    autoUnselect: true,
    limitSelection: 100,
  };



  highriskList: Array<any> = []; selectedhighrisk = []; showhighriskOther: boolean = false;

  settingshighrisk = {
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: "multidropdown",
    enableCheckAll: false,
    clearAll: false,
    autoUnselect: true,
    limitSelection: 100,
  };

  ngOnInit(): void {
    this.createForm();
    /*  this.motherancForm = this.fb.group({
      healthproviderName: ['', [Validators.required]],
      RCHID: (''),
      PWname: (''),         
      
              }
      
      ); */
    this.fetchHealthProviderOnSubcentreAndVillage();
    //this.getpgdetails(104000147743, 1);
    //this.getANCdetails(104000147743, 1);
    this.getFacilityType(); this.getDeathFacilityType(); this.getHighRiskFacilityType();
    this.GetAbortionType();
    this.GetAbortionInducedType();
    this.GetMMethodUsed();
    this.GetMMethodsPpmcPpc();
    this.GetMTt();
    this.GetMFoetalMovements();
    //  this.GetMSymptomshighrisk();
    this.GetMDeathcause();

    this.gethighriskList();
  }


  gethighriskList(): void {
    this.backendApiService.GetMSymptomshighrisk().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      //console.log(response);
      //this.highriskList = response;
      let count = 0;
      for (var val of response) {

        this.highriskList[count] = { id: val.id, itemName: val.name };
        count++;
      }

    })
  }

  GetMMethodsPpmcPpc(): void {
    this.backendApiService.GetMMethodsPpmcPpc().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.MMethodsPpmcPpcArray = response;
      /*  let count = 0;
      for (var val of response) {
        this.MMethodsPpmcPpcArray[count] = { id: val.method, itemName: val.name };
        count++;
      } */
    })
  }
  ///////////////////PAC event here\\\\\\\\\\\
  onItemSelectPAC(item: any) {
    debugger
    // alert(item.id);
    console.log(item.target.value);
    // console.log(this.selectedPAC);
    if (item.target.value == 'I') {

      this.showOtherPAC = true;

      this.motherancForm.get('otherPAC').setValidators(Validators.required);
      this.motherancForm.get('otherPAC').updateValueAndValidity();



    }
    else if (item.target.value == 'H') {
      this.motherancForm.get('otherPAC').setValidators([]); // or clearValidators()
      this.motherancForm.get('otherPAC').updateValueAndValidity();
      this.showOtherPAC = false;
      /* this.selectedPAC = [{ "id": "H", "itemName": "None" }];
  
  
      this.settingsPAC = {
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class",
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 1,
      }; */

    }


  }

  OnItemDeSelectPAC(item: any) {
    console.log(item);
    console.log(this.selectedPAC);

    if (item.id == "I") {
      this.motherancForm.get('otherPAC').setValidators([]); // or clearValidators()
      this.motherancForm.get('otherPAC').updateValueAndValidity();
      this.showOtherPAC = false;
      this.settingsPAC = {
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class",
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
      };

    }
    else if (item.id == 'H') {
      this.settingsPAC = {
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class",
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
      };

    }


  }

  ///// past illness event start here ///////
  onItemSelecthighrisk(item: any) {
debugger
    // alert(item.id);
    console.log(item);
    console.log(this.selectedhighrisk);
    if (item.id == 'Z') {

      this.showhighriskOther = true;

      this.motherancForm.get('highriskOther').setValidators(Validators.required);
      this.motherancForm.get('highriskOther').updateValueAndValidity();



    }
    else if (item.id == 'Y') {
      this.motherancForm.get('highriskOther').setValidators([]); // or clearValidators()
      this.motherancForm.get('highriskOther').updateValueAndValidity();
      this.showhighriskOther = false;
      this.selectedhighrisk = [{ "id": "Y", "itemName": "None" }];


      this.settingshighrisk = {
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class",
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 1,
      };

    }


  }

  OnItemDeSelecthighrisk(item: any) {
    console.log(item);
    console.log(this.selectedhighrisk);

    if (item.id == "Z") {
      this.motherancForm.get('highriskOther').setValidators([]); // or clearValidators()
      this.motherancForm.get('highriskOther').updateValueAndValidity();
      this.showhighriskOther = false;
      this.settingshighrisk = {
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class",
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
      };

    }
    else if (item.id == 'Y') {
      this.settingshighrisk = {
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class",
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
      };

    }


  }

  ///////////// past illness event end here ////////////



  //**********************Hierarchy Implemented************************************************************* */

  usehierarchyHandler(hierarchyMobj: HierarchyModel) {
    this.hierarchyMobj = hierarchyMobj;
    this.selectedVillage = this.hierarchyMobj.villageid
    this.selectedSubCentre = this.hierarchyMobj.subfacilityid
    this.selectedFacilityCode = this.hierarchyMobj.facilityid
    this.selectedFacilityType = this.hierarchyMobj.facilitytypeid
    this.selectedHealthBlock = this.hierarchyMobj.blockid
    this.selectedDistrict = this.hierarchyMobj.districtid
    this.selectedState = this.hierarchyMobj.stateid
    this.selectedRuralUreban = this.hierarchyMobj.RuralUrban
    this.selectedTaluka = this.hierarchyMobj.talukacode
    this.selectedWard = this.hierarchyMobj.ward

    console.log("state : " + this.selectedState + " District : " + this.selectedDistrict + " Block : " + this.selectedHealthBlock + " Facility Type : " + this.selectedFacilityType + " Facility : " + this.selectedFacilityCode + " sub facility : " + this.selectedSubCentre + " village : " + this.selectedVillage)

    this.hierarchyMsg = false;
    this.hmsg = '';
    if (this.selectedState == undefined || this.selectedDistrict == undefined || this.selectedHealthBlock == undefined || this.selectedFacilityType == undefined || this.selectedFacilityCode == undefined || this.selectedSubCentre == undefined || this.selectedVillage == undefined) {
      this.hierarchyMsg = true;
      if (Number(window.localStorage.getItem("HomeSearch")) > 0) {
        this.hmsg = ('To view beneficiary data kindly set location hierarchy');
      }
      else {
        this.hmsg = ('Select Hierarchy');
      }
      this.fill_page = true
      return;
    }
    debugger
    if (this.selectedSubCentre != undefined && this.selectedVillage != undefined) {
      this.h = true;
      this.fill_page = false
    }
    if (this.h === true) {
      this.FillProviderandANCdeatils();
      this.fill_page = false
    }

  }

  FillProviderandANCdeatils() {
    if (this.selectedVillage != undefined) {
      debugger
      if (this.motherancForm.controls['healthproviderName'].value > 0) {
        console.log('already anm available')
      }
      else {
        if (this.selectedSubCentre != undefined) {
          this.fetchHealthProviderOnSubcentreAndVillage()
        }
      }
      debugger
      if (Number(window.localStorage.getItem("HomeSearch")) > 0) {

        let RCHID: string = window.localStorage.getItem("HomeSearch")
        this.rchId = Number(window.localStorage.getItem("HomeSearch"))

        if (RCHID != "" && RCHID != null) {
          this.fill_page = false
          this.getpgdetails(this.rchId, 1);
          this.getANCdetails(this.rchId,1);
        }
      } else
      if (Number(window.localStorage.getItem("RCH_ID")) > 0) {
        let RCHID: string = window.localStorage.getItem("RCH_ID")
        this.rchId = Number(window.localStorage.getItem("RCH_ID"))

        if (RCHID != "" && RCHID != null) {
          this.fill_page = false
          
          this.getpgdetails(this.rchId, 1);
          this.getANCdetails(this.rchId, 1);
        }
      }
      else{}
    }
  }

  //******************************************************************************************************** */


  //******************************************************************************************************** */
  createForm() {
    this.motherancForm = this.fb.group({
      RCHID: (''),
      PWname: (''),
      Husbandname: (''),
      DOR: (''),
      PWage: (''),
      mobilenumber: (''),
      LMP: (''),
      LastANC: (''),
      healthproviderName: ['', [Validators.required]],
      ASHA: ['', [Validators.required]],
      DateANC: ['', [Validators.required]],
      ANCPeriod: (''),
      PMSMA: (''),
      FacilityType: (''),
      FacilityName: (''),
      FacilityPlace: (''),
      PregnancyWeek: (''),
      Abortion: ('0'),
      AbortionType: (''),
      AbortionDate: (''),
      InducedFacilityType: (''),
      MethodUsed: (''),
      PAC: (''),
      otherPAC: (''),
      Weight: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      Midarm: ['', [Validators.required, Validators.min(10), Validators.max(99)]],
      BPSystolic: ['', [Validators.min(40), Validators.max(400)]],
      BPDiastolic: ['', [Validators.min(30), Validators.max(300)]],
      BPNotdone: (true),
      HB: ['', [Validators.min(2.0), Validators.max(18.0)]],
      HBNotdone: (true),
      UrineTest: (''),
      UrineAlbumin: (''),
      UrineSugar: (''),
      BloodTest: (''),
      OGTT1: ['', [Validators.min(30), Validators.max(500)]],
      OGTT2: ['', [Validators.min(30), Validators.max(500)]],
      PostPrandial: ['', [Validators.min(50), Validators.max(1000)]],
      TTDose: (''),
      TTDate: (''),
      FolicTablets: ['', [Validators.min(0), Validators.max(100)]],
      IFATablets: ['', [Validators.min(0), Validators.max(400)]],
      CalVitTablets: ['', [Validators.min(0), Validators.max(360)]],
      AlbendazoleTablets: (''),
      UltrasoundTest: (''),
      UltrasoundWeeks: (''),
      JSSKScheme: (''),
      Birthcompanion: (''),
      FundalHeight: (''),
      FoetalHeartRate: ['', [Validators.min(50), Validators.max(250)]],
      FoetalPosition: (''),
      Foetalmovements: (''),
      highrisksymptom: (''),
      highriskOther: (''),
      highriskDate: (''),
      ReferralFacilityType: (''),
      ReferralFacilityName: (''),
      ReferralFacilityPlace: (''),
      PCM: (''),
      PWILI: ['', [Validators.required]],
      isContactCovid: ['', [Validators.required]],
      COVIDTest: ['', [Validators.required]],
      covidTestResult: ['', [Validators.required]],
      MaternalDeath: ('0'),
      DeathDate: (''),
      DeathWeeks: (''),
      DeathFacilitytype: (''),
      DeathFacilityName: (''),
      DeathFacilityPlace: (''),
      CausebyMDR: (''),
      OtherDeath: ('')



    },
      { validator: [this.validateBp('BPSystolic', 'BPDiastolic')] },


    );


  }

  get f() { return this.motherancForm.controls; }

  
//*********************************************Find invalid Controls******************************************** */
public findInvalidControls() {
  const invalid = [];
  const controls = this.motherancForm.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
  }
  console.log(invalid)
  return invalid;
}
//******************************************return function******************************************************** */

 
  validateBp(BPsystolic: any, BPDiastolic: any) {
    return (formGroup: FormGroup) => {
      const bpSystolic = formGroup.controls[BPsystolic];
      const bpDistolic = formGroup.controls[BPDiastolic];

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
          bpDistolic.setErrors({ validBPDiastolic: true });

        } else {
          bpDistolic.setErrors(null);
        }

      }
      else {
       bpDistolic.setErrors(null);
  }
    }

  }
  //Save or Post ***********************************
  onSubmit(motherancForm) {
    debugger
    //--------------High Risk-----------------

    let modified_HighRisk = ""
    for (var val of this.selectedhighrisk) {
      modified_HighRisk = modified_HighRisk + val.id;


    }
    this.submitted = true;
    alert('yes form submitted');
    this.findInvalidControls()  ;
     if (this.motherancForm.invalid) {
      return;
    } 
    if(this.ANCGridArray != undefined){
      if(this.ValidateANC() != true){
      return;
    }  }

    let data: ANCModel = new ANCModel();
    data.stateCode = this.selectedState
    data.districtCode = this.selectedDistrict
    data.ruralUrban = this.selectedRuralUreban
    data.healthBlockCode = this.selectedHealthBlock
    data.talukaCode = this.selectedTaluka
    data.healthFacilityType= this.selectedFacilityType
    data.healthFacilityCode = this.selectedFacilityCode
    data.healthSubFacilityCode = this.selectedSubCentre
    data.villageCode = this.selectedVillage
    if(this.motherancForm.controls['DateANC'].value !=""){
    data.financialYear = (this.motherancForm.controls['DateANC'].value).year
    data.financialYr= String(this.selectedFinencialYear)}
    else{
      data.financialYear = (this.motherancForm.controls['AbortionDate'].value).year
    data.financialYr= String(this.selectedFinencialYear)
    }
    
    data.registrationNo = Number(this.motherancForm.controls['RCHID'].value)
    // data.ancNo = 1
    data.ancType = Number((this.motherancForm.controls['ANCPeriod'].value).substr(0, 1))
    //nisha
    data.facilityPlaceAncdone = this.motherancForm.controls['FacilityType'].value
    let f_type = this.motherancForm.controls['FacilityType'].value
    if (f_type == '1' || f_type == '2' || f_type == '24' || f_type == '3' || f_type == '5' || f_type == '17' || f_type == '25' || f_type == '6'
      || f_type == '7' || f_type == '8' || f_type == '9' || f_type == '10' || f_type == '11' || f_type == '12' || f_type == '13'
      || f_type == '14' || f_type == '15' || f_type == '16' || f_type == '19' || f_type == '20' || f_type == '18' || f_type == "4") {
      data.facilityLocationIdancdone = Number(this.motherancForm.controls['FacilityName'].value)
      data.facilityLocationAncdone = ""
    }
    else if (f_type == '22' || f_type == '21' || f_type == '26' || f_type == '99' || f_type == "27") {
      if (this.motherancForm.controls['FacilityPlace'].value.Trim() != "") {
        data.facilityLocationAncdone = this.motherancForm.controls['FacilityPlace'].value;
      }
      else
        data.facilityLocationAncdone = "";
      data.facilityLocationIdancdone = 0;
    }
    else {
      data.facilityLocationAncdone = "";
      data.facilityLocationIdancdone = 0;
    }
    data.pregnancyMonth = Number(this.motherancForm.controls['PregnancyWeek'].value)
    data.abortionIfAny = Number(this.motherancForm.controls['Abortion'].value)

    if (this.motherancForm.controls['Abortion'].value == 0) {
      if (this.motherancForm.controls['MaternalDeath'].value == 0) ///////////if Abortion and Death is No 
      {
        if (this.motherancForm.controls['DateANC'].value != "") {
          try {
            data.ancDate = this.parseDate(this.motherancForm.controls['DateANC'].value);
          }
          catch { data.ancDate = new Date(); }
          data.abortionType = 0;
          data.abortionPregWeeks = 0;
          data.inducedIndicateFacility = 0;
          data.abortionDate = null;
          data.abortionMethod = null;
          data.abortionPac = "";
          data.otherAbortionPac = "";

          if (this.motherancForm.controls['Weight'].value != "")
            data.weight = Number(this.motherancForm.controls['Weight'].value)
          else
            data.weight = Number("0.0");
          //data.pmsmaVisit = 0
          data.pmsmaVisit = Number(this.motherancForm.controls['PMSMA'].value);
          if (this.motherancForm.controls['Midarm'].value != "")
            data.midArm = Number(this.motherancForm.controls['Midarm'].value)
          else
            data.midArm = Number("0.0");

          if (this.motherancForm.controls['BPSystolic'].value != "")
            data.bpSystolic = Number(this.motherancForm.controls['BPSystolic'].value)
          else
            data.bpSystolic = 0;

          if (this.motherancForm.controls['BPDiastolic'].value != "")
            data.bpDistolic = Number(this.motherancForm.controls['BPDiastolic'].value)
          else
            data.bpDistolic = 0;

          if (this.motherancForm.controls['HB'].value != "")
            data.hbGm = Number(this.motherancForm.controls['HB'].value)
          else
            data.hbGm = 0;

          data.urineTest = Number(this.motherancForm.controls['UrineTest'].value)

          if (this.motherancForm.controls['UrineTest'].value == "1") {
            data.urineAlbumin = this.motherancForm.controls['UrineAlbumin'].value
            data.urineSugar = this.motherancForm.controls['UrineSugar'].value
          }
          else {
            data.urineAlbumin = null
            data.urineSugar = null
          }
          data.bloodSugarTest = Number(this.motherancForm.controls['BloodTest'].value)

          if (this.motherancForm.controls['BloodTest'].value == "1") {

            if (this.motherancForm.controls['OGTT1'].value != "")
              data.ogtttest1 = Number(this.motherancForm.controls['OGTT1'].value)

            else
              data.ogtttest1 = 0;
            if (this.motherancForm.controls['OGTT2'].value != "")
              data.ogtttest2 = Number(this.motherancForm.controls['OGTT2'].value)
            else
              data.ogtttest2 = 0;//end
            if (this.motherancForm.controls['PostPrandial'].value != "")
              data.bloodSugarPostPrandial = Number(this.motherancForm.controls['PostPrandial'].value)
            else
              data.bloodSugarPostPrandial = 0;
          }
          else {
            data.ogtttest1 = 0;
            data.ogtttest2 = 0;
            data.bloodSugarPostPrandial = 0;
          }


          data.ttCode = Number(this.motherancForm.controls['TTDose'].value)

          if (this.motherancForm.controls['TTDate'].value != "") {
            try {
              data.tt1Date = this.parseDate(this.motherancForm.controls['TTDate'].value)

            }
            catch
            {
              data.tt1Date = null;
              data.tt2Date=null; data.ttbDate=null
            }
          }
          else
            data.tt1Date = null;data.tt2Date=null; data.ttbDate=null

          if (this.motherancForm.controls['FolicTablets'].value != "")
            data.faGiven = Number(this.motherancForm.controls['FolicTablets'].value)

          else
            data.faGiven = 0;
          if (this.motherancForm.controls['IFATablets'].value != "")
            data.ifaGiven = Number(this.motherancForm.controls['IFATablets'].value)
          else
            data.ifaGiven = 0;
          //nisha
          if (this.motherancForm.controls['AlbendazoleTablets'].value != "")

            data.albeGiven = Number(this.motherancForm.controls['AlbendazoleTablets'].value)

          else
            data.albeGiven = 0;
          if (this.motherancForm.controls['CalVitTablets'].value != "")
            data.calVitGiven = Number(this.motherancForm.controls['CalVitTablets'].value)
          else
            data.calVitGiven = 0;

          data.ultraSoundTest = Number(this.motherancForm.controls['UltrasoundTest'].value)

          if (this.motherancForm.controls['UltrasoundTest'].value == "1") {
            if (this.motherancForm.controls['UltrasoundWeeks'].value != "0")
              data.ultraSoundWeek = Number(this.motherancForm.controls['UltrasoundWeeks'].value)
            else
              data.ultraSoundWeek = 0;

            if (this.motherancForm.controls['JSSKScheme'].value != "0")

              data.ultraSoundJssk = Number(this.motherancForm.controls['JSSKScheme'].value)
            else
              data.ultraSoundJssk = 0;
          }
          else {
            data.ultraSoundWeek = 0;
            data.ultraSoundJssk = 0;
          }

          if (this.motherancForm.controls['Birthcompanion'].value != "0")
            data.birthCompanion = Number(this.motherancForm.controls['Birthcompanion'].value)

          else
            data.birthCompanion = 0;

          data.abdomanFh = this.motherancForm.controls['FundalHeight'].value
          data.abdomanFhs = this.motherancForm.controls['FoetalHeartRate'].value
          data.abdomanFp = this.motherancForm.controls['FoetalPosition'].value
          data.foetalMovements = Number(this.motherancForm.controls['Foetalmovements'].value)
          data.symptomsHighRisk = modified_HighRisk.toString()
          data.otherSymptomsHighRisk = this.motherancForm.controls['highriskOther'].value
          data.symptomsHighRiskLength = modified_HighRisk.length

          data.referralDate = this.parseDate(this.motherancForm.controls['highriskDate'].value)
          data.referralFacility = String(this.motherancForm.controls['ReferralFacilityType'].value)
          if (this.motherancForm.controls['ReferralFacilityType'].value == "1" || this.motherancForm.controls['ReferralFacilityType'].value == "2" || this.motherancForm.controls['ReferralFacilityType'].value == "5") {
            data.deliveryLocationId = this.motherancForm.controls['ReferralFacilityName'].value
            data.referralLocation = "";
          }
          else if (this.motherancForm.controls['ReferralFacilityType'].value == "21" || this.motherancForm.controls['ReferralFacilityType'].value == "99") {
            if (this.motherancForm.controls['ReferralFacilityName'].value != "")
              data.referralLocation = this.motherancForm.controls['ReferralFacilityName'].value
            else
              data.referralLocation = "";

            data.deliveryLocationId = 0;
          }
          else {
            data.referralLocation = "";
            data.deliveryLocationId = 0;
          }

          data.maternalDeath = Number(this.motherancForm.controls['MaternalDeath'].value)

          //end
          if (this.motherancForm.controls['MaternalDeath'].value == 1) {
            if (this.motherancForm.controls['DeathDate'].value != "") {
              try {
                data.deathDate = this.parseDate(this.motherancForm.controls['DeathDate'].value)

              }
              catch
              {
                data.deathDate = null;
              }
            }
            else
              data.deathDate = null;

            if (this.motherancForm.controls['CausebyMDR'].value != "") {
              data.deathReason = this.motherancForm.controls['CausebyMDR'].value
              data.otherDeathReason = this.motherancForm.controls['OtherDeath'].value


            }
            else {
              data.deathReason = ""
              data.otherDeathReason = "";

            }
            data.deathReasonLength = 0
            //data.Death_PregnancyWeek=Number(this.motherancForm.controls['DeathWeeks'].value)
          }
          else {
            data.deathDate = null;

            data.deathReason = ""
            data.otherDeathReason = "";

          }
          //data.ppmc=this.motherancForm.controls['PregnancyWeek'].value 
          //data.other=this.motherancForm.controls['PregnancyWeek'].value 

        }
        else //////////////////if abortion no and Death Yes
        {
          data.ancDate = new Date("1990-01-01");
          data.abortionType = 0; data.abortionPregWeeks = 0; data.inducedIndicateFacility = 0;
          data.abortionDate = null
          data.weight = 0; data.abortionMethod = 0; data.abortionPac = ""
          data.otherAbortionPac = ""; data.pmsmaVisit = 0
          data.midArm = 0; data.ogtttest1 = 0; data.ogtttest2 = 0; data.calVitGiven = 0
          data.albeGiven = 0; data.ultraSoundTest = 0; data.ultraSoundWeek = 0; data.ultraSoundJssk = 0
          data.birthCompanion = 0; data.bpDistolic = 0; data.bpSystolic = 0
          data.hbGm = 0; data.urineTest = 0; data.urineAlbumin = null; data.urineSugar = null
          data.bloodSugarTest = 0; data.bloodSugarPostPrandial = 0
          data.ttCode = 0; data.tt1Date = null;
          data.faGiven = 0; data.ifaGiven = 0; data.abdomanFh = ""
          data.abdomanFhs = ""; data.abdomanFp = ""
          data.foetalMovements = 0; data.symptomsHighRisk = "0"
          data.otherSymptomsHighRisk = ""; data.referralDate = null; data.referralFacility = "0"
          data.referralLocation = "";
          data.deathDate = null; data.deathReason = "0"; data.otherDeathReason = ""
          //data.ppmc="0";data.other=""
          data.maternalDeath = Number(this.motherancForm.controls['MaternalDeath'].value)

          //end
          if (this.motherancForm.controls['MaternalDeath'].value == 1) {
            if (this.motherancForm.controls['DeathDate'].value != "") {
              try {
                data.deathDate = this.parseDate(this.motherancForm.controls['DeathDate'].value)

              }
              catch
              {
                data.deathDate = null;
              }
            }
            else
              data.deathDate = null;

            if (this.motherancForm.controls['CausebyMDR'].value != "") {
              data.deathReason = this.motherancForm.controls['CausebyMDR'].value
              data.otherDeathReason = this.motherancForm.controls['OtherDeath'].value


            }
            else {
              data.deathReason = ""
              data.otherDeathReason = "";

            }
            data.deathReasonLength = 0
            //data.Death_PregnancyWeek=Number(this.motherancForm.controls['DeathWeeks'].value)
          }
          else {
            data.deathDate = null;

            data.deathReason = ""
            data.otherDeathReason = "";

          }
        }
      }
    }
    else /////////if abortion is Yes
    {
      data.ancDate = new Date();
      data.abortionType = Number(this.motherancForm.controls['AbortionType'].value)
      if (this.motherancForm.controls['AbortionType'].value != "6")
        data.inducedIndicateFacility = Number(this.motherancForm.controls['InducedFacilityType'].value)
      else
        data.inducedIndicateFacility = 0;
      data.abortionDate = this.parseDate(this.motherancForm.controls['AbortionDate'].value)
      data.abortionMethod = this.motherancForm.controls['MethodUsed'].value
      data.abortionPac = this.motherancForm.controls['PAC'].value
      data.otherAbortionPac = this.motherancForm.controls['otherPAC'].value

      data.weight = 0;
      data.pmsmaVisit = 0
      data.midArm = 0;
      data.ogtttest1 = 0; data.ogtttest2 = 0; data.calVitGiven = 0
      data.albeGiven = 0; data.ultraSoundTest = 0;
      data.ultraSoundWeek = 0; data.ultraSoundJssk = 0
      data.birthCompanion = 0; data.bpDistolic = 0; data.bpSystolic = 0
      data.hbGm = 0; data.urineTest = 0; data.urineAlbumin = null; data.urineSugar = null
      data.bloodSugarTest = 0; data.bloodSugarPostPrandial = 0
      data.ttCode = 0; data.tt1Date = null;
      data.faGiven = 0; data.ifaGiven = 0; data.abdomanFh = ""
      data.abdomanFhs = ""; data.abdomanFp = ""
      data.foetalMovements = 0; data.symptomsHighRisk = "0"
      data.otherSymptomsHighRisk = ""; data.referralDate = null; data.referralFacility = "0"
      data.referralLocation = "";

      data.deathDate = null; data.deathReason = "0"; data.otherDeathReason = "";
      //data.ppmc="0";data.other=""
      data.maternalDeath = Number(this.motherancForm.controls['MaternalDeath'].value)
      if (this.motherancForm.controls['MaternalDeath'].value == 1) {
        if (this.motherancForm.controls['DeathDate'].value != "") {
          try {
            data.deathDate = this.parseDate(this.motherancForm.controls['DeathDate'].value)

          }
          catch
          {
            data.deathDate = null;
          }
        }
        else
          data.deathDate = null;

        if (this.motherancForm.controls['CausebyMDR'].value != "") {
          data.deathReason = this.motherancForm.controls['CausebyMDR'].value
          data.otherDeathReason = this.motherancForm.controls['OtherDeath'].value


        }
        else {
          data.deathReason = ""
          data.otherDeathReason = "";

        }
        data.deathReasonLength = 0
        //data.Death_PregnancyWeek=Number(this.motherancForm.controls['DeathWeeks'].value)
      }
      else {
        data.deathDate = null;

        data.deathReason = ""
        data.otherDeathReason = "";

      }





    }



    data.anmId = Number(this.motherancForm.controls['healthproviderName'].value)
    data.ashaId = Number(this.motherancForm.controls['ASHA'].value)
    data.mpwId = null
    data.caseNo = this.caseid
    data.ipAddress = this.ipAddress
    data.createdBy = this.tokenservice.getUserId();
    data.createdOn = new Date();
    data.sourceId = 0
    //data.mctsIfa=this.motherancForm.controls['PregnancyWeek'].value 
    //data.ifaGivenOld=this.motherancForm.controls['PregnancyWeek'].value 
    data.wardNo = this.selectedWard
    data.rurUrbHierarchy = this.selectedRuralUreban
    data.isIliSymptom = Number(this.motherancForm.controls['PWILI'].value)
    data.isContactCovid = Number(this.motherancForm.controls['isContactCovid'].value)
    data.covidTestDone = Number(this.motherancForm.controls['COVIDTest'].value)
    data.covidTestResult = Number(this.motherancForm.controls['covidTestResult'].value)
    //data.sDistrictCode=this.motherancForm.controls['PregnancyWeek'].value 
    //data.sHealthBlockCode=this.motherancForm.controls['PregnancyWeek'].value 
    //data.sTalukaCode=this.motherancForm.controls['PregnancyWeek'].value 
    //data.sHealthFacilityCode=this.motherancForm.controls['PregnancyWeek'].value 
    //data.sHealthSubFacilityCode=this.motherancForm.controls['PregnancyWeek'].value 




    //data.pmsmaVisit=this.motherancForm.controls['PMSMA'].value 




    console.log(data)
    let v = JSON.stringify(data)
    console.log(v)
    this.postANCData(data);
  }

  //**********************Save End*********** */

  //*******************  Check for Validate ANC*/
  ValidateANC() {
    debugger
  
    if (this.ANCGridArray.length > 0) {
      let i = this.ANCGridArray.length;
   
   //console.log( this.comparetwodates(this.motherancForm.controls['DateANC'].value,this.ANCGridArray[i-1].ancDate))
     
    if(this.ANCGridArray[i-1].maternalDeath ==1){
        alert('You can not insert ANC/Abortion Details after Mother Death.');
        return false;
      }
      else if(this.ANCGridArray[i-1].abortionIfAny ==1 ){
        alert('You can not insert ANC details after Abortion')
        return false}
      else if(( this.comparetwodates(this.motherancForm.controls['DateANC'].value,this.ANCGridArray[i-1].ancDate))< 0){
        alert('ANC Date should be greater than Previous ANC Date')
        return false }
      else if(( this.comparetwodates(this.motherancForm.controls['DateANC'].value,this.ANCGridArray[i-1].ancDate)) < 21 && (this.ANCGridArray[i-1].pmsmaVisit == null || this.ANCGridArray[i-1].pmsmaVisit == 0)  ){
        alert('There should be 21 days gap between two ANCs')
        return false
      }
      else 
      {
// alert('There should be atleast 21 days gap between TT1 & TT2')
//alert('Death Date should be greater than or Equal to Previous ANC Date')
//alert('Death date should be greater than or Equal to Abortion Date')
      }
      return true;
    }
    else {
      return true;
    }


  }
  //******************End */
  parseDate(selectedDate: NgbDate): Date { //stirn
    let dateObject: Date = new Date();
    ////debugger
    if (selectedDate !== null) {
      dateObject.setDate(selectedDate.day);
      dateObject.setFullYear(selectedDate.year);
      dateObject.setMonth(selectedDate.month - 1);

      return dateObject;
    }

    else {
      return new Date();   //current date
    }  //this.dateObject= new Date(selectedDate.year,selectedDate.month,selectedDate.day);




  }



  //------------------IP getting---------------
  getNewIP() {
    this.http.get<{ ip: string }>('https://jsonip.com')
      .subscribe(data => {
        this.ipAddress = data.ip;

      })

  }

  // ASHA & ANM get -------------------------------

  fetchHealthProviderOnSubcentreAndVillage() {
    debugger

    this.getHealthProviderByANMType(30, 2)
    this.getHealthProviderByASHAType(30, 1)


  }
  getHealthProviderByANMType(subcentre: number, typeid: number): void {
    ////debugger
    let response
    this.backendApiService.getHealthProvideratSubcentre(subcentre, typeid).subscribe((res: Response) => {
      response = JSON.parse(JSON.stringify(res));
      console.log(response);
      this.healthProviderANM = response;
      if (this.healthProviderANM.length < 1) {
        this.healthProviderANM = [{ id: 0, name: "Not Available", contact_No: "" }]
      }
    })

  }
  getHealthProviderByASHAType(subcentre: number, typeid: number): void {
    this.backendApiService.getHealthProvideratSubcentre(subcentre, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);
      this.healthProviderASHA = response;
      if (this.healthProviderASHA.length < 1) {
        this.healthProviderASHA = [{ id: 0, name: "Not Available", contact_No: "" }]
      }
    })
  }


  //-------------------------------------Bind ANC Details----------------------------
  getANCdetails(registrationId: number, caseno: number) {
   debugger
    this.backendApiService.GetMotherANC(registrationId, caseno).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      if (response.length > 0) {
        this.btncontinue=true
        
        this.ANCGridArray = response;
        this.gen_rchid = this.ANCGridArray[0].registrationNo
        console.log(this.ANCGridArray.length)
        if (this.ANCGridArray[0].tt1Date != null) {
          this.TT_Grid = 'TT1'
          this.TTDate_Grid = this.ANCGridArray[0].tt1Date
        }
        else if (this.ANCGridArray[0].tt2Date != null) {
          this.TT_Grid = 'TT2'
          this.TTDate_Grid = this.ANCGridArray[0].tt2Date
        }
        else if (this.ANCGridArray[0].ttbDate != null) {
          this.TT_Grid = 'TTB'
          this.TTDate_Grid = this.ANCGridArray[0].ttbDate
        }
        else {
          this.TT_Grid = ''
          this.TTDate_Grid = ''
        }
      }
      else{
        this.btncontinue=false
      }

    })
  }

  // Bind PG details----------------------
  getpgdetails(registrationId: number, caseno: number) {
    // debugger
    this.backendApiService.getBeneficiary(registrationId, caseno).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);

      this.bindformPG(response);




    })
  }
  bindformPG(pg) {
    //debugger
    this.motherancForm.controls['RCHID'].setValue(pg.registrationNo)
    this.motherancForm.controls['PWname'].setValue(pg.beneficiaryNmae)
    this.motherancForm.controls['Husbandname'].setValue(pg.husbandName)
    let dateformat: Date = (pg.lastANCVisitDate).substr(0, 10)
    console.log(dateformat)
    this.motherancForm.controls['DOR'].setValue((pg.ecRegDate).substr(0, 10))
    this.motherancForm.controls['PWage'].setValue(pg.age)
    this.motherancForm.controls['mobilenumber'].setValue(pg.mobileNumber)
    this.motherancForm.controls['LMP'].setValue(pg.lmpDate)
    this.motherancForm.controls['LastANC'].setValue((pg.lastANCVisitDate).substr(0, 10))

    this.caseid = pg.caseNo
    debugger

    //min and max date for ANC & Abortion Calender
    this.bsLMPDate = (this.motherancForm.controls['LMP'].value).substr(0, 4) + '-' + (this.motherancForm.controls['LMP'].value).substr(5, 2) + '-' + (this.motherancForm.controls['LMP'].value).substr(8, 2) + ' 12:00:00';
    let Mindate: Date = new Date(this.bsLMPDate);
    Mindate.setDate(Mindate.getDate() + 35);

    let Vdate = (this.motherancForm.controls['LastANC'].value).substr(0, 4) + '-' + (this.motherancForm.controls['LastANC'].value).substr(5, 2) + '-' + (this.motherancForm.controls['LastANC'].value).substr(8, 2) + ' 12:00:00';
    let setVdate: Date = new Date(Vdate);
    // this.minDate = { year: Mindate.getFullYear(), month : Mindate.getMonth() + 1, day :Mindate.getDate() };  Set after 35 days from  LMP date
    this.minDate = { year: setVdate.getFullYear(), month: setVdate.getMonth() + 1, day: setVdate.getDate() };
    this.maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };



    let Maxdate: Date = new Date(this.bsLMPDate);
    Maxdate.setDate(Maxdate.getDate() + 140);

    this.minDate_Abortion = { year: Mindate.getFullYear(), month: Mindate.getMonth() + 1, day: Mindate.getDate() }
    this.maxDate_Abortion = { year: Maxdate.getFullYear(), month: Maxdate.getMonth() + 1, day: Maxdate.getDate() }

    //********************* */
    this.parentState = pg.stateCode;
    this.parentDistrict = pg.districtCode;
    // parentTaluka=pg.; 
    this.parentBlock = pg.healthBlockCode;
    this.parentFacility = pg.healthFacilityCode;
    this.parentSubcenter = pg.healthSubFacilityCode;
    this.parentVillage = pg.villageCode;
    this.parentFacilityType = pg.healthFacilityType;
    this.parentStateName = pg.stateName;
    this.parentDistrictName = pg.districtName;
    //parentTalukaName; 
    this.parentBlockName = pg.healthBlockName;
    this.parentFacilityName = pg.healthFacilityName;
    this.parentSubcenterName = pg.healthSubFacilityName;
    this.parentVillageName = pg.villageName;

  }
  //--------------------------------------Get Master from API---------------------------
  getFacilityType(): void { // fill ANC Facility type
    this.backendApiService.GetANCDone().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.FacilityType = response;
    })
  }
  getHighRiskFacilityType(): void { // fill referral Facility type
    this.backendApiService.GetANCplace().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.HighRiskFacilityType = response;
    })
  }
  getDeathFacilityType(): void { // fill Death Facility type
    this.backendApiService.GetMDeliveryplace().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response)
      this.DeathFacilityType = response;
    })
  }
  GetAbortionType(): void {
    this.backendApiService.GetAbortionType().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.AbortionTypeArray = response;
      console.log(this.AbortionTypeArray)
    })
  }
  GetAbortionInducedType(): void {
    this.backendApiService.GetAbortionInducedType().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.AbortionInducedTypeArray = response;
    })
  }
  GetMMethodUsed(): void {
    this.backendApiService.GetMMethodUsed().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.MMethodUsed = response;
    })
  }


  GetMTt(): void {
    this.backendApiService.GetMTt().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.MTtArray = response;
    })
  }
  GetMFoetalMovements(): void {
    this.backendApiService.GetMFoetalMovements().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.MFoetalMovementsArray = response;
    })
  }
  /*  GetMSymptomshighrisk(): void {
    this.backendApiService.GetMSymptomshighrisk().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.MSymptomshighriskArray = response;
    })
  } */
  GetMDeathcause(): void {
    this.backendApiService.GetMDeathcause().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.MDeathcauseArray = response;
    })
  }

  //-------------------------------------------
  setshowANCDone() {
    debugger
    let f_type = this.motherancForm.controls['FacilityType'].value
    if (f_type == '1' || f_type == '2' || f_type == '24' || f_type == '3' || f_type == '5' || f_type == '17' || f_type == '25' || f_type == '6'
      || f_type == '7' || f_type == '8' || f_type == '9' || f_type == '10' || f_type == '11' || f_type == '12' || f_type == '13'
      || f_type == '14' || f_type == '15' || f_type == '16' || f_type == '19' || f_type == '20' || f_type == '18' || f_type == "4") {
      this.Show_FacilityList = true;
      this.show_Facility_textbox = false
      this.getHealthPHCtypeblock(this.selectedHealthBlock, f_type, "ANC")

    }
    else if (f_type == '22' || f_type == '21' || f_type == '26' || f_type == '99' || f_type == "27") {
      this.Show_FacilityList = false;
      this.show_Facility_textbox = true
    }
    else {
      this.Show_FacilityList = false;
      this.show_Facility_textbox = false
    }
  }
  showreferralFacilitytype() {
    let f_type = this.motherancForm.controls['ReferralFacilityType'].value
    if (f_type == '1' || f_type == '2' || f_type == '24' || f_type == '3' || f_type == '5' || f_type == '17' || f_type == '25' || f_type == '6'
      || f_type == '7' || f_type == '8' || f_type == '9' || f_type == '10' || f_type == '11' || f_type == '12' || f_type == '13'
      || f_type == '14' || f_type == '15' || f_type == '16' || f_type == '19' || f_type == '20' || f_type == '18' || f_type == "4") {
      this.Show_referralFacilityList = true;
      this.show_referralFacility_textbox = false
      this.getHealthPHCtypeblock(this.selectedHealthBlock, f_type, "HighRisk")

    }
    else if (f_type == '22' || f_type == '21' || f_type == '26' || f_type == '99' || f_type == "27") {
      this.Show_referralFacilityList = false;
      this.show_referralFacility_textbox = true
    }
    else {
      this.Show_referralFacilityList = false;
      this.show_referralFacility_textbox = false
    }
  }
  showDeathFacilitytype() {
    let f_type = this.motherancForm.controls['DeathFacilitytype'].value
    if (f_type == '1' || f_type == '2' || f_type == '24' || f_type == '3' || f_type == '5' || f_type == '17' || f_type == '25' || f_type == '6'
      || f_type == '7' || f_type == '8' || f_type == '9' || f_type == '10' || f_type == '11' || f_type == '12' || f_type == '13'
      || f_type == '14' || f_type == '15' || f_type == '16' || f_type == '19' || f_type == '20' || f_type == '18' || f_type == "4") {
      this.Show_DeathFacilityList = true;
      this.show_DeathFacility_textbox = false
      this.getHealthPHCtypeblock(this.selectedHealthBlock, f_type, "Death")

    }
    else if (f_type == '22' || f_type == '21' || f_type == '26' || f_type == '99' || f_type == "27") {
      this.Show_DeathFacilityList = false;
      this.show_DeathFacility_textbox = true
    }
    else {
      this.Show_DeathFacilityList = false;
      this.show_DeathFacility_textbox = false
    }
  }
  Abortionchange(event) {
    debugger

    if (event.target.value == 1) {
      this.Show_anc = false
      this.Show_HighRish = false
      this.Show_PCM = false
      this.Show_AbortionDetails = true
      this.motherancForm.get('AbortionType').setValidators(Validators.required);
      this.motherancForm.get('AbortionType').updateValueAndValidity();
      this.motherancForm.get('AbortionDate').setValidators(Validators.required);
      this.motherancForm.get('AbortionDate').updateValueAndValidity();
      this.motherancForm.get('PAC').setValidators(Validators.required);
      this.motherancForm.get('PAC').updateValueAndValidity();

      this.motherancForm.get('Midarm').setValidators([]); // or clearValidators()
      this.motherancForm.get('Midarm').updateValueAndValidity();
      this.motherancForm.get('Weight').setValidators([]); // or clearValidators()
      this.motherancForm.get('Weight').updateValueAndValidity();
      this.motherancForm.get('DateANC').setValidators([]); // or clearValidators()
      this.motherancForm.get('DateANC').updateValueAndValidity();

    }
    else {
      this.Show_anc = true
      this.Show_HighRish = true
      this.Show_PCM = true
      this.Show_AbortionDetails = false
      this.Show_AbortionType = false

      this.motherancForm.get('Midarm').setValidators(Validators.required);
      this.motherancForm.get('Midarm').updateValueAndValidity();
      this.motherancForm.get('Weight').setValidators(Validators.required);
      this.motherancForm.get('Weight').updateValueAndValidity();
      this.motherancForm.get('DateANC').setValidators(Validators.required);
      this.motherancForm.get('DateANC').updateValueAndValidity();

      this.motherancForm.get('AbortionType').setValidators([]); // or clearValidators()
      this.motherancForm.get('AbortionType').updateValueAndValidity();
      this.motherancForm.get('AbortionDate').setValidators([]); // or clearValidators()
      this.motherancForm.get('AbortionDate').updateValueAndValidity();
      this.motherancForm.get('PAC').setValidators([]); // or clearValidators()
      this.motherancForm.get('PAC').updateValueAndValidity();
    }
  }
  Deathchange(event) {
    if (event.target.value == 1) {
      this.Show_DeathDetails = true
    }
    else {
      this.Show_DeathDetails = false
    }
  }
  //////Post API Call//////////
  postANCData(data: any): void {
    ////debugger
    console.log("inside post ec data")
    this.backendApiService.postANCData(data).subscribe(res => {
      let response = JSON.parse(JSON.stringify(res))


      console.log(response);
      if (response.status == 409) {

        alert("error")
      }
      else {
        alert("Record saved successfully")
        // this.myForm.controls['villagePopulation'].setValue(this.VillageDetailsYearWise[0].villagePopulation),
        this.ANCModel = response;

        this.btncontinue = true

        this.getANCdetails(this.ANCModel.registrationNo, this.ANCModel.caseNo)

      }
    }, error => {
    })
  }


  calDeathweek(event) {
    debugger

    if (this.motherancForm.controls['DeathDate'].value != '') {

      // Here are the two dates to compare
      var daysDiff = this.comparetwodates(this.motherancForm.controls['DeathDate'].value,this.bsLMPDate)
      var no_of_week = Math.floor(daysDiff / 7);
     
      this.motherancForm.controls['DeathWeeks'].setValue(no_of_week);

    }
  }
  dateDiffInDays(date1, date2) {
    // round to the nearest whole number
    return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
  }
  calWeek() {
debugger
    

    this.bsLMPDate = (this.motherancForm.controls['LMP'].value).substr(0, 4) + '-' + (this.motherancForm.controls['LMP'].value).substr(5, 2) + '-' + (this.motherancForm.controls['LMP'].value).substr(8, 2) + ' 12:00:00';

    if (this.motherancForm.controls['Abortion'].value == 0) {
      if (this.motherancForm.controls['DateANC'].value != '') {

        let yr = String((this.motherancForm.controls['DateANC'].value).year)
        if ((this.motherancForm.controls['DateANC'].value).month > 3) {
          this.selectedFinencialYear = (this.motherancForm.controls['DateANC'].value).year + "-" + (Number(yr.substr(2, 2)) + 1)
        }
        else {
          this.selectedFinencialYear = (Number(yr) - 1) + "-" + Number(yr.substr(2, 2))
        }
       
        // Here are the two dates to compare
       // let ANCDate_modified_validation = this.motherancForm.controls['DateANC'].value.year + '-' + this.motherancForm.controls['DateANC'].value.month + '-' + this.motherancForm.controls['DateANC'].value.day;
      //  var daysDiff = this.dateDiffInDays(new Date(this.bsLMPDate), new Date(ANCDate_modified_validation));
       // var no_of_week = Math.round(daysDiff / 7);
       var daysDiff = this.comparetwodates(this.motherancForm.controls['DateANC'].value,this.bsLMPDate)
       var no_of_week = Math.floor(daysDiff / 7);
        var minANC2 = 189;
        var maxANC2 = 244;

        /*   if ((minANC2 <= days) && (days <= maxANC2))
              document.getElementById('divPPMC').style.display = 'inline';
          else
              document.getElementById('divPPMC').style.display = 'none'; */

        // Make Enabled true/false on txtFundalFH 

        if (no_of_week >= 12) {
          this.motherancForm.controls['FundalHeight'].enable();
          this.motherancForm.controls['FolicTablets'].disable();
          this.motherancForm.controls['IFATablets'].enable();
          //document.getElementById("ContentPlaceHolder1_DoubleMainContent_txtFundalFH").style.backgroundColor = "#ffffff";
        }
        else {
          this.motherancForm.controls['FundalHeight'].disable();
          this.motherancForm.controls['FolicTablets'].enable();
          this.motherancForm.controls['IFATablets'].disable();
          // document.getElementById("ContentPlaceHolder1_DoubleMainContent_txtFundalFH").style.backgroundColor = "#D8D8D8";
        }

        if (no_of_week >= 14) {
          this.motherancForm.controls['CalVitTablets'].enable();
          this.motherancForm.controls['AlbendazoleTablets'].enable();
          //document.getElementById("ContentPlaceHolder1_DoubleMainContent_txtFundalFhs").style.backgroundColor = "#ffffff";
        }
        else {
          this.motherancForm.controls['CalVitTablets'].disable();
          this.motherancForm.controls['AlbendazoleTablets'].disable();
          // document.getElementById("ContentPlaceHolder1_DoubleMainContent_txtFundalFhs").style.backgroundColor = "#D8D8D8";
        }
        if (no_of_week < 18 || no_of_week >=20) {
          this.motherancForm.controls['UltrasoundTest'].setValue(3);
        }
        else{
          this.motherancForm.controls['UltrasoundTest'].setValue("");
        }
        if (no_of_week >= 24) {
          this.motherancForm.controls['FoetalHeartRate'].enable();
          //document.getElementById("ContentPlaceHolder1_DoubleMainContent_txtFundalFhs").style.backgroundColor = "#ffffff";
        }
        else {
          this.motherancForm.controls['FoetalHeartRate'].disable();
          // document.getElementById("ContentPlaceHolder1_DoubleMainContent_txtFundalFhs").style.backgroundColor = "#D8D8D8";
        }

        if (no_of_week >= 32) {
          this.motherancForm.controls['FoetalPosition'].enable();
          // document.getElementById("ContentPlaceHolder1_DoubleMainContent_ddlFundalFP").style.backgroundColor = "#ffffff";
        }
        else {
          this.motherancForm.controls['FoetalPosition'].disable();
          // document.getElementById("ContentPlaceHolder1_DoubleMainContent_ddlFundalFP").style.backgroundColor = "#D8D8D8";
        }

        if (no_of_week >= 18) {
          this.motherancForm.controls['Foetalmovements'].enable();
          // document.getElementById("ContentPlaceHolder1_DoubleMainContent_ddlFundalFP").style.backgroundColor = "#ffffff";
        }
        //document.getElementById("ContentPlaceHolder1_DoubleMainContent_ddlFoetalMovement").style.backgroundColor = "#ffffff";

        this.calANCVisit();
      }
      else {
        this.motherancForm.controls['Foetalmovements'].disable();
        // document.getElementById("ContentPlaceHolder1_DoubleMainContent_ddlFoetalMovement").style.backgroundColor = "#D8D8D8";
      }
      if (no_of_week > 3 && no_of_week < 40) {
        this.motherancForm.controls['PregnancyWeek'].setValue(no_of_week);
      }
      else {
        this.motherancForm.controls['PregnancyWeek'].setValue('');
      }
      //this.setFAIFAtruefalse();
      //nisha
      /*   debugger;
        this.motherancForm.controls['PMSMA'].enable();
        //  var d = document.getElementById('ContentPlaceHolder1_DoubleMainContent_txtAncDate').value.split('-');
        var m = (this.motherancForm.controls['DateANC'].value).day;
        // if (this.motherancForm.controls['PMSMA'].value == "1") {
        if (no_of_week > 12) {

          // document.getElementById('ContentPlaceHolder1_DoubleMainContent_ddlPMSMA').value = "1";
          //document.getElementById('ContentPlaceHolder1_DoubleMainContent_ddlPMSMA').disabled = false;
          if (m == 9) {
            this.motherancForm.controls['PMSMA'].setValue(true);
            this.motherancForm.controls['PMSMA'].disable();
          }
          else if (m == 10 || m == 11) {
            this.motherancForm.controls['PMSMA'].enable();
            this.motherancForm.controls['PMSMA'].setValue(true);
          }
          else {
            this.motherancForm.controls['PMSMA'].disable();
            // alert('ANC visit under PMSMA, it should 9th of month. Unchecked PMSMA visit otherwise change ANC date');
          }

        }
        else {
          this.motherancForm.controls['PMSMA'].setValue(false);
          // document.getElementById('ContentPlaceHolder1_DoubleMainContent_ddlPMSMA').value = "0";
          alert('PMSMA service given after 12 Weeks of Pregnancy');
          // document.getElementById('ContentPlaceHolder1_DoubleMainContent_ddlPMSMA').disabled = true;
          this.motherancForm.controls['PMSMA'].disable();

        } */
      // }

    }
    else {
      if (this.motherancForm.controls['AbortionDate'].value != '') {
        debugger
        let yr = String((this.motherancForm.controls['AbortionDate'].value).year)
        if ((this.motherancForm.controls['AbortionDate'].value).month > 3) {
          this.selectedFinencialYear = (this.motherancForm.controls['AbortionDate'].value).year + "-" + (Number(yr.substr(2, 2)) + 1)
        }
        else {
          this.selectedFinencialYear = (Number(yr) - 1) + "-" + Number(yr.substr(2, 2))
        }

          var daysDiff = this.comparetwodates(this.motherancForm.controls['AbortionDate'].value,this.bsLMPDate)
       var no_of_week = Math.floor(daysDiff / 7);
       this.motherancForm.controls['PregnancyWeek'].setValue(no_of_week);
        this.motherancForm.controls['PregnancyWeek'].disable();
       
        var minANC2 = 189;         var maxANC2 = 244;
       /*  if ((minANC2 <= daysDiff) && (daysDiff <= maxANC2)) { }
         document.getElementById('divPPMC').style.display = 'inline';
        else { }
        document.getElementById('divPPMC').style.display = 'none';
 */    
      
      }


    }

  }
 
  onContinue() {
    debugger
    window.localStorage.setItem("RCH_ID", String(this.gen_rchid))
   
    this.router.navigate(['home/delivery'])
  }

  getHealthPHCtypeblock(block: number, ftype: number, callfacility: string): void {

    this.backendApiService.getHealthPhcbyTypeBlock(block, ftype).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      debugger
      if (response.length > 0) {
        if (callfacility == "ANC") {
          this.healthFacility = response; this.facilityExists = false;
        }
        else if (callfacility == "HighRisk") {
          const newLocal = this;
          newLocal.healthFacility_HighRisk = response; this.HighRiskfacilityExists = false
        }
        else if (callfacility == "Death") {
          this.healthFacility_Death = response; this.DeathfacilityExists = false
        }
      }
      else if (response.length == 0) {
        if (callfacility == "ANC") {
          this.facilityExists = true;
          this.healthFacility = [];
        }
        else if (callfacility == "HighRisk") {
          this.healthFacility_HighRisk = [];
          this.HighRiskfacilityExists = true;
        }
        else if (callfacility == "Death") {
          this.healthFacility_Death = [];
          this.DeathfacilityExists = true;
        }

      }
      else {
        this.facilityExists = false;
        this.DeathfacilityExists = false
        this.HighRiskfacilityExists = false
      }
    })
  }
  onItemSelectDeathCause(event) {
    console.log(event.target.value)
    if (event.target.value == 'Z') {

      this.Show_DeathCause = true;

      this.motherancForm.get('OtherDeath').setValidators(Validators.required);
      this.motherancForm.get('OtherDeath').updateValueAndValidity();



    }
    else {
      this.Show_DeathCause = false
    }

  }
  onItemSelectAbortionType(event) {

    if (event.target.value == 5) {
      this.Show_AbortionType = true
      this.motherancForm.get('InducedFacilityType').setValidators(Validators.required);
      this.motherancForm.get('InducedFacilityType').updateValueAndValidity();
      this.motherancForm.get('MethodUsed').setValidators(Validators.required);
      this.motherancForm.get('MethodUsed').updateValueAndValidity();
    }
    else {
      this.Show_AbortionType = false
      this.motherancForm.get('InducedFacilityType').setValidators([]); // or clearValidators()
      this.motherancForm.get('InducedFacilityType').updateValueAndValidity();
      this.motherancForm.get('MethodUsed').setValidators([]); // or clearValidators()
      this.motherancForm.get('MethodUsed').updateValueAndValidity();
    }
  }
  changePMSMA(event) {
    if (event.target.checked == true) {
      if (this.motherancForm.controls['PregnancyWeek'].value > 12) {

        // document.getElementById('ContentPlaceHolder1_DoubleMainContent_ddlPMSMA').value = "1";
        this.motherancForm.controls['PMSMA'].disable();
        if ((this.motherancForm.controls['DateANC'].value).day == 9 || (this.motherancForm.controls['DateANC'].value).day == 8 || (this.motherancForm.controls['DateANC'].value).day == 10 || (this.motherancForm.controls['DateANC'].value).day == 11)  {
         
        }
        else{
          alert('PMSMA  visit valid dates are from 8th to 11th of the month, To enter any other ANC date Please unchecked PMSMA visit');
        }

      }
      else {
        this.motherancForm.controls['PMSMA'].setValue(false)
        alert('PMSMA service given after 12 Weeks of Pregnancy');
        this.motherancForm.controls['PMSMA'].enable()


      }
    }
    else {
      console.log('PMSMA visit value is false')
    }
  }
  SetUrineTest() {
    if (this.motherancForm.controls['UrineTest'].value == 1) {
      this.Show_UrineTestdiv = true
    }
    else {
      this.Show_UrineTestdiv = false
    }
  }
  SetBloodTest() {
    if (this.motherancForm.controls['BloodTest'].value == 1) {
      this.Show_BloodTestdiv = true
    }
    else {
      this.Show_BloodTestdiv = false
    }
  }
  changeOGTT1Test() {
    if (this.motherancForm.controls['BloodTest'].value == 1) {
      if (this.motherancForm.controls['OGTT1'].value > 0 && this.motherancForm.controls['OGTT1'].value < 140) {
        this.Show_OGTT2 = true
      }
      else {
        this.Show_OGTT2 = false
      }
    }
    else { }
  }
  calANCVisit() {
    debugger
    this.bsLMPDate = (this.motherancForm.controls['LMP'].value).substr(0, 4) + '-' + (this.motherancForm.controls['LMP'].value).substr(5, 2) + '-' + (this.motherancForm.controls['LMP'].value).substr(8, 2) + ' 12:00:00';
    //ANC One Month validation.
    this.Anc_1_start_date = new Date(this.bsLMPDate);
    this.Anc_1_start_date.setDate(this.Anc_1_start_date.getDate() + 30);

    this.Anc_1_end_date = new Date(this.bsLMPDate);
    this.Anc_1_end_date.setDate(this.Anc_1_end_date.getDate() + 91);

    this.Anc_2_start_date = new Date(this.bsLMPDate);
    this.Anc_2_start_date.setDate(this.Anc_2_start_date.getDate() + 92);

    this.Anc_2_end_date = new Date(this.bsLMPDate);
    this.Anc_2_end_date.setDate(this.Anc_2_end_date.getDate() + 189);

    this.Anc_3_start_date = new Date(this.bsLMPDate);
    this.Anc_3_start_date.setDate(this.Anc_3_start_date.getDate() + 190);

    this.Anc_3_end_date = new Date(this.bsLMPDate);
    this.Anc_3_end_date.setDate(this.Anc_3_end_date.getDate() + 245);

    this.Anc_4_start_date = new Date(this.bsLMPDate);
    this.Anc_4_start_date.setDate(this.Anc_4_start_date.getDate() + 246);

    this.Anc_4_end_date = new Date(this.bsLMPDate);
    this.Anc_4_end_date.setDate(this.Anc_4_end_date.getDate() + 280);

    this.bsdate = new Date((this.motherancForm.controls['DateANC'].value).year + '-' + (this.motherancForm.controls['DateANC'].value).month + '-' + (this.motherancForm.controls['DateANC'].value).day + ' 12:00:00');
    if ((new Date(this.bsdate).getTime() >= new Date(this.Anc_1_start_date).getTime()) && (new Date(this.bsdate).getTime() <= new Date(this.Anc_1_end_date).getTime())) {
      this.motherancForm.controls['ANCPeriod'].setValue('1st Visit')
    }
    else if ((new Date(this.bsdate).getTime() >= new Date(this.Anc_2_start_date).getTime()) && (new Date(this.bsdate).getTime() <= new Date(this.Anc_2_end_date).getTime())) {
      this.motherancForm.controls['ANCPeriod'].setValue('2nd Visit')
    }
    else if ((new Date(this.bsdate).getTime() >= new Date(this.Anc_3_start_date).getTime()) && (new Date(this.bsdate).getTime() <= new Date(this.Anc_3_end_date).getTime())) {
      this.motherancForm.controls['ANCPeriod'].setValue('3rd Visit')
    }
    else if ((new Date(this.bsdate).getTime() >= new Date(this.Anc_4_start_date).getTime()) && (new Date(this.bsdate).getTime() <= new Date(this.Anc_4_end_date).getTime())) {
      this.motherancForm.controls['ANCPeriod'].setValue('4th Visit')
    }
    else {
      this.motherancForm.controls['ANCPeriod'].setValue('')
    }
  }
  SetHBNotdone(e) {
    if (e.target.checked == true) {
      this.motherancForm.get('HB').setValidators([]);
      this.motherancForm.get('HB').updateValueAndValidity();
      this.motherancForm.controls['HB'].setValue('')
    }
    else {
      this.motherancForm.get('HB').setValidators(Validators.required);
      this.motherancForm.get('HB').updateValueAndValidity();
    }
  }
  SetBPNotdone(e) {
    if (e.target.checked == true) {
      this.motherancForm.get('BPSystolic').setValidators([]);
      this.motherancForm.get('BPSystolic').updateValueAndValidity();
      this.motherancForm.get('BPDiastolic').setValidators([]);
      this.motherancForm.get('BPDiastolic').updateValueAndValidity();
      this.motherancForm.controls['BPDiastolic'].setValue('')
      this.motherancForm.controls['BPSystolic'].setValue('')
    }
    else {
      this.motherancForm.get('BPSystolic').setValidators(Validators.required);
      this.motherancForm.get('BPSystolic').updateValueAndValidity();
      this.motherancForm.get('BPDiastolic').setValidators(Validators.required);
      this.motherancForm.get('BPDiastolic').updateValueAndValidity();
    }
  }
  SetHighRisk() {
    if (this.motherancForm.controls['BPSystolic'].value >=140 && this.motherancForm.controls['HB'].value != '') {
      this.selectedhighrisk = [{ "id": "A", "itemName": "High BP (Systolic >= 140 and or Diastolic >= 90 mmHg)" },
      { "id": "E", "itemName": "Severe Anaemia (Hb level < 7 gms%)" }];
    }
    else if (this.motherancForm.controls['BPSystolic'].value >=140) {
      this.selectedhighrisk = [{ "id": "A", "itemName": "High BP (Systolic >= 140 and or Diastolic >= 90 mmHg)" }];

    }
    else if (this.motherancForm.controls['HB'].value != '') {
      this.selectedhighrisk = [{ "id": "E", "itemName": "Severe Anaemia (Hb level < 7 gms%)" }];
    }
    /* if(this.motherancForm.controls['BPSystolic'].value >=140){
      this.selectedhighrisk = [{ "id": "A", "itemName": "High BP (Systolic >= 140 and or Diastolic >= 90 mmHg)" }];
    }
    else if(this.motherancForm.controls['BPDiastolic'].value >=90){
      this.selectedhighrisk = [{ "id": "A", "itemName": "High BP (Systolic >= 140 and or Diastolic >= 90 mmHg)" }];
    }
    else if(this.motherancForm.controls['HB'].value >=90){
      this.selectedhighrisk = [{ "id": "E", "itemName": "Severe Anaemia (Hb level < 7 gms%)" }];
    }
    else if((this.motherancForm.controls['OGTT1'].value  >= 140 ) || (this.motherancForm.controls['OGTT2'].value  >= 140 )){
      this.selectedhighrisk = [{ "id": "F", "itemName": "Diabetic" }];
    } */
    else {

    }


  }
  FoetalPositionChange(event) {
    if (event.target.value == 2) {
      this.selectedhighrisk = [{ "id": "M", "itemName": "Abnormal Foetal Presentation / POSITION(Transverse)" }];
    }
  }
  UltrasoundTestChange(event) {
    if (event.target.value == 1) {
      this.Show_UltrasoundDetails = true
      this.motherancForm.get('UltrasoundWeeks').setValidators(Validators.required);
      this.motherancForm.get('UltrasoundWeeks').updateValueAndValidity();
      this.motherancForm.get('JSSKScheme').setValidators(Validators.required);
      this.motherancForm.get('JSSKScheme').updateValueAndValidity();
    }
    else {
      this.Show_UltrasoundDetails = false
      this.motherancForm.get('UltrasoundWeeks').setValidators([]);
      this.motherancForm.get('UltrasoundWeeks').updateValueAndValidity();
      this.motherancForm.get('JSSKScheme').setValidators([]);
      this.motherancForm.get('JSSKScheme').updateValueAndValidity();
    }
  }
  SetTTDose(event){
    if (this.motherancForm.controls['TTDose'].value != "") {
      this.Show_TTDatediv = true
      this.motherancForm.get('TTDate').setValidators(Validators.required);
      this.motherancForm.get('TTDate').updateValueAndValidity();
    }
    else {
      this.Show_TTDatediv = false
      this.motherancForm.get('TTDate').setValidators([]);
      this.motherancForm.get('TTDate').updateValueAndValidity();
    }
    if(event.target.value == 13){
      this.MTtArray.forEach((item, index) => {
        if (item.ttcode === 17) this.MTtArray.splice(index, 1);
      });
    }
    else if(event.target.value == 17){
      this.MTtArray.forEach((item, index) => {
        if (item.ttcode === 13) this.MTtArray.splice(index, 1);
      });
      this.MTtArray.forEach((item, index) => {
        if (item.ttcode === 14) this.MTtArray.splice(index, 1);
      });
    }


   
   
    console.log(this.MTtArray)

  }
  onChangehighrisk(e){
    debugger
    console.log(e.length)
    console.log(e)
    if(e.length >0){
this.Show_HighRiskDetails = true
this.motherancForm.get('highriskDate').setValidators(Validators.required);
this.motherancForm.get('highriskDate').updateValueAndValidity();
    }
    else{
this.Show_HighRiskDetails =false
this.motherancForm.get('highriskDate').setValidators([]);
this.motherancForm.get('highriskDate').updateValueAndValidity();
    }
  }

  comparetwodates(d1,d2){
    debugger
    // Here are the two dates to compare
    let Date_modified_validation = (d1).year + '-' + (d1).month + '-' + (d1).day;
       
    var daysDiff = this.dateDiffInDays(new Date(d2), new Date(Date_modified_validation));
    return daysDiff;
  }

 
}
