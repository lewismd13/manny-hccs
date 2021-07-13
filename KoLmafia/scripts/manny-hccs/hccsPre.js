(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/libram/dist/template-string.js":
/*!*****************************************************!*\
  !*** ./node_modules/libram/dist/template-string.js ***!
  \*****************************************************/
/*! namespace exports */
/*! export $bounties [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $bounty [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $class [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $classes [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $coinmaster [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $coinmasters [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $effect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $effects [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $element [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $elements [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $familiar [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $familiars [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $item [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $items [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $location [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $locations [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $monster [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $monsters [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $phyla [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $phylum [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $servant [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $servants [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $skill [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $skills [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $slot [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $slots [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $stat [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $stats [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $thrall [provided] [no usage info] [missing usage info prevents renaming] */
/*! export $thralls [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$bounty": () => /* binding */ $bounty,
/* harmony export */   "$bounties": () => /* binding */ $bounties,
/* harmony export */   "$class": () => /* binding */ $class,
/* harmony export */   "$classes": () => /* binding */ $classes,
/* harmony export */   "$coinmaster": () => /* binding */ $coinmaster,
/* harmony export */   "$coinmasters": () => /* binding */ $coinmasters,
/* harmony export */   "$effect": () => /* binding */ $effect,
/* harmony export */   "$effects": () => /* binding */ $effects,
/* harmony export */   "$element": () => /* binding */ $element,
/* harmony export */   "$elements": () => /* binding */ $elements,
/* harmony export */   "$familiar": () => /* binding */ $familiar,
/* harmony export */   "$familiars": () => /* binding */ $familiars,
/* harmony export */   "$item": () => /* binding */ $item,
/* harmony export */   "$items": () => /* binding */ $items,
/* harmony export */   "$location": () => /* binding */ $location,
/* harmony export */   "$locations": () => /* binding */ $locations,
/* harmony export */   "$monster": () => /* binding */ $monster,
/* harmony export */   "$monsters": () => /* binding */ $monsters,
/* harmony export */   "$phylum": () => /* binding */ $phylum,
/* harmony export */   "$phyla": () => /* binding */ $phyla,
/* harmony export */   "$servant": () => /* binding */ $servant,
/* harmony export */   "$servants": () => /* binding */ $servants,
/* harmony export */   "$skill": () => /* binding */ $skill,
/* harmony export */   "$skills": () => /* binding */ $skills,
/* harmony export */   "$slot": () => /* binding */ $slot,
/* harmony export */   "$slots": () => /* binding */ $slots,
/* harmony export */   "$stat": () => /* binding */ $stat,
/* harmony export */   "$stats": () => /* binding */ $stats,
/* harmony export */   "$thrall": () => /* binding */ $thrall,
/* harmony export */   "$thralls": () => /* binding */ $thralls
/* harmony export */ });
var __spreadArrays = undefined && undefined.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var concatTemplateString = function concatTemplateString(literals) {
  var placeholders = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    placeholders[_i - 1] = arguments[_i];
  }

  return literals.reduce(function (acc, literal, i) {
    return acc + literal + (placeholders[i] || "");
  }, "");
};

var createSingleConstant = function createSingleConstant(Type) {
  return function (literals) {
    var placeholders = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      placeholders[_i - 1] = arguments[_i];
    }

    var input = concatTemplateString.apply(void 0, __spreadArrays([literals], placeholders));
    return Type.get(input);
  };
};

var createPluralConstant = function createPluralConstant(Type) {
  return function (literals) {
    var placeholders = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      placeholders[_i - 1] = arguments[_i];
    }

    var input = concatTemplateString.apply(void 0, __spreadArrays([literals], placeholders));

    if (input === "") {
      return Type.all();
    }

    return Type.get(input.split(","));
  };
};
/**
 * A Bounty specified by name.
 */


var $bounty = createSingleConstant(Bounty);
/**
 * A list of Bounties specified by a comma-separated list of names.
 * For a list of all possible Bounties, leave the template string blank.
 */

var $bounties = createPluralConstant(Bounty);
/**
 * A Class specified by name.
 */

var $class = createSingleConstant(Class);
/**
 * A list of Classes specified by a comma-separated list of names.
 * For a list of all possible Classes, leave the template string blank.
 */

var $classes = createPluralConstant(Class);
/**
 * A Coinmaster specified by name.
 */

var $coinmaster = createSingleConstant(Coinmaster);
/**
 * A list of Coinmasters specified by a comma-separated list of names.
 * For a list of all possible Coinmasters, leave the template string blank.
 */

var $coinmasters = createPluralConstant(Coinmaster);
/**
 * An Effect specified by name.
 */

var $effect = createSingleConstant(Effect);
/**
 * A list of Effects specified by a comma-separated list of names.
 * For a list of all possible Effects, leave the template string blank.
 */

var $effects = createPluralConstant(Effect);
/**
 * An Element specified by name.
 */

var $element = createSingleConstant(Element);
/**
 * A list of Elements specified by a comma-separated list of names.
 * For a list of all possible Elements, leave the template string blank.
 */

var $elements = createPluralConstant(Element);
/**
 * A Familiar specified by name.
 */

var $familiar = createSingleConstant(Familiar);
/**
 * A list of Familiars specified by a comma-separated list of names.
 * For a list of all possible Familiars, leave the template string blank.
 */

var $familiars = createPluralConstant(Familiar);
/**
 * An Item specified by name.
 */

var $item = createSingleConstant(Item);
/**
 * A list of Items specified by a comma-separated list of names.
 * For a list of all possible Items, leave the template string blank.
 */

var $items = createPluralConstant(Item);
/**
 * A Location specified by name.
 */

var $location = createSingleConstant(Location);
/**
 * A list of Locations specified by a comma-separated list of names.
 * For a list of all possible Locations, leave the template string blank.
 */

var $locations = createPluralConstant(Location);
/**
 * A Monster specified by name.
 */

var $monster = createSingleConstant(Monster);
/**
 * A list of Monsters specified by a comma-separated list of names.
 * For a list of all possible Monsters, leave the template string blank.
 */

var $monsters = createPluralConstant(Monster);
/**
 * A Phylum specified by name.
 */

var $phylum = createSingleConstant(Phylum);
/**
 * A list of Phyla specified by a comma-separated list of names.
 * For a list of all possible Phyla, leave the template string blank.
 */

var $phyla = createPluralConstant(Phylum);
/**
 * A Servant specified by name.
 */

var $servant = createSingleConstant(Servant);
/**
 * A list of Servants specified by a comma-separated list of names.
 * For a list of all possible Servants, leave the template string blank.
 */

var $servants = createPluralConstant(Servant);
/**
 * A Skill specified by name.
 */

var $skill = createSingleConstant(Skill);
/**
 * A list of Skills specified by a comma-separated list of names.
 * For a list of all possible Skills, leave the template string blank.
 */

var $skills = createPluralConstant(Skill);
/**
 * A Slot specified by name.
 */

var $slot = createSingleConstant(Slot);
/**
 * A list of Slots specified by a comma-separated list of names.
 * For a list of all possible Slots, leave the template string blank.
 */

var $slots = createPluralConstant(Slot);
/**
 * A Stat specified by name.
 */

var $stat = createSingleConstant(Stat);
/**
 * A list of Stats specified by a comma-separated list of names.
 * For a list of all possible Stats, leave the template string blank.
 */

var $stats = createPluralConstant(Stat);
/**
 * A Thrall specified by name.
 */

var $thrall = createSingleConstant(Thrall);
/**
 * A list of Thralls specified by a comma-separated list of names.
 * For a list of all possible Thralls, leave the template string blank.
 */

var $thralls = createPluralConstant(Thrall);

/***/ }),

/***/ "./src/hccsPre.ts":
/*!************************!*\
  !*** ./src/hccsPre.ts ***!
  \************************/
/*! namespace exports */
/*! exports [not provided] [maybe used in hccsPre (runtime-defined)] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kolmafia */ "kolmafia");
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(kolmafia__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var libram__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libram */ "./node_modules/libram/dist/template-string.js");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }




if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getClanId)() !== 40382) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)("/whitelist alliance from hell");
}

if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myInebriety)() === (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.inebrietyLimit)() && (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myFullness)() === (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.fullnessLimit)()) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myFamiliar)() !== (0,libram__WEBPACK_IMPORTED_MODULE_1__.$familiar)(_templateObject || (_templateObject = _taggedTemplateLiteral(["stooper"])))) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$familiar)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["stooper"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.useSkill)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["the ode to booze"]))), 1);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.drinksilent)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["elemental caipiroska"]))));
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.useSkill)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["the ode to booze"]))), 1);
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.takeStash)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["tiny plastic sword"]))), 1);
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.create)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["grogtini"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.drinksilent)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["grogtini"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.putStash)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["tiny plastic sword"]))), 1);
} else {
  throw "are you sure you want to ascend? you have some open organ space";
}

while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myAdventures)() > 4) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)("dungeonfist");
}

if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getWorkshed)() !== (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["little geneticist DNA-splicing lab"])))) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.takeStash)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["little geneticist DNA-splicing lab"]))), 1);
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.use)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["little geneticist DNA-splicing lab"]))));
}

if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myGardenType)() !== "peppermint") {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.use)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["peppermint pip packet"]))));
}

/***/ }),

/***/ "kolmafia":
/*!***************************!*\
  !*** external "kolmafia" ***!
  \***************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

module.exports = require("kolmafia");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 				() => module['default'] :
/******/ 				() => module;
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/hccsPre.ts");
/******/ })()

));