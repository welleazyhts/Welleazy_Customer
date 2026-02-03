
import { promises } from "dns";
import { GymPackage, CustomerProfile, State, District, GymCenter, Relationship, RelationshipPerson } from "../types/GymServices";
const API_URL = "https://api.welleazy.com";

export const gymServiceAPI = {

  LoadGymCardDetails: async (districtId: string = "0"): Promise<GymPackage[]> => {
    try {
      localStorage.setItem("DistrictId", districtId);

      const response = await fetch(`${API_URL}/LoadGymCardDetails/${districtId}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: GymPackage[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching gym service data:", error);
      throw error;
    }
  },
  CRMLoadCustomerProfileDetails: async (employeeRefId: number): Promise<CustomerProfile> => {
    try {
      const response = await fetch(`${API_URL}/CRMLoadCustomerProfileDetails/${employeeRefId}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: CustomerProfile = await response.json();


      // Save to localStorage
      localStorage.setItem("employeeName", data.EmployeeName || "");
      localStorage.setItem("email", data.Emailid || "");
      localStorage.setItem("mobile", data.MobileNo || "");
      localStorage.setItem("Gender", data.Gender || "");
      localStorage.setItem("DOB", data.Employee_DOB || "");
      localStorage.setItem("StateId", data.StateId?.toString() || "");
      localStorage.setItem("CityId", data.CityId?.toString() || "");
      localStorage.setItem("address", data.Address || "");
      localStorage.setItem("pincode", data.Pincode || "");

      localStorage.setItem("CorporateName", data.CorporateName || "");
      localStorage.setItem("Branch", data.Branch || "");
      localStorage.setItem("BloodGroup", data.BloodGroup || "");
      localStorage.setItem("MemberId", data.MemberId || "");
      localStorage.setItem("PackageId", data.PackageId || "");
      localStorage.setItem("Services", data.Services || "");
      localStorage.setItem("ProductId", data.ProductId || "");
      return data;
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      throw error;
    }
  },
  CRMStateList: async (): Promise<State[]> => {
    try {
      const response = await fetch(`${API_URL}/CRMStateList`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: State[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching state list:", error);
      throw error;
    }
  },

  CRMDistrictList: async (stateId: number): Promise<District[]> => {
    try {
      const response = await fetch(`${API_URL}/CRMCityList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ StateId: stateId })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: District[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching district list:", error);
      throw error;
    }
  },
  LoadGymDropDown: async (districtId: number): Promise<GymCenter[]> => {
    try {
      const response = await fetch(`${API_URL}/LoadGymDropDown/${districtId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: GymCenter[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching gym centers:", error);
      throw error;
    }
  },
  RazorpayPayment: async (paymentData: { PaymentId: string }): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/RazorpayPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error processing Razorpay payment:", error);
      throw error;
    }
  },
  SaveGymVoucherDetails: async (formData: FormData): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/SaveGymVocherDetails`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving gym voucher details:", error);
      throw error;
    }
  },
  CRMRelationShipList: async (): Promise<Relationship[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://3.110.32.224/api/dependants/relationship-types/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error("Network response was not ok");

      const responseData = await response.json();
      console.log("Relationship List Response:", responseData);

      let rawData: any[] = [];
      if (Array.isArray(responseData)) {
        rawData = responseData;
      } else if (responseData && Array.isArray((responseData as any).data)) {
        rawData = (responseData as any).data;
      } else if (responseData && Array.isArray((responseData as any).results)) {
        rawData = (responseData as any).results;
      }

      return rawData.map((item: any) => ({
        RelationshipId: item.id || item.RelationshipId,
        Relationship: item.name || item.Relationship,
      })) as Relationship[];
    } catch (error) {
      console.error("Error fetching relationship list:", error);
      throw error;
    }
  },
  CRMRelationShipPersonNames: async (employeeRefId: number, relationshipId: number): Promise<RelationshipPerson[]> => {
    try {
      const response = await fetch(`${API_URL}/CRMRelationShipPersonNames`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmployeeRefId: employeeRefId,
          RelationshipId: relationshipId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: RelationshipPerson[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching relationship person names:", error);
      throw error;
    }
  },


}