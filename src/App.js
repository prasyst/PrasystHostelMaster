import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
import SidebarDrawar from './Pages/SidebarDrawar';
import Dashboard from './Pages/Dashboard';
import RoleMatrix from './Pages/RoleMatrix';
import Masters from './Pages/Masters';
import Operations from './Pages/Operations';
import ChangePassword from './Components/Changepassword';
import City from './Components/Masters/Location/City';
import CityTable from '../src/Components/Masters/Location/CityTable'
import Country from './Components/Masters/Location/Country';
import State from './Components/Masters/Location/State';
import Zone from './Components/Masters/Location/Zone';
import Pincode from './Components/Masters/Location/Pincode';
import PincodeTable from '../src/Components/Masters/Location/PincodeTable';
import Tenant from './Components/Masters/ARAP/Tenant';
import ZoneTable from '../src/Components/Masters/Location/ZoneTable';
import StateTable from '../src/Components/Masters/Location/StateTable';
import CountryTable from '../src/Components/Masters/Location/CountryTable';
// import RoomMasterTable from './Components/Masters/Property/RoomMasterTable';
import Enquiry from './Components/Ragistration/Enquiry';
import Company from './Components/Masters/Company/Company';
// import Complainant from './Components/Complaint/Complaint';
import StepperForm from './Components/Masters/ARAP/Rasident';
import Wing from '../src/Components/Masters/Property/Wing';
import Floor from '../src/Components/Masters/Property/Floor';
import RoomType from '../src/Components/Masters/Property/RoomType';
import RoomView from '../src/Components/Masters/Property/RoomView';
import RoomBedType from '../src/Components/Masters/Property/RoomBedType';
import RoomMaster from './Components/Masters/Property/RoomMaster';
import RoomBedNumber from './Components/Masters/Property/RoomBedNumber';
import RoomTypeFacilitiesLink from './Components/Masters/Property/RoomTypeFacilitiesLink';
import FacilitiesMaster from './Components/Masters/Property/FacilitiesMaster';
// import RoomTypeFacility from './Components/Masters/Property/RoomFacilityLink';
import ResidentTable from './Components/Masters/ARAP/ResidentTable';
import CompanyTable from './Components/Masters/Company/CompanyTable';
import WingTable from './Components/Masters/Property/WingTable';
import FloorTable from './Components/Masters/Property/FloorTable';
import RoomTypeTable from './Components/Masters/Property/RoomTypeTable';
import RoomViewTable from './Components/Masters/Property/RoomViewTable';
import RoomBedTypeTable from './Components/Masters/Property/RoomBedTypeTable';
import RoomBedNumberTable from './Components/Masters/Property/RoomBedNumberTable';
import FacilitiesMasterTable from './Components/Masters/Property/FacilitiesMasterTable';
import RoomTypeFacilitiesLinktable from './Components/Masters/Property/RoomTypeFacilitiesLinkTable';
// import RoomTypeFacilityTable from './Components/Masters/Property/RoomTypeFacilitityTable';
import Inventory from './Pages/Inventory';
import Accounts from './Pages/Accounts';
import Reports from './Pages/Reports';
import Utilities from './Pages/Utilities';
import Billings from './Pages/Billings';
import PropertyMaster from './Components/Masters/Property/PropertyMaster';
import PropertyType from './Components/Masters/Property/PropertyTypeMaster';
import PropertyTypeTable from './Components/Masters/Property/PropertyTypeTable';
import AmenityMaster from './Components/Masters/OtherMaster/AmenityMaster';
import AmenityMasterTable from './Components/Masters/OtherMaster/AmenityMasterTable';
import InstituteMaster from './Components/Masters/ARAP/InstituteMaster';
import InstituteMasterTable from './Components/Masters/ARAP/InstituteMasterTable';
import CourseMaster from './Components/Masters/ARAP/CourseMaster';
import CourseMasterTable from './Components/Masters/ARAP/CourseMasterTable';
import SemesterMaster from './Components/Masters/ARAP/SemesterMaster';
import SemesterMasterTable from './Components/Masters/ARAP/SemesterMasterTable';
import EmployeeType from './Components/Masters/Company/EmployeeType';
import EmployeeTypeTable from './Components/Masters/Company/EmployeeTypeTable';
import PropertyMasterTable from './Components/Masters/Property/PropertyMasterTable';
import Employee from './Components/Masters/Company/Employee';
import EmployeeTable from './Components/Masters/Company/EmployeeTable';
import Designation from './Components/Masters/Company/Designation';
import DesignationTable from './Components/Masters/Company/DesignationTable';
import UserMaster from './Components/Masters/Company/UserMaster';
import UserMasterTable from './Components/Masters/Company/UserMasterTable';
import SourceMaster from './Components/Masters/ARAP/SourceMaster';
import SourceMstTable from './Components/Masters/ARAP/SourceMstTable';
import Complaint from './Components/Masters/Ticketing/Complaint';
import ComplaintTable from './Components/Masters/Ticketing/ComplaintTable';
import ComplaintType from './Components/Masters/Ticketing/ComplaintType';
import ComplaintTypeTable from './Components/Masters/Ticketing/ComplaintTypeTable';
import PartyMaster from './Components/Masters/ARAP/PartyMaster';

// import GroupMaster from './Components/Masters/Property/GroupMaster';
// import GroupTable from './Components/Masters/Property/GroupMasterTable';

const DashboardLayout = ({ children }) => (
  <SidebarDrawar>{children}</SidebarDrawar>
);

function App() {
  return (
    <Routes>
    <Route path="/HostelERPUI" element={<Login />} />
    <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
    <Route path="/role-matrix" element={<DashboardLayout><RoleMatrix /></DashboardLayout>} />
    <Route path="/citytable" element={<DashboardLayout><CityTable /></DashboardLayout>} />
    <Route path="/pincodetable" element={<DashboardLayout><PincodeTable /></DashboardLayout>} />
    <Route path="/zonetable" element={<DashboardLayout><ZoneTable /></DashboardLayout>} />
    <Route path="/countrytable" element={<DashboardLayout><CountryTable /></DashboardLayout>} />
    <Route path="/statetable" element={<DashboardLayout><StateTable /></DashboardLayout>} />
    <Route path="/wingtable" element={<DashboardLayout><WingTable /></DashboardLayout>} />
    <Route path="/floortable" element={<DashboardLayout><FloorTable /></DashboardLayout>} />
    <Route path="/amenityMaster" element={<DashboardLayout><AmenityMaster /></DashboardLayout>} />
    <Route path="/amenitytable" element={<DashboardLayout><AmenityMasterTable /></DashboardLayout>} />
    <Route path="/coursetable" element={<DashboardLayout><CourseMasterTable /></DashboardLayout>} />
    <Route path="/course" element={<DashboardLayout><CourseMaster /></DashboardLayout>} />
    <Route path="/semestertable" element={<DashboardLayout><SemesterMasterTable /></DashboardLayout>} />
    <Route path="/semester" element={<DashboardLayout><SemesterMaster /></DashboardLayout>} />
    <Route path="/institute-master" element={<DashboardLayout><InstituteMaster /></DashboardLayout>} />
    <Route path="/instituteMasterTable" element={<DashboardLayout><InstituteMasterTable /></DashboardLayout>} />
    <Route path="/roomTypetable" element={<DashboardLayout><RoomTypeTable /></DashboardLayout>} />
    <Route path="/roomViewtable" element={<DashboardLayout><RoomViewTable /></DashboardLayout>} />
    <Route path="/employeetype" element={<DashboardLayout><EmployeeType /></DashboardLayout>} />
    <Route path="/employeetypetable" element={<DashboardLayout><EmployeeTypeTable /></DashboardLayout>} />
    <Route path="/propertyTypetable" element={<DashboardLayout><PropertyTypeTable /></DashboardLayout>} />
    <Route path="/roomBedTypetable" element={<DashboardLayout><RoomBedTypeTable /></DashboardLayout>} />
    <Route path="/roomBednumbertable" element={<DashboardLayout><RoomBedNumberTable /></DashboardLayout>} />
    <Route path="/facilitiesmastertable" element={<DashboardLayout><FacilitiesMasterTable /></DashboardLayout>} />
    <Route path="/roomtypefacilitieslinktable" element={<DashboardLayout><RoomTypeFacilitiesLinktable /></DashboardLayout>} />
    <Route path="/employee" element={<DashboardLayout><Employee /></DashboardLayout>} />
    <Route path="/employeetable" element={<DashboardLayout><EmployeeTable /></DashboardLayout>} />
    <Route path="/designation" element={<DashboardLayout><Designation /></DashboardLayout>} />
    <Route path="/designationtable" element={<DashboardLayout><DesignationTable /></DashboardLayout>} />
    <Route path="/userMaster" element={<DashboardLayout><UserMaster /></DashboardLayout>} />
    <Route path="/userMasterTable" element={<DashboardLayout><UserMasterTable /></DashboardLayout>} />
    <Route path="/sourceMaster" element={<DashboardLayout><SourceMaster /></DashboardLayout>} />
    <Route path="/sourceMstTable" element={<DashboardLayout><SourceMstTable /></DashboardLayout>} />
    <Route path="/complaint" element={<DashboardLayout><Complaint /></DashboardLayout>} />
    <Route path="/complaintTable" element={<DashboardLayout><ComplaintTable /></DashboardLayout>} />
    <Route path="/complaintType" element={<DashboardLayout><ComplaintType /></DashboardLayout>} />
    <Route path="/complaintTypeTable" element={<DashboardLayout><ComplaintTypeTable /></DashboardLayout>} />

    <Route path="/city" element={<DashboardLayout><City /></DashboardLayout>} />
    <Route path="/country" element={<DashboardLayout><Country /></DashboardLayout>} />
    <Route path="/state" element={<DashboardLayout><State /></DashboardLayout>} />
    <Route path="/zone" element={<DashboardLayout><Zone /></DashboardLayout>} />
    <Route path="/pincode" element={<DashboardLayout><Pincode /></DashboardLayout>} />
    <Route path="/tenant" element={<DashboardLayout><Tenant /></DashboardLayout>} />
    <Route path="/property-master" element={<DashboardLayout><PropertyMaster /></DashboardLayout>} />
    <Route path="/propertytable" element={<DashboardLayout><PropertyMasterTable /></DashboardLayout>} />
    <Route path="/wing" element={<DashboardLayout><Wing /></DashboardLayout>} />
    <Route path="/floor" element={<DashboardLayout><Floor /></DashboardLayout>} />
    <Route path="/partymaster" element={<DashboardLayout><PartyMaster /></DashboardLayout>} />
    <Route path="/roomType" element={<DashboardLayout><RoomType /></DashboardLayout>} />
    <Route path="/propertyType-master" element={<DashboardLayout><PropertyType /></DashboardLayout>} />
    <Route path="/roomBedType" element={<DashboardLayout><RoomBedType /></DashboardLayout>} />
    <Route path="/roomView" element={<DashboardLayout><RoomView /></DashboardLayout>} />
    <Route path="/room-master" element={<DashboardLayout><RoomMaster /></DashboardLayout>} />
    <Route path="/roomBedNumber" element={<DashboardLayout><RoomBedNumber /></DashboardLayout>} />
    <Route path="/roomTypeFacilitiesLink" element={<DashboardLayout><RoomTypeFacilitiesLink /></DashboardLayout>} />
    <Route path="/facilitiesMaster" element={<DashboardLayout><FacilitiesMaster /></DashboardLayout>} />
    <Route path="/resident" element={<DashboardLayout><StepperForm /></DashboardLayout>} />
    <Route path="/company" element={<DashboardLayout><Company /></DashboardLayout>} />
    <Route path="/changepassword" element={<DashboardLayout><ChangePassword /></DashboardLayout>} />
    <Route path="/operations/*" element={<DashboardLayout><Operations /></DashboardLayout>} />
    <Route path="/enquiry/*" element={<DashboardLayout><Enquiry /></DashboardLayout>} />
    <Route path="/masters/*" element={<DashboardLayout><Masters /></DashboardLayout>} />
    <Route path="/billings/*" element={<DashboardLayout><Billings /></DashboardLayout>} />
    <Route path="/inventory/*" element={<DashboardLayout><Inventory /></DashboardLayout>} />
    <Route path="/accounts/*" element={<DashboardLayout><Accounts /></DashboardLayout>} />
    <Route path="/reports/*" element={<DashboardLayout><Reports /></DashboardLayout>} />
    <Route path="/utilities/*" element={<DashboardLayout><Utilities /></DashboardLayout>} />
    <Route path="/masters/residenttable/*" element={<DashboardLayout><ResidentTable /></DashboardLayout>} />
    <Route path="/masters/companytable/*" element={<DashboardLayout><CompanyTable /></DashboardLayout>} />

    {/* <Route path="/group-master" element={<DashboardLayout><GroupMaster /></DashboardLayout>} />
    <Route path="/groupTable" element={<DashboardLayout><GroupTable /></DashboardLayout>} /> */}
  </Routes>
  );
}

export default App;