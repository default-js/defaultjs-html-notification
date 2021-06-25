/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@default-js/defaultjs-common-utils/browser.js":
/*!********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/browser.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src */ "./node_modules/@default-js/defaultjs-common-utils/src/index.js");
/* harmony import */ var _src_Global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");




_src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs = _src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs || {};
_src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs.common = _src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs.common || {};
_src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs.common = _src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs.common.utils || {};
_src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs.common.utils = _src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs.common.utils || (() => {
	_src__WEBPACK_IMPORTED_MODULE_0__.default.VERSION = "${version}";
	
	return _src__WEBPACK_IMPORTED_MODULE_0__.default;
})();

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/Escaper.js":
/*!************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/Escaper.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// required to build the internal escape filter for regex
const REGEXCHARMAP = ["\\","?","[", "]", "{", "}", "(", ")", ".", "^", "$"]
	.map(char => { 
		return {f: new RegExp("\\" +char, "g"), v : "\\" + char};
	});


const mapping = (aText, theFilters) => {
	let text = aText;
	theFilters.forEach(item => {
		text = text.replace(item.f, item.v);
	});
	return text;
};

const buildUnescapeList = (aCharMap, isCaseSensitiv) => {
	const option = isCaseSensitiv ? "mg" : "mgi"; 
	return aCharMap.map(item => {
		if(!item.at || item.at == "unescape")
			return {f: new RegExp(mapping(item.escaped, REGEXCHARMAP), option), v: item.char}
	}).filter(item => !!item);
};

const buildEscapeList = (aCharMap, isCaseSensitiv) => {
	const option = isCaseSensitiv ? "mg" : "mgi"; 
	return aCharMap.map(item => {
		if(!item.at || item.at == "escape")
			return {f: new RegExp(mapping(item.char,REGEXCHARMAP), option), v: item.escaped}
	}).filter(item => !!item);
};
class Escaper {
	constructor(escapeMap, isCaseSensitiv){
		this.escapeMap = buildEscapeList(escapeMap, isCaseSensitiv)
		this.unescapeMap = buildUnescapeList(escapeMap, isCaseSensitiv)
	}
	
	escape(aText){
		return mapping(aText, this.escapeMap);
	}
	
	unescape(aText){
		return mapping(aText, this.unescapeMap);
	}
	
	static REGEXP_ESCAPER(){
		return new Escaper([
			{char: "\\", escaped : "\\\\"},
			{char: "?", escaped : "\\?"},
			{char: "[", escaped : "\\["},
			{char: "]", escaped : "\\]"},
			{char: "{", escaped : "\\{"},
			{char: "}", escaped : "\\}"},
			{char: "(", escaped : "\\("},
			{char: ")", escaped : "\\)"},
			{char: ".", escaped : "\\."},
			{char: "^", escaped : "\\^"},
			{char: "$", escaped : "\\$"}
		]);
	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Escaper);



/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/Global.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const GLOBAL = (() => {
	if(typeof __webpack_require__.g !== "undefined") return __webpack_require__.g;
	if(typeof window !== "undefined") return window;	
	if(typeof self !== "undefined") return self;
	return {};
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GLOBAL);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectProperty)
/* harmony export */ });
class ObjectProperty {
	constructor(key, context){
		this.key = key;
		this.context = context;
	}
	
	get keyDefined(){
		return this.key in this.context; 
	}
	
	get hasValue(){
		return !!this.context[this.key];
	}
	
	get value(){
		return this.context[this.key];
	}
	
	set value(data){
		this.context[this.key] = data;
	}
	
	set append(data) {
		if(!this.hasValue)
			this.value = data;
		else {
			const value = this.value;
			if(value instanceof Array)
				value.push(data);
			else
				this.value = [this.value, data];
		}
	}
	
	remove(){
		delete this.context[this.key];
	}
	
	static load(data, key, create=true) {
		let context = data;
		const keys = key.split("\.");
		let name = keys.shift().trim();
		while(keys.length > 0){
			if(!context[name]){
				if(!create)
					return null;
				
				context[name] = {}
			}
			
			context = context[name];
			name = keys.shift().trim();
		}
		
		return new ObjectProperty(name, context);
	}
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defValue": () => (/* binding */ defValue),
/* harmony export */   "defGet": () => (/* binding */ defGet),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports append, isPojo, merge, filter, defGetSet */
/* harmony import */ var _ObjectProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectProperty.js */ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js");

/**
 * append a propery value to an object. If propery exists its would be converted to an array
 *
 *  @param aKey:string name of property
 *  @param aData:any property value
 *  @param aObject:object the object to append the property
 *
 *  @return returns the changed object
 */
const append = function (aKey, aData, aObject) {
	if (typeof aData !== "undefined") {
		const property = _ObjectProperty_js__WEBPACK_IMPORTED_MODULE_0__.default.load(aObject, aKey, true);
		property.append = aData;
	}
	return aObject;
};

/**
 * checked if an object a simple object. No Array, Map or something else.
 *
 * @param aObject:object the object to be testing
 *
 * @return boolean
 */
const isPojo = function (aObject) {
	return typeof aObject !== "undefined" && aObject != null && aObject.constructor.name === "Object";
};

/**
 * merging object into a target object. Its only merge simple object and sub objects. Every other
 * value would be replaced by value from the source object.
 *
 * sample: merge(target, source-1, source-2, ...source-n)
 *
 * @param aTarget:object the target object to merging into
 * @param aSources:object
 *
 * @return object returns the target object
 */
const merge = function (aTarget) {
	for (let i = 1; i < arguments.length; i++) {
		const source = arguments[i];
		Object.getOwnPropertyNames(source).forEach((aKey) => {
			if (isPojo(aTarget[aKey])) merge(aTarget[aKey], source[aKey]);
			else aTarget[aKey] = source[aKey];
		});
	}

	return aTarget;
};

const buildPropertyFilter = function ({ names, allowed }) {
	return (name, value, context) => {
		return names.includes(name) === allowed;
	};
};

const filter = function () {
	const [data, propFilter, { deep = false, recursive = true, parents = [] } = {}] = arguments;
	const result = {};

	for (let name in data) {
		const value = data[name];
		const accept = propFilter(name, value, data);
		if (accept && (!deep || value === null || value === undefined)) result[name] = value;
		else if (accept && deep) {
			const type = typeof value;
			if (type !== "object" || value instanceof Array || value instanceof Map || value instanceof Set || value instanceof RegExp || parents.includes[value] || value == data) result[name] = value;
			else result[name] = filter(value, propFilter, { deep, recursive, parents: parents.concat(data) });
		}
	}

	return result;
};

const defValue = (o, name, value) => {
	Object.defineProperty(o, name, {
		value,
		writable: false,
		configurable: false,
		enumerable: false
	});
};
const defGet = (o, name, get) => {
	Object.defineProperty(o, name, {
		get,
		configurable: false,
		enumerable: false
	});
};

const defGetSet = (o, name, get, set) => {
	Object.defineProperty(o, name, {
		get,
		set,
		configurable: false,
		enumerable: false
	});
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	isPojo,
	append,
	merge,
	filter,
	buildPropertyFilter,
	defValue,
	defGet,
	defGetSet
});


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "privateProperty": () => (/* binding */ privateProperty),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const PRIVATE_PROPERTIES = new WeakMap();
const privateStore = (obj) => {
	if(PRIVATE_PROPERTIES.has(obj))
		return PRIVATE_PROPERTIES.get(obj);
	
	const data = {};
	PRIVATE_PROPERTIES.set(obj, data);
	return data;
};

const privateProperty = function(obj, name, value) {
	const data = privateStore(obj);
	if(arguments.length === 1)
		return data;
	else if(arguments.length === 2)
		return data[name];
	else if(arguments.length === 3)
		data[name] = value;
	else
		throw new Error("Not allowed size of arguments!");
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({privateProperty});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/PromiseUtils.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/PromiseUtils.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "lazyPromise": () => (/* binding */ lazyPromise),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export timeoutPromise */
/* harmony import */ var _ObjectUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");


const timeoutPromise = (fn, ms) =>{
	let canceled = false;
	let timeout = null;
	const promise = new Promise((r, e) => {
		timeout = setTimeout(()=> {
			timeout = null;
			fn(r,e);
		}, ms)
	});

	const then = promise.then;
	promise.then = (fn) => {
		then.call(promise, (result) => {
			if(!undefined.canceled)
				return fn(result);
		});
	}

	;(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defValue)(promise, "cancel", () => {
		if(timeout){
			clearTimeout(timeout);
			canceled = true;
		}
	});
	(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defGet)(promise, canceld, () => canceled);

	return promise;
}


const lazyPromise = () => {
		let promiseResolve = null;
		let promiseError = null;

		const promise = new Promise((r, e) => {
			promiseResolve = r;
			promiseError = e;
		});

		let resolved = false;
		let error = false;
		let value = undefined;

		(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defValue)(promise, "resolve", (result) => {
			value = result;
			resolved = true;
			if (value instanceof Error) {
				error = true;
				promiseError(value);
			} else promiseResolve(value);
		});

		(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defGet)(promise, "value", () => value);
		(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defGet)(promise, "error", () => error);
		(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defGet)(promise, "resolved", () => resolved);

		return promise;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	lazyPromise,
	timeoutPromise
});


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/UUID.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/UUID.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "uuid": () => (/* binding */ uuid),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export UUID_SCHEMA */
//the solution is found here: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
const UUID_SCHEMA = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

const uuid = () => {
	const buf = new Uint32Array(4);
	window.crypto.getRandomValues(buf);
	let idx = -1;
	return UUID_SCHEMA.replace(/[xy]/g, (c) => {
		idx++;
		const r = (buf[idx >> 3] >> ((idx % 8) * 4)) & 15;
		const v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ uuid });


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/ValueHelper.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/ValueHelper.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "noValue": () => (/* binding */ noValue),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export emtpyOrNoValueString */
const noValue = (value) => {
	return value == null || typeof value === "undefined";
};

const emtpyOrNoValueString = (value) => {	
	return noValue(value) || value.trim().length == 0;
};


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	noValue,
	emtpyOrNoValueString
});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _javascript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./javascript */ "./node_modules/@default-js/defaultjs-common-utils/src/javascript/index.js");
/* harmony import */ var _ObjectUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ObjectUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");
/* harmony import */ var _Global__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _Escaper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Escaper */ "./node_modules/@default-js/defaultjs-common-utils/src/Escaper.js");
/* harmony import */ var _ValueHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ValueHelper */ "./node_modules/@default-js/defaultjs-common-utils/src/ValueHelper.js");
/* harmony import */ var _PromiseUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PromiseUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/PromiseUtils.js");
/* harmony import */ var _PrivateProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PrivateProperty */ "./node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js");
/* harmony import */ var _UUID__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./UUID */ "./node_modules/@default-js/defaultjs-common-utils/src/UUID.js");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	GLOBAL: _Global__WEBPACK_IMPORTED_MODULE_2__.default ,
	ObjectUtils: _ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.default,
	Escaper: _Escaper__WEBPACK_IMPORTED_MODULE_3__.default,
	ValueHelper: _ValueHelper__WEBPACK_IMPORTED_MODULE_4__.default,
	PromiseUtils: _PromiseUtils__WEBPACK_IMPORTED_MODULE_5__.default,
	PrivateProperty: _PrivateProperty__WEBPACK_IMPORTED_MODULE_6__.default,
	UUID: _UUID__WEBPACK_IMPORTED_MODULE_7__.default
});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/javascript/String.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/javascript/String.js ***!
  \**********************************************************************************/
/***/ (() => {

if (!String.prototype.hashcode)
	String.prototype.hashcode = function() {
		if (this.length === 0)
			return 0;
		
		let hash = 0;
		const length = this.length;
		for (let i = 0; i < length; i++) {
			const c = this.charCodeAt(i);
			hash = ((hash << 5) - hash) + c;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-common-utils/src/javascript/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-common-utils/src/javascript/index.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _String_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./String.js */ "./node_modules/@default-js/defaultjs-common-utils/src/javascript/String.js");
/* harmony import */ var _String_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_String_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-dynamic-requester/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-dynamic-requester/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Requester": () => (/* reexport safe */ _src_Requester__WEBPACK_IMPORTED_MODULE_0__.default)
/* harmony export */ });
/* harmony import */ var _src_Requester__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/Requester */ "./node_modules/@default-js/defaultjs-dynamic-requester/src/Requester.js");



/***/ }),

/***/ "./node_modules/@default-js/defaultjs-dynamic-requester/src/Requester.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-dynamic-requester/src/Requester.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");


const buildURL = async (context, url, search, hash) => {
	const result = new URL(await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(url, context, url), location.href);

	if (search) {
		if (!result.searchParams) result.searchParams = new URLSearchParams();
		const params = result.searchParams;

		for (let key in search) {
			const value = search[key];
			if (typeof value === "string") params.append(key, await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(value, context, value));
			else if (value instanceof Array) {
				for (let item of value) {
					if (typeof item === "string") params.append(key, await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(item, context, item));
				}
			}
		}
	}

	if (hash) result.hash = hash;

	return result;
};

const buildMethod = async (context, method) => {
	if (method && typeof method === "string") return _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(method, context, method);

	return "get";
};

const buildHeaders = async (context, headers) => {
	const result = new Headers();
	if (headers) {
		for (let key in headers) {
			const value = headers[key];
			if (typeof value === "string") result.append(key, await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(value, context, value));
			else if (value instanceof Array) {
				for (let item of value) {
					if (typeof item === "string") result.append(key, await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(item, context, item));
				}
			}
		}
	}

	return result;
};

const buildBody = async (context, body) => {
	if (body && typeof body === "string") return _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(body, context, body);

	return body;
};

class Requester {
	constructor({ url, method = "get", search, hash, headers, body, credentials, mode, cache, redirect, referrer, referrerPolicy }) {
		this.url = url;
		this.method = method;
		this.search = search;
		this.hash = hash;
		this.headers = headers;
		this.body = body;
		this.credentials = credentials;
		this.mode = mode;
		this.cache = cache;
		this.redirect = redirect;
		this.referrer = referrer;
		this.referrerPolicy = referrerPolicy;
	}

	async buildRequest({ context }) {
		return {
			url: await buildURL(context, this.url, this.search, this.hash),
			method: await buildMethod(context, this.method),
			headers: await buildHeaders(context, this.headers),
			body: await buildBody(context, this.body),
			credentials: await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(this.credentials, context, this.credentials),
			mode: await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(this.mode, context, this.mode),
			cache: await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(this.cache, context, this.cache),
			redirect: await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(this.redirect, context, this.redirect),
			referrer: await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(this.referrer, context, this.referrer),
			referrerPolicy: await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolveText(this.referrerPolicy, context, this.referrerPolicy),
		};
	}

	async execute({ context }) {
		const { url, method, headers, body, credentials, mode, cache, redirect, referrer, referrerPolicy } = await this.buildRequest({ context });

		return fetch(url.toString(), { method, headers, body, credentials, mode, cache, redirect, referrer, referrerPolicy });
	}
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Requester);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-expression-language/browser.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-expression-language/browser.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src */ "./node_modules/@default-js/defaultjs-expression-language/src/index.js");
/* harmony import */ var _modules_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @modules/@default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");




_modules_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs = _modules_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs || {};
_modules_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs.el = _modules_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_1__.default.defaultjs.el || (() => {
	_src__WEBPACK_IMPORTED_MODULE_0__.default.VERSION = "${version}";
	return _src__WEBPACK_IMPORTED_MODULE_0__.default;
})();

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/Global.js":
/*!******************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/Global.js ***!
  \******************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const GLOBAL = (() => {
	if(typeof __webpack_require__.g !== "undefined") return __webpack_require__.g;
	if(typeof window !== "undefined") return window;	
	if(typeof self !== "undefined") return self;
	return {};
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GLOBAL);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectProperty)
/* harmony export */ });
class ObjectProperty {
	constructor(key, context){
		this.key = key;
		this.context = context;
	}
	
	get keyDefined(){
		return this.key in this.context; 
	}
	
	get hasValue(){
		return !!this.context[this.key];
	}
	
	get value(){
		return this.context[this.key];
	}
	
	set value(data){
		this.context[this.key] = data;
	}
	
	set append(data) {
		if(!this.hasValue)
			this.value = data;
		else {
			const value = this.value;
			if(value instanceof Array)
				value.push(data);
			else
				this.value = [this.value, data];
		}
	}
	
	remove(){
		delete this.context[this.key];
	}
	
	static load(data, key, create=true) {
		let context = data;
		const keys = key.split("\.");
		let name = keys.shift().trim();
		while(keys.length > 0){
			if(!context[name]){
				if(!create)
					return null;
				
				context[name] = {}
			}
			
			context = context[name];
			name = keys.shift().trim();
		}
		
		return new ObjectProperty(name, context);
	}
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js":
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js ***!
  \***********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports append, isPojo, merge, filter */
/* harmony import */ var _ObjectProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectProperty.js */ "./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js");

/**
 * append a propery value to an object. If propery exists its would be converted to an array
 * 
 *  @param aKey:string name of property
 *  @param aData:any property value
 *  @param aObject:object the object to append the property
 *  
 *  @return returns the changed object
 */
const append = function(aKey, aData, aObject) {
	if (typeof aData !== "undefined") {
		const property = _ObjectProperty_js__WEBPACK_IMPORTED_MODULE_0__.default.load(aObject, aKey, true)
		property.append = aData;
	}
	return aObject;
};

/**
 * checked if an object a simple object. No Array, Map or something else.
 * 
 * @param aObject:object the object to be testing
 * 
 * @return boolean
 */
const isPojo = function(aObject) {
	return typeof aObject !== "undefined" && aObject != null && aObject.constructor.name === "Object"
}

/**
 * merging object into a target object. Its only merge simple object and sub objects. Every other 
 * value would be replaced by value from the source object.
 * 
 * sample: merge(target, source-1, source-2, ...source-n)
 * 
 * @param aTarget:object the target object to merging into
 * @param aSources:object
 * 
 * @return object returns the target object
 */
const merge = function(aTarget) {
	for (let i = 1; i < arguments.length; i++) {
		const source = arguments[i];
		Object.getOwnPropertyNames(source).forEach(aKey => {
			if (isPojo(aTarget[aKey]))
				merge(aTarget[aKey], source[aKey]);
			else
				aTarget[aKey] = source[aKey];
		});
	}

	return aTarget;
}



const buildPropertyFilter = function({ names, allowed }) {
	return (name, value, context) => {
		return names.includes(name) === allowed;
	}
};


const filter = function() {
	const [data, propFilter, {deep = false, recursive = true, parents = []} = {}] = arguments;
	const result = {};

	for (name in data) {
		const value = data[name];
		const accept = propFilter(name, value, data);
		if (accept && (!deep || value === null || value === undefined))
			result[name] = value;
		else if (accept && deep) {
			const type = typeof value;
			if (type !== "object"
				|| value instanceof Array
				|| value instanceof Map
				|| value instanceof Set
				|| value instanceof RegExp
				|| parents.includes[value]
				|| value == data)
				result[name] = value;
			else
				result[name] = filter(value, propFilter, {deep, recursive, parents:  parents.concat(data)});
		}

	}

	return result;
};



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	isPojo,
	append,
	merge,
	filter,
	buildPropertyFilter
});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-expression-language/src/Context.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-expression-language/src/Context.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Context)
/* harmony export */ });
const seekAtChain = (resolver, property) => {
	while(resolver){
		const def = resolver.proxy.handle.getPropertyDef(property, false);
		if(def)
			return def;
		
		resolver = resolver.parent;
	}	
	return { data: null, resolver: null, defined: false };
}

class Handle {
	constructor(data, resolver) {
		this.data = data;
		this.resolver = resolver;
		this.cache = new Map();
	}
	
	updateData(data){
		this.data = data;
		this.cache = new Map();
	}
	
	resetCache(){
		this.cache = new Map();
	}

	getPropertyDef(property, seek = true) {
		if (this.cache.has(property))
			return this.cache.get(property);
		
		let def = null
		if (this.data && property in this.data)
			def = { data: this.data, resolver: this.resolver, defined: true };
		else if(seek)
			def = seekAtChain(this.resolver.parent, property);
		else
			return null;
		if(def.defined)
			this.cache.set(property, def);
		return def;
	}

	hasProperty(property) {
		//@TODO write tests!!!
		const { defined } = this.getPropertyDef(property);
		return defined;
	}
	getProperty(property) {
		//@TODO write tests!!!	
		const { data } = this.getPropertyDef(property);
		return data ? data[property] : undefined;
	}
	setProperty(property, value) {
		//@TODO would support this action on an proxied resolver context??? write tests!!!
		const { data, defined } = this.getPropertyDef(property);
		if (defined)
			data[property] = value;
		else {
			if (this.data)
				this.data[property] = value;
			else {
				this.data = {}
				this.data[property] = value;
			}
			this.cache.set(property, { data: this.data, resolver: this.resolver, defined: true });
		}
	}
	deleteProperty(property) {
		//@TODO would support this action on an proxied resolver context??? write tests!!!		
		throw new Error("unsupported function!")
	}
}

class Context {
	constructor(context, resolver) {
		this.handle = new Handle(context, resolver);		
		this.data = new Proxy(this.handle, {
			has: function(data, property) {
				return data.hasProperty(property);
			},
			get: function(data, property) {
				return data.getProperty(property);
			},
			set: function(data, property, value) {
				return data.setProperty(property, value);
			},
			deleteProperty: function(data, property) {
				return data.deleteProperty(property);
			}
			//@TODO need to support the other proxy actions		
		});;
	}
	
	updateData(data){
		this.handle.updateData(data)		
	}
	
	resetCache(){
		this.handle.resetCache();
	}
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-expression-language/src/DefaultValue.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-expression-language/src/DefaultValue.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DefaultValue)
/* harmony export */ });
class DefaultValue {
	constructor(value){
		this.hasValue = arguments.length == 1;
		this.value = value;
	}	
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExpressionResolver)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global.js */ "./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectProperty_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectProperty.js */ "./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils.js */ "./node_modules/@default-js/defaultjs-expression-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");
/* harmony import */ var _DefaultValue_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DefaultValue.js */ "./node_modules/@default-js/defaultjs-expression-language/src/DefaultValue.js");
/* harmony import */ var _Context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Context.js */ "./node_modules/@default-js/defaultjs-expression-language/src/Context.js");







const EXECUTION_WARN_TIMEOUT = 1000;
const EXPRESSION = /(\\?)(\$\{(([a-zA-Z0-9\-_\s]+)::)?([^\{\}]+)\})/;
const MATCH_ESCAPED = 1;
const MATCH_FULL_EXPRESSION = 2;
const MATCH_EXPRESSION_SCOPE = 4;
const MATCH_EXPRESSION_STATEMENT = 5;

const DEFAULT_NOT_DEFINED = new _DefaultValue_js__WEBPACK_IMPORTED_MODULE_3__.default();
const toDefaultValue = value => {
	if (value instanceof _DefaultValue_js__WEBPACK_IMPORTED_MODULE_3__.default)
		return value;

	return new _DefaultValue_js__WEBPACK_IMPORTED_MODULE_3__.default(value);
};

const execute = async function(aStatement, aContext) {
	if (typeof aStatement !== "string")
		return aStatement;
		
	const expression = new Function("context", 
`
return (async (context) => {
	try{ 
		with(context){
			 return ${aStatement}
		}
	}catch(e){
		throw e;
	}
})(context)`
	);
	
	let timeout = setTimeout(() => {
		timeout = null;
		console.warn("long running statement:", aStatement, new Error());
	}, EXECUTION_WARN_TIMEOUT)
	let result = undefined;
	try{
		result = await expression(aContext);
	}catch(e){}
	
	if(timeout)
		clearTimeout(timeout)
	return result;
};

const resolve = async function(aResolver, aExpression, aFilter, aDefault) {
	if (aFilter && aResolver.name != aFilter)
		return aResolver.parent ? resolve(aResolver.parent, aExpression, aFilter, aDefault) : null;
	
	const result = await execute(aExpression, aResolver.proxy.data);
	if (result !== null && typeof result !== "undefined")
		return result;

	else if (aDefault instanceof _DefaultValue_js__WEBPACK_IMPORTED_MODULE_3__.default && aDefault.hasValue)
		return aDefault.value;
};

const resolveMatch = async (resolver, match, defaultValue) => {
	if(match[MATCH_ESCAPED])
		return match[MATCH_FULL_EXPRESSION]; 
		
	return resolve(resolver, match[MATCH_EXPRESSION_STATEMENT], normalize(match[MATCH_EXPRESSION_SCOPE]), defaultValue);
}

const normalize = value => {
	if (value) {
		value = value.trim();
		return value.length == 0 ? null : value;
	}
	return null;
};

class ExpressionResolver {
	constructor({ context = _default_js_defaultjs_common_utils_src_Global_js__WEBPACK_IMPORTED_MODULE_0__.default, parent = null, name = null }) {
		this.parent = (parent instanceof ExpressionResolver) ? parent : null;
		this.name = name;
		this.context = context;
		this.proxy = new _Context_js__WEBPACK_IMPORTED_MODULE_4__.default(this.context, this);
	}

	get chain() {
		return this.parent ? this.parent.chain + "/" + this.name : "/" + this.name;
	}

	get effectiveChain() {
		if (!this.context)
			return this.parent ? this.parent.effectiveChain : "";
		return this.parent ? this.parent.effectiveChain + "/" + this.name : "/" + this.name;
	}

	get contextChain() {
		const result = [];
		let resolver = this;
		while (resolver) {
			if (resolver.context)
				result.push(resolver.context);

			resolver = resolver.parent;
		}

		return result;
	}

	getData(key, filter) {
		if (!key)
			return;
		else if (filter && filter != this.name) {
			if (this.parent)
				this.parent.getData(key, filter);
		} else {
			const property = _default_js_defaultjs_common_utils_src_ObjectProperty_js__WEBPACK_IMPORTED_MODULE_1__.default.load(this.context, key, false);
			return property ? property.value : null;
		}
	}

	updateData(key, value, filter) {
		if (!key)
			return;
		else if (filter && filter != this.name) {
			if (this.parent)
				this.parent.updateData(key, value, filter);
		} else {
			if(this.context == null || typeof this.context === "undefined"){
				this.context = {};				
				this.proxy.updateData(this.context);
			}
			const property = _default_js_defaultjs_common_utils_src_ObjectProperty_js__WEBPACK_IMPORTED_MODULE_1__.default.load(this.context, key);
			property.value = value;
			this.proxy.resetCache();
		}
	}

	mergeContext(context, filter) {
		if (filter && filter != this.name) {
			if (this.parent)
				this.parent.mergeContext(context, filter);
		} else {
			this.context = this.context ? _default_js_defaultjs_common_utils_src_ObjectUtils_js__WEBPACK_IMPORTED_MODULE_2__.default.merge(this.context, context) : context;
		}
	}

	async resolve(aExpression, aDefault) {
		const defaultValue = arguments.length == 2 ? toDefaultValue(aDefault) : DEFAULT_NOT_DEFINED;
		try {
			const match = EXPRESSION.exec(aExpression);
			if (match)
				return await resolveMatch(this, match, defaultValue);
			else
				return await resolve(this, normalize(aExpression), null, defaultValue);
		} catch (e) {
			console.error("error at executing statment\"", aExpression, "\":", e);
			return defaultValue.hasValue ? defaultValue.value : aExpression;
		}
	}

	async resolveText(aText, aDefault) {
		let text = aText;
		let temp = aText; // required to prevent infinity loop
		let match = EXPRESSION.exec(text);
		const defaultValue = arguments.length == 2 ? toDefaultValue(aDefault) : DEFAULT_NOT_DEFINED
		while (match != null) {
			const result = await resolveMatch(this, match, defaultValue);
			temp = temp.split(match[0]).join(); // remove current match for next loop
			text = text.split(match[0]).join(typeof result === "undefined" ? "undefined" : (result == null ? "null" : result));
			match = EXPRESSION.exec(temp);
		}
		return text;
	}

	static async resolve(aExpression, aContext, aDefault, aTimeout) {
		const resolver = new ExpressionResolver({ context: aContext });
		const defaultValue = arguments.length > 2 ? toDefaultValue(aDefault) : DEFAULT_NOT_DEFINED;
		if (typeof aTimeout === "number" && aTimeout > 0)
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(resolver.resolve(aExpression, defaultValue));
				}, aTimeout);
			});

		return resolver.resolve(aExpression, defaultValue)
	}

	static async resolveText(aText, aContext, aDefault, aTimeout) {
		const resolver = new ExpressionResolver({ context: aContext });
		const defaultValue = arguments.length > 2 ? toDefaultValue(aDefault) : DEFAULT_NOT_DEFINED;
		if (typeof aTimeout === "number" && aTimeout > 0)
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(resolver.resolveText(aText, defaultValue));
				}, aTimeout);
			});

		return resolver.resolveText(aText, defaultValue);
	}
	
	static buildSecure({context, propFilter, option={deep:true}, name, parent}){
		context = _default_js_defaultjs_common_utils_src_ObjectUtils_js__WEBPACK_IMPORTED_MODULE_2__.default.filter({data: context, propFilter, option});
		return new ExpressionResolver({context, name, parent});
	}
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-expression-language/src/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-expression-language/src/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	ExpressionResolver:_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default
});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/index */ "./node_modules/@default-js/defaultjs-extdom/src/index.js");


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/Global.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/Global.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/Utils */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Utils.js");


_utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.defaultjs = _utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.defaultjs || {};
_utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.defaultjs.extdom = _utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.defaultjs.extdom || {
	VERSION : "${version}",
	utils : {
		Utils: _utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default
	}
};

_utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.find = function() {
	return document.find.apply(document, arguments);
};

_utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.ready = function() {
	return document.ready.apply(document, arguments);
};

_utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.create = function(aContent, asTemplate) {
	if (typeof arguments[0] !== "string")
		throw new Error("The first argument must be a string!");
	
	const template = document.createElement("template");
	template.innerHTML = aContent;
	if(asTemplate)
		return template;
	
	return document.importNode(template.content, true).childNodes;
};

_utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.script = function(aFile, aTarget) {
	if(aFile instanceof Array)
		return Promise.all(aFile.map(file => _utils_Utils__WEBPACK_IMPORTED_MODULE_0__.default.global.script(file, aTarget)));
	
	if(typeof aFile === "string")	
		return new Promise((r,e) => {
			const script = document.createElement("script");
			script.async = true;
			script.onload = function(){r()};
			script.onerror = function(){throw new Error("load error!")};
			!aTarget ? document.body.append(script) : aTarget.append(script);
			script.src = aFile;
		});
	else
		return Promise.reject("First parameter must be an array of strings or a string!");
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/Document.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/Document.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _extentions_QuerySupport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extentions/QuerySupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/QuerySupport.js");
/* harmony import */ var _extentions_ReadyEventSupport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extentions/ReadyEventSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ReadyEventSupport.js");




(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(Document, _extentions_QuerySupport__WEBPACK_IMPORTED_MODULE_1__.default, _extentions_ReadyEventSupport__WEBPACK_IMPORTED_MODULE_2__.default);

document.addEventListener("DOMContentLoaded", () => document.trigger("ready"));





/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/DocumentFragment.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/DocumentFragment.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _extentions_QuerySupport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extentions/QuerySupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/QuerySupport.js");
/* harmony import */ var _extentions_ManipulationSupport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extentions/ManipulationSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ManipulationSupport.js");




(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(DocumentFragment, _extentions_QuerySupport__WEBPACK_IMPORTED_MODULE_1__.default, _extentions_ManipulationSupport__WEBPACK_IMPORTED_MODULE_2__.default);






/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/Element.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/Element.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _extentions_QuerySupport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extentions/QuerySupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/QuerySupport.js");
/* harmony import */ var _extentions_AttributeSupport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extentions/AttributeSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/AttributeSupport.js");
/* harmony import */ var _extentions_ManipulationSupport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./extentions/ManipulationSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ManipulationSupport.js");





(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(Element,_extentions_QuerySupport__WEBPACK_IMPORTED_MODULE_1__.default, _extentions_AttributeSupport__WEBPACK_IMPORTED_MODULE_2__.default, _extentions_ManipulationSupport__WEBPACK_IMPORTED_MODULE_3__.default);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/EventTarget.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/EventTarget.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _extentions_EventSupport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extentions/EventSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/EventSupport.js");



(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(EventTarget, _extentions_EventSupport__WEBPACK_IMPORTED_MODULE_1__.default);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLElement.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLElement.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _extentions_HtmlClassSupport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extentions/HtmlClassSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/HtmlClassSupport.js");
/* harmony import */ var _extentions_ShowHideSupport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extentions/ShowHideSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ShowHideSupport.js");





(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(HTMLElement, _extentions_HtmlClassSupport__WEBPACK_IMPORTED_MODULE_1__.default, _extentions_ShowHideSupport__WEBPACK_IMPORTED_MODULE_2__.default);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLInputElement.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLInputElement.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _extentions_ValueSupport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extentions/ValueSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ValueSupport.js");




(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(HTMLInputElement,_extentions_ValueSupport__WEBPACK_IMPORTED_MODULE_1__.default);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLSelectElement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLSelectElement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _extentions_ValueSupport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extentions/ValueSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ValueSupport.js");




(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(HTMLSelectElement,_extentions_ValueSupport__WEBPACK_IMPORTED_MODULE_1__.default);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLTextAreaElement.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLTextAreaElement.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");




(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(HTMLTextAreaElement,(0,_utils_Extender__WEBPACK_IMPORTED_MODULE_1__.default)("ValueSupport", Prototype => {	
	Prototype.val = function() {
		if(arguments.length == 0)
			return this.value;
		else
			this.value = arguments[0]
			
		return this;
	};	
}));

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/HtmlCollection.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/HtmlCollection.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _utils_DelegaterBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/DelegaterBuilder */ "./node_modules/@default-js/defaultjs-extdom/src/utils/DelegaterBuilder.js");
/* harmony import */ var _extentions_ListSupport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extentions/ListSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ListSupport.js");




(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(HTMLCollection, _extentions_ListSupport__WEBPACK_IMPORTED_MODULE_2__.default);

HTMLCollection.prototype.applyTo = function(){
	const args = Array.from(arguments);
	const calling = args.shift();
	const isFunction = typeof calling === "function";
	const results = [];
	for(let i = 0; i < this.length; i++){
		const node = this[i];
		let	result;
		if(isFunction)
			result = calling.apply([node].concat(args));
		else if(typeof node[calling] === "function")
			result = node[calling].apply(node, args);
		
		if(result)
			results.push(result);
	}
	
	return results;
};

HTMLCollection.prototype.val = function() {
	if(arguments.length == 0){
		if(this.length > 0){
			const result = new Map();
			this.forEach(node => {
				if(typeof node.val === "function"){
					const value = node.val();
					if(value)
						result.set((node.name || node.id || node.selector()), node.val());
				}
			});	
			return result;
		}
	}
	else
		HTMLCollection.prototype.applyTo.apply(this, ["val"].concat(Array.from(arguments)));
};

HTMLCollection.from = function(){
	const args = Array.from(arguments);
	const data = {};
	let counter = 0;
	
	while(args.length > 0){
		const arg = args.shift();
		if(typeof arg !== "undefined" && arg != null){
			if(arg instanceof HTMLElement)
				data[counter++] = {value: arg, enumerable: true};
			else if(arg instanceof HTMLCollection || arg instanceof NodeList || arg instanceof Array){
				for(let i = 0; i < arg.length; i++){
					if(arg[i] && arg[i] instanceof HTMLElement){
						data[counter++] = {value: arg[i], enumerable: true};
					}
				}
			}
		}
	}
	
	data.length = {value: counter};
	return  Object.create(HTMLCollection.prototype, data);
};


(0,_utils_DelegaterBuilder__WEBPACK_IMPORTED_MODULE_1__.default)(function(aFunctionName, theArguments) {
	let results = [];	
	this.forEach(node => {
		if(node && typeof node[aFunctionName] === "function"){
			let result = node[aFunctionName].apply(node, theArguments);
			if(result){ 
				if(result instanceof HTMLCollection)
					results = results.concat(Array.from(result));
				else
					results.push(result);
			}		
		}
	});
	
	if(results.length === 0)
		return undefined;
	else if(results[0] instanceof HTMLElement || results[0] instanceof HTMLCollection)
		return HTMLCollection.from.apply(null, results);
	else
		return results;
},HTMLCollection.prototype, Node.prototype, HTMLElement.prototype, HTMLInputElement.prototype, Element.prototype, EventTarget.prototype);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/Node.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/Node.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _extentions_DataSupport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extentions/DataSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/DataSupport.js");
/* harmony import */ var _extentions_ManipulationSupport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extentions/ManipulationSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ManipulationSupport.js");




(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(Node,_extentions_DataSupport__WEBPACK_IMPORTED_MODULE_1__.default,_extentions_ManipulationSupport__WEBPACK_IMPORTED_MODULE_2__.default);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/NodeList.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/NodeList.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ExtendPrototype */ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js");
/* harmony import */ var _utils_DelegaterBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/DelegaterBuilder */ "./node_modules/@default-js/defaultjs-extdom/src/utils/DelegaterBuilder.js");
/* harmony import */ var _extentions_ListSupport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extentions/ListSupport */ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ListSupport.js");




(0,_utils_ExtendPrototype__WEBPACK_IMPORTED_MODULE_0__.default)(NodeList, _extentions_ListSupport__WEBPACK_IMPORTED_MODULE_2__.default);

NodeList.prototype.applyTo = function(){
	const args = Array.from(arguments);
	const calling = args.shift();
	const isFunction = typeof calling === "function";
	const results = [];
	for(let i = 0; i < this.length; i++){
		const node = this[i];
		let	result;
		if(isFunction)
			result = calling.apply([node].concat(args));
		else if(typeof node[calling] === "function")
			result = node[calling].apply(node, args);
		
		if(result)
			results.push(result);
	}
	
	return results;
};

NodeList.prototype.val = function() {
	if(arguments.length == 0){
		if(this.length > 0){
			const result = new Map();
			this.forEach(node => {
				if(typeof node.val === "function"){
					const value = node.val();
					if(value)
						result.set((node.name || node.id || node.selector()), node.val());
				}
			});	
			return result;
		}
	}
	else
		NodeList.prototype.applyTo.apply(this, ["val"].concat(Array.from(arguments)));
};

NodeList.from = function(){
	const args = Array.from(arguments);
	const data = {};
	let counter = 0;
	
	while(args.length > 0){
		const arg = args.shift();
		if(typeof arg !== "undefined" && arg != null){
			if(arg instanceof Node)
				data[counter++] = {value: arg, enumerable: true};
			else if(arg instanceof NodeList || arg instanceof HTMLCollection || arg instanceof Array){
				for(let i = 0; i < arg.length; i++){
					if(arg[i] && arg[i] instanceof Node){
						data[counter++] = {value: arg[i], enumerable: true};
					}
				}
			}
		}
	}
	
	data.length = {value: counter};
	return  Object.create(NodeList.prototype, data);
};


(0,_utils_DelegaterBuilder__WEBPACK_IMPORTED_MODULE_1__.default)(function(aFunctionName, theArguments) {
	let results = [];	
	this.forEach(node => {
		if(node && typeof node[aFunctionName] === "function"){
			const result = node[aFunctionName].apply(node, theArguments);
			if(result){ 
				if(result instanceof NodeList)
					results = results.concat(Array.from(result));
				else
					results.push(result);
			}		
		}
	});
	
	if(results.length === 0)
		return undefined;
	else if(results[0] instanceof Node || results[0] instanceof NodeList)
		return NodeList.from(results);
	else
		return results;
},NodeList.prototype, Node.prototype, HTMLElement.prototype, HTMLInputElement.prototype, Element.prototype, EventTarget.prototype);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/AttributeSupport.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/AttributeSupport.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");


const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("AttributeSupport", Prototype => {
	Prototype.attr = function() {
		if (arguments.length == 0)
			return this.hasAttributes() ? (() => {
				const result = {};
				this.getAttributeNames().forEach(name => {
					result[name] = this.getAttribute(name);
				});
				return result;
			})() : undefined;
		else if (arguments.length == 1)
			return this.getAttribute(arguments[0]);
		else if (typeof arguments[1] === "undefined" || arguments[1] == null)
			this.removeAttribute(arguments[0]);
		else
			this.setAttribute(arguments[0], arguments[1]);
		
		return this;
	};
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/DataSupport.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/DataSupport.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");

const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("DataSupport", Prototype => {
	Prototype.data = function() {
		const data = {};
		if (typeof this.dataset !== "undefined")
			for (name in this.dataset)
				data[name] = this.dataset[name];

		this.data = (function() {
			if (arguments.length == 0)
				return data;
			else if (arguments.length == 1)
				return data[arguments[0]];
			else if (typeof arguments[1] === "undefined" || arguments[1] == null)
				delete data[arguments[0]];
			else
				data[arguments[0]] = arguments[1];

			return this;
		}).bind(this);

		return this.data.apply(null, arguments);
	};
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/EventSupport.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/EventSupport.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");


const DEFAULT_TIMEOUT = 100;
const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("EventSupport", (Prototype) => {
	const EVENTSPLITER = /(\s+)|(\s*,\s*)/;
	const getWrapperHandleMap = (element) => {
		if (!element.__wrapperhandlemap__)
			element.__wrapperhandlemap__ = new Map();

		return element.__wrapperhandlemap__;
	}

	const getTriggerTimeouts = (element) => {
		if (!element.___EVENTTRIGGERTIMEOUTS___) element.___EVENTTRIGGERTIMEOUTS___ = {};

		return element.___EVENTTRIGGERTIMEOUTS___;
	};

	const removeWrapper = (element, data, eventTypes) => {
		const { wrapper, option, events, handle } = data;
		const capture = option.capture;
		if(eventTypes){
			eventTypes = typeof eventTypes === "string" ? eventTypes.split(EVENTSPLITER) : eventTypes;
			for (let event of eventTypes) {
				const index = events.indexOf(event);
				if(index >= 0) {
					element.removeEventListener(event, wrapper, capture);
					events.splice(index, 1);
				}
				if(events.length == 0)				
					getWrapperHandleMap(element).delete(handle);
			}
			
		}else{
			for (let event of events) {
				element.removeEventListener(event, wrapper, capture);
			}
			getWrapperHandleMap(element).delete(handle);
		}		
	}

	Prototype.on = function() {
		if (arguments.length < 2) throw new Error("Too less arguments!");

		const args = Array.from(arguments);
		let events = typeof args[0] === "string" ? args.shift().split(EVENTSPLITER) : args.shift();
		const filter = typeof args[0] === "string" ? args.shift() : null;
		const handle = args.shift();
		const option = typeof args[0] === "undefined" ? { capture: false, once: false, passive: false } : (typeof args[0] === "boolean" ? { capture: args.shift(), once: false, passive: false } : args.shift());
		const wrapper = function(aEvent) {
			if (filter) {
				const target = event.target;
				if (typeof target.is === "function" && !aEvent.target.is(filter)) return true;
			}
			const result = handle.apply(null, arguments);
			if (option.once) removeWrapper(this, wrapper);
			return result;
		};

		getWrapperHandleMap(this).set(handle, { handle, wrapper: wrapper, events, option });

		for (let event of events) {
			this.addEventListener(event, wrapper, option);
		}

		return this;
	};


	Prototype.removeOn = function(handle, event, capture) {
		const data = getWrapperHandleMap(this).get(handle);
		if (data) 
			removeWrapper(this, data, event);
		else
			this.removeEventListener(handle, event, capture);

		return this;
	};

	Prototype.trigger = function() {
		const args = Array.from(arguments);
		const timeout = typeof args[0] === "number" ? args.shift() : -1;
		if (timeout >= 0) {
			const type = args[0];
			const timeouts = getTriggerTimeouts(this);
			const timeoutid = timeouts[type];
			if (timeoutid) clearTimeout(timeoutid);

			timeouts[type] = setTimeout(() => {
				delete timeouts[type];
				this.trigger.apply(this, args);
			}, timeout);
		} else {
			const type = args.shift();
			const delegate = args[0] instanceof Event ? args.shift() : null;
			const data = args.length >= 1 ? (args.length == 1 ? args.shift() : args) : delegate;
			const event = data ? new CustomEvent(type, { bubbles: true, cancelable: true, composed: true, detail: data }) : new Event(type, { bubbles: true, cancelable: true, composed: true, });

			if (delegate) event.delegatedEvent = delegate;
			this.dispatchEvent(event);
		}
		return this;
	};
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/HtmlClassSupport.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/HtmlClassSupport.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");


const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("HtmlClassSupport", Prototype => {	
	Prototype.addClass = function() {
		if(arguments.length == 1)
			arguments[0].split(/\s+/).forEach(clazz => this.classList.add(clazz));
		else if(arguments.length > 1)
			Array.prototype.forEach.call(arguments,clazz => this.classList.add(clazz));
		
		return this;
	};
	
	Prototype.removeClass = function() {
		if(arguments.length == 1)
			arguments[0].split(/\s+/).forEach(clazz => this.classList.remove(clazz));
		else if(arguments.length > 1)
			Array.prototype.forEach.call(arguments, clazz => this.classList.remove(clazz));
		
		return this;		
	};
	
	Prototype.toggleClass = function() {
		if(arguments.length == 1)
			arguments[0].split(/\s+/).forEach(clazz => this.classList.toggle(clazz));
		else if(arguments.length > 1)
			Array.prototype.forEach.call(arguments, clazz => this.classList.toggle(clazz));
		
		return this;
	};
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ListSupport.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ListSupport.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");


const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("ListSupport", Prototype => {		
	Prototype.indexOf = function() {
		for(let i = 0; i < this.length; i++)
			if(this[i] == arguments[0])
				return i;
		
		return -1;
	};

	Prototype.forEach = function(){
		return Array.prototype.forEach.apply(Array.from(this), arguments);
	};
	
	Prototype.map = function(){
		return Array.prototype.map.apply(Array.from(this), arguments);
	};
	
	Prototype.filter = function(){
		return Array.prototype.filter.apply(Array.from(this), arguments);
	};

	Prototype.first = function(){
		if(this.length > 0)
			return this[0];
	};	
	
	Prototype.last = function(){
		if(this.length > 0)
			return this[this.length - 1];
	};
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ManipulationSupport.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ManipulationSupport.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/Utils */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Utils.js");



const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("ManipulationSupport", Prototype => {	
	Prototype.empty = function(){
		let nodes = this.childNodes
		while(nodes.length != 0)			
			nodes[0].remove(true);
		
		return this;
	};
	
	Prototype.content = function(){
		return this.childNodes;
	};	
	
	Prototype.html = function(){
		if(arguments.length == 0)			
			return this.innerHTML;
		else if(arguments.length == 1 && typeof arguments[0] === "boolean")
			if(arguments[0])
				return this.outerHTML;
			else
				return this.innerHTML;
		else 
			Array.from(arguments).forEach(content => {
				this.empty();
				if(typeof content === "string")
					this.append(content);
				else if(content instanceof Node || content instanceof NodeList || content instanceof HTMLCollection){
					this.append(content);
				}
			});		
			
		return this;
	};
	
	const append = function(){
		const append = Prototype.appendChild.bind(this);
		for(let i = 0; i < arguments.length; i++){
			let arg = arguments[i];
			if(arg instanceof Node)
				this.appendChild(arg);
			else if(typeof arg === "string")
				create(arg).forEach(append);
			else if(typeof arg.forEach === "function")
				arg.forEach(append);
		}
	};	
	Prototype.append = append;
	
	const prepend = function(aFirstElement, aElement){
		this.insertBefore(aElement, aFirstElement);
	};
	Prototype.prepend = function(){
		if(this.childNodes.length == 0)
			append.apply(this, arguments);
		else {
			const first = this.childNodes.first();
			const insert = prepend.bind(this, first);
			for(let i = 0; i < arguments.length; i++){
				const arg = arguments[i];
				if(arg instanceof Node)
					insert(arg);
				else if(typeof arg === "string")
					arg.forEach(insert);
				else if(typeof arg.forEach === "function")
					arg.forEach(insert);
			}
		}
	};
	
	Prototype.replace = function(){
		if(arguments.length < 1)
			throw new Error("Insufficient arguments! One or two nodes required!");
		
		const parent = arguments.length == 1 ? this.parentNode : this;
		const oldNode = arguments.length == 1 ? this : arguments[0];
		const newNode = arguments.length == 1 ? arguments[0] : arguments[1];
		
		if(newNode instanceof Array || newNode instanceof NodeList || newNode instanceof HTMLCollection){
			newNode.forEach(aItem => parent.insertBefore(aItem, oldNode));
			oldNode.remove();
		}
		else
			parent.replaceChild(newNode,oldNode);
	};
	
	Prototype.after = function(){
		if(this.parentNode == null)
			throw new Error("Can't insert nodes after this node! Parent node not available!");
		
		const parent = this.parentNode;
		const next = this.nextSibling;
		if(next)
			Prototype.before.apply(next, arguments);
		else
			Prototype.append.apply(parent, arguments);
	};	
	
	Prototype.before = function(){
		if(this.parentNode == null)
			throw new Error("Can't insert nodes after this node! Parent node not available!");
		
		const parent = this.parentNode;
		const inserter = (node) => {parent.insertBefore(node, this);}
		for(let i = 0; i < arguments.length; i++){
			const arg = arguments[i];
			if(arg instanceof Node)
				inserter(arg);
			else if(typeof arg === "string")
				arg.forEach(inserter);
			else if(typeof arg.forEach === "function")
				arg.forEach(inserter);
		}
	};	
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/QuerySupport.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/QuerySupport.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");


const parentSelector = /:parent(\(\"([^\)]*)\"\))?/i;
const queryExecuter = function(aElement, aSelector){
	let match = parentSelector.exec(aSelector);
	if(match){
		let result = aElement;
		if(match.index > 0){
			result = aElement.querySelectorAll(aSelector.substr(0, match.index));
			if(result.length == 0)
				return;
		}	
		result = result.parent(match[2]);			
		if(result){
			let nextSelector = aSelector.substr(match.index + match[0].length).trim();
			if(nextSelector.length > 0)
				result = result.find(nextSelector);
			
			return result;
		}		
	}
	else
		return aElement.querySelectorAll(aSelector);
};


const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("QuerySupport", Prototype => {	
	Prototype.find = function() {
		let nodes = [];
		let args = Array.from(arguments);
		let arg = args.shift();
		while(arg){
			if(typeof arg === "string"){
				let result = queryExecuter(this, arg);
				if(result)
					nodes.push(result);
			}
			
			arg = args.shift();
		}
		
		let result = NodeList.from.apply(null, nodes);
		return result;
	};
	
	Prototype.is = function() {
		if(this instanceof Document || this instanceof DocumentFragment)
			return false;		
		else if(arguments.length == 1){
			if(typeof arguments[0] === "string")
				return this.matches(arguments[0]);
			else if(typeof arguments[0].length === "number"){
				let filter = arguments[0];
				for(let i = 0; i < filter.length; i++)
					if(this.matches(filter[i]))
						return true;
			}				
		}
		else if(arguments.length > 1)
			return this.is(Array.from(arguments));
		
		return false;
	};	
	
	Prototype.parent = function(selector, ignoreShadowRoot) {		
		if(!this.parentNode)
			return null;		
		ignoreShadowRoot = typeof selector === "boolean" ? selector : ignoreShadowRoot;
		selector = typeof selector === "string" ? selector : null;
		
		let parent = this.parentNode;		
		if(parent instanceof ShadowRoot && ignoreShadowRoot)
			parent = parent.host;
						
		if(selector){
			try{
				while(parent && !parent.is(selector))
					parent = parent.parent(selector, ignoreShadowRoot);
			}catch (e) {
				console.error("this:", this, "parent:", parent, "error:", e);
			}
			return parent;
		}
		return parent;
	};
	
	Prototype.parents = function() {		
		let result = new Array();
		let parent = Prototype.parent.apply(this, arguments);
		while(parent){
			result.push(parent);
			parent = Prototype.parent.apply(parent, arguments);
		}
		
		return NodeList.from(result);
	};	

	Prototype.selector = function(){
		if(this instanceof Document || this instanceof DocumentFragment)
			return undefined;
		else if(this.id)
			return "#" + this.id;
		else{			
			let selector = this.tagName.toLowerCase();
			let parent = this.parent();
			if(parent){
				let sameTagSiblings = parent.find(":scope>" + selector);			
				if (sameTagSiblings instanceof NodeList) {
					let index = sameTagSiblings.indexOf(this);
					if (index > 0)
						selector += ':nth-child(' + (index + 1) + ')';
				}		
				let parentSelector = parent.selector();
				return parentSelector ? parentSelector + ">" + selector : selector;
			} 
			return selector;
		}
	};	

	Prototype.closest = function(aQuery) {			
		let node = this;
		while(node){
			let closests = node.find(aQuery);
			if(closests && closests.length > 0)
				return closests;
			else if(node.is(aQuery))
				return NodeList.from(node);
			
			node = node.parent();		
		}
	};
	
	Prototype.nested = function(aQuery){
		if(this.is(aQuery))
			return NodeList.from(this);	
		
		let nested = this.find(aQuery);
		if(nested && nested.length > 0)
			return nested;
		else
			return NodeList.from(this.parent(aQuery));
	};
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);



/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ReadyEventSupport.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ReadyEventSupport.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");


const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("ReadyEventSupport", Prototype => {
	Prototype.ready = function(aFunction, once){	
		this.on("ready", aFunction, once);
		if(document.readyState == "complete")			
			this.trigger("ready");
		
		return this;
	};
	
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ShowHideSupport.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ShowHideSupport.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");


const HIDEVALUE = "none";

const isHidden = (element) => {
	return element.style.display === HIDEVALUE
};

const init = (element) => {	
	let display = !isHidden(element) ? element.style.display : "";
	
	element.show = (function(){
		this.style.display = display;
		return this;		
	}).bind(element);
	
	element.hide = (function(){
		this.style.display = HIDEVALUE;
		return this;		
	}).bind(element);
	
	return element;
};


const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("ShowHideSupport", Prototype => {
	Prototype.show = function() {
		return init(this).show.apply(null, arguments)
	};

	Prototype.hide = function() {
		return init(this).hide.apply(null, arguments)
	};

	Prototype.toggleShow = function() {
		return isHidden(this) ? this.show() : this.hide();
	};

});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ValueSupport.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/dom/extentions/ValueSupport.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Extender__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/Extender */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js");


const InputTypes = [
	{
		selector : "select",
		get : function(){
			const result = [];
			this.find("option").forEach(option => {
				if(option.selected)
					result.push(option.value);
			});			
			return result;
		},
		set : function(){				
			let values = [];
			const args = Array.from(arguments);
			let arg = args.shift();
			while(arg){
				if(Array.isArray(arg))
					values = values.concat(arg);
				else
					values.push(arg);
				
				arg = args.shift();
			}
			this.value = values;
			this.find("option").forEach(option => option.selected = values.indexOf(option.value) >= 0);			
			this.trigger("changed");
		}			
	},
	{
		selector : "input[type=\"checkbox\"], input[type=\"radio\"]",
		get : function(){
			if(this.value == "on" || this.value == "off")
				return this.checked;
			else if(this.checked)
				return this.value;				
		},
		set : function(aValue){
			if(typeof aValue === "boolean")
				this.checked = aValue;
			else if(typeof aValue === "string")
				this.checked = this.value == aValue;
			else if(Array.isArray(aValue))
				this.checked = aValue.indexOf(this.value) >= 0;
			
			this.trigger("changed");
		}
	}
];

const DefaultInputType = {
		get : function(){
			return this.value;
		},
		set : function(aValue){
			this.value = aValue;
			this.trigger("input");
		}	
};

const getInputType = function(aElement){
	for(let i = 0; i < InputTypes.length; i++)
		if(aElement.is(InputTypes[i].selector))
			return InputTypes[i];		
	return DefaultInputType;
};


const support = (0,_utils_Extender__WEBPACK_IMPORTED_MODULE_0__.default)("ValueSupport", Prototype => {	
	Prototype.val = function() {
		let type = getInputType(this);
		if(arguments.length == 0)
			return type.get.apply(this, arguments);
		else
			type.set.apply(this, arguments);
			
		return this;
	};	
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (support);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _dom_EventTarget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom/EventTarget */ "./node_modules/@default-js/defaultjs-extdom/src/dom/EventTarget.js");
/* harmony import */ var _dom_Node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom/Node */ "./node_modules/@default-js/defaultjs-extdom/src/dom/Node.js");
/* harmony import */ var _dom_Element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom/Element */ "./node_modules/@default-js/defaultjs-extdom/src/dom/Element.js");
/* harmony import */ var _dom_Document__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/Document */ "./node_modules/@default-js/defaultjs-extdom/src/dom/Document.js");
/* harmony import */ var _dom_DocumentFragment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom/DocumentFragment */ "./node_modules/@default-js/defaultjs-extdom/src/dom/DocumentFragment.js");
/* harmony import */ var _dom_HTMLElement__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom/HTMLElement */ "./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLElement.js");
/* harmony import */ var _dom_HTMLInputElement__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom/HTMLInputElement */ "./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLInputElement.js");
/* harmony import */ var _dom_HTMLTextAreaElement__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dom/HTMLTextAreaElement */ "./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLTextAreaElement.js");
/* harmony import */ var _dom_HTMLSelectElement__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dom/HTMLSelectElement */ "./node_modules/@default-js/defaultjs-extdom/src/dom/HTMLSelectElement.js");
/* harmony import */ var _dom_NodeList__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dom/NodeList */ "./node_modules/@default-js/defaultjs-extdom/src/dom/NodeList.js");
/* harmony import */ var _dom_HtmlCollection__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dom/HtmlCollection */ "./node_modules/@default-js/defaultjs-extdom/src/dom/HtmlCollection.js");
/* harmony import */ var _Global__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Global */ "./node_modules/@default-js/defaultjs-extdom/src/Global.js");














/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/utils/DelegaterBuilder.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/utils/DelegaterBuilder.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const DelegaterBuilder = function() {
	const args = Array.from(arguments);
	const callback = args.shift();
	const source = args.shift();
	args.forEach( target =>{
		Object.getOwnPropertyNames(target)
		.forEach(name => {
			const prop = Object.getOwnPropertyDescriptor(target, name);
			if (typeof source[name] === "undefined" && typeof prop.value === "function")
				source[name] = function(){
					return callback.call(this, name, arguments);
				};										
		});
	});
	
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DelegaterBuilder);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/utils/ExtendPrototype.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const extendPrototype = function(){
	const args = Array.from(arguments);
	const type = args.shift();	
	while(args.length > 0){
		const extender = args.shift();
		extender(type);
	}
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (extendPrototype);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/utils/Extender.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@default-js/defaultjs-extdom/src/utils/Utils.js");


const EXTENSIONS_MAP = _Utils__WEBPACK_IMPORTED_MODULE_0__.default.globalVar("___DOM_API_EXTENSION_MAP___", {});
const Extender = function(aName, aExtention){
	return function(aType){	
		let extensions = EXTENSIONS_MAP[aType.name];
		if(!extensions)
			extensions = EXTENSIONS_MAP[aType.name] = {};		
		
		if(!extensions[aName]){
			extensions[aName] = true;
			aExtention(aType.prototype);
		}
		else
			console.warn("duplicated load of extension \"" + aName + "\"!");
	}
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Extender);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-extdom/src/utils/Utils.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-extdom/src/utils/Utils.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Utils = {
	global : (() => {
		if(typeof window !== "undefined") return window;
		if(typeof __webpack_require__.g !== "undefined") return __webpack_require__.g;
		if(typeof self !== "undefined") return self;
		return {};		
	})(),
	globalVar : function(aName, aInitValue){
		if(arguments.length === 2 && typeof Utils.global[aName] === "undefined")
			Utils.global[aName] = aInitValue;
		
		return Utils.global[aName];		
	}
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Utils);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/browser-bundle.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/browser-bundle.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _src_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/utils */ "./node_modules/@default-js/defaultjs-html-components/src/utils/index.js");
/* harmony import */ var _src_Ready__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/Ready */ "./node_modules/@default-js/defaultjs-html-components/src/Ready.js");
/* harmony import */ var _src_Component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");





const pack = {VERSION : "${version}", utils: _src_utils__WEBPACK_IMPORTED_MODULE_1__.default, Ready: _src_Ready__WEBPACK_IMPORTED_MODULE_2__.default, Component: _src_Component__WEBPACK_IMPORTED_MODULE_3__.default };

_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.components = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.components || pack;


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/Component.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/Component.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createUID": () => (/* binding */ createUID),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PrivateProperty */ "./node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_PromiseUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PromiseUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/PromiseUtils.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_UUID__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/UUID */ "./node_modules/@default-js/defaultjs-common-utils/src/UUID.js");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-components/src/Constants.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/EventHelper.js");
/* harmony import */ var _utils_WeakData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/WeakData */ "./node_modules/@default-js/defaultjs-html-components/src/utils/WeakData.js");







const PRIVATE_READY = "ready";

const TIMEOUTS = new _utils_WeakData__WEBPACK_IMPORTED_MODULE_5__.default();
const init = (component) => {
	const data = TIMEOUTS.data(component);
	if (data.initialize) clearTimeout(data.initialize);

	data.initialize = setTimeout(async () => {
		delete data.initialize;

		await component.init();
		component.ready.resolve();
		component.trigger((0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_4__.componentEventname)("initialzed", component));
	}, _Constants__WEBPACK_IMPORTED_MODULE_3__.initTimeout);
};

const createUID = (prefix, suffix) => {
	let count = 0;
	let id = null;
    while(count < 100){
		id = `${prefix}${(0,_default_js_defaultjs_common_utils_src_UUID__WEBPACK_IMPORTED_MODULE_2__.uuid)()}${suffix}`;
		if(!document.getElementById(id))
			return id;

		count++;
	}
	console.error(new Error("To many retries to create an unique id - created id is not unique!"));
	return id;
};


class Component extends HTMLElement {
	constructor({shadowRoot = false, content = null, createUID = false, uidPrefix = "id-", uidSuffix = ""} = {}) {
		super();
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE_READY, (0,_default_js_defaultjs_common_utils_src_PromiseUtils__WEBPACK_IMPORTED_MODULE_1__.lazyPromise)());

		if(createUID)
			this.attr("id", createUID(uidPrefix, uidSuffix));

		if(shadowRoot)
			this.attachShadow({mode:open});
		
		if(content)
			this.root.append(typeof content === "function" ? content(this) : content);
	}

	get root(){
		return this.shadowRoot || this;
	}

	get ready(){
		return (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE_READY);
	}

	async init() {}

	async destroy() {
		if(this.ready.resolved)
			(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE_READY, (0,_default_js_defaultjs_common_utils_src_PromiseUtils__WEBPACK_IMPORTED_MODULE_1__.lazyPromise)());
	}

	connectedCallback() {
		if (this.ownerDocument == document) init(this);
	}

	adoptedCallback() {
		this.connectedCallback();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue != newValue && this.isConnected) {
			this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_3__.triggerTimeout, (0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_4__.attributeChangeEventname)(name, this));
			this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_3__.triggerTimeout, (0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_4__.componentEventname)("change", this));
		}
	}

	disconnectedCallback(){
		this.destroy();
	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/Constants.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/Constants.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "componentPrefix": () => (/* binding */ componentPrefix),
/* harmony export */   "attributeChangeEventPrefix": () => (/* binding */ attributeChangeEventPrefix),
/* harmony export */   "initTimeout": () => (/* binding */ initTimeout),
/* harmony export */   "triggerTimeout": () => (/* binding */ triggerTimeout)
/* harmony export */ });
const componentPrefix = "d-";
const attributeChangeEventPrefix = "attribute-";
const initTimeout = 100;
const triggerTimeout = 100;


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/Ready.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/Ready.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
	let resolve, reject = null;
	const result = new Promise((r, e) => {
		resolve = r;
		reject = e;
	});

	result.resolved = false;
	result.error = false;
	result.resolve = () => {		
		result.resolved = true;
		result.resolve = () => {};
		resolve();
	};
	result.reject = () => {
		result.resolved = true;
		result.error = true;
		result.reject = () => {};
		reject();
	};;

	return result;
});


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/utils/DefineComponentHelper.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/utils/DefineComponentHelper.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toNodeName": () => (/* binding */ toNodeName),
/* harmony export */   "define": () => (/* binding */ define),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-components/src/Constants.js");


const toNodeName = (name, prefix) => {
	if(typeof prefix === "string")
		return prefix + name;
		
	return _Constants__WEBPACK_IMPORTED_MODULE_0__.componentPrefix + name;
};

const define = function(clazz, options) {
	const nodename = clazz.NODENAME;
	if (!customElements.get(nodename)) {
		customElements.define(nodename, clazz, options);
	}
};


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (define); 


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/utils/EventHelper.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/utils/EventHelper.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "componentEventname": () => (/* binding */ componentEventname),
/* harmony export */   "attributeChangeEventname": () => (/* binding */ attributeChangeEventname),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-components/src/Constants.js");


const componentEventname = (eventType, node ) => {	
	let nodename = "unsupported";
	if(typeof node === "string")
		nodename = node;
	else if(node instanceof HTMLElement)
		nodename = node.nodeName;
	else if(typeof node.NODENAME === "string")
		nodename = node.NODENAME;
	else throw new Error(typeof node + " is not supported as pram node!");
	
   return `${nodename.toLowerCase()}:${eventType}`;
};


const attributeChangeEventname = (attribute, node ) => {
    return componentEventname(_Constants__WEBPACK_IMPORTED_MODULE_0__.attributeChangeEventPrefix + "-" + attribute, node);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({componentEventname, attributeChangeEventname});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/utils/StyleHelper.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/utils/StyleHelper.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports copyStyles, CSS_BASE_PATH_VAR, loadComponentStyle */
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");


const copyStyles = (source, target, append = true) => {
	const styles = source.find(`style[type="text/css"], link[rel="stylesheet"]`);

	if (append)
		target.append(styles.cloneNode(true));
	else
		target.prepend(styles.cloneNode(true));
}

const CSS_BASE_PATH_VAR = "CSS_BASE_PATH";
const loadComponentStyle = (target) => {
	const path = `${_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default[CSS_BASE_PATH_VAR] || "css"}/${target.nodeName.toLowerCase()}.css`;
	target.append(`<link rel="stylesheet" href="${path}"/>`);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ CSS_BASE_PATH_VAR, copyStyles, loadComponentStyle });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/utils/TemplateHelper.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/utils/TemplateHelper.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ATTR_TEMPLATE": () => (/* binding */ ATTR_TEMPLATE),
/* harmony export */   "loadTemplate": () => (/* binding */ loadTemplate),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_template_language__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-template-language */ "./node_modules/@default-js/defaultjs-template-language/index.js");

const ATTR_TEMPLATE = "template";

const getTemplate = (node) => {
	let template = node.find(":scope > template").first();
	if (!!template) return template;
	const value = node.attr(ATTR_TEMPLATE);
	if (!value) return null;
	try {
		template = find(value).first();
		if (!!template) return template;
	} catch (e) { }
	return new URL(value, location.href);
};

const loadTemplate = async (node, defaultTemplate, cache, alias) => {
	const template = getTemplate(node);
	if (template)
		return _default_js_defaultjs_template_language__WEBPACK_IMPORTED_MODULE_0__.Template.load(template, cache, alias);

	return defaultTemplate;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ ATTR_TEMPLATE, loadTemplate });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/utils/WeakData.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/utils/WeakData.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WeakData)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");

class WeakData {
	constructor() {
		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defValue)(this, "weakmap", new WeakMap());
	}

	data(reference) {
		let data = this.weakmap.get(reference);
		if (!data) {
			data = {};
			this.weakmap.set(reference, data);
		}
		return data;
	}

	value(reference, key, value) {
		if (arguments.length == 2) return this.data(reference)[key];
		else this.data(reference)[key] = value;
	}
};



/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-components/src/utils/index.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-components/src/utils/index.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DefineComponentHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DefineComponentHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/DefineComponentHelper.js");
/* harmony import */ var _EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/EventHelper.js");
/* harmony import */ var _StyleHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StyleHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/StyleHelper.js");
/* harmony import */ var _TemplateHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TemplateHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/TemplateHelper.js");
/* harmony import */ var _WeakData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WeakData */ "./node_modules/@default-js/defaultjs-html-components/src/utils/WeakData.js");







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({DefineComponentHelper: _DefineComponentHelper__WEBPACK_IMPORTED_MODULE_0__.default, EventHelper: _EventHelper__WEBPACK_IMPORTED_MODULE_1__.default, NodeHelper: _EventHelper__WEBPACK_IMPORTED_MODULE_1__.default, StyleHelper: _StyleHelper__WEBPACK_IMPORTED_MODULE_2__.default, TemplateHelper: _TemplateHelper__WEBPACK_IMPORTED_MODULE_3__.default, WeakData: _WeakData__WEBPACK_IMPORTED_MODULE_4__.default});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/browser.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/browser.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./node_modules/@default-js/defaultjs-html-form/index.js");



_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.form = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.form || {
	VERSION : "${version}",
	Form: _index__WEBPACK_IMPORTED_MODULE_1__.Form,
	Page: _index__WEBPACK_IMPORTED_MODULE_1__.Page,
	BaseField: _index__WEBPACK_IMPORTED_MODULE_1__.BaseField,
	Field: _index__WEBPACK_IMPORTED_MODULE_1__.Field,
	Container: _index__WEBPACK_IMPORTED_MODULE_1__.Container,
	List: _index__WEBPACK_IMPORTED_MODULE_1__.List
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Form": () => (/* reexport safe */ _src_Form__WEBPACK_IMPORTED_MODULE_5__.default),
/* harmony export */   "Page": () => (/* reexport safe */ _src_Page__WEBPACK_IMPORTED_MODULE_4__.default),
/* harmony export */   "BaseField": () => (/* reexport safe */ _src_BaseField__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "Field": () => (/* reexport safe */ _src_Field__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "List": () => (/* reexport safe */ _src_List__WEBPACK_IMPORTED_MODULE_3__.default),
/* harmony export */   "Container": () => (/* reexport safe */ _src_Container__WEBPACK_IMPORTED_MODULE_2__.default)
/* harmony export */ });
/* harmony import */ var _src_BaseField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/BaseField */ "./node_modules/@default-js/defaultjs-html-form/src/BaseField.js");
/* harmony import */ var _src_Field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/Field */ "./node_modules/@default-js/defaultjs-html-form/src/Field.js");
/* harmony import */ var _src_Container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/Container */ "./node_modules/@default-js/defaultjs-html-form/src/Container.js");
/* harmony import */ var _src_List__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/List */ "./node_modules/@default-js/defaultjs-html-form/src/List.js");
/* harmony import */ var _src_Page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./src/Page */ "./node_modules/@default-js/defaultjs-html-form/src/Page.js");
/* harmony import */ var _src_Form__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./src/Form */ "./node_modules/@default-js/defaultjs-html-form/src/Form.js");









/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Base.js":
/*!******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Base.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");
/* harmony import */ var _utils_StateHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/StateHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/StateHelper.js");




const ATTRIBUTES = [_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_READONLY, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_CONDITION, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_CONDITION_VALID, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_CONDITION_INVALID, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_EDITABLE_CONDITION];

class Base extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
	}

	get form() {
		if (!this.__form__)
			this.__form__ = this.parent(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Form);
		return this.__form__;
	}

	get active() {
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE);
	}

	set active(active) {
		const current = this.active;
		if (current != active) {
			(0,_utils_StateHelper__WEBPACK_IMPORTED_MODULE_2__.updateActiveState)(this, active);
			this.activeUpdated();
		}
	}

	activeUpdated() {
	}

	get readonly() {
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_READONLY);
	}

	set readonly(readonly) {
		(0,_utils_StateHelper__WEBPACK_IMPORTED_MODULE_2__.updateEditableState)(this, !readonly, !this.ready.resolved);
		this.readonlyUpdated();
	}

	readonlyUpdated() { }
	
	get editable(){
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_EDITABLE);		
	}
	
	set editable(editable){		
		(0,_utils_StateHelper__WEBPACK_IMPORTED_MODULE_2__.updateEditableState)(this, editable, !this.ready.resolved);
		this.editableUpdated();		
	}
	
	editableUpdated(){
		this.readonlyUpdated();
	}

	get condition() {
		return !this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_CONDITION_INVALID);
	}

	conditionUpdated() {

	}

	get valid() {
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_VALID);
	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Base);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/BaseField.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/BaseField.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export findParentField */
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _utils_StateHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/StateHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/StateHelper.js");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Base */ "./node_modules/@default-js/defaultjs-html-form/src/Base.js");
/* harmony import */ var _Validator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Validator */ "./node_modules/@default-js/defaultjs-html-form/src/Validator.js");






const ATTRIBUTES = [_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_NAME, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_REQUIRED, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_NOVALUE];

const findParentField = (field) => {
	let parent = field.parentNode;
	while (parent) {
		if (parent instanceof BaseField) return parent;

		parent = parent.parentNode;
	}
	return null;
};

const updateHasValue = (hasValue, field) => {
	field.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_NOVALUE, !hasValue ? "" : null);
};

class BaseField extends _Base__WEBPACK_IMPORTED_MODULE_3__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(_Base__WEBPACK_IMPORTED_MODULE_3__.default.observedAttributes);
	}

	constructor(value = null) {
		super();
		this.__value__ = value;
		this.__valueChanged__ = true;

		this.on(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.conditionStateChanged, (event) => {
			if (event.target == this) {
				this.conditionUpdated();
			}
		});
	}

	async init() {
		await super.init();
		const ready = this.ready;
		if (!ready.resolved) {
			this.parentField = findParentField(this);
			this.validator = new _Validator__WEBPACK_IMPORTED_MODULE_4__.default(this);

			this.form.on(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.executeValidate, async (event) => {
				const chain = event.detail;
				if (chain.indexOf(this) < 0) {
					const current = this.valid;
					const valid = await this.validate();
					if (current != valid) {
						this.publishValue();
					}
				}
			});

			this.form.on(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.allPublishValue, () => {
				this.publishValue();
			});
		}

		this.validate();
	}

	conditionUpdated() {
		this.active = this.condition;
	}

	get name() {
		return this.getAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_NAME);
	}

	get required() {
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_REQUIRED);
	}

	get hasValue() {
		const value = this.__value__;
		return value != null && typeof value !== "undefined";
	}

	async value() {
		if(arguments.length == 0)
			return this.__value__;
		let value = arguments[0];
		await this.ready;

		if (await this.acceptValue(value)) {
			value = (await this.normalizeValue(value));
			if (this.__value__ != value) {
				this.__value__ = value;
				await this.updatedValue(value);
				await this.validate();				
				this.publishValue();
			}			
		}
	}

	async validate() {
		updateHasValue(this.hasValue, this);
		if (!this.validator) return false;

		const valid = await this.validator.validate();
		return valid;
	}

	async publishValue(chain = []) {
		chain.push(this);
		if(this.parentField)
			await this.parentField.childValueChanged(this, chain)
		else
			this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.valueChanged, chain);
	}

	async acceptValue(value) {
		return true;
	}

	async normalizeValue(value) {
		return value;
	}

	async updatedValue() {}
	async childValueChanged(child, chain){}
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BaseField);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Constants.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EVENTHANDLE_TIMEOUT": () => (/* binding */ EVENTHANDLE_TIMEOUT),
/* harmony export */   "EVENTHANDLE_INPUT_TIMEOUT": () => (/* binding */ EVENTHANDLE_INPUT_TIMEOUT),
/* harmony export */   "NODENAMES": () => (/* binding */ NODENAMES),
/* harmony export */   "FORMSTATES": () => (/* binding */ FORMSTATES),
/* harmony export */   "EVENTS": () => (/* binding */ EVENTS),
/* harmony export */   "SPECIALVARS": () => (/* binding */ SPECIALVARS),
/* harmony export */   "ATTRIBUTE_NAME": () => (/* binding */ ATTRIBUTE_NAME),
/* harmony export */   "ATTRIBUTE_ENDPOINT": () => (/* binding */ ATTRIBUTE_ENDPOINT),
/* harmony export */   "ATTRIBUTE_METHOD": () => (/* binding */ ATTRIBUTE_METHOD),
/* harmony export */   "ATTRIBUTE_STATE": () => (/* binding */ ATTRIBUTE_STATE),
/* harmony export */   "ATTRIBUTE_STEP": () => (/* binding */ ATTRIBUTE_STEP),
/* harmony export */   "ATTRIBUTE_USE_SUMMARY_PAGE": () => (/* binding */ ATTRIBUTE_USE_SUMMARY_PAGE),
/* harmony export */   "ATTRIBUTE_INPUT_MODE_AFTER_SUBMIT": () => (/* binding */ ATTRIBUTE_INPUT_MODE_AFTER_SUBMIT),
/* harmony export */   "ATTRIBUTE_REQUIRED": () => (/* binding */ ATTRIBUTE_REQUIRED),
/* harmony export */   "ATTRIBUTE_CONDITION": () => (/* binding */ ATTRIBUTE_CONDITION),
/* harmony export */   "ATTRIBUTE_ACTIVE": () => (/* binding */ ATTRIBUTE_ACTIVE),
/* harmony export */   "ATTRIBUTE_DISABLED": () => (/* binding */ ATTRIBUTE_DISABLED),
/* harmony export */   "ATTRIBUTE_EDITABLE": () => (/* binding */ ATTRIBUTE_EDITABLE),
/* harmony export */   "ATTRIBUTE_EDITABLE_CONDITION": () => (/* binding */ ATTRIBUTE_EDITABLE_CONDITION),
/* harmony export */   "ATTRIBUTE_READONLY": () => (/* binding */ ATTRIBUTE_READONLY),
/* harmony export */   "ATTRIBUTE_NOVALUE": () => (/* binding */ ATTRIBUTE_NOVALUE),
/* harmony export */   "ATTRIBUTE_VALID": () => (/* binding */ ATTRIBUTE_VALID),
/* harmony export */   "ATTRIBUTE_INVALID": () => (/* binding */ ATTRIBUTE_INVALID),
/* harmony export */   "ATTRIBUTE_CONDITION_VALID": () => (/* binding */ ATTRIBUTE_CONDITION_VALID),
/* harmony export */   "ATTRIBUTE_CONDITION_INVALID": () => (/* binding */ ATTRIBUTE_CONDITION_INVALID),
/* harmony export */   "ATTRIBUTE_MAX": () => (/* binding */ ATTRIBUTE_MAX),
/* harmony export */   "ATTRIBUTE_PROGRESS": () => (/* binding */ ATTRIBUTE_PROGRESS)
/* harmony export */ });
/* unused harmony exports HTML_TAG_PREFIX, TRIGGER_TIMEOUT, REQUIREDSTATES, EVENT_PREFIX, ATTRIBUTE_REQUIRED_ON_ACTIVE_ONLY */
const HTML_TAG_PREFIX = "d-";
const TRIGGER_TIMEOUT = 10;
const EVENTHANDLE_TIMEOUT = 10;
const EVENTHANDLE_INPUT_TIMEOUT = 50 * EVENTHANDLE_TIMEOUT;

const NODENAMES = {
	Form: HTML_TAG_PREFIX + "form",
	Control: HTML_TAG_PREFIX + "control",
	BackButton: HTML_TAG_PREFIX + "control-back",
	NextButton: HTML_TAG_PREFIX + "control-next",
	SummaryButton: HTML_TAG_PREFIX + "control-summary",
	SubmitButton: HTML_TAG_PREFIX + "control-submit",
	CancelButton: HTML_TAG_PREFIX + "control-cancel",
	Page: HTML_TAG_PREFIX + "page",
	Field: HTML_TAG_PREFIX + "field",
	WrapperField: HTML_TAG_PREFIX + "wrapper-field",
	List: HTML_TAG_PREFIX + "list",
	ListRows: HTML_TAG_PREFIX + "rows",
	ListRow: HTML_TAG_PREFIX + "row",
	ButtonAddRow: HTML_TAG_PREFIX + "add-row",
	ButtonDeleteRow: HTML_TAG_PREFIX + "delete-row",
	Container: HTML_TAG_PREFIX + "container",
	Validation: HTML_TAG_PREFIX + "validation",
	Message: HTML_TAG_PREFIX + "message",
	ProgressBar: HTML_TAG_PREFIX + "progress-bar",
	Step: HTML_TAG_PREFIX + "step",
};
const FORMSTATES = {
	init: "init",
	input: "input",
	summary: "summary",
	finished: "finished",
};

const REQUIREDSTATES = {
	always: "always",
	onActive: "on-active",
};

const EVENT_PREFIX = HTML_TAG_PREFIX + "form-";

const EVENTS = {
	initialize: EVENT_PREFIX + "initialize",
	/* fired by change value from an field implementation
	 * and consumed by the reference implementation of
	 * BaseField to make validation and fire valueChanged
	 * event
	 */
	input: EVENT_PREFIX + "field-input",
	/* internal event for publish that a value of field has changed (event after validation) */
	valueChanged: EVENT_PREFIX + "field-value-changed",
	/* internal event to start validation at elements -> only fired at form*/
	executeValidate: EVENT_PREFIX + "execute-validate",
	/* */
	activeStateChanged: EVENT_PREFIX + "active-state-changed",
	/* */
	conditionStateChanged: EVENT_PREFIX + "condition-state-changed",
	/* */
	validStateChanged: EVENT_PREFIX + "valid-state-changed",
	/* */
	siteChanged: EVENT_PREFIX + "site-changed",
	/* */
	formStateChanged: EVENT_PREFIX + "state-changed",
	/* */
	allPublishValue: EVENT_PREFIX + "all-publish-value",
	/* */
	submit: EVENT_PREFIX + "submit",
	/* */
	progressbarChanged : EVENT_PREFIX + "progress-bar-changed",

	//old need to be refactored

	added: EVENT_PREFIX + "added",
	change: EVENT_PREFIX + "change",
	changeAttributeEventBuilder: (name) => {
		return EVENT_PREFIX + "change-attribute-" + name;
	},
	changeActive: EVENT_PREFIX + "change-active",
	changeValue: EVENT_PREFIX + "change-value",
	changeCondition: EVENT_PREFIX + "change-condition",
	changeValidation: EVENT_PREFIX + "change-validation",

	//LIST EVENTS
	listRowAdd: EVENT_PREFIX + "list-row-add",
	listRowDelete: EVENT_PREFIX + "list-row-delete",
	
	editableStateChanged: EVENT_PREFIX + "editable-state-changed"
};

const SPECIALVARS = {
	CURRENTVALUE: "$value",
	CURRENTLISTROW: "$item",
};

//ATTRIBUTES

const ATTRIBUTE_NAME = "name";
const ATTRIBUTE_ENDPOINT = "endpoint";
const ATTRIBUTE_METHOD = "method";
const ATTRIBUTE_STATE = "state";

const ATTRIBUTE_STEP = "step";
const ATTRIBUTE_USE_SUMMARY_PAGE = "use-summary-page";
const ATTRIBUTE_INPUT_MODE_AFTER_SUBMIT = "input-mode-after-submit";
const ATTRIBUTE_REQUIRED = "required";
const ATTRIBUTE_REQUIRED_ON_ACTIVE_ONLY = "required-on-active-only";
const ATTRIBUTE_CONDITION = "condition";
const ATTRIBUTE_ACTIVE = "active";
const ATTRIBUTE_DISABLED = "disabled";
const ATTRIBUTE_EDITABLE = "editable";
const ATTRIBUTE_EDITABLE_CONDITION = "editable-condition";
const ATTRIBUTE_READONLY = "readonly";
const ATTRIBUTE_NOVALUE = "no-value";
const ATTRIBUTE_VALID = "valid";
const ATTRIBUTE_INVALID = "invalid";
const ATTRIBUTE_CONDITION_VALID = "condition-valid";
const ATTRIBUTE_CONDITION_INVALID = "condition-invalid";
const ATTRIBUTE_MAX = "max";
const ATTRIBUTE_PROGRESS = "progress";


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Container.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Container.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_NodeHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/NodeHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/NodeHelper.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _BaseField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BaseField */ "./node_modules/@default-js/defaultjs-html-form/src/BaseField.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");







const ATTRIBUTES = [];

const NAME_SPLITTER = /\./g;

const valueHelper = function (data, name, value) {
	if (data == null || typeof data === "undefined") return null;

	const update = arguments.length > 2;

	const names = name.split(NAME_SPLITTER);
	while (names.length > 1) {
		const key = names.shift();
		let temp = data[key];
		const has = typeof temp !== "undefiend" && temp != null;
		if (!has && !update) return null;
		else if (!has && update) temp = data[key] = {};

		data = temp;
	}

	if (update) data[names[0]] = value;
	else return data[names[0]] ? data[names[0]] : null;
};

class Container extends _BaseField__WEBPACK_IMPORTED_MODULE_4__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(_BaseField__WEBPACK_IMPORTED_MODULE_4__.default.observedAttributes);
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_1__.NODENAMES.Container;
	}

	constructor(value = null) {
		super(value ? value : {});
		this.fields = [];
		this.on(_Constants__WEBPACK_IMPORTED_MODULE_1__.EVENTS.valueChanged, (event) => {
			const field = event.target;
			if (field != this) {
				event.preventDefault();
				event.stopPropagation();

				const chain = event.detail;
				this.childValueChanged(field, chain);
			}
		});
	}

	async init() {
		const ready = this.ready;
		await super.init();
		this.fields = (0,_utils_NodeHelper__WEBPACK_IMPORTED_MODULE_2__.findFields)(this);
		if (!ready.resolved) {
			this.on(_Constants__WEBPACK_IMPORTED_MODULE_1__.EVENTS.initialize, (event) => {
				if (event.target != this) {
					const field = event.target;
					if (field instanceof _BaseField__WEBPACK_IMPORTED_MODULE_4__.default) {
						if (this.fields.indexOf(field) < 0) {
							this.fields.push(field);
						}

						event.preventDefault();
						event.stopPropagation();
					}
				}
			});

			this.validator.addCustomCheck(async ({ data, base }) => {
				const { fields } = base;
				if (fields) {
					const length = fields.length;
					for (let i = 0; i < length; i++) {
						const field = fields[i];
						if (field.condition && !field.valid) return false;
					}
				}

				return true;
			});
		}
	}

	readonlyUpdated() {
		const { readonly, fields } = this;
		if (fields)
			for (let field of fields) {
				field.readonly = readonly;
			}
	}

	async updatedValue(value) {
		this.__value__ = {};
		const { fields } = this;
		if (fields)
			for (let field of fields) {				
				if (field.name) await field.value(valueHelper(value, field.name));
				else if (field instanceof Container) await field.value(value);
			}
	}

	async childValueChanged(field, chain) {
		await this.ready;
		const name = await field.name;
		const value = await field.value();
		if (name) valueHelper(this.__value__, name, value);
		else if (value != null) _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.default.merge(this.__value__, value);

		this.validate();
		this.publishValue(chain);
	}
}

(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_5__.default)(Container);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Container);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Control.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Control.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");
/* harmony import */ var _controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controls */ "./node_modules/@default-js/defaultjs-html-form/src/controls/index.js");
/* harmony import */ var _Page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Page */ "./node_modules/@default-js/defaultjs-html-form/src/Page.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");






const BUTTONDUMMY = {
	active: true,
	disabled: true,
};

const ATTRIBUTES = [];
class Control extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Control;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
		if (!this.ready.resolved) {
			this.form = this.parent(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Form);
			this.back = this.find(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.BackButton).first() || BUTTONDUMMY;
			this.next = this.find(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.NextButton).first() || BUTTONDUMMY;
			this.summary = this.find(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.SummaryButton).first() || BUTTONDUMMY;
			this.submit = this.find(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.SubmitButton).first() || BUTTONDUMMY;

			this.form.on([_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.validStateChanged, _Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.conditionStateChanged], (event) => {
				if (event.target instanceof _Page__WEBPACK_IMPORTED_MODULE_3__.default) this.update();
			});

			this.form.on([_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.formStateChanged, _Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.siteChanged], (event) => {
				this.update();
			});
		}
	}

	update() {
		const { back, next, summary, submit, form } = this;
		const { activePageIndex, activePage, nextPage, pages, useSummaryPage, state } = form;

		// basic control setup
		back.active = true;
		back.disabled = true;
		next.active = false;
		next.disabled = true;
		summary.active = false;
		summary.disabled = true;
		submit.active = false;
		submit.disabled = true;

		if (state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.finished) {
			back.disabled = true;
			submit.active = true;
		} else if (state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.summary) {
			back.disabled = false;
			submit.active = true;
			submit.disabled = !form.valid;
		} else if (state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.input) {
			back.disabled = activePageIndex <= 0;

			if (nextPage || (!activePage.valid && activePageIndex + 1 < pages.length)) {
				next.active = true;
				next.disabled = !activePage.valid;
			} else if (useSummaryPage && state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.input) {
				summary.active = true;
				summary.disabled = !activePage.valid;
			} else {
				submit.active = true;
				submit.disabled = !form.valid;
			}
		}
	}
}
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_4__.default)(Control);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (Control);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Field.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Field.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _BaseField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BaseField */ "./node_modules/@default-js/defaultjs-html-form/src/BaseField.js");
/* harmony import */ var _wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wrapper */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/index.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");





const ATTRIBUTES = ["file-format"];

class Field extends _BaseField__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(_BaseField__WEBPACK_IMPORTED_MODULE_1__.default.observedAttributes);
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Field;
	}

	constructor() {
		super();
		this.__valueChanged__ = true;
		this.on(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, (event) => {
			event.preventDefault();
			event.stopPropagation();

			const value = event.detail ? event.detail : null;
			const valueChanged = !this.__valueChanged__ ? this.__value__ != value :  true;
			if (valueChanged) {
				this.__valueChanged__ = valueChanged;
				this.__value__ = value;
				(async () => {
					await this.validate();
					await this.publishValue();
				})();
			}
		});
	}
	
	async init() {
		await super.init();
		const ready = this.ready;
		if (!ready.resolved) {
			this.wrapper = (0,_wrapper__WEBPACK_IMPORTED_MODULE_2__.findWrapper)(this);
			if (this.wrapper)
				this.validator.addCustomCheck(async () => {
					return this.wrapper.valid;
				});
		}
		
		this.__valueChanged__ = true;
		this.publishValue();
	}

	readonlyUpdated() {
		if (this.wrapper) this.wrapper.readonly = this.readonly;
	}

	async acceptValue(value) {
		return this.wrapper ? this.wrapper.acceptValue(value) : false;
	}

	async normalizeValue(value) {
		if (this.wrapper) return this.wrapper.normalizeValue(value);

		return value;
	}

	async updatedValue(value) {		
		await this.ready;		
		this.__valueChanged__ = true;
		if (this.wrapper) await this.wrapper.updatedValue(value);
	}

	async publishValue(chain = []) {
		if (this.__valueChanged__) {
			await super.publishValue(chain);			
			this.__valueChanged__ = false;
		}
	}
}

(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_3__.default)(Field);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Field);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Form.js":
/*!******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Form.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _Message__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Message */ "./node_modules/@default-js/defaultjs-html-form/src/Message.js");
/* harmony import */ var _Page__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Page */ "./node_modules/@default-js/defaultjs-html-form/src/Page.js");
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Control */ "./node_modules/@default-js/defaultjs-html-form/src/Control.js");
/* harmony import */ var _ProgressBar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ProgressBar */ "./node_modules/@default-js/defaultjs-html-form/src/ProgressBar.js");











const ATTRIBUTES = [_Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_NAME, _Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_USE_SUMMARY_PAGE, _Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_ENDPOINT, _Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_METHOD, _Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_STATE, _Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_INPUT_MODE_AFTER_SUBMIT];

const readonly = (form, readonly) => {
	for (let page of form.pages) {
		page.readonly = readonly;
		page.active = readonly;
	}
};

class Form extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_0__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_3__.NODENAMES.Form;
	}

	constructor() {
		super();
		this.__data__ = {};
		this.__state__ = null;
		this.on(
			_Constants__WEBPACK_IMPORTED_MODULE_3__.EVENTS.valueChanged,
			(0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_5__.toTimeoutHandle)(
				async (event) => {
					const field = event.target;
					const name = await field.name;
					const value = await field.value();
					if (name) this.__data__[name] = value;
					else if (value != null) _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_2__.default.merge(this.__data__, value);

					this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_3__.EVENTS.executeValidate, event.detail);
				},
				true,
				true,
			),
		);
	}

	async init() {
		await super.init();
		this.state = _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.init;
		const ready = this.ready;
		if (!ready.resolved) {
			this.useSummaryPage = this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_USE_SUMMARY_PAGE);
			this.activePageIndex = -1;

			this.useSummaryPage = this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_USE_SUMMARY_PAGE);
			this.pages = this.find(_Constants__WEBPACK_IMPORTED_MODULE_3__.NODENAMES.Page);
		}

		this.activePageIndex = -1;
		if (this.pages.length > 0) this.toNextPage();
	}

	get state() {
		return this.__state__;
	}

	set state(state) {
		const actual = this.state;
		if (actual == _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input && state != _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input) readonly(this, true);
		else if (actual != _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input && state == _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input) {
			readonly(this, false);
			if (this.activePage) this.activePage.active = true;
		}
		this.__state__ = state;

		if (actual != state) this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_3__.EVENTS.formStateChanged);
		this.attr(_Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_STATE, this.__state__);
	}

	get valid() {
		for (let page of this.pages) if (!page.valid) return false;

		return true;
	}

	async data() {
		if (arguments.length == 0) return this.__data__;

		const data = arguments[0];
		await this.ready;

		if (this.state == _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input) {
			this.__data__ = {}; //data;
			for (let page of this.pages) {
				await page.value(null);// reset all values
				if (page.name) await page.value(data[page.name]);
				else await page.value(data);
			}

			this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_3__.EVENTS.allPublishValue);
		}
	}

	get activePage() {
		if (0 <= this.activePageIndex && this.activePageIndex < this.pages.length) return this.pages[this.activePageIndex];

		return null;
	}

	set activePage(page) {
		const current = this.activePage;
		if (page != current) {
			if (current) current.active = false;
			this.activePageIndex = this.pages.indexOf(page);
			page.active = true;
			if (this.state != _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input) this.state = _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input;

			this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_3__.EVENTS.siteChanged);
		}
	}

	get prevPage() {
		const start = this.activePageIndex - 1;
		for (let i = start; i >= 0; i--) {
			const page = this.pages[i];
			if (page.condition) return page;
		}
		return null;
	}

	get nextPage() {
		if (this.pages) {
			const start = this.activePageIndex + 1;
			for (let i = start; i < this.pages.length; i++) {
				const page = this.pages[i];
				if (page.condition) return page;
			}
		}
		return null;
	}

	async toPrevPage() {
		if (this.state != _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input) {
			this.state = _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input;
		} else {
			const prev = await this.prevPage;
			if (prev) this.activePage = prev;
		}
	}

	async toNextPage() {
		const next = await this.nextPage;
		if (next) {
			this.activePage = next;
			if (this.state == _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.init) this._state = _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input;
		} else if (this.useSummaryPage) {
			this.summary();
		} else {
			this.submit();
		}
	}

	async summary() {
		this.state = _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.summary;
	}

	async submit() {
		this.state = this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_INPUT_MODE_AFTER_SUBMIT) ? _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.input : _Constants__WEBPACK_IMPORTED_MODULE_3__.FORMSTATES.finished;
		const data = this.data;

		let endpoint = this.attr(_Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_ENDPOINT);
		if (endpoint) {
			endpoint = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_1__.default.resolveText(endpoint, data, endpoint);
			const url = new URL(endpoint, location.href);

			return await fetch(url.toString(), {
				method: (this.attr(_Constants__WEBPACK_IMPORTED_MODULE_3__.ATTRIBUTE_METHOD) || "post").toLowerCase(),
				credentials: "include",
				mode: "cors",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(data),
			});
		}

		this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_3__.EVENTS.submit, data);
	}
}
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_4__.default)(Form);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Form);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/FormButton.js":
/*!************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/FormButton.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");



const ATTRIBUTES = [_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_DISABLED];

class FormButton extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static init(button) {
	
	}

	constructor() {
		super();
		this.active = false;
		this.disabled = false;
		this.on("click", (event) => {
			event.preventDefault();
			event.stopPropagation();

			if (this.active && !this.disabled) this.execute();
		});
	}

	async init() {
		await super.init();
		this.form = this.parent(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Form);
	}

	get active() {
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE);
	}

	set active(active) {
		active ? this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE, "") : this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE, null);
	}

	get disabled() {
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_DISABLED);
	}

	set disabled(disabled) {
		disabled ? this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_DISABLED, "") : this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_DISABLED, null);
	}

	execute() {
		console.log("execute");
	}
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormButton);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/List.js":
/*!******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/List.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ValueHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ValueHelper */ "./node_modules/@default-js/defaultjs-common-utils/src/ValueHelper.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _utils_NodeHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/NodeHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/NodeHelper.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");
/* harmony import */ var _BaseField__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BaseField */ "./node_modules/@default-js/defaultjs-html-form/src/BaseField.js");
/* harmony import */ var _list_Row__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./list/Row */ "./node_modules/@default-js/defaultjs-html-form/src/list/Row.js");
/* harmony import */ var _list_AddRow__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./list/AddRow */ "./node_modules/@default-js/defaultjs-html-form/src/list/AddRow.js");
/* harmony import */ var _list_DeleteRow__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./list/DeleteRow */ "./node_modules/@default-js/defaultjs-html-form/src/list/DeleteRow.js");
/* harmony import */ var _list_Rows__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./list/Rows */ "./node_modules/@default-js/defaultjs-html-form/src/list/Rows.js");











const ATTRIBUTES = [_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_MAX];

const findAddButton = (list) => {
	return (0,_utils_NodeHelper__WEBPACK_IMPORTED_MODULE_3__.treeFilter)({
		root: list,
		filter: (element) => {
			if (element instanceof _list_AddRow__WEBPACK_IMPORTED_MODULE_7__.default) return { accept: true, stop: true };
			else if (element instanceof _BaseField__WEBPACK_IMPORTED_MODULE_5__.default) return { accept: false, stop: true };
			return { accept: false };
		},
	})[0];
};

const createRow = async (list, value) => {
	const { container, template } = list;
	const row = document.importNode(template.content, true).children[0];
	container.append(row);

	if (value) await row.value(value);

	return row;
};

class List extends _BaseField__WEBPACK_IMPORTED_MODULE_5__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(_BaseField__WEBPACK_IMPORTED_MODULE_5__.default.observedAttributes);
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.List;
	}

	constructor(value = null) {
		super(value ? value : []);

		this.on(
			_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.valueChanged,
				(event) => {
					const row = event.target;
					if (row instanceof _list_Row__WEBPACK_IMPORTED_MODULE_6__.default) {
						event.preventDefault();
						event.stopPropagation();
				
						const chain = event.detail;
						this.childValueChanged(row, chain);
					}
				}
		);

		this.on(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.listRowAdd, (event) => {
			event.preventDefault();
			event.stopPropagation();

			const { readonly, __value__ } = this;
			if (!readonly) {
				const row = createRow(this);
				__value__.push(row.value);

				this.validate();
				this.publishValue();
			}
		});

		this.on(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.listRowDelete, (event) => {
			event.preventDefault();
			event.stopPropagation();

			const { rows, readonly, __value__ } = this;
			if (!readonly) {
				const row = event.target.parent(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.ListRow);
				const index = rows.indexOf(row);
				if (index >= 0) {
					row.remove();
					rows.splice(index, 1);
					__value__.splice(index, 1);

					this.validate();
					this.publishValue();
				}
			}
		});
	}

	async init() {
		await super.init();
		this.__value__ = [];
		const ready = this.ready;
		if (!ready.resolved) {
			this.template = this.find("template").first();
			this.container = this.find(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.ListRows).first();
			const { container, template, validator } = this;
			const addButton = findAddButton(this);

			validator.addCustomCheck(async ({}) => {
				const { rows, max, readonly } = this;
				const length = rows.length;
				if (!readonly) {
					if (length == max) addButton.disabled = true;
					else if (length < max) addButton.disabled = false;
				}
				return length <= max;
			});

			validator.addCustomCheck(async () => {
				const { rows } = this;
				if (rows)
					for (let row of rows) {
						if (!row.valid) return false;
					}

				return true;
			});
		}

		this.validate();
		this.publishValue();
	}

	readonlyUpdated() {
		const { readonly } = this;
		for (let row of this.rows) {
			row.readonly = readonly;
		}
	}

	get rows() {
		return Array.from(this.container.children);
	}

	get max() {
		if (this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_MAX)) return parseInt(this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_MAX));
		return Number.MAX_SAFE_INTEGER;
	}

	acceptValue(value) {
		return !value || value instanceof Array;
	}

	normalizeValue(value) {
		return value.filter((item) => !!item);
	}

	async updatedValue(value) {
		this.container.children.remove();
		this.__value__ = [];

		for (let val of value) await createRow(this, val);
	}

	async childValueChanged(row, chain){
		await this.ready;
		const rows = this.rows;
		const value  = await row.value();

		const index = rows.indexOf(row);
		this.__value__[index] = value;

		await this.validate();
		await this.publishValue(chain);
	}
}

(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_4__.default)(List);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (List);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Message.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Message.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony exports ATTRIBUTE_ACTIVE, ATTRIBUTE_CONDITION, findParentBase */
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./node_modules/@default-js/defaultjs-html-form/src/Base.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _utils_DataHelper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/DataHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DataHelper.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");








const ATTRIBUTE_ACTIVE = "active";
const ATTRIBUTE_CONDITION = "condition";
const ATTRIBUTES = [ATTRIBUTE_ACTIVE, ATTRIBUTE_CONDITION];

const findParentBase = (message) => {
	let parent = message.parentNode;
	while (parent) {
		if (parent instanceof _Base__WEBPACK_IMPORTED_MODULE_1__.default) return parent;

		parent = parent.parentNode;
	}
	return null;
};

class Message extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_2__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_3__.NODENAMES.Message;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
		const ready = this.ready;		

		if (!ready.resolved) {			
			this.reference = findParentBase(this);
			this.form = this.parent(_Constants__WEBPACK_IMPORTED_MODULE_3__.NODENAMES.Form);
			this.form.on(_Constants__WEBPACK_IMPORTED_MODULE_3__.EVENTS.executeValidate, () => {
				this.update();
			});
		}
		this.update();
	}

	get active() {
		return this.hasAttribute(ATTRIBUTE_ACTIVE);
	}
	set active(active) {
		active ? this.attr(ATTRIBUTE_ACTIVE, "") : this.attr(ATTRIBUTE_ACTIVE, undefined);
	}

	get condition() {
		return this.attr(ATTRIBUTE_CONDITION);
	}

	async update() {
		await this.ready;
		const data = await (0,_utils_DataHelper__WEBPACK_IMPORTED_MODULE_5__.evaluationData)(this.reference);
		this.active = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolve(this.condition, data, false);
	}
}
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_6__.default)(Message);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (Message);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Page.js":
/*!******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Page.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _Container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Container */ "./node_modules/@default-js/defaultjs-html-form/src/Container.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTES = [_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_STEP];

class Page extends _Container__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(_Container__WEBPACK_IMPORTED_MODULE_1__.default.observedAttributes);
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Page;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
	}

	get step(){
		return this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_STEP);
	}
	
	conditionUpdated(){}
}
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(Page);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Page);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/ProgressBar.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/ProgressBar.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");
/* harmony import */ var _Step__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Step */ "./node_modules/@default-js/defaultjs-html-form/src/Step.js");





const ATTRIBUTES = [_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_PROGRESS];

const firstStepPageIndex = (pages, step, activePage) => {
	for (let page of pages) {
		if (page.step == step && page.condition) return page;
		else if (page == activePage) return;
	}

	return null;
};

class ProgressBar extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.ProgressBar;
	}

	constructor() {
		super();

		this.on("click", ({ target }) => {
			if (!this.form) return;
			if (target == this) return;

			const step = target.is(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Step) ? target : target.parent(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Step).first();

			if (!step) return;

			const state = this.form.state;
			const pages = this.form.pages;
			const activePageIndex = this.form.activePageIndex;
			const activePage = this.form.activePage;
			const stepName = step.name;
			if (state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.input || state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.summary) {
				const page = firstStepPageIndex(pages, stepName, activePage);
				if (page) this.form.activePage = page;
			}
		});
	}

	async init() {
		await super.init();
		const ready = this.ready;
		this.progress = 0;
		if (!ready.resolved) {
			this.form = this.parent(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Form);
			this.steps = this.find(_Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Step);
			this.form.on([_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.initialize, _Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.siteChanged, _Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.formStateChanged], () => {
				const state = this.form.state;
				const activePage = this.form.activePage;
				if (!activePage) return;

				const index = this.form.activePageIndex;
				const count = this.form.pages.length;
				const pageStep = activePage ? activePage.step : _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.init;
				const progress = Math.floor((index * 100) / count);

				for (let step of this.steps) {
					const name = step.name;
					if (state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.input) {
						step.active = name == pageStep;
						step.readonly = false;
					} else if (state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.summary) {
						step.active = name == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.summary;
						step.readonly = false;
					} else {
						step.active = name == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.finished;
						step.readonly = true;
					}
				}

				this.progress = state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.summary || state == _Constants__WEBPACK_IMPORTED_MODULE_0__.FORMSTATES.finished ? 100 : progress;

				this.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.progressbarChanged);
			});
		}
	}

	get progress() {
		return this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_PROGRESS);
	}

	set progress(progress) {
		if (this.style.setProperty) this.style.setProperty("--progress", progress + "%");
		this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_PROGRESS, Math.max(0, Math.min(progress, 100)));
	}
}

(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(ProgressBar);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (ProgressBar);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Step.js":
/*!******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Step.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_StateHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/StateHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/StateHelper.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTES = [_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_NAME, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE, _Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_READONLY];

class Step extends HTMLElement {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Step;
	}

	constructor() {
		super();
	}

    get name(){
        return this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_NAME);
    }
    
    get active() {
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE);
	}

	set active(active) {
		const current = this.active;
		if (current != active) {
			(0,_utils_StateHelper__WEBPACK_IMPORTED_MODULE_1__.updateActiveState)(this, active);
		}
	}

	get readonly() {
		return this.hasAttribute(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_READONLY);
	}

	set readonly(readonly) {
		readonly ? this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_READONLY, "") : this.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_READONLY, null);
	}
}

(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(Step);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (Step);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Validation.js":
/*!************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Validation.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports ATTRIBUTE_ACTIVE, ATTRIBUTE_CONDITION */
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTE_ACTIVE = "active";
const ATTRIBUTE_CONDITION = "condition";
const ATTRIBUTES = [ATTRIBUTE_ACTIVE, ATTRIBUTE_CONDITION];


class Validation extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.Validation;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
		this.active = false;
	}

	get active() {
		return this.hasAttribute(ATTRIBUTE_ACTIVE);
	}
	set active(active) {
		active ? this.attr(ATTRIBUTE_ACTIVE, "") : this.attr(ATTRIBUTE_ACTIVE, undefined);
	}

	get condition() {
		return this.attr(ATTRIBUTE_CONDITION);
	}
}
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(Validation);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Validation);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/Validator.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/Validator.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _Validation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Validation */ "./node_modules/@default-js/defaultjs-html-form/src/Validation.js");
/* harmony import */ var _utils_StateHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/StateHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/StateHelper.js");
/* harmony import */ var _utils_NodeHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/NodeHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/NodeHelper.js");
/* harmony import */ var _utils_DataHelper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/DataHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DataHelper.js");








const updateReadonly = async ({ data, valid, base, condition }) => {
	const { form } = base;
	if (form.state == _Constants__WEBPACK_IMPORTED_MODULE_1__.FORMSTATES.input) {
		if (!valid)
			base.readonly = false;
		else if (condition) {
			const test = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolve(condition, data, false);
			base.editable = test;
			return test;
		}
	}
	return valid;
}

class Validator {
	constructor(base) {
		this.inital = true;
		this.base = base;
		this.customChecks = [];
		this.validations = (0,_utils_NodeHelper__WEBPACK_IMPORTED_MODULE_4__.findValidations)(base) || [];
		this.condition = base.attr(_Constants__WEBPACK_IMPORTED_MODULE_1__.ATTRIBUTE_CONDITION);
		this.editableCondition = base.attr(_Constants__WEBPACK_IMPORTED_MODULE_1__.ATTRIBUTE_EDITABLE_CONDITION);

	}

	addCustomCheck(check) {
		this.customChecks.push(check);
	}

	get form() {
		return this.base.form;
	}

	async validate() {
		const { base, validations, customChecks, condition, editableCondition } = this;
		const { hasValue, required, requiredOnlyOnActive } = base;
		const hasChecks = customChecks.length > 0 || validations.length > 0;
		const data = await (0,_utils_DataHelper__WEBPACK_IMPORTED_MODULE_5__.evaluationData)(base);
		const initial = this.inital;
		this.inital = false;


		const conditionValid = condition ? await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolve(condition, data, false) : true;
		(0,_utils_StateHelper__WEBPACK_IMPORTED_MODULE_3__.updateConditionState)(base, conditionValid, this.inital);

		let valid = required ? hasValue : true;
		if (conditionValid) {
			if (valid)
				for (let check of customChecks) {
					const test = await check({ data, base });
					if (!test) valid = false;
				}

			for (let validation of validations) {
				if (valid && hasValue) {
					const test = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_0__.default.resolve(validation.condition, data, true);
					validation.active = !test;
					if (!test) valid = false;
				} else
					validation.active = false;
			}

			const editable = updateReadonly({ data, valid, base, condition: editableCondition });
			if(!editable)
				valid = true;
			(0,_utils_StateHelper__WEBPACK_IMPORTED_MODULE_3__.updateValidState)(base, valid, this.inital);
			
		}
		return valid;

	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Validator);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/controls/BackButton.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/controls/BackButton.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _FormButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FormButton */ "./node_modules/@default-js/defaultjs-html-form/src/FormButton.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTES = [];
class BackButton extends _FormButton__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}
	
	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.BackButton;
	}

	constructor() {
		super();
	}

	execute() {
		this.form.toPrevPage();
	}
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (BackButton);
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(BackButton);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/controls/NextButton.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/controls/NextButton.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _FormButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FormButton */ "./node_modules/@default-js/defaultjs-html-form/src/FormButton.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTES = [];
class NextButton extends _FormButton__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}
	
	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.NextButton;
	}

	constructor() {
		super();
	}

	execute() {
		this.form.toNextPage();
	}
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (NextButton);
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(NextButton);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/controls/SubmitButton.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/controls/SubmitButton.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _FormButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FormButton */ "./node_modules/@default-js/defaultjs-html-form/src/FormButton.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTES = [];
class SubmitButton extends _FormButton__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.SubmitButton;
	}

	constructor() {
		super();
	}
	execute() {
		this.form.submit();
	}
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (SubmitButton);
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(SubmitButton);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/controls/SummaryButton.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/controls/SummaryButton.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _FormButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FormButton */ "./node_modules/@default-js/defaultjs-html-form/src/FormButton.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTES = [];
class SummaryButton extends _FormButton__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.SummaryButton;
	}

	constructor() {
		super();
	}
	execute() {
		this.form.toNextPage();
	}
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (SummaryButton);
(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(SummaryButton);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/controls/index.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/controls/index.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _BackButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BackButton */ "./node_modules/@default-js/defaultjs-html-form/src/controls/BackButton.js");
/* harmony import */ var _NextButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NextButton */ "./node_modules/@default-js/defaultjs-html-form/src/controls/NextButton.js");
/* harmony import */ var _SummaryButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SummaryButton */ "./node_modules/@default-js/defaultjs-html-form/src/controls/SummaryButton.js");
/* harmony import */ var _SubmitButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SubmitButton */ "./node_modules/@default-js/defaultjs-html-form/src/controls/SubmitButton.js");








/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/list/AddRow.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/list/AddRow.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _FormButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FormButton */ "./node_modules/@default-js/defaultjs-html-form/src/FormButton.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTES = [];
class AddRow extends _FormButton__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(ATTRIBUTES);
	}

	static get NODENAME(){
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.ButtonAddRow;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
		this.active = true;
	}

	execute() {
		this.trigger(100, _Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.listRowAdd);
	}
}

(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(AddRow);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddRow);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/list/DeleteRow.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/list/DeleteRow.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _FormButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FormButton */ "./node_modules/@default-js/defaultjs-html-form/src/FormButton.js");
/* harmony import */ var _utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/DefineElement */ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js");




const ATTRIBUTES = [];

class DeleteRow extends _FormButton__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(ATTRIBUTES);
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.ButtonDeleteRow;
	}

	constructor() {
		super();
	}

	async init(){
		await super.init();
		this.active	= true;
	}

	execute() {
		this.trigger(100, _Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.listRowDelete);
	}
}

(0,_utils_DefineElement__WEBPACK_IMPORTED_MODULE_2__.default)(DeleteRow);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (DeleteRow);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/list/Row.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/list/Row.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _Container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Container */ "./node_modules/@default-js/defaultjs-html-form/src/Container.js");
/* harmony import */ var _DeleteRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DeleteRow */ "./node_modules/@default-js/defaultjs-html-form/src/list/DeleteRow.js");




const ATTRIBUTES = [];
class ListRow extends _Container__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(_Container__WEBPACK_IMPORTED_MODULE_1__.default.observedAttributes);
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.ListRow;
	}
	
	constructor() {
		super();
	}

	get active() {
		return true;
	}
	set active(active) {}

	get condition() {
		return true;
	}

	get name() {
		return null;
	}
}

customElements.define(ListRow.NODENAME, ListRow);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ListRow);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/list/Rows.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/list/Rows.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");



const ATTRIBUTES = [];
class ListRows extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_1__.default {
	static get observedAttributes() {
		return ATTRIBUTES.concat(ATTRIBUTES);
	}

	static get NODENAME() {
		return _Constants__WEBPACK_IMPORTED_MODULE_0__.NODENAMES.ListRows;
	}

	constructor() {
		super();
	}
}

customElements.define(ListRows.NODENAME, ListRows);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (ListRows);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/utils/DataHelper.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/utils/DataHelper.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "evaluationData": () => (/* binding */ evaluationData)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");



const evaluationData = async (base) => {
	const data = {};
	data[_Constants__WEBPACK_IMPORTED_MODULE_1__.SPECIALVARS.CURRENTVALUE] = await base.value();

	let row = base.parent(_Constants__WEBPACK_IMPORTED_MODULE_1__.NODENAMES.ListRow);
	let temp = data;
	while (row) {
		temp[_Constants__WEBPACK_IMPORTED_MODULE_1__.SPECIALVARS.CURRENTLISTROW] = await row.value();
		temp = temp[_Constants__WEBPACK_IMPORTED_MODULE_1__.SPECIALVARS.CURRENTLISTROW];
		row = row.parent(_Constants__WEBPACK_IMPORTED_MODULE_1__.NODENAMES.ListRow);
	}

	return _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.default.merge( data, await base.form.data());
}

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/utils/DefineElement.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((Node) => {
    if(!window.customElements.get(Node.NODENAME))
        window.customElements.define(Node.NODENAME, Node);
});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toTimeoutHandle": () => (/* binding */ toTimeoutHandle)
/* harmony export */ });
/* unused harmony exports toEvents, makeEventCopy */
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");


const toEvents = function() {
    return Array.from(arguments).join(" ");
};

const makeEventCopy = (event) => {
    return {
        type: event.type,
        target: event.target,
        detail: event.detail,
        currentTarget: event.currentTarget,
        explicitOriginalTarget: event.explicitOriginalTarget,
        originalTarget : event.originalTarget,
        srcElement: event.srcElement,
        timeStamp: event.timeStamp
    };
}

const toTimeoutHandle = (handle, preventDefault, stopPropagation, timeout) => {
    let id = null;

    const prevent = typeof preventDefault === "function" ? preventDefault : () => preventDefault;
    const stop = typeof stopPropagation === "function" ? stopPropagation : () => stopPropagation;

    return (event) => {
        if(prevent(event))
            event.preventDefault();
        if(stop(event))
            event.stopPropagation();

        const eventCopy = makeEventCopy(event);

        if(id)
            clearTimeout(id);
                    
        id = setTimeout(() => {
            id = null;
            handle(eventCopy);
        }, timeout || _Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTHANDLE_TIMEOUT);

    }
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/utils/NodeHelper.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/utils/NodeHelper.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "treeFilter": () => (/* binding */ treeFilter),
/* harmony export */   "findFields": () => (/* binding */ findFields),
/* harmony export */   "findValidations": () => (/* binding */ findValidations)
/* harmony export */ });
/* harmony import */ var _BaseField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseField */ "./node_modules/@default-js/defaultjs-html-form/src/BaseField.js");
/* harmony import */ var _Validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Validation */ "./node_modules/@default-js/defaultjs-html-form/src/Validation.js");



const treeFilter = ({ root, filter }) => {
	let elements = [];
	root.children.forEach((element) => {
		const { accept, stop = false } = filter(element);

		if (accept) elements.push(element);

		if (!stop) {
			const result = treeFilter({ root: element, filter });
			if (result instanceof Array) elements = elements.concat(result);
			else if (result) elements.push(result);
		}
	});

	return elements;
};

const findFields = (root) => {
	return treeFilter({
		root,
		filter: (element) => {
			if (element instanceof _BaseField__WEBPACK_IMPORTED_MODULE_0__.default) return { accept: true, stop: true };
			return { accept: false };
		},
	});
};

const findValidations = (root) => {
	return treeFilter({
		root,
		filter: (element) => {
			if (root != element) {
				if (element instanceof _BaseField__WEBPACK_IMPORTED_MODULE_0__.default) return { accept: false, stop: true };
				else if (element instanceof _Validation__WEBPACK_IMPORTED_MODULE_1__.default) return { accept: true, stop: true };
			}
			return { accept: false };
		},
	});
};


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/utils/StateHelper.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/utils/StateHelper.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "updateValidState": () => (/* binding */ updateValidState),
/* harmony export */   "updateConditionState": () => (/* binding */ updateConditionState),
/* harmony export */   "updateActiveState": () => (/* binding */ updateActiveState),
/* harmony export */   "updateEditableState": () => (/* binding */ updateEditableState)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");


const updateValidState = (target, valid, initial = false) => {
	const oldState = target.valid;
	if (typeof valid === "undefined" || valid == null) {
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_INVALID, null);
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_VALID, null);
	} else if (valid) {
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_INVALID, null);
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_VALID, "");
	} else {
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_INVALID, "");
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_VALID, null);
	}

	if (oldState != valid || initial){ 
		target.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.validStateChanged);
	}
};

const updateConditionState = (target, valid, initial = false) => {
	
	const oldState = target.condition;
	if (valid) {
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_CONDITION_INVALID, null);
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_CONDITION_VALID, "");
	} else {
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_CONDITION_VALID, null);
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_CONDITION_INVALID, "");
	}
	if (oldState != valid || initial) {		
		target.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.conditionStateChanged);
	}
};

const updateActiveState = (target, active, initial = false) => {
	const oldState = target.active;
	active ? target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE, "") : target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_ACTIVE, null);
	if (oldState != active || initial) target.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.activeStateChanged);
};

const updateEditableState = (target, editable, initial = false) => {
	const oldState = target.editable;
	if (editable) {
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_EDITABLE, "");
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_READONLY, null);
	} else {
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_EDITABLE, null);
		target.attr(_Constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_READONLY, "");
	}
	if (oldState != editable || initial) target.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.editableStateChanged);
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Checkbox.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/wrapper/Checkbox.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Checkbox)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _Wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Wrapper */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Wrapper.js");




const INPUTSELECTOR = 'input[type="checkbox"]';


class Checkbox extends _Wrapper__WEBPACK_IMPORTED_MODULE_2__.default {
	static findInput(field) {
		const input = field.find(INPUTSELECTOR);
		if (input.length == 0)
			return null;
			
		return input.length == 1 ? input.first() : input;
	}

	constructor(field, input) {
		super(field, input);
	}

	init() {
		const { field, input } = this;
		this.multiple = input instanceof NodeList;
		input.on(
			"input",
			(0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__.toTimeoutHandle)(
				() => {
					field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.normalizeValue(this.value));
				},
				false,
				true,
				_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTHANDLE_INPUT_TIMEOUT
			)
		);

		field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.normalizeValue(this.value));
	}

	set readonly(readonly) {
		this.input.attr("disabled", readonly ? "" : null);
	}

	get value() {
		const value = this.input.val();
		if (!(value instanceof Map)) return value;
		if (value.size == 0) return null;

		const values = [];
		value.forEach((value) => {
			values.push(value);
		});

		return values;
	}

	normalizeValue(value) {
		if (value) {
			if (this.multiple) {
				value = value.filter((item) => !!item);
				return value.length != 0 ? value : null;
			} else {
				return value;
			}
		}

		return null;
	}

	acceptValue(value) {
		if (value == null || typeof value === "undefined")
			return true;
		else if (this.multiple)
			return value instanceof Array;
		else{
			const type = typeof value;
			return type === "string" || type === "boolean";
		}
	}

	updatedValue(value) {
		if (this.field.value != this.value)
			this.input.val(value ? value : null);
	}
}


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/File.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/wrapper/File.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ File)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _Wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Wrapper */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Wrapper.js");




const INPUTSELECTOR = 'input[type="file"]';

const readFile = (file, readFnName) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("loadend", () => {
			resolve({
				name: file.name,
				type: file.type,
				size: file.size,
				data: reader.result
			});
		}, false);
		reader[readFnName](file);
	});
};

//readAsDataURL

const FORMAT = {
	"form-input": async (file) => {
		file.format = "form-input";
		return file;
	},
	"data-url-base64": async (file) => {
		const result = await readFile(file, "readAsDataURL");
		result.format = "data-url-base64";
		return result;
	},
	"base64": async (file) => {
		const result = await readFile(file, "readAsDataURL");
		result.data = result.data.substr(result.data.indexOf(",") + 1);
		result.format = "base64";
		return result;
	}
};

const readFiles = async (files, format, multiple) => {
	let result = [];
	for (let file of files)
		result.push(await FORMAT[format](file));

	if (result.length == 0)
		return null;


	return multiple ? result : result[0];
};



class File extends _Wrapper__WEBPACK_IMPORTED_MODULE_2__.default {
	static findInput(field) {
		return field.find(INPUTSELECTOR).first();
	}

	constructor(field, input) {
		super(field, input);
	}

	async init() {
		const { field, input } = this;
		this.multiple = input.multiple;
		this.format = field.attr("file-format") || "form-input";
		this.filenameTarget = field.attr("file-name-target");
		this.filenameTarget = this.filenameTarget ? field.find(this.filenameTarget).first() : null;
		const { format, multiple } = this;

		input.on(
			"input",
			(0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__.toTimeoutHandle)(
				async () => {
					this.updatedValue(await readFiles(input.files, format, multiple));
					field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.value);
				},
				false,
				true
			)
		);

		if (input.files && input.files.length != 0)
			this.updatedValue(await readFiles(input.files, format, multiple));

		field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.value);
	};

	set readonly(readonly) {
		this.input.attr("disabled", readonly ? "" : null);
	}



	acceptValue(value) {
		if (value == null || typeof value === "undefined")
			return true;
		else if (this.multiple)
			return value instanceof Array;
		else
			return value instanceof "object";
	}

	normalizeValue(value) {
		if (value == null || typeof value === "undefined")
			return null;
		else if (this.multiple)
			return value.length != 0 ? value : null;
		else
			return value;
	}

	updatedValue(value) {
		if (value != this.__value__) {
			this.__value__ = value;

			if (this.filenameTarget && value) {
				if (this.multiple) {
					for (let file of value) {
						this.filenameTarget.append(`<span>${file.name}</span>`);
					}
				}
				else {
					this.filenameTarget.append(`<span>${value.name}</span>`);
				}
			}

		}
	}

	set readonly(readonly) {
		this.input.attr("disabled", readonly ? "" : null);
	}

	get value() {
		return this.__value__;
	}

	get valid() {
		return this.input.checkValidity();
	}
}


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Radio.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/wrapper/Radio.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Radio)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _Wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Wrapper */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Wrapper.js");




const INPUTSELECTOR = 'input[type="radio"]';

const getRandomInt = () => {
	return Math.floor(Math.random() * Date.now());
};

const init = (wrapper) => {
	const { field } = wrapper;
	const name = field.name + getRandomInt();
	const input = (wrapper.input = field.find(INPUTSELECTOR));
	for (let radio of input) radio.name = name;
	input.on(
		"change",
		(0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__.toTimeoutHandle)(
			() => {
				field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.changeValue);
			}
		)
	);
};

class Radio extends _Wrapper__WEBPACK_IMPORTED_MODULE_2__.default {
	static findInput(field) {
		const input = field.find(INPUTSELECTOR);
		if (input.length == 0)
			return null;

		return input;
	}

	constructor(field, input) {
		super(field, input);
	}

	init() {
		const { field, input } = this;
		const name = field.name + getRandomInt();
		for (let radio of input) radio.name = name;
		input.on(
			"input",
			(0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__.toTimeoutHandle)(
				() => {
					field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.normalizeValue(this.value));
				},
				false,
				true,
				_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTHANDLE_INPUT_TIMEOUT
			)
		);

		field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.normalizeValue(this.value));
	}


	set readonly(readonly) {
		this.input.attr("disabled", readonly ? "" : null);
	}

	get value() {
		const value = this.input.val();
		if (!(value instanceof Map)) return value;
		if (value.size == 0) return null;
		return value.values().next().value;
	}

	normalizeValue(value) {
		if (value)
			return value;

		return null;
	}

	acceptValue(value) {
		if (value == null || typeof value === "undefined")
			return true;
		else{
			const type = typeof value;
			return type === "string" || type === "boolean";
		}
	}

	updatedValue(value) {
		if (this.field.value != this.value)
			this.input.val(value ? value : null);
	}
}


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Select.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/wrapper/Select.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Text)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _Wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Wrapper */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Wrapper.js");




const INPUTSELECTOR = 'select';

class Text extends _Wrapper__WEBPACK_IMPORTED_MODULE_2__.default {
	static findInput(field) {
		return field.find(INPUTSELECTOR).first();
	}

	constructor(field, input) {
		super(field, input);
	}

	init() {
		const { field, input } = this;
		input.on(
			"input, changed",
			(0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_1__.toTimeoutHandle)(
				() => {
					field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.value);
				},
				false,
				true,
				_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTHANDLE_INPUT_TIMEOUT
			)
		);

		field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.value);
	}

	set readonly(readonly) {
		this.input.attr("disabled", readonly ? "" : null);
	}

	get value() {
		return this.normalizeValue(this.input.multiple ? this.input.val() : this.input.value);
	}
	
	normalizeValue(value) {
		if (value) {
			if(this.input.multiple){
				value = value.filter((item) => item && item.trim().length > 0);
				return value.length != 0 ? value : null;
			} else{
				value = value.trim();
				return value.length != 0 ? value : null;	
			}				
		}
		
		return null;
	}

	acceptValue(value) {
		if (value == null || typeof value === "undefined")
			return true;
		else if (this.input.multiple)
			return value instanceof Array;
		else
			return typeof value === "string";
	}

	updatedValue(value) {
		if (this.field.value != this.value)
			this.input.val(value ? value : null);
	}
}


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Text.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/wrapper/Text.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Text)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./node_modules/@default-js/defaultjs-html-form/src/Constants.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ValueHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ValueHelper */ "./node_modules/@default-js/defaultjs-common-utils/src/ValueHelper.js");
/* harmony import */ var _utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-form/src/utils/EventHelper.js");
/* harmony import */ var _Wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Wrapper */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Wrapper.js");





const INPUTSELECTOR = 'input:not([type="file"]):not([type="radio"]):not([type="checkbox"]) ,input:not([type]), textarea';

const DEFAULTTYPE = "text";

const text = {
	accept: (value) => {
		return typeof value === "string";
	},
	value: (input) => {
		return input.value;
	},
	normalize: (value) => {
		if (value) {
			value = value.trim();
			return value.length > 0 ? value : null;
		}

		return null;
	},
};
const number = {
	accept: (value) => {
		return typeof value === "number";
	},
	value: (input) => {
		return input.valueAsNumber;
	},
	normalize: (value) => {
		if (!(0,_default_js_defaultjs_common_utils_src_ValueHelper__WEBPACK_IMPORTED_MODULE_1__.noValue)(value) && !Number.isNaN(value)) return value;

		return null;
	},
};
const date = {
	accept: (value) => {
		return value instanceof Date;
	},
	value: (input) => {
		return input.valueAsDate;
	},
	normalize: (value) => {
		if (value) return value;

		return null;
	},
};
const TYPES = { text, number, date, time: date };

class Text extends _Wrapper__WEBPACK_IMPORTED_MODULE_3__.default {
	static findInput(field) {
		return field.find(INPUTSELECTOR).first();
	}

	constructor(field, input) {
		super(field, input);
	}

	init() {
		const { field, input } = this;
		const type = (field.attr("input-type") || input.attr("type") || DEFAULTTYPE).trim().toLowerCase();
		this.type = TYPES[type] || TYPES[DEFAULTTYPE];
		input.on(
			"input",
			(0,_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__.toTimeoutHandle)(
				() => {
					field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.normalizeValue(this.value));
				},
				false,
				true,
			),
		);

		field.trigger(_Constants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.input, this.normalizeValue(this.value));
	}

	acceptValue(value) {
		if (value == null || typeof value === "undefined") return true;

		return this.type.accept(value);
	}

	normalizeValue(value) {
		if (value == null && typeof value === "undefined") return null;

		return this.type.normalize(value);
	}
	async updatedValue(value) {
		if (value != this.input.value)
			this.input.val(value ? value : null);
	}

	set readonly(readonly) {
		this.input.attr("disabled", readonly ? "" : null);
	}

	get value() {
		return this.type.value(this.input);
	}

	get valid() {
		return this.input.checkValidity();
	}
}


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Wrapper.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/wrapper/Wrapper.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Wrapper)
/* harmony export */ });
/* harmony import */ var _Field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Field */ "./node_modules/@default-js/defaultjs-html-form/src/Field.js");


class Wrapper {
	
	static findInput(field){ return null;}
	
	constructor(field, input) {
		this.field = field;
		this.input = input;
		this.init();
	}

	init() { }

	set readonly(disabled) { }

	async acceptValue(value) {
		return true;
	}

	async normalizeValue(value) {
		return value;
	}

	async updatedValue() {
	}
	
	get value(){
		return null;
	}
	
	get valid(){
		return true;
	}
}


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/index.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-form/src/wrapper/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findWrapper": () => (/* binding */ findWrapper)
/* harmony export */ });
/* unused harmony export wrappers */
/* harmony import */ var _Text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Text */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Text.js");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Checkbox */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Checkbox.js");
/* harmony import */ var _Radio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Radio */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Radio.js");
/* harmony import */ var _File__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./File */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/File.js");
/* harmony import */ var _Select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Select */ "./node_modules/@default-js/defaultjs-html-form/src/wrapper/Select.js");






const wrappers = [_Text__WEBPACK_IMPORTED_MODULE_0__.default, _Checkbox__WEBPACK_IMPORTED_MODULE_1__.default, _Radio__WEBPACK_IMPORTED_MODULE_2__.default, _File__WEBPACK_IMPORTED_MODULE_3__.default, _Select__WEBPACK_IMPORTED_MODULE_4__.default];

const findWrapper = (field) => {
	for (let wrapper of wrappers) {
		const input = wrapper.findInput(field);
		if (input) return new wrapper(field, input);
	}

	return null;
};


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-jsondata/browser-bundle.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-jsondata/browser-bundle.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _src_HTMLJsonDataElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/HTMLJsonDataElement */ "./node_modules/@default-js/defaultjs-html-jsondata/src/HTMLJsonDataElement.js");



_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLJsonDataElement = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLJsonDataElement || _src_HTMLJsonDataElement__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-jsondata/src/HTMLJsonDataElement.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-jsondata/src/HTMLJsonDataElement.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PrivateProperty */ "./node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/DefineComponentHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/DefineComponentHelper.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");




const NODENAME = (0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.toNodeName)("json-data");
const PRIVATE__OBSERVER = "observer";
const PRIVATE__JSON = "json";

class HTMLJsonDataElement extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_2__.default {
	static get NODENAME() {
		return NODENAME;
	}

	constructor() {
		super();
		this.style.display = "none !important";
		const observer = new MutationObserver(() => {
			this.reinit();
		});
		observer.observe(this, { childList: true, characterData: true });
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE__OBSERVER, observer);
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE__JSON, null);
	}

	async init() {}
	async reinit() {
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE__JSON, null);
	}

	get json() {
		return (async () => {
			await this.ready;
			let json = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE__JSON);
			if (!json) {
				json = JSON.parse(this.textContent.trim());
				(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE__JSON, json);
			}

			return json;
		})();
	}
}

(0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.define)(HTMLJsonDataElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTMLJsonDataElement);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-pagination/browser-bundle.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-pagination/browser-bundle.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _src_HTMLPaginationElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/HTMLPaginationElement */ "./node_modules/@default-js/defaultjs-html-pagination/src/HTMLPaginationElement.js");



_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLPaginationElement = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLPaginationElement || _src_HTMLPaginationElement__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-pagination/src/HTMLPaginationElement.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-pagination/src/HTMLPaginationElement.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PrivateProperty */ "./node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/DefineComponentHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/DefineComponentHelper.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/EventHelper.js");
/* harmony import */ var _default_js_defaultjs_template_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @default-js/defaultjs-template-language */ "./node_modules/@default-js/defaultjs-template-language/index.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_TemplateHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/TemplateHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/TemplateHelper.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");







const NODENAME = (0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.toNodeName)("pagination");

const TEMPLATE = _default_js_defaultjs_template_language__WEBPACK_IMPORTED_MODULE_3__.Template.load(
	`
<nav class="pagination" jstl-if="\${pages.length > 1}">
	<ul>
		<li class="pagination-first \${page == 1 ? 'disabled' : ''}" ?data-page="\${page != 1}" data-page="1">first</li>
		<li class="pagination-back \${page == 1 ? 'disabled' : ''}" ?data-page="\${page != 1}" data-page="\${page - 1}">prev</li>

		<jstl jstl-foreach="\${pages}">
			<li class="pagination-page \${page == item ? 'active' : ''}" ?data-page="\${page != item}" data-page="\${item}">\${item}</li>
		</jstl>

		<li class="pagination-next \${page >= count ? 'disabled' : ''}" ?data-page="\${count > page}" data-page="\${page + 1}">next</li>
		<li class="pagination-last \${page >= count ? 'disabled' : ''}" ?data-page="\${count > page}" data-page="\${count}">last</li>
	</ul>
</nav>
`,
	false,
);

const toData = (page, count, size) => {
	const pages = [];
	const meridian = Math.floor(size / 2);
	let start = 1;
	let end = size;
	if (size > count) end = count;
	else if (page + meridian > count) {
		end = count;
		start = end - size + 1;
	} else if (page - meridian > 1) {
		end = page + meridian;
		start = end - size + 1;
	}
	for (let i = start; i <= end; i++) pages.push(i);

	return { start, end, pages, page, count, size };
};

const ATTR_PAGE = "page";
const ATTR_COUNT = "count";
const ATTR_SIZE = "size";
const ATTR_DISABLED_SHADOW_DOM = "disabled-shadow-dom";
const ATTR_DATA_PAGE = "data-page";
const ATTRIBUTES = [ATTR_PAGE, ATTR_COUNT, ATTR_SIZE, _default_js_defaultjs_html_components_src_utils_TemplateHelper__WEBPACK_IMPORTED_MODULE_4__.ATTR_TEMPLATE];

const EVENT__TO_PAGE = (0,_default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__.componentEventname)("to-page", NODENAME);
const EVENT__CHANGE = (0,_default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__.componentEventname)("change", NODENAME);

const PRIVATE__RENDERER = "renderer";

class HTMLPaginationElement extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_5__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return NODENAME;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
		if (!this.ready.resolved) {
			const defaultTemplate = await TEMPLATE;
			const template = await (0,_default_js_defaultjs_html_components_src_utils_TemplateHelper__WEBPACK_IMPORTED_MODULE_4__.loadTemplate)(this, defaultTemplate);
			if (!this.disabledShadowDom && template != defaultTemplate)
				this.attachShadow({ mode: "open" });
			this.root.on("click", (event) => {
				const { target } = event;
				let page = Number.NaN;
				page = parseInt(target.attr(ATTR_DATA_PAGE));
				if (Number.isNaN(page)) {
					const parent = target.parent("[" + ATTR_DATA_PAGE + "]");
					if (parent) page = parseInt(parent.attr(ATTR_DATA_PAGE));
				}
				if (!Number.isNaN(page)) {
					this.trigger(EVENT__TO_PAGE, page);
					event.preventDefault();
					event.stopPropagation();
				}
			});

			(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE__RENDERER, new _default_js_defaultjs_template_language__WEBPACK_IMPORTED_MODULE_3__.Renderer({ template }));

			this.on(EVENT__CHANGE, () => {
				this.render();
			});
		}
		this.render();
	}

	get page() {
		return parseInt(this.attr(ATTR_PAGE) || "1");
	}
	set page(page) {
		this.attr(ATTR_PAGE, page);
	}

	get count() {
		return parseInt(this.attr(ATTR_COUNT) || "0");
	}
	set count(count) {
		this.attr(ATTR_COUNT, count);
	}

	get size() {
		return parseInt(this.attr(ATTR_SIZE) || "10");
	}
	set size(size) {
		this.attr(ATTR_SIZE, size);
	}

	get disabledShadowDom() {
		return this.hasAttribute(ATTR_DISABLED_SHADOW_DOM);
	}

	async render() {
		const renderer = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_0__.privateProperty)(this, PRIVATE__RENDERER);
		renderer.render({ data: toData(this.page, this.count, this.size), container: this.root });
	}
}

(0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.define)(HTMLPaginationElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTMLPaginationElement);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-renderer/browser-bundle.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-renderer/browser-bundle.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _src_HTMLRendererElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/HTMLRendererElement */ "./node_modules/@default-js/defaultjs-html-renderer/src/HTMLRendererElement.js");



_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLRendererElement = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLRendererElement || _src_HTMLRendererElement__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-renderer/src/HTMLRendererElement.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-renderer/src/HTMLRendererElement.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/DefineComponentHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/DefineComponentHelper.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/EventHelper.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PrivateProperty */ "./node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js");
/* harmony import */ var _default_js_defaultjs_template_language_src_Renderer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @default-js/defaultjs-template-language/src/Renderer */ "./node_modules/@default-js/defaultjs-template-language/src/Renderer.js");
/* harmony import */ var _default_js_defaultjs_template_language_src_Template__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @default-js/defaultjs-template-language/src/Template */ "./node_modules/@default-js/defaultjs-template-language/src/Template.js");
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");









const NODENAME = (0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.toNodeName)("renderer");
const NODENAME_JSONDATA = (0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.toNodeName)("json-data").toUpperCase();
const NODENAME_REQUEST = (0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.toNodeName)("request").toUpperCase();

const EVENT_RENDERED = (0,_default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__.componentEventname)("rendered", NODENAME);

const ATTRIBUTE_TEMPLATE = "template";
const ATTRIBUTE_DATA = "data";
const ATTRIBUTE_RENDER_MODE = "render-mode"; //append, prepend, replace, self-replace
const ATTRIBUTE_SHADOWMODE = "shadowmode"; //

const ATTRIBUTE_CONDITION = "condition"; // if condtion true, than render (context???)
const ATTRIBUTE_INITRUN = "initial-run"; // default: true
const ATTRIBUTE_LISTEN_EVENT = "listen-event";
const ATTRIBUTE_LISTEN_ELEMENT = "listen-element"; //default body
const ATTRIBUTE_TRIGGER_EVENT = "trigger-event"; // trigger event on render finished

const ATTRIBUTES = [ATTRIBUTE_TEMPLATE, ATTRIBUTE_DATA, ATTRIBUTE_RENDER_MODE];

const PRIVATE_TEMPLATE = "template";
const PRIVATE_LISTENER = "listener";
const PRIVATE_DATA = "data";
const PRIVATE_RENDER_TIMEOUT = "renderTimeout";

const findElement = (element, selector) => {
	try {
		return find(selector).first();
	} catch (e) {}
};

const loadTemplate = async (element) => {
	const value = element.attr(ATTRIBUTE_TEMPLATE);
	let template = null;
	if (value) {
		template = findElement(element, value);
		if (template instanceof HTMLTemplateElement) return await _default_js_defaultjs_template_language_src_Template__WEBPACK_IMPORTED_MODULE_6__.default.load(template, false);
		else template = await _default_js_defaultjs_template_language_src_Template__WEBPACK_IMPORTED_MODULE_6__.default.load(new URL(value, location));
	} else if (element.childNodes && element.childNodes.length > 0) template = await _default_js_defaultjs_template_language_src_Template__WEBPACK_IMPORTED_MODULE_6__.default.load(element.childNodes, false);

	return template;
};

const callRender = (element) => {
	const timeout = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(element, PRIVATE_RENDER_TIMEOUT);
	if (timeout) clearTimeout(timeout);

	(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(
		element,
		PRIVATE_RENDER_TIMEOUT,
		setTimeout(() => {
			(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(element, PRIVATE_RENDER_TIMEOUT, null);
			element.render();
		}, 100),
	);
};

const getListenElements = (renderer) => {
	const selector = renderer.attr(ATTRIBUTE_LISTEN_ELEMENT);
	if (selector) {
		const results = find(selector);
		if (results && results.length > 0) return results;
	}

	return document.body;
};

const addEventObserving = (renderer) => {
	const events = renderer.attr(ATTRIBUTE_LISTEN_EVENT);
	const element = getListenElements(renderer);

	const listener = (event) => {
		renderer.render({ event });
	};

	(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(renderer, PRIVATE_LISTENER, listener);

	element.on(events, listener);
};

const removeEventObserving = (renderer) => {
	const listender = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(renderer, PRIVATE_LISTENER);
	if (listender) {
		const element = getListenElements(renderer);
		element.removeEventListener(listener);
	}
};

const triggerEvent = (renderer, content) => {
	const events = renderer.attr(ATTRIBUTE_TRIGGER_EVENT);
	if (events) content.trigger(events);
	content.trigger(EVENT_RENDERED);
};

const mergeData = (data1, data2) => {
	return Object.assign({}, data1 ? data1 : null, data2 ? data2 : null);
};

class JSTLRendererElement extends _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_0__.default {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return NODENAME;
	}

	constructor() {
		super();
		if (this.hasAttribute(ATTRIBUTE_SHADOWMODE)) this.attachShadow({ mode: open });
	}

	get root() {
		return this.shadowRoot || this;
	}

	async init() {
		await super.init();

		if (!this.ready.resolved) {
			(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(this, PRIVATE_TEMPLATE, await loadTemplate(this));

			if (this.hasAttribute(ATTRIBUTE_LISTEN_EVENT)) addEventObserving(this);
			if (this.attr(ATTRIBUTE_INITRUN) != "false") await this.render();
		}
	}

	async getTemplate() {
		return (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(this, PRIVATE_TEMPLATE);
	}

	async setTemplate(template) {
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(this, PRIVATE_TEMPLATE, await _default_js_defaultjs_template_language_src_Template__WEBPACK_IMPORTED_MODULE_6__.default.load(template));
	}

	async getData() {
		const privateData = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(this, PRIVATE_DATA);
		if (privateData) return privateData;

		const value = this.attr(ATTRIBUTE_DATA);
		let data = null;
		if (value) {
			data = findElement(this, value);
			if (data) {
				if (data.nodeName == NODENAME_JSONDATA) data = data.json;
				else if (data.nodeName == NODENAME_REQUEST) {
					data = await data.execute({});
					data = data.json();
				} else if (data instanceof HTMLElement) {
					data = data.textContent;
					if (data && data.trim().length > 0) data = JSON.parse(data);
				}
			} else {
				data = await fetch(new URL(value, location).toString());
				data = await data.json();
			}
		}

		return data;
	}

	async setData(data) {
		await this.ready;
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_4__.privateProperty)(this, PRIVATE_DATA, data);
	}

	async render({ template, data, event } = {}) {
		const container = this.root;

		let context = mergeData(data, event);

		const condition = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_7__.default.resolve(this.attr(ATTRIBUTE_CONDITION) || "true", context, false);
		if (!condition) return;

		if (template) template = await _default_js_defaultjs_template_language_src_Template__WEBPACK_IMPORTED_MODULE_6__.default.load(template);
		else template = await this.getTemplate(this);
		if (!template) return;

		if (!data) data = await this.getData(this);
		if (!data) data = {};

		context = mergeData(context, data);

		let replace = false;
		let mode = this.attr(ATTRIBUTE_RENDER_MODE);
		if (mode == "self-replace") {
			replace = true;
			mode = "replace";
		}

		await _default_js_defaultjs_template_language_src_Renderer__WEBPACK_IMPORTED_MODULE_5__.default.render({ template, data: context, container, mode });

		if (replace) {
			removeEventObserving(this);

			const content = container.content();
			if (content) {
				this.replace(content);
				triggerEvent(this, content);
			} else {
				triggerEvent(this, this.parent());
				this.remove();
			}
		} else triggerEvent(this, this);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue != newValue && this.isConnected) {
			if (name == ATTRIBUTE_TEMPLATE) loadTemplate(this);
			callRender(this);
		}
	}
}

(0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.define)(JSTLRendererElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JSTLRendererElement);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-request/browser-bundle.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-request/browser-bundle.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _src_HTMLRequestElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/HTMLRequestElement */ "./node_modules/@default-js/defaultjs-html-request/src/HTMLRequestElement.js");



_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLRequestElement = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLRequestElement || _src_HTMLRequestElement__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-request/src/HTMLRequestElement.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-request/src/HTMLRequestElement.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/DefineComponentHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/DefineComponentHelper.js");
/* harmony import */ var _default_js_defaultjs_html_jsondata_src_HTMLJsonDataElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-jsondata/src/HTMLJsonDataElement */ "./node_modules/@default-js/defaultjs-html-jsondata/src/HTMLJsonDataElement.js");
/* harmony import */ var _default_js_defaultjs_dynamic_requester__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-dynamic-requester */ "./node_modules/@default-js/defaultjs-dynamic-requester/index.js");





const NODENAME = (0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_0__.toNodeName)("request");
class HTMLRequestElement extends _default_js_defaultjs_html_jsondata_src_HTMLJsonDataElement__WEBPACK_IMPORTED_MODULE_1__.default {
	
	static get NODENAME() { return NODENAME; }
	
	constructor() {
		super();
		this.style.display = "none !important";
	}

	async reinit() {
		delete this.__json__;
		delete this.__requester__;
	}

	get request() {
		return this.json;
	}

	get requester() {
		if (this.__requester__)
			this.__requester__ = new _default_js_defaultjs_dynamic_requester__WEBPACK_IMPORTED_MODULE_2__.Requester(this.request);

		return this.__requester__;
	}

	async execute(context) {
		return this.requester.execute({ context });
	}

}

(0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_0__.define)(HTMLRequestElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTMLRequestElement);


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-typeahead/browser-bundle.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-typeahead/browser-bundle.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global */ "./node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _src_HTMLTypeaheadElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/HTMLTypeaheadElement */ "./node_modules/@default-js/defaultjs-html-typeahead/src/HTMLTypeaheadElement.js");



_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html || {};
_default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLTypeaheadElement = _default_js_defaultjs_common_utils_src_Global__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.html.HTMLTypeaheadElement || _src_HTMLTypeaheadElement__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-html-typeahead/src/HTMLTypeaheadElement.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-html-typeahead/src/HTMLTypeaheadElement.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/Component */ "./node_modules/@default-js/defaultjs-html-components/src/Component.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/DefineComponentHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/DefineComponentHelper.js");
/* harmony import */ var _default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-html-components/src/utils/EventHelper */ "./node_modules/@default-js/defaultjs-html-components/src/utils/EventHelper.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PrivateProperty */ "./node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js");
/* harmony import */ var _default_js_defaultjs_template_language_src_Renderer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @default-js/defaultjs-template-language/src/Renderer */ "./node_modules/@default-js/defaultjs-template-language/src/Renderer.js");
/* harmony import */ var _default_js_defaultjs_template_language_src_Template__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @default-js/defaultjs-template-language/src/Template */ "./node_modules/@default-js/defaultjs-template-language/src/Template.js");
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_PromiseUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PromiseUtils */ "./node_modules/@default-js/defaultjs-common-utils/src/PromiseUtils.js");
/* harmony import */ var _default_js_defaultjs_html_request_src_HTMLRequestElement__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @default-js/defaultjs-html-request/src/HTMLRequestElement */ "./node_modules/@default-js/defaultjs-html-request/src/HTMLRequestElement.js");










const NODENAME = (0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.toNodeName)("typeahead");
const PRIVATE_READY = "ready";
const PRIVATE_SUGGESTION_BOX = "suggestionBox";
const PRIVATE_REQUEST = "request";


const DEFAULT_TEMPLATE = _default_js_defaultjs_template_language_src_Template__WEBPACK_IMPORTED_MODULE_5__.default.load(
	`<jstl jstl-foreach="\${suggestions}" jstl-foreach-var="suggestion">
	<option value="\${suggestion.value}">\${suggestion.text}</option>
</jstl>`, false);

const EVENT_LOAD_SUGGESTION = (0,_default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__.componentEventname)("load-suggestion", NODENAME);
const EVENT_SHOW_SUGGESTION = (0,_default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__.componentEventname)("show-suggestion", NODENAME);
const EVENT_SELECTED_SUGGESTION = (0,_default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__.componentEventname)("selected-suggestion", NODENAME);
const TIMEOUT_INTERVAL = 100;


const ATTRIBUTE_SELF_HANDLE_SELECTION = "self-handle-selection";
const ATTRIBUTE_REQUEST = "request";
const ATTRIBUTE_RESPONSE_SUGGESTIONS = "response-suggestions";
const ATTRIBUTE_SUGGESTION_VALUE = "suggestion-value";
const ATTRIBUTE_SUGGESTION_TEXT = "suggestion-text";
const ATTRIBUTES = [];



const initSuggestionBox = (input) => {
	const id = (0,_default_js_defaultjs_html_components_src_Component__WEBPACK_IMPORTED_MODULE_0__.createUID)("id-", "");
	const box = create(`<datalist id="${id}"></datalist>`).first();

	box.on("click", console.log);

	input.after(box);
	input.attr("list", id)

	return box;
};

const getSuggestionBox = (input) => {
	let suggestionBox = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(input, PRIVATE_SUGGESTION_BOX);
	if (!suggestionBox) {

		suggestionBox = initSuggestionBox(input);
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(input, PRIVATE_SUGGESTION_BOX, suggestionBox);
	}

	return suggestionBox;
};

const initInputHandle = (input) => {
	let inputTimeout = null;
	input.on("input focus", (event) => {
		if (inputTimeout)
			clearTimeout(inputTimeout);

		if (event.inputType == "insertReplacementText") {
			if (input.selfHandleSelection) {
				event.preventDefault();
				event.stopPropagation();

				input.trigger(EVENT_SELECTED_SUGGESTION, event.data)
			}

			return;
		}

		const value = input.value;
		inputTimeout = setTimeout(async () => {
			if (value == input.value)
				input.trigger(EVENT_LOAD_SUGGESTION, value);
		}, TIMEOUT_INTERVAL);
	});
};

const initHandleSuggestions = (input) => {
	let showTimeout = null;
	input.on(EVENT_SHOW_SUGGESTION, (event) => {
		if (showTimeout)
			clearTimeout(showTimeout);

		const data = event.detail;
		showTimeout = setTimeout(async () => {
			input.suggestions(data);
		}, TIMEOUT_INTERVAL);
	});
};


const getRequestElement = (selector) => {
	try {
		let request = find(selector).first();
		if (request instanceof _default_js_defaultjs_html_request_src_HTMLRequestElement__WEBPACK_IMPORTED_MODULE_8__.default)
			return request;
	} catch (e) {
		//ignore
	}

	return null;
};

const getRequest = (input) => {
	let request = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(input, PRIVATE_REQUEST);
	if (!request) {
		const value = input.attr(ATTRIBUTE_REQUEST);
		request = getRequestElement(value) || value;
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(input, PRIVATE_REQUEST, request);
	}

	return request;
};

const executeRequest = async (input, value) => {
	let request = getRequest(input);
	const context = { value, input };

	if (request instanceof _default_js_defaultjs_html_request_src_HTMLRequestElement__WEBPACK_IMPORTED_MODULE_8__.default)
		return request.execute(context);
	else if (typeof request === "string") {
		request = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_6__.default.resolveText(request, context);
		const url = new URL(request, location);

		return fetch(url.toString());
	}
};

const handleResponse = async (input, response) => {

	if (input.hasAttribute(ATTRIBUTE_RESPONSE_SUGGESTIONS))
		response = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_6__.default.resolve(input.attr(ATTRIBUTE_RESPONSE_SUGGESTIONS), response, []);

	const textSelector = input.attr(ATTRIBUTE_SUGGESTION_TEXT) || "text";
	const valueSelector = input.attr(ATTRIBUTE_SUGGESTION_VALUE) || "value";

	const result = [];
	for (let item of response) {

		const type = typeof item;
		let text = null;
		let value = null;

		if (type === "string" || type === "number")
			value = text = item;
		else {
			text = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_6__.default.resolveText(textSelector, item, null);
			value = await _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_6__.default.resolveText(valueSelector, item, null);
		}
		
		result.push({
			text: text ? text : value,
			value: value ? value : text
		})
	}

	input.trigger(EVENT_SHOW_SUGGESTION, result);
};

const initHandleRequest = (input) => {
	input.on(EVENT_LOAD_SUGGESTION, (event) => {
		event.stopPropagation();

		const value = event.detail;
		(async () => {
			let response = await executeRequest(input, value);
			response = await response.json();
			response = await handleResponse(input, response);
		})();
	});
};

class HTMLTypeaheadElement extends HTMLInputElement {
	static get observedAttributes() {
		return ATTRIBUTES;
	}

	static get NODENAME() {
		return NODENAME;
	}

	constructor() {
		super();
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(this, PRIVATE_READY, (0,_default_js_defaultjs_common_utils_src_PromiseUtils__WEBPACK_IMPORTED_MODULE_7__.lazyPromise)());
		initInputHandle(this);
		initHandleSuggestions(this);

	}

	get selfHandleSelection() {
		return this.hasAttribute(ATTRIBUTE_SELF_HANDLE_SELECTION);
	}

	set selfHandleSelection(value) {
		if (value)
			this.attr(ATTRIBUTE_SELF_HANDLE_SELECTION, "");
		else
			this.attr(ATTRIBUTE_SELF_HANDLE_SELECTION, null);
	}

	get ready() {
		return (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(this, PRIVATE_READY);
	}

	async init() {
		if (this.hasAttribute(ATTRIBUTE_REQUEST)) {
			initHandleRequest(this);
		}
	}

	async suggestions(suggestions) {
		await this.ready;		
		const suggestionBox = getSuggestionBox(this);
		if (suggestions) {
			await _default_js_defaultjs_template_language_src_Renderer__WEBPACK_IMPORTED_MODULE_4__.default.render({
				container: suggestionBox,
				template: await DEFAULT_TEMPLATE,
				data: { suggestions }

			})
		}
	}

	async destroy() {
		if (this.ready.resolved) {
			(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(this, PRIVATE_READY, (0,_default_js_defaultjs_common_utils_src_PromiseUtils__WEBPACK_IMPORTED_MODULE_7__.lazyPromise)());
			(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(this, PRIVATE_SUGGESTION_BOX, null);
			(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_3__.privateProperty)(this, PRIVATE_REQUEST, null);
		}
	}

	connectedCallback() {
		if (this.ownerDocument == document) (async () => {
			await this.init(this);
			this.ready.resolve();
		})();
	}

	adoptedCallback() {
		this.connectedCallback();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue != newValue && this.isConnected) {
			this.trigger(triggerTimeout, attributeChangeEventname(name, this));
			this.trigger(triggerTimeout, (0,_default_js_defaultjs_html_components_src_utils_EventHelper__WEBPACK_IMPORTED_MODULE_2__.componentEventname)("change", this));
		}
	}

	disconnectedCallback() {
		this.destroy();
	}
};

(0,_default_js_defaultjs_html_components_src_utils_DefineComponentHelper__WEBPACK_IMPORTED_MODULE_1__.define)(HTMLTypeaheadElement, { extends: "input" })

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTMLTypeaheadElement);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-ical/browser-index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-ical/browser-index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src */ "./node_modules/@default-js/defaultjs-ical/src/index.js");


const global = window || global || self || undefined || {};
global.defaultjs = global.defaultjs || {};
global.defaultjs.ical = global.defaultjs.ical || {
	VERSION : "${version}",
	Parser : _src__WEBPACK_IMPORTED_MODULE_0__.default.Parser,
	ICalendar : _src__WEBPACK_IMPORTED_MODULE_0__.default.ICalendar
};

if(typeof global.fetch === "function" 
	&& typeof global.Response !== "undefined" 
	&& typeof global.Response.prototype !== "undefined" 
	&& typeof global.Response.prototype.ical === "undefined"){
	global.Response.prototype.ical = function(aConfig){
		return this.text()
		.then(function(aText){
			return _src__WEBPACK_IMPORTED_MODULE_0__.default.ICalendar.parse(aText, aConfig);
		});
	}
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-ical/node_modules/@default-js/defaultjs-common-utils/src/Escaper.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-ical/node_modules/@default-js/defaultjs-common-utils/src/Escaper.js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// required to build the internal escape filter for regex
const REGEXCHARMAP = ["\\","?","[", "]", "{", "}", "(", ")", ".", "^", "$"]
	.map(char => { 
		return {f: new RegExp("\\" +char, "g"), v : "\\" + char};
	});


const mapping = (aText, theFilters) => {
	let text = aText;
	theFilters.forEach(item => {
		text = text.replace(item.f, item.v);
	});
	return text;
};

const buildUnescapeList = (aCharMap, isCaseSensitiv) => {
	const option = isCaseSensitiv ? "mg" : "mgi"; 
	return aCharMap.map(item => {
		if(!item.at || item.at == "unescape")
			return {f: new RegExp(mapping(item.escaped, REGEXCHARMAP), option), v: item.char}
	}).filter(item => !!item);
};

const buildEscapeList = (aCharMap, isCaseSensitiv) => {
	const option = isCaseSensitiv ? "mg" : "mgi"; 
	return aCharMap.map(item => {
		if(!item.at || item.at == "escape")
			return {f: new RegExp(mapping(item.char,REGEXCHARMAP), option), v: item.escaped}
	}).filter(item => !!item);
};
class Escaper {
	constructor(escapeMap, isCaseSensitiv){
		this.escapeMap = buildEscapeList(escapeMap, isCaseSensitiv)
		this.unescapeMap = buildUnescapeList(escapeMap, isCaseSensitiv)
	}
	
	escape(aText){
		return mapping(aText, this.escapeMap);
	}
	
	unescape(aText){
		return mapping(aText, this.unescapeMap);
	}
	
	static REGEXP_ESCAPER(){
		return new Escaper([
			{char: "\\", escaped : "\\\\"},
			{char: "?", escaped : "\\?"},
			{char: "[", escaped : "\\["},
			{char: "]", escaped : "\\]"},
			{char: "{", escaped : "\\{"},
			{char: "}", escaped : "\\}"},
			{char: "(", escaped : "\\("},
			{char: ")", escaped : "\\)"},
			{char: ".", escaped : "\\."},
			{char: "^", escaped : "\\^"},
			{char: "$", escaped : "\\$"}
		]);
	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Escaper);



/***/ }),

/***/ "./node_modules/@default-js/defaultjs-ical/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-ical/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

/**
 * append a propery value to an object. If propery exists its would be converted to an array
 * 
 *  @param aKey:string name of property
 *  @param aData:any property value
 *  @param aObject:object the object to append the property
 *  
 *  @return returns the changed object
 */
const append = function(aKey, aData, aObject){
	if(typeof aData !== "undefined"){		
		const key = aKey.toLowerCase().trim();	
		if(typeof aObject[key] === "undefined")
			aObject[key] = aData;
		else{		
			const data = aObject[key];
			if(data instanceof Array)
				data.push(aData);
			else
				aObject[key] = [aObject[key], aData];
		}
	}	
	return aObject;
};

/**
 * checked if an object a simple object. No Array, Map or something else.
 * 
 * @param aObject:object the object to be testing
 * 
 * @return boolean
 */
const isPojo = function(aObject){
	return typeof aObject !== "undefined" && aObject != null && aObject.constructor.name === "Object"
}

/**
 * merging object into a target object. Its only merge simple object and sub objects. Every other 
 * value would be replaced by value from the source object.
 * 
 * sample: merge(target, source-1, source-2, ...source-n)
 * 
 * @param aTarget:object the target object to merging into
 * @param aSources:object
 * 
 * @return object returns the target object
 */
const merge = function(aTarget){	
	for(let i = 1; i < arguments.length; i++){
		const source = arguments[i];
		Object.getOwnPropertyNames(source).forEach(aKey => {
			if(isPojo(aTarget[aKey]))
				merge(aTarget[aKey], source[aKey]);
			else
				aTarget[aKey] = source[aKey];
		});
	}
	
	return aTarget;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	isPojo : isPojo,
	append: append,
	merge : merge
});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-ical/src/Deserializer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-ical/src/Deserializer.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_Escaper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Escaper */ "./node_modules/@default-js/defaultjs-ical/node_modules/@default-js/defaultjs-common-utils/src/Escaper.js");


//const REGEX_KEY = /^([^\s:;]+)(;([^:]+))?:(.+)$/;
const REGEX_VALUELINE = /^\s(.+)$/;

const KEY_VALUE_SPLIT = /:/;
const PARAM_SPLIT = /;/;
const PARAM_VALUE_SPLIT = /=/;

const ESCAPER = new _default_js_defaultjs_common_utils_src_Escaper__WEBPACK_IMPORTED_MODULE_0__.default([
	{char: ",", escaped:"\\,"},
	{char: ";", escaped:"\\;"},
	{char: ":", escaped:"\\:"},
]);


const getParameter = function(aText){
	if(aText == null || typeof aText === "undefined")
		return;
	const items = aText.split(PARAM_SPLIT);
	const params = {};
	items.forEach(item => {
		const parts = item.split(PARAM_VALUE_SPLIT);
		params[parts[0].toLowerCase()] = parts[1];
	})
	
	return params;
};

const getValue = function(aValue, aTokenizer){
	let value = aValue;
	let match = REGEX_VALUELINE.exec(aTokenizer.lines()[aTokenizer.index() + 1]);
	while(match != null && typeof match !== "undefined" && match.length > 0){		
		value += match[1];
		aTokenizer.skip();
		match = REGEX_VALUELINE.exec(aTokenizer.lines()[aTokenizer.index() + 1]);
	}
	
	return ESCAPER.unescape(value);
};


const Deserializer = function(aLine, aTokenizer){
	let index = aLine.search(KEY_VALUE_SPLIT);
	if(index == -1)
		return;
	
	const result = {
			key : aLine.substring(0, index),
			value : getValue(aLine.substring(index + 1), aTokenizer)
	};
	
	index = result.key.search(PARAM_SPLIT);
	if(index != -1){
		result.parameter = getParameter(result.key.substring(index + 1));
		result.key = result.key.substring(0, index);
	}
		
	
	return result
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Deserializer);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-ical/src/ICalendar.js":
/*!******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-ical/src/ICalendar.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Parser */ "./node_modules/@default-js/defaultjs-ical/src/Parser.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils */ "./node_modules/@default-js/defaultjs-ical/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");




const DATETIME = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/;
const toDateTime = aToken => {
	const match = DATETIME.exec(aToken.value);
	if(!match)
		return aToken.value;
	return new Date(parseInt(match[1])
			,parseInt(match[2])
			,parseInt(match[3])
			,parseInt(match[4])
			,parseInt(match[5])
			,parseInt(match[6]));
};

const defaultconfig = {
	onlyPropertyValues: true,
	propertyparser : {
		organizer : aToken => {
			return {
				name : /([^"]+)/i.exec(aToken.parameter["cn"])[1],
				mail : /^(mailto:)?(.+)$/i.exec(aToken.value)[2]		
			};
		},
		dtstart : toDateTime,
		dtend : toDateTime
	}
};

const buildConfig = function(aConfig){
	if(typeof aConfig === "undefined" || aConfig == null)
		return defaultconfig;
	
	return _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.default.merge({}, defaultconfig, aConfig);
};



const Parser = {
	parse : (aText, aConfig) => {
		return (0,_Parser__WEBPACK_IMPORTED_MODULE_0__.default)(aText, buildConfig(aConfig));
	}
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Parser);



/***/ }),

/***/ "./node_modules/@default-js/defaultjs-ical/src/Parser.js":
/*!***************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-ical/src/Parser.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Tokenizer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tokenizer */ "./node_modules/@default-js/defaultjs-ical/src/Tokenizer.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils */ "./node_modules/@default-js/defaultjs-ical/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");



const BEGIN_TOKEN = /^begin$/i;
const END_TOKEN = /^end$/i;

const parseProperty = function(aToken, aConfig){
	try{
		const key = aToken.key.toLowerCase();
		if(typeof aConfig.propertyparser !== "undefined" && typeof aConfig.propertyparser[key] === "function"){
			const result = aConfig.propertyparser[key](aToken);
			if(typeof result !== "undefined")
				return result instanceof Promise ? result : Promise.resolve(result);
		}
	}catch (e){
		console.error(e)
	}
	
	if(aConfig.onlyPropertyValues)
		return  Promise.resolve(aToken.value);	
	else	
		return Promise.resolve({
			"_type_" : "property",
			"parameter" : aToken.parameter,
			"value" : aToken.value
		});
};

const parseToken = function(aToken, aTokenizer, aConfig, aContext){	
	if(END_TOKEN.test(aToken.key))
		return Promise.resolve(aContext);
	else if(BEGIN_TOKEN.test(aToken.key))
		return parse(aTokenizer, aConfig, {})
		.then(result => {
			if(typeof aContext === "undefined")
				return Promise.resolve(result);
			
			const context = _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.default.append(aToken.value.toLowerCase(), result, aContext);
			return parse(aTokenizer, aConfig, context);
		});
	 else {
		return parseProperty(aToken, aConfig)
		.then(value => _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.default.append(aToken.key.toLowerCase(), value, aContext))
		.then(context => parse(aTokenizer, aConfig, context));
	}
};

const parse = function(aTokenizer, aConfig, aContext){
	return aTokenizer.next()
	.then(aToken => {
		if(aToken)
			return parseToken(aToken, aTokenizer, aConfig, aContext);
			
		return Promise.resolve(aContext);
	});
};


const Parser = function(aText, aConfig){
	return parse(new _Tokenizer__WEBPACK_IMPORTED_MODULE_0__.default(aText), (aConfig || {}))
		.then(aResult => {
			if(typeof aConfig.map === "function")
				return Promise.resolve(aConfig.map(aResult));
			
			return Promise.resolve(aResult);
		});
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Parser);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-ical/src/Tokenizer.js":
/*!******************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-ical/src/Tokenizer.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Deserializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Deserializer */ "./node_modules/@default-js/defaultjs-ical/src/Deserializer.js");


const Tokenizer = function(theLines, aIndex){
	const lines = theLines;
	let index = aIndex || -1;
	let token = null;
	return {
		reset : function(){
			index = -1;
		},
		skip : function(length){
			index += (length || 1);
		},
		index : function(){
			return index;
		},
		token : function(){
			return match;
		},
		lines : function(){
			return lines;
		},
		next : function(){			
			index++;
			if(index < lines.length)
				token = (0,_Deserializer__WEBPACK_IMPORTED_MODULE_0__.default)(lines[index], this);
			else
				token = null;
			
			return Promise.resolve(token);
		},
		clone : function(){
			return new Tokenizer(lines, index);
		}
	};	
};
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(aText){
	return new Tokenizer(aText.split(/\r?\n/g).filter(line => line.trim().length > 0))
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-ical/src/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-ical/src/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Parser */ "./node_modules/@default-js/defaultjs-ical/src/Parser.js");
/* harmony import */ var _ICalendar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ICalendar */ "./node_modules/@default-js/defaultjs-ical/src/ICalendar.js");



const pack = {
	Parser : _Parser__WEBPACK_IMPORTED_MODULE_0__.default,
	ICalendar : _ICalendar__WEBPACK_IMPORTED_MODULE_1__.default
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pack);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/browser.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/browser.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _default_js_defaultjs_common_utils_src_Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/Global.js */ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/Global.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./node_modules/@default-js/defaultjs-template-language/index.js");



_default_js_defaultjs_common_utils_src_Global_js__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs = _default_js_defaultjs_common_utils_src_Global_js__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs || {};
_default_js_defaultjs_common_utils_src_Global_js__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.jstl = _default_js_defaultjs_common_utils_src_Global_js__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.tl = _default_js_defaultjs_common_utils_src_Global_js__WEBPACK_IMPORTED_MODULE_0__.default.defaultjs.tl || {
	VERSION : "${version}",
	Template: _index_js__WEBPACK_IMPORTED_MODULE_1__.Template,
	Renderer: _index_js__WEBPACK_IMPORTED_MODULE_1__.Renderer
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Template": () => (/* reexport safe */ _src_Template_js__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "Renderer": () => (/* reexport safe */ _src_Renderer_js__WEBPACK_IMPORTED_MODULE_1__.default)
/* harmony export */ });
/* harmony import */ var _src_Template_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/Template.js */ "./node_modules/@default-js/defaultjs-template-language/src/Template.js");
/* harmony import */ var _src_Renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/Renderer.js */ "./node_modules/@default-js/defaultjs-template-language/src/Renderer.js");





/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/Global.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/Global.js ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const GLOBAL = (() => {
	if(typeof __webpack_require__.g !== "undefined") return __webpack_require__.g;
	if(typeof window !== "undefined") return window;	
	if(typeof self !== "undefined") return self;
	return {};
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GLOBAL);

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js ***!
  \************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectProperty)
/* harmony export */ });
class ObjectProperty {
	constructor(key, context){
		this.key = key;
		this.context = context;
	}
	
	get keyDefined(){
		return this.key in this.context; 
	}
	
	get hasValue(){
		return !!this.context[this.key];
	}
	
	get value(){
		return this.context[this.key];
	}
	
	set value(data){
		this.context[this.key] = data;
	}
	
	set append(data) {
		if(!this.hasValue)
			this.value = data;
		else {
			const value = this.value;
			if(value instanceof Array)
				value.push(data);
			else
				this.value = [this.value, data];
		}
	}
	
	remove(){
		delete this.context[this.key];
	}
	
	static load(data, key, create=true) {
		let context = data;
		const keys = key.split("\.");
		let name = keys.shift().trim();
		while(keys.length > 0){
			if(!context[name]){
				if(!create)
					return null;
				
				context[name] = {}
			}
			
			context = context[name];
			name = keys.shift().trim();
		}
		
		return new ObjectProperty(name, context);
	}
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js ***!
  \*********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defValue": () => (/* binding */ defValue),
/* harmony export */   "defGet": () => (/* binding */ defGet)
/* harmony export */ });
/* unused harmony exports append, isPojo, merge, filter, defGetSet */
/* harmony import */ var _ObjectProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectProperty.js */ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectProperty.js");

/**
 * append a propery value to an object. If propery exists its would be converted to an array
 *
 *  @param aKey:string name of property
 *  @param aData:any property value
 *  @param aObject:object the object to append the property
 *
 *  @return returns the changed object
 */
const append = function (aKey, aData, aObject) {
	if (typeof aData !== "undefined") {
		const property = _ObjectProperty_js__WEBPACK_IMPORTED_MODULE_0__.default.load(aObject, aKey, true);
		property.append = aData;
	}
	return aObject;
};

/**
 * checked if an object a simple object. No Array, Map or something else.
 *
 * @param aObject:object the object to be testing
 *
 * @return boolean
 */
const isPojo = function (aObject) {
	return typeof aObject !== "undefined" && aObject != null && aObject.constructor.name === "Object";
};

/**
 * merging object into a target object. Its only merge simple object and sub objects. Every other
 * value would be replaced by value from the source object.
 *
 * sample: merge(target, source-1, source-2, ...source-n)
 *
 * @param aTarget:object the target object to merging into
 * @param aSources:object
 *
 * @return object returns the target object
 */
const merge = function (aTarget) {
	for (let i = 1; i < arguments.length; i++) {
		const source = arguments[i];
		Object.getOwnPropertyNames(source).forEach((aKey) => {
			if (isPojo(aTarget[aKey])) merge(aTarget[aKey], source[aKey]);
			else aTarget[aKey] = source[aKey];
		});
	}

	return aTarget;
};

const buildPropertyFilter = function ({ names, allowed }) {
	return (name, value, context) => {
		return names.includes(name) === allowed;
	};
};

const filter = function () {
	const [data, propFilter, { deep = false, recursive = true, parents = [] } = {}] = arguments;
	const result = {};

	for (let name in data) {
		const value = data[name];
		const accept = propFilter(name, value, data);
		if (accept && (!deep || value === null || value === undefined)) result[name] = value;
		else if (accept && deep) {
			const type = typeof value;
			if (type !== "object" || value instanceof Array || value instanceof Map || value instanceof Set || value instanceof RegExp || parents.includes[value] || value == data) result[name] = value;
			else result[name] = filter(value, propFilter, { deep, recursive, parents: parents.concat(data) });
		}
	}

	return result;
};

const defValue = (o, name, value) => {
	Object.defineProperty(o, name, {
		value,
		writable: false,
		configurable: false,
		enumerable: false
	});
};
const defGet = (o, name, get) => {
	Object.defineProperty(o, name, {
		get,
		configurable: false,
		enumerable: false
	});
};

const defGetSet = (o, name, get, set) => {
	Object.defineProperty(o, name, {
		get,
		set,
		configurable: false,
		enumerable: false
	});
};

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
	isPojo,
	append,
	merge,
	filter,
	buildPropertyFilter,
	defValue,
	defGet,
	defGetSet
});


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "privateProperty": () => (/* binding */ privateProperty)
/* harmony export */ });
const PRIVATE_PROPERTIES = new WeakMap();
const privateStore = (obj) => {
	if(PRIVATE_PROPERTIES.has(obj))
		return PRIVATE_PROPERTIES.get(obj);
	
	const data = {};
	PRIVATE_PROPERTIES.set(obj, data);
	return data;
};

const privateProperty = function(obj, name, value) {
	const data = privateStore(obj);
	if(arguments.length === 1)
		return data;
	else if(arguments.length === 2)
		return data[name];
	else if(arguments.length === 3)
		data[name] = value;
	else
		throw new Error("Not allowed size of arguments!");
};

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({privateProperty});

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/PromiseUtils.js":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/PromiseUtils.js ***!
  \**********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "lazyPromise": () => (/* binding */ lazyPromise)
/* harmony export */ });
/* unused harmony export timeoutPromise */
/* harmony import */ var _ObjectUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectUtils */ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");


const timeoutPromise = (fn, ms) =>{
	let canceled = false;
	let timeout = null;
	const promise = new Promise((r, e) => {
		timeout = setTimeout(()=> {
			timeout = null;
			fn(r,e);
		}, ms)
	});

	const then = promise.then;
	promise.then = (fn) => {
		then.call(promise, (result) => {
			if(!undefined.canceled)
				return fn(result);
		});
	}

	;(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defValue)(promise, "cancel", () => {
		if(timeout){
			clearTimeout(timeout);
			canceled = true;
		}
	});
	(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defGet)(promise, canceld, () => canceled);

	return promise;
}


const lazyPromise = () => {
		let promiseResolve = null;
		let promiseError = null;

		const promise = new Promise((r, e) => {
			promiseResolve = r;
			promiseError = e;
		});

		let resolved = false;
		let error = false;
		let value = undefined;

		(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defValue)(promise, "resolve", (result) => {
			value = result;
			resolved = true;
			if (value instanceof Error) {
				error = true;
				promiseError(value);
			} else promiseResolve(value);
		});

		(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defGet)(promise, "value", () => value);
		(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defGet)(promise, "error", () => error);
		(0,_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.defGet)(promise, "resolved", () => resolved);

		return promise;
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
	lazyPromise,
	timeoutPromise
});


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/javascript/String.js":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/javascript/String.js ***!
  \***************************************************************************************************************************************/
/***/ (() => {

if (!String.prototype.hashcode)
	String.prototype.hashcode = function() {
		if (this.length === 0)
			return 0;
		
		let hash = 0;
		const length = this.length;
		for (let i = 0; i < length; i++) {
			const c = this.charCodeAt(i);
			hash = ((hash << 5) - hash) + c;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/Context.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/Context.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Context)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_PromiseUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PromiseUtils */ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/PromiseUtils.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/ObjectUtils */ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/ObjectUtils.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/PrivateProperty */ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/PrivateProperty.js");
/* harmony import */ var _Directive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Directive */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");
/* harmony import */ var _Template__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Template */ "./node_modules/@default-js/defaultjs-template-language/src/Template.js");






const PRIVATE_WAIT = "wait";
const PRIVATE_CALLBACKS = "callbacks";
const PRIVATE_IGNOREDIRECTIVES = "ignoreDirectives";

const CONTEXTCLONE = new Set();
const CONTEXTS = new Map();
const WARNTIME = 1000;
const CRITICALTIME = 10000;

let observerTimeout = null;
const observe = (context) => {
	CONTEXTS.set(context, Date.now());
	runObserver();
};
const runObserver = () => {
	if (observerTimeout == null) {
		observerTimeout = setTimeout(() => {
			observerTimeout = null;
			const time = Date.now();
			CONTEXTS.forEach((createTime, context) => {
				const delta = time - createTime;
				if (context.closed) CONTEXTS.delete(context);
				else {
					if (delta > CRITICALTIME) {
						console.error("context lives longer then 10s", delta / 1000, context);
					} else if (delta > WARNTIME) {
						console.warn("context lives longer then 1s", delta / 1000, context);
					}
				}
			});
			console.log("open context:", CONTEXTS.size);
			if (CONTEXTS.size > 0) runObserver();
		}, 1000);
	}
};

const toTemplate = (template) => {
	if (template instanceof _Template__WEBPACK_IMPORTED_MODULE_4__.default) return template.importContent();
	else if (typeof template === String) return create(template);
	return template;
};

let id = 0;
class Context {
	constructor({ resolver, renderer, template, container, root, mode = "replace", target = null, parent = null, ignoreDirective }) {
		if (!resolver) throw new Error('Parameter "resolver" is required!');
		if (!renderer) throw new Error('Parameter "renderer" is required!');
		if (!template) throw new Error('Parameter "template" is required!');
		if (!container) throw new Error('Parameter "container" is required!');
		if (!root) throw new Error('Parameter "root" is required!');

		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.defValue)(this, "id", parent ? `${parent.id}->${id++}` : `root::${id++}`);
		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.defValue)(this, "depth", parent ? parent.depth + 1 : 0);
		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.defValue)(this, "parent", parent);
		//defValue(this, "resolver", resolver);
		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.defValue)(this, "renderer", renderer);
		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.defValue)(this, "root", root);
		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.defValue)(this, "template", toTemplate(template));
		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.defValue)(this, "mode", mode);
		(0,_default_js_defaultjs_common_utils_src_ObjectUtils__WEBPACK_IMPORTED_MODULE_1__.defValue)(this, "subcontexts", new Set());
		const wait = (0,_default_js_defaultjs_common_utils_src_PromiseUtils__WEBPACK_IMPORTED_MODULE_0__.lazyPromise)();
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__.privateProperty)(this, PRIVATE_IGNOREDIRECTIVES, ignoreDirective instanceof Set ? ignoreDirective : new Set());
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__.privateProperty)(this, PRIVATE_WAIT, wait);
		(0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__.privateProperty)(this, PRIVATE_CALLBACKS, []);

		this.content = null;
		this.container = container;
		this.target = target;
		this.resolver = resolver;

		/* execution flags */
		this.stop = false;
		this.ignore = false;
		//console.log(`context={"depth":${this.depth} }, "id": ${this.id}`);
		//this.createtAt = new Error();

		if (parent) {
			parent.subcontexts.add(this);
		}
	}

	get closed() {
		return (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__.privateProperty)(this, PRIVATE_WAIT).resolved;
	}

	ignoreDirective(directive) {
		const ignoreDirectives = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__.privateProperty)(this, PRIVATE_IGNOREDIRECTIVES);
		directive instanceof _Directive__WEBPACK_IMPORTED_MODULE_3__.default ? ignoreDirectives.add(directive.name) : ignoreDirectives.add(directive);
	}

	acceptDirective(directive) {
		const ignoreDirectives = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__.privateProperty)(this, PRIVATE_IGNOREDIRECTIVES);
		if (directive instanceof _Directive__WEBPACK_IMPORTED_MODULE_3__.default) return !(ignoreDirectives.has(directive.name) || ignoreDirectives.has(directive));

		return !ignoreDirectives.has(directive);
	}

	finished(callback) {
		if (this.parent) this.parent.finished(callback);
		else this.ready(callback);
	}

	async ready(callback) {
		const callbacks = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__.privateProperty)(this, PRIVATE_CALLBACKS);
		if (callback) {
			if (callback instanceof Array) callback.forEach((callback) => this.wait.then(callback));
			else if (callback instanceof Promise) callbacks.push(async () => await callback);
			else if (typeof callback === "function") callbacks.push(callback);
		} else {
			const wait = (0,_default_js_defaultjs_common_utils_src_PrivateProperty__WEBPACK_IMPORTED_MODULE_2__.privateProperty)(this, PRIVATE_WAIT);
			if (!wait.resolved) {
				if (!this.ignore) for (let callback of callbacks) await callback(this);

				for (let child of this.subcontexts) await child.ready();

				if (this.parent) this.parent.subcontexts.delete(this);

				wait.resolve(this);
			}

			return wait;
		}
	}

	subContext({ resolver = this.resolver, renderer = this.renderer, template = this.template, container = this.container, root = this.root, mode = this.mode, target = this.target, ignoreDirective = null } = {}) {
		return new Context({ resolver, renderer, template, container, mode, root, target, parent: this, ignoreDirective });
	}

	clone({ resolver = this.resolver, renderer = this.renderer, template = this.template, container = this.container, root = this.root, mode = this.mode, target = this.target, ignoreDirective = null } = {}) {
		return new Context({ resolver, renderer, template, container, mode, root, target, parent: null, ignoreDirective });
	}

	toRenderOption({ resolver = this.resolver, renderer = this.renderer, template = this.template, container = this.container, root = this.root, mode = this.mode, target = this.target, ignoreDirective = null } = {}) {
		return { resolver, renderer, template, container, mode, root, target, parent: null, ignoreDirective };
	}
}


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/Directive.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Directive)
/* harmony export */ });
const DEFINED_DIRECTIVES = [];

const defineDirective = ({ directive }) => {
	if (!(directive instanceof Directive))
		throw new Error("Implementation dosn't extend Directive class!");

	if (directive.rank < Directive.MIN_RANK)
		throw new Error("The rank of a directive can't be lower as " + Directive.MIN_RANK + "!");

	if (directive.rank > Directive.MAX_RANK)
		throw new Error("The rank of a directive can't be grater as " + Directive.MAX_RANK + "!");

	DEFINED_DIRECTIVES.push(directive);
	DEFINED_DIRECTIVES.sort((a, b) => {
		const phase = a.phase - b.phase;
		if(phase == 0)
			return a.rank - b.rank;
			
		return phase;
	});
};

const PHASE = {
	init: 0,
	data: 1,
	template: 2,
	content: 3,
	finish: 4
};

class Directive {

	static get PHASE() { return PHASE };
	static get MIN_RANK() { return 0 };
	static get MAX_RANK() { return 100000 };

	constructor() { };

	get name() { }
	get rank() { }
	get phase() {return PHASE.finish}

	/**
	 * need to be implemented
	 * 
	 * return DirectiveResult
	 */
	async execute(context) {
		return context;
	}


	static define(option) {
		defineDirective(option);
	}

	static get directives() {
		return DEFINED_DIRECTIVES;
	}
};

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/Element.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/Element.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DirectiveElement)
/* harmony export */ });
class DirectiveElement extends HTMLElement{
	constructor(){
		super();
		this.hidden = true;
	}
	
	/**
	 * need to be implemented
	 * 
	 */
	async execute({template, context}){
		context.content = template.cloneNode(true);
		return context;
	};	
}

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/Renderer.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/Renderer.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Renderer)
/* harmony export */ });
/* unused harmony export SCOPES */
/* harmony import */ var _default_js_defaultjs_extdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-extdom */ "./node_modules/@default-js/defaultjs-extdom/index.js");
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver.js */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");
/* harmony import */ var _Template_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Template.js */ "./node_modules/@default-js/defaultjs-template-language/src/Template.js");
/* harmony import */ var _Context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Context.js */ "./node_modules/@default-js/defaultjs-template-language/src/Context.js");
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");
/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Element.js */ "./node_modules/@default-js/defaultjs-template-language/src/Element.js");
/* harmony import */ var _directives__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./directives */ "./node_modules/@default-js/defaultjs-template-language/src/directives/index.js");
/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./elements */ "./node_modules/@default-js/defaultjs-template-language/src/elements/index.js");









const SCOPES = {
	application: "application",
	data: "data",
	render: "render",
	container: "container",
	node: "node",
	directive: "directive",
};

const APPLICATION_SCOPE_RESOLVER = new _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__.default({ name: SCOPES.application });

const MODEWORKER = {
	replace: async ({ container, target = null, content }) => {
		if (target) {
			target.replace(content);
		} else {
			container.empty();
			container.append(content);
		}
	},
	append: async ({ container, target = null, content }) => {
		if (target) target.after(content);
		else container.append(content);
	},
	prepend: async ({ container, target = null, content }) => {
		if (target) target.before(content);
		else container.prepend(content);
	},
};

const loadTemplateContent = async (template, renderer) => {
	if (template) {
		template = await _Template_js__WEBPACK_IMPORTED_MODULE_2__.default.load(template);
		return template.importContent();
	} else if (renderer.template) {
		return await renderer.template.importContent();
	}

	throw new Error("No content template specified!");
};

const addContent = async (context) => {
	if (context.content) {
		const modeworker = MODEWORKER[context.mode];
		if (!modeworker) throw new Error('The "' + context.mode + '" is not supported!');
		await modeworker(context);
	}
};

const renderContainer = async (context) => {
	let { template, resolver } = context;
	if (!template || template.length == 0) return context;

	let content = [];
	for (let nodeTemplate of template) {
		nodeTemplate.normalize();
		const nodeResolver = new _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__.default({ name: SCOPES.node, context: null, parent: resolver });
		const nodeContext = await renderNode(context.subContext({ template: nodeTemplate, resolver: nodeResolver }));
		await nodeContext.ready();
		const node = nodeContext.content;
		if (node) {
			if (node instanceof Array) content = content.concat(node);
			if (node instanceof NodeList || node instanceof HTMLCollection) content = content.concat(Array.from(node));
			else if (node instanceof Node) content.push(node);
		}
	}

	context.content = content.length != 0 ? content : null;
	return context;
};

const renderNode = async (context) => {
	try {
		let { template, renderer } = context;
		if (template instanceof _Element_js__WEBPACK_IMPORTED_MODULE_5__.default) await template.execute(context);
		else await executeDirectives(context);

		const { ignore, content } = context;

		if (!ignore && content) {
			let { resolver } = context;
			const subTemplate = context.template.childNodes;
			if (subTemplate && subTemplate.length > 0) {
				const containerResolver = new _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__.default({ name: SCOPES.container, context: null, parent: resolver });
				const subContext = await renderer.render(context.subContext({ container: content, template: subTemplate, resolver: containerResolver }));
				await subContext.ready();
			}
		}

		if (context.content && context.content.tagName && context.content.tagName == "JSTL") context.content = context.content.childNodes; //special case to support the old "<jstl>" tag.
	} catch (e) {
		console.error("error at render node:", e, context);
	}
	return context;
};

const executeDirectives = async (context) => {
	const directives = _Directive_js__WEBPACK_IMPORTED_MODULE_4__.default.directives;
	const length = directives.length;
	for (let i = 0; i < length && !context.stop; i++) {
		const directive = directives[i];
		try {
			if (context.acceptDirective(directive)) await directive.execute(context);
		} catch (e) {
			console.error("error at directive:", e, directive, context);
		}
	}
	return context;
};

class Renderer {
	constructor({ template, data } = {}) {
		if (template && !(template instanceof _Template_js__WEBPACK_IMPORTED_MODULE_2__.default)) throw new Error("template must be an instance of Template!");

		this.template = template;
		this.resolver = new _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__.default({ name: SCOPES.data, context: data ? data : {}, parent: APPLICATION_SCOPE_RESOLVER });
	}

	/**
	 * @param
	 * 		container HTMLElement -> target to render in
	 * @param
	 * 		data Object|... -> data to used at rendering
	 * @param
	 * 		template Template|Node|NodeList|HTMLCollection|String -> template to render
	 * @param
	 * 		mode "append"|"insert"|"replace"
	 * @param
	 * 		target
	 */
	async render(context) {
		const calledWithContext = context instanceof _Context_js__WEBPACK_IMPORTED_MODULE_3__.default;
		if (!calledWithContext) {
			let { template = null, data = null, container, root, mode, target } = context;
			template = await loadTemplateContent(template, this);
			const resolver = new _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__.default({ name: SCOPES.render, context: data, parent: this.resolver });
			context = new _Context_js__WEBPACK_IMPORTED_MODULE_3__.default({ resolver, renderer: this, template: template, container, root: root ? root : container, mode: mode ? mode : "replace", target });
		} else if (context.closed) throw new Error("calling with closed context", context);

		const template = context.template;
		if (template instanceof Node) await renderNode(context);
		else await renderContainer(context);
		
		await addContent(context);

		if (!calledWithContext)
			await context.ready();

		return context;
	}

	static async build({ template, data } = {}) {
		if (template && template instanceof Promise) template = await template;

		template = template ? await _Template_js__WEBPACK_IMPORTED_MODULE_2__.default.load(template) : null;
		return new Renderer({ template, data });
	}

	static async render({ container, data, template, mode, target }) {
		const renderer = new Renderer({ template, data });
		return renderer.render({ container, mode, target });
	}
}


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/Template.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/Template.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Template)
/* harmony export */ });
/* harmony import */ var _default_js_defaultjs_common_utils_src_javascript_String_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/src/javascript/String.js */ "./node_modules/@default-js/defaultjs-template-language/node_modules/@default-js/defaultjs-common-utils/src/javascript/String.js");
/* harmony import */ var _default_js_defaultjs_common_utils_src_javascript_String_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_default_js_defaultjs_common_utils_src_javascript_String_js__WEBPACK_IMPORTED_MODULE_0__);


const CACHE = {};
const getKey = (template, cache, alias) => {
	if(!cache)
		return null;
	
	let key = null;
	if(alias)
		key = alias;	
	else if(typeof template === "string")
		key = template;
	else if(template instanceof URL)
		key = template.toString();
	else if(template instanceof HTMLElement)
		key = template.selector();
	
	if(key)
		return key.hashcode();
	
	return null;
};

const fromURL = async (url, cache, key) => {
	const response = await fetch(url.toString());
	const source = await response.text();
	return fromSource(source, cache, key);
};

const fromSource = async (source, cache, key) => {
	return fromElement(create(source, true), cache, key);
};

const fromElement = async (element, cache, key) => {	
	let template = null
	if(element instanceof HTMLTemplateElement)			
		template = new Template(element);
	else {
		template = document.createElement("template");
		if(element instanceof Node || element instanceof NodeList || element instanceof HTMLCollection || element instanceof Array)
			template.content.append(element.cloneNode(true));
		else
			throw new Error("Template type is not supported!");			
		
		template = new Template(template, key);
	}
	
	if(!template)
		throw new Error("Template can't loaded!");
	
	if(cache && key)
		CACHE[key] = template;
	
	return template;
};

class Template {	
	constructor(template, key){		
		this.template = template;
		this.key = key;	
	}
	
	importContent(doc=document){
		let imported = doc.importNode(this.template, true);
		return imported.content.childNodes;
	}
	
	remove() {
		if(this.key && CACHE[this.key])
			delete CACHE[this.key];		
	};

	static async fetch(url, cache = true, alias = null){
		if(typeof url === "string"){
			return Template.load(new URL(url, loaction), cache, alias);
		}else if(url instanceof URL)
			return Template.load(url, cache, alias);

		new Error("The url isn't a allowed type! -> [String|URL] required!");
	}
	
	static async load(template, cache = true, alias = null){
		if(template instanceof Template)
			return template;
		
		const key = getKey(template, cache, alias);
		if(key && CACHE[key])
			return CACHE[key];
		else if(typeof template === "string"){
			return fromSource(template, cache, key);
		}else if(template instanceof URL)
			return await fromURL(template, cache, key);
		else if(template instanceof Node || template instanceof NodeList || template instanceof HTMLCollection || template instanceof HTMLTemplateElement)
			return fromElement(template, cache, key);
		
		new Error("The template isn't a allowed type! -> [String|URL|Node|NodeList|HTMLCollection|Template] required!");
	}
};


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/Attributes.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/Attributes.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");


const ATTRIBUTE_NAME = /(jstl)?(\?)?(@)?([^\?@]+)/i;

const bindAttribute = async ({ condition, name, value, context }) => {
	const { resolver, content, template } = context;
		
	let attribute = !condition ? value : template.attr(name);
	condition = condition ? value : template.attr("?" + name);
	const hasValue = isValue(attribute);
	
	if (condition && hasValue) {
		condition = await resolver.resolve(condition, false);
		if (condition === true)
			content.attr(name, await resolver.resolveText(attribute, attribute));
	} else if (condition) {
		condition = await resolver.resolve(condition, false);
		if (condition === true)
			content.attr(name, true);
	} else if (hasValue) {
		content.attr(name, await resolver.resolveText(attribute, attribute));
	}
};

const isValue = (value) => {
	return value != null && typeof value !== "undefined";	
};

const bindEvent = async ({ condition, name, value, context }) => {
	const { resolver, template } = context;
	
	condition = condition ? value : template.attr("?@" + name);
	let handle = !condition ? value : template.attr("@"+ name);
	let split = name.split(":");
	const event = split.shift();
	const type = split.shift() || "default";
	

	if (condition && handle){
		if(await resolver.resolve(condition, false) == true)
			await binding({event, type, handle, context });
	}
	else if (handle)
		await binding({event, type, handle, context });
};

const binding = async ({event, type, handle, context }) => {
	const { resolver, content} = context;
		
	if(type == "delegate"){
		const eventhandle = await resolver.resolveText(handle, handle);
		content.on(event, delegater(eventhandle));
	} else {		
		const eventhandle = await resolver.resolve(handle, handle);
	
		if(!eventhandle)
			console.error(new Error("Can't resolve \"" + handle + "\" to event handle!"))
		else if(typeof eventhandle === "function")
			content.on(event, eventhandle);
		else if(typeof eventhandle === "string")
			content.on(event, delegater(eventhandle));
		else if(typeof eventhandle === "object"){	
			const {capture=false, passive=false, once=false} = handle;		
			content.on(event, eventhandle.eventHandle, {capture, passive, once});
		}
	}
};

const delegater = function(delegate) {
	return function(event) {
		event.preventDefault();
		event.stopPropagation();
		if(event.currentTarget)	
			event.currentTarget.trigger(delegate, event);
		else
			event.target.trigger(delegate, event);
	};
};


class Attribute extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() { return "attribute" }
	get rank() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MIN_RANK }
	get phase() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.content }


	async execute(context) {
		const { template } = context;
		if (!(template instanceof HTMLElement))
			return context;

		const processed = new Set();
		for (const attribute of template.attributes) {
			const [, jstl, condition, event, name] = ATTRIBUTE_NAME.exec(attribute.name);
			if (!jstl && !processed.has(name)) {
				const value = attribute.value;
								
				if (event)
					await bindEvent({ condition, event, name, value, context })
				else
					await bindAttribute({ condition, name, value, context })
			}
			processed.add(name);
		}

		return context;
	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new Attribute() });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/Choose.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/Choose.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");


class Choose extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() { return "choose" }
	get rank() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MIN_RANK + 1 }
	get phase() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.template }

	async execute(context) {
		if (!(context.template instanceof HTMLElement) || !context.template.hasAttribute("jstl-choose") || context.template.children.length == 0)
			return context;

		const { template, resolver } = context;
		let resolved = false;
		const whens = template.find(":scope > [jstl-when]");
		const length = whens.length;
		for (let i = 0; i < length; i++) {
			const node = whens[i];
			if (!resolved && (await resolver.resolve(node.attr("jstl-when"), false)))
				resolved = true;
			else
				node.remove();
		}

		if (resolved)
			template.find(":scope > [jstl-otherwise]").remove();

		return context;
	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new Choose() });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/Data.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/Data.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");



const MODES = {
	"remote": async ({ data, context }) => {		
		const {resolver, template} = context;
		data = await resolver.resolveText(data);
		data = new URL(data, location.origin);
		let option = await resolver.resolveText(template.attr("jstl-data-option") || "{}");
		option = JSON.parse(option);

		data = await fetch(data.toString(), option);
		return data.json();
	},	
	"set": async ({ data, context }) => {
		const {resolver} = context;
		
		data = await resolver.resolve(data);
		return data;
	},
	"direct": async ({ data, context }) => {
		const {resolver} = context;
		
		data = await resolver.resolveText(data);
		return data;
	}
};

const updateContext = ({ varname, data, scope, context }) => {
	if (varname)
		context.resolver.updateData(varname, data, scope);
	else if (scope)
		context.resolver.mergeContext(data, scope);
	else{
		const resolver = new _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_1__.default({ context: data, name: "jstl-data", parent: context.resolver });
		//context = context.subContext({resolver});
		context.resolver = resolver;
	}
	
		
	return context;
};



class Data extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() { return "data" }
	get rank() { return 1000 }
	get phase(){return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.data}

	async execute(context) {
		if (!(context.template instanceof HTMLElement) || !context.template.attr("jstl-data"))
			return context;
			
		try {
			const { template } = context;			
			const mode = MODES[(template.attr("jstl-data-mode") || "remote")];
			if (!mode)
				throw new Error("The jstl-data-mode is unsupported!");

			let data = template.attr("jstl-data");
			data = await mode({ data, context });

			const varname = template.attr("jstl-data-var");
			const scope = template.attr("jstl-data-scope");
			context = updateContext({ varname, data, scope, context });
		} catch (e) {
			console.error(e, context.template);
		}

		return context;

	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new Data() });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/Foreach.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/Foreach.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver.js */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");



const ATTRIBUTE = {
	DATA: "jstl-foreach",
	VAR: "jstl-foreach-var",
	STATUS: "jstl-foreach-status",
	COUNT: "jstl-foreach-count",
	START: "jstl-foreach-start",
	STEP: "jstl-foreach-step",
	CONDITION: "jstl-foreach-condition"
};

const doCount = async (option) => {
	let { start, step, count, varname, status, resolver } = option;

	count = await resolver.resolve(count);
	const length = start + (count * step);
	let stop = false;
	for (let i = start; i < length && !stop; i = i + step) {
		const iteration = {}
		iteration[varname] = i;
		iteration[status] = {
			index: i,
			number: i + 1,
			step,
			count
		};
		stop = !(await iterate(iteration, option));
	}
};

const doForeach = async (option) => {
	let { data, start, step, count, varname, status, resolver } = option;

	data = await resolver.resolve(data);
	let array = data;
	if (!(data instanceof Array))
		array = Object.getOwnPropertyNames(data);

	count = count != "" ? await resolver.resolve(count, 0) : null;
	const length = count ? Math.min(start + count, array.length) : array.length;
	let stop = false;
	for (let i = start; i < length && !stop; i = i + step) {
		const iteration = {}
		iteration[varname] = data[i];
		iteration[status] = {
			index: i,
			number: i + 1,
			count: length,
			data
		};
		stop = !(await iterate(iteration, option));
	}
};

const iterate = async (data, option) => {
	let { template, resolver, renderer, container, condition, context } = option;
	resolver = new _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__.default({ context: data, name: "jstl-foreach", parent: resolver });

	condition = condition ? await resolver.resolve(condition, false) : false;
	if (condition)
		return false;
	const itemContext = context.subContext({ resolver, container, template, mode: "append" });
	await renderer.render(itemContext);
	await itemContext.ready();
	return true;
};

class Foreach extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() { return "foreach" }
	get rank() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MIN_RANK + 2 }
	get phase() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.template }

	async execute(context) {
		if (!(context.template instanceof HTMLElement) || (!context.template.attr(ATTRIBUTE.DATA) && !context.template.attr(ATTRIBUTE.COUNT)))
			return context;

		context.ignore = true;
		try {
			const { template, resolver, renderer, content } = context;
			const option = {
				data: (template.attr(ATTRIBUTE.DATA) || "").trim(),
				count: (template.attr(ATTRIBUTE.COUNT) || "").trim(),
				start: await resolver.resolve(template.attr(ATTRIBUTE.START) || "0"),
				step: await resolver.resolve(template.attr(ATTRIBUTE.STEP) || "1"),
				varname: (template.attr(ATTRIBUTE.VAR) || "item").trim(),
				status: (template.attr(ATTRIBUTE.STATUS) || "status").trim(),
				condition: template.attr(ATTRIBUTE.CONDITION),
				template: template.childNodes,
				resolver,
				renderer,
				container: content,
				context
			};
			if ((!option.data || option.data == "") && option.count)
				await doCount(option);
			else
				await doForeach(option);

		} catch (error) {
			console.error("error at jstl-foreach:", error);
		}
		return context;

	}
};

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new Foreach() });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/If.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/If.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");


class If extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() { return "if" }
	get rank() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MIN_RANK + 1000 }
	get phase() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.init }

	async execute(context) {
		const { template } = context;
		if (!(template instanceof HTMLElement) || !template.attr("jstl-if"))
			return context;

		const expression = template.attr("jstl-if");
		const resolver = context.resolver;
		const result = await resolver.resolve(expression, false);
		if (!result) {
			context.content = null;
			context.stop = true;
			context.ignore = true;
		}

		return context;
	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new If() });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/Include.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/Include.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");
/* harmony import */ var _Template_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Template.js */ "./node_modules/@default-js/defaultjs-template-language/src/Template.js");



class Include extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() {
		return "include";
	}
	get rank() {
		return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MIN_RANK;
	}
	get phase() {
		return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.template;
	}

	async execute(context) {
		if (!(context.template instanceof HTMLElement) || !context.template.attr("jstl-include")) return context;
		try {
			const { template, resolver, renderer } = context;
			let include = template.attr("jstl-include");
			include = await resolver.resolveText(include);
			include = new URL(include, location);
			include = await _Template_js__WEBPACK_IMPORTED_MODULE_1__.default.load(include);

			const mode = template.attr("jstl-include-mode") || "replace";

			const subContext = context.subContext({ template: include, container: context.content, mode});
			await renderer.render(subContext);
			await subContext.ready();
			context.ignore;

			return context;
		} catch (e) {
			console.error(e, context.template);
			return context;
		}
	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new Include() });


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/Initial.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/Initial.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");
/* harmony import */ var _elements_Replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../elements/Replace.js */ "./node_modules/@default-js/defaultjs-template-language/src/elements/Replace.js");



class Initial extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() {
		return "initial";
	}
	get rank() {
		return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MIN_RANK;
	}
	get phase() {
		return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.init;
	}

	async execute(context) {
		const { template, renderer, resolver } = context;
		if (!(template instanceof Element)) {
			context.content = document.importNode(template, true);
		} else if (template.attr("jstl-async")) {
			context.content = new _elements_Replace_js__WEBPACK_IMPORTED_MODULE_1__.default();
			template.attr("jstl-async", null);
			const renderOption = context.toRenderOption({ mode: "replace", target: context.content });
			setTimeout(() => {
				renderer.render(renderOption);
			}, parseInt(template.attr("jstl-async") || "250") || 250);
			context.stop = true;
			context.ignore = true;
		} else if (template.attr("jstl-ignore")) {
			context.content = document.importNode(template, true);
			context.stop = true;
			context.ignore = true;
		} else if (template instanceof HTMLTemplateElement) {
			context.content = document.createElement(template.tagName);
			const subContext = context.subContext({ template: template.content.childNodes, container: context.content.content });
			await renderer.render(subContext);			
			context.stop = true;
			context.ignore = true;
		} else if (template.hasAttribute("jstl-tagname")) {
			let tagname = template.attr("jstl-tagname").trim();
			if (tagname.length > 0) context.content = document.createElement(await resolver.resolveText(template.attr("jstl-tagname")));
			else {
				context.content = document.importNode(template, true);
				context.stop = true;
				context.ignore = true;
			}
		} else if (template.tagName) {
			context.content = document.createElement(template.tagName);
		} else {
			context.content = document.importNode(template, true);
			context.stop = true;
			context.ignore = true;
		}

		return context;
	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new Initial() });


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/OnFinished.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/OnFinished.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");



const NAME = "on-finished";
const ATTRIBUTE_ON_FINISHED = `jstl-${NAME}`;
const ATTRIBUTE_ON_FINISHED_ASYNC = `${ATTRIBUTE_ON_FINISHED}-async`;

class OnFinished extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() { return NAME }
	get rank() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MAX_RANK }
	get phase() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.finish }



	async execute(context) {
		const { template, content, root } = context;
		if (!(template instanceof HTMLElement) || !template.hasAttribute(ATTRIBUTE_ON_FINISHED))
			return context;

		const expression = template.attr(ATTRIBUTE_ON_FINISHED);
		const asyncCall = template.hasAttribute(ATTRIBUTE_ON_FINISHED_ASYNC);

		const data = {
			$element: content,
			$root: root,
			$template: template
		};
		const resolver = new _default_js_defaultjs_expression_language_src_ExpressionResolver__WEBPACK_IMPORTED_MODULE_1__.default({ context: data, name: "jstl-data", parent: context.resolver });


		context.finished(async () => {
			try {
				if(!asyncCall)
					return resolver.resolve(expression, null);
					
				resolver.resolve(expression, null);
			} catch (e) {
				console.error(e);
			}
		});

		return context;
	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new OnFinished() });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/Repeat.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/Repeat.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");
/* harmony import */ var _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/src/ExpressionResolver.js */ "./node_modules/@default-js/defaultjs-expression-language/src/ExpressionResolver.js");



const DIRECTIVENAME = "jstl-repeat";
const IGNOREDIRECTIVE = new Set([DIRECTIVENAME]);

const ATTRIBUTE = {
	DATA: `${DIRECTIVENAME}`,
	VAR: `${DIRECTIVENAME}-var`,
	STATUS: `${DIRECTIVENAME}-status`,
	COUNT: `${DIRECTIVENAME}-count`,
	START: `${DIRECTIVENAME}-start`,
	STEP: `${DIRECTIVENAME}-step`,
	CONDITION: `${DIRECTIVENAME}-condition`,
};

const doCount = async (option) => {
	let { start, step, count, varname, status, resolver } = option;
	count = await resolver.resolve(count);
	const length = start + count * step;
	let stop = false;
	for (let i = start; i < length && !stop; i = i + step) {
		const iteration = {};
		iteration[varname] = i;
		iteration[status] = {
			index: i,
			number: i + 1,
			step,
			count,
		};
		stop = !(await iterate(iteration, option));
	}
};

const doRepeat = async (option) => {
	let { data, start, step, count, varname, status, resolver } = option;

	data = await resolver.resolve(data);
	let array = data;
	if (!(data instanceof Array)) array = Object.getOwnPropertyNames(data);

	count = count != "" ? await resolver.resolve(count, 0) : null;
	const length = count ? Math.min(start + count, array.length) : array.length;
	let stop = false;
	for (let i = start; i < length && !stop; i = i + step) {
		const iteration = {};
		iteration[varname] = data[i];
		iteration[status] = {
			index: i,
			number: i + 1,
			count: length,
			data,
		};
		stop = !(await iterate(iteration, option));
	}
};

const iterate = async (data, option) => {
	let { template, resolver, renderer, condition, context } = option;
	resolver = new _default_js_defaultjs_expression_language_src_ExpressionResolver_js__WEBPACK_IMPORTED_MODULE_1__.default({ context: data, name: DIRECTIVENAME, parent: resolver });

	condition = condition ? await resolver.resolve(condition, false) : false;
	if (condition) return false;

	const itemContext =  context.subContext({ resolver, template, mode: "append", ignoreDirective: IGNOREDIRECTIVE })
	await renderer.render(itemContext);
	await itemContext.ready();

	return true;
};

class Repeat extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() {
		return DIRECTIVENAME;
	}
	get rank() {
		return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MIN_RANK + 3;
	}
	get phase() {
		return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.template;
	}

	async execute(context) {
		if (!(context.template instanceof HTMLElement) || (!context.template.attr(ATTRIBUTE.DATA) && !context.template.attr(ATTRIBUTE.COUNT))) return context;

		try {
			const { template, resolver, renderer, content, container } = context;
			const option = {
				data: (template.attr(ATTRIBUTE.DATA) || "").trim(),
				count: (template.attr(ATTRIBUTE.COUNT) || "").trim(),
				start: await resolver.resolve(template.attr(ATTRIBUTE.START) || "0"),
				step: await resolver.resolve(template.attr(ATTRIBUTE.STEP) || "1"),
				varname: (template.attr(ATTRIBUTE.VAR) || "item").trim(),
				status: (template.attr(ATTRIBUTE.STATUS) || "status").trim(),
				condition: template.attr(ATTRIBUTE.CONDITION),
				template: template,
				tagname: content.tagName,
				resolver,
				renderer,
				container,
				context,
			};
			if ((!option.data || option.data == "") && option.count) await doCount(option);
			else await doRepeat(option);
		} catch (error) {
			console.error("error at jstl-repeat:", error);
		}

		context.content = null;
		context.stop = true;
		context.ignore = true;
		return context;
	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new Repeat() });


/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/Text.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/Text.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Directive.js */ "./node_modules/@default-js/defaultjs-template-language/src/Directive.js");


const DEFAULT_OPTION = {
	mode: "text",
	unsecure: false,
	preventFormat : false,
	maxLength: 0	
};

const SECURE_HTML_FILTER = "script, style, body, html, head, object, link";

const readOption = async (parent, context) => {
	const resolver = context.resolver;
	return {
		mode: await resolver.resolveText((parent.attr("jstl-text-content-type") || "text").trim().toLowerCase()),
		unsecure: parent.hasAttribute("jstl-text-unsecure"),
		preventFormat: !!parent.attr("jstl-text-prevent-format") || false,
		maxLength: parseInt(await resolver.resolveText(parent.attr("jstl-text-trim-length") || "0"))
	};
};

const trimTextLength = (text, length) => {
	return text.length > length ? text.substring(0, length - 3).trim() + "..." : text;
};

const MODES = {
	"text" : async (option, context) => {
		const {content, resolver, template} = context;
		
		let text = await resolver.resolveText(template.textContent);		
		text = create(text,true).content.textContent;
		if(option.maxLength > 0)
			text = trimTextLength(text, option.maxLength);		
		
		content.textContent = text;		
	},
	"html": async (option, context) => {
		const {resolver, template} = context;
		
		let content = await resolver.resolveText(template.textContent);		
		content = create(content,true);		
		content = document.importNode(content.content, true);
		
		if(option.unsecure)
			context.content = content;			
		else{
			content.find(SECURE_HTML_FILTER).remove();			
			context.content = content;
		}
	}
};


class TextContent extends _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor() {
		super();
	}

	get name() { return "text" }
	get rank() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.MIN_RANK + 1 }
	get phase() { return _Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.PHASE.content }



	async execute(context) {
		const { template } = context;
		if (!(template instanceof Text) || template.textContent.trim().length == 0 || (template.parentElement && template.parentElement.hasAttribute("jstl-text-ignore")))
			return context;

		const parent = template.parentElement;
		const option = parent ? await readOption(parent, context) : DEFAULT_OPTION;
		
		const  mode = MODES[option.mode];
		if(!mode)
			throw new Error("Text mode \""+ option.mode + "\" is unsupported!");
		
		await mode(option, context);
		
		return context;
	}
}

_Directive_js__WEBPACK_IMPORTED_MODULE_0__.default.define({ directive: new TextContent() });

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/directives/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/directives/index.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Initial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Initial.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/Initial.js");
/* harmony import */ var _Data_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Data.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/Data.js");
/* harmony import */ var _If_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./If.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/If.js");
/* harmony import */ var _Choose_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Choose.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/Choose.js");
/* harmony import */ var _Include_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Include.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/Include.js");
/* harmony import */ var _Foreach_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Foreach.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/Foreach.js");
/* harmony import */ var _Repeat_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Repeat.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/Repeat.js");
/* harmony import */ var _Text_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Text.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/Text.js");
/* harmony import */ var _Attributes_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Attributes.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/Attributes.js");
/* harmony import */ var _OnFinished_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./OnFinished.js */ "./node_modules/@default-js/defaultjs-template-language/src/directives/OnFinished.js");











/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/elements/Replace.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/elements/Replace.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ReplaceElement)
/* harmony export */ });
/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Element.js */ "./node_modules/@default-js/defaultjs-template-language/src/Element.js");


class ReplaceElement extends _Element_js__WEBPACK_IMPORTED_MODULE_0__.default{
	constructor(){
		super();
		
		this.attachShadow({mode: 'open'});
	}
	async execute({template, context}){
		return context;
	};		
}
try{customElements.define("jstl-replace", ReplaceElement);}catch(e){}//ignore

/***/ }),

/***/ "./node_modules/@default-js/defaultjs-template-language/src/elements/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@default-js/defaultjs-template-language/src/elements/index.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _Replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Replace.js */ "./node_modules/@default-js/defaultjs-template-language/src/elements/Replace.js");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/* harmony import */ var _default_js_defaultjs_extdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @default-js/defaultjs-extdom */ "./node_modules/@default-js/defaultjs-extdom/index.js");
/* harmony import */ var _default_js_defaultjs_common_utils_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @default-js/defaultjs-common-utils/browser */ "./node_modules/@default-js/defaultjs-common-utils/browser.js");
/* harmony import */ var _default_js_defaultjs_ical_browser_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @default-js/defaultjs-ical/browser-index */ "./node_modules/@default-js/defaultjs-ical/browser-index.js");
/* harmony import */ var _default_js_defaultjs_expression_language_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @default-js/defaultjs-expression-language/browser */ "./node_modules/@default-js/defaultjs-expression-language/browser.js");
/* harmony import */ var _default_js_defaultjs_template_language_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @default-js/defaultjs-template-language/browser */ "./node_modules/@default-js/defaultjs-template-language/browser.js");
/* harmony import */ var _default_js_defaultjs_html_form_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @default-js/defaultjs-html-form/browser */ "./node_modules/@default-js/defaultjs-html-form/browser.js");
/* harmony import */ var _default_js_defaultjs_html_components_browser_bundle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @default-js/defaultjs-html-components/browser-bundle */ "./node_modules/@default-js/defaultjs-html-components/browser-bundle.js");
/* harmony import */ var _default_js_defaultjs_html_jsondata_browser_bundle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @default-js/defaultjs-html-jsondata/browser-bundle */ "./node_modules/@default-js/defaultjs-html-jsondata/browser-bundle.js");
/* harmony import */ var _default_js_defaultjs_html_request_browser_bundle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @default-js/defaultjs-html-request/browser-bundle */ "./node_modules/@default-js/defaultjs-html-request/browser-bundle.js");
/* harmony import */ var _default_js_defaultjs_html_pagination_browser_bundle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @default-js/defaultjs-html-pagination/browser-bundle */ "./node_modules/@default-js/defaultjs-html-pagination/browser-bundle.js");
/* harmony import */ var _default_js_defaultjs_html_renderer_browser_bundle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @default-js/defaultjs-html-renderer/browser-bundle */ "./node_modules/@default-js/defaultjs-html-renderer/browser-bundle.js");
/* harmony import */ var _default_js_defaultjs_html_typeahead_browser_bundle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @default-js/defaultjs-html-typeahead/browser-bundle */ "./node_modules/@default-js/defaultjs-html-typeahead/browser-bundle.js");







//Web Components





})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL0VzY2FwZXIuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWwuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9PYmplY3RQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL09iamVjdFV0aWxzLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvUHJpdmF0ZVByb3BlcnR5LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvUHJvbWlzZVV0aWxzLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvVVVJRC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL1ZhbHVlSGVscGVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9qYXZhc2NyaXB0L1N0cmluZy5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1keW5hbWljLXJlcXVlc3Rlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1keW5hbWljLXJlcXVlc3Rlci9zcmMvUmVxdWVzdGVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4cHJlc3Npb24tbGFuZ3VhZ2UvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHByZXNzaW9uLWxhbmd1YWdlL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWwuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvT2JqZWN0UHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvT2JqZWN0VXRpbHMuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9zcmMvQ29udGV4dC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHByZXNzaW9uLWxhbmd1YWdlL3NyYy9EZWZhdWx0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9zcmMvRXhwcmVzc2lvblJlc29sdmVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4cHJlc3Npb24tbGFuZ3VhZ2Uvc3JjL2luZGV4LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4dGRvbS9zcmMvR2xvYmFsLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4dGRvbS9zcmMvZG9tL0RvY3VtZW50LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4dGRvbS9zcmMvZG9tL0RvY3VtZW50RnJhZ21lbnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXh0ZG9tL3NyYy9kb20vRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9FdmVudFRhcmdldC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9IVE1MRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9IVE1MSW5wdXRFbGVtZW50LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4dGRvbS9zcmMvZG9tL0hUTUxTZWxlY3RFbGVtZW50LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4dGRvbS9zcmMvZG9tL0hUTUxUZXh0QXJlYUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXh0ZG9tL3NyYy9kb20vSHRtbENvbGxlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXh0ZG9tL3NyYy9kb20vTm9kZS5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9Ob2RlTGlzdC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9leHRlbnRpb25zL0F0dHJpYnV0ZVN1cHBvcnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXh0ZG9tL3NyYy9kb20vZXh0ZW50aW9ucy9EYXRhU3VwcG9ydC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9leHRlbnRpb25zL0V2ZW50U3VwcG9ydC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9leHRlbnRpb25zL0h0bWxDbGFzc1N1cHBvcnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXh0ZG9tL3NyYy9kb20vZXh0ZW50aW9ucy9MaXN0U3VwcG9ydC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9leHRlbnRpb25zL01hbmlwdWxhdGlvblN1cHBvcnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXh0ZG9tL3NyYy9kb20vZXh0ZW50aW9ucy9RdWVyeVN1cHBvcnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtZXh0ZG9tL3NyYy9kb20vZXh0ZW50aW9ucy9SZWFkeUV2ZW50U3VwcG9ydC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9leHRlbnRpb25zL1Nob3dIaWRlU3VwcG9ydC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2RvbS9leHRlbnRpb25zL1ZhbHVlU3VwcG9ydC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL2luZGV4LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4dGRvbS9zcmMvdXRpbHMvRGVsZWdhdGVyQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL3V0aWxzL0V4dGVuZFByb3RvdHlwZS5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb20vc3JjL3V0aWxzL0V4dGVuZGVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4dGRvbS9zcmMvdXRpbHMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL2Jyb3dzZXItYnVuZGxlLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvQ29tcG9uZW50LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvQ29uc3RhbnRzLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvUmVhZHkuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL3NyYy91dGlscy9EZWZpbmVDb21wb25lbnRIZWxwZXIuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL3NyYy91dGlscy9FdmVudEhlbHBlci5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWNvbXBvbmVudHMvc3JjL3V0aWxzL1N0eWxlSGVscGVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvdXRpbHMvVGVtcGxhdGVIZWxwZXIuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL3NyYy91dGlscy9XZWFrRGF0YS5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWNvbXBvbmVudHMvc3JjL3V0aWxzL2luZGV4LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9icm93c2VyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9pbmRleC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL0Jhc2UuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9CYXNlRmllbGQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9Db25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9Db250YWluZXIuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9Db250cm9sLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvRmllbGQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9Gb3JtLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvRm9ybUJ1dHRvbi5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL0xpc3QuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9NZXNzYWdlLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvUGFnZS5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvU3RlcC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL1ZhbGlkYXRpb24uanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9WYWxpZGF0b3IuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9jb250cm9scy9CYWNrQnV0dG9uLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvY29udHJvbHMvTmV4dEJ1dHRvbi5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL2NvbnRyb2xzL1N1Ym1pdEJ1dHRvbi5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL2NvbnRyb2xzL1N1bW1hcnlCdXR0b24uanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9jb250cm9scy9pbmRleC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL2xpc3QvQWRkUm93LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvbGlzdC9EZWxldGVSb3cuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy9saXN0L1Jvdy5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL2xpc3QvUm93cy5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL3V0aWxzL0RhdGFIZWxwZXIuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy91dGlscy9EZWZpbmVFbGVtZW50LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvdXRpbHMvRXZlbnRIZWxwZXIuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy91dGlscy9Ob2RlSGVscGVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvdXRpbHMvU3RhdGVIZWxwZXIuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL3NyYy93cmFwcGVyL0NoZWNrYm94LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvd3JhcHBlci9GaWxlLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvd3JhcHBlci9SYWRpby5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWZvcm0vc3JjL3dyYXBwZXIvU2VsZWN0LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvd3JhcHBlci9UZXh0LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvd3JhcHBlci9XcmFwcGVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtZm9ybS9zcmMvd3JhcHBlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWpzb25kYXRhL2Jyb3dzZXItYnVuZGxlLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtanNvbmRhdGEvc3JjL0hUTUxKc29uRGF0YUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1wYWdpbmF0aW9uL2Jyb3dzZXItYnVuZGxlLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtcGFnaW5hdGlvbi9zcmMvSFRNTFBhZ2luYXRpb25FbGVtZW50LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtcmVuZGVyZXIvYnJvd3Nlci1idW5kbGUuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1yZW5kZXJlci9zcmMvSFRNTFJlbmRlcmVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLXJlcXVlc3QvYnJvd3Nlci1idW5kbGUuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1yZXF1ZXN0L3NyYy9IVE1MUmVxdWVzdEVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC10eXBlYWhlYWQvYnJvd3Nlci1idW5kbGUuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC10eXBlYWhlYWQvc3JjL0hUTUxUeXBlYWhlYWRFbGVtZW50LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWljYWwvYnJvd3Nlci1pbmRleC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1pY2FsL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9Fc2NhcGVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWljYWwvbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL09iamVjdFV0aWxzLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWljYWwvc3JjL0Rlc2VyaWFsaXplci5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1pY2FsL3NyYy9JQ2FsZW5kYXIuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtaWNhbC9zcmMvUGFyc2VyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWljYWwvc3JjL1Rva2VuaXplci5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1pY2FsL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy10ZW1wbGF0ZS1sYW5ndWFnZS9icm93c2VyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL2luZGV4LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWwuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL09iamVjdFByb3BlcnR5LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9PYmplY3RVdGlscy5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy10ZW1wbGF0ZS1sYW5ndWFnZS9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvUHJpdmF0ZVByb3BlcnR5LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9Qcm9taXNlVXRpbHMuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL2phdmFzY3JpcHQvU3RyaW5nLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9Db250ZXh0LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9EaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvc3JjL0VsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvc3JjL1JlbmRlcmVyLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy10ZW1wbGF0ZS1sYW5ndWFnZS9zcmMvZGlyZWN0aXZlcy9BdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9kaXJlY3RpdmVzL0Nob29zZS5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy10ZW1wbGF0ZS1sYW5ndWFnZS9zcmMvZGlyZWN0aXZlcy9EYXRhLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9kaXJlY3RpdmVzL0ZvcmVhY2guanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvc3JjL2RpcmVjdGl2ZXMvSWYuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvc3JjL2RpcmVjdGl2ZXMvSW5jbHVkZS5qcyIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlLy4vbm9kZV9tb2R1bGVzL0BkZWZhdWx0LWpzL2RlZmF1bHRqcy10ZW1wbGF0ZS1sYW5ndWFnZS9zcmMvZGlyZWN0aXZlcy9Jbml0aWFsLmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9kaXJlY3RpdmVzL09uRmluaXNoZWQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvc3JjL2RpcmVjdGl2ZXMvUmVwZWF0LmpzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvLi9ub2RlX21vZHVsZXMvQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9kaXJlY3RpdmVzL1RleHQuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvc3JjL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL25vZGVfbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvc3JjL2VsZW1lbnRzL1JlcGxhY2UuanMiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ludHJhbmV0LWRlZmF1bHRqcy1idW5kbGUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9pbnRyYW5ldC1kZWZhdWx0anMtYnVuZGxlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS8uL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUF3QjtBQUNVOzs7QUFHbEMsMERBQWdCLEdBQUcsMERBQWdCO0FBQ25DLGlFQUF1QixHQUFHLGlFQUF1QjtBQUNqRCxpRUFBdUIsR0FBRyx1RUFBNkI7QUFDdkQsdUVBQTZCLEdBQUcsdUVBQTZCO0FBQzdELENBQUMsaURBQVks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V0FDQTtXQUNBLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQTtXQUNBLENBQUMsSTs7Ozs7V0NQRCx3Rjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBc0M7QUFDYztBQUNGO0FBQ1M7QUFDRjtBQUNSO0FBQ2E7QUFDOUQ7QUFDNEQ7QUFDRDtBQUNHO0FBQ0YiLCJmaWxlIjoiaW50cmFuZXQtZGVmYXVsdGpzLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYWNrIGZyb20gXCIuL3NyY1wiXHJcbmltcG9ydCBHTE9CQUwgZnJvbSBcIi4vc3JjL0dsb2JhbFwiO1xyXG5cclxuXHJcbkdMT0JBTC5kZWZhdWx0anMgPSBHTE9CQUwuZGVmYXVsdGpzIHx8IHt9O1xyXG5HTE9CQUwuZGVmYXVsdGpzLmNvbW1vbiA9IEdMT0JBTC5kZWZhdWx0anMuY29tbW9uIHx8IHt9O1xyXG5HTE9CQUwuZGVmYXVsdGpzLmNvbW1vbiA9IEdMT0JBTC5kZWZhdWx0anMuY29tbW9uLnV0aWxzIHx8IHt9O1xyXG5HTE9CQUwuZGVmYXVsdGpzLmNvbW1vbi51dGlscyA9IEdMT0JBTC5kZWZhdWx0anMuY29tbW9uLnV0aWxzIHx8ICgoKSA9PiB7XHJcblx0cGFjay5WRVJTSU9OID0gXCIke3ZlcnNpb259XCI7XHJcblx0XHJcblx0cmV0dXJuIHBhY2s7XHJcbn0pKCk7IiwiLy8gcmVxdWlyZWQgdG8gYnVpbGQgdGhlIGludGVybmFsIGVzY2FwZSBmaWx0ZXIgZm9yIHJlZ2V4XG5jb25zdCBSRUdFWENIQVJNQVAgPSBbXCJcXFxcXCIsXCI/XCIsXCJbXCIsIFwiXVwiLCBcIntcIiwgXCJ9XCIsIFwiKFwiLCBcIilcIiwgXCIuXCIsIFwiXlwiLCBcIiRcIl1cblx0Lm1hcChjaGFyID0+IHsgXG5cdFx0cmV0dXJuIHtmOiBuZXcgUmVnRXhwKFwiXFxcXFwiICtjaGFyLCBcImdcIiksIHYgOiBcIlxcXFxcIiArIGNoYXJ9O1xuXHR9KTtcblxuXG5jb25zdCBtYXBwaW5nID0gKGFUZXh0LCB0aGVGaWx0ZXJzKSA9PiB7XG5cdGxldCB0ZXh0ID0gYVRleHQ7XG5cdHRoZUZpbHRlcnMuZm9yRWFjaChpdGVtID0+IHtcblx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKGl0ZW0uZiwgaXRlbS52KTtcblx0fSk7XG5cdHJldHVybiB0ZXh0O1xufTtcblxuY29uc3QgYnVpbGRVbmVzY2FwZUxpc3QgPSAoYUNoYXJNYXAsIGlzQ2FzZVNlbnNpdGl2KSA9PiB7XG5cdGNvbnN0IG9wdGlvbiA9IGlzQ2FzZVNlbnNpdGl2ID8gXCJtZ1wiIDogXCJtZ2lcIjsgXG5cdHJldHVybiBhQ2hhck1hcC5tYXAoaXRlbSA9PiB7XG5cdFx0aWYoIWl0ZW0uYXQgfHwgaXRlbS5hdCA9PSBcInVuZXNjYXBlXCIpXG5cdFx0XHRyZXR1cm4ge2Y6IG5ldyBSZWdFeHAobWFwcGluZyhpdGVtLmVzY2FwZWQsIFJFR0VYQ0hBUk1BUCksIG9wdGlvbiksIHY6IGl0ZW0uY2hhcn1cblx0fSkuZmlsdGVyKGl0ZW0gPT4gISFpdGVtKTtcbn07XG5cbmNvbnN0IGJ1aWxkRXNjYXBlTGlzdCA9IChhQ2hhck1hcCwgaXNDYXNlU2Vuc2l0aXYpID0+IHtcblx0Y29uc3Qgb3B0aW9uID0gaXNDYXNlU2Vuc2l0aXYgPyBcIm1nXCIgOiBcIm1naVwiOyBcblx0cmV0dXJuIGFDaGFyTWFwLm1hcChpdGVtID0+IHtcblx0XHRpZighaXRlbS5hdCB8fCBpdGVtLmF0ID09IFwiZXNjYXBlXCIpXG5cdFx0XHRyZXR1cm4ge2Y6IG5ldyBSZWdFeHAobWFwcGluZyhpdGVtLmNoYXIsUkVHRVhDSEFSTUFQKSwgb3B0aW9uKSwgdjogaXRlbS5lc2NhcGVkfVxuXHR9KS5maWx0ZXIoaXRlbSA9PiAhIWl0ZW0pO1xufTtcbmNsYXNzIEVzY2FwZXIge1xuXHRjb25zdHJ1Y3Rvcihlc2NhcGVNYXAsIGlzQ2FzZVNlbnNpdGl2KXtcblx0XHR0aGlzLmVzY2FwZU1hcCA9IGJ1aWxkRXNjYXBlTGlzdChlc2NhcGVNYXAsIGlzQ2FzZVNlbnNpdGl2KVxuXHRcdHRoaXMudW5lc2NhcGVNYXAgPSBidWlsZFVuZXNjYXBlTGlzdChlc2NhcGVNYXAsIGlzQ2FzZVNlbnNpdGl2KVxuXHR9XG5cdFxuXHRlc2NhcGUoYVRleHQpe1xuXHRcdHJldHVybiBtYXBwaW5nKGFUZXh0LCB0aGlzLmVzY2FwZU1hcCk7XG5cdH1cblx0XG5cdHVuZXNjYXBlKGFUZXh0KXtcblx0XHRyZXR1cm4gbWFwcGluZyhhVGV4dCwgdGhpcy51bmVzY2FwZU1hcCk7XG5cdH1cblx0XG5cdHN0YXRpYyBSRUdFWFBfRVNDQVBFUigpe1xuXHRcdHJldHVybiBuZXcgRXNjYXBlcihbXG5cdFx0XHR7Y2hhcjogXCJcXFxcXCIsIGVzY2FwZWQgOiBcIlxcXFxcXFxcXCJ9LFxuXHRcdFx0e2NoYXI6IFwiP1wiLCBlc2NhcGVkIDogXCJcXFxcP1wifSxcblx0XHRcdHtjaGFyOiBcIltcIiwgZXNjYXBlZCA6IFwiXFxcXFtcIn0sXG5cdFx0XHR7Y2hhcjogXCJdXCIsIGVzY2FwZWQgOiBcIlxcXFxdXCJ9LFxuXHRcdFx0e2NoYXI6IFwie1wiLCBlc2NhcGVkIDogXCJcXFxce1wifSxcblx0XHRcdHtjaGFyOiBcIn1cIiwgZXNjYXBlZCA6IFwiXFxcXH1cIn0sXG5cdFx0XHR7Y2hhcjogXCIoXCIsIGVzY2FwZWQgOiBcIlxcXFwoXCJ9LFxuXHRcdFx0e2NoYXI6IFwiKVwiLCBlc2NhcGVkIDogXCJcXFxcKVwifSxcblx0XHRcdHtjaGFyOiBcIi5cIiwgZXNjYXBlZCA6IFwiXFxcXC5cIn0sXG5cdFx0XHR7Y2hhcjogXCJeXCIsIGVzY2FwZWQgOiBcIlxcXFxeXCJ9LFxuXHRcdFx0e2NoYXI6IFwiJFwiLCBlc2NhcGVkIDogXCJcXFxcJFwifVxuXHRcdF0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVzY2FwZXI7XG5cbiIsImNvbnN0IEdMT0JBTCA9ICgoKSA9PiB7XHJcblx0aWYodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGdsb2JhbDtcclxuXHRpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gd2luZG93O1x0XHJcblx0aWYodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBzZWxmO1xyXG5cdHJldHVybiB7fTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdMT0JBTDsiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBPYmplY3RQcm9wZXJ0eSB7XHJcblx0Y29uc3RydWN0b3Ioa2V5LCBjb250ZXh0KXtcclxuXHRcdHRoaXMua2V5ID0ga2V5O1xyXG5cdFx0dGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGtleURlZmluZWQoKXtcclxuXHRcdHJldHVybiB0aGlzLmtleSBpbiB0aGlzLmNvbnRleHQ7IFxyXG5cdH1cclxuXHRcclxuXHRnZXQgaGFzVmFsdWUoKXtcclxuXHRcdHJldHVybiAhIXRoaXMuY29udGV4dFt0aGlzLmtleV07XHJcblx0fVxyXG5cdFxyXG5cdGdldCB2YWx1ZSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuY29udGV4dFt0aGlzLmtleV07XHJcblx0fVxyXG5cdFxyXG5cdHNldCB2YWx1ZShkYXRhKXtcclxuXHRcdHRoaXMuY29udGV4dFt0aGlzLmtleV0gPSBkYXRhO1xyXG5cdH1cclxuXHRcclxuXHRzZXQgYXBwZW5kKGRhdGEpIHtcclxuXHRcdGlmKCF0aGlzLmhhc1ZhbHVlKVxyXG5cdFx0XHR0aGlzLnZhbHVlID0gZGF0YTtcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRoaXMudmFsdWU7XHJcblx0XHRcdGlmKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpXHJcblx0XHRcdFx0dmFsdWUucHVzaChkYXRhKTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRoaXMudmFsdWUgPSBbdGhpcy52YWx1ZSwgZGF0YV07XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZSgpe1xyXG5cdFx0ZGVsZXRlIHRoaXMuY29udGV4dFt0aGlzLmtleV07XHJcblx0fVxyXG5cdFxyXG5cdHN0YXRpYyBsb2FkKGRhdGEsIGtleSwgY3JlYXRlPXRydWUpIHtcclxuXHRcdGxldCBjb250ZXh0ID0gZGF0YTtcclxuXHRcdGNvbnN0IGtleXMgPSBrZXkuc3BsaXQoXCJcXC5cIik7XHJcblx0XHRsZXQgbmFtZSA9IGtleXMuc2hpZnQoKS50cmltKCk7XHJcblx0XHR3aGlsZShrZXlzLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRpZighY29udGV4dFtuYW1lXSl7XHJcblx0XHRcdFx0aWYoIWNyZWF0ZSlcclxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGNvbnRleHRbbmFtZV0gPSB7fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRjb250ZXh0ID0gY29udGV4dFtuYW1lXTtcclxuXHRcdFx0bmFtZSA9IGtleXMuc2hpZnQoKS50cmltKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBuZXcgT2JqZWN0UHJvcGVydHkobmFtZSwgY29udGV4dCk7XHJcblx0fVxyXG59OyIsImltcG9ydCBPYmplY3RQcm9wZXJ0eSBmcm9tIFwiLi9PYmplY3RQcm9wZXJ0eS5qc1wiO1xyXG4vKipcclxuICogYXBwZW5kIGEgcHJvcGVyeSB2YWx1ZSB0byBhbiBvYmplY3QuIElmIHByb3BlcnkgZXhpc3RzIGl0cyB3b3VsZCBiZSBjb252ZXJ0ZWQgdG8gYW4gYXJyYXlcclxuICpcclxuICogIEBwYXJhbSBhS2V5OnN0cmluZyBuYW1lIG9mIHByb3BlcnR5XHJcbiAqICBAcGFyYW0gYURhdGE6YW55IHByb3BlcnR5IHZhbHVlXHJcbiAqICBAcGFyYW0gYU9iamVjdDpvYmplY3QgdGhlIG9iamVjdCB0byBhcHBlbmQgdGhlIHByb3BlcnR5XHJcbiAqXHJcbiAqICBAcmV0dXJuIHJldHVybnMgdGhlIGNoYW5nZWQgb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYXBwZW5kID0gZnVuY3Rpb24gKGFLZXksIGFEYXRhLCBhT2JqZWN0KSB7XHJcblx0aWYgKHR5cGVvZiBhRGF0YSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0Y29uc3QgcHJvcGVydHkgPSBPYmplY3RQcm9wZXJ0eS5sb2FkKGFPYmplY3QsIGFLZXksIHRydWUpO1xyXG5cdFx0cHJvcGVydHkuYXBwZW5kID0gYURhdGE7XHJcblx0fVxyXG5cdHJldHVybiBhT2JqZWN0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGNoZWNrZWQgaWYgYW4gb2JqZWN0IGEgc2ltcGxlIG9iamVjdC4gTm8gQXJyYXksIE1hcCBvciBzb21ldGhpbmcgZWxzZS5cclxuICpcclxuICogQHBhcmFtIGFPYmplY3Q6b2JqZWN0IHRoZSBvYmplY3QgdG8gYmUgdGVzdGluZ1xyXG4gKlxyXG4gKiBAcmV0dXJuIGJvb2xlYW5cclxuICovXHJcbmV4cG9ydCBjb25zdCBpc1Bvam8gPSBmdW5jdGlvbiAoYU9iamVjdCkge1xyXG5cdHJldHVybiB0eXBlb2YgYU9iamVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhT2JqZWN0ICE9IG51bGwgJiYgYU9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIG1lcmdpbmcgb2JqZWN0IGludG8gYSB0YXJnZXQgb2JqZWN0LiBJdHMgb25seSBtZXJnZSBzaW1wbGUgb2JqZWN0IGFuZCBzdWIgb2JqZWN0cy4gRXZlcnkgb3RoZXJcclxuICogdmFsdWUgd291bGQgYmUgcmVwbGFjZWQgYnkgdmFsdWUgZnJvbSB0aGUgc291cmNlIG9iamVjdC5cclxuICpcclxuICogc2FtcGxlOiBtZXJnZSh0YXJnZXQsIHNvdXJjZS0xLCBzb3VyY2UtMiwgLi4uc291cmNlLW4pXHJcbiAqXHJcbiAqIEBwYXJhbSBhVGFyZ2V0Om9iamVjdCB0aGUgdGFyZ2V0IG9iamVjdCB0byBtZXJnaW5nIGludG9cclxuICogQHBhcmFtIGFTb3VyY2VzOm9iamVjdFxyXG4gKlxyXG4gKiBAcmV0dXJuIG9iamVjdCByZXR1cm5zIHRoZSB0YXJnZXQgb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbWVyZ2UgPSBmdW5jdGlvbiAoYVRhcmdldCkge1xyXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcblx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2goKGFLZXkpID0+IHtcclxuXHRcdFx0aWYgKGlzUG9qbyhhVGFyZ2V0W2FLZXldKSkgbWVyZ2UoYVRhcmdldFthS2V5XSwgc291cmNlW2FLZXldKTtcclxuXHRcdFx0ZWxzZSBhVGFyZ2V0W2FLZXldID0gc291cmNlW2FLZXldO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gYVRhcmdldDtcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkUHJvcGVydHlGaWx0ZXIgPSBmdW5jdGlvbiAoeyBuYW1lcywgYWxsb3dlZCB9KSB7XHJcblx0cmV0dXJuIChuYW1lLCB2YWx1ZSwgY29udGV4dCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5hbWVzLmluY2x1ZGVzKG5hbWUpID09PSBhbGxvd2VkO1xyXG5cdH07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG5cdGNvbnN0IFtkYXRhLCBwcm9wRmlsdGVyLCB7IGRlZXAgPSBmYWxzZSwgcmVjdXJzaXZlID0gdHJ1ZSwgcGFyZW50cyA9IFtdIH0gPSB7fV0gPSBhcmd1bWVudHM7XHJcblx0Y29uc3QgcmVzdWx0ID0ge307XHJcblxyXG5cdGZvciAobGV0IG5hbWUgaW4gZGF0YSkge1xyXG5cdFx0Y29uc3QgdmFsdWUgPSBkYXRhW25hbWVdO1xyXG5cdFx0Y29uc3QgYWNjZXB0ID0gcHJvcEZpbHRlcihuYW1lLCB2YWx1ZSwgZGF0YSk7XHJcblx0XHRpZiAoYWNjZXB0ICYmICghZGVlcCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSkgcmVzdWx0W25hbWVdID0gdmFsdWU7XHJcblx0XHRlbHNlIGlmIChhY2NlcHQgJiYgZGVlcCkge1xyXG5cdFx0XHRjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xyXG5cdFx0XHRpZiAodHlwZSAhPT0gXCJvYmplY3RcIiB8fCB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5IHx8IHZhbHVlIGluc3RhbmNlb2YgTWFwIHx8IHZhbHVlIGluc3RhbmNlb2YgU2V0IHx8IHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwIHx8IHBhcmVudHMuaW5jbHVkZXNbdmFsdWVdIHx8IHZhbHVlID09IGRhdGEpIHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xyXG5cdFx0XHRlbHNlIHJlc3VsdFtuYW1lXSA9IGZpbHRlcih2YWx1ZSwgcHJvcEZpbHRlciwgeyBkZWVwLCByZWN1cnNpdmUsIHBhcmVudHM6IHBhcmVudHMuY29uY2F0KGRhdGEpIH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZWYWx1ZSA9IChvLCBuYW1lLCB2YWx1ZSkgPT4ge1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBuYW1lLCB7XHJcblx0XHR2YWx1ZSxcclxuXHRcdHdyaXRhYmxlOiBmYWxzZSxcclxuXHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcblx0XHRlbnVtZXJhYmxlOiBmYWxzZVxyXG5cdH0pO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVmR2V0ID0gKG8sIG5hbWUsIGdldCkgPT4ge1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBuYW1lLCB7XHJcblx0XHRnZXQsXHJcblx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxyXG5cdFx0ZW51bWVyYWJsZTogZmFsc2VcclxuXHR9KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZHZXRTZXQgPSAobywgbmFtZSwgZ2V0LCBzZXQpID0+IHtcclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobywgbmFtZSwge1xyXG5cdFx0Z2V0LFxyXG5cdFx0c2V0LFxyXG5cdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcclxuXHRcdGVudW1lcmFibGU6IGZhbHNlXHJcblx0fSk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0aXNQb2pvLFxyXG5cdGFwcGVuZCxcclxuXHRtZXJnZSxcclxuXHRmaWx0ZXIsXHJcblx0YnVpbGRQcm9wZXJ0eUZpbHRlcixcclxuXHRkZWZWYWx1ZSxcclxuXHRkZWZHZXQsXHJcblx0ZGVmR2V0U2V0XHJcbn07XHJcbiIsImNvbnN0IFBSSVZBVEVfUFJPUEVSVElFUyA9IG5ldyBXZWFrTWFwKCk7XHJcbmNvbnN0IHByaXZhdGVTdG9yZSA9IChvYmopID0+IHtcclxuXHRpZihQUklWQVRFX1BST1BFUlRJRVMuaGFzKG9iaikpXHJcblx0XHRyZXR1cm4gUFJJVkFURV9QUk9QRVJUSUVTLmdldChvYmopO1xyXG5cdFxyXG5cdGNvbnN0IGRhdGEgPSB7fTtcclxuXHRQUklWQVRFX1BST1BFUlRJRVMuc2V0KG9iaiwgZGF0YSk7XHJcblx0cmV0dXJuIGRhdGE7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcHJpdmF0ZVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBuYW1lLCB2YWx1ZSkge1xyXG5cdGNvbnN0IGRhdGEgPSBwcml2YXRlU3RvcmUob2JqKTtcclxuXHRpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKVxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0ZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKVxyXG5cdFx0cmV0dXJuIGRhdGFbbmFtZV07XHJcblx0ZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAzKVxyXG5cdFx0ZGF0YVtuYW1lXSA9IHZhbHVlO1xyXG5cdGVsc2VcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIk5vdCBhbGxvd2VkIHNpemUgb2YgYXJndW1lbnRzIVwiKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtwcml2YXRlUHJvcGVydHl9IiwiaW1wb3J0IHtkZWZWYWx1ZSwgZGVmR2V0fSBmcm9tIFwiLi9PYmplY3RVdGlsc1wiXHJcblxyXG5leHBvcnQgY29uc3QgdGltZW91dFByb21pc2UgPSAoZm4sIG1zKSA9PntcclxuXHRsZXQgY2FuY2VsZWQgPSBmYWxzZTtcclxuXHRsZXQgdGltZW91dCA9IG51bGw7XHJcblx0Y29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyLCBlKSA9PiB7XHJcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dCgoKT0+IHtcclxuXHRcdFx0dGltZW91dCA9IG51bGw7XHJcblx0XHRcdGZuKHIsZSk7XHJcblx0XHR9LCBtcylcclxuXHR9KTtcclxuXHJcblx0Y29uc3QgdGhlbiA9IHByb21pc2UudGhlbjtcclxuXHRwcm9taXNlLnRoZW4gPSAoZm4pID0+IHtcclxuXHRcdHRoZW4uY2FsbChwcm9taXNlLCAocmVzdWx0KSA9PiB7XHJcblx0XHRcdGlmKCF0aGlzLmNhbmNlbGVkKVxyXG5cdFx0XHRcdHJldHVybiBmbihyZXN1bHQpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkZWZWYWx1ZShwcm9taXNlLCBcImNhbmNlbFwiLCAoKSA9PiB7XHJcblx0XHRpZih0aW1lb3V0KXtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG5cdFx0XHRjYW5jZWxlZCA9IHRydWU7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0ZGVmR2V0KHByb21pc2UsIGNhbmNlbGQsICgpID0+IGNhbmNlbGVkKTtcclxuXHJcblx0cmV0dXJuIHByb21pc2U7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgbGF6eVByb21pc2UgPSAoKSA9PiB7XHJcblx0XHRsZXQgcHJvbWlzZVJlc29sdmUgPSBudWxsO1xyXG5cdFx0bGV0IHByb21pc2VFcnJvciA9IG51bGw7XHJcblxyXG5cdFx0Y29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyLCBlKSA9PiB7XHJcblx0XHRcdHByb21pc2VSZXNvbHZlID0gcjtcclxuXHRcdFx0cHJvbWlzZUVycm9yID0gZTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGxldCByZXNvbHZlZCA9IGZhbHNlO1xyXG5cdFx0bGV0IGVycm9yID0gZmFsc2U7XHJcblx0XHRsZXQgdmFsdWUgPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0ZGVmVmFsdWUocHJvbWlzZSwgXCJyZXNvbHZlXCIsIChyZXN1bHQpID0+IHtcclxuXHRcdFx0dmFsdWUgPSByZXN1bHQ7XHJcblx0XHRcdHJlc29sdmVkID0gdHJ1ZTtcclxuXHRcdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuXHRcdFx0XHRlcnJvciA9IHRydWU7XHJcblx0XHRcdFx0cHJvbWlzZUVycm9yKHZhbHVlKTtcclxuXHRcdFx0fSBlbHNlIHByb21pc2VSZXNvbHZlKHZhbHVlKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGRlZkdldChwcm9taXNlLCBcInZhbHVlXCIsICgpID0+IHZhbHVlKTtcclxuXHRcdGRlZkdldChwcm9taXNlLCBcImVycm9yXCIsICgpID0+IGVycm9yKTtcclxuXHRcdGRlZkdldChwcm9taXNlLCBcInJlc29sdmVkXCIsICgpID0+IHJlc29sdmVkKTtcclxuXHJcblx0XHRyZXR1cm4gcHJvbWlzZTtcclxufTtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG5cdGxhenlQcm9taXNlLFxyXG5cdHRpbWVvdXRQcm9taXNlXHJcbn1cclxuIiwiLy90aGUgc29sdXRpb24gaXMgZm91bmQgaGVyZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWRcclxuZXhwb3J0IGNvbnN0IFVVSURfU0NIRU1BID0gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIjtcclxuXHJcbmV4cG9ydCBjb25zdCB1dWlkID0gKCkgPT4ge1xyXG5cdGNvbnN0IGJ1ZiA9IG5ldyBVaW50MzJBcnJheSg0KTtcclxuXHR3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpO1xyXG5cdGxldCBpZHggPSAtMTtcclxuXHRyZXR1cm4gVVVJRF9TQ0hFTUEucmVwbGFjZSgvW3h5XS9nLCAoYykgPT4ge1xyXG5cdFx0aWR4Kys7XHJcblx0XHRjb25zdCByID0gKGJ1ZltpZHggPj4gM10gPj4gKChpZHggJSA4KSAqIDQpKSAmIDE1O1xyXG5cdFx0Y29uc3QgdiA9IGMgPT0gXCJ4XCIgPyByIDogKHIgJiAweDMpIHwgMHg4O1xyXG5cdFx0cmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG5cdH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgeyB1dWlkIH07XHJcbiIsImV4cG9ydCBjb25zdCBub1ZhbHVlID0gKHZhbHVlKSA9PiB7XG5cdHJldHVybiB2YWx1ZSA9PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIjtcbn07XG5cbmV4cG9ydCBjb25zdCBlbXRweU9yTm9WYWx1ZVN0cmluZyA9ICh2YWx1ZSkgPT4ge1x0XG5cdHJldHVybiBub1ZhbHVlKHZhbHVlKSB8fCB2YWx1ZS50cmltKCkubGVuZ3RoID09IDA7XG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bm9WYWx1ZSxcblx0ZW10cHlPck5vVmFsdWVTdHJpbmdcbn07IiwiaW1wb3J0IFwiLi9qYXZhc2NyaXB0XCI7XHJcbmltcG9ydCBPYmplY3RVdGlscyBmcm9tIFwiLi9PYmplY3RVdGlsc1wiO1xyXG5pbXBvcnQgR0xPQkFMIGZyb20gXCIuL0dsb2JhbFwiO1xyXG5pbXBvcnQgRXNjYXBlciBmcm9tIFwiLi9Fc2NhcGVyXCI7XHJcbmltcG9ydCBWYWx1ZUhlbHBlciBmcm9tIFwiLi9WYWx1ZUhlbHBlclwiO1xyXG5pbXBvcnQgUHJvbWlzZVV0aWxzIGZyb20gXCIuL1Byb21pc2VVdGlsc1wiO1xyXG5pbXBvcnQgUHJpdmF0ZVByb3BlcnR5IGZyb20gXCIuL1ByaXZhdGVQcm9wZXJ0eVwiO1xyXG5pbXBvcnQgVVVJRCBmcm9tIFwiLi9VVUlEXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0R0xPQkFMICxcclxuXHRPYmplY3RVdGlscyxcclxuXHRFc2NhcGVyLFxyXG5cdFZhbHVlSGVscGVyLFxyXG5cdFByb21pc2VVdGlscyxcclxuXHRQcml2YXRlUHJvcGVydHksXHJcblx0VVVJRFxyXG59OyIsImlmICghU3RyaW5nLnByb3RvdHlwZS5oYXNoY29kZSlcclxuXHRTdHJpbmcucHJvdG90eXBlLmhhc2hjb2RlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodGhpcy5sZW5ndGggPT09IDApXHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHJcblx0XHRsZXQgaGFzaCA9IDA7XHJcblx0XHRjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgYyA9IHRoaXMuY2hhckNvZGVBdChpKTtcclxuXHRcdFx0aGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgYztcclxuXHRcdFx0aGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcclxuXHRcdH1cclxuXHRcdHJldHVybiBoYXNoO1xyXG5cdH07IiwiaW1wb3J0IFJlcXVlc3RlciBmcm9tIFwiLi9zcmMvUmVxdWVzdGVyXCJcbmV4cG9ydCB7UmVxdWVzdGVyfTsiLCJpbXBvcnQgUmVzb2x2ZXIgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHByZXNzaW9uLWxhbmd1YWdlL3NyYy9FeHByZXNzaW9uUmVzb2x2ZXJcIjtcclxuXHJcbmNvbnN0IGJ1aWxkVVJMID0gYXN5bmMgKGNvbnRleHQsIHVybCwgc2VhcmNoLCBoYXNoKSA9PiB7XHJcblx0Y29uc3QgcmVzdWx0ID0gbmV3IFVSTChhd2FpdCBSZXNvbHZlci5yZXNvbHZlVGV4dCh1cmwsIGNvbnRleHQsIHVybCksIGxvY2F0aW9uLmhyZWYpO1xyXG5cclxuXHRpZiAoc2VhcmNoKSB7XHJcblx0XHRpZiAoIXJlc3VsdC5zZWFyY2hQYXJhbXMpIHJlc3VsdC5zZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XHJcblx0XHRjb25zdCBwYXJhbXMgPSByZXN1bHQuc2VhcmNoUGFyYW1zO1xyXG5cclxuXHRcdGZvciAobGV0IGtleSBpbiBzZWFyY2gpIHtcclxuXHRcdFx0Y29uc3QgdmFsdWUgPSBzZWFyY2hba2V5XTtcclxuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgcGFyYW1zLmFwcGVuZChrZXksIGF3YWl0IFJlc29sdmVyLnJlc29sdmVUZXh0KHZhbHVlLCBjb250ZXh0LCB2YWx1ZSkpO1xyXG5cdFx0XHRlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaXRlbSBvZiB2YWx1ZSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKSBwYXJhbXMuYXBwZW5kKGtleSwgYXdhaXQgUmVzb2x2ZXIucmVzb2x2ZVRleHQoaXRlbSwgY29udGV4dCwgaXRlbSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKGhhc2gpIHJlc3VsdC5oYXNoID0gaGFzaDtcclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkTWV0aG9kID0gYXN5bmMgKGNvbnRleHQsIG1ldGhvZCkgPT4ge1xyXG5cdGlmIChtZXRob2QgJiYgdHlwZW9mIG1ldGhvZCA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIFJlc29sdmVyLnJlc29sdmVUZXh0KG1ldGhvZCwgY29udGV4dCwgbWV0aG9kKTtcclxuXHJcblx0cmV0dXJuIFwiZ2V0XCI7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZEhlYWRlcnMgPSBhc3luYyAoY29udGV4dCwgaGVhZGVycykgPT4ge1xyXG5cdGNvbnN0IHJlc3VsdCA9IG5ldyBIZWFkZXJzKCk7XHJcblx0aWYgKGhlYWRlcnMpIHtcclxuXHRcdGZvciAobGV0IGtleSBpbiBoZWFkZXJzKSB7XHJcblx0XHRcdGNvbnN0IHZhbHVlID0gaGVhZGVyc1trZXldO1xyXG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSByZXN1bHQuYXBwZW5kKGtleSwgYXdhaXQgUmVzb2x2ZXIucmVzb2x2ZVRleHQodmFsdWUsIGNvbnRleHQsIHZhbHVlKSk7XHJcblx0XHRcdGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpdGVtIG9mIHZhbHVlKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0gPT09IFwic3RyaW5nXCIpIHJlc3VsdC5hcHBlbmQoa2V5LCBhd2FpdCBSZXNvbHZlci5yZXNvbHZlVGV4dChpdGVtLCBjb250ZXh0LCBpdGVtKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRCb2R5ID0gYXN5bmMgKGNvbnRleHQsIGJvZHkpID0+IHtcclxuXHRpZiAoYm9keSAmJiB0eXBlb2YgYm9keSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIFJlc29sdmVyLnJlc29sdmVUZXh0KGJvZHksIGNvbnRleHQsIGJvZHkpO1xyXG5cclxuXHRyZXR1cm4gYm9keTtcclxufTtcclxuXHJcbmNsYXNzIFJlcXVlc3RlciB7XHJcblx0Y29uc3RydWN0b3IoeyB1cmwsIG1ldGhvZCA9IFwiZ2V0XCIsIHNlYXJjaCwgaGFzaCwgaGVhZGVycywgYm9keSwgY3JlZGVudGlhbHMsIG1vZGUsIGNhY2hlLCByZWRpcmVjdCwgcmVmZXJyZXIsIHJlZmVycmVyUG9saWN5IH0pIHtcclxuXHRcdHRoaXMudXJsID0gdXJsO1xyXG5cdFx0dGhpcy5tZXRob2QgPSBtZXRob2Q7XHJcblx0XHR0aGlzLnNlYXJjaCA9IHNlYXJjaDtcclxuXHRcdHRoaXMuaGFzaCA9IGhhc2g7XHJcblx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG5cdFx0dGhpcy5ib2R5ID0gYm9keTtcclxuXHRcdHRoaXMuY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscztcclxuXHRcdHRoaXMubW9kZSA9IG1vZGU7XHJcblx0XHR0aGlzLmNhY2hlID0gY2FjaGU7XHJcblx0XHR0aGlzLnJlZGlyZWN0ID0gcmVkaXJlY3Q7XHJcblx0XHR0aGlzLnJlZmVycmVyID0gcmVmZXJyZXI7XHJcblx0XHR0aGlzLnJlZmVycmVyUG9saWN5ID0gcmVmZXJyZXJQb2xpY3k7XHJcblx0fVxyXG5cclxuXHRhc3luYyBidWlsZFJlcXVlc3QoeyBjb250ZXh0IH0pIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHVybDogYXdhaXQgYnVpbGRVUkwoY29udGV4dCwgdGhpcy51cmwsIHRoaXMuc2VhcmNoLCB0aGlzLmhhc2gpLFxyXG5cdFx0XHRtZXRob2Q6IGF3YWl0IGJ1aWxkTWV0aG9kKGNvbnRleHQsIHRoaXMubWV0aG9kKSxcclxuXHRcdFx0aGVhZGVyczogYXdhaXQgYnVpbGRIZWFkZXJzKGNvbnRleHQsIHRoaXMuaGVhZGVycyksXHJcblx0XHRcdGJvZHk6IGF3YWl0IGJ1aWxkQm9keShjb250ZXh0LCB0aGlzLmJvZHkpLFxyXG5cdFx0XHRjcmVkZW50aWFsczogYXdhaXQgUmVzb2x2ZXIucmVzb2x2ZVRleHQodGhpcy5jcmVkZW50aWFscywgY29udGV4dCwgdGhpcy5jcmVkZW50aWFscyksXHJcblx0XHRcdG1vZGU6IGF3YWl0IFJlc29sdmVyLnJlc29sdmVUZXh0KHRoaXMubW9kZSwgY29udGV4dCwgdGhpcy5tb2RlKSxcclxuXHRcdFx0Y2FjaGU6IGF3YWl0IFJlc29sdmVyLnJlc29sdmVUZXh0KHRoaXMuY2FjaGUsIGNvbnRleHQsIHRoaXMuY2FjaGUpLFxyXG5cdFx0XHRyZWRpcmVjdDogYXdhaXQgUmVzb2x2ZXIucmVzb2x2ZVRleHQodGhpcy5yZWRpcmVjdCwgY29udGV4dCwgdGhpcy5yZWRpcmVjdCksXHJcblx0XHRcdHJlZmVycmVyOiBhd2FpdCBSZXNvbHZlci5yZXNvbHZlVGV4dCh0aGlzLnJlZmVycmVyLCBjb250ZXh0LCB0aGlzLnJlZmVycmVyKSxcclxuXHRcdFx0cmVmZXJyZXJQb2xpY3k6IGF3YWl0IFJlc29sdmVyLnJlc29sdmVUZXh0KHRoaXMucmVmZXJyZXJQb2xpY3ksIGNvbnRleHQsIHRoaXMucmVmZXJyZXJQb2xpY3kpLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGV4ZWN1dGUoeyBjb250ZXh0IH0pIHtcclxuXHRcdGNvbnN0IHsgdXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHksIGNyZWRlbnRpYWxzLCBtb2RlLCBjYWNoZSwgcmVkaXJlY3QsIHJlZmVycmVyLCByZWZlcnJlclBvbGljeSB9ID0gYXdhaXQgdGhpcy5idWlsZFJlcXVlc3QoeyBjb250ZXh0IH0pO1xyXG5cclxuXHRcdHJldHVybiBmZXRjaCh1cmwudG9TdHJpbmcoKSwgeyBtZXRob2QsIGhlYWRlcnMsIGJvZHksIGNyZWRlbnRpYWxzLCBtb2RlLCBjYWNoZSwgcmVkaXJlY3QsIHJlZmVycmVyLCByZWZlcnJlclBvbGljeSB9KTtcclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgUmVxdWVzdGVyO1xyXG4iLCJpbXBvcnQgcGFjayBmcm9tIFwiLi9zcmNcIlxyXG5pbXBvcnQgR0xPQkFMIGZyb20gXCJAbW9kdWxlcy9AZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWxcIjtcclxuXHJcblxyXG5HTE9CQUwuZGVmYXVsdGpzID0gR0xPQkFMLmRlZmF1bHRqcyB8fCB7fTtcclxuR0xPQkFMLmRlZmF1bHRqcy5lbCA9IEdMT0JBTC5kZWZhdWx0anMuZWwgfHwgKCgpID0+IHtcclxuXHRwYWNrLlZFUlNJT04gPSBcIiR7dmVyc2lvbn1cIjtcclxuXHRyZXR1cm4gcGFjaztcclxufSkoKTsiLCJjb25zdCBHTE9CQUwgPSAoKCkgPT4ge1xyXG5cdGlmKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBnbG9iYWw7XHJcblx0aWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIHdpbmRvdztcdFxyXG5cdGlmKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gc2VsZjtcclxuXHRyZXR1cm4ge307XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHTE9CQUw7IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JqZWN0UHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihrZXksIGNvbnRleHQpe1xuXHRcdHRoaXMua2V5ID0ga2V5O1xuXHRcdHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cdH1cblx0XG5cdGdldCBrZXlEZWZpbmVkKCl7XG5cdFx0cmV0dXJuIHRoaXMua2V5IGluIHRoaXMuY29udGV4dDsgXG5cdH1cblx0XG5cdGdldCBoYXNWYWx1ZSgpe1xuXHRcdHJldHVybiAhIXRoaXMuY29udGV4dFt0aGlzLmtleV07XG5cdH1cblx0XG5cdGdldCB2YWx1ZSgpe1xuXHRcdHJldHVybiB0aGlzLmNvbnRleHRbdGhpcy5rZXldO1xuXHR9XG5cdFxuXHRzZXQgdmFsdWUoZGF0YSl7XG5cdFx0dGhpcy5jb250ZXh0W3RoaXMua2V5XSA9IGRhdGE7XG5cdH1cblx0XG5cdHNldCBhcHBlbmQoZGF0YSkge1xuXHRcdGlmKCF0aGlzLmhhc1ZhbHVlKVxuXHRcdFx0dGhpcy52YWx1ZSA9IGRhdGE7XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRpZih2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KVxuXHRcdFx0XHR2YWx1ZS5wdXNoKGRhdGEpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLnZhbHVlID0gW3RoaXMudmFsdWUsIGRhdGFdO1xuXHRcdH1cblx0fVxuXHRcblx0cmVtb3ZlKCl7XG5cdFx0ZGVsZXRlIHRoaXMuY29udGV4dFt0aGlzLmtleV07XG5cdH1cblx0XG5cdHN0YXRpYyBsb2FkKGRhdGEsIGtleSwgY3JlYXRlPXRydWUpIHtcblx0XHRsZXQgY29udGV4dCA9IGRhdGE7XG5cdFx0Y29uc3Qga2V5cyA9IGtleS5zcGxpdChcIlxcLlwiKTtcblx0XHRsZXQgbmFtZSA9IGtleXMuc2hpZnQoKS50cmltKCk7XG5cdFx0d2hpbGUoa2V5cy5sZW5ndGggPiAwKXtcblx0XHRcdGlmKCFjb250ZXh0W25hbWVdKXtcblx0XHRcdFx0aWYoIWNyZWF0ZSlcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XG5cdFx0XHRcdGNvbnRleHRbbmFtZV0gPSB7fVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRjb250ZXh0ID0gY29udGV4dFtuYW1lXTtcblx0XHRcdG5hbWUgPSBrZXlzLnNoaWZ0KCkudHJpbSgpO1xuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gbmV3IE9iamVjdFByb3BlcnR5KG5hbWUsIGNvbnRleHQpO1xuXHR9XG59OyIsImltcG9ydCBPYmplY3RQcm9wZXJ0eSBmcm9tIFwiLi9PYmplY3RQcm9wZXJ0eS5qc1wiO1xyXG4vKipcclxuICogYXBwZW5kIGEgcHJvcGVyeSB2YWx1ZSB0byBhbiBvYmplY3QuIElmIHByb3BlcnkgZXhpc3RzIGl0cyB3b3VsZCBiZSBjb252ZXJ0ZWQgdG8gYW4gYXJyYXlcclxuICogXHJcbiAqICBAcGFyYW0gYUtleTpzdHJpbmcgbmFtZSBvZiBwcm9wZXJ0eVxyXG4gKiAgQHBhcmFtIGFEYXRhOmFueSBwcm9wZXJ0eSB2YWx1ZVxyXG4gKiAgQHBhcmFtIGFPYmplY3Q6b2JqZWN0IHRoZSBvYmplY3QgdG8gYXBwZW5kIHRoZSBwcm9wZXJ0eVxyXG4gKiAgXHJcbiAqICBAcmV0dXJuIHJldHVybnMgdGhlIGNoYW5nZWQgb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYXBwZW5kID0gZnVuY3Rpb24oYUtleSwgYURhdGEsIGFPYmplY3QpIHtcclxuXHRpZiAodHlwZW9mIGFEYXRhICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRjb25zdCBwcm9wZXJ0eSA9IE9iamVjdFByb3BlcnR5LmxvYWQoYU9iamVjdCwgYUtleSwgdHJ1ZSlcclxuXHRcdHByb3BlcnR5LmFwcGVuZCA9IGFEYXRhO1xyXG5cdH1cclxuXHRyZXR1cm4gYU9iamVjdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBjaGVja2VkIGlmIGFuIG9iamVjdCBhIHNpbXBsZSBvYmplY3QuIE5vIEFycmF5LCBNYXAgb3Igc29tZXRoaW5nIGVsc2UuXHJcbiAqIFxyXG4gKiBAcGFyYW0gYU9iamVjdDpvYmplY3QgdGhlIG9iamVjdCB0byBiZSB0ZXN0aW5nXHJcbiAqIFxyXG4gKiBAcmV0dXJuIGJvb2xlYW5cclxuICovXHJcbmV4cG9ydCBjb25zdCBpc1Bvam8gPSBmdW5jdGlvbihhT2JqZWN0KSB7XHJcblx0cmV0dXJuIHR5cGVvZiBhT2JqZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIGFPYmplY3QgIT0gbnVsbCAmJiBhT2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiT2JqZWN0XCJcclxufVxyXG5cclxuLyoqXHJcbiAqIG1lcmdpbmcgb2JqZWN0IGludG8gYSB0YXJnZXQgb2JqZWN0LiBJdHMgb25seSBtZXJnZSBzaW1wbGUgb2JqZWN0IGFuZCBzdWIgb2JqZWN0cy4gRXZlcnkgb3RoZXIgXHJcbiAqIHZhbHVlIHdvdWxkIGJlIHJlcGxhY2VkIGJ5IHZhbHVlIGZyb20gdGhlIHNvdXJjZSBvYmplY3QuXHJcbiAqIFxyXG4gKiBzYW1wbGU6IG1lcmdlKHRhcmdldCwgc291cmNlLTEsIHNvdXJjZS0yLCAuLi5zb3VyY2UtbilcclxuICogXHJcbiAqIEBwYXJhbSBhVGFyZ2V0Om9iamVjdCB0aGUgdGFyZ2V0IG9iamVjdCB0byBtZXJnaW5nIGludG9cclxuICogQHBhcmFtIGFTb3VyY2VzOm9iamVjdFxyXG4gKiBcclxuICogQHJldHVybiBvYmplY3QgcmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG1lcmdlID0gZnVuY3Rpb24oYVRhcmdldCkge1xyXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcblx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2goYUtleSA9PiB7XHJcblx0XHRcdGlmIChpc1Bvam8oYVRhcmdldFthS2V5XSkpXHJcblx0XHRcdFx0bWVyZ2UoYVRhcmdldFthS2V5XSwgc291cmNlW2FLZXldKTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGFUYXJnZXRbYUtleV0gPSBzb3VyY2VbYUtleV07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBhVGFyZ2V0O1xyXG59XHJcblxyXG5cclxuXHJcbmNvbnN0IGJ1aWxkUHJvcGVydHlGaWx0ZXIgPSBmdW5jdGlvbih7IG5hbWVzLCBhbGxvd2VkIH0pIHtcclxuXHRyZXR1cm4gKG5hbWUsIHZhbHVlLCBjb250ZXh0KSA9PiB7XHJcblx0XHRyZXR1cm4gbmFtZXMuaW5jbHVkZXMobmFtZSkgPT09IGFsbG93ZWQ7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSBmdW5jdGlvbigpIHtcclxuXHRjb25zdCBbZGF0YSwgcHJvcEZpbHRlciwge2RlZXAgPSBmYWxzZSwgcmVjdXJzaXZlID0gdHJ1ZSwgcGFyZW50cyA9IFtdfSA9IHt9XSA9IGFyZ3VtZW50cztcclxuXHRjb25zdCByZXN1bHQgPSB7fTtcclxuXHJcblx0Zm9yIChuYW1lIGluIGRhdGEpIHtcclxuXHRcdGNvbnN0IHZhbHVlID0gZGF0YVtuYW1lXTtcclxuXHRcdGNvbnN0IGFjY2VwdCA9IHByb3BGaWx0ZXIobmFtZSwgdmFsdWUsIGRhdGEpO1xyXG5cdFx0aWYgKGFjY2VwdCAmJiAoIWRlZXAgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkpXHJcblx0XHRcdHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xyXG5cdFx0ZWxzZSBpZiAoYWNjZXB0ICYmIGRlZXApIHtcclxuXHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcclxuXHRcdFx0aWYgKHR5cGUgIT09IFwib2JqZWN0XCJcclxuXHRcdFx0XHR8fCB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRcdFx0fHwgdmFsdWUgaW5zdGFuY2VvZiBNYXBcclxuXHRcdFx0XHR8fCB2YWx1ZSBpbnN0YW5jZW9mIFNldFxyXG5cdFx0XHRcdHx8IHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwXHJcblx0XHRcdFx0fHwgcGFyZW50cy5pbmNsdWRlc1t2YWx1ZV1cclxuXHRcdFx0XHR8fCB2YWx1ZSA9PSBkYXRhKVxyXG5cdFx0XHRcdHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVzdWx0W25hbWVdID0gZmlsdGVyKHZhbHVlLCBwcm9wRmlsdGVyLCB7ZGVlcCwgcmVjdXJzaXZlLCBwYXJlbnRzOiAgcGFyZW50cy5jb25jYXQoZGF0YSl9KTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0aXNQb2pvLFxyXG5cdGFwcGVuZCxcclxuXHRtZXJnZSxcclxuXHRmaWx0ZXIsXHJcblx0YnVpbGRQcm9wZXJ0eUZpbHRlclxyXG59OyIsImNvbnN0IHNlZWtBdENoYWluID0gKHJlc29sdmVyLCBwcm9wZXJ0eSkgPT4ge1xuXHR3aGlsZShyZXNvbHZlcil7XG5cdFx0Y29uc3QgZGVmID0gcmVzb2x2ZXIucHJveHkuaGFuZGxlLmdldFByb3BlcnR5RGVmKHByb3BlcnR5LCBmYWxzZSk7XG5cdFx0aWYoZGVmKVxuXHRcdFx0cmV0dXJuIGRlZjtcblx0XHRcblx0XHRyZXNvbHZlciA9IHJlc29sdmVyLnBhcmVudDtcblx0fVx0XG5cdHJldHVybiB7IGRhdGE6IG51bGwsIHJlc29sdmVyOiBudWxsLCBkZWZpbmVkOiBmYWxzZSB9O1xufVxuXG5jbGFzcyBIYW5kbGUge1xuXHRjb25zdHJ1Y3RvcihkYXRhLCByZXNvbHZlcikge1xuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0dGhpcy5yZXNvbHZlciA9IHJlc29sdmVyO1xuXHRcdHRoaXMuY2FjaGUgPSBuZXcgTWFwKCk7XG5cdH1cblx0XG5cdHVwZGF0ZURhdGEoZGF0YSl7XG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcblx0XHR0aGlzLmNhY2hlID0gbmV3IE1hcCgpO1xuXHR9XG5cdFxuXHRyZXNldENhY2hlKCl7XG5cdFx0dGhpcy5jYWNoZSA9IG5ldyBNYXAoKTtcblx0fVxuXG5cdGdldFByb3BlcnR5RGVmKHByb3BlcnR5LCBzZWVrID0gdHJ1ZSkge1xuXHRcdGlmICh0aGlzLmNhY2hlLmhhcyhwcm9wZXJ0eSkpXG5cdFx0XHRyZXR1cm4gdGhpcy5jYWNoZS5nZXQocHJvcGVydHkpO1xuXHRcdFxuXHRcdGxldCBkZWYgPSBudWxsXG5cdFx0aWYgKHRoaXMuZGF0YSAmJiBwcm9wZXJ0eSBpbiB0aGlzLmRhdGEpXG5cdFx0XHRkZWYgPSB7IGRhdGE6IHRoaXMuZGF0YSwgcmVzb2x2ZXI6IHRoaXMucmVzb2x2ZXIsIGRlZmluZWQ6IHRydWUgfTtcblx0XHRlbHNlIGlmKHNlZWspXG5cdFx0XHRkZWYgPSBzZWVrQXRDaGFpbih0aGlzLnJlc29sdmVyLnBhcmVudCwgcHJvcGVydHkpO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdGlmKGRlZi5kZWZpbmVkKVxuXHRcdFx0dGhpcy5jYWNoZS5zZXQocHJvcGVydHksIGRlZik7XG5cdFx0cmV0dXJuIGRlZjtcblx0fVxuXG5cdGhhc1Byb3BlcnR5KHByb3BlcnR5KSB7XG5cdFx0Ly9AVE9ETyB3cml0ZSB0ZXN0cyEhIVxuXHRcdGNvbnN0IHsgZGVmaW5lZCB9ID0gdGhpcy5nZXRQcm9wZXJ0eURlZihwcm9wZXJ0eSk7XG5cdFx0cmV0dXJuIGRlZmluZWQ7XG5cdH1cblx0Z2V0UHJvcGVydHkocHJvcGVydHkpIHtcblx0XHQvL0BUT0RPIHdyaXRlIHRlc3RzISEhXHRcblx0XHRjb25zdCB7IGRhdGEgfSA9IHRoaXMuZ2V0UHJvcGVydHlEZWYocHJvcGVydHkpO1xuXHRcdHJldHVybiBkYXRhID8gZGF0YVtwcm9wZXJ0eV0gOiB1bmRlZmluZWQ7XG5cdH1cblx0c2V0UHJvcGVydHkocHJvcGVydHksIHZhbHVlKSB7XG5cdFx0Ly9AVE9ETyB3b3VsZCBzdXBwb3J0IHRoaXMgYWN0aW9uIG9uIGFuIHByb3hpZWQgcmVzb2x2ZXIgY29udGV4dD8/PyB3cml0ZSB0ZXN0cyEhIVxuXHRcdGNvbnN0IHsgZGF0YSwgZGVmaW5lZCB9ID0gdGhpcy5nZXRQcm9wZXJ0eURlZihwcm9wZXJ0eSk7XG5cdFx0aWYgKGRlZmluZWQpXG5cdFx0XHRkYXRhW3Byb3BlcnR5XSA9IHZhbHVlO1xuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKHRoaXMuZGF0YSlcblx0XHRcdFx0dGhpcy5kYXRhW3Byb3BlcnR5XSA9IHZhbHVlO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuZGF0YSA9IHt9XG5cdFx0XHRcdHRoaXMuZGF0YVtwcm9wZXJ0eV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHRcdHRoaXMuY2FjaGUuc2V0KHByb3BlcnR5LCB7IGRhdGE6IHRoaXMuZGF0YSwgcmVzb2x2ZXI6IHRoaXMucmVzb2x2ZXIsIGRlZmluZWQ6IHRydWUgfSk7XG5cdFx0fVxuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHByb3BlcnR5KSB7XG5cdFx0Ly9AVE9ETyB3b3VsZCBzdXBwb3J0IHRoaXMgYWN0aW9uIG9uIGFuIHByb3hpZWQgcmVzb2x2ZXIgY29udGV4dD8/PyB3cml0ZSB0ZXN0cyEhIVx0XHRcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ1bnN1cHBvcnRlZCBmdW5jdGlvbiFcIilcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0IHtcblx0Y29uc3RydWN0b3IoY29udGV4dCwgcmVzb2x2ZXIpIHtcblx0XHR0aGlzLmhhbmRsZSA9IG5ldyBIYW5kbGUoY29udGV4dCwgcmVzb2x2ZXIpO1x0XHRcblx0XHR0aGlzLmRhdGEgPSBuZXcgUHJveHkodGhpcy5oYW5kbGUsIHtcblx0XHRcdGhhczogZnVuY3Rpb24oZGF0YSwgcHJvcGVydHkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGEuaGFzUHJvcGVydHkocHJvcGVydHkpO1xuXHRcdFx0fSxcblx0XHRcdGdldDogZnVuY3Rpb24oZGF0YSwgcHJvcGVydHkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGEuZ2V0UHJvcGVydHkocHJvcGVydHkpO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24oZGF0YSwgcHJvcGVydHksIHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiBkYXRhLnNldFByb3BlcnR5KHByb3BlcnR5LCB2YWx1ZSk7XG5cdFx0XHR9LFxuXHRcdFx0ZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uKGRhdGEsIHByb3BlcnR5KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhLmRlbGV0ZVByb3BlcnR5KHByb3BlcnR5KTtcblx0XHRcdH1cblx0XHRcdC8vQFRPRE8gbmVlZCB0byBzdXBwb3J0IHRoZSBvdGhlciBwcm94eSBhY3Rpb25zXHRcdFxuXHRcdH0pOztcblx0fVxuXHRcblx0dXBkYXRlRGF0YShkYXRhKXtcblx0XHR0aGlzLmhhbmRsZS51cGRhdGVEYXRhKGRhdGEpXHRcdFxuXHR9XG5cdFxuXHRyZXNldENhY2hlKCl7XG5cdFx0dGhpcy5oYW5kbGUucmVzZXRDYWNoZSgpO1xuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIERlZmF1bHRWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlKXtcblx0XHR0aGlzLmhhc1ZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA9PSAxO1xuXHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0fVx0XG59OyIsImltcG9ydCBHTE9CQUwgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL0dsb2JhbC5qc1wiXHJcbmltcG9ydCBPYmplY3RQcm9wZXJ0eSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvT2JqZWN0UHJvcGVydHkuanNcIjtcclxuaW1wb3J0IE9iamVjdFV0aWxzIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9PYmplY3RVdGlscy5qc1wiXHJcbmltcG9ydCBEZWZhdWx0VmFsdWUgZnJvbSBcIi4vRGVmYXVsdFZhbHVlLmpzXCI7XHJcbmltcG9ydCBDb250ZXh0IGZyb20gXCIuL0NvbnRleHQuanNcIjtcclxuXHJcblxyXG5jb25zdCBFWEVDVVRJT05fV0FSTl9USU1FT1VUID0gMTAwMDtcclxuY29uc3QgRVhQUkVTU0lPTiA9IC8oXFxcXD8pKFxcJFxceygoW2EtekEtWjAtOVxcLV9cXHNdKyk6Oik/KFteXFx7XFx9XSspXFx9KS87XHJcbmNvbnN0IE1BVENIX0VTQ0FQRUQgPSAxO1xyXG5jb25zdCBNQVRDSF9GVUxMX0VYUFJFU1NJT04gPSAyO1xyXG5jb25zdCBNQVRDSF9FWFBSRVNTSU9OX1NDT1BFID0gNDtcclxuY29uc3QgTUFUQ0hfRVhQUkVTU0lPTl9TVEFURU1FTlQgPSA1O1xyXG5cclxuY29uc3QgREVGQVVMVF9OT1RfREVGSU5FRCA9IG5ldyBEZWZhdWx0VmFsdWUoKTtcclxuY29uc3QgdG9EZWZhdWx0VmFsdWUgPSB2YWx1ZSA9PiB7XHJcblx0aWYgKHZhbHVlIGluc3RhbmNlb2YgRGVmYXVsdFZhbHVlKVxyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cclxuXHRyZXR1cm4gbmV3IERlZmF1bHRWYWx1ZSh2YWx1ZSk7XHJcbn07XHJcblxyXG5jb25zdCBleGVjdXRlID0gYXN5bmMgZnVuY3Rpb24oYVN0YXRlbWVudCwgYUNvbnRleHQpIHtcclxuXHRpZiAodHlwZW9mIGFTdGF0ZW1lbnQgIT09IFwic3RyaW5nXCIpXHJcblx0XHRyZXR1cm4gYVN0YXRlbWVudDtcclxuXHRcdFxyXG5cdGNvbnN0IGV4cHJlc3Npb24gPSBuZXcgRnVuY3Rpb24oXCJjb250ZXh0XCIsIFxyXG5gXHJcbnJldHVybiAoYXN5bmMgKGNvbnRleHQpID0+IHtcclxuXHR0cnl7IFxyXG5cdFx0d2l0aChjb250ZXh0KXtcclxuXHRcdFx0IHJldHVybiAke2FTdGF0ZW1lbnR9XHJcblx0XHR9XHJcblx0fWNhdGNoKGUpe1xyXG5cdFx0dGhyb3cgZTtcclxuXHR9XHJcbn0pKGNvbnRleHQpYFxyXG5cdCk7XHJcblx0XHJcblx0bGV0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdHRpbWVvdXQgPSBudWxsO1xyXG5cdFx0Y29uc29sZS53YXJuKFwibG9uZyBydW5uaW5nIHN0YXRlbWVudDpcIiwgYVN0YXRlbWVudCwgbmV3IEVycm9yKCkpO1xyXG5cdH0sIEVYRUNVVElPTl9XQVJOX1RJTUVPVVQpXHJcblx0bGV0IHJlc3VsdCA9IHVuZGVmaW5lZDtcclxuXHR0cnl7XHJcblx0XHRyZXN1bHQgPSBhd2FpdCBleHByZXNzaW9uKGFDb250ZXh0KTtcclxuXHR9Y2F0Y2goZSl7fVxyXG5cdFxyXG5cdGlmKHRpbWVvdXQpXHJcblx0XHRjbGVhclRpbWVvdXQodGltZW91dClcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuY29uc3QgcmVzb2x2ZSA9IGFzeW5jIGZ1bmN0aW9uKGFSZXNvbHZlciwgYUV4cHJlc3Npb24sIGFGaWx0ZXIsIGFEZWZhdWx0KSB7XHJcblx0aWYgKGFGaWx0ZXIgJiYgYVJlc29sdmVyLm5hbWUgIT0gYUZpbHRlcilcclxuXHRcdHJldHVybiBhUmVzb2x2ZXIucGFyZW50ID8gcmVzb2x2ZShhUmVzb2x2ZXIucGFyZW50LCBhRXhwcmVzc2lvbiwgYUZpbHRlciwgYURlZmF1bHQpIDogbnVsbDtcclxuXHRcclxuXHRjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKGFFeHByZXNzaW9uLCBhUmVzb2x2ZXIucHJveHkuZGF0YSk7XHJcblx0aWYgKHJlc3VsdCAhPT0gbnVsbCAmJiB0eXBlb2YgcmVzdWx0ICE9PSBcInVuZGVmaW5lZFwiKVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHJcblx0ZWxzZSBpZiAoYURlZmF1bHQgaW5zdGFuY2VvZiBEZWZhdWx0VmFsdWUgJiYgYURlZmF1bHQuaGFzVmFsdWUpXHJcblx0XHRyZXR1cm4gYURlZmF1bHQudmFsdWU7XHJcbn07XHJcblxyXG5jb25zdCByZXNvbHZlTWF0Y2ggPSBhc3luYyAocmVzb2x2ZXIsIG1hdGNoLCBkZWZhdWx0VmFsdWUpID0+IHtcclxuXHRpZihtYXRjaFtNQVRDSF9FU0NBUEVEXSlcclxuXHRcdHJldHVybiBtYXRjaFtNQVRDSF9GVUxMX0VYUFJFU1NJT05dOyBcclxuXHRcdFxyXG5cdHJldHVybiByZXNvbHZlKHJlc29sdmVyLCBtYXRjaFtNQVRDSF9FWFBSRVNTSU9OX1NUQVRFTUVOVF0sIG5vcm1hbGl6ZShtYXRjaFtNQVRDSF9FWFBSRVNTSU9OX1NDT1BFXSksIGRlZmF1bHRWYWx1ZSk7XHJcbn1cclxuXHJcbmNvbnN0IG5vcm1hbGl6ZSA9IHZhbHVlID0+IHtcclxuXHRpZiAodmFsdWUpIHtcclxuXHRcdHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG5cdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCA9PSAwID8gbnVsbCA6IHZhbHVlO1xyXG5cdH1cclxuXHRyZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cHJlc3Npb25SZXNvbHZlciB7XHJcblx0Y29uc3RydWN0b3IoeyBjb250ZXh0ID0gR0xPQkFMLCBwYXJlbnQgPSBudWxsLCBuYW1lID0gbnVsbCB9KSB7XHJcblx0XHR0aGlzLnBhcmVudCA9IChwYXJlbnQgaW5zdGFuY2VvZiBFeHByZXNzaW9uUmVzb2x2ZXIpID8gcGFyZW50IDogbnVsbDtcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG5cdFx0dGhpcy5wcm94eSA9IG5ldyBDb250ZXh0KHRoaXMuY29udGV4dCwgdGhpcyk7XHJcblx0fVxyXG5cclxuXHRnZXQgY2hhaW4oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5jaGFpbiArIFwiL1wiICsgdGhpcy5uYW1lIDogXCIvXCIgKyB0aGlzLm5hbWU7XHJcblx0fVxyXG5cclxuXHRnZXQgZWZmZWN0aXZlQ2hhaW4oKSB7XHJcblx0XHRpZiAoIXRoaXMuY29udGV4dClcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuZWZmZWN0aXZlQ2hhaW4gOiBcIlwiO1xyXG5cdFx0cmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuZWZmZWN0aXZlQ2hhaW4gKyBcIi9cIiArIHRoaXMubmFtZSA6IFwiL1wiICsgdGhpcy5uYW1lO1xyXG5cdH1cclxuXHJcblx0Z2V0IGNvbnRleHRDaGFpbigpIHtcclxuXHRcdGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cdFx0bGV0IHJlc29sdmVyID0gdGhpcztcclxuXHRcdHdoaWxlIChyZXNvbHZlcikge1xyXG5cdFx0XHRpZiAocmVzb2x2ZXIuY29udGV4dClcclxuXHRcdFx0XHRyZXN1bHQucHVzaChyZXNvbHZlci5jb250ZXh0KTtcclxuXHJcblx0XHRcdHJlc29sdmVyID0gcmVzb2x2ZXIucGFyZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fVxyXG5cclxuXHRnZXREYXRhKGtleSwgZmlsdGVyKSB7XHJcblx0XHRpZiAoIWtleSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0ZWxzZSBpZiAoZmlsdGVyICYmIGZpbHRlciAhPSB0aGlzLm5hbWUpIHtcclxuXHRcdFx0aWYgKHRoaXMucGFyZW50KVxyXG5cdFx0XHRcdHRoaXMucGFyZW50LmdldERhdGEoa2V5LCBmaWx0ZXIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc3QgcHJvcGVydHkgPSBPYmplY3RQcm9wZXJ0eS5sb2FkKHRoaXMuY29udGV4dCwga2V5LCBmYWxzZSk7XHJcblx0XHRcdHJldHVybiBwcm9wZXJ0eSA/IHByb3BlcnR5LnZhbHVlIDogbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHVwZGF0ZURhdGEoa2V5LCB2YWx1ZSwgZmlsdGVyKSB7XHJcblx0XHRpZiAoIWtleSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0ZWxzZSBpZiAoZmlsdGVyICYmIGZpbHRlciAhPSB0aGlzLm5hbWUpIHtcclxuXHRcdFx0aWYgKHRoaXMucGFyZW50KVxyXG5cdFx0XHRcdHRoaXMucGFyZW50LnVwZGF0ZURhdGEoa2V5LCB2YWx1ZSwgZmlsdGVyKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmKHRoaXMuY29udGV4dCA9PSBudWxsIHx8IHR5cGVvZiB0aGlzLmNvbnRleHQgPT09IFwidW5kZWZpbmVkXCIpe1xyXG5cdFx0XHRcdHRoaXMuY29udGV4dCA9IHt9O1x0XHRcdFx0XHJcblx0XHRcdFx0dGhpcy5wcm94eS51cGRhdGVEYXRhKHRoaXMuY29udGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgcHJvcGVydHkgPSBPYmplY3RQcm9wZXJ0eS5sb2FkKHRoaXMuY29udGV4dCwga2V5KTtcclxuXHRcdFx0cHJvcGVydHkudmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5wcm94eS5yZXNldENhY2hlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtZXJnZUNvbnRleHQoY29udGV4dCwgZmlsdGVyKSB7XHJcblx0XHRpZiAoZmlsdGVyICYmIGZpbHRlciAhPSB0aGlzLm5hbWUpIHtcclxuXHRcdFx0aWYgKHRoaXMucGFyZW50KVxyXG5cdFx0XHRcdHRoaXMucGFyZW50Lm1lcmdlQ29udGV4dChjb250ZXh0LCBmaWx0ZXIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jb250ZXh0ID0gdGhpcy5jb250ZXh0ID8gT2JqZWN0VXRpbHMubWVyZ2UodGhpcy5jb250ZXh0LCBjb250ZXh0KSA6IGNvbnRleHQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyByZXNvbHZlKGFFeHByZXNzaW9uLCBhRGVmYXVsdCkge1xyXG5cdFx0Y29uc3QgZGVmYXVsdFZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA9PSAyID8gdG9EZWZhdWx0VmFsdWUoYURlZmF1bHQpIDogREVGQVVMVF9OT1RfREVGSU5FRDtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IG1hdGNoID0gRVhQUkVTU0lPTi5leGVjKGFFeHByZXNzaW9uKTtcclxuXHRcdFx0aWYgKG1hdGNoKVxyXG5cdFx0XHRcdHJldHVybiBhd2FpdCByZXNvbHZlTWF0Y2godGhpcywgbWF0Y2gsIGRlZmF1bHRWYWx1ZSk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gYXdhaXQgcmVzb2x2ZSh0aGlzLCBub3JtYWxpemUoYUV4cHJlc3Npb24pLCBudWxsLCBkZWZhdWx0VmFsdWUpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiZXJyb3IgYXQgZXhlY3V0aW5nIHN0YXRtZW50XFxcIlwiLCBhRXhwcmVzc2lvbiwgXCJcXFwiOlwiLCBlKTtcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRWYWx1ZS5oYXNWYWx1ZSA/IGRlZmF1bHRWYWx1ZS52YWx1ZSA6IGFFeHByZXNzaW9uO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YXN5bmMgcmVzb2x2ZVRleHQoYVRleHQsIGFEZWZhdWx0KSB7XHJcblx0XHRsZXQgdGV4dCA9IGFUZXh0O1xyXG5cdFx0bGV0IHRlbXAgPSBhVGV4dDsgLy8gcmVxdWlyZWQgdG8gcHJldmVudCBpbmZpbml0eSBsb29wXHJcblx0XHRsZXQgbWF0Y2ggPSBFWFBSRVNTSU9OLmV4ZWModGV4dCk7XHJcblx0XHRjb25zdCBkZWZhdWx0VmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID09IDIgPyB0b0RlZmF1bHRWYWx1ZShhRGVmYXVsdCkgOiBERUZBVUxUX05PVF9ERUZJTkVEXHJcblx0XHR3aGlsZSAobWF0Y2ggIT0gbnVsbCkge1xyXG5cdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCByZXNvbHZlTWF0Y2godGhpcywgbWF0Y2gsIGRlZmF1bHRWYWx1ZSk7XHJcblx0XHRcdHRlbXAgPSB0ZW1wLnNwbGl0KG1hdGNoWzBdKS5qb2luKCk7IC8vIHJlbW92ZSBjdXJyZW50IG1hdGNoIGZvciBuZXh0IGxvb3BcclxuXHRcdFx0dGV4dCA9IHRleHQuc3BsaXQobWF0Y2hbMF0pLmpvaW4odHlwZW9mIHJlc3VsdCA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiAocmVzdWx0ID09IG51bGwgPyBcIm51bGxcIiA6IHJlc3VsdCkpO1xyXG5cdFx0XHRtYXRjaCA9IEVYUFJFU1NJT04uZXhlYyh0ZW1wKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0ZXh0O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGFzeW5jIHJlc29sdmUoYUV4cHJlc3Npb24sIGFDb250ZXh0LCBhRGVmYXVsdCwgYVRpbWVvdXQpIHtcclxuXHRcdGNvbnN0IHJlc29sdmVyID0gbmV3IEV4cHJlc3Npb25SZXNvbHZlcih7IGNvbnRleHQ6IGFDb250ZXh0IH0pO1xyXG5cdFx0Y29uc3QgZGVmYXVsdFZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyB0b0RlZmF1bHRWYWx1ZShhRGVmYXVsdCkgOiBERUZBVUxUX05PVF9ERUZJTkVEO1xyXG5cdFx0aWYgKHR5cGVvZiBhVGltZW91dCA9PT0gXCJudW1iZXJcIiAmJiBhVGltZW91dCA+IDApXHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdHJlc29sdmUocmVzb2x2ZXIucmVzb2x2ZShhRXhwcmVzc2lvbiwgZGVmYXVsdFZhbHVlKSk7XHJcblx0XHRcdFx0fSwgYVRpbWVvdXQpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcmVzb2x2ZXIucmVzb2x2ZShhRXhwcmVzc2lvbiwgZGVmYXVsdFZhbHVlKVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGFzeW5jIHJlc29sdmVUZXh0KGFUZXh0LCBhQ29udGV4dCwgYURlZmF1bHQsIGFUaW1lb3V0KSB7XHJcblx0XHRjb25zdCByZXNvbHZlciA9IG5ldyBFeHByZXNzaW9uUmVzb2x2ZXIoeyBjb250ZXh0OiBhQ29udGV4dCB9KTtcclxuXHRcdGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gdG9EZWZhdWx0VmFsdWUoYURlZmF1bHQpIDogREVGQVVMVF9OT1RfREVGSU5FRDtcclxuXHRcdGlmICh0eXBlb2YgYVRpbWVvdXQgPT09IFwibnVtYmVyXCIgJiYgYVRpbWVvdXQgPiAwKVxyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHJlc29sdmVyLnJlc29sdmVUZXh0KGFUZXh0LCBkZWZhdWx0VmFsdWUpKTtcclxuXHRcdFx0XHR9LCBhVGltZW91dCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiByZXNvbHZlci5yZXNvbHZlVGV4dChhVGV4dCwgZGVmYXVsdFZhbHVlKTtcclxuXHR9XHJcblx0XHJcblx0c3RhdGljIGJ1aWxkU2VjdXJlKHtjb250ZXh0LCBwcm9wRmlsdGVyLCBvcHRpb249e2RlZXA6dHJ1ZX0sIG5hbWUsIHBhcmVudH0pe1xyXG5cdFx0Y29udGV4dCA9IE9iamVjdFV0aWxzLmZpbHRlcih7ZGF0YTogY29udGV4dCwgcHJvcEZpbHRlciwgb3B0aW9ufSk7XHJcblx0XHRyZXR1cm4gbmV3IEV4cHJlc3Npb25SZXNvbHZlcih7Y29udGV4dCwgbmFtZSwgcGFyZW50fSk7XHJcblx0fVxyXG59OyIsImltcG9ydCBFeHByZXNzaW9uUmVzb2x2ZXIgZnJvbSBcIi4vRXhwcmVzc2lvblJlc29sdmVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0RXhwcmVzc2lvblJlc29sdmVyOkV4cHJlc3Npb25SZXNvbHZlclxyXG59OyIsImltcG9ydCBVdGlscyBmcm9tIFwiLi91dGlscy9VdGlsc1wiO1xyXG5cclxuVXRpbHMuZ2xvYmFsLmRlZmF1bHRqcyA9IFV0aWxzLmdsb2JhbC5kZWZhdWx0anMgfHwge307XHJcblV0aWxzLmdsb2JhbC5kZWZhdWx0anMuZXh0ZG9tID0gVXRpbHMuZ2xvYmFsLmRlZmF1bHRqcy5leHRkb20gfHwge1xyXG5cdFZFUlNJT04gOiBcIiR7dmVyc2lvbn1cIixcclxuXHR1dGlscyA6IHtcclxuXHRcdFV0aWxzOiBVdGlsc1xyXG5cdH1cclxufTtcclxuXHJcblV0aWxzLmdsb2JhbC5maW5kID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIGRvY3VtZW50LmZpbmQuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5nbG9iYWwucmVhZHkgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gZG9jdW1lbnQucmVhZHkuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5nbG9iYWwuY3JlYXRlID0gZnVuY3Rpb24oYUNvbnRlbnQsIGFzVGVtcGxhdGUpIHtcclxuXHRpZiAodHlwZW9mIGFyZ3VtZW50c1swXSAhPT0gXCJzdHJpbmdcIilcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcclxuXHRjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKTtcclxuXHR0ZW1wbGF0ZS5pbm5lckhUTUwgPSBhQ29udGVudDtcclxuXHRpZihhc1RlbXBsYXRlKVxyXG5cdFx0cmV0dXJuIHRlbXBsYXRlO1xyXG5cdFxyXG5cdHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpLmNoaWxkTm9kZXM7XHJcbn07XHJcblxyXG5VdGlscy5nbG9iYWwuc2NyaXB0ID0gZnVuY3Rpb24oYUZpbGUsIGFUYXJnZXQpIHtcclxuXHRpZihhRmlsZSBpbnN0YW5jZW9mIEFycmF5KVxyXG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKGFGaWxlLm1hcChmaWxlID0+IFV0aWxzLmdsb2JhbC5zY3JpcHQoZmlsZSwgYVRhcmdldCkpKTtcclxuXHRcclxuXHRpZih0eXBlb2YgYUZpbGUgPT09IFwic3RyaW5nXCIpXHRcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocixlKSA9PiB7XHJcblx0XHRcdGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcblx0XHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XHJcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpe3IoKX07XHJcblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJsb2FkIGVycm9yIVwiKX07XHJcblx0XHRcdCFhVGFyZ2V0ID8gZG9jdW1lbnQuYm9keS5hcHBlbmQoc2NyaXB0KSA6IGFUYXJnZXQuYXBwZW5kKHNjcmlwdCk7XHJcblx0XHRcdHNjcmlwdC5zcmMgPSBhRmlsZTtcclxuXHRcdH0pO1xyXG5cdGVsc2VcclxuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdChcIkZpcnN0IHBhcmFtZXRlciBtdXN0IGJlIGFuIGFycmF5IG9mIHN0cmluZ3Mgb3IgYSBzdHJpbmchXCIpO1xyXG59OyIsImltcG9ydCBleHRlbmRQcm90b3R5cGUgZnJvbSBcIi4uL3V0aWxzL0V4dGVuZFByb3RvdHlwZVwiO1xyXG5pbXBvcnQgUXVlcnlTdXBwb3J0IGZyb20gXCIuL2V4dGVudGlvbnMvUXVlcnlTdXBwb3J0XCI7XHJcbmltcG9ydCBSZWFkeUV2ZW50U3VwcG9ydCBmcm9tIFwiLi9leHRlbnRpb25zL1JlYWR5RXZlbnRTdXBwb3J0XCI7XHJcblxyXG5leHRlbmRQcm90b3R5cGUoRG9jdW1lbnQsIFF1ZXJ5U3VwcG9ydCwgUmVhZHlFdmVudFN1cHBvcnQpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4gZG9jdW1lbnQudHJpZ2dlcihcInJlYWR5XCIpKTtcclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IGV4dGVuZFByb3RvdHlwZSBmcm9tIFwiLi4vdXRpbHMvRXh0ZW5kUHJvdG90eXBlXCI7XHJcbmltcG9ydCBRdWVyeVN1cHBvcnQgZnJvbSBcIi4vZXh0ZW50aW9ucy9RdWVyeVN1cHBvcnRcIjtcclxuaW1wb3J0IE1hbmlwdWxhdGlvblN1cHBvcnQgZnJvbSBcIi4vZXh0ZW50aW9ucy9NYW5pcHVsYXRpb25TdXBwb3J0XCI7XHJcblxyXG5leHRlbmRQcm90b3R5cGUoRG9jdW1lbnRGcmFnbWVudCwgUXVlcnlTdXBwb3J0LCBNYW5pcHVsYXRpb25TdXBwb3J0KTtcclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCBleHRlbmRQcm90b3R5cGUgZnJvbSBcIi4uL3V0aWxzL0V4dGVuZFByb3RvdHlwZVwiO1xyXG5pbXBvcnQgUXVlcnlTdXBwb3J0IGZyb20gXCIuL2V4dGVudGlvbnMvUXVlcnlTdXBwb3J0XCI7XHJcbmltcG9ydCBBdHRyaWJ1dGVTdXBwb3J0IGZyb20gXCIuL2V4dGVudGlvbnMvQXR0cmlidXRlU3VwcG9ydFwiO1xyXG5pbXBvcnQgTWFuaXB1bGF0aW9uU3VwcG9ydCBmcm9tIFwiLi9leHRlbnRpb25zL01hbmlwdWxhdGlvblN1cHBvcnRcIjtcclxuXHJcbmV4dGVuZFByb3RvdHlwZShFbGVtZW50LFF1ZXJ5U3VwcG9ydCwgQXR0cmlidXRlU3VwcG9ydCwgTWFuaXB1bGF0aW9uU3VwcG9ydCk7IiwiaW1wb3J0IGV4dGVuZFByb3RvdHlwZSBmcm9tIFwiLi4vdXRpbHMvRXh0ZW5kUHJvdG90eXBlXCI7XG5pbXBvcnQgRXZlbnRTdXBwb3J0IGZyb20gXCIuL2V4dGVudGlvbnMvRXZlbnRTdXBwb3J0XCI7XG5cbmV4dGVuZFByb3RvdHlwZShFdmVudFRhcmdldCwgRXZlbnRTdXBwb3J0KTsiLCJpbXBvcnQgZXh0ZW5kUHJvdG90eXBlIGZyb20gXCIuLi91dGlscy9FeHRlbmRQcm90b3R5cGVcIjtcclxuaW1wb3J0IEh0bWxDbGFzc1N1cHBvcnQgZnJvbSBcIi4vZXh0ZW50aW9ucy9IdG1sQ2xhc3NTdXBwb3J0XCI7XHJcbmltcG9ydCBTaG93SGlkZVN1cHBvcnQgZnJvbSBcIi4vZXh0ZW50aW9ucy9TaG93SGlkZVN1cHBvcnRcIjtcclxuXHJcblxyXG5leHRlbmRQcm90b3R5cGUoSFRNTEVsZW1lbnQsIEh0bWxDbGFzc1N1cHBvcnQsIFNob3dIaWRlU3VwcG9ydCk7IiwiaW1wb3J0IGV4dGVuZFByb3RvdHlwZSBmcm9tIFwiLi4vdXRpbHMvRXh0ZW5kUHJvdG90eXBlXCI7XHJcbmltcG9ydCBWYWx1ZVN1cHBvcnQgZnJvbSBcIi4vZXh0ZW50aW9ucy9WYWx1ZVN1cHBvcnRcIjtcclxuXHJcblxyXG5leHRlbmRQcm90b3R5cGUoSFRNTElucHV0RWxlbWVudCxWYWx1ZVN1cHBvcnQpOyIsImltcG9ydCBleHRlbmRQcm90b3R5cGUgZnJvbSBcIi4uL3V0aWxzL0V4dGVuZFByb3RvdHlwZVwiO1xyXG5pbXBvcnQgVmFsdWVTdXBwb3J0IGZyb20gXCIuL2V4dGVudGlvbnMvVmFsdWVTdXBwb3J0XCI7XHJcblxyXG5cclxuZXh0ZW5kUHJvdG90eXBlKEhUTUxTZWxlY3RFbGVtZW50LFZhbHVlU3VwcG9ydCk7IiwiaW1wb3J0IGV4dGVuZFByb3RvdHlwZSBmcm9tIFwiLi4vdXRpbHMvRXh0ZW5kUHJvdG90eXBlXCI7XHJcbmltcG9ydCBFeHRlbmRlciBmcm9tIFwiLi4vdXRpbHMvRXh0ZW5kZXJcIjtcclxuXHJcblxyXG5leHRlbmRQcm90b3R5cGUoSFRNTFRleHRBcmVhRWxlbWVudCxFeHRlbmRlcihcIlZhbHVlU3VwcG9ydFwiLCBQcm90b3R5cGUgPT4ge1x0XHJcblx0UHJvdG90eXBlLnZhbCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoYXJndW1lbnRzLmxlbmd0aCA9PSAwKVxyXG5cdFx0XHRyZXR1cm4gdGhpcy52YWx1ZTtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy52YWx1ZSA9IGFyZ3VtZW50c1swXVxyXG5cdFx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHRcclxufSkpOyIsImltcG9ydCBleHRlbmRQcm90b3R5cGUgZnJvbSBcIi4uL3V0aWxzL0V4dGVuZFByb3RvdHlwZVwiO1xyXG5pbXBvcnQgRGVsZWdhdGVyQnVpbGRlciBmcm9tIFwiLi4vdXRpbHMvRGVsZWdhdGVyQnVpbGRlclwiO1xyXG5pbXBvcnQgTGlzdFN1cHBvcnQgZnJvbSBcIi4vZXh0ZW50aW9ucy9MaXN0U3VwcG9ydFwiO1xyXG5cclxuZXh0ZW5kUHJvdG90eXBlKEhUTUxDb2xsZWN0aW9uLCBMaXN0U3VwcG9ydCk7XHJcblxyXG5IVE1MQ29sbGVjdGlvbi5wcm90b3R5cGUuYXBwbHlUbyA9IGZ1bmN0aW9uKCl7XHJcblx0Y29uc3QgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcclxuXHRjb25zdCBjYWxsaW5nID0gYXJncy5zaGlmdCgpO1xyXG5cdGNvbnN0IGlzRnVuY3Rpb24gPSB0eXBlb2YgY2FsbGluZyA9PT0gXCJmdW5jdGlvblwiO1xyXG5cdGNvbnN0IHJlc3VsdHMgPSBbXTtcclxuXHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKyl7XHJcblx0XHRjb25zdCBub2RlID0gdGhpc1tpXTtcclxuXHRcdGxldFx0cmVzdWx0O1xyXG5cdFx0aWYoaXNGdW5jdGlvbilcclxuXHRcdFx0cmVzdWx0ID0gY2FsbGluZy5hcHBseShbbm9kZV0uY29uY2F0KGFyZ3MpKTtcclxuXHRcdGVsc2UgaWYodHlwZW9mIG5vZGVbY2FsbGluZ10gPT09IFwiZnVuY3Rpb25cIilcclxuXHRcdFx0cmVzdWx0ID0gbm9kZVtjYWxsaW5nXS5hcHBseShub2RlLCBhcmdzKTtcclxuXHRcdFxyXG5cdFx0aWYocmVzdWx0KVxyXG5cdFx0XHRyZXN1bHRzLnB1c2gocmVzdWx0KTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHJlc3VsdHM7XHJcbn07XHJcblxyXG5IVE1MQ29sbGVjdGlvbi5wcm90b3R5cGUudmFsID0gZnVuY3Rpb24oKSB7XHJcblx0aWYoYXJndW1lbnRzLmxlbmd0aCA9PSAwKXtcclxuXHRcdGlmKHRoaXMubGVuZ3RoID4gMCl7XHJcblx0XHRcdGNvbnN0IHJlc3VsdCA9IG5ldyBNYXAoKTtcclxuXHRcdFx0dGhpcy5mb3JFYWNoKG5vZGUgPT4ge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBub2RlLnZhbCA9PT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gbm9kZS52YWwoKTtcclxuXHRcdFx0XHRcdGlmKHZhbHVlKVxyXG5cdFx0XHRcdFx0XHRyZXN1bHQuc2V0KChub2RlLm5hbWUgfHwgbm9kZS5pZCB8fCBub2RlLnNlbGVjdG9yKCkpLCBub2RlLnZhbCgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1x0XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblx0fVxyXG5cdGVsc2VcclxuXHRcdEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5hcHBseVRvLmFwcGx5KHRoaXMsIFtcInZhbFwiXS5jb25jYXQoQXJyYXkuZnJvbShhcmd1bWVudHMpKSk7XHJcbn07XHJcblxyXG5IVE1MQ29sbGVjdGlvbi5mcm9tID0gZnVuY3Rpb24oKXtcclxuXHRjb25zdCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xyXG5cdGNvbnN0IGRhdGEgPSB7fTtcclxuXHRsZXQgY291bnRlciA9IDA7XHJcblx0XHJcblx0d2hpbGUoYXJncy5sZW5ndGggPiAwKXtcclxuXHRcdGNvbnN0IGFyZyA9IGFyZ3Muc2hpZnQoKTtcclxuXHRcdGlmKHR5cGVvZiBhcmcgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJnICE9IG51bGwpe1xyXG5cdFx0XHRpZihhcmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcclxuXHRcdFx0XHRkYXRhW2NvdW50ZXIrK10gPSB7dmFsdWU6IGFyZywgZW51bWVyYWJsZTogdHJ1ZX07XHJcblx0XHRcdGVsc2UgaWYoYXJnIGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24gfHwgYXJnIGluc3RhbmNlb2YgTm9kZUxpc3QgfHwgYXJnIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBhcmcubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdFx0aWYoYXJnW2ldICYmIGFyZ1tpXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtjb3VudGVyKytdID0ge3ZhbHVlOiBhcmdbaV0sIGVudW1lcmFibGU6IHRydWV9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRkYXRhLmxlbmd0aCA9IHt2YWx1ZTogY291bnRlcn07XHJcblx0cmV0dXJuICBPYmplY3QuY3JlYXRlKEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZSwgZGF0YSk7XHJcbn07XHJcblxyXG5cclxuRGVsZWdhdGVyQnVpbGRlcihmdW5jdGlvbihhRnVuY3Rpb25OYW1lLCB0aGVBcmd1bWVudHMpIHtcclxuXHRsZXQgcmVzdWx0cyA9IFtdO1x0XHJcblx0dGhpcy5mb3JFYWNoKG5vZGUgPT4ge1xyXG5cdFx0aWYobm9kZSAmJiB0eXBlb2Ygbm9kZVthRnVuY3Rpb25OYW1lXSA9PT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0bGV0IHJlc3VsdCA9IG5vZGVbYUZ1bmN0aW9uTmFtZV0uYXBwbHkobm9kZSwgdGhlQXJndW1lbnRzKTtcclxuXHRcdFx0aWYocmVzdWx0KXsgXHJcblx0XHRcdFx0aWYocmVzdWx0IGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24pXHJcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5jb25jYXQoQXJyYXkuZnJvbShyZXN1bHQpKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXN1bHRzLnB1c2gocmVzdWx0KTtcclxuXHRcdFx0fVx0XHRcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHRpZihyZXN1bHRzLmxlbmd0aCA9PT0gMClcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0ZWxzZSBpZihyZXN1bHRzWzBdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgcmVzdWx0c1swXSBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKVxyXG5cdFx0cmV0dXJuIEhUTUxDb2xsZWN0aW9uLmZyb20uYXBwbHkobnVsbCwgcmVzdWx0cyk7XHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIHJlc3VsdHM7XHJcbn0sSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLCBOb2RlLnByb3RvdHlwZSwgSFRNTEVsZW1lbnQucHJvdG90eXBlLCBIVE1MSW5wdXRFbGVtZW50LnByb3RvdHlwZSwgRWxlbWVudC5wcm90b3R5cGUsIEV2ZW50VGFyZ2V0LnByb3RvdHlwZSk7XHJcbiIsImltcG9ydCBleHRlbmRQcm90b3R5cGUgZnJvbSBcIi4uL3V0aWxzL0V4dGVuZFByb3RvdHlwZVwiO1xyXG5pbXBvcnQgRGF0YVN1cHBvcnQgZnJvbSBcIi4vZXh0ZW50aW9ucy9EYXRhU3VwcG9ydFwiO1xyXG5pbXBvcnQgTWFuaXB1bGF0aW9uU3VwcG9ydCBmcm9tIFwiLi9leHRlbnRpb25zL01hbmlwdWxhdGlvblN1cHBvcnRcIjtcclxuXHJcbmV4dGVuZFByb3RvdHlwZShOb2RlLERhdGFTdXBwb3J0LE1hbmlwdWxhdGlvblN1cHBvcnQpOyIsImltcG9ydCBleHRlbmRQcm90b3R5cGUgZnJvbSBcIi4uL3V0aWxzL0V4dGVuZFByb3RvdHlwZVwiO1xyXG5pbXBvcnQgRGVsZWdhdGVyQnVpbGRlciBmcm9tIFwiLi4vdXRpbHMvRGVsZWdhdGVyQnVpbGRlclwiO1xyXG5pbXBvcnQgTGlzdFN1cHBvcnQgZnJvbSBcIi4vZXh0ZW50aW9ucy9MaXN0U3VwcG9ydFwiO1xyXG5cclxuZXh0ZW5kUHJvdG90eXBlKE5vZGVMaXN0LCBMaXN0U3VwcG9ydCk7XHJcblxyXG5Ob2RlTGlzdC5wcm90b3R5cGUuYXBwbHlUbyA9IGZ1bmN0aW9uKCl7XHJcblx0Y29uc3QgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcclxuXHRjb25zdCBjYWxsaW5nID0gYXJncy5zaGlmdCgpO1xyXG5cdGNvbnN0IGlzRnVuY3Rpb24gPSB0eXBlb2YgY2FsbGluZyA9PT0gXCJmdW5jdGlvblwiO1xyXG5cdGNvbnN0IHJlc3VsdHMgPSBbXTtcclxuXHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKyl7XHJcblx0XHRjb25zdCBub2RlID0gdGhpc1tpXTtcclxuXHRcdGxldFx0cmVzdWx0O1xyXG5cdFx0aWYoaXNGdW5jdGlvbilcclxuXHRcdFx0cmVzdWx0ID0gY2FsbGluZy5hcHBseShbbm9kZV0uY29uY2F0KGFyZ3MpKTtcclxuXHRcdGVsc2UgaWYodHlwZW9mIG5vZGVbY2FsbGluZ10gPT09IFwiZnVuY3Rpb25cIilcclxuXHRcdFx0cmVzdWx0ID0gbm9kZVtjYWxsaW5nXS5hcHBseShub2RlLCBhcmdzKTtcclxuXHRcdFxyXG5cdFx0aWYocmVzdWx0KVxyXG5cdFx0XHRyZXN1bHRzLnB1c2gocmVzdWx0KTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHJlc3VsdHM7XHJcbn07XHJcblxyXG5Ob2RlTGlzdC5wcm90b3R5cGUudmFsID0gZnVuY3Rpb24oKSB7XHJcblx0aWYoYXJndW1lbnRzLmxlbmd0aCA9PSAwKXtcclxuXHRcdGlmKHRoaXMubGVuZ3RoID4gMCl7XHJcblx0XHRcdGNvbnN0IHJlc3VsdCA9IG5ldyBNYXAoKTtcclxuXHRcdFx0dGhpcy5mb3JFYWNoKG5vZGUgPT4ge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBub2RlLnZhbCA9PT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gbm9kZS52YWwoKTtcclxuXHRcdFx0XHRcdGlmKHZhbHVlKVxyXG5cdFx0XHRcdFx0XHRyZXN1bHQuc2V0KChub2RlLm5hbWUgfHwgbm9kZS5pZCB8fCBub2RlLnNlbGVjdG9yKCkpLCBub2RlLnZhbCgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1x0XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblx0fVxyXG5cdGVsc2VcclxuXHRcdE5vZGVMaXN0LnByb3RvdHlwZS5hcHBseVRvLmFwcGx5KHRoaXMsIFtcInZhbFwiXS5jb25jYXQoQXJyYXkuZnJvbShhcmd1bWVudHMpKSk7XHJcbn07XHJcblxyXG5Ob2RlTGlzdC5mcm9tID0gZnVuY3Rpb24oKXtcclxuXHRjb25zdCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xyXG5cdGNvbnN0IGRhdGEgPSB7fTtcclxuXHRsZXQgY291bnRlciA9IDA7XHJcblx0XHJcblx0d2hpbGUoYXJncy5sZW5ndGggPiAwKXtcclxuXHRcdGNvbnN0IGFyZyA9IGFyZ3Muc2hpZnQoKTtcclxuXHRcdGlmKHR5cGVvZiBhcmcgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJnICE9IG51bGwpe1xyXG5cdFx0XHRpZihhcmcgaW5zdGFuY2VvZiBOb2RlKVxyXG5cdFx0XHRcdGRhdGFbY291bnRlcisrXSA9IHt2YWx1ZTogYXJnLCBlbnVtZXJhYmxlOiB0cnVlfTtcclxuXHRcdFx0ZWxzZSBpZihhcmcgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fCBhcmcgaW5zdGFuY2VvZiBIVE1MQ29sbGVjdGlvbiB8fCBhcmcgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGFyZy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0XHRpZihhcmdbaV0gJiYgYXJnW2ldIGluc3RhbmNlb2YgTm9kZSl7XHJcblx0XHRcdFx0XHRcdGRhdGFbY291bnRlcisrXSA9IHt2YWx1ZTogYXJnW2ldLCBlbnVtZXJhYmxlOiB0cnVlfTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZGF0YS5sZW5ndGggPSB7dmFsdWU6IGNvdW50ZXJ9O1xyXG5cdHJldHVybiAgT2JqZWN0LmNyZWF0ZShOb2RlTGlzdC5wcm90b3R5cGUsIGRhdGEpO1xyXG59O1xyXG5cclxuXHJcbkRlbGVnYXRlckJ1aWxkZXIoZnVuY3Rpb24oYUZ1bmN0aW9uTmFtZSwgdGhlQXJndW1lbnRzKSB7XHJcblx0bGV0IHJlc3VsdHMgPSBbXTtcdFxyXG5cdHRoaXMuZm9yRWFjaChub2RlID0+IHtcclxuXHRcdGlmKG5vZGUgJiYgdHlwZW9mIG5vZGVbYUZ1bmN0aW9uTmFtZV0gPT09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRcdGNvbnN0IHJlc3VsdCA9IG5vZGVbYUZ1bmN0aW9uTmFtZV0uYXBwbHkobm9kZSwgdGhlQXJndW1lbnRzKTtcclxuXHRcdFx0aWYocmVzdWx0KXsgXHJcblx0XHRcdFx0aWYocmVzdWx0IGluc3RhbmNlb2YgTm9kZUxpc3QpXHJcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5jb25jYXQoQXJyYXkuZnJvbShyZXN1bHQpKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXN1bHRzLnB1c2gocmVzdWx0KTtcclxuXHRcdFx0fVx0XHRcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHRpZihyZXN1bHRzLmxlbmd0aCA9PT0gMClcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0ZWxzZSBpZihyZXN1bHRzWzBdIGluc3RhbmNlb2YgTm9kZSB8fCByZXN1bHRzWzBdIGluc3RhbmNlb2YgTm9kZUxpc3QpXHJcblx0XHRyZXR1cm4gTm9kZUxpc3QuZnJvbShyZXN1bHRzKTtcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gcmVzdWx0cztcclxufSxOb2RlTGlzdC5wcm90b3R5cGUsIE5vZGUucHJvdG90eXBlLCBIVE1MRWxlbWVudC5wcm90b3R5cGUsIEhUTUxJbnB1dEVsZW1lbnQucHJvdG90eXBlLCBFbGVtZW50LnByb3RvdHlwZSwgRXZlbnRUYXJnZXQucHJvdG90eXBlKTtcclxuIiwiaW1wb3J0IEV4dGVuZGVyIGZyb20gXCIuLi8uLi91dGlscy9FeHRlbmRlclwiO1xyXG5cclxuY29uc3Qgc3VwcG9ydCA9IEV4dGVuZGVyKFwiQXR0cmlidXRlU3VwcG9ydFwiLCBQcm90b3R5cGUgPT4ge1xyXG5cdFByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGVzKCkgPyAoKCkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IHt9O1xyXG5cdFx0XHRcdHRoaXMuZ2V0QXR0cmlidXRlTmFtZXMoKS5mb3JFYWNoKG5hbWUgPT4ge1xyXG5cdFx0XHRcdFx0cmVzdWx0W25hbWVdID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0fSkoKSA6IHVuZGVmaW5lZDtcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSlcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKGFyZ3VtZW50c1swXSk7XHJcblx0XHRlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdID09PSBcInVuZGVmaW5lZFwiIHx8IGFyZ3VtZW50c1sxXSA9PSBudWxsKVxyXG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShhcmd1bWVudHNbMF0pO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBzdXBwb3J0OyIsImltcG9ydCBFeHRlbmRlciBmcm9tIFwiLi4vLi4vdXRpbHMvRXh0ZW5kZXJcIjtcclxuY29uc3Qgc3VwcG9ydCA9IEV4dGVuZGVyKFwiRGF0YVN1cHBvcnRcIiwgUHJvdG90eXBlID0+IHtcclxuXHRQcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29uc3QgZGF0YSA9IHt9O1xyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLmRhdGFzZXQgIT09IFwidW5kZWZpbmVkXCIpXHJcblx0XHRcdGZvciAobmFtZSBpbiB0aGlzLmRhdGFzZXQpXHJcblx0XHRcdFx0ZGF0YVtuYW1lXSA9IHRoaXMuZGF0YXNldFtuYW1lXTtcclxuXHJcblx0XHR0aGlzLmRhdGEgPSAoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApXHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSlcclxuXHRcdFx0XHRyZXR1cm4gZGF0YVthcmd1bWVudHNbMF1dO1xyXG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdID09PSBcInVuZGVmaW5lZFwiIHx8IGFyZ3VtZW50c1sxXSA9PSBudWxsKVxyXG5cdFx0XHRcdGRlbGV0ZSBkYXRhW2FyZ3VtZW50c1swXV07XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRkYXRhW2FyZ3VtZW50c1swXV0gPSBhcmd1bWVudHNbMV07XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0pLmJpbmQodGhpcyk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZGF0YS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xyXG5cdH07XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBzdXBwb3J0OyIsImltcG9ydCBFeHRlbmRlciBmcm9tIFwiLi4vLi4vdXRpbHMvRXh0ZW5kZXJcIjtcclxuXHJcbmNvbnN0IERFRkFVTFRfVElNRU9VVCA9IDEwMDtcclxuY29uc3Qgc3VwcG9ydCA9IEV4dGVuZGVyKFwiRXZlbnRTdXBwb3J0XCIsIChQcm90b3R5cGUpID0+IHtcclxuXHRjb25zdCBFVkVOVFNQTElURVIgPSAvKFxccyspfChcXHMqLFxccyopLztcclxuXHRjb25zdCBnZXRXcmFwcGVySGFuZGxlTWFwID0gKGVsZW1lbnQpID0+IHtcclxuXHRcdGlmICghZWxlbWVudC5fX3dyYXBwZXJoYW5kbGVtYXBfXylcclxuXHRcdFx0ZWxlbWVudC5fX3dyYXBwZXJoYW5kbGVtYXBfXyA9IG5ldyBNYXAoKTtcclxuXHJcblx0XHRyZXR1cm4gZWxlbWVudC5fX3dyYXBwZXJoYW5kbGVtYXBfXztcclxuXHR9XHJcblxyXG5cdGNvbnN0IGdldFRyaWdnZXJUaW1lb3V0cyA9IChlbGVtZW50KSA9PiB7XHJcblx0XHRpZiAoIWVsZW1lbnQuX19fRVZFTlRUUklHR0VSVElNRU9VVFNfX18pIGVsZW1lbnQuX19fRVZFTlRUUklHR0VSVElNRU9VVFNfX18gPSB7fTtcclxuXHJcblx0XHRyZXR1cm4gZWxlbWVudC5fX19FVkVOVFRSSUdHRVJUSU1FT1VUU19fXztcclxuXHR9O1xyXG5cclxuXHRjb25zdCByZW1vdmVXcmFwcGVyID0gKGVsZW1lbnQsIGRhdGEsIGV2ZW50VHlwZXMpID0+IHtcclxuXHRcdGNvbnN0IHsgd3JhcHBlciwgb3B0aW9uLCBldmVudHMsIGhhbmRsZSB9ID0gZGF0YTtcclxuXHRcdGNvbnN0IGNhcHR1cmUgPSBvcHRpb24uY2FwdHVyZTtcclxuXHRcdGlmKGV2ZW50VHlwZXMpe1xyXG5cdFx0XHRldmVudFR5cGVzID0gdHlwZW9mIGV2ZW50VHlwZXMgPT09IFwic3RyaW5nXCIgPyBldmVudFR5cGVzLnNwbGl0KEVWRU5UU1BMSVRFUikgOiBldmVudFR5cGVzO1xyXG5cdFx0XHRmb3IgKGxldCBldmVudCBvZiBldmVudFR5cGVzKSB7XHJcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBldmVudHMuaW5kZXhPZihldmVudCk7XHJcblx0XHRcdFx0aWYoaW5kZXggPj0gMCkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCB3cmFwcGVyLCBjYXB0dXJlKTtcclxuXHRcdFx0XHRcdGV2ZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihldmVudHMubGVuZ3RoID09IDApXHRcdFx0XHRcclxuXHRcdFx0XHRcdGdldFdyYXBwZXJIYW5kbGVNYXAoZWxlbWVudCkuZGVsZXRlKGhhbmRsZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Zm9yIChsZXQgZXZlbnQgb2YgZXZlbnRzKSB7XHJcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCB3cmFwcGVyLCBjYXB0dXJlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRnZXRXcmFwcGVySGFuZGxlTWFwKGVsZW1lbnQpLmRlbGV0ZShoYW5kbGUpO1xyXG5cdFx0fVx0XHRcclxuXHR9XHJcblxyXG5cdFByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbGVzcyBhcmd1bWVudHMhXCIpO1xyXG5cclxuXHRcdGNvbnN0IGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XHJcblx0XHRsZXQgZXZlbnRzID0gdHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIgPyBhcmdzLnNoaWZ0KCkuc3BsaXQoRVZFTlRTUExJVEVSKSA6IGFyZ3Muc2hpZnQoKTtcclxuXHRcdGNvbnN0IGZpbHRlciA9IHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiID8gYXJncy5zaGlmdCgpIDogbnVsbDtcclxuXHRcdGNvbnN0IGhhbmRsZSA9IGFyZ3Muc2hpZnQoKTtcclxuXHRcdGNvbnN0IG9wdGlvbiA9IHR5cGVvZiBhcmdzWzBdID09PSBcInVuZGVmaW5lZFwiID8geyBjYXB0dXJlOiBmYWxzZSwgb25jZTogZmFsc2UsIHBhc3NpdmU6IGZhbHNlIH0gOiAodHlwZW9mIGFyZ3NbMF0gPT09IFwiYm9vbGVhblwiID8geyBjYXB0dXJlOiBhcmdzLnNoaWZ0KCksIG9uY2U6IGZhbHNlLCBwYXNzaXZlOiBmYWxzZSB9IDogYXJncy5zaGlmdCgpKTtcclxuXHRcdGNvbnN0IHdyYXBwZXIgPSBmdW5jdGlvbihhRXZlbnQpIHtcclxuXHRcdFx0aWYgKGZpbHRlcikge1xyXG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRhcmdldC5pcyA9PT0gXCJmdW5jdGlvblwiICYmICFhRXZlbnQudGFyZ2V0LmlzKGZpbHRlcikpIHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGhhbmRsZS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xyXG5cdFx0XHRpZiAob3B0aW9uLm9uY2UpIHJlbW92ZVdyYXBwZXIodGhpcywgd3JhcHBlcik7XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdGdldFdyYXBwZXJIYW5kbGVNYXAodGhpcykuc2V0KGhhbmRsZSwgeyBoYW5kbGUsIHdyYXBwZXI6IHdyYXBwZXIsIGV2ZW50cywgb3B0aW9uIH0pO1xyXG5cclxuXHRcdGZvciAobGV0IGV2ZW50IG9mIGV2ZW50cykge1xyXG5cdFx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHdyYXBwZXIsIG9wdGlvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHJcblxyXG5cdFByb3RvdHlwZS5yZW1vdmVPbiA9IGZ1bmN0aW9uKGhhbmRsZSwgZXZlbnQsIGNhcHR1cmUpIHtcclxuXHRcdGNvbnN0IGRhdGEgPSBnZXRXcmFwcGVySGFuZGxlTWFwKHRoaXMpLmdldChoYW5kbGUpO1xyXG5cdFx0aWYgKGRhdGEpIFxyXG5cdFx0XHRyZW1vdmVXcmFwcGVyKHRoaXMsIGRhdGEsIGV2ZW50KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZSwgZXZlbnQsIGNhcHR1cmUpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblxyXG5cdFByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zdCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xyXG5cdFx0Y29uc3QgdGltZW91dCA9IHR5cGVvZiBhcmdzWzBdID09PSBcIm51bWJlclwiID8gYXJncy5zaGlmdCgpIDogLTE7XHJcblx0XHRpZiAodGltZW91dCA+PSAwKSB7XHJcblx0XHRcdGNvbnN0IHR5cGUgPSBhcmdzWzBdO1xyXG5cdFx0XHRjb25zdCB0aW1lb3V0cyA9IGdldFRyaWdnZXJUaW1lb3V0cyh0aGlzKTtcclxuXHRcdFx0Y29uc3QgdGltZW91dGlkID0gdGltZW91dHNbdHlwZV07XHJcblx0XHRcdGlmICh0aW1lb3V0aWQpIGNsZWFyVGltZW91dCh0aW1lb3V0aWQpO1xyXG5cclxuXHRcdFx0dGltZW91dHNbdHlwZV0gPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRkZWxldGUgdGltZW91dHNbdHlwZV07XHJcblx0XHRcdFx0dGhpcy50cmlnZ2VyLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG5cdFx0XHR9LCB0aW1lb3V0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnN0IHR5cGUgPSBhcmdzLnNoaWZ0KCk7XHJcblx0XHRcdGNvbnN0IGRlbGVnYXRlID0gYXJnc1swXSBpbnN0YW5jZW9mIEV2ZW50ID8gYXJncy5zaGlmdCgpIDogbnVsbDtcclxuXHRcdFx0Y29uc3QgZGF0YSA9IGFyZ3MubGVuZ3RoID49IDEgPyAoYXJncy5sZW5ndGggPT0gMSA/IGFyZ3Muc2hpZnQoKSA6IGFyZ3MpIDogZGVsZWdhdGU7XHJcblx0XHRcdGNvbnN0IGV2ZW50ID0gZGF0YSA/IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUsIGNvbXBvc2VkOiB0cnVlLCBkZXRhaWw6IGRhdGEgfSkgOiBuZXcgRXZlbnQodHlwZSwgeyBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiB0cnVlLCBjb21wb3NlZDogdHJ1ZSwgfSk7XHJcblxyXG5cdFx0XHRpZiAoZGVsZWdhdGUpIGV2ZW50LmRlbGVnYXRlZEV2ZW50ID0gZGVsZWdhdGU7XHJcblx0XHRcdHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgc3VwcG9ydDtcclxuIiwiaW1wb3J0IEV4dGVuZGVyIGZyb20gXCIuLi8uLi91dGlscy9FeHRlbmRlclwiO1xyXG5cclxuY29uc3Qgc3VwcG9ydCA9IEV4dGVuZGVyKFwiSHRtbENsYXNzU3VwcG9ydFwiLCBQcm90b3R5cGUgPT4ge1x0XHJcblx0UHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihhcmd1bWVudHMubGVuZ3RoID09IDEpXHJcblx0XHRcdGFyZ3VtZW50c1swXS5zcGxpdCgvXFxzKy8pLmZvckVhY2goY2xhenogPT4gdGhpcy5jbGFzc0xpc3QuYWRkKGNsYXp6KSk7XHJcblx0XHRlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG5cdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFyZ3VtZW50cyxjbGF6eiA9PiB0aGlzLmNsYXNzTGlzdC5hZGQoY2xhenopKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHRcclxuXHRQcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMSlcclxuXHRcdFx0YXJndW1lbnRzWzBdLnNwbGl0KC9cXHMrLykuZm9yRWFjaChjbGF6eiA9PiB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoY2xhenopKTtcclxuXHRcdGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA+IDEpXHJcblx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoYXJndW1lbnRzLCBjbGF6eiA9PiB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoY2xhenopKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHRcdFxyXG5cdH07XHJcblx0XHJcblx0UHJvdG90eXBlLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihhcmd1bWVudHMubGVuZ3RoID09IDEpXHJcblx0XHRcdGFyZ3VtZW50c1swXS5zcGxpdCgvXFxzKy8pLmZvckVhY2goY2xhenogPT4gdGhpcy5jbGFzc0xpc3QudG9nZ2xlKGNsYXp6KSk7XHJcblx0XHRlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG5cdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFyZ3VtZW50cywgY2xhenogPT4gdGhpcy5jbGFzc0xpc3QudG9nZ2xlKGNsYXp6KSk7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBzdXBwb3J0OyIsImltcG9ydCBFeHRlbmRlciBmcm9tIFwiLi4vLi4vdXRpbHMvRXh0ZW5kZXJcIjtcclxuXHJcbmNvbnN0IHN1cHBvcnQgPSBFeHRlbmRlcihcIkxpc3RTdXBwb3J0XCIsIFByb3RvdHlwZSA9PiB7XHRcdFxyXG5cdFByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oKSB7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKylcclxuXHRcdFx0aWYodGhpc1tpXSA9PSBhcmd1bWVudHNbMF0pXHJcblx0XHRcdFx0cmV0dXJuIGk7XHJcblx0XHRcclxuXHRcdHJldHVybiAtMTtcclxuXHR9O1xyXG5cclxuXHRQcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLmZvckVhY2guYXBwbHkoQXJyYXkuZnJvbSh0aGlzKSwgYXJndW1lbnRzKTtcclxuXHR9O1xyXG5cdFxyXG5cdFByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuYXBwbHkoQXJyYXkuZnJvbSh0aGlzKSwgYXJndW1lbnRzKTtcclxuXHR9O1xyXG5cdFxyXG5cdFByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXIuYXBwbHkoQXJyYXkuZnJvbSh0aGlzKSwgYXJndW1lbnRzKTtcclxuXHR9O1xyXG5cclxuXHRQcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0aWYodGhpcy5sZW5ndGggPiAwKVxyXG5cdFx0XHRyZXR1cm4gdGhpc1swXTtcclxuXHR9O1x0XHJcblx0XHJcblx0UHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0aWYodGhpcy5sZW5ndGggPiAwKVxyXG5cdFx0XHRyZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdO1xyXG5cdH07XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBzdXBwb3J0OyIsImltcG9ydCBFeHRlbmRlciBmcm9tIFwiLi4vLi4vdXRpbHMvRXh0ZW5kZXJcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi8uLi91dGlscy9VdGlsc1wiO1xyXG5cclxuY29uc3Qgc3VwcG9ydCA9IEV4dGVuZGVyKFwiTWFuaXB1bGF0aW9uU3VwcG9ydFwiLCBQcm90b3R5cGUgPT4ge1x0XHJcblx0UHJvdG90eXBlLmVtcHR5ID0gZnVuY3Rpb24oKXtcclxuXHRcdGxldCBub2RlcyA9IHRoaXMuY2hpbGROb2Rlc1xyXG5cdFx0d2hpbGUobm9kZXMubGVuZ3RoICE9IDApXHRcdFx0XHJcblx0XHRcdG5vZGVzWzBdLnJlbW92ZSh0cnVlKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHRcclxuXHRQcm90b3R5cGUuY29udGVudCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5jaGlsZE5vZGVzO1xyXG5cdH07XHRcclxuXHRcclxuXHRQcm90b3R5cGUuaHRtbCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRpZihhcmd1bWVudHMubGVuZ3RoID09IDApXHRcdFx0XHJcblx0XHRcdHJldHVybiB0aGlzLmlubmVySFRNTDtcclxuXHRcdGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09IFwiYm9vbGVhblwiKVxyXG5cdFx0XHRpZihhcmd1bWVudHNbMF0pXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMub3V0ZXJIVE1MO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5uZXJIVE1MO1xyXG5cdFx0ZWxzZSBcclxuXHRcdFx0QXJyYXkuZnJvbShhcmd1bWVudHMpLmZvckVhY2goY29udGVudCA9PiB7XHJcblx0XHRcdFx0dGhpcy5lbXB0eSgpO1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRcdFx0dGhpcy5hcHBlbmQoY29udGVudCk7XHJcblx0XHRcdFx0ZWxzZSBpZihjb250ZW50IGluc3RhbmNlb2YgTm9kZSB8fCBjb250ZW50IGluc3RhbmNlb2YgTm9kZUxpc3QgfHwgY29udGVudCBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKXtcclxuXHRcdFx0XHRcdHRoaXMuYXBwZW5kKGNvbnRlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHRcdFxyXG5cdFx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblx0XHJcblx0Y29uc3QgYXBwZW5kID0gZnVuY3Rpb24oKXtcclxuXHRcdGNvbnN0IGFwcGVuZCA9IFByb3RvdHlwZS5hcHBlbmRDaGlsZC5iaW5kKHRoaXMpO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdGxldCBhcmcgPSBhcmd1bWVudHNbaV07XHJcblx0XHRcdGlmKGFyZyBpbnN0YW5jZW9mIE5vZGUpXHJcblx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZChhcmcpO1xyXG5cdFx0XHRlbHNlIGlmKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdFx0Y3JlYXRlKGFyZykuZm9yRWFjaChhcHBlbmQpO1xyXG5cdFx0XHRlbHNlIGlmKHR5cGVvZiBhcmcuZm9yRWFjaCA9PT0gXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdGFyZy5mb3JFYWNoKGFwcGVuZCk7XHJcblx0XHR9XHJcblx0fTtcdFxyXG5cdFByb3RvdHlwZS5hcHBlbmQgPSBhcHBlbmQ7XHJcblx0XHJcblx0Y29uc3QgcHJlcGVuZCA9IGZ1bmN0aW9uKGFGaXJzdEVsZW1lbnQsIGFFbGVtZW50KXtcclxuXHRcdHRoaXMuaW5zZXJ0QmVmb3JlKGFFbGVtZW50LCBhRmlyc3RFbGVtZW50KTtcclxuXHR9O1xyXG5cdFByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24oKXtcclxuXHRcdGlmKHRoaXMuY2hpbGROb2Rlcy5sZW5ndGggPT0gMClcclxuXHRcdFx0YXBwZW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3QgZmlyc3QgPSB0aGlzLmNoaWxkTm9kZXMuZmlyc3QoKTtcclxuXHRcdFx0Y29uc3QgaW5zZXJ0ID0gcHJlcGVuZC5iaW5kKHRoaXMsIGZpcnN0KTtcclxuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0Y29uc3QgYXJnID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0XHRcdGlmKGFyZyBpbnN0YW5jZW9mIE5vZGUpXHJcblx0XHRcdFx0XHRpbnNlcnQoYXJnKTtcclxuXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdFx0XHRhcmcuZm9yRWFjaChpbnNlcnQpO1xyXG5cdFx0XHRcdGVsc2UgaWYodHlwZW9mIGFyZy5mb3JFYWNoID09PSBcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRhcmcuZm9yRWFjaChpbnNlcnQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRcclxuXHRQcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRpZihhcmd1bWVudHMubGVuZ3RoIDwgMSlcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5zdWZmaWNpZW50IGFyZ3VtZW50cyEgT25lIG9yIHR3byBub2RlcyByZXF1aXJlZCFcIik7XHJcblx0XHRcclxuXHRcdGNvbnN0IHBhcmVudCA9IGFyZ3VtZW50cy5sZW5ndGggPT0gMSA/IHRoaXMucGFyZW50Tm9kZSA6IHRoaXM7XHJcblx0XHRjb25zdCBvbGROb2RlID0gYXJndW1lbnRzLmxlbmd0aCA9PSAxID8gdGhpcyA6IGFyZ3VtZW50c1swXTtcclxuXHRcdGNvbnN0IG5ld05vZGUgPSBhcmd1bWVudHMubGVuZ3RoID09IDEgPyBhcmd1bWVudHNbMF0gOiBhcmd1bWVudHNbMV07XHJcblx0XHRcclxuXHRcdGlmKG5ld05vZGUgaW5zdGFuY2VvZiBBcnJheSB8fCBuZXdOb2RlIGluc3RhbmNlb2YgTm9kZUxpc3QgfHwgbmV3Tm9kZSBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKXtcclxuXHRcdFx0bmV3Tm9kZS5mb3JFYWNoKGFJdGVtID0+IHBhcmVudC5pbnNlcnRCZWZvcmUoYUl0ZW0sIG9sZE5vZGUpKTtcclxuXHRcdFx0b2xkTm9kZS5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0cGFyZW50LnJlcGxhY2VDaGlsZChuZXdOb2RlLG9sZE5vZGUpO1xyXG5cdH07XHJcblx0XHJcblx0UHJvdG90eXBlLmFmdGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdGlmKHRoaXMucGFyZW50Tm9kZSA9PSBudWxsKVxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbnNlcnQgbm9kZXMgYWZ0ZXIgdGhpcyBub2RlISBQYXJlbnQgbm9kZSBub3QgYXZhaWxhYmxlIVwiKTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xyXG5cdFx0Y29uc3QgbmV4dCA9IHRoaXMubmV4dFNpYmxpbmc7XHJcblx0XHRpZihuZXh0KVxyXG5cdFx0XHRQcm90b3R5cGUuYmVmb3JlLmFwcGx5KG5leHQsIGFyZ3VtZW50cyk7XHJcblx0XHRlbHNlXHJcblx0XHRcdFByb3RvdHlwZS5hcHBlbmQuYXBwbHkocGFyZW50LCBhcmd1bWVudHMpO1xyXG5cdH07XHRcclxuXHRcclxuXHRQcm90b3R5cGUuYmVmb3JlID0gZnVuY3Rpb24oKXtcclxuXHRcdGlmKHRoaXMucGFyZW50Tm9kZSA9PSBudWxsKVxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbnNlcnQgbm9kZXMgYWZ0ZXIgdGhpcyBub2RlISBQYXJlbnQgbm9kZSBub3QgYXZhaWxhYmxlIVwiKTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xyXG5cdFx0Y29uc3QgaW5zZXJ0ZXIgPSAobm9kZSkgPT4ge3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgdGhpcyk7fVxyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdGNvbnN0IGFyZyA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdFx0aWYoYXJnIGluc3RhbmNlb2YgTm9kZSlcclxuXHRcdFx0XHRpbnNlcnRlcihhcmcpO1xyXG5cdFx0XHRlbHNlIGlmKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdFx0YXJnLmZvckVhY2goaW5zZXJ0ZXIpO1xyXG5cdFx0XHRlbHNlIGlmKHR5cGVvZiBhcmcuZm9yRWFjaCA9PT0gXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdGFyZy5mb3JFYWNoKGluc2VydGVyKTtcclxuXHRcdH1cclxuXHR9O1x0XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBzdXBwb3J0OyIsImltcG9ydCBFeHRlbmRlciBmcm9tIFwiLi4vLi4vdXRpbHMvRXh0ZW5kZXJcIjtcclxuXHJcbmNvbnN0IHBhcmVudFNlbGVjdG9yID0gLzpwYXJlbnQoXFwoXFxcIihbXlxcKV0qKVxcXCJcXCkpPy9pO1xyXG5jb25zdCBxdWVyeUV4ZWN1dGVyID0gZnVuY3Rpb24oYUVsZW1lbnQsIGFTZWxlY3Rvcil7XHJcblx0bGV0IG1hdGNoID0gcGFyZW50U2VsZWN0b3IuZXhlYyhhU2VsZWN0b3IpO1xyXG5cdGlmKG1hdGNoKXtcclxuXHRcdGxldCByZXN1bHQgPSBhRWxlbWVudDtcclxuXHRcdGlmKG1hdGNoLmluZGV4ID4gMCl7XHJcblx0XHRcdHJlc3VsdCA9IGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYVNlbGVjdG9yLnN1YnN0cigwLCBtYXRjaC5pbmRleCkpO1xyXG5cdFx0XHRpZihyZXN1bHQubGVuZ3RoID09IDApXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0fVx0XHJcblx0XHRyZXN1bHQgPSByZXN1bHQucGFyZW50KG1hdGNoWzJdKTtcdFx0XHRcclxuXHRcdGlmKHJlc3VsdCl7XHJcblx0XHRcdGxldCBuZXh0U2VsZWN0b3IgPSBhU2VsZWN0b3Iuc3Vic3RyKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKS50cmltKCk7XHJcblx0XHRcdGlmKG5leHRTZWxlY3Rvci5sZW5ndGggPiAwKVxyXG5cdFx0XHRcdHJlc3VsdCA9IHJlc3VsdC5maW5kKG5leHRTZWxlY3Rvcik7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fVx0XHRcclxuXHR9XHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYVNlbGVjdG9yKTtcclxufTtcclxuXHJcblxyXG5jb25zdCBzdXBwb3J0ID0gRXh0ZW5kZXIoXCJRdWVyeVN1cHBvcnRcIiwgUHJvdG90eXBlID0+IHtcdFxyXG5cdFByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgbm9kZXMgPSBbXTtcclxuXHRcdGxldCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xyXG5cdFx0bGV0IGFyZyA9IGFyZ3Muc2hpZnQoKTtcclxuXHRcdHdoaWxlKGFyZyl7XHJcblx0XHRcdGlmKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpe1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSBxdWVyeUV4ZWN1dGVyKHRoaXMsIGFyZyk7XHJcblx0XHRcdFx0aWYocmVzdWx0KVxyXG5cdFx0XHRcdFx0bm9kZXMucHVzaChyZXN1bHQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRhcmcgPSBhcmdzLnNoaWZ0KCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGxldCByZXN1bHQgPSBOb2RlTGlzdC5mcm9tLmFwcGx5KG51bGwsIG5vZGVzKTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fTtcclxuXHRcclxuXHRQcm90b3R5cGUuaXMgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHRoaXMgaW5zdGFuY2VvZiBEb2N1bWVudCB8fCB0aGlzIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudClcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1x0XHRcclxuXHRcdGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0aWYodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5tYXRjaGVzKGFyZ3VtZW50c1swXSk7XHJcblx0XHRcdGVsc2UgaWYodHlwZW9mIGFyZ3VtZW50c1swXS5sZW5ndGggPT09IFwibnVtYmVyXCIpe1xyXG5cdFx0XHRcdGxldCBmaWx0ZXIgPSBhcmd1bWVudHNbMF07XHJcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKylcclxuXHRcdFx0XHRcdGlmKHRoaXMubWF0Y2hlcyhmaWx0ZXJbaV0pKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVx0XHRcdFx0XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5pcyhBcnJheS5mcm9tKGFyZ3VtZW50cykpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcdFxyXG5cdFxyXG5cdFByb3RvdHlwZS5wYXJlbnQgPSBmdW5jdGlvbihzZWxlY3RvciwgaWdub3JlU2hhZG93Um9vdCkge1x0XHRcclxuXHRcdGlmKCF0aGlzLnBhcmVudE5vZGUpXHJcblx0XHRcdHJldHVybiBudWxsO1x0XHRcclxuXHRcdGlnbm9yZVNoYWRvd1Jvb3QgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiYm9vbGVhblwiID8gc2VsZWN0b3IgOiBpZ25vcmVTaGFkb3dSb290O1xyXG5cdFx0c2VsZWN0b3IgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgPyBzZWxlY3RvciA6IG51bGw7XHJcblx0XHRcclxuXHRcdGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XHRcdFxyXG5cdFx0aWYocGFyZW50IGluc3RhbmNlb2YgU2hhZG93Um9vdCAmJiBpZ25vcmVTaGFkb3dSb290KVxyXG5cdFx0XHRwYXJlbnQgPSBwYXJlbnQuaG9zdDtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRpZihzZWxlY3Rvcil7XHJcblx0XHRcdHRyeXtcclxuXHRcdFx0XHR3aGlsZShwYXJlbnQgJiYgIXBhcmVudC5pcyhzZWxlY3RvcikpXHJcblx0XHRcdFx0XHRwYXJlbnQgPSBwYXJlbnQucGFyZW50KHNlbGVjdG9yLCBpZ25vcmVTaGFkb3dSb290KTtcclxuXHRcdFx0fWNhdGNoIChlKSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcInRoaXM6XCIsIHRoaXMsIFwicGFyZW50OlwiLCBwYXJlbnQsIFwiZXJyb3I6XCIsIGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBwYXJlbnQ7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGFyZW50O1xyXG5cdH07XHJcblx0XHJcblx0UHJvdG90eXBlLnBhcmVudHMgPSBmdW5jdGlvbigpIHtcdFx0XHJcblx0XHRsZXQgcmVzdWx0ID0gbmV3IEFycmF5KCk7XHJcblx0XHRsZXQgcGFyZW50ID0gUHJvdG90eXBlLnBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0d2hpbGUocGFyZW50KXtcclxuXHRcdFx0cmVzdWx0LnB1c2gocGFyZW50KTtcclxuXHRcdFx0cGFyZW50ID0gUHJvdG90eXBlLnBhcmVudC5hcHBseShwYXJlbnQsIGFyZ3VtZW50cyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBOb2RlTGlzdC5mcm9tKHJlc3VsdCk7XHJcblx0fTtcdFxyXG5cclxuXHRQcm90b3R5cGUuc2VsZWN0b3IgPSBmdW5jdGlvbigpe1xyXG5cdFx0aWYodGhpcyBpbnN0YW5jZW9mIERvY3VtZW50IHx8IHRoaXMgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KVxyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0ZWxzZSBpZih0aGlzLmlkKVxyXG5cdFx0XHRyZXR1cm4gXCIjXCIgKyB0aGlzLmlkO1xyXG5cdFx0ZWxzZXtcdFx0XHRcclxuXHRcdFx0bGV0IHNlbGVjdG9yID0gdGhpcy50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudCgpO1xyXG5cdFx0XHRpZihwYXJlbnQpe1xyXG5cdFx0XHRcdGxldCBzYW1lVGFnU2libGluZ3MgPSBwYXJlbnQuZmluZChcIjpzY29wZT5cIiArIHNlbGVjdG9yKTtcdFx0XHRcclxuXHRcdFx0XHRpZiAoc2FtZVRhZ1NpYmxpbmdzIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuXHRcdFx0XHRcdGxldCBpbmRleCA9IHNhbWVUYWdTaWJsaW5ncy5pbmRleE9mKHRoaXMpO1xyXG5cdFx0XHRcdFx0aWYgKGluZGV4ID4gMClcclxuXHRcdFx0XHRcdFx0c2VsZWN0b3IgKz0gJzpudGgtY2hpbGQoJyArIChpbmRleCArIDEpICsgJyknO1xyXG5cdFx0XHRcdH1cdFx0XHJcblx0XHRcdFx0bGV0IHBhcmVudFNlbGVjdG9yID0gcGFyZW50LnNlbGVjdG9yKCk7XHJcblx0XHRcdFx0cmV0dXJuIHBhcmVudFNlbGVjdG9yID8gcGFyZW50U2VsZWN0b3IgKyBcIj5cIiArIHNlbGVjdG9yIDogc2VsZWN0b3I7XHJcblx0XHRcdH0gXHJcblx0XHRcdHJldHVybiBzZWxlY3RvcjtcclxuXHRcdH1cclxuXHR9O1x0XHJcblxyXG5cdFByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24oYVF1ZXJ5KSB7XHRcdFx0XHJcblx0XHRsZXQgbm9kZSA9IHRoaXM7XHJcblx0XHR3aGlsZShub2RlKXtcclxuXHRcdFx0bGV0IGNsb3Nlc3RzID0gbm9kZS5maW5kKGFRdWVyeSk7XHJcblx0XHRcdGlmKGNsb3Nlc3RzICYmIGNsb3Nlc3RzLmxlbmd0aCA+IDApXHJcblx0XHRcdFx0cmV0dXJuIGNsb3Nlc3RzO1xyXG5cdFx0XHRlbHNlIGlmKG5vZGUuaXMoYVF1ZXJ5KSlcclxuXHRcdFx0XHRyZXR1cm4gTm9kZUxpc3QuZnJvbShub2RlKTtcclxuXHRcdFx0XHJcblx0XHRcdG5vZGUgPSBub2RlLnBhcmVudCgpO1x0XHRcclxuXHRcdH1cclxuXHR9O1xyXG5cdFxyXG5cdFByb3RvdHlwZS5uZXN0ZWQgPSBmdW5jdGlvbihhUXVlcnkpe1xyXG5cdFx0aWYodGhpcy5pcyhhUXVlcnkpKVxyXG5cdFx0XHRyZXR1cm4gTm9kZUxpc3QuZnJvbSh0aGlzKTtcdFxyXG5cdFx0XHJcblx0XHRsZXQgbmVzdGVkID0gdGhpcy5maW5kKGFRdWVyeSk7XHJcblx0XHRpZihuZXN0ZWQgJiYgbmVzdGVkLmxlbmd0aCA+IDApXHJcblx0XHRcdHJldHVybiBuZXN0ZWQ7XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBOb2RlTGlzdC5mcm9tKHRoaXMucGFyZW50KGFRdWVyeSkpO1xyXG5cdH07XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBzdXBwb3J0O1xyXG5cclxuIiwiaW1wb3J0IEV4dGVuZGVyIGZyb20gXCIuLi8uLi91dGlscy9FeHRlbmRlclwiO1xyXG5cclxuY29uc3Qgc3VwcG9ydCA9IEV4dGVuZGVyKFwiUmVhZHlFdmVudFN1cHBvcnRcIiwgUHJvdG90eXBlID0+IHtcclxuXHRQcm90b3R5cGUucmVhZHkgPSBmdW5jdGlvbihhRnVuY3Rpb24sIG9uY2Upe1x0XHJcblx0XHR0aGlzLm9uKFwicmVhZHlcIiwgYUZ1bmN0aW9uLCBvbmNlKTtcclxuXHRcdGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgPT0gXCJjb21wbGV0ZVwiKVx0XHRcdFxyXG5cdFx0XHR0aGlzLnRyaWdnZXIoXCJyZWFkeVwiKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHRcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHN1cHBvcnQ7IiwiaW1wb3J0IEV4dGVuZGVyIGZyb20gXCIuLi8uLi91dGlscy9FeHRlbmRlclwiO1xyXG5cclxuY29uc3QgSElERVZBTFVFID0gXCJub25lXCI7XHJcblxyXG5jb25zdCBpc0hpZGRlbiA9IChlbGVtZW50KSA9PiB7XHJcblx0cmV0dXJuIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gSElERVZBTFVFXHJcbn07XHJcblxyXG5jb25zdCBpbml0ID0gKGVsZW1lbnQpID0+IHtcdFxyXG5cdGxldCBkaXNwbGF5ID0gIWlzSGlkZGVuKGVsZW1lbnQpID8gZWxlbWVudC5zdHlsZS5kaXNwbGF5IDogXCJcIjtcclxuXHRcclxuXHRlbGVtZW50LnNob3cgPSAoZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XHJcblx0XHRyZXR1cm4gdGhpcztcdFx0XHJcblx0fSkuYmluZChlbGVtZW50KTtcclxuXHRcclxuXHRlbGVtZW50LmhpZGUgPSAoZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IEhJREVWQUxVRTtcclxuXHRcdHJldHVybiB0aGlzO1x0XHRcclxuXHR9KS5iaW5kKGVsZW1lbnQpO1xyXG5cdFxyXG5cdHJldHVybiBlbGVtZW50O1xyXG59O1xyXG5cclxuXHJcbmNvbnN0IHN1cHBvcnQgPSBFeHRlbmRlcihcIlNob3dIaWRlU3VwcG9ydFwiLCBQcm90b3R5cGUgPT4ge1xyXG5cdFByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gaW5pdCh0aGlzKS5zaG93LmFwcGx5KG51bGwsIGFyZ3VtZW50cylcclxuXHR9O1xyXG5cclxuXHRQcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGluaXQodGhpcykuaGlkZS5hcHBseShudWxsLCBhcmd1bWVudHMpXHJcblx0fTtcclxuXHJcblx0UHJvdG90eXBlLnRvZ2dsZVNob3cgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBpc0hpZGRlbih0aGlzKSA/IHRoaXMuc2hvdygpIDogdGhpcy5oaWRlKCk7XHJcblx0fTtcclxuXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBzdXBwb3J0OyIsImltcG9ydCBFeHRlbmRlciBmcm9tIFwiLi4vLi4vdXRpbHMvRXh0ZW5kZXJcIjtcclxuXHJcbmNvbnN0IElucHV0VHlwZXMgPSBbXHJcblx0e1xyXG5cdFx0c2VsZWN0b3IgOiBcInNlbGVjdFwiLFxyXG5cdFx0Z2V0IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gW107XHJcblx0XHRcdHRoaXMuZmluZChcIm9wdGlvblwiKS5mb3JFYWNoKG9wdGlvbiA9PiB7XHJcblx0XHRcdFx0aWYob3B0aW9uLnNlbGVjdGVkKVxyXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2gob3B0aW9uLnZhbHVlKTtcclxuXHRcdFx0fSk7XHRcdFx0XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9LFxyXG5cdFx0c2V0IDogZnVuY3Rpb24oKXtcdFx0XHRcdFxyXG5cdFx0XHRsZXQgdmFsdWVzID0gW107XHJcblx0XHRcdGNvbnN0IGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XHJcblx0XHRcdGxldCBhcmcgPSBhcmdzLnNoaWZ0KCk7XHJcblx0XHRcdHdoaWxlKGFyZyl7XHJcblx0XHRcdFx0aWYoQXJyYXkuaXNBcnJheShhcmcpKVxyXG5cdFx0XHRcdFx0dmFsdWVzID0gdmFsdWVzLmNvbmNhdChhcmcpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHZhbHVlcy5wdXNoKGFyZyk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0YXJnID0gYXJncy5zaGlmdCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZXM7XHJcblx0XHRcdHRoaXMuZmluZChcIm9wdGlvblwiKS5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0ZWQgPSB2YWx1ZXMuaW5kZXhPZihvcHRpb24udmFsdWUpID49IDApO1x0XHRcdFxyXG5cdFx0XHR0aGlzLnRyaWdnZXIoXCJjaGFuZ2VkXCIpO1xyXG5cdFx0fVx0XHRcdFxyXG5cdH0sXHJcblx0e1xyXG5cdFx0c2VsZWN0b3IgOiBcImlucHV0W3R5cGU9XFxcImNoZWNrYm94XFxcIl0sIGlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl1cIixcclxuXHRcdGdldCA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKHRoaXMudmFsdWUgPT0gXCJvblwiIHx8IHRoaXMudmFsdWUgPT0gXCJvZmZcIilcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jaGVja2VkO1xyXG5cdFx0XHRlbHNlIGlmKHRoaXMuY2hlY2tlZClcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy52YWx1ZTtcdFx0XHRcdFxyXG5cdFx0fSxcclxuXHRcdHNldCA6IGZ1bmN0aW9uKGFWYWx1ZSl7XHJcblx0XHRcdGlmKHR5cGVvZiBhVmFsdWUgPT09IFwiYm9vbGVhblwiKVxyXG5cdFx0XHRcdHRoaXMuY2hlY2tlZCA9IGFWYWx1ZTtcclxuXHRcdFx0ZWxzZSBpZih0eXBlb2YgYVZhbHVlID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRcdHRoaXMuY2hlY2tlZCA9IHRoaXMudmFsdWUgPT0gYVZhbHVlO1xyXG5cdFx0XHRlbHNlIGlmKEFycmF5LmlzQXJyYXkoYVZhbHVlKSlcclxuXHRcdFx0XHR0aGlzLmNoZWNrZWQgPSBhVmFsdWUuaW5kZXhPZih0aGlzLnZhbHVlKSA+PSAwO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy50cmlnZ2VyKFwiY2hhbmdlZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcbl07XHJcblxyXG5jb25zdCBEZWZhdWx0SW5wdXRUeXBlID0ge1xyXG5cdFx0Z2V0IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0cmV0dXJuIHRoaXMudmFsdWU7XHJcblx0XHR9LFxyXG5cdFx0c2V0IDogZnVuY3Rpb24oYVZhbHVlKXtcclxuXHRcdFx0dGhpcy52YWx1ZSA9IGFWYWx1ZTtcclxuXHRcdFx0dGhpcy50cmlnZ2VyKFwiaW5wdXRcIik7XHJcblx0XHR9XHRcclxufTtcclxuXHJcbmNvbnN0IGdldElucHV0VHlwZSA9IGZ1bmN0aW9uKGFFbGVtZW50KXtcclxuXHRmb3IobGV0IGkgPSAwOyBpIDwgSW5wdXRUeXBlcy5sZW5ndGg7IGkrKylcclxuXHRcdGlmKGFFbGVtZW50LmlzKElucHV0VHlwZXNbaV0uc2VsZWN0b3IpKVxyXG5cdFx0XHRyZXR1cm4gSW5wdXRUeXBlc1tpXTtcdFx0XHJcblx0cmV0dXJuIERlZmF1bHRJbnB1dFR5cGU7XHJcbn07XHJcblxyXG5cclxuY29uc3Qgc3VwcG9ydCA9IEV4dGVuZGVyKFwiVmFsdWVTdXBwb3J0XCIsIFByb3RvdHlwZSA9PiB7XHRcclxuXHRQcm90b3R5cGUudmFsID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgdHlwZSA9IGdldElucHV0VHlwZSh0aGlzKTtcclxuXHRcdGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMClcclxuXHRcdFx0cmV0dXJuIHR5cGUuZ2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRlbHNlXHJcblx0XHRcdHR5cGUuc2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcdFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgc3VwcG9ydDsiLCJpbXBvcnQgXCIuL2RvbS9FdmVudFRhcmdldFwiO1xyXG5pbXBvcnQgXCIuL2RvbS9Ob2RlXCI7XHJcbmltcG9ydCBcIi4vZG9tL0VsZW1lbnRcIjtcclxuaW1wb3J0IFwiLi9kb20vRG9jdW1lbnRcIjtcclxuaW1wb3J0IFwiLi9kb20vRG9jdW1lbnRGcmFnbWVudFwiO1xyXG5pbXBvcnQgXCIuL2RvbS9IVE1MRWxlbWVudFwiO1xyXG5pbXBvcnQgXCIuL2RvbS9IVE1MSW5wdXRFbGVtZW50XCI7XHJcbmltcG9ydCBcIi4vZG9tL0hUTUxUZXh0QXJlYUVsZW1lbnRcIjtcclxuaW1wb3J0IFwiLi9kb20vSFRNTFNlbGVjdEVsZW1lbnRcIjtcclxuaW1wb3J0IFwiLi9kb20vTm9kZUxpc3RcIjtcclxuaW1wb3J0IFwiLi9kb20vSHRtbENvbGxlY3Rpb25cIjtcclxuaW1wb3J0IFwiLi9HbG9iYWxcIjtcclxuIiwiY29uc3QgRGVsZWdhdGVyQnVpbGRlciA9IGZ1bmN0aW9uKCkge1xyXG5cdGNvbnN0IGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XHJcblx0Y29uc3QgY2FsbGJhY2sgPSBhcmdzLnNoaWZ0KCk7XHJcblx0Y29uc3Qgc291cmNlID0gYXJncy5zaGlmdCgpO1xyXG5cdGFyZ3MuZm9yRWFjaCggdGFyZ2V0ID0+e1xyXG5cdFx0T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxyXG5cdFx0LmZvckVhY2gobmFtZSA9PiB7XHJcblx0XHRcdGNvbnN0IHByb3AgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XHJcblx0XHRcdGlmICh0eXBlb2Ygc291cmNlW25hbWVdID09PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBwcm9wLnZhbHVlID09PSBcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0c291cmNlW25hbWVdID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIG5hbWUsIGFyZ3VtZW50cyk7XHJcblx0XHRcdFx0fTtcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0XHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IERlbGVnYXRlckJ1aWxkZXI7IiwiY29uc3QgZXh0ZW5kUHJvdG90eXBlID0gZnVuY3Rpb24oKXtcclxuXHRjb25zdCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xyXG5cdGNvbnN0IHR5cGUgPSBhcmdzLnNoaWZ0KCk7XHRcclxuXHR3aGlsZShhcmdzLmxlbmd0aCA+IDApe1xyXG5cdFx0Y29uc3QgZXh0ZW5kZXIgPSBhcmdzLnNoaWZ0KCk7XHJcblx0XHRleHRlbmRlcih0eXBlKTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBleHRlbmRQcm90b3R5cGU7IiwiaW1wb3J0IFV0aWxzIGZyb20gXCIuL1V0aWxzXCI7XHJcblxyXG5jb25zdCBFWFRFTlNJT05TX01BUCA9IFV0aWxzLmdsb2JhbFZhcihcIl9fX0RPTV9BUElfRVhURU5TSU9OX01BUF9fX1wiLCB7fSk7XHJcbmNvbnN0IEV4dGVuZGVyID0gZnVuY3Rpb24oYU5hbWUsIGFFeHRlbnRpb24pe1xyXG5cdHJldHVybiBmdW5jdGlvbihhVHlwZSl7XHRcclxuXHRcdGxldCBleHRlbnNpb25zID0gRVhURU5TSU9OU19NQVBbYVR5cGUubmFtZV07XHJcblx0XHRpZighZXh0ZW5zaW9ucylcclxuXHRcdFx0ZXh0ZW5zaW9ucyA9IEVYVEVOU0lPTlNfTUFQW2FUeXBlLm5hbWVdID0ge307XHRcdFxyXG5cdFx0XHJcblx0XHRpZighZXh0ZW5zaW9uc1thTmFtZV0pe1xyXG5cdFx0XHRleHRlbnNpb25zW2FOYW1lXSA9IHRydWU7XHJcblx0XHRcdGFFeHRlbnRpb24oYVR5cGUucHJvdG90eXBlKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0Y29uc29sZS53YXJuKFwiZHVwbGljYXRlZCBsb2FkIG9mIGV4dGVuc2lvbiBcXFwiXCIgKyBhTmFtZSArIFwiXFxcIiFcIik7XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5kZXI7IiwiY29uc3QgVXRpbHMgPSB7XHJcblx0Z2xvYmFsIDogKCgpID0+IHtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHJldHVybiB3aW5kb3c7XHJcblx0XHRpZih0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZ2xvYmFsO1xyXG5cdFx0aWYodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBzZWxmO1xyXG5cdFx0cmV0dXJuIHt9O1x0XHRcclxuXHR9KSgpLFxyXG5cdGdsb2JhbFZhciA6IGZ1bmN0aW9uKGFOYW1lLCBhSW5pdFZhbHVlKXtcclxuXHRcdGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdHlwZW9mIFV0aWxzLmdsb2JhbFthTmFtZV0gPT09IFwidW5kZWZpbmVkXCIpXHJcblx0XHRcdFV0aWxzLmdsb2JhbFthTmFtZV0gPSBhSW5pdFZhbHVlO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gVXRpbHMuZ2xvYmFsW2FOYW1lXTtcdFx0XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVXRpbHM7IiwiaW1wb3J0IEdMT0JBTCBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvR2xvYmFsXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4vc3JjL3V0aWxzXCI7XG5pbXBvcnQgUmVhZHkgZnJvbSBcIi4vc3JjL1JlYWR5XCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCIuL3NyYy9Db21wb25lbnRcIjtcblxuY29uc3QgcGFjayA9IHtWRVJTSU9OIDogXCIke3ZlcnNpb259XCIsIHV0aWxzLCBSZWFkeSwgQ29tcG9uZW50IH07XG5cbkdMT0JBTC5kZWZhdWx0anMgPSBHTE9CQUwuZGVmYXVsdGpzIHx8IHt9O1xuR0xPQkFMLmRlZmF1bHRqcy5odG1sID0gR0xPQkFMLmRlZmF1bHRqcy5odG1sIHx8IHt9O1xuR0xPQkFMLmRlZmF1bHRqcy5odG1sLmNvbXBvbmVudHMgPSBHTE9CQUwuZGVmYXVsdGpzLmh0bWwuY29tcG9uZW50cyB8fCBwYWNrO1xuIiwiaW1wb3J0IHtwcml2YXRlUHJvcGVydHkgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvUHJpdmF0ZVByb3BlcnR5XCI7XG5pbXBvcnQgeyBsYXp5UHJvbWlzZSB9IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9Qcm9taXNlVXRpbHNcIjtcbmltcG9ydCB7IHV1aWQgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvVVVJRFwiO1xuaW1wb3J0IHsgaW5pdFRpbWVvdXQsIHRyaWdnZXJUaW1lb3V0IH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBhdHRyaWJ1dGVDaGFuZ2VFdmVudG5hbWUsIGNvbXBvbmVudEV2ZW50bmFtZSB9IGZyb20gXCIuL3V0aWxzL0V2ZW50SGVscGVyXCI7XG5pbXBvcnQgV2Vha0RhdGEgZnJvbSBcIi4vdXRpbHMvV2Vha0RhdGFcIjtcblxuY29uc3QgUFJJVkFURV9SRUFEWSA9IFwicmVhZHlcIjtcblxuY29uc3QgVElNRU9VVFMgPSBuZXcgV2Vha0RhdGEoKTtcbmNvbnN0IGluaXQgPSAoY29tcG9uZW50KSA9PiB7XG5cdGNvbnN0IGRhdGEgPSBUSU1FT1VUUy5kYXRhKGNvbXBvbmVudCk7XG5cdGlmIChkYXRhLmluaXRpYWxpemUpIGNsZWFyVGltZW91dChkYXRhLmluaXRpYWxpemUpO1xuXG5cdGRhdGEuaW5pdGlhbGl6ZSA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuXHRcdGRlbGV0ZSBkYXRhLmluaXRpYWxpemU7XG5cblx0XHRhd2FpdCBjb21wb25lbnQuaW5pdCgpO1xuXHRcdGNvbXBvbmVudC5yZWFkeS5yZXNvbHZlKCk7XG5cdFx0Y29tcG9uZW50LnRyaWdnZXIoY29tcG9uZW50RXZlbnRuYW1lKFwiaW5pdGlhbHplZFwiLCBjb21wb25lbnQpKTtcblx0fSwgaW5pdFRpbWVvdXQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVVJRCA9IChwcmVmaXgsIHN1ZmZpeCkgPT4ge1xuXHRsZXQgY291bnQgPSAwO1xuXHRsZXQgaWQgPSBudWxsO1xuICAgIHdoaWxlKGNvdW50IDwgMTAwKXtcblx0XHRpZCA9IGAke3ByZWZpeH0ke3V1aWQoKX0ke3N1ZmZpeH1gO1xuXHRcdGlmKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpXG5cdFx0XHRyZXR1cm4gaWQ7XG5cblx0XHRjb3VudCsrO1xuXHR9XG5cdGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKFwiVG8gbWFueSByZXRyaWVzIHRvIGNyZWF0ZSBhbiB1bmlxdWUgaWQgLSBjcmVhdGVkIGlkIGlzIG5vdCB1bmlxdWUhXCIpKTtcblx0cmV0dXJuIGlkO1xufTtcblxuXG5jbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdGNvbnN0cnVjdG9yKHtzaGFkb3dSb290ID0gZmFsc2UsIGNvbnRlbnQgPSBudWxsLCBjcmVhdGVVSUQgPSBmYWxzZSwgdWlkUHJlZml4ID0gXCJpZC1cIiwgdWlkU3VmZml4ID0gXCJcIn0gPSB7fSkge1xuXHRcdHN1cGVyKCk7XG5cdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfUkVBRFksIGxhenlQcm9taXNlKCkpO1xuXG5cdFx0aWYoY3JlYXRlVUlEKVxuXHRcdFx0dGhpcy5hdHRyKFwiaWRcIiwgY3JlYXRlVUlEKHVpZFByZWZpeCwgdWlkU3VmZml4KSk7XG5cblx0XHRpZihzaGFkb3dSb290KVxuXHRcdFx0dGhpcy5hdHRhY2hTaGFkb3coe21vZGU6b3Blbn0pO1xuXHRcdFxuXHRcdGlmKGNvbnRlbnQpXG5cdFx0XHR0aGlzLnJvb3QuYXBwZW5kKHR5cGVvZiBjb250ZW50ID09PSBcImZ1bmN0aW9uXCIgPyBjb250ZW50KHRoaXMpIDogY29udGVudCk7XG5cdH1cblxuXHRnZXQgcm9vdCgpe1xuXHRcdHJldHVybiB0aGlzLnNoYWRvd1Jvb3QgfHwgdGhpcztcblx0fVxuXG5cdGdldCByZWFkeSgpe1xuXHRcdHJldHVybiBwcml2YXRlUHJvcGVydHkodGhpcywgUFJJVkFURV9SRUFEWSk7XG5cdH1cblxuXHRhc3luYyBpbml0KCkge31cblxuXHRhc3luYyBkZXN0cm95KCkge1xuXHRcdGlmKHRoaXMucmVhZHkucmVzb2x2ZWQpXG5cdFx0XHRwcml2YXRlUHJvcGVydHkodGhpcywgUFJJVkFURV9SRUFEWSwgbGF6eVByb21pc2UoKSk7XG5cdH1cblxuXHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRpZiAodGhpcy5vd25lckRvY3VtZW50ID09IGRvY3VtZW50KSBpbml0KHRoaXMpO1xuXHR9XG5cblx0YWRvcHRlZENhbGxiYWNrKCkge1xuXHRcdHRoaXMuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0fVxuXG5cdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcblx0XHRpZiAob2xkVmFsdWUgIT0gbmV3VmFsdWUgJiYgdGhpcy5pc0Nvbm5lY3RlZCkge1xuXHRcdFx0dGhpcy50cmlnZ2VyKHRyaWdnZXJUaW1lb3V0LCBhdHRyaWJ1dGVDaGFuZ2VFdmVudG5hbWUobmFtZSwgdGhpcykpO1xuXHRcdFx0dGhpcy50cmlnZ2VyKHRyaWdnZXJUaW1lb3V0LCBjb21wb25lbnRFdmVudG5hbWUoXCJjaGFuZ2VcIiwgdGhpcykpO1xuXHRcdH1cblx0fVxuXG5cdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCl7XG5cdFx0dGhpcy5kZXN0cm95KCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50O1xuIiwiZXhwb3J0IGNvbnN0IGNvbXBvbmVudFByZWZpeCA9IFwiZC1cIjtcbmV4cG9ydCBjb25zdCBhdHRyaWJ1dGVDaGFuZ2VFdmVudFByZWZpeCA9IFwiYXR0cmlidXRlLVwiO1xuZXhwb3J0IGNvbnN0IGluaXRUaW1lb3V0ID0gMTAwO1xuZXhwb3J0IGNvbnN0IHRyaWdnZXJUaW1lb3V0ID0gMTAwO1xuIiwiZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuXHRsZXQgcmVzb2x2ZSwgcmVqZWN0ID0gbnVsbDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IFByb21pc2UoKHIsIGUpID0+IHtcblx0XHRyZXNvbHZlID0gcjtcblx0XHRyZWplY3QgPSBlO1xuXHR9KTtcblxuXHRyZXN1bHQucmVzb2x2ZWQgPSBmYWxzZTtcblx0cmVzdWx0LmVycm9yID0gZmFsc2U7XG5cdHJlc3VsdC5yZXNvbHZlID0gKCkgPT4ge1x0XHRcblx0XHRyZXN1bHQucmVzb2x2ZWQgPSB0cnVlO1xuXHRcdHJlc3VsdC5yZXNvbHZlID0gKCkgPT4ge307XG5cdFx0cmVzb2x2ZSgpO1xuXHR9O1xuXHRyZXN1bHQucmVqZWN0ID0gKCkgPT4ge1xuXHRcdHJlc3VsdC5yZXNvbHZlZCA9IHRydWU7XG5cdFx0cmVzdWx0LmVycm9yID0gdHJ1ZTtcblx0XHRyZXN1bHQucmVqZWN0ID0gKCkgPT4ge307XG5cdFx0cmVqZWN0KCk7XG5cdH07O1xuXG5cdHJldHVybiByZXN1bHQ7XG59O1xuIiwiaW1wb3J0IHsgY29tcG9uZW50UHJlZml4IH0gZnJvbSBcIi4uL0NvbnN0YW50c1wiO1xuXG5leHBvcnQgY29uc3QgdG9Ob2RlTmFtZSA9IChuYW1lLCBwcmVmaXgpID0+IHtcblx0aWYodHlwZW9mIHByZWZpeCA9PT0gXCJzdHJpbmdcIilcblx0XHRyZXR1cm4gcHJlZml4ICsgbmFtZTtcblx0XHRcblx0cmV0dXJuIGNvbXBvbmVudFByZWZpeCArIG5hbWU7XG59O1xuXG5leHBvcnQgY29uc3QgZGVmaW5lID0gZnVuY3Rpb24oY2xhenosIG9wdGlvbnMpIHtcblx0Y29uc3Qgbm9kZW5hbWUgPSBjbGF6ei5OT0RFTkFNRTtcblx0aWYgKCFjdXN0b21FbGVtZW50cy5nZXQobm9kZW5hbWUpKSB7XG5cdFx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKG5vZGVuYW1lLCBjbGF6eiwgb3B0aW9ucyk7XG5cdH1cbn07XG5cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lOyBcbiIsImltcG9ydCB7YXR0cmlidXRlQ2hhbmdlRXZlbnRQcmVmaXh9IGZyb20gXCIuLi9Db25zdGFudHNcIjtcblxuZXhwb3J0IGNvbnN0IGNvbXBvbmVudEV2ZW50bmFtZSA9IChldmVudFR5cGUsIG5vZGUgKSA9PiB7XHRcblx0bGV0IG5vZGVuYW1lID0gXCJ1bnN1cHBvcnRlZFwiO1xuXHRpZih0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIilcblx0XHRub2RlbmFtZSA9IG5vZGU7XG5cdGVsc2UgaWYobm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdG5vZGVuYW1lID0gbm9kZS5ub2RlTmFtZTtcblx0ZWxzZSBpZih0eXBlb2Ygbm9kZS5OT0RFTkFNRSA9PT0gXCJzdHJpbmdcIilcblx0XHRub2RlbmFtZSA9IG5vZGUuTk9ERU5BTUU7XG5cdGVsc2UgdGhyb3cgbmV3IEVycm9yKHR5cGVvZiBub2RlICsgXCIgaXMgbm90IHN1cHBvcnRlZCBhcyBwcmFtIG5vZGUhXCIpO1xuXHRcbiAgIHJldHVybiBgJHtub2RlbmFtZS50b0xvd2VyQ2FzZSgpfToke2V2ZW50VHlwZX1gO1xufTtcblxuXG5leHBvcnQgY29uc3QgYXR0cmlidXRlQ2hhbmdlRXZlbnRuYW1lID0gKGF0dHJpYnV0ZSwgbm9kZSApID0+IHtcbiAgICByZXR1cm4gY29tcG9uZW50RXZlbnRuYW1lKGF0dHJpYnV0ZUNoYW5nZUV2ZW50UHJlZml4ICsgXCItXCIgKyBhdHRyaWJ1dGUsIG5vZGUpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge2NvbXBvbmVudEV2ZW50bmFtZSwgYXR0cmlidXRlQ2hhbmdlRXZlbnRuYW1lfSIsImltcG9ydCBHbG9iYWwgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL0dsb2JhbFwiXG5cbmV4cG9ydCBjb25zdCBjb3B5U3R5bGVzID0gKHNvdXJjZSwgdGFyZ2V0LCBhcHBlbmQgPSB0cnVlKSA9PiB7XG5cdGNvbnN0IHN0eWxlcyA9IHNvdXJjZS5maW5kKGBzdHlsZVt0eXBlPVwidGV4dC9jc3NcIl0sIGxpbmtbcmVsPVwic3R5bGVzaGVldFwiXWApO1xuXG5cdGlmIChhcHBlbmQpXG5cdFx0dGFyZ2V0LmFwcGVuZChzdHlsZXMuY2xvbmVOb2RlKHRydWUpKTtcblx0ZWxzZVxuXHRcdHRhcmdldC5wcmVwZW5kKHN0eWxlcy5jbG9uZU5vZGUodHJ1ZSkpO1xufVxuXG5leHBvcnQgY29uc3QgQ1NTX0JBU0VfUEFUSF9WQVIgPSBcIkNTU19CQVNFX1BBVEhcIjtcbmV4cG9ydCBjb25zdCBsb2FkQ29tcG9uZW50U3R5bGUgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHBhdGggPSBgJHtHbG9iYWxbQ1NTX0JBU0VfUEFUSF9WQVJdIHx8IFwiY3NzXCJ9LyR7dGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCl9LmNzc2A7XG5cdHRhcmdldC5hcHBlbmQoYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJHtwYXRofVwiLz5gKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyBDU1NfQkFTRV9QQVRIX1ZBUiwgY29weVN0eWxlcywgbG9hZENvbXBvbmVudFN0eWxlIH07IiwiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlXCI7XG5leHBvcnQgY29uc3QgQVRUUl9URU1QTEFURSA9IFwidGVtcGxhdGVcIjtcblxuY29uc3QgZ2V0VGVtcGxhdGUgPSAobm9kZSkgPT4ge1xuXHRsZXQgdGVtcGxhdGUgPSBub2RlLmZpbmQoXCI6c2NvcGUgPiB0ZW1wbGF0ZVwiKS5maXJzdCgpO1xuXHRpZiAoISF0ZW1wbGF0ZSkgcmV0dXJuIHRlbXBsYXRlO1xuXHRjb25zdCB2YWx1ZSA9IG5vZGUuYXR0cihBVFRSX1RFTVBMQVRFKTtcblx0aWYgKCF2YWx1ZSkgcmV0dXJuIG51bGw7XG5cdHRyeSB7XG5cdFx0dGVtcGxhdGUgPSBmaW5kKHZhbHVlKS5maXJzdCgpO1xuXHRcdGlmICghIXRlbXBsYXRlKSByZXR1cm4gdGVtcGxhdGU7XG5cdH0gY2F0Y2ggKGUpIHsgfVxuXHRyZXR1cm4gbmV3IFVSTCh2YWx1ZSwgbG9jYXRpb24uaHJlZik7XG59O1xuXG5leHBvcnQgY29uc3QgbG9hZFRlbXBsYXRlID0gYXN5bmMgKG5vZGUsIGRlZmF1bHRUZW1wbGF0ZSwgY2FjaGUsIGFsaWFzKSA9PiB7XG5cdGNvbnN0IHRlbXBsYXRlID0gZ2V0VGVtcGxhdGUobm9kZSk7XG5cdGlmICh0ZW1wbGF0ZSlcblx0XHRyZXR1cm4gVGVtcGxhdGUubG9hZCh0ZW1wbGF0ZSwgY2FjaGUsIGFsaWFzKTtcblxuXHRyZXR1cm4gZGVmYXVsdFRlbXBsYXRlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBBVFRSX1RFTVBMQVRFLCBsb2FkVGVtcGxhdGUgfTsiLCJpbXBvcnQgeyBkZWZWYWx1ZSB9IGZyb21cIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL09iamVjdFV0aWxzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWFrRGF0YSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGRlZlZhbHVlKHRoaXMsIFwid2Vha21hcFwiLCBuZXcgV2Vha01hcCgpKTtcblx0fVxuXG5cdGRhdGEocmVmZXJlbmNlKSB7XG5cdFx0bGV0IGRhdGEgPSB0aGlzLndlYWttYXAuZ2V0KHJlZmVyZW5jZSk7XG5cdFx0aWYgKCFkYXRhKSB7XG5cdFx0XHRkYXRhID0ge307XG5cdFx0XHR0aGlzLndlYWttYXAuc2V0KHJlZmVyZW5jZSwgZGF0YSk7XG5cdFx0fVxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0dmFsdWUocmVmZXJlbmNlLCBrZXksIHZhbHVlKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikgcmV0dXJuIHRoaXMuZGF0YShyZWZlcmVuY2UpW2tleV07XG5cdFx0ZWxzZSB0aGlzLmRhdGEocmVmZXJlbmNlKVtrZXldID0gdmFsdWU7XG5cdH1cbn07XG5cbiIsImltcG9ydCBEZWZpbmVDb21wb25lbnRIZWxwZXIgZnJvbSBcIi4vRGVmaW5lQ29tcG9uZW50SGVscGVyXCI7XG5pbXBvcnQgRXZlbnRIZWxwZXIgZnJvbSBcIi4vRXZlbnRIZWxwZXJcIjtcbmltcG9ydCBOb2RlSGVscGVyIGZyb20gXCIuL0V2ZW50SGVscGVyXCI7XG5pbXBvcnQgU3R5bGVIZWxwZXIgZnJvbSBcIi4vU3R5bGVIZWxwZXJcIjtcbmltcG9ydCBUZW1wbGF0ZUhlbHBlciBmcm9tIFwiLi9UZW1wbGF0ZUhlbHBlclwiO1xuaW1wb3J0IFdlYWtEYXRhIGZyb20gXCIuL1dlYWtEYXRhXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtEZWZpbmVDb21wb25lbnRIZWxwZXIsIEV2ZW50SGVscGVyLCBOb2RlSGVscGVyLCBTdHlsZUhlbHBlciwgVGVtcGxhdGVIZWxwZXIsIFdlYWtEYXRhfTsiLCJpbXBvcnQgR0xPQkFMIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWxcIjtcbmltcG9ydCB7Rm9ybSwgUGFnZSwgQmFzZUZpZWxkLCBGaWVsZCwgTGlzdCwgQ29udGFpbmVyfSBmcm9tIFwiLi9pbmRleFwiXG5cbkdMT0JBTC5kZWZhdWx0anMgPSBHTE9CQUwuZGVmYXVsdGpzIHx8IHt9O1xuR0xPQkFMLmRlZmF1bHRqcy5odG1sID0gR0xPQkFMLmRlZmF1bHRqcy5odG1sIHx8IHt9O1xuR0xPQkFMLmRlZmF1bHRqcy5odG1sLmZvcm0gPSBHTE9CQUwuZGVmYXVsdGpzLmh0bWwuZm9ybSB8fCB7XG5cdFZFUlNJT04gOiBcIiR7dmVyc2lvbn1cIixcblx0Rm9ybSxcblx0UGFnZSxcblx0QmFzZUZpZWxkLFxuXHRGaWVsZCxcblx0Q29udGFpbmVyLFxuXHRMaXN0XG59OyIsImltcG9ydCBCYXNlRmllbGQgZnJvbSBcIi4vc3JjL0Jhc2VGaWVsZFwiO1xuaW1wb3J0IEZpZWxkIGZyb20gXCIuL3NyYy9GaWVsZFwiO1xuaW1wb3J0IENvbnRhaW5lciBmcm9tIFwiLi9zcmMvQ29udGFpbmVyXCI7XG5pbXBvcnQgTGlzdCBmcm9tIFwiLi9zcmMvTGlzdFwiO1xuaW1wb3J0IFBhZ2UgZnJvbSBcIi4vc3JjL1BhZ2VcIlxuaW1wb3J0IEZvcm0gZnJvbSBcIi4vc3JjL0Zvcm1cIjtcblxuZXhwb3J0IHtGb3JtLCBQYWdlLCBCYXNlRmllbGQsIEZpZWxkLCBMaXN0LCBDb250YWluZXJ9OyIsImltcG9ydCB7IE5PREVOQU1FUywgVFJJR0dFUl9USU1FT1VULCBFVkVOVFMsIEFUVFJJQlVURV9BQ1RJVkUsIEFUVFJJQlVURV9SRUFET05MWSwgQVRUUklCVVRFX0NPTkRJVElPTiwgQVRUUklCVVRFX0NPTkRJVElPTl9WQUxJRCwgQVRUUklCVVRFX0NPTkRJVElPTl9JTlZBTElELCBBVFRSSUJVVEVfVkFMSUQsIEFUVFJJQlVURV9JTlZBTElELCBBVFRSSUJVVEVfRURJVEFCTEVfQ09ORElUSU9OLCBBVFRSSUJVVEVfRURJVEFCTEUgfSBmcm9tIFwiLi9Db25zdGFudHNcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWNvbXBvbmVudHMvc3JjL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgdXBkYXRlQWN0aXZlU3RhdGUsIHVwZGF0ZUVkaXRhYmxlU3RhdGUgfSBmcm9tIFwiLi91dGlscy9TdGF0ZUhlbHBlclwiO1xuXG5jb25zdCBBVFRSSUJVVEVTID0gW0FUVFJJQlVURV9BQ1RJVkUsIEFUVFJJQlVURV9SRUFET05MWSwgQVRUUklCVVRFX0NPTkRJVElPTiwgQVRUUklCVVRFX0NPTkRJVElPTl9WQUxJRCwgQVRUUklCVVRFX0NPTkRJVElPTl9JTlZBTElELCBBVFRSSUJVVEVfRURJVEFCTEVfQ09ORElUSU9OXTtcblxuY2xhc3MgQmFzZSBleHRlbmRzIENvbXBvbmVudCB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdGFzeW5jIGluaXQoKSB7XG5cdFx0YXdhaXQgc3VwZXIuaW5pdCgpO1xuXHR9XG5cblx0Z2V0IGZvcm0oKSB7XG5cdFx0aWYgKCF0aGlzLl9fZm9ybV9fKVxuXHRcdFx0dGhpcy5fX2Zvcm1fXyA9IHRoaXMucGFyZW50KE5PREVOQU1FUy5Gb3JtKTtcblx0XHRyZXR1cm4gdGhpcy5fX2Zvcm1fXztcblx0fVxuXG5cdGdldCBhY3RpdmUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEFUVFJJQlVURV9BQ1RJVkUpO1xuXHR9XG5cblx0c2V0IGFjdGl2ZShhY3RpdmUpIHtcblx0XHRjb25zdCBjdXJyZW50ID0gdGhpcy5hY3RpdmU7XG5cdFx0aWYgKGN1cnJlbnQgIT0gYWN0aXZlKSB7XG5cdFx0XHR1cGRhdGVBY3RpdmVTdGF0ZSh0aGlzLCBhY3RpdmUpO1xuXHRcdFx0dGhpcy5hY3RpdmVVcGRhdGVkKCk7XG5cdFx0fVxuXHR9XG5cblx0YWN0aXZlVXBkYXRlZCgpIHtcblx0fVxuXG5cdGdldCByZWFkb25seSgpIHtcblx0XHRyZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX1JFQURPTkxZKTtcblx0fVxuXG5cdHNldCByZWFkb25seShyZWFkb25seSkge1xuXHRcdHVwZGF0ZUVkaXRhYmxlU3RhdGUodGhpcywgIXJlYWRvbmx5LCAhdGhpcy5yZWFkeS5yZXNvbHZlZCk7XG5cdFx0dGhpcy5yZWFkb25seVVwZGF0ZWQoKTtcblx0fVxuXG5cdHJlYWRvbmx5VXBkYXRlZCgpIHsgfVxuXHRcblx0Z2V0IGVkaXRhYmxlKCl7XG5cdFx0cmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEFUVFJJQlVURV9FRElUQUJMRSk7XHRcdFxuXHR9XG5cdFxuXHRzZXQgZWRpdGFibGUoZWRpdGFibGUpe1x0XHRcblx0XHR1cGRhdGVFZGl0YWJsZVN0YXRlKHRoaXMsIGVkaXRhYmxlLCAhdGhpcy5yZWFkeS5yZXNvbHZlZCk7XG5cdFx0dGhpcy5lZGl0YWJsZVVwZGF0ZWQoKTtcdFx0XG5cdH1cblx0XG5cdGVkaXRhYmxlVXBkYXRlZCgpe1xuXHRcdHRoaXMucmVhZG9ubHlVcGRhdGVkKCk7XG5cdH1cblxuXHRnZXQgY29uZGl0aW9uKCkge1xuXHRcdHJldHVybiAhdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX0NPTkRJVElPTl9JTlZBTElEKTtcblx0fVxuXG5cdGNvbmRpdGlvblVwZGF0ZWQoKSB7XG5cblx0fVxuXG5cdGdldCB2YWxpZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX1ZBTElEKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYXNlO1xuIiwiaW1wb3J0IHsgTk9ERU5BTUVTLCBFVkVOVFMsIFRSSUdHRVJfVElNRU9VVCwgQVRUUklCVVRFX05BTUUsIEFUVFJJQlVURV9SRVFVSVJFRCwgQVRUUklCVVRFX1JFUVVJUkVEX09OX0FDVElWRV9PTkxZLCBBVFRSSUJVVEVfTk9WQUxVRSB9IGZyb20gXCIuL0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgdG9UaW1lb3V0SGFuZGxlIH0gZnJvbSBcIi4vdXRpbHMvRXZlbnRIZWxwZXJcIjtcbmltcG9ydCB7IHVwZGF0ZVZhbGlkU3RhdGUgfSBmcm9tIFwiLi91dGlscy9TdGF0ZUhlbHBlclwiO1xuaW1wb3J0IEJhc2UgZnJvbSBcIi4vQmFzZVwiO1xuaW1wb3J0IFZhbGlkYXRvciBmcm9tIFwiLi9WYWxpZGF0b3JcIjtcblxuY29uc3QgQVRUUklCVVRFUyA9IFtBVFRSSUJVVEVfTkFNRSwgQVRUUklCVVRFX1JFUVVJUkVELCBBVFRSSUJVVEVfTk9WQUxVRV07XG5cbmV4cG9ydCBjb25zdCBmaW5kUGFyZW50RmllbGQgPSAoZmllbGQpID0+IHtcblx0bGV0IHBhcmVudCA9IGZpZWxkLnBhcmVudE5vZGU7XG5cdHdoaWxlIChwYXJlbnQpIHtcblx0XHRpZiAocGFyZW50IGluc3RhbmNlb2YgQmFzZUZpZWxkKSByZXR1cm4gcGFyZW50O1xuXG5cdFx0cGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCB1cGRhdGVIYXNWYWx1ZSA9IChoYXNWYWx1ZSwgZmllbGQpID0+IHtcblx0ZmllbGQuYXR0cihBVFRSSUJVVEVfTk9WQUxVRSwgIWhhc1ZhbHVlID8gXCJcIiA6IG51bGwpO1xufTtcblxuY2xhc3MgQmFzZUZpZWxkIGV4dGVuZHMgQmFzZSB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTLmNvbmNhdChCYXNlLm9ic2VydmVkQXR0cmlidXRlcyk7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IG51bGwpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuX192YWx1ZV9fID0gdmFsdWU7XG5cdFx0dGhpcy5fX3ZhbHVlQ2hhbmdlZF9fID0gdHJ1ZTtcblxuXHRcdHRoaXMub24oRVZFTlRTLmNvbmRpdGlvblN0YXRlQ2hhbmdlZCwgKGV2ZW50KSA9PiB7XG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0ID09IHRoaXMpIHtcblx0XHRcdFx0dGhpcy5jb25kaXRpb25VcGRhdGVkKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRhc3luYyBpbml0KCkge1xuXHRcdGF3YWl0IHN1cGVyLmluaXQoKTtcblx0XHRjb25zdCByZWFkeSA9IHRoaXMucmVhZHk7XG5cdFx0aWYgKCFyZWFkeS5yZXNvbHZlZCkge1xuXHRcdFx0dGhpcy5wYXJlbnRGaWVsZCA9IGZpbmRQYXJlbnRGaWVsZCh0aGlzKTtcblx0XHRcdHRoaXMudmFsaWRhdG9yID0gbmV3IFZhbGlkYXRvcih0aGlzKTtcblxuXHRcdFx0dGhpcy5mb3JtLm9uKEVWRU5UUy5leGVjdXRlVmFsaWRhdGUsIGFzeW5jIChldmVudCkgPT4ge1xuXHRcdFx0XHRjb25zdCBjaGFpbiA9IGV2ZW50LmRldGFpbDtcblx0XHRcdFx0aWYgKGNoYWluLmluZGV4T2YodGhpcykgPCAwKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudCA9IHRoaXMudmFsaWQ7XG5cdFx0XHRcdFx0Y29uc3QgdmFsaWQgPSBhd2FpdCB0aGlzLnZhbGlkYXRlKCk7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnQgIT0gdmFsaWQpIHtcblx0XHRcdFx0XHRcdHRoaXMucHVibGlzaFZhbHVlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5mb3JtLm9uKEVWRU5UUy5hbGxQdWJsaXNoVmFsdWUsICgpID0+IHtcblx0XHRcdFx0dGhpcy5wdWJsaXNoVmFsdWUoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHRoaXMudmFsaWRhdGUoKTtcblx0fVxuXG5cdGNvbmRpdGlvblVwZGF0ZWQoKSB7XG5cdFx0dGhpcy5hY3RpdmUgPSB0aGlzLmNvbmRpdGlvbjtcblx0fVxuXG5cdGdldCBuYW1lKCkge1xuXHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShBVFRSSUJVVEVfTkFNRSk7XG5cdH1cblxuXHRnZXQgcmVxdWlyZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEFUVFJJQlVURV9SRVFVSVJFRCk7XG5cdH1cblxuXHRnZXQgaGFzVmFsdWUoKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLl9fdmFsdWVfXztcblx0XHRyZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCI7XG5cdH1cblxuXHRhc3luYyB2YWx1ZSgpIHtcblx0XHRpZihhcmd1bWVudHMubGVuZ3RoID09IDApXG5cdFx0XHRyZXR1cm4gdGhpcy5fX3ZhbHVlX187XG5cdFx0bGV0IHZhbHVlID0gYXJndW1lbnRzWzBdO1xuXHRcdGF3YWl0IHRoaXMucmVhZHk7XG5cblx0XHRpZiAoYXdhaXQgdGhpcy5hY2NlcHRWYWx1ZSh2YWx1ZSkpIHtcblx0XHRcdHZhbHVlID0gKGF3YWl0IHRoaXMubm9ybWFsaXplVmFsdWUodmFsdWUpKTtcblx0XHRcdGlmICh0aGlzLl9fdmFsdWVfXyAhPSB2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLl9fdmFsdWVfXyA9IHZhbHVlO1xuXHRcdFx0XHRhd2FpdCB0aGlzLnVwZGF0ZWRWYWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdGF3YWl0IHRoaXMudmFsaWRhdGUoKTtcdFx0XHRcdFxuXHRcdFx0XHR0aGlzLnB1Ymxpc2hWYWx1ZSgpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdH1cblx0fVxuXG5cdGFzeW5jIHZhbGlkYXRlKCkge1xuXHRcdHVwZGF0ZUhhc1ZhbHVlKHRoaXMuaGFzVmFsdWUsIHRoaXMpO1xuXHRcdGlmICghdGhpcy52YWxpZGF0b3IpIHJldHVybiBmYWxzZTtcblxuXHRcdGNvbnN0IHZhbGlkID0gYXdhaXQgdGhpcy52YWxpZGF0b3IudmFsaWRhdGUoKTtcblx0XHRyZXR1cm4gdmFsaWQ7XG5cdH1cblxuXHRhc3luYyBwdWJsaXNoVmFsdWUoY2hhaW4gPSBbXSkge1xuXHRcdGNoYWluLnB1c2godGhpcyk7XG5cdFx0aWYodGhpcy5wYXJlbnRGaWVsZClcblx0XHRcdGF3YWl0IHRoaXMucGFyZW50RmllbGQuY2hpbGRWYWx1ZUNoYW5nZWQodGhpcywgY2hhaW4pXG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy50cmlnZ2VyKEVWRU5UUy52YWx1ZUNoYW5nZWQsIGNoYWluKTtcblx0fVxuXG5cdGFzeW5jIGFjY2VwdFZhbHVlKHZhbHVlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRhc3luYyBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdGFzeW5jIHVwZGF0ZWRWYWx1ZSgpIHt9XG5cdGFzeW5jIGNoaWxkVmFsdWVDaGFuZ2VkKGNoaWxkLCBjaGFpbil7fVxufVxuZXhwb3J0IGRlZmF1bHQgQmFzZUZpZWxkO1xuIiwiZXhwb3J0IGNvbnN0IEhUTUxfVEFHX1BSRUZJWCA9IFwiZC1cIjtcbmV4cG9ydCBjb25zdCBUUklHR0VSX1RJTUVPVVQgPSAxMDtcbmV4cG9ydCBjb25zdCBFVkVOVEhBTkRMRV9USU1FT1VUID0gMTA7XG5leHBvcnQgY29uc3QgRVZFTlRIQU5ETEVfSU5QVVRfVElNRU9VVCA9IDUwICogRVZFTlRIQU5ETEVfVElNRU9VVDtcblxuZXhwb3J0IGNvbnN0IE5PREVOQU1FUyA9IHtcblx0Rm9ybTogSFRNTF9UQUdfUFJFRklYICsgXCJmb3JtXCIsXG5cdENvbnRyb2w6IEhUTUxfVEFHX1BSRUZJWCArIFwiY29udHJvbFwiLFxuXHRCYWNrQnV0dG9uOiBIVE1MX1RBR19QUkVGSVggKyBcImNvbnRyb2wtYmFja1wiLFxuXHROZXh0QnV0dG9uOiBIVE1MX1RBR19QUkVGSVggKyBcImNvbnRyb2wtbmV4dFwiLFxuXHRTdW1tYXJ5QnV0dG9uOiBIVE1MX1RBR19QUkVGSVggKyBcImNvbnRyb2wtc3VtbWFyeVwiLFxuXHRTdWJtaXRCdXR0b246IEhUTUxfVEFHX1BSRUZJWCArIFwiY29udHJvbC1zdWJtaXRcIixcblx0Q2FuY2VsQnV0dG9uOiBIVE1MX1RBR19QUkVGSVggKyBcImNvbnRyb2wtY2FuY2VsXCIsXG5cdFBhZ2U6IEhUTUxfVEFHX1BSRUZJWCArIFwicGFnZVwiLFxuXHRGaWVsZDogSFRNTF9UQUdfUFJFRklYICsgXCJmaWVsZFwiLFxuXHRXcmFwcGVyRmllbGQ6IEhUTUxfVEFHX1BSRUZJWCArIFwid3JhcHBlci1maWVsZFwiLFxuXHRMaXN0OiBIVE1MX1RBR19QUkVGSVggKyBcImxpc3RcIixcblx0TGlzdFJvd3M6IEhUTUxfVEFHX1BSRUZJWCArIFwicm93c1wiLFxuXHRMaXN0Um93OiBIVE1MX1RBR19QUkVGSVggKyBcInJvd1wiLFxuXHRCdXR0b25BZGRSb3c6IEhUTUxfVEFHX1BSRUZJWCArIFwiYWRkLXJvd1wiLFxuXHRCdXR0b25EZWxldGVSb3c6IEhUTUxfVEFHX1BSRUZJWCArIFwiZGVsZXRlLXJvd1wiLFxuXHRDb250YWluZXI6IEhUTUxfVEFHX1BSRUZJWCArIFwiY29udGFpbmVyXCIsXG5cdFZhbGlkYXRpb246IEhUTUxfVEFHX1BSRUZJWCArIFwidmFsaWRhdGlvblwiLFxuXHRNZXNzYWdlOiBIVE1MX1RBR19QUkVGSVggKyBcIm1lc3NhZ2VcIixcblx0UHJvZ3Jlc3NCYXI6IEhUTUxfVEFHX1BSRUZJWCArIFwicHJvZ3Jlc3MtYmFyXCIsXG5cdFN0ZXA6IEhUTUxfVEFHX1BSRUZJWCArIFwic3RlcFwiLFxufTtcbmV4cG9ydCBjb25zdCBGT1JNU1RBVEVTID0ge1xuXHRpbml0OiBcImluaXRcIixcblx0aW5wdXQ6IFwiaW5wdXRcIixcblx0c3VtbWFyeTogXCJzdW1tYXJ5XCIsXG5cdGZpbmlzaGVkOiBcImZpbmlzaGVkXCIsXG59O1xuXG5leHBvcnQgY29uc3QgUkVRVUlSRURTVEFURVMgPSB7XG5cdGFsd2F5czogXCJhbHdheXNcIixcblx0b25BY3RpdmU6IFwib24tYWN0aXZlXCIsXG59O1xuXG5leHBvcnQgY29uc3QgRVZFTlRfUFJFRklYID0gSFRNTF9UQUdfUFJFRklYICsgXCJmb3JtLVwiO1xuXG5leHBvcnQgY29uc3QgRVZFTlRTID0ge1xuXHRpbml0aWFsaXplOiBFVkVOVF9QUkVGSVggKyBcImluaXRpYWxpemVcIixcblx0LyogZmlyZWQgYnkgY2hhbmdlIHZhbHVlIGZyb20gYW4gZmllbGQgaW1wbGVtZW50YXRpb25cblx0ICogYW5kIGNvbnN1bWVkIGJ5IHRoZSByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24gb2Zcblx0ICogQmFzZUZpZWxkIHRvIG1ha2UgdmFsaWRhdGlvbiBhbmQgZmlyZSB2YWx1ZUNoYW5nZWRcblx0ICogZXZlbnRcblx0ICovXG5cdGlucHV0OiBFVkVOVF9QUkVGSVggKyBcImZpZWxkLWlucHV0XCIsXG5cdC8qIGludGVybmFsIGV2ZW50IGZvciBwdWJsaXNoIHRoYXQgYSB2YWx1ZSBvZiBmaWVsZCBoYXMgY2hhbmdlZCAoZXZlbnQgYWZ0ZXIgdmFsaWRhdGlvbikgKi9cblx0dmFsdWVDaGFuZ2VkOiBFVkVOVF9QUkVGSVggKyBcImZpZWxkLXZhbHVlLWNoYW5nZWRcIixcblx0LyogaW50ZXJuYWwgZXZlbnQgdG8gc3RhcnQgdmFsaWRhdGlvbiBhdCBlbGVtZW50cyAtPiBvbmx5IGZpcmVkIGF0IGZvcm0qL1xuXHRleGVjdXRlVmFsaWRhdGU6IEVWRU5UX1BSRUZJWCArIFwiZXhlY3V0ZS12YWxpZGF0ZVwiLFxuXHQvKiAqL1xuXHRhY3RpdmVTdGF0ZUNoYW5nZWQ6IEVWRU5UX1BSRUZJWCArIFwiYWN0aXZlLXN0YXRlLWNoYW5nZWRcIixcblx0LyogKi9cblx0Y29uZGl0aW9uU3RhdGVDaGFuZ2VkOiBFVkVOVF9QUkVGSVggKyBcImNvbmRpdGlvbi1zdGF0ZS1jaGFuZ2VkXCIsXG5cdC8qICovXG5cdHZhbGlkU3RhdGVDaGFuZ2VkOiBFVkVOVF9QUkVGSVggKyBcInZhbGlkLXN0YXRlLWNoYW5nZWRcIixcblx0LyogKi9cblx0c2l0ZUNoYW5nZWQ6IEVWRU5UX1BSRUZJWCArIFwic2l0ZS1jaGFuZ2VkXCIsXG5cdC8qICovXG5cdGZvcm1TdGF0ZUNoYW5nZWQ6IEVWRU5UX1BSRUZJWCArIFwic3RhdGUtY2hhbmdlZFwiLFxuXHQvKiAqL1xuXHRhbGxQdWJsaXNoVmFsdWU6IEVWRU5UX1BSRUZJWCArIFwiYWxsLXB1Ymxpc2gtdmFsdWVcIixcblx0LyogKi9cblx0c3VibWl0OiBFVkVOVF9QUkVGSVggKyBcInN1Ym1pdFwiLFxuXHQvKiAqL1xuXHRwcm9ncmVzc2JhckNoYW5nZWQgOiBFVkVOVF9QUkVGSVggKyBcInByb2dyZXNzLWJhci1jaGFuZ2VkXCIsXG5cblx0Ly9vbGQgbmVlZCB0byBiZSByZWZhY3RvcmVkXG5cblx0YWRkZWQ6IEVWRU5UX1BSRUZJWCArIFwiYWRkZWRcIixcblx0Y2hhbmdlOiBFVkVOVF9QUkVGSVggKyBcImNoYW5nZVwiLFxuXHRjaGFuZ2VBdHRyaWJ1dGVFdmVudEJ1aWxkZXI6IChuYW1lKSA9PiB7XG5cdFx0cmV0dXJuIEVWRU5UX1BSRUZJWCArIFwiY2hhbmdlLWF0dHJpYnV0ZS1cIiArIG5hbWU7XG5cdH0sXG5cdGNoYW5nZUFjdGl2ZTogRVZFTlRfUFJFRklYICsgXCJjaGFuZ2UtYWN0aXZlXCIsXG5cdGNoYW5nZVZhbHVlOiBFVkVOVF9QUkVGSVggKyBcImNoYW5nZS12YWx1ZVwiLFxuXHRjaGFuZ2VDb25kaXRpb246IEVWRU5UX1BSRUZJWCArIFwiY2hhbmdlLWNvbmRpdGlvblwiLFxuXHRjaGFuZ2VWYWxpZGF0aW9uOiBFVkVOVF9QUkVGSVggKyBcImNoYW5nZS12YWxpZGF0aW9uXCIsXG5cblx0Ly9MSVNUIEVWRU5UU1xuXHRsaXN0Um93QWRkOiBFVkVOVF9QUkVGSVggKyBcImxpc3Qtcm93LWFkZFwiLFxuXHRsaXN0Um93RGVsZXRlOiBFVkVOVF9QUkVGSVggKyBcImxpc3Qtcm93LWRlbGV0ZVwiLFxuXHRcblx0ZWRpdGFibGVTdGF0ZUNoYW5nZWQ6IEVWRU5UX1BSRUZJWCArIFwiZWRpdGFibGUtc3RhdGUtY2hhbmdlZFwiXG59O1xuXG5leHBvcnQgY29uc3QgU1BFQ0lBTFZBUlMgPSB7XG5cdENVUlJFTlRWQUxVRTogXCIkdmFsdWVcIixcblx0Q1VSUkVOVExJU1RST1c6IFwiJGl0ZW1cIixcbn07XG5cbi8vQVRUUklCVVRFU1xuXG5leHBvcnQgY29uc3QgQVRUUklCVVRFX05BTUUgPSBcIm5hbWVcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfRU5EUE9JTlQgPSBcImVuZHBvaW50XCI7XG5leHBvcnQgY29uc3QgQVRUUklCVVRFX01FVEhPRCA9IFwibWV0aG9kXCI7XG5leHBvcnQgY29uc3QgQVRUUklCVVRFX1NUQVRFID0gXCJzdGF0ZVwiO1xuXG5leHBvcnQgY29uc3QgQVRUUklCVVRFX1NURVAgPSBcInN0ZXBcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfVVNFX1NVTU1BUllfUEFHRSA9IFwidXNlLXN1bW1hcnktcGFnZVwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9JTlBVVF9NT0RFX0FGVEVSX1NVQk1JVCA9IFwiaW5wdXQtbW9kZS1hZnRlci1zdWJtaXRcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfUkVRVUlSRUQgPSBcInJlcXVpcmVkXCI7XG5leHBvcnQgY29uc3QgQVRUUklCVVRFX1JFUVVJUkVEX09OX0FDVElWRV9PTkxZID0gXCJyZXF1aXJlZC1vbi1hY3RpdmUtb25seVwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9DT05ESVRJT04gPSBcImNvbmRpdGlvblwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9BQ1RJVkUgPSBcImFjdGl2ZVwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9ESVNBQkxFRCA9IFwiZGlzYWJsZWRcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfRURJVEFCTEUgPSBcImVkaXRhYmxlXCI7XG5leHBvcnQgY29uc3QgQVRUUklCVVRFX0VESVRBQkxFX0NPTkRJVElPTiA9IFwiZWRpdGFibGUtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgQVRUUklCVVRFX1JFQURPTkxZID0gXCJyZWFkb25seVwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9OT1ZBTFVFID0gXCJuby12YWx1ZVwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9WQUxJRCA9IFwidmFsaWRcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfSU5WQUxJRCA9IFwiaW52YWxpZFwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9DT05ESVRJT05fVkFMSUQgPSBcImNvbmRpdGlvbi12YWxpZFwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9DT05ESVRJT05fSU5WQUxJRCA9IFwiY29uZGl0aW9uLWludmFsaWRcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfTUFYID0gXCJtYXhcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfUFJPR1JFU1MgPSBcInByb2dyZXNzXCI7XG4iLCJpbXBvcnQgT2JqZWN0VXRpbHMgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL09iamVjdFV0aWxzXCI7XG5pbXBvcnQgeyBOT0RFTkFNRVMsIEVWRU5UUyB9IGZyb20gXCIuL0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZmluZEZpZWxkcyB9IGZyb20gXCIuL3V0aWxzL05vZGVIZWxwZXJcIjtcbmltcG9ydCB7IHRvVGltZW91dEhhbmRsZSB9IGZyb20gXCIuL3V0aWxzL0V2ZW50SGVscGVyXCI7XG5pbXBvcnQgQmFzZUZpZWxkIGZyb20gXCIuL0Jhc2VGaWVsZFwiO1xuaW1wb3J0IGRlZmluZUVsZW1lbnQgZnJvbSBcIi4vdXRpbHMvRGVmaW5lRWxlbWVudFwiO1xuXG5jb25zdCBBVFRSSUJVVEVTID0gW107XG5cbmNvbnN0IE5BTUVfU1BMSVRURVIgPSAvXFwuL2c7XG5cbmNvbnN0IHZhbHVlSGVscGVyID0gZnVuY3Rpb24gKGRhdGEsIG5hbWUsIHZhbHVlKSB7XG5cdGlmIChkYXRhID09IG51bGwgfHwgdHlwZW9mIGRhdGEgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBudWxsO1xuXG5cdGNvbnN0IHVwZGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuXG5cdGNvbnN0IG5hbWVzID0gbmFtZS5zcGxpdChOQU1FX1NQTElUVEVSKTtcblx0d2hpbGUgKG5hbWVzLmxlbmd0aCA+IDEpIHtcblx0XHRjb25zdCBrZXkgPSBuYW1lcy5zaGlmdCgpO1xuXHRcdGxldCB0ZW1wID0gZGF0YVtrZXldO1xuXHRcdGNvbnN0IGhhcyA9IHR5cGVvZiB0ZW1wICE9PSBcInVuZGVmaWVuZFwiICYmIHRlbXAgIT0gbnVsbDtcblx0XHRpZiAoIWhhcyAmJiAhdXBkYXRlKSByZXR1cm4gbnVsbDtcblx0XHRlbHNlIGlmICghaGFzICYmIHVwZGF0ZSkgdGVtcCA9IGRhdGFba2V5XSA9IHt9O1xuXG5cdFx0ZGF0YSA9IHRlbXA7XG5cdH1cblxuXHRpZiAodXBkYXRlKSBkYXRhW25hbWVzWzBdXSA9IHZhbHVlO1xuXHRlbHNlIHJldHVybiBkYXRhW25hbWVzWzBdXSA/IGRhdGFbbmFtZXNbMF1dIDogbnVsbDtcbn07XG5cbmNsYXNzIENvbnRhaW5lciBleHRlbmRzIEJhc2VGaWVsZCB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTLmNvbmNhdChCYXNlRmllbGQub2JzZXJ2ZWRBdHRyaWJ1dGVzKTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XG5cdFx0cmV0dXJuIE5PREVOQU1FUy5Db250YWluZXI7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IG51bGwpIHtcblx0XHRzdXBlcih2YWx1ZSA/IHZhbHVlIDoge30pO1xuXHRcdHRoaXMuZmllbGRzID0gW107XG5cdFx0dGhpcy5vbihFVkVOVFMudmFsdWVDaGFuZ2VkLCAoZXZlbnQpID0+IHtcblx0XHRcdGNvbnN0IGZpZWxkID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0aWYgKGZpZWxkICE9IHRoaXMpIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0Y29uc3QgY2hhaW4gPSBldmVudC5kZXRhaWw7XG5cdFx0XHRcdHRoaXMuY2hpbGRWYWx1ZUNoYW5nZWQoZmllbGQsIGNoYWluKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGFzeW5jIGluaXQoKSB7XG5cdFx0Y29uc3QgcmVhZHkgPSB0aGlzLnJlYWR5O1xuXHRcdGF3YWl0IHN1cGVyLmluaXQoKTtcblx0XHR0aGlzLmZpZWxkcyA9IGZpbmRGaWVsZHModGhpcyk7XG5cdFx0aWYgKCFyZWFkeS5yZXNvbHZlZCkge1xuXHRcdFx0dGhpcy5vbihFVkVOVFMuaW5pdGlhbGl6ZSwgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdGlmIChldmVudC50YXJnZXQgIT0gdGhpcykge1xuXHRcdFx0XHRcdGNvbnN0IGZpZWxkID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0XHRcdGlmIChmaWVsZCBpbnN0YW5jZW9mIEJhc2VGaWVsZCkge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZmllbGRzLmluZGV4T2YoZmllbGQpIDwgMCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmZpZWxkcy5wdXNoKGZpZWxkKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMudmFsaWRhdG9yLmFkZEN1c3RvbUNoZWNrKGFzeW5jICh7IGRhdGEsIGJhc2UgfSkgPT4ge1xuXHRcdFx0XHRjb25zdCB7IGZpZWxkcyB9ID0gYmFzZTtcblx0XHRcdFx0aWYgKGZpZWxkcykge1xuXHRcdFx0XHRcdGNvbnN0IGxlbmd0aCA9IGZpZWxkcy5sZW5ndGg7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgZmllbGQgPSBmaWVsZHNbaV07XG5cdFx0XHRcdFx0XHRpZiAoZmllbGQuY29uZGl0aW9uICYmICFmaWVsZC52YWxpZCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0cmVhZG9ubHlVcGRhdGVkKCkge1xuXHRcdGNvbnN0IHsgcmVhZG9ubHksIGZpZWxkcyB9ID0gdGhpcztcblx0XHRpZiAoZmllbGRzKVxuXHRcdFx0Zm9yIChsZXQgZmllbGQgb2YgZmllbGRzKSB7XG5cdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gcmVhZG9ubHk7XG5cdFx0XHR9XG5cdH1cblxuXHRhc3luYyB1cGRhdGVkVmFsdWUodmFsdWUpIHtcblx0XHR0aGlzLl9fdmFsdWVfXyA9IHt9O1xuXHRcdGNvbnN0IHsgZmllbGRzIH0gPSB0aGlzO1xuXHRcdGlmIChmaWVsZHMpXG5cdFx0XHRmb3IgKGxldCBmaWVsZCBvZiBmaWVsZHMpIHtcdFx0XHRcdFxuXHRcdFx0XHRpZiAoZmllbGQubmFtZSkgYXdhaXQgZmllbGQudmFsdWUodmFsdWVIZWxwZXIodmFsdWUsIGZpZWxkLm5hbWUpKTtcblx0XHRcdFx0ZWxzZSBpZiAoZmllbGQgaW5zdGFuY2VvZiBDb250YWluZXIpIGF3YWl0IGZpZWxkLnZhbHVlKHZhbHVlKTtcblx0XHRcdH1cblx0fVxuXG5cdGFzeW5jIGNoaWxkVmFsdWVDaGFuZ2VkKGZpZWxkLCBjaGFpbikge1xuXHRcdGF3YWl0IHRoaXMucmVhZHk7XG5cdFx0Y29uc3QgbmFtZSA9IGF3YWl0IGZpZWxkLm5hbWU7XG5cdFx0Y29uc3QgdmFsdWUgPSBhd2FpdCBmaWVsZC52YWx1ZSgpO1xuXHRcdGlmIChuYW1lKSB2YWx1ZUhlbHBlcih0aGlzLl9fdmFsdWVfXywgbmFtZSwgdmFsdWUpO1xuXHRcdGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIE9iamVjdFV0aWxzLm1lcmdlKHRoaXMuX192YWx1ZV9fLCB2YWx1ZSk7XG5cblx0XHR0aGlzLnZhbGlkYXRlKCk7XG5cdFx0dGhpcy5wdWJsaXNoVmFsdWUoY2hhaW4pO1xuXHR9XG59XG5cbmRlZmluZUVsZW1lbnQoQ29udGFpbmVyKTtcbmV4cG9ydCBkZWZhdWx0IENvbnRhaW5lcjtcbiIsImltcG9ydCB7IEZPUk1TVEFURVMsIE5PREVOQU1FUywgRVZFTlRTIH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL3NyYy9Db21wb25lbnRcIjtcbmltcG9ydCBcIi4vY29udHJvbHNcIjtcbmltcG9ydCBQYWdlIGZyb20gXCIuL1BhZ2VcIjtcbmltcG9ydCBkZWZpbmVFbGVtZW50IGZyb20gXCIuL3V0aWxzL0RlZmluZUVsZW1lbnRcIjtcblxuY29uc3QgQlVUVE9ORFVNTVkgPSB7XG5cdGFjdGl2ZTogdHJ1ZSxcblx0ZGlzYWJsZWQ6IHRydWUsXG59O1xuXG5jb25zdCBBVFRSSUJVVEVTID0gW107XG5jbGFzcyBDb250cm9sIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIEFUVFJJQlVURVM7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IE5PREVOQU1FKCkge1xuXHRcdHJldHVybiBOT0RFTkFNRVMuQ29udHJvbDtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRhc3luYyBpbml0KCkge1xuXHRcdGF3YWl0IHN1cGVyLmluaXQoKTtcblx0XHRpZiAoIXRoaXMucmVhZHkucmVzb2x2ZWQpIHtcblx0XHRcdHRoaXMuZm9ybSA9IHRoaXMucGFyZW50KE5PREVOQU1FUy5Gb3JtKTtcblx0XHRcdHRoaXMuYmFjayA9IHRoaXMuZmluZChOT0RFTkFNRVMuQmFja0J1dHRvbikuZmlyc3QoKSB8fCBCVVRUT05EVU1NWTtcblx0XHRcdHRoaXMubmV4dCA9IHRoaXMuZmluZChOT0RFTkFNRVMuTmV4dEJ1dHRvbikuZmlyc3QoKSB8fCBCVVRUT05EVU1NWTtcblx0XHRcdHRoaXMuc3VtbWFyeSA9IHRoaXMuZmluZChOT0RFTkFNRVMuU3VtbWFyeUJ1dHRvbikuZmlyc3QoKSB8fCBCVVRUT05EVU1NWTtcblx0XHRcdHRoaXMuc3VibWl0ID0gdGhpcy5maW5kKE5PREVOQU1FUy5TdWJtaXRCdXR0b24pLmZpcnN0KCkgfHwgQlVUVE9ORFVNTVk7XG5cblx0XHRcdHRoaXMuZm9ybS5vbihbRVZFTlRTLnZhbGlkU3RhdGVDaGFuZ2VkLCBFVkVOVFMuY29uZGl0aW9uU3RhdGVDaGFuZ2VkXSwgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdGlmIChldmVudC50YXJnZXQgaW5zdGFuY2VvZiBQYWdlKSB0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuZm9ybS5vbihbRVZFTlRTLmZvcm1TdGF0ZUNoYW5nZWQsIEVWRU5UUy5zaXRlQ2hhbmdlZF0sIChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdGNvbnN0IHsgYmFjaywgbmV4dCwgc3VtbWFyeSwgc3VibWl0LCBmb3JtIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgYWN0aXZlUGFnZUluZGV4LCBhY3RpdmVQYWdlLCBuZXh0UGFnZSwgcGFnZXMsIHVzZVN1bW1hcnlQYWdlLCBzdGF0ZSB9ID0gZm9ybTtcblxuXHRcdC8vIGJhc2ljIGNvbnRyb2wgc2V0dXBcblx0XHRiYWNrLmFjdGl2ZSA9IHRydWU7XG5cdFx0YmFjay5kaXNhYmxlZCA9IHRydWU7XG5cdFx0bmV4dC5hY3RpdmUgPSBmYWxzZTtcblx0XHRuZXh0LmRpc2FibGVkID0gdHJ1ZTtcblx0XHRzdW1tYXJ5LmFjdGl2ZSA9IGZhbHNlO1xuXHRcdHN1bW1hcnkuZGlzYWJsZWQgPSB0cnVlO1xuXHRcdHN1Ym1pdC5hY3RpdmUgPSBmYWxzZTtcblx0XHRzdWJtaXQuZGlzYWJsZWQgPSB0cnVlO1xuXG5cdFx0aWYgKHN0YXRlID09IEZPUk1TVEFURVMuZmluaXNoZWQpIHtcblx0XHRcdGJhY2suZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0c3VibWl0LmFjdGl2ZSA9IHRydWU7XG5cdFx0fSBlbHNlIGlmIChzdGF0ZSA9PSBGT1JNU1RBVEVTLnN1bW1hcnkpIHtcblx0XHRcdGJhY2suZGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdHN1Ym1pdC5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0c3VibWl0LmRpc2FibGVkID0gIWZvcm0udmFsaWQ7XG5cdFx0fSBlbHNlIGlmIChzdGF0ZSA9PSBGT1JNU1RBVEVTLmlucHV0KSB7XG5cdFx0XHRiYWNrLmRpc2FibGVkID0gYWN0aXZlUGFnZUluZGV4IDw9IDA7XG5cblx0XHRcdGlmIChuZXh0UGFnZSB8fCAoIWFjdGl2ZVBhZ2UudmFsaWQgJiYgYWN0aXZlUGFnZUluZGV4ICsgMSA8IHBhZ2VzLmxlbmd0aCkpIHtcblx0XHRcdFx0bmV4dC5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0XHRuZXh0LmRpc2FibGVkID0gIWFjdGl2ZVBhZ2UudmFsaWQ7XG5cdFx0XHR9IGVsc2UgaWYgKHVzZVN1bW1hcnlQYWdlICYmIHN0YXRlID09IEZPUk1TVEFURVMuaW5wdXQpIHtcblx0XHRcdFx0c3VtbWFyeS5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0XHRzdW1tYXJ5LmRpc2FibGVkID0gIWFjdGl2ZVBhZ2UudmFsaWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdWJtaXQuYWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0c3VibWl0LmRpc2FibGVkID0gIWZvcm0udmFsaWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5kZWZpbmVFbGVtZW50KENvbnRyb2wpO1xuZXhwb3J0IGRlZmF1bHQgQ29udHJvbDtcbiIsImltcG9ydCB7IE5PREVOQU1FUywgRVZFTlRTLCBUUklHR0VSX1RJTUVPVVQgfSBmcm9tIFwiLi9Db25zdGFudHNcIjtcbmltcG9ydCBCYXNlRmllbGQgZnJvbSBcIi4vQmFzZUZpZWxkXCI7XG5pbXBvcnQgeyBmaW5kV3JhcHBlciB9IGZyb20gXCIuL3dyYXBwZXJcIjtcbmltcG9ydCBkZWZpbmVFbGVtZW50IGZyb20gXCIuL3V0aWxzL0RlZmluZUVsZW1lbnRcIjtcblxuY29uc3QgQVRUUklCVVRFUyA9IFtcImZpbGUtZm9ybWF0XCJdO1xuXG5jbGFzcyBGaWVsZCBleHRlbmRzIEJhc2VGaWVsZCB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTLmNvbmNhdChCYXNlRmllbGQub2JzZXJ2ZWRBdHRyaWJ1dGVzKTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XG5cdFx0cmV0dXJuIE5PREVOQU1FUy5GaWVsZDtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5fX3ZhbHVlQ2hhbmdlZF9fID0gdHJ1ZTtcblx0XHR0aGlzLm9uKEVWRU5UUy5pbnB1dCwgKGV2ZW50KSA9PiB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdGNvbnN0IHZhbHVlID0gZXZlbnQuZGV0YWlsID8gZXZlbnQuZGV0YWlsIDogbnVsbDtcblx0XHRcdGNvbnN0IHZhbHVlQ2hhbmdlZCA9ICF0aGlzLl9fdmFsdWVDaGFuZ2VkX18gPyB0aGlzLl9fdmFsdWVfXyAhPSB2YWx1ZSA6ICB0cnVlO1xuXHRcdFx0aWYgKHZhbHVlQ2hhbmdlZCkge1xuXHRcdFx0XHR0aGlzLl9fdmFsdWVDaGFuZ2VkX18gPSB2YWx1ZUNoYW5nZWQ7XG5cdFx0XHRcdHRoaXMuX192YWx1ZV9fID0gdmFsdWU7XG5cdFx0XHRcdChhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy52YWxpZGF0ZSgpO1xuXHRcdFx0XHRcdGF3YWl0IHRoaXMucHVibGlzaFZhbHVlKCk7XG5cdFx0XHRcdH0pKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0XG5cdGFzeW5jIGluaXQoKSB7XG5cdFx0YXdhaXQgc3VwZXIuaW5pdCgpO1xuXHRcdGNvbnN0IHJlYWR5ID0gdGhpcy5yZWFkeTtcblx0XHRpZiAoIXJlYWR5LnJlc29sdmVkKSB7XG5cdFx0XHR0aGlzLndyYXBwZXIgPSBmaW5kV3JhcHBlcih0aGlzKTtcblx0XHRcdGlmICh0aGlzLndyYXBwZXIpXG5cdFx0XHRcdHRoaXMudmFsaWRhdG9yLmFkZEN1c3RvbUNoZWNrKGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy53cmFwcGVyLnZhbGlkO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5fX3ZhbHVlQ2hhbmdlZF9fID0gdHJ1ZTtcblx0XHR0aGlzLnB1Ymxpc2hWYWx1ZSgpO1xuXHR9XG5cblx0cmVhZG9ubHlVcGRhdGVkKCkge1xuXHRcdGlmICh0aGlzLndyYXBwZXIpIHRoaXMud3JhcHBlci5yZWFkb25seSA9IHRoaXMucmVhZG9ubHk7XG5cdH1cblxuXHRhc3luYyBhY2NlcHRWYWx1ZSh2YWx1ZSkge1xuXHRcdHJldHVybiB0aGlzLndyYXBwZXIgPyB0aGlzLndyYXBwZXIuYWNjZXB0VmFsdWUodmFsdWUpIDogZmFsc2U7XG5cdH1cblxuXHRhc3luYyBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh0aGlzLndyYXBwZXIpIHJldHVybiB0aGlzLndyYXBwZXIubm9ybWFsaXplVmFsdWUodmFsdWUpO1xuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0YXN5bmMgdXBkYXRlZFZhbHVlKHZhbHVlKSB7XHRcdFxuXHRcdGF3YWl0IHRoaXMucmVhZHk7XHRcdFxuXHRcdHRoaXMuX192YWx1ZUNoYW5nZWRfXyA9IHRydWU7XG5cdFx0aWYgKHRoaXMud3JhcHBlcikgYXdhaXQgdGhpcy53cmFwcGVyLnVwZGF0ZWRWYWx1ZSh2YWx1ZSk7XG5cdH1cblxuXHRhc3luYyBwdWJsaXNoVmFsdWUoY2hhaW4gPSBbXSkge1xuXHRcdGlmICh0aGlzLl9fdmFsdWVDaGFuZ2VkX18pIHtcblx0XHRcdGF3YWl0IHN1cGVyLnB1Ymxpc2hWYWx1ZShjaGFpbik7XHRcdFx0XG5cdFx0XHR0aGlzLl9fdmFsdWVDaGFuZ2VkX18gPSBmYWxzZTtcblx0XHR9XG5cdH1cbn1cblxuZGVmaW5lRWxlbWVudChGaWVsZCk7XG5leHBvcnQgZGVmYXVsdCBGaWVsZDtcbiIsImltcG9ydCBDb21wb25lbnQgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWNvbXBvbmVudHMvc3JjL0NvbXBvbmVudFwiO1xuaW1wb3J0IEV4cHJlc3Npb25SZXNvbHZlciBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4cHJlc3Npb24tbGFuZ3VhZ2Uvc3JjL0V4cHJlc3Npb25SZXNvbHZlclwiO1xuaW1wb3J0IE9iamVjdFV0aWxzIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9PYmplY3RVdGlsc1wiO1xuaW1wb3J0IHsgRk9STVNUQVRFUywgTk9ERU5BTUVTLCBFVkVOVFMsIFRSSUdHRVJfVElNRU9VVCwgQVRUUklCVVRFX05BTUUsIEFUVFJJQlVURV9VU0VfU1VNTUFSWV9QQUdFLCBBVFRSSUJVVEVfRU5EUE9JTlQsIEFUVFJJQlVURV9NRVRIT0QsIEFUVFJJQlVURV9TVEFURSwgQVRUUklCVVRFX0lOUFVUX01PREVfQUZURVJfU1VCTUlUIH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgZGVmaW5lRWxlbWVudCBmcm9tIFwiLi91dGlscy9EZWZpbmVFbGVtZW50XCI7XG5pbXBvcnQgeyB0b1RpbWVvdXRIYW5kbGUgfSBmcm9tIFwiLi91dGlscy9FdmVudEhlbHBlclwiO1xuaW1wb3J0IFwiLi9NZXNzYWdlXCI7XG5pbXBvcnQgXCIuL1BhZ2VcIjtcbmltcG9ydCBcIi4vQ29udHJvbFwiO1xuaW1wb3J0IFwiLi9Qcm9ncmVzc0JhclwiO1xuXG5jb25zdCBBVFRSSUJVVEVTID0gW0FUVFJJQlVURV9OQU1FLCBBVFRSSUJVVEVfVVNFX1NVTU1BUllfUEFHRSwgQVRUUklCVVRFX0VORFBPSU5ULCBBVFRSSUJVVEVfTUVUSE9ELCBBVFRSSUJVVEVfU1RBVEUsIEFUVFJJQlVURV9JTlBVVF9NT0RFX0FGVEVSX1NVQk1JVF07XG5cbmNvbnN0IHJlYWRvbmx5ID0gKGZvcm0sIHJlYWRvbmx5KSA9PiB7XG5cdGZvciAobGV0IHBhZ2Ugb2YgZm9ybS5wYWdlcykge1xuXHRcdHBhZ2UucmVhZG9ubHkgPSByZWFkb25seTtcblx0XHRwYWdlLmFjdGl2ZSA9IHJlYWRvbmx5O1xuXHR9XG59O1xuXG5jbGFzcyBGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIEFUVFJJQlVURVM7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IE5PREVOQU1FKCkge1xuXHRcdHJldHVybiBOT0RFTkFNRVMuRm9ybTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5fX2RhdGFfXyA9IHt9O1xuXHRcdHRoaXMuX19zdGF0ZV9fID0gbnVsbDtcblx0XHR0aGlzLm9uKFxuXHRcdFx0RVZFTlRTLnZhbHVlQ2hhbmdlZCxcblx0XHRcdHRvVGltZW91dEhhbmRsZShcblx0XHRcdFx0YXN5bmMgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgZmllbGQgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdFx0Y29uc3QgbmFtZSA9IGF3YWl0IGZpZWxkLm5hbWU7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBhd2FpdCBmaWVsZC52YWx1ZSgpO1xuXHRcdFx0XHRcdGlmIChuYW1lKSB0aGlzLl9fZGF0YV9fW25hbWVdID0gdmFsdWU7XG5cdFx0XHRcdFx0ZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkgT2JqZWN0VXRpbHMubWVyZ2UodGhpcy5fX2RhdGFfXywgdmFsdWUpO1xuXG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKEVWRU5UUy5leGVjdXRlVmFsaWRhdGUsIGV2ZW50LmRldGFpbCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRydWUsXG5cdFx0XHRcdHRydWUsXG5cdFx0XHQpLFxuXHRcdCk7XG5cdH1cblxuXHRhc3luYyBpbml0KCkge1xuXHRcdGF3YWl0IHN1cGVyLmluaXQoKTtcblx0XHR0aGlzLnN0YXRlID0gRk9STVNUQVRFUy5pbml0O1xuXHRcdGNvbnN0IHJlYWR5ID0gdGhpcy5yZWFkeTtcblx0XHRpZiAoIXJlYWR5LnJlc29sdmVkKSB7XG5cdFx0XHR0aGlzLnVzZVN1bW1hcnlQYWdlID0gdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX1VTRV9TVU1NQVJZX1BBR0UpO1xuXHRcdFx0dGhpcy5hY3RpdmVQYWdlSW5kZXggPSAtMTtcblxuXHRcdFx0dGhpcy51c2VTdW1tYXJ5UGFnZSA9IHRoaXMuaGFzQXR0cmlidXRlKEFUVFJJQlVURV9VU0VfU1VNTUFSWV9QQUdFKTtcblx0XHRcdHRoaXMucGFnZXMgPSB0aGlzLmZpbmQoTk9ERU5BTUVTLlBhZ2UpO1xuXHRcdH1cblxuXHRcdHRoaXMuYWN0aXZlUGFnZUluZGV4ID0gLTE7XG5cdFx0aWYgKHRoaXMucGFnZXMubGVuZ3RoID4gMCkgdGhpcy50b05leHRQYWdlKCk7XG5cdH1cblxuXHRnZXQgc3RhdGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19zdGF0ZV9fO1xuXHR9XG5cblx0c2V0IHN0YXRlKHN0YXRlKSB7XG5cdFx0Y29uc3QgYWN0dWFsID0gdGhpcy5zdGF0ZTtcblx0XHRpZiAoYWN0dWFsID09IEZPUk1TVEFURVMuaW5wdXQgJiYgc3RhdGUgIT0gRk9STVNUQVRFUy5pbnB1dCkgcmVhZG9ubHkodGhpcywgdHJ1ZSk7XG5cdFx0ZWxzZSBpZiAoYWN0dWFsICE9IEZPUk1TVEFURVMuaW5wdXQgJiYgc3RhdGUgPT0gRk9STVNUQVRFUy5pbnB1dCkge1xuXHRcdFx0cmVhZG9ubHkodGhpcywgZmFsc2UpO1xuXHRcdFx0aWYgKHRoaXMuYWN0aXZlUGFnZSkgdGhpcy5hY3RpdmVQYWdlLmFjdGl2ZSA9IHRydWU7XG5cdFx0fVxuXHRcdHRoaXMuX19zdGF0ZV9fID0gc3RhdGU7XG5cblx0XHRpZiAoYWN0dWFsICE9IHN0YXRlKSB0aGlzLnRyaWdnZXIoRVZFTlRTLmZvcm1TdGF0ZUNoYW5nZWQpO1xuXHRcdHRoaXMuYXR0cihBVFRSSUJVVEVfU1RBVEUsIHRoaXMuX19zdGF0ZV9fKTtcblx0fVxuXG5cdGdldCB2YWxpZCgpIHtcblx0XHRmb3IgKGxldCBwYWdlIG9mIHRoaXMucGFnZXMpIGlmICghcGFnZS52YWxpZCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRhc3luYyBkYXRhKCkge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHJldHVybiB0aGlzLl9fZGF0YV9fO1xuXG5cdFx0Y29uc3QgZGF0YSA9IGFyZ3VtZW50c1swXTtcblx0XHRhd2FpdCB0aGlzLnJlYWR5O1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUgPT0gRk9STVNUQVRFUy5pbnB1dCkge1xuXHRcdFx0dGhpcy5fX2RhdGFfXyA9IHt9OyAvL2RhdGE7XG5cdFx0XHRmb3IgKGxldCBwYWdlIG9mIHRoaXMucGFnZXMpIHtcblx0XHRcdFx0YXdhaXQgcGFnZS52YWx1ZShudWxsKTsvLyByZXNldCBhbGwgdmFsdWVzXG5cdFx0XHRcdGlmIChwYWdlLm5hbWUpIGF3YWl0IHBhZ2UudmFsdWUoZGF0YVtwYWdlLm5hbWVdKTtcblx0XHRcdFx0ZWxzZSBhd2FpdCBwYWdlLnZhbHVlKGRhdGEpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnRyaWdnZXIoRVZFTlRTLmFsbFB1Ymxpc2hWYWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0IGFjdGl2ZVBhZ2UoKSB7XG5cdFx0aWYgKDAgPD0gdGhpcy5hY3RpdmVQYWdlSW5kZXggJiYgdGhpcy5hY3RpdmVQYWdlSW5kZXggPCB0aGlzLnBhZ2VzLmxlbmd0aCkgcmV0dXJuIHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRzZXQgYWN0aXZlUGFnZShwYWdlKSB7XG5cdFx0Y29uc3QgY3VycmVudCA9IHRoaXMuYWN0aXZlUGFnZTtcblx0XHRpZiAocGFnZSAhPSBjdXJyZW50KSB7XG5cdFx0XHRpZiAoY3VycmVudCkgY3VycmVudC5hY3RpdmUgPSBmYWxzZTtcblx0XHRcdHRoaXMuYWN0aXZlUGFnZUluZGV4ID0gdGhpcy5wYWdlcy5pbmRleE9mKHBhZ2UpO1xuXHRcdFx0cGFnZS5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUgIT0gRk9STVNUQVRFUy5pbnB1dCkgdGhpcy5zdGF0ZSA9IEZPUk1TVEFURVMuaW5wdXQ7XG5cblx0XHRcdHRoaXMudHJpZ2dlcihFVkVOVFMuc2l0ZUNoYW5nZWQpO1xuXHRcdH1cblx0fVxuXG5cdGdldCBwcmV2UGFnZSgpIHtcblx0XHRjb25zdCBzdGFydCA9IHRoaXMuYWN0aXZlUGFnZUluZGV4IC0gMTtcblx0XHRmb3IgKGxldCBpID0gc3RhcnQ7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRjb25zdCBwYWdlID0gdGhpcy5wYWdlc1tpXTtcblx0XHRcdGlmIChwYWdlLmNvbmRpdGlvbikgcmV0dXJuIHBhZ2U7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0IG5leHRQYWdlKCkge1xuXHRcdGlmICh0aGlzLnBhZ2VzKSB7XG5cdFx0XHRjb25zdCBzdGFydCA9IHRoaXMuYWN0aXZlUGFnZUluZGV4ICsgMTtcblx0XHRcdGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgcGFnZSA9IHRoaXMucGFnZXNbaV07XG5cdFx0XHRcdGlmIChwYWdlLmNvbmRpdGlvbikgcmV0dXJuIHBhZ2U7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0YXN5bmMgdG9QcmV2UGFnZSgpIHtcblx0XHRpZiAodGhpcy5zdGF0ZSAhPSBGT1JNU1RBVEVTLmlucHV0KSB7XG5cdFx0XHR0aGlzLnN0YXRlID0gRk9STVNUQVRFUy5pbnB1dDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcHJldiA9IGF3YWl0IHRoaXMucHJldlBhZ2U7XG5cdFx0XHRpZiAocHJldikgdGhpcy5hY3RpdmVQYWdlID0gcHJldjtcblx0XHR9XG5cdH1cblxuXHRhc3luYyB0b05leHRQYWdlKCkge1xuXHRcdGNvbnN0IG5leHQgPSBhd2FpdCB0aGlzLm5leHRQYWdlO1xuXHRcdGlmIChuZXh0KSB7XG5cdFx0XHR0aGlzLmFjdGl2ZVBhZ2UgPSBuZXh0O1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUgPT0gRk9STVNUQVRFUy5pbml0KSB0aGlzLl9zdGF0ZSA9IEZPUk1TVEFURVMuaW5wdXQ7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnVzZVN1bW1hcnlQYWdlKSB7XG5cdFx0XHR0aGlzLnN1bW1hcnkoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zdWJtaXQoKTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBzdW1tYXJ5KCkge1xuXHRcdHRoaXMuc3RhdGUgPSBGT1JNU1RBVEVTLnN1bW1hcnk7XG5cdH1cblxuXHRhc3luYyBzdWJtaXQoKSB7XG5cdFx0dGhpcy5zdGF0ZSA9IHRoaXMuaGFzQXR0cmlidXRlKEFUVFJJQlVURV9JTlBVVF9NT0RFX0FGVEVSX1NVQk1JVCkgPyBGT1JNU1RBVEVTLmlucHV0IDogRk9STVNUQVRFUy5maW5pc2hlZDtcblx0XHRjb25zdCBkYXRhID0gdGhpcy5kYXRhO1xuXG5cdFx0bGV0IGVuZHBvaW50ID0gdGhpcy5hdHRyKEFUVFJJQlVURV9FTkRQT0lOVCk7XG5cdFx0aWYgKGVuZHBvaW50KSB7XG5cdFx0XHRlbmRwb2ludCA9IGF3YWl0IEV4cHJlc3Npb25SZXNvbHZlci5yZXNvbHZlVGV4dChlbmRwb2ludCwgZGF0YSwgZW5kcG9pbnQpO1xuXHRcdFx0Y29uc3QgdXJsID0gbmV3IFVSTChlbmRwb2ludCwgbG9jYXRpb24uaHJlZik7XG5cblx0XHRcdHJldHVybiBhd2FpdCBmZXRjaCh1cmwudG9TdHJpbmcoKSwge1xuXHRcdFx0XHRtZXRob2Q6ICh0aGlzLmF0dHIoQVRUUklCVVRFX01FVEhPRCkgfHwgXCJwb3N0XCIpLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcblx0XHRcdFx0bW9kZTogXCJjb3JzXCIsXG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcblx0XHRcdFx0fSxcblx0XHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLnRyaWdnZXIoRVZFTlRTLnN1Ym1pdCwgZGF0YSk7XG5cdH1cbn1cbmRlZmluZUVsZW1lbnQoRm9ybSk7XG5leHBvcnQgZGVmYXVsdCBGb3JtO1xuIiwiaW1wb3J0IHsgTk9ERU5BTUVTLCBBVFRSSUJVVEVfQUNUSVZFLCBBVFRSSUJVVEVfRElTQUJMRUQgfSBmcm9tIFwiLi9Db25zdGFudHNcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWNvbXBvbmVudHMvc3JjL0NvbXBvbmVudFwiO1xuXG5jb25zdCBBVFRSSUJVVEVTID0gW0FUVFJJQlVURV9BQ1RJVkUsIEFUVFJJQlVURV9ESVNBQkxFRF07XG5cbmNsYXNzIEZvcm1CdXR0b24gZXh0ZW5kcyBDb21wb25lbnQge1xuXHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRyZXR1cm4gQVRUUklCVVRFUztcblx0fVxuXG5cdHN0YXRpYyBpbml0KGJ1dHRvbikge1xuXHRcblx0fVxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5hY3RpdmUgPSBmYWxzZTtcblx0XHR0aGlzLmRpc2FibGVkID0gZmFsc2U7XG5cdFx0dGhpcy5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRpZiAodGhpcy5hY3RpdmUgJiYgIXRoaXMuZGlzYWJsZWQpIHRoaXMuZXhlY3V0ZSgpO1xuXHRcdH0pO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRhd2FpdCBzdXBlci5pbml0KCk7XG5cdFx0dGhpcy5mb3JtID0gdGhpcy5wYXJlbnQoTk9ERU5BTUVTLkZvcm0pO1xuXHR9XG5cblx0Z2V0IGFjdGl2ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX0FDVElWRSk7XG5cdH1cblxuXHRzZXQgYWN0aXZlKGFjdGl2ZSkge1xuXHRcdGFjdGl2ZSA/IHRoaXMuYXR0cihBVFRSSUJVVEVfQUNUSVZFLCBcIlwiKSA6IHRoaXMuYXR0cihBVFRSSUJVVEVfQUNUSVZFLCBudWxsKTtcblx0fVxuXG5cdGdldCBkaXNhYmxlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX0RJU0FCTEVEKTtcblx0fVxuXG5cdHNldCBkaXNhYmxlZChkaXNhYmxlZCkge1xuXHRcdGRpc2FibGVkID8gdGhpcy5hdHRyKEFUVFJJQlVURV9ESVNBQkxFRCwgXCJcIikgOiB0aGlzLmF0dHIoQVRUUklCVVRFX0RJU0FCTEVELCBudWxsKTtcblx0fVxuXG5cdGV4ZWN1dGUoKSB7XG5cdFx0Y29uc29sZS5sb2coXCJleGVjdXRlXCIpO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBGb3JtQnV0dG9uO1xuIiwiaW1wb3J0IHsgTk9ERU5BTUVTLCBFVkVOVFMsIFRSSUdHRVJfVElNRU9VVCwgQVRUUklCVVRFX01BWCwgQVRUUklCVVRFX0lOVkFMSUQgfSBmcm9tIFwiLi9Db25zdGFudHNcIjtcbmltcG9ydCB7IG5vVmFsdWUgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvVmFsdWVIZWxwZXJcIjtcbmltcG9ydCB7IHRvVGltZW91dEhhbmRsZSB9IGZyb20gXCIuL3V0aWxzL0V2ZW50SGVscGVyXCI7XG5pbXBvcnQgeyB0cmVlRmlsdGVyIH0gZnJvbSBcIi4vdXRpbHMvTm9kZUhlbHBlclwiO1xuaW1wb3J0IGRlZmluZUVsZW1lbnQgZnJvbSBcIi4vdXRpbHMvRGVmaW5lRWxlbWVudFwiO1xuaW1wb3J0IEJhc2VGaWVsZCBmcm9tIFwiLi9CYXNlRmllbGRcIjtcbmltcG9ydCBSb3cgZnJvbSBcIi4vbGlzdC9Sb3dcIjtcbmltcG9ydCBBZGRSb3cgZnJvbSBcIi4vbGlzdC9BZGRSb3dcIjtcbmltcG9ydCBEZWxldGVSb3cgZnJvbSBcIi4vbGlzdC9EZWxldGVSb3dcIjtcbmltcG9ydCBSb3dzIGZyb20gXCIuL2xpc3QvUm93c1wiO1xuXG5jb25zdCBBVFRSSUJVVEVTID0gW0FUVFJJQlVURV9NQVhdO1xuXG5jb25zdCBmaW5kQWRkQnV0dG9uID0gKGxpc3QpID0+IHtcblx0cmV0dXJuIHRyZWVGaWx0ZXIoe1xuXHRcdHJvb3Q6IGxpc3QsXG5cdFx0ZmlsdGVyOiAoZWxlbWVudCkgPT4ge1xuXHRcdFx0aWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBZGRSb3cpIHJldHVybiB7IGFjY2VwdDogdHJ1ZSwgc3RvcDogdHJ1ZSB9O1xuXHRcdFx0ZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEJhc2VGaWVsZCkgcmV0dXJuIHsgYWNjZXB0OiBmYWxzZSwgc3RvcDogdHJ1ZSB9O1xuXHRcdFx0cmV0dXJuIHsgYWNjZXB0OiBmYWxzZSB9O1xuXHRcdH0sXG5cdH0pWzBdO1xufTtcblxuY29uc3QgY3JlYXRlUm93ID0gYXN5bmMgKGxpc3QsIHZhbHVlKSA9PiB7XG5cdGNvbnN0IHsgY29udGFpbmVyLCB0ZW1wbGF0ZSB9ID0gbGlzdDtcblx0Y29uc3Qgcm93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKS5jaGlsZHJlblswXTtcblx0Y29udGFpbmVyLmFwcGVuZChyb3cpO1xuXG5cdGlmICh2YWx1ZSkgYXdhaXQgcm93LnZhbHVlKHZhbHVlKTtcblxuXHRyZXR1cm4gcm93O1xufTtcblxuY2xhc3MgTGlzdCBleHRlbmRzIEJhc2VGaWVsZCB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTLmNvbmNhdChCYXNlRmllbGQub2JzZXJ2ZWRBdHRyaWJ1dGVzKTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XG5cdFx0cmV0dXJuIE5PREVOQU1FUy5MaXN0O1xuXHR9XG5cblx0Y29uc3RydWN0b3IodmFsdWUgPSBudWxsKSB7XG5cdFx0c3VwZXIodmFsdWUgPyB2YWx1ZSA6IFtdKTtcblxuXHRcdHRoaXMub24oXG5cdFx0XHRFVkVOVFMudmFsdWVDaGFuZ2VkLFxuXHRcdFx0XHQoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRjb25zdCByb3cgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdFx0aWYgKHJvdyBpbnN0YW5jZW9mIFJvdykge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRcdGNvbnN0IGNoYWluID0gZXZlbnQuZGV0YWlsO1xuXHRcdFx0XHRcdFx0dGhpcy5jaGlsZFZhbHVlQ2hhbmdlZChyb3csIGNoYWluKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dGhpcy5vbihFVkVOVFMubGlzdFJvd0FkZCwgKGV2ZW50KSA9PiB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdGNvbnN0IHsgcmVhZG9ubHksIF9fdmFsdWVfXyB9ID0gdGhpcztcblx0XHRcdGlmICghcmVhZG9ubHkpIHtcblx0XHRcdFx0Y29uc3Qgcm93ID0gY3JlYXRlUm93KHRoaXMpO1xuXHRcdFx0XHRfX3ZhbHVlX18ucHVzaChyb3cudmFsdWUpO1xuXG5cdFx0XHRcdHRoaXMudmFsaWRhdGUoKTtcblx0XHRcdFx0dGhpcy5wdWJsaXNoVmFsdWUoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMub24oRVZFTlRTLmxpc3RSb3dEZWxldGUsIChldmVudCkgPT4ge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRjb25zdCB7IHJvd3MsIHJlYWRvbmx5LCBfX3ZhbHVlX18gfSA9IHRoaXM7XG5cdFx0XHRpZiAoIXJlYWRvbmx5KSB7XG5cdFx0XHRcdGNvbnN0IHJvdyA9IGV2ZW50LnRhcmdldC5wYXJlbnQoTk9ERU5BTUVTLkxpc3RSb3cpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHJvd3MuaW5kZXhPZihyb3cpO1xuXHRcdFx0XHRpZiAoaW5kZXggPj0gMCkge1xuXHRcdFx0XHRcdHJvdy5yZW1vdmUoKTtcblx0XHRcdFx0XHRyb3dzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0X192YWx1ZV9fLnNwbGljZShpbmRleCwgMSk7XG5cblx0XHRcdFx0XHR0aGlzLnZhbGlkYXRlKCk7XG5cdFx0XHRcdFx0dGhpcy5wdWJsaXNoVmFsdWUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRhd2FpdCBzdXBlci5pbml0KCk7XG5cdFx0dGhpcy5fX3ZhbHVlX18gPSBbXTtcblx0XHRjb25zdCByZWFkeSA9IHRoaXMucmVhZHk7XG5cdFx0aWYgKCFyZWFkeS5yZXNvbHZlZCkge1xuXHRcdFx0dGhpcy50ZW1wbGF0ZSA9IHRoaXMuZmluZChcInRlbXBsYXRlXCIpLmZpcnN0KCk7XG5cdFx0XHR0aGlzLmNvbnRhaW5lciA9IHRoaXMuZmluZChOT0RFTkFNRVMuTGlzdFJvd3MpLmZpcnN0KCk7XG5cdFx0XHRjb25zdCB7IGNvbnRhaW5lciwgdGVtcGxhdGUsIHZhbGlkYXRvciB9ID0gdGhpcztcblx0XHRcdGNvbnN0IGFkZEJ1dHRvbiA9IGZpbmRBZGRCdXR0b24odGhpcyk7XG5cblx0XHRcdHZhbGlkYXRvci5hZGRDdXN0b21DaGVjayhhc3luYyAoe30pID0+IHtcblx0XHRcdFx0Y29uc3QgeyByb3dzLCBtYXgsIHJlYWRvbmx5IH0gPSB0aGlzO1xuXHRcdFx0XHRjb25zdCBsZW5ndGggPSByb3dzLmxlbmd0aDtcblx0XHRcdFx0aWYgKCFyZWFkb25seSkge1xuXHRcdFx0XHRcdGlmIChsZW5ndGggPT0gbWF4KSBhZGRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGVsc2UgaWYgKGxlbmd0aCA8IG1heCkgYWRkQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGxlbmd0aCA8PSBtYXg7XG5cdFx0XHR9KTtcblxuXHRcdFx0dmFsaWRhdG9yLmFkZEN1c3RvbUNoZWNrKGFzeW5jICgpID0+IHtcblx0XHRcdFx0Y29uc3QgeyByb3dzIH0gPSB0aGlzO1xuXHRcdFx0XHRpZiAocm93cylcblx0XHRcdFx0XHRmb3IgKGxldCByb3cgb2Ygcm93cykge1xuXHRcdFx0XHRcdFx0aWYgKCFyb3cudmFsaWQpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLnZhbGlkYXRlKCk7XG5cdFx0dGhpcy5wdWJsaXNoVmFsdWUoKTtcblx0fVxuXG5cdHJlYWRvbmx5VXBkYXRlZCgpIHtcblx0XHRjb25zdCB7IHJlYWRvbmx5IH0gPSB0aGlzO1xuXHRcdGZvciAobGV0IHJvdyBvZiB0aGlzLnJvd3MpIHtcblx0XHRcdHJvdy5yZWFkb25seSA9IHJlYWRvbmx5O1xuXHRcdH1cblx0fVxuXG5cdGdldCByb3dzKCkge1xuXHRcdHJldHVybiBBcnJheS5mcm9tKHRoaXMuY29udGFpbmVyLmNoaWxkcmVuKTtcblx0fVxuXG5cdGdldCBtYXgoKSB7XG5cdFx0aWYgKHRoaXMuaGFzQXR0cmlidXRlKEFUVFJJQlVURV9NQVgpKSByZXR1cm4gcGFyc2VJbnQodGhpcy5hdHRyKEFUVFJJQlVURV9NQVgpKTtcblx0XHRyZXR1cm4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cdH1cblxuXHRhY2NlcHRWYWx1ZSh2YWx1ZSkge1xuXHRcdHJldHVybiAhdmFsdWUgfHwgdmFsdWUgaW5zdGFuY2VvZiBBcnJheTtcblx0fVxuXG5cdG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG5cdFx0cmV0dXJuIHZhbHVlLmZpbHRlcigoaXRlbSkgPT4gISFpdGVtKTtcblx0fVxuXG5cdGFzeW5jIHVwZGF0ZWRWYWx1ZSh2YWx1ZSkge1xuXHRcdHRoaXMuY29udGFpbmVyLmNoaWxkcmVuLnJlbW92ZSgpO1xuXHRcdHRoaXMuX192YWx1ZV9fID0gW107XG5cblx0XHRmb3IgKGxldCB2YWwgb2YgdmFsdWUpIGF3YWl0IGNyZWF0ZVJvdyh0aGlzLCB2YWwpO1xuXHR9XG5cblx0YXN5bmMgY2hpbGRWYWx1ZUNoYW5nZWQocm93LCBjaGFpbil7XG5cdFx0YXdhaXQgdGhpcy5yZWFkeTtcblx0XHRjb25zdCByb3dzID0gdGhpcy5yb3dzO1xuXHRcdGNvbnN0IHZhbHVlICA9IGF3YWl0IHJvdy52YWx1ZSgpO1xuXG5cdFx0Y29uc3QgaW5kZXggPSByb3dzLmluZGV4T2Yocm93KTtcblx0XHR0aGlzLl9fdmFsdWVfX1tpbmRleF0gPSB2YWx1ZTtcblxuXHRcdGF3YWl0IHRoaXMudmFsaWRhdGUoKTtcblx0XHRhd2FpdCB0aGlzLnB1Ymxpc2hWYWx1ZShjaGFpbik7XG5cdH1cbn1cblxuZGVmaW5lRWxlbWVudChMaXN0KTtcbmV4cG9ydCBkZWZhdWx0IExpc3Q7XG4iLCJpbXBvcnQgRXhwcmVzc2lvblJlc29sdmVyIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9zcmMvRXhwcmVzc2lvblJlc29sdmVyXCI7XG5pbXBvcnQgQmFzZSBmcm9tIFwiLi9CYXNlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL3NyYy9Db21wb25lbnRcIjtcbmltcG9ydCB7IE5PREVOQU1FUywgRVZFTlRTLCBUUklHR0VSX1RJTUVPVVQgfSBmcm9tIFwiLi9Db25zdGFudHNcIjtcbmltcG9ydCB7IHRvRXZlbnRzLCB0b1RpbWVvdXRIYW5kbGUgfSBmcm9tIFwiLi91dGlscy9FdmVudEhlbHBlclwiO1xuaW1wb3J0IHsgZXZhbHVhdGlvbkRhdGEgfSBmcm9tIFwiLi91dGlscy9EYXRhSGVscGVyXCI7XG5pbXBvcnQgZGVmaW5lRWxlbWVudCBmcm9tIFwiLi91dGlscy9EZWZpbmVFbGVtZW50XCI7XG5cbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfQUNUSVZFID0gXCJhY3RpdmVcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfQ09ORElUSU9OID0gXCJjb25kaXRpb25cIjtcbmNvbnN0IEFUVFJJQlVURVMgPSBbQVRUUklCVVRFX0FDVElWRSwgQVRUUklCVVRFX0NPTkRJVElPTl07XG5cbmV4cG9ydCBjb25zdCBmaW5kUGFyZW50QmFzZSA9IChtZXNzYWdlKSA9PiB7XG5cdGxldCBwYXJlbnQgPSBtZXNzYWdlLnBhcmVudE5vZGU7XG5cdHdoaWxlIChwYXJlbnQpIHtcblx0XHRpZiAocGFyZW50IGluc3RhbmNlb2YgQmFzZSkgcmV0dXJuIHBhcmVudDtcblxuXHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHR9XG5cdHJldHVybiBudWxsO1xufTtcblxuY2xhc3MgTWVzc2FnZSBleHRlbmRzIENvbXBvbmVudCB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTO1xuXHR9XG5cblx0c3RhdGljIGdldCBOT0RFTkFNRSgpIHtcblx0XHRyZXR1cm4gTk9ERU5BTUVTLk1lc3NhZ2U7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRhd2FpdCBzdXBlci5pbml0KCk7XG5cdFx0Y29uc3QgcmVhZHkgPSB0aGlzLnJlYWR5O1x0XHRcblxuXHRcdGlmICghcmVhZHkucmVzb2x2ZWQpIHtcdFx0XHRcblx0XHRcdHRoaXMucmVmZXJlbmNlID0gZmluZFBhcmVudEJhc2UodGhpcyk7XG5cdFx0XHR0aGlzLmZvcm0gPSB0aGlzLnBhcmVudChOT0RFTkFNRVMuRm9ybSk7XG5cdFx0XHR0aGlzLmZvcm0ub24oRVZFTlRTLmV4ZWN1dGVWYWxpZGF0ZSwgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlKCk7XG5cdH1cblxuXHRnZXQgYWN0aXZlKCkge1xuXHRcdHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShBVFRSSUJVVEVfQUNUSVZFKTtcblx0fVxuXHRzZXQgYWN0aXZlKGFjdGl2ZSkge1xuXHRcdGFjdGl2ZSA/IHRoaXMuYXR0cihBVFRSSUJVVEVfQUNUSVZFLCBcIlwiKSA6IHRoaXMuYXR0cihBVFRSSUJVVEVfQUNUSVZFLCB1bmRlZmluZWQpO1xuXHR9XG5cblx0Z2V0IGNvbmRpdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5hdHRyKEFUVFJJQlVURV9DT05ESVRJT04pO1xuXHR9XG5cblx0YXN5bmMgdXBkYXRlKCkge1xuXHRcdGF3YWl0IHRoaXMucmVhZHk7XG5cdFx0Y29uc3QgZGF0YSA9IGF3YWl0IGV2YWx1YXRpb25EYXRhKHRoaXMucmVmZXJlbmNlKTtcblx0XHR0aGlzLmFjdGl2ZSA9IGF3YWl0IEV4cHJlc3Npb25SZXNvbHZlci5yZXNvbHZlKHRoaXMuY29uZGl0aW9uLCBkYXRhLCBmYWxzZSk7XG5cdH1cbn1cbmRlZmluZUVsZW1lbnQoTWVzc2FnZSk7XG5leHBvcnQgZGVmYXVsdCBNZXNzYWdlO1xuIiwiaW1wb3J0IHsgTk9ERU5BTUVTLCBFVkVOVFMsIEFUVFJJQlVURV9TVEVQIH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gXCIuL0NvbnRhaW5lclwiO1xuaW1wb3J0IGRlZmluZUVsZW1lbnQgZnJvbSBcIi4vdXRpbHMvRGVmaW5lRWxlbWVudFwiO1xuXG5jb25zdCBBVFRSSUJVVEVTID0gW0FUVFJJQlVURV9TVEVQXTtcblxuY2xhc3MgUGFnZSBleHRlbmRzIENvbnRhaW5lciB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTLmNvbmNhdChDb250YWluZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzKTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XG5cdFx0cmV0dXJuIE5PREVOQU1FUy5QYWdlO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdGFzeW5jIGluaXQoKSB7XG5cdFx0YXdhaXQgc3VwZXIuaW5pdCgpO1xuXHR9XG5cblx0Z2V0IHN0ZXAoKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyKEFUVFJJQlVURV9TVEVQKTtcblx0fVxuXHRcblx0Y29uZGl0aW9uVXBkYXRlZCgpe31cbn1cbmRlZmluZUVsZW1lbnQoUGFnZSk7XG5leHBvcnQgZGVmYXVsdCBQYWdlO1xuIiwiaW1wb3J0IHsgTk9ERU5BTUVTLCBFVkVOVFMsIFRSSUdHRVJfVElNRU9VVCwgRk9STVNUQVRFUywgcHJvZ3Jlc3MsIEFUVFJJQlVURV9QUk9HUkVTUyB9IGZyb20gXCIuL0NvbnN0YW50c1wiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvQ29tcG9uZW50XCI7XG5pbXBvcnQgZGVmaW5lRWxlbWVudCBmcm9tIFwiLi91dGlscy9EZWZpbmVFbGVtZW50XCI7XG5pbXBvcnQgXCIuL1N0ZXBcIjtcblxuY29uc3QgQVRUUklCVVRFUyA9IFtBVFRSSUJVVEVfUFJPR1JFU1NdO1xuXG5jb25zdCBmaXJzdFN0ZXBQYWdlSW5kZXggPSAocGFnZXMsIHN0ZXAsIGFjdGl2ZVBhZ2UpID0+IHtcblx0Zm9yIChsZXQgcGFnZSBvZiBwYWdlcykge1xuXHRcdGlmIChwYWdlLnN0ZXAgPT0gc3RlcCAmJiBwYWdlLmNvbmRpdGlvbikgcmV0dXJuIHBhZ2U7XG5cdFx0ZWxzZSBpZiAocGFnZSA9PSBhY3RpdmVQYWdlKSByZXR1cm47XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbmNsYXNzIFByb2dyZXNzQmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIEFUVFJJQlVURVM7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IE5PREVOQU1FKCkge1xuXHRcdHJldHVybiBOT0RFTkFNRVMuUHJvZ3Jlc3NCYXI7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5vbihcImNsaWNrXCIsICh7IHRhcmdldCB9KSA9PiB7XG5cdFx0XHRpZiAoIXRoaXMuZm9ybSkgcmV0dXJuO1xuXHRcdFx0aWYgKHRhcmdldCA9PSB0aGlzKSByZXR1cm47XG5cblx0XHRcdGNvbnN0IHN0ZXAgPSB0YXJnZXQuaXMoTk9ERU5BTUVTLlN0ZXApID8gdGFyZ2V0IDogdGFyZ2V0LnBhcmVudChOT0RFTkFNRVMuU3RlcCkuZmlyc3QoKTtcblxuXHRcdFx0aWYgKCFzdGVwKSByZXR1cm47XG5cblx0XHRcdGNvbnN0IHN0YXRlID0gdGhpcy5mb3JtLnN0YXRlO1xuXHRcdFx0Y29uc3QgcGFnZXMgPSB0aGlzLmZvcm0ucGFnZXM7XG5cdFx0XHRjb25zdCBhY3RpdmVQYWdlSW5kZXggPSB0aGlzLmZvcm0uYWN0aXZlUGFnZUluZGV4O1xuXHRcdFx0Y29uc3QgYWN0aXZlUGFnZSA9IHRoaXMuZm9ybS5hY3RpdmVQYWdlO1xuXHRcdFx0Y29uc3Qgc3RlcE5hbWUgPSBzdGVwLm5hbWU7XG5cdFx0XHRpZiAoc3RhdGUgPT0gRk9STVNUQVRFUy5pbnB1dCB8fCBzdGF0ZSA9PSBGT1JNU1RBVEVTLnN1bW1hcnkpIHtcblx0XHRcdFx0Y29uc3QgcGFnZSA9IGZpcnN0U3RlcFBhZ2VJbmRleChwYWdlcywgc3RlcE5hbWUsIGFjdGl2ZVBhZ2UpO1xuXHRcdFx0XHRpZiAocGFnZSkgdGhpcy5mb3JtLmFjdGl2ZVBhZ2UgPSBwYWdlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRhd2FpdCBzdXBlci5pbml0KCk7XG5cdFx0Y29uc3QgcmVhZHkgPSB0aGlzLnJlYWR5O1xuXHRcdHRoaXMucHJvZ3Jlc3MgPSAwO1xuXHRcdGlmICghcmVhZHkucmVzb2x2ZWQpIHtcblx0XHRcdHRoaXMuZm9ybSA9IHRoaXMucGFyZW50KE5PREVOQU1FUy5Gb3JtKTtcblx0XHRcdHRoaXMuc3RlcHMgPSB0aGlzLmZpbmQoTk9ERU5BTUVTLlN0ZXApO1xuXHRcdFx0dGhpcy5mb3JtLm9uKFtFVkVOVFMuaW5pdGlhbGl6ZSwgRVZFTlRTLnNpdGVDaGFuZ2VkLCBFVkVOVFMuZm9ybVN0YXRlQ2hhbmdlZF0sICgpID0+IHtcblx0XHRcdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLmZvcm0uc3RhdGU7XG5cdFx0XHRcdGNvbnN0IGFjdGl2ZVBhZ2UgPSB0aGlzLmZvcm0uYWN0aXZlUGFnZTtcblx0XHRcdFx0aWYgKCFhY3RpdmVQYWdlKSByZXR1cm47XG5cblx0XHRcdFx0Y29uc3QgaW5kZXggPSB0aGlzLmZvcm0uYWN0aXZlUGFnZUluZGV4O1xuXHRcdFx0XHRjb25zdCBjb3VudCA9IHRoaXMuZm9ybS5wYWdlcy5sZW5ndGg7XG5cdFx0XHRcdGNvbnN0IHBhZ2VTdGVwID0gYWN0aXZlUGFnZSA/IGFjdGl2ZVBhZ2Uuc3RlcCA6IEZPUk1TVEFURVMuaW5pdDtcblx0XHRcdFx0Y29uc3QgcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKChpbmRleCAqIDEwMCkgLyBjb3VudCk7XG5cblx0XHRcdFx0Zm9yIChsZXQgc3RlcCBvZiB0aGlzLnN0ZXBzKSB7XG5cdFx0XHRcdFx0Y29uc3QgbmFtZSA9IHN0ZXAubmFtZTtcblx0XHRcdFx0XHRpZiAoc3RhdGUgPT0gRk9STVNUQVRFUy5pbnB1dCkge1xuXHRcdFx0XHRcdFx0c3RlcC5hY3RpdmUgPSBuYW1lID09IHBhZ2VTdGVwO1xuXHRcdFx0XHRcdFx0c3RlcC5yZWFkb25seSA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhdGUgPT0gRk9STVNUQVRFUy5zdW1tYXJ5KSB7XG5cdFx0XHRcdFx0XHRzdGVwLmFjdGl2ZSA9IG5hbWUgPT0gRk9STVNUQVRFUy5zdW1tYXJ5O1xuXHRcdFx0XHRcdFx0c3RlcC5yZWFkb25seSA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdGVwLmFjdGl2ZSA9IG5hbWUgPT0gRk9STVNUQVRFUy5maW5pc2hlZDtcblx0XHRcdFx0XHRcdHN0ZXAucmVhZG9ubHkgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMucHJvZ3Jlc3MgPSBzdGF0ZSA9PSBGT1JNU1RBVEVTLnN1bW1hcnkgfHwgc3RhdGUgPT0gRk9STVNUQVRFUy5maW5pc2hlZCA/IDEwMCA6IHByb2dyZXNzO1xuXG5cdFx0XHRcdHRoaXMudHJpZ2dlcihFVkVOVFMucHJvZ3Jlc3NiYXJDaGFuZ2VkKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGdldCBwcm9ncmVzcygpIHtcblx0XHRyZXR1cm4gdGhpcy5hdHRyKEFUVFJJQlVURV9QUk9HUkVTUyk7XG5cdH1cblxuXHRzZXQgcHJvZ3Jlc3MocHJvZ3Jlc3MpIHtcblx0XHRpZiAodGhpcy5zdHlsZS5zZXRQcm9wZXJ0eSkgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJvZ3Jlc3NcIiwgcHJvZ3Jlc3MgKyBcIiVcIik7XG5cdFx0dGhpcy5hdHRyKEFUVFJJQlVURV9QUk9HUkVTUywgTWF0aC5tYXgoMCwgTWF0aC5taW4ocHJvZ3Jlc3MsIDEwMCkpKTtcblx0fVxufVxuXG5kZWZpbmVFbGVtZW50KFByb2dyZXNzQmFyKTtcbmV4cG9ydCBkZWZhdWx0IFByb2dyZXNzQmFyO1xuIiwiaW1wb3J0IHsgTk9ERU5BTUVTLCBFVkVOVFMsIFRSSUdHRVJfVElNRU9VVCwgQVRUUklCVVRFX05BTUUsIEFUVFJJQlVURV9BQ1RJVkUsIEFUVFJJQlVURV9SRUFET05MWSB9IGZyb20gXCIuL0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgdXBkYXRlQWN0aXZlU3RhdGUgfSBmcm9tIFwiLi91dGlscy9TdGF0ZUhlbHBlclwiO1xuaW1wb3J0IGRlZmluZUVsZW1lbnQgZnJvbSBcIi4vdXRpbHMvRGVmaW5lRWxlbWVudFwiO1xuXG5jb25zdCBBVFRSSUJVVEVTID0gW0FUVFJJQlVURV9OQU1FLCBBVFRSSUJVVEVfQUNUSVZFLCBBVFRSSUJVVEVfUkVBRE9OTFldO1xuXG5jbGFzcyBTdGVwIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRyZXR1cm4gQVRUUklCVVRFUztcblx0fVxuXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XG5cdFx0cmV0dXJuIE5PREVOQU1FUy5TdGVwO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG4gICAgZ2V0IG5hbWUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cihBVFRSSUJVVEVfTkFNRSk7XG4gICAgfVxuICAgIFxuICAgIGdldCBhY3RpdmUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEFUVFJJQlVURV9BQ1RJVkUpO1xuXHR9XG5cblx0c2V0IGFjdGl2ZShhY3RpdmUpIHtcblx0XHRjb25zdCBjdXJyZW50ID0gdGhpcy5hY3RpdmU7XG5cdFx0aWYgKGN1cnJlbnQgIT0gYWN0aXZlKSB7XG5cdFx0XHR1cGRhdGVBY3RpdmVTdGF0ZSh0aGlzLCBhY3RpdmUpO1xuXHRcdH1cblx0fVxuXG5cdGdldCByZWFkb25seSgpIHtcblx0XHRyZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX1JFQURPTkxZKTtcblx0fVxuXG5cdHNldCByZWFkb25seShyZWFkb25seSkge1xuXHRcdHJlYWRvbmx5ID8gdGhpcy5hdHRyKEFUVFJJQlVURV9SRUFET05MWSwgXCJcIikgOiB0aGlzLmF0dHIoQVRUUklCVVRFX1JFQURPTkxZLCBudWxsKTtcblx0fVxufVxuXG5kZWZpbmVFbGVtZW50KFN0ZXApO1xuZXhwb3J0IGRlZmF1bHQgU3RlcDtcbiIsImltcG9ydCB7IE5PREVOQU1FUywgRVZFTlRTIH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL3NyYy9Db21wb25lbnRcIjtcbmltcG9ydCBkZWZpbmVFbGVtZW50IGZyb20gXCIuL3V0aWxzL0RlZmluZUVsZW1lbnRcIjtcblxuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9BQ1RJVkUgPSBcImFjdGl2ZVwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9DT05ESVRJT04gPSBcImNvbmRpdGlvblwiO1xuY29uc3QgQVRUUklCVVRFUyA9IFtBVFRSSUJVVEVfQUNUSVZFLCBBVFRSSUJVVEVfQ09ORElUSU9OXTtcblxuXG5jbGFzcyBWYWxpZGF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIEFUVFJJQlVURVM7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IE5PREVOQU1FKCkge1xuXHRcdHJldHVybiBOT0RFTkFNRVMuVmFsaWRhdGlvbjtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRhc3luYyBpbml0KCkge1xuXHRcdGF3YWl0IHN1cGVyLmluaXQoKTtcblx0XHR0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXHR9XG5cblx0Z2V0IGFjdGl2ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX0FDVElWRSk7XG5cdH1cblx0c2V0IGFjdGl2ZShhY3RpdmUpIHtcblx0XHRhY3RpdmUgPyB0aGlzLmF0dHIoQVRUUklCVVRFX0FDVElWRSwgXCJcIikgOiB0aGlzLmF0dHIoQVRUUklCVVRFX0FDVElWRSwgdW5kZWZpbmVkKTtcblx0fVxuXG5cdGdldCBjb25kaXRpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYXR0cihBVFRSSUJVVEVfQ09ORElUSU9OKTtcblx0fVxufVxuZGVmaW5lRWxlbWVudChWYWxpZGF0aW9uKTtcbmV4cG9ydCBkZWZhdWx0IFZhbGlkYXRpb247XG4iLCJpbXBvcnQgRXhwcmVzc2lvblJlc29sdmVyIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9zcmMvRXhwcmVzc2lvblJlc29sdmVyXCI7XG5pbXBvcnQgeyBFVkVOVFMsIFRSSUdHRVJfVElNRU9VVCwgTk9ERU5BTUVTLCBBVFRSSUJVVEVfQ09ORElUSU9OLCBBVFRSSUJVVEVfRURJVEFCTEVfQ09ORElUSU9OLCBGT1JNU1RBVEVTIH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgXCIuL1ZhbGlkYXRpb25cIjtcbmltcG9ydCB7IHVwZGF0ZUNvbmRpdGlvblN0YXRlLCB1cGRhdGVWYWxpZFN0YXRlIH0gZnJvbSBcIi4vdXRpbHMvU3RhdGVIZWxwZXJcIlxuaW1wb3J0IHsgZmluZFZhbGlkYXRpb25zIH0gZnJvbSBcIi4vdXRpbHMvTm9kZUhlbHBlclwiO1xuaW1wb3J0IHsgZXZhbHVhdGlvbkRhdGEgfSBmcm9tIFwiLi91dGlscy9EYXRhSGVscGVyXCI7XG5cblxuY29uc3QgdXBkYXRlUmVhZG9ubHkgPSBhc3luYyAoeyBkYXRhLCB2YWxpZCwgYmFzZSwgY29uZGl0aW9uIH0pID0+IHtcblx0Y29uc3QgeyBmb3JtIH0gPSBiYXNlO1xuXHRpZiAoZm9ybS5zdGF0ZSA9PSBGT1JNU1RBVEVTLmlucHV0KSB7XG5cdFx0aWYgKCF2YWxpZClcblx0XHRcdGJhc2UucmVhZG9ubHkgPSBmYWxzZTtcblx0XHRlbHNlIGlmIChjb25kaXRpb24pIHtcblx0XHRcdGNvbnN0IHRlc3QgPSBhd2FpdCBFeHByZXNzaW9uUmVzb2x2ZXIucmVzb2x2ZShjb25kaXRpb24sIGRhdGEsIGZhbHNlKTtcblx0XHRcdGJhc2UuZWRpdGFibGUgPSB0ZXN0O1xuXHRcdFx0cmV0dXJuIHRlc3Q7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB2YWxpZDtcbn1cblxuY2xhc3MgVmFsaWRhdG9yIHtcblx0Y29uc3RydWN0b3IoYmFzZSkge1xuXHRcdHRoaXMuaW5pdGFsID0gdHJ1ZTtcblx0XHR0aGlzLmJhc2UgPSBiYXNlO1xuXHRcdHRoaXMuY3VzdG9tQ2hlY2tzID0gW107XG5cdFx0dGhpcy52YWxpZGF0aW9ucyA9IGZpbmRWYWxpZGF0aW9ucyhiYXNlKSB8fCBbXTtcblx0XHR0aGlzLmNvbmRpdGlvbiA9IGJhc2UuYXR0cihBVFRSSUJVVEVfQ09ORElUSU9OKTtcblx0XHR0aGlzLmVkaXRhYmxlQ29uZGl0aW9uID0gYmFzZS5hdHRyKEFUVFJJQlVURV9FRElUQUJMRV9DT05ESVRJT04pO1xuXG5cdH1cblxuXHRhZGRDdXN0b21DaGVjayhjaGVjaykge1xuXHRcdHRoaXMuY3VzdG9tQ2hlY2tzLnB1c2goY2hlY2spO1xuXHR9XG5cblx0Z2V0IGZvcm0oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYmFzZS5mb3JtO1xuXHR9XG5cblx0YXN5bmMgdmFsaWRhdGUoKSB7XG5cdFx0Y29uc3QgeyBiYXNlLCB2YWxpZGF0aW9ucywgY3VzdG9tQ2hlY2tzLCBjb25kaXRpb24sIGVkaXRhYmxlQ29uZGl0aW9uIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgaGFzVmFsdWUsIHJlcXVpcmVkLCByZXF1aXJlZE9ubHlPbkFjdGl2ZSB9ID0gYmFzZTtcblx0XHRjb25zdCBoYXNDaGVja3MgPSBjdXN0b21DaGVja3MubGVuZ3RoID4gMCB8fCB2YWxpZGF0aW9ucy5sZW5ndGggPiAwO1xuXHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBldmFsdWF0aW9uRGF0YShiYXNlKTtcblx0XHRjb25zdCBpbml0aWFsID0gdGhpcy5pbml0YWw7XG5cdFx0dGhpcy5pbml0YWwgPSBmYWxzZTtcblxuXG5cdFx0Y29uc3QgY29uZGl0aW9uVmFsaWQgPSBjb25kaXRpb24gPyBhd2FpdCBFeHByZXNzaW9uUmVzb2x2ZXIucmVzb2x2ZShjb25kaXRpb24sIGRhdGEsIGZhbHNlKSA6IHRydWU7XG5cdFx0dXBkYXRlQ29uZGl0aW9uU3RhdGUoYmFzZSwgY29uZGl0aW9uVmFsaWQsIHRoaXMuaW5pdGFsKTtcblxuXHRcdGxldCB2YWxpZCA9IHJlcXVpcmVkID8gaGFzVmFsdWUgOiB0cnVlO1xuXHRcdGlmIChjb25kaXRpb25WYWxpZCkge1xuXHRcdFx0aWYgKHZhbGlkKVxuXHRcdFx0XHRmb3IgKGxldCBjaGVjayBvZiBjdXN0b21DaGVja3MpIHtcblx0XHRcdFx0XHRjb25zdCB0ZXN0ID0gYXdhaXQgY2hlY2soeyBkYXRhLCBiYXNlIH0pO1xuXHRcdFx0XHRcdGlmICghdGVzdCkgdmFsaWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRmb3IgKGxldCB2YWxpZGF0aW9uIG9mIHZhbGlkYXRpb25zKSB7XG5cdFx0XHRcdGlmICh2YWxpZCAmJiBoYXNWYWx1ZSkge1xuXHRcdFx0XHRcdGNvbnN0IHRlc3QgPSBhd2FpdCBFeHByZXNzaW9uUmVzb2x2ZXIucmVzb2x2ZSh2YWxpZGF0aW9uLmNvbmRpdGlvbiwgZGF0YSwgdHJ1ZSk7XG5cdFx0XHRcdFx0dmFsaWRhdGlvbi5hY3RpdmUgPSAhdGVzdDtcblx0XHRcdFx0XHRpZiAoIXRlc3QpIHZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZVxuXHRcdFx0XHRcdHZhbGlkYXRpb24uYWN0aXZlID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVkaXRhYmxlID0gdXBkYXRlUmVhZG9ubHkoeyBkYXRhLCB2YWxpZCwgYmFzZSwgY29uZGl0aW9uOiBlZGl0YWJsZUNvbmRpdGlvbiB9KTtcblx0XHRcdGlmKCFlZGl0YWJsZSlcblx0XHRcdFx0dmFsaWQgPSB0cnVlO1xuXHRcdFx0dXBkYXRlVmFsaWRTdGF0ZShiYXNlLCB2YWxpZCwgdGhpcy5pbml0YWwpO1xuXHRcdFx0XG5cdFx0fVxuXHRcdHJldHVybiB2YWxpZDtcblxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZhbGlkYXRvcjtcbiIsImltcG9ydCB7IE5PREVOQU1FUyB9IGZyb20gXCIuLi9Db25zdGFudHNcIjtcclxuaW1wb3J0IEZvcm1CdXR0b24gZnJvbSBcIi4uL0Zvcm1CdXR0b25cIjtcclxuaW1wb3J0IGRlZmluZUVsZW1lbnQgZnJvbSBcIi4uL3V0aWxzL0RlZmluZUVsZW1lbnRcIjtcclxuXHJcbmNvbnN0IEFUVFJJQlVURVMgPSBbXTtcclxuY2xhc3MgQmFja0J1dHRvbiBleHRlbmRzIEZvcm1CdXR0b24ge1xyXG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xyXG5cdFx0cmV0dXJuIEFUVFJJQlVURVM7XHJcblx0fVxyXG5cdFxyXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTk9ERU5BTUVTLkJhY2tCdXR0b247XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cclxuXHRleGVjdXRlKCkge1xyXG5cdFx0dGhpcy5mb3JtLnRvUHJldlBhZ2UoKTtcclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQmFja0J1dHRvbjtcclxuZGVmaW5lRWxlbWVudChCYWNrQnV0dG9uKTtcclxuIiwiaW1wb3J0IHsgTk9ERU5BTUVTIH0gZnJvbSBcIi4uL0NvbnN0YW50c1wiO1xyXG5pbXBvcnQgRm9ybUJ1dHRvbiBmcm9tIFwiLi4vRm9ybUJ1dHRvblwiO1xyXG5pbXBvcnQgZGVmaW5lRWxlbWVudCBmcm9tIFwiLi4vdXRpbHMvRGVmaW5lRWxlbWVudFwiO1xyXG5cclxuY29uc3QgQVRUUklCVVRFUyA9IFtdO1xyXG5jbGFzcyBOZXh0QnV0dG9uIGV4dGVuZHMgRm9ybUJ1dHRvbiB7XHJcblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XHJcblx0XHRyZXR1cm4gQVRUUklCVVRFUztcclxuXHR9XHJcblx0XHJcblx0c3RhdGljIGdldCBOT0RFTkFNRSgpIHtcclxuXHRcdHJldHVybiBOT0RFTkFNRVMuTmV4dEJ1dHRvbjtcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHR9XHJcblxyXG5cdGV4ZWN1dGUoKSB7XHJcblx0XHR0aGlzLmZvcm0udG9OZXh0UGFnZSgpO1xyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBOZXh0QnV0dG9uO1xyXG5kZWZpbmVFbGVtZW50KE5leHRCdXR0b24pO1xyXG4iLCJpbXBvcnQgeyBOT0RFTkFNRVMgfSBmcm9tIFwiLi4vQ29uc3RhbnRzXCI7XHJcbmltcG9ydCBGb3JtQnV0dG9uIGZyb20gXCIuLi9Gb3JtQnV0dG9uXCI7XHJcbmltcG9ydCBkZWZpbmVFbGVtZW50IGZyb20gXCIuLi91dGlscy9EZWZpbmVFbGVtZW50XCI7XHJcblxyXG5jb25zdCBBVFRSSUJVVEVTID0gW107XHJcbmNsYXNzIFN1Ym1pdEJ1dHRvbiBleHRlbmRzIEZvcm1CdXR0b24ge1xyXG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xyXG5cdFx0cmV0dXJuIEFUVFJJQlVURVM7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5PREVOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5PREVOQU1FUy5TdWJtaXRCdXR0b247XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cdGV4ZWN1dGUoKSB7XHJcblx0XHR0aGlzLmZvcm0uc3VibWl0KCk7XHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFN1Ym1pdEJ1dHRvbjtcclxuZGVmaW5lRWxlbWVudChTdWJtaXRCdXR0b24pO1xyXG4iLCJpbXBvcnQgeyBOT0RFTkFNRVMgfSBmcm9tIFwiLi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgRm9ybUJ1dHRvbiBmcm9tIFwiLi4vRm9ybUJ1dHRvblwiO1xuaW1wb3J0IGRlZmluZUVsZW1lbnQgZnJvbSBcIi4uL3V0aWxzL0RlZmluZUVsZW1lbnRcIjtcblxuY29uc3QgQVRUUklCVVRFUyA9IFtdO1xuY2xhc3MgU3VtbWFyeUJ1dHRvbiBleHRlbmRzIEZvcm1CdXR0b24ge1xuXHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRyZXR1cm4gQVRUUklCVVRFUztcblx0fVxuXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XG5cdFx0cmV0dXJuIE5PREVOQU1FUy5TdW1tYXJ5QnV0dG9uO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXHRleGVjdXRlKCkge1xuXHRcdHRoaXMuZm9ybS50b05leHRQYWdlKCk7XG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IFN1bW1hcnlCdXR0b247XG5kZWZpbmVFbGVtZW50KFN1bW1hcnlCdXR0b24pO1xuIiwiaW1wb3J0IEJhY2tCdXR0b24gZnJvbSBcIi4vQmFja0J1dHRvblwiO1xuaW1wb3J0IE5leHRCdXR0b24gZnJvbSBcIi4vTmV4dEJ1dHRvblwiO1xuaW1wb3J0IFN1bW1hcnlCdXR0b24gZnJvbSBcIi4vU3VtbWFyeUJ1dHRvblwiO1xuaW1wb3J0IFN1Ym1pdEJ1dHRvbiBmcm9tIFwiLi9TdWJtaXRCdXR0b25cIjtcblxuZXhwb3J0IHtcblx0QmFja0J1dHRvbixcblx0TmV4dEJ1dHRvbixcblx0U3VtbWFyeUJ1dHRvbixcblx0U3VibWl0QnV0dG9uLFxufTtcbiIsImltcG9ydCB7IE5PREVOQU1FUywgRVZFTlRTIH0gZnJvbSBcIi4uL0NvbnN0YW50c1wiO1xuaW1wb3J0IEZvcm1CdXR0b24gZnJvbSBcIi4uL0Zvcm1CdXR0b25cIjtcbmltcG9ydCBkZWZpbmVFbGVtZW50IGZyb20gXCIuLi91dGlscy9EZWZpbmVFbGVtZW50XCI7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSBbXTtcbmNsYXNzIEFkZFJvdyBleHRlbmRzIEZvcm1CdXR0b24ge1xuXHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRyZXR1cm4gQVRUUklCVVRFUy5jb25jYXQoQVRUUklCVVRFUyk7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IE5PREVOQU1FKCl7XG5cdFx0cmV0dXJuIE5PREVOQU1FUy5CdXR0b25BZGRSb3c7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRhd2FpdCBzdXBlci5pbml0KCk7XG5cdFx0dGhpcy5hY3RpdmUgPSB0cnVlO1xuXHR9XG5cblx0ZXhlY3V0ZSgpIHtcblx0XHR0aGlzLnRyaWdnZXIoMTAwLCBFVkVOVFMubGlzdFJvd0FkZCk7XG5cdH1cbn1cblxuZGVmaW5lRWxlbWVudChBZGRSb3cpO1xuZXhwb3J0IGRlZmF1bHQgQWRkUm93O1xuIiwiaW1wb3J0IHsgTk9ERU5BTUVTLCBFVkVOVFMgfSBmcm9tIFwiLi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgRm9ybUJ1dHRvbiBmcm9tIFwiLi4vRm9ybUJ1dHRvblwiO1xuaW1wb3J0IGRlZmluZUVsZW1lbnQgZnJvbSBcIi4uL3V0aWxzL0RlZmluZUVsZW1lbnRcIjtcblxuY29uc3QgQVRUUklCVVRFUyA9IFtdO1xuXG5jbGFzcyBEZWxldGVSb3cgZXh0ZW5kcyBGb3JtQnV0dG9uIHtcblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIEFUVFJJQlVURVMuY29uY2F0KEFUVFJJQlVURVMpO1xuXHR9XG5cblx0c3RhdGljIGdldCBOT0RFTkFNRSgpIHtcblx0XHRyZXR1cm4gTk9ERU5BTUVTLkJ1dHRvbkRlbGV0ZVJvdztcblx0fVxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRhc3luYyBpbml0KCl7XG5cdFx0YXdhaXQgc3VwZXIuaW5pdCgpO1xuXHRcdHRoaXMuYWN0aXZlXHQ9IHRydWU7XG5cdH1cblxuXHRleGVjdXRlKCkge1xuXHRcdHRoaXMudHJpZ2dlcigxMDAsIEVWRU5UUy5saXN0Um93RGVsZXRlKTtcblx0fVxufVxuXG5kZWZpbmVFbGVtZW50KERlbGV0ZVJvdyk7XG5leHBvcnQgZGVmYXVsdCBEZWxldGVSb3c7XG4iLCJpbXBvcnQgeyBOT0RFTkFNRVMsIEVWRU5UUyB9IGZyb20gXCIuLi9Db25zdGFudHNcIjtcbmltcG9ydCBDb250YWluZXIgZnJvbSBcIi4uL0NvbnRhaW5lclwiO1xuaW1wb3J0IERlbGV0ZVJvdyBmcm9tIFwiLi9EZWxldGVSb3dcIjtcblxuY29uc3QgQVRUUklCVVRFUyA9IFtdO1xuY2xhc3MgTGlzdFJvdyBleHRlbmRzIENvbnRhaW5lciB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTLmNvbmNhdChDb250YWluZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzKTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XG5cdFx0cmV0dXJuIE5PREVOQU1FUy5MaXN0Um93O1xuXHR9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0Z2V0IGFjdGl2ZSgpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRzZXQgYWN0aXZlKGFjdGl2ZSkge31cblxuXHRnZXQgY29uZGl0aW9uKCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKExpc3RSb3cuTk9ERU5BTUUsIExpc3RSb3cpO1xuZXhwb3J0IGRlZmF1bHQgTGlzdFJvdztcbiIsImltcG9ydCB7IE5PREVOQU1FUywgRVZFTlRTIH0gZnJvbSBcIi4uL0NvbnN0YW50c1wiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvQ29tcG9uZW50XCI7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSBbXTtcbmNsYXNzIExpc3RSb3dzIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIEFUVFJJQlVURVMuY29uY2F0KEFUVFJJQlVURVMpO1xuXHR9XG5cblx0c3RhdGljIGdldCBOT0RFTkFNRSgpIHtcblx0XHRyZXR1cm4gTk9ERU5BTUVTLkxpc3RSb3dzO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoTGlzdFJvd3MuTk9ERU5BTUUsIExpc3RSb3dzKTtcbmV4cG9ydCBkZWZhdWx0IExpc3RSb3dzO1xuIiwiaW1wb3J0IE9iamVjdFV0aWxzIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9PYmplY3RVdGlsc1wiO1xuaW1wb3J0IHsgU1BFQ0lBTFZBUlMsIE5PREVOQU1FUyB9IGZyb20gXCIuLi9Db25zdGFudHNcIlxuXG5leHBvcnQgY29uc3QgZXZhbHVhdGlvbkRhdGEgPSBhc3luYyAoYmFzZSkgPT4ge1xuXHRjb25zdCBkYXRhID0ge307XG5cdGRhdGFbU1BFQ0lBTFZBUlMuQ1VSUkVOVFZBTFVFXSA9IGF3YWl0IGJhc2UudmFsdWUoKTtcblxuXHRsZXQgcm93ID0gYmFzZS5wYXJlbnQoTk9ERU5BTUVTLkxpc3RSb3cpO1xuXHRsZXQgdGVtcCA9IGRhdGE7XG5cdHdoaWxlIChyb3cpIHtcblx0XHR0ZW1wW1NQRUNJQUxWQVJTLkNVUlJFTlRMSVNUUk9XXSA9IGF3YWl0IHJvdy52YWx1ZSgpO1xuXHRcdHRlbXAgPSB0ZW1wW1NQRUNJQUxWQVJTLkNVUlJFTlRMSVNUUk9XXTtcblx0XHRyb3cgPSByb3cucGFyZW50KE5PREVOQU1FUy5MaXN0Um93KTtcblx0fVxuXG5cdHJldHVybiBPYmplY3RVdGlscy5tZXJnZSggZGF0YSwgYXdhaXQgYmFzZS5mb3JtLmRhdGEoKSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgKE5vZGUpID0+IHtcclxuICAgIGlmKCF3aW5kb3cuY3VzdG9tRWxlbWVudHMuZ2V0KE5vZGUuTk9ERU5BTUUpKVxyXG4gICAgICAgIHdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoTm9kZS5OT0RFTkFNRSwgTm9kZSk7XHJcbn0iLCJpbXBvcnQge0VWRU5USEFORExFX1RJTUVPVVR9IGZyb20gXCIuLi9Db25zdGFudHNcIlxuXG5leHBvcnQgY29uc3QgdG9FdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcmd1bWVudHMpLmpvaW4oXCIgXCIpO1xufTtcblxuZXhwb3J0IGNvbnN0IG1ha2VFdmVudENvcHkgPSAoZXZlbnQpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBldmVudC50eXBlLFxuICAgICAgICB0YXJnZXQ6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgZGV0YWlsOiBldmVudC5kZXRhaWwsXG4gICAgICAgIGN1cnJlbnRUYXJnZXQ6IGV2ZW50LmN1cnJlbnRUYXJnZXQsXG4gICAgICAgIGV4cGxpY2l0T3JpZ2luYWxUYXJnZXQ6IGV2ZW50LmV4cGxpY2l0T3JpZ2luYWxUYXJnZXQsXG4gICAgICAgIG9yaWdpbmFsVGFyZ2V0IDogZXZlbnQub3JpZ2luYWxUYXJnZXQsXG4gICAgICAgIHNyY0VsZW1lbnQ6IGV2ZW50LnNyY0VsZW1lbnQsXG4gICAgICAgIHRpbWVTdGFtcDogZXZlbnQudGltZVN0YW1wXG4gICAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IHRvVGltZW91dEhhbmRsZSA9IChoYW5kbGUsIHByZXZlbnREZWZhdWx0LCBzdG9wUHJvcGFnYXRpb24sIHRpbWVvdXQpID0+IHtcbiAgICBsZXQgaWQgPSBudWxsO1xuXG4gICAgY29uc3QgcHJldmVudCA9IHR5cGVvZiBwcmV2ZW50RGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiID8gcHJldmVudERlZmF1bHQgOiAoKSA9PiBwcmV2ZW50RGVmYXVsdDtcbiAgICBjb25zdCBzdG9wID0gdHlwZW9mIHN0b3BQcm9wYWdhdGlvbiA9PT0gXCJmdW5jdGlvblwiID8gc3RvcFByb3BhZ2F0aW9uIDogKCkgPT4gc3RvcFByb3BhZ2F0aW9uO1xuXG4gICAgcmV0dXJuIChldmVudCkgPT4ge1xuICAgICAgICBpZihwcmV2ZW50KGV2ZW50KSlcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmKHN0b3AoZXZlbnQpKVxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgY29uc3QgZXZlbnRDb3B5ID0gbWFrZUV2ZW50Q29weShldmVudCk7XG5cbiAgICAgICAgaWYoaWQpXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlkID0gbnVsbDtcbiAgICAgICAgICAgIGhhbmRsZShldmVudENvcHkpO1xuICAgICAgICB9LCB0aW1lb3V0IHx8IEVWRU5USEFORExFX1RJTUVPVVQpO1xuXG4gICAgfVxufTsiLCJpbXBvcnQgQmFzZUZpZWxkIGZyb20gXCIuLi9CYXNlRmllbGRcIjtcbmltcG9ydCBWYWxpZGF0aW9uIGZyb20gXCIuLi9WYWxpZGF0aW9uXCI7XG5cbmV4cG9ydCBjb25zdCB0cmVlRmlsdGVyID0gKHsgcm9vdCwgZmlsdGVyIH0pID0+IHtcblx0bGV0IGVsZW1lbnRzID0gW107XG5cdHJvb3QuY2hpbGRyZW4uZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXHRcdGNvbnN0IHsgYWNjZXB0LCBzdG9wID0gZmFsc2UgfSA9IGZpbHRlcihlbGVtZW50KTtcblxuXHRcdGlmIChhY2NlcHQpIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG5cblx0XHRpZiAoIXN0b3ApIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IHRyZWVGaWx0ZXIoeyByb290OiBlbGVtZW50LCBmaWx0ZXIgfSk7XG5cdFx0XHRpZiAocmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KHJlc3VsdCk7XG5cdFx0XHRlbHNlIGlmIChyZXN1bHQpIGVsZW1lbnRzLnB1c2gocmVzdWx0KTtcblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBlbGVtZW50cztcbn07XG5cbmV4cG9ydCBjb25zdCBmaW5kRmllbGRzID0gKHJvb3QpID0+IHtcblx0cmV0dXJuIHRyZWVGaWx0ZXIoe1xuXHRcdHJvb3QsXG5cdFx0ZmlsdGVyOiAoZWxlbWVudCkgPT4ge1xuXHRcdFx0aWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBCYXNlRmllbGQpIHJldHVybiB7IGFjY2VwdDogdHJ1ZSwgc3RvcDogdHJ1ZSB9O1xuXHRcdFx0cmV0dXJuIHsgYWNjZXB0OiBmYWxzZSB9O1xuXHRcdH0sXG5cdH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGZpbmRWYWxpZGF0aW9ucyA9IChyb290KSA9PiB7XG5cdHJldHVybiB0cmVlRmlsdGVyKHtcblx0XHRyb290LFxuXHRcdGZpbHRlcjogKGVsZW1lbnQpID0+IHtcblx0XHRcdGlmIChyb290ICE9IGVsZW1lbnQpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBCYXNlRmllbGQpIHJldHVybiB7IGFjY2VwdDogZmFsc2UsIHN0b3A6IHRydWUgfTtcblx0XHRcdFx0ZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFZhbGlkYXRpb24pIHJldHVybiB7IGFjY2VwdDogdHJ1ZSwgc3RvcDogdHJ1ZSB9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHsgYWNjZXB0OiBmYWxzZSB9O1xuXHRcdH0sXG5cdH0pO1xufTtcbiIsImltcG9ydCB7IEVWRU5UUywgVFJJR0dFUl9USU1FT1VULCBBVFRSSUJVVEVfQUNUSVZFLCBBVFRSSUJVVEVfVkFMSUQsIEFUVFJJQlVURV9JTlZBTElELCBBVFRSSUJVVEVfQ09ORElUSU9OX1ZBTElELCBBVFRSSUJVVEVfQ09ORElUSU9OX0lOVkFMSUQsIEFUVFJJQlVURV9FRElUQUJMRSwgQVRUUklCVVRFX1JFQURPTkxZIH0gZnJvbSBcIi4uL0NvbnN0YW50c1wiO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlVmFsaWRTdGF0ZSA9ICh0YXJnZXQsIHZhbGlkLCBpbml0aWFsID0gZmFsc2UpID0+IHtcblx0Y29uc3Qgb2xkU3RhdGUgPSB0YXJnZXQudmFsaWQ7XG5cdGlmICh0eXBlb2YgdmFsaWQgPT09IFwidW5kZWZpbmVkXCIgfHwgdmFsaWQgPT0gbnVsbCkge1xuXHRcdHRhcmdldC5hdHRyKEFUVFJJQlVURV9JTlZBTElELCBudWxsKTtcblx0XHR0YXJnZXQuYXR0cihBVFRSSUJVVEVfVkFMSUQsIG51bGwpO1xuXHR9IGVsc2UgaWYgKHZhbGlkKSB7XG5cdFx0dGFyZ2V0LmF0dHIoQVRUUklCVVRFX0lOVkFMSUQsIG51bGwpO1xuXHRcdHRhcmdldC5hdHRyKEFUVFJJQlVURV9WQUxJRCwgXCJcIik7XG5cdH0gZWxzZSB7XG5cdFx0dGFyZ2V0LmF0dHIoQVRUUklCVVRFX0lOVkFMSUQsIFwiXCIpO1xuXHRcdHRhcmdldC5hdHRyKEFUVFJJQlVURV9WQUxJRCwgbnVsbCk7XG5cdH1cblxuXHRpZiAob2xkU3RhdGUgIT0gdmFsaWQgfHwgaW5pdGlhbCl7IFxuXHRcdHRhcmdldC50cmlnZ2VyKEVWRU5UUy52YWxpZFN0YXRlQ2hhbmdlZCk7XG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVDb25kaXRpb25TdGF0ZSA9ICh0YXJnZXQsIHZhbGlkLCBpbml0aWFsID0gZmFsc2UpID0+IHtcblx0XG5cdGNvbnN0IG9sZFN0YXRlID0gdGFyZ2V0LmNvbmRpdGlvbjtcblx0aWYgKHZhbGlkKSB7XG5cdFx0dGFyZ2V0LmF0dHIoQVRUUklCVVRFX0NPTkRJVElPTl9JTlZBTElELCBudWxsKTtcblx0XHR0YXJnZXQuYXR0cihBVFRSSUJVVEVfQ09ORElUSU9OX1ZBTElELCBcIlwiKTtcblx0fSBlbHNlIHtcblx0XHR0YXJnZXQuYXR0cihBVFRSSUJVVEVfQ09ORElUSU9OX1ZBTElELCBudWxsKTtcblx0XHR0YXJnZXQuYXR0cihBVFRSSUJVVEVfQ09ORElUSU9OX0lOVkFMSUQsIFwiXCIpO1xuXHR9XG5cdGlmIChvbGRTdGF0ZSAhPSB2YWxpZCB8fCBpbml0aWFsKSB7XHRcdFxuXHRcdHRhcmdldC50cmlnZ2VyKEVWRU5UUy5jb25kaXRpb25TdGF0ZUNoYW5nZWQpO1xuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlQWN0aXZlU3RhdGUgPSAodGFyZ2V0LCBhY3RpdmUsIGluaXRpYWwgPSBmYWxzZSkgPT4ge1xuXHRjb25zdCBvbGRTdGF0ZSA9IHRhcmdldC5hY3RpdmU7XG5cdGFjdGl2ZSA/IHRhcmdldC5hdHRyKEFUVFJJQlVURV9BQ1RJVkUsIFwiXCIpIDogdGFyZ2V0LmF0dHIoQVRUUklCVVRFX0FDVElWRSwgbnVsbCk7XG5cdGlmIChvbGRTdGF0ZSAhPSBhY3RpdmUgfHwgaW5pdGlhbCkgdGFyZ2V0LnRyaWdnZXIoRVZFTlRTLmFjdGl2ZVN0YXRlQ2hhbmdlZCk7XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlRWRpdGFibGVTdGF0ZSA9ICh0YXJnZXQsIGVkaXRhYmxlLCBpbml0aWFsID0gZmFsc2UpID0+IHtcblx0Y29uc3Qgb2xkU3RhdGUgPSB0YXJnZXQuZWRpdGFibGU7XG5cdGlmIChlZGl0YWJsZSkge1xuXHRcdHRhcmdldC5hdHRyKEFUVFJJQlVURV9FRElUQUJMRSwgXCJcIik7XG5cdFx0dGFyZ2V0LmF0dHIoQVRUUklCVVRFX1JFQURPTkxZLCBudWxsKTtcblx0fSBlbHNlIHtcblx0XHR0YXJnZXQuYXR0cihBVFRSSUJVVEVfRURJVEFCTEUsIG51bGwpO1xuXHRcdHRhcmdldC5hdHRyKEFUVFJJQlVURV9SRUFET05MWSwgXCJcIik7XG5cdH1cblx0aWYgKG9sZFN0YXRlICE9IGVkaXRhYmxlIHx8IGluaXRpYWwpIHRhcmdldC50cmlnZ2VyKEVWRU5UUy5lZGl0YWJsZVN0YXRlQ2hhbmdlZCk7XG59OyIsImltcG9ydCB7IEVWRU5UUywgRVZFTlRIQU5ETEVfSU5QVVRfVElNRU9VVCB9IGZyb20gXCIuLi9Db25zdGFudHNcIjtcbmltcG9ydCB7IHRvVGltZW91dEhhbmRsZSB9IGZyb20gXCIuLi91dGlscy9FdmVudEhlbHBlclwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5jb25zdCBJTlBVVFNFTEVDVE9SID0gJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlY2tib3ggZXh0ZW5kcyBXcmFwcGVyIHtcblx0c3RhdGljIGZpbmRJbnB1dChmaWVsZCkge1xuXHRcdGNvbnN0IGlucHV0ID0gZmllbGQuZmluZChJTlBVVFNFTEVDVE9SKTtcblx0XHRpZiAoaW5wdXQubGVuZ3RoID09IDApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFxuXHRcdHJldHVybiBpbnB1dC5sZW5ndGggPT0gMSA/IGlucHV0LmZpcnN0KCkgOiBpbnB1dDtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKGZpZWxkLCBpbnB1dCkge1xuXHRcdHN1cGVyKGZpZWxkLCBpbnB1dCk7XG5cdH1cblxuXHRpbml0KCkge1xuXHRcdGNvbnN0IHsgZmllbGQsIGlucHV0IH0gPSB0aGlzO1xuXHRcdHRoaXMubXVsdGlwbGUgPSBpbnB1dCBpbnN0YW5jZW9mIE5vZGVMaXN0O1xuXHRcdGlucHV0Lm9uKFxuXHRcdFx0XCJpbnB1dFwiLFxuXHRcdFx0dG9UaW1lb3V0SGFuZGxlKFxuXHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0ZmllbGQudHJpZ2dlcihFVkVOVFMuaW5wdXQsIHRoaXMubm9ybWFsaXplVmFsdWUodGhpcy52YWx1ZSkpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0RVZFTlRIQU5ETEVfSU5QVVRfVElNRU9VVFxuXHRcdFx0KVxuXHRcdCk7XG5cblx0XHRmaWVsZC50cmlnZ2VyKEVWRU5UUy5pbnB1dCwgdGhpcy5ub3JtYWxpemVWYWx1ZSh0aGlzLnZhbHVlKSk7XG5cdH1cblxuXHRzZXQgcmVhZG9ubHkocmVhZG9ubHkpIHtcblx0XHR0aGlzLmlucHV0LmF0dHIoXCJkaXNhYmxlZFwiLCByZWFkb25seSA/IFwiXCIgOiBudWxsKTtcblx0fVxuXG5cdGdldCB2YWx1ZSgpIHtcblx0XHRjb25zdCB2YWx1ZSA9IHRoaXMuaW5wdXQudmFsKCk7XG5cdFx0aWYgKCEodmFsdWUgaW5zdGFuY2VvZiBNYXApKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYgKHZhbHVlLnNpemUgPT0gMCkgcmV0dXJuIG51bGw7XG5cblx0XHRjb25zdCB2YWx1ZXMgPSBbXTtcblx0XHR2YWx1ZS5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuXHRcdFx0dmFsdWVzLnB1c2godmFsdWUpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHZhbHVlcztcblx0fVxuXG5cdG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5tdWx0aXBsZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmZpbHRlcigoaXRlbSkgPT4gISFpdGVtKTtcblx0XHRcdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCAhPSAwID8gdmFsdWUgOiBudWxsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0YWNjZXB0VmFsdWUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgPT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRlbHNlIGlmICh0aGlzLm11bHRpcGxlKVxuXHRcdFx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXk7XG5cdFx0ZWxzZXtcblx0XHRcdGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHlwZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlID09PSBcImJvb2xlYW5cIjtcblx0XHR9XG5cdH1cblxuXHR1cGRhdGVkVmFsdWUodmFsdWUpIHtcblx0XHRpZiAodGhpcy5maWVsZC52YWx1ZSAhPSB0aGlzLnZhbHVlKVxuXHRcdFx0dGhpcy5pbnB1dC52YWwodmFsdWUgPyB2YWx1ZSA6IG51bGwpO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBFVkVOVFMgfSBmcm9tIFwiLi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyB0b1RpbWVvdXRIYW5kbGUgfSBmcm9tIFwiLi4vdXRpbHMvRXZlbnRIZWxwZXJcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcblxuY29uc3QgSU5QVVRTRUxFQ1RPUiA9ICdpbnB1dFt0eXBlPVwiZmlsZVwiXSc7XG5cbmNvbnN0IHJlYWRGaWxlID0gKGZpbGUsIHJlYWRGbk5hbWUpID0+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdHJlYWRlci5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVuZFwiLCAoKSA9PiB7XG5cdFx0XHRyZXNvbHZlKHtcblx0XHRcdFx0bmFtZTogZmlsZS5uYW1lLFxuXHRcdFx0XHR0eXBlOiBmaWxlLnR5cGUsXG5cdFx0XHRcdHNpemU6IGZpbGUuc2l6ZSxcblx0XHRcdFx0ZGF0YTogcmVhZGVyLnJlc3VsdFxuXHRcdFx0fSk7XG5cdFx0fSwgZmFsc2UpO1xuXHRcdHJlYWRlcltyZWFkRm5OYW1lXShmaWxlKTtcblx0fSk7XG59O1xuXG4vL3JlYWRBc0RhdGFVUkxcblxuY29uc3QgRk9STUFUID0ge1xuXHRcImZvcm0taW5wdXRcIjogYXN5bmMgKGZpbGUpID0+IHtcblx0XHRmaWxlLmZvcm1hdCA9IFwiZm9ybS1pbnB1dFwiO1xuXHRcdHJldHVybiBmaWxlO1xuXHR9LFxuXHRcImRhdGEtdXJsLWJhc2U2NFwiOiBhc3luYyAoZmlsZSkgPT4ge1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlYWRGaWxlKGZpbGUsIFwicmVhZEFzRGF0YVVSTFwiKTtcblx0XHRyZXN1bHQuZm9ybWF0ID0gXCJkYXRhLXVybC1iYXNlNjRcIjtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXHRcImJhc2U2NFwiOiBhc3luYyAoZmlsZSkgPT4ge1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlYWRGaWxlKGZpbGUsIFwicmVhZEFzRGF0YVVSTFwiKTtcblx0XHRyZXN1bHQuZGF0YSA9IHJlc3VsdC5kYXRhLnN1YnN0cihyZXN1bHQuZGF0YS5pbmRleE9mKFwiLFwiKSArIDEpO1xuXHRcdHJlc3VsdC5mb3JtYXQgPSBcImJhc2U2NFwiO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn07XG5cbmNvbnN0IHJlYWRGaWxlcyA9IGFzeW5jIChmaWxlcywgZm9ybWF0LCBtdWx0aXBsZSkgPT4ge1xuXHRsZXQgcmVzdWx0ID0gW107XG5cdGZvciAobGV0IGZpbGUgb2YgZmlsZXMpXG5cdFx0cmVzdWx0LnB1c2goYXdhaXQgRk9STUFUW2Zvcm1hdF0oZmlsZSkpO1xuXG5cdGlmIChyZXN1bHQubGVuZ3RoID09IDApXG5cdFx0cmV0dXJuIG51bGw7XG5cblxuXHRyZXR1cm4gbXVsdGlwbGUgPyByZXN1bHQgOiByZXN1bHRbMF07XG59O1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZSBleHRlbmRzIFdyYXBwZXIge1xuXHRzdGF0aWMgZmluZElucHV0KGZpZWxkKSB7XG5cdFx0cmV0dXJuIGZpZWxkLmZpbmQoSU5QVVRTRUxFQ1RPUikuZmlyc3QoKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKGZpZWxkLCBpbnB1dCkge1xuXHRcdHN1cGVyKGZpZWxkLCBpbnB1dCk7XG5cdH1cblxuXHRhc3luYyBpbml0KCkge1xuXHRcdGNvbnN0IHsgZmllbGQsIGlucHV0IH0gPSB0aGlzO1xuXHRcdHRoaXMubXVsdGlwbGUgPSBpbnB1dC5tdWx0aXBsZTtcblx0XHR0aGlzLmZvcm1hdCA9IGZpZWxkLmF0dHIoXCJmaWxlLWZvcm1hdFwiKSB8fCBcImZvcm0taW5wdXRcIjtcblx0XHR0aGlzLmZpbGVuYW1lVGFyZ2V0ID0gZmllbGQuYXR0cihcImZpbGUtbmFtZS10YXJnZXRcIik7XG5cdFx0dGhpcy5maWxlbmFtZVRhcmdldCA9IHRoaXMuZmlsZW5hbWVUYXJnZXQgPyBmaWVsZC5maW5kKHRoaXMuZmlsZW5hbWVUYXJnZXQpLmZpcnN0KCkgOiBudWxsO1xuXHRcdGNvbnN0IHsgZm9ybWF0LCBtdWx0aXBsZSB9ID0gdGhpcztcblxuXHRcdGlucHV0Lm9uKFxuXHRcdFx0XCJpbnB1dFwiLFxuXHRcdFx0dG9UaW1lb3V0SGFuZGxlKFxuXHRcdFx0XHRhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVkVmFsdWUoYXdhaXQgcmVhZEZpbGVzKGlucHV0LmZpbGVzLCBmb3JtYXQsIG11bHRpcGxlKSk7XG5cdFx0XHRcdFx0ZmllbGQudHJpZ2dlcihFVkVOVFMuaW5wdXQsIHRoaXMudmFsdWUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0dHJ1ZVxuXHRcdFx0KVxuXHRcdCk7XG5cblx0XHRpZiAoaW5wdXQuZmlsZXMgJiYgaW5wdXQuZmlsZXMubGVuZ3RoICE9IDApXG5cdFx0XHR0aGlzLnVwZGF0ZWRWYWx1ZShhd2FpdCByZWFkRmlsZXMoaW5wdXQuZmlsZXMsIGZvcm1hdCwgbXVsdGlwbGUpKTtcblxuXHRcdGZpZWxkLnRyaWdnZXIoRVZFTlRTLmlucHV0LCB0aGlzLnZhbHVlKTtcblx0fTtcblxuXHRzZXQgcmVhZG9ubHkocmVhZG9ubHkpIHtcblx0XHR0aGlzLmlucHV0LmF0dHIoXCJkaXNhYmxlZFwiLCByZWFkb25seSA/IFwiXCIgOiBudWxsKTtcblx0fVxuXG5cblxuXHRhY2NlcHRWYWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA9PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIilcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGVsc2UgaWYgKHRoaXMubXVsdGlwbGUpXG5cdFx0XHRyZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBcnJheTtcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBcIm9iamVjdFwiO1xuXHR9XG5cblx0bm9ybWFsaXplVmFsdWUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgPT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRlbHNlIGlmICh0aGlzLm11bHRpcGxlKVxuXHRcdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCAhPSAwID8gdmFsdWUgOiBudWxsO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHR9XG5cblx0dXBkYXRlZFZhbHVlKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9IHRoaXMuX192YWx1ZV9fKSB7XG5cdFx0XHR0aGlzLl9fdmFsdWVfXyA9IHZhbHVlO1xuXG5cdFx0XHRpZiAodGhpcy5maWxlbmFtZVRhcmdldCAmJiB2YWx1ZSkge1xuXHRcdFx0XHRpZiAodGhpcy5tdWx0aXBsZSkge1xuXHRcdFx0XHRcdGZvciAobGV0IGZpbGUgb2YgdmFsdWUpIHtcblx0XHRcdFx0XHRcdHRoaXMuZmlsZW5hbWVUYXJnZXQuYXBwZW5kKGA8c3Bhbj4ke2ZpbGUubmFtZX08L3NwYW4+YCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuZmlsZW5hbWVUYXJnZXQuYXBwZW5kKGA8c3Bhbj4ke3ZhbHVlLm5hbWV9PC9zcGFuPmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9XG5cdH1cblxuXHRzZXQgcmVhZG9ubHkocmVhZG9ubHkpIHtcblx0XHR0aGlzLmlucHV0LmF0dHIoXCJkaXNhYmxlZFwiLCByZWFkb25seSA/IFwiXCIgOiBudWxsKTtcblx0fVxuXG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fX3ZhbHVlX187XG5cdH1cblxuXHRnZXQgdmFsaWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaW5wdXQuY2hlY2tWYWxpZGl0eSgpO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBFVkVOVFMsIEVWRU5USEFORExFX0lOUFVUX1RJTUVPVVQgfSBmcm9tIFwiLi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyB0b1RpbWVvdXRIYW5kbGUgfSBmcm9tIFwiLi4vdXRpbHMvRXZlbnRIZWxwZXJcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcblxuY29uc3QgSU5QVVRTRUxFQ1RPUiA9ICdpbnB1dFt0eXBlPVwicmFkaW9cIl0nO1xuXG5jb25zdCBnZXRSYW5kb21JbnQgPSAoKSA9PiB7XG5cdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBEYXRlLm5vdygpKTtcbn07XG5cbmNvbnN0IGluaXQgPSAod3JhcHBlcikgPT4ge1xuXHRjb25zdCB7IGZpZWxkIH0gPSB3cmFwcGVyO1xuXHRjb25zdCBuYW1lID0gZmllbGQubmFtZSArIGdldFJhbmRvbUludCgpO1xuXHRjb25zdCBpbnB1dCA9ICh3cmFwcGVyLmlucHV0ID0gZmllbGQuZmluZChJTlBVVFNFTEVDVE9SKSk7XG5cdGZvciAobGV0IHJhZGlvIG9mIGlucHV0KSByYWRpby5uYW1lID0gbmFtZTtcblx0aW5wdXQub24oXG5cdFx0XCJjaGFuZ2VcIixcblx0XHR0b1RpbWVvdXRIYW5kbGUoXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdGZpZWxkLnRyaWdnZXIoRVZFTlRTLmNoYW5nZVZhbHVlKTtcblx0XHRcdH1cblx0XHQpXG5cdCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYWRpbyBleHRlbmRzIFdyYXBwZXIge1xuXHRzdGF0aWMgZmluZElucHV0KGZpZWxkKSB7XG5cdFx0Y29uc3QgaW5wdXQgPSBmaWVsZC5maW5kKElOUFVUU0VMRUNUT1IpO1xuXHRcdGlmIChpbnB1dC5sZW5ndGggPT0gMClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0cmV0dXJuIGlucHV0O1xuXHR9XG5cblx0Y29uc3RydWN0b3IoZmllbGQsIGlucHV0KSB7XG5cdFx0c3VwZXIoZmllbGQsIGlucHV0KTtcblx0fVxuXG5cdGluaXQoKSB7XG5cdFx0Y29uc3QgeyBmaWVsZCwgaW5wdXQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgbmFtZSA9IGZpZWxkLm5hbWUgKyBnZXRSYW5kb21JbnQoKTtcblx0XHRmb3IgKGxldCByYWRpbyBvZiBpbnB1dCkgcmFkaW8ubmFtZSA9IG5hbWU7XG5cdFx0aW5wdXQub24oXG5cdFx0XHRcImlucHV0XCIsXG5cdFx0XHR0b1RpbWVvdXRIYW5kbGUoXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRmaWVsZC50cmlnZ2VyKEVWRU5UUy5pbnB1dCwgdGhpcy5ub3JtYWxpemVWYWx1ZSh0aGlzLnZhbHVlKSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRFVkVOVEhBTkRMRV9JTlBVVF9USU1FT1VUXG5cdFx0XHQpXG5cdFx0KTtcblxuXHRcdGZpZWxkLnRyaWdnZXIoRVZFTlRTLmlucHV0LCB0aGlzLm5vcm1hbGl6ZVZhbHVlKHRoaXMudmFsdWUpKTtcblx0fVxuXG5cblx0c2V0IHJlYWRvbmx5KHJlYWRvbmx5KSB7XG5cdFx0dGhpcy5pbnB1dC5hdHRyKFwiZGlzYWJsZWRcIiwgcmVhZG9ubHkgPyBcIlwiIDogbnVsbCk7XG5cdH1cblxuXHRnZXQgdmFsdWUoKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLmlucHV0LnZhbCgpO1xuXHRcdGlmICghKHZhbHVlIGluc3RhbmNlb2YgTWFwKSkgcmV0dXJuIHZhbHVlO1xuXHRcdGlmICh2YWx1ZS5zaXplID09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiB2YWx1ZS52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG5cdH1cblxuXHRub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSlcblx0XHRcdHJldHVybiB2YWx1ZTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0YWNjZXB0VmFsdWUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgPT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRlbHNle1xuXHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcblx0XHRcdHJldHVybiB0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwiYm9vbGVhblwiO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZWRWYWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh0aGlzLmZpZWxkLnZhbHVlICE9IHRoaXMudmFsdWUpXG5cdFx0XHR0aGlzLmlucHV0LnZhbCh2YWx1ZSA/IHZhbHVlIDogbnVsbCk7XG5cdH1cbn1cbiIsImltcG9ydCB7IEVWRU5UUywgRVZFTlRIQU5ETEVfSU5QVVRfVElNRU9VVCB9IGZyb20gXCIuLi9Db25zdGFudHNcIjtcbmltcG9ydCB7IHRvVGltZW91dEhhbmRsZSB9IGZyb20gXCIuLi91dGlscy9FdmVudEhlbHBlclwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5jb25zdCBJTlBVVFNFTEVDVE9SID0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQgZXh0ZW5kcyBXcmFwcGVyIHtcblx0c3RhdGljIGZpbmRJbnB1dChmaWVsZCkge1xuXHRcdHJldHVybiBmaWVsZC5maW5kKElOUFVUU0VMRUNUT1IpLmZpcnN0KCk7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihmaWVsZCwgaW5wdXQpIHtcblx0XHRzdXBlcihmaWVsZCwgaW5wdXQpO1xuXHR9XG5cblx0aW5pdCgpIHtcblx0XHRjb25zdCB7IGZpZWxkLCBpbnB1dCB9ID0gdGhpcztcblx0XHRpbnB1dC5vbihcblx0XHRcdFwiaW5wdXQsIGNoYW5nZWRcIixcblx0XHRcdHRvVGltZW91dEhhbmRsZShcblx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdGZpZWxkLnRyaWdnZXIoRVZFTlRTLmlucHV0LCB0aGlzLnZhbHVlKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdHRydWUsXG5cdFx0XHRcdEVWRU5USEFORExFX0lOUFVUX1RJTUVPVVRcblx0XHRcdClcblx0XHQpO1xuXG5cdFx0ZmllbGQudHJpZ2dlcihFVkVOVFMuaW5wdXQsIHRoaXMudmFsdWUpO1xuXHR9XG5cblx0c2V0IHJlYWRvbmx5KHJlYWRvbmx5KSB7XG5cdFx0dGhpcy5pbnB1dC5hdHRyKFwiZGlzYWJsZWRcIiwgcmVhZG9ubHkgPyBcIlwiIDogbnVsbCk7XG5cdH1cblxuXHRnZXQgdmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplVmFsdWUodGhpcy5pbnB1dC5tdWx0aXBsZSA/IHRoaXMuaW5wdXQudmFsKCkgOiB0aGlzLmlucHV0LnZhbHVlKTtcblx0fVxuXHRcblx0bm9ybWFsaXplVmFsdWUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGlmKHRoaXMuaW5wdXQubXVsdGlwbGUpe1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAmJiBpdGVtLnRyaW0oKS5sZW5ndGggPiAwKTtcblx0XHRcdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCAhPSAwID8gdmFsdWUgOiBudWxsO1xuXHRcdFx0fSBlbHNle1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcblx0XHRcdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCAhPSAwID8gdmFsdWUgOiBudWxsO1x0XG5cdFx0XHR9XHRcdFx0XHRcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRhY2NlcHRWYWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA9PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIilcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGVsc2UgaWYgKHRoaXMuaW5wdXQubXVsdGlwbGUpXG5cdFx0XHRyZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBcnJheTtcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiO1xuXHR9XG5cblx0dXBkYXRlZFZhbHVlKHZhbHVlKSB7XG5cdFx0aWYgKHRoaXMuZmllbGQudmFsdWUgIT0gdGhpcy52YWx1ZSlcblx0XHRcdHRoaXMuaW5wdXQudmFsKHZhbHVlID8gdmFsdWUgOiBudWxsKTtcblx0fVxufVxuIiwiaW1wb3J0IHsgRVZFTlRTLCBFVkVOVEhBTkRMRV9JTlBVVF9USU1FT1VUIH0gZnJvbSBcIi4uL0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgbm9WYWx1ZSB9IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9WYWx1ZUhlbHBlclwiO1xuaW1wb3J0IHsgdG9UaW1lb3V0SGFuZGxlIH0gZnJvbSBcIi4uL3V0aWxzL0V2ZW50SGVscGVyXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5cbmNvbnN0IElOUFVUU0VMRUNUT1IgPSAnaW5wdXQ6bm90KFt0eXBlPVwiZmlsZVwiXSk6bm90KFt0eXBlPVwicmFkaW9cIl0pOm5vdChbdHlwZT1cImNoZWNrYm94XCJdKSAsaW5wdXQ6bm90KFt0eXBlXSksIHRleHRhcmVhJztcblxuY29uc3QgREVGQVVMVFRZUEUgPSBcInRleHRcIjtcblxuY29uc3QgdGV4dCA9IHtcblx0YWNjZXB0OiAodmFsdWUpID0+IHtcblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiO1xuXHR9LFxuXHR2YWx1ZTogKGlucHV0KSA9PiB7XG5cdFx0cmV0dXJuIGlucHV0LnZhbHVlO1xuXHR9LFxuXHRub3JtYWxpemU6ICh2YWx1ZSkgPT4ge1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dmFsdWUgPSB2YWx1ZS50cmltKCk7XG5cdFx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID4gMCA/IHZhbHVlIDogbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fSxcbn07XG5jb25zdCBudW1iZXIgPSB7XG5cdGFjY2VwdDogKHZhbHVlKSA9PiB7XG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIjtcblx0fSxcblx0dmFsdWU6IChpbnB1dCkgPT4ge1xuXHRcdHJldHVybiBpbnB1dC52YWx1ZUFzTnVtYmVyO1xuXHR9LFxuXHRub3JtYWxpemU6ICh2YWx1ZSkgPT4ge1xuXHRcdGlmICghbm9WYWx1ZSh2YWx1ZSkgJiYgIU51bWJlci5pc05hTih2YWx1ZSkpIHJldHVybiB2YWx1ZTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9LFxufTtcbmNvbnN0IGRhdGUgPSB7XG5cdGFjY2VwdDogKHZhbHVlKSA9PiB7XG5cdFx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcblx0fSxcblx0dmFsdWU6IChpbnB1dCkgPT4ge1xuXHRcdHJldHVybiBpbnB1dC52YWx1ZUFzRGF0ZTtcblx0fSxcblx0bm9ybWFsaXplOiAodmFsdWUpID0+IHtcblx0XHRpZiAodmFsdWUpIHJldHVybiB2YWx1ZTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9LFxufTtcbmNvbnN0IFRZUEVTID0geyB0ZXh0LCBudW1iZXIsIGRhdGUsIHRpbWU6IGRhdGUgfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCBleHRlbmRzIFdyYXBwZXIge1xuXHRzdGF0aWMgZmluZElucHV0KGZpZWxkKSB7XG5cdFx0cmV0dXJuIGZpZWxkLmZpbmQoSU5QVVRTRUxFQ1RPUikuZmlyc3QoKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKGZpZWxkLCBpbnB1dCkge1xuXHRcdHN1cGVyKGZpZWxkLCBpbnB1dCk7XG5cdH1cblxuXHRpbml0KCkge1xuXHRcdGNvbnN0IHsgZmllbGQsIGlucHV0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IHR5cGUgPSAoZmllbGQuYXR0cihcImlucHV0LXR5cGVcIikgfHwgaW5wdXQuYXR0cihcInR5cGVcIikgfHwgREVGQVVMVFRZUEUpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXHRcdHRoaXMudHlwZSA9IFRZUEVTW3R5cGVdIHx8IFRZUEVTW0RFRkFVTFRUWVBFXTtcblx0XHRpbnB1dC5vbihcblx0XHRcdFwiaW5wdXRcIixcblx0XHRcdHRvVGltZW91dEhhbmRsZShcblx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdGZpZWxkLnRyaWdnZXIoRVZFTlRTLmlucHV0LCB0aGlzLm5vcm1hbGl6ZVZhbHVlKHRoaXMudmFsdWUpKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdHRydWUsXG5cdFx0XHQpLFxuXHRcdCk7XG5cblx0XHRmaWVsZC50cmlnZ2VyKEVWRU5UUy5pbnB1dCwgdGhpcy5ub3JtYWxpemVWYWx1ZSh0aGlzLnZhbHVlKSk7XG5cdH1cblxuXHRhY2NlcHRWYWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA9PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIHRydWU7XG5cblx0XHRyZXR1cm4gdGhpcy50eXBlLmFjY2VwdCh2YWx1ZSk7XG5cdH1cblxuXHRub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gdGhpcy50eXBlLm5vcm1hbGl6ZSh2YWx1ZSk7XG5cdH1cblx0YXN5bmMgdXBkYXRlZFZhbHVlKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9IHRoaXMuaW5wdXQudmFsdWUpXG5cdFx0XHR0aGlzLmlucHV0LnZhbCh2YWx1ZSA/IHZhbHVlIDogbnVsbCk7XG5cdH1cblxuXHRzZXQgcmVhZG9ubHkocmVhZG9ubHkpIHtcblx0XHR0aGlzLmlucHV0LmF0dHIoXCJkaXNhYmxlZFwiLCByZWFkb25seSA/IFwiXCIgOiBudWxsKTtcblx0fVxuXG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy50eXBlLnZhbHVlKHRoaXMuaW5wdXQpO1xuXHR9XG5cblx0Z2V0IHZhbGlkKCkge1xuXHRcdHJldHVybiB0aGlzLmlucHV0LmNoZWNrVmFsaWRpdHkoKTtcblx0fVxufVxuIiwiaW1wb3J0IEZpZWxkIGZyb20gXCIuLi9GaWVsZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcmFwcGVyIHtcblx0XG5cdHN0YXRpYyBmaW5kSW5wdXQoZmllbGQpeyByZXR1cm4gbnVsbDt9XG5cdFxuXHRjb25zdHJ1Y3RvcihmaWVsZCwgaW5wdXQpIHtcblx0XHR0aGlzLmZpZWxkID0gZmllbGQ7XG5cdFx0dGhpcy5pbnB1dCA9IGlucHV0O1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0aW5pdCgpIHsgfVxuXG5cdHNldCByZWFkb25seShkaXNhYmxlZCkgeyB9XG5cblx0YXN5bmMgYWNjZXB0VmFsdWUodmFsdWUpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGFzeW5jIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0YXN5bmMgdXBkYXRlZFZhbHVlKCkge1xuXHR9XG5cdFxuXHRnZXQgdmFsdWUoKXtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRcblx0Z2V0IHZhbGlkKCl7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn1cbiIsImltcG9ydCBUZXh0IGZyb20gXCIuL1RleHRcIjtcbmltcG9ydCBDaGVja2JveCBmcm9tIFwiLi9DaGVja2JveFwiO1xuaW1wb3J0IFJhZGlvIGZyb20gXCIuL1JhZGlvXCI7XG5pbXBvcnQgRmlsZSBmcm9tIFwiLi9GaWxlXCI7XG5pbXBvcnQgU2VsZWN0IGZyb20gXCIuL1NlbGVjdFwiO1xuXG5leHBvcnQgY29uc3Qgd3JhcHBlcnMgPSBbVGV4dCwgQ2hlY2tib3gsIFJhZGlvLCBGaWxlLCBTZWxlY3RdO1xuXG5leHBvcnQgY29uc3QgZmluZFdyYXBwZXIgPSAoZmllbGQpID0+IHtcblx0Zm9yIChsZXQgd3JhcHBlciBvZiB3cmFwcGVycykge1xuXHRcdGNvbnN0IGlucHV0ID0gd3JhcHBlci5maW5kSW5wdXQoZmllbGQpO1xuXHRcdGlmIChpbnB1dCkgcmV0dXJuIG5ldyB3cmFwcGVyKGZpZWxkLCBpbnB1dCk7XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn07XG4iLCJpbXBvcnQgR0xPQkFMIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWxcIjtcbmltcG9ydCBIVE1MSnNvbkRhdGFFbGVtZW50IGZyb20gXCIuL3NyYy9IVE1MSnNvbkRhdGFFbGVtZW50XCI7XG5cbkdMT0JBTC5kZWZhdWx0anMgPSBHTE9CQUwuZGVmYXVsdGpzIHx8IHt9O1xuR0xPQkFMLmRlZmF1bHRqcy5odG1sID0gR0xPQkFMLmRlZmF1bHRqcy5odG1sIHx8IHt9O1xuR0xPQkFMLmRlZmF1bHRqcy5odG1sLkhUTUxKc29uRGF0YUVsZW1lbnQgPSBHTE9CQUwuZGVmYXVsdGpzLmh0bWwuSFRNTEpzb25EYXRhRWxlbWVudCB8fCBIVE1MSnNvbkRhdGFFbGVtZW50O1xuIiwiaW1wb3J0IHsgcHJpdmF0ZVByb3BlcnR5IH0gZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL1ByaXZhdGVQcm9wZXJ0eVwiO1xuaW1wb3J0IHsgdG9Ob2RlTmFtZSwgZGVmaW5lIH0gZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWNvbXBvbmVudHMvc3JjL3V0aWxzL0RlZmluZUNvbXBvbmVudEhlbHBlclwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvQ29tcG9uZW50XCI7XG5cbmNvbnN0IE5PREVOQU1FID0gdG9Ob2RlTmFtZShcImpzb24tZGF0YVwiKTtcbmNvbnN0IFBSSVZBVEVfX09CU0VSVkVSID0gXCJvYnNlcnZlclwiO1xuY29uc3QgUFJJVkFURV9fSlNPTiA9IFwianNvblwiO1xuXG5jbGFzcyBIVE1MSnNvbkRhdGFFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0c3RhdGljIGdldCBOT0RFTkFNRSgpIHtcblx0XHRyZXR1cm4gTk9ERU5BTUU7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZSAhaW1wb3J0YW50XCI7XG5cdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG5cdFx0XHR0aGlzLnJlaW5pdCgpO1xuXHRcdH0pO1xuXHRcdG9ic2VydmVyLm9ic2VydmUodGhpcywgeyBjaGlsZExpc3Q6IHRydWUsIGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfX09CU0VSVkVSLCBvYnNlcnZlcik7XG5cdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfX0pTT04sIG51bGwpO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHt9XG5cdGFzeW5jIHJlaW5pdCgpIHtcblx0XHRwcml2YXRlUHJvcGVydHkodGhpcywgUFJJVkFURV9fSlNPTiwgbnVsbCk7XG5cdH1cblxuXHRnZXQganNvbigpIHtcblx0XHRyZXR1cm4gKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHRoaXMucmVhZHk7XG5cdFx0XHRsZXQganNvbiA9IHByaXZhdGVQcm9wZXJ0eSh0aGlzLCBQUklWQVRFX19KU09OKTtcblx0XHRcdGlmICghanNvbikge1xuXHRcdFx0XHRqc29uID0gSlNPTi5wYXJzZSh0aGlzLnRleHRDb250ZW50LnRyaW0oKSk7XG5cdFx0XHRcdHByaXZhdGVQcm9wZXJ0eSh0aGlzLCBQUklWQVRFX19KU09OLCBqc29uKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGpzb247XG5cdFx0fSkoKTtcblx0fVxufVxuXG5kZWZpbmUoSFRNTEpzb25EYXRhRWxlbWVudCk7XG5leHBvcnQgZGVmYXVsdCBIVE1MSnNvbkRhdGFFbGVtZW50O1xuIiwiaW1wb3J0IEdMT0JBTCBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvR2xvYmFsXCI7XG5pbXBvcnQgSFRNTFBhZ2luYXRpb25FbGVtZW50IGZyb20gXCIuL3NyYy9IVE1MUGFnaW5hdGlvbkVsZW1lbnRcIjtcblxuR0xPQkFMLmRlZmF1bHRqcyA9IEdMT0JBTC5kZWZhdWx0anMgfHwge307XG5HTE9CQUwuZGVmYXVsdGpzLmh0bWwgPSBHTE9CQUwuZGVmYXVsdGpzLmh0bWwgfHwge307XG5HTE9CQUwuZGVmYXVsdGpzLmh0bWwuSFRNTFBhZ2luYXRpb25FbGVtZW50ID0gR0xPQkFMLmRlZmF1bHRqcy5odG1sLkhUTUxQYWdpbmF0aW9uRWxlbWVudCB8fCBIVE1MUGFnaW5hdGlvbkVsZW1lbnQ7XG4iLCJpbXBvcnQgeyBwcml2YXRlUHJvcGVydHkgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvUHJpdmF0ZVByb3BlcnR5XCI7XG5pbXBvcnQgeyB0b05vZGVOYW1lLCBkZWZpbmUgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvdXRpbHMvRGVmaW5lQ29tcG9uZW50SGVscGVyXCI7XG5pbXBvcnQgeyBjb21wb25lbnRFdmVudG5hbWUgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvdXRpbHMvRXZlbnRIZWxwZXJcIjtcbmltcG9ydCB7IFJlbmRlcmVyLCBUZW1wbGF0ZSB9IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2VcIjtcbmltcG9ydCB7IGxvYWRUZW1wbGF0ZSwgQVRUUl9URU1QTEFURSB9IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL3NyYy91dGlscy9UZW1wbGF0ZUhlbHBlclwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvQ29tcG9uZW50XCI7XG5cbmNvbnN0IE5PREVOQU1FID0gdG9Ob2RlTmFtZShcInBhZ2luYXRpb25cIik7XG5cbmNvbnN0IFRFTVBMQVRFID0gVGVtcGxhdGUubG9hZChcblx0YFxuPG5hdiBjbGFzcz1cInBhZ2luYXRpb25cIiBqc3RsLWlmPVwiXFwke3BhZ2VzLmxlbmd0aCA+IDF9XCI+XG5cdDx1bD5cblx0XHQ8bGkgY2xhc3M9XCJwYWdpbmF0aW9uLWZpcnN0IFxcJHtwYWdlID09IDEgPyAnZGlzYWJsZWQnIDogJyd9XCIgP2RhdGEtcGFnZT1cIlxcJHtwYWdlICE9IDF9XCIgZGF0YS1wYWdlPVwiMVwiPmZpcnN0PC9saT5cblx0XHQ8bGkgY2xhc3M9XCJwYWdpbmF0aW9uLWJhY2sgXFwke3BhZ2UgPT0gMSA/ICdkaXNhYmxlZCcgOiAnJ31cIiA/ZGF0YS1wYWdlPVwiXFwke3BhZ2UgIT0gMX1cIiBkYXRhLXBhZ2U9XCJcXCR7cGFnZSAtIDF9XCI+cHJldjwvbGk+XG5cblx0XHQ8anN0bCBqc3RsLWZvcmVhY2g9XCJcXCR7cGFnZXN9XCI+XG5cdFx0XHQ8bGkgY2xhc3M9XCJwYWdpbmF0aW9uLXBhZ2UgXFwke3BhZ2UgPT0gaXRlbSA/ICdhY3RpdmUnIDogJyd9XCIgP2RhdGEtcGFnZT1cIlxcJHtwYWdlICE9IGl0ZW19XCIgZGF0YS1wYWdlPVwiXFwke2l0ZW19XCI+XFwke2l0ZW19PC9saT5cblx0XHQ8L2pzdGw+XG5cblx0XHQ8bGkgY2xhc3M9XCJwYWdpbmF0aW9uLW5leHQgXFwke3BhZ2UgPj0gY291bnQgPyAnZGlzYWJsZWQnIDogJyd9XCIgP2RhdGEtcGFnZT1cIlxcJHtjb3VudCA+IHBhZ2V9XCIgZGF0YS1wYWdlPVwiXFwke3BhZ2UgKyAxfVwiPm5leHQ8L2xpPlxuXHRcdDxsaSBjbGFzcz1cInBhZ2luYXRpb24tbGFzdCBcXCR7cGFnZSA+PSBjb3VudCA/ICdkaXNhYmxlZCcgOiAnJ31cIiA/ZGF0YS1wYWdlPVwiXFwke2NvdW50ID4gcGFnZX1cIiBkYXRhLXBhZ2U9XCJcXCR7Y291bnR9XCI+bGFzdDwvbGk+XG5cdDwvdWw+XG48L25hdj5cbmAsXG5cdGZhbHNlLFxuKTtcblxuY29uc3QgdG9EYXRhID0gKHBhZ2UsIGNvdW50LCBzaXplKSA9PiB7XG5cdGNvbnN0IHBhZ2VzID0gW107XG5cdGNvbnN0IG1lcmlkaWFuID0gTWF0aC5mbG9vcihzaXplIC8gMik7XG5cdGxldCBzdGFydCA9IDE7XG5cdGxldCBlbmQgPSBzaXplO1xuXHRpZiAoc2l6ZSA+IGNvdW50KSBlbmQgPSBjb3VudDtcblx0ZWxzZSBpZiAocGFnZSArIG1lcmlkaWFuID4gY291bnQpIHtcblx0XHRlbmQgPSBjb3VudDtcblx0XHRzdGFydCA9IGVuZCAtIHNpemUgKyAxO1xuXHR9IGVsc2UgaWYgKHBhZ2UgLSBtZXJpZGlhbiA+IDEpIHtcblx0XHRlbmQgPSBwYWdlICsgbWVyaWRpYW47XG5cdFx0c3RhcnQgPSBlbmQgLSBzaXplICsgMTtcblx0fVxuXHRmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHBhZ2VzLnB1c2goaSk7XG5cblx0cmV0dXJuIHsgc3RhcnQsIGVuZCwgcGFnZXMsIHBhZ2UsIGNvdW50LCBzaXplIH07XG59O1xuXG5jb25zdCBBVFRSX1BBR0UgPSBcInBhZ2VcIjtcbmNvbnN0IEFUVFJfQ09VTlQgPSBcImNvdW50XCI7XG5jb25zdCBBVFRSX1NJWkUgPSBcInNpemVcIjtcbmNvbnN0IEFUVFJfRElTQUJMRURfU0hBRE9XX0RPTSA9IFwiZGlzYWJsZWQtc2hhZG93LWRvbVwiO1xuY29uc3QgQVRUUl9EQVRBX1BBR0UgPSBcImRhdGEtcGFnZVwiO1xuY29uc3QgQVRUUklCVVRFUyA9IFtBVFRSX1BBR0UsIEFUVFJfQ09VTlQsIEFUVFJfU0laRSwgQVRUUl9URU1QTEFURV07XG5cbmNvbnN0IEVWRU5UX19UT19QQUdFID0gY29tcG9uZW50RXZlbnRuYW1lKFwidG8tcGFnZVwiLCBOT0RFTkFNRSk7XG5jb25zdCBFVkVOVF9fQ0hBTkdFID0gY29tcG9uZW50RXZlbnRuYW1lKFwiY2hhbmdlXCIsIE5PREVOQU1FKTtcblxuY29uc3QgUFJJVkFURV9fUkVOREVSRVIgPSBcInJlbmRlcmVyXCI7XG5cbmNsYXNzIEhUTUxQYWdpbmF0aW9uRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiBBVFRSSUJVVEVTO1xuXHR9XG5cblx0c3RhdGljIGdldCBOT0RFTkFNRSgpIHtcblx0XHRyZXR1cm4gTk9ERU5BTUU7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRhd2FpdCBzdXBlci5pbml0KCk7XG5cdFx0aWYgKCF0aGlzLnJlYWR5LnJlc29sdmVkKSB7XG5cdFx0XHRjb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBhd2FpdCBURU1QTEFURTtcblx0XHRcdGNvbnN0IHRlbXBsYXRlID0gYXdhaXQgbG9hZFRlbXBsYXRlKHRoaXMsIGRlZmF1bHRUZW1wbGF0ZSk7XG5cdFx0XHRpZiAoIXRoaXMuZGlzYWJsZWRTaGFkb3dEb20gJiYgdGVtcGxhdGUgIT0gZGVmYXVsdFRlbXBsYXRlKVxuXHRcdFx0XHR0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6IFwib3BlblwiIH0pO1xuXHRcdFx0dGhpcy5yb290Lm9uKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHsgdGFyZ2V0IH0gPSBldmVudDtcblx0XHRcdFx0bGV0IHBhZ2UgPSBOdW1iZXIuTmFOO1xuXHRcdFx0XHRwYWdlID0gcGFyc2VJbnQodGFyZ2V0LmF0dHIoQVRUUl9EQVRBX1BBR0UpKTtcblx0XHRcdFx0aWYgKE51bWJlci5pc05hTihwYWdlKSkge1xuXHRcdFx0XHRcdGNvbnN0IHBhcmVudCA9IHRhcmdldC5wYXJlbnQoXCJbXCIgKyBBVFRSX0RBVEFfUEFHRSArIFwiXVwiKTtcblx0XHRcdFx0XHRpZiAocGFyZW50KSBwYWdlID0gcGFyc2VJbnQocGFyZW50LmF0dHIoQVRUUl9EQVRBX1BBR0UpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIU51bWJlci5pc05hTihwYWdlKSkge1xuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcihFVkVOVF9fVE9fUEFHRSwgcGFnZSk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHByaXZhdGVQcm9wZXJ0eSh0aGlzLCBQUklWQVRFX19SRU5ERVJFUiwgbmV3IFJlbmRlcmVyKHsgdGVtcGxhdGUgfSkpO1xuXG5cdFx0XHR0aGlzLm9uKEVWRU5UX19DSEFOR0UsICgpID0+IHtcblx0XHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9XG5cblx0Z2V0IHBhZ2UoKSB7XG5cdFx0cmV0dXJuIHBhcnNlSW50KHRoaXMuYXR0cihBVFRSX1BBR0UpIHx8IFwiMVwiKTtcblx0fVxuXHRzZXQgcGFnZShwYWdlKSB7XG5cdFx0dGhpcy5hdHRyKEFUVFJfUEFHRSwgcGFnZSk7XG5cdH1cblxuXHRnZXQgY291bnQoKSB7XG5cdFx0cmV0dXJuIHBhcnNlSW50KHRoaXMuYXR0cihBVFRSX0NPVU5UKSB8fCBcIjBcIik7XG5cdH1cblx0c2V0IGNvdW50KGNvdW50KSB7XG5cdFx0dGhpcy5hdHRyKEFUVFJfQ09VTlQsIGNvdW50KTtcblx0fVxuXG5cdGdldCBzaXplKCkge1xuXHRcdHJldHVybiBwYXJzZUludCh0aGlzLmF0dHIoQVRUUl9TSVpFKSB8fCBcIjEwXCIpO1xuXHR9XG5cdHNldCBzaXplKHNpemUpIHtcblx0XHR0aGlzLmF0dHIoQVRUUl9TSVpFLCBzaXplKTtcblx0fVxuXG5cdGdldCBkaXNhYmxlZFNoYWRvd0RvbSgpIHtcblx0XHRyZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoQVRUUl9ESVNBQkxFRF9TSEFET1dfRE9NKTtcblx0fVxuXG5cdGFzeW5jIHJlbmRlcigpIHtcblx0XHRjb25zdCByZW5kZXJlciA9IHByaXZhdGVQcm9wZXJ0eSh0aGlzLCBQUklWQVRFX19SRU5ERVJFUik7XG5cdFx0cmVuZGVyZXIucmVuZGVyKHsgZGF0YTogdG9EYXRhKHRoaXMucGFnZSwgdGhpcy5jb3VudCwgdGhpcy5zaXplKSwgY29udGFpbmVyOiB0aGlzLnJvb3QgfSk7XG5cdH1cbn1cblxuZGVmaW5lKEhUTUxQYWdpbmF0aW9uRWxlbWVudCk7XG5leHBvcnQgZGVmYXVsdCBIVE1MUGFnaW5hdGlvbkVsZW1lbnQ7XG4iLCJpbXBvcnQgR0xPQkFMIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWxcIjtcbmltcG9ydCBIVE1MUmVuZGVyZXJFbGVtZW50IGZyb20gXCIuL3NyYy9IVE1MUmVuZGVyZXJFbGVtZW50XCI7XG5cbkdMT0JBTC5kZWZhdWx0anMgPSBHTE9CQUwuZGVmYXVsdGpzIHx8IHt9O1xuR0xPQkFMLmRlZmF1bHRqcy5odG1sID0gR0xPQkFMLmRlZmF1bHRqcy5odG1sIHx8IHt9O1xuR0xPQkFMLmRlZmF1bHRqcy5odG1sLkhUTUxSZW5kZXJlckVsZW1lbnQgPSBHTE9CQUwuZGVmYXVsdGpzLmh0bWwuSFRNTFJlbmRlcmVyRWxlbWVudCB8fCBIVE1MUmVuZGVyZXJFbGVtZW50O1xuIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyB0b05vZGVOYW1lLCBkZWZpbmUgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvdXRpbHMvRGVmaW5lQ29tcG9uZW50SGVscGVyXCI7XG5pbXBvcnQgeyBjb21wb25lbnRFdmVudG5hbWUgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvdXRpbHMvRXZlbnRIZWxwZXJcIjtcbmltcG9ydCB7IGRlZlZhbHVlIH0gZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL09iamVjdFV0aWxzXCI7XG5pbXBvcnQgeyBwcml2YXRlUHJvcGVydHkgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvUHJpdmF0ZVByb3BlcnR5XCI7XG5pbXBvcnQgUmVuZGVyZXIgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy10ZW1wbGF0ZS1sYW5ndWFnZS9zcmMvUmVuZGVyZXJcIjtcbmltcG9ydCBUZW1wbGF0ZSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9UZW1wbGF0ZVwiO1xuaW1wb3J0IEV4cHJlc3Npb25SZXNvbHZlciBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4cHJlc3Npb24tbGFuZ3VhZ2Uvc3JjL0V4cHJlc3Npb25SZXNvbHZlclwiO1xuXG5jb25zdCBOT0RFTkFNRSA9IHRvTm9kZU5hbWUoXCJyZW5kZXJlclwiKTtcbmNvbnN0IE5PREVOQU1FX0pTT05EQVRBID0gdG9Ob2RlTmFtZShcImpzb24tZGF0YVwiKS50b1VwcGVyQ2FzZSgpO1xuY29uc3QgTk9ERU5BTUVfUkVRVUVTVCA9IHRvTm9kZU5hbWUoXCJyZXF1ZXN0XCIpLnRvVXBwZXJDYXNlKCk7XG5cbmNvbnN0IEVWRU5UX1JFTkRFUkVEID0gY29tcG9uZW50RXZlbnRuYW1lKFwicmVuZGVyZWRcIiwgTk9ERU5BTUUpO1xuXG5jb25zdCBBVFRSSUJVVEVfVEVNUExBVEUgPSBcInRlbXBsYXRlXCI7XG5jb25zdCBBVFRSSUJVVEVfREFUQSA9IFwiZGF0YVwiO1xuY29uc3QgQVRUUklCVVRFX1JFTkRFUl9NT0RFID0gXCJyZW5kZXItbW9kZVwiOyAvL2FwcGVuZCwgcHJlcGVuZCwgcmVwbGFjZSwgc2VsZi1yZXBsYWNlXG5jb25zdCBBVFRSSUJVVEVfU0hBRE9XTU9ERSA9IFwic2hhZG93bW9kZVwiOyAvL1xuXG5jb25zdCBBVFRSSUJVVEVfQ09ORElUSU9OID0gXCJjb25kaXRpb25cIjsgLy8gaWYgY29uZHRpb24gdHJ1ZSwgdGhhbiByZW5kZXIgKGNvbnRleHQ/Pz8pXG5jb25zdCBBVFRSSUJVVEVfSU5JVFJVTiA9IFwiaW5pdGlhbC1ydW5cIjsgLy8gZGVmYXVsdDogdHJ1ZVxuY29uc3QgQVRUUklCVVRFX0xJU1RFTl9FVkVOVCA9IFwibGlzdGVuLWV2ZW50XCI7XG5jb25zdCBBVFRSSUJVVEVfTElTVEVOX0VMRU1FTlQgPSBcImxpc3Rlbi1lbGVtZW50XCI7IC8vZGVmYXVsdCBib2R5XG5jb25zdCBBVFRSSUJVVEVfVFJJR0dFUl9FVkVOVCA9IFwidHJpZ2dlci1ldmVudFwiOyAvLyB0cmlnZ2VyIGV2ZW50IG9uIHJlbmRlciBmaW5pc2hlZFxuXG5jb25zdCBBVFRSSUJVVEVTID0gW0FUVFJJQlVURV9URU1QTEFURSwgQVRUUklCVVRFX0RBVEEsIEFUVFJJQlVURV9SRU5ERVJfTU9ERV07XG5cbmNvbnN0IFBSSVZBVEVfVEVNUExBVEUgPSBcInRlbXBsYXRlXCI7XG5jb25zdCBQUklWQVRFX0xJU1RFTkVSID0gXCJsaXN0ZW5lclwiO1xuY29uc3QgUFJJVkFURV9EQVRBID0gXCJkYXRhXCI7XG5jb25zdCBQUklWQVRFX1JFTkRFUl9USU1FT1VUID0gXCJyZW5kZXJUaW1lb3V0XCI7XG5cbmNvbnN0IGZpbmRFbGVtZW50ID0gKGVsZW1lbnQsIHNlbGVjdG9yKSA9PiB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGZpbmQoc2VsZWN0b3IpLmZpcnN0KCk7XG5cdH0gY2F0Y2ggKGUpIHt9XG59O1xuXG5jb25zdCBsb2FkVGVtcGxhdGUgPSBhc3luYyAoZWxlbWVudCkgPT4ge1xuXHRjb25zdCB2YWx1ZSA9IGVsZW1lbnQuYXR0cihBVFRSSUJVVEVfVEVNUExBVEUpO1xuXHRsZXQgdGVtcGxhdGUgPSBudWxsO1xuXHRpZiAodmFsdWUpIHtcblx0XHR0ZW1wbGF0ZSA9IGZpbmRFbGVtZW50KGVsZW1lbnQsIHZhbHVlKTtcblx0XHRpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KSByZXR1cm4gYXdhaXQgVGVtcGxhdGUubG9hZCh0ZW1wbGF0ZSwgZmFsc2UpO1xuXHRcdGVsc2UgdGVtcGxhdGUgPSBhd2FpdCBUZW1wbGF0ZS5sb2FkKG5ldyBVUkwodmFsdWUsIGxvY2F0aW9uKSk7XG5cdH0gZWxzZSBpZiAoZWxlbWVudC5jaGlsZE5vZGVzICYmIGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB0ZW1wbGF0ZSA9IGF3YWl0IFRlbXBsYXRlLmxvYWQoZWxlbWVudC5jaGlsZE5vZGVzLCBmYWxzZSk7XG5cblx0cmV0dXJuIHRlbXBsYXRlO1xufTtcblxuY29uc3QgY2FsbFJlbmRlciA9IChlbGVtZW50KSA9PiB7XG5cdGNvbnN0IHRpbWVvdXQgPSBwcml2YXRlUHJvcGVydHkoZWxlbWVudCwgUFJJVkFURV9SRU5ERVJfVElNRU9VVCk7XG5cdGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cblx0cHJpdmF0ZVByb3BlcnR5KFxuXHRcdGVsZW1lbnQsXG5cdFx0UFJJVkFURV9SRU5ERVJfVElNRU9VVCxcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHByaXZhdGVQcm9wZXJ0eShlbGVtZW50LCBQUklWQVRFX1JFTkRFUl9USU1FT1VULCBudWxsKTtcblx0XHRcdGVsZW1lbnQucmVuZGVyKCk7XG5cdFx0fSwgMTAwKSxcblx0KTtcbn07XG5cbmNvbnN0IGdldExpc3RlbkVsZW1lbnRzID0gKHJlbmRlcmVyKSA9PiB7XG5cdGNvbnN0IHNlbGVjdG9yID0gcmVuZGVyZXIuYXR0cihBVFRSSUJVVEVfTElTVEVOX0VMRU1FTlQpO1xuXHRpZiAoc2VsZWN0b3IpIHtcblx0XHRjb25zdCByZXN1bHRzID0gZmluZChzZWxlY3Rvcik7XG5cdFx0aWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAwKSByZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdHJldHVybiBkb2N1bWVudC5ib2R5O1xufTtcblxuY29uc3QgYWRkRXZlbnRPYnNlcnZpbmcgPSAocmVuZGVyZXIpID0+IHtcblx0Y29uc3QgZXZlbnRzID0gcmVuZGVyZXIuYXR0cihBVFRSSUJVVEVfTElTVEVOX0VWRU5UKTtcblx0Y29uc3QgZWxlbWVudCA9IGdldExpc3RlbkVsZW1lbnRzKHJlbmRlcmVyKTtcblxuXHRjb25zdCBsaXN0ZW5lciA9IChldmVudCkgPT4ge1xuXHRcdHJlbmRlcmVyLnJlbmRlcih7IGV2ZW50IH0pO1xuXHR9O1xuXG5cdHByaXZhdGVQcm9wZXJ0eShyZW5kZXJlciwgUFJJVkFURV9MSVNURU5FUiwgbGlzdGVuZXIpO1xuXG5cdGVsZW1lbnQub24oZXZlbnRzLCBsaXN0ZW5lcik7XG59O1xuXG5jb25zdCByZW1vdmVFdmVudE9ic2VydmluZyA9IChyZW5kZXJlcikgPT4ge1xuXHRjb25zdCBsaXN0ZW5kZXIgPSBwcml2YXRlUHJvcGVydHkocmVuZGVyZXIsIFBSSVZBVEVfTElTVEVORVIpO1xuXHRpZiAobGlzdGVuZGVyKSB7XG5cdFx0Y29uc3QgZWxlbWVudCA9IGdldExpc3RlbkVsZW1lbnRzKHJlbmRlcmVyKTtcblx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIpO1xuXHR9XG59O1xuXG5jb25zdCB0cmlnZ2VyRXZlbnQgPSAocmVuZGVyZXIsIGNvbnRlbnQpID0+IHtcblx0Y29uc3QgZXZlbnRzID0gcmVuZGVyZXIuYXR0cihBVFRSSUJVVEVfVFJJR0dFUl9FVkVOVCk7XG5cdGlmIChldmVudHMpIGNvbnRlbnQudHJpZ2dlcihldmVudHMpO1xuXHRjb250ZW50LnRyaWdnZXIoRVZFTlRfUkVOREVSRUQpO1xufTtcblxuY29uc3QgbWVyZ2VEYXRhID0gKGRhdGExLCBkYXRhMikgPT4ge1xuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGF0YTEgPyBkYXRhMSA6IG51bGwsIGRhdGEyID8gZGF0YTIgOiBudWxsKTtcbn07XG5cbmNsYXNzIEpTVExSZW5kZXJlckVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRyZXR1cm4gQVRUUklCVVRFUztcblx0fVxuXG5cdHN0YXRpYyBnZXQgTk9ERU5BTUUoKSB7XG5cdFx0cmV0dXJuIE5PREVOQU1FO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRpZiAodGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX1NIQURPV01PREUpKSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6IG9wZW4gfSk7XG5cdH1cblxuXHRnZXQgcm9vdCgpIHtcblx0XHRyZXR1cm4gdGhpcy5zaGFkb3dSb290IHx8IHRoaXM7XG5cdH1cblxuXHRhc3luYyBpbml0KCkge1xuXHRcdGF3YWl0IHN1cGVyLmluaXQoKTtcblxuXHRcdGlmICghdGhpcy5yZWFkeS5yZXNvbHZlZCkge1xuXHRcdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfVEVNUExBVEUsIGF3YWl0IGxvYWRUZW1wbGF0ZSh0aGlzKSk7XG5cblx0XHRcdGlmICh0aGlzLmhhc0F0dHJpYnV0ZShBVFRSSUJVVEVfTElTVEVOX0VWRU5UKSkgYWRkRXZlbnRPYnNlcnZpbmcodGhpcyk7XG5cdFx0XHRpZiAodGhpcy5hdHRyKEFUVFJJQlVURV9JTklUUlVOKSAhPSBcImZhbHNlXCIpIGF3YWl0IHRoaXMucmVuZGVyKCk7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgZ2V0VGVtcGxhdGUoKSB7XG5cdFx0cmV0dXJuIHByaXZhdGVQcm9wZXJ0eSh0aGlzLCBQUklWQVRFX1RFTVBMQVRFKTtcblx0fVxuXG5cdGFzeW5jIHNldFRlbXBsYXRlKHRlbXBsYXRlKSB7XG5cdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfVEVNUExBVEUsIGF3YWl0IFRlbXBsYXRlLmxvYWQodGVtcGxhdGUpKTtcblx0fVxuXG5cdGFzeW5jIGdldERhdGEoKSB7XG5cdFx0Y29uc3QgcHJpdmF0ZURhdGEgPSBwcml2YXRlUHJvcGVydHkodGhpcywgUFJJVkFURV9EQVRBKTtcblx0XHRpZiAocHJpdmF0ZURhdGEpIHJldHVybiBwcml2YXRlRGF0YTtcblxuXHRcdGNvbnN0IHZhbHVlID0gdGhpcy5hdHRyKEFUVFJJQlVURV9EQVRBKTtcblx0XHRsZXQgZGF0YSA9IG51bGw7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRkYXRhID0gZmluZEVsZW1lbnQodGhpcywgdmFsdWUpO1xuXHRcdFx0aWYgKGRhdGEpIHtcblx0XHRcdFx0aWYgKGRhdGEubm9kZU5hbWUgPT0gTk9ERU5BTUVfSlNPTkRBVEEpIGRhdGEgPSBkYXRhLmpzb247XG5cdFx0XHRcdGVsc2UgaWYgKGRhdGEubm9kZU5hbWUgPT0gTk9ERU5BTUVfUkVRVUVTVCkge1xuXHRcdFx0XHRcdGRhdGEgPSBhd2FpdCBkYXRhLmV4ZWN1dGUoe30pO1xuXHRcdFx0XHRcdGRhdGEgPSBkYXRhLmpzb24oKTtcblx0XHRcdFx0fSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0XHRcdFx0XHRkYXRhID0gZGF0YS50ZXh0Q29udGVudDtcblx0XHRcdFx0XHRpZiAoZGF0YSAmJiBkYXRhLnRyaW0oKS5sZW5ndGggPiAwKSBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGF0YSA9IGF3YWl0IGZldGNoKG5ldyBVUkwodmFsdWUsIGxvY2F0aW9uKS50b1N0cmluZygpKTtcblx0XHRcdFx0ZGF0YSA9IGF3YWl0IGRhdGEuanNvbigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0YXN5bmMgc2V0RGF0YShkYXRhKSB7XG5cdFx0YXdhaXQgdGhpcy5yZWFkeTtcblx0XHRwcml2YXRlUHJvcGVydHkodGhpcywgUFJJVkFURV9EQVRBLCBkYXRhKTtcblx0fVxuXG5cdGFzeW5jIHJlbmRlcih7IHRlbXBsYXRlLCBkYXRhLCBldmVudCB9ID0ge30pIHtcblx0XHRjb25zdCBjb250YWluZXIgPSB0aGlzLnJvb3Q7XG5cblx0XHRsZXQgY29udGV4dCA9IG1lcmdlRGF0YShkYXRhLCBldmVudCk7XG5cblx0XHRjb25zdCBjb25kaXRpb24gPSBhd2FpdCBFeHByZXNzaW9uUmVzb2x2ZXIucmVzb2x2ZSh0aGlzLmF0dHIoQVRUUklCVVRFX0NPTkRJVElPTikgfHwgXCJ0cnVlXCIsIGNvbnRleHQsIGZhbHNlKTtcblx0XHRpZiAoIWNvbmRpdGlvbikgcmV0dXJuO1xuXG5cdFx0aWYgKHRlbXBsYXRlKSB0ZW1wbGF0ZSA9IGF3YWl0IFRlbXBsYXRlLmxvYWQodGVtcGxhdGUpO1xuXHRcdGVsc2UgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmdldFRlbXBsYXRlKHRoaXMpO1xuXHRcdGlmICghdGVtcGxhdGUpIHJldHVybjtcblxuXHRcdGlmICghZGF0YSkgZGF0YSA9IGF3YWl0IHRoaXMuZ2V0RGF0YSh0aGlzKTtcblx0XHRpZiAoIWRhdGEpIGRhdGEgPSB7fTtcblxuXHRcdGNvbnRleHQgPSBtZXJnZURhdGEoY29udGV4dCwgZGF0YSk7XG5cblx0XHRsZXQgcmVwbGFjZSA9IGZhbHNlO1xuXHRcdGxldCBtb2RlID0gdGhpcy5hdHRyKEFUVFJJQlVURV9SRU5ERVJfTU9ERSk7XG5cdFx0aWYgKG1vZGUgPT0gXCJzZWxmLXJlcGxhY2VcIikge1xuXHRcdFx0cmVwbGFjZSA9IHRydWU7XG5cdFx0XHRtb2RlID0gXCJyZXBsYWNlXCI7XG5cdFx0fVxuXG5cdFx0YXdhaXQgUmVuZGVyZXIucmVuZGVyKHsgdGVtcGxhdGUsIGRhdGE6IGNvbnRleHQsIGNvbnRhaW5lciwgbW9kZSB9KTtcblxuXHRcdGlmIChyZXBsYWNlKSB7XG5cdFx0XHRyZW1vdmVFdmVudE9ic2VydmluZyh0aGlzKTtcblxuXHRcdFx0Y29uc3QgY29udGVudCA9IGNvbnRhaW5lci5jb250ZW50KCk7XG5cdFx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0XHR0aGlzLnJlcGxhY2UoY29udGVudCk7XG5cdFx0XHRcdHRyaWdnZXJFdmVudCh0aGlzLCBjb250ZW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRyaWdnZXJFdmVudCh0aGlzLCB0aGlzLnBhcmVudCgpKTtcblx0XHRcdFx0dGhpcy5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgdHJpZ2dlckV2ZW50KHRoaXMsIHRoaXMpO1xuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXHRcdGlmIChvbGRWYWx1ZSAhPSBuZXdWYWx1ZSAmJiB0aGlzLmlzQ29ubmVjdGVkKSB7XG5cdFx0XHRpZiAobmFtZSA9PSBBVFRSSUJVVEVfVEVNUExBVEUpIGxvYWRUZW1wbGF0ZSh0aGlzKTtcblx0XHRcdGNhbGxSZW5kZXIodGhpcyk7XG5cdFx0fVxuXHR9XG59XG5cbmRlZmluZShKU1RMUmVuZGVyZXJFbGVtZW50KTtcbmV4cG9ydCBkZWZhdWx0IEpTVExSZW5kZXJlckVsZW1lbnQ7XG4iLCJpbXBvcnQgR0xPQkFMIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWxcIjtcbmltcG9ydCBIVE1MUmVxdWVzdEVsZW1lbnQgZnJvbSBcIi4vc3JjL0hUTUxSZXF1ZXN0RWxlbWVudFwiO1xuXG5HTE9CQUwuZGVmYXVsdGpzID0gR0xPQkFMLmRlZmF1bHRqcyB8fCB7fTtcbkdMT0JBTC5kZWZhdWx0anMuaHRtbCA9IEdMT0JBTC5kZWZhdWx0anMuaHRtbCB8fCB7fTtcbkdMT0JBTC5kZWZhdWx0anMuaHRtbC5IVE1MUmVxdWVzdEVsZW1lbnQgPSBHTE9CQUwuZGVmYXVsdGpzLmh0bWwuSFRNTFJlcXVlc3RFbGVtZW50IHx8IEhUTUxSZXF1ZXN0RWxlbWVudDtcbiIsImltcG9ydCB7IHRvTm9kZU5hbWUsIGRlZmluZSB9IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1jb21wb25lbnRzL3NyYy91dGlscy9EZWZpbmVDb21wb25lbnRIZWxwZXJcIjtcbmltcG9ydCBIVE1MSnNvbkRhdGFFbGVtZW50IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1qc29uZGF0YS9zcmMvSFRNTEpzb25EYXRhRWxlbWVudFwiO1xuaW1wb3J0IHsgUmVxdWVzdGVyIH0gZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1keW5hbWljLXJlcXVlc3RlclwiXG5cblxuY29uc3QgTk9ERU5BTUUgPSB0b05vZGVOYW1lKFwicmVxdWVzdFwiKTtcbmNsYXNzIEhUTUxSZXF1ZXN0RWxlbWVudCBleHRlbmRzIEhUTUxKc29uRGF0YUVsZW1lbnQge1xuXHRcblx0c3RhdGljIGdldCBOT0RFTkFNRSgpIHsgcmV0dXJuIE5PREVOQU1FOyB9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZSAhaW1wb3J0YW50XCI7XG5cdH1cblxuXHRhc3luYyByZWluaXQoKSB7XG5cdFx0ZGVsZXRlIHRoaXMuX19qc29uX187XG5cdFx0ZGVsZXRlIHRoaXMuX19yZXF1ZXN0ZXJfXztcblx0fVxuXG5cdGdldCByZXF1ZXN0KCkge1xuXHRcdHJldHVybiB0aGlzLmpzb247XG5cdH1cblxuXHRnZXQgcmVxdWVzdGVyKCkge1xuXHRcdGlmICh0aGlzLl9fcmVxdWVzdGVyX18pXG5cdFx0XHR0aGlzLl9fcmVxdWVzdGVyX18gPSBuZXcgUmVxdWVzdGVyKHRoaXMucmVxdWVzdCk7XG5cblx0XHRyZXR1cm4gdGhpcy5fX3JlcXVlc3Rlcl9fO1xuXHR9XG5cblx0YXN5bmMgZXhlY3V0ZShjb250ZXh0KSB7XG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdGVyLmV4ZWN1dGUoeyBjb250ZXh0IH0pO1xuXHR9XG5cbn1cblxuZGVmaW5lKEhUTUxSZXF1ZXN0RWxlbWVudCk7XG5leHBvcnQgZGVmYXVsdCBIVE1MUmVxdWVzdEVsZW1lbnQ7XG4iLCJpbXBvcnQgR0xPQkFMIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9HbG9iYWxcIjtcbmltcG9ydCBIVE1MVHlwZWFoZWFkRWxlbWVudCBmcm9tIFwiLi9zcmMvSFRNTFR5cGVhaGVhZEVsZW1lbnRcIjtcblxuR0xPQkFMLmRlZmF1bHRqcyA9IEdMT0JBTC5kZWZhdWx0anMgfHwge307XG5HTE9CQUwuZGVmYXVsdGpzLmh0bWwgPSBHTE9CQUwuZGVmYXVsdGpzLmh0bWwgfHwge307XG5HTE9CQUwuZGVmYXVsdGpzLmh0bWwuSFRNTFR5cGVhaGVhZEVsZW1lbnQgPSBHTE9CQUwuZGVmYXVsdGpzLmh0bWwuSFRNTFR5cGVhaGVhZEVsZW1lbnQgfHwgSFRNTFR5cGVhaGVhZEVsZW1lbnQ7XG4iLCJpbXBvcnQgeyBjcmVhdGVVSUQgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyB0b05vZGVOYW1lLCBkZWZpbmUgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvdXRpbHMvRGVmaW5lQ29tcG9uZW50SGVscGVyXCI7XG5pbXBvcnQgeyBjb21wb25lbnRFdmVudG5hbWUgfSBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtY29tcG9uZW50cy9zcmMvdXRpbHMvRXZlbnRIZWxwZXJcIjtcbmltcG9ydCB7IHByaXZhdGVQcm9wZXJ0eSB9IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9Qcml2YXRlUHJvcGVydHlcIjtcbmltcG9ydCBSZW5kZXJlciBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLXRlbXBsYXRlLWxhbmd1YWdlL3NyYy9SZW5kZXJlclwiO1xuaW1wb3J0IFRlbXBsYXRlIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtdGVtcGxhdGUtbGFuZ3VhZ2Uvc3JjL1RlbXBsYXRlXCI7XG5pbXBvcnQgRXhwcmVzc2lvblJlc29sdmVyIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9zcmMvRXhwcmVzc2lvblJlc29sdmVyXCI7XG5pbXBvcnQgeyBsYXp5UHJvbWlzZSB9IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9Qcm9taXNlVXRpbHNcIjtcbmltcG9ydCBIVE1MUmVxdWVzdEVsZW1lbnQgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLXJlcXVlc3Qvc3JjL0hUTUxSZXF1ZXN0RWxlbWVudFwiO1xuXG5jb25zdCBOT0RFTkFNRSA9IHRvTm9kZU5hbWUoXCJ0eXBlYWhlYWRcIik7XG5jb25zdCBQUklWQVRFX1JFQURZID0gXCJyZWFkeVwiO1xuY29uc3QgUFJJVkFURV9TVUdHRVNUSU9OX0JPWCA9IFwic3VnZ2VzdGlvbkJveFwiO1xuY29uc3QgUFJJVkFURV9SRVFVRVNUID0gXCJyZXF1ZXN0XCI7XG5cblxuY29uc3QgREVGQVVMVF9URU1QTEFURSA9IFRlbXBsYXRlLmxvYWQoXG5cdGA8anN0bCBqc3RsLWZvcmVhY2g9XCJcXCR7c3VnZ2VzdGlvbnN9XCIganN0bC1mb3JlYWNoLXZhcj1cInN1Z2dlc3Rpb25cIj5cblx0PG9wdGlvbiB2YWx1ZT1cIlxcJHtzdWdnZXN0aW9uLnZhbHVlfVwiPlxcJHtzdWdnZXN0aW9uLnRleHR9PC9vcHRpb24+XG48L2pzdGw+YCwgZmFsc2UpO1xuXG5jb25zdCBFVkVOVF9MT0FEX1NVR0dFU1RJT04gPSBjb21wb25lbnRFdmVudG5hbWUoXCJsb2FkLXN1Z2dlc3Rpb25cIiwgTk9ERU5BTUUpO1xuY29uc3QgRVZFTlRfU0hPV19TVUdHRVNUSU9OID0gY29tcG9uZW50RXZlbnRuYW1lKFwic2hvdy1zdWdnZXN0aW9uXCIsIE5PREVOQU1FKTtcbmNvbnN0IEVWRU5UX1NFTEVDVEVEX1NVR0dFU1RJT04gPSBjb21wb25lbnRFdmVudG5hbWUoXCJzZWxlY3RlZC1zdWdnZXN0aW9uXCIsIE5PREVOQU1FKTtcbmNvbnN0IFRJTUVPVVRfSU5URVJWQUwgPSAxMDA7XG5cblxuY29uc3QgQVRUUklCVVRFX1NFTEZfSEFORExFX1NFTEVDVElPTiA9IFwic2VsZi1oYW5kbGUtc2VsZWN0aW9uXCI7XG5jb25zdCBBVFRSSUJVVEVfUkVRVUVTVCA9IFwicmVxdWVzdFwiO1xuY29uc3QgQVRUUklCVVRFX1JFU1BPTlNFX1NVR0dFU1RJT05TID0gXCJyZXNwb25zZS1zdWdnZXN0aW9uc1wiO1xuY29uc3QgQVRUUklCVVRFX1NVR0dFU1RJT05fVkFMVUUgPSBcInN1Z2dlc3Rpb24tdmFsdWVcIjtcbmNvbnN0IEFUVFJJQlVURV9TVUdHRVNUSU9OX1RFWFQgPSBcInN1Z2dlc3Rpb24tdGV4dFwiO1xuY29uc3QgQVRUUklCVVRFUyA9IFtdO1xuXG5cblxuY29uc3QgaW5pdFN1Z2dlc3Rpb25Cb3ggPSAoaW5wdXQpID0+IHtcblx0Y29uc3QgaWQgPSBjcmVhdGVVSUQoXCJpZC1cIiwgXCJcIik7XG5cdGNvbnN0IGJveCA9IGNyZWF0ZShgPGRhdGFsaXN0IGlkPVwiJHtpZH1cIj48L2RhdGFsaXN0PmApLmZpcnN0KCk7XG5cblx0Ym94Lm9uKFwiY2xpY2tcIiwgY29uc29sZS5sb2cpO1xuXG5cdGlucHV0LmFmdGVyKGJveCk7XG5cdGlucHV0LmF0dHIoXCJsaXN0XCIsIGlkKVxuXG5cdHJldHVybiBib3g7XG59O1xuXG5jb25zdCBnZXRTdWdnZXN0aW9uQm94ID0gKGlucHV0KSA9PiB7XG5cdGxldCBzdWdnZXN0aW9uQm94ID0gcHJpdmF0ZVByb3BlcnR5KGlucHV0LCBQUklWQVRFX1NVR0dFU1RJT05fQk9YKTtcblx0aWYgKCFzdWdnZXN0aW9uQm94KSB7XG5cblx0XHRzdWdnZXN0aW9uQm94ID0gaW5pdFN1Z2dlc3Rpb25Cb3goaW5wdXQpO1xuXHRcdHByaXZhdGVQcm9wZXJ0eShpbnB1dCwgUFJJVkFURV9TVUdHRVNUSU9OX0JPWCwgc3VnZ2VzdGlvbkJveCk7XG5cdH1cblxuXHRyZXR1cm4gc3VnZ2VzdGlvbkJveDtcbn07XG5cbmNvbnN0IGluaXRJbnB1dEhhbmRsZSA9IChpbnB1dCkgPT4ge1xuXHRsZXQgaW5wdXRUaW1lb3V0ID0gbnVsbDtcblx0aW5wdXQub24oXCJpbnB1dCBmb2N1c1wiLCAoZXZlbnQpID0+IHtcblx0XHRpZiAoaW5wdXRUaW1lb3V0KVxuXHRcdFx0Y2xlYXJUaW1lb3V0KGlucHV0VGltZW91dCk7XG5cblx0XHRpZiAoZXZlbnQuaW5wdXRUeXBlID09IFwiaW5zZXJ0UmVwbGFjZW1lbnRUZXh0XCIpIHtcblx0XHRcdGlmIChpbnB1dC5zZWxmSGFuZGxlU2VsZWN0aW9uKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdGlucHV0LnRyaWdnZXIoRVZFTlRfU0VMRUNURURfU1VHR0VTVElPTiwgZXZlbnQuZGF0YSlcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHZhbHVlID0gaW5wdXQudmFsdWU7XG5cdFx0aW5wdXRUaW1lb3V0ID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG5cdFx0XHRpZiAodmFsdWUgPT0gaW5wdXQudmFsdWUpXG5cdFx0XHRcdGlucHV0LnRyaWdnZXIoRVZFTlRfTE9BRF9TVUdHRVNUSU9OLCB2YWx1ZSk7XG5cdFx0fSwgVElNRU9VVF9JTlRFUlZBTCk7XG5cdH0pO1xufTtcblxuY29uc3QgaW5pdEhhbmRsZVN1Z2dlc3Rpb25zID0gKGlucHV0KSA9PiB7XG5cdGxldCBzaG93VGltZW91dCA9IG51bGw7XG5cdGlucHV0Lm9uKEVWRU5UX1NIT1dfU1VHR0VTVElPTiwgKGV2ZW50KSA9PiB7XG5cdFx0aWYgKHNob3dUaW1lb3V0KVxuXHRcdFx0Y2xlYXJUaW1lb3V0KHNob3dUaW1lb3V0KTtcblxuXHRcdGNvbnN0IGRhdGEgPSBldmVudC5kZXRhaWw7XG5cdFx0c2hvd1RpbWVvdXQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcblx0XHRcdGlucHV0LnN1Z2dlc3Rpb25zKGRhdGEpO1xuXHRcdH0sIFRJTUVPVVRfSU5URVJWQUwpO1xuXHR9KTtcbn07XG5cblxuY29uc3QgZ2V0UmVxdWVzdEVsZW1lbnQgPSAoc2VsZWN0b3IpID0+IHtcblx0dHJ5IHtcblx0XHRsZXQgcmVxdWVzdCA9IGZpbmQoc2VsZWN0b3IpLmZpcnN0KCk7XG5cdFx0aWYgKHJlcXVlc3QgaW5zdGFuY2VvZiBIVE1MUmVxdWVzdEVsZW1lbnQpXG5cdFx0XHRyZXR1cm4gcmVxdWVzdDtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vaWdub3JlXG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IGdldFJlcXVlc3QgPSAoaW5wdXQpID0+IHtcblx0bGV0IHJlcXVlc3QgPSBwcml2YXRlUHJvcGVydHkoaW5wdXQsIFBSSVZBVEVfUkVRVUVTVCk7XG5cdGlmICghcmVxdWVzdCkge1xuXHRcdGNvbnN0IHZhbHVlID0gaW5wdXQuYXR0cihBVFRSSUJVVEVfUkVRVUVTVCk7XG5cdFx0cmVxdWVzdCA9IGdldFJlcXVlc3RFbGVtZW50KHZhbHVlKSB8fCB2YWx1ZTtcblx0XHRwcml2YXRlUHJvcGVydHkoaW5wdXQsIFBSSVZBVEVfUkVRVUVTVCwgcmVxdWVzdCk7XG5cdH1cblxuXHRyZXR1cm4gcmVxdWVzdDtcbn07XG5cbmNvbnN0IGV4ZWN1dGVSZXF1ZXN0ID0gYXN5bmMgKGlucHV0LCB2YWx1ZSkgPT4ge1xuXHRsZXQgcmVxdWVzdCA9IGdldFJlcXVlc3QoaW5wdXQpO1xuXHRjb25zdCBjb250ZXh0ID0geyB2YWx1ZSwgaW5wdXQgfTtcblxuXHRpZiAocmVxdWVzdCBpbnN0YW5jZW9mIEhUTUxSZXF1ZXN0RWxlbWVudClcblx0XHRyZXR1cm4gcmVxdWVzdC5leGVjdXRlKGNvbnRleHQpO1xuXHRlbHNlIGlmICh0eXBlb2YgcmVxdWVzdCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJlcXVlc3QgPSBhd2FpdCBFeHByZXNzaW9uUmVzb2x2ZXIucmVzb2x2ZVRleHQocmVxdWVzdCwgY29udGV4dCk7XG5cdFx0Y29uc3QgdXJsID0gbmV3IFVSTChyZXF1ZXN0LCBsb2NhdGlvbik7XG5cblx0XHRyZXR1cm4gZmV0Y2godXJsLnRvU3RyaW5nKCkpO1xuXHR9XG59O1xuXG5jb25zdCBoYW5kbGVSZXNwb25zZSA9IGFzeW5jIChpbnB1dCwgcmVzcG9uc2UpID0+IHtcblxuXHRpZiAoaW5wdXQuaGFzQXR0cmlidXRlKEFUVFJJQlVURV9SRVNQT05TRV9TVUdHRVNUSU9OUykpXG5cdFx0cmVzcG9uc2UgPSBhd2FpdCBFeHByZXNzaW9uUmVzb2x2ZXIucmVzb2x2ZShpbnB1dC5hdHRyKEFUVFJJQlVURV9SRVNQT05TRV9TVUdHRVNUSU9OUyksIHJlc3BvbnNlLCBbXSk7XG5cblx0Y29uc3QgdGV4dFNlbGVjdG9yID0gaW5wdXQuYXR0cihBVFRSSUJVVEVfU1VHR0VTVElPTl9URVhUKSB8fCBcInRleHRcIjtcblx0Y29uc3QgdmFsdWVTZWxlY3RvciA9IGlucHV0LmF0dHIoQVRUUklCVVRFX1NVR0dFU1RJT05fVkFMVUUpIHx8IFwidmFsdWVcIjtcblxuXHRjb25zdCByZXN1bHQgPSBbXTtcblx0Zm9yIChsZXQgaXRlbSBvZiByZXNwb25zZSkge1xuXG5cdFx0Y29uc3QgdHlwZSA9IHR5cGVvZiBpdGVtO1xuXHRcdGxldCB0ZXh0ID0gbnVsbDtcblx0XHRsZXQgdmFsdWUgPSBudWxsO1xuXG5cdFx0aWYgKHR5cGUgPT09IFwic3RyaW5nXCIgfHwgdHlwZSA9PT0gXCJudW1iZXJcIilcblx0XHRcdHZhbHVlID0gdGV4dCA9IGl0ZW07XG5cdFx0ZWxzZSB7XG5cdFx0XHR0ZXh0ID0gYXdhaXQgRXhwcmVzc2lvblJlc29sdmVyLnJlc29sdmVUZXh0KHRleHRTZWxlY3RvciwgaXRlbSwgbnVsbCk7XG5cdFx0XHR2YWx1ZSA9IGF3YWl0IEV4cHJlc3Npb25SZXNvbHZlci5yZXNvbHZlVGV4dCh2YWx1ZVNlbGVjdG9yLCBpdGVtLCBudWxsKTtcblx0XHR9XG5cdFx0XG5cdFx0cmVzdWx0LnB1c2goe1xuXHRcdFx0dGV4dDogdGV4dCA/IHRleHQgOiB2YWx1ZSxcblx0XHRcdHZhbHVlOiB2YWx1ZSA/IHZhbHVlIDogdGV4dFxuXHRcdH0pXG5cdH1cblxuXHRpbnB1dC50cmlnZ2VyKEVWRU5UX1NIT1dfU1VHR0VTVElPTiwgcmVzdWx0KTtcbn07XG5cbmNvbnN0IGluaXRIYW5kbGVSZXF1ZXN0ID0gKGlucHV0KSA9PiB7XG5cdGlucHV0Lm9uKEVWRU5UX0xPQURfU1VHR0VTVElPTiwgKGV2ZW50KSA9PiB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRjb25zdCB2YWx1ZSA9IGV2ZW50LmRldGFpbDtcblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZXhlY3V0ZVJlcXVlc3QoaW5wdXQsIHZhbHVlKTtcblx0XHRcdHJlc3BvbnNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0cmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVSZXNwb25zZShpbnB1dCwgcmVzcG9uc2UpO1xuXHRcdH0pKCk7XG5cdH0pO1xufTtcblxuY2xhc3MgSFRNTFR5cGVhaGVhZEVsZW1lbnQgZXh0ZW5kcyBIVE1MSW5wdXRFbGVtZW50IHtcblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIEFUVFJJQlVURVM7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IE5PREVOQU1FKCkge1xuXHRcdHJldHVybiBOT0RFTkFNRTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfUkVBRFksIGxhenlQcm9taXNlKCkpO1xuXHRcdGluaXRJbnB1dEhhbmRsZSh0aGlzKTtcblx0XHRpbml0SGFuZGxlU3VnZ2VzdGlvbnModGhpcyk7XG5cblx0fVxuXG5cdGdldCBzZWxmSGFuZGxlU2VsZWN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShBVFRSSUJVVEVfU0VMRl9IQU5ETEVfU0VMRUNUSU9OKTtcblx0fVxuXG5cdHNldCBzZWxmSGFuZGxlU2VsZWN0aW9uKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlKVxuXHRcdFx0dGhpcy5hdHRyKEFUVFJJQlVURV9TRUxGX0hBTkRMRV9TRUxFQ1RJT04sIFwiXCIpO1xuXHRcdGVsc2Vcblx0XHRcdHRoaXMuYXR0cihBVFRSSUJVVEVfU0VMRl9IQU5ETEVfU0VMRUNUSU9OLCBudWxsKTtcblx0fVxuXG5cdGdldCByZWFkeSgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfUkVBRFkpO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRpZiAodGhpcy5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX1JFUVVFU1QpKSB7XG5cdFx0XHRpbml0SGFuZGxlUmVxdWVzdCh0aGlzKTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBzdWdnZXN0aW9ucyhzdWdnZXN0aW9ucykge1xuXHRcdGF3YWl0IHRoaXMucmVhZHk7XHRcdFxuXHRcdGNvbnN0IHN1Z2dlc3Rpb25Cb3ggPSBnZXRTdWdnZXN0aW9uQm94KHRoaXMpO1xuXHRcdGlmIChzdWdnZXN0aW9ucykge1xuXHRcdFx0YXdhaXQgUmVuZGVyZXIucmVuZGVyKHtcblx0XHRcdFx0Y29udGFpbmVyOiBzdWdnZXN0aW9uQm94LFxuXHRcdFx0XHR0ZW1wbGF0ZTogYXdhaXQgREVGQVVMVF9URU1QTEFURSxcblx0XHRcdFx0ZGF0YTogeyBzdWdnZXN0aW9ucyB9XG5cblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgZGVzdHJveSgpIHtcblx0XHRpZiAodGhpcy5yZWFkeS5yZXNvbHZlZCkge1xuXHRcdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfUkVBRFksIGxhenlQcm9taXNlKCkpO1xuXHRcdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfU1VHR0VTVElPTl9CT1gsIG51bGwpO1xuXHRcdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfUkVRVUVTVCwgbnVsbCk7XG5cdFx0fVxuXHR9XG5cblx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0aWYgKHRoaXMub3duZXJEb2N1bWVudCA9PSBkb2N1bWVudCkgKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHRoaXMuaW5pdCh0aGlzKTtcblx0XHRcdHRoaXMucmVhZHkucmVzb2x2ZSgpO1xuXHRcdH0pKCk7XG5cdH1cblxuXHRhZG9wdGVkQ2FsbGJhY2soKSB7XG5cdFx0dGhpcy5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXHRcdGlmIChvbGRWYWx1ZSAhPSBuZXdWYWx1ZSAmJiB0aGlzLmlzQ29ubmVjdGVkKSB7XG5cdFx0XHR0aGlzLnRyaWdnZXIodHJpZ2dlclRpbWVvdXQsIGF0dHJpYnV0ZUNoYW5nZUV2ZW50bmFtZShuYW1lLCB0aGlzKSk7XG5cdFx0XHR0aGlzLnRyaWdnZXIodHJpZ2dlclRpbWVvdXQsIGNvbXBvbmVudEV2ZW50bmFtZShcImNoYW5nZVwiLCB0aGlzKSk7XG5cdFx0fVxuXHR9XG5cblx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0dGhpcy5kZXN0cm95KCk7XG5cdH1cbn07XG5cbmRlZmluZShIVE1MVHlwZWFoZWFkRWxlbWVudCwgeyBleHRlbmRzOiBcImlucHV0XCIgfSlcblxuZXhwb3J0IGRlZmF1bHQgSFRNTFR5cGVhaGVhZEVsZW1lbnQ7IiwiaW1wb3J0IHBhY2sgZnJvbSBcIi4vc3JjXCJcclxuXHJcbmNvbnN0IGdsb2JhbCA9IHdpbmRvdyB8fCBnbG9iYWwgfHwgc2VsZiB8fCB0aGlzIHx8IHt9O1xyXG5nbG9iYWwuZGVmYXVsdGpzID0gZ2xvYmFsLmRlZmF1bHRqcyB8fCB7fTtcclxuZ2xvYmFsLmRlZmF1bHRqcy5pY2FsID0gZ2xvYmFsLmRlZmF1bHRqcy5pY2FsIHx8IHtcclxuXHRWRVJTSU9OIDogXCIke3ZlcnNpb259XCIsXHJcblx0UGFyc2VyIDogcGFjay5QYXJzZXIsXHJcblx0SUNhbGVuZGFyIDogcGFjay5JQ2FsZW5kYXJcclxufTtcclxuXHJcbmlmKHR5cGVvZiBnbG9iYWwuZmV0Y2ggPT09IFwiZnVuY3Rpb25cIiBcclxuXHQmJiB0eXBlb2YgZ2xvYmFsLlJlc3BvbnNlICE9PSBcInVuZGVmaW5lZFwiIFxyXG5cdCYmIHR5cGVvZiBnbG9iYWwuUmVzcG9uc2UucHJvdG90eXBlICE9PSBcInVuZGVmaW5lZFwiIFxyXG5cdCYmIHR5cGVvZiBnbG9iYWwuUmVzcG9uc2UucHJvdG90eXBlLmljYWwgPT09IFwidW5kZWZpbmVkXCIpe1xyXG5cdGdsb2JhbC5SZXNwb25zZS5wcm90b3R5cGUuaWNhbCA9IGZ1bmN0aW9uKGFDb25maWcpe1xyXG5cdFx0cmV0dXJuIHRoaXMudGV4dCgpXHJcblx0XHQudGhlbihmdW5jdGlvbihhVGV4dCl7XHJcblx0XHRcdHJldHVybiBwYWNrLklDYWxlbmRhci5wYXJzZShhVGV4dCwgYUNvbmZpZyk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn07IiwiLy8gcmVxdWlyZWQgdG8gYnVpbGQgdGhlIGludGVybmFsIGVzY2FwZSBmaWx0ZXIgZm9yIHJlZ2V4XG5jb25zdCBSRUdFWENIQVJNQVAgPSBbXCJcXFxcXCIsXCI/XCIsXCJbXCIsIFwiXVwiLCBcIntcIiwgXCJ9XCIsIFwiKFwiLCBcIilcIiwgXCIuXCIsIFwiXlwiLCBcIiRcIl1cblx0Lm1hcChjaGFyID0+IHsgXG5cdFx0cmV0dXJuIHtmOiBuZXcgUmVnRXhwKFwiXFxcXFwiICtjaGFyLCBcImdcIiksIHYgOiBcIlxcXFxcIiArIGNoYXJ9O1xuXHR9KTtcblxuXG5jb25zdCBtYXBwaW5nID0gKGFUZXh0LCB0aGVGaWx0ZXJzKSA9PiB7XG5cdGxldCB0ZXh0ID0gYVRleHQ7XG5cdHRoZUZpbHRlcnMuZm9yRWFjaChpdGVtID0+IHtcblx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKGl0ZW0uZiwgaXRlbS52KTtcblx0fSk7XG5cdHJldHVybiB0ZXh0O1xufTtcblxuY29uc3QgYnVpbGRVbmVzY2FwZUxpc3QgPSAoYUNoYXJNYXAsIGlzQ2FzZVNlbnNpdGl2KSA9PiB7XG5cdGNvbnN0IG9wdGlvbiA9IGlzQ2FzZVNlbnNpdGl2ID8gXCJtZ1wiIDogXCJtZ2lcIjsgXG5cdHJldHVybiBhQ2hhck1hcC5tYXAoaXRlbSA9PiB7XG5cdFx0aWYoIWl0ZW0uYXQgfHwgaXRlbS5hdCA9PSBcInVuZXNjYXBlXCIpXG5cdFx0XHRyZXR1cm4ge2Y6IG5ldyBSZWdFeHAobWFwcGluZyhpdGVtLmVzY2FwZWQsIFJFR0VYQ0hBUk1BUCksIG9wdGlvbiksIHY6IGl0ZW0uY2hhcn1cblx0fSkuZmlsdGVyKGl0ZW0gPT4gISFpdGVtKTtcbn07XG5cbmNvbnN0IGJ1aWxkRXNjYXBlTGlzdCA9IChhQ2hhck1hcCwgaXNDYXNlU2Vuc2l0aXYpID0+IHtcblx0Y29uc3Qgb3B0aW9uID0gaXNDYXNlU2Vuc2l0aXYgPyBcIm1nXCIgOiBcIm1naVwiOyBcblx0cmV0dXJuIGFDaGFyTWFwLm1hcChpdGVtID0+IHtcblx0XHRpZighaXRlbS5hdCB8fCBpdGVtLmF0ID09IFwiZXNjYXBlXCIpXG5cdFx0XHRyZXR1cm4ge2Y6IG5ldyBSZWdFeHAobWFwcGluZyhpdGVtLmNoYXIsUkVHRVhDSEFSTUFQKSwgb3B0aW9uKSwgdjogaXRlbS5lc2NhcGVkfVxuXHR9KS5maWx0ZXIoaXRlbSA9PiAhIWl0ZW0pO1xufTtcbmNsYXNzIEVzY2FwZXIge1xuXHRjb25zdHJ1Y3Rvcihlc2NhcGVNYXAsIGlzQ2FzZVNlbnNpdGl2KXtcblx0XHR0aGlzLmVzY2FwZU1hcCA9IGJ1aWxkRXNjYXBlTGlzdChlc2NhcGVNYXAsIGlzQ2FzZVNlbnNpdGl2KVxuXHRcdHRoaXMudW5lc2NhcGVNYXAgPSBidWlsZFVuZXNjYXBlTGlzdChlc2NhcGVNYXAsIGlzQ2FzZVNlbnNpdGl2KVxuXHR9XG5cdFxuXHRlc2NhcGUoYVRleHQpe1xuXHRcdHJldHVybiBtYXBwaW5nKGFUZXh0LCB0aGlzLmVzY2FwZU1hcCk7XG5cdH1cblx0XG5cdHVuZXNjYXBlKGFUZXh0KXtcblx0XHRyZXR1cm4gbWFwcGluZyhhVGV4dCwgdGhpcy51bmVzY2FwZU1hcCk7XG5cdH1cblx0XG5cdHN0YXRpYyBSRUdFWFBfRVNDQVBFUigpe1xuXHRcdHJldHVybiBuZXcgRXNjYXBlcihbXG5cdFx0XHR7Y2hhcjogXCJcXFxcXCIsIGVzY2FwZWQgOiBcIlxcXFxcXFxcXCJ9LFxuXHRcdFx0e2NoYXI6IFwiP1wiLCBlc2NhcGVkIDogXCJcXFxcP1wifSxcblx0XHRcdHtjaGFyOiBcIltcIiwgZXNjYXBlZCA6IFwiXFxcXFtcIn0sXG5cdFx0XHR7Y2hhcjogXCJdXCIsIGVzY2FwZWQgOiBcIlxcXFxdXCJ9LFxuXHRcdFx0e2NoYXI6IFwie1wiLCBlc2NhcGVkIDogXCJcXFxce1wifSxcblx0XHRcdHtjaGFyOiBcIn1cIiwgZXNjYXBlZCA6IFwiXFxcXH1cIn0sXG5cdFx0XHR7Y2hhcjogXCIoXCIsIGVzY2FwZWQgOiBcIlxcXFwoXCJ9LFxuXHRcdFx0e2NoYXI6IFwiKVwiLCBlc2NhcGVkIDogXCJcXFxcKVwifSxcblx0XHRcdHtjaGFyOiBcIi5cIiwgZXNjYXBlZCA6IFwiXFxcXC5cIn0sXG5cdFx0XHR7Y2hhcjogXCJeXCIsIGVzY2FwZWQgOiBcIlxcXFxeXCJ9LFxuXHRcdFx0e2NoYXI6IFwiJFwiLCBlc2NhcGVkIDogXCJcXFxcJFwifVxuXHRcdF0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVzY2FwZXI7XG5cbiIsIlxyXG4vKipcclxuICogYXBwZW5kIGEgcHJvcGVyeSB2YWx1ZSB0byBhbiBvYmplY3QuIElmIHByb3BlcnkgZXhpc3RzIGl0cyB3b3VsZCBiZSBjb252ZXJ0ZWQgdG8gYW4gYXJyYXlcclxuICogXHJcbiAqICBAcGFyYW0gYUtleTpzdHJpbmcgbmFtZSBvZiBwcm9wZXJ0eVxyXG4gKiAgQHBhcmFtIGFEYXRhOmFueSBwcm9wZXJ0eSB2YWx1ZVxyXG4gKiAgQHBhcmFtIGFPYmplY3Q6b2JqZWN0IHRoZSBvYmplY3QgdG8gYXBwZW5kIHRoZSBwcm9wZXJ0eVxyXG4gKiAgXHJcbiAqICBAcmV0dXJuIHJldHVybnMgdGhlIGNoYW5nZWQgb2JqZWN0XHJcbiAqL1xyXG5jb25zdCBhcHBlbmQgPSBmdW5jdGlvbihhS2V5LCBhRGF0YSwgYU9iamVjdCl7XHJcblx0aWYodHlwZW9mIGFEYXRhICE9PSBcInVuZGVmaW5lZFwiKXtcdFx0XHJcblx0XHRjb25zdCBrZXkgPSBhS2V5LnRvTG93ZXJDYXNlKCkudHJpbSgpO1x0XHJcblx0XHRpZih0eXBlb2YgYU9iamVjdFtrZXldID09PSBcInVuZGVmaW5lZFwiKVxyXG5cdFx0XHRhT2JqZWN0W2tleV0gPSBhRGF0YTtcclxuXHRcdGVsc2V7XHRcdFxyXG5cdFx0XHRjb25zdCBkYXRhID0gYU9iamVjdFtrZXldO1xyXG5cdFx0XHRpZihkYXRhIGluc3RhbmNlb2YgQXJyYXkpXHJcblx0XHRcdFx0ZGF0YS5wdXNoKGFEYXRhKTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGFPYmplY3Rba2V5XSA9IFthT2JqZWN0W2tleV0sIGFEYXRhXTtcclxuXHRcdH1cclxuXHR9XHRcclxuXHRyZXR1cm4gYU9iamVjdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBjaGVja2VkIGlmIGFuIG9iamVjdCBhIHNpbXBsZSBvYmplY3QuIE5vIEFycmF5LCBNYXAgb3Igc29tZXRoaW5nIGVsc2UuXHJcbiAqIFxyXG4gKiBAcGFyYW0gYU9iamVjdDpvYmplY3QgdGhlIG9iamVjdCB0byBiZSB0ZXN0aW5nXHJcbiAqIFxyXG4gKiBAcmV0dXJuIGJvb2xlYW5cclxuICovXHJcbmNvbnN0IGlzUG9qbyA9IGZ1bmN0aW9uKGFPYmplY3Qpe1xyXG5cdHJldHVybiB0eXBlb2YgYU9iamVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhT2JqZWN0ICE9IG51bGwgJiYgYU9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBtZXJnaW5nIG9iamVjdCBpbnRvIGEgdGFyZ2V0IG9iamVjdC4gSXRzIG9ubHkgbWVyZ2Ugc2ltcGxlIG9iamVjdCBhbmQgc3ViIG9iamVjdHMuIEV2ZXJ5IG90aGVyIFxyXG4gKiB2YWx1ZSB3b3VsZCBiZSByZXBsYWNlZCBieSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2Ugb2JqZWN0LlxyXG4gKiBcclxuICogc2FtcGxlOiBtZXJnZSh0YXJnZXQsIHNvdXJjZS0xLCBzb3VyY2UtMiwgLi4uc291cmNlLW4pXHJcbiAqIFxyXG4gKiBAcGFyYW0gYVRhcmdldDpvYmplY3QgdGhlIHRhcmdldCBvYmplY3QgdG8gbWVyZ2luZyBpbnRvXHJcbiAqIEBwYXJhbSBhU291cmNlczpvYmplY3RcclxuICogXHJcbiAqIEByZXR1cm4gb2JqZWN0IHJldHVybnMgdGhlIHRhcmdldCBvYmplY3RcclxuICovXHJcbmNvbnN0IG1lcmdlID0gZnVuY3Rpb24oYVRhcmdldCl7XHRcclxuXHRmb3IobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKXtcclxuXHRcdGNvbnN0IHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkuZm9yRWFjaChhS2V5ID0+IHtcclxuXHRcdFx0aWYoaXNQb2pvKGFUYXJnZXRbYUtleV0pKVxyXG5cdFx0XHRcdG1lcmdlKGFUYXJnZXRbYUtleV0sIHNvdXJjZVthS2V5XSk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRhVGFyZ2V0W2FLZXldID0gc291cmNlW2FLZXldO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBhVGFyZ2V0O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0aXNQb2pvIDogaXNQb2pvLFxyXG5cdGFwcGVuZDogYXBwZW5kLFxyXG5cdG1lcmdlIDogbWVyZ2VcclxufTsiLCJpbXBvcnQgRXNjYXBlciBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvRXNjYXBlclwiO1xyXG5cclxuLy9jb25zdCBSRUdFWF9LRVkgPSAvXihbXlxcczo7XSspKDsoW146XSspKT86KC4rKSQvO1xyXG5jb25zdCBSRUdFWF9WQUxVRUxJTkUgPSAvXlxccyguKykkLztcclxuXHJcbmNvbnN0IEtFWV9WQUxVRV9TUExJVCA9IC86LztcclxuY29uc3QgUEFSQU1fU1BMSVQgPSAvOy87XHJcbmNvbnN0IFBBUkFNX1ZBTFVFX1NQTElUID0gLz0vO1xyXG5cclxuY29uc3QgRVNDQVBFUiA9IG5ldyBFc2NhcGVyKFtcclxuXHR7Y2hhcjogXCIsXCIsIGVzY2FwZWQ6XCJcXFxcLFwifSxcclxuXHR7Y2hhcjogXCI7XCIsIGVzY2FwZWQ6XCJcXFxcO1wifSxcclxuXHR7Y2hhcjogXCI6XCIsIGVzY2FwZWQ6XCJcXFxcOlwifSxcclxuXSk7XHJcblxyXG5cclxuY29uc3QgZ2V0UGFyYW1ldGVyID0gZnVuY3Rpb24oYVRleHQpe1xyXG5cdGlmKGFUZXh0ID09IG51bGwgfHwgdHlwZW9mIGFUZXh0ID09PSBcInVuZGVmaW5lZFwiKVxyXG5cdFx0cmV0dXJuO1xyXG5cdGNvbnN0IGl0ZW1zID0gYVRleHQuc3BsaXQoUEFSQU1fU1BMSVQpO1xyXG5cdGNvbnN0IHBhcmFtcyA9IHt9O1xyXG5cdGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoUEFSQU1fVkFMVUVfU1BMSVQpO1xyXG5cdFx0cGFyYW1zW3BhcnRzWzBdLnRvTG93ZXJDYXNlKCldID0gcGFydHNbMV07XHJcblx0fSlcclxuXHRcclxuXHRyZXR1cm4gcGFyYW1zO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0VmFsdWUgPSBmdW5jdGlvbihhVmFsdWUsIGFUb2tlbml6ZXIpe1xyXG5cdGxldCB2YWx1ZSA9IGFWYWx1ZTtcclxuXHRsZXQgbWF0Y2ggPSBSRUdFWF9WQUxVRUxJTkUuZXhlYyhhVG9rZW5pemVyLmxpbmVzKClbYVRva2VuaXplci5pbmRleCgpICsgMV0pO1xyXG5cdHdoaWxlKG1hdGNoICE9IG51bGwgJiYgdHlwZW9mIG1hdGNoICE9PSBcInVuZGVmaW5lZFwiICYmIG1hdGNoLmxlbmd0aCA+IDApe1x0XHRcclxuXHRcdHZhbHVlICs9IG1hdGNoWzFdO1xyXG5cdFx0YVRva2VuaXplci5za2lwKCk7XHJcblx0XHRtYXRjaCA9IFJFR0VYX1ZBTFVFTElORS5leGVjKGFUb2tlbml6ZXIubGluZXMoKVthVG9rZW5pemVyLmluZGV4KCkgKyAxXSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBFU0NBUEVSLnVuZXNjYXBlKHZhbHVlKTtcclxufTtcclxuXHJcblxyXG5jb25zdCBEZXNlcmlhbGl6ZXIgPSBmdW5jdGlvbihhTGluZSwgYVRva2VuaXplcil7XHJcblx0bGV0IGluZGV4ID0gYUxpbmUuc2VhcmNoKEtFWV9WQUxVRV9TUExJVCk7XHJcblx0aWYoaW5kZXggPT0gLTEpXHJcblx0XHRyZXR1cm47XHJcblx0XHJcblx0Y29uc3QgcmVzdWx0ID0ge1xyXG5cdFx0XHRrZXkgOiBhTGluZS5zdWJzdHJpbmcoMCwgaW5kZXgpLFxyXG5cdFx0XHR2YWx1ZSA6IGdldFZhbHVlKGFMaW5lLnN1YnN0cmluZyhpbmRleCArIDEpLCBhVG9rZW5pemVyKVxyXG5cdH07XHJcblx0XHJcblx0aW5kZXggPSByZXN1bHQua2V5LnNlYXJjaChQQVJBTV9TUExJVCk7XHJcblx0aWYoaW5kZXggIT0gLTEpe1xyXG5cdFx0cmVzdWx0LnBhcmFtZXRlciA9IGdldFBhcmFtZXRlcihyZXN1bHQua2V5LnN1YnN0cmluZyhpbmRleCArIDEpKTtcclxuXHRcdHJlc3VsdC5rZXkgPSByZXN1bHQua2V5LnN1YnN0cmluZygwLCBpbmRleCk7XHJcblx0fVxyXG5cdFx0XHJcblx0XHJcblx0cmV0dXJuIHJlc3VsdFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGVzZXJpYWxpemVyOyIsImltcG9ydCBwYXJzZSBmcm9tIFwiLi9QYXJzZXJcIjtcclxuaW1wb3J0IE9iamVjdFV0aWxzIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9PYmplY3RVdGlsc1wiO1xyXG5cclxuXHJcbmNvbnN0IERBVEVUSU1FID0gLyhcXGR7NH0pKFxcZHsyfSkoXFxkezJ9KVQoXFxkezJ9KShcXGR7Mn0pKFxcZHsyfSkvO1xyXG5jb25zdCB0b0RhdGVUaW1lID0gYVRva2VuID0+IHtcclxuXHRjb25zdCBtYXRjaCA9IERBVEVUSU1FLmV4ZWMoYVRva2VuLnZhbHVlKTtcclxuXHRpZighbWF0Y2gpXHJcblx0XHRyZXR1cm4gYVRva2VuLnZhbHVlO1xyXG5cdHJldHVybiBuZXcgRGF0ZShwYXJzZUludChtYXRjaFsxXSlcclxuXHRcdFx0LHBhcnNlSW50KG1hdGNoWzJdKVxyXG5cdFx0XHQscGFyc2VJbnQobWF0Y2hbM10pXHJcblx0XHRcdCxwYXJzZUludChtYXRjaFs0XSlcclxuXHRcdFx0LHBhcnNlSW50KG1hdGNoWzVdKVxyXG5cdFx0XHQscGFyc2VJbnQobWF0Y2hbNl0pKTtcclxufTtcclxuXHJcbmNvbnN0IGRlZmF1bHRjb25maWcgPSB7XHJcblx0b25seVByb3BlcnR5VmFsdWVzOiB0cnVlLFxyXG5cdHByb3BlcnR5cGFyc2VyIDoge1xyXG5cdFx0b3JnYW5pemVyIDogYVRva2VuID0+IHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRuYW1lIDogLyhbXlwiXSspL2kuZXhlYyhhVG9rZW4ucGFyYW1ldGVyW1wiY25cIl0pWzFdLFxyXG5cdFx0XHRcdG1haWwgOiAvXihtYWlsdG86KT8oLispJC9pLmV4ZWMoYVRva2VuLnZhbHVlKVsyXVx0XHRcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblx0XHRkdHN0YXJ0IDogdG9EYXRlVGltZSxcclxuXHRcdGR0ZW5kIDogdG9EYXRlVGltZVxyXG5cdH1cclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkQ29uZmlnID0gZnVuY3Rpb24oYUNvbmZpZyl7XHJcblx0aWYodHlwZW9mIGFDb25maWcgPT09IFwidW5kZWZpbmVkXCIgfHwgYUNvbmZpZyA9PSBudWxsKVxyXG5cdFx0cmV0dXJuIGRlZmF1bHRjb25maWc7XHJcblx0XHJcblx0cmV0dXJuIE9iamVjdFV0aWxzLm1lcmdlKHt9LCBkZWZhdWx0Y29uZmlnLCBhQ29uZmlnKTtcclxufTtcclxuXHJcblxyXG5cclxuY29uc3QgUGFyc2VyID0ge1xyXG5cdHBhcnNlIDogKGFUZXh0LCBhQ29uZmlnKSA9PiB7XHJcblx0XHRyZXR1cm4gcGFyc2UoYVRleHQsIGJ1aWxkQ29uZmlnKGFDb25maWcpKTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYXJzZXI7XHJcblxyXG4iLCJpbXBvcnQgVG9rZW5pemVyIGZyb20gXCIuL1Rva2VuaXplclwiO1xyXG5pbXBvcnQgT2JqZWN0VXRpbHMgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL09iamVjdFV0aWxzXCI7XHJcblxyXG5jb25zdCBCRUdJTl9UT0tFTiA9IC9eYmVnaW4kL2k7XHJcbmNvbnN0IEVORF9UT0tFTiA9IC9eZW5kJC9pO1xyXG5cclxuY29uc3QgcGFyc2VQcm9wZXJ0eSA9IGZ1bmN0aW9uKGFUb2tlbiwgYUNvbmZpZyl7XHJcblx0dHJ5e1xyXG5cdFx0Y29uc3Qga2V5ID0gYVRva2VuLmtleS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0aWYodHlwZW9mIGFDb25maWcucHJvcGVydHlwYXJzZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGFDb25maWcucHJvcGVydHlwYXJzZXJba2V5XSA9PT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYUNvbmZpZy5wcm9wZXJ0eXBhcnNlcltrZXldKGFUb2tlbik7XHJcblx0XHRcdGlmKHR5cGVvZiByZXN1bHQgIT09IFwidW5kZWZpbmVkXCIpXHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UgPyByZXN1bHQgOiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcclxuXHRcdH1cclxuXHR9Y2F0Y2ggKGUpe1xyXG5cdFx0Y29uc29sZS5lcnJvcihlKVxyXG5cdH1cclxuXHRcclxuXHRpZihhQ29uZmlnLm9ubHlQcm9wZXJ0eVZhbHVlcylcclxuXHRcdHJldHVybiAgUHJvbWlzZS5yZXNvbHZlKGFUb2tlbi52YWx1ZSk7XHRcclxuXHRlbHNlXHRcclxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xyXG5cdFx0XHRcIl90eXBlX1wiIDogXCJwcm9wZXJ0eVwiLFxyXG5cdFx0XHRcInBhcmFtZXRlclwiIDogYVRva2VuLnBhcmFtZXRlcixcclxuXHRcdFx0XCJ2YWx1ZVwiIDogYVRva2VuLnZhbHVlXHJcblx0XHR9KTtcclxufTtcclxuXHJcbmNvbnN0IHBhcnNlVG9rZW4gPSBmdW5jdGlvbihhVG9rZW4sIGFUb2tlbml6ZXIsIGFDb25maWcsIGFDb250ZXh0KXtcdFxyXG5cdGlmKEVORF9UT0tFTi50ZXN0KGFUb2tlbi5rZXkpKVxyXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShhQ29udGV4dCk7XHJcblx0ZWxzZSBpZihCRUdJTl9UT0tFTi50ZXN0KGFUb2tlbi5rZXkpKVxyXG5cdFx0cmV0dXJuIHBhcnNlKGFUb2tlbml6ZXIsIGFDb25maWcsIHt9KVxyXG5cdFx0LnRoZW4ocmVzdWx0ID0+IHtcclxuXHRcdFx0aWYodHlwZW9mIGFDb250ZXh0ID09PSBcInVuZGVmaW5lZFwiKVxyXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcclxuXHRcdFx0XHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBPYmplY3RVdGlscy5hcHBlbmQoYVRva2VuLnZhbHVlLnRvTG93ZXJDYXNlKCksIHJlc3VsdCwgYUNvbnRleHQpO1xyXG5cdFx0XHRyZXR1cm4gcGFyc2UoYVRva2VuaXplciwgYUNvbmZpZywgY29udGV4dCk7XHJcblx0XHR9KTtcclxuXHQgZWxzZSB7XHJcblx0XHRyZXR1cm4gcGFyc2VQcm9wZXJ0eShhVG9rZW4sIGFDb25maWcpXHJcblx0XHQudGhlbih2YWx1ZSA9PiBPYmplY3RVdGlscy5hcHBlbmQoYVRva2VuLmtleS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSwgYUNvbnRleHQpKVxyXG5cdFx0LnRoZW4oY29udGV4dCA9PiBwYXJzZShhVG9rZW5pemVyLCBhQ29uZmlnLCBjb250ZXh0KSk7XHJcblx0fVxyXG59O1xyXG5cclxuY29uc3QgcGFyc2UgPSBmdW5jdGlvbihhVG9rZW5pemVyLCBhQ29uZmlnLCBhQ29udGV4dCl7XHJcblx0cmV0dXJuIGFUb2tlbml6ZXIubmV4dCgpXHJcblx0LnRoZW4oYVRva2VuID0+IHtcclxuXHRcdGlmKGFUb2tlbilcclxuXHRcdFx0cmV0dXJuIHBhcnNlVG9rZW4oYVRva2VuLCBhVG9rZW5pemVyLCBhQ29uZmlnLCBhQ29udGV4dCk7XHJcblx0XHRcdFxyXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShhQ29udGV4dCk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5cclxuY29uc3QgUGFyc2VyID0gZnVuY3Rpb24oYVRleHQsIGFDb25maWcpe1xyXG5cdHJldHVybiBwYXJzZShuZXcgVG9rZW5pemVyKGFUZXh0KSwgKGFDb25maWcgfHwge30pKVxyXG5cdFx0LnRoZW4oYVJlc3VsdCA9PiB7XHJcblx0XHRcdGlmKHR5cGVvZiBhQ29uZmlnLm1hcCA9PT0gXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoYUNvbmZpZy5tYXAoYVJlc3VsdCkpO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShhUmVzdWx0KTtcclxuXHRcdH0pO1xyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBQYXJzZXI7IiwiaW1wb3J0IERlc2VyaWFsaXplciBmcm9tIFwiLi9EZXNlcmlhbGl6ZXJcIjtcclxuXHJcbmNvbnN0IFRva2VuaXplciA9IGZ1bmN0aW9uKHRoZUxpbmVzLCBhSW5kZXgpe1xyXG5cdGNvbnN0IGxpbmVzID0gdGhlTGluZXM7XHJcblx0bGV0IGluZGV4ID0gYUluZGV4IHx8IC0xO1xyXG5cdGxldCB0b2tlbiA9IG51bGw7XHJcblx0cmV0dXJuIHtcclxuXHRcdHJlc2V0IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0aW5kZXggPSAtMTtcclxuXHRcdH0sXHJcblx0XHRza2lwIDogZnVuY3Rpb24obGVuZ3RoKXtcclxuXHRcdFx0aW5kZXggKz0gKGxlbmd0aCB8fCAxKTtcclxuXHRcdH0sXHJcblx0XHRpbmRleCA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiBpbmRleDtcclxuXHRcdH0sXHJcblx0XHR0b2tlbiA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiBtYXRjaDtcclxuXHRcdH0sXHJcblx0XHRsaW5lcyA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiBsaW5lcztcclxuXHRcdH0sXHJcblx0XHRuZXh0IDogZnVuY3Rpb24oKXtcdFx0XHRcclxuXHRcdFx0aW5kZXgrKztcclxuXHRcdFx0aWYoaW5kZXggPCBsaW5lcy5sZW5ndGgpXHJcblx0XHRcdFx0dG9rZW4gPSBEZXNlcmlhbGl6ZXIobGluZXNbaW5kZXhdLCB0aGlzKTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRva2VuID0gbnVsbDtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodG9rZW4pO1xyXG5cdFx0fSxcclxuXHRcdGNsb25lIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBUb2tlbml6ZXIobGluZXMsIGluZGV4KTtcclxuXHRcdH1cclxuXHR9O1x0XHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGFUZXh0KXtcclxuXHRyZXR1cm4gbmV3IFRva2VuaXplcihhVGV4dC5zcGxpdCgvXFxyP1xcbi9nKS5maWx0ZXIobGluZSA9PiBsaW5lLnRyaW0oKS5sZW5ndGggPiAwKSlcclxufTsiLCJpbXBvcnQgUGFyc2VyIGZyb20gXCIuL1BhcnNlclwiO1xyXG5pbXBvcnQgSUNhbGVuZGFyIGZyb20gXCIuL0lDYWxlbmRhclwiO1xyXG5cclxuY29uc3QgcGFjayA9IHtcclxuXHRQYXJzZXIgOiBQYXJzZXIsXHJcblx0SUNhbGVuZGFyIDogSUNhbGVuZGFyXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwYWNrOyIsImltcG9ydCBHTE9CQUwgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL0dsb2JhbC5qc1wiO1xuaW1wb3J0IHtUZW1wbGF0ZSwgUmVuZGVyZXJ9IGZyb20gXCIuL2luZGV4LmpzXCJcblxuR0xPQkFMLmRlZmF1bHRqcyA9IEdMT0JBTC5kZWZhdWx0anMgfHwge307XG5HTE9CQUwuZGVmYXVsdGpzLmpzdGwgPSBHTE9CQUwuZGVmYXVsdGpzLnRsID0gR0xPQkFMLmRlZmF1bHRqcy50bCB8fCB7XG5cdFZFUlNJT04gOiBcIiR7dmVyc2lvbn1cIixcblx0VGVtcGxhdGU6IFRlbXBsYXRlLFxuXHRSZW5kZXJlcjogUmVuZGVyZXJcbn07IiwiaW1wb3J0IFRlbXBsYXRlIGZyb20gXCIuL3NyYy9UZW1wbGF0ZS5qc1wiO1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gXCIuL3NyYy9SZW5kZXJlci5qc1wiO1xuXG5leHBvcnQge1RlbXBsYXRlLCBSZW5kZXJlcn07IiwiY29uc3QgR0xPQkFMID0gKCgpID0+IHtcclxuXHRpZih0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZ2xvYmFsO1xyXG5cdGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHJldHVybiB3aW5kb3c7XHRcclxuXHRpZih0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIHNlbGY7XHJcblx0cmV0dXJuIHt9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgR0xPQkFMOyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE9iamVjdFByb3BlcnR5IHtcclxuXHRjb25zdHJ1Y3RvcihrZXksIGNvbnRleHQpe1xyXG5cdFx0dGhpcy5rZXkgPSBrZXk7XHJcblx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG5cdH1cclxuXHRcclxuXHRnZXQga2V5RGVmaW5lZCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMua2V5IGluIHRoaXMuY29udGV4dDsgXHJcblx0fVxyXG5cdFxyXG5cdGdldCBoYXNWYWx1ZSgpe1xyXG5cdFx0cmV0dXJuICEhdGhpcy5jb250ZXh0W3RoaXMua2V5XTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHZhbHVlKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5jb250ZXh0W3RoaXMua2V5XTtcclxuXHR9XHJcblx0XHJcblx0c2V0IHZhbHVlKGRhdGEpe1xyXG5cdFx0dGhpcy5jb250ZXh0W3RoaXMua2V5XSA9IGRhdGE7XHJcblx0fVxyXG5cdFxyXG5cdHNldCBhcHBlbmQoZGF0YSkge1xyXG5cdFx0aWYoIXRoaXMuaGFzVmFsdWUpXHJcblx0XHRcdHRoaXMudmFsdWUgPSBkYXRhO1xyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0aWYodmFsdWUgaW5zdGFuY2VvZiBBcnJheSlcclxuXHRcdFx0XHR2YWx1ZS5wdXNoKGRhdGEpO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy52YWx1ZSA9IFt0aGlzLnZhbHVlLCBkYXRhXTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlKCl7XHJcblx0XHRkZWxldGUgdGhpcy5jb250ZXh0W3RoaXMua2V5XTtcclxuXHR9XHJcblx0XHJcblx0c3RhdGljIGxvYWQoZGF0YSwga2V5LCBjcmVhdGU9dHJ1ZSkge1xyXG5cdFx0bGV0IGNvbnRleHQgPSBkYXRhO1xyXG5cdFx0Y29uc3Qga2V5cyA9IGtleS5zcGxpdChcIlxcLlwiKTtcclxuXHRcdGxldCBuYW1lID0ga2V5cy5zaGlmdCgpLnRyaW0oKTtcclxuXHRcdHdoaWxlKGtleXMubGVuZ3RoID4gMCl7XHJcblx0XHRcdGlmKCFjb250ZXh0W25hbWVdKXtcclxuXHRcdFx0XHRpZighY3JlYXRlKVxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y29udGV4dFtuYW1lXSA9IHt9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGNvbnRleHQgPSBjb250ZXh0W25hbWVdO1xyXG5cdFx0XHRuYW1lID0ga2V5cy5zaGlmdCgpLnRyaW0oKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIG5ldyBPYmplY3RQcm9wZXJ0eShuYW1lLCBjb250ZXh0KTtcclxuXHR9XHJcbn07IiwiaW1wb3J0IE9iamVjdFByb3BlcnR5IGZyb20gXCIuL09iamVjdFByb3BlcnR5LmpzXCI7XHJcbi8qKlxyXG4gKiBhcHBlbmQgYSBwcm9wZXJ5IHZhbHVlIHRvIGFuIG9iamVjdC4gSWYgcHJvcGVyeSBleGlzdHMgaXRzIHdvdWxkIGJlIGNvbnZlcnRlZCB0byBhbiBhcnJheVxyXG4gKlxyXG4gKiAgQHBhcmFtIGFLZXk6c3RyaW5nIG5hbWUgb2YgcHJvcGVydHlcclxuICogIEBwYXJhbSBhRGF0YTphbnkgcHJvcGVydHkgdmFsdWVcclxuICogIEBwYXJhbSBhT2JqZWN0Om9iamVjdCB0aGUgb2JqZWN0IHRvIGFwcGVuZCB0aGUgcHJvcGVydHlcclxuICpcclxuICogIEByZXR1cm4gcmV0dXJucyB0aGUgY2hhbmdlZCBvYmplY3RcclxuICovXHJcbmV4cG9ydCBjb25zdCBhcHBlbmQgPSBmdW5jdGlvbiAoYUtleSwgYURhdGEsIGFPYmplY3QpIHtcclxuXHRpZiAodHlwZW9mIGFEYXRhICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRjb25zdCBwcm9wZXJ0eSA9IE9iamVjdFByb3BlcnR5LmxvYWQoYU9iamVjdCwgYUtleSwgdHJ1ZSk7XHJcblx0XHRwcm9wZXJ0eS5hcHBlbmQgPSBhRGF0YTtcclxuXHR9XHJcblx0cmV0dXJuIGFPYmplY3Q7XHJcbn07XHJcblxyXG4vKipcclxuICogY2hlY2tlZCBpZiBhbiBvYmplY3QgYSBzaW1wbGUgb2JqZWN0LiBObyBBcnJheSwgTWFwIG9yIHNvbWV0aGluZyBlbHNlLlxyXG4gKlxyXG4gKiBAcGFyYW0gYU9iamVjdDpvYmplY3QgdGhlIG9iamVjdCB0byBiZSB0ZXN0aW5nXHJcbiAqXHJcbiAqIEByZXR1cm4gYm9vbGVhblxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGlzUG9qbyA9IGZ1bmN0aW9uIChhT2JqZWN0KSB7XHJcblx0cmV0dXJuIHR5cGVvZiBhT2JqZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIGFPYmplY3QgIT0gbnVsbCAmJiBhT2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiT2JqZWN0XCI7XHJcbn07XHJcblxyXG4vKipcclxuICogbWVyZ2luZyBvYmplY3QgaW50byBhIHRhcmdldCBvYmplY3QuIEl0cyBvbmx5IG1lcmdlIHNpbXBsZSBvYmplY3QgYW5kIHN1YiBvYmplY3RzLiBFdmVyeSBvdGhlclxyXG4gKiB2YWx1ZSB3b3VsZCBiZSByZXBsYWNlZCBieSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2Ugb2JqZWN0LlxyXG4gKlxyXG4gKiBzYW1wbGU6IG1lcmdlKHRhcmdldCwgc291cmNlLTEsIHNvdXJjZS0yLCAuLi5zb3VyY2UtbilcclxuICpcclxuICogQHBhcmFtIGFUYXJnZXQ6b2JqZWN0IHRoZSB0YXJnZXQgb2JqZWN0IHRvIG1lcmdpbmcgaW50b1xyXG4gKiBAcGFyYW0gYVNvdXJjZXM6b2JqZWN0XHJcbiAqXHJcbiAqIEByZXR1cm4gb2JqZWN0IHJldHVybnMgdGhlIHRhcmdldCBvYmplY3RcclxuICovXHJcbmV4cG9ydCBjb25zdCBtZXJnZSA9IGZ1bmN0aW9uIChhVGFyZ2V0KSB7XHJcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkuZm9yRWFjaCgoYUtleSkgPT4ge1xyXG5cdFx0XHRpZiAoaXNQb2pvKGFUYXJnZXRbYUtleV0pKSBtZXJnZShhVGFyZ2V0W2FLZXldLCBzb3VyY2VbYUtleV0pO1xyXG5cdFx0XHRlbHNlIGFUYXJnZXRbYUtleV0gPSBzb3VyY2VbYUtleV07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBhVGFyZ2V0O1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRQcm9wZXJ0eUZpbHRlciA9IGZ1bmN0aW9uICh7IG5hbWVzLCBhbGxvd2VkIH0pIHtcclxuXHRyZXR1cm4gKG5hbWUsIHZhbHVlLCBjb250ZXh0KSA9PiB7XHJcblx0XHRyZXR1cm4gbmFtZXMuaW5jbHVkZXMobmFtZSkgPT09IGFsbG93ZWQ7XHJcblx0fTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0Y29uc3QgW2RhdGEsIHByb3BGaWx0ZXIsIHsgZGVlcCA9IGZhbHNlLCByZWN1cnNpdmUgPSB0cnVlLCBwYXJlbnRzID0gW10gfSA9IHt9XSA9IGFyZ3VtZW50cztcclxuXHRjb25zdCByZXN1bHQgPSB7fTtcclxuXHJcblx0Zm9yIChsZXQgbmFtZSBpbiBkYXRhKSB7XHJcblx0XHRjb25zdCB2YWx1ZSA9IGRhdGFbbmFtZV07XHJcblx0XHRjb25zdCBhY2NlcHQgPSBwcm9wRmlsdGVyKG5hbWUsIHZhbHVlLCBkYXRhKTtcclxuXHRcdGlmIChhY2NlcHQgJiYgKCFkZWVwIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpKSByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcclxuXHRcdGVsc2UgaWYgKGFjY2VwdCAmJiBkZWVwKSB7XHJcblx0XHRcdGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWU7XHJcblx0XHRcdGlmICh0eXBlICE9PSBcIm9iamVjdFwiIHx8IHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgfHwgdmFsdWUgaW5zdGFuY2VvZiBNYXAgfHwgdmFsdWUgaW5zdGFuY2VvZiBTZXQgfHwgdmFsdWUgaW5zdGFuY2VvZiBSZWdFeHAgfHwgcGFyZW50cy5pbmNsdWRlc1t2YWx1ZV0gfHwgdmFsdWUgPT0gZGF0YSkgcmVzdWx0W25hbWVdID0gdmFsdWU7XHJcblx0XHRcdGVsc2UgcmVzdWx0W25hbWVdID0gZmlsdGVyKHZhbHVlLCBwcm9wRmlsdGVyLCB7IGRlZXAsIHJlY3Vyc2l2ZSwgcGFyZW50czogcGFyZW50cy5jb25jYXQoZGF0YSkgfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZlZhbHVlID0gKG8sIG5hbWUsIHZhbHVlKSA9PiB7XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIG5hbWUsIHtcclxuXHRcdHZhbHVlLFxyXG5cdFx0d3JpdGFibGU6IGZhbHNlLFxyXG5cdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcclxuXHRcdGVudW1lcmFibGU6IGZhbHNlXHJcblx0fSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBkZWZHZXQgPSAobywgbmFtZSwgZ2V0KSA9PiB7XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIG5hbWUsIHtcclxuXHRcdGdldCxcclxuXHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcblx0XHRlbnVtZXJhYmxlOiBmYWxzZVxyXG5cdH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZkdldFNldCA9IChvLCBuYW1lLCBnZXQsIHNldCkgPT4ge1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBuYW1lLCB7XHJcblx0XHRnZXQsXHJcblx0XHRzZXQsXHJcblx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxyXG5cdFx0ZW51bWVyYWJsZTogZmFsc2VcclxuXHR9KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuXHRpc1Bvam8sXHJcblx0YXBwZW5kLFxyXG5cdG1lcmdlLFxyXG5cdGZpbHRlcixcclxuXHRidWlsZFByb3BlcnR5RmlsdGVyLFxyXG5cdGRlZlZhbHVlLFxyXG5cdGRlZkdldCxcclxuXHRkZWZHZXRTZXRcclxufTtcclxuIiwiY29uc3QgUFJJVkFURV9QUk9QRVJUSUVTID0gbmV3IFdlYWtNYXAoKTtcclxuY29uc3QgcHJpdmF0ZVN0b3JlID0gKG9iaikgPT4ge1xyXG5cdGlmKFBSSVZBVEVfUFJPUEVSVElFUy5oYXMob2JqKSlcclxuXHRcdHJldHVybiBQUklWQVRFX1BST1BFUlRJRVMuZ2V0KG9iaik7XHJcblx0XHJcblx0Y29uc3QgZGF0YSA9IHt9O1xyXG5cdFBSSVZBVEVfUFJPUEVSVElFUy5zZXQob2JqLCBkYXRhKTtcclxuXHRyZXR1cm4gZGF0YTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBwcml2YXRlUHJvcGVydHkgPSBmdW5jdGlvbihvYmosIG5hbWUsIHZhbHVlKSB7XHJcblx0Y29uc3QgZGF0YSA9IHByaXZhdGVTdG9yZShvYmopO1xyXG5cdGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHRlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpXHJcblx0XHRyZXR1cm4gZGF0YVtuYW1lXTtcclxuXHRlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpXHJcblx0XHRkYXRhW25hbWVdID0gdmFsdWU7XHJcblx0ZWxzZVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTm90IGFsbG93ZWQgc2l6ZSBvZiBhcmd1bWVudHMhXCIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge3ByaXZhdGVQcm9wZXJ0eX0iLCJpbXBvcnQge2RlZlZhbHVlLCBkZWZHZXR9IGZyb20gXCIuL09iamVjdFV0aWxzXCJcclxuXHJcbmV4cG9ydCBjb25zdCB0aW1lb3V0UHJvbWlzZSA9IChmbiwgbXMpID0+e1xyXG5cdGxldCBjYW5jZWxlZCA9IGZhbHNlO1xyXG5cdGxldCB0aW1lb3V0ID0gbnVsbDtcclxuXHRjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHIsIGUpID0+IHtcclxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpPT4ge1xyXG5cdFx0XHR0aW1lb3V0ID0gbnVsbDtcclxuXHRcdFx0Zm4ocixlKTtcclxuXHRcdH0sIG1zKVxyXG5cdH0pO1xyXG5cclxuXHRjb25zdCB0aGVuID0gcHJvbWlzZS50aGVuO1xyXG5cdHByb21pc2UudGhlbiA9IChmbikgPT4ge1xyXG5cdFx0dGhlbi5jYWxsKHByb21pc2UsIChyZXN1bHQpID0+IHtcclxuXHRcdFx0aWYoIXRoaXMuY2FuY2VsZWQpXHJcblx0XHRcdFx0cmV0dXJuIGZuKHJlc3VsdCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRlZlZhbHVlKHByb21pc2UsIFwiY2FuY2VsXCIsICgpID0+IHtcclxuXHRcdGlmKHRpbWVvdXQpe1xyXG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XHJcblx0XHRcdGNhbmNlbGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRkZWZHZXQocHJvbWlzZSwgY2FuY2VsZCwgKCkgPT4gY2FuY2VsZWQpO1xyXG5cclxuXHRyZXR1cm4gcHJvbWlzZTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBsYXp5UHJvbWlzZSA9ICgpID0+IHtcclxuXHRcdGxldCBwcm9taXNlUmVzb2x2ZSA9IG51bGw7XHJcblx0XHRsZXQgcHJvbWlzZUVycm9yID0gbnVsbDtcclxuXHJcblx0XHRjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHIsIGUpID0+IHtcclxuXHRcdFx0cHJvbWlzZVJlc29sdmUgPSByO1xyXG5cdFx0XHRwcm9taXNlRXJyb3IgPSBlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IHJlc29sdmVkID0gZmFsc2U7XHJcblx0XHRsZXQgZXJyb3IgPSBmYWxzZTtcclxuXHRcdGxldCB2YWx1ZSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRkZWZWYWx1ZShwcm9taXNlLCBcInJlc29sdmVcIiwgKHJlc3VsdCkgPT4ge1xyXG5cdFx0XHR2YWx1ZSA9IHJlc3VsdDtcclxuXHRcdFx0cmVzb2x2ZWQgPSB0cnVlO1xyXG5cdFx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBFcnJvcikge1xyXG5cdFx0XHRcdGVycm9yID0gdHJ1ZTtcclxuXHRcdFx0XHRwcm9taXNlRXJyb3IodmFsdWUpO1xyXG5cdFx0XHR9IGVsc2UgcHJvbWlzZVJlc29sdmUodmFsdWUpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZGVmR2V0KHByb21pc2UsIFwidmFsdWVcIiwgKCkgPT4gdmFsdWUpO1xyXG5cdFx0ZGVmR2V0KHByb21pc2UsIFwiZXJyb3JcIiwgKCkgPT4gZXJyb3IpO1xyXG5cdFx0ZGVmR2V0KHByb21pc2UsIFwicmVzb2x2ZWRcIiwgKCkgPT4gcmVzb2x2ZWQpO1xyXG5cclxuXHRcdHJldHVybiBwcm9taXNlO1xyXG59O1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0bGF6eVByb21pc2UsXHJcblx0dGltZW91dFByb21pc2VcclxufVxyXG4iLCJpZiAoIVN0cmluZy5wcm90b3R5cGUuaGFzaGNvZGUpXHJcblx0U3RyaW5nLnByb3RvdHlwZS5oYXNoY29kZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMubGVuZ3RoID09PSAwKVxyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdFxyXG5cdFx0bGV0IGhhc2ggPSAwO1xyXG5cdFx0Y29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGMgPSB0aGlzLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGM7XHJcblx0XHRcdGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaGFzaDtcclxuXHR9OyIsImltcG9ydCB7IGxhenlQcm9taXNlIH0gZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL1Byb21pc2VVdGlsc1wiO1xuaW1wb3J0IHsgZGVmR2V0LCBkZWZWYWx1ZSB9IGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL3NyYy9PYmplY3RVdGlsc1wiO1xuaW1wb3J0IHsgcHJpdmF0ZVByb3BlcnR5IH0gZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1jb21tb24tdXRpbHMvc3JjL1ByaXZhdGVQcm9wZXJ0eVwiO1xuaW1wb3J0IERpcmVjdGl2ZSBmcm9tIFwiLi9EaXJlY3RpdmVcIjtcbmltcG9ydCBUZW1wbGF0ZSBmcm9tIFwiLi9UZW1wbGF0ZVwiO1xuXG5jb25zdCBQUklWQVRFX1dBSVQgPSBcIndhaXRcIjtcbmNvbnN0IFBSSVZBVEVfQ0FMTEJBQ0tTID0gXCJjYWxsYmFja3NcIjtcbmNvbnN0IFBSSVZBVEVfSUdOT1JFRElSRUNUSVZFUyA9IFwiaWdub3JlRGlyZWN0aXZlc1wiO1xuXG5jb25zdCBDT05URVhUQ0xPTkUgPSBuZXcgU2V0KCk7XG5jb25zdCBDT05URVhUUyA9IG5ldyBNYXAoKTtcbmNvbnN0IFdBUk5USU1FID0gMTAwMDtcbmNvbnN0IENSSVRJQ0FMVElNRSA9IDEwMDAwO1xuXG5sZXQgb2JzZXJ2ZXJUaW1lb3V0ID0gbnVsbDtcbmNvbnN0IG9ic2VydmUgPSAoY29udGV4dCkgPT4ge1xuXHRDT05URVhUUy5zZXQoY29udGV4dCwgRGF0ZS5ub3coKSk7XG5cdHJ1bk9ic2VydmVyKCk7XG59O1xuY29uc3QgcnVuT2JzZXJ2ZXIgPSAoKSA9PiB7XG5cdGlmIChvYnNlcnZlclRpbWVvdXQgPT0gbnVsbCkge1xuXHRcdG9ic2VydmVyVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0b2JzZXJ2ZXJUaW1lb3V0ID0gbnVsbDtcblx0XHRcdGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuXHRcdFx0Q09OVEVYVFMuZm9yRWFjaCgoY3JlYXRlVGltZSwgY29udGV4dCkgPT4ge1xuXHRcdFx0XHRjb25zdCBkZWx0YSA9IHRpbWUgLSBjcmVhdGVUaW1lO1xuXHRcdFx0XHRpZiAoY29udGV4dC5jbG9zZWQpIENPTlRFWFRTLmRlbGV0ZShjb250ZXh0KTtcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGRlbHRhID4gQ1JJVElDQUxUSU1FKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFwiY29udGV4dCBsaXZlcyBsb25nZXIgdGhlbiAxMHNcIiwgZGVsdGEgLyAxMDAwLCBjb250ZXh0KTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGRlbHRhID4gV0FSTlRJTUUpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihcImNvbnRleHQgbGl2ZXMgbG9uZ2VyIHRoZW4gMXNcIiwgZGVsdGEgLyAxMDAwLCBjb250ZXh0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Y29uc29sZS5sb2coXCJvcGVuIGNvbnRleHQ6XCIsIENPTlRFWFRTLnNpemUpO1xuXHRcdFx0aWYgKENPTlRFWFRTLnNpemUgPiAwKSBydW5PYnNlcnZlcigpO1xuXHRcdH0sIDEwMDApO1xuXHR9XG59O1xuXG5jb25zdCB0b1RlbXBsYXRlID0gKHRlbXBsYXRlKSA9PiB7XG5cdGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIFRlbXBsYXRlKSByZXR1cm4gdGVtcGxhdGUuaW1wb3J0Q29udGVudCgpO1xuXHRlbHNlIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09IFN0cmluZykgcmV0dXJuIGNyZWF0ZSh0ZW1wbGF0ZSk7XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn07XG5cbmxldCBpZCA9IDA7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0IHtcblx0Y29uc3RydWN0b3IoeyByZXNvbHZlciwgcmVuZGVyZXIsIHRlbXBsYXRlLCBjb250YWluZXIsIHJvb3QsIG1vZGUgPSBcInJlcGxhY2VcIiwgdGFyZ2V0ID0gbnVsbCwgcGFyZW50ID0gbnVsbCwgaWdub3JlRGlyZWN0aXZlIH0pIHtcblx0XHRpZiAoIXJlc29sdmVyKSB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlciBcInJlc29sdmVyXCIgaXMgcmVxdWlyZWQhJyk7XG5cdFx0aWYgKCFyZW5kZXJlcikgdGhyb3cgbmV3IEVycm9yKCdQYXJhbWV0ZXIgXCJyZW5kZXJlclwiIGlzIHJlcXVpcmVkIScpO1xuXHRcdGlmICghdGVtcGxhdGUpIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIFwidGVtcGxhdGVcIiBpcyByZXF1aXJlZCEnKTtcblx0XHRpZiAoIWNvbnRhaW5lcikgdGhyb3cgbmV3IEVycm9yKCdQYXJhbWV0ZXIgXCJjb250YWluZXJcIiBpcyByZXF1aXJlZCEnKTtcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIFwicm9vdFwiIGlzIHJlcXVpcmVkIScpO1xuXG5cdFx0ZGVmVmFsdWUodGhpcywgXCJpZFwiLCBwYXJlbnQgPyBgJHtwYXJlbnQuaWR9LT4ke2lkKyt9YCA6IGByb290Ojoke2lkKyt9YCk7XG5cdFx0ZGVmVmFsdWUodGhpcywgXCJkZXB0aFwiLCBwYXJlbnQgPyBwYXJlbnQuZGVwdGggKyAxIDogMCk7XG5cdFx0ZGVmVmFsdWUodGhpcywgXCJwYXJlbnRcIiwgcGFyZW50KTtcblx0XHQvL2RlZlZhbHVlKHRoaXMsIFwicmVzb2x2ZXJcIiwgcmVzb2x2ZXIpO1xuXHRcdGRlZlZhbHVlKHRoaXMsIFwicmVuZGVyZXJcIiwgcmVuZGVyZXIpO1xuXHRcdGRlZlZhbHVlKHRoaXMsIFwicm9vdFwiLCByb290KTtcblx0XHRkZWZWYWx1ZSh0aGlzLCBcInRlbXBsYXRlXCIsIHRvVGVtcGxhdGUodGVtcGxhdGUpKTtcblx0XHRkZWZWYWx1ZSh0aGlzLCBcIm1vZGVcIiwgbW9kZSk7XG5cdFx0ZGVmVmFsdWUodGhpcywgXCJzdWJjb250ZXh0c1wiLCBuZXcgU2V0KCkpO1xuXHRcdGNvbnN0IHdhaXQgPSBsYXp5UHJvbWlzZSgpO1xuXHRcdHByaXZhdGVQcm9wZXJ0eSh0aGlzLCBQUklWQVRFX0lHTk9SRURJUkVDVElWRVMsIGlnbm9yZURpcmVjdGl2ZSBpbnN0YW5jZW9mIFNldCA/IGlnbm9yZURpcmVjdGl2ZSA6IG5ldyBTZXQoKSk7XG5cdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfV0FJVCwgd2FpdCk7XG5cdFx0cHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfQ0FMTEJBQ0tTLCBbXSk7XG5cblx0XHR0aGlzLmNvbnRlbnQgPSBudWxsO1xuXHRcdHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuXHRcdHRoaXMucmVzb2x2ZXIgPSByZXNvbHZlcjtcblxuXHRcdC8qIGV4ZWN1dGlvbiBmbGFncyAqL1xuXHRcdHRoaXMuc3RvcCA9IGZhbHNlO1xuXHRcdHRoaXMuaWdub3JlID0gZmFsc2U7XG5cdFx0Ly9jb25zb2xlLmxvZyhgY29udGV4dD17XCJkZXB0aFwiOiR7dGhpcy5kZXB0aH0gfSwgXCJpZFwiOiAke3RoaXMuaWR9YCk7XG5cdFx0Ly90aGlzLmNyZWF0ZXRBdCA9IG5ldyBFcnJvcigpO1xuXG5cdFx0aWYgKHBhcmVudCkge1xuXHRcdFx0cGFyZW50LnN1YmNvbnRleHRzLmFkZCh0aGlzKTtcblx0XHR9XG5cdH1cblxuXHRnZXQgY2xvc2VkKCkge1xuXHRcdHJldHVybiBwcml2YXRlUHJvcGVydHkodGhpcywgUFJJVkFURV9XQUlUKS5yZXNvbHZlZDtcblx0fVxuXG5cdGlnbm9yZURpcmVjdGl2ZShkaXJlY3RpdmUpIHtcblx0XHRjb25zdCBpZ25vcmVEaXJlY3RpdmVzID0gcHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfSUdOT1JFRElSRUNUSVZFUyk7XG5cdFx0ZGlyZWN0aXZlIGluc3RhbmNlb2YgRGlyZWN0aXZlID8gaWdub3JlRGlyZWN0aXZlcy5hZGQoZGlyZWN0aXZlLm5hbWUpIDogaWdub3JlRGlyZWN0aXZlcy5hZGQoZGlyZWN0aXZlKTtcblx0fVxuXG5cdGFjY2VwdERpcmVjdGl2ZShkaXJlY3RpdmUpIHtcblx0XHRjb25zdCBpZ25vcmVEaXJlY3RpdmVzID0gcHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfSUdOT1JFRElSRUNUSVZFUyk7XG5cdFx0aWYgKGRpcmVjdGl2ZSBpbnN0YW5jZW9mIERpcmVjdGl2ZSkgcmV0dXJuICEoaWdub3JlRGlyZWN0aXZlcy5oYXMoZGlyZWN0aXZlLm5hbWUpIHx8IGlnbm9yZURpcmVjdGl2ZXMuaGFzKGRpcmVjdGl2ZSkpO1xuXG5cdFx0cmV0dXJuICFpZ25vcmVEaXJlY3RpdmVzLmhhcyhkaXJlY3RpdmUpO1xuXHR9XG5cblx0ZmluaXNoZWQoY2FsbGJhY2spIHtcblx0XHRpZiAodGhpcy5wYXJlbnQpIHRoaXMucGFyZW50LmZpbmlzaGVkKGNhbGxiYWNrKTtcblx0XHRlbHNlIHRoaXMucmVhZHkoY2FsbGJhY2spO1xuXHR9XG5cblx0YXN5bmMgcmVhZHkoY2FsbGJhY2spIHtcblx0XHRjb25zdCBjYWxsYmFja3MgPSBwcml2YXRlUHJvcGVydHkodGhpcywgUFJJVkFURV9DQUxMQkFDS1MpO1xuXHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0aWYgKGNhbGxiYWNrIGluc3RhbmNlb2YgQXJyYXkpIGNhbGxiYWNrLmZvckVhY2goKGNhbGxiYWNrKSA9PiB0aGlzLndhaXQudGhlbihjYWxsYmFjaykpO1xuXHRcdFx0ZWxzZSBpZiAoY2FsbGJhY2sgaW5zdGFuY2VvZiBQcm9taXNlKSBjYWxsYmFja3MucHVzaChhc3luYyAoKSA9PiBhd2FpdCBjYWxsYmFjayk7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCB3YWl0ID0gcHJpdmF0ZVByb3BlcnR5KHRoaXMsIFBSSVZBVEVfV0FJVCk7XG5cdFx0XHRpZiAoIXdhaXQucmVzb2x2ZWQpIHtcblx0XHRcdFx0aWYgKCF0aGlzLmlnbm9yZSkgZm9yIChsZXQgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSBhd2FpdCBjYWxsYmFjayh0aGlzKTtcblxuXHRcdFx0XHRmb3IgKGxldCBjaGlsZCBvZiB0aGlzLnN1YmNvbnRleHRzKSBhd2FpdCBjaGlsZC5yZWFkeSgpO1xuXG5cdFx0XHRcdGlmICh0aGlzLnBhcmVudCkgdGhpcy5wYXJlbnQuc3ViY29udGV4dHMuZGVsZXRlKHRoaXMpO1xuXG5cdFx0XHRcdHdhaXQucmVzb2x2ZSh0aGlzKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHdhaXQ7XG5cdFx0fVxuXHR9XG5cblx0c3ViQ29udGV4dCh7IHJlc29sdmVyID0gdGhpcy5yZXNvbHZlciwgcmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyLCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUsIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLCByb290ID0gdGhpcy5yb290LCBtb2RlID0gdGhpcy5tb2RlLCB0YXJnZXQgPSB0aGlzLnRhcmdldCwgaWdub3JlRGlyZWN0aXZlID0gbnVsbCB9ID0ge30pIHtcblx0XHRyZXR1cm4gbmV3IENvbnRleHQoeyByZXNvbHZlciwgcmVuZGVyZXIsIHRlbXBsYXRlLCBjb250YWluZXIsIG1vZGUsIHJvb3QsIHRhcmdldCwgcGFyZW50OiB0aGlzLCBpZ25vcmVEaXJlY3RpdmUgfSk7XG5cdH1cblxuXHRjbG9uZSh7IHJlc29sdmVyID0gdGhpcy5yZXNvbHZlciwgcmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyLCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUsIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLCByb290ID0gdGhpcy5yb290LCBtb2RlID0gdGhpcy5tb2RlLCB0YXJnZXQgPSB0aGlzLnRhcmdldCwgaWdub3JlRGlyZWN0aXZlID0gbnVsbCB9ID0ge30pIHtcblx0XHRyZXR1cm4gbmV3IENvbnRleHQoeyByZXNvbHZlciwgcmVuZGVyZXIsIHRlbXBsYXRlLCBjb250YWluZXIsIG1vZGUsIHJvb3QsIHRhcmdldCwgcGFyZW50OiBudWxsLCBpZ25vcmVEaXJlY3RpdmUgfSk7XG5cdH1cblxuXHR0b1JlbmRlck9wdGlvbih7IHJlc29sdmVyID0gdGhpcy5yZXNvbHZlciwgcmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyLCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUsIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLCByb290ID0gdGhpcy5yb290LCBtb2RlID0gdGhpcy5tb2RlLCB0YXJnZXQgPSB0aGlzLnRhcmdldCwgaWdub3JlRGlyZWN0aXZlID0gbnVsbCB9ID0ge30pIHtcblx0XHRyZXR1cm4geyByZXNvbHZlciwgcmVuZGVyZXIsIHRlbXBsYXRlLCBjb250YWluZXIsIG1vZGUsIHJvb3QsIHRhcmdldCwgcGFyZW50OiBudWxsLCBpZ25vcmVEaXJlY3RpdmUgfTtcblx0fVxufVxuIiwiY29uc3QgREVGSU5FRF9ESVJFQ1RJVkVTID0gW107XG5cbmNvbnN0IGRlZmluZURpcmVjdGl2ZSA9ICh7IGRpcmVjdGl2ZSB9KSA9PiB7XG5cdGlmICghKGRpcmVjdGl2ZSBpbnN0YW5jZW9mIERpcmVjdGl2ZSkpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW1wbGVtZW50YXRpb24gZG9zbid0IGV4dGVuZCBEaXJlY3RpdmUgY2xhc3MhXCIpO1xuXG5cdGlmIChkaXJlY3RpdmUucmFuayA8IERpcmVjdGl2ZS5NSU5fUkFOSylcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcmFuayBvZiBhIGRpcmVjdGl2ZSBjYW4ndCBiZSBsb3dlciBhcyBcIiArIERpcmVjdGl2ZS5NSU5fUkFOSyArIFwiIVwiKTtcblxuXHRpZiAoZGlyZWN0aXZlLnJhbmsgPiBEaXJlY3RpdmUuTUFYX1JBTkspXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIHJhbmsgb2YgYSBkaXJlY3RpdmUgY2FuJ3QgYmUgZ3JhdGVyIGFzIFwiICsgRGlyZWN0aXZlLk1BWF9SQU5LICsgXCIhXCIpO1xuXG5cdERFRklORURfRElSRUNUSVZFUy5wdXNoKGRpcmVjdGl2ZSk7XG5cdERFRklORURfRElSRUNUSVZFUy5zb3J0KChhLCBiKSA9PiB7XG5cdFx0Y29uc3QgcGhhc2UgPSBhLnBoYXNlIC0gYi5waGFzZTtcblx0XHRpZihwaGFzZSA9PSAwKVxuXHRcdFx0cmV0dXJuIGEucmFuayAtIGIucmFuaztcblx0XHRcdFxuXHRcdHJldHVybiBwaGFzZTtcblx0fSk7XG59O1xuXG5jb25zdCBQSEFTRSA9IHtcblx0aW5pdDogMCxcblx0ZGF0YTogMSxcblx0dGVtcGxhdGU6IDIsXG5cdGNvbnRlbnQ6IDMsXG5cdGZpbmlzaDogNFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlyZWN0aXZlIHtcblxuXHRzdGF0aWMgZ2V0IFBIQVNFKCkgeyByZXR1cm4gUEhBU0UgfTtcblx0c3RhdGljIGdldCBNSU5fUkFOSygpIHsgcmV0dXJuIDAgfTtcblx0c3RhdGljIGdldCBNQVhfUkFOSygpIHsgcmV0dXJuIDEwMDAwMCB9O1xuXG5cdGNvbnN0cnVjdG9yKCkgeyB9O1xuXG5cdGdldCBuYW1lKCkgeyB9XG5cdGdldCByYW5rKCkgeyB9XG5cdGdldCBwaGFzZSgpIHtyZXR1cm4gUEhBU0UuZmluaXNofVxuXG5cdC8qKlxuXHQgKiBuZWVkIHRvIGJlIGltcGxlbWVudGVkXG5cdCAqIFxuXHQgKiByZXR1cm4gRGlyZWN0aXZlUmVzdWx0XG5cdCAqL1xuXHRhc3luYyBleGVjdXRlKGNvbnRleHQpIHtcblx0XHRyZXR1cm4gY29udGV4dDtcblx0fVxuXG5cblx0c3RhdGljIGRlZmluZShvcHRpb24pIHtcblx0XHRkZWZpbmVEaXJlY3RpdmUob3B0aW9uKTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgZGlyZWN0aXZlcygpIHtcblx0XHRyZXR1cm4gREVGSU5FRF9ESVJFQ1RJVkVTO1xuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIERpcmVjdGl2ZUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudHtcblx0Y29uc3RydWN0b3IoKXtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuaGlkZGVuID0gdHJ1ZTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIG5lZWQgdG8gYmUgaW1wbGVtZW50ZWRcblx0ICogXG5cdCAqL1xuXHRhc3luYyBleGVjdXRlKHt0ZW1wbGF0ZSwgY29udGV4dH0pe1xuXHRcdGNvbnRleHQuY29udGVudCA9IHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcblx0XHRyZXR1cm4gY29udGV4dDtcblx0fTtcdFxufSIsImltcG9ydCBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHRkb21cIjtcbmltcG9ydCBFeHByZXNzaW9uUmVzb2x2ZXIgZnJvbSBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHByZXNzaW9uLWxhbmd1YWdlL3NyYy9FeHByZXNzaW9uUmVzb2x2ZXIuanNcIjtcbmltcG9ydCBUZW1wbGF0ZSBmcm9tIFwiLi9UZW1wbGF0ZS5qc1wiO1xuaW1wb3J0IENvbnRleHQgZnJvbSBcIi4vQ29udGV4dC5qc1wiO1xuaW1wb3J0IERpcmVjdGl2ZSBmcm9tIFwiLi9EaXJlY3RpdmUuanNcIjtcbmltcG9ydCBFbGVtZW50IGZyb20gXCIuL0VsZW1lbnQuanNcIjtcbmltcG9ydCBcIi4vZGlyZWN0aXZlc1wiO1xuaW1wb3J0IFwiLi9lbGVtZW50c1wiO1xuXG5leHBvcnQgY29uc3QgU0NPUEVTID0ge1xuXHRhcHBsaWNhdGlvbjogXCJhcHBsaWNhdGlvblwiLFxuXHRkYXRhOiBcImRhdGFcIixcblx0cmVuZGVyOiBcInJlbmRlclwiLFxuXHRjb250YWluZXI6IFwiY29udGFpbmVyXCIsXG5cdG5vZGU6IFwibm9kZVwiLFxuXHRkaXJlY3RpdmU6IFwiZGlyZWN0aXZlXCIsXG59O1xuXG5jb25zdCBBUFBMSUNBVElPTl9TQ09QRV9SRVNPTFZFUiA9IG5ldyBFeHByZXNzaW9uUmVzb2x2ZXIoeyBuYW1lOiBTQ09QRVMuYXBwbGljYXRpb24gfSk7XG5cbmNvbnN0IE1PREVXT1JLRVIgPSB7XG5cdHJlcGxhY2U6IGFzeW5jICh7IGNvbnRhaW5lciwgdGFyZ2V0ID0gbnVsbCwgY29udGVudCB9KSA9PiB7XG5cdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0dGFyZ2V0LnJlcGxhY2UoY29udGVudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5lbXB0eSgpO1xuXHRcdFx0Y29udGFpbmVyLmFwcGVuZChjb250ZW50KTtcblx0XHR9XG5cdH0sXG5cdGFwcGVuZDogYXN5bmMgKHsgY29udGFpbmVyLCB0YXJnZXQgPSBudWxsLCBjb250ZW50IH0pID0+IHtcblx0XHRpZiAodGFyZ2V0KSB0YXJnZXQuYWZ0ZXIoY29udGVudCk7XG5cdFx0ZWxzZSBjb250YWluZXIuYXBwZW5kKGNvbnRlbnQpO1xuXHR9LFxuXHRwcmVwZW5kOiBhc3luYyAoeyBjb250YWluZXIsIHRhcmdldCA9IG51bGwsIGNvbnRlbnQgfSkgPT4ge1xuXHRcdGlmICh0YXJnZXQpIHRhcmdldC5iZWZvcmUoY29udGVudCk7XG5cdFx0ZWxzZSBjb250YWluZXIucHJlcGVuZChjb250ZW50KTtcblx0fSxcbn07XG5cbmNvbnN0IGxvYWRUZW1wbGF0ZUNvbnRlbnQgPSBhc3luYyAodGVtcGxhdGUsIHJlbmRlcmVyKSA9PiB7XG5cdGlmICh0ZW1wbGF0ZSkge1xuXHRcdHRlbXBsYXRlID0gYXdhaXQgVGVtcGxhdGUubG9hZCh0ZW1wbGF0ZSk7XG5cdFx0cmV0dXJuIHRlbXBsYXRlLmltcG9ydENvbnRlbnQoKTtcblx0fSBlbHNlIGlmIChyZW5kZXJlci50ZW1wbGF0ZSkge1xuXHRcdHJldHVybiBhd2FpdCByZW5kZXJlci50ZW1wbGF0ZS5pbXBvcnRDb250ZW50KCk7XG5cdH1cblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJObyBjb250ZW50IHRlbXBsYXRlIHNwZWNpZmllZCFcIik7XG59O1xuXG5jb25zdCBhZGRDb250ZW50ID0gYXN5bmMgKGNvbnRleHQpID0+IHtcblx0aWYgKGNvbnRleHQuY29udGVudCkge1xuXHRcdGNvbnN0IG1vZGV3b3JrZXIgPSBNT0RFV09SS0VSW2NvbnRleHQubW9kZV07XG5cdFx0aWYgKCFtb2Rld29ya2VyKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcIicgKyBjb250ZXh0Lm1vZGUgKyAnXCIgaXMgbm90IHN1cHBvcnRlZCEnKTtcblx0XHRhd2FpdCBtb2Rld29ya2VyKGNvbnRleHQpO1xuXHR9XG59O1xuXG5jb25zdCByZW5kZXJDb250YWluZXIgPSBhc3luYyAoY29udGV4dCkgPT4ge1xuXHRsZXQgeyB0ZW1wbGF0ZSwgcmVzb2x2ZXIgfSA9IGNvbnRleHQ7XG5cdGlmICghdGVtcGxhdGUgfHwgdGVtcGxhdGUubGVuZ3RoID09IDApIHJldHVybiBjb250ZXh0O1xuXG5cdGxldCBjb250ZW50ID0gW107XG5cdGZvciAobGV0IG5vZGVUZW1wbGF0ZSBvZiB0ZW1wbGF0ZSkge1xuXHRcdG5vZGVUZW1wbGF0ZS5ub3JtYWxpemUoKTtcblx0XHRjb25zdCBub2RlUmVzb2x2ZXIgPSBuZXcgRXhwcmVzc2lvblJlc29sdmVyKHsgbmFtZTogU0NPUEVTLm5vZGUsIGNvbnRleHQ6IG51bGwsIHBhcmVudDogcmVzb2x2ZXIgfSk7XG5cdFx0Y29uc3Qgbm9kZUNvbnRleHQgPSBhd2FpdCByZW5kZXJOb2RlKGNvbnRleHQuc3ViQ29udGV4dCh7IHRlbXBsYXRlOiBub2RlVGVtcGxhdGUsIHJlc29sdmVyOiBub2RlUmVzb2x2ZXIgfSkpO1xuXHRcdGF3YWl0IG5vZGVDb250ZXh0LnJlYWR5KCk7XG5cdFx0Y29uc3Qgbm9kZSA9IG5vZGVDb250ZXh0LmNvbnRlbnQ7XG5cdFx0aWYgKG5vZGUpIHtcblx0XHRcdGlmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpIGNvbnRlbnQgPSBjb250ZW50LmNvbmNhdChub2RlKTtcblx0XHRcdGlmIChub2RlIGluc3RhbmNlb2YgTm9kZUxpc3QgfHwgbm9kZSBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKSBjb250ZW50ID0gY29udGVudC5jb25jYXQoQXJyYXkuZnJvbShub2RlKSk7XG5cdFx0XHRlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgTm9kZSkgY29udGVudC5wdXNoKG5vZGUpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnRleHQuY29udGVudCA9IGNvbnRlbnQubGVuZ3RoICE9IDAgPyBjb250ZW50IDogbnVsbDtcblx0cmV0dXJuIGNvbnRleHQ7XG59O1xuXG5jb25zdCByZW5kZXJOb2RlID0gYXN5bmMgKGNvbnRleHQpID0+IHtcblx0dHJ5IHtcblx0XHRsZXQgeyB0ZW1wbGF0ZSwgcmVuZGVyZXIgfSA9IGNvbnRleHQ7XG5cdFx0aWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgRWxlbWVudCkgYXdhaXQgdGVtcGxhdGUuZXhlY3V0ZShjb250ZXh0KTtcblx0XHRlbHNlIGF3YWl0IGV4ZWN1dGVEaXJlY3RpdmVzKGNvbnRleHQpO1xuXG5cdFx0Y29uc3QgeyBpZ25vcmUsIGNvbnRlbnQgfSA9IGNvbnRleHQ7XG5cblx0XHRpZiAoIWlnbm9yZSAmJiBjb250ZW50KSB7XG5cdFx0XHRsZXQgeyByZXNvbHZlciB9ID0gY29udGV4dDtcblx0XHRcdGNvbnN0IHN1YlRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZS5jaGlsZE5vZGVzO1xuXHRcdFx0aWYgKHN1YlRlbXBsYXRlICYmIHN1YlRlbXBsYXRlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29uc3QgY29udGFpbmVyUmVzb2x2ZXIgPSBuZXcgRXhwcmVzc2lvblJlc29sdmVyKHsgbmFtZTogU0NPUEVTLmNvbnRhaW5lciwgY29udGV4dDogbnVsbCwgcGFyZW50OiByZXNvbHZlciB9KTtcblx0XHRcdFx0Y29uc3Qgc3ViQ29udGV4dCA9IGF3YWl0IHJlbmRlcmVyLnJlbmRlcihjb250ZXh0LnN1YkNvbnRleHQoeyBjb250YWluZXI6IGNvbnRlbnQsIHRlbXBsYXRlOiBzdWJUZW1wbGF0ZSwgcmVzb2x2ZXI6IGNvbnRhaW5lclJlc29sdmVyIH0pKTtcblx0XHRcdFx0YXdhaXQgc3ViQ29udGV4dC5yZWFkeSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChjb250ZXh0LmNvbnRlbnQgJiYgY29udGV4dC5jb250ZW50LnRhZ05hbWUgJiYgY29udGV4dC5jb250ZW50LnRhZ05hbWUgPT0gXCJKU1RMXCIpIGNvbnRleHQuY29udGVudCA9IGNvbnRleHQuY29udGVudC5jaGlsZE5vZGVzOyAvL3NwZWNpYWwgY2FzZSB0byBzdXBwb3J0IHRoZSBvbGQgXCI8anN0bD5cIiB0YWcuXG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLmVycm9yKFwiZXJyb3IgYXQgcmVuZGVyIG5vZGU6XCIsIGUsIGNvbnRleHQpO1xuXHR9XG5cdHJldHVybiBjb250ZXh0O1xufTtcblxuY29uc3QgZXhlY3V0ZURpcmVjdGl2ZXMgPSBhc3luYyAoY29udGV4dCkgPT4ge1xuXHRjb25zdCBkaXJlY3RpdmVzID0gRGlyZWN0aXZlLmRpcmVjdGl2ZXM7XG5cdGNvbnN0IGxlbmd0aCA9IGRpcmVjdGl2ZXMubGVuZ3RoO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAmJiAhY29udGV4dC5zdG9wOyBpKyspIHtcblx0XHRjb25zdCBkaXJlY3RpdmUgPSBkaXJlY3RpdmVzW2ldO1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoY29udGV4dC5hY2NlcHREaXJlY3RpdmUoZGlyZWN0aXZlKSkgYXdhaXQgZGlyZWN0aXZlLmV4ZWN1dGUoY29udGV4dCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcImVycm9yIGF0IGRpcmVjdGl2ZTpcIiwgZSwgZGlyZWN0aXZlLCBjb250ZXh0KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGNvbnRleHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlciB7XG5cdGNvbnN0cnVjdG9yKHsgdGVtcGxhdGUsIGRhdGEgfSA9IHt9KSB7XG5cdFx0aWYgKHRlbXBsYXRlICYmICEodGVtcGxhdGUgaW5zdGFuY2VvZiBUZW1wbGF0ZSkpIHRocm93IG5ldyBFcnJvcihcInRlbXBsYXRlIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgVGVtcGxhdGUhXCIpO1xuXG5cdFx0dGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRcdHRoaXMucmVzb2x2ZXIgPSBuZXcgRXhwcmVzc2lvblJlc29sdmVyKHsgbmFtZTogU0NPUEVTLmRhdGEsIGNvbnRleHQ6IGRhdGEgPyBkYXRhIDoge30sIHBhcmVudDogQVBQTElDQVRJT05fU0NPUEVfUkVTT0xWRVIgfSk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtXG5cdCAqIFx0XHRjb250YWluZXIgSFRNTEVsZW1lbnQgLT4gdGFyZ2V0IHRvIHJlbmRlciBpblxuXHQgKiBAcGFyYW1cblx0ICogXHRcdGRhdGEgT2JqZWN0fC4uLiAtPiBkYXRhIHRvIHVzZWQgYXQgcmVuZGVyaW5nXG5cdCAqIEBwYXJhbVxuXHQgKiBcdFx0dGVtcGxhdGUgVGVtcGxhdGV8Tm9kZXxOb2RlTGlzdHxIVE1MQ29sbGVjdGlvbnxTdHJpbmcgLT4gdGVtcGxhdGUgdG8gcmVuZGVyXG5cdCAqIEBwYXJhbVxuXHQgKiBcdFx0bW9kZSBcImFwcGVuZFwifFwiaW5zZXJ0XCJ8XCJyZXBsYWNlXCJcblx0ICogQHBhcmFtXG5cdCAqIFx0XHR0YXJnZXRcblx0ICovXG5cdGFzeW5jIHJlbmRlcihjb250ZXh0KSB7XG5cdFx0Y29uc3QgY2FsbGVkV2l0aENvbnRleHQgPSBjb250ZXh0IGluc3RhbmNlb2YgQ29udGV4dDtcblx0XHRpZiAoIWNhbGxlZFdpdGhDb250ZXh0KSB7XG5cdFx0XHRsZXQgeyB0ZW1wbGF0ZSA9IG51bGwsIGRhdGEgPSBudWxsLCBjb250YWluZXIsIHJvb3QsIG1vZGUsIHRhcmdldCB9ID0gY29udGV4dDtcblx0XHRcdHRlbXBsYXRlID0gYXdhaXQgbG9hZFRlbXBsYXRlQ29udGVudCh0ZW1wbGF0ZSwgdGhpcyk7XG5cdFx0XHRjb25zdCByZXNvbHZlciA9IG5ldyBFeHByZXNzaW9uUmVzb2x2ZXIoeyBuYW1lOiBTQ09QRVMucmVuZGVyLCBjb250ZXh0OiBkYXRhLCBwYXJlbnQ6IHRoaXMucmVzb2x2ZXIgfSk7XG5cdFx0XHRjb250ZXh0ID0gbmV3IENvbnRleHQoeyByZXNvbHZlciwgcmVuZGVyZXI6IHRoaXMsIHRlbXBsYXRlOiB0ZW1wbGF0ZSwgY29udGFpbmVyLCByb290OiByb290ID8gcm9vdCA6IGNvbnRhaW5lciwgbW9kZTogbW9kZSA/IG1vZGUgOiBcInJlcGxhY2VcIiwgdGFyZ2V0IH0pO1xuXHRcdH0gZWxzZSBpZiAoY29udGV4dC5jbG9zZWQpIHRocm93IG5ldyBFcnJvcihcImNhbGxpbmcgd2l0aCBjbG9zZWQgY29udGV4dFwiLCBjb250ZXh0KTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZTtcblx0XHRpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBOb2RlKSBhd2FpdCByZW5kZXJOb2RlKGNvbnRleHQpO1xuXHRcdGVsc2UgYXdhaXQgcmVuZGVyQ29udGFpbmVyKGNvbnRleHQpO1xuXHRcdFxuXHRcdGF3YWl0IGFkZENvbnRlbnQoY29udGV4dCk7XG5cblx0XHRpZiAoIWNhbGxlZFdpdGhDb250ZXh0KVxuXHRcdFx0YXdhaXQgY29udGV4dC5yZWFkeSgpO1xuXG5cdFx0cmV0dXJuIGNvbnRleHQ7XG5cdH1cblxuXHRzdGF0aWMgYXN5bmMgYnVpbGQoeyB0ZW1wbGF0ZSwgZGF0YSB9ID0ge30pIHtcblx0XHRpZiAodGVtcGxhdGUgJiYgdGVtcGxhdGUgaW5zdGFuY2VvZiBQcm9taXNlKSB0ZW1wbGF0ZSA9IGF3YWl0IHRlbXBsYXRlO1xuXG5cdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZSA/IGF3YWl0IFRlbXBsYXRlLmxvYWQodGVtcGxhdGUpIDogbnVsbDtcblx0XHRyZXR1cm4gbmV3IFJlbmRlcmVyKHsgdGVtcGxhdGUsIGRhdGEgfSk7XG5cdH1cblxuXHRzdGF0aWMgYXN5bmMgcmVuZGVyKHsgY29udGFpbmVyLCBkYXRhLCB0ZW1wbGF0ZSwgbW9kZSwgdGFyZ2V0IH0pIHtcblx0XHRjb25zdCByZW5kZXJlciA9IG5ldyBSZW5kZXJlcih7IHRlbXBsYXRlLCBkYXRhIH0pO1xuXHRcdHJldHVybiByZW5kZXJlci5yZW5kZXIoeyBjb250YWluZXIsIG1vZGUsIHRhcmdldCB9KTtcblx0fVxufVxuIiwiaW1wb3J0IFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWNvbW1vbi11dGlscy9zcmMvamF2YXNjcmlwdC9TdHJpbmcuanNcIjtcblxuY29uc3QgQ0FDSEUgPSB7fTtcbmNvbnN0IGdldEtleSA9ICh0ZW1wbGF0ZSwgY2FjaGUsIGFsaWFzKSA9PiB7XG5cdGlmKCFjYWNoZSlcblx0XHRyZXR1cm4gbnVsbDtcblx0XG5cdGxldCBrZXkgPSBudWxsO1xuXHRpZihhbGlhcylcblx0XHRrZXkgPSBhbGlhcztcdFxuXHRlbHNlIGlmKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gXCJzdHJpbmdcIilcblx0XHRrZXkgPSB0ZW1wbGF0ZTtcblx0ZWxzZSBpZih0ZW1wbGF0ZSBpbnN0YW5jZW9mIFVSTClcblx0XHRrZXkgPSB0ZW1wbGF0ZS50b1N0cmluZygpO1xuXHRlbHNlIGlmKHRlbXBsYXRlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG5cdFx0a2V5ID0gdGVtcGxhdGUuc2VsZWN0b3IoKTtcblx0XG5cdGlmKGtleSlcblx0XHRyZXR1cm4ga2V5Lmhhc2hjb2RlKCk7XG5cdFxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IGZyb21VUkwgPSBhc3luYyAodXJsLCBjYWNoZSwga2V5KSA9PiB7XG5cdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLnRvU3RyaW5nKCkpO1xuXHRjb25zdCBzb3VyY2UgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cdHJldHVybiBmcm9tU291cmNlKHNvdXJjZSwgY2FjaGUsIGtleSk7XG59O1xuXG5jb25zdCBmcm9tU291cmNlID0gYXN5bmMgKHNvdXJjZSwgY2FjaGUsIGtleSkgPT4ge1xuXHRyZXR1cm4gZnJvbUVsZW1lbnQoY3JlYXRlKHNvdXJjZSwgdHJ1ZSksIGNhY2hlLCBrZXkpO1xufTtcblxuY29uc3QgZnJvbUVsZW1lbnQgPSBhc3luYyAoZWxlbWVudCwgY2FjaGUsIGtleSkgPT4ge1x0XG5cdGxldCB0ZW1wbGF0ZSA9IG51bGxcblx0aWYoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxUZW1wbGF0ZUVsZW1lbnQpXHRcdFx0XG5cdFx0dGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoZWxlbWVudCk7XG5cdGVsc2Uge1xuXHRcdHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuXHRcdGlmKGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlIHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fCBlbGVtZW50IGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24gfHwgZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KVxuXHRcdFx0dGVtcGxhdGUuY29udGVudC5hcHBlbmQoZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuXHRcdGVsc2Vcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRlbXBsYXRlIHR5cGUgaXMgbm90IHN1cHBvcnRlZCFcIik7XHRcdFx0XG5cdFx0XG5cdFx0dGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUodGVtcGxhdGUsIGtleSk7XG5cdH1cblx0XG5cdGlmKCF0ZW1wbGF0ZSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUZW1wbGF0ZSBjYW4ndCBsb2FkZWQhXCIpO1xuXHRcblx0aWYoY2FjaGUgJiYga2V5KVxuXHRcdENBQ0hFW2tleV0gPSB0ZW1wbGF0ZTtcblx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlbXBsYXRlIHtcdFxuXHRjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwga2V5KXtcdFx0XG5cdFx0dGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRcdHRoaXMua2V5ID0ga2V5O1x0XG5cdH1cblx0XG5cdGltcG9ydENvbnRlbnQoZG9jPWRvY3VtZW50KXtcblx0XHRsZXQgaW1wb3J0ZWQgPSBkb2MuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLCB0cnVlKTtcblx0XHRyZXR1cm4gaW1wb3J0ZWQuY29udGVudC5jaGlsZE5vZGVzO1xuXHR9XG5cdFxuXHRyZW1vdmUoKSB7XG5cdFx0aWYodGhpcy5rZXkgJiYgQ0FDSEVbdGhpcy5rZXldKVxuXHRcdFx0ZGVsZXRlIENBQ0hFW3RoaXMua2V5XTtcdFx0XG5cdH07XG5cblx0c3RhdGljIGFzeW5jIGZldGNoKHVybCwgY2FjaGUgPSB0cnVlLCBhbGlhcyA9IG51bGwpe1xuXHRcdGlmKHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIpe1xuXHRcdFx0cmV0dXJuIFRlbXBsYXRlLmxvYWQobmV3IFVSTCh1cmwsIGxvYWN0aW9uKSwgY2FjaGUsIGFsaWFzKTtcblx0XHR9ZWxzZSBpZih1cmwgaW5zdGFuY2VvZiBVUkwpXG5cdFx0XHRyZXR1cm4gVGVtcGxhdGUubG9hZCh1cmwsIGNhY2hlLCBhbGlhcyk7XG5cblx0XHRuZXcgRXJyb3IoXCJUaGUgdXJsIGlzbid0IGEgYWxsb3dlZCB0eXBlISAtPiBbU3RyaW5nfFVSTF0gcmVxdWlyZWQhXCIpO1xuXHR9XG5cdFxuXHRzdGF0aWMgYXN5bmMgbG9hZCh0ZW1wbGF0ZSwgY2FjaGUgPSB0cnVlLCBhbGlhcyA9IG51bGwpe1xuXHRcdGlmKHRlbXBsYXRlIGluc3RhbmNlb2YgVGVtcGxhdGUpXG5cdFx0XHRyZXR1cm4gdGVtcGxhdGU7XG5cdFx0XG5cdFx0Y29uc3Qga2V5ID0gZ2V0S2V5KHRlbXBsYXRlLCBjYWNoZSwgYWxpYXMpO1xuXHRcdGlmKGtleSAmJiBDQUNIRVtrZXldKVxuXHRcdFx0cmV0dXJuIENBQ0hFW2tleV07XG5cdFx0ZWxzZSBpZih0eXBlb2YgdGVtcGxhdGUgPT09IFwic3RyaW5nXCIpe1xuXHRcdFx0cmV0dXJuIGZyb21Tb3VyY2UodGVtcGxhdGUsIGNhY2hlLCBrZXkpO1xuXHRcdH1lbHNlIGlmKHRlbXBsYXRlIGluc3RhbmNlb2YgVVJMKVxuXHRcdFx0cmV0dXJuIGF3YWl0IGZyb21VUkwodGVtcGxhdGUsIGNhY2hlLCBrZXkpO1xuXHRcdGVsc2UgaWYodGVtcGxhdGUgaW5zdGFuY2VvZiBOb2RlIHx8IHRlbXBsYXRlIGluc3RhbmNlb2YgTm9kZUxpc3QgfHwgdGVtcGxhdGUgaW5zdGFuY2VvZiBIVE1MQ29sbGVjdGlvbiB8fCB0ZW1wbGF0ZSBpbnN0YW5jZW9mIEhUTUxUZW1wbGF0ZUVsZW1lbnQpXG5cdFx0XHRyZXR1cm4gZnJvbUVsZW1lbnQodGVtcGxhdGUsIGNhY2hlLCBrZXkpO1xuXHRcdFxuXHRcdG5ldyBFcnJvcihcIlRoZSB0ZW1wbGF0ZSBpc24ndCBhIGFsbG93ZWQgdHlwZSEgLT4gW1N0cmluZ3xVUkx8Tm9kZXxOb2RlTGlzdHxIVE1MQ29sbGVjdGlvbnxUZW1wbGF0ZV0gcmVxdWlyZWQhXCIpO1xuXHR9XG59O1xuIiwiaW1wb3J0IERpcmVjdGl2ZSBmcm9tIFwiLi4vRGlyZWN0aXZlLmpzXCI7XG5cbmNvbnN0IEFUVFJJQlVURV9OQU1FID0gLyhqc3RsKT8oXFw/KT8oQCk/KFteXFw/QF0rKS9pO1xuXG5jb25zdCBiaW5kQXR0cmlidXRlID0gYXN5bmMgKHsgY29uZGl0aW9uLCBuYW1lLCB2YWx1ZSwgY29udGV4dCB9KSA9PiB7XG5cdGNvbnN0IHsgcmVzb2x2ZXIsIGNvbnRlbnQsIHRlbXBsYXRlIH0gPSBjb250ZXh0O1xuXHRcdFxuXHRsZXQgYXR0cmlidXRlID0gIWNvbmRpdGlvbiA/IHZhbHVlIDogdGVtcGxhdGUuYXR0cihuYW1lKTtcblx0Y29uZGl0aW9uID0gY29uZGl0aW9uID8gdmFsdWUgOiB0ZW1wbGF0ZS5hdHRyKFwiP1wiICsgbmFtZSk7XG5cdGNvbnN0IGhhc1ZhbHVlID0gaXNWYWx1ZShhdHRyaWJ1dGUpO1xuXHRcblx0aWYgKGNvbmRpdGlvbiAmJiBoYXNWYWx1ZSkge1xuXHRcdGNvbmRpdGlvbiA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmUoY29uZGl0aW9uLCBmYWxzZSk7XG5cdFx0aWYgKGNvbmRpdGlvbiA9PT0gdHJ1ZSlcblx0XHRcdGNvbnRlbnQuYXR0cihuYW1lLCBhd2FpdCByZXNvbHZlci5yZXNvbHZlVGV4dChhdHRyaWJ1dGUsIGF0dHJpYnV0ZSkpO1xuXHR9IGVsc2UgaWYgKGNvbmRpdGlvbikge1xuXHRcdGNvbmRpdGlvbiA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmUoY29uZGl0aW9uLCBmYWxzZSk7XG5cdFx0aWYgKGNvbmRpdGlvbiA9PT0gdHJ1ZSlcblx0XHRcdGNvbnRlbnQuYXR0cihuYW1lLCB0cnVlKTtcblx0fSBlbHNlIGlmIChoYXNWYWx1ZSkge1xuXHRcdGNvbnRlbnQuYXR0cihuYW1lLCBhd2FpdCByZXNvbHZlci5yZXNvbHZlVGV4dChhdHRyaWJ1dGUsIGF0dHJpYnV0ZSkpO1xuXHR9XG59O1xuXG5jb25zdCBpc1ZhbHVlID0gKHZhbHVlKSA9PiB7XG5cdHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIjtcdFxufTtcblxuY29uc3QgYmluZEV2ZW50ID0gYXN5bmMgKHsgY29uZGl0aW9uLCBuYW1lLCB2YWx1ZSwgY29udGV4dCB9KSA9PiB7XG5cdGNvbnN0IHsgcmVzb2x2ZXIsIHRlbXBsYXRlIH0gPSBjb250ZXh0O1xuXHRcblx0Y29uZGl0aW9uID0gY29uZGl0aW9uID8gdmFsdWUgOiB0ZW1wbGF0ZS5hdHRyKFwiP0BcIiArIG5hbWUpO1xuXHRsZXQgaGFuZGxlID0gIWNvbmRpdGlvbiA/IHZhbHVlIDogdGVtcGxhdGUuYXR0cihcIkBcIisgbmFtZSk7XG5cdGxldCBzcGxpdCA9IG5hbWUuc3BsaXQoXCI6XCIpO1xuXHRjb25zdCBldmVudCA9IHNwbGl0LnNoaWZ0KCk7XG5cdGNvbnN0IHR5cGUgPSBzcGxpdC5zaGlmdCgpIHx8IFwiZGVmYXVsdFwiO1xuXHRcblxuXHRpZiAoY29uZGl0aW9uICYmIGhhbmRsZSl7XG5cdFx0aWYoYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZShjb25kaXRpb24sIGZhbHNlKSA9PSB0cnVlKVxuXHRcdFx0YXdhaXQgYmluZGluZyh7ZXZlbnQsIHR5cGUsIGhhbmRsZSwgY29udGV4dCB9KTtcblx0fVxuXHRlbHNlIGlmIChoYW5kbGUpXG5cdFx0YXdhaXQgYmluZGluZyh7ZXZlbnQsIHR5cGUsIGhhbmRsZSwgY29udGV4dCB9KTtcbn07XG5cbmNvbnN0IGJpbmRpbmcgPSBhc3luYyAoe2V2ZW50LCB0eXBlLCBoYW5kbGUsIGNvbnRleHQgfSkgPT4ge1xuXHRjb25zdCB7IHJlc29sdmVyLCBjb250ZW50fSA9IGNvbnRleHQ7XG5cdFx0XG5cdGlmKHR5cGUgPT0gXCJkZWxlZ2F0ZVwiKXtcblx0XHRjb25zdCBldmVudGhhbmRsZSA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmVUZXh0KGhhbmRsZSwgaGFuZGxlKTtcblx0XHRjb250ZW50Lm9uKGV2ZW50LCBkZWxlZ2F0ZXIoZXZlbnRoYW5kbGUpKTtcblx0fSBlbHNlIHtcdFx0XG5cdFx0Y29uc3QgZXZlbnRoYW5kbGUgPSBhd2FpdCByZXNvbHZlci5yZXNvbHZlKGhhbmRsZSwgaGFuZGxlKTtcblx0XG5cdFx0aWYoIWV2ZW50aGFuZGxlKVxuXHRcdFx0Y29uc29sZS5lcnJvcihuZXcgRXJyb3IoXCJDYW4ndCByZXNvbHZlIFxcXCJcIiArIGhhbmRsZSArIFwiXFxcIiB0byBldmVudCBoYW5kbGUhXCIpKVxuXHRcdGVsc2UgaWYodHlwZW9mIGV2ZW50aGFuZGxlID09PSBcImZ1bmN0aW9uXCIpXG5cdFx0XHRjb250ZW50Lm9uKGV2ZW50LCBldmVudGhhbmRsZSk7XG5cdFx0ZWxzZSBpZih0eXBlb2YgZXZlbnRoYW5kbGUgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRjb250ZW50Lm9uKGV2ZW50LCBkZWxlZ2F0ZXIoZXZlbnRoYW5kbGUpKTtcblx0XHRlbHNlIGlmKHR5cGVvZiBldmVudGhhbmRsZSA9PT0gXCJvYmplY3RcIil7XHRcblx0XHRcdGNvbnN0IHtjYXB0dXJlPWZhbHNlLCBwYXNzaXZlPWZhbHNlLCBvbmNlPWZhbHNlfSA9IGhhbmRsZTtcdFx0XG5cdFx0XHRjb250ZW50Lm9uKGV2ZW50LCBldmVudGhhbmRsZS5ldmVudEhhbmRsZSwge2NhcHR1cmUsIHBhc3NpdmUsIG9uY2V9KTtcblx0XHR9XG5cdH1cbn07XG5cbmNvbnN0IGRlbGVnYXRlciA9IGZ1bmN0aW9uKGRlbGVnYXRlKSB7XG5cdHJldHVybiBmdW5jdGlvbihldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0aWYoZXZlbnQuY3VycmVudFRhcmdldClcdFxuXHRcdFx0ZXZlbnQuY3VycmVudFRhcmdldC50cmlnZ2VyKGRlbGVnYXRlLCBldmVudCk7XG5cdFx0ZWxzZVxuXHRcdFx0ZXZlbnQudGFyZ2V0LnRyaWdnZXIoZGVsZWdhdGUsIGV2ZW50KTtcblx0fTtcbn07XG5cblxuY2xhc3MgQXR0cmlidXRlIGV4dGVuZHMgRGlyZWN0aXZlIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdGdldCBuYW1lKCkgeyByZXR1cm4gXCJhdHRyaWJ1dGVcIiB9XG5cdGdldCByYW5rKCkgeyByZXR1cm4gRGlyZWN0aXZlLk1JTl9SQU5LIH1cblx0Z2V0IHBoYXNlKCkgeyByZXR1cm4gRGlyZWN0aXZlLlBIQVNFLmNvbnRlbnQgfVxuXG5cblx0YXN5bmMgZXhlY3V0ZShjb250ZXh0KSB7XG5cdFx0Y29uc3QgeyB0ZW1wbGF0ZSB9ID0gY29udGV4dDtcblx0XHRpZiAoISh0ZW1wbGF0ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSlcblx0XHRcdHJldHVybiBjb250ZXh0O1xuXG5cdFx0Y29uc3QgcHJvY2Vzc2VkID0gbmV3IFNldCgpO1xuXHRcdGZvciAoY29uc3QgYXR0cmlidXRlIG9mIHRlbXBsYXRlLmF0dHJpYnV0ZXMpIHtcblx0XHRcdGNvbnN0IFssIGpzdGwsIGNvbmRpdGlvbiwgZXZlbnQsIG5hbWVdID0gQVRUUklCVVRFX05BTUUuZXhlYyhhdHRyaWJ1dGUubmFtZSk7XG5cdFx0XHRpZiAoIWpzdGwgJiYgIXByb2Nlc3NlZC5oYXMobmFtZSkpIHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBhdHRyaWJ1dGUudmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdGlmIChldmVudClcblx0XHRcdFx0XHRhd2FpdCBiaW5kRXZlbnQoeyBjb25kaXRpb24sIGV2ZW50LCBuYW1lLCB2YWx1ZSwgY29udGV4dCB9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0YXdhaXQgYmluZEF0dHJpYnV0ZSh7IGNvbmRpdGlvbiwgbmFtZSwgdmFsdWUsIGNvbnRleHQgfSlcblx0XHRcdH1cblx0XHRcdHByb2Nlc3NlZC5hZGQobmFtZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbnRleHQ7XG5cdH1cbn1cblxuRGlyZWN0aXZlLmRlZmluZSh7IGRpcmVjdGl2ZTogbmV3IEF0dHJpYnV0ZSgpIH0pOyIsImltcG9ydCBEaXJlY3RpdmUgZnJvbSBcIi4uL0RpcmVjdGl2ZS5qc1wiO1xuXG5jbGFzcyBDaG9vc2UgZXh0ZW5kcyBEaXJlY3RpdmUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7IHJldHVybiBcImNob29zZVwiIH1cblx0Z2V0IHJhbmsoKSB7IHJldHVybiBEaXJlY3RpdmUuTUlOX1JBTksgKyAxIH1cblx0Z2V0IHBoYXNlKCkgeyByZXR1cm4gRGlyZWN0aXZlLlBIQVNFLnRlbXBsYXRlIH1cblxuXHRhc3luYyBleGVjdXRlKGNvbnRleHQpIHtcblx0XHRpZiAoIShjb250ZXh0LnRlbXBsYXRlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8ICFjb250ZXh0LnRlbXBsYXRlLmhhc0F0dHJpYnV0ZShcImpzdGwtY2hvb3NlXCIpIHx8IGNvbnRleHQudGVtcGxhdGUuY2hpbGRyZW4ubGVuZ3RoID09IDApXG5cdFx0XHRyZXR1cm4gY29udGV4dDtcblxuXHRcdGNvbnN0IHsgdGVtcGxhdGUsIHJlc29sdmVyIH0gPSBjb250ZXh0O1xuXHRcdGxldCByZXNvbHZlZCA9IGZhbHNlO1xuXHRcdGNvbnN0IHdoZW5zID0gdGVtcGxhdGUuZmluZChcIjpzY29wZSA+IFtqc3RsLXdoZW5dXCIpO1xuXHRcdGNvbnN0IGxlbmd0aCA9IHdoZW5zLmxlbmd0aDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBub2RlID0gd2hlbnNbaV07XG5cdFx0XHRpZiAoIXJlc29sdmVkICYmIChhd2FpdCByZXNvbHZlci5yZXNvbHZlKG5vZGUuYXR0cihcImpzdGwtd2hlblwiKSwgZmFsc2UpKSlcblx0XHRcdFx0cmVzb2x2ZWQgPSB0cnVlO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRub2RlLnJlbW92ZSgpO1xuXHRcdH1cblxuXHRcdGlmIChyZXNvbHZlZClcblx0XHRcdHRlbXBsYXRlLmZpbmQoXCI6c2NvcGUgPiBbanN0bC1vdGhlcndpc2VdXCIpLnJlbW92ZSgpO1xuXG5cdFx0cmV0dXJuIGNvbnRleHQ7XG5cdH1cbn1cblxuRGlyZWN0aXZlLmRlZmluZSh7IGRpcmVjdGl2ZTogbmV3IENob29zZSgpIH0pOyIsImltcG9ydCBEaXJlY3RpdmUgZnJvbSBcIi4uL0RpcmVjdGl2ZS5qc1wiO1xuaW1wb3J0IEV4cHJlc3Npb25SZXNvbHZlciBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4cHJlc3Npb24tbGFuZ3VhZ2Uvc3JjL0V4cHJlc3Npb25SZXNvbHZlclwiO1xuXG5jb25zdCBNT0RFUyA9IHtcblx0XCJyZW1vdGVcIjogYXN5bmMgKHsgZGF0YSwgY29udGV4dCB9KSA9PiB7XHRcdFxuXHRcdGNvbnN0IHtyZXNvbHZlciwgdGVtcGxhdGV9ID0gY29udGV4dDtcblx0XHRkYXRhID0gYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZVRleHQoZGF0YSk7XG5cdFx0ZGF0YSA9IG5ldyBVUkwoZGF0YSwgbG9jYXRpb24ub3JpZ2luKTtcblx0XHRsZXQgb3B0aW9uID0gYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZVRleHQodGVtcGxhdGUuYXR0cihcImpzdGwtZGF0YS1vcHRpb25cIikgfHwgXCJ7fVwiKTtcblx0XHRvcHRpb24gPSBKU09OLnBhcnNlKG9wdGlvbik7XG5cblx0XHRkYXRhID0gYXdhaXQgZmV0Y2goZGF0YS50b1N0cmluZygpLCBvcHRpb24pO1xuXHRcdHJldHVybiBkYXRhLmpzb24oKTtcblx0fSxcdFxuXHRcInNldFwiOiBhc3luYyAoeyBkYXRhLCBjb250ZXh0IH0pID0+IHtcblx0XHRjb25zdCB7cmVzb2x2ZXJ9ID0gY29udGV4dDtcblx0XHRcblx0XHRkYXRhID0gYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZShkYXRhKTtcblx0XHRyZXR1cm4gZGF0YTtcblx0fSxcblx0XCJkaXJlY3RcIjogYXN5bmMgKHsgZGF0YSwgY29udGV4dCB9KSA9PiB7XG5cdFx0Y29uc3Qge3Jlc29sdmVyfSA9IGNvbnRleHQ7XG5cdFx0XG5cdFx0ZGF0YSA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmVUZXh0KGRhdGEpO1xuXHRcdHJldHVybiBkYXRhO1xuXHR9XG59O1xuXG5jb25zdCB1cGRhdGVDb250ZXh0ID0gKHsgdmFybmFtZSwgZGF0YSwgc2NvcGUsIGNvbnRleHQgfSkgPT4ge1xuXHRpZiAodmFybmFtZSlcblx0XHRjb250ZXh0LnJlc29sdmVyLnVwZGF0ZURhdGEodmFybmFtZSwgZGF0YSwgc2NvcGUpO1xuXHRlbHNlIGlmIChzY29wZSlcblx0XHRjb250ZXh0LnJlc29sdmVyLm1lcmdlQ29udGV4dChkYXRhLCBzY29wZSk7XG5cdGVsc2V7XG5cdFx0Y29uc3QgcmVzb2x2ZXIgPSBuZXcgRXhwcmVzc2lvblJlc29sdmVyKHsgY29udGV4dDogZGF0YSwgbmFtZTogXCJqc3RsLWRhdGFcIiwgcGFyZW50OiBjb250ZXh0LnJlc29sdmVyIH0pO1xuXHRcdC8vY29udGV4dCA9IGNvbnRleHQuc3ViQ29udGV4dCh7cmVzb2x2ZXJ9KTtcblx0XHRjb250ZXh0LnJlc29sdmVyID0gcmVzb2x2ZXI7XG5cdH1cblx0XG5cdFx0XG5cdHJldHVybiBjb250ZXh0O1xufTtcblxuXG5cbmNsYXNzIERhdGEgZXh0ZW5kcyBEaXJlY3RpdmUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7IHJldHVybiBcImRhdGFcIiB9XG5cdGdldCByYW5rKCkgeyByZXR1cm4gMTAwMCB9XG5cdGdldCBwaGFzZSgpe3JldHVybiBEaXJlY3RpdmUuUEhBU0UuZGF0YX1cblxuXHRhc3luYyBleGVjdXRlKGNvbnRleHQpIHtcblx0XHRpZiAoIShjb250ZXh0LnRlbXBsYXRlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8ICFjb250ZXh0LnRlbXBsYXRlLmF0dHIoXCJqc3RsLWRhdGFcIikpXG5cdFx0XHRyZXR1cm4gY29udGV4dDtcblx0XHRcdFxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB7IHRlbXBsYXRlIH0gPSBjb250ZXh0O1x0XHRcdFxuXHRcdFx0Y29uc3QgbW9kZSA9IE1PREVTWyh0ZW1wbGF0ZS5hdHRyKFwianN0bC1kYXRhLW1vZGVcIikgfHwgXCJyZW1vdGVcIildO1xuXHRcdFx0aWYgKCFtb2RlKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUganN0bC1kYXRhLW1vZGUgaXMgdW5zdXBwb3J0ZWQhXCIpO1xuXG5cdFx0XHRsZXQgZGF0YSA9IHRlbXBsYXRlLmF0dHIoXCJqc3RsLWRhdGFcIik7XG5cdFx0XHRkYXRhID0gYXdhaXQgbW9kZSh7IGRhdGEsIGNvbnRleHQgfSk7XG5cblx0XHRcdGNvbnN0IHZhcm5hbWUgPSB0ZW1wbGF0ZS5hdHRyKFwianN0bC1kYXRhLXZhclwiKTtcblx0XHRcdGNvbnN0IHNjb3BlID0gdGVtcGxhdGUuYXR0cihcImpzdGwtZGF0YS1zY29wZVwiKTtcblx0XHRcdGNvbnRleHQgPSB1cGRhdGVDb250ZXh0KHsgdmFybmFtZSwgZGF0YSwgc2NvcGUsIGNvbnRleHQgfSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihlLCBjb250ZXh0LnRlbXBsYXRlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29udGV4dDtcblxuXHR9XG59XG5cbkRpcmVjdGl2ZS5kZWZpbmUoeyBkaXJlY3RpdmU6IG5ldyBEYXRhKCkgfSk7IiwiaW1wb3J0IERpcmVjdGl2ZSBmcm9tIFwiLi4vRGlyZWN0aXZlLmpzXCI7XG5pbXBvcnQgRXhwcmVzc2lvblJlc29sdmVyIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9zcmMvRXhwcmVzc2lvblJlc29sdmVyLmpzXCI7XG5cbmNvbnN0IEFUVFJJQlVURSA9IHtcblx0REFUQTogXCJqc3RsLWZvcmVhY2hcIixcblx0VkFSOiBcImpzdGwtZm9yZWFjaC12YXJcIixcblx0U1RBVFVTOiBcImpzdGwtZm9yZWFjaC1zdGF0dXNcIixcblx0Q09VTlQ6IFwianN0bC1mb3JlYWNoLWNvdW50XCIsXG5cdFNUQVJUOiBcImpzdGwtZm9yZWFjaC1zdGFydFwiLFxuXHRTVEVQOiBcImpzdGwtZm9yZWFjaC1zdGVwXCIsXG5cdENPTkRJVElPTjogXCJqc3RsLWZvcmVhY2gtY29uZGl0aW9uXCJcbn07XG5cbmNvbnN0IGRvQ291bnQgPSBhc3luYyAob3B0aW9uKSA9PiB7XG5cdGxldCB7IHN0YXJ0LCBzdGVwLCBjb3VudCwgdmFybmFtZSwgc3RhdHVzLCByZXNvbHZlciB9ID0gb3B0aW9uO1xuXG5cdGNvdW50ID0gYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZShjb3VudCk7XG5cdGNvbnN0IGxlbmd0aCA9IHN0YXJ0ICsgKGNvdW50ICogc3RlcCk7XG5cdGxldCBzdG9wID0gZmFsc2U7XG5cdGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGxlbmd0aCAmJiAhc3RvcDsgaSA9IGkgKyBzdGVwKSB7XG5cdFx0Y29uc3QgaXRlcmF0aW9uID0ge31cblx0XHRpdGVyYXRpb25bdmFybmFtZV0gPSBpO1xuXHRcdGl0ZXJhdGlvbltzdGF0dXNdID0ge1xuXHRcdFx0aW5kZXg6IGksXG5cdFx0XHRudW1iZXI6IGkgKyAxLFxuXHRcdFx0c3RlcCxcblx0XHRcdGNvdW50XG5cdFx0fTtcblx0XHRzdG9wID0gIShhd2FpdCBpdGVyYXRlKGl0ZXJhdGlvbiwgb3B0aW9uKSk7XG5cdH1cbn07XG5cbmNvbnN0IGRvRm9yZWFjaCA9IGFzeW5jIChvcHRpb24pID0+IHtcblx0bGV0IHsgZGF0YSwgc3RhcnQsIHN0ZXAsIGNvdW50LCB2YXJuYW1lLCBzdGF0dXMsIHJlc29sdmVyIH0gPSBvcHRpb247XG5cblx0ZGF0YSA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmUoZGF0YSk7XG5cdGxldCBhcnJheSA9IGRhdGE7XG5cdGlmICghKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkpXG5cdFx0YXJyYXkgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhkYXRhKTtcblxuXHRjb3VudCA9IGNvdW50ICE9IFwiXCIgPyBhd2FpdCByZXNvbHZlci5yZXNvbHZlKGNvdW50LCAwKSA6IG51bGw7XG5cdGNvbnN0IGxlbmd0aCA9IGNvdW50ID8gTWF0aC5taW4oc3RhcnQgKyBjb3VudCwgYXJyYXkubGVuZ3RoKSA6IGFycmF5Lmxlbmd0aDtcblx0bGV0IHN0b3AgPSBmYWxzZTtcblx0Zm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoICYmICFzdG9wOyBpID0gaSArIHN0ZXApIHtcblx0XHRjb25zdCBpdGVyYXRpb24gPSB7fVxuXHRcdGl0ZXJhdGlvblt2YXJuYW1lXSA9IGRhdGFbaV07XG5cdFx0aXRlcmF0aW9uW3N0YXR1c10gPSB7XG5cdFx0XHRpbmRleDogaSxcblx0XHRcdG51bWJlcjogaSArIDEsXG5cdFx0XHRjb3VudDogbGVuZ3RoLFxuXHRcdFx0ZGF0YVxuXHRcdH07XG5cdFx0c3RvcCA9ICEoYXdhaXQgaXRlcmF0ZShpdGVyYXRpb24sIG9wdGlvbikpO1xuXHR9XG59O1xuXG5jb25zdCBpdGVyYXRlID0gYXN5bmMgKGRhdGEsIG9wdGlvbikgPT4ge1xuXHRsZXQgeyB0ZW1wbGF0ZSwgcmVzb2x2ZXIsIHJlbmRlcmVyLCBjb250YWluZXIsIGNvbmRpdGlvbiwgY29udGV4dCB9ID0gb3B0aW9uO1xuXHRyZXNvbHZlciA9IG5ldyBFeHByZXNzaW9uUmVzb2x2ZXIoeyBjb250ZXh0OiBkYXRhLCBuYW1lOiBcImpzdGwtZm9yZWFjaFwiLCBwYXJlbnQ6IHJlc29sdmVyIH0pO1xuXG5cdGNvbmRpdGlvbiA9IGNvbmRpdGlvbiA/IGF3YWl0IHJlc29sdmVyLnJlc29sdmUoY29uZGl0aW9uLCBmYWxzZSkgOiBmYWxzZTtcblx0aWYgKGNvbmRpdGlvbilcblx0XHRyZXR1cm4gZmFsc2U7XG5cdGNvbnN0IGl0ZW1Db250ZXh0ID0gY29udGV4dC5zdWJDb250ZXh0KHsgcmVzb2x2ZXIsIGNvbnRhaW5lciwgdGVtcGxhdGUsIG1vZGU6IFwiYXBwZW5kXCIgfSk7XG5cdGF3YWl0IHJlbmRlcmVyLnJlbmRlcihpdGVtQ29udGV4dCk7XG5cdGF3YWl0IGl0ZW1Db250ZXh0LnJlYWR5KCk7XG5cdHJldHVybiB0cnVlO1xufTtcblxuY2xhc3MgRm9yZWFjaCBleHRlbmRzIERpcmVjdGl2ZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRnZXQgbmFtZSgpIHsgcmV0dXJuIFwiZm9yZWFjaFwiIH1cblx0Z2V0IHJhbmsoKSB7IHJldHVybiBEaXJlY3RpdmUuTUlOX1JBTksgKyAyIH1cblx0Z2V0IHBoYXNlKCkgeyByZXR1cm4gRGlyZWN0aXZlLlBIQVNFLnRlbXBsYXRlIH1cblxuXHRhc3luYyBleGVjdXRlKGNvbnRleHQpIHtcblx0XHRpZiAoIShjb250ZXh0LnRlbXBsYXRlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8ICghY29udGV4dC50ZW1wbGF0ZS5hdHRyKEFUVFJJQlVURS5EQVRBKSAmJiAhY29udGV4dC50ZW1wbGF0ZS5hdHRyKEFUVFJJQlVURS5DT1VOVCkpKVxuXHRcdFx0cmV0dXJuIGNvbnRleHQ7XG5cblx0XHRjb250ZXh0Lmlnbm9yZSA9IHRydWU7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHsgdGVtcGxhdGUsIHJlc29sdmVyLCByZW5kZXJlciwgY29udGVudCB9ID0gY29udGV4dDtcblx0XHRcdGNvbnN0IG9wdGlvbiA9IHtcblx0XHRcdFx0ZGF0YTogKHRlbXBsYXRlLmF0dHIoQVRUUklCVVRFLkRBVEEpIHx8IFwiXCIpLnRyaW0oKSxcblx0XHRcdFx0Y291bnQ6ICh0ZW1wbGF0ZS5hdHRyKEFUVFJJQlVURS5DT1VOVCkgfHwgXCJcIikudHJpbSgpLFxuXHRcdFx0XHRzdGFydDogYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZSh0ZW1wbGF0ZS5hdHRyKEFUVFJJQlVURS5TVEFSVCkgfHwgXCIwXCIpLFxuXHRcdFx0XHRzdGVwOiBhd2FpdCByZXNvbHZlci5yZXNvbHZlKHRlbXBsYXRlLmF0dHIoQVRUUklCVVRFLlNURVApIHx8IFwiMVwiKSxcblx0XHRcdFx0dmFybmFtZTogKHRlbXBsYXRlLmF0dHIoQVRUUklCVVRFLlZBUikgfHwgXCJpdGVtXCIpLnRyaW0oKSxcblx0XHRcdFx0c3RhdHVzOiAodGVtcGxhdGUuYXR0cihBVFRSSUJVVEUuU1RBVFVTKSB8fCBcInN0YXR1c1wiKS50cmltKCksXG5cdFx0XHRcdGNvbmRpdGlvbjogdGVtcGxhdGUuYXR0cihBVFRSSUJVVEUuQ09ORElUSU9OKSxcblx0XHRcdFx0dGVtcGxhdGU6IHRlbXBsYXRlLmNoaWxkTm9kZXMsXG5cdFx0XHRcdHJlc29sdmVyLFxuXHRcdFx0XHRyZW5kZXJlcixcblx0XHRcdFx0Y29udGFpbmVyOiBjb250ZW50LFxuXHRcdFx0XHRjb250ZXh0XG5cdFx0XHR9O1xuXHRcdFx0aWYgKCghb3B0aW9uLmRhdGEgfHwgb3B0aW9uLmRhdGEgPT0gXCJcIikgJiYgb3B0aW9uLmNvdW50KVxuXHRcdFx0XHRhd2FpdCBkb0NvdW50KG9wdGlvbik7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGF3YWl0IGRvRm9yZWFjaChvcHRpb24pO1xuXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvciBhdCBqc3RsLWZvcmVhY2g6XCIsIGVycm9yKTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbnRleHQ7XG5cblx0fVxufTtcblxuRGlyZWN0aXZlLmRlZmluZSh7IGRpcmVjdGl2ZTogbmV3IEZvcmVhY2goKSB9KTsiLCJpbXBvcnQgRGlyZWN0aXZlIGZyb20gXCIuLi9EaXJlY3RpdmUuanNcIjtcblxuY2xhc3MgSWYgZXh0ZW5kcyBEaXJlY3RpdmUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7IHJldHVybiBcImlmXCIgfVxuXHRnZXQgcmFuaygpIHsgcmV0dXJuIERpcmVjdGl2ZS5NSU5fUkFOSyArIDEwMDAgfVxuXHRnZXQgcGhhc2UoKSB7IHJldHVybiBEaXJlY3RpdmUuUEhBU0UuaW5pdCB9XG5cblx0YXN5bmMgZXhlY3V0ZShjb250ZXh0KSB7XG5cdFx0Y29uc3QgeyB0ZW1wbGF0ZSB9ID0gY29udGV4dDtcblx0XHRpZiAoISh0ZW1wbGF0ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fCAhdGVtcGxhdGUuYXR0cihcImpzdGwtaWZcIikpXG5cdFx0XHRyZXR1cm4gY29udGV4dDtcblxuXHRcdGNvbnN0IGV4cHJlc3Npb24gPSB0ZW1wbGF0ZS5hdHRyKFwianN0bC1pZlwiKTtcblx0XHRjb25zdCByZXNvbHZlciA9IGNvbnRleHQucmVzb2x2ZXI7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZShleHByZXNzaW9uLCBmYWxzZSk7XG5cdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdGNvbnRleHQuY29udGVudCA9IG51bGw7XG5cdFx0XHRjb250ZXh0LnN0b3AgPSB0cnVlO1xuXHRcdFx0Y29udGV4dC5pZ25vcmUgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb250ZXh0O1xuXHR9XG59XG5cbkRpcmVjdGl2ZS5kZWZpbmUoeyBkaXJlY3RpdmU6IG5ldyBJZigpIH0pOyIsImltcG9ydCBEaXJlY3RpdmUgZnJvbSBcIi4uL0RpcmVjdGl2ZS5qc1wiO1xuaW1wb3J0IFRlbXBsYXRlIGZyb20gXCIuLi9UZW1wbGF0ZS5qc1wiO1xuXG5jbGFzcyBJbmNsdWRlIGV4dGVuZHMgRGlyZWN0aXZlIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdGdldCBuYW1lKCkge1xuXHRcdHJldHVybiBcImluY2x1ZGVcIjtcblx0fVxuXHRnZXQgcmFuaygpIHtcblx0XHRyZXR1cm4gRGlyZWN0aXZlLk1JTl9SQU5LO1xuXHR9XG5cdGdldCBwaGFzZSgpIHtcblx0XHRyZXR1cm4gRGlyZWN0aXZlLlBIQVNFLnRlbXBsYXRlO1xuXHR9XG5cblx0YXN5bmMgZXhlY3V0ZShjb250ZXh0KSB7XG5cdFx0aWYgKCEoY29udGV4dC50ZW1wbGF0ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fCAhY29udGV4dC50ZW1wbGF0ZS5hdHRyKFwianN0bC1pbmNsdWRlXCIpKSByZXR1cm4gY29udGV4dDtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgeyB0ZW1wbGF0ZSwgcmVzb2x2ZXIsIHJlbmRlcmVyIH0gPSBjb250ZXh0O1xuXHRcdFx0bGV0IGluY2x1ZGUgPSB0ZW1wbGF0ZS5hdHRyKFwianN0bC1pbmNsdWRlXCIpO1xuXHRcdFx0aW5jbHVkZSA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmVUZXh0KGluY2x1ZGUpO1xuXHRcdFx0aW5jbHVkZSA9IG5ldyBVUkwoaW5jbHVkZSwgbG9jYXRpb24pO1xuXHRcdFx0aW5jbHVkZSA9IGF3YWl0IFRlbXBsYXRlLmxvYWQoaW5jbHVkZSk7XG5cblx0XHRcdGNvbnN0IG1vZGUgPSB0ZW1wbGF0ZS5hdHRyKFwianN0bC1pbmNsdWRlLW1vZGVcIikgfHwgXCJyZXBsYWNlXCI7XG5cblx0XHRcdGNvbnN0IHN1YkNvbnRleHQgPSBjb250ZXh0LnN1YkNvbnRleHQoeyB0ZW1wbGF0ZTogaW5jbHVkZSwgY29udGFpbmVyOiBjb250ZXh0LmNvbnRlbnQsIG1vZGV9KTtcblx0XHRcdGF3YWl0IHJlbmRlcmVyLnJlbmRlcihzdWJDb250ZXh0KTtcblx0XHRcdGF3YWl0IHN1YkNvbnRleHQucmVhZHkoKTtcblx0XHRcdGNvbnRleHQuaWdub3JlO1xuXG5cdFx0XHRyZXR1cm4gY29udGV4dDtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGUsIGNvbnRleHQudGVtcGxhdGUpO1xuXHRcdFx0cmV0dXJuIGNvbnRleHQ7XG5cdFx0fVxuXHR9XG59XG5cbkRpcmVjdGl2ZS5kZWZpbmUoeyBkaXJlY3RpdmU6IG5ldyBJbmNsdWRlKCkgfSk7XG4iLCJpbXBvcnQgRGlyZWN0aXZlIGZyb20gXCIuLi9EaXJlY3RpdmUuanNcIjtcbmltcG9ydCBSZXBsYWNlIGZyb20gXCIuLi9lbGVtZW50cy9SZXBsYWNlLmpzXCI7XG5cbmNsYXNzIEluaXRpYWwgZXh0ZW5kcyBEaXJlY3RpdmUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIFwiaW5pdGlhbFwiO1xuXHR9XG5cdGdldCByYW5rKCkge1xuXHRcdHJldHVybiBEaXJlY3RpdmUuTUlOX1JBTks7XG5cdH1cblx0Z2V0IHBoYXNlKCkge1xuXHRcdHJldHVybiBEaXJlY3RpdmUuUEhBU0UuaW5pdDtcblx0fVxuXG5cdGFzeW5jIGV4ZWN1dGUoY29udGV4dCkge1xuXHRcdGNvbnN0IHsgdGVtcGxhdGUsIHJlbmRlcmVyLCByZXNvbHZlciB9ID0gY29udGV4dDtcblx0XHRpZiAoISh0ZW1wbGF0ZSBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG5cdFx0XHRjb250ZXh0LmNvbnRlbnQgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblx0XHR9IGVsc2UgaWYgKHRlbXBsYXRlLmF0dHIoXCJqc3RsLWFzeW5jXCIpKSB7XG5cdFx0XHRjb250ZXh0LmNvbnRlbnQgPSBuZXcgUmVwbGFjZSgpO1xuXHRcdFx0dGVtcGxhdGUuYXR0cihcImpzdGwtYXN5bmNcIiwgbnVsbCk7XG5cdFx0XHRjb25zdCByZW5kZXJPcHRpb24gPSBjb250ZXh0LnRvUmVuZGVyT3B0aW9uKHsgbW9kZTogXCJyZXBsYWNlXCIsIHRhcmdldDogY29udGV4dC5jb250ZW50IH0pO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHJlbmRlcmVyLnJlbmRlcihyZW5kZXJPcHRpb24pO1xuXHRcdFx0fSwgcGFyc2VJbnQodGVtcGxhdGUuYXR0cihcImpzdGwtYXN5bmNcIikgfHwgXCIyNTBcIikgfHwgMjUwKTtcblx0XHRcdGNvbnRleHQuc3RvcCA9IHRydWU7XG5cdFx0XHRjb250ZXh0Lmlnbm9yZSA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICh0ZW1wbGF0ZS5hdHRyKFwianN0bC1pZ25vcmVcIikpIHtcblx0XHRcdGNvbnRleHQuY29udGVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXHRcdFx0Y29udGV4dC5zdG9wID0gdHJ1ZTtcblx0XHRcdGNvbnRleHQuaWdub3JlID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgSFRNTFRlbXBsYXRlRWxlbWVudCkge1xuXHRcdFx0Y29udGV4dC5jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0ZW1wbGF0ZS50YWdOYW1lKTtcblx0XHRcdGNvbnN0IHN1YkNvbnRleHQgPSBjb250ZXh0LnN1YkNvbnRleHQoeyB0ZW1wbGF0ZTogdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLCBjb250YWluZXI6IGNvbnRleHQuY29udGVudC5jb250ZW50IH0pO1xuXHRcdFx0YXdhaXQgcmVuZGVyZXIucmVuZGVyKHN1YkNvbnRleHQpO1x0XHRcdFxuXHRcdFx0Y29udGV4dC5zdG9wID0gdHJ1ZTtcblx0XHRcdGNvbnRleHQuaWdub3JlID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHRlbXBsYXRlLmhhc0F0dHJpYnV0ZShcImpzdGwtdGFnbmFtZVwiKSkge1xuXHRcdFx0bGV0IHRhZ25hbWUgPSB0ZW1wbGF0ZS5hdHRyKFwianN0bC10YWduYW1lXCIpLnRyaW0oKTtcblx0XHRcdGlmICh0YWduYW1lLmxlbmd0aCA+IDApIGNvbnRleHQuY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZVRleHQodGVtcGxhdGUuYXR0cihcImpzdGwtdGFnbmFtZVwiKSkpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnRleHQuY29udGVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXHRcdFx0XHRjb250ZXh0LnN0b3AgPSB0cnVlO1xuXHRcdFx0XHRjb250ZXh0Lmlnbm9yZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0ZW1wbGF0ZS50YWdOYW1lKSB7XG5cdFx0XHRjb250ZXh0LmNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRlbXBsYXRlLnRhZ05hbWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250ZXh0LmNvbnRlbnQgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblx0XHRcdGNvbnRleHQuc3RvcCA9IHRydWU7XG5cdFx0XHRjb250ZXh0Lmlnbm9yZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbnRleHQ7XG5cdH1cbn1cblxuRGlyZWN0aXZlLmRlZmluZSh7IGRpcmVjdGl2ZTogbmV3IEluaXRpYWwoKSB9KTtcbiIsImltcG9ydCBEaXJlY3RpdmUgZnJvbSBcIi4uL0RpcmVjdGl2ZS5qc1wiO1xuaW1wb3J0IEV4cHJlc3Npb25SZXNvbHZlciBmcm9tIFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWV4cHJlc3Npb24tbGFuZ3VhZ2Uvc3JjL0V4cHJlc3Npb25SZXNvbHZlclwiO1xuXG5jb25zdCBOQU1FID0gXCJvbi1maW5pc2hlZFwiO1xuY29uc3QgQVRUUklCVVRFX09OX0ZJTklTSEVEID0gYGpzdGwtJHtOQU1FfWA7XG5jb25zdCBBVFRSSUJVVEVfT05fRklOSVNIRURfQVNZTkMgPSBgJHtBVFRSSUJVVEVfT05fRklOSVNIRUR9LWFzeW5jYDtcblxuY2xhc3MgT25GaW5pc2hlZCBleHRlbmRzIERpcmVjdGl2ZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRnZXQgbmFtZSgpIHsgcmV0dXJuIE5BTUUgfVxuXHRnZXQgcmFuaygpIHsgcmV0dXJuIERpcmVjdGl2ZS5NQVhfUkFOSyB9XG5cdGdldCBwaGFzZSgpIHsgcmV0dXJuIERpcmVjdGl2ZS5QSEFTRS5maW5pc2ggfVxuXG5cblxuXHRhc3luYyBleGVjdXRlKGNvbnRleHQpIHtcblx0XHRjb25zdCB7IHRlbXBsYXRlLCBjb250ZW50LCByb290IH0gPSBjb250ZXh0O1xuXHRcdGlmICghKHRlbXBsYXRlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8ICF0ZW1wbGF0ZS5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX09OX0ZJTklTSEVEKSlcblx0XHRcdHJldHVybiBjb250ZXh0O1xuXG5cdFx0Y29uc3QgZXhwcmVzc2lvbiA9IHRlbXBsYXRlLmF0dHIoQVRUUklCVVRFX09OX0ZJTklTSEVEKTtcblx0XHRjb25zdCBhc3luY0NhbGwgPSB0ZW1wbGF0ZS5oYXNBdHRyaWJ1dGUoQVRUUklCVVRFX09OX0ZJTklTSEVEX0FTWU5DKTtcblxuXHRcdGNvbnN0IGRhdGEgPSB7XG5cdFx0XHQkZWxlbWVudDogY29udGVudCxcblx0XHRcdCRyb290OiByb290LFxuXHRcdFx0JHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdH07XG5cdFx0Y29uc3QgcmVzb2x2ZXIgPSBuZXcgRXhwcmVzc2lvblJlc29sdmVyKHsgY29udGV4dDogZGF0YSwgbmFtZTogXCJqc3RsLWRhdGFcIiwgcGFyZW50OiBjb250ZXh0LnJlc29sdmVyIH0pO1xuXG5cblx0XHRjb250ZXh0LmZpbmlzaGVkKGFzeW5jICgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmKCFhc3luY0NhbGwpXG5cdFx0XHRcdFx0cmV0dXJuIHJlc29sdmVyLnJlc29sdmUoZXhwcmVzc2lvbiwgbnVsbCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdHJlc29sdmVyLnJlc29sdmUoZXhwcmVzc2lvbiwgbnVsbCk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBjb250ZXh0O1xuXHR9XG59XG5cbkRpcmVjdGl2ZS5kZWZpbmUoeyBkaXJlY3RpdmU6IG5ldyBPbkZpbmlzaGVkKCkgfSk7IiwiaW1wb3J0IERpcmVjdGl2ZSBmcm9tIFwiLi4vRGlyZWN0aXZlLmpzXCI7XG5pbXBvcnQgRXhwcmVzc2lvblJlc29sdmVyIGZyb20gXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtZXhwcmVzc2lvbi1sYW5ndWFnZS9zcmMvRXhwcmVzc2lvblJlc29sdmVyLmpzXCI7XG5cbmNvbnN0IERJUkVDVElWRU5BTUUgPSBcImpzdGwtcmVwZWF0XCI7XG5jb25zdCBJR05PUkVESVJFQ1RJVkUgPSBuZXcgU2V0KFtESVJFQ1RJVkVOQU1FXSk7XG5cbmNvbnN0IEFUVFJJQlVURSA9IHtcblx0REFUQTogYCR7RElSRUNUSVZFTkFNRX1gLFxuXHRWQVI6IGAke0RJUkVDVElWRU5BTUV9LXZhcmAsXG5cdFNUQVRVUzogYCR7RElSRUNUSVZFTkFNRX0tc3RhdHVzYCxcblx0Q09VTlQ6IGAke0RJUkVDVElWRU5BTUV9LWNvdW50YCxcblx0U1RBUlQ6IGAke0RJUkVDVElWRU5BTUV9LXN0YXJ0YCxcblx0U1RFUDogYCR7RElSRUNUSVZFTkFNRX0tc3RlcGAsXG5cdENPTkRJVElPTjogYCR7RElSRUNUSVZFTkFNRX0tY29uZGl0aW9uYCxcbn07XG5cbmNvbnN0IGRvQ291bnQgPSBhc3luYyAob3B0aW9uKSA9PiB7XG5cdGxldCB7IHN0YXJ0LCBzdGVwLCBjb3VudCwgdmFybmFtZSwgc3RhdHVzLCByZXNvbHZlciB9ID0gb3B0aW9uO1xuXHRjb3VudCA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmUoY291bnQpO1xuXHRjb25zdCBsZW5ndGggPSBzdGFydCArIGNvdW50ICogc3RlcDtcblx0bGV0IHN0b3AgPSBmYWxzZTtcblx0Zm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoICYmICFzdG9wOyBpID0gaSArIHN0ZXApIHtcblx0XHRjb25zdCBpdGVyYXRpb24gPSB7fTtcblx0XHRpdGVyYXRpb25bdmFybmFtZV0gPSBpO1xuXHRcdGl0ZXJhdGlvbltzdGF0dXNdID0ge1xuXHRcdFx0aW5kZXg6IGksXG5cdFx0XHRudW1iZXI6IGkgKyAxLFxuXHRcdFx0c3RlcCxcblx0XHRcdGNvdW50LFxuXHRcdH07XG5cdFx0c3RvcCA9ICEoYXdhaXQgaXRlcmF0ZShpdGVyYXRpb24sIG9wdGlvbikpO1xuXHR9XG59O1xuXG5jb25zdCBkb1JlcGVhdCA9IGFzeW5jIChvcHRpb24pID0+IHtcblx0bGV0IHsgZGF0YSwgc3RhcnQsIHN0ZXAsIGNvdW50LCB2YXJuYW1lLCBzdGF0dXMsIHJlc29sdmVyIH0gPSBvcHRpb247XG5cblx0ZGF0YSA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmUoZGF0YSk7XG5cdGxldCBhcnJheSA9IGRhdGE7XG5cdGlmICghKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkpIGFycmF5ID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZGF0YSk7XG5cblx0Y291bnQgPSBjb3VudCAhPSBcIlwiID8gYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZShjb3VudCwgMCkgOiBudWxsO1xuXHRjb25zdCBsZW5ndGggPSBjb3VudCA/IE1hdGgubWluKHN0YXJ0ICsgY291bnQsIGFycmF5Lmxlbmd0aCkgOiBhcnJheS5sZW5ndGg7XG5cdGxldCBzdG9wID0gZmFsc2U7XG5cdGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGxlbmd0aCAmJiAhc3RvcDsgaSA9IGkgKyBzdGVwKSB7XG5cdFx0Y29uc3QgaXRlcmF0aW9uID0ge307XG5cdFx0aXRlcmF0aW9uW3Zhcm5hbWVdID0gZGF0YVtpXTtcblx0XHRpdGVyYXRpb25bc3RhdHVzXSA9IHtcblx0XHRcdGluZGV4OiBpLFxuXHRcdFx0bnVtYmVyOiBpICsgMSxcblx0XHRcdGNvdW50OiBsZW5ndGgsXG5cdFx0XHRkYXRhLFxuXHRcdH07XG5cdFx0c3RvcCA9ICEoYXdhaXQgaXRlcmF0ZShpdGVyYXRpb24sIG9wdGlvbikpO1xuXHR9XG59O1xuXG5jb25zdCBpdGVyYXRlID0gYXN5bmMgKGRhdGEsIG9wdGlvbikgPT4ge1xuXHRsZXQgeyB0ZW1wbGF0ZSwgcmVzb2x2ZXIsIHJlbmRlcmVyLCBjb25kaXRpb24sIGNvbnRleHQgfSA9IG9wdGlvbjtcblx0cmVzb2x2ZXIgPSBuZXcgRXhwcmVzc2lvblJlc29sdmVyKHsgY29udGV4dDogZGF0YSwgbmFtZTogRElSRUNUSVZFTkFNRSwgcGFyZW50OiByZXNvbHZlciB9KTtcblxuXHRjb25kaXRpb24gPSBjb25kaXRpb24gPyBhd2FpdCByZXNvbHZlci5yZXNvbHZlKGNvbmRpdGlvbiwgZmFsc2UpIDogZmFsc2U7XG5cdGlmIChjb25kaXRpb24pIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBpdGVtQ29udGV4dCA9ICBjb250ZXh0LnN1YkNvbnRleHQoeyByZXNvbHZlciwgdGVtcGxhdGUsIG1vZGU6IFwiYXBwZW5kXCIsIGlnbm9yZURpcmVjdGl2ZTogSUdOT1JFRElSRUNUSVZFIH0pXG5cdGF3YWl0IHJlbmRlcmVyLnJlbmRlcihpdGVtQ29udGV4dCk7XG5cdGF3YWl0IGl0ZW1Db250ZXh0LnJlYWR5KCk7XG5cblx0cmV0dXJuIHRydWU7XG59O1xuXG5jbGFzcyBSZXBlYXQgZXh0ZW5kcyBEaXJlY3RpdmUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIERJUkVDVElWRU5BTUU7XG5cdH1cblx0Z2V0IHJhbmsoKSB7XG5cdFx0cmV0dXJuIERpcmVjdGl2ZS5NSU5fUkFOSyArIDM7XG5cdH1cblx0Z2V0IHBoYXNlKCkge1xuXHRcdHJldHVybiBEaXJlY3RpdmUuUEhBU0UudGVtcGxhdGU7XG5cdH1cblxuXHRhc3luYyBleGVjdXRlKGNvbnRleHQpIHtcblx0XHRpZiAoIShjb250ZXh0LnRlbXBsYXRlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8ICghY29udGV4dC50ZW1wbGF0ZS5hdHRyKEFUVFJJQlVURS5EQVRBKSAmJiAhY29udGV4dC50ZW1wbGF0ZS5hdHRyKEFUVFJJQlVURS5DT1VOVCkpKSByZXR1cm4gY29udGV4dDtcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB7IHRlbXBsYXRlLCByZXNvbHZlciwgcmVuZGVyZXIsIGNvbnRlbnQsIGNvbnRhaW5lciB9ID0gY29udGV4dDtcblx0XHRcdGNvbnN0IG9wdGlvbiA9IHtcblx0XHRcdFx0ZGF0YTogKHRlbXBsYXRlLmF0dHIoQVRUUklCVVRFLkRBVEEpIHx8IFwiXCIpLnRyaW0oKSxcblx0XHRcdFx0Y291bnQ6ICh0ZW1wbGF0ZS5hdHRyKEFUVFJJQlVURS5DT1VOVCkgfHwgXCJcIikudHJpbSgpLFxuXHRcdFx0XHRzdGFydDogYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZSh0ZW1wbGF0ZS5hdHRyKEFUVFJJQlVURS5TVEFSVCkgfHwgXCIwXCIpLFxuXHRcdFx0XHRzdGVwOiBhd2FpdCByZXNvbHZlci5yZXNvbHZlKHRlbXBsYXRlLmF0dHIoQVRUUklCVVRFLlNURVApIHx8IFwiMVwiKSxcblx0XHRcdFx0dmFybmFtZTogKHRlbXBsYXRlLmF0dHIoQVRUUklCVVRFLlZBUikgfHwgXCJpdGVtXCIpLnRyaW0oKSxcblx0XHRcdFx0c3RhdHVzOiAodGVtcGxhdGUuYXR0cihBVFRSSUJVVEUuU1RBVFVTKSB8fCBcInN0YXR1c1wiKS50cmltKCksXG5cdFx0XHRcdGNvbmRpdGlvbjogdGVtcGxhdGUuYXR0cihBVFRSSUJVVEUuQ09ORElUSU9OKSxcblx0XHRcdFx0dGVtcGxhdGU6IHRlbXBsYXRlLFxuXHRcdFx0XHR0YWduYW1lOiBjb250ZW50LnRhZ05hbWUsXG5cdFx0XHRcdHJlc29sdmVyLFxuXHRcdFx0XHRyZW5kZXJlcixcblx0XHRcdFx0Y29udGFpbmVyLFxuXHRcdFx0XHRjb250ZXh0LFxuXHRcdFx0fTtcblx0XHRcdGlmICgoIW9wdGlvbi5kYXRhIHx8IG9wdGlvbi5kYXRhID09IFwiXCIpICYmIG9wdGlvbi5jb3VudCkgYXdhaXQgZG9Db3VudChvcHRpb24pO1xuXHRcdFx0ZWxzZSBhd2FpdCBkb1JlcGVhdChvcHRpb24pO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiZXJyb3IgYXQganN0bC1yZXBlYXQ6XCIsIGVycm9yKTtcblx0XHR9XG5cblx0XHRjb250ZXh0LmNvbnRlbnQgPSBudWxsO1xuXHRcdGNvbnRleHQuc3RvcCA9IHRydWU7XG5cdFx0Y29udGV4dC5pZ25vcmUgPSB0cnVlO1xuXHRcdHJldHVybiBjb250ZXh0O1xuXHR9XG59XG5cbkRpcmVjdGl2ZS5kZWZpbmUoeyBkaXJlY3RpdmU6IG5ldyBSZXBlYXQoKSB9KTtcbiIsImltcG9ydCBEaXJlY3RpdmUgZnJvbSBcIi4uL0RpcmVjdGl2ZS5qc1wiO1xuXG5jb25zdCBERUZBVUxUX09QVElPTiA9IHtcblx0bW9kZTogXCJ0ZXh0XCIsXG5cdHVuc2VjdXJlOiBmYWxzZSxcblx0cHJldmVudEZvcm1hdCA6IGZhbHNlLFxuXHRtYXhMZW5ndGg6IDBcdFxufTtcblxuY29uc3QgU0VDVVJFX0hUTUxfRklMVEVSID0gXCJzY3JpcHQsIHN0eWxlLCBib2R5LCBodG1sLCBoZWFkLCBvYmplY3QsIGxpbmtcIjtcblxuY29uc3QgcmVhZE9wdGlvbiA9IGFzeW5jIChwYXJlbnQsIGNvbnRleHQpID0+IHtcblx0Y29uc3QgcmVzb2x2ZXIgPSBjb250ZXh0LnJlc29sdmVyO1xuXHRyZXR1cm4ge1xuXHRcdG1vZGU6IGF3YWl0IHJlc29sdmVyLnJlc29sdmVUZXh0KChwYXJlbnQuYXR0cihcImpzdGwtdGV4dC1jb250ZW50LXR5cGVcIikgfHwgXCJ0ZXh0XCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSxcblx0XHR1bnNlY3VyZTogcGFyZW50Lmhhc0F0dHJpYnV0ZShcImpzdGwtdGV4dC11bnNlY3VyZVwiKSxcblx0XHRwcmV2ZW50Rm9ybWF0OiAhIXBhcmVudC5hdHRyKFwianN0bC10ZXh0LXByZXZlbnQtZm9ybWF0XCIpIHx8IGZhbHNlLFxuXHRcdG1heExlbmd0aDogcGFyc2VJbnQoYXdhaXQgcmVzb2x2ZXIucmVzb2x2ZVRleHQocGFyZW50LmF0dHIoXCJqc3RsLXRleHQtdHJpbS1sZW5ndGhcIikgfHwgXCIwXCIpKVxuXHR9O1xufTtcblxuY29uc3QgdHJpbVRleHRMZW5ndGggPSAodGV4dCwgbGVuZ3RoKSA9PiB7XG5cdHJldHVybiB0ZXh0Lmxlbmd0aCA+IGxlbmd0aCA/IHRleHQuc3Vic3RyaW5nKDAsIGxlbmd0aCAtIDMpLnRyaW0oKSArIFwiLi4uXCIgOiB0ZXh0O1xufTtcblxuY29uc3QgTU9ERVMgPSB7XG5cdFwidGV4dFwiIDogYXN5bmMgKG9wdGlvbiwgY29udGV4dCkgPT4ge1xuXHRcdGNvbnN0IHtjb250ZW50LCByZXNvbHZlciwgdGVtcGxhdGV9ID0gY29udGV4dDtcblx0XHRcblx0XHRsZXQgdGV4dCA9IGF3YWl0IHJlc29sdmVyLnJlc29sdmVUZXh0KHRlbXBsYXRlLnRleHRDb250ZW50KTtcdFx0XG5cdFx0dGV4dCA9IGNyZWF0ZSh0ZXh0LHRydWUpLmNvbnRlbnQudGV4dENvbnRlbnQ7XG5cdFx0aWYob3B0aW9uLm1heExlbmd0aCA+IDApXG5cdFx0XHR0ZXh0ID0gdHJpbVRleHRMZW5ndGgodGV4dCwgb3B0aW9uLm1heExlbmd0aCk7XHRcdFxuXHRcdFxuXHRcdGNvbnRlbnQudGV4dENvbnRlbnQgPSB0ZXh0O1x0XHRcblx0fSxcblx0XCJodG1sXCI6IGFzeW5jIChvcHRpb24sIGNvbnRleHQpID0+IHtcblx0XHRjb25zdCB7cmVzb2x2ZXIsIHRlbXBsYXRlfSA9IGNvbnRleHQ7XG5cdFx0XG5cdFx0bGV0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlci5yZXNvbHZlVGV4dCh0ZW1wbGF0ZS50ZXh0Q29udGVudCk7XHRcdFxuXHRcdGNvbnRlbnQgPSBjcmVhdGUoY29udGVudCx0cnVlKTtcdFx0XG5cdFx0Y29udGVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUoY29udGVudC5jb250ZW50LCB0cnVlKTtcblx0XHRcblx0XHRpZihvcHRpb24udW5zZWN1cmUpXG5cdFx0XHRjb250ZXh0LmNvbnRlbnQgPSBjb250ZW50O1x0XHRcdFxuXHRcdGVsc2V7XG5cdFx0XHRjb250ZW50LmZpbmQoU0VDVVJFX0hUTUxfRklMVEVSKS5yZW1vdmUoKTtcdFx0XHRcblx0XHRcdGNvbnRleHQuY29udGVudCA9IGNvbnRlbnQ7XG5cdFx0fVxuXHR9XG59O1xuXG5cbmNsYXNzIFRleHRDb250ZW50IGV4dGVuZHMgRGlyZWN0aXZlIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdGdldCBuYW1lKCkgeyByZXR1cm4gXCJ0ZXh0XCIgfVxuXHRnZXQgcmFuaygpIHsgcmV0dXJuIERpcmVjdGl2ZS5NSU5fUkFOSyArIDEgfVxuXHRnZXQgcGhhc2UoKSB7IHJldHVybiBEaXJlY3RpdmUuUEhBU0UuY29udGVudCB9XG5cblxuXG5cdGFzeW5jIGV4ZWN1dGUoY29udGV4dCkge1xuXHRcdGNvbnN0IHsgdGVtcGxhdGUgfSA9IGNvbnRleHQ7XG5cdFx0aWYgKCEodGVtcGxhdGUgaW5zdGFuY2VvZiBUZXh0KSB8fCB0ZW1wbGF0ZS50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoID09IDAgfHwgKHRlbXBsYXRlLnBhcmVudEVsZW1lbnQgJiYgdGVtcGxhdGUucGFyZW50RWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJqc3RsLXRleHQtaWdub3JlXCIpKSlcblx0XHRcdHJldHVybiBjb250ZXh0O1xuXG5cdFx0Y29uc3QgcGFyZW50ID0gdGVtcGxhdGUucGFyZW50RWxlbWVudDtcblx0XHRjb25zdCBvcHRpb24gPSBwYXJlbnQgPyBhd2FpdCByZWFkT3B0aW9uKHBhcmVudCwgY29udGV4dCkgOiBERUZBVUxUX09QVElPTjtcblx0XHRcblx0XHRjb25zdCAgbW9kZSA9IE1PREVTW29wdGlvbi5tb2RlXTtcblx0XHRpZighbW9kZSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRleHQgbW9kZSBcXFwiXCIrIG9wdGlvbi5tb2RlICsgXCJcXFwiIGlzIHVuc3VwcG9ydGVkIVwiKTtcblx0XHRcblx0XHRhd2FpdCBtb2RlKG9wdGlvbiwgY29udGV4dCk7XG5cdFx0XG5cdFx0cmV0dXJuIGNvbnRleHQ7XG5cdH1cbn1cblxuRGlyZWN0aXZlLmRlZmluZSh7IGRpcmVjdGl2ZTogbmV3IFRleHRDb250ZW50KCkgfSk7IiwiaW1wb3J0IFwiLi9Jbml0aWFsLmpzXCI7XG5pbXBvcnQgXCIuL0RhdGEuanNcIjtcbmltcG9ydCBcIi4vSWYuanNcIjtcbmltcG9ydCBcIi4vQ2hvb3NlLmpzXCI7XG5pbXBvcnQgXCIuL0luY2x1ZGUuanNcIjtcbmltcG9ydCBcIi4vRm9yZWFjaC5qc1wiO1xuaW1wb3J0IFwiLi9SZXBlYXQuanNcIjtcbmltcG9ydCBcIi4vVGV4dC5qc1wiO1xuaW1wb3J0IFwiLi9BdHRyaWJ1dGVzLmpzXCI7XG5pbXBvcnQgXCIuL09uRmluaXNoZWQuanNcIjsiLCJpbXBvcnQgRWxlbWVudCBmcm9tIFwiLi4vRWxlbWVudC5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcGxhY2VFbGVtZW50IGV4dGVuZHMgRWxlbWVudHtcblx0Y29uc3RydWN0b3IoKXtcblx0XHRzdXBlcigpO1xuXHRcdFxuXHRcdHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcblx0fVxuXHRhc3luYyBleGVjdXRlKHt0ZW1wbGF0ZSwgY29udGV4dH0pe1xuXHRcdHJldHVybiBjb250ZXh0O1xuXHR9O1x0XHRcbn1cbnRyeXtjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJqc3RsLXJlcGxhY2VcIiwgUmVwbGFjZUVsZW1lbnQpO31jYXRjaChlKXt9Ly9pZ25vcmUiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJpbXBvcnQgXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtZXh0ZG9tXCI7XG5pbXBvcnQgXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtY29tbW9uLXV0aWxzL2Jyb3dzZXJcIjtcbmltcG9ydCBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1pY2FsL2Jyb3dzZXItaW5kZXhcIjtcbmltcG9ydCBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1leHByZXNzaW9uLWxhbmd1YWdlL2Jyb3dzZXJcIjtcbmltcG9ydCBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy10ZW1wbGF0ZS1sYW5ndWFnZS9icm93c2VyXCI7XG5pbXBvcnQgXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1mb3JtL2Jyb3dzZXJcIjtcbmltcG9ydCBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWNvbXBvbmVudHMvYnJvd3Nlci1idW5kbGVcIjtcbi8vV2ViIENvbXBvbmVudHNcbmltcG9ydCBcIkBkZWZhdWx0LWpzL2RlZmF1bHRqcy1odG1sLWpzb25kYXRhL2Jyb3dzZXItYnVuZGxlXCI7XG5pbXBvcnQgXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1yZXF1ZXN0L2Jyb3dzZXItYnVuZGxlXCI7XG5pbXBvcnQgXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1wYWdpbmF0aW9uL2Jyb3dzZXItYnVuZGxlXCI7XG5pbXBvcnQgXCJAZGVmYXVsdC1qcy9kZWZhdWx0anMtaHRtbC1yZW5kZXJlci9icm93c2VyLWJ1bmRsZVwiO1xuaW1wb3J0IFwiQGRlZmF1bHQtanMvZGVmYXVsdGpzLWh0bWwtdHlwZWFoZWFkL2Jyb3dzZXItYnVuZGxlXCI7Il0sInNvdXJjZVJvb3QiOiIifQ==