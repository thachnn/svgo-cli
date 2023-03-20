!function() {
  var __webpack_modules__ = {
    4815: function(module) {
      "use strict";
      module.exports = function(implementation) {
        !function(implementation) {
          if (!implementation) throw new TypeError("Expected implementation");
          var notImplemented = expectImplemented.filter((function(fname) {
            return "function" != typeof implementation[fname];
          }));
          if (notImplemented.length) {
            var notList = "(" + notImplemented.join(", ") + ")";
            throw new Error("Expected functions " + notList + " to be implemented");
          }
        }(implementation);
        var adapter = {}, baseAdapter = {
          removeSubsets: function(nodes) {
            return function(adapter, nodes) {
              var node, ancestor, replace, idx = nodes.length;
              for (;--idx > -1; ) {
                for (node = ancestor = nodes[idx], nodes[idx] = null, replace = !0; ancestor; ) {
                  if (nodes.indexOf(ancestor) > -1) {
                    replace = !1, nodes.splice(idx, 1);
                    break;
                  }
                  ancestor = adapter.getParent(ancestor);
                }
                replace && (nodes[idx] = node);
              }
              return nodes;
            }(adapter, nodes);
          },
          existsOne: function(test, elems) {
            return function(adapter, test, elems) {
              return elems.some((function(elem) {
                return !!adapter.isTag(elem) && (test(elem) || adapter.existsOne(test, adapter.getChildren(elem)));
              }));
            }(adapter, test, elems);
          },
          getSiblings: function(elem) {
            return function(adapter, elem) {
              var parent = adapter.getParent(elem);
              return parent && adapter.getChildren(parent);
            }(adapter, elem);
          },
          hasAttrib: function(elem, name) {
            return function(adapter, elem, name) {
              return void 0 !== adapter.getAttributeValue(elem, name);
            }(adapter, elem, name);
          },
          findOne: function(test, arr) {
            return function(adapter, test, arr) {
              for (var elem = null, i = 0, l = arr.length; i < l && !elem; i++) if (test(arr[i])) elem = arr[i]; else {
                var childs = adapter.getChildren(arr[i]);
                childs && childs.length > 0 && (elem = adapter.findOne(test, childs));
              }
              return elem;
            }(adapter, test, arr);
          },
          findAll: function(test, elems) {
            return function(adapter, test, elems) {
              for (var result = [], i = 0, j = elems.length; i < j; i++) if (adapter.isTag(elems[i])) {
                test(elems[i]) && result.push(elems[i]);
                var childs = adapter.getChildren(elems[i]);
                childs && (result = result.concat(adapter.findAll(test, childs)));
              }
              return result;
            }(adapter, test, elems);
          }
        };
        return Object.assign(adapter, baseAdapter, implementation), adapter;
      };
      var expectImplemented = [ "isTag", "getAttributeValue", "getChildren", "getName", "getParent", "getText" ];
    },
    5509: function(module) {
      module.exports = function(simpleSelector) {
        var A = 0, B = 0, C = 0;
        return simpleSelector.children.each((function walk(node) {
          switch (node.type) {
           case "SelectorList":
           case "Selector":
            node.children.each(walk);
            break;

           case "IdSelector":
            A++;
            break;

           case "ClassSelector":
           case "AttributeSelector":
            B++;
            break;

           case "PseudoClassSelector":
            switch (node.name.toLowerCase()) {
             case "not":
              node.children.each(walk);
              break;

             case "before":
             case "after":
             case "first-line":
             case "first-letter":
              C++;
              break;

             default:
              B++;
            }
            break;

           case "PseudoElementSelector":
            C++;
            break;

           case "TypeSelector":
            "*" !== node.name.charAt(node.name.length - 1) && C++;
          }
        })), [ A, B, C ];
      };
    },
    5235: function(module) {
      module.exports = function() {
        "use strict";
        var stable = function(arr, comp) {
          return exec(arr.slice(), comp);
        };
        function exec(arr, comp) {
          "function" != typeof comp && (comp = function(a, b) {
            return String(a).localeCompare(b);
          });
          var len = arr.length;
          if (len <= 1) return arr;
          for (var buffer = new Array(len), chk = 1; chk < len; chk *= 2) {
            pass(arr, comp, chk, buffer);
            var tmp = arr;
            arr = buffer, buffer = tmp;
          }
          return arr;
        }
        stable.inplace = function(arr, comp) {
          var result = exec(arr, comp);
          return result !== arr && pass(result, null, arr.length, arr), arr;
        };
        var pass = function(arr, comp, chk, result) {
          var l, r, e, li, ri, len = arr.length, i = 0, dbl = 2 * chk;
          for (l = 0; l < len; l += dbl) for (e = (r = l + chk) + chk, r > len && (r = len), 
          e > len && (e = len), li = l, ri = r; ;) if (li < r && ri < e) comp(arr[li], arr[ri]) <= 0 ? result[i++] = arr[li++] : result[i++] = arr[ri++]; else if (li < r) result[i++] = arr[li++]; else {
            if (!(ri < e)) break;
            result[i++] = arr[ri++];
          }
        };
        return stable;
      }();
    },
    9479: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      var csstree = __webpack_require__(904), List = csstree.List, stable = __webpack_require__(5235), specificity = __webpack_require__(5509);
      function compareSpecificity(aSpecificity, bSpecificity) {
        for (var i = 0; i < 4; i += 1) {
          if (aSpecificity[i] < bSpecificity[i]) return -1;
          if (aSpecificity[i] > bSpecificity[i]) return 1;
        }
        return 0;
      }
      function compareSimpleSelectorNode(aSimpleSelectorNode, bSimpleSelectorNode) {
        return compareSpecificity(specificity(aSimpleSelectorNode), specificity(bSimpleSelectorNode));
      }
      function _bySelectorSpecificity(selectorA, selectorB) {
        return compareSimpleSelectorNode(selectorA.item.data, selectorB.item.data);
      }
      module.exports.flattenToSelectors = function(cssAst) {
        var selectors = [];
        return csstree.walk(cssAst, {
          visit: "Rule",
          enter: function(node) {
            if ("Rule" === node.type) {
              var atrule = this.atrule, rule = node;
              node.prelude.children.each((function(selectorNode, selectorItem) {
                var selector = {
                  item: selectorItem,
                  atrule: atrule,
                  rule: rule,
                  pseudos: []
                };
                selectorNode.children.each((function(selectorChildNode, selectorChildItem, selectorChildList) {
                  "PseudoClassSelector" !== selectorChildNode.type && "PseudoElementSelector" !== selectorChildNode.type || selector.pseudos.push({
                    item: selectorChildItem,
                    list: selectorChildList
                  });
                })), selectors.push(selector);
              }));
            }
          }
        }), selectors;
      }, module.exports.filterByMqs = function(selectors, useMqs) {
        return selectors.filter((function(selector) {
          if (null === selector.atrule) return ~useMqs.indexOf("");
          var mqName = selector.atrule.name, mqStr = mqName;
          selector.atrule.expression && "MediaQueryList" === selector.atrule.expression.children.first().type && (mqStr = [ mqName, csstree.generate(selector.atrule.expression) ].join(" "));
          return ~useMqs.indexOf(mqStr);
        }));
      }, module.exports.filterByPseudos = function(selectors, usePseudos) {
        return selectors.filter((function(selector) {
          var pseudoSelectorsStr = csstree.generate({
            type: "Selector",
            children: (new List).fromArray(selector.pseudos.map((function(pseudo) {
              return pseudo.item.data;
            })))
          });
          return ~usePseudos.indexOf(pseudoSelectorsStr);
        }));
      }, module.exports.cleanPseudos = function(selectors) {
        selectors.forEach((function(selector) {
          selector.pseudos.forEach((function(pseudo) {
            pseudo.list.remove(pseudo.item);
          }));
        }));
      }, module.exports.compareSpecificity = compareSpecificity, module.exports.compareSimpleSelectorNode = compareSimpleSelectorNode, 
      module.exports.sortSelectors = function(selectors) {
        return stable(selectors, _bySelectorSpecificity);
      }, module.exports.csstreeToStyleDeclaration = function(declaration) {
        return {
          name: declaration.property,
          value: csstree.generate(declaration.value),
          priority: declaration.important ? "important" : ""
        };
      }, module.exports.getCssStr = function(elem) {
        return elem.content[0].text || elem.content[0].cdata || [];
      }, module.exports.setCssStr = function(elem, css) {
        return elem.content[0].cdata ? (elem.content[0].cdata = css, elem.content[0].cdata) : (elem.content[0].text = css, 
        elem.content[0].text);
      };
    },
    7984: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      var svgoCssSelectAdapter = __webpack_require__(4815)({
        isTag: function(node) {
          return node.isElem();
        },
        getParent: function(node) {
          return node.parentNode || null;
        },
        getChildren: function(node) {
          return node.content || [];
        },
        getName: function(elemAst) {
          return elemAst.elem;
        },
        getText: function(node) {
          return node.content[0].text || node.content[0].cdata || "";
        },
        getAttributeValue: function(elem, name) {
          return elem.hasAttr(name) ? elem.attr(name).value : null;
        }
      });
      module.exports = svgoCssSelectAdapter;
    },
    5773: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      var cssSelect = __webpack_require__(5853), cssSelectOpts = {
        xmlMode: !0,
        adapter: __webpack_require__(7984)
      }, JSAPI = module.exports = function(data, parentNode) {
        Object.assign(this, data), parentNode && Object.defineProperty(this, "parentNode", {
          writable: !0,
          value: parentNode
        });
      };
      JSAPI.prototype.clone = function() {
        var node = this, nodeData = {};
        Object.keys(node).forEach((function(key) {
          "class" !== key && "style" !== key && "content" !== key && (nodeData[key] = node[key]);
        })), nodeData = JSON.parse(JSON.stringify(nodeData));
        var clonedNode = new JSAPI(nodeData, !!node.parentNode);
        return node.class && (clonedNode.class = node.class.clone(clonedNode)), node.style && (clonedNode.style = node.style.clone(clonedNode)), 
        node.content && (clonedNode.content = node.content.map((function(childNode) {
          var clonedChild = childNode.clone();
          return clonedChild.parentNode = clonedNode, clonedChild;
        }))), clonedNode;
      }, JSAPI.prototype.isElem = function(param) {
        return param ? Array.isArray(param) ? !!this.elem && param.indexOf(this.elem) > -1 : !!this.elem && this.elem === param : !!this.elem;
      }, JSAPI.prototype.renameElem = function(name) {
        return name && "string" == typeof name && (this.elem = this.local = name), this;
      }, JSAPI.prototype.isEmpty = function() {
        return !this.content || !this.content.length;
      }, JSAPI.prototype.closestElem = function(elemName) {
        for (var elem = this; (elem = elem.parentNode) && !elem.isElem(elemName); ) ;
        return elem;
      }, JSAPI.prototype.spliceContent = function(start, n, insertion) {
        return arguments.length < 2 ? [] : (Array.isArray(insertion) || (insertion = Array.apply(null, arguments).slice(2)), 
        insertion.forEach((function(inner) {
          inner.parentNode = this;
        }), this), this.content.splice.apply(this.content, [ start, n ].concat(insertion)));
      }, JSAPI.prototype.hasAttr = function(name, val) {
        return !(!this.attrs || !Object.keys(this.attrs).length) && (arguments.length ? void 0 !== val ? !!this.attrs[name] && this.attrs[name].value === val.toString() : !!this.attrs[name] : !!this.attrs);
      }, JSAPI.prototype.hasAttrLocal = function(localName, val) {
        if (!this.attrs || !Object.keys(this.attrs).length) return !1;
        if (!arguments.length) return !!this.attrs;
        var callback;
        switch (null != val && val.constructor && val.constructor.name) {
         case "Number":
         case "String":
          callback = stringValueTest;
          break;

         case "RegExp":
          callback = regexpValueTest;
          break;

         case "Function":
          callback = funcValueTest;
          break;

         default:
          callback = nameTest;
        }
        return this.someAttr(callback);
        function nameTest(attr) {
          return attr.local === localName;
        }
        function stringValueTest(attr) {
          return attr.local === localName && val == attr.value;
        }
        function regexpValueTest(attr) {
          return attr.local === localName && val.test(attr.value);
        }
        function funcValueTest(attr) {
          return attr.local === localName && val(attr.value);
        }
      }, JSAPI.prototype.attr = function(name, val) {
        if (this.hasAttr() && arguments.length) return void 0 !== val ? this.hasAttr(name, val) ? this.attrs[name] : void 0 : this.attrs[name];
      }, JSAPI.prototype.computedAttr = function(name, val) {
        if (arguments.length) {
          for (var elem = this; elem && (!elem.hasAttr(name) || !elem.attr(name).value); elem = elem.parentNode) ;
          return null != val ? !!elem && elem.hasAttr(name, val) : elem && elem.hasAttr(name) ? elem.attrs[name].value : void 0;
        }
      }, JSAPI.prototype.removeAttr = function(name, val, recursive) {
        return !!arguments.length && (Array.isArray(name) ? (name.forEach(this.removeAttr, this), 
        !1) : !!this.hasAttr(name) && (!(!recursive && val && this.attrs[name].value !== val) && (delete this.attrs[name], 
        Object.keys(this.attrs).length || delete this.attrs, !0)));
      }, JSAPI.prototype.addAttr = function(attr) {
        return void 0 !== (attr = attr || {}).name && void 0 !== attr.prefix && void 0 !== attr.local && (this.attrs = this.attrs || {}, 
        this.attrs[attr.name] = attr, "class" === attr.name && this.class.hasClass(), "style" === attr.name && this.style.hasStyle(), 
        this.attrs[attr.name]);
      }, JSAPI.prototype.eachAttr = function(callback, context) {
        if (!this.hasAttr()) return !1;
        for (var name in this.attrs) callback.call(context, this.attrs[name]);
        return !0;
      }, JSAPI.prototype.someAttr = function(callback, context) {
        if (!this.hasAttr()) return !1;
        for (var name in this.attrs) if (callback.call(context, this.attrs[name])) return !0;
        return !1;
      }, JSAPI.prototype.querySelectorAll = function(selectors) {
        var matchedEls = cssSelect(selectors, this, cssSelectOpts);
        return matchedEls.length > 0 ? matchedEls : null;
      }, JSAPI.prototype.querySelector = function(selectors) {
        return cssSelect.selectOne(selectors, this, cssSelectOpts);
      }, JSAPI.prototype.matches = function(selector) {
        return cssSelect.is(this, selector, cssSelectOpts);
      };
    },
    8665: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      var FS = __webpack_require__(7147);
      exports.Kr = function(data, params, command) {
        var delimiter, prev, str = "";
        return data.forEach((function(item, i) {
          if (delimiter = " ", 0 == i && (delimiter = ""), params.noSpaceAfterFlags && ("A" == command || "a" == command)) {
            var pos = i % 7;
            4 != pos && 5 != pos || (delimiter = "");
          }
          params.leadingZero && (item = removeLeadingZero(item)), params.negativeExtraSpace && "" != delimiter && (item < 0 || 46 == String(item).charCodeAt(0) && prev % 1 != 0) && (delimiter = ""), 
          prev = item, str += delimiter + item;
        })), str;
      };
      var removeLeadingZero = exports.RM = function(num) {
        var strNum = num.toString();
        return 0 < num && num < 1 && 48 == strNum.charCodeAt(0) ? strNum = strNum.slice(1) : -1 < num && num < 0 && 48 == strNum.charCodeAt(1) && (strNum = strNum.charAt(0) + strNum.slice(2)), 
        strNum;
      };
    },
    3193: function(__unused_webpack_module, exports) {
      "use strict";
      exports.elemsGroups = {
        animation: [ "animate", "animateColor", "animateMotion", "animateTransform", "set" ],
        descriptive: [ "desc", "metadata", "title" ],
        shape: [ "circle", "ellipse", "line", "path", "polygon", "polyline", "rect" ],
        structural: [ "defs", "g", "svg", "symbol", "use" ],
        paintServer: [ "solidColor", "linearGradient", "radialGradient", "meshGradient", "pattern", "hatch" ],
        nonRendering: [ "linearGradient", "radialGradient", "pattern", "clipPath", "mask", "marker", "symbol", "filter", "solidColor" ],
        container: [ "a", "defs", "g", "marker", "mask", "missing-glyph", "pattern", "svg", "switch", "symbol", "foreignObject" ],
        textContent: [ "altGlyph", "altGlyphDef", "altGlyphItem", "glyph", "glyphRef", "textPath", "text", "tref", "tspan" ],
        textContentChild: [ "altGlyph", "textPath", "tref", "tspan" ],
        lightSource: [ "feDiffuseLighting", "feSpecularLighting", "feDistantLight", "fePointLight", "feSpotLight" ],
        filterPrimitive: [ "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feFlood", "feGaussianBlur", "feImage", "feMerge", "feMorphology", "feOffset", "feSpecularLighting", "feTile", "feTurbulence" ]
      }, exports.pathElems = [ "path", "glyph", "missing-glyph" ], exports.attrsGroups = {
        animationAddition: [ "additive", "accumulate" ],
        animationAttributeTarget: [ "attributeType", "attributeName" ],
        animationEvent: [ "onbegin", "onend", "onrepeat", "onload" ],
        animationTiming: [ "begin", "dur", "end", "min", "max", "restart", "repeatCount", "repeatDur", "fill" ],
        animationValue: [ "calcMode", "values", "keyTimes", "keySplines", "from", "to", "by" ],
        conditionalProcessing: [ "requiredFeatures", "requiredExtensions", "systemLanguage" ],
        core: [ "id", "tabindex", "xml:base", "xml:lang", "xml:space" ],
        graphicalEvent: [ "onfocusin", "onfocusout", "onactivate", "onclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove", "onmouseout", "onload" ],
        presentation: [ "alignment-baseline", "baseline-shift", "clip", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cursor", "direction", "display", "dominant-baseline", "enable-background", "fill", "fill-opacity", "fill-rule", "filter", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "glyph-orientation-horizontal", "glyph-orientation-vertical", "image-rendering", "letter-spacing", "lighting-color", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "overflow", "paint-order", "pointer-events", "shape-rendering", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-anchor", "text-decoration", "text-overflow", "text-rendering", "transform", "unicode-bidi", "vector-effect", "visibility", "word-spacing", "writing-mode" ],
        xlink: [ "xlink:href", "xlink:show", "xlink:actuate", "xlink:type", "xlink:role", "xlink:arcrole", "xlink:title" ],
        documentEvent: [ "onunload", "onabort", "onerror", "onresize", "onscroll", "onzoom" ],
        filterPrimitive: [ "x", "y", "width", "height", "result" ],
        transferFunction: [ "type", "tableValues", "slope", "intercept", "amplitude", "exponent", "offset" ]
      }, exports.attrsGroupsDefaults = {
        core: {
          "xml:space": "preserve"
        },
        filterPrimitive: {
          x: "0",
          y: "0",
          width: "100%",
          height: "100%"
        },
        presentation: {
          clip: "auto",
          "clip-path": "none",
          "clip-rule": "nonzero",
          mask: "none",
          opacity: "1",
          "stop-color": "#000",
          "stop-opacity": "1",
          "fill-opacity": "1",
          "fill-rule": "nonzero",
          fill: "#000",
          stroke: "none",
          "stroke-width": "1",
          "stroke-linecap": "butt",
          "stroke-linejoin": "miter",
          "stroke-miterlimit": "4",
          "stroke-dasharray": "none",
          "stroke-dashoffset": "0",
          "stroke-opacity": "1",
          "paint-order": "normal",
          "vector-effect": "none",
          display: "inline",
          visibility: "visible",
          "marker-start": "none",
          "marker-mid": "none",
          "marker-end": "none",
          "color-interpolation": "sRGB",
          "color-interpolation-filters": "linearRGB",
          "color-rendering": "auto",
          "shape-rendering": "auto",
          "text-rendering": "auto",
          "image-rendering": "auto",
          "font-style": "normal",
          "font-variant": "normal",
          "font-weight": "normal",
          "font-stretch": "normal",
          "font-size": "medium",
          "font-size-adjust": "none",
          kerning: "auto",
          "letter-spacing": "normal",
          "word-spacing": "normal",
          "text-decoration": "none",
          "text-anchor": "start",
          "text-overflow": "clip",
          "writing-mode": "lr-tb",
          "glyph-orientation-vertical": "auto",
          "glyph-orientation-horizontal": "0deg",
          direction: "ltr",
          "unicode-bidi": "normal",
          "dominant-baseline": "auto",
          "alignment-baseline": "baseline",
          "baseline-shift": "baseline"
        },
        transferFunction: {
          slope: "1",
          intercept: "0",
          amplitude: "1",
          exponent: "1",
          offset: "0"
        }
      }, exports.elems = {
        a: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "target" ],
          defaults: {
            target: "_self"
          },
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        altGlyph: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "x", "y", "dx", "dy", "glyphRef", "format", "rotate" ]
        },
        altGlyphDef: {
          attrsGroups: [ "core" ],
          content: [ "glyphRef" ]
        },
        altGlyphItem: {
          attrsGroups: [ "core" ],
          content: [ "glyphRef", "altGlyphItem" ]
        },
        animate: {
          attrsGroups: [ "conditionalProcessing", "core", "animationAddition", "animationAttributeTarget", "animationEvent", "animationTiming", "animationValue", "presentation", "xlink" ],
          attrs: [ "externalResourcesRequired" ],
          contentGroups: [ "descriptive" ]
        },
        animateColor: {
          attrsGroups: [ "conditionalProcessing", "core", "animationEvent", "xlink", "animationAttributeTarget", "animationTiming", "animationValue", "animationAddition", "presentation" ],
          attrs: [ "externalResourcesRequired" ],
          contentGroups: [ "descriptive" ]
        },
        animateMotion: {
          attrsGroups: [ "conditionalProcessing", "core", "animationEvent", "xlink", "animationTiming", "animationValue", "animationAddition" ],
          attrs: [ "externalResourcesRequired", "path", "keyPoints", "rotate", "origin" ],
          defaults: {
            rotate: "0"
          },
          contentGroups: [ "descriptive" ],
          content: [ "mpath" ]
        },
        animateTransform: {
          attrsGroups: [ "conditionalProcessing", "core", "animationEvent", "xlink", "animationAttributeTarget", "animationTiming", "animationValue", "animationAddition" ],
          attrs: [ "externalResourcesRequired", "type" ],
          contentGroups: [ "descriptive" ]
        },
        circle: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "cx", "cy", "r" ],
          defaults: {
            cx: "0",
            cy: "0"
          },
          contentGroups: [ "animation", "descriptive" ]
        },
        clipPath: {
          attrsGroups: [ "conditionalProcessing", "core", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "clipPathUnits" ],
          defaults: {
            clipPathUnits: "userSpaceOnUse"
          },
          contentGroups: [ "animation", "descriptive", "shape" ],
          content: [ "text", "use" ]
        },
        "color-profile": {
          attrsGroups: [ "core", "xlink" ],
          attrs: [ "local", "name", "rendering-intent" ],
          defaults: {
            name: "sRGB",
            "rendering-intent": "auto"
          },
          contentGroups: [ "descriptive" ]
        },
        cursor: {
          attrsGroups: [ "core", "conditionalProcessing", "xlink" ],
          attrs: [ "externalResourcesRequired", "x", "y" ],
          defaults: {
            x: "0",
            y: "0"
          },
          contentGroups: [ "descriptive" ]
        },
        defs: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform" ],
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        desc: {
          attrsGroups: [ "core" ],
          attrs: [ "class", "style" ]
        },
        ellipse: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "cx", "cy", "rx", "ry" ],
          defaults: {
            cx: "0",
            cy: "0"
          },
          contentGroups: [ "animation", "descriptive" ]
        },
        feBlend: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "in2", "mode" ],
          defaults: {
            mode: "normal"
          },
          content: [ "animate", "set" ]
        },
        feColorMatrix: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "type", "values" ],
          defaults: {
            type: "matrix"
          },
          content: [ "animate", "set" ]
        },
        feComponentTransfer: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in" ],
          content: [ "feFuncA", "feFuncB", "feFuncG", "feFuncR" ]
        },
        feComposite: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "in2", "operator", "k1", "k2", "k3", "k4" ],
          defaults: {
            operator: "over",
            k1: "0",
            k2: "0",
            k3: "0",
            k4: "0"
          },
          content: [ "animate", "set" ]
        },
        feConvolveMatrix: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "order", "kernelMatrix", "divisor", "bias", "targetX", "targetY", "edgeMode", "kernelUnitLength", "preserveAlpha" ],
          defaults: {
            order: "3",
            bias: "0",
            edgeMode: "duplicate",
            preserveAlpha: "false"
          },
          content: [ "animate", "set" ]
        },
        feDiffuseLighting: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "surfaceScale", "diffuseConstant", "kernelUnitLength" ],
          defaults: {
            surfaceScale: "1",
            diffuseConstant: "1"
          },
          contentGroups: [ "descriptive" ],
          content: [ "feDistantLight", "fePointLight", "feSpotLight" ]
        },
        feDisplacementMap: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "in2", "scale", "xChannelSelector", "yChannelSelector" ],
          defaults: {
            scale: "0",
            xChannelSelector: "A",
            yChannelSelector: "A"
          },
          content: [ "animate", "set" ]
        },
        feDistantLight: {
          attrsGroups: [ "core" ],
          attrs: [ "azimuth", "elevation" ],
          defaults: {
            azimuth: "0",
            elevation: "0"
          },
          content: [ "animate", "set" ]
        },
        feFlood: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style" ],
          content: [ "animate", "animateColor", "set" ]
        },
        feFuncA: {
          attrsGroups: [ "core", "transferFunction" ],
          content: [ "set", "animate" ]
        },
        feFuncB: {
          attrsGroups: [ "core", "transferFunction" ],
          content: [ "set", "animate" ]
        },
        feFuncG: {
          attrsGroups: [ "core", "transferFunction" ],
          content: [ "set", "animate" ]
        },
        feFuncR: {
          attrsGroups: [ "core", "transferFunction" ],
          content: [ "set", "animate" ]
        },
        feGaussianBlur: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "stdDeviation" ],
          defaults: {
            stdDeviation: "0"
          },
          content: [ "set", "animate" ]
        },
        feImage: {
          attrsGroups: [ "core", "presentation", "filterPrimitive", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "preserveAspectRatio", "href", "xlink:href" ],
          defaults: {
            preserveAspectRatio: "xMidYMid meet"
          },
          content: [ "animate", "animateTransform", "set" ]
        },
        feMerge: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style" ],
          content: [ "feMergeNode" ]
        },
        feMergeNode: {
          attrsGroups: [ "core" ],
          attrs: [ "in" ],
          content: [ "animate", "set" ]
        },
        feMorphology: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "operator", "radius" ],
          defaults: {
            operator: "erode",
            radius: "0"
          },
          content: [ "animate", "set" ]
        },
        feOffset: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "dx", "dy" ],
          defaults: {
            dx: "0",
            dy: "0"
          },
          content: [ "animate", "set" ]
        },
        fePointLight: {
          attrsGroups: [ "core" ],
          attrs: [ "x", "y", "z" ],
          defaults: {
            x: "0",
            y: "0",
            z: "0"
          },
          content: [ "animate", "set" ]
        },
        feSpecularLighting: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in", "surfaceScale", "specularConstant", "specularExponent", "kernelUnitLength" ],
          defaults: {
            surfaceScale: "1",
            specularConstant: "1",
            specularExponent: "1"
          },
          contentGroups: [ "descriptive", "lightSource" ]
        },
        feSpotLight: {
          attrsGroups: [ "core" ],
          attrs: [ "x", "y", "z", "pointsAtX", "pointsAtY", "pointsAtZ", "specularExponent", "limitingConeAngle" ],
          defaults: {
            x: "0",
            y: "0",
            z: "0",
            pointsAtX: "0",
            pointsAtY: "0",
            pointsAtZ: "0",
            specularExponent: "1"
          },
          content: [ "animate", "set" ]
        },
        feTile: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "in" ],
          content: [ "animate", "set" ]
        },
        feTurbulence: {
          attrsGroups: [ "core", "presentation", "filterPrimitive" ],
          attrs: [ "class", "style", "baseFrequency", "numOctaves", "seed", "stitchTiles", "type" ],
          defaults: {
            baseFrequency: "0",
            numOctaves: "1",
            seed: "0",
            stitchTiles: "noStitch",
            type: "turbulence"
          },
          content: [ "animate", "set" ]
        },
        filter: {
          attrsGroups: [ "core", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "x", "y", "width", "height", "filterRes", "filterUnits", "primitiveUnits", "href", "xlink:href" ],
          defaults: {
            primitiveUnits: "userSpaceOnUse",
            x: "-10%",
            y: "-10%",
            width: "120%",
            height: "120%"
          },
          contentGroups: [ "descriptive", "filterPrimitive" ],
          content: [ "animate", "set" ]
        },
        font: {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "horiz-origin-x", "horiz-origin-y", "horiz-adv-x", "vert-origin-x", "vert-origin-y", "vert-adv-y" ],
          defaults: {
            "horiz-origin-x": "0",
            "horiz-origin-y": "0"
          },
          contentGroups: [ "descriptive" ],
          content: [ "font-face", "glyph", "hkern", "missing-glyph", "vkern" ]
        },
        "font-face": {
          attrsGroups: [ "core" ],
          attrs: [ "font-family", "font-style", "font-variant", "font-weight", "font-stretch", "font-size", "unicode-range", "units-per-em", "panose-1", "stemv", "stemh", "slope", "cap-height", "x-height", "accent-height", "ascent", "descent", "widths", "bbox", "ideographic", "alphabetic", "mathematical", "hanging", "v-ideographic", "v-alphabetic", "v-mathematical", "v-hanging", "underline-position", "underline-thickness", "strikethrough-position", "strikethrough-thickness", "overline-position", "overline-thickness" ],
          defaults: {
            "font-style": "all",
            "font-variant": "normal",
            "font-weight": "all",
            "font-stretch": "normal",
            "unicode-range": "U+0-10FFFF",
            "units-per-em": "1000",
            "panose-1": "0 0 0 0 0 0 0 0 0 0",
            slope: "0"
          },
          contentGroups: [ "descriptive" ],
          content: [ "font-face-src" ]
        },
        "font-face-format": {
          attrsGroups: [ "core" ],
          attrs: [ "string" ]
        },
        "font-face-name": {
          attrsGroups: [ "core" ],
          attrs: [ "name" ]
        },
        "font-face-src": {
          attrsGroups: [ "core" ],
          content: [ "font-face-name", "font-face-uri" ]
        },
        "font-face-uri": {
          attrsGroups: [ "core", "xlink" ],
          attrs: [ "href", "xlink:href" ],
          content: [ "font-face-format" ]
        },
        foreignObject: {
          attrsGroups: [ "core", "conditionalProcessing", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "x", "y", "width", "height" ],
          defaults: {
            x: 0,
            y: 0
          }
        },
        g: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform" ],
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        glyph: {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style", "d", "horiz-adv-x", "vert-origin-x", "vert-origin-y", "vert-adv-y", "unicode", "glyph-name", "orientation", "arabic-form", "lang" ],
          defaults: {
            "arabic-form": "initial"
          },
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        glyphRef: {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style", "d", "horiz-adv-x", "vert-origin-x", "vert-origin-y", "vert-adv-y" ],
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        hatch: {
          attrsGroups: [ "core", "presentation", "xlink" ],
          attrs: [ "class", "style", "x", "y", "pitch", "rotate", "hatchUnits", "hatchContentUnits", "transform" ],
          defaults: {
            hatchUnits: "objectBoundingBox",
            hatchContentUnits: "userSpaceOnUse",
            x: "0",
            y: "0",
            pitch: "0",
            rotate: "0"
          },
          contentGroups: [ "animation", "descriptive" ],
          content: [ "hatchPath" ]
        },
        hatchPath: {
          attrsGroups: [ "core", "presentation", "xlink" ],
          attrs: [ "class", "style", "d", "offset" ],
          defaults: {
            offset: "0"
          },
          contentGroups: [ "animation", "descriptive" ]
        },
        hkern: {
          attrsGroups: [ "core" ],
          attrs: [ "u1", "g1", "u2", "g2", "k" ]
        },
        image: {
          attrsGroups: [ "core", "conditionalProcessing", "graphicalEvent", "xlink", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "preserveAspectRatio", "transform", "x", "y", "width", "height", "href", "xlink:href" ],
          defaults: {
            x: "0",
            y: "0",
            preserveAspectRatio: "xMidYMid meet"
          },
          contentGroups: [ "animation", "descriptive" ]
        },
        line: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "x1", "y1", "x2", "y2" ],
          defaults: {
            x1: "0",
            y1: "0",
            x2: "0",
            y2: "0"
          },
          contentGroups: [ "animation", "descriptive" ]
        },
        linearGradient: {
          attrsGroups: [ "core", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "x1", "y1", "x2", "y2", "gradientUnits", "gradientTransform", "spreadMethod", "href", "xlink:href" ],
          defaults: {
            x1: "0",
            y1: "0",
            x2: "100%",
            y2: "0",
            spreadMethod: "pad"
          },
          contentGroups: [ "descriptive" ],
          content: [ "animate", "animateTransform", "set", "stop" ]
        },
        marker: {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "viewBox", "preserveAspectRatio", "refX", "refY", "markerUnits", "markerWidth", "markerHeight", "orient" ],
          defaults: {
            markerUnits: "strokeWidth",
            refX: "0",
            refY: "0",
            markerWidth: "3",
            markerHeight: "3"
          },
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        mask: {
          attrsGroups: [ "conditionalProcessing", "core", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "x", "y", "width", "height", "maskUnits", "maskContentUnits" ],
          defaults: {
            maskUnits: "objectBoundingBox",
            maskContentUnits: "userSpaceOnUse",
            x: "-10%",
            y: "-10%",
            width: "120%",
            height: "120%"
          },
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        metadata: {
          attrsGroups: [ "core" ]
        },
        "missing-glyph": {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style", "d", "horiz-adv-x", "vert-origin-x", "vert-origin-y", "vert-adv-y" ],
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        mpath: {
          attrsGroups: [ "core", "xlink" ],
          attrs: [ "externalResourcesRequired", "href", "xlink:href" ],
          contentGroups: [ "descriptive" ]
        },
        path: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "d", "pathLength" ],
          contentGroups: [ "animation", "descriptive" ]
        },
        pattern: {
          attrsGroups: [ "conditionalProcessing", "core", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "viewBox", "preserveAspectRatio", "x", "y", "width", "height", "patternUnits", "patternContentUnits", "patternTransform", "href", "xlink:href" ],
          defaults: {
            patternUnits: "objectBoundingBox",
            patternContentUnits: "userSpaceOnUse",
            x: "0",
            y: "0",
            width: "0",
            height: "0",
            preserveAspectRatio: "xMidYMid meet"
          },
          contentGroups: [ "animation", "descriptive", "paintServer", "shape", "structural" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        polygon: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "points" ],
          contentGroups: [ "animation", "descriptive" ]
        },
        polyline: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "points" ],
          contentGroups: [ "animation", "descriptive" ]
        },
        radialGradient: {
          attrsGroups: [ "core", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "cx", "cy", "r", "fx", "fy", "fr", "gradientUnits", "gradientTransform", "spreadMethod", "href", "xlink:href" ],
          defaults: {
            gradientUnits: "objectBoundingBox",
            cx: "50%",
            cy: "50%",
            r: "50%"
          },
          contentGroups: [ "descriptive" ],
          content: [ "animate", "animateTransform", "set", "stop" ]
        },
        meshGradient: {
          attrsGroups: [ "core", "presentation", "xlink" ],
          attrs: [ "class", "style", "x", "y", "gradientUnits", "transform" ],
          contentGroups: [ "descriptive", "paintServer", "animation" ],
          content: [ "meshRow" ]
        },
        meshRow: {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style" ],
          contentGroups: [ "descriptive" ],
          content: [ "meshPatch" ]
        },
        meshPatch: {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style" ],
          contentGroups: [ "descriptive" ],
          content: [ "stop" ]
        },
        rect: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "x", "y", "width", "height", "rx", "ry" ],
          defaults: {
            x: "0",
            y: "0"
          },
          contentGroups: [ "animation", "descriptive" ]
        },
        script: {
          attrsGroups: [ "core", "xlink" ],
          attrs: [ "externalResourcesRequired", "type", "href", "xlink:href" ]
        },
        set: {
          attrsGroups: [ "conditionalProcessing", "core", "animation", "xlink", "animationAttributeTarget", "animationTiming" ],
          attrs: [ "externalResourcesRequired", "to" ],
          contentGroups: [ "descriptive" ]
        },
        solidColor: {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style" ],
          contentGroups: [ "paintServer" ]
        },
        stop: {
          attrsGroups: [ "core", "presentation" ],
          attrs: [ "class", "style", "offset", "path" ],
          content: [ "animate", "animateColor", "set" ]
        },
        style: {
          attrsGroups: [ "core" ],
          attrs: [ "type", "media", "title" ],
          defaults: {
            type: "text/css"
          }
        },
        svg: {
          attrsGroups: [ "conditionalProcessing", "core", "documentEvent", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "x", "y", "width", "height", "viewBox", "preserveAspectRatio", "zoomAndPan", "version", "baseProfile", "contentScriptType", "contentStyleType" ],
          defaults: {
            x: "0",
            y: "0",
            width: "100%",
            height: "100%",
            preserveAspectRatio: "xMidYMid meet",
            zoomAndPan: "magnify",
            version: "1.1",
            baseProfile: "none",
            contentScriptType: "application/ecmascript",
            contentStyleType: "text/css"
          },
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        switch: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform" ],
          contentGroups: [ "animation", "descriptive", "shape" ],
          content: [ "a", "foreignObject", "g", "image", "svg", "switch", "text", "use" ]
        },
        symbol: {
          attrsGroups: [ "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "preserveAspectRatio", "viewBox", "refX", "refY" ],
          defaults: {
            refX: 0,
            refY: 0
          },
          contentGroups: [ "animation", "descriptive", "shape", "structural", "paintServer" ],
          content: [ "a", "altGlyphDef", "clipPath", "color-profile", "cursor", "filter", "font", "font-face", "foreignObject", "image", "marker", "mask", "pattern", "script", "style", "switch", "text", "view" ]
        },
        text: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "lengthAdjust", "x", "y", "dx", "dy", "rotate", "textLength" ],
          defaults: {
            x: "0",
            y: "0",
            lengthAdjust: "spacing"
          },
          contentGroups: [ "animation", "descriptive", "textContentChild" ],
          content: [ "a" ]
        },
        textPath: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "href", "xlink:href", "startOffset", "method", "spacing", "d" ],
          defaults: {
            startOffset: "0",
            method: "align",
            spacing: "exact"
          },
          contentGroups: [ "descriptive" ],
          content: [ "a", "altGlyph", "animate", "animateColor", "set", "tref", "tspan" ]
        },
        title: {
          attrsGroups: [ "core" ],
          attrs: [ "class", "style" ]
        },
        tref: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "href", "xlink:href" ],
          contentGroups: [ "descriptive" ],
          content: [ "animate", "animateColor", "set" ]
        },
        tspan: {
          attrsGroups: [ "conditionalProcessing", "core", "graphicalEvent", "presentation" ],
          attrs: [ "class", "style", "externalResourcesRequired", "x", "y", "dx", "dy", "rotate", "textLength", "lengthAdjust" ],
          contentGroups: [ "descriptive" ],
          content: [ "a", "altGlyph", "animate", "animateColor", "set", "tref", "tspan" ]
        },
        use: {
          attrsGroups: [ "core", "conditionalProcessing", "graphicalEvent", "presentation", "xlink" ],
          attrs: [ "class", "style", "externalResourcesRequired", "transform", "x", "y", "width", "height", "href", "xlink:href" ],
          defaults: {
            x: "0",
            y: "0"
          },
          contentGroups: [ "animation", "descriptive" ]
        },
        view: {
          attrsGroups: [ "core" ],
          attrs: [ "externalResourcesRequired", "viewBox", "preserveAspectRatio", "zoomAndPan", "viewTarget" ],
          contentGroups: [ "descriptive" ]
        },
        vkern: {
          attrsGroups: [ "core" ],
          attrs: [ "u1", "g1", "u2", "g2", "k" ]
        }
      }, exports.editorNamespaces = [ "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd", "http://inkscape.sourceforge.net/DTD/sodipodi-0.dtd", "http://www.inkscape.org/namespaces/inkscape", "http://www.bohemiancoding.com/sketch/ns", "http://ns.adobe.com/AdobeIllustrator/10.0/", "http://ns.adobe.com/Graphs/1.0/", "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/", "http://ns.adobe.com/Variables/1.0/", "http://ns.adobe.com/SaveForWeb/1.0/", "http://ns.adobe.com/Extensibility/1.0/", "http://ns.adobe.com/Flows/1.0/", "http://ns.adobe.com/ImageReplacement/1.0/", "http://ns.adobe.com/GenericCustomNamespace/1.0/", "http://ns.adobe.com/XPath/1.0/", "http://schemas.microsoft.com/visio/2003/SVGExtensions/", "http://taptrix.com/vectorillustrator/svg_extensions", "http://www.figma.com/figma/ns", "http://purl.org/dc/elements/1.1/", "http://creativecommons.org/ns#", "http://www.w3.org/1999/02/22-rdf-syntax-ns#", "http://www.serif.com/", "http://www.vector.evaxdesign.sk" ], 
      exports.referencesProps = [ "clip-path", "color-profile", "fill", "filter", "marker-start", "marker-mid", "marker-end", "mask", "stroke", "style" ], 
      exports.inheritableAttrs = [ "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cursor", "direction", "dominant-baseline", "fill", "fill-opacity", "fill-rule", "font", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "glyph-orientation-horizontal", "glyph-orientation-vertical", "image-rendering", "letter-spacing", "marker", "marker-end", "marker-mid", "marker-start", "paint-order", "pointer-events", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-anchor", "text-rendering", "transform", "visibility", "word-spacing", "writing-mode" ], 
      exports.presentationNonInheritableGroupAttrs = [ "display", "clip-path", "filter", "mask", "opacity", "text-decoration", "transform", "unicode-bidi", "visibility" ], 
      exports.colorsNames = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#0ff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000",
        blanchedalmond: "#ffebcd",
        blue: "#00f",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#0ff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkgrey: "#a9a9a9",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkslategrey: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#f0f",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#789",
        lightslategrey: "#789",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#0f0",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#f0f",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        rebeccapurple: "#639",
        red: "#f00",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#fff",
        whitesmoke: "#f5f5f5",
        yellow: "#ff0",
        yellowgreen: "#9acd32"
      }, exports.colorsShortNames = {
        "#f0ffff": "azure",
        "#f5f5dc": "beige",
        "#ffe4c4": "bisque",
        "#a52a2a": "brown",
        "#ff7f50": "coral",
        "#ffd700": "gold",
        "#808080": "gray",
        "#008000": "green",
        "#4b0082": "indigo",
        "#fffff0": "ivory",
        "#f0e68c": "khaki",
        "#faf0e6": "linen",
        "#800000": "maroon",
        "#000080": "navy",
        "#808000": "olive",
        "#ffa500": "orange",
        "#da70d6": "orchid",
        "#cd853f": "peru",
        "#ffc0cb": "pink",
        "#dda0dd": "plum",
        "#800080": "purple",
        "#f00": "red",
        "#ff0000": "red",
        "#fa8072": "salmon",
        "#a0522d": "sienna",
        "#c0c0c0": "silver",
        "#fffafa": "snow",
        "#d2b48c": "tan",
        "#008080": "teal",
        "#ff6347": "tomato",
        "#ee82ee": "violet",
        "#f5deb3": "wheat"
      }, exports.colorsProps = [ "color", "fill", "stroke", "stop-color", "flood-color", "lighting-color" ];
    },
    7050: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      var prevCtrlPoint, rNumber = String.raw`[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?\s*`, rCommaWsp = String.raw`(?:\s,?\s*|,\s*)`, rNumberCommaWsp = `(${rNumber})` + rCommaWsp, rFlagCommaWsp = `([01])${rCommaWsp}?`, rCoordinatePair = String.raw`(${rNumber})${rCommaWsp}?(${rNumber})`, rArcSeq = (rNumberCommaWsp + "?").repeat(2) + rNumberCommaWsp + rFlagCommaWsp.repeat(2) + rCoordinatePair, regPathInstructions = /([MmLlHhVvCcSsQqTtAaZz])\s*/, regCoordinateSequence = new RegExp(rNumber, "g"), regArcArgumentSequence = new RegExp(rArcSeq, "g"), regNumericValues = /[-+]?(\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/, transform2js = __webpack_require__(4408).transform2js, transformsMultiply = __webpack_require__(4408).transformsMultiply, transformArc = __webpack_require__(4408).transformArc, collections = __webpack_require__(3193), referencesProps = collections.referencesProps, defaultStrokeWidth = collections.attrsGroupsDefaults.presentation["stroke-width"], cleanupOutData = __webpack_require__(8665).Kr, removeLeadingZero = __webpack_require__(8665).RM;
      exports.path2js = function(path) {
        if (path.pathJS) return path.pathJS;
        var instruction, paramsLength = {
          H: 1,
          V: 1,
          M: 2,
          L: 2,
          T: 2,
          Q: 4,
          S: 4,
          C: 6,
          A: 7,
          h: 1,
          v: 1,
          m: 2,
          l: 2,
          t: 2,
          q: 4,
          s: 4,
          c: 6,
          a: 7
        }, pathData = [], startMoveto = !1;
        return path.attr("d").value.split(regPathInstructions).forEach((function(data) {
          if (data) {
            if (!startMoveto) {
              if ("M" != data && "m" != data) return;
              startMoveto = !0;
            }
            if (regPathInstructions.test(data)) "Z" != (instruction = data) && "z" != instruction || pathData.push({
              instruction: "z"
            }); else {
              if ("A" == instruction || "a" == instruction) {
                for (var args, newData = []; args = regArcArgumentSequence.exec(data); ) for (var i = 1; i < args.length; i++) newData.push(args[i]);
                data = newData;
              } else data = data.match(regCoordinateSequence);
              if (!data) return;
              data = data.map(Number), "M" != instruction && "m" != instruction || (pathData.push({
                instruction: 0 == pathData.length ? "M" : instruction,
                data: data.splice(0, 2)
              }), instruction = "M" == instruction ? "L" : "l");
              for (var pair = paramsLength[instruction]; data.length; ) pathData.push({
                instruction: instruction,
                data: data.splice(0, pair)
              });
            }
          }
        })), pathData.length && "m" == pathData[0].instruction && (pathData[0].instruction = "M"), 
        path.pathJS = pathData, pathData;
      };
      var relative2absolute = exports.relative2absolute = function(data) {
        var i, currentPoint = [ 0, 0 ], subpathPoint = [ 0, 0 ];
        return data.map((function(item) {
          var instruction = item.instruction, itemData = item.data && item.data.slice();
          if ("M" == instruction) set(currentPoint, itemData), set(subpathPoint, itemData); else if ("mlcsqt".indexOf(instruction) > -1) {
            for (i = 0; i < itemData.length; i++) itemData[i] += currentPoint[i % 2];
            set(currentPoint, itemData), "m" == instruction && set(subpathPoint, itemData);
          } else "a" == instruction ? (itemData[5] += currentPoint[0], itemData[6] += currentPoint[1], 
          set(currentPoint, itemData)) : "h" == instruction ? (itemData[0] += currentPoint[0], 
          currentPoint[0] = itemData[0]) : "v" == instruction ? (itemData[0] += currentPoint[1], 
          currentPoint[1] = itemData[0]) : "MZLCSQTA".indexOf(instruction) > -1 ? set(currentPoint, itemData) : "H" == instruction ? currentPoint[0] = itemData[0] : "V" == instruction ? currentPoint[1] = itemData[0] : "z" == instruction && set(currentPoint, subpathPoint);
          return "z" == instruction ? {
            instruction: "z"
          } : {
            instruction: instruction.toUpperCase(),
            data: itemData
          };
        }));
      };
      function transformPoint(matrix, x, y) {
        return [ matrix[0] * x + matrix[2] * y + matrix[4], matrix[1] * x + matrix[3] * y + matrix[5] ];
      }
      function computeCubicBaseValue(t, a, b, c, d) {
        var mt = 1 - t;
        return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
      }
      function computeCubicFirstDerivativeRoots(a, b, c, d) {
        var result = [ -1, -1 ], tl = 2 * b - a - c, tr = -Math.sqrt(-a * (c - d) + b * b - b * (c + d) + c * c), dn = 3 * b - a - 3 * c + d;
        return 0 !== dn && (result[0] = (tl + tr) / dn, result[1] = (tl - tr) / dn), result;
      }
      function computeQuadraticBaseValue(t, a, b, c) {
        var mt = 1 - t;
        return mt * mt * a + 2 * mt * t * b + t * t * c;
      }
      function computeQuadraticFirstDerivativeRoot(a, b, c) {
        var t = -1, denominator = a - 2 * b + c;
        return 0 !== denominator && (t = (a - b) / denominator), t;
      }
      function set(dest, source) {
        return dest[0] = source[source.length - 2], dest[1] = source[source.length - 1], 
        dest;
      }
      function processSimplex(simplex, direction) {
        if (2 == simplex.length) {
          var a = simplex[1], b = simplex[0];
          dot(AO = minus(simplex[1]), AB = sub(b, a)) > 0 ? set(direction, orth(AB, a)) : (set(direction, AO), 
          simplex.shift());
        } else {
          a = simplex[2], b = simplex[1];
          var c = simplex[0], AB = sub(b, a), AC = sub(c, a), AO = minus(a), ACB = orth(AB, AC), ABC = orth(AC, AB);
          if (dot(ACB, AO) > 0) dot(AB, AO) > 0 ? (set(direction, ACB), simplex.shift()) : (set(direction, AO), 
          simplex.splice(0, 2)); else {
            if (!(dot(ABC, AO) > 0)) return !0;
            dot(AC, AO) > 0 ? (set(direction, ABC), simplex.splice(1, 1)) : (set(direction, AO), 
            simplex.splice(0, 2));
          }
        }
        return !1;
      }
      function minus(v) {
        return [ -v[0], -v[1] ];
      }
      function sub(v1, v2) {
        return [ v1[0] - v2[0], v1[1] - v2[1] ];
      }
      function dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
      }
      function orth(v, from) {
        var o = [ -v[1], v[0] ];
        return dot(o, minus(from)) < 0 ? minus(o) : o;
      }
      function gatherPoints(points, item, index, path) {
        var subPath = points.length && points[points.length - 1], prev = index && path[index - 1], basePoint = subPath.length && subPath[subPath.length - 1], data = item.data, ctrlPoint = basePoint;
        switch (item.instruction) {
         case "M":
          points.push(subPath = []);
          break;

         case "H":
          addPoint(subPath, [ data[0], basePoint[1] ]);
          break;

         case "V":
          addPoint(subPath, [ basePoint[0], data[0] ]);
          break;

         case "Q":
          addPoint(subPath, data.slice(0, 2)), prevCtrlPoint = [ data[2] - data[0], data[3] - data[1] ];
          break;

         case "T":
          "Q" != prev.instruction && "T" != prev.instruction || (addPoint(subPath, ctrlPoint = [ basePoint[0] + prevCtrlPoint[0], basePoint[1] + prevCtrlPoint[1] ]), 
          prevCtrlPoint = [ data[0] - ctrlPoint[0], data[1] - ctrlPoint[1] ]);
          break;

         case "C":
          addPoint(subPath, [ .5 * (basePoint[0] + data[0]), .5 * (basePoint[1] + data[1]) ]), 
          addPoint(subPath, [ .5 * (data[0] + data[2]), .5 * (data[1] + data[3]) ]), addPoint(subPath, [ .5 * (data[2] + data[4]), .5 * (data[3] + data[5]) ]), 
          prevCtrlPoint = [ data[4] - data[2], data[5] - data[3] ];
          break;

         case "S":
          "C" != prev.instruction && "S" != prev.instruction || (addPoint(subPath, [ basePoint[0] + .5 * prevCtrlPoint[0], basePoint[1] + .5 * prevCtrlPoint[1] ]), 
          ctrlPoint = [ basePoint[0] + prevCtrlPoint[0], basePoint[1] + prevCtrlPoint[1] ]), 
          addPoint(subPath, [ .5 * (ctrlPoint[0] + data[0]), .5 * (ctrlPoint[1] + data[1]) ]), 
          addPoint(subPath, [ .5 * (data[0] + data[2]), .5 * (data[1] + data[3]) ]), prevCtrlPoint = [ data[2] - data[0], data[3] - data[1] ];
          break;

         case "A":
          for (var cData, curves = a2c.apply(0, basePoint.concat(data)); (cData = curves.splice(0, 6).map(toAbsolute)).length; ) addPoint(subPath, [ .5 * (basePoint[0] + cData[0]), .5 * (basePoint[1] + cData[1]) ]), 
          addPoint(subPath, [ .5 * (cData[0] + cData[2]), .5 * (cData[1] + cData[3]) ]), addPoint(subPath, [ .5 * (cData[2] + cData[4]), .5 * (cData[3] + cData[5]) ]), 
          curves.length && addPoint(subPath, basePoint = cData.slice(-2));
        }
        return data && data.length >= 2 && addPoint(subPath, data.slice(-2)), points;
        function toAbsolute(n, i) {
          return n + basePoint[i % 2];
        }
        function addPoint(path, point) {
          (!path.length || point[1] > path[path.maxY][1]) && (path.maxY = path.length, points.maxY = points.length ? Math.max(point[1], points.maxY) : point[1]), 
          (!path.length || point[0] > path[path.maxX][0]) && (path.maxX = path.length, points.maxX = points.length ? Math.max(point[0], points.maxX) : point[0]), 
          (!path.length || point[1] < path[path.minY][1]) && (path.minY = path.length, points.minY = points.length ? Math.min(point[1], points.minY) : point[1]), 
          (!path.length || point[0] < path[path.minX][0]) && (path.minX = path.length, points.minX = points.length ? Math.min(point[0], points.minX) : point[0]), 
          path.push(point);
        }
      }
      function convexHull(points) {
        points.sort((function(a, b) {
          return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
        }));
        for (var lower = [], minY = 0, bottom = 0, i = 0; i < points.length; i++) {
          for (;lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0; ) lower.pop();
          points[i][1] < points[minY][1] && (minY = i, bottom = lower.length), lower.push(points[i]);
        }
        var upper = [], maxY = points.length - 1, top = 0;
        for (i = points.length; i--; ) {
          for (;upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0; ) upper.pop();
          points[i][1] > points[maxY][1] && (maxY = i, top = upper.length), upper.push(points[i]);
        }
        upper.pop(), lower.pop();
        var hull = lower.concat(upper);
        return hull.minX = 0, hull.maxX = lower.length, hull.minY = bottom, hull.maxY = (lower.length + top) % hull.length, 
        hull;
      }
      function cross(o, a, b) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      }
      function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
        var _120 = 120 * Math.PI / 180, rad = Math.PI / 180 * (+angle || 0), res = [], rotateX = function(x, y, rad) {
          return x * Math.cos(rad) - y * Math.sin(rad);
        }, rotateY = function(x, y, rad) {
          return x * Math.sin(rad) + y * Math.cos(rad);
        };
        if (recursive) f1 = recursive[0], f2 = recursive[1], cx = recursive[2], cy = recursive[3]; else {
          y1 = rotateY(x1 = rotateX(x1, y1, -rad), y1, -rad);
          var x = (x1 - (x2 = rotateX(x2, y2, -rad))) / 2, y = (y1 - (y2 = rotateY(x2, y2, -rad))) / 2, h = x * x / (rx * rx) + y * y / (ry * ry);
          h > 1 && (rx *= h = Math.sqrt(h), ry *= h);
          var rx2 = rx * rx, ry2 = ry * ry, k = (large_arc_flag == sweep_flag ? -1 : 1) * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))), cx = k * rx * y / ry + (x1 + x2) / 2, cy = k * -ry * x / rx + (y1 + y2) / 2, f1 = Math.asin(((y1 - cy) / ry).toFixed(9)), f2 = Math.asin(((y2 - cy) / ry).toFixed(9));
          f1 = x1 < cx ? Math.PI - f1 : f1, f2 = x2 < cx ? Math.PI - f2 : f2, f1 < 0 && (f1 = 2 * Math.PI + f1), 
          f2 < 0 && (f2 = 2 * Math.PI + f2), sweep_flag && f1 > f2 && (f1 -= 2 * Math.PI), 
          !sweep_flag && f2 > f1 && (f2 -= 2 * Math.PI);
        }
        var df = f2 - f1;
        if (Math.abs(df) > _120) {
          var f2old = f2, x2old = x2, y2old = y2;
          f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1), res = a2c(x2 = cx + rx * Math.cos(f2), y2 = cy + ry * Math.sin(f2), rx, ry, angle, 0, sweep_flag, x2old, y2old, [ f2, f2old, cx, cy ]);
        }
        df = f2 - f1;
        var c1 = Math.cos(f1), s1 = Math.sin(f1), c2 = Math.cos(f2), s2 = Math.sin(f2), t = Math.tan(df / 4), hx = 4 / 3 * rx * t, hy = 4 / 3 * ry * t, m = [ -hx * s1, hy * c1, x2 + hx * s2 - x1, y2 - hy * c2 - y1, x2 - x1, y2 - y1 ];
        if (recursive) return m.concat(res);
        for (var newres = [], i = 0, n = (res = m.concat(res)).length; i < n; i++) newres[i] = i % 2 ? rotateY(res[i - 1], res[i], rad) : rotateX(res[i], res[i + 1], rad);
        return newres;
      }
      exports.applyTransforms = function(elem, path, params) {
        if (!elem.hasAttr("transform") || !elem.attr("transform").value || elem.someAttr((function(attr) {
          return ~referencesProps.indexOf(attr.name) && ~attr.value.indexOf("url(");
        }))) return path;
        var newPoint, scale, matrix = transformsMultiply(transform2js(elem.attr("transform").value)), stroke = elem.computedAttr("stroke"), id = elem.computedAttr("id"), transformPrecision = params.transformPrecision;
        if (stroke && "none" != stroke) {
          if (!params.applyTransformsStroked || (matrix.data[0] != matrix.data[3] || matrix.data[1] != -matrix.data[2]) && (matrix.data[0] != -matrix.data[3] || matrix.data[1] != matrix.data[2])) return path;
          if (id) {
            var idElem = elem, hasStrokeWidth = !1;
            do {
              idElem.hasAttr("stroke-width") && (hasStrokeWidth = !0);
            } while (!idElem.hasAttr("id", id) && !hasStrokeWidth && (idElem = idElem.parentNode));
            if (!hasStrokeWidth) return path;
          }
          if (1 !== (scale = +Math.sqrt(matrix.data[0] * matrix.data[0] + matrix.data[1] * matrix.data[1]).toFixed(transformPrecision))) {
            var strokeWidth = elem.computedAttr("stroke-width") || defaultStrokeWidth;
            elem.hasAttr("vector-effect") && "non-scaling-stroke" === elem.attr("vector-effect").value || (elem.hasAttr("stroke-width") ? elem.attrs["stroke-width"].value = elem.attrs["stroke-width"].value.trim().replace(regNumericValues, (function(num) {
              return removeLeadingZero(num * scale);
            })) : elem.addAttr({
              name: "stroke-width",
              prefix: "",
              local: "stroke-width",
              value: strokeWidth.replace(regNumericValues, (function(num) {
                return removeLeadingZero(num * scale);
              }))
            }));
          }
        } else if (id) return path;
        return path.forEach((function(pathItem) {
          if (pathItem.data) if ("h" === pathItem.instruction ? (pathItem.instruction = "l", 
          pathItem.data[1] = 0) : "v" === pathItem.instruction && (pathItem.instruction = "l", 
          pathItem.data[1] = pathItem.data[0], pathItem.data[0] = 0), "M" !== pathItem.instruction || 0 === matrix.data[4] && 0 === matrix.data[5]) {
            if ("a" == pathItem.instruction) {
              if (transformArc(pathItem.data, matrix.data), Math.abs(pathItem.data[2]) > 80) {
                var a = pathItem.data[0], rotation = pathItem.data[2];
                pathItem.data[0] = pathItem.data[1], pathItem.data[1] = a, pathItem.data[2] = rotation + (rotation > 0 ? -90 : 90);
              }
              newPoint = transformPoint(matrix.data, pathItem.data[5], pathItem.data[6]), pathItem.data[5] = newPoint[0], 
              pathItem.data[6] = newPoint[1];
            } else for (var i = 0; i < pathItem.data.length; i += 2) newPoint = transformPoint(matrix.data, pathItem.data[i], pathItem.data[i + 1]), 
            pathItem.data[i] = newPoint[0], pathItem.data[i + 1] = newPoint[1];
            pathItem.coords[0] = pathItem.base[0] + pathItem.data[pathItem.data.length - 2], 
            pathItem.coords[1] = pathItem.base[1] + pathItem.data[pathItem.data.length - 1];
          } else newPoint = transformPoint(matrix.data, pathItem.data[0], pathItem.data[1]), 
          set(pathItem.data, newPoint), set(pathItem.coords, newPoint), matrix.data[4] = 0, 
          matrix.data[5] = 0;
        })), elem.removeAttr("transform"), path;
      }, exports.computeCubicBoundingBox = function(xa, ya, xb, yb, xc, yc, xd, yd) {
        var ts, t, x, y, i, minx = Number.POSITIVE_INFINITY, miny = Number.POSITIVE_INFINITY, maxx = Number.NEGATIVE_INFINITY, maxy = Number.NEGATIVE_INFINITY;
        for (xa < minx && (minx = xa), xa > maxx && (maxx = xa), xd < minx && (minx = xd), 
        xd > maxx && (maxx = xd), ts = computeCubicFirstDerivativeRoots(xa, xb, xc, xd), 
        i = 0; i < ts.length; i++) (t = ts[i]) >= 0 && t <= 1 && ((x = computeCubicBaseValue(t, xa, xb, xc, xd)) < minx && (minx = x), 
        x > maxx && (maxx = x));
        for (ya < miny && (miny = ya), ya > maxy && (maxy = ya), yd < miny && (miny = yd), 
        yd > maxy && (maxy = yd), ts = computeCubicFirstDerivativeRoots(ya, yb, yc, yd), 
        i = 0; i < ts.length; i++) (t = ts[i]) >= 0 && t <= 1 && ((y = computeCubicBaseValue(t, ya, yb, yc, yd)) < miny && (miny = y), 
        y > maxy && (maxy = y));
        return {
          minx: minx,
          miny: miny,
          maxx: maxx,
          maxy: maxy
        };
      }, exports.computeQuadraticBoundingBox = function(xa, ya, xb, yb, xc, yc) {
        var t, x, y, minx = Number.POSITIVE_INFINITY, miny = Number.POSITIVE_INFINITY, maxx = Number.NEGATIVE_INFINITY, maxy = Number.NEGATIVE_INFINITY;
        return xa < minx && (minx = xa), xa > maxx && (maxx = xa), xc < minx && (minx = xc), 
        xc > maxx && (maxx = xc), (t = computeQuadraticFirstDerivativeRoot(xa, xb, xc)) >= 0 && t <= 1 && ((x = computeQuadraticBaseValue(t, xa, xb, xc)) < minx && (minx = x), 
        x > maxx && (maxx = x)), ya < miny && (miny = ya), ya > maxy && (maxy = ya), yc < miny && (miny = yc), 
        yc > maxy && (maxy = yc), (t = computeQuadraticFirstDerivativeRoot(ya, yb, yc)) >= 0 && t <= 1 && ((y = computeQuadraticBaseValue(t, ya, yb, yc)) < miny && (miny = y), 
        y > maxy && (maxy = y)), {
          minx: minx,
          miny: miny,
          maxx: maxx,
          maxy: maxy
        };
      }, exports.js2path = function(path, data, params) {
        path.pathJS = data, params.collapseRepeated && (data = function(data) {
          var prev, prevIndex;
          return data = data.reduce((function(newPath, item) {
            return prev && item.data && item.instruction == prev.instruction ? "M" != item.instruction ? prev = newPath[prevIndex] = {
              instruction: prev.instruction,
              data: prev.data.concat(item.data),
              coords: item.coords,
              base: prev.base
            } : (prev.data = item.data, prev.coords = item.coords) : (newPath.push(item), prev = item, 
            prevIndex = newPath.length - 1), newPath;
          }), []);
        }(data)), path.attr("d").value = data.reduce((function(pathString, item) {
          var strData = "";
          return item.data && (strData = cleanupOutData(item.data, params, item.instruction)), 
          pathString + (item.instruction + strData);
        }), "");
      }, exports.intersects = function(path1, path2) {
        if (path1.length < 3 || path2.length < 3) return !1;
        var points1 = relative2absolute(path1).reduce(gatherPoints, []), points2 = relative2absolute(path2).reduce(gatherPoints, []);
        if (points1.maxX <= points2.minX || points2.maxX <= points1.minX || points1.maxY <= points2.minY || points2.maxY <= points1.minY || points1.every((function(set1) {
          return points2.every((function(set2) {
            return set1[set1.maxX][0] <= set2[set2.minX][0] || set2[set2.maxX][0] <= set1[set1.minX][0] || set1[set1.maxY][1] <= set2[set2.minY][1] || set2[set2.maxY][1] <= set1[set1.minY][1];
          }));
        }))) return !1;
        var hullNest1 = points1.map(convexHull), hullNest2 = points2.map(convexHull);
        return hullNest1.some((function(hull1) {
          return !(hull1.length < 3) && hullNest2.some((function(hull2) {
            if (hull2.length < 3) return !1;
            for (var simplex = [ getSupport(hull1, hull2, [ 1, 0 ]) ], direction = minus(simplex[0]), iterations = 1e4; ;) {
              if (0 == iterations--) return console.error("Error: infinite loop while processing mergePaths plugin."), 
              !0;
              if (simplex.push(getSupport(hull1, hull2, direction)), dot(direction, simplex[simplex.length - 1]) <= 0) return !1;
              if (processSimplex(simplex, direction)) return !0;
            }
          }));
        }));
        function getSupport(a, b, direction) {
          return sub(supportPoint(a, direction), supportPoint(b, minus(direction)));
        }
        function supportPoint(polygon, direction) {
          for (var value, index = direction[1] >= 0 ? direction[0] < 0 ? polygon.maxY : polygon.maxX : direction[0] < 0 ? polygon.minX : polygon.minY, max = -1 / 0; (value = dot(polygon[index], direction)) > max; ) max = value, 
          index = ++index % polygon.length;
          return polygon[(index || polygon.length) - 1];
        }
      };
    },
    4408: function(__unused_webpack_module, exports) {
      "use strict";
      var regTransformTypes = /matrix|translate|scale|rotate|skewX|skewY/, regTransformSplit = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/, regNumericValues = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
      exports.transform2js = function(transformString) {
        var current, transforms = [];
        return transformString.split(regTransformSplit).forEach((function(item) {
          var num;
          if (item) if (regTransformTypes.test(item)) transforms.push(current = {
            name: item
          }); else for (;num = regNumericValues.exec(item); ) num = Number(num), current.data ? current.data.push(num) : current.data = [ num ];
        })), current && current.data ? transforms : [];
      }, exports.transformsMultiply = function(transforms) {
        return transforms = {
          name: "matrix",
          data: (transforms = transforms.map((function(transform) {
            return "matrix" === transform.name ? transform.data : function(transform) {
              if ("matrix" === transform.name) return transform.data;
              var matrix;
              switch (transform.name) {
               case "translate":
                matrix = [ 1, 0, 0, 1, transform.data[0], transform.data[1] || 0 ];
                break;

               case "scale":
                matrix = [ transform.data[0], 0, 0, transform.data[1] || transform.data[0], 0, 0 ];
                break;

               case "rotate":
                var cos = mth.cos(transform.data[0]), sin = mth.sin(transform.data[0]), cx = transform.data[1] || 0, cy = transform.data[2] || 0;
                matrix = [ cos, sin, -sin, cos, (1 - cos) * cx + sin * cy, (1 - cos) * cy - sin * cx ];
                break;

               case "skewX":
                matrix = [ 1, 0, mth.tan(transform.data[0]), 1, 0, 0 ];
                break;

               case "skewY":
                matrix = [ 1, mth.tan(transform.data[0]), 0, 1, 0, 0 ];
              }
              return matrix;
            }(transform);
          }))).length > 0 ? transforms.reduce(multiplyTransformMatrices) : []
        };
      };
      var mth = exports.mth = {
        rad: function(deg) {
          return deg * Math.PI / 180;
        },
        deg: function(rad) {
          return 180 * rad / Math.PI;
        },
        cos: function(deg) {
          return Math.cos(this.rad(deg));
        },
        acos: function(val, floatPrecision) {
          return +this.deg(Math.acos(val)).toFixed(floatPrecision);
        },
        sin: function(deg) {
          return Math.sin(this.rad(deg));
        },
        asin: function(val, floatPrecision) {
          return +this.deg(Math.asin(val)).toFixed(floatPrecision);
        },
        tan: function(deg) {
          return Math.tan(this.rad(deg));
        },
        atan: function(val, floatPrecision) {
          return +this.deg(Math.atan(val)).toFixed(floatPrecision);
        }
      };
      function multiplyTransformMatrices(a, b) {
        return [ a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5] ];
      }
      exports.matrixToTransform = function(transform, params) {
        var floatPrecision = params.floatPrecision, data = transform.data, transforms = [], sx = +Math.hypot(data[0], data[1]).toFixed(params.transformPrecision), sy = +((data[0] * data[3] - data[1] * data[2]) / sx).toFixed(params.transformPrecision), colsSum = data[0] * data[2] + data[1] * data[3], rowsSum = data[0] * data[1] + data[2] * data[3], scaleBefore = 0 != rowsSum || sx == sy;
        if ((data[4] || data[5]) && transforms.push({
          name: "translate",
          data: data.slice(4, data[5] ? 6 : 5)
        }), !data[1] && data[2]) transforms.push({
          name: "skewX",
          data: [ mth.atan(data[2] / sy, floatPrecision) ]
        }); else if (data[1] && !data[2]) transforms.push({
          name: "skewY",
          data: [ mth.atan(data[1] / data[0], floatPrecision) ]
        }), sx = data[0], sy = data[3]; else if (!colsSum || 1 == sx && 1 == sy || !scaleBefore) {
          scaleBefore || (sx = (data[0] < 0 ? -1 : 1) * Math.hypot(data[0], data[2]), sy = (data[3] < 0 ? -1 : 1) * Math.hypot(data[1], data[3]), 
          transforms.push({
            name: "scale",
            data: [ sx, sy ]
          }));
          var angle = Math.min(Math.max(-1, data[0] / sx), 1), rotate = [ mth.acos(angle, floatPrecision) * ((scaleBefore ? 1 : sy) * data[1] < 0 ? -1 : 1) ];
          if (rotate[0] && transforms.push({
            name: "rotate",
            data: rotate
          }), rowsSum && colsSum && transforms.push({
            name: "skewX",
            data: [ mth.atan(colsSum / (sx * sx), floatPrecision) ]
          }), rotate[0] && (data[4] || data[5])) {
            transforms.shift();
            var cos = data[0] / sx, sin = data[1] / (scaleBefore ? sx : sy), x = data[4] * (scaleBefore || sy), y = data[5] * (scaleBefore || sx), denom = (Math.pow(1 - cos, 2) + Math.pow(sin, 2)) * (scaleBefore || sx * sy);
            rotate.push(((1 - cos) * x - sin * y) / denom), rotate.push(((1 - cos) * y + sin * x) / denom);
          }
        } else if (data[1] || data[2]) return transform;
        return (!scaleBefore || 1 == sx && 1 == sy) && transforms.length || transforms.push({
          name: "scale",
          data: sx == sy ? [ sx ] : [ sx, sy ]
        }), transforms;
      }, exports.transformArc = function(arc, transform) {
        var a = arc[0], b = arc[1], rot = arc[2] * Math.PI / 180, cos = Math.cos(rot), sin = Math.sin(rot), h = Math.pow(arc[5] * cos + arc[6] * sin, 2) / (4 * a * a) + Math.pow(arc[6] * cos - arc[5] * sin, 2) / (4 * b * b);
        h > 1 && (a *= h = Math.sqrt(h), b *= h);
        var m = multiplyTransformMatrices(transform, [ a * cos, a * sin, -b * sin, b * cos, 0, 0 ]), lastCol = m[2] * m[2] + m[3] * m[3], squareSum = m[0] * m[0] + m[1] * m[1] + lastCol, root = Math.hypot(m[0] - m[3], m[1] + m[2]) * Math.hypot(m[0] + m[3], m[1] - m[2]);
        if (root) {
          var majorAxisSqr = (squareSum + root) / 2, minorAxisSqr = (squareSum - root) / 2, major = Math.abs(majorAxisSqr - lastCol) > 1e-6, sub = (major ? majorAxisSqr : minorAxisSqr) - lastCol, rowsSum = m[0] * m[2] + m[1] * m[3], term1 = m[0] * sub + m[2] * rowsSum, term2 = m[1] * sub + m[3] * rowsSum;
          arc[0] = Math.sqrt(majorAxisSqr), arc[1] = Math.sqrt(minorAxisSqr), arc[2] = ((major ? term2 < 0 : term1 > 0) ? -1 : 1) * Math.acos((major ? term1 : term2) / Math.hypot(term1, term2)) * 180 / Math.PI;
        } else arc[0] = arc[1] = Math.sqrt(squareSum / 2), arc[2] = 0;
        return transform[0] < 0 != transform[3] < 0 && (arc[4] = 1 - arc[4]), arc;
      };
    },
    4530: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "full", exports.active = !1, exports.description = "adds attributes to an outer <svg> element";
      exports.fn = function(data, params) {
        if (!params || !Array.isArray(params.attributes) && !params.attribute) return console.error('Error in plugin "addAttributesToSVGElement": absent parameters.\nIt should have a list of "attributes" or one "attribute".\nConfig example:\n\nplugins:\n- addAttributesToSVGElement:\n    attribute: "mySvg"\n\nplugins:\n- addAttributesToSVGElement:\n    attributes: ["mySvg", "size-big"]\n\nplugins:\n- addAttributesToSVGElement:\n    attributes:\n        - focusable: false\n        - data-image: icon'), 
        data;
        var attributes = params.attributes || [ params.attribute ], svg = data.content[0];
        return svg.isElem("svg") && attributes.forEach((function(attribute) {
          "string" == typeof attribute ? svg.hasAttr(attribute) || svg.addAttr({
            name: attribute,
            prefix: "",
            local: attribute
          }) : "object" == typeof attribute && Object.keys(attribute).forEach((function(key) {
            svg.hasAttr(key) || svg.addAttr({
              name: key,
              value: attribute[key],
              prefix: "",
              local: key
            });
          }));
        })), data;
      };
    },
    5810: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "full", exports.active = !1, exports.description = "adds classnames to an outer <svg> element";
      exports.fn = function(data, params) {
        if (!params || !(Array.isArray(params.classNames) && params.classNames.some(String) || params.className)) return console.error('Error in plugin "addClassesToSVGElement": absent parameters.\nIt should have a list of classes in "classNames" or one "className".\nConfig example:\n\nplugins:\n- addClassesToSVGElement:\n    className: "mySvg"\n\nplugins:\n- addClassesToSVGElement:\n    classNames: ["mySvg", "size-big"]\n'), 
        data;
        var classNames = params.classNames || [ params.className ], svg = data.content[0];
        return svg.isElem("svg") && svg.class.add.apply(svg.class, classNames), data;
      };
    },
    2423: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "cleanups attributes from newlines, trailing and repeating spaces", 
      exports.params = {
        newlines: !0,
        trim: !0,
        spaces: !0
      };
      var regNewlinesNeedSpace = /(\S)\r?\n(\S)/g, regNewlines = /\r?\n/g, regSpaces = /\s{2,}/g;
      exports.fn = function(item, params) {
        item.isElem() && item.eachAttr((function(attr) {
          params.newlines && (attr.value = attr.value.replace(regNewlinesNeedSpace, (function(match, p1, p2) {
            return p1 + " " + p2;
          })), attr.value = attr.value.replace(regNewlines, "")), params.trim && (attr.value = attr.value.trim()), 
          params.spaces && (attr.value = attr.value.replace(regSpaces, " "));
        }));
      };
    },
    1153: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "full", exports.active = !0, exports.description = "remove or cleanup enable-background attribute when possible", 
      exports.fn = function(data) {
        var regEnableBackground = /^new\s0\s0\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)$/, hasFilter = !1, elems = [ "svg", "mask", "pattern" ];
        function monkeys(items, fn) {
          return items.content.forEach((function(item) {
            fn(item), item.content && monkeys(item, fn);
          })), items;
        }
        var firstStep = monkeys(data, (function(item) {
          !function(item) {
            if (item.isElem(elems) && item.hasAttr("enable-background") && item.hasAttr("width") && item.hasAttr("height")) {
              var match = item.attr("enable-background").value.match(regEnableBackground);
              match && item.attr("width").value === match[1] && item.attr("height").value === match[3] && (item.isElem("svg") ? item.removeAttr("enable-background") : item.attr("enable-background").value = "new");
            }
          }(item), hasFilter || function(item) {
            item.isElem("filter") && (hasFilter = !0);
          }(item);
        }));
        return hasFilter ? firstStep : monkeys(firstStep, (function(item) {
          item.removeAttr("enable-background");
        }));
      };
    },
    1625: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "full", exports.active = !0, exports.description = "removes unused IDs and minifies used", 
      exports.params = {
        remove: !0,
        minify: !0,
        prefix: "",
        preserve: [],
        preservePrefixes: [],
        force: !1
      };
      var referencesProps = new Set(__webpack_require__(3193).referencesProps), regReferencesUrl = /\burl\(("|')?#(.+?)\1\)/, regReferencesHref = /^#(.+?)$/, regReferencesBegin = /(\w+)\./, styleOrScript = [ "style", "script" ], generateIDchars = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ], maxIDindex = generateIDchars.length - 1;
      function generateID(currentID) {
        if (!currentID) return [ 0 ];
        currentID[currentID.length - 1]++;
        for (var i = currentID.length - 1; i > 0; i--) currentID[i] > maxIDindex && (currentID[i] = 0, 
        void 0 !== currentID[i - 1] && currentID[i - 1]++);
        return currentID[0] > maxIDindex && (currentID[0] = 0, currentID.unshift(0)), currentID;
      }
      function getIDstring(arr, params) {
        return params.prefix + arr.map((i => generateIDchars[i])).join("");
      }
      exports.fn = function(data, params) {
        var currentID, currentIDstring, IDs = new Map, referencesIDs = new Map, hasStyleOrScript = !1, preserveIDs = new Set(Array.isArray(params.preserve) ? params.preserve : params.preserve ? [ params.preserve ] : []), preserveIDPrefixes = new Set(Array.isArray(params.preservePrefixes) ? params.preservePrefixes : params.preservePrefixes ? [ params.preservePrefixes ] : []);
        if (data = function monkeys(items) {
          for (var i = 0; i < items.content.length && !hasStyleOrScript; i++) {
            var item = items.content[i];
            if (!params.force) {
              if (item.isElem(styleOrScript)) {
                hasStyleOrScript = !0;
                continue;
              }
              if (item.isElem("defs") && item.parentNode.isElem("svg")) {
                for (var hasDefsOnly = !0, j = i + 1; j < items.content.length; j++) if (items.content[j].isElem()) {
                  hasDefsOnly = !1;
                  break;
                }
                if (hasDefsOnly) break;
              }
            }
            item.isElem() && item.eachAttr((function(attr) {
              var key, match;
              if ("id" === attr.name) return key = attr.value, void (IDs.has(key) ? item.removeAttr("id") : IDs.set(key, item));
              if (referencesProps.has(attr.name) && (match = attr.value.match(regReferencesUrl)) ? key = match[2] : ("href" === attr.local && (match = attr.value.match(regReferencesHref)) || "begin" === attr.name && (match = attr.value.match(regReferencesBegin))) && (key = match[1]), 
              key) {
                var ref = referencesIDs.get(key) || [];
                ref.push(attr), referencesIDs.set(key, ref);
              }
            })), item.content && monkeys(item);
          }
          return items;
        }(data), hasStyleOrScript) return data;
        const idPreserved = id => preserveIDs.has(id) || function(prefixArray, currentID) {
          if (!currentID) return !1;
          for (var prefix of prefixArray) if (currentID.startsWith(prefix)) return !0;
          return !1;
        }(preserveIDPrefixes, id);
        for (var ref of referencesIDs) {
          var key = ref[0];
          if (IDs.has(key)) {
            if (params.minify && !idPreserved(key)) {
              do {
                currentIDstring = getIDstring(currentID = generateID(currentID), params);
              } while (idPreserved(currentIDstring));
              for (var attr of (IDs.get(key).attr("id").value = currentIDstring, ref[1])) attr.value = attr.value.includes("#") ? attr.value.replace("#" + key, "#" + currentIDstring) : attr.value.replace(key + ".", currentIDstring + ".");
            }
            IDs.delete(key);
          }
        }
        if (params.remove) for (var keyElem of IDs) idPreserved(keyElem[0]) || keyElem[1].removeAttr("id");
        return data;
      };
    },
    9699: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "rounds list of values to the fixed precision", 
      exports.params = {
        floatPrecision: 3,
        leadingZero: !0,
        defaultPx: !0,
        convertToPx: !0
      };
      var regNumericValues = /^([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)(px|pt|pc|mm|cm|m|in|ft|em|ex|%)?$/, regSeparator = /\s+,?\s*|,\s*/, removeLeadingZero = __webpack_require__(8665).RM, absoluteLengths = {
        cm: 96 / 2.54,
        mm: 96 / 25.4,
        in: 96,
        pt: 4 / 3,
        pc: 16
      };
      exports.fn = function(item, params) {
        function roundValues($prop) {
          var num, units, match, matchNew, roundedList, listsArr = $prop.value.split(regSeparator), roundedListArr = [];
          listsArr.forEach((function(elem) {
            if (match = elem.match(regNumericValues), matchNew = elem.match(/new/), match) {
              if (num = +(+match[1]).toFixed(params.floatPrecision), units = match[3] || "", params.convertToPx && units && units in absoluteLengths) {
                var pxNum = +(absoluteLengths[units] * match[1]).toFixed(params.floatPrecision);
                String(pxNum).length < match[0].length && (num = pxNum, units = "px");
              }
              params.leadingZero && (num = removeLeadingZero(num)), params.defaultPx && "px" === units && (units = ""), 
              roundedListArr.push(num + units);
            } else matchNew ? roundedListArr.push("new") : elem && roundedListArr.push(elem);
          })), roundedList = roundedListArr.join(" "), $prop.value = roundedList;
        }
        item.hasAttr("points") && roundValues(item.attrs.points), item.hasAttr("enable-background") && roundValues(item.attrs["enable-background"]), 
        item.hasAttr("viewBox") && roundValues(item.attrs.viewBox), item.hasAttr("stroke-dasharray") && roundValues(item.attrs["stroke-dasharray"]), 
        item.hasAttr("dx") && roundValues(item.attrs.dx), item.hasAttr("dy") && roundValues(item.attrs.dy), 
        item.hasAttr("x") && roundValues(item.attrs.x), item.hasAttr("y") && roundValues(item.attrs.y);
      };
    },
    2778: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "rounds numeric values to the fixed precision, removes default ‘px’ units", 
      exports.params = {
        floatPrecision: 3,
        leadingZero: !0,
        defaultPx: !0,
        convertToPx: !0
      };
      var regNumericValues = /^([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)(px|pt|pc|mm|cm|m|in|ft|em|ex|%)?$/, removeLeadingZero = __webpack_require__(8665).RM, absoluteLengths = {
        cm: 96 / 2.54,
        mm: 96 / 25.4,
        in: 96,
        pt: 4 / 3,
        pc: 16
      };
      exports.fn = function(item, params) {
        if (item.isElem()) {
          var floatPrecision = params.floatPrecision;
          if (item.hasAttr("viewBox")) {
            var nums = item.attr("viewBox").value.split(/\s,?\s*|,\s*/g);
            item.attr("viewBox").value = nums.map((function(value) {
              var num = +value;
              return isNaN(num) ? value : +num.toFixed(floatPrecision);
            })).join(" ");
          }
          item.eachAttr((function(attr) {
            if ("version" !== attr.name) {
              var match = attr.value.match(regNumericValues);
              if (match) {
                var num = +(+match[1]).toFixed(floatPrecision), units = match[3] || "";
                if (params.convertToPx && units && units in absoluteLengths) {
                  var pxNum = +(absoluteLengths[units] * match[1]).toFixed(floatPrecision);
                  String(pxNum).length < match[0].length && (num = pxNum, units = "px");
                }
                params.leadingZero && (num = removeLeadingZero(num)), params.defaultPx && "px" === units && (units = ""), 
                attr.value = num + units;
              }
            }
          }));
        }
      };
    },
    9132: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItemReverse", exports.active = !0, exports.description = "collapses useless groups";
      var collections = __webpack_require__(3193), attrsInheritable = collections.inheritableAttrs, animationElems = collections.elemsGroups.animation;
      function hasAnimatedAttr(item) {
        return item.isElem(animationElems) && item.hasAttr("attributeName", this) || !item.isEmpty() && item.content.some(hasAnimatedAttr, this);
      }
      exports.fn = function(item) {
        !item.isElem() || item.isElem("switch") || item.isEmpty() || item.content.forEach((function(g, i) {
          if (g.isElem("g") && !g.isEmpty()) {
            if (g.hasAttr() && 1 === g.content.length) {
              var inner = g.content[0];
              !inner.isElem() || inner.hasAttr("id") || g.hasAttr("filter") || g.hasAttr("class") && inner.hasAttr("class") || (g.hasAttr("clip-path") || g.hasAttr("mask")) && (!inner.isElem("g") || g.hasAttr("transform") || inner.hasAttr("transform")) || g.eachAttr((function(attr) {
                if (!g.content.some(hasAnimatedAttr, attr.name)) {
                  if (inner.hasAttr(attr.name)) {
                    if ("transform" == attr.name) inner.attr(attr.name).value = attr.value + " " + inner.attr(attr.name).value; else if (inner.hasAttr(attr.name, "inherit")) inner.attr(attr.name).value = attr.value; else if (attrsInheritable.indexOf(attr.name) < 0 && !inner.hasAttr(attr.name, attr.value)) return;
                  } else inner.addAttr(attr);
                  g.removeAttr(attr.name);
                }
              }));
            }
            g.hasAttr() || g.content.some((function(item) {
              return item.isElem(animationElems);
            })) || item.spliceContent(i, 1, g.content);
          }
        }));
      };
    },
    1200: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "converts colors: rgb() to #rrggbb and #rrggbb to #rgb", 
      exports.params = {
        currentColor: !1,
        names2hex: !0,
        rgb2hex: !0,
        shorthex: !0,
        shortname: !0
      };
      var collections = __webpack_require__(3193), rNumber = "([+-]?(?:\\d*\\.\\d+|\\d+\\.?)%?)", regRGB = new RegExp("^rgb\\(\\s*" + rNumber + "\\s*,\\s*" + rNumber + "\\s*,\\s*" + rNumber + "\\s*\\)$"), regHEX = /^\#(([a-fA-F0-9])\2){3}$/, none = /\bnone\b/i;
      exports.fn = function(item, params) {
        item.elem && item.eachAttr((function(attr) {
          if (collections.colorsProps.indexOf(attr.name) > -1) {
            var match, val = attr.value;
            if (params.currentColor && (match = "string" == typeof params.currentColor ? val === params.currentColor : params.currentColor.exec ? params.currentColor.exec(val) : !val.match(none)) && (val = "currentColor"), 
            params.names2hex && val.toLowerCase() in collections.colorsNames && (val = collections.colorsNames[val.toLowerCase()]), 
            params.rgb2hex && (match = val.match(regRGB)) && (match = match.slice(1, 4).map((function(m) {
              return m.indexOf("%") > -1 && (m = Math.round(2.55 * parseFloat(m))), Math.max(0, Math.min(m, 255));
            })), val = "#" + ("00000" + ((rgb = match)[0] << 16 | rgb[1] << 8 | rgb[2]).toString(16)).slice(-6).toUpperCase()), 
            params.shorthex && (match = val.match(regHEX)) && (val = "#" + match[0][1] + match[0][3] + match[0][5]), 
            params.shortname) {
              var lowerVal = val.toLowerCase();
              lowerVal in collections.colorsShortNames && (val = collections.colorsShortNames[lowerVal]);
            }
            attr.value = val;
          }
          var rgb;
        }));
      };
    },
    1009: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "converts non-eccentric <ellipse>s to <circle>s", 
      exports.fn = function(item) {
        if (item.isElem("ellipse")) {
          var rx = item.attr("rx").value || 0, ry = item.attr("ry").value || 0;
          if (rx === ry || "auto" === rx || "auto" === ry) {
            var radius = "auto" !== rx ? rx : ry;
            item.renameElem("circle"), item.removeAttr([ "rx", "ry" ]), item.addAttr({
              name: "r",
              value: radius,
              prefix: "",
              local: "r"
            });
          }
        }
      };
    },
    5221: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "converts basic shapes to more compact path form", 
      exports.params = {
        convertArcs: !1
      };
      var none = {
        value: 0
      }, regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
      exports.fn = function(item, params) {
        var convertArcs = params && params.convertArcs;
        if (item.isElem("rect") && item.hasAttr("width") && item.hasAttr("height") && !item.hasAttr("rx") && !item.hasAttr("ry")) {
          var x = +(item.attr("x") || none).value, y = +(item.attr("y") || none).value, width = +item.attr("width").value, height = +item.attr("height").value;
          if (isNaN(x - y + width - height)) return;
          var pathData = "M" + x + " " + y + "H" + (x + width) + "V" + (y + height) + "H" + x + "z";
          item.addAttr({
            name: "d",
            value: pathData,
            prefix: "",
            local: "d"
          }), item.renameElem("path").removeAttr([ "x", "y", "width", "height" ]);
        } else if (item.isElem("line")) {
          var x1 = +(item.attr("x1") || none).value, y1 = +(item.attr("y1") || none).value, x2 = +(item.attr("x2") || none).value, y2 = +(item.attr("y2") || none).value;
          if (isNaN(x1 - y1 + x2 - y2)) return;
          item.addAttr({
            name: "d",
            value: "M" + x1 + " " + y1 + "L" + x2 + " " + y2,
            prefix: "",
            local: "d"
          }), item.renameElem("path").removeAttr([ "x1", "y1", "x2", "y2" ]);
        } else if ((item.isElem("polyline") || item.isElem("polygon")) && item.hasAttr("points")) {
          var coords = (item.attr("points").value.match(regNumber) || []).map(Number);
          if (coords.length < 4) return !1;
          item.addAttr({
            name: "d",
            value: "M" + coords.slice(0, 2).join(" ") + "L" + coords.slice(2).join(" ") + (item.isElem("polygon") ? "z" : ""),
            prefix: "",
            local: "d"
          }), item.renameElem("path").removeAttr("points");
        } else if (item.isElem("circle") && convertArcs) {
          var cx = +(item.attr("cx") || none).value, cy = +(item.attr("cy") || none).value, r = +(item.attr("r") || none).value;
          if (isNaN(cx - cy + r)) return;
          var cPathData = "M" + cx + " " + (cy - r) + "A" + r + " " + r + " 0 1 0 " + cx + " " + (cy + r) + "A" + r + " " + r + " 0 1 0 " + cx + " " + (cy - r) + "Z";
          item.addAttr({
            name: "d",
            value: cPathData,
            prefix: "",
            local: "d"
          }), item.renameElem("path").removeAttr([ "cx", "cy", "r" ]);
        } else if (item.isElem("ellipse") && convertArcs) {
          var ecx = +(item.attr("cx") || none).value, ecy = +(item.attr("cy") || none).value, rx = +(item.attr("rx") || none).value, ry = +(item.attr("ry") || none).value;
          if (isNaN(ecx - ecy + rx - ry)) return;
          var ePathData = "M" + ecx + " " + (ecy - ry) + "A" + rx + " " + ry + " 0 1 0 " + ecx + " " + (ecy + ry) + "A" + rx + " " + ry + " 0 1 0 " + ecx + " " + (ecy - ry) + "Z";
          item.addAttr({
            name: "d",
            value: ePathData,
            prefix: "",
            local: "d"
          }), item.renameElem("path").removeAttr([ "cx", "cy", "rx", "ry" ]);
        }
      };
    },
    7601: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "converts style to attributes", 
      exports.params = {
        keepImportant: !1
      };
      var stylingProps = __webpack_require__(3193).attrsGroups.presentation, rEscape = "\\\\(?:[0-9a-f]{1,6}\\s?|\\r\\n|.)", rAttr = "\\s*(" + g("[^:;\\\\]", rEscape) + "*?)\\s*", rSingleQuotes = "'(?:[^'\\n\\r\\\\]|" + rEscape + ")*?(?:'|$)", rQuotes = '"(?:[^"\\n\\r\\\\]|' + rEscape + ')*?(?:"|$)', rQuotedString = new RegExp("^" + g(rSingleQuotes, rQuotes) + "$"), rParenthesis = "\\(" + g("[^'\"()\\\\]+", rEscape, rSingleQuotes, rQuotes) + "*?\\)", rValue = "\\s*(" + g("[^!'\"();\\\\]+?", rEscape, rSingleQuotes, rQuotes, rParenthesis, "[^;]*?") + "*?)", regDeclarationBlock = new RegExp(rAttr + ":" + rValue + "(\\s*!important(?![-(w]))?\\s*(?:;\\s*|$)", "ig"), regStripComments = new RegExp(g(rEscape, rSingleQuotes, rQuotes, "/\\*[^]*?\\*/"), "ig");
      function g() {
        return "(?:" + Array.prototype.join.call(arguments, "|") + ")";
      }
      exports.fn = function(item, params) {
        if (item.elem && item.hasAttr("style")) {
          var rule, styleValue = item.attr("style").value, styles = [], attrs = {};
          for (styleValue = styleValue.replace(regStripComments, (function(match) {
            return "/" == match[0] ? "" : "\\" == match[0] && /[-g-z]/i.test(match[1]) ? match[1] : match;
          })), regDeclarationBlock.lastIndex = 0; rule = regDeclarationBlock.exec(styleValue); ) params.keepImportant && rule[3] || styles.push([ rule[1], rule[2] ]);
          styles.length && (styles = styles.filter((function(style) {
            if (style[0]) {
              var prop = style[0].toLowerCase(), val = style[1];
              if (rQuotedString.test(val) && (val = val.slice(1, -1)), stylingProps.indexOf(prop) > -1) return attrs[prop] = {
                name: prop,
                value: val,
                local: prop,
                prefix: ""
              }, !1;
            }
            return !0;
          })), Object.assign(item.attrs, attrs), styles.length ? item.attr("style").value = styles.map((function(declaration) {
            return declaration.join(":");
          })).join(";") : item.removeAttr("style"));
        }
      };
    },
    3495: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "collapses multiple transformations and optimizes it", 
      exports.params = {
        convertToShorts: !0,
        floatPrecision: 3,
        transformPrecision: 5,
        matrixToTransform: !0,
        shortTranslate: !0,
        shortScale: !0,
        shortRotate: !0,
        removeUseless: !0,
        collapseIntoOne: !0,
        leadingZero: !0,
        negativeExtraSpace: !1
      };
      var degRound, floatRound, transformRound, cleanupOutData = __webpack_require__(8665).Kr, transform2js = __webpack_require__(4408).transform2js, transformsMultiply = __webpack_require__(4408).transformsMultiply, matrixToTransform = __webpack_require__(4408).matrixToTransform;
      function convertTransform(item, attrName, params) {
        var data = transform2js(item.attr(attrName).value);
        params = function(data, params) {
          var matrixData = data.reduce(getMatrixData, []), significantDigits = params.transformPrecision;
          params = Object.assign({}, params), matrixData.length && (params.transformPrecision = Math.min(params.transformPrecision, Math.max.apply(Math, matrixData.map(floatDigits)) || params.transformPrecision), 
          significantDigits = Math.max.apply(Math, matrixData.map((function(n) {
            return String(n).replace(/\D+/g, "").length;
          }))));
          "degPrecision" in params || (params.degPrecision = Math.max(0, Math.min(params.floatPrecision, significantDigits - 2)));
          return floatRound = params.floatPrecision >= 1 && params.floatPrecision < 20 ? smartRound.bind(this, params.floatPrecision) : round, 
          degRound = params.degPrecision >= 1 && params.floatPrecision < 20 ? smartRound.bind(this, params.degPrecision) : round, 
          transformRound = params.transformPrecision >= 1 && params.floatPrecision < 20 ? smartRound.bind(this, params.transformPrecision) : round, 
          params;
        }(data, params), params.collapseIntoOne && data.length > 1 && (data = [ transformsMultiply(data) ]), 
        params.convertToShorts ? data = function(transforms, params) {
          for (var i = 0; i < transforms.length; i++) {
            var transform = transforms[i];
            if (params.matrixToTransform && "matrix" === transform.name) {
              var decomposed = matrixToTransform(transform, params);
              decomposed != transform && js2transform(decomposed, params).length <= js2transform([ transform ], params).length && transforms.splice.apply(transforms, [ i, 1 ].concat(decomposed)), 
              transform = transforms[i];
            }
            roundTransform(transform), params.shortTranslate && "translate" === transform.name && 2 === transform.data.length && !transform.data[1] && transform.data.pop(), 
            params.shortScale && "scale" === transform.name && 2 === transform.data.length && transform.data[0] === transform.data[1] && transform.data.pop(), 
            params.shortRotate && transforms[i - 2] && "translate" === transforms[i - 2].name && "rotate" === transforms[i - 1].name && "translate" === transforms[i].name && transforms[i - 2].data[0] === -transforms[i].data[0] && transforms[i - 2].data[1] === -transforms[i].data[1] && (transforms.splice(i - 2, 3, {
              name: "rotate",
              data: [ transforms[i - 1].data[0], transforms[i - 2].data[0], transforms[i - 2].data[1] ]
            }), transform = transforms[i -= 2]);
          }
          return transforms;
        }(data, params) : data.forEach(roundTransform), params.removeUseless && (data = data.filter((function(transform) {
          return !([ "translate", "rotate", "skewX", "skewY" ].indexOf(transform.name) > -1 && (1 == transform.data.length || "rotate" == transform.name) && !transform.data[0] || "translate" == transform.name && !transform.data[0] && !transform.data[1] || "scale" == transform.name && 1 == transform.data[0] && (transform.data.length < 2 || 1 == transform.data[1]) || "matrix" == transform.name && 1 == transform.data[0] && 1 == transform.data[3] && !(transform.data[1] || transform.data[2] || transform.data[4] || transform.data[5]));
        }))), data.length ? item.attr(attrName).value = js2transform(data, params) : item.removeAttr(attrName);
      }
      function getMatrixData(a, b) {
        return "matrix" == b.name ? a.concat(b.data.slice(0, 4)) : a;
      }
      function floatDigits(n) {
        return (n = String(n)).slice(n.indexOf(".")).length - 1;
      }
      function js2transform(transformJS, params) {
        var transformString = "";
        return transformJS.forEach((function(transform) {
          roundTransform(transform), transformString += (transformString && " ") + transform.name + "(" + cleanupOutData(transform.data, params) + ")";
        })), transformString;
      }
      function roundTransform(transform) {
        switch (transform.name) {
         case "translate":
          transform.data = floatRound(transform.data);
          break;

         case "rotate":
          transform.data = degRound(transform.data.slice(0, 1)).concat(floatRound(transform.data.slice(1)));
          break;

         case "skewX":
         case "skewY":
          transform.data = degRound(transform.data);
          break;

         case "scale":
          transform.data = transformRound(transform.data);
          break;

         case "matrix":
          transform.data = transformRound(transform.data.slice(0, 4)).concat(floatRound(transform.data.slice(4)));
        }
        return transform;
      }
      function round(data) {
        return data.map(Math.round);
      }
      function smartRound(precision, data) {
        for (var i = data.length, tolerance = +Math.pow(.1, precision).toFixed(precision); i--; ) if (data[i].toFixed(precision) != data[i]) {
          var rounded = +data[i].toFixed(precision - 1);
          data[i] = +Math.abs(rounded - data[i]).toFixed(precision + 1) >= tolerance ? +data[i].toFixed(precision) : rounded;
        }
        return data;
      }
      exports.fn = function(item, params) {
        item.elem && (item.hasAttr("transform") && convertTransform(item, "transform", params), 
        item.hasAttr("gradientTransform") && convertTransform(item, "gradientTransform", params), 
        item.hasAttr("patternTransform") && convertTransform(item, "patternTransform", params));
      };
    },
    2114: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "full", exports.active = !0, exports.params = {
        onlyMatchedOnce: !0,
        removeMatchedSelectors: !0,
        useMqs: [ "", "screen" ],
        usePseudos: [ "" ]
      }, exports.description = "inline styles (additional options)";
      var csstree = __webpack_require__(904), cssTools = __webpack_require__(9479);
      exports.fn = function(document, opts) {
        var styleEls = document.querySelectorAll("style");
        if (null === styleEls) return document;
        var styles = [], selectors = [];
        for (var styleEl of styleEls) if (!styleEl.isEmpty() && !styleEl.closestElem("foreignObject")) {
          var cssStr = cssTools.getCssStr(styleEl), cssAst = {};
          try {
            cssAst = csstree.parse(cssStr, {
              parseValue: !1,
              parseCustomProperty: !1
            });
          } catch (parseError) {
            continue;
          }
          styles.push({
            styleEl: styleEl,
            cssAst: cssAst
          }), selectors = selectors.concat(cssTools.flattenToSelectors(cssAst));
        }
        var selectorsMq = cssTools.filterByMqs(selectors, opts.useMqs), selectorsPseudo = cssTools.filterByPseudos(selectorsMq, opts.usePseudos);
        cssTools.cleanPseudos(selectorsPseudo);
        var selector, selectedEl, sortedSelectors = cssTools.sortSelectors(selectorsPseudo).reverse();
        for (selector of sortedSelectors) {
          var selectorStr = csstree.generate(selector.item.data), selectedEls = null;
          try {
            selectedEls = document.querySelectorAll(selectorStr);
          } catch (selectError) {
            if (selectError.constructor === SyntaxError) continue;
            throw selectError;
          }
          null !== selectedEls && (selector.selectedEls = selectedEls);
        }
        for (selector of sortedSelectors) if (selector.selectedEls && !(opts.onlyMatchedOnce && null !== selector.selectedEls && selector.selectedEls.length > 1)) {
          for (selectedEl of selector.selectedEls) null !== selector.rule && csstree.walk(selector.rule, {
            visit: "Declaration",
            enter: function(styleCsstreeDeclaration) {
              var styleDeclaration = cssTools.csstreeToStyleDeclaration(styleCsstreeDeclaration);
              null !== selectedEl.style.getPropertyValue(styleDeclaration.name) && selectedEl.style.getPropertyPriority(styleDeclaration.name) >= styleDeclaration.priority || selectedEl.style.setProperty(styleDeclaration.name, styleDeclaration.value, styleDeclaration.priority);
            }
          });
          opts.removeMatchedSelectors && null !== selector.selectedEls && selector.selectedEls.length > 0 && selector.rule.prelude.children.remove(selector.item);
        }
        if (!opts.removeMatchedSelectors) return document;
        for (selector of sortedSelectors) if (selector.selectedEls && !(opts.onlyMatchedOnce && null !== selector.selectedEls && selector.selectedEls.length > 1)) for (selectedEl of selector.selectedEls) {
          var firstSubSelector = selector.item.data.children.first();
          "ClassSelector" === firstSubSelector.type && selectedEl.class.remove(firstSubSelector.name), 
          void 0 === selectedEl.class.item(0) && selectedEl.removeAttr("class"), "IdSelector" === firstSubSelector.type && selectedEl.removeAttr("id", firstSubSelector.name);
        }
        for (var style of styles) if (csstree.walk(style.cssAst, {
          visit: "Rule",
          enter: function(node, item, list) {
            ("Atrule" === node.type && null !== node.block && node.block.children.isEmpty() || "Rule" === node.type && node.prelude.children.isEmpty()) && list.remove(item);
          }
        }), style.cssAst.children.isEmpty()) {
          var styleParentEl = style.styleEl.parentNode;
          if (styleParentEl.spliceContent(styleParentEl.content.indexOf(style.styleEl), 1), 
          "defs" === styleParentEl.elem && 0 === styleParentEl.content.length) {
            var defsParentEl = styleParentEl.parentNode;
            defsParentEl.spliceContent(defsParentEl.content.indexOf(styleParentEl), 1);
          }
        } else cssTools.setCssStr(style.styleEl, csstree.generate(style.cssAst));
        return document;
      };
    },
    9162: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "merges multiple paths in one if possible", 
      exports.params = {
        collapseRepeated: !0,
        force: !1,
        leadingZero: !0,
        negativeExtraSpace: !0,
        noSpaceAfterFlags: !0
      };
      var path2js = __webpack_require__(7050).path2js, js2path = __webpack_require__(7050).js2path, intersects = __webpack_require__(7050).intersects;
      exports.fn = function(item, params) {
        if (item.isElem() && !item.isEmpty()) {
          var prevContentItem = null, prevContentItemKeys = null;
          item.content = item.content.filter((function(contentItem) {
            if (prevContentItem && prevContentItem.isElem("path") && prevContentItem.isEmpty() && prevContentItem.hasAttr("d") && contentItem.isElem("path") && contentItem.isEmpty() && contentItem.hasAttr("d")) {
              prevContentItemKeys || (prevContentItemKeys = Object.keys(prevContentItem.attrs));
              var contentItemAttrs = Object.keys(contentItem.attrs), equalData = prevContentItemKeys.length == contentItemAttrs.length && contentItemAttrs.every((function(key) {
                return "d" == key || prevContentItem.hasAttr(key) && prevContentItem.attr(key).value == contentItem.attr(key).value;
              })), prevPathJS = path2js(prevContentItem), curPathJS = path2js(contentItem);
              if (equalData && (params.force || !intersects(prevPathJS, curPathJS))) return js2path(prevContentItem, prevPathJS.concat(curPathJS), params), 
              !1;
            }
            return prevContentItem = contentItem, prevContentItemKeys = null, !0;
          }));
        }
      };
    },
    7205: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "full", exports.active = !0, exports.description = "minifies styles and removes unused styles based on usage data", 
      exports.params = {
        usage: {
          force: !1,
          ids: !0,
          classes: !0,
          tags: !0
        }
      };
      var csso = __webpack_require__(1944);
      function cloneObject(obj) {
        var result = {};
        for (var key in obj) result[key] = obj[key];
        return result;
      }
      function shouldFilter(options, name) {
        return "usage" in options == !1 || (!(!options.usage || name in options.usage != !1) || Boolean(options.usage && options.usage[name]));
      }
      exports.fn = function(ast, options) {
        var minifyOptionsForStylesheet = cloneObject(options = options || {}), minifyOptionsForAttribute = cloneObject(options), elems = function(ast) {
          function walk(items, styles) {
            for (var i = 0; i < items.content.length; i++) {
              var item = items.content[i];
              item.content && walk(item, styles), (item.isElem("style") && !item.isEmpty() || item.isElem() && item.hasAttr("style")) && styles.push(item);
            }
            return styles;
          }
          return walk(ast, []);
        }(ast);
        return minifyOptionsForStylesheet.usage = function(ast, options) {
          function walk(items, usageData) {
            for (var i = 0; i < items.content.length; i++) {
              var item = items.content[i];
              item.content && walk(item, usageData), item.isElem("script") && (safe = !1), item.isElem() && (usageData.tags[item.elem] = !0, 
              item.hasAttr("id") && (usageData.ids[item.attr("id").value] = !0), item.hasAttr("class") && item.attr("class").value.replace(/^\s+|\s+$/g, "").split(/\s+/).forEach((function(className) {
                usageData.classes[className] = !0;
              })), item.attrs && Object.keys(item.attrs).some((function(name) {
                return /^on/i.test(name);
              })) && (safe = !1));
            }
            return usageData;
          }
          var safe = !0, usageData = {}, hasData = !1, rawData = walk(ast, {
            ids: Object.create(null),
            classes: Object.create(null),
            tags: Object.create(null)
          });
          !safe && options.usage && options.usage.force && (safe = !0);
          for (var key in rawData) shouldFilter(options, key) && (usageData[key] = Object.keys(rawData[key]), 
          hasData = !0);
          return safe && hasData ? usageData : null;
        }(ast, options), minifyOptionsForAttribute.usage = null, elems.forEach((function(elem) {
          if (elem.isElem("style")) {
            var styleCss = elem.content[0].text || elem.content[0].cdata || [], DATA = styleCss.indexOf(">") >= 0 || styleCss.indexOf("<") >= 0 ? "cdata" : "text";
            elem.content[0][DATA] = csso.minify(styleCss, minifyOptionsForStylesheet).css;
          } else {
            var elemStyle = elem.attr("style").value;
            elem.attr("style").value = csso.minifyBlock(elemStyle, minifyOptionsForAttribute).css;
          }
        })), ast;
      };
    },
    1124: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItemReverse", exports.active = !0, exports.description = "moves elements attributes to the existing group wrapper";
      var inheritableAttrs = __webpack_require__(3193).inheritableAttrs, pathElems = __webpack_require__(3193).pathElems;
      exports.fn = function(item) {
        if (item.isElem("g") && !item.isEmpty() && item.content.length > 1) {
          var intersection = {}, hasTransform = !1, hasClip = item.hasAttr("clip-path") || item.hasAttr("mask"), intersected = item.content.every((function(inner) {
            if (inner.isElem() && inner.hasAttr()) {
              if (inner.hasAttr("class")) return !1;
              if (Object.keys(intersection).length) {
                if (!(intersection = function(a, b) {
                  var c = {};
                  for (var n in a) b.hasOwnProperty(n) && inheritableAttrs.indexOf(n) > -1 && a[n].name === b[n].name && a[n].value === b[n].value && a[n].prefix === b[n].prefix && a[n].local === b[n].local && (c[n] = a[n]);
                  return !!Object.keys(c).length && c;
                }(intersection, inner.attrs))) return !1;
              } else intersection = inner.attrs;
              return !0;
            }
          })), allPath = item.content.every((function(inner) {
            return inner.isElem(pathElems);
          }));
          intersected && item.content.forEach((function(g) {
            for (var name in intersection) (allPath || hasClip) && "transform" === name || (g.removeAttr(name), 
            "transform" === name ? hasTransform || (item.hasAttr("transform") ? item.attr("transform").value += " " + intersection[name].value : item.addAttr(intersection[name]), 
            hasTransform = !0) : item.addAttr(intersection[name]));
          }));
        }
      };
    },
    2177: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "moves some group attributes to the content elements";
      var collections = __webpack_require__(3193), pathElems = collections.pathElems.concat([ "g", "text" ]), referencesProps = collections.referencesProps;
      exports.fn = function(item) {
        item.isElem("g") && item.hasAttr("transform") && !item.isEmpty() && !item.someAttr((function(attr) {
          return ~referencesProps.indexOf(attr.name) && ~attr.value.indexOf("url(");
        })) && item.content.every((function(inner) {
          return inner.isElem(pathElems) && !inner.hasAttr("id");
        })) && (item.content.forEach((function(inner) {
          var attr = item.attr("transform");
          inner.hasAttr("transform") ? inner.attr("transform").value = attr.value + " " + inner.attr("transform").value : inner.addAttr({
            name: attr.name,
            local: attr.local,
            prefix: attr.prefix,
            value: attr.value
          });
        })), item.removeAttr("transform"));
      };
    },
    9004: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.params = {
        delim: "__",
        prefixIds: !0,
        prefixClassNames: !0
      }, exports.description = "prefix IDs";
      var path = __webpack_require__(1017), csstree = __webpack_require__(904), unquote = __webpack_require__(2793), referencesProps = __webpack_require__(3193).referencesProps, rxId = /^#(.*)$/, addPrefix = null, escapeIdentifierName = function(str) {
        return str.replace(/[\. ]/g, "_");
      }, attrNotEmpty = function(attr) {
        return attr && attr.value && attr.value.length > 0;
      }, prefixId = function(val) {
        var idUrlMatches, idName = null !== (idUrlMatches = val.match(rxId)) && idUrlMatches[1];
        return !!idName && "#" + addPrefix(idName);
      }, addPrefixToHrefAttr = function(attr) {
        if (attrNotEmpty(attr)) {
          var idPrefixed = prefixId(attr.value);
          idPrefixed && (attr.value = idPrefixed);
        }
      }, addPrefixToUrlAttr = function(attr) {
        if (attrNotEmpty(attr)) {
          var val, urlMatches, urlVal = (val = attr.value, null !== (urlMatches = /url\((.*?)\)/gi.exec(val)) && urlMatches[1]);
          if (urlVal) {
            var idPrefixed = prefixId(urlVal);
            idPrefixed && (attr.value = "url(" + idPrefixed + ")");
          }
        }
      };
      exports.fn = function(node, opts, extra) {
        if (extra.multipassCount && extra.multipassCount > 0) return node;
        var attr, prefix = "prefix";
        if (opts.prefix) prefix = "function" == typeof opts.prefix ? opts.prefix(node, extra) : opts.prefix; else if (!1 === opts.prefix) prefix = !1; else if (extra && extra.path && extra.path.length > 0) {
          var filename = path.basename(extra.path);
          prefix = filename;
        }
        if (addPrefix = function(name) {
          return escapeIdentifierName(!1 === prefix ? name : prefix + opts.delim + name);
        }, "style" === node.elem) {
          if (node.isEmpty()) return node;
          var cssStr = node.content[0].text || node.content[0].cdata || [], cssAst = {};
          try {
            cssAst = csstree.parse(cssStr, {
              parseValue: !0,
              parseCustomProperty: !1
            });
          } catch (parseError) {
            return console.warn("Warning: Parse error of styles of <style/> element, skipped. Error details: " + parseError), 
            node;
          }
          var idPrefixed = "";
          return csstree.walk(cssAst, (function(node) {
            if ((opts.prefixIds && "IdSelector" === node.type || opts.prefixClassNames && "ClassSelector" === node.type) && node.name) node.name = addPrefix(node.name); else if ("Url" === node.type && node.value.value && node.value.value.length > 0) {
              if (!(idPrefixed = prefixId(unquote(node.value.value)))) return;
              node.value.value = idPrefixed;
            }
          })), node.content[0].text = csstree.generate(cssAst), node;
        }
        if (!node.attrs) return node;
        for (var referencesProp of (opts.prefixIds && (attr = node.attrs.id, attrNotEmpty(attr) && (attr.value = addPrefix(attr.value))), 
        opts.prefixClassNames && function(attr) {
          attrNotEmpty(attr) && (attr.value = attr.value.split(/\s+/).map(addPrefix).join(" "));
        }(node.attrs.class), addPrefixToHrefAttr(node.attrs.href), addPrefixToHrefAttr(node.attrs["xlink:href"]), 
        referencesProps)) addPrefixToUrlAttr(node.attrs[referencesProp]);
        return node;
      };
    },
    8541: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes attributes of elements that match a css selector", 
      exports.fn = function(item, params) {
        (Array.isArray(params.selectors) ? params.selectors : [ params ]).map((function(i) {
          item.matches(i.selector) && item.removeAttr(i.attributes);
        }));
      };
    },
    4229: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes specified attributes", 
      exports.params = {
        elemSeparator: ":",
        preserveCurrentColor: !1,
        attrs: []
      }, exports.fn = function(item, params) {
        if (Array.isArray(params.attrs) || (params.attrs = [ params.attrs ]), item.isElem()) {
          var elemSeparator = "string" == typeof params.elemSeparator ? params.elemSeparator : ":", preserveCurrentColor = "boolean" == typeof params.preserveCurrentColor && params.preserveCurrentColor;
          params.attrs.map((function(pattern) {
            return -1 === pattern.indexOf(elemSeparator) ? pattern = [ ".*", elemSeparator, pattern, elemSeparator, ".*" ].join("") : pattern.split(elemSeparator).length < 3 && (pattern = [ pattern, elemSeparator, ".*" ].join("")), 
            pattern.split(elemSeparator).map((function(value) {
              return "*" === value && (value = ".*"), new RegExp([ "^", value, "$" ].join(""), "i");
            }));
          })).forEach((function(pattern) {
            pattern[0].test(item.elem) && item.eachAttr((function(attr) {
              var name = attr.name, value = attr.value;
              preserveCurrentColor && "fill" == name && "currentColor" == value || preserveCurrentColor && "stroke" == name && "currentColor" == value || pattern[1].test(name) && pattern[2].test(attr.value) && item.removeAttr(name);
            }));
          }));
        }
      };
    },
    4771: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes comments", 
      exports.fn = function(item) {
        if (item.comment && "!" !== item.comment.charAt(0)) return !1;
      };
    },
    6229: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.params = {
        removeAny: !0
      }, exports.description = "removes <desc>";
      var standardDescs = /^(Created with|Created using)/;
      exports.fn = function(item, params) {
        return !item.isElem("desc") || !(params.removeAny || item.isEmpty() || standardDescs.test(item.content[0].text));
      };
    },
    4285: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes width and height in presence of viewBox (opposite to removeViewBox, disable it first)", 
      exports.fn = function(item) {
        item.isElem("svg") && (item.hasAttr("viewBox") ? (item.removeAttr("width"), item.removeAttr("height")) : item.hasAttr("width") && item.hasAttr("height") && !isNaN(Number(item.attr("width").value)) && !isNaN(Number(item.attr("height").value)) && (item.addAttr({
          name: "viewBox",
          value: "0 0 " + Number(item.attr("width").value) + " " + Number(item.attr("height").value),
          prefix: "",
          local: "viewBox"
        }), item.removeAttr("width"), item.removeAttr("height")));
      };
    },
    9116: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes doctype declaration", 
      exports.fn = function(item) {
        if (item.doctype) return !1;
      };
    },
    4472: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes editors namespaces, elements and attributes";
      var editorNamespaces = __webpack_require__(3193).editorNamespaces, prefixes = [];
      exports.params = {
        additionalNamespaces: []
      }, exports.fn = function(item, params) {
        if (Array.isArray(params.additionalNamespaces) && (editorNamespaces = editorNamespaces.concat(params.additionalNamespaces)), 
        item.elem && (item.isElem("svg") && item.eachAttr((function(attr) {
          "xmlns" === attr.prefix && editorNamespaces.indexOf(attr.value) > -1 && (prefixes.push(attr.local), 
          item.removeAttr(attr.name));
        })), item.eachAttr((function(attr) {
          prefixes.indexOf(attr.prefix) > -1 && item.removeAttr(attr.name);
        })), prefixes.indexOf(item.prefix) > -1)) return !1;
      };
    },
    7270: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes arbitrary elements by ID or className (disabled by default)", 
      exports.params = {
        id: [],
        class: []
      }, exports.fn = function(item, params) {
        var elemId, elemClass;
        if ([ "id", "class" ].forEach((function(key) {
          Array.isArray(params[key]) || (params[key] = [ params[key] ]);
        })), item.isElem()) {
          if (elemId = item.attr("id")) return -1 === params.id.indexOf(elemId.value);
          if (elemClass = item.attr("class")) return !new RegExp(params.class.join("|")).test(elemClass.value);
        }
      };
    },
    3304: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes empty attributes", 
      exports.fn = function(item) {
        item.elem && item.eachAttr((function(attr) {
          "" === attr.value && item.removeAttr(attr.name);
        }));
      };
    },
    5192: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItemReverse", exports.active = !0, exports.description = "removes empty container elements";
      var container = __webpack_require__(3193).elemsGroups.container;
      exports.fn = function(item) {
        return !(item.isElem(container) && !item.isElem("svg") && item.isEmpty() && (!item.isElem("pattern") || !item.hasAttrLocal("href")));
      };
    },
    6758: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes empty <text> elements", 
      exports.params = {
        text: !0,
        tspan: !0,
        tref: !0
      }, exports.fn = function(item, params) {
        return !(params.text && item.isElem("text") && item.isEmpty()) && (!(params.tspan && item.isElem("tspan") && item.isEmpty()) && (!(params.tref && item.isElem("tref") && !item.hasAttrLocal("href")) && void 0));
      };
    },
    3514: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes hidden elements (zero sized, with absent attributes)", 
      exports.params = {
        isHidden: !0,
        displayNone: !0,
        opacity0: !0,
        circleR0: !0,
        ellipseRX0: !0,
        ellipseRY0: !0,
        rectWidth0: !0,
        rectHeight0: !0,
        patternWidth0: !0,
        patternHeight0: !0,
        imageWidth0: !0,
        imageHeight0: !0,
        pathEmptyD: !0,
        polylineEmptyPoints: !0,
        polygonEmptyPoints: !0
      };
      var regValidPath = /M\s*(?:[-+]?(?:\d*\.\d+|\d+(?:\.|(?!\.)))([eE][-+]?\d+)?(?!\d)\s*,?\s*){2}\D*\d/i;
      exports.fn = function(item, params) {
        if (item.elem) {
          if (params.isHidden && item.hasAttr("visibility", "hidden")) return !1;
          if (params.displayNone && item.hasAttr("display", "none")) return !1;
          if (params.opacity0 && item.hasAttr("opacity", "0")) return !1;
          if (params.circleR0 && item.isElem("circle") && item.isEmpty() && item.hasAttr("r", "0")) return !1;
          if (params.ellipseRX0 && item.isElem("ellipse") && item.isEmpty() && item.hasAttr("rx", "0")) return !1;
          if (params.ellipseRY0 && item.isElem("ellipse") && item.isEmpty() && item.hasAttr("ry", "0")) return !1;
          if (params.rectWidth0 && item.isElem("rect") && item.isEmpty() && item.hasAttr("width", "0")) return !1;
          if (params.rectHeight0 && params.rectWidth0 && item.isElem("rect") && item.isEmpty() && item.hasAttr("height", "0")) return !1;
          if (params.patternWidth0 && item.isElem("pattern") && item.hasAttr("width", "0")) return !1;
          if (params.patternHeight0 && item.isElem("pattern") && item.hasAttr("height", "0")) return !1;
          if (params.imageWidth0 && item.isElem("image") && item.hasAttr("width", "0")) return !1;
          if (params.imageHeight0 && item.isElem("image") && item.hasAttr("height", "0")) return !1;
          if (params.pathEmptyD && item.isElem("path") && (!item.hasAttr("d") || !regValidPath.test(item.attr("d").value))) return !1;
          if (params.polylineEmptyPoints && item.isElem("polyline") && !item.hasAttr("points")) return !1;
          if (params.polygonEmptyPoints && item.isElem("polygon") && !item.hasAttr("points")) return !1;
        }
      };
    },
    750: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes <metadata>", 
      exports.fn = function(item) {
        return !item.isElem("metadata");
      };
    },
    60: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes non-inheritable group’s presentational attributes";
      var inheritableAttrs = __webpack_require__(3193).inheritableAttrs, attrsGroups = __webpack_require__(3193).attrsGroups, applyGroups = __webpack_require__(3193).presentationNonInheritableGroupAttrs;
      exports.fn = function(item) {
        item.isElem("g") && item.eachAttr((function(attr) {
          !~attrsGroups.presentation.indexOf(attr.name) || ~inheritableAttrs.indexOf(attr.name) || ~applyGroups.indexOf(attr.name) || item.removeAttr(attr.name);
        }));
      };
    },
    4217: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes elements that are drawn outside of the viewbox (disabled by default)";
      var viewBox, viewBoxJS, SVGO = __webpack_require__(2565), _path = __webpack_require__(7050), intersects = _path.intersects, path2js = _path.path2js;
      function hasTransform(item) {
        return item.hasAttr("transform") || item.parentNode && hasTransform(item.parentNode);
      }
      exports.fn = function(item) {
        if (item.isElem("path") && item.hasAttr("d") && void 0 !== viewBox) {
          if (hasTransform(item) || function(path) {
            var m, regexp = /M\s*(-?\d*\.?\d+)(?!\d)\s*(-?\d*\.?\d+)/g;
            for (;null !== (m = regexp.exec(path)); ) if (m[1] >= viewBox.left && m[1] <= viewBox.right && m[2] >= viewBox.top && m[2] <= viewBox.bottom) return !0;
            return !1;
          }(item.attr("d").value)) return !0;
          var pathJS = path2js(item);
          return 2 === pathJS.length && (pathJS = JSON.parse(JSON.stringify(pathJS))).push({
            instruction: "z"
          }), intersects(viewBoxJS, pathJS);
        }
        return item.isElem("svg") && function(svg) {
          var viewBoxData = "";
          svg.hasAttr("viewBox") ? viewBoxData = svg.attr("viewBox").value : svg.hasAttr("height") && svg.hasAttr("width") && (viewBoxData = "0 0 " + svg.attr("width").value + " " + svg.attr("height").value);
          viewBoxData = viewBoxData.replace(/[,+]|px/g, " ").replace(/\s+/g, " ").replace(/^\s*|\s*$/g, "");
          var m = /^(-?\d*\.?\d+) (-?\d*\.?\d+) (\d*\.?\d+) (\d*\.?\d+)$/.exec(viewBoxData);
          if (!m) return;
          viewBox = {
            left: parseFloat(m[1]),
            top: parseFloat(m[2]),
            right: parseFloat(m[1]) + parseFloat(m[3]),
            bottom: parseFloat(m[2]) + parseFloat(m[4])
          };
          var path = (new SVGO).createContentItem({
            elem: "path",
            prefix: "",
            local: "path"
          });
          path.addAttr({
            name: "d",
            prefix: "",
            local: "d",
            value: "M" + m[1] + " " + m[2] + "h" + m[3] + "v" + m[4] + "H" + m[1] + "z"
          }), viewBoxJS = path2js(path);
        }(item), !0;
      };
    },
    1394: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes raster images (disabled by default)", 
      exports.fn = function(item) {
        if (item.isElem("image") && item.hasAttrLocal("href", /(\.|image\/)(jpg|png|gif)/)) return !1;
      };
    },
    7574: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes <script> elements (disabled by default)", 
      exports.fn = function(item) {
        return !item.isElem("script");
      };
    },
    9028: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes <style> element (disabled by default)", 
      exports.fn = function(item) {
        return !item.isElem("style");
      };
    },
    8977: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes <title>", 
      exports.fn = function(item) {
        return !item.isElem("title");
      };
    },
    387: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes unknown elements content and attributes, removes attrs with default values", 
      exports.params = {
        unknownContent: !0,
        unknownAttrs: !0,
        defaultAttrs: !0,
        uselessOverrides: !0,
        keepDataAttrs: !0,
        keepAriaAttrs: !0,
        keepRoleAttr: !1
      };
      var collections = __webpack_require__(3193), elems = collections.elems, attrsGroups = collections.attrsGroups, elemsGroups = collections.elemsGroups, attrsGroupsDefaults = collections.attrsGroupsDefaults, attrsInheritable = collections.inheritableAttrs, applyGroups = collections.presentationNonInheritableGroupAttrs;
      for (var elem in elems) (elem = elems[elem]).attrsGroups && (elem.attrs = elem.attrs || [], 
      elem.attrsGroups.forEach((function(attrsGroupName) {
        elem.attrs = elem.attrs.concat(attrsGroups[attrsGroupName]);
        var groupDefaults = attrsGroupsDefaults[attrsGroupName];
        if (groupDefaults) for (var attrName in elem.defaults = elem.defaults || {}, groupDefaults) elem.defaults[attrName] = groupDefaults[attrName];
      }))), elem.contentGroups && (elem.content = elem.content || [], elem.contentGroups.forEach((function(contentGroupName) {
        elem.content = elem.content.concat(elemsGroups[contentGroupName]);
      })));
      exports.fn = function(item, params) {
        if (item.isElem() && !item.prefix) {
          var elem = item.elem;
          params.unknownContent && !item.isEmpty() && elems[elem] && "foreignObject" !== elem && item.content.forEach((function(content, i) {
            content.isElem() && !content.prefix && (elems[elem].content && -1 === elems[elem].content.indexOf(content.elem) || !elems[elem].content && !elems[content.elem]) && item.content.splice(i, 1);
          })), elems[elem] && elems[elem].attrs && item.eachAttr((function(attr) {
            "xmlns" === attr.name || "xml" !== attr.prefix && attr.prefix || params.keepDataAttrs && 0 == attr.name.indexOf("data-") || params.keepAriaAttrs && 0 == attr.name.indexOf("aria-") || params.keepRoleAttr && "role" == attr.name || (params.unknownAttrs && -1 === elems[elem].attrs.indexOf(attr.name) || params.defaultAttrs && !item.hasAttr("id") && elems[elem].defaults && elems[elem].defaults[attr.name] === attr.value && (attrsInheritable.indexOf(attr.name) < 0 || !item.parentNode.computedAttr(attr.name)) || params.uselessOverrides && !item.hasAttr("id") && applyGroups.indexOf(attr.name) < 0 && attrsInheritable.indexOf(attr.name) > -1 && item.parentNode.computedAttr(attr.name, attr.value)) && item.removeAttr(attr.name);
          }));
        }
      };
    },
    1895: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "full", exports.active = !0, exports.description = "removes unused namespaces declaration", 
      exports.fn = function(data) {
        var svgElem, xmlnsCollection = [];
        function removeNSfromCollection(ns) {
          var pos = xmlnsCollection.indexOf(ns);
          pos > -1 && xmlnsCollection.splice(pos, 1);
        }
        return data = function monkeys(items) {
          for (var i = 0, length = items.content.length; i < length; ) {
            var item = items.content[i];
            item.isElem("svg") && (item.eachAttr((function(attr) {
              "xmlns" === attr.prefix && attr.local && xmlnsCollection.push(attr.local);
            })), xmlnsCollection.length && (svgElem = item)), xmlnsCollection.length && (item.prefix && removeNSfromCollection(item.prefix), 
            item.eachAttr((function(attr) {
              removeNSfromCollection(attr.prefix);
            }))), xmlnsCollection.length && item.content && monkeys(item), i++;
          }
          return items;
        }(data), xmlnsCollection.length && xmlnsCollection.forEach((function(name) {
          svgElem.removeAttr("xmlns:" + name);
        })), data;
      };
    },
    6053: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes elements in <defs> without id";
      var nonRendering = __webpack_require__(3193).elemsGroups.nonRendering;
      function getUsefulItems(item, usefulItems) {
        return item.content.forEach((function(child) {
          child.hasAttr("id") || child.isElem("style") ? (usefulItems.push(child), child.parentNode = item) : child.isEmpty() || (child.content = getUsefulItems(child, usefulItems));
        })), usefulItems;
      }
      exports.fn = function(item) {
        if (item.isElem("defs")) {
          if (item.content && (item.content = getUsefulItems(item, [])), item.isEmpty()) return !1;
        } else if (item.isElem(nonRendering) && !item.hasAttr("id")) return !1;
      };
    },
    7737: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes useless stroke and fill attributes", 
      exports.params = {
        stroke: !0,
        fill: !0,
        removeNone: !1,
        hasStyleOrScript: !1
      };
      var shape = __webpack_require__(3193).elemsGroups.shape, regStrokeProps = /^stroke/, regFillProps = /^fill-/, styleOrScript = [ "style", "script" ];
      exports.fn = function(item, params) {
        if (item.isElem(styleOrScript) && (params.hasStyleOrScript = !0), !params.hasStyleOrScript && item.isElem(shape) && !item.computedAttr("id")) {
          var stroke = params.stroke && item.computedAttr("stroke"), fill = params.fill && !item.computedAttr("fill", "none");
          if (params.stroke && (!stroke || "none" == stroke || item.computedAttr("stroke-opacity", "0") || item.computedAttr("stroke-width", "0"))) {
            var parentStroke = item.parentNode.computedAttr("stroke"), declineStroke = parentStroke && "none" != parentStroke;
            item.eachAttr((function(attr) {
              regStrokeProps.test(attr.name) && item.removeAttr(attr.name);
            })), declineStroke && item.addAttr({
              name: "stroke",
              value: "none",
              prefix: "",
              local: "stroke"
            });
          }
          if (!params.fill || fill && !item.computedAttr("fill-opacity", "0") || (item.eachAttr((function(attr) {
            regFillProps.test(attr.name) && item.removeAttr(attr.name);
          })), fill && (item.hasAttr("fill") ? item.attr("fill").value = "none" : item.addAttr({
            name: "fill",
            value: "none",
            prefix: "",
            local: "fill"
          }))), params.removeNone && (!stroke || item.hasAttr("stroke") && "none" == item.attr("stroke").value) && (!fill || item.hasAttr("fill") && "none" == item.attr("fill").value)) return !1;
        }
      };
    },
    5521: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes xmlns attribute (for inline svg, disabled by default)", 
      exports.fn = function(item) {
        item.isElem("svg") && item.hasAttr("xmlns") && item.removeAttr("xmlns");
      };
    },
    305: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "removes XML processing instructions", 
      exports.fn = function(item) {
        return !(item.processinginstruction && "xml" === item.processinginstruction.name);
      };
    },
    1279: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      var JSAPI = __webpack_require__(5773);
      function convertToUse(item, href) {
        return item.renameElem("use"), item.removeAttr("d"), item.removeAttr("stroke"), 
        item.removeAttr("fill"), item.addAttr({
          name: "xlink:href",
          local: "xlink:href",
          prefix: "none",
          value: "#" + href
        }), delete item.pathJS, item;
      }
      function traverse(parent, callback) {
        if (!parent.isEmpty()) for (let child of parent.content) callback(child), traverse(child, callback);
      }
      exports.type = "full", exports.active = !1, exports.description = "Finds <path> elements with the same d, fill, and stroke, and converts them to <use> elements referencing a single <path> def.", 
      exports.fn = function(data) {
        const seen = new Map;
        let count = 0;
        const defs = [];
        traverse(data, (item => {
          if (!item.isElem("path") || !item.hasAttr("d")) return;
          const d = item.attr("d").value, fill = item.hasAttr("fill") && item.attr("fill").value || "", key = d + ";s:" + (item.hasAttr("stroke") && item.attr("stroke").value || "") + ";f:" + fill, hasSeen = seen.get(key);
          hasSeen ? (hasSeen.reused || (hasSeen.reused = !0, hasSeen.elem.hasAttr("id") || hasSeen.elem.addAttr({
            name: "id",
            local: "id",
            prefix: "",
            value: "reuse-" + count++
          }), defs.push(hasSeen.elem)), item = convertToUse(item, hasSeen.elem.attr("id").value)) : seen.set(key, {
            elem: item,
            reused: !1
          });
        }));
        const defsTag = new JSAPI({
          elem: "defs",
          prefix: "",
          local: "defs",
          content: [],
          attrs: []
        }, data);
        data.content[0].spliceContent(0, 0, defsTag);
        for (let def of defs) {
          const style = def.style, defClass = def.class;
          delete def.style, delete def.class;
          const defClone = def.clone();
          def.style = style, def.class = defClass, defClone.removeAttr("transform"), defsTag.spliceContent(0, 0, defClone), 
          def = convertToUse(def, defClone.attr("id").value), def.removeAttr("id");
        }
        return data;
      };
    },
    604: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "sorts element attributes (disabled by default)", 
      exports.params = {
        order: [ "id", "width", "height", "x", "x1", "x2", "y", "y1", "y2", "cx", "cy", "r", "fill", "stroke", "marker", "d", "points" ]
      }, exports.fn = function(item, params) {
        var attrs = [], sorted = {}, orderlen = params.order.length + 1, xmlnsOrder = params.xmlnsOrder || "front";
        item.elem && (item.eachAttr((function(attr) {
          attrs.push(attr);
        })), attrs.sort((function(a, b) {
          if (a.prefix != b.prefix) {
            if ("front" == xmlnsOrder) {
              if ("xmlns" == a.prefix) return -1;
              if ("xmlns" == b.prefix) return 1;
            }
            return a.prefix < b.prefix ? -1 : 1;
          }
          for (var aindex = orderlen, bindex = orderlen, i = 0; i < params.order.length; i++) a.name == params.order[i] ? aindex = i : 0 === a.name.indexOf(params.order[i] + "-") && (aindex = i + .5), 
          b.name == params.order[i] ? bindex = i : 0 === b.name.indexOf(params.order[i] + "-") && (bindex = i + .5);
          return aindex != bindex ? aindex - bindex : a.name < b.name ? -1 : 1;
        })), attrs.forEach((function(attr) {
          sorted[attr.name] = attr;
        })), item.attrs = sorted);
      };
    },
    1409: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "Sorts children of <defs> to improve compression", 
      exports.fn = function(item) {
        if (item.isElem("defs")) {
          if (item.content) {
            var frequency = item.content.reduce((function(frequency, child) {
              return child.elem in frequency ? frequency[child.elem]++ : frequency[child.elem] = 1, 
              frequency;
            }), {});
            item.content.sort((function(a, b) {
              var frequencyComparison = frequency[b.elem] - frequency[a.elem];
              if (0 !== frequencyComparison) return frequencyComparison;
              var lengthComparison = b.elem.length - a.elem.length;
              return 0 !== lengthComparison ? lengthComparison : a.elem != b.elem ? a.elem > b.elem ? -1 : 1 : 0;
            }));
          }
          return !0;
        }
      };
    },
    9732: function(module, __unused_webpack_exports, __webpack_require__) {
      var map = {
        "./_collections": 3193,
        "./_collections.js": 3193,
        "./_path": 7050,
        "./_path.js": 7050,
        "./_transforms": 4408,
        "./_transforms.js": 4408,
        "./addAttributesToSVGElement": 4530,
        "./addAttributesToSVGElement.js": 4530,
        "./addClassesToSVGElement": 5810,
        "./addClassesToSVGElement.js": 5810,
        "./cleanupAttrs": 2423,
        "./cleanupAttrs.js": 2423,
        "./cleanupEnableBackground": 1153,
        "./cleanupEnableBackground.js": 1153,
        "./cleanupIDs": 1625,
        "./cleanupIDs.js": 1625,
        "./cleanupListOfValues": 9699,
        "./cleanupListOfValues.js": 9699,
        "./cleanupNumericValues": 2778,
        "./cleanupNumericValues.js": 2778,
        "./collapseGroups": 9132,
        "./collapseGroups.js": 9132,
        "./convertColors": 1200,
        "./convertColors.js": 1200,
        "./convertEllipseToCircle": 1009,
        "./convertEllipseToCircle.js": 1009,
        "./convertPathData": 4801,
        "./convertPathData.js": 4801,
        "./convertShapeToPath": 5221,
        "./convertShapeToPath.js": 5221,
        "./convertStyleToAttrs": 7601,
        "./convertStyleToAttrs.js": 7601,
        "./convertTransform": 3495,
        "./convertTransform.js": 3495,
        "./inlineStyles": 2114,
        "./inlineStyles.js": 2114,
        "./mergePaths": 9162,
        "./mergePaths.js": 9162,
        "./minifyStyles": 7205,
        "./minifyStyles.js": 7205,
        "./moveElemsAttrsToGroup": 1124,
        "./moveElemsAttrsToGroup.js": 1124,
        "./moveGroupAttrsToElems": 2177,
        "./moveGroupAttrsToElems.js": 2177,
        "./prefixIds": 9004,
        "./prefixIds.js": 9004,
        "./removeAttributesBySelector": 8541,
        "./removeAttributesBySelector.js": 8541,
        "./removeAttrs": 4229,
        "./removeAttrs.js": 4229,
        "./removeComments": 4771,
        "./removeComments.js": 4771,
        "./removeDesc": 6229,
        "./removeDesc.js": 6229,
        "./removeDimensions": 4285,
        "./removeDimensions.js": 4285,
        "./removeDoctype": 9116,
        "./removeDoctype.js": 9116,
        "./removeEditorsNSData": 4472,
        "./removeEditorsNSData.js": 4472,
        "./removeElementsByAttr": 7270,
        "./removeElementsByAttr.js": 7270,
        "./removeEmptyAttrs": 3304,
        "./removeEmptyAttrs.js": 3304,
        "./removeEmptyContainers": 5192,
        "./removeEmptyContainers.js": 5192,
        "./removeEmptyText": 6758,
        "./removeEmptyText.js": 6758,
        "./removeHiddenElems": 3514,
        "./removeHiddenElems.js": 3514,
        "./removeMetadata": 750,
        "./removeMetadata.js": 750,
        "./removeNonInheritableGroupAttrs": 60,
        "./removeNonInheritableGroupAttrs.js": 60,
        "./removeOffCanvasPaths": 4217,
        "./removeOffCanvasPaths.js": 4217,
        "./removeRasterImages": 1394,
        "./removeRasterImages.js": 1394,
        "./removeScriptElement": 7574,
        "./removeScriptElement.js": 7574,
        "./removeStyleElement": 9028,
        "./removeStyleElement.js": 9028,
        "./removeTitle": 8977,
        "./removeTitle.js": 8977,
        "./removeUnknownsAndDefaults": 387,
        "./removeUnknownsAndDefaults.js": 387,
        "./removeUnusedNS": 1895,
        "./removeUnusedNS.js": 1895,
        "./removeUselessDefs": 6053,
        "./removeUselessDefs.js": 6053,
        "./removeUselessStrokeAndFill": 7737,
        "./removeUselessStrokeAndFill.js": 7737,
        "./removeViewBox": 8596,
        "./removeViewBox.js": 8596,
        "./removeXMLNS": 5521,
        "./removeXMLNS.js": 5521,
        "./removeXMLProcInst": 305,
        "./removeXMLProcInst.js": 305,
        "./reusePaths": 1279,
        "./reusePaths.js": 1279,
        "./sortAttrs": 604,
        "./sortAttrs.js": 604,
        "./sortDefsChildren": 1409,
        "./sortDefsChildren.js": 1409
      };
      function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
      }
      function webpackContextResolve(req) {
        if (!__webpack_require__.o(map, req)) {
          var e = new Error("Cannot find module '" + req + "'");
          throw e.code = "MODULE_NOT_FOUND", e;
        }
        return map[req];
      }
      webpackContext.keys = function() {
        return Object.keys(map);
      }, webpackContext.resolve = webpackContextResolve, module.exports = webpackContext, 
      webpackContext.id = 9732;
    },
    2793: function(module) {
      var reg = /[\'\"]/;
      module.exports = function(str) {
        return str ? (reg.test(str.charAt(0)) && (str = str.substr(1)), reg.test(str.charAt(str.length - 1)) && (str = str.substr(0, str.length - 1)), 
        str) : "";
      };
    },
    8596: function(__unused_webpack_module, exports) {
      "use strict";
      exports.type = "perItem", exports.active = !1, exports.description = "removes viewBox attribute when possible";
      var viewBoxElems = [ "svg", "pattern", "symbol" ];
      exports.fn = function(item) {
        if (item.isElem(viewBoxElems) && item.hasAttr("viewBox") && item.hasAttr("width") && item.hasAttr("height")) {
          var nums = item.attr("viewBox").value.split(/[ ,]+/g);
          "0" === nums[0] && "0" === nums[1] && item.attr("width").value.replace(/px$/, "") === nums[2] && item.attr("height").value.replace(/px$/, "") === nums[3] && item.removeAttr("viewBox");
        }
      };
    },
    4801: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      exports.type = "perItem", exports.active = !0, exports.description = "optimizes path data: writes in shorter form, applies transformations", 
      exports.params = {
        applyTransforms: !0,
        applyTransformsStroked: !0,
        makeArcs: {
          threshold: 2.5,
          tolerance: .5
        },
        straightCurves: !0,
        lineShorthands: !0,
        curveSmoothShorthands: !1,
        floatPrecision: 3,
        transformPrecision: 5,
        removeUseless: !0,
        collapseRepeated: !0,
        utilizeAbsolute: !0,
        leadingZero: !0,
        negativeExtraSpace: !0,
        noSpaceAfterFlags: !1,
        forceAbsolutePath: !1
      };
      var roundData, precision, error, arcThreshold, arcTolerance, hasMarkerMid, hasStrokeLinecap, pathElems = __webpack_require__(3193).pathElems, path2js = __webpack_require__(7050).path2js, js2path = __webpack_require__(7050).js2path, applyTransforms = __webpack_require__(7050).applyTransforms, cleanupOutData = __webpack_require__(8665).Kr;
      function isConvex(data) {
        var center = getIntersection([ 0, 0, data[2], data[3], data[0], data[1], data[4], data[5] ]);
        return center && data[2] < center[0] == center[0] < 0 && data[3] < center[1] == center[1] < 0 && data[4] < center[0] == center[0] < data[0] && data[5] < center[1] == center[1] < data[1];
      }
      function getIntersection(coords) {
        var a1 = coords[1] - coords[3], b1 = coords[2] - coords[0], c1 = coords[0] * coords[3] - coords[2] * coords[1], a2 = coords[5] - coords[7], b2 = coords[6] - coords[4], c2 = coords[4] * coords[7] - coords[5] * coords[6], denom = a1 * b2 - a2 * b1;
        if (denom) {
          var cross = [ (b1 * c2 - b2 * c1) / denom, (a1 * c2 - a2 * c1) / -denom ];
          return !isNaN(cross[0]) && !isNaN(cross[1]) && isFinite(cross[0]) && isFinite(cross[1]) ? cross : void 0;
        }
      }
      function strongRound(data) {
        for (var i = data.length; i-- > 0; ) if (data[i].toFixed(precision) != data[i]) {
          var rounded = +data[i].toFixed(precision - 1);
          data[i] = +Math.abs(rounded - data[i]).toFixed(precision + 1) >= error ? +data[i].toFixed(precision) : rounded;
        }
        return data;
      }
      function round(data) {
        for (var i = data.length; i-- > 0; ) data[i] = Math.round(data[i]);
        return data;
      }
      function isCurveStraightLine(data) {
        var i = data.length - 2, a = -data[i + 1], b = data[i], d = 1 / (a * a + b * b);
        if (i <= 1 || !isFinite(d)) return !1;
        for (;(i -= 2) >= 0; ) if (Math.sqrt(Math.pow(a * data[i] + b * data[i + 1], 2) * d) > error) return !1;
        return !0;
      }
      function makeLonghand(item, data) {
        switch (item.instruction) {
         case "s":
          item.instruction = "c";
          break;

         case "t":
          item.instruction = "q";
        }
        return item.data.unshift(data[data.length - 2] - data[data.length - 4], data[data.length - 1] - data[data.length - 3]), 
        item;
      }
      function getDistance(point1, point2) {
        return Math.hypot(point1[0] - point2[0], point1[1] - point2[1]);
      }
      function getCubicBezierPoint(curve, t) {
        var sqrT = t * t, cubT = sqrT * t, mt = 1 - t, sqrMt = mt * mt;
        return [ 3 * sqrMt * t * curve[0] + 3 * mt * sqrT * curve[2] + cubT * curve[4], 3 * sqrMt * t * curve[1] + 3 * mt * sqrT * curve[3] + cubT * curve[5] ];
      }
      function isArc(curve, circle) {
        var tolerance = Math.min(arcThreshold * error, arcTolerance * circle.radius / 100);
        return [ 0, 1 / 4, .5, 3 / 4, 1 ].every((function(point) {
          return Math.abs(getDistance(getCubicBezierPoint(curve, point), circle.center) - circle.radius) <= tolerance;
        }));
      }
      function isArcPrev(curve, circle) {
        return isArc(curve, {
          center: [ circle.center[0] + curve[4], circle.center[1] + curve[5] ],
          radius: circle.radius
        });
      }
      function findArcAngle(curve, relCircle) {
        var x1 = -relCircle.center[0], y1 = -relCircle.center[1], x2 = curve[4] - relCircle.center[0], y2 = curve[5] - relCircle.center[1];
        return Math.acos((x1 * x2 + y1 * y2) / Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)));
      }
      function data2Path(params, pathData) {
        return pathData.reduce((function(pathString, item) {
          var strData = "";
          return item.data && (strData = cleanupOutData(roundData(item.data.slice()), params)), 
          pathString + item.instruction + strData;
        }), "");
      }
      exports.fn = function(item, params) {
        if (item.isElem(pathElems) && item.hasAttr("d")) {
          precision = params.floatPrecision, error = !1 !== precision ? +Math.pow(.1, precision).toFixed(precision) : .01, 
          roundData = precision > 0 && precision < 20 ? strongRound : round, params.makeArcs && (arcThreshold = params.makeArcs.threshold, 
          arcTolerance = params.makeArcs.tolerance), hasMarkerMid = item.hasAttr("marker-mid");
          var stroke = item.computedAttr("stroke"), strokeLinecap = item.computedAttr("stroke");
          hasStrokeLinecap = stroke && "none" != stroke && strokeLinecap && "butt" != strokeLinecap;
          var data = path2js(item);
          data.length && (point = [ 0, 0 ], subpathPoint = [ 0, 0 ], (path = data).forEach((function(item, index) {
            var instruction = item.instruction, data = item.data;
            data ? ("mcslqta".indexOf(instruction) > -1 ? (point[0] += data[data.length - 2], 
            point[1] += data[data.length - 1], "m" === instruction && (subpathPoint[0] = point[0], 
            subpathPoint[1] = point[1], baseItem = item)) : "h" === instruction ? point[0] += data[0] : "v" === instruction && (point[1] += data[0]), 
            "M" === instruction ? (index > 0 && (instruction = "m"), data[0] -= point[0], data[1] -= point[1], 
            subpathPoint[0] = point[0] += data[0], subpathPoint[1] = point[1] += data[1], baseItem = item) : "LT".indexOf(instruction) > -1 ? (instruction = instruction.toLowerCase(), 
            data[0] -= point[0], data[1] -= point[1], point[0] += data[0], point[1] += data[1]) : "C" === instruction ? (instruction = "c", 
            data[0] -= point[0], data[1] -= point[1], data[2] -= point[0], data[3] -= point[1], 
            data[4] -= point[0], data[5] -= point[1], point[0] += data[4], point[1] += data[5]) : "SQ".indexOf(instruction) > -1 ? (instruction = instruction.toLowerCase(), 
            data[0] -= point[0], data[1] -= point[1], data[2] -= point[0], data[3] -= point[1], 
            point[0] += data[2], point[1] += data[3]) : "A" === instruction ? (instruction = "a", 
            data[5] -= point[0], data[6] -= point[1], point[0] += data[5], point[1] += data[6]) : "H" === instruction ? (instruction = "h", 
            data[0] -= point[0], point[0] += data[0]) : "V" === instruction && (instruction = "v", 
            data[0] -= point[1], point[1] += data[0]), item.instruction = instruction, item.data = data, 
            item.coords = point.slice(-2)) : "z" == instruction && (baseItem && (item.coords = baseItem.coords), 
            point[0] = subpathPoint[0], point[1] = subpathPoint[1]), item.base = index > 0 ? path[index - 1].coords : [ 0, 0 ];
          })), params.applyTransforms && (data = applyTransforms(item, data, params)), data = function(path, params) {
            var stringify = data2Path.bind(null, params), relSubpoint = [ 0, 0 ], pathBase = [ 0, 0 ], prev = {};
            return path = path.filter((function(item, index, path) {
              var instruction = item.instruction, data = item.data, next = path[index + 1];
              if (data) {
                var circle, sdata = data;
                if ("s" === instruction && (sdata = [ 0, 0 ].concat(data), "cs".indexOf(prev.instruction) > -1)) {
                  var pdata = prev.data, n = pdata.length;
                  sdata[0] = pdata[n - 2] - pdata[n - 4], sdata[1] = pdata[n - 1] - pdata[n - 3];
                }
                if (params.makeArcs && ("c" == instruction || "s" == instruction) && isConvex(sdata) && (circle = function(curve) {
                  var midPoint = getCubicBezierPoint(curve, .5), m1 = [ midPoint[0] / 2, midPoint[1] / 2 ], m2 = [ (midPoint[0] + curve[4]) / 2, (midPoint[1] + curve[5]) / 2 ], center = getIntersection([ m1[0], m1[1], m1[0] + m1[1], m1[1] - m1[0], m2[0], m2[1], m2[0] + (m2[1] - midPoint[1]), m2[1] - (m2[0] - midPoint[0]) ]), radius = center && getDistance([ 0, 0 ], center), tolerance = Math.min(arcThreshold * error, arcTolerance * radius / 100);
                  if (center && radius < 1e15 && [ 1 / 4, 3 / 4 ].every((function(point) {
                    return Math.abs(getDistance(getCubicBezierPoint(curve, point), center) - radius) <= tolerance;
                  }))) return {
                    center: center,
                    radius: radius
                  };
                }(sdata))) {
                  var nextLonghand, r = roundData([ circle.radius ])[0], angle = findArcAngle(sdata, circle), sweep = sdata[5] * sdata[0] - sdata[4] * sdata[1] > 0 ? 1 : 0, arc = {
                    instruction: "a",
                    data: [ r, r, 0, 0, sweep, sdata[4], sdata[5] ],
                    coords: item.coords.slice(),
                    base: item.base
                  }, output = [ arc ], relCenter = [ circle.center[0] - sdata[4], circle.center[1] - sdata[5] ], relCircle = {
                    center: relCenter,
                    radius: circle.radius
                  }, arcCurves = [ item ], hasPrev = 0, suffix = "";
                  if ("c" == prev.instruction && isConvex(prev.data) && isArcPrev(prev.data, circle) || "a" == prev.instruction && prev.sdata && isArcPrev(prev.sdata, circle)) {
                    arcCurves.unshift(prev), arc.base = prev.base, arc.data[5] = arc.coords[0] - arc.base[0], 
                    arc.data[6] = arc.coords[1] - arc.base[1];
                    var prevData = "a" == prev.instruction ? prev.sdata : prev.data;
                    (angle += findArcAngle(prevData, {
                      center: [ prevData[4] + circle.center[0], prevData[5] + circle.center[1] ],
                      radius: circle.radius
                    })) > Math.PI && (arc.data[3] = 1), hasPrev = 1;
                  }
                  for (var j = index; (next = path[++j]) && ~"cs".indexOf(next.instruction); ) {
                    var nextData = next.data;
                    if ("s" == next.instruction && (nextData = (nextLonghand = makeLonghand({
                      instruction: "s",
                      data: next.data.slice()
                    }, path[j - 1].data)).data, nextLonghand.data = nextData.slice(0, 2), suffix = stringify([ nextLonghand ])), 
                    !isConvex(nextData) || !isArc(nextData, relCircle)) break;
                    if ((angle += findArcAngle(nextData, relCircle)) - 2 * Math.PI > .001) break;
                    if (angle > Math.PI && (arc.data[3] = 1), arcCurves.push(next), !(2 * Math.PI - angle > .001)) {
                      arc.data[5] = 2 * (relCircle.center[0] - nextData[4]), arc.data[6] = 2 * (relCircle.center[1] - nextData[5]), 
                      arc.coords = [ arc.base[0] + arc.data[5], arc.base[1] + arc.data[6] ], arc = {
                        instruction: "a",
                        data: [ r, r, 0, 0, sweep, next.coords[0] - arc.coords[0], next.coords[1] - arc.coords[1] ],
                        coords: next.coords,
                        base: arc.coords
                      }, output.push(arc), j++;
                      break;
                    }
                    arc.coords = next.coords, arc.data[5] = arc.coords[0] - arc.base[0], arc.data[6] = arc.coords[1] - arc.base[1], 
                    relCenter[0] -= nextData[4], relCenter[1] -= nextData[5];
                  }
                  if ((stringify(output) + suffix).length < stringify(arcCurves).length) {
                    if (path[j] && "s" == path[j].instruction && makeLonghand(path[j], path[j - 1].data), 
                    hasPrev) {
                      var prevArc = output.shift();
                      roundData(prevArc.data), relSubpoint[0] += prevArc.data[5] - prev.data[prev.data.length - 2], 
                      relSubpoint[1] += prevArc.data[6] - prev.data[prev.data.length - 1], prev.instruction = "a", 
                      prev.data = prevArc.data, item.base = prev.coords = prevArc.coords;
                    }
                    if (arc = output.shift(), 1 == arcCurves.length ? item.sdata = sdata.slice() : arcCurves.length - 1 - hasPrev > 0 && path.splice.apply(path, [ index + 1, arcCurves.length - 1 - hasPrev ].concat(output)), 
                    !arc) return !1;
                    instruction = "a", data = arc.data, item.coords = arc.coords;
                  }
                }
                if (!1 !== precision) {
                  if ("mltqsc".indexOf(instruction) > -1) for (var i = data.length; i--; ) data[i] += item.base[i % 2] - relSubpoint[i % 2]; else "h" == instruction ? data[0] += item.base[0] - relSubpoint[0] : "v" == instruction ? data[0] += item.base[1] - relSubpoint[1] : "a" == instruction && (data[5] += item.base[0] - relSubpoint[0], 
                  data[6] += item.base[1] - relSubpoint[1]);
                  roundData(data), "h" == instruction ? relSubpoint[0] += data[0] : "v" == instruction ? relSubpoint[1] += data[0] : (relSubpoint[0] += data[data.length - 2], 
                  relSubpoint[1] += data[data.length - 1]), roundData(relSubpoint), "m" == instruction.toLowerCase() && (pathBase[0] = relSubpoint[0], 
                  pathBase[1] = relSubpoint[1]);
                }
                if (params.straightCurves && ("c" === instruction && isCurveStraightLine(data) || "s" === instruction && isCurveStraightLine(sdata) ? (next && "s" == next.instruction && makeLonghand(next, data), 
                instruction = "l", data = data.slice(-2)) : "q" === instruction && isCurveStraightLine(data) ? (next && "t" == next.instruction && makeLonghand(next, data), 
                instruction = "l", data = data.slice(-2)) : "t" === instruction && "q" !== prev.instruction && "t" !== prev.instruction ? (instruction = "l", 
                data = data.slice(-2)) : "a" !== instruction || 0 !== data[0] && 0 !== data[1] || (instruction = "l", 
                data = data.slice(-2))), params.lineShorthands && "l" === instruction && (0 === data[1] ? (instruction = "h", 
                data.pop()) : 0 === data[0] && (instruction = "v", data.shift())), params.collapseRepeated && !hasMarkerMid && "mhv".indexOf(instruction) > -1 && prev.instruction && instruction == prev.instruction.toLowerCase() && ("h" != instruction && "v" != instruction || prev.data[0] >= 0 == item.data[0] >= 0)) return prev.data[0] += data[0], 
                "h" != instruction && "v" != instruction && (prev.data[1] += data[1]), prev.coords = item.coords, 
                path[index] = prev, !1;
                if (params.curveSmoothShorthands && prev.instruction && ("c" === instruction ? ("c" === prev.instruction && data[0] === -(prev.data[2] - prev.data[4]) && data[1] === -(prev.data[3] - prev.data[5]) || "s" === prev.instruction && data[0] === -(prev.data[0] - prev.data[2]) && data[1] === -(prev.data[1] - prev.data[3]) || -1 === "cs".indexOf(prev.instruction) && 0 === data[0] && 0 === data[1]) && (instruction = "s", 
                data = data.slice(2)) : "q" === instruction && ("q" === prev.instruction && data[0] === prev.data[2] - prev.data[0] && data[1] === prev.data[3] - prev.data[1] || "t" === prev.instruction && data[2] === prev.data[0] && data[3] === prev.data[1]) && (instruction = "t", 
                data = data.slice(2))), params.removeUseless && !hasStrokeLinecap) {
                  if ("lhvqtcs".indexOf(instruction) > -1 && data.every((function(i) {
                    return 0 === i;
                  }))) return path[index] = prev, !1;
                  if ("a" === instruction && 0 === data[5] && 0 === data[6]) return path[index] = prev, 
                  !1;
                }
                item.instruction = instruction, item.data = data, prev = item;
              } else {
                if (relSubpoint[0] = pathBase[0], relSubpoint[1] = pathBase[1], "z" == prev.instruction) return !1;
                prev = item;
              }
              return !0;
            })), path;
          }(data, params), params.utilizeAbsolute && (data = function(path, params) {
            var prev = path[0];
            return path = path.filter((function(item, index) {
              if (0 == index) return !0;
              if (!item.data) return prev = item, !0;
              var instruction = item.instruction, data = item.data, adata = data && data.slice(0);
              if ("mltqsc".indexOf(instruction) > -1) for (var i = adata.length; i--; ) adata[i] += item.base[i % 2]; else "h" == instruction ? adata[0] += item.base[0] : "v" == instruction ? adata[0] += item.base[1] : "a" == instruction && (adata[5] += item.base[0], 
              adata[6] += item.base[1]);
              roundData(adata);
              var absoluteDataStr = cleanupOutData(adata, params), relativeDataStr = cleanupOutData(data, params);
              return (params.forceAbsolutePath || absoluteDataStr.length < relativeDataStr.length && !(params.negativeExtraSpace && instruction == prev.instruction && prev.instruction.charCodeAt(0) > 96 && absoluteDataStr.length == relativeDataStr.length - 1 && (data[0] < 0 || /^0\./.test(data[0]) && prev.data[prev.data.length - 1] % 1))) && (item.instruction = instruction.toUpperCase(), 
              item.data = adata), prev = item, !0;
            })), path;
          }(data, params)), js2path(item, data, params));
        }
        var path, baseItem, point, subpathPoint;
      };
    },
    5263: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      var FS = __webpack_require__(7147), PATH = __webpack_require__(1017), yaml = __webpack_require__(5251);
      function preparePluginsArray(config, plugins) {
        var plugin, key;
        return plugins.map((function(item) {
          return "object" == typeof item ? "object" == typeof item[key = Object.keys(item)[0]] && item[key].fn && "function" == typeof item[key].fn ? plugin = setupCustomPlugin(key, item[key]) : (plugin = setPluginActiveState(loadPlugin(config, key, item[key].path), item, key)).name = key : ((plugin = loadPlugin(config, item)).name = item, 
          "object" == typeof plugin.params && (plugin.params = Object.assign({}, plugin.params))), 
          plugin;
        }));
      }
      function setupCustomPlugin(name, plugin) {
        return plugin.active = !0, plugin.params = Object.assign({}, plugin.params || {}), 
        plugin.name = name, plugin;
      }
      function setPluginActiveState(plugin, item, key) {
        return "object" == typeof item[key] ? (plugin.params = Object.assign({}, plugin.params || {}, item[key]), 
        plugin.active = !0) : !1 === item[key] ? plugin.active = !1 : !0 === item[key] && (plugin.active = !0), 
        plugin;
      }
      function loadPlugin(config, name, path) {
        var plugin;
        return plugin = path ? require(PATH.resolve(config.__DIR, path)) : __webpack_require__(9732)("./" + name), 
        Object.assign({}, plugin);
      }
      module.exports = function(config) {
        var defaults, prev;
        return (config = "object" == typeof config && config || {}).plugins && !Array.isArray(config.plugins) ? {
          error: "Error: Invalid plugins list. Provided 'plugins' in config should be an array."
        } : (config.full ? (defaults = config, Array.isArray(defaults.plugins) && (defaults.plugins = preparePluginsArray(config, defaults.plugins))) : ((defaults = Object.assign({}, yaml.safeLoad(FS.readFileSync(PATH.resolve(__dirname, "../.svgo.yml"), "utf8")))).plugins = preparePluginsArray(config, defaults.plugins || []), 
        defaults = function(defaults, config) {
          var key;
          config.plugins && config.plugins.forEach((function(item) {
            "object" == typeof item && (key = Object.keys(item)[0], null == item[key] && console.error(`Error: '${key}' plugin is misconfigured! Have you padded its content in YML properly?\n`), 
            "object" == typeof item[key] && item[key].fn && "function" == typeof item[key].fn ? defaults.plugins.push(setupCustomPlugin(key, item[key])) : "object" == typeof item[key] && item[key].path ? defaults.plugins.push(setPluginActiveState(loadPlugin(config, void 0, item[key].path), item, key)) : defaults.plugins.forEach((function(plugin) {
              plugin.name === key && (plugin = setPluginActiveState(plugin, item, key));
            })));
          }));
          defaults.multipass = config.multipass, config.svg2js && (defaults.svg2js = config.svg2js);
          config.js2svg && (defaults.js2svg = config.js2svg);
          return defaults;
        }(defaults, config)), "floatPrecision" in config && Array.isArray(defaults.plugins) && defaults.plugins.forEach((function(plugin) {
          plugin.params && "floatPrecision" in plugin.params && (plugin.params = Object.assign({}, plugin.params, {
            floatPrecision: config.floatPrecision
          }));
        })), "datauri" in config && (defaults.datauri = config.datauri), Array.isArray(defaults.plugins) && (defaults.plugins = defaults.plugins.reduce((function(plugins, item) {
          return prev && item.type == prev[0].type ? prev.push(item) : plugins.push(prev = [ item ]), 
          plugins;
        }), [])), defaults);
      };
    },
    2565: function(module) {
      "use strict";
      module.exports = require("./index");
    },
    5853: function(module) {
      "use strict";
      module.exports = require("./vendor/css-select");
    },
    904: function(module) {
      "use strict";
      module.exports = require("./vendor/css-tree");
    },
    1944: function(module) {
      "use strict";
      module.exports = require("./vendor/csso");
    },
    5251: function(module) {
      "use strict";
      module.exports = require("./vendor/js-yaml");
    },
    7147: function(module) {
      "use strict";
      module.exports = require("fs");
    },
    1017: function(module) {
      "use strict";
      module.exports = require("path");
    }
  }, __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
    module.exports;
  }
  __webpack_require__.o = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
  var __webpack_exports__ = __webpack_require__(5263);
  module.exports = __webpack_exports__;
}();