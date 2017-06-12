/** ******************************************************************************************************************
 * @file Describe what  does.
 * @author julian <name@email.com>
 * @since 0.2.0
 * @date 12-Jun-2017
 *
 * FILETIME can overflow, a statement also true for other of the formats here, but using FILETIME as
 * an example, here's an example function body that would return `-1` if the timestamp won't fit.
 *
 * ```cpp
 * int64_t secs = fileTime / WINDOWS_TICK - SEC_TO_UNIX_EPOCH;
 * time_t t = (time_t)secs;
 *
 * return secs != (int64_t)t ? (time_t)-1 : t;
 * ```
 *********************************************************************************************************************/
"use strict";
// @formatter:off

const
    ONE_DAY = 24 * 60 * 60,
    ONE_DAY_MS = ONE_DAY * 1000,
    ELAPSED_SINCE_1900 = ( 70 * 365 + 17 ) * ONE_DAY,   // 1900
    SEC_TO_UNIX_EPOCH = 11644473600,    // 1601
    // WINDOWS_TICK = 1e7,
    HFS_TO_UNIX_EPOCH = 2082844800,     // 1904
    OLE_TO_UNIX_EPOCH = 25569,


    string = s => typeof s === 'string',
    as_number = n => typeof n === 'number' ? n : Number( n ),
    as_date = n => new Date( as_number( n ) ),
    filetime_to_seconds = value => {
        const sts = string( value ) ? value : String( value );

        return Number( sts.substr( 0, sts.length - 7 ) ) - SEC_TO_UNIX_EPOCH;
    },
    filetime = value => new Date( filetime_to_seconds( value ) * 1e3 ),
    ntp_time = value => new Date( ( ( ~~value - ELAPSED_SINCE_1900 ) + ( ( value - ~~value ) / ( 1 << 32 ) ) ) * 1000 ),

    asCamelCase = s => s.replace( /_([a-z])/g, ( $0, $1 ) => $1.toUpperCase() );

/**
 * This should detect and convert JavaScript timestamps (in milliseconds), Unix timestamps (in seconds),
 * NTP time (frational seconds), Windows FILETIME (pseudo-fractional seconds).
 *
 * @param {string|number} value
 * @return {Date}
 */
function timestamp( value )
{
    let sValue, ts;

    if ( string( value ) )
    {
        sValue = value;
        ts = Number( value );
    }
    else
    {
        sValue = String( value );
        ts = value;
    }

    if ( /^\s*\d{5,}\.\d{2,}\s*$/.test( sValue ) )
        return ole_to_date( ts );

    if ( sValue.length === 18 || sValue.length === 19 )
        return filetime( sValue );
    else if ( ts < 1e9 )
        throw new TypeError( "Value sent to timestamp() is probably not a timestamp" );

    if ( ts < 1e11 ) ts *= 1e3;

    return new Date( ts );
}

/**
 * @param {String|Number} ldapValue
 * @return {Date}
 */
function ldap_to_date( ldapValue )
{
    const ts = String( ldapValue );

    return ts === '0' ? null // 0
        : ts === '9223372036854775807' ? null // -1
        : new Date( ( Number( ts.substr( 0, ts.length - 7 ) ) - SEC_TO_UNIX_EPOCH ) * 1e3 );
}

/**
 *
 * @param {Number} ts
 * @return {Date}
 */
function ole_to_date( ts )
{
    return new Date( ( ts - OLE_TO_UNIX_EPOCH ) * ONE_DAY_MS );
}

/**
 *
 * Diagram below is from [Microsoft Developer](https://blogs.msdn.microsoft.com/oldnewthing/20030905-02/?p=42653)
 * Article on 32-bit formats is here [32-Bit Windows Time/Date Formats](https://docs.microsoft.com/en-us/cpp/c-runtime-library/32-bit-windows-time-date-formats)
 *
 * ```
 *                24                16                 8                 0
 * +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+
 * |Y|Y|Y|Y|Y|Y|Y|M| |M|M|M|D|D|D|D|D| |h|h|h|h|h|m|m|m| |m|m|m|s|s|s|s|s|
 * +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+
 * \____________/\________/\_________/ \________/\____________/\_________/
 *      year        month      day        hour       minute      seconds
 * ```
 *
 * @param {Number} ts
 * @return {Date}
 */
function dos_to_date( ts )
{
    ts = Number( ts );

    const
        seconds = ( ts & 31 ) << 1,
        minutes = ( ts >> 5 ) & 63,
        hours = ( ts >> 11 ) & 31,
        day = ( ts >> 16 ) & 31,
        month = ( ts >> 21 ) & 15,
        year = ( ts >> 25 ) & 127,
        dt = new Date( `${year + 1980}-${month}-${day} ${hours}:${minutes}:${seconds}` );

    dt.setTime( dt.getTime() + ( -dt.getTimezoneOffset() * 60 * 1000 ) );

    return dt;
}

/**
 *
 * @param {Uint8Array} buffer
 * @return {Date}
 */
function network_to_host( buffer )
{
    const
        seconds = ( ( buffer[ 0 ] * ( 1 << 24 ) ) + ( buffer[ 1 ] << 16 )  + ( buffer[ 2 ] << 8 ) + buffer[ 3 ] ) - ELAPSED_SINCE_1900,
        micro = ( ( buffer[ 4 ] << 24 ) + ( buffer[ 5 ] << 16 )  + ( buffer[ 6 ] << 8 ) + buffer[ 7 ] ) / ( 1 << 32 ) * 1e3;

    return new Date( seconds * 1e3 + micro );
}

module.exports = {
    js_to_date: as_date,
    unix_to_date: ts => new Date( as_number( ts ) * 1e3 ),
    filetime_to_date: filetime,
    ntp_to_date: ntp_time,
    network_ntp_to_date: network_to_host,
    hfs_to_date: ts => new Date( ( as_number( ts ) + HFS_TO_UNIX_EPOCH ) * 1e3 ),
    ole_to_date,
    ldap_to_date,
    dos_to_date,
    to_date: timestamp
};

Object.keys( module.exports ).forEach( fn => module.exports[ asCamelCase( fn ) ] = module.exports[ fn ] );
