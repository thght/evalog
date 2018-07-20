//
// Jasmine tests for evalog
//
const _			= require( 'types.js' );
const evalog	= require( '../evalog.js' );

evalog.log= function( msg ){
	evalog.latest= msg;
};

const ID					= 'ProperInit:'
const RESOLVE_MESSAGE= 'this is a test resolve message';
const REJECT_MESSAGE	= 'this is a test reject message';

const PROPER_INIT= {
	 id			: ID
	,evaluator	: ( predicate ) => predicate
	,resolve		: RESOLVE_MESSAGE
	,reject		: REJECT_MESSAGE
};



describe("evalog( settings )", function() {

	it("evalog should always return a function", function(){
		result= evalog( undefined );
      expect( _.isFunction(result) ).toBe( true );

		result= evalog( null );
      expect( _.isFunction(result) ).toBe( true );

		result= evalog( {} );
      expect( _.isFunction(result) ).toBe( true );

		result= evalog( {evaluator: 'must be a function!'} );
      expect( _.isFunction(result) ).toBe( true );
	});


	it("the returned function should return a warning message when called if initialization failed", function(){

		const testImproperInit= function( settings ){
	        result= evalog( settings );
	        expect( result() ).toBe( 'evalog: WARNING: this is an empty function due to improper initialization!' );
	   };

		testImproperInit( undefined );
		testImproperInit( null );
		testImproperInit( {} );
		testImproperInit( {evaluator: 'must be a function!'} );
	});


	it("the returned function should return true when predicate is evaluated as true", function(){
	   testBool= evalog( PROPER_INIT );
	   expect( testBool(true) ).toBe( true );
	   expect( testBool(false) ).toBe( false );
	});


	it("the returned function should return the initialized resolve and reject messages", function(){
		const oldLog= evalog.log;

		evalog.log= function( message ){
		   expect( message ).toBe( ID+ ' '+ RESOLVE_MESSAGE );
		};
	   testBool= evalog( PROPER_INIT );
	   testBool( true );

		evalog.log= function( message ){
		   expect( message ).toBe( ID+ ' '+ REJECT_MESSAGE );
		};
	   testBool( false );

		evalog.log= oldLog;
	});


	it("when resolve and reject are functions, they should receive the correct arguments ", function(){
		const oldLog= evalog.log;

	   const msgFuncInit= {
			 id			: ID
			,evaluator	: ( predicate ) => predicate
			,resolve		: ( predicate, id ) => {
		   	expect( predicate ).toBe( true );
		   	expect( id ).toBe( ID );
			}
			,reject		: ( predicate, id ) => {
		   	expect( predicate ).toBe( false );
		   	expect( id ).toBe( ID );
			}
		};

	   testBool= evalog( msgFuncInit );
	   testBool( true );
	   testBool( false );

		evalog.log= oldLog;
	});

});







// if (test '') then console.log 'all done.'