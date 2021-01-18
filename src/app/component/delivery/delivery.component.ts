import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl } from '@angular/forms';
import { HierarchyModel } from 'src/app/Core/Model/hierarchyModel';
import { BackendAPIService } from '../service/backend-api.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private backendApiService: BackendAPIService) { }



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
  submitted: boolean = false;
  rchId: number;
  msg: string;
  showNotFoundMsg: boolean = false;
  responseLength : number
  editFlag : Boolean = false;
  beneficiaryDetails : Array<any>;





  ngOnInit(): void {

    
  this.DeliveryForm();
  this.getBeneficiaryDetails(104000147743,1);

  
  }



  DeliveryForm() {
    this.deliveryForm = this.formBuilder.group(
      {
        
   registrationNo :  new FormControl(''),
   womanName: new FormControl(''),
   husbandName : new FormControl(''),
   regisDate : new FormControl(''),
   womenAge : new FormControl(''),
   mobileNo : new FormControl(''),
   lmpDate : new FormControl(''),
   lastAncVisitDate : new FormControl(''),
   healthProviderID: new FormControl(''),
   ashaID          : new FormControl(''),
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
   deliveryDate :   new FormControl(''),
   deliveryPlace :  new FormControl(''),
   deliveryLocation :   new FormControl(''),
   deliveryConductedBy :  new FormControl(''),
   deliveryConductedOther :   new FormControl(''),
   deliveryType :  new FormControl(''),
   deliveryComp1 :   new FormControl(''),
   deliveryComp2 :   new FormControl(''),
   deliveryComp3 :  new FormControl(''),
   deliveryComp4 :   new FormControl(''),
   deathCause : new FormControl(''),
   deathOther :   new FormControl(''),
   deliveryOutcomes : new FormControl(''),
   dischargeDate :   new FormControl(''),
   jsyBenificiary :  new FormControl(''),
   jsyPaidDate :   new FormControl(''),
   jsyChequeNo :   new FormControl(''),
   anmId :  new FormControl(''),
   ashaId : new FormControl(''),
   caseNo :  new FormControl(''),
   ipAddress :   new FormControl(''),
   createdBy : new FormControl(''),
   createdOn :   new FormControl(''),
   deliveryTime :   new FormControl(''),
   dischargeTime :  new FormControl(''),
   higherFacility :   new FormControl(''),
   deliveryComp5 :   new FormControl(''),
   otherComp :   new FormControl(''),
   deliveryLocationId :  new FormControl(''),
   liveBirth :  new FormControl(''),
   stillBirth : new FormControl(''),
   deliveryComplication :  new FormControl(''),
   mobileId :  new FormControl(''),
   deliveryCompLength :  new FormControl(''),
   updatedBy : new FormControl(''),
   updatedOn :   new FormControl(''),
   sourceId : new FormControl(''),
   pretermDelivery : new FormControl(''),
   wardNo :  new FormControl(''),
   rurUrbHierarchy :  new FormControl(''),
   isIliSymptom :  new FormControl(''),
   isContactCovid :  new FormControl(''),
   covidTestDone :  new FormControl(''),
   covidTestResult :  new FormControl(''),
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
   maternalDeath :  new FormControl(''),
   maternalDeathDate :   new FormControl(''),
   maternalDeathPlace :  new FormControl(''),
   maternalDeathLocationId :  new FormControl(''),
   maternalDeathLocation :   new FormControl(''),
   nonObstetricComplications :   new FormControl('')
      
      })

    }


    getBeneficiaryDetails(rchId : number , caseNo : number)
    {
      this.backendApiService.getHealthProvideratSubcentre(rchId, caseNo).subscribe((res: Response) => {
        let response = JSON.parse(JSON.stringify(res));
        this.beneficiaryDetails = response[0];
        this.deliveryForm.controls['registrationNo'].setValue(response[0].registrationNo);
        this.deliveryForm.controls['womanName'].setValue(response[0].beneficiaryNmae);
        this.deliveryForm.controls['husbandName'].setValue(response[0].husbandName);
        this.deliveryForm.controls['regisDate'].setValue(response[0].ecRegDate);
        this.deliveryForm.controls['womenAge'].setValue(response[0].age);
        this.deliveryForm.controls['mobileNo'].setValue(response[0].mobileNumber);
        this.deliveryForm.controls['lmpDate'].setValue(response[0].lmpDate);
        this.deliveryForm.controls['lastANCVisitDate'].setValue(response[0].lastAncVisitDate);
        console.log(response);
  
    })
  }






  submitDelivery(deliveryForm : FormGroup)
  {
    console.log( "Inside Delivery Submit"  )
    alert( "Delivery cant be saved ")
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

   //  this.getHealthProviderAnm( this.hierarchyMobj.subfacilityid, 2);
   //  this.getHealthProviderAsha( this.hierarchyMobj.subfacilityid, 1);

}

    }}






}
