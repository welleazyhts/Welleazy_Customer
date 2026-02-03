# Booking Error Troubleshooting Guide

## Issue
When clicking "Confirm Booking", the application shows: **"Failed to book appointment!"**

## Root Cause Analysis

After reviewing your code, the booking process involves multiple API calls in sequence:

1. **CRMSaveBookAppointmentDetails** - Creates the appointment
2. **CRMSponsoredServices** - Checks sponsorship status  
3. **CRMCustomerInsertCartItemDetails** - Adds to cart
4. **CRMSaveCustomerCartDetails** - Saves cart details

The error could occur at any of these steps, but the current error handling doesn't show WHICH step is failing or WHY.

## Debugging Steps

### Step 1: Open Browser Console
1. Open your browser (where the app is running)
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Try to book an appointment again
5. Look for red error messages

### Step 2: Check Network Tab
1. In Developer Tools, go to the "Network" tab
2. Try booking an appointment
3. Look for red/failed requests
4. Click on the failed request to see:
   - Request payload (what you sent)
   - Response (what the server returned with error message)

## Likely Issues and Solutions

### Issue #1: Backend API Endpoint Not Found (404)
**Symptom**: Network tab shows 404 error for `/CRMSaveBookAppointmentDetails`

**Solution**: Check if your backend API has this exact endpoint. It might be:
- `/api/appointments/create/` (Django REST style)
- `/appointments/` (simplified)
- Some other path

**Fix**: Update line 230 in `src/api/Consultation.ts`:
```typescript
// Change from:
const response = await api.post('/CRMSaveBookAppointmentDetails', formData);

// To (example, check your actual backend endpoint):
const response = await api.post('/api/appointments/', formData);
```

### Issue #2: Missing Required Fields
**Symptom**: Backend returns 400 Bad Request with "Field X is required"

 **Solution**: Check the backend error message to see which field is missing, then ensure it's being sent.

### Issue #3: Authentication Token Missing
**Symptom**: 401 Unauthorized error

**Solution**: Check if user is logged in:
```javascript
console.log("Token:", localStorage.getItem('token'));
console.log("EmployeeRefId:", localStorage.getItem('EmployeeRefId'));
```

If missing, user needs to log in first.

### Issue #4: CORS Error
**Symptom**: Console shows "CORS policy" error

**Solution**: Ensure your backend allows requests from `localhost:3000` or add CORS headers.

## Quick Fix: Add Better Logging

Add these console.log statements to see exactly where it fails:

### In `src/api/Consultation.ts` at line 230:

```typescript
// Before the API call
console.log("📤 Calling /CRMSaveBookAppointmentDetails with:", {
  CaseLeadId: appointmentData.CaseLeadId,
  DoctorId: appointmentData.DoctorId,
  ProductId: appointmentData.ProductId
});

const response = await api.post('/CRMSaveBookAppointmentDetails', formData);

// After the API call  
console.log("✅ Response:", response.data);
```

### In `src/pages/Consultation/Consultation.tsx` at line 1271:

```typescript
console.log("Step 1: Creating appointment...");
const appointmentResult = await ConsultationAPI.CRMSaveBookAppointmentDetails(appointmentData);
console.log("Appointment created:", appointmentResult);

if (!appointmentResult.Success) {
  console.error("❌ Appointment creation failed:", appointmentResult.Message);
  toast.error(appointmentResult.Message || "Failed to create appointment");
  return;
}

const caseLeadId = appointmentResult?.CaseLead_Id;

if (!caseLeadId || caseLeadId === "0") {
  console.error("❌ No case lead ID received");
  toast.error("Failed to get appointment ID");
  return;
}
```

## Testing the Fix

1. Make the changes above
2. Save the files (they should auto-reload)
3. Open browser console
4. Try booking again
5. Check the console logs to see:
   - What data is being sent
   - What response you get back
   - At which step it fails

## Next Steps

Once you see the actual error message in the console, share it with me and I can provide a more specific fix.

Common error messages and their fixes:
- "Network Error" → Backend server is down or URL is wrong
- "404 Not Found" → API endpoint path is incorrect
- "400 Bad Request" → Missing or invalid field in request
- "401 Unauthorized" → User not logged in or token expired
- "500 Internal Server Error" → Bug in backend code (check backend logs)
