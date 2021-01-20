import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, Form, ValidatorFn, AbstractControl } from '@angular/forms';
import { TokenStorageService } from 'src/app/Core/service/token/tokenstoreage.service';
import { HierarchyModel } from '../../Core/Model/hierarchyModel';
import { BackendAPIService } from '../service/backend-api.service';

@Component({
  selector: 'app-child-registration',
  templateUrl: './child-registration.component.html',
  styleUrls: ['./child-registration.component.css']
})
export class ChildRegistrationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private backendApiService: BackendAPIService,private http: HttpClient, private tokenservice: TokenStorageService, public datepipe: DatePipe) { }

  healthProviderANM:Array<any>;
  healthProviderASHA:Array<any>;
  healthProviderMPW: Array<any>;
  religions:Array<any>;
  submitted: boolean = false
  whosemobile:Array<any>
  showFacilityDropdown:boolean=true;
  showFacilityTextbox:boolean=false;
  healthPHC:Array<any>

  ngOnInit(): void {
    this.whosemobile = 
    [{ id: 'W', whosemobile: 'Mother'},
     { id: 'H', whosemobile: 'Father'},
     { id: 'N', whosemobile: 'Others'},];

    this.createForm();
    this.getReligions();
  }
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

    if (this.selectedSubCentre !==undefined) {
      

      this.fetchHealthProviderOnSubcentre(this.selectedSubCentre);
    }


    
  }

  minDate = { year: 2011, month: 4, day: 1 };
  maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  childRegistrationForm: FormGroup;



  createForm() {
    this.childRegistrationForm = this.formBuilder.group({
      anmId: new FormControl('',Validators.required),
      ashaId:new FormControl('',Validators.required),
      mpwId:new FormControl('',Validators.required),
      dateOfRegistration:new FormControl('',Validators.required),
      dateOfBirth:new FormControl('',Validators.required),
      firstName:new FormControl('',[Validators.required,Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator]),
      middleName:new FormControl('',[Validators.required,Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator] ),
      lastName:new FormControl('',[Validators.required,Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator]),
      birthCerificateNo:new FormControl('',Validators.pattern("^[ A-Za-z0-9_@.#&+-,-(/)]{0,50}$")),
      sex:new FormControl('',Validators.required),
      infantWeight:new FormControl('',[Validators.required, Validators.pattern("^[0-9 \.]+$"), this.infantWeightValidation()] ),
      firstNameM:new FormControl('',[Validators.required,Validators.required,Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator]),
      middleNameM:new FormControl('',[Validators.required,Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator] ),
      lastNameM:new FormControl('',[Validators.required,Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator]),
      religion:new FormControl(''),
      caste:new FormControl(''),
      firstNameH:new FormControl('',[Validators.required,Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator]),
      middleNameH:new FormControl('',[Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator] ),
      lastNameH:new FormControl('',[Validators.pattern("^[A-Z, a-z ]{0,50}$"),this.noWhitespaceValidator]),
      mobile: new FormControl('', [Validators.required,Validators.pattern('[6-9]{1}[0-9]{9}$'),this.patternMobValidator()]),
      whoseMobile:new FormControl('',Validators.required),
      HusbandNA:new FormControl(''),
      aAdhaarDisable:new FormControl(''),
      adharNumber:new FormControl('',[Validators.pattern('[1-9]{1}[0-9]{11}$')]),
      facilityName:new FormControl('',Validators.required), 
      rchIdMother:new FormControl('',[Validators.required,Validators.pattern('[1]{1}[0-9]{11}$')])    


     


   }) }

   submitForm(childRegistrationForm){
  alert("inside submit") 

  this.findInvalidControls()    
  this.submitted = true;

  alert("inside submit")

  if (this.childRegistrationForm.invalid){
    return; 
  } 
  
  
  alert("inside submit")

  console.log(childRegistrationForm)

  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.childRegistrationForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log(invalid)
    return invalid;
}

  patternMobValidator(): ValidatorFn { 
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
	  
    
   let valid: number;
	 
	
	 
	 if(control.value=='9999999999' || control.value=='8888888888' || control.value=='7777777777' ||control.value=='6666666666')
	 {
		valid =0;   
	 }
	 else{
		valid =1; 
	 }
    
      return valid ? null : { pattern: true };
    };
  }

  get f() {

    return this.childRegistrationForm.controls;
  }

  fetchHealthProviderOnSubcentre(subcentre_code: any) {
    console.log("inside health provider subcentre method")
    this.getHealthProviderByANMType(subcentre_code, 2)
    this.getHealthProviderByASHAType(subcentre_code, 1)
    this.getHealthProviderByMPWType(subcentre_code, 5)
   

  }

  getHealthProviderByANMType(subcentre: number, typeid: number): void {
    this.backendApiService.getHealthProvideratSubcentre(subcentre, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);
      this.healthProviderANM = response;
      if(this.healthProviderANM.length <1){
        this.healthProviderANM=[ {id: 0, name: "Not Available", contact_No: ""}]
      }

    })
  }

  getHealthProviderByASHAType(subcentre: number, typeid: number): void {
    this.backendApiService.getHealthProvideratSubcentre(subcentre, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log("asha list");
      console.log(response);
      this.healthProviderASHA = response;
      if(this.healthProviderASHA.length <1){
        this.healthProviderASHA=[ {id: 0, name: "Not Available", contact_No: ""}]
      }

    })
  }

  getHealthProviderByMPWType(subcentre: number, typeid: number): void {
    this.backendApiService.getHealthProvideratSubcentre(subcentre, typeid).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);
      this.healthProviderMPW = response;
      if(this.healthProviderMPW.length <1){
        this.healthProviderMPW=[ {id: 0, name: "Not Available", contact_No: ""}]
      }


    })
  }

  infantWeightValidation(): ValidatorFn { 
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
	  
    
   let valid: number;
	 
	
	 
	 if(control.value>10.0||control.value<0.5)
	 {
		valid =0;   
	 }
	 else{
		valid =1; 
	 }
    
      return valid ? null : { pattern: true };
    };
  }

  getReligions(): void {
    this.backendApiService.getReligionsAPI().subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      // console.log(response);
      this.religions = response;
    })
  }

  
  getHealthFacility(block: number, ftype: number): void {
    this.backendApiService.getHealthPhcbyTypeBlock(block,ftype).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      this.healthPHC = response;
      
    })
  }

  fatherDisable(e) {
    if (e.target.checked == true) {
    
      this.whosemobile = 
    [{ id: 'W', whosemobile: 'Mother'},
     { id: 'N', whosemobile: 'Others'},];


  this.childRegistrationForm.controls['firstNameH'].setValue('');  
      this.childRegistrationForm.controls['firstNameH'].disable();
      this.childRegistrationForm.controls['firstNameH'].clearValidators()
      this.childRegistrationForm.controls['firstNameH'].updateValueAndValidity();

      this.childRegistrationForm.controls['middleNameH'].setValue('');  
      this.childRegistrationForm.controls['middleNameH'].disable();

      this.childRegistrationForm.controls['lastNameH'].setValue('');  
      this.childRegistrationForm.controls['lastNameH'].disable();

    }
    else{
      this.whosemobile = 
    [{ id: 'W', whosemobile: 'Mother'},
     { id: 'H', whosemobile: 'Father'},
     { id: 'N', whosemobile: 'Others'},];
      this.childRegistrationForm.controls['firstNameH'].enable();
      this.childRegistrationForm.controls['middleNameH'].enable();
      this.childRegistrationForm.controls['lastNameH'].enable();
      this.childRegistrationForm.controls['firstNameH'].setValidators(Validators.required);
      this.childRegistrationForm.controls['firstNameH'].updateValueAndValidity();
   
     
    }
  }

  aAdharDisable(e){
    if (e.target.checked == true) {
      this.childRegistrationForm.controls['adharNumber'].disable();
      this.childRegistrationForm.controls['adharNumber'].clearValidators()
      this.childRegistrationForm.controls['adharNumber'].updateValueAndValidity();

    }
    else{
      this.childRegistrationForm.controls['adharNumber'].enable();
      this.childRegistrationForm.controls['adharNumber'].setValidators([Validators.pattern('')]);
      this.childRegistrationForm.controls['adharNumber'].updateValueAndValidity();

    }


  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;

    if (!control.value) {
      return null;
    }

    const isValid = !isWhitespace;
    return isValid ? null : { 'pattern': true };
  }


}
