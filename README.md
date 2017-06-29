time-stamps
===========

[![Coveralls Status][coveralls-image]][coveralls-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url] [![npm version][npm-image]][npm-url]  [![License][license-image]][license-url] [![Known Vulnerabilities][snyk-image]][snyk-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![david-dm][david-dm-image]][david-dm-url]
[![bitHound Code][bithound-image]][bithound-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

This module converts a variety of timestamp formats to a standard JavaScript `Date` object. It accepts, as input, the
formats listed below. It exports its functions in both camelCase and snake case formats. In other words, it would
 have both `unixToDate()` and `unix_to_date()` available pointing to the same function, for example.

* JavaScript timestamp

  This is the standard milliseconds since the _UNIX_ epoch (1970-01-01) that you would get from `+new Date()`.
  
* *NIX timestamp

  A standard *nix timestamp in sedconds starting at the usual epoch, same as JavaScript timestamp in seconds, equivalent
  to `+new Date() / 1000`.
  
* Microsoft `FILETIME`

  This is a standard Microsoft `FILETIME` timestamp, measured in 100 nanosecond intervals since 1601-01-01.
   
* _NTP_ timestamp

  The time carried by the _NTP_ protocol in seconds since 1900-01-01 along with a fractional second in microsecond
  intervals.
  
* _NTP_ network timestamp

  Essentiall same as above except it accepts a `Uint8Array` of raw input from the network packet. It would be 8 bytes
  in network order (high endian).
  
* _HFS+_ timestamp

  This takes an _HFS+_ timestamp measured in seconds since 1904-01-01.
  
* _OLE Automation_ timestamp

  Sometimes also called a Microsoft timestamp. It's a fractional value counting seconds since 1899-01-01.
  
* _LDAP_ timestamp

  This is essentially the same as the `FILETIME` but will return `null` for marginal values.
  
* _DOS_ timestamp

  A bit packed 32-bit value encoding a time and date with a 2 second level of precision.
  
Also included is a function that attempts to guess the timestamp format. This can be helpful if you may receive both
 JavaScript and _UNIX_ timestamps. It may guess wrong as it doesn't try anything overly extravagant to determine
 the timestamp type. I use successfully to distinguish between JavaScript and _UNIX_ timestamps that are not decades
 removed from our current time.
 
## Usage

```js
const
    { 
        js_to_date, 
        unix_to_date, 
        filetime_to_date, 
        ntp_to_date, 
        network_ntp_to_date, 
        hfs_to_date, 
        ole_to_date,
        ldap_to_date,
        dos_to_date,
        to_date
    } = require( 'time-stamps' ),
    
    someTimestamp = +new Date( '2016-09-22T19:22:14Z' ),
    someUnixTimestamp = someTimestamp / 1000;

let ts1 = js_to_date( someTimestamp ),
    ts2 = unix_to_date( someUnixTimestamp );

assert( String( ts1 ) === String( ts2 ) );

// or

const 
    ts = require( 'time-stamps' );

let tsa = ts.js_to_date( someTimestamp ),
    tsb = ts.unix_to_date( someUnixTimestamp );

assert( String( tsa ) === String( tsb ) );
```

[coveralls-image]: https://coveralls.io/repos/github/julianjensen/time-stamps/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/julianjensen/time-stamps?branch=master

[travis-url]: https://travis-ci.org/julianjensen/time-stamps
[travis-image]: http://img.shields.io/travis/julianjensen/time-stamps.svg

[depstat-url]: https://gemnasium.com/github.com/julianjensen/time-stamps
[depstat-image]: https://gemnasium.com/badges/github.com/julianjensen/time-stamps.svg

[npm-url]: https://badge.fury.io/js/time-stamps
[npm-image]: https://badge.fury.io/js/time-stamps.svg

[license-url]: https://github.com/julianjensen/time-stamps/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg

[snyk-url]: https://snyk.io/test/github/julianjensen/time-stamps
[snyk-image]: https://snyk.io/test/github/julianjensen/time-stamps/badge.svg

[codacy-url]: https://www.codacy.com/app/julianjensen/time-stamps?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=julianjensen/time-stamps&amp;utm_campaign=Badge_Grade
[codacy-image]: https://api.codacy.com/project/badge/Grade/2f7a4653c6f64569baa946125494e26a

[david-dm-image]: https://david-dm.org/julianjensen/time-stamps.svg
[david-dm-url]: https://david-dm.org/julianjensen/time-stamps

[bithound-image]: https://www.bithound.io/github/julianjensen/time-stamps/badges/code.svg
[bithound-url]: https://www.bithound.io/github/julianjensen/time-stamps

[codeclimate-image]: https://codeclimate.com/github/julianjensen/time-stamps/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/julianjensen/time-stamps
