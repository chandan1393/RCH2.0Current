import { Component, OnInit } from '@angular/core';
import { BackendAPIService } from '../service/backend-api.service';
import { HierarchyModel } from '../../Core/Model/hierarchyModel';
import { FormArray, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-childmedical',
  templateUrl: './childmedical.component.html',
  styleUrls: ['./childmedical.component.css']
})
export class ChildmedicalComponent implements OnInit {

  constructor(private fb: FormBuilder, private backendApiService: BackendAPIService) { }

  childmedicalForm: FormGroup;
  submitted = false;
  healthProviderANM: Array<any>;
  healthProviderASHA: Array<any>;

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

  Show_ORSZinc: boolean = false;Show_Antibiotic: boolean = false;

  minDate = { year: 2011, month: 4, day: 1 };
  maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  parentState; parentDistrict; parentTaluka; parentBlock; parentFacility; parentSubcenter; parentVillage; parentFacilityType;
  parentStateName; parentDistrictName; parentTalukaName; parentBlockName; parentFacilityName; parentSubcenterName; parentVillageName;


  ngOnInit(): void {
    this.createForm();
    this.fetchHealthProviderOnSubcentreAndVillage();
    //this.getChilddetails(104000001887,1)
  }

  createForm() {
    this.childmedicalForm = this.fb.group({
      ChildRCHID: (''),
      Childname: (''),
      ChildDOB: (''),
      ChildSex: (''),
      PWRCHID: (''),
      PWname: (''),
      PWage: (''),
      mobilenumber: (''),
      healthproviderName: ['', [Validators.required]],
      ASHA: ['', [Validators.required]],
      ChildWeight: ['', [ Validators.min(3), Validators.max(15), Validators.pattern('[0-9]{1}[0-5]*$')]],
      VisitDate:(''),
      Diarrhoea:(''),
      ORS:(''),
      Zinc:(''),
      Antibiotic:(''),
      Pneumonia:(''),
      ChildReferred:['', [Validators.required]],
    },
   
  );


}
// Save *********************************
get f() { return this.childmedicalForm.controls; }

onSubmit(childmedicalForm) {
  this.submitted = true;
  if (this.childmedicalForm.invalid) {
    return;
  }
}


//****************************** */
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


  }

  //******************************************************************************************************** */
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
    DiarrhoeaChange(event){
      if (event.target.value == 1) {
        this.Show_ORSZinc = true
        this.childmedicalForm.get('ORS').setValidators(Validators.required);
        this.childmedicalForm.get('ORS').updateValueAndValidity();
        this.childmedicalForm.get('Zinc').setValidators(Validators.required);
        this.childmedicalForm.get('Zinc').updateValueAndValidity();
      }
      else{
        this.Show_ORSZinc = false
        this.childmedicalForm.get('ORS').setValidators([]);
        this.childmedicalForm.get('ORS').updateValueAndValidity();
        this.childmedicalForm.get('Zinc').setValidators([]);
        this.childmedicalForm.get('Zinc').updateValueAndValidity();
      }
    }

    PneumoniaChange(event){
      if (event.target.value == 1) {
        this.Show_Antibiotic = true
        this.childmedicalForm.get('Antibiotic').setValidators(Validators.required);
        this.childmedicalForm.get('Antibiotic').updateValueAndValidity();
      }
      else{
        this.Show_Antibiotic = false
        this.childmedicalForm.get('Antibiotic').setValidators([]);
        this.childmedicalForm.get('Antibiotic').updateValueAndValidity();
      }
    }
    keydownfunction(e) {
      var charCode = e.keyCode;
      //alert(charCode)
      var invalidChars = [
        "-",
        "+",
        "e",
        "@",
        "_",
        "!", "#", "$", "%", "^", "&", "*", "(", ")"
      ];
  
      if (invalidChars.includes(e.key)) {
        e.preventDefault();
      }
      ////debugger
      if ((charCode >= 96 && charCode <= 105) || (charCode >= 48 && charCode <= 57) || charCode == 46 || charCode == 8 || charCode == 9) {
  
        //alert(charCode)
      }
      else {
        e.preventDefault();
        // alert('hi')
      }
    }

    // Bind Child details----------------------
    getChilddetails(registrationId: number, caseno: number) {
      // debugger
      this.backendApiService.getBeneficiary(registrationId, caseno).subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        console.log(response);
        this.bindChildform(response);
      })
    }
    bindChildform(child) {
      //debugger
      this.childmedicalForm.controls['ChildRCHID'].setValue(child.registrationNo)
      this.childmedicalForm.controls['Childname'].setValue(child.beneficiaryNmae)
      this.childmedicalForm.controls['Husbandname'].setValue(child.husbandName)
      
      this.childmedicalForm.controls['ChildDOB'].setValue((child.ecRegDate).substr(0, 10))
      this.childmedicalForm.controls['ChildSex'].setValue(child.age)
      this.childmedicalForm.controls['PWRCHID'].setValue(child.mobileNumber)
      this.childmedicalForm.controls['PWname'].setValue(child.lmpDate)
      this.childmedicalForm.controls['PWage'].setValue(child.lastANCVisitDate)
      this.childmedicalForm.controls['mobilenumber'].setValue(child.lastANCVisitDate)

    

      this.parentState = 4;
      this.parentDistrict = child.districtCode;
      // parentTaluka=pg.; 
      this.parentBlock = child.healthBlockCode;
      this.parentFacility = child.healthFacilityCode;
      this.parentSubcenter = child.healthSubFacilityCode;
      this.parentVillage = child.villageCode;
      this.parentFacilityType = child.healthFacilityType;
      this.parentStateName = 'Chandigarh';
      this.parentDistrictName = child.districtName;
      //parentTalukaName; 
      this.parentBlockName = child.healthBlockName;
      this.parentFacilityName = child.healthFacilityName;
      this.parentSubcenterName = child.healthSubFacilityName;
      this.parentVillageName = child.villageName;

    }
    //--------------------------------------
}
