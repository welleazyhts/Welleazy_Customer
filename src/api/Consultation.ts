
import {
  CRMFetchDoctorSpecializationDetails, CRMFetchDoctorLanguagesDetails, CRMFetchDoctorTypesDetails, CRMFetchDoctorPincodeDetails
  , CRMConsultationDoctorDetailsRequest, CRMConsultationDoctorDetailsResponse, TimeSlotRequest, TimeSlotResponse, BookAppointmentRequest, CRMSaveBookAppointmentResponse, InsertCartResponse,
  DependentRequest,
  DependentResponse, CRMSponsoredServicesRequest, CRMSponsoredStatusResponse, ApolloClinic,
  ApolloDoctorsSlotRequest, ApolloDoctorSlotsApiResponse
} from '../types/Consultation';
import { api } from '../services/api';

export const ConsultationAPI = {

  LoadVendorListDetailsForEye: async (): Promise<CRMFetchDoctorSpecializationDetails[]> => {
    try {
      // Reverted to original endpoint as requested
      const response = await api.get('/api/consultation/doctor-specializations/');
      console.log("LoadVendorListDetailsForEye Raw Response:", response.data);

      let rawData: any[] = [];
      const data: any = response.data;

      if (Array.isArray(data)) {
        rawData = data;
      } else if (data && Array.isArray(data.data)) {
        rawData = data.data;
      } else if (data && Array.isArray(data.results)) {
        rawData = data.results;
      }

      console.log("Raw Data Array Length:", rawData.length);

      const mappedData = rawData.map((item: any) => ({
        DoctorSpecializationsId: item.id !== undefined ? item.id : (item.DoctorSpecializationsId || 0),
        Specializations: item.name || item.Name || item.Specializations || "Unknown Specialization",
        ImageName: item.image || item.ImageName || null,
        Imagepath: item.image || item.Imagepath || null,
        Description: item.description || item.Description || "",
        IsActive: (item.is_active === true || item.IsActive === 1 || item.IsActive === true) ? 1 : 0,
        ...item
      })) as CRMFetchDoctorSpecializationDetails[];

      console.log("Mapped Specializations Data:", mappedData);
      return mappedData;
    } catch (error: any) {
      console.error('Error loading vendor list details for eye:', error.response || error);
      throw error;
    }
  },

  GetDoctorLanguages: async (): Promise<CRMFetchDoctorLanguagesDetails[]> => {
    try {
      const response = await api.get('/api/consultation/languages/');
      console.log("GetDoctorLanguages Response:", response.data);

      let rawData: any[] = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response.data && Array.isArray((response.data as any).data)) {
        rawData = (response.data as any).data;
      } else if (response.data && Array.isArray((response.data as any).results)) {
        rawData = (response.data as any).results;
      }

      return rawData.map((item: any) => ({
        LanguageId: item.id || item.LanguageId,
        LanguageDescription: item.name || item.LanguageDescription,
        ...item
      })) as CRMFetchDoctorLanguagesDetails[];
    } catch (error: any) {
      console.error('Error loading doctor languages:', error.response || error);
      throw error;
    }
  },

  GetDoctorPincodes: async (): Promise<CRMFetchDoctorPincodeDetails[]> => {
    try {
      const response = await api.get('/api/consultation/pincodes/');
      console.log("GetDoctorPincodes Response:", response.data);

      let rawData: any[] = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response.data && Array.isArray((response.data as any).data)) {
        rawData = (response.data as any).data;
      } else if (response.data && Array.isArray((response.data as any).results)) {
        rawData = (response.data as any).results;
      }

      return rawData.map((item: any) => ({
        PincodeId: item.id || item.PincodeId,
        Pincode: item.code || item.Pincode,
        ...item
      })) as CRMFetchDoctorPincodeDetails[];
    } catch (error: any) {
      console.error('Error loading doctor pincodes:', error.response || error);
      throw error;
    }
  },

  GetDoctorTypes: async (): Promise<CRMFetchDoctorTypesDetails[]> => {
    try {
      const response = await api.get('/api/consultation/vendors/');
      console.log("GetDoctorTypes Response:", response.data);

      let rawData: any[] = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response.data && Array.isArray((response.data as any).data)) {
        rawData = (response.data as any).data;
      } else if (response.data && Array.isArray((response.data as any).results)) {
        rawData = (response.data as any).results;
      }

      return rawData.map((item: any) => ({
        DoctorTypeDetailsId: item.id || item.DoctorTypeDetailsId,
        DoctorTypeDescription: item.name || item.DoctorTypeDescription,
        ...item
      })) as CRMFetchDoctorTypesDetails[];
    } catch (error: any) {
      console.error('Error loading doctor types:', error.response || error);
      throw error;
    }
  },

  CRMLoadTimeSlots: async (requestData: TimeSlotRequest): Promise<TimeSlotResponse[]> => {
    try {
      // User explicitly requested ONLY the endpoint shown in the 2nd image: /api/appointments/doctor-availability/
      // The 1st image showed unwanted parameters like dc_unique_name
      const params = {
        doctor_id: requestData.doctorId,
        date: requestData.Date
        // dc_unique_name removed as per user request "dont add anything dummy like apis"
      };

      console.log("🚀 [API] Fetching Doctor Availability (Strict 2nd Image Match):", params);

      // Explicitly using the user-requested endpoint
      const response = await api.get('/api/appointments/doctor-availability', {
        params: params
      });

      console.log("Doctor Availability Raw Response:", response.data);

      // Handle different response structures aggressively
      let rawData: any[] = [];
      const resVal: any = response.data;

      if (Array.isArray(resVal)) {
        rawData = resVal;
      } else if (resVal && typeof resVal === 'object') {
        // Check common keys
        if (Array.isArray(resVal.data)) rawData = resVal.data;
        else if (Array.isArray(resVal.results)) rawData = resVal.results;
        else if (Array.isArray(resVal.slots)) rawData = resVal.slots;
        else if (Array.isArray(resVal.availability)) rawData = resVal.availability;
        else if (Array.isArray(resVal.doctor_slots)) rawData = resVal.doctor_slots;
        else if (Array.isArray(resVal.appointment_slots)) rawData = resVal.appointment_slots;

        // If still empty, try to find any array in the object
        if (rawData.length === 0) {
          const firstArrayKey = Object.keys(resVal).find(key => Array.isArray(resVal[key]));
          if (firstArrayKey) {
            console.log(`🔍 [API] Found array in key: ${firstArrayKey}`);
            rawData = resVal[firstArrayKey];
          }
        }
      }

      console.log(`✅ [API] Final Raw Data Count: ${rawData.length}`);

      // Helper function to format time
      const formatTime = (time24: string): string => {
        if (!time24) return '';
        const [hoursStr, minutesStr] = time24.split(':');
        let hours = parseInt(hoursStr, 10);
        const minutes = minutesStr || '00';
        const modifier = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${modifier}`;
      };

      const mappedSlots = rawData.map((item: any) => {
        // Support both new (start_time) and legacy (time) fields
        const startTime = item.start_time || item.time || item.Time;
        const endTime = item.end_time;

        let displayTime = '';
        if (startTime) {
          displayTime = formatTime(startTime);
          if (endTime) {
            displayTime += ` - ${formatTime(endTime)}`;
          }
        }

        return {
          TimeId: item.id || item.slot_id || item.TimeId || Math.random(), // Ensure ID exists
          Time: displayTime || startTime,
          TimeZone: true,
          Date: item.date || item.Date || requestData.Date // Fallback to requested date if missing in slot
        };
      }) as TimeSlotResponse[];

      console.log("Mapped Time Slots:", mappedSlots);
      return mappedSlots;

    } catch (error: any) {
      console.error("Error loading time slots:", error.response || error);
      // Return empty array instead of throwing to prevent UI crash
      return [];
    }
  },

  CRMSaveBookAppointmentDetails: async (appointmentData: BookAppointmentRequest): Promise<CRMSaveBookAppointmentResponse> => {
    try {
      // BACK TO JSON - Postman used JSON for this call
      const payload = {
        doctor_id: Number(appointmentData.DoctorId || 0)
      };

      console.log("📤 [API] Sending JSON to /api/appointments/select-doctor/", payload);

      const response = await api.post('/api/appointments/select-doctor/', payload);

      console.log("✅ [API] Response received:", response.data);

      const result = response.data as any;

      // Check if response indicates failure, but ignore "Doctor & specialization selected successfully"
      // which is actually a success message despite potential Success: false or missing flag
      const successMessage = (result.Message || result.message || "").toLowerCase();
      const isSuccessMessage = successMessage.includes("selected successfully") ||
        successMessage.includes("doctor & specialization selected");

      if (result.Success === false && !isSuccessMessage) {
        console.error("❌ [API] Appointment creation failed:", result.Message);
        return {
          Success: false,
          Message: result.Message || "Appointment booking failed",
          CaseLead_Id: "0"
        };
      }

      // Helper to safely extract CaseLeadId from various possible locations
      const extractCaseLeadId = (res: any): string => {
        // Log all keys to help debugging
        try {
          console.log("🔍 [API] Response Keys:", Object.keys(res));
          if (res.data) console.log("🔍 [API] Nested Data Keys:", Object.keys(res.data));
        } catch (e) { }

        // Level 1 checks
        if (res.CaseLead_Id) return res.CaseLead_Id.toString();
        if (res.caseLead_Id) return res.caseLead_Id.toString();
        if (res.CaseLeadId) return res.CaseLeadId.toString();
        if (res.case_lead_id) return res.case_lead_id.toString();
        if (res.case_id) return res.case_id.toString();
        if (res.lead_id) return res.lead_id.toString();
        if (res.id) return res.id.toString();

        // Level 2 checks (nested data)
        if (res.data) {
          if (res.data.CaseLead_Id) return res.data.CaseLead_Id.toString();
          if (res.data.case_lead_id) return res.data.case_lead_id.toString();
          if (res.data.case_id) return res.data.case_id.toString();
          if (res.data.lead_id) return res.data.lead_id.toString();
          if (res.data.id) return res.data.id.toString();
        }

        return "0";
      };

      const extractedId = extractCaseLeadId(result);
      console.log(`🔍 [API] Extracted CaseLeadId: ${extractedId} from response`, result);

      return {
        Success: true,
        Message: result.Message || result.message || "Appointment booked successfully",
        CaseLead_Id: extractedId
      };
    } catch (error: any) {
      console.error('❌ [API ERROR] Error in CRMSaveBookAppointmentDetails:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      const errorMsg = error.response?.data?.Message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to book appointment";

      return {
        Success: false,
        Message: errorMsg,
        CaseLead_Id: "0"
      };
    }
  },

  CRMCustomerInsertCartItemDetails: async (
    appointmentData: {
      CaseLead_Id: string | number;
      EmployeeRefId: number;
      CaseFor: number;
      EmployeeDependentDetailsId: number;
      CaseType: string;
      ProductId: number;
      DCId: number;
      SponsoredStatus: number;
      TestPackageTypeId: number;
      CartUniqueId: number;
      DoctorId?: number;
      AppointmentDate?: string; // Added AppointmentDate
    }
  ): Promise<InsertCartResponse> => {
    try {
      // Converting to JSON as per user request (not using FormData)
      // We rely on the backend Session Data for the IDs like doctor_id.
      const fullDateTime = appointmentData.AppointmentDate || "";
      let datePart = fullDateTime.split(' ')[0] || "";
      let timePart = fullDateTime.split(' ').slice(1).join(' ') || "";

      const isSelf = (appointmentData.CaseFor as any) === 1 || (appointmentData.CaseFor as any) === "1";

      // Strict 12-hour time formatter (e.g., 08:30 PM)
      const formatTo12Hour = (timeStr: string) => {
        if (!timeStr) return "";
        if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
        let [h, m] = timeStr.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
      };

      const payload = {
        for_whom: isSelf ? 'self' : 'dependant',
        appointment_date: datePart,
        appointment_time: formatTo12Hour(timePart),
        mode: appointmentData.ProductId === 1 ? 'video' : (appointmentData.ProductId === 2 ? 'tele' : 'clinic'),
        symptoms: (appointmentData as any).Symptoms || "General Consultation",
        dependant_id: !isSelf && appointmentData.EmployeeDependentDetailsId ? appointmentData.EmployeeDependentDetailsId : null
      };

      console.log("📤 [API] Sending Lean JSON to /api/appointments/add-appointment-to-cart/", payload);

      const response = await api.post('/api/appointments/add-appointment-to-cart/', payload);

      const result = response.data as any;
      console.log("Server response:", result);

      return {
        Success: true,
        Message: result.Message || result.message,
        CartDetailsId: result.CartDetailsId || result.cart_details_id,
        CartUniqueId: result.CartUniqueId || result.cart_unique_id
      };
    } catch (error: any) {
      // Improved error logging to see validation errors
      console.error("❌ [API ERROR] Error saving appointment cart item details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data, // This contains the specific field errors
        message: error.message
      });

      return {
        Success: false,
        Message: JSON.stringify(error.response?.data) || error.message || "Failed to save cart item"
      };
    }
  },

  CRMLoadDoctorListDetails: async (specialityId: number, employeeRefId: number, districtId: number): Promise<CRMConsultationDoctorDetailsResponse[]> => {
    try {
      // User requested to use ONLY /api/doctors_details/professional/
      // and remove the personal details endpoint.
      const params: any = {};
      if (specialityId) params.specialityId = specialityId;
      if (employeeRefId) params.employeeRefId = employeeRefId;
      if (districtId) params.city = districtId;

      console.log("🚀 [API] Fetching Doctors from /api/doctors_details/professional/", params);

      const response = await api.get('/api/doctors_details/professional/', { params });

      console.log("Doctors Raw Response:", response.data);

      let rawData: any[] = [];
      const resData: any = response.data;
      if (Array.isArray(resData)) {
        rawData = resData;
      } else if (resData && Array.isArray(resData.data)) {
        rawData = resData.data;
      } else if (resData && Array.isArray(resData.results)) {
        rawData = resData.results;
      }

      console.log(`✅ [API] Fetched ${rawData.length} doctors from professional endpoint`);

      // Validate that we only have real doctors from backend
      // RELAXED FILTER: Show everything returned by the professional API
      const validDoctors = rawData.filter(item => {
        // Just ensure it has an ID
        const hasId = item.id || item.DoctorId;
        return hasId;
      });

      // Map doctors to frontend interface
      const mappedData = validDoctors.map((item: any) => {
        let vendorName = "";
        if (item.vendor && typeof item.vendor === 'object') {
          vendorName = item.vendor.name || item.vendor.Name || "";
        } else if (typeof item.vendor === 'string') {
          vendorName = item.vendor;
        }

        // Check for name variations
        const docName = item.name || item.Name || item.full_name || item.DoctorName || "Doctor";

        // Handle specialization mapping robustly
        let specName = "";
        let specIds = "";

        if (Array.isArray(item.specialization)) {
          // If array of objects
          if (item.specialization.length > 0 && typeof item.specialization[0] === 'object') {
            specName = item.specialization[0].name || item.specialization[0].Name || "";
            specIds = item.specialization.map((s: any) => s.id || s.Id).filter((id: any) => id).join(",");
          }
          // If array of strings/numbers
          else if (item.specialization.length > 0) {
            specName = String(item.specialization[0]);
            specIds = item.specialization.join(",");
          }
        }
        else if (typeof item.specialization === 'string') {
          specName = item.specialization;
          specIds = item.specialization; // Fallback
        }

        // Map qualification
        let qualification = "";
        if (Array.isArray(item.qualification)) {
          // Mapping based on user provided JSON: item.qualification is just a string "MBBS", but if it were an array
          // The current user JSON shows "qualification": "MBBS" directly.
          // But keeping array check just in case.
          qualification = item.qualification.map((q: any) => q.name || q.qualification || q).join(", ");
        } else if (typeof item.qualification === 'string') {
          qualification = item.qualification;
        }

        // Map languages
        let language = "";
        if (Array.isArray(item.language)) {
          // Backend returns array of objects: [{id: 1, name: "English", ...}, ...]
          language = item.language.map((l: any) => l.name || l.language || l.LanguageDescription || "").filter(Boolean).join(", ");
        } else if (typeof item.language === 'string') {
          language = item.language;
        }

        // Map fees (Backend returns string "1500.00")
        const fees = item.consultation_fee ? parseFloat(item.consultation_fee) : 0; // Convert string to number

        // Construct final object
        return {
          DoctorId: item.id || item.doctor || item.DoctorId,
          DoctorName: docName,
          DoctorDetails: item.bio || item.details || item.DoctorDetails || "",
          DoctorMobileNumber: item.mobile_no || item.DoctorMobileNumber || "",
          DoctorEmailId: item.email || item.DoctorEmailId || "",
          DoctorTypeDescription: vendorName || item.DoctorTypeDescription || "Welleazy",
          DoctorRegistrationId: item.license_number || item.DoctorRegistrationId || "",
          ConsultationMode: item.e_consultation ? "Video Consultation" : (item.in_clinic ? "In-Clinic" : (item.ConsultationMode || "")),

          // Default/Missing fields
          DoctorImage: item.profile_photo || item.image || item.DoctorImage || null,
          VendorImageUrl: "",
          DoctorImageUrl: item.image || item.DoctorImageUrl || "",
          ServiceProvider: "",
          EmpanelFor: "",
          Service: [
            item.e_consultation ? "Video Consultation" : "",
            (item.in_clinic || vendorName === "Apollo" || vendorName === "Appolo") ? "In-Person Consultation" : "",
            item.service || item.Service || ""
          ].filter(Boolean).join(", ") || (item.Service || "Consultation"),
          Qualification: qualification || item.Qualification || "",
          Language: language || item.Language || "English",
          DistrictId: districtId || item.DistrictId || 0,
          FromTime: "",
          ToTime: "",
          ConsultationCount: 0,
          ClinicId: item.clinic_id || item.ClinicId || 0,
          ClinicName: item.clinic_name || item.ClinicName || "",
          DCUniqueName: vendorName || item.DCUniqueName || "Welleazy",
          DoctorURL: "",
          ConsultationFees: fees // Mapping the fee correctly
        };
      });

      console.log(`✅ [API] Returning ${mappedData.length} valid doctors to display`);
      console.log("📋 [API] Sample doctor data:", mappedData.slice(0, 2));
      return mappedData as unknown as CRMConsultationDoctorDetailsResponse[];
    } catch (err: any) {
      console.error("Error fetching doctor details:", err);
      return [];
    }
  },

  CRMSaveCustomerCartDetails: async (
    appointmentData: {
      CaseleadId: number | string;
      AppointmentDateTime: string;
      DCId: number;
      CreatedBy: number;
      CartDetailsId: number;
      StMId?: string;
      DCSelection?: string;
      TestPackageCode?: string;
    }
  ): Promise<InsertCartResponse> => {
    try {
      const payload = {
        CaseleadId: appointmentData.CaseleadId,
        AppointmentDateTime: appointmentData.AppointmentDateTime,
        DCId: appointmentData.DCId,
        CreatedBy: appointmentData.CreatedBy,
        CartDetailsId: appointmentData.CartDetailsId,
        StMId: appointmentData.StMId ?? "",
        DCSelection: appointmentData.DCSelection ?? "",
        TestPackageCode: appointmentData.TestPackageCode ?? ""
      };

      const response = await api.post('/CRMSaveCustomerCartDetails', payload);

      const result = response.data as any;
      console.log("Server response:", result);

      return {
        Success: true,
        Message: result.Message,
        CartDetailsId: result.CartDetailsId
      };
    } catch (error: any) {
      console.error("Error saving appointment cart item:", error.response || error);
      return {
        Success: false,
        Message: error.response?.data?.Message || error.message || "Failed to save cart item"
      };
    }
  },

  CRMInsertUpdateEmployeeDependantDetails: async (payload: DependentRequest): Promise<DependentResponse> => {
    try {
      // Helper to convert DD/MM/YYYY to YYYY-MM-DD
      const convertDate = (dateStr: string) => {
        if (!dateStr) return null;
        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };

      const requestBody = {
        employee_id: payload.EmployeeId,
        relationship_id: payload.DependentRelationShip,
        name: payload.DependentName,
        mobile_no: payload.DependentMobileNo,
        gender: payload.DependentGender,
        dob: convertDate(payload.DependentDOB),
        email: payload.DependentEmailId || "",
        // Optional fields if backend requires them, but likely inferred or optional
        marital_status: payload.MaritalStatus,
        occupation: payload.Occupation
      };

      const response = await api.post('/api/dependants/', requestBody);
      return response.data as DependentResponse;
    } catch (error: any) {
      console.error("Error in CRMInsertUpdateEmployeeDependantDetails:", error.response || error);
      throw error;
    }
  },

  CRMSponsoredServices: async (payload: { EmployeeRefId: number; ServiceOfferedId: string }): Promise<{ ServiceAvailable: boolean }> => {
    try {
      const response = await api.post('/CRMSponsoredServices', payload);
      return response.data as { ServiceAvailable: boolean };
    } catch (error: any) {
      console.error('Error fetching sponsored services:', error.response || error);
      throw error;
    }
  },

  CRMLoadApolloClinics: async (doctorId: number, DoctorTypeDescription: string): Promise<ApolloClinic[]> => {
    try {
      const url = `/CRMLoadApolloClinics/${doctorId}/${DoctorTypeDescription}`;
      console.log(`📡 [API] Requesting Apollo Clinics: ${url}`);
      const response = await api.get(url);
      console.log(`✅ [API] Clinics Response:`, response.data);
      return response.data as ApolloClinic[];
    } catch (error: any) {
      console.error('Error loading Apollo clinics:', error.response || error);
      throw error;
    }
  },

  ApolloHospitalDoctorSlotDetails: async (payload: ApolloDoctorsSlotRequest): Promise<ApolloDoctorSlotsApiResponse> => {
    try {
      const response = await api.post('/ApolloHospitalDoctorSlotDetails', {
        hospitalId: payload.clinicId,
        doctorId: payload.doctorId,
        appointmentDate: payload.appointmentDate,
      });
      return response.data as ApolloDoctorSlotsApiResponse;
    } catch (error: any) {
      console.error('Error loading Apollo doctor slots:', error.response || error);
      throw error;
    }
  },

  // Added new function for filtering doctors by language
  GetDoctorsByLanguage: async (language: string): Promise<CRMConsultationDoctorDetailsResponse[]> => {
    try {
      console.log(`🔍 [API] Fetching doctors for language: ${language}`);
      const response = await api.get('/api/doctors_details/professional/search', {
        params: { language: language }
      });
      console.log("✅ [API] Data received:", response.data);

      let rawData: any[] = [];
      const data: any = response.data;

      // Robust data extraction
      if (Array.isArray(data)) {
        rawData = data;
      } else if (data && Array.isArray(data.data)) {
        rawData = data.data;
      } else if (data && Array.isArray(data.results)) {
        rawData = data.results;
      }

      // Filter out dummy data
      rawData = rawData.filter(item => {
        const name = item.name || item.Name || item.full_name || item.DoctorName || "";
        const normalize = (str: string) => str.toLowerCase().replace(/[.,\s]/g, '');
        const normalizedName = normalize(name);
        return !normalizedName.includes("drhari") && name !== "Doctor";
      });

      // Map to frontend interface
      const mappedData = rawData.map((item: any) => {
        let vendorName = "";
        if (item.vendor && typeof item.vendor === 'object') {
          vendorName = item.vendor.name || item.vendor.Name || "";
        } else if (typeof item.vendor === 'string') {
          vendorName = item.vendor;
        }

        // Handle name variations
        const docName = item.name || item.Name || item.full_name || item.DoctorName || "Doctor";

        // Handle specialization mapping
        let specName = "General Physician";
        let specIds = "";

        if (Array.isArray(item.specialization) && item.specialization.length > 0) {
          if (typeof item.specialization[0] === 'object') {
            specName = item.specialization[0].name || "";
            specIds = item.specialization.map((s: any) => s.id).join(",");
          } else {
            specName = String(item.specialization[0]);
            specIds = item.specialization.join(",");
          }
        }

        return {
          DoctorId: item.id || item.doctor || item.DoctorId,
          DoctorName: docName,
          Experience: item.experience_years?.toString() || item.Experience?.toString() || "",
          Experience1: item.experience_years || 0,
          Age: item.age || 0,
          DOB: item.dob || "",
          Specialization: specName,
          DoctorSpecializations: specIds,
          Language: item.language ? (Array.isArray(item.language) ? item.language.map((l: any) => typeof l === 'object' ? l.name : l).join(", ") : item.language) : "",
          CityName: item.city_name || "India",
          Address: item.address || item.clinic_address || "",
          Pincode: item.clinic_address || "",
          DoctorTypeDescription: "Welleazy",
          DoctorTypeId: (item.vendor && item.vendor.id) ? item.vendor.id : 0,
          Fee: item.consultation_fee || "0",
          DoctorRegistrationId: item.license_number || "",
          ConsultationMode: item.e_consultation ? "Video Consultation" : "In-Clinic",
          DoctorImage: item.profile_photo || item.image || null,
          VendorImageUrl: "",
          DoctorImageUrl: item.image || "",
          ServiceProvider: "",
          EmpanelFor: "",
          Service: item.service || "Consultation", // Default to "Consultation" if not provided
          Qualification: item.qualification || "",
          DistrictId: 0,
          FromTime: "",
          ToTime: "",
          ConsultationCount: 0,
          ClinicId: item.clinic_id || 0,
          ClinicName: item.clinic_name || "",
          DCUniqueName: vendorName || "Welleazy", // Important for TimeSlot API
          DoctorURL: "",
          ConsultationFees: item.consultation_fee ? parseFloat(item.consultation_fee) : 0,
        };
      }) as CRMConsultationDoctorDetailsResponse[];

      return mappedData;
    } catch (error: any) {
      console.error('❌ [API ERROR] Error loading doctors by language:', error.response || error);
      throw error;
    }
  },
};
