# Production Deployment Checklist

## Pre-Deployment Security Checks

### Environment Configuration
- [ ] Update `.env.production` with actual production API URL
- [ ] Verify `REACT_APP_API_BASE` is set correctly
- [ ] Ensure `.env.production` is NOT committed to version control
- [ ] Configure environment variables in hosting platform (Vercel, Netlify, etc.)

### Security Headers
- [ ] Choose and configure security headers based on hosting platform:
  - **Netlify**: Use `public/_headers` file (already created)
  - **Vercel**: Use `vercel.json` (already created)
  - **Nginx**: Apply configuration from `nginx-security-headers.conf`
  - **Other**: Configure headers in your hosting platform
- [ ] Update Content-Security-Policy `connect-src` with actual production API URL
- [ ] Enable HSTS (`Strict-Transport-Security`) only AFTER SSL certificate is active
- [ ] Test CSP doesn't break functionality (check browser console for CSP violations)

### Dependencies & Vulnerabilities
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Run `npm audit fix` to automatically fix vulnerabilities
- [ ] Review and manually fix remaining high/critical vulnerabilities
- [ ] Update outdated dependencies: `npm outdated`
- [ ] Test application after dependency updates

### Authentication & Token Security
- [ ] Verify token expiration is working (5-minute buffer before actual expiry)
- [ ] Test automatic logout on token expiration
- [ ] Confirm 401 responses redirect to `/login` page
- [ ] Test role-based access control for protected routes
- [ ] Verify unauthorized access attempts are properly blocked

### API & Backend Coordination
- [ ] Ensure backend API is secured with HTTPS in production
- [ ] Verify CORS is properly configured on backend to allow frontend domain
- [ ] Test all API endpoints from production frontend
- [ ] Confirm backend validates JWT tokens properly
- [ ] Check backend implements rate limiting

### Build & Performance
- [ ] Run production build: `npm run build`
- [ ] Verify build completes without errors or warnings
- [ ] Check bundle size is reasonable (under 500KB gzipped recommended)
- [ ] Test production build locally: `npx serve -s build`
- [ ] Enable source maps for error tracking (optional, configure in build)

### Content & Metadata
- [ ] Update `manifest.json` with correct app name and branding
- [ ] Update `index.html` title and meta descriptions
- [ ] Configure `robots.txt` based on whether site should be indexed
- [ ] Add favicon and app icons (logo192.png, logo512.png)
- [ ] Test PWA installation (if applicable)

### Error Handling & Monitoring
- [ ] Verify ErrorBoundary catches and displays errors properly
- [ ] Console logs are suppressed in production (using logError utility)
- [ ] Consider adding error monitoring service (Sentry, LogRocket, etc.)
- [ ] Test error messages don't expose sensitive information
- [ ] Implement backend error logging

### Testing
- [ ] Run all tests: `npm test`
- [ ] Manual testing of critical user flows:
  - [ ] Login/logout
  - [ ] Book browsing and search
  - [ ] Creating/editing books (admin users)
  - [ ] Loan creation and management
  - [ ] User management (admin users)
  - [ ] Settings page
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (responsive design)
- [ ] Test with slow network connection
- [ ] Test token expiration and automatic logout

### SSL/HTTPS
- [ ] Obtain and configure SSL certificate
- [ ] Verify HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] Enable HSTS header after SSL is confirmed working
- [ ] Test SSL configuration: https://www.ssllabs.com/ssltest/

### Additional Security Measures
- [ ] Implement rate limiting on login endpoint (backend)
- [ ] Add CAPTCHA for login after multiple failed attempts (optional)
- [ ] Configure session timeout (current: based on JWT expiration)
- [ ] Review and test input sanitization for all user inputs
- [ ] Audit localStorage usage (currently: JWT token only)
- [ ] Consider implementing refresh token mechanism (requires backend)

### Documentation
- [ ] Update README with deployment instructions
- [ ] Document environment variables required
- [ ] Create runbook for common issues
- [ ] Document security configuration
- [ ] Create user guide (if needed)

### Post-Deployment
- [ ] Monitor application logs for errors
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Monitor API response times and errors
- [ ] Set up alerts for critical errors
- [ ] Backup deployment configuration
- [ ] Document rollback procedure

## Quick Security Audit Commands

```bash
# Check for dependency vulnerabilities
npm audit

# Fix automatically fixable vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Run production build
npm run build

# Test production build locally
npx serve -s build

# Check bundle size
npm run build && ls -lh build/static/js/*.js
```

## Security Headers Testing

After deployment, test your security headers:
- Use https://securityheaders.com to scan your site
- Check browser console for CSP violations
- Verify X-Frame-Options prevents embedding
- Test HSTS is active (after enabling)

## Common Issues & Solutions

### Issue: API calls fail in production
- **Check**: REACT_APP_API_BASE environment variable
- **Check**: CORS configuration on backend
- **Check**: API endpoint is accessible from production domain

### Issue: Token expiration not working
- **Check**: Backend JWT expiration time matches frontend expectations
- **Check**: System time is synchronized (affects JWT exp validation)

### Issue: CSP blocking resources
- **Solution**: Update CSP directives in security headers
- **Check**: Browser console for CSP violation reports
- **Action**: Add legitimate sources to CSP whitelist

### Issue: Users can't login
- **Check**: Backend authentication endpoint is working
- **Check**: Token is being stored in localStorage
- **Check**: Network tab for 401/403 responses

## Emergency Rollback

If critical issues occur in production:

1. Revert to previous deployment via hosting platform
2. Or quickly deploy last stable version from git:
   ```bash
   git checkout <last-stable-commit>
   npm install
   npm run build
   # Deploy build folder
   ```

## Support Contacts

- **Backend Team**: [Add contact information]
- **DevOps/Infrastructure**: [Add contact information]
- **Security Team**: [Add contact information]

---

**Last Updated**: November 14, 2025
**Version**: 1.0
