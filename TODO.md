# TODO

- [ ] Understand current redirect flow after Register/Login.
- [ ] Verify that Home is used for authenticated users and profile pages are available by accountType.
- [x] Update Register.jsx: after successful account creation, redirect to profile (already present).
- [x] Update Login.jsx: after successful login, redirect to Home when logged in (instead of profile).


- [ ] Ensure routes/ProtectedRoute still work.
- [ ] Run project (vite) and manually test: register -> profile, login -> home with correct content.

- [ ] ⚠️ Backend integration: `user.profileCompleted` (utils/auth/profileCompletion.js) is a
      frontend-only flag right now — the real API doesn't return anything like it. Decide with
      backend either: (a) add a computed `profile_completed` field to the User/Volunteer
      resource, or (b) derive completeness on the frontend directly from the real required
      fields (educationLevel, dateOfBirth, skills...) instead of trusting a stored flag.
      Do this BEFORE wiring real login, or every volunteer will get force-redirected to
      /profile forever (the flag will always come back false/undefined from a real API
      response that doesn't know this field exists).