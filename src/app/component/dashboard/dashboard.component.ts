import { Component, OnInit } from '@angular/core';
import { BackendAPIService } from '../service/backend-api.service';
import { TokenStorageService } from 'src/app/Core/service/token/tokenstoreage.service';
import{HierarchyService} from '../../Core/service/hierarchy/hierarchy.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  rdecchild: string='ECPW'
  ChildDisabled: boolean=true
  constructor(private backendApiService: BackendAPIService,private tokenservice:TokenStorageService, private hierarchyService:HierarchyService,public router: Router) { }

  ngOnInit(): void {
    this.getDetailsFromLogin()
    this.getTotalEstimatesOfThisMonth(this.stateCode,this.districtCode,this.blockCode,this.facilityCode,this.subcentreCode,this.level)
    this.getTotalEstimatesOfThisYear(this.stateCode,this.districtCode,this.blockCode,this.facilityCode,this.subcentreCode,this.level)

    this.getTotalCount(this.stateCode,this.districtCode,this.blockCode,this.facilityCode,this.subcentreCode,this.level)
  }
totalCountMonth=0
totalCountYear=0
totalEstimates=0
  stateCode
  districtCode
  blockCode
  facilityCode
  subcentreCode
  level

  getTotalCount(stateCode:number, districtCode:number,blockCode:number,facilityCode: number,subcentreCode:number,level:number): void {
    console.log(stateCode+""+districtCode+""+blockCode+""+facilityCode+""+subcentreCode+""+level)
    this.backendApiService.getTotalEstimates(stateCode,districtCode,blockCode,facilityCode,subcentreCode,level).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
      console.log(response);
      this.totalEstimates=response
      console.log("inside get method of count")
      
      })}


      getTotalEstimatesOfThisMonth(stateCode:number, districtCode:number,blockCode:number,facilityCode: number,subcentreCode:number,level:number): void {
    
        this.backendApiService.getTotalEstimatesOfThisMonth(stateCode,districtCode,blockCode,facilityCode,subcentreCode,level).subscribe((res: Response) => {
          let response = JSON.parse(JSON.stringify(res));
          console.log(response);
          this.totalCountMonth=response
          console.log("inside get method of count 1")
          
          })}

          getTotalEstimatesOfThisYear(stateCode:number, districtCode:number,blockCode:number,facilityCode: number,subcentreCode:number,level:number): void {
    
            this.backendApiService.getTotalEstimatesOfThisYear(stateCode,districtCode,blockCode,facilityCode,subcentreCode,level).subscribe((res: Response) => {
              let response = JSON.parse(JSON.stringify(res));
              console.log(response);
              this.totalCountYear=response
              console.log("inside get method of count year")
              
              })}

    getDetailsFromLogin(){
    
    
    this.level=this.tokenservice.utypeId
if(this.level==1 || this.level==2){
  this.stateCode=this.tokenservice.stateid
  this.districtCode=0
  this.blockCode=0
  this.facilityCode=0
  this.subcentreCode=0
  
}
else if(this.level==3){
  this.stateCode=this.tokenservice.stateid
  this.districtCode=this.tokenservice.districtid
  this.blockCode=0
  this.facilityCode=0
  this.subcentreCode=0
}
else if(this.level==4){
  this.stateCode=this.tokenservice.stateid
  this.districtCode=this.tokenservice.districtid
  this.blockCode=  this.tokenservice.healthblockid
  this.facilityCode=0
  this.subcentreCode=0
}

else if(this.level==5){
  this.stateCode=this.tokenservice.stateid
  this.districtCode=this.tokenservice.districtid
  this.blockCode=  this.tokenservice.healthblockid
  this.facilityCode=this.tokenservice.phcId
  this.subcentreCode=0
}

else if(this.level==6){
  this.stateCode=this.tokenservice.stateid
  this.districtCode=this.tokenservice.districtid
  this.blockCode=  this.tokenservice.healthblockid
  this.facilityCode=this.tokenservice.phcId
  this.subcentreCode=this.tokenservice.SubCentre
}


    
   

    }
    
  // Home page Search ********************************************************

  Selectrd(e){ 
    if (e.target.value == 'ECPW') {
this.rdecchild =e.target.value
    }
    else{
      this.rdecchild =e.target.value
    }
  }
  search(){
    if ((this.level == 1) || (this.level == 2) || (this.level == 3)) {
      alert('This functionality is not available for National, State and District level users')
    }
    else{
    //debugger
    const rchid = document.getElementById("searchRCHid") as HTMLInputElement;
   // const rdecchild =document.getElementById("searchRCHid") as HTMLInputElement;
    if(rchid.value ==null  || rchid.value =="")
    {
      alert('Please provide RCH Id')
    }
    else{
      if((this.rdecchild)=='ECPW' && (document.getElementById("defaultInline1") as HTMLInputElement).checked ==true){
       // alert('EC')
        //alert((rchid.value).substr(0,1))
       if(((rchid.value).substr(0,1))=='1' && ((rchid.value).length)==12){
        window.localStorage.removeItem("ECT-EC")
        window.localStorage.removeItem("HomeSearch")
          this.searchbyID(Number(rchid.value))
       }
       else{
         alert('Invalid RCH Id')
       }
      }
      else{
        alert('child')
      }
     
    }}
  }

  searchbyID(registrationId: number) {
    //debugger
    this.backendApiService.searchRegistrationNo(registrationId).subscribe((res: Response) => {
      let response = JSON.parse(JSON.stringify(res));
           console.log(response);
          // console.log('hghjghjgj')

            if(response.status==false){
              alert('No Data Found')
           }
           else{
             // response.
             //window.localStorage.setItem("rchid", "HomeSearch")
             window.localStorage.setItem("HomeSearch",String(response.data[0].registration_no))

             if(response.data[0].page_code=="EC"){
              this.router.navigate(['home/ecprofile'])
             }
             else if(response.data[0].page_code=="ECT"){
              window.localStorage.setItem("PageCode",'HOMESEARCH')
              this.router.navigate(['home/ectrack'])
             }
             else{
              alert("Coming soon")
            }

           } 
  


    }
    )
  }

  // ************************************************************

    }