(() => {
  var __webpack_modules__ = {
    9997: (module, __unused_webpack_exports, __webpack_require__) => {
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
                  atrule,
                  rule,
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
        return elem.children.length > 0 && ("text" === elem.children[0].type || "cdata" === elem.children[0].type) ? elem.children[0].value : "";
      }, module.exports.setCssStr = function(elem, css) {
        return 0 === elem.children.length && elem.children.push({
          type: "text",
          value: ""
        }), "text" !== elem.children[0].type && "cdata" !== elem.children[0].type || (elem.children[0].value = css), 
        css;
      };
    },
    3527: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const SAX = __webpack_require__(1263), JSAPI = __webpack_require__(4267), {textElems} = __webpack_require__(6556);
      class SvgoParserError extends Error {
        constructor(message, line, column, source, file) {
          super(message), this.name = "SvgoParserError", this.message = `${file || "<input>"}:${line}:${column}: ${message}`, 
          this.reason = message, this.line = line, this.column = column, this.source = source, 
          Error.captureStackTrace && Error.captureStackTrace(this, SvgoParserError);
        }
        toString() {
          const lines = this.source.split(/\r?\n/), startLine = Math.max(this.line - 3, 0), endLine = Math.min(this.line + 2, lines.length), lineNumberWidth = String(endLine).length, startColumn = Math.max(this.column - 54, 0), endColumn = Math.max(this.column + 20, 80), code = lines.slice(startLine, endLine).map(((line, index) => {
            const lineSlice = line.slice(startColumn, endColumn);
            let ellipsisPrefix = "", ellipsisSuffix = "";
            0 !== startColumn && (ellipsisPrefix = startColumn > line.length - 1 ? " " : "…"), 
            endColumn < line.length - 1 && (ellipsisSuffix = "…");
            const number = startLine + 1 + index, gutter = ` ${number.toString().padStart(lineNumberWidth)} | `;
            if (number === this.line) {
              const gutterSpacing = gutter.replace(/[^|]/g, " ");
              return `>${gutter}${ellipsisPrefix}${lineSlice}${ellipsisSuffix}\n ${gutterSpacing + (ellipsisPrefix + line.slice(startColumn, this.column - 1)).replace(/[^\t]/g, " ")}^`;
            }
            return ` ${gutter}${ellipsisPrefix}${lineSlice}${ellipsisSuffix}`;
          })).join("\n");
          return `${this.name}: ${this.message}\n\n${code}\n`;
        }
      }
      const entityDeclaration = /<!ENTITY\s+(\S+)\s+(?:'([^']+)'|"([^"]+)")\s*>/g, config = {
        strict: !0,
        trim: !1,
        normalize: !1,
        lowercase: !0,
        xmlns: !0,
        position: !0
      };
      exports.parseSvg = (data, from) => {
        const sax = SAX.parser(config.strict, config), root = new JSAPI({
          type: "root",
          children: []
        });
        let current = root;
        const stack = [ root ], pushToContent = node => {
          const wrapped = new JSAPI(node, current);
          return current.children.push(wrapped), wrapped;
        };
        return sax.ondoctype = doctype => {
          pushToContent({
            type: "doctype",
            name: "svg",
            data: {
              doctype
            }
          });
          const subsetStart = doctype.indexOf("[");
          if (subsetStart >= 0) {
            entityDeclaration.lastIndex = subsetStart;
            let entityMatch = entityDeclaration.exec(data);
            for (;null != entityMatch; ) sax.ENTITIES[entityMatch[1]] = entityMatch[2] || entityMatch[3], 
            entityMatch = entityDeclaration.exec(data);
          }
        }, sax.onprocessinginstruction = data => {
          const node = {
            type: "instruction",
            name: data.name,
            value: data.body
          };
          pushToContent(node);
        }, sax.oncomment = comment => {
          const node = {
            type: "comment",
            value: comment.trim()
          };
          pushToContent(node);
        }, sax.oncdata = cdata => {
          pushToContent({
            type: "cdata",
            value: cdata
          });
        }, sax.onopentag = data => {
          let element = {
            type: "element",
            name: data.name,
            attributes: {},
            children: []
          };
          for (const [name, attr] of Object.entries(data.attributes)) element.attributes[name] = attr.value;
          element = pushToContent(element), current = element, stack.push(element);
        }, sax.ontext = text => {
          if ("element" === current.type) if (textElems.includes(current.name)) {
            pushToContent({
              type: "text",
              value: text
            });
          } else if (/\S/.test(text)) {
            const node = {
              type: "text",
              value: text.trim()
            };
            pushToContent(node);
          }
        }, sax.onclosetag = () => {
          stack.pop(), current = stack[stack.length - 1];
        }, sax.onerror = e => {
          const error = new SvgoParserError(e.reason, e.line + 1, e.column, data, from);
          if (-1 === e.message.indexOf("Unexpected end")) throw error;
        }, sax.write(data).close(), root;
      };
    },
    1604: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {textElems} = __webpack_require__(6556), defaults = {
        doctypeStart: "<!DOCTYPE",
        doctypeEnd: ">",
        procInstStart: "<?",
        procInstEnd: "?>",
        tagOpenStart: "<",
        tagOpenEnd: ">",
        tagCloseStart: "</",
        tagCloseEnd: ">",
        tagShortStart: "<",
        tagShortEnd: "/>",
        attrStart: '="',
        attrEnd: '"',
        commentStart: "\x3c!--",
        commentEnd: "--\x3e",
        cdataStart: "<![CDATA[",
        cdataEnd: "]]>",
        textStart: "",
        textEnd: "",
        indent: 4,
        regEntities: /[&'"<>]/g,
        regValEntities: /[&"<>]/g,
        encodeEntity: char => entities[char],
        pretty: !1,
        useShortTags: !0,
        eol: "lf",
        finalNewline: !1
      }, entities = {
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
        ">": "&gt;",
        "<": "&lt;"
      };
      exports.stringifySvg = (data, userOptions = {}) => {
        const config = {
          ...defaults,
          ...userOptions
        }, indent = config.indent;
        let newIndent = "    ";
        "number" == typeof indent && !1 === Number.isNaN(indent) ? newIndent = indent < 0 ? "\t" : " ".repeat(indent) : "string" == typeof indent && (newIndent = indent);
        const state = {
          width: void 0,
          height: void 0,
          indent: newIndent,
          textContext: null,
          indentLevel: 0
        }, eol = "crlf" === config.eol ? "\r\n" : "\n";
        config.pretty && (config.doctypeEnd += eol, config.procInstEnd += eol, config.commentEnd += eol, 
        config.cdataEnd += eol, config.tagShortEnd += eol, config.tagOpenEnd += eol, config.tagCloseEnd += eol, 
        config.textEnd += eol);
        let svg = stringifyNode(data, config, state);
        return config.finalNewline && svg.length > 0 && "\n" !== svg[svg.length - 1] && (svg += eol), 
        {
          data: svg,
          info: {
            width: state.width,
            height: state.height
          }
        };
      };
      const stringifyNode = (data, config, state) => {
        let svg = "";
        state.indentLevel += 1;
        for (const item of data.children) "element" === item.type && (svg += stringifyElement(item, config, state)), 
        "text" === item.type && (svg += stringifyText(item, config, state)), "doctype" === item.type && (svg += stringifyDoctype(item, config)), 
        "instruction" === item.type && (svg += stringifyInstruction(item, config)), "comment" === item.type && (svg += stringifyComment(item, config)), 
        "cdata" === item.type && (svg += stringifyCdata(item, config, state));
        return state.indentLevel -= 1, svg;
      }, createIndent = (config, state) => {
        let indent = "";
        return config.pretty && null == state.textContext && (indent = state.indent.repeat(state.indentLevel - 1)), 
        indent;
      }, stringifyDoctype = (node, config) => config.doctypeStart + node.data.doctype + config.doctypeEnd, stringifyInstruction = (node, config) => config.procInstStart + node.name + " " + node.value + config.procInstEnd, stringifyComment = (node, config) => config.commentStart + node.value + config.commentEnd, stringifyCdata = (node, config, state) => createIndent(config, state) + config.cdataStart + node.value + config.cdataEnd, stringifyElement = (node, config, state) => {
        if ("svg" === node.name && null != node.attributes.width && null != node.attributes.height && (state.width = node.attributes.width, 
        state.height = node.attributes.height), 0 === node.children.length) return config.useShortTags ? createIndent(config, state) + config.tagShortStart + node.name + stringifyAttributes(node, config) + config.tagShortEnd : createIndent(config, state) + config.tagShortStart + node.name + stringifyAttributes(node, config) + config.tagOpenEnd + config.tagCloseStart + node.name + config.tagCloseEnd;
        {
          let tagOpenStart = config.tagOpenStart, tagOpenEnd = config.tagOpenEnd, tagCloseStart = config.tagCloseStart, tagCloseEnd = config.tagCloseEnd, openIndent = createIndent(config, state), closeIndent = createIndent(config, state);
          state.textContext ? (tagOpenStart = defaults.tagOpenStart, tagOpenEnd = defaults.tagOpenEnd, 
          tagCloseStart = defaults.tagCloseStart, tagCloseEnd = defaults.tagCloseEnd, openIndent = "") : textElems.includes(node.name) && (tagOpenEnd = defaults.tagOpenEnd, 
          tagCloseStart = defaults.tagCloseStart, closeIndent = "", state.textContext = node);
          const children = stringifyNode(node, config, state);
          return state.textContext === node && (state.textContext = null), openIndent + tagOpenStart + node.name + stringifyAttributes(node, config) + tagOpenEnd + children + closeIndent + tagCloseStart + node.name + tagCloseEnd;
        }
      }, stringifyAttributes = (node, config) => {
        let attrs = "";
        for (const [name, value] of Object.entries(node.attributes)) if (void 0 !== value) {
          const encodedValue = value.toString().replace(config.regValEntities, config.encodeEntity);
          attrs += " " + name + config.attrStart + encodedValue + config.attrEnd;
        } else attrs += " " + name;
        return attrs;
      }, stringifyText = (node, config, state) => createIndent(config, state) + config.textStart + node.value.replace(config.regEntities, config.encodeEntity) + (state.textContext ? "" : config.textEnd);
    },
    2297: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {defaultPlugins, resolvePluginConfig, extendDefaultPlugins} = __webpack_require__(5001), {parseSvg} = __webpack_require__(3527), {stringifySvg} = __webpack_require__(1604), {invokePlugins} = __webpack_require__(4096), JSAPI = __webpack_require__(4267), {encodeSVGDatauri} = __webpack_require__(2199);
      exports.extendDefaultPlugins = extendDefaultPlugins;
      exports.optimize = (input, config) => {
        if (null == config && (config = {}), "object" != typeof config) throw Error("Config should be an object");
        const maxPassCount = config.multipass ? 10 : 1;
        let prevResultSize = Number.POSITIVE_INFINITY, svgjs = null;
        const info = {};
        null != config.path && (info.path = config.path);
        for (let i = 0; i < maxPassCount; i += 1) {
          info.multipassCount = i;
          try {
            svgjs = parseSvg(input, config.path);
          } catch (error) {
            return {
              error: error.toString(),
              modernError: error
            };
          }
          if (null != svgjs.error) return null != config.path && (svgjs.path = config.path), 
          svgjs;
          const plugins = config.plugins || defaultPlugins;
          if (!1 === Array.isArray(plugins)) throw Error("Invalid plugins list. Provided 'plugins' in config should be an array.");
          const resolvedPlugins = plugins.map(resolvePluginConfig), globalOverrides = {};
          if (null != config.floatPrecision && (globalOverrides.floatPrecision = config.floatPrecision), 
          svgjs = invokePlugins(svgjs, info, resolvedPlugins, null, globalOverrides), svgjs = stringifySvg(svgjs, config.js2svg), 
          !(svgjs.data.length < prevResultSize)) return config.datauri && (svgjs.data = encodeSVGDatauri(svgjs.data, config.datauri)), 
          null != config.path && (svgjs.path = config.path), svgjs;
          input = svgjs.data, prevResultSize = svgjs.data.length;
        }
        return svgjs;
      };
      exports.createContentItem = data => new JSAPI(data);
    },
    5001: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const pluginsMap = __webpack_require__(128), pluginsOrder = [ "removeDoctype", "removeXMLProcInst", "removeComments", "removeMetadata", "removeXMLNS", "removeEditorsNSData", "cleanupAttrs", "mergeStyles", "inlineStyles", "minifyStyles", "convertStyleToAttrs", "cleanupIDs", "prefixIds", "removeRasterImages", "removeUselessDefs", "cleanupNumericValues", "cleanupListOfValues", "convertColors", "removeUnknownsAndDefaults", "removeNonInheritableGroupAttrs", "removeUselessStrokeAndFill", "removeViewBox", "cleanupEnableBackground", "removeHiddenElems", "removeEmptyText", "convertShapeToPath", "convertEllipseToCircle", "moveElemsAttrsToGroup", "moveGroupAttrsToElems", "collapseGroups", "convertPathData", "convertTransform", "removeEmptyAttrs", "removeEmptyContainers", "mergePaths", "removeUnusedNS", "sortAttrs", "sortDefsChildren", "removeTitle", "removeDesc", "removeDimensions", "removeAttrs", "removeAttributesBySelector", "removeElementsByAttr", "addClassesToSVGElement", "removeStyleElement", "removeScriptElement", "addAttributesToSVGElement", "removeOffCanvasPaths", "reusePaths" ], defaultPlugins = pluginsOrder.filter((name => pluginsMap[name].active));
      exports.defaultPlugins = defaultPlugins;
      exports.extendDefaultPlugins = plugins => {
        console.warn('\n"extendDefaultPlugins" utility is deprecated.\nUse "preset-default" plugin with overrides instead.\nFor example:\n{\n  name: \'preset-default\',\n  params: {\n    overrides: {\n      // customize plugin options\n      convertShapeToPath: {\n        convertArcs: true\n      },\n      // disable plugins\n      convertPathData: false\n    }\n  }\n}\n');
        const extendedPlugins = pluginsOrder.map((name => ({
          name,
          active: pluginsMap[name].active
        })));
        for (const plugin of plugins) {
          const resolvedPlugin = resolvePluginConfig(plugin), index = pluginsOrder.indexOf(resolvedPlugin.name);
          -1 === index ? extendedPlugins.push(plugin) : extendedPlugins[index] = plugin;
        }
        return extendedPlugins;
      };
      const resolvePluginConfig = plugin => {
        let configParams = {};
        if ("string" == typeof plugin) {
          const pluginConfig = pluginsMap[plugin];
          if (null == pluginConfig) throw Error(`Unknown builtin plugin "${plugin}" specified.`);
          return {
            ...pluginConfig,
            name: plugin,
            active: !0,
            params: {
              ...pluginConfig.params,
              ...configParams
            }
          };
        }
        if ("object" == typeof plugin && null != plugin) {
          if (null == plugin.name) throw Error("Plugin name should be specified");
          if (plugin.fn) return {
            active: !0,
            ...plugin,
            params: {
              ...configParams,
              ...plugin.params
            }
          };
          {
            const pluginConfig = pluginsMap[plugin.name];
            if (null == pluginConfig) throw Error(`Unknown builtin plugin "${plugin.name}" specified.`);
            return {
              ...pluginConfig,
              active: !0,
              ...plugin,
              params: {
                ...pluginConfig.params,
                ...configParams,
                ...plugin.params
              }
            };
          }
        }
        return null;
      };
      exports.resolvePluginConfig = resolvePluginConfig;
    },
    9226: module => {
      "use strict";
      var CSSClassList = function(node) {
        this.parentNode = node, this.classNames = new Set;
        const value = node.attributes.class;
        null != value && (this.addClassValueHandler(), this.setClassValue(value));
      };
      CSSClassList.prototype.addClassValueHandler = function() {
        Object.defineProperty(this.parentNode.attributes, "class", {
          get: this.getClassValue.bind(this),
          set: this.setClassValue.bind(this),
          enumerable: !0,
          configurable: !0
        });
      }, CSSClassList.prototype.getClassValue = function() {
        return Array.from(this.classNames).join(" ");
      }, CSSClassList.prototype.setClassValue = function(newValue) {
        if (void 0 !== newValue) {
          var arrClassNames = newValue.split(" ");
          this.classNames = new Set(arrClassNames);
        } else this.classNames.clear();
      }, CSSClassList.prototype.add = function() {
        this.addClassValueHandler(), Object.values(arguments).forEach(this._addSingle.bind(this));
      }, CSSClassList.prototype._addSingle = function(className) {
        this.classNames.add(className);
      }, CSSClassList.prototype.remove = function() {
        this.addClassValueHandler(), Object.values(arguments).forEach(this._removeSingle.bind(this));
      }, CSSClassList.prototype._removeSingle = function(className) {
        this.classNames.delete(className);
      }, CSSClassList.prototype.item = function(index) {
        return Array.from(this.classNames)[index];
      }, CSSClassList.prototype.toggle = function(className, force) {
        (this.contains(className) || !1 === force) && this.classNames.delete(className), 
        this.classNames.add(className);
      }, CSSClassList.prototype.contains = function(className) {
        return this.classNames.has(className);
      }, module.exports = CSSClassList;
    },
    4062: module => {
      "use strict";
      const isTag = node => "element" === node.type, existsOne = (test, elems) => elems.some((elem => !!isTag(elem) && (test(elem) || existsOne(test, getChildren(elem))))), getChildren = node => node.children || [], getParent = node => node.parentNode || null, findAll = (test, elems) => {
        const result = [];
        for (const elem of elems) isTag(elem) && (test(elem) && result.push(elem), result.push(...findAll(test, getChildren(elem))));
        return result;
      }, findOne = (test, elems) => {
        for (const elem of elems) if (isTag(elem)) {
          if (test(elem)) return elem;
          const result = findOne(test, getChildren(elem));
          if (result) return result;
        }
        return null;
      }, svgoCssSelectAdapter = {
        isTag,
        existsOne,
        getAttributeValue: (elem, name) => elem.attributes[name],
        getChildren,
        getName: elemAst => elemAst.name,
        getParent,
        getSiblings: elem => {
          var parent = getParent(elem);
          return parent ? getChildren(parent) : [];
        },
        getText: node => "text" === node.children[0].type && "cdata" === node.children[0].type ? node.children[0].value : "",
        hasAttrib: (elem, name) => void 0 !== elem.attributes[name],
        removeSubsets: nodes => {
          let node, ancestor, replace, idx = nodes.length;
          for (;--idx > -1; ) {
            for (node = ancestor = nodes[idx], nodes[idx] = null, replace = !0; ancestor; ) {
              if (nodes.includes(ancestor)) {
                replace = !1, nodes.splice(idx, 1);
                break;
              }
              ancestor = getParent(ancestor);
            }
            replace && (nodes[idx] = node);
          }
          return nodes;
        },
        findAll,
        findOne
      };
      module.exports = svgoCssSelectAdapter;
    },
    6057: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      var csstree = __webpack_require__(904), csstools = __webpack_require__(9997), CSSStyleDeclaration = function(node) {
        this.parentNode = node, this.properties = new Map, this.hasSynced = !1, this.styleValue = null, 
        this.parseError = !1;
        const value = node.attributes.style;
        null != value && (this.addStyleValueHandler(), this.setStyleValue(value));
      };
      CSSStyleDeclaration.prototype.addStyleValueHandler = function() {
        Object.defineProperty(this.parentNode.attributes, "style", {
          get: this.getStyleValue.bind(this),
          set: this.setStyleValue.bind(this),
          enumerable: !0,
          configurable: !0
        });
      }, CSSStyleDeclaration.prototype.getStyleValue = function() {
        return this.getCssText();
      }, CSSStyleDeclaration.prototype.setStyleValue = function(newValue) {
        this.properties.clear(), this.styleValue = newValue, this.hasSynced = !1;
      }, CSSStyleDeclaration.prototype._loadCssText = function() {
        if (!this.hasSynced && (this.hasSynced = !0, this.styleValue && 0 !== this.styleValue.length)) {
          var inlineCssStr = this.styleValue, declarations = {};
          try {
            declarations = csstree.parse(inlineCssStr, {
              context: "declarationList",
              parseValue: !1
            });
          } catch (parseError) {
            return void (this.parseError = parseError);
          }
          this.parseError = !1;
          var self = this;
          declarations.children.each((function(declaration) {
            try {
              var styleDeclaration = csstools.csstreeToStyleDeclaration(declaration);
              self.setProperty(styleDeclaration.name, styleDeclaration.value, styleDeclaration.priority);
            } catch (styleError) {
              "Unknown node type: undefined" !== styleError.message && (self.parseError = styleError);
            }
          }));
        }
      }, CSSStyleDeclaration.prototype.getCssText = function() {
        var properties = this.getProperties();
        if (this.parseError) return this.styleValue;
        var cssText = [];
        return properties.forEach((function(property, propertyName) {
          var strImportant = "important" === property.priority ? "!important" : "";
          cssText.push(propertyName.trim() + ":" + property.value.trim() + strImportant);
        })), cssText.join(";");
      }, CSSStyleDeclaration.prototype._handleParseError = function() {
        this.parseError && console.warn("Warning: Parse error when parsing inline styles, style properties of this element cannot be used. The raw styles can still be get/set using .attr('style').value. Error details: " + this.parseError);
      }, CSSStyleDeclaration.prototype._getProperty = function(propertyName) {
        if (void 0 === propertyName) throw Error("1 argument required, but only 0 present.");
        var properties = this.getProperties();
        return this._handleParseError(), properties.get(propertyName.trim());
      }, CSSStyleDeclaration.prototype.getPropertyPriority = function(propertyName) {
        var property = this._getProperty(propertyName);
        return property ? property.priority : "";
      }, CSSStyleDeclaration.prototype.getPropertyValue = function(propertyName) {
        var property = this._getProperty(propertyName);
        return property ? property.value : null;
      }, CSSStyleDeclaration.prototype.item = function(index) {
        if (void 0 === index) throw Error("1 argument required, but only 0 present.");
        var properties = this.getProperties();
        return this._handleParseError(), Array.from(properties.keys())[index];
      }, CSSStyleDeclaration.prototype.getProperties = function() {
        return this._loadCssText(), this.properties;
      }, CSSStyleDeclaration.prototype.removeProperty = function(propertyName) {
        if (void 0 === propertyName) throw Error("1 argument required, but only 0 present.");
        this.addStyleValueHandler();
        var properties = this.getProperties();
        this._handleParseError();
        var oldValue = this.getPropertyValue(propertyName);
        return properties.delete(propertyName.trim()), oldValue;
      }, CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
        if (void 0 === propertyName) throw Error("propertyName argument required, but only not present.");
        this.addStyleValueHandler();
        var properties = this.getProperties();
        this._handleParseError();
        var property = {
          value: value.trim(),
          priority: priority.trim()
        };
        return properties.set(propertyName.trim(), property), property;
      }, module.exports = CSSStyleDeclaration;
    },
    4267: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      const {selectAll, selectOne, is} = __webpack_require__(2284), svgoCssSelectAdapter = __webpack_require__(4062), CSSClassList = __webpack_require__(9226), CSSStyleDeclaration = __webpack_require__(6057), parseName = name => {
        if (null == name) return {
          prefix: "",
          local: ""
        };
        if ("xmlns" === name) return {
          prefix: "xmlns",
          local: ""
        };
        const chunks = name.split(":");
        return 1 === chunks.length ? {
          prefix: "",
          local: chunks[0]
        } : {
          prefix: chunks[0],
          local: chunks[1]
        };
      };
      var cssSelectOpts = {
        xmlMode: !0,
        adapter: svgoCssSelectAdapter
      };
      const attrsHandler = {
        get: (attributes, name) => {
          if (attributes.hasOwnProperty(name)) return {
            name,
            get value() {
              return attributes[name];
            },
            set value(value) {
              attributes[name] = value;
            }
          };
        },
        set: (attributes, name, attr) => (attributes[name] = attr.value, !0)
      };
      var JSAPI = function(data, parentNode) {
        if (Object.assign(this, data), "element" === this.type) {
          null == this.attributes && (this.attributes = {}), null == this.children && (this.children = []), 
          Object.defineProperty(this, "class", {
            writable: !0,
            configurable: !0,
            value: new CSSClassList(this)
          }), Object.defineProperty(this, "style", {
            writable: !0,
            configurable: !0,
            value: new CSSStyleDeclaration(this)
          }), Object.defineProperty(this, "parentNode", {
            writable: !0,
            value: parentNode
          });
          const element = this;
          Object.defineProperty(this, "attrs", {
            configurable: !0,
            get: () => new Proxy(element.attributes, attrsHandler),
            set(value) {
              const newAttributes = {};
              for (const attr of Object.values(value)) newAttributes[attr.name] = attr.value;
              element.attributes = newAttributes;
            }
          });
        }
      };
      module.exports = JSAPI, JSAPI.prototype.clone = function() {
        const {children, ...nodeData} = this, clonedNode = new JSAPI(JSON.parse(JSON.stringify(nodeData)), null);
        return children && (clonedNode.children = children.map((child => {
          const clonedChild = child.clone();
          return clonedChild.parentNode = clonedNode, clonedChild;
        }))), clonedNode;
      }, JSAPI.prototype.isElem = function(param) {
        return "element" === this.type && (null == param || (Array.isArray(param) ? param.includes(this.name) : this.name === param));
      }, JSAPI.prototype.renameElem = function(name) {
        return name && "string" == typeof name && (this.name = name), this;
      }, JSAPI.prototype.isEmpty = function() {
        return !this.children || !this.children.length;
      }, JSAPI.prototype.closestElem = function(elemName) {
        for (var elem = this; (elem = elem.parentNode) && !elem.isElem(elemName); ) ;
        return elem;
      }, JSAPI.prototype.spliceContent = function(start, n, insertion) {
        return arguments.length < 2 ? [] : (Array.isArray(insertion) || (insertion = Array.apply(null, arguments).slice(2)), 
        insertion.forEach((function(inner) {
          inner.parentNode = this;
        }), this), this.children.splice.apply(this.children, [ start, n ].concat(insertion)));
      }, JSAPI.prototype.hasAttr = function(name, val) {
        return "element" === this.type && (0 !== Object.keys(this.attributes).length && (null == name || !1 !== this.attributes.hasOwnProperty(name) && (void 0 === val || this.attributes[name] === val.toString())));
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
          const {local} = parseName(attr.name);
          return local === localName;
        }
        function stringValueTest(attr) {
          const {local} = parseName(attr.name);
          return local === localName && val == attr.value;
        }
        function regexpValueTest(attr) {
          const {local} = parseName(attr.name);
          return local === localName && val.test(attr.value);
        }
        function funcValueTest(attr) {
          const {local} = parseName(attr.name);
          return local === localName && val(attr.value);
        }
      }, JSAPI.prototype.attr = function(name, val) {
        if (this.hasAttr(name, val)) return this.attrs[name];
      }, JSAPI.prototype.computedAttr = function(name, val) {
        if (arguments.length) {
          for (var elem = this; elem && (!elem.hasAttr(name) || !elem.attributes[name]); elem = elem.parentNode) ;
          return null != val ? !!elem && elem.hasAttr(name, val) : elem && elem.hasAttr(name) ? elem.attributes[name] : void 0;
        }
      }, JSAPI.prototype.removeAttr = function(name, val) {
        if ("element" !== this.type) return !1;
        if (0 === arguments.length) return !1;
        if (Array.isArray(name)) {
          for (const nameItem of name) this.removeAttr(nameItem, val);
          return !1;
        }
        return !1 !== this.hasAttr(name, val) && (delete this.attributes[name], !0);
      }, JSAPI.prototype.addAttr = function(attr) {
        return void 0 !== (attr = attr || {}).name && (this.attributes[attr.name] = attr.value, 
        "class" === attr.name && this.class.addClassValueHandler(), "style" === attr.name && this.style.addStyleValueHandler(), 
        this.attrs[attr.name]);
      }, JSAPI.prototype.eachAttr = function(callback, context) {
        if ("element" !== this.type) return !1;
        if (null == callback) return !1;
        for (const attr of Object.values(this.attrs)) callback.call(context, attr);
        return !0;
      }, JSAPI.prototype.someAttr = function(callback, context) {
        if ("element" !== this.type) return !1;
        for (const attr of Object.values(this.attrs)) if (callback.call(context, attr)) return !0;
        return !1;
      }, JSAPI.prototype.querySelectorAll = function(selectors) {
        var matchedEls = selectAll(selectors, this, cssSelectOpts);
        return matchedEls.length > 0 ? matchedEls : null;
      }, JSAPI.prototype.querySelector = function(selectors) {
        return selectOne(selectors, this, cssSelectOpts);
      }, JSAPI.prototype.matches = function(selector) {
        return is(this, selector, cssSelectOpts);
      };
    },
    4096: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {visit} = __webpack_require__(6317), invokePlugins = (ast, info, plugins, overrides, globalOverrides) => {
        for (const plugin of plugins) {
          const override = null == overrides ? null : overrides[plugin.name];
          if (!1 === override) continue;
          const params = {
            ...plugin.params,
            ...globalOverrides,
            ...override
          };
          if ("perItem" === plugin.type && (ast = perItem(ast, info, plugin, params)), "perItemReverse" === plugin.type && (ast = perItem(ast, info, plugin, params, !0)), 
          "full" === plugin.type && plugin.active && (ast = plugin.fn(ast, params, info)), 
          "visitor" === plugin.type && plugin.active) {
            const visitor = plugin.fn(ast, params, info);
            null != visitor && visit(ast, visitor);
          }
        }
        return ast;
      };
      function perItem(data, info, plugin, params, reverse) {
        return function monkeys(items) {
          return items.children = items.children.filter((function(item) {
            reverse && item.children && monkeys(item);
            let kept = !0;
            return plugin.active && (kept = !1 !== plugin.fn(item, params, info)), !reverse && item.children && monkeys(item), 
            kept;
          })), items;
        }(data);
      }
      exports.invokePlugins = invokePlugins;
      exports.createPreset = ({name, plugins}) => ({
        name,
        type: "full",
        fn: (ast, params, info) => {
          const {floatPrecision, overrides} = params, globalOverrides = {};
          if (null != floatPrecision && (globalOverrides.floatPrecision = floatPrecision), 
          overrides) for (const [pluginName, override] of Object.entries(overrides)) !0 === override && console.warn(`You are trying to enable ${pluginName} which is not part of preset.\nTry to put it before or after preset, for example\n\nplugins: [\n  {\n    name: 'preset-default',\n  },\n  'cleanupListOfValues'\n]\n`);
          return invokePlugins(ast, info, plugins, overrides, globalOverrides);
        }
      });
    },
    2199: (__unused_webpack_module, exports) => {
      "use strict";
      exports.encodeSVGDatauri = (str, type) => {
        var prefix = "data:image/svg+xml";
        return type && "base64" !== type ? "enc" === type ? str = prefix + "," + encodeURIComponent(str) : "unenc" === type && (str = prefix + "," + str) : str = (prefix += ";base64,") + Buffer.from(str).toString("base64"), 
        str;
      }, exports.decodeSVGDatauri = str => {
        var match = /data:image\/svg\+xml(;charset=[^;,]*)?(;base64)?,(.*)/.exec(str);
        if (!match) return str;
        var data = match[3];
        return match[2] ? str = Buffer.from(data, "base64").toString("utf8") : "%" === data.charAt(0) ? str = decodeURIComponent(data) : "<" === data.charAt(0) && (str = data), 
        str;
      }, exports.cleanupOutData = (data, params, command) => {
        let delimiter, prev, str = "";
        return data.forEach(((item, i) => {
          if (delimiter = " ", 0 == i && (delimiter = ""), params.noSpaceAfterFlags && ("A" == command || "a" == command)) {
            var pos = i % 7;
            4 != pos && 5 != pos || (delimiter = "");
          }
          const itemStr = params.leadingZero ? removeLeadingZero(item) : item.toString();
          params.negativeExtraSpace && "" != delimiter && (item < 0 || "." === itemStr.charAt(0) && prev % 1 != 0) && (delimiter = ""), 
          prev = item, str += delimiter + itemStr;
        })), str;
      };
      const removeLeadingZero = num => {
        var strNum = num.toString();
        return 0 < num && num < 1 && "0" === strNum.charAt(0) ? strNum = strNum.slice(1) : -1 < num && num < 0 && "0" === strNum.charAt(1) && (strNum = strNum.charAt(0) + strNum.slice(2)), 
        strNum;
      };
      exports.removeLeadingZero = removeLeadingZero;
    },
    6317: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {selectAll, selectOne, is} = __webpack_require__(2284), cssSelectOptions = {
        xmlMode: !0,
        adapter: __webpack_require__(4062)
      };
      exports.querySelectorAll = (node, selector) => selectAll(selector, node, cssSelectOptions);
      exports.querySelector = (node, selector) => selectOne(selector, node, cssSelectOptions);
      exports.matches = (node, selector) => is(node, selector, cssSelectOptions);
      exports.closestByName = (node, name) => {
        let currentNode = node;
        for (;currentNode; ) {
          if ("element" === currentNode.type && currentNode.name === name) return currentNode;
          currentNode = currentNode.parentNode;
        }
        return null;
      };
      const visitSkip = Symbol();
      exports.visitSkip = visitSkip;
      const visit = (node, visitor, parentNode) => {
        const callbacks = visitor[node.type];
        if (callbacks && callbacks.enter) {
          if (callbacks.enter(node, parentNode) === visitSkip) return;
        }
        if ("root" === node.type) for (const child of node.children) visit(child, visitor, node);
        if ("element" === node.type && parentNode.children.includes(node)) for (const child of node.children) visit(child, visitor, node);
        callbacks && callbacks.exit && callbacks.exit(node, parentNode);
      };
      exports.visit = visit;
      exports.detachNodeFromParent = (node, parentNode) => {
        parentNode.children = parentNode.children.filter((child => child !== node));
      };
    },
    5509: module => {
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
      //! stable.js 0.1.8, https://github.com/Two-Screen/stable
      //! © 2018 Angry Bytes and contributors. MIT licensed.
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
    1263: (__unused_webpack_module, exports) => {
      !function(sax) {
        sax.parser = function(strict, opt) {
          return new SAXParser(strict, opt);
        }, sax.SAXParser = SAXParser, sax.MAX_BUFFER_LENGTH = 65536;
        var buffers = [ "comment", "sgmlDecl", "textNode", "tagName", "doctype", "procInstName", "procInstBody", "entity", "attribName", "attribValue", "cdata", "script" ];
        function SAXParser(strict, opt) {
          if (!(this instanceof SAXParser)) return new SAXParser(strict, opt);
          !function(parser) {
            for (var i = 0, l = buffers.length; i < l; i++) parser[buffers[i]] = "";
          }(this), this.q = this.c = "", this.bufferCheckPosition = sax.MAX_BUFFER_LENGTH, 
          this.opt = opt || {}, this.opt.lowercase = this.opt.lowercase || this.opt.lowercasetags, 
          this.looseCase = this.opt.lowercase ? "toLowerCase" : "toUpperCase", this.tags = [], 
          this.closed = this.closedRoot = this.sawRoot = !1, this.tag = this.error = null, 
          this.strict = !!strict, this.noscript = !(!strict && !this.opt.noscript), this.state = S.BEGIN, 
          this.strictEntities = this.opt.strictEntities, this.ENTITIES = this.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES), 
          this.attribList = [], this.opt.xmlns && (this.ns = Object.create(rootNS)), this.trackPosition = !1 !== this.opt.position, 
          this.trackPosition && (this.position = this.line = this.column = 0), emit(this, "onready");
        }
        Object.create || (Object.create = function(o) {
          function F() {}
          return F.prototype = o, new F;
        }), Object.keys || (Object.keys = function(o) {
          var a = [];
          for (var i in o) o.hasOwnProperty(i) && a.push(i);
          return a;
        }), SAXParser.prototype = {
          end: function() {
            end(this);
          },
          write: function(chunk) {
            if (this.error) throw this.error;
            if (this.closed) return error(this, "Cannot write after close. Assign an onready handler.");
            if (null === chunk) return end(this);
            "object" == typeof chunk && (chunk = chunk.toString());
            var i = 0, c = "";
            for (;c = charAt(chunk, i++), this.c = c, c; ) switch (this.trackPosition && (this.position++, 
            "\n" === c ? (this.line++, this.column = 0) : this.column++), this.state) {
             case S.BEGIN:
              if (this.state = S.BEGIN_WHITESPACE, "\ufeff" === c) continue;
              beginWhiteSpace(this, c);
              continue;

             case S.BEGIN_WHITESPACE:
              beginWhiteSpace(this, c);
              continue;

             case S.TEXT:
              if (this.sawRoot && !this.closedRoot) {
                for (var starti = i - 1; c && "<" !== c && "&" !== c; ) (c = charAt(chunk, i++)) && this.trackPosition && (this.position++, 
                "\n" === c ? (this.line++, this.column = 0) : this.column++);
                this.textNode += chunk.substring(starti, i - 1);
              }
              "<" !== c || this.sawRoot && this.closedRoot && !this.strict ? (isWhitespace(c) || this.sawRoot && !this.closedRoot || strictFail(this, "Text data outside of root node."), 
              "&" === c ? this.state = S.TEXT_ENTITY : this.textNode += c) : (this.state = S.OPEN_WAKA, 
              this.startTagPosition = this.position);
              continue;

             case S.SCRIPT:
              "<" === c ? this.state = S.SCRIPT_ENDING : this.script += c;
              continue;

             case S.SCRIPT_ENDING:
              "/" === c ? this.state = S.CLOSE_TAG : (this.script += "<" + c, this.state = S.SCRIPT);
              continue;

             case S.OPEN_WAKA:
              if ("!" === c) this.state = S.SGML_DECL, this.sgmlDecl = ""; else if (isWhitespace(c)) ; else if (isMatch(nameStart, c)) this.state = S.OPEN_TAG, 
              this.tagName = c; else if ("/" === c) this.state = S.CLOSE_TAG, this.tagName = ""; else if ("?" === c) this.state = S.PROC_INST, 
              this.procInstName = this.procInstBody = ""; else {
                if (strictFail(this, "Unencoded <"), this.startTagPosition + 1 < this.position) {
                  var pad = this.position - this.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                this.textNode += "<" + c, this.state = S.TEXT;
              }
              continue;

             case S.SGML_DECL:
              "[CDATA[" === (this.sgmlDecl + c).toUpperCase() ? (emitNode(this, "onopencdata"), 
              this.state = S.CDATA, this.sgmlDecl = "", this.cdata = "") : this.sgmlDecl + c === "--" ? (this.state = S.COMMENT, 
              this.comment = "", this.sgmlDecl = "") : "DOCTYPE" === (this.sgmlDecl + c).toUpperCase() ? (this.state = S.DOCTYPE, 
              (this.doctype || this.sawRoot) && strictFail(this, "Inappropriately located doctype declaration"), 
              this.doctype = "", this.sgmlDecl = "") : ">" === c ? (emitNode(this, "onsgmldeclaration", this.sgmlDecl), 
              this.sgmlDecl = "", this.state = S.TEXT) : isQuote(c) ? (this.state = S.SGML_DECL_QUOTED, 
              this.sgmlDecl += c) : this.sgmlDecl += c;
              continue;

             case S.SGML_DECL_QUOTED:
              c === this.q && (this.state = S.SGML_DECL, this.q = ""), this.sgmlDecl += c;
              continue;

             case S.DOCTYPE:
              ">" === c ? (this.state = S.TEXT, emitNode(this, "ondoctype", this.doctype), this.doctype = !0) : (this.doctype += c, 
              "[" === c ? this.state = S.DOCTYPE_DTD : isQuote(c) && (this.state = S.DOCTYPE_QUOTED, 
              this.q = c));
              continue;

             case S.DOCTYPE_QUOTED:
              this.doctype += c, c === this.q && (this.q = "", this.state = S.DOCTYPE);
              continue;

             case S.DOCTYPE_DTD:
              this.doctype += c, "]" === c ? this.state = S.DOCTYPE : isQuote(c) && (this.state = S.DOCTYPE_DTD_QUOTED, 
              this.q = c);
              continue;

             case S.DOCTYPE_DTD_QUOTED:
              this.doctype += c, c === this.q && (this.state = S.DOCTYPE_DTD, this.q = "");
              continue;

             case S.COMMENT:
              "-" === c ? this.state = S.COMMENT_ENDING : this.comment += c;
              continue;

             case S.COMMENT_ENDING:
              "-" === c ? (this.state = S.COMMENT_ENDED, this.comment = textopts(this.opt, this.comment), 
              this.comment && emitNode(this, "oncomment", this.comment), this.comment = "") : (this.comment += "-" + c, 
              this.state = S.COMMENT);
              continue;

             case S.COMMENT_ENDED:
              ">" !== c ? (strictFail(this, "Malformed comment"), this.comment += "--" + c, this.state = S.COMMENT) : this.state = S.TEXT;
              continue;

             case S.CDATA:
              "]" === c ? this.state = S.CDATA_ENDING : this.cdata += c;
              continue;

             case S.CDATA_ENDING:
              "]" === c ? this.state = S.CDATA_ENDING_2 : (this.cdata += "]" + c, this.state = S.CDATA);
              continue;

             case S.CDATA_ENDING_2:
              ">" === c ? (this.cdata && emitNode(this, "oncdata", this.cdata), emitNode(this, "onclosecdata"), 
              this.cdata = "", this.state = S.TEXT) : "]" === c ? this.cdata += "]" : (this.cdata += "]]" + c, 
              this.state = S.CDATA);
              continue;

             case S.PROC_INST:
              "?" === c ? this.state = S.PROC_INST_ENDING : isWhitespace(c) ? this.state = S.PROC_INST_BODY : this.procInstName += c;
              continue;

             case S.PROC_INST_BODY:
              if (!this.procInstBody && isWhitespace(c)) continue;
              "?" === c ? this.state = S.PROC_INST_ENDING : this.procInstBody += c;
              continue;

             case S.PROC_INST_ENDING:
              ">" === c ? (emitNode(this, "onprocessinginstruction", {
                name: this.procInstName,
                body: this.procInstBody
              }), this.procInstName = this.procInstBody = "", this.state = S.TEXT) : (this.procInstBody += "?" + c, 
              this.state = S.PROC_INST_BODY);
              continue;

             case S.OPEN_TAG:
              isMatch(nameBody, c) ? this.tagName += c : (newTag(this), ">" === c ? openTag(this) : "/" === c ? this.state = S.OPEN_TAG_SLASH : (isWhitespace(c) || strictFail(this, "Invalid character in tag name"), 
              this.state = S.ATTRIB));
              continue;

             case S.OPEN_TAG_SLASH:
              ">" === c ? (openTag(this, !0), closeTag(this)) : (strictFail(this, "Forward-slash in opening tag not followed by >"), 
              this.state = S.ATTRIB);
              continue;

             case S.ATTRIB:
              if (isWhitespace(c)) continue;
              ">" === c ? openTag(this) : "/" === c ? this.state = S.OPEN_TAG_SLASH : isMatch(nameStart, c) ? (this.attribName = c, 
              this.attribValue = "", this.state = S.ATTRIB_NAME) : strictFail(this, "Invalid attribute name");
              continue;

             case S.ATTRIB_NAME:
              "=" === c ? this.state = S.ATTRIB_VALUE : ">" === c ? (strictFail(this, "Attribute without value"), 
              this.attribValue = this.attribName, attrib(this), openTag(this)) : isWhitespace(c) ? this.state = S.ATTRIB_NAME_SAW_WHITE : isMatch(nameBody, c) ? this.attribName += c : strictFail(this, "Invalid attribute name");
              continue;

             case S.ATTRIB_NAME_SAW_WHITE:
              if ("=" === c) this.state = S.ATTRIB_VALUE; else {
                if (isWhitespace(c)) continue;
                strictFail(this, "Attribute without value"), this.tag.attributes[this.attribName] = "", 
                this.attribValue = "", emitNode(this, "onattribute", {
                  name: this.attribName,
                  value: ""
                }), this.attribName = "", ">" === c ? openTag(this) : isMatch(nameStart, c) ? (this.attribName = c, 
                this.state = S.ATTRIB_NAME) : (strictFail(this, "Invalid attribute name"), this.state = S.ATTRIB);
              }
              continue;

             case S.ATTRIB_VALUE:
              if (isWhitespace(c)) continue;
              isQuote(c) ? (this.q = c, this.state = S.ATTRIB_VALUE_QUOTED) : (strictFail(this, "Unquoted attribute value"), 
              this.state = S.ATTRIB_VALUE_UNQUOTED, this.attribValue = c);
              continue;

             case S.ATTRIB_VALUE_QUOTED:
              if (c !== this.q) {
                "&" === c ? this.state = S.ATTRIB_VALUE_ENTITY_Q : this.attribValue += c;
                continue;
              }
              attrib(this), this.q = "", this.state = S.ATTRIB_VALUE_CLOSED;
              continue;

             case S.ATTRIB_VALUE_CLOSED:
              isWhitespace(c) ? this.state = S.ATTRIB : ">" === c ? openTag(this) : "/" === c ? this.state = S.OPEN_TAG_SLASH : isMatch(nameStart, c) ? (strictFail(this, "No whitespace between attributes"), 
              this.attribName = c, this.attribValue = "", this.state = S.ATTRIB_NAME) : strictFail(this, "Invalid attribute name");
              continue;

             case S.ATTRIB_VALUE_UNQUOTED:
              if (!isAttribEnd(c)) {
                "&" === c ? this.state = S.ATTRIB_VALUE_ENTITY_U : this.attribValue += c;
                continue;
              }
              attrib(this), ">" === c ? openTag(this) : this.state = S.ATTRIB;
              continue;

             case S.CLOSE_TAG:
              if (this.tagName) ">" === c ? closeTag(this) : isMatch(nameBody, c) ? this.tagName += c : this.script ? (this.script += "</" + this.tagName, 
              this.tagName = "", this.state = S.SCRIPT) : (isWhitespace(c) || strictFail(this, "Invalid tagname in closing tag"), 
              this.state = S.CLOSE_TAG_SAW_WHITE); else {
                if (isWhitespace(c)) continue;
                notMatch(nameStart, c) ? this.script ? (this.script += "</" + c, this.state = S.SCRIPT) : strictFail(this, "Invalid tagname in closing tag.") : this.tagName = c;
              }
              continue;

             case S.CLOSE_TAG_SAW_WHITE:
              if (isWhitespace(c)) continue;
              ">" === c ? closeTag(this) : strictFail(this, "Invalid characters in closing tag");
              continue;

             case S.TEXT_ENTITY:
             case S.ATTRIB_VALUE_ENTITY_Q:
             case S.ATTRIB_VALUE_ENTITY_U:
              var returnState, buffer;
              switch (this.state) {
               case S.TEXT_ENTITY:
                returnState = S.TEXT, buffer = "textNode";
                break;

               case S.ATTRIB_VALUE_ENTITY_Q:
                returnState = S.ATTRIB_VALUE_QUOTED, buffer = "attribValue";
                break;

               case S.ATTRIB_VALUE_ENTITY_U:
                returnState = S.ATTRIB_VALUE_UNQUOTED, buffer = "attribValue";
              }
              if (";" === c) {
                var parsedEntity = parseEntity(this);
                this.state !== S.TEXT_ENTITY || sax.ENTITIES[this.entity] || parsedEntity === "&" + this.entity + ";" ? this[buffer] += parsedEntity : chunk = chunk.slice(0, i) + parsedEntity + chunk.slice(i), 
                this.entity = "", this.state = returnState;
              } else isMatch(this.entity.length ? entityBody : entityStart, c) ? this.entity += c : (strictFail(this, "Invalid character in entity name"), 
              this[buffer] += "&" + this.entity + c, this.entity = "", this.state = returnState);
              continue;

             default:
              throw new Error(this, "Unknown state: " + this.state);
            }
            this.position >= this.bufferCheckPosition && function(parser) {
              for (var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10), maxActual = 0, i = 0, l = buffers.length; i < l; i++) {
                var len = parser[buffers[i]].length;
                if (len > maxAllowed) switch (buffers[i]) {
                 case "textNode":
                  closeText(parser);
                  break;

                 case "cdata":
                  emitNode(parser, "oncdata", parser.cdata), parser.cdata = "";
                  break;

                 case "script":
                  emitNode(parser, "onscript", parser.script), parser.script = "";
                  break;

                 default:
                  error(parser, "Max buffer length exceeded: " + buffers[i]);
                }
                maxActual = Math.max(maxActual, len);
              }
              var m = sax.MAX_BUFFER_LENGTH - maxActual;
              parser.bufferCheckPosition = m + parser.position;
            }(this);
            return this;
          },
          resume: function() {
            return this.error = null, this;
          },
          close: function() {
            return this.write(null);
          },
          flush: function() {
            var parser;
            closeText(parser = this), "" !== parser.cdata && (emitNode(parser, "oncdata", parser.cdata), 
            parser.cdata = ""), "" !== parser.script && (emitNode(parser, "onscript", parser.script), 
            parser.script = "");
          }
        };
        var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace", rootNS = {
          xml: XML_NAMESPACE,
          xmlns: "http://www.w3.org/2000/xmlns/"
        }, nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
        function isWhitespace(c) {
          return " " === c || "\n" === c || "\r" === c || "\t" === c;
        }
        function isQuote(c) {
          return '"' === c || "'" === c;
        }
        function isAttribEnd(c) {
          return ">" === c || isWhitespace(c);
        }
        function isMatch(regex, c) {
          return regex.test(c);
        }
        function notMatch(regex, c) {
          return !isMatch(regex, c);
        }
        var S = 0;
        for (var s in sax.STATE = {
          BEGIN: S++,
          BEGIN_WHITESPACE: S++,
          TEXT: S++,
          TEXT_ENTITY: S++,
          OPEN_WAKA: S++,
          SGML_DECL: S++,
          SGML_DECL_QUOTED: S++,
          DOCTYPE: S++,
          DOCTYPE_QUOTED: S++,
          DOCTYPE_DTD: S++,
          DOCTYPE_DTD_QUOTED: S++,
          COMMENT_STARTING: S++,
          COMMENT: S++,
          COMMENT_ENDING: S++,
          COMMENT_ENDED: S++,
          CDATA: S++,
          CDATA_ENDING: S++,
          CDATA_ENDING_2: S++,
          PROC_INST: S++,
          PROC_INST_BODY: S++,
          PROC_INST_ENDING: S++,
          OPEN_TAG: S++,
          OPEN_TAG_SLASH: S++,
          ATTRIB: S++,
          ATTRIB_NAME: S++,
          ATTRIB_NAME_SAW_WHITE: S++,
          ATTRIB_VALUE: S++,
          ATTRIB_VALUE_QUOTED: S++,
          ATTRIB_VALUE_CLOSED: S++,
          ATTRIB_VALUE_UNQUOTED: S++,
          ATTRIB_VALUE_ENTITY_Q: S++,
          ATTRIB_VALUE_ENTITY_U: S++,
          CLOSE_TAG: S++,
          CLOSE_TAG_SAW_WHITE: S++,
          SCRIPT: S++,
          SCRIPT_ENDING: S++
        }, sax.XML_ENTITIES = {
          amp: "&",
          gt: ">",
          lt: "<",
          quot: '"',
          apos: "'"
        }, sax.ENTITIES = {
          amp: "&",
          gt: ">",
          lt: "<",
          quot: '"',
          apos: "'",
          AElig: 198,
          Aacute: 193,
          Acirc: 194,
          Agrave: 192,
          Aring: 197,
          Atilde: 195,
          Auml: 196,
          Ccedil: 199,
          ETH: 208,
          Eacute: 201,
          Ecirc: 202,
          Egrave: 200,
          Euml: 203,
          Iacute: 205,
          Icirc: 206,
          Igrave: 204,
          Iuml: 207,
          Ntilde: 209,
          Oacute: 211,
          Ocirc: 212,
          Ograve: 210,
          Oslash: 216,
          Otilde: 213,
          Ouml: 214,
          THORN: 222,
          Uacute: 218,
          Ucirc: 219,
          Ugrave: 217,
          Uuml: 220,
          Yacute: 221,
          aacute: 225,
          acirc: 226,
          aelig: 230,
          agrave: 224,
          aring: 229,
          atilde: 227,
          auml: 228,
          ccedil: 231,
          eacute: 233,
          ecirc: 234,
          egrave: 232,
          eth: 240,
          euml: 235,
          iacute: 237,
          icirc: 238,
          igrave: 236,
          iuml: 239,
          ntilde: 241,
          oacute: 243,
          ocirc: 244,
          ograve: 242,
          oslash: 248,
          otilde: 245,
          ouml: 246,
          szlig: 223,
          thorn: 254,
          uacute: 250,
          ucirc: 251,
          ugrave: 249,
          uuml: 252,
          yacute: 253,
          yuml: 255,
          copy: 169,
          reg: 174,
          nbsp: 160,
          iexcl: 161,
          cent: 162,
          pound: 163,
          curren: 164,
          yen: 165,
          brvbar: 166,
          sect: 167,
          uml: 168,
          ordf: 170,
          laquo: 171,
          not: 172,
          shy: 173,
          macr: 175,
          deg: 176,
          plusmn: 177,
          sup1: 185,
          sup2: 178,
          sup3: 179,
          acute: 180,
          micro: 181,
          para: 182,
          middot: 183,
          cedil: 184,
          ordm: 186,
          raquo: 187,
          frac14: 188,
          frac12: 189,
          frac34: 190,
          iquest: 191,
          times: 215,
          divide: 247,
          OElig: 338,
          oelig: 339,
          Scaron: 352,
          scaron: 353,
          Yuml: 376,
          fnof: 402,
          circ: 710,
          tilde: 732,
          Alpha: 913,
          Beta: 914,
          Gamma: 915,
          Delta: 916,
          Epsilon: 917,
          Zeta: 918,
          Eta: 919,
          Theta: 920,
          Iota: 921,
          Kappa: 922,
          Lambda: 923,
          Mu: 924,
          Nu: 925,
          Xi: 926,
          Omicron: 927,
          Pi: 928,
          Rho: 929,
          Sigma: 931,
          Tau: 932,
          Upsilon: 933,
          Phi: 934,
          Chi: 935,
          Psi: 936,
          Omega: 937,
          alpha: 945,
          beta: 946,
          gamma: 947,
          delta: 948,
          epsilon: 949,
          zeta: 950,
          eta: 951,
          theta: 952,
          iota: 953,
          kappa: 954,
          lambda: 955,
          mu: 956,
          nu: 957,
          xi: 958,
          omicron: 959,
          pi: 960,
          rho: 961,
          sigmaf: 962,
          sigma: 963,
          tau: 964,
          upsilon: 965,
          phi: 966,
          chi: 967,
          psi: 968,
          omega: 969,
          thetasym: 977,
          upsih: 978,
          piv: 982,
          ensp: 8194,
          emsp: 8195,
          thinsp: 8201,
          zwnj: 8204,
          zwj: 8205,
          lrm: 8206,
          rlm: 8207,
          ndash: 8211,
          mdash: 8212,
          lsquo: 8216,
          rsquo: 8217,
          sbquo: 8218,
          ldquo: 8220,
          rdquo: 8221,
          bdquo: 8222,
          dagger: 8224,
          Dagger: 8225,
          bull: 8226,
          hellip: 8230,
          permil: 8240,
          prime: 8242,
          Prime: 8243,
          lsaquo: 8249,
          rsaquo: 8250,
          oline: 8254,
          frasl: 8260,
          euro: 8364,
          image: 8465,
          weierp: 8472,
          real: 8476,
          trade: 8482,
          alefsym: 8501,
          larr: 8592,
          uarr: 8593,
          rarr: 8594,
          darr: 8595,
          harr: 8596,
          crarr: 8629,
          lArr: 8656,
          uArr: 8657,
          rArr: 8658,
          dArr: 8659,
          hArr: 8660,
          forall: 8704,
          part: 8706,
          exist: 8707,
          empty: 8709,
          nabla: 8711,
          isin: 8712,
          notin: 8713,
          ni: 8715,
          prod: 8719,
          sum: 8721,
          minus: 8722,
          lowast: 8727,
          radic: 8730,
          prop: 8733,
          infin: 8734,
          ang: 8736,
          and: 8743,
          or: 8744,
          cap: 8745,
          cup: 8746,
          int: 8747,
          there4: 8756,
          sim: 8764,
          cong: 8773,
          asymp: 8776,
          ne: 8800,
          equiv: 8801,
          le: 8804,
          ge: 8805,
          sub: 8834,
          sup: 8835,
          nsub: 8836,
          sube: 8838,
          supe: 8839,
          oplus: 8853,
          otimes: 8855,
          perp: 8869,
          sdot: 8901,
          lceil: 8968,
          rceil: 8969,
          lfloor: 8970,
          rfloor: 8971,
          lang: 9001,
          rang: 9002,
          loz: 9674,
          spades: 9824,
          clubs: 9827,
          hearts: 9829,
          diams: 9830
        }, Object.keys(sax.ENTITIES).forEach((function(key) {
          var e = sax.ENTITIES[key], s = "number" == typeof e ? String.fromCharCode(e) : e;
          sax.ENTITIES[key] = s;
        })), sax.STATE) sax.STATE[sax.STATE[s]] = s;
        function emit(parser, event, data) {
          parser[event] && parser[event](data);
        }
        function emitNode(parser, nodeType, data) {
          parser.textNode && closeText(parser), emit(parser, nodeType, data);
        }
        function closeText(parser) {
          parser.textNode = textopts(parser.opt, parser.textNode), parser.textNode && emit(parser, "ontext", parser.textNode), 
          parser.textNode = "";
        }
        function textopts(opt, text) {
          return opt.trim && (text = text.trim()), opt.normalize && (text = text.replace(/\s+/g, " ")), 
          text;
        }
        function error(parser, reason) {
          closeText(parser);
          const message = reason + "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c, error = new Error(message);
          return error.reason = reason, error.line = parser.line, error.column = parser.column, 
          parser.error = error, emit(parser, "onerror", error), parser;
        }
        function end(parser) {
          return parser.sawRoot && !parser.closedRoot && strictFail(parser, "Unclosed root tag"), 
          parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT && error(parser, "Unexpected end"), 
          closeText(parser), parser.c = "", parser.closed = !0, emit(parser, "onend"), SAXParser.call(parser, parser.strict, parser.opt), 
          parser;
        }
        function strictFail(parser, message) {
          if ("object" != typeof parser || !(parser instanceof SAXParser)) throw new Error("bad call to strictFail");
          parser.strict && error(parser, message);
        }
        function newTag(parser) {
          parser.strict || (parser.tagName = parser.tagName[parser.looseCase]());
          var parent = parser.tags[parser.tags.length - 1] || parser, tag = parser.tag = {
            name: parser.tagName,
            attributes: {}
          };
          parser.opt.xmlns && (tag.ns = parent.ns), parser.attribList.length = 0, emitNode(parser, "onopentagstart", tag);
        }
        function qname(name, attribute) {
          var qualName = name.indexOf(":") < 0 ? [ "", name ] : name.split(":"), prefix = qualName[0], local = qualName[1];
          return attribute && "xmlns" === name && (prefix = "xmlns", local = ""), {
            prefix,
            local
          };
        }
        function attrib(parser) {
          if (parser.strict || (parser.attribName = parser.attribName[parser.looseCase]()), 
          -1 !== parser.attribList.indexOf(parser.attribName) || parser.tag.attributes.hasOwnProperty(parser.attribName)) parser.attribName = parser.attribValue = ""; else {
            if (parser.opt.xmlns) {
              var qn = qname(parser.attribName, !0), prefix = qn.prefix, local = qn.local;
              if ("xmlns" === prefix) if ("xml" === local && parser.attribValue !== XML_NAMESPACE) strictFail(parser, "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue); else if ("xmlns" === local && "http://www.w3.org/2000/xmlns/" !== parser.attribValue) strictFail(parser, "xmlns: prefix must be bound to http://www.w3.org/2000/xmlns/\nActual: " + parser.attribValue); else {
                var tag = parser.tag, parent = parser.tags[parser.tags.length - 1] || parser;
                tag.ns === parent.ns && (tag.ns = Object.create(parent.ns)), tag.ns[local] = parser.attribValue;
              }
              parser.attribList.push([ parser.attribName, parser.attribValue ]);
            } else parser.tag.attributes[parser.attribName] = parser.attribValue, emitNode(parser, "onattribute", {
              name: parser.attribName,
              value: parser.attribValue
            });
            parser.attribName = parser.attribValue = "";
          }
        }
        function openTag(parser, selfClosing) {
          if (parser.opt.xmlns) {
            var tag = parser.tag, qn = qname(parser.tagName);
            tag.prefix = qn.prefix, tag.local = qn.local, tag.uri = tag.ns[qn.prefix] || "", 
            tag.prefix && !tag.uri && (strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName)), 
            tag.uri = qn.prefix);
            var parent = parser.tags[parser.tags.length - 1] || parser;
            tag.ns && parent.ns !== tag.ns && Object.keys(tag.ns).forEach((function(p) {
              emitNode(parser, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            }));
            for (var i = 0, l = parser.attribList.length; i < l; i++) {
              var nv = parser.attribList[i], name = nv[0], value = nv[1], qualName = qname(name, !0), prefix = qualName.prefix, local = qualName.local, uri = "" === prefix ? "" : tag.ns[prefix] || "", a = {
                name,
                value,
                prefix,
                local,
                uri
              };
              prefix && "xmlns" !== prefix && !uri && (strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix)), 
              a.uri = prefix), parser.tag.attributes[name] = a, emitNode(parser, "onattribute", a);
            }
            parser.attribList.length = 0;
          }
          parser.tag.isSelfClosing = !!selfClosing, parser.sawRoot = !0, parser.tags.push(parser.tag), 
          emitNode(parser, "onopentag", parser.tag), selfClosing || (parser.noscript || "script" !== parser.tagName.toLowerCase() ? parser.state = S.TEXT : parser.state = S.SCRIPT, 
          parser.tag = null, parser.tagName = ""), parser.attribName = parser.attribValue = "", 
          parser.attribList.length = 0;
        }
        function closeTag(parser) {
          if (!parser.tagName) return strictFail(parser, "Weird empty close tag."), parser.textNode += "</>", 
          void (parser.state = S.TEXT);
          if (parser.script) {
            if ("script" !== parser.tagName) return parser.script += "</" + parser.tagName + ">", 
            parser.tagName = "", void (parser.state = S.SCRIPT);
            emitNode(parser, "onscript", parser.script), parser.script = "";
          }
          var t = parser.tags.length, tagName = parser.tagName;
          parser.strict || (tagName = tagName[parser.looseCase]());
          for (var closeTo = tagName; t--; ) {
            if (parser.tags[t].name === closeTo) break;
            strictFail(parser, "Unexpected close tag");
          }
          if (t < 0) return strictFail(parser, "Unmatched closing tag: " + parser.tagName), 
          parser.textNode += "</" + parser.tagName + ">", void (parser.state = S.TEXT);
          parser.tagName = tagName;
          for (var s = parser.tags.length; s-- > t; ) {
            var tag = parser.tag = parser.tags.pop();
            parser.tagName = parser.tag.name, emitNode(parser, "onclosetag", parser.tagName);
            var x = {};
            for (var i in tag.ns) x[i] = tag.ns[i];
            var parent = parser.tags[parser.tags.length - 1] || parser;
            parser.opt.xmlns && tag.ns !== parent.ns && Object.keys(tag.ns).forEach((function(p) {
              var n = tag.ns[p];
              emitNode(parser, "onclosenamespace", {
                prefix: p,
                uri: n
              });
            }));
          }
          0 === t && (parser.closedRoot = !0), parser.tagName = parser.attribValue = parser.attribName = "", 
          parser.attribList.length = 0, parser.state = S.TEXT;
        }
        function parseEntity(parser) {
          var num, entity = parser.entity, entityLC = entity.toLowerCase(), numStr = "";
          return parser.ENTITIES[entity] ? parser.ENTITIES[entity] : parser.ENTITIES[entityLC] ? parser.ENTITIES[entityLC] : ("#" === (entity = entityLC).charAt(0) && ("x" === entity.charAt(1) ? (entity = entity.slice(2), 
          numStr = (num = parseInt(entity, 16)).toString(16)) : (entity = entity.slice(1), 
          numStr = (num = parseInt(entity, 10)).toString(10))), entity = entity.replace(/^0+/, ""), 
          isNaN(num) || numStr.toLowerCase() !== entity ? (strictFail(parser, "Invalid character entity"), 
          "&" + parser.entity + ";") : String.fromCodePoint(num));
        }
        function beginWhiteSpace(parser, c) {
          "<" === c ? (parser.state = S.OPEN_WAKA, parser.startTagPosition = parser.position) : isWhitespace(c) || (strictFail(parser, "Non-whitespace before first tag."), 
          parser.textNode = c, parser.state = S.TEXT);
        }
        function charAt(chunk, i) {
          var result = "";
          return i < chunk.length && (result = chunk.charAt(i)), result;
        }
        S = sax.STATE;
      }(exports);
    },
    6556: module => {
      "use strict";
      module.exports = require("./_collections");
    },
    128: module => {
      "use strict";
      module.exports = require("./plugins");
    },
    2284: module => {
      "use strict";
      module.exports = require("./vendor/css-select");
    },
    904: module => {
      "use strict";
      module.exports = require("./vendor/css-tree");
    },
    358: module => {
      "use strict";
      module.exports = require("fs");
    },
    2037: module => {
      "use strict";
      module.exports = require("os");
    },
    1017: module => {
      "use strict";
      module.exports = require("path");
    },
    7310: module => {
      "use strict";
      module.exports = require("url");
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
  var __webpack_exports__ = {};
  (() => {
    "use strict";
    var exports = __webpack_exports__;
    const os = __webpack_require__(2037), fs = __webpack_require__(358), {pathToFileURL} = __webpack_require__(7310), path = __webpack_require__(1017), {extendDefaultPlugins, optimize: optimizeAgnostic, createContentItem} = __webpack_require__(2297);
    exports.extendDefaultPlugins = extendDefaultPlugins, exports.createContentItem = createContentItem;
    const importConfig = async configFile => {
      let config;
      if (configFile.endsWith(".cjs")) config = require(configFile); else try {
        const {default: imported} = await import(pathToFileURL(configFile));
        config = imported;
      } catch (importError) {
        try {
          config = require(configFile);
        } catch (requireError) {
          throw "ERR_REQUIRE_ESM" === requireError.code ? importError : requireError;
        }
      }
      if (null == config || "object" != typeof config || Array.isArray(config)) throw Error(`Invalid config file "${configFile}"`);
      return config;
    }, isFile = file => {
      try {
        return fs.statSync(file).isFile();
      } catch (_unused) {
        return !1;
      }
    };
    exports.loadConfig = async (configFile, cwd = process.cwd()) => {
      if (null != configFile) return path.isAbsolute(configFile) ? await importConfig(configFile) : await importConfig(path.join(cwd, configFile));
      let dir = cwd;
      for (;;) {
        const js = path.join(dir, "svgo.config.js");
        if (isFile(js)) return await importConfig(js);
        const mjs = path.join(dir, "svgo.config.mjs");
        if (isFile(mjs)) return await importConfig(mjs);
        const cjs = path.join(dir, "svgo.config.cjs");
        if (isFile(cjs)) return await importConfig(cjs);
        const parent = path.dirname(dir);
        if (dir === parent) return null;
        dir = parent;
      }
    };
    exports.optimize = (input, config) => {
      if (null == config && (config = {}), "object" != typeof config) throw Error("Config should be an object");
      return optimizeAgnostic(input, {
        ...config,
        js2svg: {
          eol: "\r\n" === os.EOL ? "crlf" : "lf",
          ...config.js2svg
        }
      });
    };
  })();
  var __webpack_export_target__ = exports;
  for (var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
  __webpack_exports__.__esModule && Object.defineProperty(__webpack_export_target__, "__esModule", {
    value: !0
  });
})();