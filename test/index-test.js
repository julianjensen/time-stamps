/** ******************************************************************************************************************
 * @file Describe what  does.
 * @author julian <name@email.com>
 * @since 0.2.0
 * @date 12-Jun-2017
 *********************************************************************************************************************/
"use strict";
// @formatter:off

const
    ts = require( '../' ),
    expect = require( 'chai' ).expect,
    testDate = '2016-09-22T19:22:14Z',
    testTS = +new Date( testDate ),
    testUX = ~~( testTS / 1e3 ),    // 1474572134
    hfsTime = testUX - 2082844800,
    ntpTime = 3683560934.0,
    rawNtpTime = new Uint8Array( [ 0xdb, 0x8e, 0xad, 0xe6, 0x00, 0x00, 0x00, 0x00 ] ),
    ft = 131190457340000000,
    fts = '131190457340000000',
    oleAutomationTS = 42635.807106482,
    dosTime = ( ( 2016 - 1980 ) << 25 ) + ( 9 << 21 ) + ( 22 << 16 ) + ( 19 << 11 ) + ( 22 << 5 ) + 7;

console.log( `keys: ${Object.keys( ts )}` );

describe( 'time-stamps', function() {

    it( 'should convert JavaScript timestamps to Date format', () => {
        const test = ts.js_to_date( testTS );

        expect( test ).to.be.instanceof( Date );
        expect( test.getTime() ).to.equal( testTS );
    } );

    it( 'should convert UNIX timestamps to Date format', () => {
        const test = ts.unix_to_date( testUX );

        expect( test ).to.be.instanceof( Date );
        expect( test.getTime() ).to.equal( testTS );
    } );

    it( 'should convert a FILETIME timestamp to Date format', () => {
        const
            test = ts.filetime_to_date( ft ),
            test1 = ts.filetime_to_date( fts );

        expect( test ).to.be.instanceof( Date );
        expect( test1 ).to.be.instanceof( Date );
        expect( test.getTime() ).to.equal( testTS );
        expect( test1.getTime() ).to.equal( testTS );
    } );

    it( 'should convert 32-bit DOS timestamps to Date format', () => {
        const test = ts.dos_to_date( dosTime );

        expect( test ).to.be.instanceof( Date );
        expect( test.getTime() ).to.equal( testTS );
    } );

    it( 'should convert NTP time to Date format', () => {
        const
            test = ts.ntp_to_date( ntpTime ),
            tests = ts.ntp_to_date( ntpTime + '' );

        expect( test ).to.be.instanceof( Date );
        expect( tests ).to.be.instanceof( Date );
        expect( test.getTime() ).to.equal( testTS );
        expect( tests.getTime() ).to.equal( testTS );
    } );

    it( 'should convert raw network NTP time to Date format', () => {
        const
            test = ts.network_ntp_to_date( rawNtpTime );

        expect( test ).to.be.instanceof( Date );
        expect( test.getTime() ).to.equal( testTS );
    } );

    it( 'should convert LDAP time to Date format', () => {
        const
            test = ts.ldap_to_date( ft ),
            bad1 = ts.ldap_to_date( 0 ),
            bad2 = ts.ldap_to_date( '9223372036854775807' );

        expect( test ).to.be.instanceof( Date );
        expect( test.getTime() ).to.equal( testTS );
        expect( bad1 ).to.be.null;
        expect( bad2 ).to.be.null;
    } );

    it( 'should convert HFS+ time to Date format', () => {
        const
            test = ts.hfs_to_date( hfsTime ),
            tests = ts.hfs_to_date( String( hfsTime ) );

        expect( test ).to.be.instanceof( Date );
        expect( tests ).to.be.instanceof( Date );
        expect( test.getTime() ).to.equal( testTS );
        expect( tests.getTime() ).to.equal( testTS );
    } );

    it( 'should guess value type correctly and return a Date object', () => {
        const
            ctrl = +new Date( testDate ),
            fromts = ts.to_date( testTS ),
            fromsts = ts.to_date( String( testTS ) ),
            fromux = ts.to_date( testUX ),
            fromft = ts.to_date( ft ),
            fromfts = ts.to_date( fts ),
            fromOle = ts.to_date( oleAutomationTS );

        expect( fromts.getTime() ).to.equal( ctrl );
        expect( fromsts.getTime() ).to.equal( ctrl );
        expect( fromux.getTime() ).to.equal( ctrl );
        expect( fromft.getTime() ).to.equal( ctrl );
        expect( fromfts.getTime() ).to.equal( ctrl );
        expect( fromOle.getTime() ).to.equal( ctrl );
        expect( ts.to_date.bind( ts, 1 ) ).to.throw( TypeError ); // , 'Value sent to timestamp() is probably not a timestamp' );
    } );
} );

