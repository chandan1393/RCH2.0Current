// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
production: false,

stateUrl:  "http://164.100.61.93/States",
districtUrl: "http://164.100.61.93/Districts/",
healthBlockUrl:  "http://164.100.61.93/HealthBlocks/",
healthPHCUrl:  "http://164.100.61.93/HealthPhcs/",
healthSubCentreUrl:  "http://164.100.61.93/HealthSubcentres/",
talukaUrl:  "http://164.100.61.93/Talukas/",
villageUrl:"http://164.100.61.93/VillageDetails/",
healthPHCByBlockAndType:"http://164.100.61.93/HealthPhcs/GetHealthPhcbyTypeBlock?blockcode=",

postVillageWiseeProfile:"http://164.100.61.93/VillagewiseProfile/saveVillageDetails",
VillageWiseProfile:"http://164.100.61.93/VillagewiseProfile/GetVillageDetailsByHierarchy?HealthFacility_code=",
loginUrl:"http://164.100.61.93/login?Username=",
HealthProvideratSubcentre:"http://164.100.61.93/HealthProvider/HealthProvideratSubcentre?",
searchHealthProviderById:"http://164.100.61.93/HealthProvider/HealthProviderByID?providerid=",
getUser:"http://164.100.61.93/getUser",
getYearWiseVillageDetails: "http://164.100.61.93/VillagewiseProfile/GetYearWiseVillageDetails?year=",
updateVillageWiseDetails:"http://164.100.61.93/VillagewiseProfile/updateVillageDetails?id=",
healthFacilityType:"http://164.100.61.93/HealthFacilityMaster",
getVillageAtSubCentre:"http://164.100.61.93/VillageDetails/SubcentreVillage?subcenterCode=",
getSearch:"http://164.100.61.93/GetECRegistration",
getTotalCountThisMonth:"http://164.100.61.93/getECRegbyLevel?stateCode=",
getTotalCountsThisYear:"http://164.100.61.93/getYearwiseECRegbyLevel?stateCode=",
getTotalEstmates:"http://164.100.61.93/getEstimatebyLevel?stateCode=",
ecCoutReport:"http://164.100.61.93/GetECRegCountReport?state_code=",
infantDangerSign:"http://164.100.61.93/GetMDangersigninfant",
infantDeathReason:"http://164.100.61.93/GetMInfantdeathreason",
deliveryPlace:"http://164.100.61.93/GetMDeliveryplace",
pncPeriod:"http://164.100.61.93/GetPNCPeriod",
//pncFacilityType:"http://164.100.61.93/GetPNCplace",
saveChildPNC:"http://164.100.61.93/SaveChildPnc",
getChildPNC:"http://164.100.61.93/GetChildPNC?id=",
updateChildPNC:"http://164.100.61.93/UpdateChildPnc?id=", 
saveChildRegistration:"http://164.100.61.93/SaveChildPnc",




//nisha
BankDetails: "http://164.100.61.93/BankDetails",
Religions:"http://164.100.61.93/Religions",
Occupations:"http://164.100.61.93/Occupations",
Educations:"http://164.100.61.93/Educations",

FacilityType:"http://164.100.61.93/HealthFacilityMaster",
village:"http://164.100.61.93/VillageDetails/SubcentreVillage?subcenterCode=",
HealthPhcbyTypeBlock:"http://164.100.61.93/HealthPhcs/GetHealthPhcbyTypeBlock?blockcode=",
postECData:"http://164.100.61.93/SaveEC",
editECData:"http://164.100.61.93/UpdateEC?registrationNo=",
getPWbyRegNo:"http://164.100.61.93/GetMotherRegistrations?id=",
searchECbyRegNo:"http://164.100.61.93/GetECByRegistrationNo?Registrationno=",
getBeneficiary:"http://164.100.61.93/GetBeneficiary?id=",
GetMotherANC:"http://164.100.61.93/GetMotherANC?id=",

getStatebyID:"http://164.100.61.93/States/",
getDistrictbyID:"http://164.100.61.93/Districts/ByID?districtid=",
getTalukabyID:"http://164.100.61.93/Talukas/",
getBlockbyID:"http://164.100.61.93/HealthBlocks/ByID?HealthBlockID=",
getFacilitybyID:"http://164.100.61.93/HealthPhcs/ByID?HealthPhcID=",
getSubcenterbyID:"http://164.100.61.93/HealthSubcentres/ByID?SubcentreID=",
getVillagebyID:"",


//ANC page
GetMethods:"http://164.100.61.93/GetMethods",
GetBloodGroup:"http://164.100.61.93/GetBloodGroup",

GetAbortionType:"http://164.100.61.93/GetAbortionType",
GetAbortionInducedType:"http://164.100.61.93/GetAbortionInducedType",
GetMMethodUsed:"http://164.100.61.93/GetMMethodUsed",
GetMMethodsPpmcPpc:"http://164.100.61.93/GetMMethodsPpmcPpc",
GetMTt:"http://164.100.61.93/GetMTt",
GetMFoetalMovements:"http://164.100.61.93/GetMFoetalMovements",
GetMSymptomshighrisk:"http://164.100.61.93/GetMSymptomshighrisk",
GetMDeathcause:"http://164.100.61.93/GetMDeathreason",
PostANC:"http://164.100.61.93/SavePWAnc",
GetANCplace:"http://164.100.61.93/GetANCplace",
GetANCDone:"http://164.100.61.93/GetANCDone",
GetMDeliveryplace:"http://164.100.61.93/GetMDeliveryplace",



//bunty ji

forgotpassotpUrl:"http://164.100.61.93/ResetPassword",

VerifyUserInfoUrl:"http://164.100.61.93/VerifyUserInfo",

VerifyotpUrl:"http://164.100.61.93/VerifyOTP",

userCreateFirstStepUrl:"http://164.100.61.93/CreateUser",

UserTypeUrl:  "http://164.100.61.93/TypeMaster",

FacilityTypeUrl:  "http://164.100.61.93/HealthFacilityMaster",

 
changepassotpUrl:"http://164.100.61.93/UpdatePassword",

registrationrequestUrl:  "http://164.100.61.93/GetUserLists",

userapprovedUrl:  "http://164.100.61.93/UpdateUserStatus",

assingroleUrl:  "http://164.100.61.93/GetRoles",

applicationUrl:  "http://164.100.61.93/GetApplication",

userRoleAppicationAssignedUrl:  "http://164.100.61.93/AssignRoles",

IsUserAvailableUrl:  "http://164.100.61.93/IsUserAvailable",

GenerateOTPUrl:  "http://164.100.61.93/GenerateOTP",

SendEmailUrl:  "http://164.100.61.93/SendEmail",

SearchUsersUrl:  "http://164.100.61.93/GetECRegistration",


savepwUserUrl:"http://164.100.61.93/SavePWReg",

DeliveryPlaceNameUrl: "http://164.100.61.93/HealthPhcs/GetHealthPhcbyTypeBlock",

pastIllnessListUrl: "http://164.100.61.93/GetPastillness",

lastPregnancyListUrl: "http://164.100.61.93/GetDeliveryComplication",

BloodGroupListUrl: "http://164.100.61.93/GetBloodGroup",

//PWregistrationDataUrl: "http://164.100.61.93/GetMotherRegistrations",

PWregistrationDataUrl: "http://164.100.61.93/GetBeneficiary",

SendLoginDetailsEmailUrl:  "http://164.100.61.93/SendUserDetailsByEmail",

//brijesh sir
ecreportdata:"http://164.100.61.93/getECHierarchy?phc=",
bulkprofilereportdata:"http://164.100.61.97/api/BulkProfile?dcode=",





//Ashutosh
getECbyRegNo:"http://164.100.61.93/getECbyRegNo?registration_no=",
getECTbyRegNo:"http://164.100.61.93/getECTbyRegNo?registration_no=",
getHealthFacility: "http://164.100.61.93/HealthFacilityMaster",
getHealthFacilityType:"http://164.100.61.93/HealthPhcs/GetHealthPhcbyTypeBlock?",
saveEctdetails : "http://164.100.61.93/SaveECT",
getMethods : "http://164.100.61.93/GetMethods",
getEctVisit: "http://164.100.61.93/GetECTDetailsVisit?",
editEct : "http://164.100.61.93/UpdateECT?",




// Delivery
getBeneficiaryData   : "http://164.100.61.93/GetBeneficiary?",
getDeliveryComplication: "http://164.100.61.93/GetDeliveryComplication",
getDeliveryType :  "http://164.100.61.93/GetMDeliverytype",
//getDeliveryPlace: "http://164.100.61.93/GetMDeliveryplace",
getDeliveryConductedBy : "http://164.100.61.93/GetMDeliveryconductedby",
getMdeathCause: "http://164.100.61.93/GetMDeathcause",

nonObstericComplications:"http://164.100.61.93/GetNonObstetricComplications",

postPWdelivery:"http://164.100.61.93/SavePWDelivery",
editPWdelivery : "http://164.100.61.93/UpdatePWDelivery?",
getPWDdetails :  "http://164.100.61.93/GetMotherDelivery?",




};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
