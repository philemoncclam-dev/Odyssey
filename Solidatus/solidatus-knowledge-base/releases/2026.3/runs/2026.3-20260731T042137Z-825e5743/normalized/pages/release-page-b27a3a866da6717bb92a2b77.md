# FAQ

## Collibra connector setup

* The Collibra connector is erroring with this message on setup: `self signed certificate in certificate chain`
  * This could be due to a rejection from a proxy or firewall. The Collibra connector is a Node.js-based packaged executable; as such, it requires the user to add to its list of "well-known" certificate authorities. If not, `node-fetch` (the library that sends https requests) will not be able to get its requests forwarded through the proxies. Check the README for the environment variables section for help.
* The Collibra connector is erroring with this message on setup: `connect ETIMEDOUT <ip-address>`
  * This could be due to the connector not being able to access the Solidatus host provided in the settings file. Please ensure that the proxy provided in the `colProxyURL` or `solProxyURL` is correct (with port).
* The Collibra connector is erroring with this message on setup: `EPROTO <...:error:...> SSL routines:ssl3_get_record:wrong version number:../deps/openssl/openssl/ssl/record/ssl3_record.c:354:`
  * This is a protocol error with either the proxy URL or Solidatus URL. Please ensure that the proxy provided in `colProxyURL`, `solProxyURL`, `colHost` and `solHost` have the correct protocol.

## Collibra import connector

* The Collibra import connector's output module query file upload doesn't allow me to upload files.
  * This is an issue that will occur on versions of Solidatus before 5.6.8. Please talk to your Solidatus contact if this issue needs to be urgently rectified.
* The Collibra import connector errors out with `Premature close`.
  * This is an error that occurs against the Collibra API when using Node.js' fetch library. Try using a smaller page size.
* The Collibra import connector does not generate transitions between assets entities in different Solidatus layers when using Collibra domain IDs to import into Solidatus.
  * Try to import the encompassing Collibra community if the domains exist in the same community; or try to use output module query importing.

## Collibra export connector

* The Collibra export connector agent jobs always succeed even though the job has not completed in Collibra.
  * The Collibra export connector submits a job to the Collibra import job scheduler. The success of the connector agent job reflects the success of the submission that job. For the outcome of the job, please reference the Collibra activities page.
