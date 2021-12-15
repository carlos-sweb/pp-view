# pp-view
## Getting Started

In the web project include pp-view with:

```html
<script src="https://cdn.jsdelivr.net/npm/pp-view@latest/pp-view.min.js" ></script>
```

Or

## Install

```console
npm i pp-view --save
```
## Initialize

```javascript
var config = {}

var view = new ppView( config )
```

## Property config object

### view (type:string)

el identificador para renderizar dentro de este node , se debe declarar dentro del attributo pp-view

```javascript
var config = {
  view : 'main'
}
```

### reactive (type:array)

List of elements to active for reactive mode

### model (type:object)

data model to interact

### observe (type:object)

### events (type:object)

### template (type:string)

### templateObject (type:object)

### templateUrl (type:string)

### methods (type:object)

### controller (type:function( element , model ) )

function que se ejecuta al momento de renderizar, extendiende la funcionalidad.
se pasan como parametros el element  y el model
