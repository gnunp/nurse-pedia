/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./static/nursing_knowledges/js/home.js":
/*!**********************************************!*\
  !*** ./static/nursing_knowledges/js/home.js ***!
  \**********************************************/
/***/ (() => {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Home = /*#__PURE__*/function () {\n  function Home() {\n    _classCallCheck(this, Home);\n\n    this.stageHeight = window.innerHeight; // setting init wheel event\n\n    this.pagewrap = document.querySelector('.wrappage');\n    this.page = 0;\n    this.maxpage = 1;\n    this.ismove = true;\n    window.addEventListener('resize', this.resize.bind(this));\n    window.addEventListener('wheel', this.movePage.bind(this));\n  }\n\n  _createClass(Home, [{\n    key: \"movePage\",\n    value: function movePage(e) {\n      var _this = this;\n\n      if (this.ismove) {\n        this.ismove = false;\n        var wheelvalue = e.wheelDelta;\n\n        switch (wheelvalue) {\n          case -180:\n            if (this.page < this.maxpage) {\n              this.page++;\n            }\n\n            break;\n\n          case 180:\n            if (this.page > 0) {\n              this.page--;\n            }\n\n            break;\n        }\n\n        this.pagewrap.style.transform = \"translateY(\".concat(-this.stageHeight * this.page, \"px)\");\n        setTimeout(function () {\n          _this.ismove = true;\n        }, 500);\n      }\n    }\n  }, {\n    key: \"resize\",\n    value: function resize() {\n      var _this2 = this;\n\n      this.stageWidth = window.innerWidth;\n      this.stageHeight = window.innerHeight;\n      this.pages = document.querySelectorAll('.page');\n      this.pages.forEach(function (element) {\n        element.style.width = _this2.stageWidth;\n        element.style.height = _this2.stageHeight;\n      });\n    }\n  }]);\n\n  return Home;\n}();\n\nwindow.onload = function () {\n  new Home();\n};\n\n//# sourceURL=webpack://nurse-pedia/./static/nursing_knowledges/js/home.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./static/nursing_knowledges/js/home.js"]();
/******/ 	
/******/ })()
;