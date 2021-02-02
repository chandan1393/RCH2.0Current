import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  Form,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { TokenStorageService } from 'src/app/Core/service/token/tokenstoreage.service';
import { HierarchyModel } from '../../Core/Model/hierarchyModel';
import { BackendAPIService } from '../service/backend-api.service';
import { ErrroMessage } from 'src/app/utility/ErrorMessages';
import { IpServiceService } from '../service/ip-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-child-pnc',
  templateUrl: './child-pnc.component.html',
  styleUrls: ['./child-pnc.component.css'],
})
export class ChildPncComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private backendApiService: BackendAPIService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private tokenservice: TokenStorageService,
    public datepipe: DatePipe,
    private ipaddress: IpServiceService,
    private changeDetector: ChangeDetectorRef
  ) {}

  selectedInfantDangerSign: Array<any> = [];
  selectedInfantDeathReason = [];
  selectedFinencialYear;
  selectedYear;
  sno = 0;
  caseNoChild:number
  chilDOB;
  caseNo;
  pncNo;
  infantRegistration;
  findByIndex;
  totalInfant = 2;
  checkedFirst: boolean = true;
  //registrationNo=104000001887;
  registrationNo;
  showSecondRadioButton: boolean = false;
  showThirdRadioButton: boolean = false;
  showFourthRadioButton: boolean = false;
  showFifthRadioButton: boolean = false;
  showSixthRadioButton: boolean = false;
  required: String = ErrroMessage.REQUIRED;
  atLeastOne: String = ErrroMessage.AtLeastOne;

  showNotFoundMsg: boolean = false;
  vmsg;
  fill_hierarchy = true;

  editFalg = 0;

  dob: any;

  parentState;
  parentDistrict;
  parentTaluka;
  parentBlock;
  parentFacility;
  parentSubcenter;
  parentVillage;
  parentFacilityType;
  parentStateName;
  parentDistrictName;
  parentTalukaName;
  parentBlockName;
  parentFacilityName;
  parentSubcenterName;
  parentVillageName;

  //************************************************************************************************************************ */

  ngOnInit(): void {
    this.createForm();
    this.registrationNo = Number(
      this.route.snapshot.queryParamMap.get('rchId')
    );
    this.caseNo = Number(this.route.snapshot.queryParamMap.get('caseNo'));

    this.getInfantDangerSign();
    this.getInfantDeathReason();

    this.getFacilityType();
    this.getPNCPeriod();

    this.getBeneficiary(this.registrationNo, this.caseNo);

    this.getInfantRegistration(this.registrationNo, this.caseNo);

    // this.getInfantPNC(204000002191,1)

    //this.registrationNo=this.childPNCForm.value.registrationNo1
    //this.setMotherDisplay();
    this.getNewIP();
    // this.getInfantPNC(this.infantRegistration,1)
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  //***************************************************Display mother Details Hidden***************************************** */
  setMotherDisplay() {
    console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
    console.log(this.beneficiaryDetails);
    console.log(this.beneficiaryDetails.age);
    this.childPNCForm.controls['motherAge'].setValue(
      this.beneficiaryDetails.age
    );
    this.childPNCForm.controls['mobileNo'].setValue(
      this.beneficiaryDetails.mobileNumber
    );
    this.childPNCForm.controls['motherRegistrationNo'].setValue(
      this.beneficiaryDetails.registrationNo
    );
    this.childPNCForm.controls['motherName'].setValue(
      this.beneficiaryDetails.beneficiaryNmae
    );

    this.childPNCForm.controls['FatherName'].setValue(
      this.beneficiaryDetails.husbandName
    );
  }

  //**********************************************Method to Set Infant Registration acc to array**********************************/

  setInfantRegistrationNo(length: any) {
    if (length == 1) {
      this.childPNCForm.controls['infantRegistrationNo1'].setValue(
        this.infantDetails[0].infantId
      );
    } else if (length == 2) {
      this.showSecondRadioButton = true;
      this.childPNCForm.controls['infantRegistrationNo1'].setValue(
        this.infantDetails[0].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo2'].setValue(
        this.infantDetails[1].infantId
      );
    } else if (length == 3) {
      this.showSecondRadioButton = true;
      this.showThirdRadioButton = true;
      this.childPNCForm.controls['infantRegistrationNo1'].setValue(
        this.infantDetails[0].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo2'].setValue(
        this.infantDetails[1].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo3'].setValue(
        this.infantDetails[2].infantId
      );
    } else if (length == 4) {
      this.showSecondRadioButton = true;
      this.showThirdRadioButton = true;
      this.showFourthRadioButton = true;
      this.childPNCForm.controls['infantRegistrationNo1'].setValue(
        this.infantDetails[0].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo2'].setValue(
        this.infantDetails[1].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo3'].setValue(
        this.infantDetails[2].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo4'].setValue(
        this.infantDetails[3].infantId
      );
    } else if (length == 5) {
      this.showSecondRadioButton = true;
      this.showThirdRadioButton = true;
      this.showFourthRadioButton = true;
      this.showFifthRadioButton = true;
      this.childPNCForm.controls['infantRegistrationNo1'].setValue(
        this.infantDetails[0].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo2'].setValue(
        this.infantDetails[1].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo3'].setValue(
        this.infantDetails[2].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo4'].setValue(
        this.infantDetails[3].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo5'].setValue(
        this.infantDetails[4].infantId
      );
    } else if (length == 6) {
      this.showSecondRadioButton = true;
      this.showThirdRadioButton = true;
      this.showFourthRadioButton = true;
      this.showFifthRadioButton = true;
      this.showSixthRadioButton = true;
      this.childPNCForm.controls['infantRegistrationNo1'].setValue(
        this.infantDetails[0].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo2'].setValue(
        this.infantDetails[1].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo3'].setValue(
        this.infantDetails[2].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo4'].setValue(
        this.infantDetails[3].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo5'].setValue(
        this.infantDetails[4].infantId
      );
      this.childPNCForm.controls['infantRegistrationNo6'].setValue(
        this.infantDetails[5].infantId
      );
    }
  }

  //***********************************Start of Radio Button Function************************************************************** */

  clickFistRadioButton(e) {
    this.resetFields();
    this.childPNCForm.controls['infantRegistrationNo'].setValue(
      this.childPNCForm.value.infantRegistrationNo1
    );
    this.childPNCForm.controls['infantName'].setValue(
      this.infantDetails[0].infantName
    );

    this.childPNCForm.controls['infantDOB'].setValue(this.infantDetails[0].dob);
    this.infantRegistration = this.childPNCForm.value.infantRegistrationNo1;
    this.caseNoChild=this.infantDetails[0].caseNo
    this.chilDOB=this.infantDetails[0].dob
    this.getInfantPNC(
      this.childPNCForm.value.infantRegistrationNo1,
      this.caseNoChild
    );
  }

  clickSecondRadioButton(e) {
    this.resetFields();
    this.childPNCForm.controls['infantRegistrationNo'].setValue(
      this.childPNCForm.value.infantRegistrationNo2
    );
    this.childPNCForm.controls['infantName'].setValue(
      this.infantDetails[1].infantName
    );
    this.childPNCForm.controls['infantDOB'].setValue(this.infantDetails[1].dob);
    this.infantRegistration = this.childPNCForm.value.infantRegistrationNo2;
    this.caseNoChild=this.infantDetails[1].caseNo
    this.chilDOB=this.infantDetails[1].dob

    this.getInfantPNC(
      this.childPNCForm.value.infantRegistrationNo2,
      this.caseNoChild
    );
  }

  clickThirdRadioButton(e) {
    this.resetFields();
    this.childPNCForm.controls['infantRegistrationNo'].setValue(
      this.childPNCForm.value.infantRegistrationNo3
    );
    this.childPNCForm.controls['infantName'].setValue(
      this.infantDetails[2].infantName
    );
    this.childPNCForm.controls['infantDOB'].setValue(this.infantDetails[2].dob);
    this.infantRegistration = this.childPNCForm.value.infantRegistrationNo3;
    this.caseNoChild=this.infantDetails[2].caseNo
    this.chilDOB=this.infantDetails[2].dob

    this.getInfantPNC(
      this.childPNCForm.value.infantRegistrationNo3,
      this.caseNoChild
    );
  }

  clickFourthRadioButton(e) {
    this.resetFields();
    this.childPNCForm.controls['infantRegistrationNo'].setValue(
      this.childPNCForm.value.infantRegistrationNo4
    );
    this.childPNCForm.controls['infantName'].setValue(
      this.infantDetails[3].infantName
    );
    this.childPNCForm.controls['infantDOB'].setValue(this.infantDetails[3].dob);
    this.infantRegistration = this.childPNCForm.value.infantRegistrationNo4;
    this.caseNoChild=this.infantDetails[3].caseNo
    this.chilDOB=this.infantDetails[3].dob

    this.getInfantPNC(
      this.childPNCForm.value.infantRegistrationNo4,
      this.caseNoChild
    );
  }

  clickFifthRadioButton(e) {
    this.resetFields();
    this.childPNCForm.controls['infantRegistrationNo'].setValue(
      this.childPNCForm.value.infantRegistrationNo5
    );
    this.childPNCForm.controls['infantName'].setValue(
      this.infantDetails[4].infantName
    );
    this.childPNCForm.controls['infantDOB'].setValue(this.infantDetails[4].dob);
    this.infantRegistration = this.childPNCForm.value.infantRegistrationNo5;
    this.caseNoChild=this.infantDetails[4].caseNo
    this.chilDOB=this.infantDetails[4].dob

    this.getInfantPNC(
      this.childPNCForm.value.infantRegistrationNo5,
      this.caseNoChild
    );
  }

  clickSixthRadioButton(e) {
    this.resetFields();
    this.childPNCForm.controls['infantRegistrationNo'].setValue(
      this.childPNCForm.value.infantRegistrationNo6
    );
    this.childPNCForm.controls['infantName'].setValue(
      this.infantDetails[5].infantName
    );
    this.childPNCForm.controls['infantDOB'].setValue(this.infantDetails[5].dob);
    this.infantRegistration = this.childPNCForm.value.infantRegistrationNo6;
    this.caseNoChild=this.infantDetails[5].caseNo
    this.chilDOB=this.infantDetails[5].dob

    this.getInfantPNC(
      this.childPNCForm.value.infantRegistrationNo6,
      this.caseNoChild
    );
  }

  //**********************************End of Radio Button Function**************************************************************** */
  infantDetails: Array<any> = [];
  beneficiaryDetails: any;
  healthProviderANM: Array<any>;
  healthProviderASHA: Array<any>;
  FacilityType: Array<any>;
  healthPHC: Array<any>;
  ipAddress: string;

  isDropdownDisabled: boolean = false;
  showFacilityDropdown: boolean = true;
  showFacilityTextbox: boolean = false;

  deathPlace: Array<any> = [
    { id: 1, name: 'Hospital' },
    { id: 2, name: 'Home' },
  ];

  pncPeriod: Array<any>;
  infantPNC: Array<any>;

  infantDangerSign: Array<any> = [];
  infantDeathReason: Array<any> = [];

  childPNCForm: FormGroup;
  submitted: boolean = false;

  showInfantDangerSignOther: boolean = false;
  showInfantDeathReason: boolean = false;

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

  usehierarchyHandler(hierarchyMobj: HierarchyModel) {
    this.hierarchyMobj = hierarchyMobj;
    this.selectedVillage = this.hierarchyMobj.villageid;
    this.selectedSubCentre = this.hierarchyMobj.subfacilityid;
    this.selectedFacilityCode = this.hierarchyMobj.facilityid;
    this.selectedFacilityType = this.hierarchyMobj.facilitytypeid;
    this.selectedHealthBlock = this.hierarchyMobj.blockid;
    this.selectedDistrict = this.hierarchyMobj.districtid;
    this.selectedState = this.hierarchyMobj.stateid;
    this.selectedRuralUreban = this.hierarchyMobj.RuralUrban;
    this.selectedTaluka = this.hierarchyMobj.talukacode;
    this.selectedWard = this.hierarchyMobj.ward;

    if (this.selectedSubCentre !== undefined) {
      this.fetchHealthProviderOnSubcentre(this.selectedSubCentre);
    }

    if (this.selectedVillage == undefined) {
      this.showNotFoundMsg = true;
      this.vmsg = 'Select Hierarchy';
      this.fill_hierarchy = true;
    } else {
      this.showNotFoundMsg = false;
      this.vmsg = null;
      this.fill_hierarchy = false;
    }
  }
  //*************************************************API Call******************************************************** */

  fetchHealthProviderOnSubcentre(subcentre_code: any) {
    console.log('inside health provider subcentre method');
    this.getHealthProviderByANMType(subcentre_code, 2);
    this.getHealthProviderByASHAType(subcentre_code, 1);
  }

  getPNCPeriod(): void {
    this.backendApiService.getPNCPeriod().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);
      this.pncPeriod = response;
    });
  }

  getHealthProviderByANMType(subcentre: number, typeid: number): void {
    this.backendApiService
      .getHealthProvideratSubcentre(subcentre, typeid)
      .subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        console.log(response);
        this.healthProviderANM = response;
        if (this.healthProviderANM.length < 1) {
          this.healthProviderANM = [
            { id: 0, name: 'Not Available', contact_No: '' },
          ];
        }
      });
  }

  getHealthProviderByASHAType(subcentre: number, typeid: number): void {
    this.backendApiService
      .getHealthProvideratSubcentre(subcentre, typeid)
      .subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        console.log('asha list');
        console.log(response);
        this.healthProviderASHA = response;
        if (this.healthProviderASHA.length < 1) {
          this.healthProviderASHA = [
            { id: 0, name: 'Not Available', contact_No: '' },
          ];
        }
      });
  }

  getFacilityType(): void {
    this.backendApiService.getDeliveryPlace().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);
      this.FacilityType = response;
    });
  }

  changeFacility(e) {
    debugger;
    if (
      e == '1' ||
      e == '2' ||
      e == '4' ||
      e == '5' ||
      e == '17' ||
      e == '24'
    ) {
      this.showFacilityDropdown = true;
      this.showFacilityTextbox = false;
      this.getHealthFacility(this.selectedHealthBlock, e);
      this.childPNCForm.get('referralLoationOtherInfant').clearValidators();
      this.childPNCForm
        .get('referralLoationOtherInfant')
        .updateValueAndValidity();
    } else {
      this.showFacilityDropdown = false;
      this.showFacilityTextbox = true;
      //this.childPNCForm.get('referralLoationOtherInfant').reset();
      this.childPNCForm
        .get('referralLoationOtherInfant')
        .setValidators([
          Validators.required,
          Validators.pattern('^[ A-Za-z0-9_@.#&+-,-(/)]{0,50}$'),
        ]);
      this.childPNCForm
        .get('referralLoationOtherInfant')
        .updateValueAndValidity();
    }
  }

  setCalenderDate(e) {
    let x = this.datepipe.transform(this.chilDOB, 'yyyy-MM-dd');
    let dateMinimum: Date;
    let dateMaximum: Date;

    if (e == '1') {
      dateMinimum = new Date(x);
      dateMinimum.setDate(dateMinimum.getDate() + 1);
      this.minDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
      this.maxDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
    } else if (e == '2') {
      dateMinimum = new Date(x);
      dateMinimum.setDate(dateMinimum.getDate() + 3);
      this.minDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
      this.maxDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
    } else if (e == '3') {
      dateMinimum = new Date(x);
      dateMaximum = new Date(x);
      dateMinimum.setDate(dateMinimum.getDate() + 4);
      dateMaximum.setDate(dateMaximum.getDate() + 10);
      this.minDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
      this.maxDate = {
        year: dateMaximum.getUTCFullYear(),
        month: dateMaximum.getMonth() + 1,
        day: dateMaximum.getUTCDate(),
      };
    } else if (e == '4') {
      dateMinimum = new Date(x);
      dateMaximum = new Date(x);
      dateMinimum.setDate(dateMinimum.getDate() + 11);
      dateMaximum.setDate(dateMaximum.getDate() + 17);
      this.minDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
      this.maxDate = {
        year: dateMaximum.getUTCFullYear(),
        month: dateMaximum.getMonth() + 1,
        day: dateMaximum.getUTCDate(),
      };
    } else if (e == '5') {
      dateMinimum = new Date(x);
      dateMaximum = new Date(x);
      dateMinimum.setDate(dateMinimum.getDate() + 18);
      dateMaximum.setDate(dateMaximum.getDate() + 24);
      this.minDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
      this.maxDate = {
        year: dateMaximum.getUTCFullYear(),
        month: dateMaximum.getMonth() + 1,
        day: dateMaximum.getUTCDate(),
      };
    } else if (e == '6') {
      dateMinimum = new Date(x);
      dateMaximum = new Date(x);
      dateMinimum.setDate(dateMinimum.getDate() + 25);
      dateMaximum.setDate(dateMaximum.getDate() + 31);
      this.minDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
      this.maxDate = {
        year: dateMaximum.getUTCFullYear(),
        month: dateMaximum.getMonth() + 1,
        day: dateMaximum.getUTCDate(),
      };
    } else if (e == '7') {
      dateMinimum = new Date(x);
      dateMaximum = new Date(x);
      dateMinimum.setDate(dateMinimum.getDate() + 39);
      dateMaximum.setDate(dateMaximum.getDate() + 45);
      this.minDate = {
        year: dateMinimum.getUTCFullYear(),
        month: dateMinimum.getMonth() + 1,
        day: dateMinimum.getUTCDate(),
      };
      this.maxDate = {
        year: dateMaximum.getUTCFullYear(),
        month: dateMaximum.getMonth() + 1,
        day: dateMaximum.getUTCDate(),
      };
    }
  }

  changepncDateCalender(e) {
    debugger;
    let v = this.infantPNC.length;
    console.log(v + 'vxcxvcxvx');

    if (this.editFalg == 0) {
      //when data is fresh
      if (this.infantPNC.findIndex((x) => x.infantDeath == 1) !== -1) {
        //when death is marked true.

        alert('Infant Death is marked. Entry is closed.');
        this.resetFields()
      } else {
        //Death is marked false.
        if (this.infantPNC.findIndex((x) => x.pncType == e) !== -1) {
          // check selected pnc is present is  array
          alert('This PNC is already given.');
          this.childPNCForm.controls['pncType'].setValue('');
        } else {
          this.setCalenderDate(e);
        }
      }
    } else {
      //when data is in edit mode
      this.setCalenderDate(e);
    }
  }

  getHealthFacility(block: number, ftype: number): void {
    this.backendApiService
      .getHealthPhcbyTypeBlock(block, ftype)
      .subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        this.healthPHC = response;
      });
  }

  getBeneficiary(id: number, caseno: number): void {
    this.backendApiService
      .getBeneficiary(id, caseno)
      .subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        this.beneficiaryDetails = response;
        console.log('benificary details');
        console.log(response.age);
        console.log(this.beneficiaryDetails);
        console.log(this.beneficiaryDetails.age);
        this.setMotherDisplay();
      });
  }

  getInfantRegistration(rchId: number, caseno: number): void {
    console.log('infant');
    this.backendApiService
      .getInfantRegistration(rchId, caseno)
      .subscribe((data: any) => {
        console.log(data);
        this.infantDetails = data;
        for (let i = 0; i < this.infantDetails.length; i++) {
          this.infantDetails[i].dob = this.infantDetails[i].dob.substr(0, 10);
        }
        console.log('after insert into infnt details');
        console.log(this.infantDetails);
        let infantDetailsLength = this.infantDetails.length;
        this.setInfantRegistrationNo(infantDetailsLength);
        this.clickFistRadioButton(this.infantDetails[0].infantId);
      });
  }

  minDate = { year: 2011, month: 4, day: 1 };
  maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };


 
     
    


  minDateDeath = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  maxDateDeath = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  createForm() {
    this.childPNCForm = this.formBuilder.group(
      {
        anmId: new FormControl('', Validators.required),
        ashaId: new FormControl('', Validators.required),
        pncType: new FormControl('', Validators.required),
        pncDate: new FormControl('', Validators.required),
        infantWeight: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9 .]+$'),
          this.infantWeightValidation(),
        ]),
        infantDeathReason: new FormControl(''),
        infantDeathReasonOther: new FormControl(
          '',
          Validators.pattern('^[A-Z, a-z ]{0,50}$')
        ),
        placeOfDeath: new FormControl(''),
        infantDeath: new FormControl('', Validators.required),
        infantDeathDate: new FormControl(''),
        remarks: new FormControl(
          '',
          Validators.pattern('^[ A-Za-z0-9_@.#&+-,-(/)]{0,250}$')
        ),
        fbirByAnm: new FormControl(''),
        notificationByAsha: new FormControl(''),
        temperatureChecked: new FormControl(''),
        dangerSignInfant: new FormControl('', Validators.required),
        dangerSignInfantOther: new FormControl(
          '',
          Validators.pattern('^[A-Z, a-z ]{0,50}$')
        ),
        preReferralDose: new FormControl(''),
        infantRegistrationNo1: new FormControl(''),
        infantRegistrationNo2: new FormControl(''),
        infantRegistrationNo3: new FormControl(''),
        infantRegistrationNo4: new FormControl(''),
        infantRegistrationNo5: new FormControl(''),
        infantRegistrationNo6: new FormControl(''),
        referralFacilityInfant: new FormControl('', Validators.required),
        referralFacilityIdInfant: new FormControl('', Validators.required),
        referralLoationOtherInfant: new FormControl(''),
        infantName: new FormControl(''),
        infantDOB: new FormControl(''),
        mobileNo: new FormControl(''),
        motherRegistrationNo: new FormControl(''),
        motherName: new FormControl(''),
        motherAge: new FormControl(' '),
        FatherName: new FormControl(''),
        infantRegistrationNo: new FormControl(''),
        tcfsd: new FormControl(''),
      },
      {
        validator: [this.ConfirmedANMOrMPW('anmId', 'ashaId')],
      }
    );
  }

  validateANMOrMPW(anm: any, ashaId: any) {
    debugger;
    return (formGroup: FormGroup) => {
      const anm1 = formGroup.controls[anm];
      const asha = formGroup.controls[ashaId];

      if (!anm1 || !asha) {
        return null;
      } else {
        if (anm1.errors && !asha.errors.pattern) {
          return null;
        }
        if (anm1.value == '0' && asha.value == '0') {
          asha.setErrors({ pattern: true });
        } else {
          asha.setErrors(null);
        }
      }
    };
  }

  ConfirmedANMOrMPW(controlName: string, matchingControlName: string) {
    debugger;
    return (myForm: FormGroup) => {
      const control = myForm.controls[controlName];
      const matchingControl = myForm.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.pattern) {
        return;
      }
      if (control.value == '0' && matchingControl.value == '0') {
        matchingControl.setErrors({ pattern: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  //**********************************************IP Address**************************************************** */

  getNewIP() {
    this.http.get<{ ip: string }>('https://jsonip.com').subscribe((data) => {
      this.ipAddress = data.ip;
      console.log('ip address' + this.ipAddress);
    });
  }

  //********************************************Submit Method******************************************************** */

  submitForm(childPNCForm) {
    debugger;

    this.childPNCForm.controls['infantDeathDate'].clearValidators();
    this.childPNCForm.controls['infantDeathDate'].updateValueAndValidity();

    this.findInvalidControls();
    this.submitted = true;

    if (this.childPNCForm.invalid) {
      return;
    }

    console.log(childPNCForm);
    let selectedInfantDangerSignConcate = '';

    for (var val of this.selectedInfantDangerSign) {
      selectedInfantDangerSignConcate =
        selectedInfantDangerSignConcate + val.id;
    }
    let selectedInfantDeathReasonConcate = '';
    if (this.selectedInfantDeathReason != null) {
      for (var val of this.selectedInfantDeathReason) {
        selectedInfantDeathReasonConcate =
          selectedInfantDeathReasonConcate + val.id;
      }
    }

    let pncDate = childPNCForm.value.pncDate
      ? this.datepipe.transform(
          new Date(
            childPNCForm.value.pncDate.year,
            childPNCForm.value.pncDate.month - 1,
            childPNCForm.value.pncDate.day
          ),
          'yyyy-MM-dd'
        )
      : null;
    let infantDeathDate = null;
    let selectedInfantDeathReasonlength = 0;

    if (childPNCForm.value.infantDeath == '0') {
      // Death is False

      this.childPNCForm.controls['infantDeathDate'].clearValidators();
      this.childPNCForm.controls['infantDeathDate'].updateValueAndValidity();
      childPNCForm.value.fbirByAnm = 0;
      childPNCForm.value.remarks = '';
      childPNCForm.value.notificationByAsha = 0;
      childPNCForm.value.placeOfDeath = null;
      childPNCForm.value.infantDeathReason = '';
    } else {
      //Death is True
      this.childPNCForm.controls['infantDeathDate'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['infantDeathDate'].updateValueAndValidity();
      selectedInfantDeathReasonlength = this.selectedInfantDeathReason.length;
      infantDeathDate = childPNCForm.value.infantDeath
        ? this.datepipe.transform(
            new Date(
              childPNCForm.value.infantDeathDate.year,
              childPNCForm.value.infantDeathDate.month - 1,
              childPNCForm.value.infantDeathDate.day
            ),
            'yyyy-MM-dd'
          )
        : null;
    }

    let data = {
      sno: this.sno,
      stateCode: Number(this.selectedState),
      districtCode: Number(this.selectedDistrict),
      ruralUrban: 'R',
      healthBlockCode: Number(this.selectedHealthBlock),
      talukaCode: this.selectedTaluka,
      healthFacilityType: Number(this.selectedFacilityType),
      healthFacilityCode: Number(this.selectedFacilityCode),
      healthSubFacilityCode: Number(this.selectedSubCentre),
      villageCode: Number(this.selectedVillage),
      financialYr: this.selectedFinencialYear,
      financialYear: Number(this.selectedYear),
      registrationNo: Number(this.registrationNo),
      idNo: '',
      infantRegistration: Number(this.infantRegistration),
      pncNo: Number(childPNCForm.value.pncType),
      pncType: Number(childPNCForm.value.pncType),
      pncDate: pncDate, //childPNCForm.value.pncDate,
      infantWeight: Number(childPNCForm.value.infantWeight),
      dangerSignInfant: selectedInfantDangerSignConcate,
      dangerSignInfantOther: childPNCForm.value.dangerSignInfantOther,
      dangerSignInfantLength: Number(this.selectedInfantDangerSign.length),
      referralFacilityInfant: Number(childPNCForm.value.referralFacilityInfant),
      referralFacilityIdInfant: Number(childPNCForm.value.referralFacilityIdInfant),
      referralLoationOtherInfant: childPNCForm.value.referralLoationOtherInfant,
      infantDeath: Number(childPNCForm.value.infantDeath),
      placeOfDeath: Number(childPNCForm.value.placeOfDeath), //int
      infantDeathDate: infantDeathDate, //childPNCForm.value.infantDeathDate,//.toString(),
      infantDeathReason: selectedInfantDeathReasonConcate,
      infantDeathReasonOther: childPNCForm.value.infantDeathReasonOther,
      infantDeathReasonLength: Number(selectedInfantDeathReasonlength),
      remarks: childPNCForm.value.remarks,
      anmId: Number(childPNCForm.value.anmId),
      ashaId: Number(childPNCForm.value.ashaId),
      caseNo: 1,
      ipAddress: this.ipAddress, //"127.0.0.1",//this.ipAddress,
      createdBy: this.tokenservice.getUserId(),
      createdOn: new Date(),
      mobileId: 0,
      updatedBy: null,
      updatedOn: null,
      sourceId: 0,
      wardNo: 0,
      rurUrbHierarchy: 'R',
      mpwId: 0,
      temperatureChecked: Number(childPNCForm.value.temperatureChecked),
      preReferralDose: Number(childPNCForm.value.preReferralDose),
      notificationByAsha: Number(childPNCForm.value.notificationByAsha),
      fbirByAnm: Number(childPNCForm.value.fbirByAnm),
    };
    console.log('print data');
    console.log(JSON.stringify(data));
    console.log(data);

    if (this.sno > 0) {
      data.createdOn = this.infantPNC[this.findByIndex].createdOn;
      data.createdBy = this.infantPNC[this.findByIndex].createdBy;
      data.updatedBy = this.tokenservice.getUserId();
      data.updatedOn = new Date();
      data.caseNo = this.infantPNC[this.findByIndex].caseNo;
      data.pncNo = this.infantPNC[this.findByIndex].pncNo;
      data.pncType = this.infantPNC[this.findByIndex].pncType;
      if (data.infantDeath == 0) {
        data.infantDeathDate = null;
      }
      console.log(JSON.stringify(data));
      console.log(data);
      this.updateChildPNC(this.registrationNo, this.caseNo, this.pncNo, data);
    } else {
      this.saveChildPNCData(data);
    }
  }
  //***********************************Reset Form*************************************************************** */

  resetFields() {
    this.childPNCForm.controls['pncType'].setValue('');
    this.childPNCForm.controls['pncDate'].setValue('');
    this.childPNCForm.controls['infantWeight'].setValue('');
    this.childPNCForm.controls['dangerSignInfant'].setValue('');
    this.childPNCForm.controls['dangerSignInfantOther'].setValue('');
    this.childPNCForm.controls['referralFacilityInfant'].setValue('');
    this.childPNCForm.controls['referralFacilityIdInfant'].setValue('');
    this.childPNCForm.controls['referralLoationOtherInfant'].setValue('');
    this.childPNCForm.controls['infantDeath'].setValue('');
    this.childPNCForm.controls['placeOfDeath'].setValue('');
    this.childPNCForm.controls['infantDeathDate'].setValue('');
    this.childPNCForm.controls['infantDeathReason'].setValue('');
    this.childPNCForm.controls['infantDeathReasonOther'].setValue('');
    this.childPNCForm.controls['temperatureChecked'].setValue('');
    this.childPNCForm.controls['preReferralDose'].setValue('');
    this.childPNCForm.controls['notificationByAsha'].setValue('');
    this.childPNCForm.controls['fbirByAnm'].setValue('');
    this.childPNCForm.controls['anmId'].setValue('');
    this.childPNCForm.controls['ashaId'].setValue('');

    this.childPNCForm.controls['infantDeathReason'].enable();
    this.childPNCForm.controls['infantDeathReasonOther'].enable();
    this.childPNCForm.controls['infantDeathDate'].enable();
    this.childPNCForm.controls['placeOfDeath'].enable();
    this.childPNCForm.controls['notificationByAsha'].enable();
    this.childPNCForm.controls['fbirByAnm'].enable();
    this.childPNCForm.controls['remarks'].enable();
    this.childPNCForm.controls['pncType'].enable();
    this.childPNCForm.controls['infantDeath'].enable();
    this.sno=0
    this.editFalg = 0;
    this.settingsInfantDeathReason = {
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'multidropdown',
      enableCheckAll: false,
      clearAll: true,
      autoUnselect: true,
      limitSelection: 100,
      disabled: false,
    };

    this.submitted = false;
  }

  resetFormCustom() {
    this.ngOnInit();
    this.submitted = false;
  }
  //***********************************Save Child PNC Method**************************************************** */

  saveChildPNCData(data: any): void {
    console.log(data);
    this.backendApiService.saveChildPNC(data).subscribe(
      (res) => {
        let response = JSON.parse(JSON.stringify(res));
        console.log(response);
        console.log(response.status);
        alert('Record saved successfully');
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"+this.infantRegistration)
        this.getInfantPNC(this.infantRegistration, this.caseNoChild);
        this.resetFields()
      },
      (error) => {
        alert('Something Went Wrong ');
        console.log('inside child pnc ts error');
        console.log(error);
      }
    );
  }
  //******************************************Update child pnc***************************************************** */
  updateChildPNC(
    registrationNo: number,
    caseno: number,
    pncno: number,
    data: any
  ): void {
    this.backendApiService
      .updateChildPNC(registrationNo, caseno, pncno, data)
      .subscribe(
        (res) => {
          let response = JSON.parse(JSON.stringify(res));
          console.log(response);
          alert('Update record successfully');
          this.getInfantPNC(this.infantRegistration, this.caseNoChild);
          this.resetFields()
        },
        (error) => {
          alert('Something Went Wrong');
          console.log('inside child pnc ts error');

          console.log(error);
        }
      );
  }
  //*********************************************Find invalid Controls******************************************** */
  public findInvalidControls() {
    const invalid = [];
    const controls = this.childPNCForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }
  //******************************************return function******************************************************** */
  get f() {
    return this.childPNCForm.controls;
  }
  //*********************************************************Infant Weight Validation******************************** */
  infantWeightValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      let valid: number;

      if (control.value > 10.0 || control.value < 0.5) {
        valid = 0;
      } else {
        valid = 1;
      }

      return valid ? null : { pattern: true };
    };
  }

  //***************************************change Function for Death Yes/No******************************** */

  changeDeath(e) {
    debugger;
    if (e == '0') {
      this.settingsInfantDeathReason = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'multidropdown',
        enableCheckAll: false,
        clearAll: true,
        autoUnselect: true,
        limitSelection: 100,
        disabled: true,
      };

      this.childPNCForm.get('infantDeathReason').clearValidators();
      this.childPNCForm.get('infantDeathReason').updateValueAndValidity();

      this.childPNCForm.controls['infantDeathReason'].reset();
      this.childPNCForm.controls['infantDeathReason'].disable();

      this.childPNCForm.controls['infantDeathDate'].reset();
      this.childPNCForm.controls['infantDeathDate'].disable();

      this.childPNCForm.controls['placeOfDeath'].reset();
      this.childPNCForm.controls['placeOfDeath'].disable();

      this.childPNCForm.controls['notificationByAsha'].reset();
      this.childPNCForm.controls['notificationByAsha'].disable();

      this.childPNCForm.controls['fbirByAnm'].reset();
      this.childPNCForm.controls['fbirByAnm'].disable();

      this.childPNCForm.controls['remarks'].reset();
      this.childPNCForm.controls['remarks'].disable();
    } else {

      let  dateMinimum :Date
 
      if(this.infantPNC.length!==undefined){

       
        dateMinimum = new Date(this.datepipe.transform( this.infantPNC[(this.infantPNC.length)-1].pncDate , 'yyyy-MM-dd'));
        this.minDateDeath = {
          year: dateMinimum.getUTCFullYear(),
          month: dateMinimum.getMonth() + 1,
          day: dateMinimum.getUTCDate(),
        };

      }
      else{

         dateMinimum = new Date(this.datepipe.transform(this.chilDOB, 'yyyy-MM-dd'));
        this.minDateDeath = {
          year: dateMinimum.getUTCFullYear(),
          month: dateMinimum.getMonth() + 1,
          day: dateMinimum.getUTCDate(),
        };
      }
      
      
       






      this.settingsInfantDeathReason = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'multidropdown',
        enableCheckAll: false,
        clearAll: true,
        autoUnselect: true,
        limitSelection: 100,
        disabled: false,
      };

      /*  this.childPNCForm.controls['pncType'].reset();
          this.childPNCForm.controls['pncType'].disable();
          this.childPNCForm.get('pncType').clearValidators(); 
          this.childPNCForm.get('pncType').updateValueAndValidity();  

          this.childPNCForm.controls['pncDate'].reset();
      this.childPNCForm.controls['pncDate'].disable(); 
      this.childPNCForm.get('pncDate').clearValidators(); 
          this.childPNCForm.get('pncDate').updateValueAndValidity(); 

      this.childPNCForm.controls['infantWeight'].reset();
      this.childPNCForm.controls['infantWeight'].disable(); 
      this.childPNCForm.get('infantWeight').clearValidators(); 
          this.childPNCForm.get('infantWeight').updateValueAndValidity(); 

      this.childPNCForm.controls['referralFacilityInfant'].reset();
      this.childPNCForm.controls['referralFacilityInfant'].disable(); 
      this.childPNCForm.get('referralFacilityInfant').clearValidators(); 
          this.childPNCForm.get('referralFacilityInfant').updateValueAndValidity(); 

      this.childPNCForm.controls['referralFacilityIdInfant'].reset();
      this.childPNCForm.controls['referralFacilityIdInfant'].disable(); 
      this.childPNCForm.get('referralFacilityIdInfant').clearValidators(); 
          this.childPNCForm.get('referralFacilityIdInfant').updateValueAndValidity();  */

      this.childPNCForm.controls['infantDeathReason'].enable();
      this.childPNCForm.controls['infantDeathReasonOther'].enable();
      this.childPNCForm.controls['infantDeathDate'].enable();
      this.childPNCForm.controls['placeOfDeath'].enable();
      this.childPNCForm.controls['notificationByAsha'].enable();
      this.childPNCForm.controls['fbirByAnm'].enable();
      this.childPNCForm.controls['remarks'].enable();

      this.childPNCForm.controls['infantDeathReason'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['infantDeathReason'].updateValueAndValidity();

      this.childPNCForm.controls['infantDeathDate'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['infantDeathDate'].updateValueAndValidity();

      this.childPNCForm.controls['placeOfDeath'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['placeOfDeath'].updateValueAndValidity();

      this.childPNCForm.controls['notificationByAsha'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['notificationByAsha'].updateValueAndValidity();

      this.childPNCForm.controls['fbirByAnm'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['fbirByAnm'].updateValueAndValidity();

      this.childPNCForm.controls['remarks'].setValidators(Validators.required);
      this.childPNCForm.controls['remarks'].updateValueAndValidity();

      /*    this.childPNCForm.controls['rchid17'].setValidators(Validators.required);
      this.childPNCForm.controls['rchid17'].updateValueAndValidity(); */
    }
  }

  getInfantDangerSign() {
    this.backendApiService.getInfantDangerSign().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);

      let count = 0;
      for (var val of response) {
        this.infantDangerSign[count] = {
          id: val.id,
          itemName: val.name,
          codeSystem: val.codeSystem,
          codeValue: val.codeValue,
        };
        count++;
      }

      // this.infantDangerSign = response;
    });
  }

  getInfantDeathReason() {
    this.backendApiService.getInfantDeathReason().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);

      let count = 0;
      for (var val of response) {
        this.infantDeathReason[count] = {
          id: val.id,
          itemName: val.name,
          codeSystem: val.codeSystem,
          codeValue: val.codeValue,
        };
        count++;
      }
      console.log(this.infantDeathReason);
      console.log(this.infantDeathReason[0]);
      // this.infantDeathReason = response;
    });
  }

  dangerSignName = '';

  getInfantPNC(id: number, caseno: number) {
    debugger;
    this.backendApiService
      .getChildPNC(id, caseno)
      .subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        console.log('response of get infant pnc');
        console.log(response);
        this.infantPNC = response;
        console.log('gter change array');
        console.log(this.infantPNC);
        debugger;
        for (let i = 0; i < this.infantPNC.length; i++) {
          this.infantPNC[i].pncDate = this.infantPNC[i].pncDate.substr(0, 10);
          if (this.infantPNC[i].dangerSignInfant !== null) {
            let v = this.infantPNC[i].dangerSignInfant.split('');
            for (let i = 0; i < v.length; i++) {
              const index = this.infantDangerSign.findIndex(
                (x) => x.id == v[i]
              );
              if (this.dangerSignName == '') {
                this.dangerSignName = this.infantDangerSign[index].itemName;
              } else {
                this.dangerSignName =
                  this.dangerSignName +
                  ',' +
                  this.infantDangerSign[index].itemName;
              }
            }
          }

          const index = this.pncPeriod.findIndex(
            (x) => x.pncNo == this.infantPNC[i].pncType
          );
          this.infantPNC[i].pncName = this.pncPeriod[index].pncPeriod;

          this.infantPNC[i].infantDangerSignCustom = this.dangerSignName;
          this.dangerSignName = '';

          if (this.infantPNC[i].infantDeath == 1) {
            this.infantPNC[i].death = 'Yes';
          } else {
            this.infantPNC[i].death = 'No';
          }
        }
      });
  }
  //****************************Calculate Finencial Year********************************************************* */
  changeRegDate($event) {
    ////debugger
    let yr = String($event.year);
    if ($event.month > 3) {
      this.selectedFinencialYear =
        $event.year + '-' + (Number(yr.substr(2, 2)) + 1);
      this.selectedYear = $event.year;
    } else {
      this.selectedFinencialYear =
        Number(yr) - 1 + '-' + Number(yr.substr(2, 2));
      this.selectedYear = Number(yr) - 1;
    }
  }
  //********************************************************************************************************************** */

  getEditPNC(pncType: any) {
    this.editFalg = 1;
    const index = this.infantPNC.findIndex((x) => x.pncType == pncType);
    this.editPNCByPNCType(index);
    this.findByIndex = index;
  }

  editPNCByPNCType(index) {
    debugger;
    this.sno = this.infantPNC[index].sno;
    this.caseNo = this.infantPNC[index].caseNo;
    this.pncNo = this.infantPNC[index].pncNo;

    this.registrationNo = this.infantPNC[index].registrationNo;
    this.childPNCForm.controls['anmId'].setValue(this.infantPNC[index].anmId),
      this.childPNCForm.controls['ashaId'].setValue(
        this.infantPNC[index].ashaId
      ),
      this.childPNCForm.controls['pncType'].setValue(
        this.infantPNC[index].pncType
      );
    this.childPNCForm.controls['pncType'].disable();

    this.changepncDateCalender(this.infantPNC[index].pncType);

    let pncDateArray: Array<any>;

    pncDateArray = this.datepipe
      .transform(this.infantPNC[index].pncDate, 'yyyy-MM-dd')
      .split('-');

    this.childPNCForm.controls['pncDate'].setValue({
      year: Number(pncDateArray[0]),
      month: Number(pncDateArray[1]),
      day: Number(pncDateArray[2]),
    });
    console.log('value------' + this.childPNCForm.value.pncDate);

    this.childPNCForm.controls['infantWeight'].setValue(
      this.infantPNC[index].infantWeight
    ),
      this.childPNCForm.controls['infantDeath'].setValue(
        this.infantPNC[index].infantDeath
      );
    let len = this.infantPNC.length - 1;
    if (index !== this.infantPNC.length - 1) {
      this.childPNCForm.controls['infantDeath'].disable();
    } else {
      this.childPNCForm.controls['infantDeath'].enable();
    }
    if (this.infantPNC[index].infantDeath == 0) {
      this.settingsInfantDeathReason = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'multidropdown',
        enableCheckAll: false,
        clearAll: true,
        autoUnselect: true,
        limitSelection: 100,
        disabled: true,
      };

      this.childPNCForm.get('infantDeathReason').clearValidators();
      this.childPNCForm.get('infantDeathReason').updateValueAndValidity();

      this.childPNCForm.controls['infantDeathReason'].reset();

      this.childPNCForm.controls['infantDeathReason'].disable();

      this.childPNCForm.controls['infantDeathDate'].reset();
      this.childPNCForm.controls['infantDeathDate'].disable();

      this.childPNCForm.controls['placeOfDeath'].reset();
      this.childPNCForm.controls['placeOfDeath'].disable();

      this.childPNCForm.controls['notificationByAsha'].reset();
      this.childPNCForm.controls['notificationByAsha'].disable();

      this.childPNCForm.controls['fbirByAnm'].reset();
      this.childPNCForm.controls['fbirByAnm'].disable();

      this.childPNCForm.controls['remarks'].reset();
      this.childPNCForm.controls['remarks'].disable();
    } else {
      this.settingsInfantDeathReason = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'multidropdown',
        enableCheckAll: false,
        clearAll: true,
        autoUnselect: true,
        limitSelection: 100,
        disabled: false,
      };

      this.childPNCForm.controls['infantDeathReason'].enable();
      this.childPNCForm.controls['infantDeathReasonOther'].enable();
      this.childPNCForm.controls['infantDeathDate'].enable();
      this.childPNCForm.controls['placeOfDeath'].enable();
      this.childPNCForm.controls['notificationByAsha'].enable();
      this.childPNCForm.controls['fbirByAnm'].enable();
      this.childPNCForm.controls['remarks'].enable();

      this.childPNCForm.controls['infantDeathReason'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['infantDeathReason'].updateValueAndValidity();

      this.childPNCForm.controls['infantDeathDate'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['infantDeathDate'].updateValueAndValidity();

      this.childPNCForm.controls['placeOfDeath'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['placeOfDeath'].updateValueAndValidity();

      this.childPNCForm.controls['notificationByAsha'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['notificationByAsha'].updateValueAndValidity();

      this.childPNCForm.controls['fbirByAnm'].setValidators(
        Validators.required
      );
      this.childPNCForm.controls['fbirByAnm'].updateValueAndValidity();

      this.childPNCForm.controls['remarks'].setValidators(Validators.required);
      this.childPNCForm.controls['remarks'].updateValueAndValidity();

      let infantdeath: Array<any>;
      infantdeath = this.infantPNC[index].infantDeathReason.split('');
      this.selectedInfantDeathReason = [];

      for (let i = 0; i < infantdeath.length; i++) {
        console.log(infantdeath[i]);
        const index = this.infantDeathReason.findIndex(
          (x) => x.id == infantdeath[i]
        );
        console.log(this.infantDeathReason[0]);
        this.selectedInfantDeathReason[i] = this.infantDeathReason[index];
        console.log(this.selectedInfantDeathReason);
      }

      if (infantdeath.find((x) => x == 'Z') !== undefined) {
        this.showInfantDeathReason = true;
        this.childPNCForm.controls['infantDeathReasonOther'].setValue(
          this.infantPNC[index].infantDeathReasonOther
        );
      } else {
        this.showInfantDeathReason = false;
        this.childPNCForm.controls['infantDeathReasonOther'].setValue('');
      }

      this.childPNCForm.controls['infantDeathReason'].setValue(
        this.selectedInfantDeathReason
      ),
        this.childPNCForm.controls['placeOfDeath'].setValue(
          this.infantPNC[index].placeOfDeath
        );

      let deathDateArray: Array<any>;
      deathDateArray = this.datepipe
        .transform(this.infantPNC[index].infantDeathDate, 'yyyy-MM-dd')
        .split('-');
      this.childPNCForm.controls['infantDeathDate'].setValue({
        year: Number(deathDateArray[0]),
        month: Number(deathDateArray[1]),
        day: Number(deathDateArray[2]),
      });
      this.childPNCForm.controls['remarks'].setValue(
        this.infantPNC[index].remarks
      ),
        this.childPNCForm.controls['fbirByAnm'].setValue(
          this.infantPNC[index].fbirByAnm
        ),
        this.childPNCForm.controls['notificationByAsha'].setValue(
          this.infantPNC[index].notificationByAsha
        );
    }

    this.childPNCForm.controls['temperatureChecked'].setValue(
      this.infantPNC[index].temperatureChecked
    );
    debugger;
    // set infant danger sign

    if (this.infantPNC[index].dangerSignInfant !== null) {
      let v: Array<any>;
      v = this.infantPNC[index].dangerSignInfant.split('');
      console.log('charecter array----------------------' + v);
      console.log('length--------------------------' + v.length);
      this.selectedInfantDangerSign = [];
      for (let i = 0; i < v.length; i++) {
        console.log(v[i]);
        const index = this.infantDangerSign.findIndex((x) => x.id == v[i]);

        this.selectedInfantDangerSign[i] = this.infantDangerSign[index];
        console.log(this.selectedInfantDangerSign);
      }

      if (v.find((x) => x == 'Z') !== undefined) {
        this.showInfantDangerSignOther = true;
        this.childPNCForm.controls['dangerSignInfantOther'].setValue(
          this.infantPNC[index].dangerSignInfantOther
        );
      } else {
        this.showInfantDangerSignOther = false;
        this.childPNCForm.controls['dangerSignInfantOther'].setValue('');
      }

      this.childPNCForm.controls['dangerSignInfant'].setValue(
        this.selectedInfantDangerSign
      );
    }

    this.childPNCForm.controls['preReferralDose'].setValue(
      this.infantPNC[index].preReferralDose
    ),
      this.childPNCForm.controls['referralFacilityInfant'].setValue(
        this.infantPNC[index].referralFacilityInfant
      );
    debugger;

    let x = this.infantPNC[index].referralFacilityInfant;

    if (x == 1 || x == 2 || x == 4 || x == 5 || x == 17 || x == 24) {
      this.showFacilityDropdown = true;
      this.showFacilityTextbox = false;
      this.getHealthFacility(
        this.selectedHealthBlock,
        this.infantPNC[index].referralFacilityInfant
      );
      this.childPNCForm.get('referralLoationOtherInfant').clearValidators();
      this.childPNCForm
        .get('referralLoationOtherInfant')
        .updateValueAndValidity();
      this.childPNCForm.controls['referralFacilityIdInfant'].setValue(
        this.infantPNC[index].referralFacilityIdInfant
      );
    } else {
      this.showFacilityDropdown = false;
      this.showFacilityTextbox = true;
      this.childPNCForm.get('referralLoationOtherInfant').reset();
      this.childPNCForm
        .get('referralLoationOtherInfant')
        .setValidators(Validators.required);
      this.childPNCForm
        .get('referralLoationOtherInfant')
        .updateValueAndValidity();
      this.childPNCForm.controls['referralLoationOtherInfant'].setValue(
        this.infantPNC[index].referralLoationOtherInfant
      );
    }
  }

  //****************************************Infant Danger Sign MultipleSelection************************************** */
  settingsInfantDangerSign = {
    text: 'Select',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: 'multidropdown',
    enableCheckAll: false,
    clearAll: false,
    autoUnselect: true,
    limitSelection: 100,
  };

  onItemSelectInfantDangerSign(item: any) {
    debugger;

    console.log(item);
    console.log(this.selectedInfantDangerSign);
    console.log(this.selectedInfantDangerSign.length);

    if (item.id == 'Z') {
      this.showInfantDangerSignOther = true;

      this.childPNCForm
        .get('dangerSignInfantOther')
        .setValidators([
          Validators.required,
          Validators.pattern('^[A-Za-z ]{0,50}$'),
        ]);
      this.childPNCForm.get('dangerSignInfantOther').updateValueAndValidity();
    } else if (item.id == 'Y') {
      this.childPNCForm.get('dangerSignInfantOther').clearValidators(); // or clearValidators()
      this.childPNCForm.get('dangerSignInfantOther').updateValueAndValidity();
      this.showInfantDangerSignOther = false;
      this.selectedInfantDangerSign = [{ id: 'Y', itemName: 'None' }];

      this.settingsInfantDangerSign = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'myclass custom-class',
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 1,
      };
    }
  }

  OnItemDeSelectInfantDangerSign(item: any) {
    console.log(item);
    console.log(this.selectedInfantDangerSign);
    debugger;

    if (item.id == 'Z') {
      this.childPNCForm.get('dangerSignInfantOther').reset();
      this.childPNCForm.get('dangerSignInfantOther').clearValidators(); // or clearValidators()
      this.childPNCForm.get('dangerSignInfantOther').updateValueAndValidity();
      this.showInfantDangerSignOther = false;
      this.settingsInfantDangerSign = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'myclass custom-class',
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
      };
    } else if (item.id == 'Y') {
      this.settingsInfantDangerSign = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'myclass custom-class',
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
      };
    }
  }

  //****************************************Infant death Reason MultipleSelection************************************** */
  settingsInfantDeathReason = {
    text: 'Select',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: 'multidropdown',
    enableCheckAll: false,
    clearAll: false,
    autoUnselect: true,
    limitSelection: 100,
    disabled: false,
  };

  onItemSelectInfantDeathReason(item: any) {
    console.log(item);
    console.log(this.selectedInfantDangerSign);

    if (item.id == 'Z') {
      this.showInfantDeathReason = true;

      this.childPNCForm
        .get('infantDeathReasonOther')
        .setValidators([
          Validators.required,
          Validators.pattern('^[A-Za-z ]{0,50}$'),
        ]);
      this.childPNCForm.get('infantDeathReasonOther').updateValueAndValidity();
    } else {
      this.settingsInfantDeathReason = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'myclass custom-class',
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
        disabled: false,
      };
    }
  }

  onSelectAll(items: any) {
    alert('select all');
    console.log(items);
    console.log('all select --------------');
    console.log(this.selectedInfantDangerSign);
  }

  OnItemDeSelectInfantDeathReason(item: any) {
    console.log(item);
    console.log(this.selectedInfantDangerSign);

    if (item.id == 'Z') {
      this.childPNCForm.get('infantDeathReasonOther').reset();
      this.childPNCForm.get('infantDeathReasonOther').clearValidators(); // or clearValidators()
      this.childPNCForm.get('infantDeathReasonOther').updateValueAndValidity();
      this.showInfantDeathReason = false;
      this.settingsInfantDeathReason = {
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'myclass custom-class',
        enableCheckAll: false,
        clearAll: false,
        autoUnselect: true,
        limitSelection: 100,
        disabled: false,
      };
    }
  }

  //****************************************Infant death Reason MultipleSelection************************************** */
}
