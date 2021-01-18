import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BackendAPIService } from '../service/backend-api.service';
import { FormGroup, FormBuilder, FormControl, Validators, Form} from '@angular/forms';
import { HierarchyModel } from '../../Core/Model/hierarchyModel';
import { RhierarchyService } from '../../Core/service/rhierarchy/rhierarchy.service'
import { TokenStorageService } from 'src/app/Core/service/token/tokenstoreage.service';

@Component({
  selector: 'app-reporthierarchy',
  templateUrl: './reporthierarchy.component.html',
  styleUrls: ['./reporthierarchy.component.css']
})
export class ReporthierarchyComponent implements OnInit {

  constructor(private backendApiService: BackendAPIService, private formBuilder: FormBuilder,private hierarchyService: RhierarchyService, private tokenservice: TokenStorageService) { }

  @Output() usehierarchy: EventEmitter<any> = new EventEmitter()
  
  hierarchyMobj = new HierarchyModel();
  currenthierarchy=new HierarchyModel();
  RHForm: FormGroup;

  usertypeid: number; statename: string; districtName: string; healthBlockName: string; facilityName: string;
  stateid: number; distictid: number; blockid: number;healthPHCid:number;subfacilityid:number;facilitytypeid:string;

  div2: boolean = false;
  div1: boolean = true;
  RuralUrban: string ="R";
  selectedward =null; 
  facilityExists: boolean=false;
  SubfacilityExists: boolean=false;
  villageExists: boolean=false;

  statearray: Array<any>;
  districtarray: Array<any>;
  healthBlock: Array<any>;
  healthPHC: Array<any>;
  healthSubcentres: Array<any>;
  talukas: Array<any>;
  village: Array<any>;
  VillageWiseProfile: Array<any>;
  FacilityType: Array<any>;

  ngOnInit(): void {
    this.createForm();
  
    this.usertypeid = this.tokenservice.utypeId;
   /// this.statename = this.tokenservice.statename;
    this.stateid = this.tokenservice.stateid;
    this.distictid = this.tokenservice.districtid;
    this.blockid = this.tokenservice.healthblockid;
   // this.districtName = this.tokenservice.districtname;
  //  this.healthBlockName = this.tokenservice.healthblockname;
  //  this.facilityName = this.tokenservice.facilityname;
    this.healthPHCid=this.tokenservice.phcId
    this.facilitytypeid=this.tokenservice.facilityType;
    this.subfacilityid=this.tokenservice.SubCentre
    
   // this.hierarchyMobj.RuralUrban="R"
    
    debugger
   // this.checkuser();
    this.currenthierarchy=this.hierarchyService.getRHierarchy();
    //this.bindHierarchy();
   if(this.currenthierarchy==undefined)
    {
      this.checkuser();
    }
    else{
      this.bindHierarchy();
    } 
    this.getStateData();
   // this.ChangeState();

  }
   createForm() {
    this.RHForm = this.formBuilder.group({
      state: new FormControl({ value: 4, disabled: true }),
      district: new FormControl(''),
      taluka: new FormControl({ value: '', disabled: true }),
      healthblock: new FormControl(''), 
      facilitytype: new FormControl(''),  
      facility: new FormControl(''),
      SubFacility: new FormControl(''),  
      village: new FormControl(''),
    })}

    bindHierarchy()
    {
     ////debugger
      this.checkuser();
      if(this.currenthierarchy.stateid>0)
      {
        //this.selectedState = ;
        this.RHForm.controls['state'].setValue(this.currenthierarchy.stateid)
        this.ChangeState();
      }
      if(this.currenthierarchy.districtid>0)
      { this.RHForm.controls['district'].setValue(this.currenthierarchy.districtid)
        //this.selectedDistrict = ;
        this.changeDistrict();
      }
      if(this.currenthierarchy.blockid>0)
      {this.RHForm.controls['healthblock'].setValue(this.currenthierarchy.blockid)
        //this.selectedHealthBlock = ;
         this.changeBlock();
      }
      if(this.currenthierarchy.facilitytypeid>0)
      {
        this.RHForm.controls['facilitytype'].setValue(this.currenthierarchy.facilitytypeid)
        //this.selectedFacilityType=
        this.changeFacilityType();
      }
      if(this.currenthierarchy.facilityid>0)
      {this.RHForm.controls['facility'].setValue(this.currenthierarchy.facilityid)
       // this.selectedFacilityCode=
        this.changeFacility();
      }
      if(this.currenthierarchy.subfacilityid>0)
      {     
        this.RHForm.controls['SubFacility'].setValue(this.currenthierarchy.subfacilityid)
        //this.selectedSubCentre=
        this.changeSubFacility();
      }
      if(this.currenthierarchy.villageid>0)
      {    
        this.RHForm.controls['village'].setValue(this.currenthierarchy.villageid)
        this.changeVillage()
      }   
      if(this.currenthierarchy.talukacode !="")
      {
        this.RHForm.controls['taluka'].setValue(this.currenthierarchy.talukacode)
      }
     
     this.usehierarchy.emit(this.hierarchyMobj)
    } 

  changeUrban() { 
    this.div2 = true;
  this.div1 = false;
this.RuralUrban="U";
this.selectedward=0
}

changeRural() {
     this.div2 = false;
  this.div1 = true;
this.RuralUrban="R"
this.selectedward=null;
}

getStateData(): void {
  this.backendApiService.getStateAPI().subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
   this.statearray = response;
  })
}
getDistrictData(id: string): void {
  this.backendApiService.getDistrictAPI(id).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
       this.districtarray = response;

  })
}
getHealthBlockData(id: string): void {
  this.backendApiService.getHealthBlocksAPI(id).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
   this.healthBlock = response;
   this.RHForm.controls['taluka'].setValue(this.healthBlock[0].tcode);
   
    //alert(this.healthBlock[0].tcode)
   
  })
}
getFacilityType(): void {
  this.backendApiService.getFacilityType().subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
    this.FacilityType = response;
  })
}
getHealthPHCtypeblock(block: number, ftype: number): void {
  this.backendApiService.getHealthPhcbyTypeBlock(block, ftype).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
    this.healthPHC = response;
    //debugger
    if(response.length ==0){

this.facilityExists=true;
    }
    else
    {
      this.facilityExists=false;
    } 
  })
}
getTalukaData(id: string): void {
  this.backendApiService.getTalukasAPI(id).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
     this.talukas = response;
   /* this.selectedTaluka=response[0].tcode;
   this.hierarchyMobj.talukacode=this.selectedTaluka
   this.hierarchyService.setRHierarchy(this.hierarchyMobj);
   this.usehierarchy.emit(this.hierarchyMobj) */
  })
}
getHealthPHC(id: string): void {
  this.backendApiService.getHealthPHCAPI(id).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
   this.healthPHC = response;
    /*  this.selectedTaluka=this.healthPHC[0].tcode
    this.hierarchyMobj.talukacode=this.selectedTaluka
    this.hierarchyService.setRHierarchy(this.hierarchyMobj);
    this.usehierarchy.emit(this.hierarchyMobj) */
  })
}

getHealthSubCentres(id: string): void {

  this.backendApiService.getHealthSubcentersAPI(id).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
    this.healthSubcentres = response;
    if(response.length ==0){

      this.SubfacilityExists=true;
            }
            else
            {
              this.SubfacilityExists=false;
            } 
  })
}
getVillageSubcenter(subcentre: number): void {
  //debugger
  this.backendApiService.getVillage(subcentre).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
    this.village = response;
    // if(response.length ==0){

    //   this.villageExists=true;
    //   this.hierarchyMobj.villageid=0
    //   this.usehierarchy.emit(this.hierarchyMobj)
    //         }
    //         else
    //         {
    //           this.villageExists=false;
    //         }
  })
}
getVillageData(id: number): void {
  this.backendApiService.getVillageAPI(id).subscribe((res: Response) => {
    let response = JSON.parse(JSON.stringify(res));
    this.village = response;

  })
}

ChangeState(){
  this.getDistrictData(this.RHForm.controls['state'].value);

  this.hierarchyMobj.stateid=this.RHForm.controls['state'].value
  this.hierarchyMobj.districtid=undefined 
  this.hierarchyMobj.blockid=undefined 
  this.hierarchyMobj.facilityid = undefined 
  this.hierarchyMobj.subfacilityid=undefined 
  this.hierarchyMobj.villageid=undefined 
  this.hierarchyService.setRHierarchy(this.hierarchyMobj);
      this.usehierarchy.emit(this.hierarchyMobj)
}

changeDistrict(){
  this.talukas=null
  this.healthBlock=null
  this.FacilityType=null
  this.healthPHC=null
  this.healthSubcentres=null;
  this.village=null;

  this.RHForm.controls['healthblock'].setValue('')

  if(this.RHForm.controls['district'].value ==''){
    this.talukas=null
    this.healthBlock=null
   
  }
  else{
  this.getTalukaData(this.RHForm.controls['district'].value);
  this.getHealthBlockData(this.RHForm.controls['district'].value); 
 

this.hierarchyMobj.districtid=this.RHForm.controls['district'].value;
this.hierarchyMobj.talukacode=this.RHForm.controls['taluka'].value;
this.hierarchyMobj.blockid=undefined 
this.hierarchyMobj.facilityid = undefined 
this.hierarchyMobj.subfacilityid=undefined 
this.hierarchyMobj.villageid=undefined 

    
this.hierarchyService.setRHierarchy(this.hierarchyMobj);

  this.usehierarchy.emit(this.hierarchyMobj)
  }
 
}
changeBlock(){
  this.RHForm.controls['facilitytype'].setValue('')
  this.FacilityType=null
    this.healthPHC=null
    this.healthSubcentres=null;
    this.village=null;

  if(this.RHForm.controls['healthblock'].value ==''){
    this.FacilityType=null
    this.healthPHC=null
   
  }
  else{
  this.getFacilityType();
  
  //this.getHealthPHCtypeblock(this.selectedHealthBlock,this.selectedFacilityType); 
  this.hierarchyMobj.blockid=this.RHForm.controls['healthblock'].value
   // this.hierarchyMobj.facilityid=this.selectedFacilityCode;
   this.hierarchyMobj.facilityid = undefined 
   this.hierarchyMobj.subfacilityid=undefined 
   this.hierarchyMobj.villageid=undefined 
   this.hierarchyService.setRHierarchy(this.hierarchyMobj);
    this.usehierarchy.emit(this.hierarchyMobj)
  }
}
changeFacilityType(){
  this.RHForm.controls['facility'].setValue('')
  this.healthPHC=null
  this.healthSubcentres=null;
  this.village=null;
  this.getHealthPHCtypeblock(this.RHForm.controls['healthblock'].value, this.RHForm.controls['facilitytype'].value);
 // this.selectedFacilityCode=""
  //this.selectedSubCentre=""
 
 // this.selectedFacilityCode=""
  this.hierarchyMobj.blockid=this.RHForm.controls['healthblock'].value
  this.hierarchyMobj.facilitytypeid=this.RHForm.controls['facilitytype'].value;
  this.hierarchyMobj.facilityid = undefined
  this.hierarchyMobj.subfacilityid=undefined
  this.hierarchyMobj.villageid=undefined
  this.usehierarchy.emit(this.hierarchyMobj)
}
changeFacility(){
  this.RHForm.controls['SubFacility'].setValue('')
  this.healthSubcentres=null;
  this.village=null;

  this.getHealthSubCentres(this.RHForm.controls['facility'].value);

  this.hierarchyMobj.blockid=this.RHForm.controls['healthblock'].value
  this.hierarchyMobj.facilitytypeid=this.RHForm.controls['facilitytype'].value
  this.hierarchyMobj.facilityid = this.RHForm.controls['facility'].value
  this.hierarchyMobj.subfacilityid=undefined 
  this.hierarchyMobj.villageid=undefined 
  this.hierarchyService.setRHierarchy(this.hierarchyMobj);
  this.usehierarchy.emit(this.hierarchyMobj)
  
}
changeSubFacility(){
  this.village=null;
  this.RHForm.controls['village'].setValue('')
 // this.RHForm.controls['village'].setValue('')
   // this.selectedVillage=undefined
  this.getVillageSubcenter(this.RHForm.controls['SubFacility'].value);

  this.hierarchyMobj.subfacilityid = this.RHForm.controls['SubFacility'].value
  this.hierarchyMobj.villageid=undefined
  
  this.hierarchyService.setRHierarchy(this.hierarchyMobj);
  this.usehierarchy.emit(this.hierarchyMobj)
}
changeVillage(){
  this.hierarchyMobj.villageid=this.RHForm.controls['village'].value
  this.hierarchyService.setRHierarchy(this.hierarchyMobj);
  this.usehierarchy.emit(this.hierarchyMobj)
}
checkuser(): void {
  debugger
      if (this.usertypeid == 1) {
        this.RHForm.controls['state'].setValue(this.stateid)
        //this.selectedState = this.stateid;
        this.hierarchyMobj.stateid = this.RHForm.controls['state'].value;
        this.ChangeState();
       
      }
      else if (this.usertypeid == 2) {
        this.RHForm.controls['state'].setValue(this.stateid)
        this.ChangeState();
        this.RHForm.controls['state'].disable()
        this.hierarchyMobj.stateid = this.RHForm.controls['state'].value;
        //this.stateDisabled = true;
        //this.hierarchyMobj.stateid = this.selectedState;
      }
      else if (this.usertypeid == 3) {
        this.RHForm.controls['state'].setValue(this.stateid)
        this.ChangeState();
        this.RHForm.controls['state'].disable()

        this.RHForm.controls['district'].setValue(this.distictid)
        this.changeDistrict();
        this.RHForm.controls['district'].disable()

        this.hierarchyMobj.stateid = this.RHForm.controls['state'].value;
        this.hierarchyMobj.districtid = this.RHForm.controls['district'].value;
        this.hierarchyMobj.talukacode=String(this.RHForm.controls['taluka'].value);
        
      }
      else if (this.usertypeid == 4) {
        this.RHForm.controls['state'].setValue(this.stateid)
        this.ChangeState();
        this.RHForm.controls['state'].disable()

        this.RHForm.controls['district'].setValue(this.distictid)
        this.changeDistrict();
        this.RHForm.controls['district'].disable()

        this.RHForm.controls['healthblock'].setValue(this.blockid)
        this.changeBlock();
        this.RHForm.controls['healthblock'].disable()
  
       // let data = { state: this.selectedState, district: this.selectedDistrict, block: this.selectedHealthBlock, facility: "", subfacility: "", village: "" }
       this.hierarchyMobj.stateid = this.RHForm.controls['state'].value;
       this.hierarchyMobj.districtid = this.RHForm.controls['district'].value;
       this.hierarchyMobj.talukacode=String(this.RHForm.controls['taluka'].value);
        this.hierarchyMobj.blockid = this.RHForm.controls['healthblock'].value;
        
  
      }
      else if (this.usertypeid == 5) {
       //debugger
       this.RHForm.controls['state'].setValue(this.stateid)
       this.ChangeState();
       this.RHForm.controls['state'].disable()

       this.RHForm.controls['district'].setValue(this.distictid)
       this.changeDistrict();
       this.RHForm.controls['district'].disable()

       this.RHForm.controls['healthblock'].setValue(this.blockid)
       this.changeBlock();
       this.RHForm.controls['healthblock'].disable()

       this.RHForm.controls['facilitytype'].setValue(this.facilitytypeid)
       this.changeFacilityType();
       this.RHForm.controls['facilitytype'].disable()

       this.RHForm.controls['facility'].setValue(this.healthPHCid)
       this.changeFacility();
       this.RHForm.controls['facility'].disable()


       this.hierarchyMobj.stateid = this.RHForm.controls['state'].value;
       this.hierarchyMobj.districtid = this.RHForm.controls['district'].value;
       this.hierarchyMobj.talukacode=String(this.RHForm.controls['taluka'].value);
        this.hierarchyMobj.blockid = this.RHForm.controls['healthblock'].value;
        this.hierarchyMobj.facilitytypeid=this.RHForm.controls['facilitytype'].value;
        this.hierarchyMobj.facilityid=this.RHForm.controls['facility'].value;
      }
      else if (this.usertypeid == 6) {
        this.RHForm.controls['state'].setValue(this.stateid)
        this.ChangeState();
        this.RHForm.controls['state'].disable()
 
        this.RHForm.controls['district'].setValue(this.distictid)
        this.changeDistrict();
        this.RHForm.controls['district'].disable()
 
        this.RHForm.controls['healthblock'].setValue(this.blockid)
        this.changeBlock();
        this.RHForm.controls['healthblock'].disable()
 
        this.RHForm.controls['facilitytype'].setValue(this.facilitytypeid)
        this.changeFacilityType();
        this.RHForm.controls['facilitytype'].disable()
 
        this.RHForm.controls['facility'].setValue(this.healthPHCid)
        this.changeFacility();
        this.RHForm.controls['facility'].disable()

       this.RHForm.controls['SubFacility'].setValue(this.healthSubcentres)
        this.changeSubFacility();
        this.RHForm.controls['SubFacility'].disable()

        this.hierarchyMobj.stateid = this.RHForm.controls['state'].value;
        this.hierarchyMobj.districtid = this.RHForm.controls['district'].value;
        this.hierarchyMobj.talukacode=String(this.RHForm.controls['taluka'].value);
         this.hierarchyMobj.blockid = this.RHForm.controls['healthblock'].value;
         this.hierarchyMobj.facilitytypeid=this.RHForm.controls['facilitytype'].value;
         this.hierarchyMobj.facilityid=this.RHForm.controls['facility'].value;
        this.hierarchyMobj.subfacilityid=this.RHForm.controls['SubFacility'].value
      }
      else { }
      this.hierarchyMobj.RuralUrban=this.RuralUrban
      this.hierarchyMobj.ward=this.selectedward
     // this.hierarchyMobj.talukacode=this.RHForm.controls['taluka'].value
      this.hierarchyService.setRHierarchy(this.hierarchyMobj);
      this.usehierarchy.emit(this.hierarchyMobj)
     
    }
}
