# Booking Error Debug - What I've Done

## Changes Made ✅

I've added comprehensive logging to help you debug the booking error. The console will now show detailed information at each step.

### 1. API Level Logging (`src/api/Consultation.ts`)
Added emoji-prefixed console logs:
- 📤 Before sending API request
- ✅ When response is received successfully
- ❌ When an error occurs

### 2. Frontend Level Logging (`src/pages/Consultation/Consultation.tsx`)
Added step-by-step logging:
- 📢 Before each booking step
- 📄 After each step completes
- ✅ When booking succeeds completely
- ❌ When any step fails

### 3. Improved Error Handling
- Now checks `Success` field from API responses
- Shows specific error messages from backend
- Returns immediately when errors occur (fail-fast)

## How to Debug Now

1. **Open the Browser Console**
   - Press F12
   - Go to "Console" tab

2. **Try Booking an Appointment**
   - Fill in the form
   - Click "Confirm Booking"

3. **Watch the Console Logs**
   You'll see messages like:
   ```
   📢 [BOOKING] Step 1: Creating appointment...
   📤 [API] Sending POST to /CRMSaveBookAppointmentDetails
   ✅ [API] Response received: {Success: true, CaseLead_Id: "12345"}
   📄 [BOOKING] Appointment result: {Success: true, ...}
   📢 [BOOKING] Step 2: Checking sponsored services...
   ```

4. **Find the Error**
   Look for:
   - ❌ Red error messages
   - Which step failed (1, 2, 3, or 4)
   - The actual error message from backend

## What Each Step Does

**Step 1**: Create Appointment
- Saves appointment details to database
- Returns a CaseLead_Id

**Step 2**: Check Sponsored Services
- Checks if the service is sponsored/free
- Determines pricing

**Step 3**: Add to Cart
- Adds the appointment to shopping cart
- Returns CartUniqueId and CartDetailsId

**Step 4**: Save Cart Details
- Links cart with appointment date/time
- Finalizes the booking

## Common Errors & Fixes

### Error: "Failed to create appointment"
**Meaning**: Step 1 failed
**Check**:
- Is the backend API `/CRMSaveBookAppointmentDetails` working?
- Are all required fields being sent?
- Is the user logged in? (Check localStorage for token)

### Error: "Failed to add item to cart"
**Meaning**: Step 3 failed
**Check**:
- Did Step 1 return a valid CaseLead_Id?
- Is the endpoint `/api/appointments/cart/add/` correct?
- Check network tab for 404/500 errors

### Error: Network or CORS
**Meaning**: Can't connect to backend
**Check**:
- Is backend server running at `http://3.110.32.224:8000`?
- Check backend logs for errors
- Try accessing `http://3.110.32.224:8000/api/appointments/cart/add/` in browser

## Next Steps

1. **Try booking again** with console open
2. **Screenshot the console logs** where the error occurs
3. **Share the logs** with me

I'll be able to give you an exact fix once I see which step is failing and why!

## Testing Different Scenarios

Try these to narrow down the issue:

### Test 1: Basic Info
```
Console → localStorage.getItem("EmployeeRefId")
Console → localStorage.getItem("token")
Console → localStorage.getItem("CorporateId")
```
These should all return values. If any is null, that could be the issue.

### Test 2: Check Backend
Open in browser:
- `http://3.110.32.224:8000/api/doctors_details/personal/`

If this works, backend is up. If not, backend is down.

### Test 3: Network Tab
1. Open F12 → Network tab
2. Try booking
3. Look for red/failed requests
4. Click on it → Preview tab to see error message

## File Locations

If you need to check the code:
- API layer: `src/api/Consultation.ts`
- Frontend: `src/pages/Consultation/Consultation.tsx`
- Troubleshooting guide: `BOOKING_ERROR_GUIDE.md`
