(() => {
  var __webpack_modules__ = {
    2967: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      const {createPreset} = __webpack_require__(4096), presetDefault = createPreset({
        name: "presetDefault",
        plugins: [ __webpack_require__(9776), __webpack_require__(490), __webpack_require__(5013), __webpack_require__(8555), __webpack_require__(8911), __webpack_require__(514), __webpack_require__(7329), __webpack_require__(7854), __webpack_require__(3217), __webpack_require__(9401), __webpack_require__(3506), __webpack_require__(9742), __webpack_require__(2660), __webpack_require__(3268), __webpack_require__(2271), __webpack_require__(2434), __webpack_require__(3657), __webpack_require__(5491), __webpack_require__(9035), __webpack_require__(8203), __webpack_require__(1151), __webpack_require__(3783), __webpack_require__(296), __webpack_require__(1123), __webpack_require__(503), __webpack_require__(8213), __webpack_require__(6603), __webpack_require__(175), __webpack_require__(4812), __webpack_require__(6045), __webpack_require__(6193), __webpack_require__(3444), __webpack_require__(8541) ]
      });
      module.exports = presetDefault;
    },
    8995: (__unused_webpack_module, exports) => {
      "use strict";
      exports.type = "visitor", exports.name = "removeViewBox", exports.active = !1, exports.description = "removes viewBox attribute when possible";
      const viewBoxElems = [ "svg", "pattern", "symbol" ];
      exports.fn = () => ({
        element: {
          enter: (node, parentNode) => {
            if (viewBoxElems.includes(node.name) && null != node.attributes.viewBox && null != node.attributes.width && null != node.attributes.height) {
              if ("svg" === node.name && "root" !== parentNode.type) return;
              const nums = node.attributes.viewBox.split(/[ ,]+/g);
              "0" === nums[0] && "0" === nums[1] && node.attributes.width.replace(/px$/, "") === nums[2] && node.attributes.height.replace(/px$/, "") === nums[3] && delete node.attributes.viewBox;
            }
          }
        }
      });
    },
    503: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {collectStylesheet, computeStyle} = __webpack_require__(1284), {pathElems} = __webpack_require__(6556), {path2js, js2path} = __webpack_require__(3315), {applyTransforms} = __webpack_require__(6101), {cleanupOutData} = __webpack_require__(2199);
      let roundData, precision, error, arcThreshold, arcTolerance;
      exports.name = "convertPathData", exports.type = "visitor", exports.active = !0, 
      exports.description = "optimizes path data: writes in shorter form, applies transformations", 
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
      }, exports.fn = (root, params) => {
        const stylesheet = collectStylesheet(root);
        return {
          element: {
            enter: node => {
              if (pathElems.includes(node.name) && null != node.attributes.d) {
                const computedStyle = computeStyle(stylesheet, node);
                precision = params.floatPrecision, error = !1 !== precision ? +Math.pow(.1, precision).toFixed(precision) : .01, 
                roundData = precision > 0 && precision < 20 ? strongRound : round, params.makeArcs && (arcThreshold = params.makeArcs.threshold, 
                arcTolerance = params.makeArcs.tolerance);
                const hasMarkerMid = null != computedStyle["marker-mid"], maybeHasStroke = computedStyle.stroke && ("dynamic" === computedStyle.stroke.type || "none" !== computedStyle.stroke.value), maybeHasLinecap = computedStyle["stroke-linecap"] && ("dynamic" === computedStyle["stroke-linecap"].type || "butt" !== computedStyle["stroke-linecap"].value), maybeHasStrokeAndLinecap = maybeHasStroke && maybeHasLinecap;
                var data = path2js(node);
                data.length && (params.applyTransforms && applyTransforms(node, data, params), convertToRelative(data), 
                data = function(path, params, {maybeHasStrokeAndLinecap, hasMarkerMid}) {
                  var stringify = data2Path.bind(null, params), relSubpoint = [ 0, 0 ], pathBase = [ 0, 0 ], prev = {};
                  return path = path.filter((function(item, index, path) {
                    let command = item.command, data = item.args, next = path[index + 1];
                    if ("Z" !== command && "z" !== command) {
                      var circle, sdata = data;
                      if ("s" === command && (sdata = [ 0, 0 ].concat(data), "c" === command || "s" === command)) {
                        var pdata = prev.args, n = pdata.length;
                        sdata[0] = pdata[n - 2] - pdata[n - 4], sdata[1] = pdata[n - 1] - pdata[n - 3];
                      }
                      if (params.makeArcs && ("c" == command || "s" == command) && isConvex(sdata) && (circle = function(curve) {
                        var midPoint = getCubicBezierPoint(curve, .5), m1 = [ midPoint[0] / 2, midPoint[1] / 2 ], m2 = [ (midPoint[0] + curve[4]) / 2, (midPoint[1] + curve[5]) / 2 ], center = getIntersection([ m1[0], m1[1], m1[0] + m1[1], m1[1] - m1[0], m2[0], m2[1], m2[0] + (m2[1] - midPoint[1]), m2[1] - (m2[0] - midPoint[0]) ]), radius = center && getDistance([ 0, 0 ], center), tolerance = Math.min(arcThreshold * error, arcTolerance * radius / 100);
                        if (center && radius < 1e15 && [ 1 / 4, 3 / 4 ].every((function(point) {
                          return Math.abs(getDistance(getCubicBezierPoint(curve, point), center) - radius) <= tolerance;
                        }))) return {
                          center,
                          radius
                        };
                      }(sdata))) {
                        var nextLonghand, r = roundData([ circle.radius ])[0], angle = findArcAngle(sdata, circle), sweep = sdata[5] * sdata[0] - sdata[4] * sdata[1] > 0 ? 1 : 0, arc = {
                          command: "a",
                          args: [ r, r, 0, 0, sweep, sdata[4], sdata[5] ],
                          coords: item.coords.slice(),
                          base: item.base
                        }, output = [ arc ], relCenter = [ circle.center[0] - sdata[4], circle.center[1] - sdata[5] ], relCircle = {
                          center: relCenter,
                          radius: circle.radius
                        }, arcCurves = [ item ], hasPrev = 0, suffix = "";
                        if ("c" == prev.command && isConvex(prev.args) && isArcPrev(prev.args, circle) || "a" == prev.command && prev.sdata && isArcPrev(prev.sdata, circle)) {
                          arcCurves.unshift(prev), arc.base = prev.base, arc.args[5] = arc.coords[0] - arc.base[0], 
                          arc.args[6] = arc.coords[1] - arc.base[1];
                          var prevData = "a" == prev.command ? prev.sdata : prev.args;
                          (angle += findArcAngle(prevData, {
                            center: [ prevData[4] + circle.center[0], prevData[5] + circle.center[1] ],
                            radius: circle.radius
                          })) > Math.PI && (arc.args[3] = 1), hasPrev = 1;
                        }
                        for (var j = index; (next = path[++j]) && ~"cs".indexOf(next.command); ) {
                          var nextData = next.args;
                          if ("s" == next.command && (nextData = (nextLonghand = makeLonghand({
                            command: "s",
                            args: next.args.slice()
                          }, path[j - 1].args)).args, nextLonghand.args = nextData.slice(0, 2), suffix = stringify([ nextLonghand ])), 
                          !isConvex(nextData) || !isArc(nextData, relCircle)) break;
                          if ((angle += findArcAngle(nextData, relCircle)) - 2 * Math.PI > .001) break;
                          if (angle > Math.PI && (arc.args[3] = 1), arcCurves.push(next), !(2 * Math.PI - angle > .001)) {
                            arc.args[5] = 2 * (relCircle.center[0] - nextData[4]), arc.args[6] = 2 * (relCircle.center[1] - nextData[5]), 
                            arc.coords = [ arc.base[0] + arc.args[5], arc.base[1] + arc.args[6] ], arc = {
                              command: "a",
                              args: [ r, r, 0, 0, sweep, next.coords[0] - arc.coords[0], next.coords[1] - arc.coords[1] ],
                              coords: next.coords,
                              base: arc.coords
                            }, output.push(arc), j++;
                            break;
                          }
                          arc.coords = next.coords, arc.args[5] = arc.coords[0] - arc.base[0], arc.args[6] = arc.coords[1] - arc.base[1], 
                          relCenter[0] -= nextData[4], relCenter[1] -= nextData[5];
                        }
                        if ((stringify(output) + suffix).length < stringify(arcCurves).length) {
                          if (path[j] && "s" == path[j].command && makeLonghand(path[j], path[j - 1].args), 
                          hasPrev) {
                            var prevArc = output.shift();
                            roundData(prevArc.args), relSubpoint[0] += prevArc.args[5] - prev.args[prev.args.length - 2], 
                            relSubpoint[1] += prevArc.args[6] - prev.args[prev.args.length - 1], prev.command = "a", 
                            prev.args = prevArc.args, item.base = prev.coords = prevArc.coords;
                          }
                          if (arc = output.shift(), 1 == arcCurves.length ? item.sdata = sdata.slice() : arcCurves.length - 1 - hasPrev > 0 && path.splice.apply(path, [ index + 1, arcCurves.length - 1 - hasPrev ].concat(output)), 
                          !arc) return !1;
                          command = "a", data = arc.args, item.coords = arc.coords;
                        }
                      }
                      if (!1 !== precision) {
                        if ("m" === command || "l" === command || "t" === command || "q" === command || "s" === command || "c" === command) for (var i = data.length; i--; ) data[i] += item.base[i % 2] - relSubpoint[i % 2]; else "h" == command ? data[0] += item.base[0] - relSubpoint[0] : "v" == command ? data[0] += item.base[1] - relSubpoint[1] : "a" == command && (data[5] += item.base[0] - relSubpoint[0], 
                        data[6] += item.base[1] - relSubpoint[1]);
                        roundData(data), "h" == command ? relSubpoint[0] += data[0] : "v" == command ? relSubpoint[1] += data[0] : (relSubpoint[0] += data[data.length - 2], 
                        relSubpoint[1] += data[data.length - 1]), roundData(relSubpoint), "M" !== command && "m" !== command || (pathBase[0] = relSubpoint[0], 
                        pathBase[1] = relSubpoint[1]);
                      }
                      if (params.straightCurves && ("c" === command && isCurveStraightLine(data) || "s" === command && isCurveStraightLine(sdata) ? (next && "s" == next.command && makeLonghand(next, data), 
                      command = "l", data = data.slice(-2)) : "q" === command && isCurveStraightLine(data) ? (next && "t" == next.command && makeLonghand(next, data), 
                      command = "l", data = data.slice(-2)) : "t" === command && "q" !== prev.command && "t" !== prev.command ? (command = "l", 
                      data = data.slice(-2)) : "a" !== command || 0 !== data[0] && 0 !== data[1] || (command = "l", 
                      data = data.slice(-2))), params.lineShorthands && "l" === command && (0 === data[1] ? (command = "h", 
                      data.pop()) : 0 === data[0] && (command = "v", data.shift())), params.collapseRepeated && !1 === hasMarkerMid && ("m" === command || "h" === command || "v" === command) && prev.command && command == prev.command.toLowerCase() && ("h" != command && "v" != command || prev.args[0] >= 0 == data[0] >= 0)) return prev.args[0] += data[0], 
                      "h" != command && "v" != command && (prev.args[1] += data[1]), prev.coords = item.coords, 
                      path[index] = prev, !1;
                      if (params.curveSmoothShorthands && prev.command && ("c" === command ? ("c" === prev.command && data[0] === -(prev.args[2] - prev.args[4]) && data[1] === -(prev.args[3] - prev.args[5]) || "s" === prev.command && data[0] === -(prev.args[0] - prev.args[2]) && data[1] === -(prev.args[1] - prev.args[3]) || "c" !== prev.command && "s" !== prev.command && 0 === data[0] && 0 === data[1]) && (command = "s", 
                      data = data.slice(2)) : "q" === command && ("q" === prev.command && data[0] === prev.args[2] - prev.args[0] && data[1] === prev.args[3] - prev.args[1] || "t" === prev.command && data[2] === prev.args[0] && data[3] === prev.args[1]) && (command = "t", 
                      data = data.slice(2))), params.removeUseless && !maybeHasStrokeAndLinecap) {
                        if (("l" === command || "h" === command || "v" === command || "q" === command || "t" === command || "c" === command || "s" === command) && data.every((function(i) {
                          return 0 === i;
                        }))) return path[index] = prev, !1;
                        if ("a" === command && 0 === data[5] && 0 === data[6]) return path[index] = prev, 
                        !1;
                      }
                      item.command = command, item.args = data, prev = item;
                    } else {
                      if (relSubpoint[0] = pathBase[0], relSubpoint[1] = pathBase[1], "Z" === prev.command || "z" === prev.command) return !1;
                      prev = item;
                    }
                    return !0;
                  })), path;
                }(data, params, {
                  maybeHasStrokeAndLinecap,
                  hasMarkerMid
                }), params.utilizeAbsolute && (data = function(path, params) {
                  var prev = path[0];
                  return path = path.filter((function(item, index) {
                    if (0 == index) return !0;
                    if ("Z" === item.command || "z" === item.command) return prev = item, !0;
                    var command = item.command, data = item.args, adata = data.slice();
                    if ("m" === command || "l" === command || "t" === command || "q" === command || "s" === command || "c" === command) for (var i = adata.length; i--; ) adata[i] += item.base[i % 2]; else "h" == command ? adata[0] += item.base[0] : "v" == command ? adata[0] += item.base[1] : "a" == command && (adata[5] += item.base[0], 
                    adata[6] += item.base[1]);
                    roundData(adata);
                    var absoluteDataStr = cleanupOutData(adata, params), relativeDataStr = cleanupOutData(data, params);
                    return (params.forceAbsolutePath || absoluteDataStr.length < relativeDataStr.length && !(params.negativeExtraSpace && command == prev.command && prev.command.charCodeAt(0) > 96 && absoluteDataStr.length == relativeDataStr.length - 1 && (data[0] < 0 || /^0\./.test(data[0]) && prev.args[prev.args.length - 1] % 1))) && (item.command = command.toUpperCase(), 
                    item.args = adata), prev = item, !0;
                  })), path;
                }(data, params)), js2path(node, data, params));
              }
            }
          }
        };
      };
      const convertToRelative = pathData => {
        let start = [ 0, 0 ], cursor = [ 0, 0 ], prevCoords = [ 0, 0 ];
        for (let i = 0; i < pathData.length; i += 1) {
          const pathItem = pathData[i];
          let {command, args} = pathItem;
          "m" === command && (cursor[0] += args[0], cursor[1] += args[1], start[0] = cursor[0], 
          start[1] = cursor[1]), "M" === command && (0 !== i && (command = "m"), args[0] -= cursor[0], 
          args[1] -= cursor[1], cursor[0] += args[0], cursor[1] += args[1], start[0] = cursor[0], 
          start[1] = cursor[1]), "l" === command && (cursor[0] += args[0], cursor[1] += args[1]), 
          "L" === command && (command = "l", args[0] -= cursor[0], args[1] -= cursor[1], cursor[0] += args[0], 
          cursor[1] += args[1]), "h" === command && (cursor[0] += args[0]), "H" === command && (command = "h", 
          args[0] -= cursor[0], cursor[0] += args[0]), "v" === command && (cursor[1] += args[0]), 
          "V" === command && (command = "v", args[0] -= cursor[1], cursor[1] += args[0]), 
          "c" === command && (cursor[0] += args[4], cursor[1] += args[5]), "C" === command && (command = "c", 
          args[0] -= cursor[0], args[1] -= cursor[1], args[2] -= cursor[0], args[3] -= cursor[1], 
          args[4] -= cursor[0], args[5] -= cursor[1], cursor[0] += args[4], cursor[1] += args[5]), 
          "s" === command && (cursor[0] += args[2], cursor[1] += args[3]), "S" === command && (command = "s", 
          args[0] -= cursor[0], args[1] -= cursor[1], args[2] -= cursor[0], args[3] -= cursor[1], 
          cursor[0] += args[2], cursor[1] += args[3]), "q" === command && (cursor[0] += args[2], 
          cursor[1] += args[3]), "Q" === command && (command = "q", args[0] -= cursor[0], 
          args[1] -= cursor[1], args[2] -= cursor[0], args[3] -= cursor[1], cursor[0] += args[2], 
          cursor[1] += args[3]), "t" === command && (cursor[0] += args[0], cursor[1] += args[1]), 
          "T" === command && (command = "t", args[0] -= cursor[0], args[1] -= cursor[1], cursor[0] += args[0], 
          cursor[1] += args[1]), "a" === command && (cursor[0] += args[5], cursor[1] += args[6]), 
          "A" === command && (command = "a", args[5] -= cursor[0], args[6] -= cursor[1], cursor[0] += args[5], 
          cursor[1] += args[6]), "Z" !== command && "z" !== command || (cursor[0] = start[0], 
          cursor[1] = start[1]), pathItem.command = command, pathItem.args = args, pathItem.base = prevCoords, 
          pathItem.coords = [ cursor[0], cursor[1] ], prevCoords = pathItem.coords;
        }
        return pathData;
      };
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
        switch (item.command) {
         case "s":
          item.command = "c";
          break;

         case "t":
          item.command = "q";
        }
        return item.args.unshift(data[data.length - 2] - data[data.length - 4], data[data.length - 1] - data[data.length - 3]), 
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
          return item.args && (strData = cleanupOutData(roundData(item.args.slice()), params)), 
          pathString + item.command + strData;
        }), "");
      }
    },
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
    9203: (__unused_webpack_module, exports) => {
      "use strict";
      const argsCountPerCommand = {
        M: 2,
        m: 2,
        Z: 0,
        z: 0,
        L: 2,
        l: 2,
        H: 1,
        h: 1,
        V: 1,
        v: 1,
        C: 6,
        c: 6,
        S: 4,
        s: 4,
        Q: 4,
        q: 4,
        T: 2,
        t: 2,
        A: 7,
        a: 7
      }, isCommand = c => c in argsCountPerCommand, isWsp = c => {
        const codePoint = c.codePointAt(0);
        return 32 === codePoint || 9 === codePoint || 13 === codePoint || 10 === codePoint;
      }, isDigit = c => {
        const codePoint = c.codePointAt(0);
        return null != codePoint && (48 <= codePoint && codePoint <= 57);
      }, readNumber = (string, cursor) => {
        let i = cursor, value = "", state = "none";
        for (;i < string.length; i += 1) {
          const c = string[i];
          if ("+" === c || "-" === c) {
            if ("none" === state) {
              state = "sign", value += c;
              continue;
            }
            if ("e" === state) {
              state = "exponent_sign", value += c;
              continue;
            }
          }
          if (isDigit(c)) {
            if ("none" === state || "sign" === state || "whole" === state) {
              state = "whole", value += c;
              continue;
            }
            if ("decimal_point" === state || "decimal" === state) {
              state = "decimal", value += c;
              continue;
            }
            if ("e" === state || "exponent_sign" === state || "exponent" === state) {
              state = "exponent", value += c;
              continue;
            }
          }
          if ("." !== c || "none" !== state && "sign" !== state && "whole" !== state) {
            if ("E" !== c && "e" != c || "whole" !== state && "decimal_point" !== state && "decimal" !== state) break;
            state = "e", value += c;
          } else state = "decimal_point", value += c;
        }
        const number = Number.parseFloat(value);
        return Number.isNaN(number) ? [ cursor, null ] : [ i - 1, number ];
      };
      exports.parsePathData = string => {
        const pathData = [];
        let command = null, args = [], argsCount = 0, canHaveComma = !1, hadComma = !1;
        for (let i = 0; i < string.length; i += 1) {
          const c = string.charAt(i);
          if (isWsp(c)) continue;
          if (canHaveComma && "," === c) {
            if (hadComma) break;
            hadComma = !0;
            continue;
          }
          if (isCommand(c)) {
            if (hadComma) return pathData;
            if (null == command) {
              if ("M" !== c && "m" !== c) return pathData;
            } else if (0 !== args.length) return pathData;
            command = c, args = [], argsCount = argsCountPerCommand[command], canHaveComma = !1, 
            0 === argsCount && pathData.push({
              command,
              args
            });
            continue;
          }
          if (null == command) return pathData;
          let newCursor = i, number = null;
          if ("A" === command || "a" === command) {
            const position = args.length;
            0 !== position && 1 !== position || "+" !== c && "-" !== c && ([newCursor, number] = readNumber(string, i)), 
            2 !== position && 5 !== position && 6 !== position || ([newCursor, number] = readNumber(string, i)), 
            3 !== position && 4 !== position || ("0" === c && (number = 0), "1" === c && (number = 1));
          } else [newCursor, number] = readNumber(string, i);
          if (null == number) return pathData;
          args.push(number), canHaveComma = !0, hadComma = !1, i = newCursor, args.length === argsCount && (pathData.push({
            command,
            args
          }), "M" === command && (command = "L"), "m" === command && (command = "l"), args = []);
        }
        return pathData;
      };
      const stringifyNumber = (number, precision) => {
        if (null != precision) {
          const ratio = 10 ** precision;
          number = Math.round(number * ratio) / ratio;
        }
        return number.toString().replace(/^0\./, ".").replace(/^-0\./, "-.");
      }, stringifyArgs = (command, args, precision, disableSpaceAfterFlags) => {
        let result = "", prev = "";
        for (let i = 0; i < args.length; i += 1) {
          const number = args[i], numberString = stringifyNumber(number, precision);
          !disableSpaceAfterFlags || "A" !== command && "a" !== command || i % 7 != 4 && i % 7 != 5 ? 0 === i || numberString.startsWith("-") || prev.includes(".") && numberString.startsWith(".") ? result += numberString : result += ` ${numberString}` : result += numberString, 
          prev = numberString;
        }
        return result;
      };
      exports.stringifyPathData = ({pathData, precision, disableSpaceAfterFlags}) => {
        let combined = [];
        for (let i = 0; i < pathData.length; i += 1) {
          const {command, args} = pathData[i];
          if (0 === i) combined.push({
            command,
            args
          }); else {
            const last = combined[combined.length - 1];
            1 === i && ("L" === command && (last.command = "M"), "l" === command && (last.command = "m")), 
            last.command === command && "M" !== last.command && "m" !== last.command || "M" === last.command && "L" === command || "m" === last.command && "l" === command ? last.args = [ ...last.args, ...args ] : combined.push({
              command,
              args
            });
          }
        }
        let result = "";
        for (const {command, args} of combined) result += command + stringifyArgs(command, args, precision, disableSpaceAfterFlags);
        return result;
      };
    },
    1284: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const stable = __webpack_require__(5235), csstree = __webpack_require__(904), specificity = __webpack_require__(5509), {visit, matches} = __webpack_require__(6317), {attrsGroups, inheritableAttrs, presentationNonInheritableGroupAttrs} = __webpack_require__(6556), csstreeWalkSkip = csstree.walk.skip, parseRule = (ruleNode, dynamic) => {
        let selectors, selectorsSpecificity;
        const declarations = [];
        if (csstree.walk(ruleNode, (cssNode => {
          if ("SelectorList" === cssNode.type) {
            selectorsSpecificity = specificity(cssNode);
            const newSelectorsNode = csstree.clone(cssNode);
            return csstree.walk(newSelectorsNode, ((pseudoClassNode, item, list) => {
              "PseudoClassSelector" === pseudoClassNode.type && (dynamic = !0, list.remove(item));
            })), selectors = csstree.generate(newSelectorsNode), csstreeWalkSkip;
          }
          if ("Declaration" === cssNode.type) return declarations.push({
            name: cssNode.property,
            value: csstree.generate(cssNode.value),
            important: !0 === cssNode.important
          }), csstreeWalkSkip;
        })), null == selectors || null == selectorsSpecificity) throw Error("assert");
        return {
          dynamic,
          selectors,
          specificity: selectorsSpecificity,
          declarations
        };
      }, parseStylesheet = (css, dynamic) => {
        const rules = [], ast = csstree.parse(css, {
          parseValue: !1,
          parseAtrulePrelude: !1
        });
        return csstree.walk(ast, (cssNode => "Rule" === cssNode.type ? (rules.push(parseRule(cssNode, dynamic || !1)), 
        csstreeWalkSkip) : "Atrule" === cssNode.type ? ("keyframes" === cssNode.name || csstree.walk(cssNode, (ruleNode => {
          if ("Rule" === ruleNode.type) return rules.push(parseRule(ruleNode, dynamic || !0)), 
          csstreeWalkSkip;
        })), csstreeWalkSkip) : void 0)), rules;
      }, computeOwnStyle = (stylesheet, node) => {
        const computedStyle = {}, importantStyles = new Map;
        for (const [name, value] of Object.entries(node.attributes)) attrsGroups.presentation.includes(name) && (computedStyle[name] = {
          type: "static",
          inherited: !1,
          value
        }, importantStyles.set(name, !1));
        for (const {selectors, declarations, dynamic} of stylesheet.rules) if (matches(node, selectors)) for (const {name, value, important} of declarations) {
          const computed = computedStyle[name];
          computed && "dynamic" === computed.type || (dynamic ? computedStyle[name] = {
            type: "dynamic",
            inherited: !1
          } : null != computed && !0 !== important && !1 !== importantStyles.get(name) || (computedStyle[name] = {
            type: "static",
            inherited: !1,
            value
          }, importantStyles.set(name, important)));
        }
        const styleDeclarations = null == node.attributes.style ? [] : (css => {
          const declarations = [], ast = csstree.parse(css, {
            context: "declarationList",
            parseValue: !1
          });
          return csstree.walk(ast, (cssNode => {
            "Declaration" === cssNode.type && declarations.push({
              name: cssNode.property,
              value: csstree.generate(cssNode.value),
              important: !0 === cssNode.important
            });
          })), declarations;
        })(node.attributes.style);
        for (const {name, value, important} of styleDeclarations) {
          const computed = computedStyle[name];
          computed && "dynamic" === computed.type || (null != computed && !0 !== important && !1 !== importantStyles.get(name) || (computedStyle[name] = {
            type: "static",
            inherited: !1,
            value
          }, importantStyles.set(name, important)));
        }
        return computedStyle;
      };
      exports.collectStylesheet = root => {
        const rules = [], parents = new Map;
        return visit(root, {
          element: {
            enter: (node, parentNode) => {
              if (parents.set(node, parentNode), "style" === node.name) {
                const dynamic = null != node.attributes.media && "all" !== node.attributes.media;
                if (null == node.attributes.type || "" === node.attributes.type || "text/css" === node.attributes.type) {
                  const children = node.children;
                  for (const child of children) "text" !== child.type && "cdata" !== child.type || rules.push(...parseStylesheet(child.value, dynamic));
                }
              }
            }
          }
        }), stable.inplace(rules, ((a, b) => ((a, b) => {
          for (var i = 0; i < 4; i += 1) {
            if (a[i] < b[i]) return -1;
            if (a[i] > b[i]) return 1;
          }
          return 0;
        })(a.specificity, b.specificity))), {
          rules,
          parents
        };
      };
      exports.computeStyle = (stylesheet, node) => {
        const {parents} = stylesheet, computedStyles = computeOwnStyle(stylesheet, node);
        let parent = parents.get(node);
        for (;null != parent && "root" !== parent.type; ) {
          const inheritedStyles = computeOwnStyle(stylesheet, parent);
          for (const [name, computed] of Object.entries(inheritedStyles)) null == computedStyles[name] && !0 === inheritableAttrs.includes(name) && !1 === presentationNonInheritableGroupAttrs.includes(name) && (computedStyles[name] = {
            ...computed,
            inherited: !0
          });
          parent = parents.get(parent);
        }
        return computedStyles;
      };
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
    6101: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {transformsMultiply, transform2js, transformArc} = __webpack_require__(851), {removeLeadingZero} = __webpack_require__(2199), {referencesProps, attrsGroupsDefaults} = __webpack_require__(6556), regNumericValues = /[-+]?(\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g, defaultStrokeWidth = attrsGroupsDefaults.presentation["stroke-width"];
      exports.applyTransforms = (elem, pathData, params) => {
        if (null == elem.attributes.transform || "" === elem.attributes.transform || null != elem.attributes.style || Object.entries(elem.attributes).some((([name, value]) => referencesProps.includes(name) && value.includes("url(")))) return;
        const matrix = transformsMultiply(transform2js(elem.attributes.transform)), stroke = elem.computedAttr("stroke"), id = elem.computedAttr("id"), transformPrecision = params.transformPrecision;
        if (stroke && "none" != stroke) {
          if (!params.applyTransformsStroked || (matrix.data[0] != matrix.data[3] || matrix.data[1] != -matrix.data[2]) && (matrix.data[0] != -matrix.data[3] || matrix.data[1] != matrix.data[2])) return;
          if (id) {
            let idElem = elem, hasStrokeWidth = !1;
            do {
              idElem.attributes["stroke-width"] && (hasStrokeWidth = !0);
            } while (idElem.attributes.id !== id && !hasStrokeWidth && (idElem = idElem.parentNode));
            if (!hasStrokeWidth) return;
          }
          const scale = +Math.sqrt(matrix.data[0] * matrix.data[0] + matrix.data[1] * matrix.data[1]).toFixed(transformPrecision);
          if (1 !== scale) {
            const strokeWidth = elem.computedAttr("stroke-width") || defaultStrokeWidth;
            null != elem.attributes["vector-effect"] && "non-scaling-stroke" === elem.attributes["vector-effect"] || (null != elem.attributes["stroke-width"] ? elem.attributes["stroke-width"] = elem.attributes["stroke-width"].trim().replace(regNumericValues, (num => removeLeadingZero(num * scale))) : elem.attributes["stroke-width"] = strokeWidth.replace(regNumericValues, (num => removeLeadingZero(num * scale))), 
            null != elem.attributes["stroke-dashoffset"] && (elem.attributes["stroke-dashoffset"] = elem.attributes["stroke-dashoffset"].trim().replace(regNumericValues, (num => removeLeadingZero(num * scale)))), 
            null != elem.attributes["stroke-dasharray"] && (elem.attributes["stroke-dasharray"] = elem.attributes["stroke-dasharray"].trim().replace(regNumericValues, (num => removeLeadingZero(num * scale)))));
          }
        } else if (id) return;
        applyMatrixToPathData(pathData, matrix.data), delete elem.attributes.transform;
      };
      const transformAbsolutePoint = (matrix, x, y) => [ matrix[0] * x + matrix[2] * y + matrix[4], matrix[1] * x + matrix[3] * y + matrix[5] ], transformRelativePoint = (matrix, x, y) => [ matrix[0] * x + matrix[2] * y, matrix[1] * x + matrix[3] * y ], applyMatrixToPathData = (pathData, matrix) => {
        const start = [ 0, 0 ], cursor = [ 0, 0 ];
        for (const pathItem of pathData) {
          let {command, args} = pathItem;
          if ("M" === command) {
            cursor[0] = args[0], cursor[1] = args[1], start[0] = cursor[0], start[1] = cursor[1];
            const [x, y] = transformAbsolutePoint(matrix, args[0], args[1]);
            args[0] = x, args[1] = y;
          }
          if ("m" === command) {
            cursor[0] += args[0], cursor[1] += args[1], start[0] = cursor[0], start[1] = cursor[1];
            const [x, y] = transformRelativePoint(matrix, args[0], args[1]);
            args[0] = x, args[1] = y;
          }
          if ("H" === command && (command = "L", args = [ args[0], cursor[1] ]), "h" === command && (command = "l", 
          args = [ args[0], 0 ]), "V" === command && (command = "L", args = [ cursor[0], args[0] ]), 
          "v" === command && (command = "l", args = [ 0, args[0] ]), "L" === command) {
            cursor[0] = args[0], cursor[1] = args[1];
            const [x, y] = transformAbsolutePoint(matrix, args[0], args[1]);
            args[0] = x, args[1] = y;
          }
          if ("l" === command) {
            cursor[0] += args[0], cursor[1] += args[1];
            const [x, y] = transformRelativePoint(matrix, args[0], args[1]);
            args[0] = x, args[1] = y;
          }
          if ("C" === command) {
            cursor[0] = args[4], cursor[1] = args[5];
            const [x1, y1] = transformAbsolutePoint(matrix, args[0], args[1]), [x2, y2] = transformAbsolutePoint(matrix, args[2], args[3]), [x, y] = transformAbsolutePoint(matrix, args[4], args[5]);
            args[0] = x1, args[1] = y1, args[2] = x2, args[3] = y2, args[4] = x, args[5] = y;
          }
          if ("c" === command) {
            cursor[0] += args[4], cursor[1] += args[5];
            const [x1, y1] = transformRelativePoint(matrix, args[0], args[1]), [x2, y2] = transformRelativePoint(matrix, args[2], args[3]), [x, y] = transformRelativePoint(matrix, args[4], args[5]);
            args[0] = x1, args[1] = y1, args[2] = x2, args[3] = y2, args[4] = x, args[5] = y;
          }
          if ("S" === command) {
            cursor[0] = args[2], cursor[1] = args[3];
            const [x2, y2] = transformAbsolutePoint(matrix, args[0], args[1]), [x, y] = transformAbsolutePoint(matrix, args[2], args[3]);
            args[0] = x2, args[1] = y2, args[2] = x, args[3] = y;
          }
          if ("s" === command) {
            cursor[0] += args[2], cursor[1] += args[3];
            const [x2, y2] = transformRelativePoint(matrix, args[0], args[1]), [x, y] = transformRelativePoint(matrix, args[2], args[3]);
            args[0] = x2, args[1] = y2, args[2] = x, args[3] = y;
          }
          if ("Q" === command) {
            cursor[0] = args[2], cursor[1] = args[3];
            const [x1, y1] = transformAbsolutePoint(matrix, args[0], args[1]), [x, y] = transformAbsolutePoint(matrix, args[2], args[3]);
            args[0] = x1, args[1] = y1, args[2] = x, args[3] = y;
          }
          if ("q" === command) {
            cursor[0] += args[2], cursor[1] += args[3];
            const [x1, y1] = transformRelativePoint(matrix, args[0], args[1]), [x, y] = transformRelativePoint(matrix, args[2], args[3]);
            args[0] = x1, args[1] = y1, args[2] = x, args[3] = y;
          }
          if ("T" === command) {
            cursor[0] = args[0], cursor[1] = args[1];
            const [x, y] = transformAbsolutePoint(matrix, args[0], args[1]);
            args[0] = x, args[1] = y;
          }
          if ("t" === command) {
            cursor[0] += args[0], cursor[1] += args[1];
            const [x, y] = transformRelativePoint(matrix, args[0], args[1]);
            args[0] = x, args[1] = y;
          }
          if ("A" === command) {
            if (transformArc(cursor, args, matrix), cursor[0] = args[5], cursor[1] = args[6], 
            Math.abs(args[2]) > 80) {
              const a = args[0], rotation = args[2];
              args[0] = args[1], args[1] = a, args[2] = rotation + (rotation > 0 ? -90 : 90);
            }
            const [x, y] = transformAbsolutePoint(matrix, args[5], args[6]);
            args[5] = x, args[6] = y;
          }
          if ("a" === command) {
            if (transformArc([ 0, 0 ], args, matrix), cursor[0] += args[5], cursor[1] += args[6], 
            Math.abs(args[2]) > 80) {
              const a = args[0], rotation = args[2];
              args[0] = args[1], args[1] = a, args[2] = rotation + (rotation > 0 ? -90 : 90);
            }
            const [x, y] = transformRelativePoint(matrix, args[5], args[6]);
            args[5] = x, args[6] = y;
          }
          "z" !== command && "Z" !== command || (cursor[0] = start[0], cursor[1] = start[1]), 
          pathItem.command = command, pathItem.args = args;
        }
      };
    },
    3315: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {parsePathData, stringifyPathData} = __webpack_require__(9203);
      var prevCtrlPoint;
      exports.path2js = path => {
        if (path.pathJS) return path.pathJS;
        const pathData = [], newPathData = parsePathData(path.attributes.d);
        for (const {command, args} of newPathData) pathData.push({
          command,
          args
        });
        return pathData.length && "m" == pathData[0].command && (pathData[0].command = "M"), 
        path.pathJS = pathData, pathData;
      };
      const convertRelativeToAbsolute = data => {
        const newData = [];
        let start = [ 0, 0 ], cursor = [ 0, 0 ];
        for (let {command, args} of data) args = args.slice(), "m" === command && (args[0] += cursor[0], 
        args[1] += cursor[1], command = "M"), "M" === command && (cursor[0] = args[0], cursor[1] = args[1], 
        start[0] = cursor[0], start[1] = cursor[1]), "h" === command && (args[0] += cursor[0], 
        command = "H"), "H" === command && (cursor[0] = args[0]), "v" === command && (args[0] += cursor[1], 
        command = "V"), "V" === command && (cursor[1] = args[0]), "l" === command && (args[0] += cursor[0], 
        args[1] += cursor[1], command = "L"), "L" === command && (cursor[0] = args[0], cursor[1] = args[1]), 
        "c" === command && (args[0] += cursor[0], args[1] += cursor[1], args[2] += cursor[0], 
        args[3] += cursor[1], args[4] += cursor[0], args[5] += cursor[1], command = "C"), 
        "C" === command && (cursor[0] = args[4], cursor[1] = args[5]), "s" === command && (args[0] += cursor[0], 
        args[1] += cursor[1], args[2] += cursor[0], args[3] += cursor[1], command = "S"), 
        "S" === command && (cursor[0] = args[2], cursor[1] = args[3]), "q" === command && (args[0] += cursor[0], 
        args[1] += cursor[1], args[2] += cursor[0], args[3] += cursor[1], command = "Q"), 
        "Q" === command && (cursor[0] = args[2], cursor[1] = args[3]), "t" === command && (args[0] += cursor[0], 
        args[1] += cursor[1], command = "T"), "T" === command && (cursor[0] = args[0], cursor[1] = args[1]), 
        "a" === command && (args[5] += cursor[0], args[6] += cursor[1], command = "A"), 
        "A" === command && (cursor[0] = args[5], cursor[1] = args[6]), "z" !== command && "Z" !== command || (cursor[0] = start[0], 
        cursor[1] = start[1], command = "z"), newData.push({
          command,
          args
        });
        return newData;
      };
      function set(dest, source) {
        return dest[0] = source[source.length - 2], dest[1] = source[source.length - 1], 
        dest;
      }
      function processSimplex(simplex, direction) {
        if (2 == simplex.length) {
          let a = simplex[1], b = simplex[0], AO = minus(simplex[1]), AB = sub(b, a);
          dot(AO, AB) > 0 ? set(direction, orth(AB, a)) : (set(direction, AO), simplex.shift());
        } else {
          let a = simplex[2], b = simplex[1], c = simplex[0], AB = sub(b, a), AC = sub(c, a), AO = minus(a), ACB = orth(AB, AC), ABC = orth(AC, AB);
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
      function gatherPoints(pathData) {
        const points = {
          list: [],
          minX: 0,
          minY: 0,
          maxX: 0,
          maxY: 0
        }, addPoint = (path, point) => {
          (!path.list.length || point[1] > path.list[path.maxY][1]) && (path.maxY = path.list.length, 
          points.maxY = points.list.length ? Math.max(point[1], points.maxY) : point[1]), 
          (!path.list.length || point[0] > path.list[path.maxX][0]) && (path.maxX = path.list.length, 
          points.maxX = points.list.length ? Math.max(point[0], points.maxX) : point[0]), 
          (!path.list.length || point[1] < path.list[path.minY][1]) && (path.minY = path.list.length, 
          points.minY = points.list.length ? Math.min(point[1], points.minY) : point[1]), 
          (!path.list.length || point[0] < path.list[path.minX][0]) && (path.minX = path.list.length, 
          points.minX = points.list.length ? Math.min(point[0], points.minX) : point[0]), 
          path.list.push(point);
        };
        for (let i = 0; i < pathData.length; i += 1) {
          const pathDataItem = pathData[i];
          let subPath = 0 === points.list.length ? {
            list: [],
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
          } : points.list[points.list.length - 1], prev = 0 === i ? null : pathData[i - 1], basePoint = 0 === subPath.list.length ? null : subPath.list[subPath.list.length - 1], data = pathDataItem.args, ctrlPoint = basePoint;
          const toAbsolute = (n, i) => n + (null == basePoint ? 0 : basePoint[i % 2]);
          switch (pathDataItem.command) {
           case "M":
            subPath = {
              list: [],
              minX: 0,
              minY: 0,
              maxX: 0,
              maxY: 0
            }, points.list.push(subPath);
            break;

           case "H":
            null != basePoint && addPoint(subPath, [ data[0], basePoint[1] ]);
            break;

           case "V":
            null != basePoint && addPoint(subPath, [ basePoint[0], data[0] ]);
            break;

           case "Q":
            addPoint(subPath, data.slice(0, 2)), prevCtrlPoint = [ data[2] - data[0], data[3] - data[1] ];
            break;

           case "T":
            null == basePoint || null == prev || "Q" != prev.command && "T" != prev.command || (ctrlPoint = [ basePoint[0] + prevCtrlPoint[0], basePoint[1] + prevCtrlPoint[1] ], 
            addPoint(subPath, ctrlPoint), prevCtrlPoint = [ data[0] - ctrlPoint[0], data[1] - ctrlPoint[1] ]);
            break;

           case "C":
            null != basePoint && addPoint(subPath, [ .5 * (basePoint[0] + data[0]), .5 * (basePoint[1] + data[1]) ]), 
            addPoint(subPath, [ .5 * (data[0] + data[2]), .5 * (data[1] + data[3]) ]), addPoint(subPath, [ .5 * (data[2] + data[4]), .5 * (data[3] + data[5]) ]), 
            prevCtrlPoint = [ data[4] - data[2], data[5] - data[3] ];
            break;

           case "S":
            null == basePoint || null == prev || "C" != prev.command && "S" != prev.command || (addPoint(subPath, [ basePoint[0] + .5 * prevCtrlPoint[0], basePoint[1] + .5 * prevCtrlPoint[1] ]), 
            ctrlPoint = [ basePoint[0] + prevCtrlPoint[0], basePoint[1] + prevCtrlPoint[1] ]), 
            null != ctrlPoint && addPoint(subPath, [ .5 * (ctrlPoint[0] + data[0]), .5 * (ctrlPoint[1] + data[1]) ]), 
            addPoint(subPath, [ .5 * (data[0] + data[2]), .5 * (data[1] + data[3]) ]), prevCtrlPoint = [ data[2] - data[0], data[3] - data[1] ];
            break;

           case "A":
            if (null != basePoint) for (var cData, curves = a2c.apply(0, basePoint.concat(data)); (cData = curves.splice(0, 6).map(toAbsolute)).length; ) null != basePoint && addPoint(subPath, [ .5 * (basePoint[0] + cData[0]), .5 * (basePoint[1] + cData[1]) ]), 
            addPoint(subPath, [ .5 * (cData[0] + cData[2]), .5 * (cData[1] + cData[3]) ]), addPoint(subPath, [ .5 * (cData[2] + cData[4]), .5 * (cData[3] + cData[5]) ]), 
            curves.length && addPoint(subPath, basePoint = cData.slice(-2));
          }
          data.length >= 2 && addPoint(subPath, data.slice(-2));
        }
        return points;
      }
      function convexHull(points) {
        points.list.sort((function(a, b) {
          return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
        }));
        var lower = [], minY = 0, bottom = 0;
        for (let i = 0; i < points.list.length; i++) {
          for (;lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points.list[i]) <= 0; ) lower.pop();
          points.list[i][1] < points.list[minY][1] && (minY = i, bottom = lower.length), lower.push(points.list[i]);
        }
        var upper = [], maxY = points.list.length - 1, top = 0;
        for (let i = points.list.length; i--; ) {
          for (;upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points.list[i]) <= 0; ) upper.pop();
          points.list[i][1] > points.list[maxY][1] && (maxY = i, top = upper.length), upper.push(points.list[i]);
        }
        upper.pop(), lower.pop();
        const hullList = lower.concat(upper);
        return {
          list: hullList,
          minX: 0,
          maxX: lower.length,
          minY: bottom,
          maxY: (lower.length + top) % hullList.length
        };
      }
      function cross(o, a, b) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      }
      exports.js2path = function(path, data, params) {
        path.pathJS = data;
        const pathData = [];
        for (const item of data) {
          if (0 !== pathData.length && ("M" === item.command || "m" === item.command)) {
            const last = pathData[pathData.length - 1];
            "M" !== last.command && "m" !== last.command || pathData.pop();
          }
          pathData.push({
            command: item.command,
            args: item.args
          });
        }
        path.attributes.d = stringifyPathData({
          pathData,
          precision: params.floatPrecision,
          disableSpaceAfterFlags: params.noSpaceAfterFlags
        });
      }, exports.intersects = function(path1, path2) {
        const points1 = gatherPoints(convertRelativeToAbsolute(path1)), points2 = gatherPoints(convertRelativeToAbsolute(path2));
        if (points1.maxX <= points2.minX || points2.maxX <= points1.minX || points1.maxY <= points2.minY || points2.maxY <= points1.minY || points1.list.every((set1 => points2.list.every((set2 => set1.list[set1.maxX][0] <= set2.list[set2.minX][0] || set2.list[set2.maxX][0] <= set1.list[set1.minX][0] || set1.list[set1.maxY][1] <= set2.list[set2.minY][1] || set2.list[set2.maxY][1] <= set1.list[set1.minY][1]))))) return !1;
        const hullNest1 = points1.list.map(convexHull), hullNest2 = points2.list.map(convexHull);
        return hullNest1.some((function(hull1) {
          return !(hull1.list.length < 3) && hullNest2.some((function(hull2) {
            if (hull2.list.length < 3) return !1;
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
          for (var value, index = direction[1] >= 0 ? direction[0] < 0 ? polygon.maxY : polygon.maxX : direction[0] < 0 ? polygon.minX : polygon.minY, max = -1 / 0; (value = dot(polygon.list[index], direction)) > max; ) max = value, 
          index = ++index % polygon.list.length;
          return polygon.list[(index || polygon.list.length) - 1];
        }
      };
      const a2c = (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) => {
        const _120 = 120 * Math.PI / 180, rad = Math.PI / 180 * (+angle || 0);
        let res = [];
        const rotateX = (x, y, rad) => x * Math.cos(rad) - y * Math.sin(rad), rotateY = (x, y, rad) => x * Math.sin(rad) + y * Math.cos(rad);
        if (recursive) f1 = recursive[0], f2 = recursive[1], cx = recursive[2], cy = recursive[3]; else {
          y1 = rotateY(x1 = rotateX(x1, y1, -rad), y1, -rad);
          var x = (x1 - (x2 = rotateX(x2, y2, -rad))) / 2, y = (y1 - (y2 = rotateY(x2, y2, -rad))) / 2, h = x * x / (rx * rx) + y * y / (ry * ry);
          h > 1 && (rx *= h = Math.sqrt(h), ry *= h);
          var rx2 = rx * rx, ry2 = ry * ry, k = (large_arc_flag == sweep_flag ? -1 : 1) * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))), cx = k * rx * y / ry + (x1 + x2) / 2, cy = k * -ry * x / rx + (y1 + y2) / 2, f1 = Math.asin(Number(((y1 - cy) / ry).toFixed(9))), f2 = Math.asin(Number(((y2 - cy) / ry).toFixed(9)));
          f1 = x1 < cx ? Math.PI - f1 : f1, f2 = x2 < cx ? Math.PI - f2 : f2, f1 < 0 && (f1 = 2 * Math.PI + f1), 
          f2 < 0 && (f2 = 2 * Math.PI + f2), sweep_flag && f1 > f2 && (f1 -= 2 * Math.PI), 
          !sweep_flag && f2 > f1 && (f2 -= 2 * Math.PI);
        }
        var df = f2 - f1;
        if (Math.abs(df) > _120) {
          var f2old = f2, x2old = x2, y2old = y2;
          f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1), x2 = cx + rx * Math.cos(f2), 
          y2 = cy + ry * Math.sin(f2), res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [ f2, f2old, cx, cy ]);
        }
        df = f2 - f1;
        var c1 = Math.cos(f1), s1 = Math.sin(f1), c2 = Math.cos(f2), s2 = Math.sin(f2), t = Math.tan(df / 4), hx = 4 / 3 * rx * t, hy = 4 / 3 * ry * t, m = [ -hx * s1, hy * c1, x2 + hx * s2 - x1, y2 - hy * c2 - y1, x2 - x1, y2 - y1 ];
        if (recursive) return m.concat(res);
        res = m.concat(res);
        for (var newres = [], i = 0, n = res.length; i < n; i++) newres[i] = i % 2 ? rotateY(res[i - 1], res[i], rad) : rotateX(res[i], res[i + 1], rad);
        return newres;
      };
    },
    851: (__unused_webpack_module, exports) => {
      "use strict";
      const regTransformTypes = /matrix|translate|scale|rotate|skewX|skewY/, regTransformSplit = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/, regNumericValues = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
      exports.transform2js = transformString => {
        const transforms = [];
        let current = null;
        for (const item of transformString.split(regTransformSplit)) {
          var num;
          if (item) if (regTransformTypes.test(item)) current = {
            name: item,
            data: []
          }, transforms.push(current); else for (;num = regNumericValues.exec(item); ) num = Number(num), 
          null != current && current.data.push(num);
        }
        return null == current || 0 == current.data.length ? [] : transforms;
      }, exports.transformsMultiply = transforms => {
        const matrixData = transforms.map((transform => "matrix" === transform.name ? transform.data : transformToMatrix(transform)));
        return {
          name: "matrix",
          data: matrixData.length > 0 ? matrixData.reduce(multiplyTransformMatrices) : []
        };
      };
      const mth = {
        rad: deg => deg * Math.PI / 180,
        deg: rad => 180 * rad / Math.PI,
        cos: deg => Math.cos(mth.rad(deg)),
        acos: (val, floatPrecision) => Number(mth.deg(Math.acos(val)).toFixed(floatPrecision)),
        sin: deg => Math.sin(mth.rad(deg)),
        asin: (val, floatPrecision) => Number(mth.deg(Math.asin(val)).toFixed(floatPrecision)),
        tan: deg => Math.tan(mth.rad(deg)),
        atan: (val, floatPrecision) => Number(mth.deg(Math.atan(val)).toFixed(floatPrecision))
      };
      exports.matrixToTransform = (transform, params) => {
        let floatPrecision = params.floatPrecision, data = transform.data, transforms = [], sx = Number(Math.hypot(data[0], data[1]).toFixed(params.transformPrecision)), sy = Number(((data[0] * data[3] - data[1] * data[2]) / sx).toFixed(params.transformPrecision)), colsSum = data[0] * data[2] + data[1] * data[3], rowsSum = data[0] * data[1] + data[2] * data[3], scaleBefore = 0 != rowsSum || sx == sy;
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
            var cos = data[0] / sx, sin = data[1] / (scaleBefore ? sx : sy), x = data[4] * (scaleBefore ? 1 : sy), y = data[5] * (scaleBefore ? 1 : sx), denom = (Math.pow(1 - cos, 2) + Math.pow(sin, 2)) * (scaleBefore ? 1 : sx * sy);
            rotate.push(((1 - cos) * x - sin * y) / denom), rotate.push(((1 - cos) * y + sin * x) / denom);
          }
        } else if (data[1] || data[2]) return [ transform ];
        return (!scaleBefore || 1 == sx && 1 == sy) && transforms.length || transforms.push({
          name: "scale",
          data: sx == sy ? [ sx ] : [ sx, sy ]
        }), transforms;
      };
      const transformToMatrix = transform => {
        if ("matrix" === transform.name) return transform.data;
        switch (transform.name) {
         case "translate":
          return [ 1, 0, 0, 1, transform.data[0], transform.data[1] || 0 ];

         case "scale":
          return [ transform.data[0], 0, 0, transform.data[1] || transform.data[0], 0, 0 ];

         case "rotate":
          var cos = mth.cos(transform.data[0]), sin = mth.sin(transform.data[0]), cx = transform.data[1] || 0, cy = transform.data[2] || 0;
          return [ cos, sin, -sin, cos, (1 - cos) * cx + sin * cy, (1 - cos) * cy - sin * cx ];

         case "skewX":
          return [ 1, 0, mth.tan(transform.data[0]), 1, 0, 0 ];

         case "skewY":
          return [ 1, mth.tan(transform.data[0]), 0, 1, 0, 0 ];

         default:
          throw Error(`Unknown transform ${transform.name}`);
        }
      };
      exports.transformArc = (cursor, arc, transform) => {
        const x = arc[5] - cursor[0], y = arc[6] - cursor[1];
        let a = arc[0], b = arc[1];
        const rot = arc[2] * Math.PI / 180, cos = Math.cos(rot), sin = Math.sin(rot);
        if (a > 0 && b > 0) {
          let h = Math.pow(x * cos + y * sin, 2) / (4 * a * a) + Math.pow(y * cos - x * sin, 2) / (4 * b * b);
          h > 1 && (h = Math.sqrt(h), a *= h, b *= h);
        }
        const m = multiplyTransformMatrices(transform, [ a * cos, a * sin, -b * sin, b * cos, 0, 0 ]), lastCol = m[2] * m[2] + m[3] * m[3], squareSum = m[0] * m[0] + m[1] * m[1] + lastCol, root = Math.hypot(m[0] - m[3], m[1] + m[2]) * Math.hypot(m[0] + m[3], m[1] - m[2]);
        if (root) {
          const majorAxisSqr = (squareSum + root) / 2, minorAxisSqr = (squareSum - root) / 2, major = Math.abs(majorAxisSqr - lastCol) > 1e-6, sub = (major ? majorAxisSqr : minorAxisSqr) - lastCol, rowsSum = m[0] * m[2] + m[1] * m[3], term1 = m[0] * sub + m[2] * rowsSum, term2 = m[1] * sub + m[3] * rowsSum;
          arc[0] = Math.sqrt(majorAxisSqr), arc[1] = Math.sqrt(minorAxisSqr), arc[2] = ((major ? term2 < 0 : term1 > 0) ? -1 : 1) * Math.acos((major ? term1 : term2) / Math.hypot(term1, term2)) * 180 / Math.PI;
        } else arc[0] = arc[1] = Math.sqrt(squareSum / 2), arc[2] = 0;
        return transform[0] < 0 != transform[3] < 0 && (arc[4] = 1 - arc[4]), arc;
      };
      const multiplyTransformMatrices = (a, b) => [ a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5] ];
    },
    3963: (__unused_webpack_module, exports) => {
      "use strict";
      exports.name = "addAttributesToSVGElement", exports.type = "visitor", exports.active = !1, 
      exports.description = "adds attributes to an outer <svg> element";
      exports.fn = (root, params) => {
        if (!Array.isArray(params.attributes) && !params.attribute) return console.error('Error in plugin "addAttributesToSVGElement": absent parameters.\nIt should have a list of "attributes" or one "attribute".\nConfig example:\n\nplugins: [\n  {\n    name: \'addAttributesToSVGElement\',\n    params: {\n      attribute: "mySvg"\n    }\n  }\n]\n\nplugins: [\n  {\n    name: \'addAttributesToSVGElement\',\n    params: {\n      attributes: ["mySvg", "size-big"]\n    }\n  }\n]\n\nplugins: [\n  {\n    name: \'addAttributesToSVGElement\',\n    params: {\n      attributes: [\n        {\n          focusable: false\n        },\n        {\n          \'data-image\': icon\n        }\n      ]\n    }\n  }\n]\n'), 
        null;
        const attributes = params.attributes || [ params.attribute ];
        return {
          element: {
            enter: (node, parentNode) => {
              if ("svg" === node.name && "root" === parentNode.type) for (const attribute of attributes) if ("string" == typeof attribute && null == node.attributes[attribute] && (node.attributes[attribute] = void 0), 
              "object" == typeof attribute) for (const key of Object.keys(attribute)) null == node.attributes[key] && (node.attributes[key] = attribute[key]);
            }
          }
        };
      };
    },
    4886: (__unused_webpack_module, exports) => {
      "use strict";
      exports.name = "addClassesToSVGElement", exports.type = "visitor", exports.active = !1, 
      exports.description = "adds classnames to an outer <svg> element";
      exports.fn = (root, params) => {
        if (!(Array.isArray(params.classNames) && params.classNames.some(String) || params.className)) return console.error('Error in plugin "addClassesToSVGElement": absent parameters.\nIt should have a list of classes in "classNames" or one "className".\nConfig example:\n\nplugins: [\n  {\n    name: "addClassesToSVGElement",\n    params: {\n      className: "mySvg"\n    }\n  }\n]\n\nplugins: [\n  {\n    name: "addClassesToSVGElement",\n    params: {\n      classNames: ["mySvg", "size-big"]\n    }\n  }\n]\n'), 
        null;
        const classNames = params.classNames || [ params.className ];
        return {
          element: {
            enter: (node, parentNode) => {
              if ("svg" === node.name && "root" === parentNode.type) {
                const classList = new Set(null == node.attributes.class ? null : node.attributes.class.split(" "));
                for (const className of classNames) null != className && classList.add(className);
                node.attributes.class = Array.from(classList).join(" ");
              }
            }
          }
        };
      };
    },
    514: (__unused_webpack_module, exports) => {
      "use strict";
      exports.name = "cleanupAttrs", exports.type = "visitor", exports.active = !0, exports.description = "cleanups attributes from newlines, trailing and repeating spaces";
      const regNewlinesNeedSpace = /(\S)\r?\n(\S)/g, regNewlines = /\r?\n/g, regSpaces = /\s{2,}/g;
      exports.fn = (root, params) => {
        const {newlines = !0, trim = !0, spaces = !0} = params;
        return {
          element: {
            enter: node => {
              for (const name of Object.keys(node.attributes)) newlines && (node.attributes[name] = node.attributes[name].replace(regNewlinesNeedSpace, ((match, p1, p2) => p1 + " " + p2)), 
              node.attributes[name] = node.attributes[name].replace(regNewlines, "")), trim && (node.attributes[name] = node.attributes[name].trim()), 
              spaces && (node.attributes[name] = node.attributes[name].replace(regSpaces, " "));
            }
          }
        };
      };
    },
    3657: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {visit} = __webpack_require__(6317);
      exports.type = "visitor", exports.name = "cleanupEnableBackground", exports.active = !0, 
      exports.description = "remove or cleanup enable-background attribute when possible", 
      exports.fn = root => {
        const regEnableBackground = /^new\s0\s0\s([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s([-+]?\d*\.?\d+([eE][-+]?\d+)?)$/;
        let hasFilter = !1;
        return visit(root, {
          element: {
            enter: node => {
              "filter" === node.name && (hasFilter = !0);
            }
          }
        }), {
          element: {
            enter: node => {
              if (null != node.attributes["enable-background"]) if (hasFilter) {
                if (("svg" === node.name || "mask" === node.name || "pattern" === node.name) && null != node.attributes.width && null != node.attributes.height) {
                  const match = node.attributes["enable-background"].match(regEnableBackground);
                  null != match && node.attributes.width === match[1] && node.attributes.height === match[3] && ("svg" === node.name ? delete node.attributes["enable-background"] : node.attributes["enable-background"] = "new");
                }
              } else delete node.attributes["enable-background"];
            }
          }
        };
      };
    },
    9401: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {visitSkip} = __webpack_require__(6317), {referencesProps} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "cleanupIDs", exports.active = !0, exports.description = "removes unused IDs and minifies used";
      const regReferencesUrl = /\burl\(("|')?#(.+?)\1\)/, regReferencesHref = /^#(.+?)$/, regReferencesBegin = /(\w+)\./, generateIDchars = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ], maxIDindex = generateIDchars.length - 1, generateID = currentID => {
        if (null == currentID) return [ 0 ];
        currentID[currentID.length - 1] += 1;
        for (let i = currentID.length - 1; i > 0; i--) currentID[i] > maxIDindex && (currentID[i] = 0, 
        void 0 !== currentID[i - 1] && currentID[i - 1]++);
        return currentID[0] > maxIDindex && (currentID[0] = 0, currentID.unshift(0)), currentID;
      }, getIDstring = (arr, prefix) => prefix + arr.map((i => generateIDchars[i])).join("");
      exports.fn = (_root, params) => {
        const {remove = !0, minify = !0, prefix = "", preserve = [], preservePrefixes = [], force = !1} = params, preserveIDs = new Set(Array.isArray(preserve) ? preserve : preserve ? [ preserve ] : []), preserveIDPrefixes = Array.isArray(preservePrefixes) ? preservePrefixes : preservePrefixes ? [ preservePrefixes ] : [], nodeById = new Map, referencesById = new Map;
        let deoptimized = !1;
        return {
          element: {
            enter: node => {
              if (0 == force) {
                if (("style" === node.name || "script" === node.name) && 0 !== node.children.length) return void (deoptimized = !0);
                if ("svg" === node.name) {
                  let hasDefsOnly = !0;
                  for (const child of node.children) if ("element" !== child.type || "defs" !== child.name) {
                    hasDefsOnly = !1;
                    break;
                  }
                  if (hasDefsOnly) return visitSkip;
                }
              }
              for (const [name, value] of Object.entries(node.attributes)) if ("id" === name) {
                const id = value;
                nodeById.has(id) ? delete node.attributes.id : nodeById.set(id, node);
              } else {
                let id = null;
                if (referencesProps.includes(name)) {
                  const match = value.match(regReferencesUrl);
                  null != match && (id = match[2]);
                }
                if ("href" === name || name.endsWith(":href")) {
                  const match = value.match(regReferencesHref);
                  null != match && (id = match[1]);
                }
                if ("begin" === name) {
                  const match = value.match(regReferencesBegin);
                  null != match && (id = match[1]);
                }
                if (null != id) {
                  let refs = referencesById.get(id);
                  null == refs && (refs = [], referencesById.set(id, refs)), refs.push({
                    element: node,
                    name,
                    value
                  });
                }
              }
            }
          },
          root: {
            exit: () => {
              if (deoptimized) return;
              const isIdPreserved = id => preserveIDs.has(id) || ((string, prefixes) => {
                for (const prefix of prefixes) if (string.startsWith(prefix)) return !0;
                return !1;
              })(id, preserveIDPrefixes);
              let currentID = null;
              for (const [id, refs] of referencesById) {
                const node = nodeById.get(id);
                if (null != node) {
                  if (minify && !1 === isIdPreserved(id)) {
                    let currentIDString = null;
                    do {
                      currentID = generateID(currentID), currentIDString = getIDstring(currentID, prefix);
                    } while (isIdPreserved(currentIDString));
                    node.attributes.id = currentIDString;
                    for (const {element, name, value} of refs) value.includes("#") ? element.attributes[name] = value.replace(`#${id}`, `#${currentIDString}`) : element.attributes[name] = value.replace(`${id}.`, `${currentIDString}.`);
                  }
                  nodeById.delete(id);
                }
              }
              if (remove) for (const [id, node] of nodeById) !1 === isIdPreserved(id) && delete node.attributes.id;
            }
          }
        };
      };
    },
    7458: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {removeLeadingZero} = __webpack_require__(2199);
      exports.name = "cleanupListOfValues", exports.type = "visitor", exports.active = !1, 
      exports.description = "rounds list of values to the fixed precision";
      const regNumericValues = /^([-+]?\d*\.?\d+([eE][-+]?\d+)?)(px|pt|pc|mm|cm|m|in|ft|em|ex|%)?$/, regSeparator = /\s+,?\s*|,\s*/, absoluteLengths = {
        cm: 96 / 2.54,
        mm: 96 / 25.4,
        in: 96,
        pt: 4 / 3,
        pc: 16,
        px: 1
      };
      exports.fn = (_root, params) => {
        const {floatPrecision = 3, leadingZero = !0, defaultPx = !0, convertToPx = !0} = params, roundValues = lists => {
          const roundedList = [];
          for (const elem of lists.split(regSeparator)) {
            const match = elem.match(regNumericValues), matchNew = elem.match(/new/);
            if (match) {
              let str, num = Number(Number(match[1]).toFixed(floatPrecision)), units = match[3] || "";
              if (convertToPx && units && units in absoluteLengths) {
                const pxNum = Number((absoluteLengths[units] * Number(match[1])).toFixed(floatPrecision));
                pxNum.toString().length < match[0].length && (num = pxNum, units = "px");
              }
              str = leadingZero ? removeLeadingZero(num) : num.toString(), defaultPx && "px" === units && (units = ""), 
              roundedList.push(str + units);
            } else matchNew ? roundedList.push("new") : elem && roundedList.push(elem);
          }
          return roundedList.join(" ");
        };
        return {
          element: {
            enter: node => {
              null != node.attributes.points && (node.attributes.points = roundValues(node.attributes.points)), 
              null != node.attributes["enable-background"] && (node.attributes["enable-background"] = roundValues(node.attributes["enable-background"])), 
              null != node.attributes.viewBox && (node.attributes.viewBox = roundValues(node.attributes.viewBox)), 
              null != node.attributes["stroke-dasharray"] && (node.attributes["stroke-dasharray"] = roundValues(node.attributes["stroke-dasharray"])), 
              null != node.attributes.dx && (node.attributes.dx = roundValues(node.attributes.dx)), 
              null != node.attributes.dy && (node.attributes.dy = roundValues(node.attributes.dy)), 
              null != node.attributes.x && (node.attributes.x = roundValues(node.attributes.x)), 
              null != node.attributes.y && (node.attributes.y = roundValues(node.attributes.y));
            }
          }
        };
      };
    },
    9742: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {removeLeadingZero} = __webpack_require__(2199);
      exports.name = "cleanupNumericValues", exports.type = "visitor", exports.active = !0, 
      exports.description = "rounds numeric values to the fixed precision, removes default ‘px’ units";
      const regNumericValues = /^([-+]?\d*\.?\d+([eE][-+]?\d+)?)(px|pt|pc|mm|cm|m|in|ft|em|ex|%)?$/, absoluteLengths = {
        cm: 96 / 2.54,
        mm: 96 / 25.4,
        in: 96,
        pt: 4 / 3,
        pc: 16,
        px: 1
      };
      exports.fn = (_root, params) => {
        const {floatPrecision = 3, leadingZero = !0, defaultPx = !0, convertToPx = !0} = params;
        return {
          element: {
            enter: node => {
              if (null != node.attributes.viewBox) {
                const nums = node.attributes.viewBox.split(/\s,?\s*|,\s*/g);
                node.attributes.viewBox = nums.map((value => {
                  const num = Number(value);
                  return Number.isNaN(num) ? value : Number(num.toFixed(floatPrecision));
                })).join(" ");
              }
              for (const [name, value] of Object.entries(node.attributes)) {
                if ("version" === name) continue;
                const match = value.match(regNumericValues);
                if (match) {
                  let str, num = Number(Number(match[1]).toFixed(floatPrecision)), units = match[3] || "";
                  if (convertToPx && "" !== units && units in absoluteLengths) {
                    const pxNum = Number((absoluteLengths[units] * Number(match[1])).toFixed(floatPrecision));
                    pxNum.toString().length < match[0].length && (num = pxNum, units = "px");
                  }
                  str = leadingZero ? removeLeadingZero(num) : num.toString(), defaultPx && "px" === units && (units = ""), 
                  node.attributes[name] = str + units;
                }
              }
            }
          }
        };
      };
    },
    1123: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {inheritableAttrs, elemsGroups} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "collapseGroups", exports.active = !0, 
      exports.description = "collapses useless groups";
      const hasAnimatedAttr = (node, name) => {
        if ("element" === node.type) {
          if (elemsGroups.animation.includes(node.name) && node.attributes.attributeName === name) return !0;
          for (const child of node.children) if (hasAnimatedAttr(child, name)) return !0;
        }
        return !1;
      };
      exports.fn = () => ({
        element: {
          exit: (node, parentNode) => {
            if ("root" !== parentNode.type && "switch" !== parentNode.name && "g" === node.name && 0 !== node.children.length) {
              if (0 !== Object.keys(node.attributes).length && 1 === node.children.length) {
                const firstChild = node.children[0];
                if ("element" === firstChild.type && null == firstChild.attributes.id && null == node.attributes.filter && (null == node.attributes.class || null == firstChild.attributes.class) && (null == node.attributes["clip-path"] && null == node.attributes.mask || "g" === firstChild.name && null == node.attributes.transform && null == firstChild.attributes.transform)) for (const [name, value] of Object.entries(node.attributes)) {
                  if (hasAnimatedAttr(firstChild, name)) return;
                  if (null == firstChild.attributes[name]) firstChild.attributes[name] = value; else if ("transform" === name) firstChild.attributes[name] = value + " " + firstChild.attributes[name]; else if ("inherit" === firstChild.attributes[name]) firstChild.attributes[name] = value; else if (!1 === inheritableAttrs.includes(name) && firstChild.attributes[name] !== value) return;
                  delete node.attributes[name];
                }
              }
              if (0 === Object.keys(node.attributes).length) {
                for (const child of node.children) if ("element" === child.type && elemsGroups.animation.includes(child.name)) return;
                const index = parentNode.children.indexOf(node);
                parentNode.children.splice(index, 1, ...node.children);
                for (const child of node.children) child.parentNode = parentNode;
              }
            }
          }
        }
      });
    },
    2660: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const collections = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "convertColors", exports.active = !0, exports.description = "converts colors: rgb() to #rrggbb and #rrggbb to #rgb";
      const rNumber = "([+-]?(?:\\d*\\.\\d+|\\d+\\.?)%?)", regRGB = new RegExp("^rgb\\(\\s*" + rNumber + "\\s*,\\s*" + rNumber + "\\s*,\\s*" + rNumber + "\\s*\\)$"), regHEX = /^#(([a-fA-F0-9])\2){3}$/, convertRgbToHex = ([r, g, b]) => "#" + ((256 + r << 8 | g) << 8 | b).toString(16).slice(1).toUpperCase();
      exports.fn = (_root, params) => {
        const {currentColor = !1, names2hex = !0, rgb2hex = !0, shorthex = !0, shortname = !0} = params;
        return {
          element: {
            enter: node => {
              for (const [name, value] of Object.entries(node.attributes)) if (collections.colorsProps.includes(name)) {
                let val = value;
                if (currentColor) {
                  let matched;
                  matched = "string" == typeof currentColor ? val === currentColor : currentColor instanceof RegExp ? null != currentColor.exec(val) : "none" !== val, 
                  matched && (val = "currentColor");
                }
                if (names2hex) {
                  const colorName = val.toLowerCase();
                  null != collections.colorsNames[colorName] && (val = collections.colorsNames[colorName]);
                }
                if (rgb2hex) {
                  let match = val.match(regRGB);
                  if (null != match) {
                    let nums = match.slice(1, 4).map((m => {
                      let n;
                      return n = m.indexOf("%") > -1 ? Math.round(2.55 * parseFloat(m)) : Number(m), Math.max(0, Math.min(n, 255));
                    }));
                    val = convertRgbToHex(nums);
                  }
                }
                if (shorthex) {
                  let match = val.match(regHEX);
                  null != match && (val = "#" + match[0][1] + match[0][3] + match[0][5]);
                }
                if (shortname) {
                  const colorName = val.toLowerCase();
                  null != collections.colorsShortNames[colorName] && (val = collections.colorsShortNames[colorName]);
                }
                node.attributes[name] = val;
              }
            }
          }
        };
      };
    },
    1151: (__unused_webpack_module, exports) => {
      "use strict";
      exports.name = "convertEllipseToCircle", exports.type = "visitor", exports.active = !0, 
      exports.description = "converts non-eccentric <ellipse>s to <circle>s", exports.fn = () => ({
        element: {
          enter: node => {
            if ("ellipse" === node.name) {
              const rx = node.attributes.rx || "0", ry = node.attributes.ry || "0";
              if (rx === ry || "auto" === rx || "auto" === ry) {
                node.name = "circle";
                const radius = "auto" === rx ? ry : rx;
                delete node.attributes.rx, delete node.attributes.ry, node.attributes.r = radius;
              }
            }
          }
        }
      });
    },
    8203: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {stringifyPathData} = __webpack_require__(9203), {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "convertShapeToPath", exports.type = "visitor", exports.active = !0, 
      exports.description = "converts basic shapes to more compact path form";
      const regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
      exports.fn = (root, params) => {
        const {convertArcs = !1, floatPrecision: precision} = params;
        return {
          element: {
            enter: (node, parentNode) => {
              if ("rect" === node.name && null != node.attributes.width && null != node.attributes.height && null == node.attributes.rx && null == node.attributes.ry) {
                const x = Number(node.attributes.x || "0"), y = Number(node.attributes.y || "0"), width = Number(node.attributes.width), height = Number(node.attributes.height);
                if (Number.isNaN(x - y + width - height)) return;
                const pathData = [ {
                  command: "M",
                  args: [ x, y ]
                }, {
                  command: "H",
                  args: [ x + width ]
                }, {
                  command: "V",
                  args: [ y + height ]
                }, {
                  command: "H",
                  args: [ x ]
                }, {
                  command: "z",
                  args: []
                } ];
                node.name = "path", node.attributes.d = stringifyPathData({
                  pathData,
                  precision
                }), delete node.attributes.x, delete node.attributes.y, delete node.attributes.width, 
                delete node.attributes.height;
              }
              if ("line" === node.name) {
                const x1 = Number(node.attributes.x1 || "0"), y1 = Number(node.attributes.y1 || "0"), x2 = Number(node.attributes.x2 || "0"), y2 = Number(node.attributes.y2 || "0");
                if (Number.isNaN(x1 - y1 + x2 - y2)) return;
                const pathData = [ {
                  command: "M",
                  args: [ x1, y1 ]
                }, {
                  command: "L",
                  args: [ x2, y2 ]
                } ];
                node.name = "path", node.attributes.d = stringifyPathData({
                  pathData,
                  precision
                }), delete node.attributes.x1, delete node.attributes.y1, delete node.attributes.x2, 
                delete node.attributes.y2;
              }
              if (("polyline" === node.name || "polygon" === node.name) && null != node.attributes.points) {
                const coords = (node.attributes.points.match(regNumber) || []).map(Number);
                if (coords.length < 4) return void detachNodeFromParent(node, parentNode);
                const pathData = [];
                for (let i = 0; i < coords.length; i += 2) pathData.push({
                  command: 0 === i ? "M" : "L",
                  args: coords.slice(i, i + 2)
                });
                "polygon" === node.name && pathData.push({
                  command: "z",
                  args: []
                }), node.name = "path", node.attributes.d = stringifyPathData({
                  pathData,
                  precision
                }), delete node.attributes.points;
              }
              if ("circle" === node.name && convertArcs) {
                const cx = Number(node.attributes.cx || "0"), cy = Number(node.attributes.cy || "0"), r = Number(node.attributes.r || "0");
                if (Number.isNaN(cx - cy + r)) return;
                const pathData = [ {
                  command: "M",
                  args: [ cx, cy - r ]
                }, {
                  command: "A",
                  args: [ r, r, 0, 1, 0, cx, cy + r ]
                }, {
                  command: "A",
                  args: [ r, r, 0, 1, 0, cx, cy - r ]
                }, {
                  command: "z",
                  args: []
                } ];
                node.name = "path", node.attributes.d = stringifyPathData({
                  pathData,
                  precision
                }), delete node.attributes.cx, delete node.attributes.cy, delete node.attributes.r;
              }
              if ("ellipse" === node.name && convertArcs) {
                const ecx = Number(node.attributes.cx || "0"), ecy = Number(node.attributes.cy || "0"), rx = Number(node.attributes.rx || "0"), ry = Number(node.attributes.ry || "0");
                if (Number.isNaN(ecx - ecy + rx - ry)) return;
                const pathData = [ {
                  command: "M",
                  args: [ ecx, ecy - ry ]
                }, {
                  command: "A",
                  args: [ rx, ry, 0, 1, 0, ecx, ecy + ry ]
                }, {
                  command: "A",
                  args: [ rx, ry, 0, 1, 0, ecx, ecy - ry ]
                }, {
                  command: "z",
                  args: []
                } ];
                node.name = "path", node.attributes.d = stringifyPathData({
                  pathData,
                  precision
                }), delete node.attributes.cx, delete node.attributes.cy, delete node.attributes.rx, 
                delete node.attributes.ry;
              }
            }
          }
        };
      };
    },
    485: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      exports.name = "convertStyleToAttrs", exports.type = "perItem", exports.active = !1, 
      exports.description = "converts style to attributes", exports.params = {
        keepImportant: !1
      };
      var stylingProps = __webpack_require__(6556).attrsGroups.presentation, rEscape = "\\\\(?:[0-9a-f]{1,6}\\s?|\\r\\n|.)", rAttr = "\\s*(" + g("[^:;\\\\]", rEscape) + "*?)\\s*", rSingleQuotes = "'(?:[^'\\n\\r\\\\]|" + rEscape + ")*?(?:'|$)", rQuotes = '"(?:[^"\\n\\r\\\\]|' + rEscape + ')*?(?:"|$)', rQuotedString = new RegExp("^" + g(rSingleQuotes, rQuotes) + "$"), rParenthesis = "\\(" + g("[^'\"()\\\\]+", rEscape, rSingleQuotes, rQuotes) + "*?\\)", rValue = "\\s*(" + g("[^!'\"();\\\\]+?", rEscape, rSingleQuotes, rQuotes, rParenthesis, "[^;]*?") + "*?)", regDeclarationBlock = new RegExp(rAttr + ":" + rValue + "(\\s*!important(?![-(\\w]))?\\s*(?:;\\s*|$)", "ig"), regStripComments = new RegExp(g(rEscape, rSingleQuotes, rQuotes, "/\\*[^]*?\\*/"), "ig");
      function g() {
        return "(?:" + Array.prototype.join.call(arguments, "|") + ")";
      }
      exports.fn = function(item, params) {
        if ("element" === item.type && null != item.attributes.style) {
          let styles = [];
          const newAttributes = {}, styleValue = item.attributes.style.replace(regStripComments, (match => "/" == match[0] ? "" : "\\" == match[0] && /[-g-z]/i.test(match[1]) ? match[1] : match));
          regDeclarationBlock.lastIndex = 0;
          for (var rule; rule = regDeclarationBlock.exec(styleValue); ) params.keepImportant && rule[3] || styles.push([ rule[1], rule[2] ]);
          styles.length && (styles = styles.filter((function(style) {
            if (style[0]) {
              var prop = style[0].toLowerCase(), val = style[1];
              if (rQuotedString.test(val) && (val = val.slice(1, -1)), stylingProps.includes(prop)) return newAttributes[prop] = val, 
              !1;
            }
            return !0;
          })), Object.assign(item.attributes, newAttributes), styles.length ? item.attributes.style = styles.map((declaration => declaration.join(":"))).join(";") : delete item.attributes.style);
        }
      };
    },
    8213: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {cleanupOutData} = __webpack_require__(2199), {transform2js, transformsMultiply, matrixToTransform} = __webpack_require__(851);
      exports.type = "visitor", exports.name = "convertTransform", exports.active = !0, 
      exports.description = "collapses multiple transformations and optimizes it", exports.fn = (_root, params) => {
        const {convertToShorts = !0, degPrecision, floatPrecision = 3, transformPrecision = 5, matrixToTransform = !0, shortTranslate = !0, shortScale = !0, shortRotate = !0, removeUseless = !0, collapseIntoOne = !0, leadingZero = !0, negativeExtraSpace = !1} = params, newParams = {
          convertToShorts,
          degPrecision,
          floatPrecision,
          transformPrecision,
          matrixToTransform,
          shortTranslate,
          shortScale,
          shortRotate,
          removeUseless,
          collapseIntoOne,
          leadingZero,
          negativeExtraSpace
        };
        return {
          element: {
            enter: node => {
              null != node.attributes.transform && convertTransform(node, "transform", newParams), 
              null != node.attributes.gradientTransform && convertTransform(node, "gradientTransform", newParams), 
              null != node.attributes.patternTransform && convertTransform(node, "patternTransform", newParams);
            }
          }
        };
      };
      const convertTransform = (item, attrName, params) => {
        let data = transform2js(item.attributes[attrName]);
        (params = definePrecision(data, params)).collapseIntoOne && data.length > 1 && (data = [ transformsMultiply(data) ]), 
        params.convertToShorts ? data = convertToShorts(data, params) : data.forEach((item => roundTransform(item, params))), 
        params.removeUseless && (data = removeUseless(data)), data.length ? item.attributes[attrName] = js2transform(data, params) : delete item.attributes[attrName];
      }, definePrecision = (data, {...newParams}) => {
        const matrixData = [];
        for (const item of data) "matrix" == item.name && matrixData.push(...item.data.slice(0, 4));
        let significantDigits = newParams.transformPrecision;
        return matrixData.length && (newParams.transformPrecision = Math.min(newParams.transformPrecision, Math.max.apply(Math, matrixData.map(floatDigits)) || newParams.transformPrecision), 
        significantDigits = Math.max.apply(Math, matrixData.map((n => n.toString().replace(/\D+/g, "").length)))), 
        null == newParams.degPrecision && (newParams.degPrecision = Math.max(0, Math.min(newParams.floatPrecision, significantDigits - 2))), 
        newParams;
      }, degRound = (data, params) => null != params.degPrecision && params.degPrecision >= 1 && params.floatPrecision < 20 ? smartRound(params.degPrecision, data) : round(data), floatRound = (data, params) => params.floatPrecision >= 1 && params.floatPrecision < 20 ? smartRound(params.floatPrecision, data) : round(data), transformRound = (data, params) => params.transformPrecision >= 1 && params.floatPrecision < 20 ? smartRound(params.transformPrecision, data) : round(data), floatDigits = n => {
        const str = n.toString();
        return str.slice(str.indexOf(".")).length - 1;
      }, convertToShorts = (transforms, params) => {
        for (var i = 0; i < transforms.length; i++) {
          var transform = transforms[i];
          if (params.matrixToTransform && "matrix" === transform.name) {
            var decomposed = matrixToTransform(transform, params);
            js2transform(decomposed, params).length <= js2transform([ transform ], params).length && transforms.splice(i, 1, ...decomposed), 
            transform = transforms[i];
          }
          roundTransform(transform, params), params.shortTranslate && "translate" === transform.name && 2 === transform.data.length && !transform.data[1] && transform.data.pop(), 
          params.shortScale && "scale" === transform.name && 2 === transform.data.length && transform.data[0] === transform.data[1] && transform.data.pop(), 
          params.shortRotate && transforms[i - 2] && "translate" === transforms[i - 2].name && "rotate" === transforms[i - 1].name && "translate" === transforms[i].name && transforms[i - 2].data[0] === -transforms[i].data[0] && transforms[i - 2].data[1] === -transforms[i].data[1] && (transforms.splice(i - 2, 3, {
            name: "rotate",
            data: [ transforms[i - 1].data[0], transforms[i - 2].data[0], transforms[i - 2].data[1] ]
          }), i -= 2);
        }
        return transforms;
      }, removeUseless = transforms => transforms.filter((transform => !([ "translate", "rotate", "skewX", "skewY" ].indexOf(transform.name) > -1 && (1 == transform.data.length || "rotate" == transform.name) && !transform.data[0] || "translate" == transform.name && !transform.data[0] && !transform.data[1] || "scale" == transform.name && 1 == transform.data[0] && (transform.data.length < 2 || 1 == transform.data[1]) || "matrix" == transform.name && 1 == transform.data[0] && 1 == transform.data[3] && !(transform.data[1] || transform.data[2] || transform.data[4] || transform.data[5])))), js2transform = (transformJS, params) => {
        var transformString = "";
        return transformJS.forEach((transform => {
          roundTransform(transform, params), transformString += (transformString && " ") + transform.name + "(" + cleanupOutData(transform.data, params) + ")";
        })), transformString;
      }, roundTransform = (transform, params) => {
        switch (transform.name) {
         case "translate":
          transform.data = floatRound(transform.data, params);
          break;

         case "rotate":
          transform.data = [ ...degRound(transform.data.slice(0, 1), params), ...floatRound(transform.data.slice(1), params) ];
          break;

         case "skewX":
         case "skewY":
          transform.data = degRound(transform.data, params);
          break;

         case "scale":
          transform.data = transformRound(transform.data, params);
          break;

         case "matrix":
          transform.data = [ ...transformRound(transform.data.slice(0, 4), params), ...floatRound(transform.data.slice(4), params) ];
        }
        return transform;
      }, round = data => data.map(Math.round), smartRound = (precision, data) => {
        for (var i = data.length, tolerance = +Math.pow(.1, precision).toFixed(precision); i--; ) if (Number(data[i].toFixed(precision)) !== data[i]) {
          var rounded = +data[i].toFixed(precision - 1);
          data[i] = +Math.abs(rounded - data[i]).toFixed(precision + 1) >= tolerance ? +data[i].toFixed(precision) : rounded;
        }
        return data;
      };
    },
    7854: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const csstree = __webpack_require__(904), specificity = __webpack_require__(5509), stable = __webpack_require__(5235), {visitSkip, querySelectorAll, detachNodeFromParent} = __webpack_require__(6317);
      exports.type = "visitor", exports.name = "inlineStyles", exports.active = !0, exports.description = "inline styles (additional options)";
      exports.fn = (root, params) => {
        const {onlyMatchedOnce = !0, removeMatchedSelectors = !0, useMqs = [ "", "screen" ], usePseudos = [ "" ]} = params, styles = [];
        let selectors = [];
        return {
          element: {
            enter: (node, parentNode) => {
              if ("foreignObject" === node.name) return visitSkip;
              if ("style" !== node.name || 0 === node.children.length) return;
              if (null != node.attributes.type && "" !== node.attributes.type && "text/css" !== node.attributes.type) return;
              let cssText = "";
              for (const child of node.children) "text" !== child.type && "cdata" !== child.type || (cssText += child.value);
              let cssAst = null;
              try {
                cssAst = csstree.parse(cssText, {
                  parseValue: !1,
                  parseCustomProperty: !1
                });
              } catch (_unused) {
                return;
              }
              "StyleSheet" === cssAst.type && styles.push({
                node,
                parentNode,
                cssAst
              }), csstree.walk(cssAst, {
                visit: "Selector",
                enter(node, item) {
                  const atrule = this.atrule, rule = this.rule;
                  if (null == rule) return;
                  let mq = "";
                  if (null != atrule && (mq = atrule.name, null != atrule.prelude && (mq += ` ${csstree.generate(atrule.prelude)}`)), 
                  !1 === useMqs.includes(mq)) return;
                  const pseudos = [];
                  "Selector" === node.type && node.children.each(((childNode, childItem, childList) => {
                    "PseudoClassSelector" !== childNode.type && "PseudoElementSelector" !== childNode.type || pseudos.push({
                      item: childItem,
                      list: childList
                    });
                  }));
                  const pseudoSelectors = csstree.generate({
                    type: "Selector",
                    children: (new csstree.List).fromArray(pseudos.map((pseudo => pseudo.item.data)))
                  });
                  if (!1 !== usePseudos.includes(pseudoSelectors)) {
                    for (const pseudo of pseudos) pseudo.list.remove(pseudo.item);
                    selectors.push({
                      node,
                      item,
                      rule
                    });
                  }
                }
              });
            }
          },
          root: {
            exit: () => {
              if (0 === styles.length) return;
              const sortedSelectors = stable(selectors, ((a, b) => ((a, b) => {
                for (var i = 0; i < 4; i += 1) {
                  if (a[i] < b[i]) return -1;
                  if (a[i] > b[i]) return 1;
                }
                return 0;
              })(specificity(a.item.data), specificity(b.item.data)))).reverse();
              for (const selector of sortedSelectors) {
                const selectorText = csstree.generate(selector.item.data), matchedElements = [];
                try {
                  for (const node of querySelectorAll(root, selectorText)) "element" === node.type && matchedElements.push(node);
                } catch (selectError) {
                  continue;
                }
                if (0 !== matchedElements.length && !(onlyMatchedOnce && matchedElements.length > 1)) {
                  for (const selectedEl of matchedElements) {
                    const styleDeclarationList = csstree.parse(null == selectedEl.attributes.style ? "" : selectedEl.attributes.style, {
                      context: "declarationList",
                      parseValue: !1
                    });
                    if ("DeclarationList" !== styleDeclarationList.type) continue;
                    const styleDeclarationItems = new Map;
                    csstree.walk(styleDeclarationList, {
                      visit: "Declaration",
                      enter(node, item) {
                        styleDeclarationItems.set(node.property, item);
                      }
                    }), csstree.walk(selector.rule, {
                      visit: "Declaration",
                      enter(ruleDeclaration) {
                        const matchedItem = styleDeclarationItems.get(ruleDeclaration.property), ruleDeclarationItem = styleDeclarationList.children.createItem(ruleDeclaration);
                        null == matchedItem ? styleDeclarationList.children.append(ruleDeclarationItem) : !0 !== matchedItem.data.important && !0 === ruleDeclaration.important && (styleDeclarationList.children.replace(matchedItem, ruleDeclarationItem), 
                        styleDeclarationItems.set(ruleDeclaration.property, ruleDeclarationItem));
                      }
                    }), selectedEl.attributes.style = csstree.generate(styleDeclarationList);
                  }
                  removeMatchedSelectors && 0 !== matchedElements.length && "SelectorList" === selector.rule.prelude.type && selector.rule.prelude.children.remove(selector.item), 
                  selector.matchedElements = matchedElements;
                }
              }
              if (!1 !== removeMatchedSelectors) {
                for (const selector of sortedSelectors) if (null != selector.matchedElements && !(onlyMatchedOnce && selector.matchedElements.length > 1)) for (const selectedEl of selector.matchedElements) {
                  const classList = new Set(null == selectedEl.attributes.class ? null : selectedEl.attributes.class.split(" ")), firstSubSelector = selector.node.children.first();
                  null != firstSubSelector && "ClassSelector" === firstSubSelector.type && classList.delete(firstSubSelector.name), 
                  0 === classList.size ? delete selectedEl.attributes.class : selectedEl.attributes.class = Array.from(classList).join(" "), 
                  null != firstSubSelector && "IdSelector" === firstSubSelector.type && selectedEl.attributes.id === firstSubSelector.name && delete selectedEl.attributes.id;
                }
                for (const style of styles) if (csstree.walk(style.cssAst, {
                  visit: "Rule",
                  enter: function(node, item, list) {
                    "Rule" === node.type && "SelectorList" === node.prelude.type && node.prelude.children.isEmpty() && list.remove(item);
                  }
                }), style.cssAst.children.isEmpty()) detachNodeFromParent(style.node, style.parentNode); else {
                  const firstChild = style.node.children[0];
                  "text" !== firstChild.type && "cdata" !== firstChild.type || (firstChild.value = csstree.generate(style.cssAst));
                }
              }
            }
          }
        };
      };
    },
    4812: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317), {collectStylesheet, computeStyle} = __webpack_require__(1284), {path2js, js2path, intersects} = __webpack_require__(3315);
      exports.type = "visitor", exports.name = "mergePaths", exports.active = !0, exports.description = "merges multiple paths in one if possible", 
      exports.fn = (root, params) => {
        const {force = !1, floatPrecision, noSpaceAfterFlags = !1} = params, stylesheet = collectStylesheet(root);
        return {
          element: {
            enter: node => {
              let prevChild = null;
              for (const child of node.children) {
                if (null == prevChild || "element" !== prevChild.type || "path" !== prevChild.name || 0 !== prevChild.children.length || null == prevChild.attributes.d) {
                  prevChild = child;
                  continue;
                }
                if ("element" !== child.type || "path" !== child.name || 0 !== child.children.length || null == child.attributes.d) {
                  prevChild = child;
                  continue;
                }
                const computedStyle = computeStyle(stylesheet, child);
                if (computedStyle["marker-start"] || computedStyle["marker-mid"] || computedStyle["marker-end"]) {
                  prevChild = child;
                  continue;
                }
                const prevChildAttrs = Object.keys(prevChild.attributes), childAttrs = Object.keys(child.attributes);
                let attributesAreEqual = prevChildAttrs.length === childAttrs.length;
                for (const name of childAttrs) "d" !== name && (null != prevChild.attributes[name] && prevChild.attributes[name] === child.attributes[name] || (attributesAreEqual = !1));
                const prevPathJS = path2js(prevChild), curPathJS = path2js(child);
                !attributesAreEqual || !force && intersects(prevPathJS, curPathJS) ? prevChild = child : (js2path(prevChild, prevPathJS.concat(curPathJS), {
                  floatPrecision,
                  noSpaceAfterFlags
                }), detachNodeFromParent(child, node));
              }
            }
          }
        };
      };
    },
    7329: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {visitSkip, detachNodeFromParent} = __webpack_require__(6317), JSAPI = __webpack_require__(4267);
      exports.name = "mergeStyles", exports.type = "visitor", exports.active = !0, exports.description = "merge multiple style elements into one", 
      exports.fn = () => {
        let firstStyleElement = null, collectedStyles = "", styleContentType = "text";
        return {
          element: {
            enter: (node, parentNode) => {
              if ("foreignObject" === node.name) return visitSkip;
              if ("style" !== node.name) return;
              if (null != node.attributes.type && "" !== node.attributes.type && "text/css" !== node.attributes.type) return;
              let css = "";
              for (const child of node.children) "text" === child.type && (css += child.value), 
              "cdata" === child.type && (styleContentType = "cdata", css += child.value);
              0 !== css.trim().length ? (null == node.attributes.media ? collectedStyles += css : (collectedStyles += `@media ${node.attributes.media}{${css}}`, 
              delete node.attributes.media), null == firstStyleElement ? firstStyleElement = node : (detachNodeFromParent(node, parentNode), 
              firstStyleElement.children = [ new JSAPI({
                type: styleContentType,
                value: collectedStyles
              }, firstStyleElement) ])) : detachNodeFromParent(node, parentNode);
            }
          }
        };
      };
    },
    3217: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const csso = __webpack_require__(1944);
      exports.type = "visitor", exports.name = "minifyStyles", exports.active = !0, exports.description = "minifies styles and removes unused styles based on usage data", 
      exports.fn = (_root, {usage, ...params}) => {
        let enableTagsUsage = !0, enableIdsUsage = !0, enableClassesUsage = !0, forceUsageDeoptimized = !1;
        "boolean" == typeof usage ? (enableTagsUsage = usage, enableIdsUsage = usage, enableClassesUsage = usage) : usage && (enableTagsUsage = null == usage.tags || usage.tags, 
        enableIdsUsage = null == usage.ids || usage.ids, enableClassesUsage = null == usage.classes || usage.classes, 
        forceUsageDeoptimized = null != usage.force && usage.force);
        const styleElements = [], elementsWithStyleAttributes = [];
        let deoptimized = !1;
        const tagsUsage = new Set, idsUsage = new Set, classesUsage = new Set;
        return {
          element: {
            enter: node => {
              "script" === node.name && (deoptimized = !0);
              for (const name of Object.keys(node.attributes)) name.startsWith("on") && (deoptimized = !0);
              if (tagsUsage.add(node.name), null != node.attributes.id && idsUsage.add(node.attributes.id), 
              null != node.attributes.class) for (const className of node.attributes.class.split(/\s+/)) classesUsage.add(className);
              "style" === node.name && 0 !== node.children.length ? styleElements.push(node) : null != node.attributes.style && elementsWithStyleAttributes.push(node);
            }
          },
          root: {
            exit: () => {
              const cssoUsage = {};
              !1 !== deoptimized && !0 !== forceUsageDeoptimized || (enableTagsUsage && 0 !== tagsUsage.size && (cssoUsage.tags = Array.from(tagsUsage)), 
              enableIdsUsage && 0 !== idsUsage.size && (cssoUsage.ids = Array.from(idsUsage)), 
              enableClassesUsage && 0 !== classesUsage.size && (cssoUsage.classes = Array.from(classesUsage)));
              for (const node of styleElements) if ("text" === node.children[0].type || "cdata" === node.children[0].type) {
                const cssText = node.children[0].value, minified = csso.minify(cssText, {
                  ...params,
                  usage: cssoUsage
                }).css;
                cssText.indexOf(">") >= 0 || cssText.indexOf("<") >= 0 ? (node.children[0].type = "cdata", 
                node.children[0].value = minified) : (node.children[0].type = "text", node.children[0].value = minified);
              }
              for (const node of elementsWithStyleAttributes) {
                const elemStyle = node.attributes.style;
                node.attributes.style = csso.minifyBlock(elemStyle, {
                  ...params
                }).css;
              }
            }
          }
        };
      };
    },
    3783: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {visit} = __webpack_require__(6317), {inheritableAttrs, pathElems} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "moveElemsAttrsToGroup", exports.active = !0, 
      exports.description = "Move common attributes of group children to the group", exports.fn = root => {
        let deoptimizedWithStyles = !1;
        return visit(root, {
          element: {
            enter: node => {
              "style" === node.name && (deoptimizedWithStyles = !0);
            }
          }
        }), {
          element: {
            exit: node => {
              if ("g" !== node.name || node.children.length <= 1) return;
              if (deoptimizedWithStyles) return;
              const commonAttributes = new Map;
              let initial = !0, everyChildIsPath = !0;
              for (const child of node.children) if ("element" === child.type) if (!1 === pathElems.includes(child.name) && (everyChildIsPath = !1), 
              initial) {
                initial = !1;
                for (const [name, value] of Object.entries(child.attributes)) inheritableAttrs.includes(name) && commonAttributes.set(name, value);
              } else for (const [name, value] of commonAttributes) child.attributes[name] !== value && commonAttributes.delete(name);
              null == node.attributes["clip-path"] && null == node.attributes.mask || commonAttributes.delete("transform"), 
              everyChildIsPath && commonAttributes.delete("transform");
              for (const [name, value] of commonAttributes) "transform" === name ? null != node.attributes.transform ? node.attributes.transform = `${node.attributes.transform} ${value}` : node.attributes.transform = value : node.attributes[name] = value;
              for (const child of node.children) if ("element" === child.type) for (const [name] of commonAttributes) delete child.attributes[name];
            }
          }
        };
      };
    },
    296: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {pathElems, referencesProps} = __webpack_require__(6556);
      exports.name = "moveGroupAttrsToElems", exports.type = "perItem", exports.active = !0, 
      exports.description = "moves some group attributes to the content elements";
      const pathElemsWithGroupsAndText = [ ...pathElems, "g", "text" ];
      exports.fn = function(item) {
        if ("element" === item.type && "g" === item.name && 0 !== item.children.length && null != item.attributes.transform && !1 === Object.entries(item.attributes).some((([name, value]) => referencesProps.includes(name) && value.includes("url("))) && item.children.every((inner => pathElemsWithGroupsAndText.includes(inner.name) && null == inner.attributes.id))) {
          for (const inner of item.children) {
            const value = item.attributes.transform;
            null != inner.attributes.transform ? inner.attributes.transform = value + " " + inner.attributes.transform : inner.attributes.transform = value;
          }
          delete item.attributes.transform;
        }
      };
    },
    7578: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const csstree = __webpack_require__(904), {referencesProps} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "prefixIds", exports.active = !1, exports.description = "prefix IDs";
      const prefixId = (prefix, value) => value.startsWith(prefix) ? value : prefix + value, prefixReference = (prefix, value) => value.startsWith("#") ? "#" + prefixId(prefix, value.slice(1)) : null;
      exports.fn = (_root, params, info) => {
        const {delim = "__", prefixIds = !0, prefixClassNames = !0} = params;
        return {
          element: {
            enter: node => {
              let prefix = "prefix" + delim;
              var str;
              if ("function" == typeof params.prefix ? prefix = params.prefix(node, info) + delim : "string" == typeof params.prefix ? prefix = params.prefix + delim : !1 === params.prefix ? prefix = "" : null != info.path && info.path.length > 0 && (str = (path => {
                const matched = path.match(/[/\\]?([^/\\]+)$/);
                return matched ? matched[1] : "";
              })(info.path), prefix = str.replace(/[. ]/g, "_") + delim), "style" === node.name) {
                if (0 === node.children.length) return;
                let cssText = "";
                "text" !== node.children[0].type && "cdata" !== node.children[0].type || (cssText = node.children[0].value);
                let cssAst = null;
                try {
                  cssAst = csstree.parse(cssText, {
                    parseValue: !0,
                    parseCustomProperty: !1
                  });
                } catch (_unused) {
                  return;
                }
                return csstree.walk(cssAst, (node => {
                  var string;
                  if (prefixIds && "IdSelector" === node.type || prefixClassNames && "ClassSelector" === node.type) node.name = prefixId(prefix, node.name); else if ("Url" === node.type && node.value.value && node.value.value.length > 0) {
                    const prefixed = prefixReference(prefix, (string = node.value.value).startsWith('"') && string.endsWith('"') || string.startsWith("'") && string.endsWith("'") ? string.slice(1, -1) : string);
                    null != prefixed && (node.value.value = prefixed);
                  }
                })), void ("text" !== node.children[0].type && "cdata" !== node.children[0].type || (node.children[0].value = csstree.generate(cssAst)));
              }
              prefixIds && null != node.attributes.id && 0 !== node.attributes.id.length && (node.attributes.id = prefixId(prefix, node.attributes.id)), 
              prefixClassNames && null != node.attributes.class && 0 !== node.attributes.class.length && (node.attributes.class = node.attributes.class.split(/\s+/).map((name => prefixId(prefix, name))).join(" "));
              for (const name of [ "href", "xlink:href" ]) if (null != node.attributes[name] && 0 !== node.attributes[name].length) {
                const prefixed = prefixReference(prefix, node.attributes[name]);
                null != prefixed && (node.attributes[name] = prefixed);
              }
              for (const name of referencesProps) null != node.attributes[name] && 0 !== node.attributes[name].length && (node.attributes[name] = node.attributes[name].replace(/url\((.*?)\)/gi, ((match, url) => {
                const prefixed = prefixReference(prefix, url);
                return null == prefixed ? match : `url(${prefixed})`;
              })));
              for (const name of [ "begin", "end" ]) if (null != node.attributes[name] && 0 !== node.attributes[name].length) {
                const parts = node.attributes[name].split(/\s*;\s+/).map((val => {
                  if (val.endsWith(".end") || val.endsWith(".start")) {
                    const [id, postfix] = val.split(".");
                    return `${prefixId(prefix, id)}.${postfix}`;
                  }
                  return val;
                }));
                node.attributes[name] = parts.join("; ");
              }
            }
          }
        };
      };
    },
    6352: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {querySelectorAll} = __webpack_require__(6317);
      exports.name = "removeAttributesBySelector", exports.type = "visitor", exports.active = !1, 
      exports.description = "removes attributes of elements that match a css selector", 
      exports.fn = (root, params) => {
        const selectors = Array.isArray(params.selectors) ? params.selectors : [ params ];
        for (const {selector, attributes} of selectors) {
          const nodes = querySelectorAll(root, selector);
          for (const node of nodes) if ("element" === node.type) if (Array.isArray(attributes)) for (const name of attributes) delete node.attributes[name]; else delete node.attributes[attributes];
        }
        return {};
      };
    },
    2548: (__unused_webpack_module, exports) => {
      "use strict";
      exports.name = "removeAttrs", exports.type = "visitor", exports.active = !1, exports.description = "removes specified attributes";
      exports.fn = (root, params) => {
        if (void 0 === params.attrs) return console.warn('Warning: The plugin "removeAttrs" requires the "attrs" parameter.\nIt should have a pattern to remove, otherwise the plugin is a noop.\nConfig example:\n\nplugins: [\n  {\n    name: "removeAttrs",\n    params: {\n      attrs: "(fill|stroke)"\n    }\n  }\n]\n'), 
        null;
        const elemSeparator = "string" == typeof params.elemSeparator ? params.elemSeparator : ":", preserveCurrentColor = "boolean" == typeof params.preserveCurrentColor && params.preserveCurrentColor, attrs = Array.isArray(params.attrs) ? params.attrs : [ params.attrs ];
        return {
          element: {
            enter: node => {
              for (let pattern of attrs) {
                !1 === pattern.includes(elemSeparator) ? pattern = [ ".*", elemSeparator, pattern, elemSeparator, ".*" ].join("") : pattern.split(elemSeparator).length < 3 && (pattern = [ pattern, elemSeparator, ".*" ].join(""));
                const list = pattern.split(elemSeparator).map((value => ("*" === value && (value = ".*"), 
                new RegExp([ "^", value, "$" ].join(""), "i"))));
                if (list[0].test(node.name)) for (const [name, value] of Object.entries(node.attributes)) {
                  const isStrokeCurrentColor = preserveCurrentColor && "stroke" == name && "currentColor" == value;
                  !(preserveCurrentColor && "fill" == name && "currentColor" == value) && !isStrokeCurrentColor && list[1].test(name) && list[2].test(value) && delete node.attributes[name];
                }
              }
            }
          }
        };
      };
    },
    5013: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeComments", exports.type = "visitor", exports.active = !0, 
      exports.description = "removes comments", exports.fn = () => ({
        comment: {
          enter: (node, parentNode) => {
            "!" !== node.value.charAt(0) && detachNodeFromParent(node, parentNode);
          }
        }
      });
    },
    8541: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeDesc", exports.type = "visitor", exports.active = !0, exports.description = "removes <desc>";
      const standardDescs = /^(Created with|Created using)/;
      exports.fn = (root, params) => {
        const {removeAny = !0} = params;
        return {
          element: {
            enter: (node, parentNode) => {
              "desc" === node.name && (removeAny || 0 === node.children.length || "text" === node.children[0].type && standardDescs.test(node.children[0].value)) && detachNodeFromParent(node, parentNode);
            }
          }
        };
      };
    },
    2929: (__unused_webpack_module, exports) => {
      "use strict";
      exports.name = "removeDimensions", exports.type = "perItem", exports.active = !1, 
      exports.description = "removes width and height in presence of viewBox (opposite to removeViewBox, disable it first)", 
      exports.fn = function(item) {
        if ("element" === item.type && "svg" === item.name) if (null != item.attributes.viewBox) delete item.attributes.width, 
        delete item.attributes.height; else if (null != item.attributes.width && null != item.attributes.height && !1 === Number.isNaN(Number(item.attributes.width)) && !1 === Number.isNaN(Number(item.attributes.height))) {
          const width = Number(item.attributes.width), height = Number(item.attributes.height);
          item.attributes.viewBox = `0 0 ${width} ${height}`, delete item.attributes.width, 
          delete item.attributes.height;
        }
      };
    },
    9776: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeDoctype", exports.type = "visitor", exports.active = !0, exports.description = "removes doctype declaration", 
      exports.fn = () => ({
        doctype: {
          enter: (node, parentNode) => {
            detachNodeFromParent(node, parentNode);
          }
        }
      });
    },
    8911: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317), {editorNamespaces} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "removeEditorsNSData", exports.active = !0, 
      exports.description = "removes editors namespaces, elements and attributes", exports.fn = (_root, params) => {
        let namespaces = editorNamespaces;
        Array.isArray(params.additionalNamespaces) && (namespaces = [ ...editorNamespaces, ...params.additionalNamespaces ]);
        const prefixes = [];
        return {
          element: {
            enter: (node, parentNode) => {
              if ("svg" === node.name) for (const [name, value] of Object.entries(node.attributes)) name.startsWith("xmlns:") && namespaces.includes(value) && (prefixes.push(name.slice("xmlns:".length)), 
              delete node.attributes[name]);
              for (const name of Object.keys(node.attributes)) if (name.includes(":")) {
                const [prefix] = name.split(":");
                prefixes.includes(prefix) && delete node.attributes[name];
              }
              if (node.name.includes(":")) {
                const [prefix] = node.name.split(":");
                prefixes.includes(prefix) && detachNodeFromParent(node, parentNode);
              }
            }
          }
        };
      };
    },
    8620: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeElementsByAttr", exports.type = "visitor", exports.active = !1, 
      exports.description = "removes arbitrary elements by ID or className (disabled by default)", 
      exports.fn = (root, params) => {
        const ids = null == params.id ? [] : Array.isArray(params.id) ? params.id : [ params.id ], classes = null == params.class ? [] : Array.isArray(params.class) ? params.class : [ params.class ];
        return {
          element: {
            enter: (node, parentNode) => {
              if (null != node.attributes.id && 0 !== ids.length && ids.includes(node.attributes.id) && detachNodeFromParent(node, parentNode), 
              node.attributes.class && 0 !== classes.length) {
                const classList = node.attributes.class.split(" ");
                for (const item of classes) if (classList.includes(item)) {
                  detachNodeFromParent(node, parentNode);
                  break;
                }
              }
            }
          }
        };
      };
    },
    6603: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {attrsGroups} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "removeEmptyAttrs", exports.active = !0, 
      exports.description = "removes empty attributes", exports.fn = () => ({
        element: {
          enter: node => {
            for (const [name, value] of Object.entries(node.attributes)) "" === value && !1 === attrsGroups.conditionalProcessing.includes(name) && delete node.attributes[name];
          }
        }
      });
    },
    175: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317), {elemsGroups} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "removeEmptyContainers", exports.active = !0, 
      exports.description = "removes empty container elements", exports.fn = () => ({
        element: {
          exit: (node, parentNode) => {
            "svg" !== node.name && !1 !== elemsGroups.container.includes(node.name) && 0 === node.children.length && ("pattern" === node.name && 0 !== Object.keys(node.attributes).length || "g" === node.name && null != node.attributes.filter || "mask" === node.name && null != node.attributes.id || detachNodeFromParent(node, parentNode));
          }
        }
      });
    },
    9035: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeEmptyText", exports.type = "visitor", exports.active = !0, 
      exports.description = "removes empty <text> elements", exports.fn = (root, params) => {
        const {text = !0, tspan = !0, tref = !0} = params;
        return {
          element: {
            enter: (node, parentNode) => {
              text && "text" === node.name && 0 === node.children.length && detachNodeFromParent(node, parentNode), 
              tspan && "tspan" === node.name && 0 === node.children.length && detachNodeFromParent(node, parentNode), 
              tref && "tref" === node.name && null == node.attributes["xlink:href"] && detachNodeFromParent(node, parentNode);
            }
          }
        };
      };
    },
    5491: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {querySelector, closestByName, detachNodeFromParent} = __webpack_require__(6317), {collectStylesheet, computeStyle} = __webpack_require__(1284), {parsePathData} = __webpack_require__(9203);
      exports.name = "removeHiddenElems", exports.type = "visitor", exports.active = !0, 
      exports.description = "removes hidden elements (zero sized, with absent attributes)", 
      exports.fn = (root, params) => {
        const {isHidden = !0, displayNone = !0, opacity0 = !0, circleR0 = !0, ellipseRX0 = !0, ellipseRY0 = !0, rectWidth0 = !0, rectHeight0 = !0, patternWidth0 = !0, patternHeight0 = !0, imageWidth0 = !0, imageHeight0 = !0, pathEmptyD = !0, polylineEmptyPoints = !0, polygonEmptyPoints = !0} = params, stylesheet = collectStylesheet(root);
        return {
          element: {
            enter: (node, parentNode) => {
              const computedStyle = computeStyle(stylesheet, node);
              if (isHidden && computedStyle.visibility && "static" === computedStyle.visibility.type && "hidden" === computedStyle.visibility.value && null == querySelector(node, "[visibility=visible]")) detachNodeFromParent(node, parentNode); else if (displayNone && computedStyle.display && "static" === computedStyle.display.type && "none" === computedStyle.display.value && "marker" !== node.name) detachNodeFromParent(node, parentNode); else if (opacity0 && computedStyle.opacity && "static" === computedStyle.opacity.type && "0" === computedStyle.opacity.value && null == closestByName(node, "clipPath")) detachNodeFromParent(node, parentNode); else if (circleR0 && "circle" === node.name && 0 === node.children.length && "0" === node.attributes.r) detachNodeFromParent(node, parentNode); else if (ellipseRX0 && "ellipse" === node.name && 0 === node.children.length && "0" === node.attributes.rx) detachNodeFromParent(node, parentNode); else if (ellipseRY0 && "ellipse" === node.name && 0 === node.children.length && "0" === node.attributes.ry) detachNodeFromParent(node, parentNode); else if (rectWidth0 && "rect" === node.name && 0 === node.children.length && "0" === node.attributes.width) detachNodeFromParent(node, parentNode); else if (rectHeight0 && rectWidth0 && "rect" === node.name && 0 === node.children.length && "0" === node.attributes.height) detachNodeFromParent(node, parentNode); else if (patternWidth0 && "pattern" === node.name && "0" === node.attributes.width) detachNodeFromParent(node, parentNode); else if (patternHeight0 && "pattern" === node.name && "0" === node.attributes.height) detachNodeFromParent(node, parentNode); else if (imageWidth0 && "image" === node.name && "0" === node.attributes.width) detachNodeFromParent(node, parentNode); else if (imageHeight0 && "image" === node.name && "0" === node.attributes.height) detachNodeFromParent(node, parentNode); else {
                if (pathEmptyD && "path" === node.name) {
                  if (null == node.attributes.d) return void detachNodeFromParent(node, parentNode);
                  const pathData = parsePathData(node.attributes.d);
                  return 0 === pathData.length || 1 === pathData.length && null == computedStyle["marker-start"] && null == computedStyle["marker-end"] ? void detachNodeFromParent(node, parentNode) : void 0;
                }
                (polylineEmptyPoints && "polyline" === node.name && null == node.attributes.points || polygonEmptyPoints && "polygon" === node.name && null == node.attributes.points) && detachNodeFromParent(node, parentNode);
              }
            }
          }
        };
      };
    },
    8555: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeMetadata", exports.type = "visitor", exports.active = !0, 
      exports.description = "removes <metadata>", exports.fn = () => ({
        element: {
          enter: (node, parentNode) => {
            "metadata" === node.name && detachNodeFromParent(node, parentNode);
          }
        }
      });
    },
    2271: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      exports.name = "removeNonInheritableGroupAttrs", exports.type = "perItem", exports.active = !0, 
      exports.description = "removes non-inheritable group’s presentational attributes";
      const {inheritableAttrs, attrsGroups, presentationNonInheritableGroupAttrs} = __webpack_require__(6556);
      exports.fn = function(item) {
        if ("element" === item.type && "g" === item.name) for (const name of Object.keys(item.attributes)) !0 === attrsGroups.presentation.includes(name) && !1 === inheritableAttrs.includes(name) && !1 === presentationNonInheritableGroupAttrs.includes(name) && delete item.attributes[name];
      };
    },
    3320: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {visitSkip, detachNodeFromParent} = __webpack_require__(6317), {parsePathData} = __webpack_require__(9203), {intersects} = __webpack_require__(3315);
      exports.type = "visitor", exports.name = "removeOffCanvasPaths", exports.active = !1, 
      exports.description = "removes elements that are drawn outside of the viewbox (disabled by default)", 
      exports.fn = () => {
        let viewBoxData = null;
        return {
          element: {
            enter: (node, parentNode) => {
              if ("svg" === node.name && "root" === parentNode.type) {
                let viewBox = "";
                null != node.attributes.viewBox ? viewBox = node.attributes.viewBox : null != node.attributes.height && null != node.attributes.width && (viewBox = `0 0 ${node.attributes.width} ${node.attributes.height}`), 
                viewBox = viewBox.replace(/[,+]|px/g, " ").replace(/\s+/g, " ").replace(/^\s*|\s*$/g, "");
                const m = /^(-?\d*\.?\d+) (-?\d*\.?\d+) (\d*\.?\d+) (\d*\.?\d+)$/.exec(viewBox);
                if (null == m) return;
                const left = Number.parseFloat(m[1]), top = Number.parseFloat(m[2]), width = Number.parseFloat(m[3]), height = Number.parseFloat(m[4]);
                viewBoxData = {
                  left,
                  top,
                  right: left + width,
                  bottom: top + height,
                  width,
                  height
                };
              }
              if (null != node.attributes.transform) return visitSkip;
              if ("path" === node.name && null != node.attributes.d && null != viewBoxData) {
                const pathData = parsePathData(node.attributes.d);
                let visible = !1;
                for (const pathDataItem of pathData) if ("M" === pathDataItem.command) {
                  const [x, y] = pathDataItem.args;
                  x >= viewBoxData.left && x <= viewBoxData.right && y >= viewBoxData.top && y <= viewBoxData.bottom && (visible = !0);
                }
                if (visible) return;
                2 === pathData.length && pathData.push({
                  command: "z",
                  args: []
                });
                const {left, top, width, height} = viewBoxData;
                !1 === intersects([ {
                  command: "M",
                  args: [ left, top ]
                }, {
                  command: "h",
                  args: [ width ]
                }, {
                  command: "v",
                  args: [ height ]
                }, {
                  command: "H",
                  args: [ left ]
                }, {
                  command: "z",
                  args: []
                } ], pathData) && detachNodeFromParent(node, parentNode);
              }
            }
          }
        };
      };
    },
    1906: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeRasterImages", exports.type = "visitor", exports.active = !1, 
      exports.description = "removes raster images (disabled by default)", exports.fn = () => ({
        element: {
          enter: (node, parentNode) => {
            "image" === node.name && null != node.attributes["xlink:href"] && /(\.|image\/)(jpg|png|gif)/.test(node.attributes["xlink:href"]) && detachNodeFromParent(node, parentNode);
          }
        }
      });
    },
    8456: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeScriptElement", exports.type = "visitor", exports.active = !1, 
      exports.description = "removes <script> elements (disabled by default)", exports.fn = () => ({
        element: {
          enter: (node, parentNode) => {
            "script" === node.name && detachNodeFromParent(node, parentNode);
          }
        }
      });
    },
    9192: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeStyleElement", exports.type = "visitor", exports.active = !1, 
      exports.description = "removes <style> element (disabled by default)", exports.fn = () => ({
        element: {
          enter: (node, parentNode) => {
            "style" === node.name && detachNodeFromParent(node, parentNode);
          }
        }
      });
    },
    3444: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeTitle", exports.type = "visitor", exports.active = !0, exports.description = "removes <title>", 
      exports.fn = () => ({
        element: {
          enter: (node, parentNode) => {
            "title" === node.name && detachNodeFromParent(node, parentNode);
          }
        }
      });
    },
    3268: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {visitSkip, detachNodeFromParent} = __webpack_require__(6317), {collectStylesheet, computeStyle} = __webpack_require__(1284), {elems, attrsGroups, elemsGroups, attrsGroupsDefaults, presentationNonInheritableGroupAttrs} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "removeUnknownsAndDefaults", exports.active = !0, 
      exports.description = "removes unknown elements content and attributes, removes attrs with default values";
      const allowedChildrenPerElement = new Map, allowedAttributesPerElement = new Map, attributesDefaultsPerElement = new Map;
      for (const [name, config] of Object.entries(elems)) {
        const allowedChildren = new Set;
        if (config.content) for (const elementName of config.content) allowedChildren.add(elementName);
        if (config.contentGroups) for (const contentGroupName of config.contentGroups) {
          const elemsGroup = elemsGroups[contentGroupName];
          if (elemsGroup) for (const elementName of elemsGroup) allowedChildren.add(elementName);
        }
        const allowedAttributes = new Set;
        if (config.attrs) for (const attrName of config.attrs) allowedAttributes.add(attrName);
        const attributesDefaults = new Map;
        if (config.defaults) for (const [attrName, defaultValue] of Object.entries(config.defaults)) attributesDefaults.set(attrName, defaultValue);
        for (const attrsGroupName of config.attrsGroups) {
          const attrsGroup = attrsGroups[attrsGroupName];
          if (attrsGroup) for (const attrName of attrsGroup) allowedAttributes.add(attrName);
          const groupDefaults = attrsGroupsDefaults[attrsGroupName];
          if (groupDefaults) for (const [attrName, defaultValue] of Object.entries(groupDefaults)) attributesDefaults.set(attrName, defaultValue);
        }
        allowedChildrenPerElement.set(name, allowedChildren), allowedAttributesPerElement.set(name, allowedAttributes), 
        attributesDefaultsPerElement.set(name, attributesDefaults);
      }
      exports.fn = (root, params) => {
        const {unknownContent = !0, unknownAttrs = !0, defaultAttrs = !0, uselessOverrides = !0, keepDataAttrs = !0, keepAriaAttrs = !0, keepRoleAttr = !1} = params, stylesheet = collectStylesheet(root);
        return {
          element: {
            enter: (node, parentNode) => {
              if (node.name.includes(":")) return;
              if ("foreignObject" === node.name) return visitSkip;
              if (unknownContent && "element" === parentNode.type) {
                const allowedChildren = allowedChildrenPerElement.get(parentNode.name);
                if (null == allowedChildren || 0 === allowedChildren.size) {
                  if (null == allowedChildrenPerElement.get(node.name)) return void detachNodeFromParent(node, parentNode);
                } else if (!1 === allowedChildren.has(node.name)) return void detachNodeFromParent(node, parentNode);
              }
              const allowedAttributes = allowedAttributesPerElement.get(node.name), attributesDefaults = attributesDefaultsPerElement.get(node.name), computedParentStyle = "element" === parentNode.type ? computeStyle(stylesheet, parentNode) : null;
              for (const [name, value] of Object.entries(node.attributes)) if (!(keepDataAttrs && name.startsWith("data-") || keepAriaAttrs && name.startsWith("aria-") || keepRoleAttr && "role" === name || "xmlns" === name)) {
                if (name.includes(":")) {
                  const [prefix] = name.split(":");
                  if ("xml" !== prefix && "xlink" !== prefix) continue;
                }
                if (unknownAttrs && allowedAttributes && !1 === allowedAttributes.has(name) && delete node.attributes[name], 
                defaultAttrs && null == node.attributes.id && attributesDefaults && attributesDefaults.get(name) === value && (null != computedParentStyle && null != computedParentStyle[name] || delete node.attributes[name]), 
                uselessOverrides && null == node.attributes.id) {
                  const style = null == computedParentStyle ? null : computedParentStyle[name];
                  !1 === presentationNonInheritableGroupAttrs.includes(name) && null != style && "static" === style.type && style.value === value && delete node.attributes[name];
                }
              }
            }
          }
        };
      };
    },
    6045: (__unused_webpack_module, exports) => {
      "use strict";
      exports.type = "visitor", exports.name = "removeUnusedNS", exports.active = !0, 
      exports.description = "removes unused namespaces declaration", exports.fn = () => {
        const unusedNamespaces = new Set;
        return {
          element: {
            enter: (node, parentNode) => {
              if ("svg" === node.name && "root" === parentNode.type) for (const name of Object.keys(node.attributes)) if (name.startsWith("xmlns:")) {
                const local = name.slice("xmlns:".length);
                unusedNamespaces.add(local);
              }
              if (0 !== unusedNamespaces.size) {
                if (node.name.includes(":")) {
                  const [ns] = node.name.split(":");
                  unusedNamespaces.has(ns) && unusedNamespaces.delete(ns);
                }
                for (const name of Object.keys(node.attributes)) if (name.includes(":")) {
                  const [ns] = name.split(":");
                  unusedNamespaces.delete(ns);
                }
              }
            },
            exit: (node, parentNode) => {
              if ("svg" === node.name && "root" === parentNode.type) for (const name of unusedNamespaces) delete node.attributes[`xmlns:${name}`];
            }
          }
        };
      };
    },
    3506: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317), {elemsGroups} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "removeUselessDefs", exports.active = !0, 
      exports.description = "removes elements in <defs> without id", exports.fn = () => ({
        element: {
          enter: (node, parentNode) => {
            if ("defs" === node.name) {
              const usefulNodes = [];
              collectUsefulNodes(node, usefulNodes), 0 === usefulNodes.length && detachNodeFromParent(node, parentNode);
              for (const usefulNode of usefulNodes) usefulNode.parentNode = node;
              node.children = usefulNodes;
            } else elemsGroups.nonRendering.includes(node.name) && null == node.attributes.id && detachNodeFromParent(node, parentNode);
          }
        }
      });
      const collectUsefulNodes = (node, usefulNodes) => {
        for (const child of node.children) "element" === child.type && (null != child.attributes.id || "style" === child.name ? usefulNodes.push(child) : collectUsefulNodes(child, usefulNodes));
      };
    },
    2434: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {visit, visitSkip, detachNodeFromParent} = __webpack_require__(6317), {collectStylesheet, computeStyle} = __webpack_require__(1284), {elemsGroups} = __webpack_require__(6556);
      exports.type = "visitor", exports.name = "removeUselessStrokeAndFill", exports.active = !0, 
      exports.description = "removes useless stroke and fill attributes", exports.fn = (root, params) => {
        const {stroke: removeStroke = !0, fill: removeFill = !0, removeNone = !1} = params;
        let hasStyleOrScript = !1;
        if (visit(root, {
          element: {
            enter: node => {
              "style" !== node.name && "script" !== node.name || (hasStyleOrScript = !0);
            }
          }
        }), hasStyleOrScript) return null;
        const stylesheet = collectStylesheet(root);
        return {
          element: {
            enter: (node, parentNode) => {
              if (null != node.attributes.id) return visitSkip;
              if (0 == elemsGroups.shape.includes(node.name)) return;
              const computedStyle = computeStyle(stylesheet, node), stroke = computedStyle.stroke, strokeOpacity = computedStyle["stroke-opacity"], strokeWidth = computedStyle["stroke-width"], markerEnd = computedStyle["marker-end"], fill = computedStyle.fill, fillOpacity = computedStyle["fill-opacity"], computedParentStyle = "element" === parentNode.type ? computeStyle(stylesheet, parentNode) : null, parentStroke = null == computedParentStyle ? null : computedParentStyle.stroke;
              if (removeStroke && (null == stroke || "static" === stroke.type && "none" == stroke.value || null != strokeOpacity && "static" === strokeOpacity.type && "0" === strokeOpacity.value || null != strokeWidth && "static" === strokeWidth.type && "0" === strokeWidth.value) && (null != strokeWidth && "static" === strokeWidth.type && "0" === strokeWidth.value || null == markerEnd)) {
                for (const name of Object.keys(node.attributes)) name.startsWith("stroke") && delete node.attributes[name];
                null != parentStroke && "static" === parentStroke.type && "none" !== parentStroke.value && (node.attributes.stroke = "none");
              }
              if (removeFill && (null != fill && "static" === fill.type && "none" === fill.value || null != fillOpacity && "static" === fillOpacity.type && "0" === fillOpacity.value)) {
                for (const name of Object.keys(node.attributes)) name.startsWith("fill-") && delete node.attributes[name];
                (null == fill || "static" === fill.type && "none" !== fill.value) && (node.attributes.fill = "none");
              }
              removeNone && (null != stroke && "none" !== node.attributes.stroke || (null == fill || "static" !== fill.type || "none" !== fill.value) && "none" !== node.attributes.fill || detachNodeFromParent(node, parentNode));
            }
          }
        };
      };
    },
    9792: (__unused_webpack_module, exports) => {
      "use strict";
      exports.name = "removeXMLNS", exports.type = "perItem", exports.active = !1, exports.description = "removes xmlns attribute (for inline svg, disabled by default)", 
      exports.fn = function(item) {
        "element" === item.type && "svg" === item.name && (delete item.attributes.xmlns, 
        delete item.attributes["xmlns:xlink"]);
      };
    },
    490: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const {detachNodeFromParent} = __webpack_require__(6317);
      exports.name = "removeXMLProcInst", exports.type = "visitor", exports.active = !0, 
      exports.description = "removes XML processing instructions", exports.fn = () => ({
        instruction: {
          enter: (node, parentNode) => {
            "xml" === node.name && detachNodeFromParent(node, parentNode);
          }
        }
      });
    },
    5014: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      const JSAPI = __webpack_require__(4267);
      exports.type = "visitor", exports.name = "reusePaths", exports.active = !1, exports.description = "Finds <path> elements with the same d, fill, and stroke, and converts them to <use> elements referencing a single <path> def.", 
      exports.fn = () => {
        const paths = new Map;
        return {
          element: {
            enter: node => {
              if ("path" === node.name && null != node.attributes.d) {
                const d = node.attributes.d, fill = node.attributes.fill || "", key = d + ";s:" + (node.attributes.stroke || "") + ";f:" + fill;
                let list = paths.get(key);
                null == list && (list = [], paths.set(key, list)), list.push(node);
              }
            },
            exit: (node, parentNode) => {
              if ("svg" === node.name && "root" === parentNode.type) {
                const defsTag = new JSAPI({
                  type: "element",
                  name: "defs",
                  attributes: {},
                  children: []
                }, node);
                let index = 0;
                for (const list of paths.values()) if (list.length > 1) {
                  const rawPath = {
                    type: "element",
                    name: "path",
                    attributes: {
                      ...list[0].attributes
                    },
                    children: []
                  };
                  let id;
                  delete rawPath.attributes.transform, null == rawPath.attributes.id ? (id = "reuse-" + index, 
                  index += 1, rawPath.attributes.id = id) : (id = rawPath.attributes.id, delete list[0].attributes.id);
                  const reusablePath = new JSAPI(rawPath, defsTag);
                  defsTag.children.push(reusablePath);
                  for (const pathNode of list) pathNode.name = "use", pathNode.attributes["xlink:href"] = "#" + id, 
                  delete pathNode.attributes.d, delete pathNode.attributes.stroke, delete pathNode.attributes.fill;
                }
                0 !== defsTag.children.length && (null == node.attributes["xmlns:xlink"] && (node.attributes["xmlns:xlink"] = "http://www.w3.org/1999/xlink"), 
                node.children.unshift(defsTag));
              }
            }
          }
        };
      };
    },
    9618: (__unused_webpack_module, exports) => {
      "use strict";
      exports.type = "visitor", exports.name = "sortAttrs", exports.active = !1, exports.description = "Sort element attributes for better compression", 
      exports.fn = (_root, params) => {
        const {order = [ "id", "width", "height", "x", "x1", "x2", "y", "y1", "y2", "cx", "cy", "r", "fill", "stroke", "marker", "d", "points" ], xmlnsOrder = "front"} = params, getNsPriority = name => {
          if ("front" === xmlnsOrder) {
            if ("xmlns" === name) return 3;
            if (name.startsWith("xmlns:")) return 2;
          }
          return name.includes(":") ? 1 : 0;
        }, compareAttrs = ([aName], [bName]) => {
          const aPriority = getNsPriority(aName), priorityNs = getNsPriority(bName) - aPriority;
          if (0 !== priorityNs) return priorityNs;
          const [aPart] = aName.split("-"), [bPart] = bName.split("-");
          if (aPart !== bPart) {
            const aInOrderFlag = order.includes(aPart) ? 1 : 0, bInOrderFlag = order.includes(bPart) ? 1 : 0;
            if (1 === aInOrderFlag && 1 === bInOrderFlag) return order.indexOf(aPart) - order.indexOf(bPart);
            const priorityOrder = bInOrderFlag - aInOrderFlag;
            if (0 !== priorityOrder) return priorityOrder;
          }
          return aName < bName ? -1 : 1;
        };
        return {
          element: {
            enter: node => {
              const attrs = Object.entries(node.attributes);
              attrs.sort(compareAttrs);
              const sortedAttributes = {};
              for (const [name, value] of attrs) sortedAttributes[name] = value;
              node.attributes = sortedAttributes;
            }
          }
        };
      };
    },
    6193: (__unused_webpack_module, exports) => {
      "use strict";
      exports.type = "visitor", exports.name = "sortDefsChildren", exports.active = !0, 
      exports.description = "Sorts children of <defs> to improve compression", exports.fn = () => ({
        element: {
          enter: node => {
            if ("defs" === node.name) {
              const frequencies = new Map;
              for (const child of node.children) if ("element" === child.type) {
                const frequency = frequencies.get(child.name);
                null == frequency ? frequencies.set(child.name, 1) : frequencies.set(child.name, frequency + 1);
              }
              node.children.sort(((a, b) => {
                if ("element" !== a.type || "element" !== b.type) return 0;
                const aFrequency = frequencies.get(a.name), bFrequency = frequencies.get(b.name);
                if (null != aFrequency && null != bFrequency) {
                  const frequencyComparison = bFrequency - aFrequency;
                  if (0 !== frequencyComparison) return frequencyComparison;
                }
                const lengthComparison = b.name.length - a.name.length;
                return 0 !== lengthComparison ? lengthComparison : a.name !== b.name ? a.name > b.name ? -1 : 1 : 0;
              }));
            }
          }
        }
      });
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
    6556: module => {
      "use strict";
      module.exports = require("./_collections");
    },
    2284: module => {
      "use strict";
      module.exports = require("./vendor/css-select");
    },
    904: module => {
      "use strict";
      module.exports = require("./vendor/css-tree");
    },
    1944: module => {
      "use strict";
      module.exports = require("./vendor/csso");
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
    exports["preset-default"] = __webpack_require__(2967), exports.addAttributesToSVGElement = __webpack_require__(3963), 
    exports.addClassesToSVGElement = __webpack_require__(4886), exports.cleanupAttrs = __webpack_require__(514), 
    exports.cleanupEnableBackground = __webpack_require__(3657), exports.cleanupIDs = __webpack_require__(9401), 
    exports.cleanupListOfValues = __webpack_require__(7458), exports.cleanupNumericValues = __webpack_require__(9742), 
    exports.collapseGroups = __webpack_require__(1123), exports.convertColors = __webpack_require__(2660), 
    exports.convertEllipseToCircle = __webpack_require__(1151), exports.convertPathData = __webpack_require__(503), 
    exports.convertShapeToPath = __webpack_require__(8203), exports.convertStyleToAttrs = __webpack_require__(485), 
    exports.convertTransform = __webpack_require__(8213), exports.mergeStyles = __webpack_require__(7329), 
    exports.inlineStyles = __webpack_require__(7854), exports.mergePaths = __webpack_require__(4812), 
    exports.minifyStyles = __webpack_require__(3217), exports.moveElemsAttrsToGroup = __webpack_require__(3783), 
    exports.moveGroupAttrsToElems = __webpack_require__(296), exports.prefixIds = __webpack_require__(7578), 
    exports.removeAttributesBySelector = __webpack_require__(6352), exports.removeAttrs = __webpack_require__(2548), 
    exports.removeComments = __webpack_require__(5013), exports.removeDesc = __webpack_require__(8541), 
    exports.removeDimensions = __webpack_require__(2929), exports.removeDoctype = __webpack_require__(9776), 
    exports.removeEditorsNSData = __webpack_require__(8911), exports.removeElementsByAttr = __webpack_require__(8620), 
    exports.removeEmptyAttrs = __webpack_require__(6603), exports.removeEmptyContainers = __webpack_require__(175), 
    exports.removeEmptyText = __webpack_require__(9035), exports.removeHiddenElems = __webpack_require__(5491), 
    exports.removeMetadata = __webpack_require__(8555), exports.removeNonInheritableGroupAttrs = __webpack_require__(2271), 
    exports.removeOffCanvasPaths = __webpack_require__(3320), exports.removeRasterImages = __webpack_require__(1906), 
    exports.removeScriptElement = __webpack_require__(8456), exports.removeStyleElement = __webpack_require__(9192), 
    exports.removeTitle = __webpack_require__(3444), exports.removeUnknownsAndDefaults = __webpack_require__(3268), 
    exports.removeUnusedNS = __webpack_require__(6045), exports.removeUselessDefs = __webpack_require__(3506), 
    exports.removeUselessStrokeAndFill = __webpack_require__(2434), exports.removeViewBox = __webpack_require__(8995), 
    exports.removeXMLNS = __webpack_require__(9792), exports.removeXMLProcInst = __webpack_require__(490), 
    exports.reusePaths = __webpack_require__(5014), exports.sortAttrs = __webpack_require__(9618), 
    exports.sortDefsChildren = __webpack_require__(6193);
  })();
  var __webpack_export_target__ = exports;
  for (var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
  __webpack_exports__.__esModule && Object.defineProperty(__webpack_export_target__, "__esModule", {
    value: !0
  });
})();