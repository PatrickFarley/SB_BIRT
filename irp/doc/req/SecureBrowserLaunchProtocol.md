#Secure Browser Launch Protocol Specification
v.1.0 - Last modified 20-Apr-2017

## IP Notice
This specification is &copy;2017 by The Regents of the University of California, Smarter Balanced Assessment Consortium and is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

## Overview
In order to provide a seamless launch experience for the student, as well as centrally-managed experience for states, the Secure Browser follows a simple caching protocol described herein.

The launch protocol is implemented using a hosted webpage with a hard-coded list of testing hosts. The host of the launch page would be the gatekeeper to other uses of the browser, and be responsible for managing link updates, load, and user experience for that page. 
 
Once the student selects a test site, the browser is redirected to that site and stores the selections in the browser's cache. Future launches of the browser will apply the cached selections (if any) and immediately direct to the selected testing site.

Optionally, a mechanism to clear the cache or return back to the launch page may be provided.
### Features
* Secure Browser hardcodes only one landing page URL, which is the hosted URL containing all available testing hosts.* Student makes site selection(s) on landing page and gets redirected* Initial selection(s) will be cached and reused for next launch### Benefits* URLs can be updated in real time in a single location* Landing site can be scaled to handle necessary load when needed* Login process only executed once per student

### Design

![SBLP](https://github.com/SmarterApp/SB_BIRT/blob/master/irp/doc/req/SecureBrowserLaunchProtocol.png)

#### Cache Structure
A cache file will be generated 

## References
1. [Secure Browser Functional Requirements](https://github.com/SmarterApp/SB_BIRT/blob/master/irp/doc/req/SecureBrowserFunctionalRequirements.md)
1. [Secure Browser API Specification](https://github.com/SmarterApp/SB_BIRT/blob/master/irp/doc/req/SecureBrowserAPIspecification.md)
