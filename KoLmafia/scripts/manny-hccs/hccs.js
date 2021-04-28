(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/libram/dist/combat.js":
/*!********************************************!*\
  !*** ./node_modules/libram/dist/combat.js ***!
  \********************************************/
/*! namespace exports */
/*! export Macro [provided] [no usage info] [missing usage info prevents renaming] */
/*! export adventureMacro [provided] [no usage info] [missing usage info prevents renaming] */
/*! export adventureMacroAuto [provided] [no usage info] [missing usage info prevents renaming] */
/*! export banishedMonsters [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getMacroId [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getMacroId": () => /* binding */ getMacroId,
/* harmony export */   "Macro": () => /* binding */ Macro,
/* harmony export */   "banishedMonsters": () => /* binding */ banishedMonsters,
/* harmony export */   "adventureMacro": () => /* binding */ adventureMacro,
/* harmony export */   "adventureMacroAuto": () => /* binding */ adventureMacroAuto
/* harmony export */ });
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kolmafia */ "kolmafia");
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(kolmafia__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _property__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./property */ "./node_modules/libram/dist/property.js");
/* harmony import */ var _template_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./template-string */ "./node_modules/libram/dist/template-string.js");
var __makeTemplateObject = undefined && undefined.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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




var MACRO_NAME = "Script Autoattack Macro";
/**
 * Get the KoL native ID of the macro with name Script Autoattack Macro.
 * @returns {number} The macro ID.
 */

function getMacroId() {
  var macroMatches = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.xpath)((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("account_combatmacros.php"), "//select[@name=\"macroid\"]/option[text()=\"" + MACRO_NAME + "\"]/@value");

  if (macroMatches.length === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("account_combatmacros.php?action=new");
    var newMacroText = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("account_combatmacros.php?macroid=0&name=" + MACRO_NAME + "&macrotext=abort&action=save");
    return parseInt((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.xpath)(newMacroText, "//input[@name=macroid]/@value")[0], 10);
  } else {
    return parseInt(macroMatches[0], 10);
  }
}

function itemOrNameToItem(itemOrName) {
  return typeof itemOrName === "string" ? Item.get(itemOrName) : itemOrName;
}

function itemOrItemsBallsMacroName(itemOrItems) {
  if (Array.isArray(itemOrItems)) {
    return itemOrItems.map(itemOrItemsBallsMacroName).join(", ");
  } else {
    var item = itemOrNameToItem(itemOrItems);
    return item.name;
  }
}

function itemOrItemsBallsMacroPredicate(itemOrItems) {
  if (Array.isArray(itemOrItems)) {
    return itemOrItems.map(itemOrItemsBallsMacroName).join(" && ");
  } else {
    return "hascombatitem " + itemOrItems;
  }
}

function skillOrNameToSkill(skillOrName) {
  if (typeof skillOrName === "string") {
    return Skill.get(skillOrName);
  } else {
    return skillOrName;
  }
}

function skillBallsMacroName(skillOrName) {
  var skill = skillOrNameToSkill(skillOrName);
  return skill.name.match(/^[A-Za-z ]+$/) ? skill.name : (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.toInt)(skill);
}
/**
 * BALLS macro builder for direct submission to KoL.
 * Create a new macro with `new Macro()` and add steps using the instance methods.
 * Uses a fluent interface, so each step returns the object for easy chaining of steps.
 * Each method is also defined as a static method that creates a new Macro with only that step.
 * For example, you can do `Macro.skill('Saucestorm').attack()`.
 */


var Macro =
/** @class */
function () {
  function Macro() {
    this.components = [];
  }
  /**
   * Convert macro to string.
   */


  Macro.prototype.toString = function () {
    return this.components.join(";");
  };
  /**
   * Save a macro to a Mafia property for use in a consult script.
   */


  Macro.prototype.save = function () {
    (0,_property__WEBPACK_IMPORTED_MODULE_1__.set)(Macro.SAVED_MACRO_PROPERTY, this.toString());
  };
  /**
   * Load a saved macro from the Mafia property.
   */


  Macro.load = function () {
    var _a;

    return (_a = new this()).step.apply(_a, (0,_property__WEBPACK_IMPORTED_MODULE_1__.get)(Macro.SAVED_MACRO_PROPERTY).split(";"));
  };
  /**
   * Clear the saved macro in the Mafia property.
   */


  Macro.clearSaved = function () {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.removeProperty)(Macro.SAVED_MACRO_PROPERTY);
  };
  /**
   * Statefully add one or several steps to a macro.
   * @param nextSteps The steps to add to the macro.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.step = function () {
    var _a;

    var nextSteps = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      nextSteps[_i] = arguments[_i];
    }

    var nextStepsStrings = (_a = []).concat.apply(_a, nextSteps.map(function (x) {
      return x instanceof Macro ? x.components : [x];
    }));

    this.components = __spreadArrays(this.components, nextStepsStrings.filter(function (s) {
      return s.length > 0;
    }));
    return this;
  };
  /**
   * Statefully add one or several steps to a macro.
   * @param nextSteps The steps to add to the macro.
   * @returns {Macro} This object itself.
   */


  Macro.step = function () {
    var _a;

    var nextSteps = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      nextSteps[_i] = arguments[_i];
    }

    return (_a = new this()).step.apply(_a, nextSteps);
  };
  /**
   * Submit the built macro to KoL. Only works inside combat.
   */


  Macro.prototype.submit = function () {
    var _final = this.toString();

    return (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("fight.php?action=macro&macrotext=" + (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.urlEncode)(_final), true, true);
  };
  /**
   * Set this macro as a KoL native autoattack.
   */


  Macro.prototype.setAutoAttack = function () {
    if (Macro.cachedMacroId === null) Macro.cachedMacroId = getMacroId();

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getAutoAttack)() === 99000000 + Macro.cachedMacroId && this.toString() === Macro.cachedAutoAttack) {
      // This macro is already set. Don"t make the server request.
      return;
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("account_combatmacros.php?macroid=" + Macro.cachedMacroId + "&name=" + (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.urlEncode)(MACRO_NAME) + "&macrotext=" + (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.urlEncode)(this.toString()) + "&action=save", true, true);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("account.php?am=1&action=autoattack&value=" + (99000000 + Macro.cachedMacroId) + "&ajax=1");
    Macro.cachedAutoAttack = this.toString();
  };
  /**
   * Add an "abort" step to this macro.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.abort = function () {
    return this.step("abort");
  };
  /**
   * Create a new macro with an "abort" step.
   * @returns {Macro} This object itself.
   */


  Macro.abort = function () {
    return new this().abort();
  };
  /**
   * Add an "if" statement to this macro.
   * @param condition The BALLS condition for the if statement.
   * @param ifTrue Continuation if the condition is true.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.if_ = function (condition, ifTrue) {
    return this.step("if " + condition).step(ifTrue).step("endif");
  };
  /**
   * Create a new macro with an "if" statement.
   * @param condition The BALLS condition for the if statement.
   * @param ifTrue Continuation if the condition is true.
   * @returns {Macro} This object itself.
   */


  Macro.if_ = function (condition, ifTrue) {
    return new this().if_(condition, ifTrue);
  };
  /**
   * Add a "while" statement to this macro.
   * @param condition The BALLS condition for the if statement.
   * @param contents Loop to repeat while the condition is true.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.while_ = function (condition, contents) {
    return this.step("while " + condition).step(contents).step("endwhile");
  };
  /**
   * Create a new macro with a "while" statement.
   * @param condition The BALLS condition for the if statement.
   * @param contents Loop to repeat while the condition is true.
   * @returns {Macro} This object itself.
   */


  Macro.while_ = function (condition, contents) {
    return new this().while_(condition, contents);
  };
  /**
   * Conditionally add a step to a macro based on a condition evaluated at the time of building the macro.
   * @param condition The JS condition.
   * @param ifTrue Continuation to add if the condition is true.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.externalIf = function (condition, ifTrue) {
    return condition ? this.step(ifTrue) : this;
  };
  /**
   * Create a new macro with a condition evaluated at the time of building the macro.
   * @param condition The JS condition.
   * @param ifTrue Continuation to add if the condition is true.
   * @returns {Macro} This object itself.
   */


  Macro.externalIf = function (condition, ifTrue) {
    return new this().externalIf(condition, ifTrue);
  };
  /**
   * Add a repeat step to the macro.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.repeat = function () {
    return this.step("repeat");
  };
  /**
   * Add one or more skill cast steps to the macro.
   * @param skills Skills to cast.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.skill = function () {
    var skills = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      skills[_i] = arguments[_i];
    }

    return this.step.apply(this, skills.map(function (skill) {
      return "skill " + skillBallsMacroName(skill);
    }));
  };
  /**
   * Create a new macro with one or more skill cast steps.
   * @param skills Skills to cast.
   * @returns {Macro} This object itself.
   */


  Macro.skill = function () {
    var _a;

    var skills = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      skills[_i] = arguments[_i];
    }

    return (_a = new this()).skill.apply(_a, skills);
  };
  /**
   * Add one or more skill cast steps to the macro, where each step checks if you have the skill first.
   * @param skills Skills to try casting.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.trySkill = function () {
    var skills = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      skills[_i] = arguments[_i];
    }

    return this.step.apply(this, skills.map(function (skill) {
      return Macro.if_("hasskill " + skillBallsMacroName(skill), Macro.skill(skill));
    }));
  };
  /**
   * Create a new macro with one or more skill cast steps, where each step checks if you have the skill first.
   * @param skills Skills to try casting.
   * @returns {Macro} This object itself.
   */


  Macro.trySkill = function () {
    var _a;

    var skills = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      skills[_i] = arguments[_i];
    }

    return (_a = new this()).trySkill.apply(_a, skills);
  };
  /**
   * Add one or more skill-cast-and-repeat steps to the macro, where each step checks if you have the skill first.
   * @param skills Skills to try repeatedly casting.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.trySkillRepeat = function () {
    var skills = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      skills[_i] = arguments[_i];
    }

    return this.step.apply(this, skills.map(function (skill) {
      return Macro.if_("hasskill " + skillBallsMacroName(skill), Macro.skill(skill).repeat());
    }));
  };
  /**
   * Create a new macro with one or more skill-cast-and-repeat steps, where each step checks if you have the skill first.
   * @param skills Skills to try repeatedly casting.
   * @returns {Macro} This object itself.
   */


  Macro.trySkillRepeat = function () {
    var _a;

    var skills = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      skills[_i] = arguments[_i];
    }

    return (_a = new this()).trySkillRepeat.apply(_a, skills);
  };
  /**
   * Add one or more item steps to the macro.
   * @param items Items to use. Pass a tuple [item1, item2] to funksling.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.item = function () {
    var items = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }

    return this.step.apply(this, items.map(function (itemOrItems) {
      return "use " + itemOrItemsBallsMacroName(itemOrItems);
    }));
  };
  /**
   * Create a new macro with one or more item steps.
   * @param items Items to use. Pass a tuple [item1, item2] to funksling.
   * @returns {Macro} This object itself.
   */


  Macro.item = function () {
    var _a;

    var items = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }

    return (_a = new this()).item.apply(_a, items);
  };
  /**
   * Add one or more item steps to the macro, where each step checks to see if you have the item first.
   * @param items Items to try using. Pass a tuple [item1, item2] to funksling.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.tryItem = function () {
    var items = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }

    return this.step.apply(this, items.map(function (item) {
      return Macro.if_("hascombatitem " + itemOrItemsBallsMacroPredicate(item), "use " + itemOrItemsBallsMacroName(item));
    }));
  };
  /**
   * Create a new macro with one or more item steps, where each step checks to see if you have the item first.
   * @param items Items to try using. Pass a tuple [item1, item2] to funksling.
   * @returns {Macro} This object itself.
   */


  Macro.tryItem = function () {
    var _a;

    var items = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }

    return (_a = new this()).tryItem.apply(_a, items);
  };
  /**
   * Add an attack step to the macro.
   * @returns {Macro} This object itself.
   */


  Macro.prototype.attack = function () {
    return this.step("attack");
  };
  /**
   * Create a new macro with an attack step.
   * @returns {Macro} This object itself.
   */


  Macro.attack = function () {
    return new this().attack();
  };

  Macro.SAVED_MACRO_PROPERTY = "libram_savedMacro";
  Macro.cachedMacroId = null;
  Macro.cachedAutoAttack = null;
  return Macro;
}();


function banishedMonsters() {
  var banishedstring = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getProperty)("banishedMonsters");
  var banishedComponents = banishedstring.split(":");
  var result = new Map();
  if (banishedComponents.length < 3) return result;

  for (var idx = 0; idx < banishedComponents.length / 3 - 1; idx++) {
    var foe = Monster.get(banishedComponents[idx * 3]);
    var banisher = banishedComponents[idx * 3 + 1]; // toItem doesn"t error if the item doesn"t exist, so we have to use that.

    var banisherItem = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.toItem)(banisher);
    var banisherObject = [(0,_template_string__WEBPACK_IMPORTED_MODULE_2__.$item)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["none"], ["none"]))), null].includes(banisherItem) ? Skill.get(banisher) : banisherItem;
    result.set(banisherObject, foe);
  }

  return result;
}
/**
 * Adventure in a location and handle all combats with a given macro.
 * To use this function you will need to create a consult script that runs Macro.load().submit() and a CCS that calls that consult script.
 * See examples/consult.ts for an example.
 * @param loc Location to adventure in.
 * @param macro Macro to execute.
 */

function adventureMacro(loc, macro) {
  macro.save();

  try {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.adv1)(loc, 0, "");

    while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.inMultiFight)()) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.runCombat)();
    }

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.choiceFollowsFight)()) (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("choice.php");
  } finally {
    Macro.clearSaved();
  }
}
/**
 * Adventure in a location and handle all combats with a given autoattack and manual macro.
 * To use the nextMacro parameter you will need to create a consult script that runs Macro.load().submit() and a CCS that calls that consult script.
 * See examples/consult.ts for an example.
 * @param loc Location to adventure in.
 * @param autoMacro Macro to execute via KoL autoattack.
 * @param nextMacro Macro to execute manually after autoattack completes.
 */

function adventureMacroAuto(loc, autoMacro, nextMacro) {
  if (nextMacro === void 0) {
    nextMacro = null;
  }

  nextMacro = nextMacro !== null && nextMacro !== void 0 ? nextMacro : Macro.abort();
  autoMacro.setAutoAttack();
  adventureMacro(loc, nextMacro);
}
var templateObject_1;

/***/ }),

/***/ "./node_modules/libram/dist/console.js":
/*!*********************************************!*\
  !*** ./node_modules/libram/dist/console.js ***!
  \*********************************************/
/*! namespace exports */
/*! export error [provided] [no usage info] [missing usage info prevents renaming] */
/*! export info [provided] [no usage info] [missing usage info prevents renaming] */
/*! export log [provided] [no usage info] [missing usage info prevents renaming] */
/*! export warn [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "log": () => /* binding */ log,
/* harmony export */   "info": () => /* binding */ info,
/* harmony export */   "warn": () => /* binding */ warn,
/* harmony export */   "error": () => /* binding */ error
/* harmony export */ });
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kolmafia */ "kolmafia");
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(kolmafia__WEBPACK_IMPORTED_MODULE_0__);
 // eslint-disable-next-line @typescript-eslint/no-explicit-any

var logColor = function logColor(color) {
  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var output = args.map(function (x) {
      return x.toString();
    }).join(" ");

    if (color) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)(output, color);
    } else {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)(output);
    }
  };
};

var log = logColor();
var info = logColor("blue");
var warn = logColor("red");
var error = logColor("red");

/***/ }),

/***/ "./node_modules/libram/dist/property.js":
/*!**********************************************!*\
  !*** ./node_modules/libram/dist/property.js ***!
  \**********************************************/
/*! namespace exports */
/*! export createMafiaClassPropertyGetter [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createPropertyGetter [provided] [no usage info] [missing usage info prevents renaming] */
/*! export get [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getBoolean [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getBounty [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getClass [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getCoinmaster [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getCommaSeparated [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getEffect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getElement [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getFamiliar [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getLocation [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getMonster [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getNumber [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getPhylum [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getServant [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSkill [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSlot [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getStat [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getString [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getThrall [provided] [no usage info] [missing usage info prevents renaming] */
/*! export set [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPropertyGetter": () => /* binding */ createPropertyGetter,
/* harmony export */   "createMafiaClassPropertyGetter": () => /* binding */ createMafiaClassPropertyGetter,
/* harmony export */   "getString": () => /* binding */ getString,
/* harmony export */   "getCommaSeparated": () => /* binding */ getCommaSeparated,
/* harmony export */   "getBoolean": () => /* binding */ getBoolean,
/* harmony export */   "getNumber": () => /* binding */ getNumber,
/* harmony export */   "getBounty": () => /* binding */ getBounty,
/* harmony export */   "getClass": () => /* binding */ getClass,
/* harmony export */   "getCoinmaster": () => /* binding */ getCoinmaster,
/* harmony export */   "getEffect": () => /* binding */ getEffect,
/* harmony export */   "getElement": () => /* binding */ getElement,
/* harmony export */   "getFamiliar": () => /* binding */ getFamiliar,
/* harmony export */   "getItem": () => /* binding */ getItem,
/* harmony export */   "getLocation": () => /* binding */ getLocation,
/* harmony export */   "getMonster": () => /* binding */ getMonster,
/* harmony export */   "getPhylum": () => /* binding */ getPhylum,
/* harmony export */   "getServant": () => /* binding */ getServant,
/* harmony export */   "getSkill": () => /* binding */ getSkill,
/* harmony export */   "getSlot": () => /* binding */ getSlot,
/* harmony export */   "getStat": () => /* binding */ getStat,
/* harmony export */   "getThrall": () => /* binding */ getThrall,
/* harmony export */   "get": () => /* binding */ get,
/* harmony export */   "set": () => /* binding */ set
/* harmony export */ });
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kolmafia */ "kolmafia");
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(kolmafia__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _propertyTyping__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./propertyTyping */ "./node_modules/libram/dist/propertyTyping.js");


var createPropertyGetter = function createPropertyGetter(transform) {
  return function (property, default_) {
    var value = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getProperty)(property);

    if (default_ !== undefined && value === "") {
      return default_;
    }

    return transform(value, property);
  };
};
var createMafiaClassPropertyGetter = function createMafiaClassPropertyGetter(Type) {
  return createPropertyGetter(function (value) {
    var v = Type.get(value);
    return v === Type.get("none") ? null : v;
  });
};
var getString = createPropertyGetter(function (value) {
  return value;
});
var getCommaSeparated = createPropertyGetter(function (value) {
  return value.split(/, ?/);
});
var getBoolean = createPropertyGetter(function (value) {
  return value === "true";
});
var getNumber = createPropertyGetter(function (value) {
  return Number(value);
});
var getBounty = createMafiaClassPropertyGetter(Bounty);
var getClass = createMafiaClassPropertyGetter(Class);
var getCoinmaster = createMafiaClassPropertyGetter(Coinmaster);
var getEffect = createMafiaClassPropertyGetter(Effect);
var getElement = createMafiaClassPropertyGetter(Element);
var getFamiliar = createMafiaClassPropertyGetter(Familiar);
var getItem = createMafiaClassPropertyGetter(Item);
var getLocation = createMafiaClassPropertyGetter(Location);
var getMonster = createMafiaClassPropertyGetter(Monster);
var getPhylum = createMafiaClassPropertyGetter(Phylum);
var getServant = createMafiaClassPropertyGetter(Servant);
var getSkill = createMafiaClassPropertyGetter(Skill);
var getSlot = createMafiaClassPropertyGetter(Slot);
var getStat = createMafiaClassPropertyGetter(Stat);
var getThrall = createMafiaClassPropertyGetter(Thrall);
function get(property, _default) {
  var value = getString(property);

  if ((0,_propertyTyping__WEBPACK_IMPORTED_MODULE_1__.isMonsterProperty)(property)) {
    return getMonster(property, _default);
  }

  if ((0,_propertyTyping__WEBPACK_IMPORTED_MODULE_1__.isLocationProperty)(property)) {
    return getLocation(property, _default);
  }

  if (value === "") {
    return _default === undefined ? "" : _default;
  }

  if ((0,_propertyTyping__WEBPACK_IMPORTED_MODULE_1__.isBooleanProperty)(property, value)) {
    return getBoolean(property, _default);
  }

  if ((0,_propertyTyping__WEBPACK_IMPORTED_MODULE_1__.isNumericProperty)(property, value)) {
    return getNumber(property, _default);
  }

  return value;
}
function set(property, value) {
  var stringValue = value === null ? "" : value.toString();
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.setProperty)(property, stringValue);
}

/***/ }),

/***/ "./node_modules/libram/dist/propertyTyping.js":
/*!****************************************************!*\
  !*** ./node_modules/libram/dist/propertyTyping.js ***!
  \****************************************************/
/*! namespace exports */
/*! export isBooleanProperty [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isLocationProperty [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isMonsterProperty [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isNumericProperty [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNumericProperty": () => /* binding */ isNumericProperty,
/* harmony export */   "isBooleanProperty": () => /* binding */ isBooleanProperty,
/* harmony export */   "isLocationProperty": () => /* binding */ isLocationProperty,
/* harmony export */   "isMonsterProperty": () => /* binding */ isMonsterProperty
/* harmony export */ });
function isNumericProperty(property, value) {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
}
var fakeBooleans = ["trackVoteMonster", "_jickJarAvailable"];
function isBooleanProperty(property, value) {
  if (fakeBooleans.includes(property)) return false;
  return ["true", "false"].includes(value);
}
var otherLocations = ["nextSpookyravenElizabethRoom", "nextSpookyravenStephenRoom"];
function isLocationProperty(property) {
  return otherLocations.includes(property) || property.endsWith("Location");
}
var otherMonsters = ["romanticTarget"];
function isMonsterProperty(property) {
  if (otherMonsters.includes(property)) return true;
  return property.endsWith("Monster");
}

/***/ }),

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

/***/ "./src/hccs.ts":
/*!*********************!*\
  !*** ./src/hccs.ts ***!
  \*********************/
/*! namespace exports */
/*! export withMacro [provided] [maybe used in hccs (runtime-defined)] [usage prevents renaming] */
/*! other exports [not provided] [maybe used in hccs (runtime-defined)] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "withMacro": () => /* binding */ withMacro
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./src/lib.ts");
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! kolmafia */ "kolmafia");
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(kolmafia__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var libram__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libram */ "./node_modules/libram/dist/combat.js");
/* harmony import */ var libram__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! libram */ "./node_modules/libram/dist/template-string.js");
/* harmony import */ var libram__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! libram */ "./node_modules/libram/dist/property.js");
/* harmony import */ var libram_dist_console__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! libram/dist/console */ "./node_modules/libram/dist/console.js");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21, _templateObject22, _templateObject23, _templateObject24, _templateObject25, _templateObject26, _templateObject27, _templateObject28, _templateObject29, _templateObject30, _templateObject31, _templateObject32, _templateObject33, _templateObject34, _templateObject35, _templateObject36, _templateObject37, _templateObject38, _templateObject39, _templateObject40, _templateObject41, _templateObject42, _templateObject43, _templateObject44, _templateObject45, _templateObject46, _templateObject47, _templateObject48, _templateObject49, _templateObject50, _templateObject51, _templateObject52, _templateObject53, _templateObject54, _templateObject55, _templateObject56, _templateObject57, _templateObject58, _templateObject59, _templateObject60, _templateObject61, _templateObject62, _templateObject63, _templateObject64, _templateObject65, _templateObject66, _templateObject67, _templateObject68, _templateObject69, _templateObject70, _templateObject71, _templateObject72, _templateObject73, _templateObject74, _templateObject75, _templateObject76, _templateObject77, _templateObject78, _templateObject79, _templateObject80, _templateObject81, _templateObject82, _templateObject83, _templateObject84, _templateObject85, _templateObject86, _templateObject87, _templateObject88, _templateObject89, _templateObject90, _templateObject91, _templateObject92, _templateObject93, _templateObject94, _templateObject95, _templateObject96, _templateObject97, _templateObject98, _templateObject99, _templateObject100, _templateObject101, _templateObject102, _templateObject103, _templateObject104, _templateObject105, _templateObject106, _templateObject107, _templateObject108, _templateObject109, _templateObject110, _templateObject111, _templateObject112, _templateObject113, _templateObject114, _templateObject115, _templateObject116, _templateObject117, _templateObject118, _templateObject119, _templateObject120, _templateObject121, _templateObject122, _templateObject123, _templateObject124, _templateObject125, _templateObject126, _templateObject127, _templateObject128, _templateObject129, _templateObject130, _templateObject131, _templateObject132, _templateObject133, _templateObject134, _templateObject135, _templateObject136, _templateObject137, _templateObject138, _templateObject139, _templateObject140, _templateObject141, _templateObject142, _templateObject143, _templateObject144, _templateObject145, _templateObject146, _templateObject147, _templateObject148, _templateObject149, _templateObject150, _templateObject151, _templateObject152, _templateObject153, _templateObject154, _templateObject155, _templateObject156, _templateObject157, _templateObject158, _templateObject159, _templateObject160, _templateObject161, _templateObject162, _templateObject163, _templateObject164, _templateObject165, _templateObject166, _templateObject167, _templateObject168, _templateObject169, _templateObject170, _templateObject171, _templateObject172, _templateObject173, _templateObject174, _templateObject175, _templateObject176, _templateObject177, _templateObject178, _templateObject179, _templateObject180, _templateObject181, _templateObject182, _templateObject183, _templateObject184, _templateObject185, _templateObject186, _templateObject187, _templateObject188, _templateObject189, _templateObject190, _templateObject191, _templateObject192, _templateObject193, _templateObject194, _templateObject195, _templateObject196, _templateObject197, _templateObject198, _templateObject199, _templateObject200, _templateObject201, _templateObject202, _templateObject203, _templateObject204, _templateObject205, _templateObject206, _templateObject207, _templateObject208, _templateObject209, _templateObject210, _templateObject211, _templateObject212, _templateObject213, _templateObject214, _templateObject215, _templateObject216, _templateObject217, _templateObject218, _templateObject219, _templateObject220, _templateObject221, _templateObject222, _templateObject223, _templateObject224, _templateObject225, _templateObject226, _templateObject227, _templateObject228, _templateObject229, _templateObject230, _templateObject231, _templateObject232, _templateObject233, _templateObject234, _templateObject235, _templateObject236, _templateObject237, _templateObject238, _templateObject239, _templateObject240, _templateObject241, _templateObject242, _templateObject243, _templateObject244, _templateObject245, _templateObject246, _templateObject247, _templateObject248, _templateObject249, _templateObject250, _templateObject251, _templateObject252, _templateObject253, _templateObject254, _templateObject255, _templateObject256, _templateObject257, _templateObject258, _templateObject259, _templateObject260, _templateObject261, _templateObject262, _templateObject263, _templateObject264, _templateObject265, _templateObject266, _templateObject267, _templateObject268, _templateObject269, _templateObject270, _templateObject271, _templateObject272, _templateObject273, _templateObject274, _templateObject275, _templateObject276, _templateObject277, _templateObject278, _templateObject279, _templateObject280, _templateObject281, _templateObject282, _templateObject283, _templateObject284, _templateObject285, _templateObject286, _templateObject287, _templateObject288, _templateObject289, _templateObject290, _templateObject291, _templateObject292, _templateObject293, _templateObject294, _templateObject295, _templateObject296, _templateObject297, _templateObject298, _templateObject299, _templateObject300, _templateObject301, _templateObject302, _templateObject303, _templateObject304, _templateObject305, _templateObject306, _templateObject307, _templateObject308, _templateObject309, _templateObject310, _templateObject311, _templateObject312, _templateObject313, _templateObject314, _templateObject315, _templateObject316, _templateObject317, _templateObject318, _templateObject319, _templateObject320, _templateObject321, _templateObject322, _templateObject323, _templateObject324, _templateObject325, _templateObject326, _templateObject327, _templateObject328, _templateObject329, _templateObject330, _templateObject331, _templateObject332, _templateObject333, _templateObject334, _templateObject335, _templateObject336, _templateObject337, _templateObject338, _templateObject339, _templateObject340, _templateObject341, _templateObject342, _templateObject343, _templateObject344, _templateObject345, _templateObject346, _templateObject347, _templateObject348, _templateObject349, _templateObject350, _templateObject351, _templateObject352, _templateObject353, _templateObject354, _templateObject355, _templateObject356, _templateObject357, _templateObject358, _templateObject359, _templateObject360, _templateObject361, _templateObject362, _templateObject363, _templateObject364, _templateObject365, _templateObject366, _templateObject367, _templateObject368, _templateObject369, _templateObject370, _templateObject371, _templateObject372, _templateObject373, _templateObject374, _templateObject375, _templateObject376, _templateObject377, _templateObject378, _templateObject379, _templateObject380, _templateObject381, _templateObject382, _templateObject383, _templateObject384, _templateObject385, _templateObject386, _templateObject387, _templateObject388, _templateObject389, _templateObject390, _templateObject391, _templateObject392, _templateObject393, _templateObject394, _templateObject395, _templateObject396, _templateObject397, _templateObject398, _templateObject399, _templateObject400, _templateObject401, _templateObject402, _templateObject403, _templateObject404, _templateObject405, _templateObject406, _templateObject407, _templateObject408, _templateObject409, _templateObject410, _templateObject411, _templateObject412, _templateObject413, _templateObject414, _templateObject415, _templateObject416, _templateObject417, _templateObject418, _templateObject419, _templateObject420, _templateObject421, _templateObject422, _templateObject423, _templateObject424, _templateObject425, _templateObject426, _templateObject427, _templateObject428, _templateObject429, _templateObject430, _templateObject431, _templateObject432, _templateObject433, _templateObject434, _templateObject435, _templateObject436, _templateObject437, _templateObject438, _templateObject439, _templateObject440, _templateObject441, _templateObject442, _templateObject443, _templateObject444, _templateObject445, _templateObject446, _templateObject447, _templateObject448, _templateObject449, _templateObject450, _templateObject451, _templateObject452, _templateObject453, _templateObject454, _templateObject455, _templateObject456, _templateObject457, _templateObject458, _templateObject459, _templateObject460, _templateObject461, _templateObject462, _templateObject463, _templateObject464, _templateObject465, _templateObject466, _templateObject467, _templateObject468, _templateObject469, _templateObject470, _templateObject471, _templateObject472, _templateObject473, _templateObject474, _templateObject475, _templateObject476, _templateObject477, _templateObject478, _templateObject479, _templateObject480, _templateObject481, _templateObject482, _templateObject483, _templateObject484, _templateObject485, _templateObject486, _templateObject487, _templateObject488, _templateObject489, _templateObject490, _templateObject491, _templateObject492, _templateObject493, _templateObject494, _templateObject495, _templateObject496, _templateObject497, _templateObject498, _templateObject499, _templateObject500, _templateObject501, _templateObject502, _templateObject503, _templateObject504, _templateObject505, _templateObject506, _templateObject507, _templateObject508, _templateObject509, _templateObject510, _templateObject511, _templateObject512, _templateObject513, _templateObject514, _templateObject515, _templateObject516, _templateObject517, _templateObject518, _templateObject519, _templateObject520, _templateObject521, _templateObject522, _templateObject523, _templateObject524, _templateObject525, _templateObject526, _templateObject527, _templateObject528, _templateObject529, _templateObject530, _templateObject531, _templateObject532, _templateObject533, _templateObject534, _templateObject535, _templateObject536, _templateObject537, _templateObject538, _templateObject539, _templateObject540, _templateObject541, _templateObject542, _templateObject543, _templateObject544, _templateObject545, _templateObject546, _templateObject547, _templateObject548, _templateObject549, _templateObject550, _templateObject551, _templateObject552, _templateObject553, _templateObject554, _templateObject555, _templateObject556, _templateObject557, _templateObject558, _templateObject559, _templateObject560, _templateObject561, _templateObject562, _templateObject563, _templateObject564, _templateObject565, _templateObject566, _templateObject567, _templateObject568, _templateObject569, _templateObject570, _templateObject571, _templateObject572, _templateObject573, _templateObject574, _templateObject575, _templateObject576, _templateObject577, _templateObject578, _templateObject579, _templateObject580, _templateObject581, _templateObject582;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }




 // rewrite all combats
// create a defaultFamiliar function that chooses somewhat dynamically
// make a better geneTonic() function
// rewrite map uses to not use the c2t thing
// figure out synth

var TEST_HP = 1;
var TEST_MUS = 2;
var TEST_MYS = 3;
var TEST_MOX = 4;
var TEST_FAMILIAR = 5;
var TEST_WEAPON = 6;
var TEST_SPELL = 7;
var TEST_NONCOMBAT = 8;
var TEST_ITEM = 9;
var TEST_HOT_RES = 10;
var TEST_COIL_WIRE = 11;
var HP_TURNS = 0;
var MUS_TURNS = 0;
var MYS_TURNS = 0;
var MOX_TURNS = 0;
var FAMILIAR_TURNS = 0;
var WEAPON_TURNS = 0;
var SPELL_TURNS = 0;
var NONCOMBAT_TURNS = 0;
var ITEM_TURNS = 0;
var HOT_RES_TURNS = 0;
var TEMP_TURNS = 0;
var tempMacro = ""; // test order will be stats, hot, item, NC, Fam, weapon, spell

var START_TIME = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.gametimeToInt)();
var justKillTheThing = libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject || (_templateObject = _taggedTemplateLiteral(["Curse of Weaksauce"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["Micrometeorite"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["Sing Along"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["Stuffed Mortar Shell"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["Saucestorm"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["Saucegeyser"])))).step("repeat");
var defaultFamiliar = (0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["melodramedary"])));
var defaultFamiliarEquipment = (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["dromedary drinking helmet"]))); // TODO: make this choose camel until 100 spit, then pixie for absinthe, then ???

function useDefaultFamiliar() {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)(defaultFamiliar);

  if (defaultFamiliarEquipment !== (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["none"])))) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)(defaultFamiliarEquipment);
  }
}

function tryUse(quantity, it) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)(it) > 0) {
    return (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(quantity, it);
  } else {
    return false;
  }
}

function useAll(it) {
  return (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)(it), it);
}

function tryEquip(it) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)(it) > 0) {
    return (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)(it);
  } else {
    return false;
  }
}

function assertMeat(meat) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMeat)() < meat) (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Not enough meat.");
}

function autosellAll(it) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.itemAmount)(it), it);
}

function wishEffect(ef) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)(ef) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("genie effect " + ef.name);
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Already have effect " + ef.name + ".");
  }
} // Checks that you don't already have the tonic or effect and if your syringe has the right phylum and if so, makes the appropriate tonic.


function geneTonic(ph) {
  if (ph === "dude" || ph === "weird") {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("This function doesn't work for dudes or weirds.", "red");
  } else if (ph === "construct") {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["Human-Machine Hybrid"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["Gene Tonic: Construct"])))) === 0 && (0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("dnaSyringe") === "construct") {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("camp dnapotion 1");

      if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["Gene Tonic: ", ""])), ph)) === 0) {
        (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("something went wrong getting your gene tonic");
      } else {
        (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("successfully created gene tonic: construct");
      }
    } else {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("You already have construct DNA");
    }
  } else {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["Human-", " Hybrid"])), ph)) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["Gene Tonic: ", ""])), ph)) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("dnaSyringe") === ph) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("camp dnapotion 1");

      if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["Gene Tonic: ", ""])), ph)) === 0) {
        (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("something went wrong getting your gene tonic");
      } else {
        (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("successfully created gene tonic: " + ph);
      }
    } else {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("You already have " + ph + " DNA");
    }
  }
}
/*
// rewrite this to be better
function geneTonic1(ph: string) {
  switch (toString(ph)) {
    case "elf":
      if ((haveEffect($effect`1601`) === 0) && (availableAmount($item`7399`) === 0) && (getProperty("dnaSyringe") === "elf")) {
        cliExecute("camp dnapotion 1");
        if (availableAmount($item`7399`) === 0) {
          error("something went wrong getting your gene tonic");
        } else {
          print("successfully created gene tonic: elf");
        }
      } else {
        print("You already have elf DNA");
      }
    case "construct":
      if ((haveEffect($effect`1588`) === 0) && (availableAmount($item`7386`) === 0) && (getProperty("dnaSyringe") === "construct")) {
        cliExecute("camp dnapotion 1");
        if (availableAmount($item`7386`) === 0) {
          error("something went wrong getting your gene tonic");
        } else {
          print("successfully created gene tonic: construct");
        }
      } else {
        print("You already have construct DNA");
      }
    case "pirate":
      if ((haveEffect($effect`1598`) === 0) && (availableAmount($item`7396`) === 0) && (getProperty("dnaSyringe") === "pirate")) {
        cliExecute("camp dnapotion 1");
        if (availableAmount($item`7396`) === 0) {
          error("something went wrong getting your gene tonic");
        } else {
          print("successfully created gene tonic: pirate");
        }
      } else {
        print("You already have pirate DNA");
      }
  }
}
*/


function shrug(ef) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)(ef) > 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("shrug " + ef.name);
  }
}

function summonBrickoOyster(maxSummons) {
  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_brickoFights") >= 3) return false;
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["BRICKO oyster"])))) > 0) return true;

  while ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("libramSummons") < maxSummons && ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["BRICKO eye brick"])))) < 1 || (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["BRICKO brick"])))) < 8)) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["Summon BRICKOs"]))));
  }

  return (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(8, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject20 || (_templateObject20 = _taggedTemplateLiteral(["BRICKO brick"]))));
}

function fightSausageIfGuaranteed() {
  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.sausageFightGuaranteed)()) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject21 || (_templateObject21 = _taggedTemplateLiteral(["Iunion Crown"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject22 || (_templateObject22 = _taggedTemplateLiteral(["shirt"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject23 || (_templateObject23 = _taggedTemplateLiteral(["none"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject24 || (_templateObject24 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject25 || (_templateObject25 = _taggedTemplateLiteral(["Kramco Sausage-o-Matic&trade;"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject26 || (_templateObject26 = _taggedTemplateLiteral(["old sweatpants"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject27 || (_templateObject27 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject28 || (_templateObject28 = _taggedTemplateLiteral(["Eight Days a Week Pill Keeper"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject29 || (_templateObject29 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject30 || (_templateObject30 = _taggedTemplateLiteral(["Powerful Glove"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject31 || (_templateObject31 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject32 || (_templateObject32 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"]))));
    useDefaultFamiliar();
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject33 || (_templateObject33 = _taggedTemplateLiteral(["The Neverending Party"]))), (0,_lib__WEBPACK_IMPORTED_MODULE_0__.kill)());
  }
}

function testDone(testNum) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Checking test " + testNum + "...");
  var text = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("council.php");
  return !(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.containsText)(text, "<input type=hidden name=option value=" + testNum + ">");
}

function doTest(testNum) {
  if (!testDone(testNum)) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("choice.php?whichchoice=1089&option=" + testNum);

    if (!testDone(testNum)) {
      (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Failed to do test " + testNum + ". Maybe we are out of turns.");
    }
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Test " + testNum + " already completed.");
  }
}

function withMacro(macro, action) {
  macro.save();

  try {
    return action();
  } finally {
    libram__WEBPACK_IMPORTED_MODULE_2__.Macro.clearSaved();
  }
} // Don't buy stuff from NPC stores.

(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("_saved_autoSatisfyWithNPCs", (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("autoSatisfyWithNPCs"));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("autoSatisfyWithNPCs", "false"); // Do buy stuff from coinmasters (hermit).

(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("_saved_autoSatisfyWithCoinmasters", (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("autoSatisfyWithCoinmasters"));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("autoSatisfyWithCoinmasters", "true"); // Initialize council.

(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("council.php");

if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("backupCameraReverserEnabled") === false) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("backupcamera reverser on");
} // All combat handled by our consult script (hccs_combat.ash).


(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("ccs libramMacro"); // Turn off Lil' Doctor quests.

(0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1340, 3); // in case you're re-running it

(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0); // Default equipment.

(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject34 || (_templateObject34 = _taggedTemplateLiteral(["Iunion Crown"]))));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject35 || (_templateObject35 = _taggedTemplateLiteral(["shirt"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject36 || (_templateObject36 = _taggedTemplateLiteral(["none"]))));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject37 || (_templateObject37 = _taggedTemplateLiteral(["vampyric cloake"]))));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject38 || (_templateObject38 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"])))); // equip($item[Kramco Sausage-o-Matic&trade;]);

(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject39 || (_templateObject39 = _taggedTemplateLiteral(["old sweatpants"]))));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject40 || (_templateObject40 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject41 || (_templateObject41 = _taggedTemplateLiteral(["Eight Days a Week Pill Keeper"]))));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject42 || (_templateObject42 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject43 || (_templateObject43 = _taggedTemplateLiteral(["Powerful Glove"]))));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject44 || (_templateObject44 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject45 || (_templateObject45 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"]))));

if (!testDone(TEST_COIL_WIRE)) {
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setClan)("Bonus Adventures from Hell");

  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_clanFortuneConsultUses") < 3) {
    while ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_clanFortuneConsultUses") < 3) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("fortune cheesefax");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("wait 5");
    }
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myLevel)() === 1 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.mySpleenUse)() === 0) {
    while ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_universeCalculated") < (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("skillLevel144")) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("numberology 69");
    }
  } // retrieve_item(1, $item[fish hatchet]);
  // get cowboy boots


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=town_right&action=townright_ltt"); // Chateau piggy bank

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=chateau&action=chateau_desk1"); // autosell(1, $item[gremlin juice]);
  // autosell(1, $item[ectoplasm <i>au jus</i>]);
  // autosell(1, $item[clove-flavored lip balm]);
  // Sell pork gems + tent

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("tutorial.php?action=toot");
  tryUse(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject46 || (_templateObject46 = _taggedTemplateLiteral(["letter from King Ralph XI"]))));
  tryUse(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject47 || (_templateObject47 = _taggedTemplateLiteral(["pork elf goodies sack"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject48 || (_templateObject48 = _taggedTemplateLiteral(["baconstone"])))); // autosell(5, $item[porquoise]);

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject49 || (_templateObject49 = _taggedTemplateLiteral(["hamethyst"])))); // Buy toy accordion

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject50 || (_templateObject50 = _taggedTemplateLiteral(["toy accordion"])))); // make pantogram pants for hilarity and spell damage

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject51 || (_templateObject51 = _taggedTemplateLiteral(["pantogram pants"])))) === 0) {
    // retrieveItem(1, $item`ten-leaf clover`);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("pantogram hot|-combat|silent");
  }

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject52 || (_templateObject52 = _taggedTemplateLiteral(["The Magical Mojomuscular Melody"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject53 || (_templateObject53 = _taggedTemplateLiteral(["Inscrutable Gaze"])))) === 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureMpTonic)(10);
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject54 || (_templateObject54 = _taggedTemplateLiteral(["Inscrutable Gaze"]))));
  } // Campsite


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject55 || (_templateObject55 = _taggedTemplateLiteral(["That's Just Cloud-Talk, Man"], ["That\\'s Just Cloud-Talk, Man"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=campaway&action=campaway_sky");
  } // Depends on Ez's Bastille script.


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("bastille myst brutalist"); // Upgrade saber for fam wt

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("main.php?action=may4");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(4); // Put on some regen gear

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject56 || (_templateObject56 = _taggedTemplateLiteral(["Iunion Crown"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject57 || (_templateObject57 = _taggedTemplateLiteral(["shirt"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject58 || (_templateObject58 = _taggedTemplateLiteral(["none"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject59 || (_templateObject59 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"])))); // equip($item[Kramco Sausage-o-Matic&trade;]);

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject60 || (_templateObject60 = _taggedTemplateLiteral(["old sweatpants"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject61 || (_templateObject61 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject62 || (_templateObject62 = _taggedTemplateLiteral(["Eight Days a Week Pill Keeper"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject63 || (_templateObject63 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject64 || (_templateObject64 = _taggedTemplateLiteral(["Powerful Glove"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject65 || (_templateObject65 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject66 || (_templateObject66 = _taggedTemplateLiteral(["Retrospecs"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureCreateItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject67 || (_templateObject67 = _taggedTemplateLiteral(["borrowed time"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject68 || (_templateObject68 = _taggedTemplateLiteral(["borrowed time"])))); // NOTE: No turn 0 sausage fight!
  // should probably fight, digitize, wink a bishop or something here
  // QUEST - Coil Wire

  doTest(TEST_COIL_WIRE);
}

if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() < 60) (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Something went wrong coiling wire.");

if (!testDone(TEST_HP)) {
  // just in case?
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject69 || (_templateObject69 = _taggedTemplateLiteral(["That's Just Cloud-Talk, Man"], ["That\\'s Just Cloud-Talk, Man"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=campaway&action=campaway_sky");
  } // Grab fish hatchett here, for fam wt, -combat, and muscle tests


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.retrieveItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject70 || (_templateObject70 = _taggedTemplateLiteral(["fish hatchet"])))); // pulls wrench from deck

  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_deckCardsDrawn") === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("cheat wrench");
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("call detective_solver.ash");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.buy)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject71 || (_templateObject71 = _taggedTemplateLiteral(["shoe gum"])))); // learn extract and digitize

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("terminal educate extract");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("terminal educate digitize");
  var lovePotion = (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject72 || (_templateObject72 = _taggedTemplateLiteral(["Love Potion #0"])));
  var loveEffect = (0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject73 || (_templateObject73 = _taggedTemplateLiteral(["Tainted Love Potion"])));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)(loveEffect) === 0) {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)(lovePotion) === 0) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject74 || (_templateObject74 = _taggedTemplateLiteral(["Love Mixology"]))));
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("desc_effect.php?whicheffect=" + loveEffect.descid);

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)(loveEffect, "mysticality") > 10 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)(loveEffect, "muscle") > -30 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)(loveEffect, "moxie") > -30 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)(loveEffect, "maximum hp percent") > -0.001) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, lovePotion);
    }
  } // Boxing Daycare


  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject75 || (_templateObject75 = _taggedTemplateLiteral(["Uncucumbered"])))); // Cast inscrutable gaze

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject76 || (_templateObject76 = _taggedTemplateLiteral(["Inscrutable Gaze"])))); // Shower lukewarm

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject77 || (_templateObject77 = _taggedTemplateLiteral(["Thaumodynamic"])))); // Beach Comb

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject78 || (_templateObject78 = _taggedTemplateLiteral(["You Learned Something Maybe!"])))); // Get beach access.

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject79 || (_templateObject79 = _taggedTemplateLiteral(["bitchin' meatcar"], ["bitchin\\' meatcar"])))) === 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject80 || (_templateObject80 = _taggedTemplateLiteral(["cog"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject81 || (_templateObject81 = _taggedTemplateLiteral(["sprocket"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject82 || (_templateObject82 = _taggedTemplateLiteral(["spring"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject83 || (_templateObject83 = _taggedTemplateLiteral(["empty meat tank"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject84 || (_templateObject84 = _taggedTemplateLiteral(["sweet rims"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject85 || (_templateObject85 = _taggedTemplateLiteral(["tires"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.create)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject86 || (_templateObject86 = _taggedTemplateLiteral(["bitchin' meatcar"], ["bitchin\\' meatcar"]))));
  } // Depends on Ez's Bastille script.


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("bastille myst brutalist"); // if (get_property('_horsery') != 'crazy horse') cli_execute('horsery crazy');
  // Tune moon sign to Blender. Have to do this now to get chewing gum.

  if (!(0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyBoolean)("moonTuned")) {
    if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_campAwaySmileBuffs") === 0) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=campaway&action=campaway_sky");
    } // Unequip spoon.


    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject87 || (_templateObject87 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject88 || (_templateObject88 = _taggedTemplateLiteral(["Eight Days a Week Pill Keeper"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject89 || (_templateObject89 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject90 || (_templateObject90 = _taggedTemplateLiteral(["Powerful Glove"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject91 || (_templateObject91 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject92 || (_templateObject92 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"])))); // Actually tune the moon.

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("inv_use.php?whichitem=10254&doit=96&whichsign=8");
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("retrocape mysticality thrill"); // cross streams for a stat boost

  if (!(0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyBoolean)("_streamsCrossed")) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("crossstreams");
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject93 || (_templateObject93 = _taggedTemplateLiteral(["Iunion Crown"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject94 || (_templateObject94 = _taggedTemplateLiteral(["shirt"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject95 || (_templateObject95 = _taggedTemplateLiteral(["none"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject96 || (_templateObject96 = _taggedTemplateLiteral(["10647"])))); //retrocape

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject97 || (_templateObject97 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"])))); // equip($item[Kramco Sausage-o-Matic&trade;]);

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject98 || (_templateObject98 = _taggedTemplateLiteral(["old sweatpants"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject99 || (_templateObject99 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject100 || (_templateObject100 = _taggedTemplateLiteral(["Eight Days a Week Pill Keeper"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject101 || (_templateObject101 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject102 || (_templateObject102 = _taggedTemplateLiteral(["Powerful Glove"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject103 || (_templateObject103 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject104 || (_templateObject104 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"]))));

  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_brickoFights") === 0 && summonBrickoOyster(7) && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject105 || (_templateObject105 = _taggedTemplateLiteral(["BRICKO oyster"])))) > 0) {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject106 || (_templateObject106 = _taggedTemplateLiteral(["bag of many confections"])))) > 0) (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("We should not have a bag yet.");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject107 || (_templateObject107 = _taggedTemplateLiteral(["Stocking Mimic"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject108 || (_templateObject108 = _taggedTemplateLiteral(["familiar"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject109 || (_templateObject109 = _taggedTemplateLiteral(["none"]))));

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHp)() < 0.8 * (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMaxhp)()) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("clan_viplounge.php?where=hottub");
    }

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureMpTonic)(32);
    libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject110 || (_templateObject110 = _taggedTemplateLiteral(["otoscope"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject111 || (_templateObject111 = _taggedTemplateLiteral(["curse of weaksauce"])))).trySkillRepeat((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject112 || (_templateObject112 = _taggedTemplateLiteral(["saucegeyser"])))).setAutoAttack();
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject113 || (_templateObject113 = _taggedTemplateLiteral(["BRICKO oyster"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject114 || (_templateObject114 = _taggedTemplateLiteral(["BRICKO pearl"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  } // Prep Sweet Synthesis.


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myGardenType)() === "peppermint") {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("garden pick");
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("WARNING: This script is built for peppermint garden. Switch gardens or find other candy.");
  }

  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_candySummons") === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject115 || (_templateObject115 = _taggedTemplateLiteral(["Summon Crimbo Candy"]))));
  }

  if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_chubbyAndPlumpUsed") === false) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject116 || (_templateObject116 = _taggedTemplateLiteral(["Chubby and Plump"]))));
  } // Depending on crimbo candy summons, gets synth learning, possibly getting bugged beanie if it needs a tome summon


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject117 || (_templateObject117 = _taggedTemplateLiteral(["crimbo candied pecan"])))) > 1 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject118 || (_templateObject118 = _taggedTemplateLiteral(["crimbo peppermint bark"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject119 || (_templateObject119 = _taggedTemplateLiteral(["Synthesis: Learning"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject120 || (_templateObject120 = _taggedTemplateLiteral(["summon sugar sheets"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("create 1 sugar shotgun");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.sweetSynthesis)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject121 || (_templateObject121 = _taggedTemplateLiteral(["sugar shotgun"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject122 || (_templateObject122 = _taggedTemplateLiteral(["crimbo candied pecan"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject123 || (_templateObject123 = _taggedTemplateLiteral(["baby bugged bugbear"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("arena.php");
    useDefaultFamiliar();
  } else if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject124 || (_templateObject124 = _taggedTemplateLiteral(["crimbo fudge"])))) >= 2 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject125 || (_templateObject125 = _taggedTemplateLiteral(["Synthesis: Learning"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.sweetSynthesis)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject126 || (_templateObject126 = _taggedTemplateLiteral(["crimbo fudge"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject127 || (_templateObject127 = _taggedTemplateLiteral(["crimbo fudge"]))));
  } else if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject128 || (_templateObject128 = _taggedTemplateLiteral(["crimbo peppermint bark"])))) !== 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject129 || (_templateObject129 = _taggedTemplateLiteral(["Synthesis: Learning"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.sweetSynthesis)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject130 || (_templateObject130 = _taggedTemplateLiteral(["crimbo peppermint bark"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject131 || (_templateObject131 = _taggedTemplateLiteral(["peppermint sprout"]))));
  } // synthesis: smart


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject132 || (_templateObject132 = _taggedTemplateLiteral(["Synthesis: Smart"])))) == 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.sweetSynthesis)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject133 || (_templateObject133 = _taggedTemplateLiteral(["bag of many confections"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject134 || (_templateObject134 = _taggedTemplateLiteral(["chubby and plump bar"]))));
  } // This is the sequence of synthesis effects; synthesis_plan will, if possible, come up with a plan for allocating candy to each of these.
  // SynthesisPlanner.synthesize($effect`Synthesis: Learning`);
  // SynthesisPlanner.synthesize($effect`Synthesis: Smart`);


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.round)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("mysticality experience percent")) < 100) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Insufficient +stat%.");
  } // Use ten-percent bonus


  tryUse(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject135 || (_templateObject135 = _taggedTemplateLiteral(["a ten-percent bonus"])))); // Scavenge for gym equipment

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.toInt)((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_daycareGymScavenges")) < 1) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("/place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
    var pg = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(3);
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.containsText)(pg, "[free]")) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(2);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(5);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(4);
  } // ensure_effect($effect[hulkien]);


  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject136 || (_templateObject136 = _taggedTemplateLiteral(["Favored by Lyle"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject137 || (_templateObject137 = _taggedTemplateLiteral(["Starry-Eyed"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject138 || (_templateObject138 = _taggedTemplateLiteral(["Triple-Sized"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject139 || (_templateObject139 = _taggedTemplateLiteral(["Feeling Excited"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject140 || (_templateObject140 = _taggedTemplateLiteral(["The Magical Mojomuscular Melody"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureNpcEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject141 || (_templateObject141 = _taggedTemplateLiteral(["Glittering Eyelashes"]))), 5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject142 || (_templateObject142 = _taggedTemplateLiteral(["glittery mascara"])))); // Plan is for Beach Comb + PK buffs to fall all the way through to item -> hot res -> fam weight.

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject143 || (_templateObject143 = _taggedTemplateLiteral(["Fidoxene"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject144 || (_templateObject144 = _taggedTemplateLiteral(["Do I Know You From Somewhere?"])))); // uses familiar jacks to get camel equipment

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject145 || (_templateObject145 = _taggedTemplateLiteral(["10580"])))) === 0 && (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("tomeSummons") < 3) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("create 1 box of familiar jacks");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject146 || (_templateObject146 = _taggedTemplateLiteral(["melodramedary"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject147 || (_templateObject147 = _taggedTemplateLiteral(["box of familiar jacks"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject148 || (_templateObject148 = _taggedTemplateLiteral(["dromedary drinking helmet"]))));
  } // 10 snojo fights to while +stat is on, also getting ice rice


  if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_snojoFreeFights") < 10) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject149 || (_templateObject149 = _taggedTemplateLiteral(["garbage fire"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("choiceAdventure1310", "3"); // myst for ice rice, because it sells for more

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=snojo&action=snojo_controller");

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject150 || (_templateObject150 = _taggedTemplateLiteral(["gene tonic: construct"])))) === 0 && (0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("dnaSyringe") !== "construct") {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject151 || (_templateObject151 = _taggedTemplateLiteral(["The X-32-F Combat Training Snowman"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.item((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject152 || (_templateObject152 = _taggedTemplateLiteral(["DNA extraction syringe"])))).trySkillRepeat((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject153 || (_templateObject153 = _taggedTemplateLiteral(["saucestorm"])))));
      geneTonic("construct");
    }

    while ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_snojoFreeFights") < 5) {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject154 || (_templateObject154 = _taggedTemplateLiteral(["The X-32-F Combat Training Snowman"]))), (0,_lib__WEBPACK_IMPORTED_MODULE_0__.kill)());
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject155 || (_templateObject155 = _taggedTemplateLiteral(["Melodramedary"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject156 || (_templateObject156 = _taggedTemplateLiteral(["dromedary drinking helmet"]))));

    while ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_snojoFreeFights") < 10) {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject157 || (_templateObject157 = _taggedTemplateLiteral(["The X-32-F Combat Training Snowman"]))), (0,_lib__WEBPACK_IMPORTED_MODULE_0__.kill)());
    }
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject158 || (_templateObject158 = _taggedTemplateLiteral(["burning newspaper"])))) > 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject159 || (_templateObject159 = _taggedTemplateLiteral(["burning paper crane"])))) < 1) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("create 1 burning paper crane");
  } // Don't use Kramco here.


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject160 || (_templateObject160 = _taggedTemplateLiteral(["off-hand"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject161 || (_templateObject161 = _taggedTemplateLiteral(["none"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject162 || (_templateObject162 = _taggedTemplateLiteral(["holiday yoked"])))) === 0 && (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_kgbTranquilizerDartUses") < 3) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject163 || (_templateObject163 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject164 || (_templateObject164 = _taggedTemplateLiteral(["kremlin's greatest briefcase"], ["kremlin\\'s greatest briefcase"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject165 || (_templateObject165 = _taggedTemplateLiteral(["ghost of crimbo carols"]))));
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject166 || (_templateObject166 = _taggedTemplateLiteral(["noob cave"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject167 || (_templateObject167 = _taggedTemplateLiteral(["KGB tranquilizer dart"])))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  } // Chateau rest


  while ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("timesRested") < (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.totalFreeRests)()) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=chateau&action=chateau_restbox");
  }

  while (summonBrickoOyster(11) && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject168 || (_templateObject168 = _taggedTemplateLiteral(["BRICKO oyster"])))) > 0) {
    useDefaultFamiliar();

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHp)() < 0.8 * (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMaxhp)()) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("clan_viplounge.php?where=hottub");
    }

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureMpTonic)(32);
    libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject169 || (_templateObject169 = _taggedTemplateLiteral(["otoscope"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject170 || (_templateObject170 = _taggedTemplateLiteral(["curse of weaksauce"])))).trySkillRepeat((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject171 || (_templateObject171 = _taggedTemplateLiteral(["saucegeyser"])))).setAutoAttack();
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject172 || (_templateObject172 = _taggedTemplateLiteral(["BRICKO oyster"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject173 || (_templateObject173 = _taggedTemplateLiteral(["BRICKO pearl"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  }

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject174 || (_templateObject174 = _taggedTemplateLiteral(["Song of Bravado"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("boomBoxSong") !== "Total Eclipse of Your Meat") {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("boombox meat");
  } // Get buff things


  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSewerItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject175 || (_templateObject175 = _taggedTemplateLiteral(["turtle totem"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSewerItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject176 || (_templateObject176 = _taggedTemplateLiteral(["saucepan"])))); // Don't use Kramco here.

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject177 || (_templateObject177 = _taggedTemplateLiteral(["off-hand"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject178 || (_templateObject178 = _taggedTemplateLiteral(["none"])))); // Fruits in skeleton store (Saber YR)

  var missingOintment = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject179 || (_templateObject179 = _taggedTemplateLiteral(["ointment of the occult"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject180 || (_templateObject180 = _taggedTemplateLiteral(["grapefruit"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject181 || (_templateObject181 = _taggedTemplateLiteral(["Mystically Oiled"])))) === 0;
  var missingOil = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject182 || (_templateObject182 = _taggedTemplateLiteral(["oil of expertise"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject183 || (_templateObject183 = _taggedTemplateLiteral(["cherry"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject184 || (_templateObject184 = _taggedTemplateLiteral(["Expert Oiliness"])))) === 0;

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() !== (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject185 || (_templateObject185 = _taggedTemplateLiteral(["Pastamancer"]))) && (missingOil || missingOintment)) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("mood apathetic");

    if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("questM23Meatsmith") === "unstarted") {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("shop.php?whichshop=meatsmith&action=talk");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(1);
    } // if (!canAdv($location`The Skeleton Store`, false)) error("Cannot open skeleton store!");


    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.adv1)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject186 || (_templateObject186 = _taggedTemplateLiteral(["The Skeleton Store"]))), -1, "");

    if (!(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.containsText)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject187 || (_templateObject187 = _taggedTemplateLiteral(["The Skeleton Store"]))).noncombatQueue, "Skeletons In Store")) {
      throw "Something went wrong at skeleton store.";
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("choiceAdventure1387", "3");
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.mapMonster)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject188 || (_templateObject188 = _taggedTemplateLiteral(["The Skeleton Store"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$monster)(_templateObject189 || (_templateObject189 = _taggedTemplateLiteral(["novelty tropical skeleton"]))));
    withMacro(libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject190 || (_templateObject190 = _taggedTemplateLiteral(["use the force"])))), kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat);
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.handlingChoice)()) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(3); // setProperty("mappingMonsters", "false");
  } // become a human fish hybrid


  if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_dnaHybrid") === false && (0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("dnaSyringe") !== "fish") {
    // tryEquip($item`powerful glove`);
    // useFamiliar($familiar`frumious bandersnatch`);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject191 || (_templateObject191 = _taggedTemplateLiteral(["the bubblin' caldera"], ["the bubblin\\' caldera"]))).noncombatQueue);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.adv1)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject192 || (_templateObject192 = _taggedTemplateLiteral(["The Bubblin' Caldera"], ["The Bubblin\\' Caldera"]))), -1, "");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.adv1)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject193 || (_templateObject193 = _taggedTemplateLiteral(["The Bubblin' Caldera"], ["The Bubblin\\' Caldera"]))), -1, "");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject194 || (_templateObject194 = _taggedTemplateLiteral(["the bubblin' caldera"], ["the bubblin\\' caldera"]))).noncombatQueue);

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.containsText)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject195 || (_templateObject195 = _taggedTemplateLiteral(["the bubblin' caldera"], ["the bubblin\\' caldera"]))).noncombatQueue, "Caldera Air; Aaaaah!  Aaaaaaaah!")) {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject196 || (_templateObject196 = _taggedTemplateLiteral(["The Bubblin' Caldera"], ["The Bubblin\\' Caldera"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.while_("!monstername lava lamprey", libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject197 || (_templateObject197 = _taggedTemplateLiteral(["extract"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject198 || (_templateObject198 = _taggedTemplateLiteral(["macrometeorite"]))))).if_("monstername lava lamprey", libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject199 || (_templateObject199 = _taggedTemplateLiteral(["extract"])))).item((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject200 || (_templateObject200 = _taggedTemplateLiteral(["DNA Extraction Syringe"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject201 || (_templateObject201 = _taggedTemplateLiteral(["feel hatred"]))))));
      useDefaultFamiliar();
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("hottub"); // removing lava effect

      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
    } else throw "Something went wrong getting fish DNA.";
  }

  if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_dnaHybrid") === false && (0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("dnaSyringe") === "fish") {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("camp dnainject");
  }

  if (!(0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("hasRange")) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject202 || (_templateObject202 = _taggedTemplateLiteral(["Dramatic&trade; range"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject203 || (_templateObject203 = _taggedTemplateLiteral(["Dramatic&trade; range"]))));
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject204 || (_templateObject204 = _taggedTemplateLiteral(["Advanced Saucecrafting"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject205 || (_templateObject205 = _taggedTemplateLiteral(["Prevent Scurvy and Sobriety"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensurePotionEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject206 || (_templateObject206 = _taggedTemplateLiteral(["Mystically Oiled"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject207 || (_templateObject207 = _taggedTemplateLiteral(["ointment of the occult"])))); // Maximize familiar weight

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("fold makeshift garbage shirt");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject208 || (_templateObject208 = _taggedTemplateLiteral(["makeshift garbage shirt"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject209 || (_templateObject209 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject210 || (_templateObject210 = _taggedTemplateLiteral(["off-hand"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject211 || (_templateObject211 = _taggedTemplateLiteral(["none"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject212 || (_templateObject212 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject213 || (_templateObject213 = _taggedTemplateLiteral(["Eight Days a Week Pill Keeper"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject214 || (_templateObject214 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject215 || (_templateObject215 = _taggedTemplateLiteral(["Brutal brogues"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject216 || (_templateObject216 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject217 || (_templateObject217 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("mood hccs"); // LOV tunnel for elixirs, epaulettes, and heart surgery
  // TODO: still need to make this combat better

  if (!(0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyBoolean)("_loveTunnelUsed")) {
    useDefaultFamiliar();
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject218 || (_templateObject218 = _taggedTemplateLiteral(["carol of the bulls"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject219 || (_templateObject219 = _taggedTemplateLiteral(["carol of the hells"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1222, 1); // Entrance

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1223, 1); // Fight LOV Enforcer

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1224, 2); // LOV Epaulettes

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1225, 1); // Fight LOV Engineer

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1226, 2); // Open Heart Surgery

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1227, 1); // Fight LOV Equivocator

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1228, 3); // Take chocolate

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)("HCCS_LOV_tunnel");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.adv1)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject220 || (_templateObject220 = _taggedTemplateLiteral(["The Tunnel of L.O.V.E."]))), -1, "");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject221 || (_templateObject221 = _taggedTemplateLiteral(["LOV epaulettes"])))); // spend 5 turns in DMT, skipping joy and cert, just get stats

  while ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_machineTunnelsAdv") < 5) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject222 || (_templateObject222 = _taggedTemplateLiteral(["machine elf"]))));
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject223 || (_templateObject223 = _taggedTemplateLiteral(["The Deep Machine Tunnels"]))), (0,_lib__WEBPACK_IMPORTED_MODULE_0__.kill)());
    /* if ((availableAmount($item`abstraction: thought`) === 0) && (availableAmount($item`abstraction: certainty`) === 0) && (getProperty("_machineTunnelsAdv") < 5)) {
      setAutoAttack("melfgetthought");
      adv1($location`the deep machine tunnels`, -1, "");
      setAutoAttack(0);
    } else if ((availableAmount($item`abstraction: thought`) >= 1) && (availableAmount($item`abstraction: certainty`) === 0) && (getProperty("_machineTunnelsAdv") < 5)) {
      setAutoAttack("melfgetcertainty");
      adv1($location`the deep machine tunnels`, -1, "");
      setAutoAttack(0);
    } else { 
      adventureKill($location`the deep machine tunnels`);
    } */
  }

  useDefaultFamiliar(); //witchess fights

  if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_witchessFights") < 5) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject224 || (_templateObject224 = _taggedTemplateLiteral(["fourth of may cosplay saber"]))));
    useDefaultFamiliar();

    while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.toInt)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("_witchessFights")) < 2) {
      libram__WEBPACK_IMPORTED_MODULE_2__.Macro.step(justKillTheThing).setAutoAttack();
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("campground.php?action=witchess");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(1);
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("choice.php?option=1&pwd=" + (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHash)() + "&whichchoice=1182&piece=1942", false);
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat)();
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
    }

    while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.toInt)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("_witchessFights")) === 2) {
      libram__WEBPACK_IMPORTED_MODULE_2__.Macro.attack().repeat().setAutoAttack();
      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject225 || (_templateObject225 = _taggedTemplateLiteral(["carol of the bulls"]))));
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("campground.php?action=witchess");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(1);
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("choice.php?option=1&pwd=" + (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHash)() + "&whichchoice=1182&piece=1940", false);
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat)();
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
    }

    while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.toInt)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("_witchessFights")) === 3) {
      libram__WEBPACK_IMPORTED_MODULE_2__.Macro.attack().repeat().setAutoAttack();
      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject226 || (_templateObject226 = _taggedTemplateLiteral(["carol of the bulls"]))));
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("campground.php?action=witchess");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(1);
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("choice.php?option=1&pwd=" + (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHash)() + "&whichchoice=1182&piece=1941", false);
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat)();
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
    }
  } // get witchess buff, this should fall all the way through to fam wt


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject227 || (_templateObject227 = _taggedTemplateLiteral(["puzzle champ"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("witchess");
  } // Professor 9x free sausage fight @ NEP


  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_sausageFights") === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject228 || (_templateObject228 = _taggedTemplateLiteral(["Pocket Professor"]))));
    tryEquip((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject229 || (_templateObject229 = _taggedTemplateLiteral(["Pocket Professor memory chip"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject230 || (_templateObject230 = _taggedTemplateLiteral(["Kramco Sausage-o-Matic&trade;"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject231 || (_templateObject231 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject232 || (_templateObject232 = _taggedTemplateLiteral(["Brutal brogues"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject233 || (_templateObject233 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject234 || (_templateObject234 = _taggedTemplateLiteral(["Beach Comb"]))));

    while ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_sausageFights") === 0) {
      if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHp)() < 0.8 * (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMaxhp)()) {
        (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("clan_viplounge.php?where=hottub");
      } // Just here to party.


      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1322, 2);
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject235 || (_templateObject235 = _taggedTemplateLiteral(["The Neverending Party"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.if_('!monstername "sausage goblin"', new libram__WEBPACK_IMPORTED_MODULE_2__.Macro().step("abort")).trySkill(Skill.get("Lecture on Relativity")).step(justKillTheThing));
    }
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("YOU FUCKED UP THE KRAMCO CHAIN AGAIN, YOU DUMBASS! Go kill crayon elves instead.");
  }

  useDefaultFamiliar();
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject236 || (_templateObject236 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject237 || (_templateObject237 = _taggedTemplateLiteral(["backup camera"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject238 || (_templateObject238 = _taggedTemplateLiteral(["shirt"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject239 || (_templateObject239 = _taggedTemplateLiteral(["none"]))));

  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("feelNostalgicMonster") === "sausage goblin" && (0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_backUpUses") < 11) {
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject240 || (_templateObject240 = _taggedTemplateLiteral(["Noob Cave"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject241 || (_templateObject241 = _taggedTemplateLiteral(["back-up to your last enemy"])))).step(justKillTheThing));
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0); // Breakfast
  // Visiting Looking Glass in clan VIP lounge

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("clan_viplounge.php?action=lookingglass&whichfloor=2");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("swim item");

  while ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_genieWishesUsed") < 3) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("genie wish for more wishes");
  } // Visiting the Ruined House
  //  visit_url('place.php?whichplace=desertbeach&action=db_nukehouse');


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject242 || (_templateObject242 = _taggedTemplateLiteral(["Advanced Cocktailcrafting"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject243 || (_templateObject243 = _taggedTemplateLiteral(["Pastamastery"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject244 || (_templateObject244 = _taggedTemplateLiteral(["Spaghetti Breakfast"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject245 || (_templateObject245 = _taggedTemplateLiteral(["Grab a Cold One"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject246 || (_templateObject246 = _taggedTemplateLiteral(["Acquire Rhinestones"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject247 || (_templateObject247 = _taggedTemplateLiteral(["Perfect Freeze"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject248 || (_templateObject248 = _taggedTemplateLiteral(["summon kokomo resort pass"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject249 || (_templateObject249 = _taggedTemplateLiteral(["kokomo resort pass"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(3, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject250 || (_templateObject250 = _taggedTemplateLiteral(["coconut shell"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(3, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject251 || (_templateObject251 = _taggedTemplateLiteral(["magical ice cubes"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(3, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject252 || (_templateObject252 = _taggedTemplateLiteral(["little paper umbrella"])))); // Autosell stuff
  // autosell(1, $item[strawberry]);
  // autosell(1, $item[orange]);

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject253 || (_templateObject253 = _taggedTemplateLiteral(["razor-sharp can lid"])))); // autosell(5, $item[red pixel]);

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject254 || (_templateObject254 = _taggedTemplateLiteral(["green pixel"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject255 || (_templateObject255 = _taggedTemplateLiteral(["blue pixel"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject256 || (_templateObject256 = _taggedTemplateLiteral(["white pixel"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject257 || (_templateObject257 = _taggedTemplateLiteral(["Carlweather's Cantata of Confrontation"], ["Carlweather\\'s Cantata of Confrontation"])))) > 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("shrug Carlweather's Cantata of Confrontation");
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("mood hccs");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject258 || (_templateObject258 = _taggedTemplateLiteral(["makeshift garbage shirt"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject259 || (_templateObject259 = _taggedTemplateLiteral(["God Lobster"]))));

  while ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_godLobsterFights") < 2) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("choiceAdventure1310", "1");
    tryEquip((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject260 || (_templateObject260 = _taggedTemplateLiteral(["God Lobster's Scepter"], ["God Lobster\\'s Scepter"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("main.php?fightgodlobster=1");
    withMacro(libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject261 || (_templateObject261 = _taggedTemplateLiteral(["saucegeyser"])))), kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("choice.php");
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.handlingChoice)()) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(1);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  } // fight a witchess queen for pointy crown, getting a couple weapon damage effects just in case


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.toInt)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("_witchessFights")) === 4) {
    libram__WEBPACK_IMPORTED_MODULE_2__.Macro.attack().repeat().setAutoAttack();
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject262 || (_templateObject262 = _taggedTemplateLiteral(["carol of the bulls"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject263 || (_templateObject263 = _taggedTemplateLiteral(["song of the north"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("campground.php?action=witchess");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(1);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("choice.php?option=1&pwd=" + (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHash)() + "&whichchoice=1182&piece=1939", false);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat)();
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  }

  useDefaultFamiliar();
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject264 || (_templateObject264 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject265 || (_templateObject265 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"])))); // 14 free NEP fights, using mob hit and xray

  while ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_neverendingPartyFreeTurns") < 10 || (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveSkill)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject266 || (_templateObject266 = _taggedTemplateLiteral(["Chest X-Ray"])))) && (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_chestXRayUsed") < 3 || (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveSkill)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject267 || (_templateObject267 = _taggedTemplateLiteral(["Gingerbread Mob Hit"])))) && !(0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyBoolean)("_gingerbreadMobHitUsed")) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureNpcEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject268 || (_templateObject268 = _taggedTemplateLiteral(["Glittering Eyelashes"]))), 5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject269 || (_templateObject269 = _taggedTemplateLiteral(["glittery mascara"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject270 || (_templateObject270 = _taggedTemplateLiteral(["The Magical Mojomuscular Melody"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject271 || (_templateObject271 = _taggedTemplateLiteral(["Polka of Plenty"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject272 || (_templateObject272 = _taggedTemplateLiteral(["inscrutable gaze"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject273 || (_templateObject273 = _taggedTemplateLiteral(["pride of the puffin"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject274 || (_templateObject274 = _taggedTemplateLiteral(["drescher's annoying noise"], ["drescher\\'s annoying noise"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject275 || (_templateObject275 = _taggedTemplateLiteral(["ur-kel's aria of annoyance"], ["ur-kel\\'s aria of annoyance"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject276 || (_templateObject276 = _taggedTemplateLiteral(["Feeling Excited"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("mood execute"); // Otherwise fight.

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1324, 5); // }

    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureMpSausage)(100);

    if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_neverendingPartyFreeTurns") < 10 && (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_feelPrideUsed") < 3) {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject277 || (_templateObject277 = _taggedTemplateLiteral(["The Neverending Party"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject278 || (_templateObject278 = _taggedTemplateLiteral(["feel pride"])))).step(justKillTheThing));
    } else if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_neverendingPartyFreeTurns") < 10) {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject279 || (_templateObject279 = _taggedTemplateLiteral(["The Neverending Party"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.step(justKillTheThing));
    } else {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject280 || (_templateObject280 = _taggedTemplateLiteral(["The Neverending Party"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject281 || (_templateObject281 = _taggedTemplateLiteral(["chest x-ray"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject282 || (_templateObject282 = _taggedTemplateLiteral(["gingerbread mob hit"])))));
    }
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject283 || (_templateObject283 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("fold makeshift garbage shirt");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject284 || (_templateObject284 = _taggedTemplateLiteral(["makeshift garbage shirt"]))));
  useDefaultFamiliar();

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("boomBoxSong") !== "These Fists Were Made for Punchin'") {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("boombox damage");
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject285 || (_templateObject285 = _taggedTemplateLiteral(["Pastamancer"])))) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject286 || (_templateObject286 = _taggedTemplateLiteral(["Bind Undead Elbow Macaroni"]))));else (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensurePotionEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject287 || (_templateObject287 = _taggedTemplateLiteral(["Expert Oiliness"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject288 || (_templateObject288 = _taggedTemplateLiteral(["oil of expertise"])))); // synthesis_plan($effect[Synthesis: Strong], tail(tail(subsequent)));
  // ensure_effect($effect[Gr8ness]);
  // ensure_effect($effect[Tomato Power]);

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject289 || (_templateObject289 = _taggedTemplateLiteral(["Song of Starch"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject290 || (_templateObject290 = _taggedTemplateLiteral(["Big"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject291 || (_templateObject291 = _taggedTemplateLiteral(["Power Ballad of the Arrowsmith"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject292 || (_templateObject292 = _taggedTemplateLiteral(["Rage of the Reindeer"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject293 || (_templateObject293 = _taggedTemplateLiteral(["Quiet Determination"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject294 || (_templateObject294 = _taggedTemplateLiteral(["Disdain of the War Snapper"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureNpcEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject295 || (_templateObject295 = _taggedTemplateLiteral(["Go Get 'Em, Tiger!"], ["Go Get \\'Em, Tiger!"]))), 5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject296 || (_templateObject296 = _taggedTemplateLiteral(["Ben-Gal&trade; balm"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject297 || (_templateObject297 = _taggedTemplateLiteral(["disembodied hand"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("hp", false); // QUEST - Donate Blood (HP)

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMaxhp)() - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBuffedstat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject298 || (_templateObject298 = _taggedTemplateLiteral(["muscle"])))) - 3 < 1770) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Not enough HP to cap.");
  }

  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_HP);
  HP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_MUS)) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject299 || (_templateObject299 = _taggedTemplateLiteral(["Pastamancer"])))) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject300 || (_templateObject300 = _taggedTemplateLiteral(["Bind Undead Elbow Macaroni"]))));else (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensurePotionEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject301 || (_templateObject301 = _taggedTemplateLiteral(["Expert Oiliness"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject302 || (_templateObject302 = _taggedTemplateLiteral(["oil of expertise"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myInebriety)() === 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureOde)(4);
    tryUse(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject303 || (_templateObject303 = _taggedTemplateLiteral(["astral six-pack"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.drink)(4, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject304 || (_templateObject304 = _taggedTemplateLiteral(["astral pilsner"]))));
  }

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject305 || (_templateObject305 = _taggedTemplateLiteral(["Big"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject306 || (_templateObject306 = _taggedTemplateLiteral(["Song of Bravado"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject307 || (_templateObject307 = _taggedTemplateLiteral(["Stevedave's Shanty of Superiority"], ["Stevedave\\'s Shanty of Superiority"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject308 || (_templateObject308 = _taggedTemplateLiteral(["Power Ballad of the Arrowsmith"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject309 || (_templateObject309 = _taggedTemplateLiteral(["Rage of the Reindeer"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject310 || (_templateObject310 = _taggedTemplateLiteral(["Quiet Determination"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject311 || (_templateObject311 = _taggedTemplateLiteral(["Disdain of the War Snapper"])))); // ensure_effect($effect[Tomato Power]);

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureNpcEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject312 || (_templateObject312 = _taggedTemplateLiteral(["Go Get 'Em, Tiger!"], ["Go Get \\'Em, Tiger!"]))), 5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject313 || (_templateObject313 = _taggedTemplateLiteral(["Ben-Gal&trade; balm"])))); // ensure_effect($effect[Ham-Fisted]);

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.create)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject314 || (_templateObject314 = _taggedTemplateLiteral(["philter of phorce"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject315 || (_templateObject315 = _taggedTemplateLiteral(["Phorcefullness"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("muscle", false);

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject316 || (_templateObject316 = _taggedTemplateLiteral(["Pastamancer"]))) && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBuffedstat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject317 || (_templateObject317 = _taggedTemplateLiteral(["muscle"])))) - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBasestat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject318 || (_templateObject318 = _taggedTemplateLiteral(["mysticality"])))) < 1770) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Not enough moxie to cap.");
  } else if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBuffedstat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject319 || (_templateObject319 = _taggedTemplateLiteral(["muscle"])))) - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBasestat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject320 || (_templateObject320 = _taggedTemplateLiteral(["muscle"])))) < 1770) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Not enough moxie to cap.");
  } // cli_execute('modtrace mus');
  // abort();


  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_MUS);
  MUS_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_MYS)) {
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject321 || (_templateObject321 = _taggedTemplateLiteral(["Big"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject322 || (_templateObject322 = _taggedTemplateLiteral(["Song of Bravado"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject323 || (_templateObject323 = _taggedTemplateLiteral(["Stevedave's Shanty of Superiority"], ["Stevedave\\'s Shanty of Superiority"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject324 || (_templateObject324 = _taggedTemplateLiteral(["The Magical Mojomuscular Melody"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject325 || (_templateObject325 = _taggedTemplateLiteral(["Quiet Judgement"])))); // ensure_effect($effect[Tomato Power]);

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject326 || (_templateObject326 = _taggedTemplateLiteral(["Mystically Oiled"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureNpcEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject327 || (_templateObject327 = _taggedTemplateLiteral(["Glittering Eyelashes"]))), 5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject328 || (_templateObject328 = _taggedTemplateLiteral(["glittery mascara"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("mysticality", false);

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBuffedstat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject329 || (_templateObject329 = _taggedTemplateLiteral(["mysticality"])))) - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBasestat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject330 || (_templateObject330 = _taggedTemplateLiteral(["mysticality"])))) < 1770) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Not enough mysticality to cap.");
  }

  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_MYS);
  MYS_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_MOX)) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject331 || (_templateObject331 = _taggedTemplateLiteral(["Pastamancer"])))) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject332 || (_templateObject332 = _taggedTemplateLiteral(["Bind Penne Dreadful"]))));else (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensurePotionEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject333 || (_templateObject333 = _taggedTemplateLiteral(["Expert Oiliness"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject334 || (_templateObject334 = _taggedTemplateLiteral(["oil of expertise"])))); // Beach Comb

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject335 || (_templateObject335 = _taggedTemplateLiteral(["Pomp & Circumsands"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject336 || (_templateObject336 = _taggedTemplateLiteral(["Bird-a-Day Calendar"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject337 || (_templateObject337 = _taggedTemplateLiteral(["Blessing of the Bird"])))); // Should be 11% NC and 50% moxie, will fall through to NC test
  // ensureEffect($effect`Blessing of your favorite Bird`);

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject338 || (_templateObject338 = _taggedTemplateLiteral(["Big"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject339 || (_templateObject339 = _taggedTemplateLiteral(["Song of Bravado"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject340 || (_templateObject340 = _taggedTemplateLiteral(["Stevedave's Shanty of Superiority"], ["Stevedave\\'s Shanty of Superiority"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject341 || (_templateObject341 = _taggedTemplateLiteral(["The Moxious Madrigal"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject342 || (_templateObject342 = _taggedTemplateLiteral(["Quiet Desperation"])))); // ensure_effect($effect[Tomato Power]);

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureNpcEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject343 || (_templateObject343 = _taggedTemplateLiteral(["Butt-Rock Hair"]))), 5, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject344 || (_templateObject344 = _taggedTemplateLiteral(["hair spray"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject345 || (_templateObject345 = _taggedTemplateLiteral(["rhinestone"])))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject346 || (_templateObject346 = _taggedTemplateLiteral(["rhinestone"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject347 || (_templateObject347 = _taggedTemplateLiteral(["Unrunnable Face"])))) === 0) {
    tryUse(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject348 || (_templateObject348 = _taggedTemplateLiteral(["runproof mascara"]))));
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("moxie", false);

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject349 || (_templateObject349 = _taggedTemplateLiteral(["Pastamancer"]))) && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBuffedstat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject350 || (_templateObject350 = _taggedTemplateLiteral(["moxie"])))) - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBasestat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject351 || (_templateObject351 = _taggedTemplateLiteral(["mysticality"])))) < 1770) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Not enough moxie to cap.");
  } else if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBuffedstat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject352 || (_templateObject352 = _taggedTemplateLiteral(["moxie"])))) - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myBasestat)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$stat)(_templateObject353 || (_templateObject353 = _taggedTemplateLiteral(["moxie"])))) < 1770) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Not enough moxie to cap.");
  }

  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_MOX);
  MOX_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_HOT_RES)) {
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureMpSausage)(500);
  useDefaultFamiliar();
  fightSausageIfGuaranteed(); // Make sure no moon spoon.

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject354 || (_templateObject354 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject355 || (_templateObject355 = _taggedTemplateLiteral(["Eight Days a Week Pill Keeper"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject356 || (_templateObject356 = _taggedTemplateLiteral(["acc2"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject357 || (_templateObject357 = _taggedTemplateLiteral(["Powerful Glove"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject358 || (_templateObject358 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject359 || (_templateObject359 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject360 || (_templateObject360 = _taggedTemplateLiteral(["heat-resistant gloves"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.adv1)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject361 || (_templateObject361 = _taggedTemplateLiteral(["LavaCo&trade; Lamp Factory"]))), -1, "");

    if (!(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.containsText)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject362 || (_templateObject362 = _taggedTemplateLiteral(["LavaCo&trade; Lamp Factory"]))).noncombatQueue, "LavaCo&trade; Welcomes You")) {
      throw "Something went wrong at LavaCo.";
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject363 || (_templateObject363 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject364 || (_templateObject364 = _taggedTemplateLiteral(["vampyric cloake"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("choiceAdventure1387", "3");
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.mapMonster)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject365 || (_templateObject365 = _taggedTemplateLiteral(["LavaCo&trade; Lamp Factory"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$monster)(_templateObject366 || (_templateObject366 = _taggedTemplateLiteral(["Factory worker (female)"]))));
    withMacro(libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject367 || (_templateObject367 = _taggedTemplateLiteral(["become a cloud of mist"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject368 || (_templateObject368 = _taggedTemplateLiteral(["meteor shower"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject369 || (_templateObject369 = _taggedTemplateLiteral(["use the force"])))), kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat);

    while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.lastChoice)() === 1387 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.handlingChoice)()) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(3);
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("mappingMonsters", "false");
  } // synth hot


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject370 || (_templateObject370 = _taggedTemplateLiteral(["Synthesis: Hot"])))) == 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("autoSatisfyWithNPCs", "true");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.buy)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject371 || (_templateObject371 = _taggedTemplateLiteral(["tamarind-flavored chewing gum"]))), 1);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.buy)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject372 || (_templateObject372 = _taggedTemplateLiteral(["lime-and-chile-flavored chewing gum"]))), 1); // cliExecute("synthesize hot");

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.sweetSynthesis)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject373 || (_templateObject373 = _taggedTemplateLiteral(["tamarind-flavored chewing gum"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject374 || (_templateObject374 = _taggedTemplateLiteral(["lime-and-chile-flavored chewing gum"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("autoSatisfyWithNPCs", "false");
  } // add +5 hot res to KGB, relies on Ezandora's script, naturally


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("briefcase e hot"); // set retrocape to elemental resistance

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("retrocape mus hold");
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject375 || (_templateObject375 = _taggedTemplateLiteral(["Blood Bond"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject376 || (_templateObject376 = _taggedTemplateLiteral(["Leash of Linguini"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject377 || (_templateObject377 = _taggedTemplateLiteral(["Empathy"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject378 || (_templateObject378 = _taggedTemplateLiteral(["feeling peaceful"])))); // Pool buff. This will fall through to fam weight.

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject379 || (_templateObject379 = _taggedTemplateLiteral(["Billiards Belligerence"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject380 || (_templateObject380 = _taggedTemplateLiteral(["metal meteoroid"])))) > 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject381 || (_templateObject381 = _taggedTemplateLiteral(["meteorite guard"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("create 1 meteorite guard");
  }

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject382 || (_templateObject382 = _taggedTemplateLiteral(["tenderizing hammer"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("smash * ratty knitted cap");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("smash * red-hot sausage fork");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(10, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject383 || (_templateObject383 = _taggedTemplateLiteral(["hot nuggets"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.autosell)(10, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject384 || (_templateObject384 = _taggedTemplateLiteral(["twinkly powder"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject385 || (_templateObject385 = _taggedTemplateLiteral(["hot powder"])))) > 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject386 || (_templateObject386 = _taggedTemplateLiteral(["Flame-Retardant Trousers"]))));
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject387 || (_templateObject387 = _taggedTemplateLiteral(["sleaze powder"])))) > 0 || (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject388 || (_templateObject388 = _taggedTemplateLiteral(["lotion of sleaziness"])))) > 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensurePotionEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject389 || (_templateObject389 = _taggedTemplateLiteral(["Sleazy Hands"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject390 || (_templateObject390 = _taggedTemplateLiteral(["lotion of sleaziness"]))));
  } // wish for healthy green glow, should fall through
  // wish_effect($effect[healthy green glow]);


  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject391 || (_templateObject391 = _taggedTemplateLiteral(["Elemental Saucesphere"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject392 || (_templateObject392 = _taggedTemplateLiteral(["Astral Shell"])))); // Build up 100 turns of Deep Dark Visions for spell damage later.

  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveSkill)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject393 || (_templateObject393 = _taggedTemplateLiteral(["Deep Dark Visions"])))) && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject394 || (_templateObject394 = _taggedTemplateLiteral(["Visions of the Deep Dark Deeps"])))) < 50) {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMp)() < 20) {
      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureCreateItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject395 || (_templateObject395 = _taggedTemplateLiteral(["magical sausage"]))));
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.eat)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject396 || (_templateObject396 = _taggedTemplateLiteral(["magical sausage"]))));
    }

    while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHp)() < (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMaxhp)()) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject397 || (_templateObject397 = _taggedTemplateLiteral(["Cannelloni Cocoon"]))));
    }

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMp)() < 100) {
      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureCreateItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject398 || (_templateObject398 = _taggedTemplateLiteral(["magical sausage"]))));
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.eat)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject399 || (_templateObject399 = _taggedTemplateLiteral(["magical sausage"]))));
    }

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.round)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("spooky resistance")) < 10) {
      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject400 || (_templateObject400 = _taggedTemplateLiteral(["Does It Have a Skull In There??"]))));

      if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.round)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("spooky resistance")) < 10) {
        throw "Not enough spooky res for Deep Dark Visions.";
      }
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject401 || (_templateObject401 = _taggedTemplateLiteral(["Deep Dark Visions"]))));
  } // drink hot socks here if you're a tryhard
  // Beach comb buff.


  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject402 || (_templateObject402 = _taggedTemplateLiteral(["Hot-Headed"])))); // Use pocket maze

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject403 || (_templateObject403 = _taggedTemplateLiteral(["pocket maze"])))) > 0) (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject404 || (_templateObject404 = _taggedTemplateLiteral(["Amazing"])))); // if (get_property('_horsery') != 'pale horse') cli_execute('horsery pale');

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject405 || (_templateObject405 = _taggedTemplateLiteral(["Exotic Parrot"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject406 || (_templateObject406 = _taggedTemplateLiteral(["cracker"])))) === 0 && (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("tomeSummons") < 3) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.retrieveItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject407 || (_templateObject407 = _taggedTemplateLiteral(["box of Familiar jacks"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject408 || (_templateObject408 = _taggedTemplateLiteral(["box of Familiar Jacks"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject409 || (_templateObject409 = _taggedTemplateLiteral(["cracker"]))));
  } // Mafia sometimes can't figure out that multiple +weight things would get us to next tier.


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("hot res, 0.01 familiar weight", false);

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.round)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("hot resistance")) < 59) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Something went wrong building hot res.");
  } // cli_execute('modtrace Hot Resistance');
  // abort();


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.logprint)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecuteOutput)("modtrace hot resistance"));
  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_HOT_RES);
  HOT_RES_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_NONCOMBAT)) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHp)() < 30) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject410 || (_templateObject410 = _taggedTemplateLiteral(["Cannelloni Cocoon"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject411 || (_templateObject411 = _taggedTemplateLiteral(["Blood Bond"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject412 || (_templateObject412 = _taggedTemplateLiteral(["Leash of Linguini"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject413 || (_templateObject413 = _taggedTemplateLiteral(["Empathy"]))));

  if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_godLobsterFights") < 3) {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHp)() < 0.8 * (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myMaxhp)()) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject414 || (_templateObject414 = _taggedTemplateLiteral(["Cannelloni Cocoon"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject415 || (_templateObject415 = _taggedTemplateLiteral(["God Lobster"])))); // Get -combat buff.

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("choiceAdventure1310", "2");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject416 || (_templateObject416 = _taggedTemplateLiteral(["God Lobster's Ring"], ["God Lobster\\'s Ring"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("main.php?fightgodlobster=1");
    withMacro(libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject417 || (_templateObject417 = _taggedTemplateLiteral(["saucegeyser"])))), kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("choice.php");
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.handlingChoice)()) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(2);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  } // setting KGB to NC, relies on Ezandora's script


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("briefcase e -combat"); // Pool buff. Should fall through to weapon damage.

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject418 || (_templateObject418 = _taggedTemplateLiteral(["Billiards Belligerence"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject419 || (_templateObject419 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject420 || (_templateObject420 = _taggedTemplateLiteral(["Powerful Glove"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject421 || (_templateObject421 = _taggedTemplateLiteral(["gummed shoes"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject422 || (_templateObject422 = _taggedTemplateLiteral(["The Sonata of Sneakiness"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject423 || (_templateObject423 = _taggedTemplateLiteral(["Smooth Movements"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject424 || (_templateObject424 = _taggedTemplateLiteral(["Invisible Avatar"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject425 || (_templateObject425 = _taggedTemplateLiteral(["Silent Running"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject426 || (_templateObject426 = _taggedTemplateLiteral(["Feeling Lonely"])))); // Rewards

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject427 || (_templateObject427 = _taggedTemplateLiteral(["Throwing Some Shade"])))); // ensure_effect($effect[A Rose by Any Other Material]);
  // wish for disquiet riot because shades are hilariously expensive
  // wishEffect($effect`disquiet riot`);

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject428 || (_templateObject428 = _taggedTemplateLiteral(["Disgeist"])))); // Pastamancer d1 is -combat.

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject429 || (_templateObject429 = _taggedTemplateLiteral(["pastamancer"])))) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject430 || (_templateObject430 = _taggedTemplateLiteral(["Blessing of the Bird"]))));
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("-combat, 0.01 familiar weight", false);

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.round)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("combat rate")) > -40) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Not enough -combat to cap.");
  } // cli_execute('modtrace combat rate');
  // abort();


  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_NONCOMBAT);
  NONCOMBAT_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_FAMILIAR)) {
  fightSausageIfGuaranteed(); // These should have fallen through all the way from leveling.

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject431 || (_templateObject431 = _taggedTemplateLiteral(["Fidoxene"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject432 || (_templateObject432 = _taggedTemplateLiteral(["Do I Know You From Somewhere?"])))); // Pool buff.

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject433 || (_templateObject433 = _taggedTemplateLiteral(["Billiards Belligerence"]))));
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myHp)() < 30) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject434 || (_templateObject434 = _taggedTemplateLiteral(["Cannelloni Cocoon"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject435 || (_templateObject435 = _taggedTemplateLiteral(["Blood Bond"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject436 || (_templateObject436 = _taggedTemplateLiteral(["Leash of Linguini"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject437 || (_templateObject437 = _taggedTemplateLiteral(["Empathy"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject438 || (_templateObject438 = _taggedTemplateLiteral(["robot friends"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject439 || (_templateObject439 = _taggedTemplateLiteral(["human-machine hybrid"]))));
  /*
    if (availableAmount($item`cracker`) > 0 && getPropertyInt("tomeSummons") < 3) {
      useFamiliar($familiar`Exotic Parrot`);
      equip($item`cracker`);
    }
  */
  // this is going to be all the gingerbread stuff, it is a work in progress

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject440 || (_templateObject440 = _taggedTemplateLiteral(["whole latte love"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject441 || (_templateObject441 = _taggedTemplateLiteral(["gingerbread spice latte"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject442 || (_templateObject442 = _taggedTemplateLiteral(["chocolate lab"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("sprinkle drop", false);

    if (!(0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_gingerbreadClockAdvanced")) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("adventure.php?snarfblat=477");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(1);
    }

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject443 || (_templateObject443 = _taggedTemplateLiteral(["sprinkles"])))) < 50) {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject444 || (_templateObject444 = _taggedTemplateLiteral(["Gingerbread Upscale Retail District"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject445 || (_templateObject445 = _taggedTemplateLiteral(["shattering punch"])))));
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
    }

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject446 || (_templateObject446 = _taggedTemplateLiteral(["sprinkles"])))) >= 50) {
      // equip($slot`acc3`, $item`kremlin's greatest briefcase`);
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject447 || (_templateObject447 = _taggedTemplateLiteral(["frumious bandersnatch"]))));
      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject448 || (_templateObject448 = _taggedTemplateLiteral(["ode to booze"]))));
      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.setChoice)(1208, 3);

      while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject449 || (_templateObject449 = _taggedTemplateLiteral(["gingerbread spice latte"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject450 || (_templateObject450 = _taggedTemplateLiteral(["whole latte love"])))) === 0) {
        (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacro)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject451 || (_templateObject451 = _taggedTemplateLiteral(["Gingerbread Upscale Retail District"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.step("runaway"));
      }
    } else {
      throw "Something went wrong getting sprinkles";
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject452 || (_templateObject452 = _taggedTemplateLiteral(["gingerbread spice latte"]))));
    useDefaultFamiliar();
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject453 || (_templateObject453 = _taggedTemplateLiteral(["Meteor Showered"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject454 || (_templateObject454 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"]))));
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject455 || (_templateObject455 = _taggedTemplateLiteral(["The Neverending Party"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject456 || (_templateObject456 = _taggedTemplateLiteral(["Meteor Shower"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject457 || (_templateObject457 = _taggedTemplateLiteral(["Use the Force"])))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  } // checking here to see if we had a tome summon for a cracker or if we should use BBB


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject458 || (_templateObject458 = _taggedTemplateLiteral(["cracker"])))) > 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject459 || (_templateObject459 = _taggedTemplateLiteral(["exotic parrot"]))));
  } else if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject460 || (_templateObject460 = _taggedTemplateLiteral(["bugged beanie"])))) === 1) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject461 || (_templateObject461 = _taggedTemplateLiteral(["baby bugged bugbear"]))));
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("familiar weight", false); // cli_execute('modtrace familiar weight');
  // abort();

  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_FAMILIAR);
  FAMILIAR_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_WEAPON)) {
  var weaponTurns = function weaponTurns() {
    return 60 - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.floor)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("weapon damage") / 25 + 0.001) - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.floor)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("weapon damage percent") / 25 + 0.001);
  };

  fightSausageIfGuaranteed(); // Get inner elf for weapon damage

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject462 || (_templateObject462 = _taggedTemplateLiteral(["inner elf"])))) === 0 && (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_snokebombUsed") < 3) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("/whitelist hobopolis vacation home");
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject463 || (_templateObject463 = _taggedTemplateLiteral(["blood bubble"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject464 || (_templateObject464 = _taggedTemplateLiteral(["machine elf"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("choiceAdventure326", "1");
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacro)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject465 || (_templateObject465 = _taggedTemplateLiteral(["The Slime Tube"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject466 || (_templateObject466 = _taggedTemplateLiteral(["snokebomb"])))));
    useDefaultFamiliar();
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("/whitelist alliance from hell");
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Something went wrong with getting inner elf");
  } // Paint crayon elf for DNA and ghost buff (Saber YR)

  /*
  if (!getPropertyBoolean("_chateauMonsterFought")) {
    const chateauText = visitUrl("place.php?whichplace=chateau", false);
    const m = createMatcher("alt="Painting of a? ([^(]*) .1."", chateauText);
    if (find(m) && group(m, 1) === "Black Crayon Crimbo Elf") {
      cliExecute("mood apathetic");
      useFamiliar($familiar`ghost of crimbo carols`);
      equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);
      if (getPropertyInt("_reflexHammerUsed") === 3) {
        error("You do not have any banishes left");
      }
      setHccsCombatMode(MODE_CUSTOM, mSkill(mItem(mNew(), $item`DNA extraction syringe`), $skill`Reflex Hammer`));
      visitUrl("place.php?whichplace=chateau&action=chateau_painting", false);
      runCombat();
      useDefaultFamiliar();
    } else {
      error("Wrong painting.");
    }
  } */


  if (!(0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_chateauMonsterFought")) {
    // const chateauText = visitUrl("place.php?whichplace=chateau", false);
    // const match = chateauText.match(/alt="Painting of an? ([^(]*) .1."/);
    // if (getPropertyInt("camelSpit") === 100) useFamiliar($familiar`Melodramedary`);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject467 || (_templateObject467 = _taggedTemplateLiteral(["ghost of crimbo carols"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject468 || (_templateObject468 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject469 || (_templateObject469 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"]))));

    if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_reflexHammerUsed") > 2) {
      (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("You do not have any banishes left");
    }

    libram__WEBPACK_IMPORTED_MODULE_2__.Macro.item((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject470 || (_templateObject470 = _taggedTemplateLiteral(["DNA extraction syringe"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject471 || (_templateObject471 = _taggedTemplateLiteral(["reflex hammer"])))).setAutoAttack();
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=chateau&action=chateau_painting", false);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runCombat)();
    useDefaultFamiliar();
  } else {
    throw "You already fought your painting";
  }

  geneTonic("elf");
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject472 || (_templateObject472 = _taggedTemplateLiteral(["human-elf hybrid"])))); // maybe try just setting autoattack to HCCS_Spit
  // fax an ungulith to get corrupted marrow, meteor showered, and spit upon (if applicable)

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject473 || (_templateObject473 = _taggedTemplateLiteral(["corrupted marrow"])))) === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject474 || (_templateObject474 = _taggedTemplateLiteral(["cowrruption"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Your camel spit level is " + (0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("camelSpit"), "green");

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject475 || (_templateObject475 = _taggedTemplateLiteral(["photocopied monster"])))) === 0) {
      if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyBoolean)("_photocopyUsed")) (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Already used fax for the day.");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("/whitelist alliance from hell");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.chatPrivate)("easyfax", "fax ungulith");

      for (var i = 0; i < 2; i++) {
        (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.wait)(10);
        (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("fax receive");
        if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("photocopyMonster") === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$monster)(_templateObject476 || (_templateObject476 = _taggedTemplateLiteral(["ungulith"])))) break; // otherwise got the wrong monster, put it back.

        (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("fax send");
      }

      if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject477 || (_templateObject477 = _taggedTemplateLiteral(["photocopied monster"])))) === 0) throw "Failed to fax in ungulith.";
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("mood apathetic");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject478 || (_templateObject478 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"]))));

    if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("camelSpit") === 100) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject479 || (_templateObject479 = _taggedTemplateLiteral(["melodramedary"]))));
      libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject480 || (_templateObject480 = _taggedTemplateLiteral(["meteor shower"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject481 || (_templateObject481 = _taggedTemplateLiteral(["7340"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject482 || (_templateObject482 = _taggedTemplateLiteral(["use the force"])))).setAutoAttack();
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("choiceAdventure1387", "3");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject483 || (_templateObject483 = _taggedTemplateLiteral(["photocopied monster"]))));
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("set camelSpit = 0");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("camelSpit", "0");
      useDefaultFamiliar();
    } else {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("your camel is not full enough", "red");
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.abort)();
    }
  }
  /*
  if (haveEffect($effect`In a Lather`) === 0) {
    if (myInebriety() > inebrietyLimit() - 2) {
      error("Something went wrong. We are too drunk.");
    }
    assertMeat(500);
    ensureOde(2);
    cliExecute("drink Sockdollager");
  }
  */


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject484 || (_templateObject484 = _taggedTemplateLiteral(["twinkly nuggets"])))) > 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject485 || (_templateObject485 = _taggedTemplateLiteral(["Twinkly Weapon"]))));
  }

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject486 || (_templateObject486 = _taggedTemplateLiteral(["Carol of the Bulls"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject487 || (_templateObject487 = _taggedTemplateLiteral(["Song of the North"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject488 || (_templateObject488 = _taggedTemplateLiteral(["Rage of the Reindeer"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject489 || (_templateObject489 = _taggedTemplateLiteral(["Frenzied, Bloody"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject490 || (_templateObject490 = _taggedTemplateLiteral(["Scowl of the Auk"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject491 || (_templateObject491 = _taggedTemplateLiteral(["Disdain of the War Snapper"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject492 || (_templateObject492 = _taggedTemplateLiteral(["Tenacity of the Snapper"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject493 || (_templateObject493 = _taggedTemplateLiteral(["Jackasses' Symphony of Destruction"], ["Jackasses\\' Symphony of Destruction"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject494 || (_templateObject494 = _taggedTemplateLiteral(["lov elixir #3"], ["lov elixir \\#3"])))) > 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject495 || (_templateObject495 = _taggedTemplateLiteral(["The Power of LOV"]))));
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject496 || (_templateObject496 = _taggedTemplateLiteral(["vial of hamethyst juice"])))) > 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject497 || (_templateObject497 = _taggedTemplateLiteral(["Ham-Fisted"]))));
  } // make KGB set to weapon


  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("briefcase e weapon"); // Hatter buff
  // Beach Comb

  if (!(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.containsText)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("_beachHeadsUsed"), "6")) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject498 || (_templateObject498 = _taggedTemplateLiteral(["Lack of Body-Building"]))));
  } // Boombox potion - did we get one?


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject499 || (_templateObject499 = _taggedTemplateLiteral(["Punching Potion"])))) > 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject500 || (_templateObject500 = _taggedTemplateLiteral(["Feeling Punchy"]))));
  } // Pool buff. Should have fallen through.


  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject501 || (_templateObject501 = _taggedTemplateLiteral(["Billiards Belligerence"])))); // Corrupted marrow

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject502 || (_templateObject502 = _taggedTemplateLiteral(["Cowrruption"])))); // Pastamancer d1 is weapon damage.

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject503 || (_templateObject503 = _taggedTemplateLiteral(["Blessing of your Favorite Bird"])))); // ensureEffect($effect`Blessing of the Bird`);

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureNpcEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject504 || (_templateObject504 = _taggedTemplateLiteral(["Engorged Weapon"]))), 1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject505 || (_templateObject505 = _taggedTemplateLiteral(["Meleegra&trade; pills"])))); // wish_effect($effect[Outer Wolf&trade;]);
  // this is just an assert, effectively.
  // ensureEffect($effect`Meteor Showered`);

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject506 || (_templateObject506 = _taggedTemplateLiteral(["Bow-Legged Swagger"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject507 || (_templateObject507 = _taggedTemplateLiteral(["disembodied hand"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("weapon damage", false);

  if (weaponTurns() > 2) {
    (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Something went wrong with weapon damage.");
  } // cli_execute('modtrace weapon damage');
  // abort();


  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_WEAPON);
  WEAPON_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_SPELL)) {
  var spellTurns = function spellTurns() {
    return 60 - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.floor)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("spell damage") / 50 + 0.001) - (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.floor)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("spell damage percent") / 50 + 0.001);
  };

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject508 || (_templateObject508 = _taggedTemplateLiteral(["Simmering"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject509 || (_templateObject509 = _taggedTemplateLiteral(["Song of Sauce"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject510 || (_templateObject510 = _taggedTemplateLiteral(["Carol of the Hells"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject511 || (_templateObject511 = _taggedTemplateLiteral(["Arched Eyebrow of the Archmage"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSong)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject512 || (_templateObject512 = _taggedTemplateLiteral(["Jackasses' Symphony of Destruction"], ["Jackasses\\' Symphony of Destruction"]))));

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject513 || (_templateObject513 = _taggedTemplateLiteral(["lov elixir #6"], ["lov elixir \\#6"])))) > 0) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject514 || (_templateObject514 = _taggedTemplateLiteral(["The Magic of LOV"]))));
  } // Pool buff


  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject515 || (_templateObject515 = _taggedTemplateLiteral(["Mental A-cue-ity"])))); // Beach Comb

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject516 || (_templateObject516 = _taggedTemplateLiteral(["We're All Made of Starfish"], ["We\\'re All Made of Starfish"])))); // Tea party

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureSewerItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject517 || (_templateObject517 = _taggedTemplateLiteral(["mariachi hat"])))); // ensure_effect($effect[Full Bottle in front of Me]);

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject518 || (_templateObject518 = _taggedTemplateLiteral(["Spirit of Cayenne"])))); // Get flimsy hardwood scraps.

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("shop.php?whichshop=lathe");

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject519 || (_templateObject519 = _taggedTemplateLiteral(["flimsy hardwood scraps"])))) > 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.retrieveItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject520 || (_templateObject520 = _taggedTemplateLiteral(["weeping willow wand"]))));
  }

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject521 || (_templateObject521 = _taggedTemplateLiteral(["obsidian nutcracker"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("briefcase e spell"); // Get inner elf for spell damage

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject522 || (_templateObject522 = _taggedTemplateLiteral(["inner elf"])))) === 0 && (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_snokebombUsed") < 3) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("/whitelist hobopolis vacation home");
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject523 || (_templateObject523 = _taggedTemplateLiteral(["blood bubble"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject524 || (_templateObject524 = _taggedTemplateLiteral(["machine elf"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("choiceAdventure326", "1");
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacro)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject525 || (_templateObject525 = _taggedTemplateLiteral(["The Slime Tube"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject526 || (_templateObject526 = _taggedTemplateLiteral(["snokebomb"])))));
    useDefaultFamiliar();
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("/whitelist alliance from hell");
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Something went wrong with getting inner elf");
  } // Meteor showered


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject527 || (_templateObject527 = _taggedTemplateLiteral(["Meteor Showered"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject528 || (_templateObject528 = _taggedTemplateLiteral(["Fourth of May Cosplay Saber"]))));
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject529 || (_templateObject529 = _taggedTemplateLiteral(["Noob Cave"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject530 || (_templateObject530 = _taggedTemplateLiteral(["Meteor Shower"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject531 || (_templateObject531 = _taggedTemplateLiteral(["Use the Force"])))));
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject532 || (_templateObject532 = _taggedTemplateLiteral(["sauceror"])))) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("barrelprayer buff");
  } // Sigils of Yeg = 200% SD


  if (!(0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyBoolean)("_cargoPocketEmptied") && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject533 || (_templateObject533 = _taggedTemplateLiteral(["Sigils of Yeg"])))) === 0) {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject534 || (_templateObject534 = _taggedTemplateLiteral(["Yeg's Motel hand soap"], ["Yeg\\'s Motel hand soap"])))) === 0) (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("cargo 177");
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject535 || (_templateObject535 = _taggedTemplateLiteral(["Sigils of Yeg"]))));
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.round)((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.numericModifier)("spell damage percent")) % 50 >= 40) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureItem)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject536 || (_templateObject536 = _taggedTemplateLiteral(["soda water"]))));
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensurePotionEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject537 || (_templateObject537 = _taggedTemplateLiteral(["Concentration"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject538 || (_templateObject538 = _taggedTemplateLiteral(["cordial of concentration"]))));
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject539 || (_templateObject539 = _taggedTemplateLiteral(["disembodied hand"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("spell damage", false);

  while (spellTurns() > (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myAdventures)()) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.eat)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject540 || (_templateObject540 = _taggedTemplateLiteral(["magical sausage"]))));
  } // cli_execute('modtrace spell damage');
  // abort();


  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_SPELL);
  SPELL_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

if (!testDone(TEST_ITEM)) {
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureMpSausage)(500);
  fightSausageIfGuaranteed(); // kramco messes up maps

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject541 || (_templateObject541 = _taggedTemplateLiteral(["off-hand"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject542 || (_templateObject542 = _taggedTemplateLiteral(["none"])))); //getting a lil ninja costume for the tot

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject543 || (_templateObject543 = _taggedTemplateLiteral(["9140"])))) === 0 && (0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_shatteringPunchUsed") < 3) {
    libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject544 || (_templateObject544 = _taggedTemplateLiteral(["shattering punch"])))).setAutoAttack();
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.mapMonster)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject545 || (_templateObject545 = _taggedTemplateLiteral(["The Haiku Dungeon"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$monster)(_templateObject546 || (_templateObject546 = _taggedTemplateLiteral(["Amateur ninja"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setLocation)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject547 || (_templateObject547 = _taggedTemplateLiteral(["none"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  } // use abstraction: certainty if you have it
  // ensureEffect($effect`certainty`);
  // pulls wheel of fortune from deck, gets rope and wrench for later


  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_deckCardsDrawn") === 5) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("cheat buff items");
  } // get pirate DNA and make a gene tonic


  if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("dnaSyringe") !== "pirate" && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject548 || (_templateObject548 = _taggedTemplateLiteral(["Human-Pirate Hybrid"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject549 || (_templateObject549 = _taggedTemplateLiteral(["acc1"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject550 || (_templateObject550 = _taggedTemplateLiteral(["Kremlin's Greatest Briefcase"], ["Kremlin\\'s Greatest Briefcase"]))));

    if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_kgbTranquilizerDartUses") >= 3) {
      (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Out of KGB banishes");
    } // adv once for the opening free NC, should check NC queue here


    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject551 || (_templateObject551 = _taggedTemplateLiteral(["Pirates of the Garbage Barges"]))).noncombatQueue);
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.adv1)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject552 || (_templateObject552 = _taggedTemplateLiteral(["Pirates of the Garbage Barges"]))), -1, "");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject553 || (_templateObject553 = _taggedTemplateLiteral(["Pirates of the Garbage Barges"]))).noncombatQueue);

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.containsText)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject554 || (_templateObject554 = _taggedTemplateLiteral(["Pirates of the Garbage Barges"]))).noncombatQueue, "Dead Men Smell No Tales")) {
      (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject555 || (_templateObject555 = _taggedTemplateLiteral(["Pirates of the Garbage Barges"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.item((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject556 || (_templateObject556 = _taggedTemplateLiteral(["DNA extraction syringe"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject557 || (_templateObject557 = _taggedTemplateLiteral(["KGB tranquilizer dart"])))));
      geneTonic("pirate");
      (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject558 || (_templateObject558 = _taggedTemplateLiteral(["Human-Pirate Hybrid"]))));
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
    } else throw "Something went wrong getting pirate DNA.";
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject559 || (_templateObject559 = _taggedTemplateLiteral(["Bat-Adjacent Form"])))) === 0) {
    if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_reflexHammerUsed") >= 3) (0,libram_dist_console__WEBPACK_IMPORTED_MODULE_4__.error)("Out of reflex hammers!");
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$slot)(_templateObject560 || (_templateObject560 = _taggedTemplateLiteral(["acc3"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject561 || (_templateObject561 = _taggedTemplateLiteral(["Lil' Doctor&trade; Bag"], ["Lil\\' Doctor&trade; Bag"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject562 || (_templateObject562 = _taggedTemplateLiteral(["vampyric cloake"]))));
    (0,libram__WEBPACK_IMPORTED_MODULE_2__.adventureMacroAuto)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$location)(_templateObject563 || (_templateObject563 = _taggedTemplateLiteral(["The Neverending Party"]))), libram__WEBPACK_IMPORTED_MODULE_2__.Macro.skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject564 || (_templateObject564 = _taggedTemplateLiteral(["Become a Bat"])))).skill((0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject565 || (_templateObject565 = _taggedTemplateLiteral(["Reflex Hammer"])))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setAutoAttack)(0);
  }

  if (!(0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyBoolean)("_clanFortuneBuffUsed")) {
    (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject566 || (_templateObject566 = _taggedTemplateLiteral(["There's No N In Love"], ["There\\'s No N In Love"]))));
  }

  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject567 || (_templateObject567 = _taggedTemplateLiteral(["Fat Leon's Phat Loot Lyric"], ["Fat Leon\\'s Phat Loot Lyric"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject568 || (_templateObject568 = _taggedTemplateLiteral(["Singer's Faithful Ocelot"], ["Singer\\'s Faithful Ocelot"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject569 || (_templateObject569 = _taggedTemplateLiteral(["The Spirit of Taking"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject570 || (_templateObject570 = _taggedTemplateLiteral(["items.enh"])))); // synthesis: collection
  // cliExecute("create 1 peppermint twist");

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject571 || (_templateObject571 = _taggedTemplateLiteral(["Synthesis: Collection"])))) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject572 || (_templateObject572 = _taggedTemplateLiteral(["peppermint sprout"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.sweetSynthesis)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject573 || (_templateObject573 = _taggedTemplateLiteral(["peppermint sprout"]))), (0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject574 || (_templateObject574 = _taggedTemplateLiteral(["peppermint twist"]))));
  } // SynthesisPlanner.synthesize($effect`Synthesis: Collection`);
  // see what class we are, maybe a couple other buffs


  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject575 || (_templateObject575 = _taggedTemplateLiteral(["pastamancer"])))) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("barrelprayer buff");
  } else if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myClass)() === (0,libram__WEBPACK_IMPORTED_MODULE_3__.$class)(_templateObject576 || (_templateObject576 = _taggedTemplateLiteral(["sauceror"])))) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject577 || (_templateObject577 = _taggedTemplateLiteral(["7323"])))); // seek out a bird
  } // Use bag of grain.
  //    ensure_effect($effect[Nearly All-Natural]);


  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject578 || (_templateObject578 = _taggedTemplateLiteral(["Feeling Lost"]))));
  (0,_lib__WEBPACK_IMPORTED_MODULE_0__.ensureEffect)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$effect)(_templateObject579 || (_templateObject579 = _taggedTemplateLiteral(["Steely-Eyed Squint"])))); // get big smile of the blender if available, someday use this to replace something?

  if ((0,_lib__WEBPACK_IMPORTED_MODULE_0__.getPropertyInt)("_campAwaySmileBuffs") === 1) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=campaway&action=campaway_sky");
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useFamiliar)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$familiar)(_templateObject580 || (_templateObject580 = _taggedTemplateLiteral(["Trick-or-Treating Tot"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.equip)((0,libram__WEBPACK_IMPORTED_MODULE_3__.$item)(_templateObject581 || (_templateObject581 = _taggedTemplateLiteral(["9140"])))); // ninja costume for 150% item

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.maximize)("item, 2 booze drop, -equip broken champagne bottle, -equip surprisingly capacious handbag", false); // cli_execute('modtrace item');
  // abort();

  TEMP_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)();
  doTest(TEST_ITEM);
  ITEM_TURNS = (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - TEMP_TURNS;
}

(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_3__.$skill)(_templateObject582 || (_templateObject582 = _taggedTemplateLiteral(["spirit of nothing"]))));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("autoSatisfyWithNPCs", "true");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("autoSatisfyWithCoinmasters", (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.getProperty)("_saved_autoSatisfyWithCoinmasters"));
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.setProperty)("hpAutoRecovery", "0.8");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("mood default");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("ccs default");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("boombox food");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("/whitelist alliance from hell");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("peevpee.php?action=smashstone&confirm=on");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Stone smashed. Get your PVP on!", "green"); // spar for 6 fights

if ((0,libram__WEBPACK_IMPORTED_MODULE_5__.get)("_daycareRecruits") === 0 && (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.hippyStoneBroken)() === true) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.visitUrl)("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(3);
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(1);
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(4);
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(5);
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.runChoice)(4);
}

(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.cliExecute)("pvp fame karmic battle");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("This loop took " + ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.gametimeToInt)() - START_TIME) / 1000 + " seconds, for a 1 day, " + ((0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.myTurncount)() - 1) + " turn HCCS run.", "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("HP test: " + HP_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Muscle test: " + MUS_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Moxie test: " + MOX_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Myst test: " + MYS_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Hot Res test: " + HOT_RES_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Noncombat test: " + NONCOMBAT_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Fam Weight test: " + FAMILIAR_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Weapon Damage test: " + WEAPON_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Spell Damage Test: " + SPELL_TURNS, "green");
(0,kolmafia__WEBPACK_IMPORTED_MODULE_1__.print)("Item Drop test: " + ITEM_TURNS, "green");

/***/ }),

/***/ "./src/lib.ts":
/*!********************!*\
  !*** ./src/lib.ts ***!
  \********************/
/*! namespace exports */
/*! export ensureAsdonEffect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureCreateItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureDough [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureEffect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureHermitItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureMpSausage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureMpTonic [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureNpcEffect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureOde [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensurePotionEffect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensurePullEffect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureSewerItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ensureSong [provided] [no usage info] [missing usage info prevents renaming] */
/*! export fuelAsdon [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getPropertyBoolean [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getPropertyInt [provided] [no usage info] [missing usage info prevents renaming] */
/*! export incrementProperty [provided] [no usage info] [missing usage info prevents renaming] */
/*! export itemPriority [provided] [no usage info] [missing usage info prevents renaming] */
/*! export kill [provided] [no usage info] [missing usage info prevents renaming] */
/*! export mapMonster [provided] [no usage info] [missing usage info prevents renaming] */
/*! export myFamiliarWeight [provided] [no usage info] [missing usage info prevents renaming] */
/*! export openSongSlot [provided] [no usage info] [missing usage info prevents renaming] */
/*! export pullIfPossible [provided] [no usage info] [missing usage info prevents renaming] */
/*! export sausageFightGuaranteed [provided] [no usage info] [missing usage info prevents renaming] */
/*! export setChoice [provided] [no usage info] [missing usage info prevents renaming] */
/*! export setClan [provided] [no usage info] [missing usage info prevents renaming] */
/*! export setPropertyInt [provided] [no usage info] [missing usage info prevents renaming] */
/*! export shrug [provided] [no usage info] [missing usage info prevents renaming] */
/*! export tryEquip [provided] [no usage info] [missing usage info prevents renaming] */
/*! export tryUse [provided] [no usage info] [missing usage info prevents renaming] */
/*! export wishEffect [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPropertyInt": () => /* binding */ getPropertyInt,
/* harmony export */   "setPropertyInt": () => /* binding */ setPropertyInt,
/* harmony export */   "incrementProperty": () => /* binding */ incrementProperty,
/* harmony export */   "getPropertyBoolean": () => /* binding */ getPropertyBoolean,
/* harmony export */   "setChoice": () => /* binding */ setChoice,
/* harmony export */   "myFamiliarWeight": () => /* binding */ myFamiliarWeight,
/* harmony export */   "ensureItem": () => /* binding */ ensureItem,
/* harmony export */   "ensureCreateItem": () => /* binding */ ensureCreateItem,
/* harmony export */   "ensureSewerItem": () => /* binding */ ensureSewerItem,
/* harmony export */   "ensureHermitItem": () => /* binding */ ensureHermitItem,
/* harmony export */   "ensureNpcEffect": () => /* binding */ ensureNpcEffect,
/* harmony export */   "ensurePotionEffect": () => /* binding */ ensurePotionEffect,
/* harmony export */   "ensureEffect": () => /* binding */ ensureEffect,
/* harmony export */   "ensureMpTonic": () => /* binding */ ensureMpTonic,
/* harmony export */   "ensureMpSausage": () => /* binding */ ensureMpSausage,
/* harmony export */   "sausageFightGuaranteed": () => /* binding */ sausageFightGuaranteed,
/* harmony export */   "itemPriority": () => /* binding */ itemPriority,
/* harmony export */   "setClan": () => /* binding */ setClan,
/* harmony export */   "ensureDough": () => /* binding */ ensureDough,
/* harmony export */   "fuelAsdon": () => /* binding */ fuelAsdon,
/* harmony export */   "ensureAsdonEffect": () => /* binding */ ensureAsdonEffect,
/* harmony export */   "mapMonster": () => /* binding */ mapMonster,
/* harmony export */   "tryUse": () => /* binding */ tryUse,
/* harmony export */   "tryEquip": () => /* binding */ tryEquip,
/* harmony export */   "wishEffect": () => /* binding */ wishEffect,
/* harmony export */   "pullIfPossible": () => /* binding */ pullIfPossible,
/* harmony export */   "ensurePullEffect": () => /* binding */ ensurePullEffect,
/* harmony export */   "shrug": () => /* binding */ shrug,
/* harmony export */   "openSongSlot": () => /* binding */ openSongSlot,
/* harmony export */   "ensureSong": () => /* binding */ ensureSong,
/* harmony export */   "ensureOde": () => /* binding */ ensureOde,
/* harmony export */   "kill": () => /* binding */ kill
/* harmony export */ });
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kolmafia */ "kolmafia");
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(kolmafia__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var libram__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libram */ "./node_modules/libram/dist/template-string.js");
/* harmony import */ var libram__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libram */ "./node_modules/libram/dist/combat.js");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21, _templateObject22, _templateObject23, _templateObject24, _templateObject25, _templateObject26, _templateObject27, _ref, _templateObject28, _templateObject29, _templateObject30, _templateObject31, _templateObject32, _templateObject33, _templateObject34, _templateObject35, _templateObject36;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }



function getPropertyInt(name) {
  var str = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getProperty)(name);

  if (str === "") {
    throw "Unknown property ".concat(name, ".");
  }

  return (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.toInt)(str);
}
function setPropertyInt(name, value) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.setProperty)(name, "".concat(value));
}
function incrementProperty(name) {
  setPropertyInt(name, getPropertyInt(name) + 1);
}
function getPropertyBoolean(name) {
  var str = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getProperty)(name);

  if (str === "") {
    throw "Unknown property ".concat(name, ".");
  }

  return str === "true";
}
function setChoice(adv, choice) {
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.setProperty)("choiceAdventure".concat(adv), "".concat(choice));
}
function myFamiliarWeight() {
  return (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.familiarWeight)((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myFamiliar)()) + (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.weightAdjustment)();
}
function ensureItem(quantity, it) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) < quantity) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.buy)(quantity - (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it), it);
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) < quantity) {
    throw "Could not buy ".concat(quantity, " of item ").concat(it.name, ": only ").concat((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it), ".");
  }
}
function ensureCreateItem(quantity, it) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) < quantity) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.create)(quantity - (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it), it);
  }

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) < quantity) {
    throw "Could not create item.";
  }
}
function ensureSewerItem(quantity, it) {
  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) < quantity) {
    ensureItem(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject || (_templateObject = _taggedTemplateLiteral(["chewing gum on a string"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["chewing gum on a string"]))));
  }
}
function ensureHermitItem(quantity, it) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) >= quantity) {
    return;
  }

  var count = quantity - (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it);

  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["worthless trinket"])))) + (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["worthless gewgaw"])))) + (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["worthless knick-knack"])))) < count) {
    ensureItem(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["chewing gum on a string"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["chewing gum on a string"]))));
  }

  ensureItem(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["hermit permit"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.retrieveItem)(count, it);
}
function ensureNpcEffect(ef, quantity, potion) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
    ensureItem(quantity, potion);

    if (!(0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)(ef["default"]) || (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
      throw "Failed to get effect ".concat(ef.name);
    }
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)("Already have effect ".concat(ef.name, "."));
  }
}
function ensurePotionEffect(ef, potion) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(potion) === 0) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.create)(1, potion);
    }

    if (!(0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)(ef["default"]) || (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
      throw 'Failed to get effect " + ef.name + ".';
    }
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)("Already have effect ".concat(ef.name, "."));
  }
}
function ensureEffect(ef) {
  var turns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) < turns) {
    if (!(0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)(ef["default"]) || (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
      throw 'Failed to get effect " + ef.name + ".';
    }
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)("Already have effect ".concat(ef.name, "."));
  }
}
function ensureMpTonic(mp) {
  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myMp)() < mp) {
    ensureItem(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["Doc Galaktik's Invigorating Tonic"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["Doc Galaktik's Invigorating Tonic"]))));
  }
}
function ensureMpSausage(mp) {
  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myMp)() < Math.min(mp, (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myMaxmp)())) {
    ensureCreateItem(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["magical sausage"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.eat)(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["magical sausage"]))));
  }
}
function sausageFightGuaranteed() {
  var goblinsFought = getPropertyInt("_sausageFights");
  var nextGuaranteed = getPropertyInt("_lastSausageMonsterTurn") + 4 + goblinsFought * 3 + Math.pow(Math.max(0, goblinsFought - 5), 3);
  return goblinsFought === 0 || (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.totalTurnsPlayed)() >= nextGuaranteed;
}
function itemPriority() {
  var _items$find;

  for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }

  return (_items$find = items.find(function (item) {
    return (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(item) > 0;
  })) !== null && _items$find !== void 0 ? _items$find : items[items.length - 1];
}
function setClan(target) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getClanName)() !== target) {
    var clanCache = JSON.parse((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getProperty)("hccs_clanCache") || "{}");

    if (clanCache.target === undefined) {
      var recruiter = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("clan_signup.php");
      var clanRe = /<option value=([0-9]+)>([^<]+)<\/option>/g;
      var match;

      while ((match = clanRe.exec(recruiter)) !== null) {
        clanCache[match[2]] = match[1];
      }
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.setProperty)("hccs_clanCache", JSON.stringify(clanCache));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("showclan.php?whichclan=".concat(clanCache[target], "&action=joinclan&confirm=on&pwd"));

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getClanName)() !== target) {
      throw "failed to switch clans to ".concat(target, ". Did you spell it correctly? Are you whitelisted?");
    }
  }

  return true;
}
function ensureDough(goal) {
  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["wad of dough"])))) < goal) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.buy)(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["all-purpose flower"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.use)(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["all-purpose flower"]))));
  }
}
function fuelAsdon(goal) {
  var startingFuel = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getFuel)();
  if (startingFuel > goal) return startingFuel;
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)("Fueling asdon. Currently ".concat(startingFuel, " litres."));
  var estimated = Math.floor((goal - startingFuel) / 5);
  var bread = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["loaf of soda bread"]))));
  ensureDough(estimated - bread);
  ensureItem(estimated - bread, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["soda water"]))));
  ensureCreateItem(estimated, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["loaf of soda bread"]))));
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)("asdonmartin fuel ".concat(estimated, " loaf of soda bread"));

  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getFuel)() < goal) {
    ensureDough(1);
    ensureItem(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["soda water"]))));
    ensureCreateItem(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$item)(_templateObject20 || (_templateObject20 = _taggedTemplateLiteral(["loaf of soda bread"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)("asdonmartin fuel 1 loaf of soda bread");
  }

  var endingFuel = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getFuel)();
  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)("Done fueling. Now ".concat(endingFuel, " litres."));
  return endingFuel;
}
function ensureAsdonEffect(ef) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
    fuelAsdon(37);
  }

  ensureEffect(ef);
}
function mapMonster(location, monster) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveSkill)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject21 || (_templateObject21 = _taggedTemplateLiteral(["Map the Monsters"])))) && !getPropertyBoolean("mappingMonsters") && getPropertyInt("_monstersMapped") < 3) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.useSkill)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject22 || (_templateObject22 = _taggedTemplateLiteral(["Map the Monsters"]))));
  }

  if (!getPropertyBoolean("mappingMonsters")) throw "Failed to setup Map the Monsters.";
  var mapPage = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.toUrl)(location), false, true);
  if (!mapPage.includes("Leading Yourself Right to Them")) throw "Something went wrong mapping.";
  var fightPage = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.visitUrl)("choice.php?pwd&whichchoice=1435&option=1&heyscriptswhatsupwinkwink=".concat(monster.id));
  if (!fightPage.includes("You're fighting") && (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.myLocation)() !== (0,libram__WEBPACK_IMPORTED_MODULE_1__.$location)(_templateObject23 || (_templateObject23 = _taggedTemplateLiteral(["the haiku dungeon"])))) throw "Something went wrong starting the fight.";
}
function tryUse(quantity, it) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) > 0) {
    return (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.use)(quantity, it);
  } else {
    return false;
  }
}
function tryEquip(it) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) > 0) {
    return (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.equip)(it);
  } else {
    return false;
  }
}
function wishEffect(ef) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)("genie effect ".concat(ef.name));
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)("Already have effect ".concat(ef.name, "."));
  }
}
function pullIfPossible(quantity, it, maxPrice) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.pullsRemaining)() > 0) {
    var quantityPull = Math.max(0, quantity - (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it));

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.shopAmount)(it) > 0) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.takeShop)(Math.min((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.shopAmount)(it), quantityPull), it);
    }

    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.storageAmount)(it) < quantityPull) {
      (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.buyUsingStorage)(quantityPull - (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.storageAmount)(it), it, maxPrice);
    }

    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)("pull ".concat(quantityPull, " ").concat(it.name));
    return true;
  } else return false;
}
function ensurePullEffect(ef, it) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
    if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.availableAmount)(it) > 0 || pullIfPossible(1, it, 50000)) ensureEffect(ef);
  }
}
function shrug(ef) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) > 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)("shrug ".concat(ef.name));
  }
} // We have Stevedave's, Ur-Kel's on at all times during leveling (managed via mood); third and fourth slots are variable.

var songSlots = [(0,libram__WEBPACK_IMPORTED_MODULE_1__.$effects)(_templateObject24 || (_templateObject24 = _taggedTemplateLiteral(["Stevedave's Shanty of Superiority"]))), (0,libram__WEBPACK_IMPORTED_MODULE_1__.$effects)(_templateObject25 || (_templateObject25 = _taggedTemplateLiteral(["Ur-Kel's Aria of Annoyance"]))), (0,libram__WEBPACK_IMPORTED_MODULE_1__.$effects)(_templateObject26 || (_templateObject26 = _taggedTemplateLiteral(["Power Ballad of the Arrowsmith, The Magical Mojomuscular Melody, The Moxious Madrigal, Ode to Booze, Jackasses' Symphony of Destruction"]))), (0,libram__WEBPACK_IMPORTED_MODULE_1__.$effects)(_templateObject27 || (_templateObject27 = _taggedTemplateLiteral(["Carlweather's Cantata of Confrontation, The Sonata of Sneakiness, Fat Leon's Phat Loot Lyric, Polka of Plenty"])))];

var allKnownSongs = (_ref = []).concat.apply(_ref, songSlots);

var allSongs = Skill.all().filter(function (skill) {
  return (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.toString)(skill["class"]) === "Accordion Thief" && skill.buff;
}).map(function (skill) {
  return (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.toEffect)(skill);
});
function openSongSlot(song) {
  var _iterator = _createForOfIteratorHelper(songSlots),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var songSlot = _step.value;

      if (songSlot.includes(song)) {
        var _iterator3 = _createForOfIteratorHelper(songSlot),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var shruggable = _step3.value;
            shrug(shruggable);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper(allSongs),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var badSong = _step2.value;

      if (!allKnownSongs.includes(badSong)) {
        shrug(badSong);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
function ensureSong(ef) {
  if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
    openSongSlot(ef);

    if (!(0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.cliExecute)(ef["default"]) || (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)(ef) === 0) {
      throw "Failed to get effect ".concat(ef.name);
    }
  } else {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.print)("Already have effect ".concat(ef.name, "."));
  }
}
function ensureOde(turns) {
  while ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.haveEffect)((0,libram__WEBPACK_IMPORTED_MODULE_1__.$effect)(_templateObject28 || (_templateObject28 = _taggedTemplateLiteral(["Ode to Booze"])))) < turns) {
    ensureMpTonic(50);
    openSongSlot((0,libram__WEBPACK_IMPORTED_MODULE_1__.$effect)(_templateObject29 || (_templateObject29 = _taggedTemplateLiteral(["Ode to Booze"]))));
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.useSkill)(1, (0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject30 || (_templateObject30 = _taggedTemplateLiteral(["The Ode to Booze"]))));
  }
}
function kill() {
  return libram__WEBPACK_IMPORTED_MODULE_2__.Macro.trySkill((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject31 || (_templateObject31 = _taggedTemplateLiteral(["Curse of Weaksauce"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject32 || (_templateObject32 = _taggedTemplateLiteral(["Micrometeorite"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject33 || (_templateObject33 = _taggedTemplateLiteral(["Sing Along"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject34 || (_templateObject34 = _taggedTemplateLiteral(["Stuffed Mortar Shell"])))).trySkill((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject35 || (_templateObject35 = _taggedTemplateLiteral(["Saucestorm"])))).trySkillRepeat((0,libram__WEBPACK_IMPORTED_MODULE_1__.$skill)(_templateObject36 || (_templateObject36 = _taggedTemplateLiteral(["Saucegeyser"])))).attack();
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
/******/ 	return __webpack_require__("./src/hccs.ts");
/******/ })()

));