import { Injectable } from '@angular/core';
import { HierarchyModel } from '../../Model/hierarchyModel';

const R_Hkey='R_H';

@Injectable({
  providedIn: 'root'
})
export class RhierarchyService {

  private hiararchy:HierarchyModel;

  constructor() { }

  setRHierarchy(_hiararchy:HierarchyModel)
  {
    //debugger
    this.hiararchy=_hiararchy;
   window.localStorage.removeItem(R_Hkey);
   console.log(R_Hkey, JSON.stringify(this.hiararchy))
   window.localStorage.setItem(R_Hkey, JSON.stringify(this.hiararchy));
  window.sessionStorage.setItem(R_Hkey, JSON.stringify(this.hiararchy));
    console.log(this.hiararchy)
  }
  getRHierarchy()
  {	
  debugger;
 if(sessionStorage.getItem(R_Hkey) != null)
   {
     console.log(JSON.parse(sessionStorage.getItem(R_Hkey)))
   this.hiararchy= JSON.parse(sessionStorage.getItem(R_Hkey));
  } 
 else{
  
  this.hiararchy=undefined;
 }
    return this.hiararchy;
    console.log(this.hiararchy) 
  }

  clearHierarchy() {
    //debugger;
  
    window.localStorage.removeItem( R_Hkey);
       window.localStorage.clear();
  }
}
