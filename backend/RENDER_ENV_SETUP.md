# RENDER ENVIRONMENT VARIABLES SETUP

## ⚠️ CRITICAL: Your backend is failing because Render cannot connect to Aiven MySQL

**Error:** `java.net.UnknownHostException: sitara-hotel-mysql-hrathikharikanth-3bc8.g.aivencloud.com: Name does not resolve`

This means the hostname is wrong or the Aiven service isn't running.

---

## 🔧 STEP-BY-STEP FIX

### 1. Get Correct Aiven MySQL Connection Details

1. Go to https://console.aiven.io/
2. Login to your account
3. Click on your MySQL service (should be named "sitara-hotel-mysql" or similar)
4. Look for **Service URI** - it will look like:
   ```
   mysql://avnadmin:<password>@sitara-hotel-mysql-xxxxx.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED
   ```
5. **IMPORTANT:** Copy the exact values:
   - **Host:** `sitara-hotel-mysql-xxxxx.aivencloud.com` (replace xxxxx with your actual host)
   - **Port:** Usually `12345` or similar
   - **User:** Usually `avnadmin`
   - **Password:** Copy the password exactly from the Service URI
   - **Database:** Usually `defaultdb`

---

### 2. Set Environment Variables on Render

1. Go to https://dashboard.render.com/
2. Click on your backend service: **sitara-hotel-backend**
3. Click **Environment** tab on the left
4. Add/Update these environment variables:

| Key | Value (REPLACE WITH YOUR ACTUAL VALUES) |
|-----|----------------------------------------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://sitara-hotel-mysql-YOUR-HOST.aivencloud.com:YOUR-PORT/defaultdb?sslMode=REQUIRED&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
| `SPRING_DATASOURCE_USERNAME` | `avnadmin` |
| `SPRING_DATASOURCE_PASSWORD` | Copy from Aiven Console Service URI |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | `sitara-hotel-super-secret-jwt-key-2026-change-this-in-production` |

**Example with real values:**
```
SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host.aivencloud.com:12345/defaultdb?sslMode=REQUIRED&serverTimezone=UTC&allowPublicKeyRetrieval=true

SPRING_DATASOURCE_USERNAME=avnadmin

SPRING_DATASOURCE_PASSWORD=YOUR_PASSWORD_FROM_AIVEN_CONSOLE

SPRING_PROFILES_ACTIVE=prod

JWT_SECRET=sitara-hotel-super-secret-jwt-key-2026-change-this-in-production
```

---

### 3. Verify Aiven Service is Running

1. In Aiven Console, check your MySQL service status
2. Status should be **RUNNING** (green)
3. If it says **REBUILDING** or **POWERING UP**, wait 2-3 minutes
4. If it says **POWERED OFF**, click **Power On**

---

### 4. Test DNS Resolution (Optional but Recommended)

On your local machine, test if the hostname resolves:

```bash
nslookup sitara-hotel-mysql-YOUR-HOST.aivencloud.com
```

If it returns "can't find" or "Name does not resolve", then:
- The hostname is incorrect, OR
- The Aiven service is not publicly accessible (check Aiven network settings)

---

### 5. Save and Redeploy

1. Click **Save Changes** in Render
2. Render will automatically redeploy your backend
3. Wait 2-3 minutes for deployment to complete
4. Check logs - you should see:
   ```
   Started PhegonHotelApplication in X.XXX seconds
   Tomcat started on port(s): 10000 (http)
   ```

---

## ✅ HOW TO VERIFY IT'S WORKING

### Test 1: Health Check
Visit: https://sitara-hotel-backend.onrender.com/actuator/health

Should return:
```json
{"status":"UP"}
```

### Test 2: Login (from your frontend or Postman)
POST to: https://sitara-hotel-backend.onrender.com/auth/login
```json
{
  "email": "admin@sitara.com",
  "password": "admin123"
}
```

Should return a JWT token and user details.

---

## 🚨 COMMON ISSUES

### Issue 1: "Communications link failure"
**Cause:** Wrong hostname or Aiven service not running
**Fix:** Double-check the Service URI from Aiven Console

### Issue 2: "Access denied for user 'avnadmin'"
**Cause:** Wrong password
**Fix:** Copy the exact password from Aiven Console (Service URI)

### Issue 3: "Unknown database 'defaultdb'"
**Cause:** Database name is different
**Fix:** Check the database name in Aiven (usually `defaultdb`)

### Issue 4: "SSL connection error"
**Cause:** SSL not properly configured
**Fix:** Ensure `sslMode=REQUIRED` is in the JDBC URL

---

## 📋 QUICK CHECKLIST

- [ ] Aiven MySQL service is RUNNING
- [ ] Copied exact Service URI from Aiven Console
- [ ] Set SPRING_DATASOURCE_URL on Render
- [ ] Set SPRING_DATASOURCE_USERNAME on Render
- [ ] Set SPRING_DATASOURCE_PASSWORD on Render
- [ ] Set SPRING_PROFILES_ACTIVE=prod on Render
- [ ] Set JWT_SECRET on Render
- [ ] Saved changes and waited for redeploy
- [ ] Checked logs - no more connection errors
- [ ] Tested /actuator/health endpoint
- [ ] Tested login with admin@sitara.com

---

## 🎯 EXPECTED RESULT

After completing these steps:
1. Backend connects to Aiven MySQL successfully
2. DataLoader creates admin and user accounts automatically
3. 4 sample rooms are added
4. Frontend can login with admin@sitara.com / admin123
5. Frontend can login with user@sitara.com / user123

---

**Last Updated:** February 10, 2026

