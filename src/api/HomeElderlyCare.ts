import { HomeElderlyCareCaseDetails } from '../types/HomeElderlyCare'

const API_URL = process.env.REACT_APP_API_URL || "http://3.110.32.224:8000";

export const HomeElderlyCareAPI = {

  HEPSaveCareProgramsCaseDetails: async (caseData: HomeElderlyCareCaseDetails): Promise<any> => {
    try {
      const formData = new URLSearchParams();
      Object.entries(caseData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_URL}/HEPSaveCareProgramsCaseDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error saving care programs case details:", error);
      throw error;
    }
  }

};
