# Security Review - Parkside Harmony Website

**Review Date:** January 2026  
**Reviewer:** Pre-launch security audit using Claude  
**Framework:** OWASP Top 10:2025  

---

## Executive Summary

A comprehensive security review was conducted on the Parkside Harmony website prior to launch. The review covered dependency security, authentication, API route protection, input validation, and security headers.

**Overall Assessment:** ✅ **Ready for Launch**

All critical and high-severity vulnerabilities have been addressed. The site follows security best practices for a Next.js application with proper authentication, input validation, and security headers in place.

---

## Vulnerabilities Fixed

### 🔴 Critical

| Issue | Location | Fix |
|-------|----------|-----|
| XSS in contact form emails | `/api/contact/route.ts` | Added `escapeHtml()` function to sanitize all user input before HTML interpolation |
| Dependency vulnerabilities (7 total) | `package.json` | Ran `npm audit fix` - resolved form-data, tar-fs, js-yaml, undici, eslint/plugin-kit, brace-expansion |

### 🟠 High

| Issue | Location | Fix |
|-------|----------|-----|
| No file type validation on uploads | `/api/admin/images/upload/route.ts` | Added MIME type whitelist (JPEG, PNG, GIF, WebP only), file size limit (4.5MB) |
| Admin API routes not in middleware | `middleware.ts` | Added `/api/admin/:path*` to matcher for defense-in-depth |
| Missing security headers | `next.config.ts` | Added CSP, X-Frame-Options, HSTS, and other security headers |

### 🟡 Medium

| Issue | Location | Fix |
|-------|----------|-----|
| No input validation on contact form | `/api/contact/route.ts` | Added length limits, type checking for all fields |
| No YouTube ID validation | `/api/admin/videos/route.ts` | Added regex validation, year range check, chorus whitelist |
| No input validation on leadership | `/api/admin/leadership/route.ts` | Added category validation, length limits, type checking |
| No validation on site settings | `/api/admin/site-settings/route.ts` | Added recursive object validation, prototype pollution protection |
| Error message leakage | `/api/admin/events/sync/route.ts`, `/api/admin/news/sync/route.ts` | Replaced detailed errors with generic messages |
| Hardcoded email address | `/api/contact/route.ts` | Moved to `CONTACT_FORM_EMAIL` environment variable |
| Unnecessary dependencies | `package.json` | Moved puppeteer and jsdom to devDependencies, removed unused @types/react-youtube |

### 🟢 Low

| Issue | Location | Fix |
|-------|----------|-----|
| URL validation missing | `/api/admin/youtube-metadata/route.ts` | Added YouTube URL/ID format validation with regex |
| Category param not validated | `/api/admin/leadership/route.ts` | Added whitelist validation for query parameters |

---

## Security Posture Summary

### ✅ Authentication & Authorization
- **NextAuth.js v5** with Google/GitHub OAuth
- Admin access controlled by email allowlist in Vercel KV
- Middleware protects `/admin/*` and `/api/admin/*` routes
- Each API route also checks `session?.user?.isAdmin` (defense-in-depth)
- Non-admin users blocked at sign-in (cannot authenticate at all)

### ✅ Input Validation
- All public-facing inputs (contact form) have length limits and type validation
- HTML escaping prevents XSS in email content
- File uploads restricted to image MIME types with size limits
- YouTube URLs validated with regex pattern
- Admin inputs validated for type, length, and allowed values

### ✅ Security Headers
Configured in `next.config.ts`:
- **Content-Security-Policy** - Restricts resource loading to trusted sources
- **X-Frame-Options: SAMEORIGIN** - Prevents clickjacking
- **X-Content-Type-Options: nosniff** - Prevents MIME sniffing
- **Referrer-Policy: strict-origin-when-cross-origin** - Privacy protection
- **Permissions-Policy** - Disables camera, microphone, geolocation
- **Strict-Transport-Security** - Enforces HTTPS (1 year max-age)
- **X-XSS-Protection** - Legacy browser protection

### ✅ External Content Handling
- Scraping URLs are hardcoded (no SSRF risk)
- YouTube metadata fetching validates URL format and extracts only video ID
- No user input can influence server-side fetch targets

### ✅ Data Protection
- All secrets in environment variables (none hardcoded)
- `.env` files properly in `.gitignore`
- Vercel KV credentials handled automatically
- No sensitive data in console logs
- Error messages don't expose internal details

### ✅ CORS & Same-Origin
- No `Access-Control-Allow-Origin` headers set
- API protected by browser same-origin policy by default

---

## Pre-Launch Checklist

- [x] All critical vulnerabilities fixed
- [x] All high-severity vulnerabilities fixed
- [x] Dependencies audited and updated (`npm audit` shows 0 vulnerabilities)
- [x] Security headers configured
- [x] Admin routes protected by middleware
- [x] Admin API routes check authentication
- [x] Contact form input validated and sanitized
- [x] File uploads restricted to images with size limits
- [x] Secrets stored in environment variables
- [x] Error messages don't leak internal details

---

## Future Improvements

These items are tracked in GitHub Issues under the "Security Improvements Tracking" issue:

### Medium Priority
- [ ] **Implement role-based admin hierarchy** - Currently any admin can add/remove other admins
- [ ] **Consolidate admin user storage** - `admin:users` and `admin:emails` in KV could drift
- [ ] **Add rate limiting to contact form** - Prevent spam attacks
- [ ] **Add rate limiting to auth endpoints** - Prevent brute force on OAuth flow

### Low Priority
- [ ] **Add audit logging for admin actions** - Track user changes, content edits
- [ ] **Configure explicit session lifetime** - Currently using NextAuth defaults
- [ ] **Add file magic byte validation** - Currently validates MIME type from header only

---

## Intentionally Public Endpoints

These endpoints are public by design for frontend use:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/site-settings` | Returns non-sensitive config (banners, images) |
| `GET /api/page-content` | Returns page content for public display |
| `GET /api/leadership` | Leadership data for public leadership page |
| `GET /api/events` | Public events listing |
| `GET /api/news` | Public news listing |
| `GET /api/videos` | Public video listing |
| `POST /api/contact` | Contact form submissions |

---

## Environment Variables Required

Ensure these are set in Vercel (or your hosting provider):

| Variable | Purpose |
|----------|---------|
| `AUTH_SECRET` | NextAuth.js session encryption |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_GITHUB_ID` | GitHub OAuth client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth client secret |
| `KV_REST_API_URL` | Vercel KV connection |
| `KV_REST_API_TOKEN` | Vercel KV authentication |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage |
| `RESEND_API_KEY` | Email sending via Resend |
| `CONTACT_FORM_EMAIL` | Destination for contact form (default: info@parksideharmony.org) |

---

## Commits & Pull Requests

| PR/Branch | Changes |
|-----------|---------|
| `claude/audit-dependencies-uX7KI` | Fixed 7 dependency vulnerabilities, moved puppeteer/jsdom to devDependencies |
| `claude/audit-secrets-exposure-T6tnk` | Moved hardcoded email to environment variable |
| `claude/review-nextauth-implementation-YjKJ2` | Added `/api/admin/*` to middleware, documented security architecture |
| `claude/review-api-security-yP5S1` | Added input validation, XSS protection, error handling across all API routes |
| `claude/review-nextjs-security-zfUqM` | Added comprehensive security headers to next.config.ts |

---

## Notes for Future Developers

1. **Adding new admin API routes**: Always include the auth check at the top:
   ```typescript
   const session = await auth();
   if (!session?.user?.isAdmin) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
   ```

2. **Adding new public endpoints**: Update this document's "Intentionally Public Endpoints" section.

3. **Modifying CSP**: Update the Content-Security-Policy in `next.config.ts` if adding new external resources.

4. **User input handling**: Always validate type, length, and format. Use `escapeHtml()` if rendering in HTML context.

---

*This review was conducted in January 2026 as part of the pre-launch security audit.*
