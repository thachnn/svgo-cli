(() => {
  "use strict";
  var __webpack_require__ = {
    d: (exports, definition) => {
      for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
        enumerable: !0,
        get: definition[key]
      });
    },
    o: (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop),
    r: exports => {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(exports, "__esModule", {
        value: !0
      });
    }
  }, __webpack_exports__ = {};
  __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
    _compileToken: () => _compileToken,
    _compileUnsafe: () => _compileUnsafe,
    aliases: () => aliases,
    compile: () => src_compile,
    default: () => src,
    filters: () => filters,
    is: () => src_is,
    prepareContext: () => prepareContext,
    pseudos: () => pseudos,
    selectAll: () => selectAll,
    selectOne: () => selectOne
  });
  var domutils_src_namespaceObject = {};
  let src_ElementType;
  __webpack_require__.r(domutils_src_namespaceObject), __webpack_require__.d(domutils_src_namespaceObject, {
    DocumentPosition: () => DocumentPosition,
    append: () => append,
    appendChild: () => appendChild,
    compareDocumentPosition: () => compareDocumentPosition,
    existsOne: () => existsOne,
    filter: () => filter,
    find: () => find,
    findAll: () => findAll,
    findOne: () => findOne,
    findOneChild: () => findOneChild,
    getAttributeValue: () => getAttributeValue,
    getChildren: () => getChildren,
    getElementById: () => getElementById,
    getElements: () => getElements,
    getElementsByTagName: () => getElementsByTagName,
    getElementsByTagType: () => getElementsByTagType,
    getFeed: () => getFeed,
    getInnerHTML: () => getInnerHTML,
    getName: () => getName,
    getOuterHTML: () => getOuterHTML,
    getParent: () => getParent,
    getSiblings: () => getSiblings,
    getText: () => getText,
    hasAttrib: () => hasAttrib,
    hasChildren: () => hasChildren,
    innerText: () => innerText,
    isCDATA: () => isCDATA,
    isComment: () => isComment,
    isDocument: () => isDocument,
    isTag: () => node_isTag,
    isText: () => isText,
    nextElementSibling: () => nextElementSibling,
    prepend: () => prepend,
    prependChild: () => prependChild,
    prevElementSibling: () => prevElementSibling,
    removeElement: () => removeElement,
    removeSubsets: () => removeSubsets,
    replaceElement: () => replaceElement,
    testElement: () => testElement,
    textContent: () => textContent,
    uniqueSort: () => uniqueSort
  }), function(ElementType) {
    ElementType.Root = "root", ElementType.Text = "text", ElementType.Directive = "directive", 
    ElementType.Comment = "comment", ElementType.Script = "script", ElementType.Style = "style", 
    ElementType.Tag = "tag", ElementType.CDATA = "cdata", ElementType.Doctype = "doctype";
  }(src_ElementType || (src_ElementType = {}));
  const Root = src_ElementType.Root, Text = src_ElementType.Text, Directive = src_ElementType.Directive, Comment = src_ElementType.Comment, Script = src_ElementType.Script, Style = src_ElementType.Style, Tag = src_ElementType.Tag, CDATA = src_ElementType.CDATA, Doctype = src_ElementType.Doctype;
  new Map([ [ src_ElementType.Tag, 1 ], [ src_ElementType.Script, 1 ], [ src_ElementType.Style, 1 ], [ src_ElementType.Directive, 1 ], [ src_ElementType.Text, 3 ], [ src_ElementType.CDATA, 4 ], [ src_ElementType.Comment, 8 ], [ src_ElementType.Root, 9 ] ]);
  function node_isTag(node) {
    return (elem = node).type === src_ElementType.Tag || elem.type === src_ElementType.Script || elem.type === src_ElementType.Style;
    var elem;
  }
  function isCDATA(node) {
    return node.type === src_ElementType.CDATA;
  }
  function isText(node) {
    return node.type === src_ElementType.Text;
  }
  function isComment(node) {
    return node.type === src_ElementType.Comment;
  }
  function isDocument(node) {
    return node.type === src_ElementType.Root;
  }
  function hasChildren(node) {
    return Object.prototype.hasOwnProperty.call(node, "children");
  }
  const xml_namespaceObject = JSON.parse('{"amp":"&","apos":"\'","gt":">","lt":"<","quot":"\\""}'), inverseXML = (obj = xml_namespaceObject, 
  Object.keys(obj).sort().reduce(((inverse, name) => (inverse[obj[name]] = `&${name};`, 
  inverse)), {}));
  var obj;
  const xmlReplacer = function(inverse) {
    const single = [], multiple = [];
    for (const k of Object.keys(inverse)) 1 === k.length ? single.push(`\\${k}`) : multiple.push(k);
    single.sort();
    for (let start = 0; start < single.length - 1; start++) {
      let end = start;
      for (;end < single.length - 1 && single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1); ) end += 1;
      const count = 1 + end - start;
      count < 3 || single.splice(start, count, `${single[start]}-${single[end]}`);
    }
    return multiple.unshift(`[${single.join("")}]`), new RegExp(multiple.join("|"), "g");
  }(inverseXML), encodeXML = function(obj) {
    return data => data.replace(reEscapeChars, (c => obj[c] || singleCharReplacer(c)));
  }(inverseXML);
  const reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, getCodePoint = null != String.prototype.codePointAt ? str => str.codePointAt(0) : c => 1024 * (c.charCodeAt(0) - 55296) + c.charCodeAt(1) - 56320 + 65536;
  function singleCharReplacer(c) {
    return `&#x${(c.length > 1 ? getCodePoint(c) : c.charCodeAt(0)).toString(16).toUpperCase()};`;
  }
  const reEscapeChars = new RegExp(`${xmlReplacer.source}|${reNonASCII.source}`, "g");
  const elementNames = new Map([ [ "altglyph", "altGlyph" ], [ "altglyphdef", "altGlyphDef" ], [ "altglyphitem", "altGlyphItem" ], [ "animatecolor", "animateColor" ], [ "animatemotion", "animateMotion" ], [ "animatetransform", "animateTransform" ], [ "clippath", "clipPath" ], [ "feblend", "feBlend" ], [ "fecolormatrix", "feColorMatrix" ], [ "fecomponenttransfer", "feComponentTransfer" ], [ "fecomposite", "feComposite" ], [ "feconvolvematrix", "feConvolveMatrix" ], [ "fediffuselighting", "feDiffuseLighting" ], [ "fedisplacementmap", "feDisplacementMap" ], [ "fedistantlight", "feDistantLight" ], [ "fedropshadow", "feDropShadow" ], [ "feflood", "feFlood" ], [ "fefunca", "feFuncA" ], [ "fefuncb", "feFuncB" ], [ "fefuncg", "feFuncG" ], [ "fefuncr", "feFuncR" ], [ "fegaussianblur", "feGaussianBlur" ], [ "feimage", "feImage" ], [ "femerge", "feMerge" ], [ "femergenode", "feMergeNode" ], [ "femorphology", "feMorphology" ], [ "feoffset", "feOffset" ], [ "fepointlight", "fePointLight" ], [ "fespecularlighting", "feSpecularLighting" ], [ "fespotlight", "feSpotLight" ], [ "fetile", "feTile" ], [ "feturbulence", "feTurbulence" ], [ "foreignobject", "foreignObject" ], [ "glyphref", "glyphRef" ], [ "lineargradient", "linearGradient" ], [ "radialgradient", "radialGradient" ], [ "textpath", "textPath" ] ]), attributeNames = new Map([ [ "definitionurl", "definitionURL" ], [ "attributename", "attributeName" ], [ "attributetype", "attributeType" ], [ "basefrequency", "baseFrequency" ], [ "baseprofile", "baseProfile" ], [ "calcmode", "calcMode" ], [ "clippathunits", "clipPathUnits" ], [ "diffuseconstant", "diffuseConstant" ], [ "edgemode", "edgeMode" ], [ "filterunits", "filterUnits" ], [ "glyphref", "glyphRef" ], [ "gradienttransform", "gradientTransform" ], [ "gradientunits", "gradientUnits" ], [ "kernelmatrix", "kernelMatrix" ], [ "kernelunitlength", "kernelUnitLength" ], [ "keypoints", "keyPoints" ], [ "keysplines", "keySplines" ], [ "keytimes", "keyTimes" ], [ "lengthadjust", "lengthAdjust" ], [ "limitingconeangle", "limitingConeAngle" ], [ "markerheight", "markerHeight" ], [ "markerunits", "markerUnits" ], [ "markerwidth", "markerWidth" ], [ "maskcontentunits", "maskContentUnits" ], [ "maskunits", "maskUnits" ], [ "numoctaves", "numOctaves" ], [ "pathlength", "pathLength" ], [ "patterncontentunits", "patternContentUnits" ], [ "patterntransform", "patternTransform" ], [ "patternunits", "patternUnits" ], [ "pointsatx", "pointsAtX" ], [ "pointsaty", "pointsAtY" ], [ "pointsatz", "pointsAtZ" ], [ "preservealpha", "preserveAlpha" ], [ "preserveaspectratio", "preserveAspectRatio" ], [ "primitiveunits", "primitiveUnits" ], [ "refx", "refX" ], [ "refy", "refY" ], [ "repeatcount", "repeatCount" ], [ "repeatdur", "repeatDur" ], [ "requiredextensions", "requiredExtensions" ], [ "requiredfeatures", "requiredFeatures" ], [ "specularconstant", "specularConstant" ], [ "specularexponent", "specularExponent" ], [ "spreadmethod", "spreadMethod" ], [ "startoffset", "startOffset" ], [ "stddeviation", "stdDeviation" ], [ "stitchtiles", "stitchTiles" ], [ "surfacescale", "surfaceScale" ], [ "systemlanguage", "systemLanguage" ], [ "tablevalues", "tableValues" ], [ "targetx", "targetX" ], [ "targety", "targetY" ], [ "textlength", "textLength" ], [ "viewbox", "viewBox" ], [ "viewtarget", "viewTarget" ], [ "xchannelselector", "xChannelSelector" ], [ "ychannelselector", "yChannelSelector" ], [ "zoomandpan", "zoomAndPan" ] ]), unencodedElements = new Set([ "style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript" ]);
  const singleTag = new Set([ "area", "base", "basefont", "br", "col", "command", "embed", "frame", "hr", "img", "input", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr" ]);
  function render(node, options = {}) {
    const nodes = "length" in node ? node : [ node ];
    let output = "";
    for (let i = 0; i < nodes.length; i++) output += renderNode(nodes[i], options);
    return output;
  }
  function renderNode(node, options) {
    switch (node.type) {
     case Root:
      return render(node.children, options);

     case Directive:
     case Doctype:
      return `<${node.data}>`;

     case Comment:
      return function(elem) {
        return `\x3c!--${elem.data}--\x3e`;
      }(node);

     case CDATA:
      return function(elem) {
        return `<![CDATA[${elem.children[0].data}]]>`;
      }(node);

     case Script:
     case Style:
     case Tag:
      return function(elem, opts) {
        if ("foreign" === opts.xmlMode) {
          var _elementNames$get;
          elem.name = null !== (_elementNames$get = elementNames.get(elem.name)) && void 0 !== _elementNames$get ? _elementNames$get : elem.name, 
          elem.parent && foreignModeIntegrationPoints.has(elem.parent.name) && (opts = {
            ...opts,
            xmlMode: !1
          });
        }
        !opts.xmlMode && foreignElements.has(elem.name) && (opts = {
          ...opts,
          xmlMode: "foreign"
        });
        let tag = `<${elem.name}`;
        const attribs = function(attributes, opts) {
          if (attributes) return Object.keys(attributes).map((key => {
            var _attributes$key;
            const value = null !== (_attributes$key = attributes[key]) && void 0 !== _attributes$key ? _attributes$key : "";
            var _attributeNames$get;
            return "foreign" === opts.xmlMode && (key = null !== (_attributeNames$get = attributeNames.get(key)) && void 0 !== _attributeNames$get ? _attributeNames$get : key), 
            opts.emptyAttrs || opts.xmlMode || "" !== value ? `${key}="${!1 !== opts.decodeEntities ? encodeXML(value) : value.replace(/"/g, "&quot;")}"` : key;
          })).join(" ");
        }(elem.attribs, opts);
        attribs && (tag += ` ${attribs}`);
        0 === elem.children.length && (opts.xmlMode ? !1 !== opts.selfClosingTags : opts.selfClosingTags && singleTag.has(elem.name)) ? (opts.xmlMode || (tag += " "), 
        tag += "/>") : (tag += ">", elem.children.length > 0 && (tag += render(elem.children, opts)), 
        !opts.xmlMode && singleTag.has(elem.name) || (tag += `</${elem.name}>`));
        return tag;
      }(node, options);

     case Text:
      return function(elem, opts) {
        let data = elem.data || "";
        !1 === opts.decodeEntities || !opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name) || (data = encodeXML(data));
        return data;
      }(node, options);
    }
  }
  const foreignModeIntegrationPoints = new Set([ "mi", "mo", "mn", "ms", "mtext", "annotation-xml", "foreignObject", "desc", "title" ]), foreignElements = new Set([ "svg", "math" ]);
  function getOuterHTML(node, options) {
    return render(node, options);
  }
  function getInnerHTML(node, options) {
    return hasChildren(node) ? node.children.map((node => getOuterHTML(node, options))).join("") : "";
  }
  function getText(node) {
    return Array.isArray(node) ? node.map(getText).join("") : node_isTag(node) ? "br" === node.name ? "\n" : getText(node.children) : isCDATA(node) ? getText(node.children) : isText(node) ? node.data : "";
  }
  function textContent(node) {
    return Array.isArray(node) ? node.map(textContent).join("") : hasChildren(node) && !isComment(node) ? textContent(node.children) : isText(node) ? node.data : "";
  }
  function innerText(node) {
    return Array.isArray(node) ? node.map(innerText).join("") : hasChildren(node) && (node.type === src_ElementType.Tag || isCDATA(node)) ? innerText(node.children) : isText(node) ? node.data : "";
  }
  const emptyArray = [];
  function getChildren(elem) {
    var _children;
    return null !== (_children = elem.children) && void 0 !== _children ? _children : emptyArray;
  }
  function getParent(elem) {
    return elem.parent || null;
  }
  function getSiblings(elem) {
    const parent = getParent(elem);
    if (null != parent) return getChildren(parent);
    const siblings = [ elem ];
    let {prev, next} = elem;
    for (;null != prev; ) siblings.unshift(prev), ({prev} = prev);
    for (;null != next; ) siblings.push(next), ({next} = next);
    return siblings;
  }
  function getAttributeValue(elem, name) {
    var _elem$attribs;
    return null === (_elem$attribs = elem.attribs) || void 0 === _elem$attribs ? void 0 : _elem$attribs[name];
  }
  function hasAttrib(elem, name) {
    return null != elem.attribs && Object.prototype.hasOwnProperty.call(elem.attribs, name) && null != elem.attribs[name];
  }
  function getName(elem) {
    return elem.name;
  }
  function nextElementSibling(elem) {
    let {next} = elem;
    for (;null !== next && !node_isTag(next); ) ({next} = next);
    return next;
  }
  function prevElementSibling(elem) {
    let {prev} = elem;
    for (;null !== prev && !node_isTag(prev); ) ({prev} = prev);
    return prev;
  }
  function removeElement(elem) {
    if (elem.prev && (elem.prev.next = elem.next), elem.next && (elem.next.prev = elem.prev), 
    elem.parent) {
      const childs = elem.parent.children;
      childs.splice(childs.lastIndexOf(elem), 1);
    }
  }
  function replaceElement(elem, replacement) {
    const prev = replacement.prev = elem.prev;
    prev && (prev.next = replacement);
    const next = replacement.next = elem.next;
    next && (next.prev = replacement);
    const parent = replacement.parent = elem.parent;
    if (parent) {
      const childs = parent.children;
      childs[childs.lastIndexOf(elem)] = replacement;
    }
  }
  function appendChild(elem, child) {
    if (removeElement(child), child.next = null, child.parent = elem, elem.children.push(child) > 1) {
      const sibling = elem.children[elem.children.length - 2];
      sibling.next = child, child.prev = sibling;
    } else child.prev = null;
  }
  function append(elem, next) {
    removeElement(next);
    const {parent} = elem, currNext = elem.next;
    if (next.next = currNext, next.prev = elem, elem.next = next, next.parent = parent, 
    currNext) {
      if (currNext.prev = next, parent) {
        const childs = parent.children;
        childs.splice(childs.lastIndexOf(currNext), 0, next);
      }
    } else parent && parent.children.push(next);
  }
  function prependChild(elem, child) {
    if (removeElement(child), child.parent = elem, child.prev = null, 1 !== elem.children.unshift(child)) {
      const sibling = elem.children[1];
      sibling.prev = child, child.next = sibling;
    } else child.next = null;
  }
  function prepend(elem, prev) {
    removeElement(prev);
    const {parent} = elem;
    if (parent) {
      const childs = parent.children;
      childs.splice(childs.indexOf(elem), 0, prev);
    }
    elem.prev && (elem.prev.next = prev), prev.parent = parent, prev.prev = elem.prev, 
    prev.next = elem, elem.prev = prev;
  }
  function filter(test, node, recurse = !0, limit = 1 / 0) {
    return Array.isArray(node) || (node = [ node ]), find(test, node, recurse, limit);
  }
  function find(test, nodes, recurse, limit) {
    const result = [];
    for (const elem of nodes) {
      if (test(elem) && (result.push(elem), --limit <= 0)) break;
      if (recurse && hasChildren(elem) && elem.children.length > 0) {
        const children = find(test, elem.children, recurse, limit);
        if (result.push(...children), (limit -= children.length) <= 0) break;
      }
    }
    return result;
  }
  function findOneChild(test, nodes) {
    return nodes.find(test);
  }
  function findOne(test, nodes, recurse = !0) {
    let elem = null;
    for (let i = 0; i < nodes.length && !elem; i++) {
      const checked = nodes[i];
      node_isTag(checked) && (test(checked) ? elem = checked : recurse && checked.children.length > 0 && (elem = findOne(test, checked.children)));
    }
    return elem;
  }
  function existsOne(test, nodes) {
    return nodes.some((checked => node_isTag(checked) && (test(checked) || checked.children.length > 0 && existsOne(test, checked.children))));
  }
  function findAll(test, nodes) {
    const result = [], stack = nodes.filter(node_isTag);
    let elem;
    for (;elem = stack.shift(); ) {
      var _elem$children;
      const children = null === (_elem$children = elem.children) || void 0 === _elem$children ? void 0 : _elem$children.filter(node_isTag);
      children && children.length > 0 && stack.unshift(...children), test(elem) && result.push(elem);
    }
    return result;
  }
  const Checks = {
    tag_name: name => "function" == typeof name ? elem => node_isTag(elem) && name(elem.name) : "*" === name ? node_isTag : elem => node_isTag(elem) && elem.name === name,
    tag_type: type => "function" == typeof type ? elem => type(elem.type) : elem => elem.type === type,
    tag_contains: data => "function" == typeof data ? elem => isText(elem) && data(elem.data) : elem => isText(elem) && elem.data === data
  };
  function getAttribCheck(attrib, value) {
    return "function" == typeof value ? elem => node_isTag(elem) && value(elem.attribs[attrib]) : elem => node_isTag(elem) && elem.attribs[attrib] === value;
  }
  function combineFuncs(a, b) {
    return elem => a(elem) || b(elem);
  }
  function compileTest(options) {
    const funcs = Object.keys(options).map((key => {
      const value = options[key];
      return Object.prototype.hasOwnProperty.call(Checks, key) ? Checks[key](value) : getAttribCheck(key, value);
    }));
    return 0 === funcs.length ? null : funcs.reduce(combineFuncs);
  }
  function testElement(options, node) {
    const test = compileTest(options);
    return !test || test(node);
  }
  function getElements(options, nodes, recurse, limit = 1 / 0) {
    const test = compileTest(options);
    return test ? filter(test, nodes, recurse, limit) : [];
  }
  function getElementById(id, nodes, recurse = !0) {
    return Array.isArray(nodes) || (nodes = [ nodes ]), findOne(getAttribCheck("id", id), nodes, recurse);
  }
  function getElementsByTagName(tagName, nodes, recurse = !0, limit = 1 / 0) {
    return filter(Checks.tag_name(tagName), nodes, recurse, limit);
  }
  function getElementsByTagType(type, nodes, recurse = !0, limit = 1 / 0) {
    return filter(Checks.tag_type(type), nodes, recurse, limit);
  }
  function removeSubsets(nodes) {
    let idx = nodes.length;
    for (;--idx >= 0; ) {
      const node = nodes[idx];
      if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) nodes.splice(idx, 1); else for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) if (nodes.includes(ancestor)) {
        nodes.splice(idx, 1);
        break;
      }
    }
    return nodes;
  }
  var DocumentPosition = {
    DISCONNECTED: 1,
    PRECEDING: 2,
    FOLLOWING: 4,
    CONTAINS: 8,
    CONTAINED_BY: 16
  };
  function compareDocumentPosition(nodeA, nodeB) {
    const aParents = [], bParents = [];
    if (nodeA === nodeB) return 0;
    let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
    for (;current; ) aParents.unshift(current), current = current.parent;
    for (current = hasChildren(nodeB) ? nodeB : nodeB.parent; current; ) bParents.unshift(current), 
    current = current.parent;
    const maxIdx = Math.min(aParents.length, bParents.length);
    let idx = 0;
    for (;idx < maxIdx && aParents[idx] === bParents[idx]; ) idx++;
    if (0 === idx) return DocumentPosition.DISCONNECTED;
    const sharedParent = aParents[idx - 1], siblings = sharedParent.children, aSibling = aParents[idx], bSibling = bParents[idx];
    return siblings.indexOf(aSibling) > siblings.indexOf(bSibling) ? sharedParent === nodeB ? DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY : DocumentPosition.FOLLOWING : sharedParent === nodeA ? DocumentPosition.PRECEDING | DocumentPosition.CONTAINS : DocumentPosition.PRECEDING;
  }
  function uniqueSort(nodes) {
    return nodes = nodes.filter(((node, i, arr) => !arr.includes(node, i + 1))), nodes.sort(((a, b) => {
      const relative = compareDocumentPosition(a, b);
      return relative & DocumentPosition.PRECEDING ? -1 : relative & DocumentPosition.FOLLOWING ? 1 : 0;
    })), nodes;
  }
  function getFeed(doc) {
    const feedRoot = getOneElement(isValidFeed, doc);
    return feedRoot ? "feed" === feedRoot.name ? function(feedRoot) {
      var _getOneElement2;
      const childs = feedRoot.children, feed = {
        type: "atom",
        items: getElementsByTagName("entry", childs).map((item => {
          var _getOneElement;
          const {children} = item, entry = {
            media: getMediaElements(children)
          };
          addConditionally(entry, "id", "id", children), addConditionally(entry, "title", "title", children);
          const href = null === (_getOneElement = getOneElement("link", children)) || void 0 === _getOneElement ? void 0 : _getOneElement.attribs.href;
          href && (entry.link = href);
          const description = fetch("summary", children) || fetch("content", children);
          description && (entry.description = description);
          const pubDate = fetch("updated", children);
          return pubDate && (entry.pubDate = new Date(pubDate)), entry;
        }))
      };
      addConditionally(feed, "id", "id", childs), addConditionally(feed, "title", "title", childs);
      const href = null === (_getOneElement2 = getOneElement("link", childs)) || void 0 === _getOneElement2 ? void 0 : _getOneElement2.attribs.href;
      href && (feed.link = href);
      addConditionally(feed, "description", "subtitle", childs);
      const updated = fetch("updated", childs);
      updated && (feed.updated = new Date(updated));
      return addConditionally(feed, "author", "email", childs, !0), feed;
    }(feedRoot) : function(feedRoot) {
      var _getOneElement$childr, _getOneElement3;
      const childs = null !== (_getOneElement$childr = null === (_getOneElement3 = getOneElement("channel", feedRoot.children)) || void 0 === _getOneElement3 ? void 0 : _getOneElement3.children) && void 0 !== _getOneElement$childr ? _getOneElement$childr : [], feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: getElementsByTagName("item", feedRoot.children).map((item => {
          const {children} = item, entry = {
            media: getMediaElements(children)
          };
          addConditionally(entry, "id", "guid", children), addConditionally(entry, "title", "title", children), 
          addConditionally(entry, "link", "link", children), addConditionally(entry, "description", "description", children);
          const pubDate = fetch("pubDate", children);
          return pubDate && (entry.pubDate = new Date(pubDate)), entry;
        }))
      };
      addConditionally(feed, "title", "title", childs), addConditionally(feed, "link", "link", childs), 
      addConditionally(feed, "description", "description", childs);
      const updated = fetch("lastBuildDate", childs);
      updated && (feed.updated = new Date(updated));
      return addConditionally(feed, "author", "managingEditor", childs, !0), feed;
    }(feedRoot) : null;
  }
  const MEDIA_KEYS_STRING = [ "url", "type", "lang" ], MEDIA_KEYS_INT = [ "fileSize", "bitrate", "framerate", "samplingrate", "channels", "duration", "height", "width" ];
  function getMediaElements(where) {
    return getElementsByTagName("media:content", where).map((elem => {
      const {attribs} = elem, media = {
        medium: attribs.medium,
        isDefault: !!attribs.isDefault
      };
      for (const attrib of MEDIA_KEYS_STRING) attribs[attrib] && (media[attrib] = attribs[attrib]);
      for (const attrib of MEDIA_KEYS_INT) attribs[attrib] && (media[attrib] = parseInt(attribs[attrib], 10));
      return attribs.expression && (media.expression = attribs.expression), media;
    }));
  }
  function getOneElement(tagName, node) {
    return getElementsByTagName(tagName, node, !0, 1)[0];
  }
  function fetch(tagName, where, recurse = !1) {
    return textContent(getElementsByTagName(tagName, where, recurse, 1)).trim();
  }
  function addConditionally(obj, prop, tagName, where, recurse = !1) {
    const val = fetch(tagName, where, recurse);
    val && (obj[prop] = val);
  }
  function isValidFeed(value) {
    return "rss" === value || "feed" === value || "rdf:RDF" === value;
  }
  function trueFunc() {
    return !0;
  }
  function falseFunc() {
    return !1;
  }
  const reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/, reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi, actionTypes = new Map([ [ "~", "element" ], [ "^", "start" ], [ "$", "end" ], [ "*", "any" ], [ "!", "not" ], [ "|", "hyphen" ] ]), Traversals = {
    ">": "child",
    "<": "parent",
    "~": "sibling",
    "+": "adjacent"
  }, attribSelectors = {
    "#": [ "id", "equals" ],
    ".": [ "class", "element" ]
  }, unpackPseudos = new Set([ "has", "not", "matches", "is", "where", "host", "host-context" ]), traversalNames = new Set([ "descendant", ...Object.keys(Traversals).map((k => Traversals[k])) ]), caseInsensitiveAttributes = new Set([ "accept", "accept-charset", "align", "alink", "axis", "bgcolor", "charset", "checked", "clear", "codetype", "color", "compact", "declare", "defer", "dir", "direction", "disabled", "enctype", "face", "frame", "hreflang", "http-equiv", "lang", "language", "link", "media", "method", "multiple", "nohref", "noresize", "noshade", "nowrap", "readonly", "rel", "rev", "rules", "scope", "scrolling", "selected", "shape", "target", "text", "type", "valign", "valuetype", "vlink" ]);
  const stripQuotesFromPseudos = new Set([ "contains", "icontains" ]), quotes = new Set([ '"', "'" ]);
  function funescape(_, escaped, escapedWhitespace) {
    const high = parseInt(escaped, 16) - 65536;
    return high != high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320);
  }
  function unescapeCSS(str) {
    return str.replace(reEscape, funescape);
  }
  function isWhitespace(c) {
    return " " === c || "\n" === c || "\t" === c || "\f" === c || "\r" === c;
  }
  function parse(selector, options) {
    const subselects = [], endIndex = parseSelector(subselects, `${selector}`, options, 0);
    if (endIndex < selector.length) throw new Error(`Unmatched selector: ${selector.slice(endIndex)}`);
    return subselects;
  }
  function parseSelector(subselects, selector, options = {}, selectorIndex) {
    let tokens = [], sawWS = !1;
    function getName(offset) {
      const match = selector.slice(selectorIndex + offset).match(reName);
      if (!match) throw new Error(`Expected name, found ${selector.slice(selectorIndex)}`);
      const [name] = match;
      return selectorIndex += offset + name.length, unescapeCSS(name);
    }
    function stripWhitespace(offset) {
      for (;isWhitespace(selector.charAt(selectorIndex + offset)); ) offset++;
      selectorIndex += offset;
    }
    function isEscaped(pos) {
      let slashCount = 0;
      for (;"\\" === selector.charAt(--pos); ) slashCount++;
      return 1 == (1 & slashCount);
    }
    function ensureNotTraversal() {
      if (tokens.length > 0 && function(selector) {
        return traversalNames.has(selector.type);
      }(tokens[tokens.length - 1])) throw new Error("Did not expect successive traversals.");
    }
    for (stripWhitespace(0); "" !== selector; ) {
      const firstChar = selector.charAt(selectorIndex);
      if (isWhitespace(firstChar)) sawWS = !0, stripWhitespace(1); else if (firstChar in Traversals) ensureNotTraversal(), 
      tokens.push({
        type: Traversals[firstChar]
      }), sawWS = !1, stripWhitespace(1); else if ("," === firstChar) {
        if (0 === tokens.length) throw new Error("Empty sub-selector");
        subselects.push(tokens), tokens = [], sawWS = !1, stripWhitespace(1);
      } else if (selector.startsWith("/*", selectorIndex)) {
        const endIndex = selector.indexOf("*/", selectorIndex + 2);
        if (endIndex < 0) throw new Error("Comment was not terminated");
        selectorIndex = endIndex + 2;
      } else if (sawWS && (ensureNotTraversal(), tokens.push({
        type: "descendant"
      }), sawWS = !1), firstChar in attribSelectors) {
        const [name, action] = attribSelectors[firstChar];
        tokens.push({
          type: "attribute",
          name,
          action,
          value: getName(1),
          namespace: null,
          ignoreCase: !!options.xmlMode && null
        });
      } else if ("[" === firstChar) {
        var _options$lowerCaseAtt;
        stripWhitespace(1);
        let namespace = null;
        "|" === selector.charAt(selectorIndex) && (namespace = "", selectorIndex += 1), 
        selector.startsWith("*|", selectorIndex) && (namespace = "*", selectorIndex += 2);
        let name = getName(0);
        null === namespace && "|" === selector.charAt(selectorIndex) && "=" !== selector.charAt(selectorIndex + 1) && (namespace = name, 
        name = getName(1)), (null !== (_options$lowerCaseAtt = options.lowerCaseAttributeNames) && void 0 !== _options$lowerCaseAtt ? _options$lowerCaseAtt : !options.xmlMode) && (name = name.toLowerCase()), 
        stripWhitespace(0);
        let action = "exists";
        const possibleAction = actionTypes.get(selector.charAt(selectorIndex));
        if (possibleAction) {
          if (action = possibleAction, "=" !== selector.charAt(selectorIndex + 1)) throw new Error("Expected `=`");
          stripWhitespace(2);
        } else "=" === selector.charAt(selectorIndex) && (action = "equals", stripWhitespace(1));
        let value = "", ignoreCase = null;
        if ("exists" !== action) {
          if (quotes.has(selector.charAt(selectorIndex))) {
            const quote = selector.charAt(selectorIndex);
            let sectionEnd = selectorIndex + 1;
            for (;sectionEnd < selector.length && (selector.charAt(sectionEnd) !== quote || isEscaped(sectionEnd)); ) sectionEnd += 1;
            if (selector.charAt(sectionEnd) !== quote) throw new Error("Attribute value didn't end");
            value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd)), selectorIndex = sectionEnd + 1;
          } else {
            const valueStart = selectorIndex;
            for (;selectorIndex < selector.length && (!isWhitespace(selector.charAt(selectorIndex)) && "]" !== selector.charAt(selectorIndex) || isEscaped(selectorIndex)); ) selectorIndex += 1;
            value = unescapeCSS(selector.slice(valueStart, selectorIndex));
          }
          stripWhitespace(0);
          const forceIgnore = selector.charAt(selectorIndex);
          "s" === forceIgnore || "S" === forceIgnore ? (ignoreCase = !1, stripWhitespace(1)) : "i" !== forceIgnore && "I" !== forceIgnore || (ignoreCase = !0, 
          stripWhitespace(1));
        }
        var _ignoreCase;
        if (!options.xmlMode) null !== (_ignoreCase = ignoreCase) && void 0 !== _ignoreCase || (ignoreCase = caseInsensitiveAttributes.has(name));
        if ("]" !== selector.charAt(selectorIndex)) throw new Error("Attribute selector didn't terminate");
        selectorIndex += 1;
        const attributeSelector = {
          type: "attribute",
          name,
          action,
          value,
          namespace,
          ignoreCase
        };
        tokens.push(attributeSelector);
      } else if (":" === firstChar) {
        if (":" === selector.charAt(selectorIndex + 1)) {
          tokens.push({
            type: "pseudo-element",
            name: getName(2).toLowerCase()
          });
          continue;
        }
        const name = getName(1).toLowerCase();
        let data = null;
        if ("(" === selector.charAt(selectorIndex)) if (unpackPseudos.has(name)) {
          if (quotes.has(selector.charAt(selectorIndex + 1))) throw new Error(`Pseudo-selector ${name} cannot be quoted`);
          if (data = [], selectorIndex = parseSelector(data, selector, options, selectorIndex + 1), 
          ")" !== selector.charAt(selectorIndex)) throw new Error(`Missing closing parenthesis in :${name} (${selector})`);
          selectorIndex += 1;
        } else {
          const start = selectorIndex += 1;
          let counter = 1;
          for (;counter > 0 && selectorIndex < selector.length; selectorIndex++) "(" !== selector.charAt(selectorIndex) || isEscaped(selectorIndex) ? ")" !== selector.charAt(selectorIndex) || isEscaped(selectorIndex) || counter-- : counter++;
          if (counter) throw new Error("Parenthesis not matched");
          if (data = selector.slice(start, selectorIndex - 1), stripQuotesFromPseudos.has(name)) {
            const quot = data.charAt(0);
            quot === data.slice(-1) && quotes.has(quot) && (data = data.slice(1, -1)), data = unescapeCSS(data);
          }
        }
        tokens.push({
          type: "pseudo",
          name,
          data
        });
      } else {
        let name, namespace = null;
        if ("*" === firstChar) selectorIndex += 1, name = "*"; else {
          if (!reName.test(selector.slice(selectorIndex))) return tokens.length && "descendant" === tokens[tokens.length - 1].type && tokens.pop(), 
          addToken(subselects, tokens), selectorIndex;
          "|" === selector.charAt(selectorIndex) && (namespace = "", selectorIndex += 1), 
          name = getName(0);
        }
        var _options$lowerCaseTag;
        if ("|" === selector.charAt(selectorIndex) && (namespace = name, "*" === selector.charAt(selectorIndex + 1) ? (name = "*", 
        selectorIndex += 2) : name = getName(1)), "*" === name) tokens.push({
          type: "universal",
          namespace
        }); else (null !== (_options$lowerCaseTag = options.lowerCaseTags) && void 0 !== _options$lowerCaseTag ? _options$lowerCaseTag : !options.xmlMode) && (name = name.toLowerCase()), 
        tokens.push({
          type: "tag",
          name,
          namespace
        });
      }
    }
    return addToken(subselects, tokens), selectorIndex;
  }
  function addToken(subselects, tokens) {
    if (subselects.length > 0 && 0 === tokens.length) throw new Error("Empty sub-selector");
    subselects.push(tokens);
  }
  const procedure = {
    universal: 50,
    tag: 30,
    attribute: 1,
    pseudo: 0,
    "pseudo-element": 0,
    descendant: -1,
    child: -1,
    parent: -1,
    sibling: -1,
    adjacent: -1,
    _flexibleDescendant: -1
  };
  function procedure_isTraversal(t) {
    return procedure[t.type] < 0;
  }
  const attributes = {
    exists: 10,
    equals: 8,
    not: 7,
    start: 6,
    end: 6,
    any: 5,
    hyphen: 4,
    element: 4
  };
  function sortByProcedure(arr) {
    const procs = arr.map(getProcedure);
    for (let i = 1; i < arr.length; i++) {
      const procNew = procs[i];
      if (!(procNew < 0)) for (let j = i - 1; j >= 0 && procNew < procs[j]; j--) {
        const token = arr[j + 1];
        arr[j + 1] = arr[j], arr[j] = token, procs[j + 1] = procs[j], procs[j] = procNew;
      }
    }
  }
  function getProcedure(token) {
    let proc = procedure[token.type];
    if ("attribute" === token.type) proc = attributes[token.action], proc === attributes.equals && "id" === token.name && (proc = 9), 
    token.ignoreCase && (proc >>= 1); else if ("pseudo" === token.type) if (token.data) if ("has" === token.name || "contains" === token.name) proc = 0; else if (Array.isArray(token.data)) {
      proc = 0;
      for (let i = 0; i < token.data.length; i++) {
        if (1 !== token.data[i].length) continue;
        const cur = getProcedure(token.data[i][0]);
        if (0 === cur) {
          proc = 0;
          break;
        }
        cur > proc && (proc = cur);
      }
      token.data.length > 1 && proc > 0 && (proc -= 1);
    } else proc = 1; else proc = 3;
    return proc;
  }
  const reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
  function escapeRegex(value) {
    return value.replace(reChars, "\\$&");
  }
  const attributeRules = {
    equals(next, data, {adapter}) {
      const {name} = data;
      let {value} = data;
      return data.ignoreCase ? (value = value.toLowerCase(), elem => {
        const attr = adapter.getAttributeValue(elem, name);
        return null != attr && attr.length === value.length && attr.toLowerCase() === value && next(elem);
      }) : elem => adapter.getAttributeValue(elem, name) === value && next(elem);
    },
    hyphen(next, data, {adapter}) {
      const {name} = data;
      let {value} = data;
      const len = value.length;
      return data.ignoreCase ? (value = value.toLowerCase(), function(elem) {
        const attr = adapter.getAttributeValue(elem, name);
        return null != attr && (attr.length === len || "-" === attr.charAt(len)) && attr.substr(0, len).toLowerCase() === value && next(elem);
      }) : function(elem) {
        const attr = adapter.getAttributeValue(elem, name);
        return null != attr && (attr.length === len || "-" === attr.charAt(len)) && attr.substr(0, len) === value && next(elem);
      };
    },
    element(next, {name, value, ignoreCase}, {adapter}) {
      if (/\s/.test(value)) return falseFunc;
      const regex = new RegExp(`(?:^|\\s)${escapeRegex(value)}(?:$|\\s)`, ignoreCase ? "i" : "");
      return function(elem) {
        const attr = adapter.getAttributeValue(elem, name);
        return null != attr && attr.length >= value.length && regex.test(attr) && next(elem);
      };
    },
    exists: (next, {name}, {adapter}) => elem => adapter.hasAttrib(elem, name) && next(elem),
    start(next, data, {adapter}) {
      const {name} = data;
      let {value} = data;
      const len = value.length;
      return 0 === len ? falseFunc : data.ignoreCase ? (value = value.toLowerCase(), elem => {
        const attr = adapter.getAttributeValue(elem, name);
        return null != attr && attr.length >= len && attr.substr(0, len).toLowerCase() === value && next(elem);
      }) : elem => {
        var _adapter$getAttribute;
        return !(null === (_adapter$getAttribute = adapter.getAttributeValue(elem, name)) || void 0 === _adapter$getAttribute || !_adapter$getAttribute.startsWith(value)) && next(elem);
      };
    },
    end(next, data, {adapter}) {
      const {name} = data;
      let {value} = data;
      const len = -value.length;
      return 0 === len ? falseFunc : data.ignoreCase ? (value = value.toLowerCase(), elem => {
        var _adapter$getAttribute2;
        return (null === (_adapter$getAttribute2 = adapter.getAttributeValue(elem, name)) || void 0 === _adapter$getAttribute2 ? void 0 : _adapter$getAttribute2.substr(len).toLowerCase()) === value && next(elem);
      }) : elem => {
        var _adapter$getAttribute3;
        return !(null === (_adapter$getAttribute3 = adapter.getAttributeValue(elem, name)) || void 0 === _adapter$getAttribute3 || !_adapter$getAttribute3.endsWith(value)) && next(elem);
      };
    },
    any(next, data, {adapter}) {
      const {name, value} = data;
      if ("" === value) return falseFunc;
      if (data.ignoreCase) {
        const regex = new RegExp(escapeRegex(value), "i");
        return function(elem) {
          const attr = adapter.getAttributeValue(elem, name);
          return null != attr && attr.length >= value.length && regex.test(attr) && next(elem);
        };
      }
      return elem => {
        var _adapter$getAttribute4;
        return !(null === (_adapter$getAttribute4 = adapter.getAttributeValue(elem, name)) || void 0 === _adapter$getAttribute4 || !_adapter$getAttribute4.includes(value)) && next(elem);
      };
    },
    not(next, data, {adapter}) {
      const {name} = data;
      let {value} = data;
      return "" === value ? elem => !!adapter.getAttributeValue(elem, name) && next(elem) : data.ignoreCase ? (value = value.toLowerCase(), 
      elem => {
        const attr = adapter.getAttributeValue(elem, name);
        return (null == attr || attr.length !== value.length || attr.toLowerCase() !== value) && next(elem);
      }) : elem => adapter.getAttributeValue(elem, name) !== value && next(elem);
    }
  }, whitespace = new Set([ 9, 10, 12, 13, 32 ]), ZERO = "0".charCodeAt(0), NINE = "9".charCodeAt(0);
  function nthCheck(formula) {
    return function(parsed) {
      const a = parsed[0], b = parsed[1] - 1;
      if (b < 0 && a <= 0) return falseFunc;
      if (-1 === a) return index => index <= b;
      if (0 === a) return index => index === b;
      if (1 === a) return b < 0 ? trueFunc : index => index >= b;
      const absA = Math.abs(a), bMod = (b % absA + absA) % absA;
      return a > 1 ? index => index >= b && index % absA === bMod : index => index <= b && index % absA === bMod;
    }(function(formula) {
      if ("even" === (formula = formula.trim().toLowerCase())) return [ 2, 0 ];
      if ("odd" === formula) return [ 2, 1 ];
      let idx = 0, a = 0, sign = readSign(), number = readNumber();
      var _number;
      if (idx < formula.length && "n" === formula.charAt(idx) && (idx++, a = sign * (null !== (_number = number) && void 0 !== _number ? _number : 1), 
      skipWhitespace(), idx < formula.length ? (sign = readSign(), skipWhitespace(), number = readNumber()) : sign = number = 0), 
      null === number || idx < formula.length) throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
      return [ a, sign * number ];
      function readSign() {
        return "-" === formula.charAt(idx) ? (idx++, -1) : ("+" === formula.charAt(idx) && idx++, 
        1);
      }
      function readNumber() {
        const start = idx;
        let value = 0;
        for (;idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE; ) value = 10 * value + (formula.charCodeAt(idx) - ZERO), 
        idx++;
        return idx === start ? null : value;
      }
      function skipWhitespace() {
        for (;idx < formula.length && whitespace.has(formula.charCodeAt(idx)); ) idx++;
      }
    }(formula));
  }
  function getChildFunc(next, adapter) {
    return elem => {
      const parent = adapter.getParent(elem);
      return null != parent && adapter.isTag(parent) && next(elem);
    };
  }
  const filters = {
    contains: (next, text, {adapter}) => function(elem) {
      return next(elem) && adapter.getText(elem).includes(text);
    },
    icontains(next, text, {adapter}) {
      const itext = text.toLowerCase();
      return function(elem) {
        return next(elem) && adapter.getText(elem).toLowerCase().includes(itext);
      };
    },
    "nth-child"(next, rule, {adapter, equals}) {
      const func = nthCheck(rule);
      return func === falseFunc ? falseFunc : func === trueFunc ? getChildFunc(next, adapter) : function(elem) {
        const siblings = adapter.getSiblings(elem);
        let pos = 0;
        for (let i = 0; i < siblings.length && !equals(elem, siblings[i]); i++) adapter.isTag(siblings[i]) && pos++;
        return func(pos) && next(elem);
      };
    },
    "nth-last-child"(next, rule, {adapter, equals}) {
      const func = nthCheck(rule);
      return func === falseFunc ? falseFunc : func === trueFunc ? getChildFunc(next, adapter) : function(elem) {
        const siblings = adapter.getSiblings(elem);
        let pos = 0;
        for (let i = siblings.length - 1; i >= 0 && !equals(elem, siblings[i]); i--) adapter.isTag(siblings[i]) && pos++;
        return func(pos) && next(elem);
      };
    },
    "nth-of-type"(next, rule, {adapter, equals}) {
      const func = nthCheck(rule);
      return func === falseFunc ? falseFunc : func === trueFunc ? getChildFunc(next, adapter) : function(elem) {
        const siblings = adapter.getSiblings(elem);
        let pos = 0;
        for (let i = 0; i < siblings.length; i++) {
          const currentSibling = siblings[i];
          if (equals(elem, currentSibling)) break;
          adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem) && pos++;
        }
        return func(pos) && next(elem);
      };
    },
    "nth-last-of-type"(next, rule, {adapter, equals}) {
      const func = nthCheck(rule);
      return func === falseFunc ? falseFunc : func === trueFunc ? getChildFunc(next, adapter) : function(elem) {
        const siblings = adapter.getSiblings(elem);
        let pos = 0;
        for (let i = siblings.length - 1; i >= 0; i--) {
          const currentSibling = siblings[i];
          if (equals(elem, currentSibling)) break;
          adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem) && pos++;
        }
        return func(pos) && next(elem);
      };
    },
    root: (next, _rule, {adapter}) => elem => {
      const parent = adapter.getParent(elem);
      return (null == parent || !adapter.isTag(parent)) && next(elem);
    },
    scope(next, rule, options, context) {
      const {equals} = options;
      return context && 0 !== context.length ? 1 === context.length ? elem => equals(context[0], elem) && next(elem) : elem => context.includes(elem) && next(elem) : filters.root(next, rule, options);
    },
    hover: dynamicStatePseudo("isHovered"),
    visited: dynamicStatePseudo("isVisited"),
    active: dynamicStatePseudo("isActive")
  };
  function dynamicStatePseudo(name) {
    return function(next, _rule, {adapter}) {
      const func = adapter[name];
      return "function" != typeof func ? falseFunc : function(elem) {
        return func(elem) && next(elem);
      };
    };
  }
  const pseudos = {
    empty: (elem, {adapter}) => !adapter.getChildren(elem).some((elem => adapter.isTag(elem) || "" !== adapter.getText(elem))),
    "first-child"(elem, {adapter, equals}) {
      const firstChild = adapter.getSiblings(elem).find((elem => adapter.isTag(elem)));
      return null != firstChild && equals(elem, firstChild);
    },
    "last-child"(elem, {adapter, equals}) {
      const siblings = adapter.getSiblings(elem);
      for (let i = siblings.length - 1; i >= 0; i--) {
        if (equals(elem, siblings[i])) return !0;
        if (adapter.isTag(siblings[i])) break;
      }
      return !1;
    },
    "first-of-type"(elem, {adapter, equals}) {
      const siblings = adapter.getSiblings(elem), elemName = adapter.getName(elem);
      for (let i = 0; i < siblings.length; i++) {
        const currentSibling = siblings[i];
        if (equals(elem, currentSibling)) return !0;
        if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) break;
      }
      return !1;
    },
    "last-of-type"(elem, {adapter, equals}) {
      const siblings = adapter.getSiblings(elem), elemName = adapter.getName(elem);
      for (let i = siblings.length - 1; i >= 0; i--) {
        const currentSibling = siblings[i];
        if (equals(elem, currentSibling)) return !0;
        if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) break;
      }
      return !1;
    },
    "only-of-type"(elem, {adapter, equals}) {
      const elemName = adapter.getName(elem);
      return adapter.getSiblings(elem).every((sibling => equals(elem, sibling) || !adapter.isTag(sibling) || adapter.getName(sibling) !== elemName));
    },
    "only-child": (elem, {adapter, equals}) => adapter.getSiblings(elem).every((sibling => equals(elem, sibling) || !adapter.isTag(sibling)))
  };
  const aliases = {
    "any-link": ":is(a, area, link)[href]",
    link: ":any-link:not(:visited)",
    disabled: ":is(\n        :is(button, input, select, textarea, optgroup, option)[disabled],\n        optgroup[disabled] > option,\n        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)\n    )",
    enabled: ":not(:disabled)",
    checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
    required: ":is(input, select, textarea)[required]",
    optional: ":is(input, select, textarea):not([required])",
    selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
    checkbox: "[type=checkbox]",
    file: "[type=file]",
    password: "[type=password]",
    radio: "[type=radio]",
    reset: "[type=reset]",
    image: "[type=image]",
    submit: "[type=submit]",
    parent: ":not(:empty)",
    header: ":is(h1, h2, h3, h4, h5, h6)",
    button: ":is(button, input[type=button])",
    input: ":is(input, textarea, select, button)",
    text: "input:is(:not([type!='']), [type=text])"
  }, PLACEHOLDER_ELEMENT = {};
  function ensureIsTag(next, adapter) {
    return next === falseFunc ? falseFunc : elem => adapter.isTag(elem) && next(elem);
  }
  function getNextSiblings(elem, adapter) {
    const siblings = adapter.getSiblings(elem);
    if (siblings.length <= 1) return [];
    const elemIndex = siblings.indexOf(elem);
    return elemIndex < 0 || elemIndex === siblings.length - 1 ? [] : siblings.slice(elemIndex + 1).filter(adapter.isTag);
  }
  const is = (next, token, options, context, compileToken) => {
    const func = compileToken(token, {
      xmlMode: !!options.xmlMode,
      adapter: options.adapter,
      equals: options.equals
    }, context);
    return elem => func(elem) && next(elem);
  }, subselects = {
    is,
    matches: is,
    not(next, token, options, context, compileToken) {
      const func = compileToken(token, {
        xmlMode: !!options.xmlMode,
        adapter: options.adapter,
        equals: options.equals
      }, context);
      return func === falseFunc ? next : func === trueFunc ? falseFunc : function(elem) {
        return !func(elem) && next(elem);
      };
    },
    has(next, subselect, options, _context, compileToken) {
      const {adapter} = options, opts = {
        xmlMode: !!options.xmlMode,
        adapter,
        equals: options.equals
      }, context = subselect.some((s => s.some(procedure_isTraversal))) ? [ PLACEHOLDER_ELEMENT ] : void 0, compiled = compileToken(subselect, opts, context);
      if (compiled === falseFunc) return falseFunc;
      if (compiled === trueFunc) return elem => adapter.getChildren(elem).some(adapter.isTag) && next(elem);
      const hasElement = ensureIsTag(compiled, adapter), {shouldTestNextSiblings = !1} = compiled;
      return context ? elem => {
        context[0] = elem;
        const childs = adapter.getChildren(elem), nextElements = shouldTestNextSiblings ? [ ...childs, ...getNextSiblings(elem, adapter) ] : childs;
        return next(elem) && adapter.existsOne(hasElement, nextElements);
      } : elem => next(elem) && adapter.existsOne(hasElement, adapter.getChildren(elem));
    }
  };
  function compilePseudoSelector(next, selector, options, context, compileToken) {
    const {name, data} = selector;
    if (Array.isArray(data)) return subselects[name](next, data, options, context, compileToken);
    if (name in aliases) {
      if (null != data) throw new Error(`Pseudo ${name} doesn't have any arguments`);
      const alias = parse(aliases[name], options);
      return subselects.is(next, alias, options, context, compileToken);
    }
    if (name in filters) return filters[name](next, data, options, context);
    if (name in pseudos) {
      const pseudo = pseudos[name];
      return function(func, name, subselect) {
        if (null === subselect) {
          if (func.length > 2) throw new Error(`pseudo-selector :${name} requires an argument`);
        } else if (2 === func.length) throw new Error(`pseudo-selector :${name} doesn't have any arguments`);
      }(pseudo, name, data), pseudo === falseFunc ? falseFunc : next === trueFunc ? elem => pseudo(elem, options, data) : elem => pseudo(elem, options, data) && next(elem);
    }
    throw new Error(`unmatched pseudo-class :${name}`);
  }
  function compile_compile(selector, options, context) {
    return ensureIsTag(compileUnsafe(selector, options, context), options.adapter);
  }
  function compileUnsafe(selector, options, context) {
    return compileToken("string" == typeof selector ? parse(selector, options) : selector, options, context);
  }
  function includesScopePseudo(t) {
    return "pseudo" === t.type && ("scope" === t.name || Array.isArray(t.data) && t.data.some((data => data.some(includesScopePseudo))));
  }
  const DESCENDANT_TOKEN = {
    type: "descendant"
  }, FLEXIBLE_DESCENDANT_TOKEN = {
    type: "_flexibleDescendant"
  }, SCOPE_TOKEN = {
    type: "pseudo",
    name: "scope",
    data: null
  };
  function compileToken(token, options, context) {
    var _options$context;
    (token = token.filter((t => t.length > 0))).forEach(sortByProcedure), context = null !== (_options$context = options.context) && void 0 !== _options$context ? _options$context : context;
    const isArrayContext = Array.isArray(context), finalContext = context && (Array.isArray(context) ? context : [ context ]);
    !function(token, {adapter}, context) {
      const hasContext = !(null == context || !context.every((e => {
        const parent = adapter.isTag(e) && adapter.getParent(e);
        return e === PLACEHOLDER_ELEMENT || parent && adapter.isTag(parent);
      })));
      for (const t of token) {
        if (t.length > 0 && procedure_isTraversal(t[0]) && "descendant" !== t[0].type) ; else {
          if (!hasContext || t.some(includesScopePseudo)) continue;
          t.unshift(DESCENDANT_TOKEN);
        }
        t.unshift(SCOPE_TOKEN);
      }
    }(token, options, finalContext);
    let shouldTestNextSiblings = !1;
    const query = token.map((rules => {
      if (rules.length >= 2) {
        const [first, second] = rules;
        "pseudo" !== first.type || "scope" !== first.name || (isArrayContext && "descendant" === second.type ? rules[1] = FLEXIBLE_DESCENDANT_TOKEN : "adjacent" !== second.type && "sibling" !== second.type || (shouldTestNextSiblings = !0));
      }
      return function(rules, options, context) {
        var _options$rootFunc;
        return rules.reduce(((previous, rule) => previous === falseFunc ? falseFunc : function(next, selector, options, context, compileToken) {
          const {adapter, equals} = options;
          switch (selector.type) {
           case "pseudo-element":
            throw new Error("Pseudo-elements are not supported by css-select");

           case "attribute":
            return attributeRules[selector.action](next, selector, options);

           case "pseudo":
            return compilePseudoSelector(next, selector, options, context, compileToken);

           case "tag":
            return function(elem) {
              return adapter.getName(elem) === selector.name && next(elem);
            };

           case "descendant":
            if (!1 === options.cacheResults || "undefined" == typeof WeakSet) return function(elem) {
              let current = elem;
              for (;current = adapter.getParent(current); ) if (adapter.isTag(current) && next(current)) return !0;
              return !1;
            };
            const isFalseCache = new WeakSet;
            return function(elem) {
              let current = elem;
              for (;current = adapter.getParent(current); ) if (!isFalseCache.has(current)) {
                if (adapter.isTag(current) && next(current)) return !0;
                isFalseCache.add(current);
              }
              return !1;
            };

           case "_flexibleDescendant":
            return function(elem) {
              let current = elem;
              do {
                if (adapter.isTag(current) && next(current)) return !0;
              } while (current = adapter.getParent(current));
              return !1;
            };

           case "parent":
            return function(elem) {
              return adapter.getChildren(elem).some((elem => adapter.isTag(elem) && next(elem)));
            };

           case "child":
            return function(elem) {
              const parent = adapter.getParent(elem);
              return null != parent && adapter.isTag(parent) && next(parent);
            };

           case "sibling":
            return function(elem) {
              const siblings = adapter.getSiblings(elem);
              for (let i = 0; i < siblings.length; i++) {
                const currentSibling = siblings[i];
                if (equals(elem, currentSibling)) break;
                if (adapter.isTag(currentSibling) && next(currentSibling)) return !0;
              }
              return !1;
            };

           case "adjacent":
            return function(elem) {
              const siblings = adapter.getSiblings(elem);
              let lastElement;
              for (let i = 0; i < siblings.length; i++) {
                const currentSibling = siblings[i];
                if (equals(elem, currentSibling)) break;
                adapter.isTag(currentSibling) && (lastElement = currentSibling);
              }
              return !!lastElement && next(lastElement);
            };

           case "universal":
            return next;
          }
        }(previous, rule, options, context, compileToken)), null !== (_options$rootFunc = options.rootFunc) && void 0 !== _options$rootFunc ? _options$rootFunc : trueFunc);
      }(rules, options, finalContext);
    })).reduce(reduceRules, falseFunc);
    return query.shouldTestNextSiblings = shouldTestNextSiblings, query;
  }
  function reduceRules(a, b) {
    return b === falseFunc || a === trueFunc ? a : a === falseFunc || b === trueFunc ? b : function(elem) {
      return a(elem) || b(elem);
    };
  }
  const defaultEquals = (a, b) => a === b, defaultOptions = {
    adapter: domutils_src_namespaceObject,
    equals: defaultEquals
  };
  function convertOptionFormats(options) {
    var _opts$adapter, _opts$equals, _opts$adapter$equals, _opts$adapter2;
    const opts = null != options ? options : defaultOptions;
    return null !== (_opts$adapter = opts.adapter) && void 0 !== _opts$adapter || (opts.adapter = domutils_src_namespaceObject), 
    null !== (_opts$equals = opts.equals) && void 0 !== _opts$equals || (opts.equals = null !== (_opts$adapter$equals = null === (_opts$adapter2 = opts.adapter) || void 0 === _opts$adapter2 ? void 0 : _opts$adapter2.equals) && void 0 !== _opts$adapter$equals ? _opts$adapter$equals : defaultEquals), 
    opts;
  }
  function wrapCompile(func) {
    return function(selector, options, context) {
      const opts = convertOptionFormats(options);
      return func(selector, opts, context);
    };
  }
  const src_compile = wrapCompile(compile_compile), _compileUnsafe = wrapCompile(compileUnsafe), _compileToken = wrapCompile(compileToken);
  function getSelectorFunc(searchFunc) {
    return function(query, elements, options) {
      const opts = convertOptionFormats(options);
      "function" != typeof query && (query = compileUnsafe(query, opts, elements));
      const filteredElements = prepareContext(elements, opts.adapter, query.shouldTestNextSiblings);
      return searchFunc(query, filteredElements, opts);
    };
  }
  function prepareContext(elems, adapter, shouldTestNextSiblings = !1) {
    return shouldTestNextSiblings && (elems = function(elem, adapter) {
      const elems = Array.isArray(elem) ? elem.slice(0) : [ elem ];
      for (let i = 0; i < elems.length; i++) {
        const nextSiblings = getNextSiblings(elems[i], adapter);
        elems.push(...nextSiblings);
      }
      return elems;
    }(elems, adapter)), Array.isArray(elems) ? adapter.removeSubsets(elems) : adapter.getChildren(elems);
  }
  const selectAll = getSelectorFunc(((query, elems, options) => query !== falseFunc && elems && 0 !== elems.length ? options.adapter.findAll(query, elems) : [])), selectOne = getSelectorFunc(((query, elems, options) => query !== falseFunc && elems && 0 !== elems.length ? options.adapter.findOne(query, elems) : null));
  function src_is(elem, query, options) {
    const opts = convertOptionFormats(options);
    return ("function" == typeof query ? query : compile_compile(query, opts))(elem);
  }
  const src = selectAll;
  var __webpack_export_target__ = exports;
  for (var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
  __webpack_exports__.__esModule && Object.defineProperty(__webpack_export_target__, "__esModule", {
    value: !0
  });
})();