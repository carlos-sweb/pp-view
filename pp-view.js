(function(factory ){

		var root = typeof self == 'object' && self.self === self && self ||
		typeof global == 'object' && global.global === global && global;

		if (typeof define === 'function' && define.amd) {
		define(['ppModel', 'ppElementjson' , 'ppEvents' , 'ppIs' , 'ppElement' ,'exports'],
		function( ppModel , ppElementjson , ppEvents , ppIs , exports ) {
		  root.ppView = factory( root , exports , ppModel , ppElementjson , ppEvents , ppIs , ppElement );
		});

		} else if (typeof exports !== 'undefined') {

		var ppModel = {}, ppElementjson = {}, ppEvents = {}, ppIs = {},ppElement = {};
		try { ppModel = require('pp-model.js'); } catch (e) {}
		try { ppElementjson = require('pp-elementjson.js'); } catch (e) {}
		try { ppEvents = require('pp-events'); } catch (e) {}
		try { ppIs = require('pp-is'); } catch (e) {}
		try { ppElement = require('pp-element'); } catch (e) {}
		factory( root , exports , ppModel , ppElementjson , ppEvents , ppIs , ppElement );
		} else {
				root.ppView = factory( root , {} , root.ppModel , root.ppElementjson , root.ppEvents , root.ppIs , root.ppElement );
		}

})(function( root, exports ,  _model , _elementjson , _events , _is , _element ) {

	var isF = _is.isFunction ,
	isO   = _is.isObject ,
	isS   = _is.isString ,
	isU   = _is.isUndefined,
	isE   = _is.isElement,
	isN   = _is.isNull,
	warn  = console.warn,
	error = console.error;
	// ===========================================================================
	var has = function( value , property){
		return value.hasOwnProperty( property );
	}
	// ===========================================================================
	var getKeys = function( value ){
		return Object.keys( value );
	}
	// ===========================================================================
	/*
	*@name render
	*@type render
	*@params
	*	@element = element html
	*   @html = html code
	*@description: renderizamos el html en el elemento
	*/
	function render( element , html ){
		if( isS( html ) ){
			if( isE( element ) ){
				element.innerHTML = html;
			}
		}
	}
	// ===========================================================================
	/*
	*@name ErrorThrow
	*@type Function
	*@params
	*	@msg {String}= Mensaje
	*@description: Lanzamos un error
	*/
	function ErrorThrow( msg ){
		throw msg;
	}

	function isUrlHttp( url ){
		return isS( url );
	}

	// ===========================================================================
	/*
	*@name getView
	*@type Function
	*@params
	*	@options {Object}= La configuración principal
	*@description: capturamos el elemento html para el prcedimeinto de la clase
	*/
	function getView( options ){
		if(!isO(options)){ ErrorThrow('options dont defined')};
		// El Mensaje de error  a analizar
		var msgError = 'View dont defined';
		// Defininedo la view
		var view = has( options , 'view' ) ? (
			isS( options.view ) ? (
					/* Es una cadena verificamos que no este vacia*/
				 options.view !== '' ? (
					// En este punto es una cadena y no esta vacia
					!isN( document.querySelector('[pp-view='+options.view+']') ) ?
					document.querySelector('[pp-view='+options.view+']') : ErrorThrow(msgError)
				) : ErrorThrow(msgError)
			 ):
			/* lo que recivimos no es un string*/
			(
				isE( options.view ) ? options.view :
				/* en este punto existe la clave pero no es un string ni element html*/
				ErrorThrow(msgError)
			)
		):/* No existe la llave view - un problema*/  ErrorThrow(msgError);
		return view;
	}

	// ===========================================================================
	/*
	*@name getView
	*@type Function
	*@params
	*	@options {Object}= La configuración principal
	*@description: capturamos el elemento html para el prcedimeinto de la clase
	*/
	function getTemplate(options){

			if(!isO(options)){ return "";}

			return has( options ,  'template' ) ? (
				//Verificamos que sea una String
				isS( options.template ) ? options.template : ErrorThrow('Must template option will be string')
			) : has( options , 'templateJson'  ) ? (
				//Verificamos que sea un object
				isO( options.templateJson ) ? options.templateJson : ErrorThrow('Must templateJson option will be object')
			) : has( options , 'templateUrl' ) ? (
				//Verificamos que sea Url
				isUrlHttp( options.templateUrl ) ? options.templateUrl : ErrorThrow('Must templateUrl option will be string url')
			) : undefined;

	}
	// ===========================================================================
	/*
	*@name getEvents
	*@type Function
	*@params
	*	@options {Object}= La configuración principal
	*@description: capturamos los events para ser procesados
	*/
	function getEvents( options , view , methods ,model ){
		// Definimos un contendor para los eventos typo object
		// -------------------------------------------------------------------------
		var events = {};
		// -------------------------------------------------------------------------
		// verificamos que la llave events exista en el objeto principal
		if( has( options , 'events' ) ){
			// -----------------------------------------------------------------------
			var events = options.events;
			// -----------------------------------------------------------------------
			// Verificamos que sea un objeto
			if( isO( events ) ){
			// -----------------------------------------------------------------------
				// ---------------------------------------------------------------------
				// Obtenemos las llaves para ser procesadas
				var eventsKey = getKeys( events );
				// ---------------------------------------------------------------------
				for( var i = 0; i < eventsKey.length ; i++ ){
					// -------------------------------------------------------------------
					// Obtenemos la key example "h1,h2|click"
					var tagEvent = eventsKey[i].split("|");
					// -------------------------------------------------------------------
					// Obtenemos el valor que corresponde al methodo a ejecutar "hello"
					var method = events[ eventsKey[i] ];
					// -------------------------------------------------------------------
					// Verificamos que hallan por lo menos dos claves (tag|event)
					if( tagEvent.length === 2 ){
						if( tagEvent[0] !== "" && tagEvent[1] !== "" ){
							// ---------------------------------------------------------------
							// Verificamos que se hallan declarado mas de un elemento
							//html por example h1,h2|click
							var _Tags = tagEvent[0].split(",");
							// ---------------------------------------------------------------
							// Nombre del evento que deseamos enlazar con el metodo
							var _Event = tagEvent[1];
							// ---------------------------------------------------------------
							// recorremos todos los tag
							for( var ii = 0; ii < _Tags.length ; ii++ ){
									// Tag Individual
									var _Tag = _Tags[ii].trim();
									// verificamos que la view sea un elemento html
									if( isE( view ) && _Tag !== "" ){
										// ---------------------------------------------------------
										// Tratamos de capturar todos los elementos html
										try{ var elementLisen = view.querySelectorAll(_Tag); }catch(ErrorelementLisen){ var elementLisen = null;}
										if(!isN(elementLisen)){
											for( var iii = 0; iii < elementLisen.length ; iii++ ){
													elementLisen[iii].addEventListener(_Event,function(_event){
															// Verificamos que exista pp-element
															var element = isU( _element ) ? _event.currentTarget : _element( _event.currentTarget ) ;
															try{
																methods[method]( element  , model , _event );
															}catch(ErrorMethod){ };
													});
											}
										}// no sea null
									}// view debe ser elemento
							}// for los tags
						}// if ( verificamos que las cadenas no esten vacias )
					}//if( 2 length min )
				} // for all events
			} // if( isO  )
		}// --- if( has( options , events) )
		return events;
	}

	// ===========================================================================
	/*
	*@name getModel
	*@type Function
	*@params
	*	@options {Object}= La configuración principal
	*@description: Crea revisando el ppModel
	*/
	function getModel( options ){
			if( !isO(options) ){ return {}; };
			// Verificamos que se halla pasado un modelo
			// se se ocupa la extendio pp-model se activa
			// en caso contrato solo se crea un objeto simple
			var modelObject = has( options , 'model' )  ? (
				isO(options.model) ? options.model : {}
			) :  {} ;
			// Aqui prodiamos agregar valores pre definidos al modelo
			var model =  isF( _model )  ?  new _model() : modelObject;
			return isF( model ) ? new model( modelObject ) : model;
	}
	// ===========================================================================
	return function( options ){
		//==========================================================================
		if( options === undefined ){
			error('Crital Error')
			error( 'pp-view say : Must provide object config' );
			return;
		}
		//==========================================================================
		if( !isO( options ) ){
			error('Crital Error')
			error( 'pp-view say : Must provide object config' );
			return;
		}
		// =========================================================================
		// ===== IDENTIFICACIÓN DEL ELEMENTO A PROCESAR
		try{
				this.view = getView( options );
		}catch( viewError ){
				error( "Critical Error: ");
				error( "pp-view say : "+viewError );
				return;
		}
		// =========================================================================
		// Definimos el tipo de template que vamos a procesar
		// SI NO ESTA
		try{
			this.template = getTemplate( options );
		}catch( ErrorTemplate ){
				warn( ErrorTemplate );
		}
		//==========================================================================
		//===== Procesamos el modelo
		this.model = getModel( options );
		//==========================================================================
		//======= Conectamos los observe de la data
		if( has( options , 'observe' ) ){
			if( isO( options.observe ) ){
				var observeKeys = getKeys( options.observe );
				for( var i = 0; i < observeKeys.length ; i++ ){
					if( this.model.has( observeKeys[i] ) ){
						// Es una funcion
						if( isF( options.observe[observeKeys[i]] ) ){
							this.model.on('changed:count',options.observe[observeKeys[i]].bind(this))
						}
						// Es una funcion
					}
				}
			}
		}
		// =========================================================================
		// ====== Procesamos los Observe
		this.methods = has( options , 'methods' ) ? (
			isO( options.methods ) ? options.methods : {}
		) : {};
		//==========================================================================
		//======= RENDERIZAMOS EL TEMPLATE SI ES DIFERENTE A UNDEFINED
	 	!isU(this.template) && render( this.view , this.template );
		//======= ENLAZAMOS LOS EVENTOS CON EL RENDERIZADO si ubiese
		// Hay que trabajar aqui
		getEvents( options , this.view , this.methods , this.model );







		//==========================================================================
    //======= Ejecutamos el controllador
		if( has(options,"controller") ){
			//========================================================================
			//==========================   CONTROLLER   ==============================
			if( isF( options.controller ) ){
				this.controller = options.controller;
				var element = isU(_element) ? this.view : _element( this.view );
				this.controller( element , this.model );
			}
		}
		//==========================================================================
	}
})
