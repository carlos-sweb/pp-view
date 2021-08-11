(function(factory ){

		var root = typeof self == 'object' && self.self === self && self ||
		typeof global == 'object' && global.global === global && global;


		if (typeof define === 'function' && define.amd) {
		define(['ppModel', 'ppElementjson' , 'ppEvents' , 'ppIs' , 'exports'],
		function( ppModel , ppElementjson , ppEvents , ppIs , exports ) {
		  root.ppView = factory( root , exports , ppModel , ppElementjson , ppEvents , ppIs);
		});

		} else if (typeof exports !== 'undefined') {

		var ppModel = {}, ppElementjson = {}, ppEvents = {}, ppIs = {};
		try { ppModel = require('pp-model.js'); } catch (e) {}
		try { ppElementjson = require('pp-elementjson.js'); } catch (e) {}
		try { ppEvents = require('pp-events'); } catch (e) {}
		try { ppIs = require('pp-is'); } catch (e) {}
		factory( root , exports , ppModel , ppElementjson , ppEvents , ppIs );
		} else {
				root.ppView = factory( root , {} , root.ppModel , root.ppElementjson , root.ppEvents , root.ppIs );
		}

})(function( root, exports ,  _model , _elementjson , _events , _is ) {

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
		if( ppIs.isString( html ) ){
			if( ppIs.isElement( element ) ){
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
		return ppIs.isString( url );
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
		if(!ppIs.isObject(options)){ ErrorThrow('options dont defined')};
		// El Mensaje de error  a analizar
		var msgError = 'View dont defined';
		// Defininedo la view
		var view = has( options , 'view' ) ? (
			ppIs.isString( options.view ) ? (
					/* Es una cadena verificamos que no este vacia*/
				 options.view !== '' ? (
					// En este punto es una cadena y no esta vacia
					!ppIs.isNull( document.querySelector('[pp-view='+options.view+']') ) ?
					document.querySelector('[pp-view='+options.view+']') : ErrorThrow(msgError)
				) : ErrorThrow(msgError)
			 ):
			/* lo que recivimos no es un string*/
			(
				ppIs.isElement( options.view ) ? options.view :
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

			if(!ppIs.isObject(options)){ return "";}

			return has( options ,  'template' ) ? (
				//Verificamos que sea una String
				ppIs.isString( options.template ) ? options.template : ErrorThrow('Must template option will be string')
			) : has( options , 'templateJson'  ) ? (
				//Verificamos que sea un object
				ppIs.isObject( options.templateJson ) ? options.templateJson : ErrorThrow('Must templateJson option will be object')
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
			if( ppIs.isObject( events ) ){
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
									if( ppIs.isElement( view ) && _Tag !== "" ){
										// ---------------------------------------------------------
										// Tratamos de capturar todos los elementos html
										try{ var elementLisen = view.querySelectorAll(_Tag); }catch(ErrorelementLisen){ var elementLisen = null;}
										if(!ppIs.isNull(elementLisen)){
											for( var iii = 0; iii < elementLisen.length ; iii++ ){
													elementLisen[iii].addEventListener(_Event,function(_event){
															try{
																methods[method]( _event.currentTarget , model , _event );
															}catch(ErrorMethod){ };
													});
											}
										}// no sea null
									}// view debe ser elemento
							}// for los tags
						}// if ( verificamos que las cadenas no esten vacias )
					}//if( 2 length min )
				} // for all events
			} // if( ppIs.isObject  )
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
			if( !ppIs.isObject(options) ){ return {}; };
			// Verificamos que se halla pasado un modelo
			// se se ocupa la extendio pp-model se activa
			// en caso contrato solo se crea un objeto simple
			var modelObject = has( options , 'model' )  ? (
				ppIs.isObject(options.model) ? options.model : {}
			) :  {} ;
			// Aqui prodiamos agregar valores pre definidos al modelo
			var model =  ppIs.isFunction( _model )  ?  new _model() : modelObject;
			return ppIs.isFunction( model ) ? new model( modelObject ) : model;
	}
	// ===========================================================================
	return function( options ){
		//==========================================================================
		if( options === undefined ){
			console.error('Crital Error')
			console.error( 'pp-view say : Must provide object config' );
			return;
		}
		//==========================================================================
		if( !ppIs.isObject( options ) ){
			console.error('Crital Error')
			console.error( 'pp-view say : Must provide object config' );
			return;
		}
		// =========================================================================
		// ===== IDENTIFICACIÓN DEL ELEMENTO A PROCESAR
		try{
				this.view = getView( options );
		}catch( viewError ){
				console.error( "Critical Error: ");
				console.error( "pp-view say : "+viewError );
				return;
		}
		// =========================================================================
		// Definimos el tipo de template que vamos a procesar
		// SI NO ESTA
		try{
			this.template = getTemplate( options );
		}catch( ErrorTemplate ){
				console.warn( ErrorTemplate );
		}
		//==========================================================================
		//===== Procesamos el modelo
		this.model = getModel( options );

		this.methods = has( options , 'methods' ) ? (
			ppIs.isObject( options.methods ) ? options.methods : {}
		) : {};

		//==========================================================================
		//======= RENDERIZAMOS EL TEMPLATE SI ES DIFERENTE A UNDEFINED
	 	!ppIs.isUndefined(this.template) && render( this.view , this.template );
		//======= ENLAZAMOS LOS EVENTOS CON EL RENDERIZADO si ubiese
		// Hay que trabajar aqui
		getEvents( options , this.view , this.methods , this.model );

    //==========================================================================
		//======= Conectamos los observe de la data
    if( has( options , 'observe' ) ){
      if( ppIs.isObject( options.observe ) ){
        var observeKeys = getKeys( options.observe );
        console.log( observeKeys );

        for( var i = 0; i < observeKeys.length ; i++ ){
          if( this.model.has( observeKeys[i] ) ){
              this.model.on('changed:'+observeKeys[i],function( value ){
                  console.log(value);
                console.log("Estamos escuchando el puto cambio");
              }.bind(this));
              console.log("Existe el modelo");
          }
        }

        console.log( options.observe );
      }
    }





		//==========================================================================
    //======= Ejecutamos el controllador
		if( has(options,"controller") ){
			//========================================================================
			//==========================   CONTROLLER   ==============================
			if( ppIs.isFunction( options.controller ) ){
				this.controller = options.controller;
				this.controller( this.view , this.model );
			}
		}
		//==========================================================================
	}
})
