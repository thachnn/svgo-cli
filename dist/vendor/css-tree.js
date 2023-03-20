!function() {
  var __webpack_modules__ = {
    7791: function(module, __unused_webpack_exports, __webpack_require__) {
      var mdnAtrules = __webpack_require__(4518), mdnProperties = __webpack_require__(3050), mdnSyntaxes = __webpack_require__(9262), patch = __webpack_require__(4900);
      function buildDictionary(dict, patchDict) {
        var result = {};
        for (var key in dict) result[key] = dict[key].syntax;
        for (var key in patchDict) key in dict ? patchDict[key].syntax ? result[key] = patchDict[key].syntax : delete result[key] : patchDict[key].syntax && (result[key] = patchDict[key].syntax);
        return result;
      }
      module.exports = {
        types: buildDictionary(mdnSyntaxes, patch.syntaxes),
        atrules: function(dict) {
          var result = Object.create(null);
          for (var atruleName in dict) {
            var atrule = dict[atruleName], descriptors = null;
            if (atrule.descriptors) for (var descriptor in descriptors = Object.create(null), 
            atrule.descriptors) descriptors[descriptor] = atrule.descriptors[descriptor].syntax;
            result[atruleName.substr(1)] = {
              prelude: atrule.syntax.trim().match(/^@\S+\s+([^;\{]*)/)[1].trim() || null,
              descriptors: descriptors
            };
          }
          return result;
        }(mdnAtrules),
        properties: buildDictionary(mdnProperties, patch.properties)
      };
    },
    7467: function(module) {
      function createItem(data) {
        return {
          prev: null,
          next: null,
          data: data
        };
      }
      function allocateCursor(node, prev, next) {
        var cursor;
        return null !== cursors ? (cursor = cursors, cursors = cursors.cursor, cursor.prev = prev, 
        cursor.next = next, cursor.cursor = node.cursor) : cursor = {
          prev: prev,
          next: next,
          cursor: node.cursor
        }, node.cursor = cursor, cursor;
      }
      function releaseCursor(node) {
        var cursor = node.cursor;
        node.cursor = cursor.cursor, cursor.prev = null, cursor.next = null, cursor.cursor = cursors, 
        cursors = cursor;
      }
      var cursors = null, List = function() {
        this.cursor = null, this.head = null, this.tail = null;
      };
      List.createItem = createItem, List.prototype.createItem = createItem, List.prototype.updateCursors = function(prevOld, prevNew, nextOld, nextNew) {
        for (var cursor = this.cursor; null !== cursor; ) cursor.prev === prevOld && (cursor.prev = prevNew), 
        cursor.next === nextOld && (cursor.next = nextNew), cursor = cursor.cursor;
      }, List.prototype.getSize = function() {
        for (var size = 0, cursor = this.head; cursor; ) size++, cursor = cursor.next;
        return size;
      }, List.prototype.fromArray = function(array) {
        var cursor = null;
        this.head = null;
        for (var i = 0; i < array.length; i++) {
          var item = createItem(array[i]);
          null !== cursor ? cursor.next = item : this.head = item, item.prev = cursor, cursor = item;
        }
        return this.tail = cursor, this;
      }, List.prototype.toArray = function() {
        for (var cursor = this.head, result = []; cursor; ) result.push(cursor.data), cursor = cursor.next;
        return result;
      }, List.prototype.toJSON = List.prototype.toArray, List.prototype.isEmpty = function() {
        return null === this.head;
      }, List.prototype.first = function() {
        return this.head && this.head.data;
      }, List.prototype.last = function() {
        return this.tail && this.tail.data;
      }, List.prototype.each = function(fn, context) {
        var item;
        void 0 === context && (context = this);
        for (var cursor = allocateCursor(this, null, this.head); null !== cursor.next; ) item = cursor.next, 
        cursor.next = item.next, fn.call(context, item.data, item, this);
        releaseCursor(this);
      }, List.prototype.forEach = List.prototype.each, List.prototype.eachRight = function(fn, context) {
        var item;
        void 0 === context && (context = this);
        for (var cursor = allocateCursor(this, this.tail, null); null !== cursor.prev; ) item = cursor.prev, 
        cursor.prev = item.prev, fn.call(context, item.data, item, this);
        releaseCursor(this);
      }, List.prototype.forEachRight = List.prototype.eachRight, List.prototype.nextUntil = function(start, fn, context) {
        if (null !== start) {
          var item;
          void 0 === context && (context = this);
          for (var cursor = allocateCursor(this, null, start); null !== cursor.next && (item = cursor.next, 
          cursor.next = item.next, !fn.call(context, item.data, item, this)); ) ;
          releaseCursor(this);
        }
      }, List.prototype.prevUntil = function(start, fn, context) {
        if (null !== start) {
          var item;
          void 0 === context && (context = this);
          for (var cursor = allocateCursor(this, start, null); null !== cursor.prev && (item = cursor.prev, 
          cursor.prev = item.prev, !fn.call(context, item.data, item, this)); ) ;
          releaseCursor(this);
        }
      }, List.prototype.some = function(fn, context) {
        var cursor = this.head;
        for (void 0 === context && (context = this); null !== cursor; ) {
          if (fn.call(context, cursor.data, cursor, this)) return !0;
          cursor = cursor.next;
        }
        return !1;
      }, List.prototype.map = function(fn, context) {
        var result = new List, cursor = this.head;
        for (void 0 === context && (context = this); null !== cursor; ) result.appendData(fn.call(context, cursor.data, cursor, this)), 
        cursor = cursor.next;
        return result;
      }, List.prototype.filter = function(fn, context) {
        var result = new List, cursor = this.head;
        for (void 0 === context && (context = this); null !== cursor; ) fn.call(context, cursor.data, cursor, this) && result.appendData(cursor.data), 
        cursor = cursor.next;
        return result;
      }, List.prototype.clear = function() {
        this.head = null, this.tail = null;
      }, List.prototype.copy = function() {
        for (var result = new List, cursor = this.head; null !== cursor; ) result.insert(createItem(cursor.data)), 
        cursor = cursor.next;
        return result;
      }, List.prototype.prepend = function(item) {
        return this.updateCursors(null, item, this.head, item), null !== this.head ? (this.head.prev = item, 
        item.next = this.head) : this.tail = item, this.head = item, this;
      }, List.prototype.prependData = function(data) {
        return this.prepend(createItem(data));
      }, List.prototype.append = function(item) {
        return this.insert(item);
      }, List.prototype.appendData = function(data) {
        return this.insert(createItem(data));
      }, List.prototype.insert = function(item, before) {
        if (null != before) if (this.updateCursors(before.prev, item, before, item), null === before.prev) {
          if (this.head !== before) throw new Error("before doesn't belong to list");
          this.head = item, before.prev = item, item.next = before, this.updateCursors(null, item);
        } else before.prev.next = item, item.prev = before.prev, before.prev = item, item.next = before; else this.updateCursors(this.tail, item, null, item), 
        null !== this.tail ? (this.tail.next = item, item.prev = this.tail) : this.head = item, 
        this.tail = item;
        return this;
      }, List.prototype.insertData = function(data, before) {
        return this.insert(createItem(data), before);
      }, List.prototype.remove = function(item) {
        if (this.updateCursors(item, item.prev, item, item.next), null !== item.prev) item.prev.next = item.next; else {
          if (this.head !== item) throw new Error("item doesn't belong to list");
          this.head = item.next;
        }
        if (null !== item.next) item.next.prev = item.prev; else {
          if (this.tail !== item) throw new Error("item doesn't belong to list");
          this.tail = item.prev;
        }
        return item.prev = null, item.next = null, item;
      }, List.prototype.push = function(data) {
        this.insert(createItem(data));
      }, List.prototype.pop = function() {
        if (null !== this.tail) return this.remove(this.tail);
      }, List.prototype.unshift = function(data) {
        this.prepend(createItem(data));
      }, List.prototype.shift = function() {
        if (null !== this.head) return this.remove(this.head);
      }, List.prototype.prependList = function(list) {
        return this.insertList(list, this.head);
      }, List.prototype.appendList = function(list) {
        return this.insertList(list);
      }, List.prototype.insertList = function(list, before) {
        return null === list.head || (null != before ? (this.updateCursors(before.prev, list.tail, before, list.head), 
        null !== before.prev ? (before.prev.next = list.head, list.head.prev = before.prev) : this.head = list.head, 
        before.prev = list.tail, list.tail.next = before) : (this.updateCursors(this.tail, list.tail, null, list.head), 
        null !== this.tail ? (this.tail.next = list.head, list.head.prev = this.tail) : this.head = list.head, 
        this.tail = list.tail), list.head = null, list.tail = null), this;
      }, List.prototype.replace = function(oldItem, newItemOrList) {
        "head" in newItemOrList ? this.insertList(newItemOrList, oldItem) : this.insert(newItemOrList, oldItem), 
        this.remove(oldItem);
      }, module.exports = List;
    },
    9971: function(module, __unused_webpack_exports, __webpack_require__) {
      var adoptBuffer = __webpack_require__(3123), isBOM = __webpack_require__(7093).isBOM;
      var OffsetToLocation = function() {
        this.lines = null, this.columns = null, this.linesAndColumnsComputed = !1;
      };
      OffsetToLocation.prototype = {
        setSource: function(source, startOffset, startLine, startColumn) {
          this.source = source, this.startOffset = void 0 === startOffset ? 0 : startOffset, 
          this.startLine = void 0 === startLine ? 1 : startLine, this.startColumn = void 0 === startColumn ? 1 : startColumn, 
          this.linesAndColumnsComputed = !1;
        },
        ensureLinesAndColumnsComputed: function() {
          this.linesAndColumnsComputed || (!function(host, source) {
            for (var sourceLength = source.length, lines = adoptBuffer(host.lines, sourceLength), line = host.startLine, columns = adoptBuffer(host.columns, sourceLength), column = host.startColumn, i = source.length > 0 ? isBOM(source.charCodeAt(0)) : 0; i < sourceLength; i++) {
              var code = source.charCodeAt(i);
              lines[i] = line, columns[i] = column++, 10 !== code && 13 !== code && 12 !== code || (13 === code && i + 1 < sourceLength && 10 === source.charCodeAt(i + 1) && (lines[++i] = line, 
              columns[i] = column), line++, column = 1);
            }
            lines[i] = line, columns[i] = column, host.lines = lines, host.columns = columns;
          }(this, this.source), this.linesAndColumnsComputed = !0);
        },
        getLocation: function(offset, filename) {
          return this.ensureLinesAndColumnsComputed(), {
            source: filename,
            offset: this.startOffset + offset,
            line: this.lines[offset],
            column: this.columns[offset]
          };
        },
        getLocationRange: function(start, end, filename) {
          return this.ensureLinesAndColumnsComputed(), {
            source: filename,
            start: {
              offset: this.startOffset + start,
              line: this.lines[start],
              column: this.columns[start]
            },
            end: {
              offset: this.startOffset + end,
              line: this.lines[end],
              column: this.columns[end]
            }
          };
        }
      }, module.exports = OffsetToLocation;
    },
    542: function(module, __unused_webpack_exports, __webpack_require__) {
      var createCustomError = __webpack_require__(2451);
      function sourceFragment(error, extraLines) {
        function processLines(start, end) {
          return lines.slice(start, end).map((function(line, idx) {
            for (var num = String(start + idx + 1); num.length < maxNumLength; ) num = " " + num;
            return num + " |" + line;
          })).join("\n");
        }
        var lines = error.source.split(/\r\n?|\n|\f/), line = error.line, column = error.column, startLine = Math.max(1, line - extraLines) - 1, endLine = Math.min(line + extraLines, lines.length + 1), maxNumLength = Math.max(4, String(endLine).length) + 1, cutLeft = 0;
        (column += ("    ".length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length) > 100 && (cutLeft = column - 60 + 3, 
        column = 58);
        for (var i = startLine; i <= endLine; i++) i >= 0 && i < lines.length && (lines[i] = lines[i].replace(/\t/g, "    "), 
        lines[i] = (cutLeft > 0 && lines[i].length > cutLeft ? "…" : "") + lines[i].substr(cutLeft, 98) + (lines[i].length > cutLeft + 100 - 1 ? "…" : ""));
        return [ processLines(startLine, line), new Array(column + maxNumLength + 2).join("-") + "^", processLines(line, endLine) ].filter(Boolean).join("\n");
      }
      module.exports = function(message, source, offset, line, column) {
        var error = createCustomError("SyntaxError", message);
        return error.source = source, error.offset = offset, error.line = line, error.column = column, 
        error.sourceFragment = function(extraLines) {
          return sourceFragment(error, isNaN(extraLines) ? 0 : extraLines);
        }, Object.defineProperty(error, "formattedMessage", {
          get: function() {
            return "Parse error: " + error.message + "\n" + sourceFragment(error, 2);
          }
        }), error.parseError = {
          offset: offset,
          line: line,
          column: column
        }, error;
      };
    },
    2879: function(module, __unused_webpack_exports, __webpack_require__) {
      var constants = __webpack_require__(3786), TYPE = constants.TYPE, NAME = constants.NAME, cmpStr = __webpack_require__(5951).cmpStr, EOF = TYPE.EOF, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment, TokenStream = function() {
        this.offsetAndType = null, this.balance = null, this.reset();
      };
      TokenStream.prototype = {
        reset: function() {
          this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, 
          this.tokenEnd = this.firstCharOffset;
        },
        lookupType: function(offset) {
          return (offset += this.tokenIndex) < this.tokenCount ? this.offsetAndType[offset] >> 24 : EOF;
        },
        lookupOffset: function(offset) {
          return (offset += this.tokenIndex) < this.tokenCount ? 16777215 & this.offsetAndType[offset - 1] : this.source.length;
        },
        lookupValue: function(offset, referenceStr) {
          return (offset += this.tokenIndex) < this.tokenCount && cmpStr(this.source, 16777215 & this.offsetAndType[offset - 1], 16777215 & this.offsetAndType[offset], referenceStr);
        },
        getTokenStart: function(tokenIndex) {
          return tokenIndex === this.tokenIndex ? this.tokenStart : tokenIndex > 0 ? tokenIndex < this.tokenCount ? 16777215 & this.offsetAndType[tokenIndex - 1] : 16777215 & this.offsetAndType[this.tokenCount] : this.firstCharOffset;
        },
        getRawLength: function(startToken, mode) {
          var balanceEnd, cursor = startToken, offset = 16777215 & this.offsetAndType[Math.max(cursor - 1, 0)];
          loop: for (;cursor < this.tokenCount && !((balanceEnd = this.balance[cursor]) < startToken); cursor++) switch (mode(this.offsetAndType[cursor] >> 24, this.source, offset)) {
           case 1:
            break loop;

           case 2:
            cursor++;
            break loop;

           default:
            offset = 16777215 & this.offsetAndType[cursor], this.balance[balanceEnd] === cursor && (cursor = balanceEnd);
          }
          return cursor - this.tokenIndex;
        },
        isBalanceEdge: function(pos) {
          return this.balance[this.tokenIndex] < pos;
        },
        isDelim: function(code, offset) {
          return offset ? this.lookupType(offset) === TYPE.Delim && this.source.charCodeAt(this.lookupOffset(offset)) === code : this.tokenType === TYPE.Delim && this.source.charCodeAt(this.tokenStart) === code;
        },
        getTokenValue: function() {
          return this.source.substring(this.tokenStart, this.tokenEnd);
        },
        getTokenLength: function() {
          return this.tokenEnd - this.tokenStart;
        },
        substrToCursor: function(start) {
          return this.source.substring(start, this.tokenStart);
        },
        skipWS: function() {
          for (var i = this.tokenIndex, skipTokenCount = 0; i < this.tokenCount && this.offsetAndType[i] >> 24 === WHITESPACE; i++, 
          skipTokenCount++) ;
          skipTokenCount > 0 && this.skip(skipTokenCount);
        },
        skipSC: function() {
          for (;this.tokenType === WHITESPACE || this.tokenType === COMMENT; ) this.next();
        },
        skip: function(tokenCount) {
          var next = this.tokenIndex + tokenCount;
          next < this.tokenCount ? (this.tokenIndex = next, this.tokenStart = 16777215 & this.offsetAndType[next - 1], 
          next = this.offsetAndType[next], this.tokenType = next >> 24, this.tokenEnd = 16777215 & next) : (this.tokenIndex = this.tokenCount, 
          this.next());
        },
        next: function() {
          var next = this.tokenIndex + 1;
          next < this.tokenCount ? (this.tokenIndex = next, this.tokenStart = this.tokenEnd, 
          next = this.offsetAndType[next], this.tokenType = next >> 24, this.tokenEnd = 16777215 & next) : (this.tokenIndex = this.tokenCount, 
          this.eof = !0, this.tokenType = EOF, this.tokenStart = this.tokenEnd = this.source.length);
        },
        dump: function() {
          var offset = this.firstCharOffset;
          return Array.prototype.slice.call(this.offsetAndType, 0, this.tokenCount).map((function(item, idx) {
            var start = offset, end = 16777215 & item;
            return offset = end, {
              idx: idx,
              type: NAME[item >> 24],
              chunk: this.source.substring(start, end),
              balance: this.balance[idx]
            };
          }), this);
        }
      }, module.exports = TokenStream;
    },
    3123: function(module) {
      var SafeUint32Array = "undefined" != typeof Uint32Array ? Uint32Array : Array;
      module.exports = function(buffer, size) {
        return null === buffer || buffer.length < size ? new SafeUint32Array(Math.max(size + 1024, 16384)) : buffer;
      };
    },
    3196: function(module, __unused_webpack_exports, __webpack_require__) {
      var List = __webpack_require__(7467);
      module.exports = function(walk) {
        return {
          fromPlainObject: function(ast) {
            return walk(ast, {
              enter: function(node) {
                node.children && node.children instanceof List == !1 && (node.children = (new List).fromArray(node.children));
              }
            }), ast;
          },
          toPlainObject: function(ast) {
            return walk(ast, {
              leave: function(node) {
                node.children && node.children instanceof List && (node.children = node.children.toArray());
              }
            }), ast;
          }
        };
      };
    },
    7062: function(module, __unused_webpack_exports, __webpack_require__) {
      var createCustomError = __webpack_require__(2451);
      module.exports = function(message, input, offset) {
        var error = createCustomError("SyntaxError", message);
        return error.input = input, error.offset = offset, error.rawMessage = message, error.message = error.rawMessage + "\n  " + error.input + "\n--" + new Array((error.offset || error.input.length) + 1).join("-") + "^", 
        error;
      };
    },
    1381: function(module) {
      function noop(value) {
        return value;
      }
      function generate(node, decorate, forceBraces, compact) {
        var result, multiplier;
        switch (node.type) {
         case "Group":
          result = function(node, decorate, forceBraces, compact) {
            var combinator = " " === node.combinator || compact ? node.combinator : " " + node.combinator + " ", result = node.terms.map((function(term) {
              return generate(term, decorate, forceBraces, compact);
            })).join(combinator);
            return (node.explicit || forceBraces) && (result = (compact || "," === result[0] ? "[" : "[ ") + result + (compact ? "]" : " ]")), 
            result;
          }(node, decorate, forceBraces, compact) + (node.disallowEmpty ? "!" : "");
          break;

         case "Multiplier":
          return generate(node.term, decorate, forceBraces, compact) + decorate(0 === (multiplier = node).min && 0 === multiplier.max ? "*" : 0 === multiplier.min && 1 === multiplier.max ? "?" : 1 === multiplier.min && 0 === multiplier.max ? multiplier.comma ? "#" : "+" : 1 === multiplier.min && 1 === multiplier.max ? "" : (multiplier.comma ? "#" : "") + (multiplier.min === multiplier.max ? "{" + multiplier.min + "}" : "{" + multiplier.min + "," + (0 !== multiplier.max ? multiplier.max : "") + "}"), node);

         case "Type":
          result = "<" + node.name + (node.opts ? decorate(function(node) {
            if ("Range" === node.type) return " [" + (null === node.min ? "-∞" : node.min) + "," + (null === node.max ? "∞" : node.max) + "]";
            throw new Error("Unknown node type `" + node.type + "`");
          }(node.opts), node.opts) : "") + ">";
          break;

         case "Property":
          result = "<'" + node.name + "'>";
          break;

         case "Keyword":
          result = node.name;
          break;

         case "AtKeyword":
          result = "@" + node.name;
          break;

         case "Function":
          result = node.name + "(";
          break;

         case "String":
         case "Token":
          result = node.value;
          break;

         case "Comma":
          result = ",";
          break;

         default:
          throw new Error("Unknown node type `" + node.type + "`");
        }
        return decorate(result, node);
      }
      module.exports = function(node, options) {
        var decorate = noop, forceBraces = !1, compact = !1;
        return "function" == typeof options ? decorate = options : options && (forceBraces = Boolean(options.forceBraces), 
        compact = Boolean(options.compact), "function" == typeof options.decorate && (decorate = options.decorate)), 
        generate(node, decorate, forceBraces, compact);
      };
    },
    171: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        SyntaxError: __webpack_require__(7062),
        parse: __webpack_require__(7711),
        generate: __webpack_require__(1381),
        walk: __webpack_require__(9766)
      };
    },
    7711: function(module, __unused_webpack_exports, __webpack_require__) {
      var Tokenizer = __webpack_require__(3515), NAME_CHAR = function(fn) {
        for (var array = "function" == typeof Uint32Array ? new Uint32Array(128) : new Array(128), i = 0; i < 128; i++) array[i] = fn(String.fromCharCode(i)) ? 1 : 0;
        return array;
      }((function(ch) {
        return /[a-zA-Z0-9\-]/.test(ch);
      })), COMBINATOR_PRECEDENCE = {
        " ": 1,
        "&&": 2,
        "||": 3,
        "|": 4
      };
      function scanSpaces(tokenizer) {
        return tokenizer.substringToPos(tokenizer.findWsEnd(tokenizer.pos));
      }
      function scanWord(tokenizer) {
        for (var end = tokenizer.pos; end < tokenizer.str.length; end++) {
          var code = tokenizer.str.charCodeAt(end);
          if (code >= 128 || 0 === NAME_CHAR[code]) break;
        }
        return tokenizer.pos === end && tokenizer.error("Expect a keyword"), tokenizer.substringToPos(end);
      }
      function scanNumber(tokenizer) {
        for (var end = tokenizer.pos; end < tokenizer.str.length; end++) {
          var code = tokenizer.str.charCodeAt(end);
          if (code < 48 || code > 57) break;
        }
        return tokenizer.pos === end && tokenizer.error("Expect a number"), tokenizer.substringToPos(end);
      }
      function scanString(tokenizer) {
        var end = tokenizer.str.indexOf("'", tokenizer.pos + 1);
        return -1 === end && (tokenizer.pos = tokenizer.str.length, tokenizer.error("Expect an apostrophe")), 
        tokenizer.substringToPos(end + 1);
      }
      function readMultiplierRange(tokenizer) {
        var min, max = null;
        return tokenizer.eat(123), min = scanNumber(tokenizer), 44 === tokenizer.charCode() ? (tokenizer.pos++, 
        125 !== tokenizer.charCode() && (max = scanNumber(tokenizer))) : max = min, tokenizer.eat(125), 
        {
          min: Number(min),
          max: max ? Number(max) : 0
        };
      }
      function maybeMultiplied(tokenizer, node) {
        var multiplier = function(tokenizer) {
          var range = null, comma = !1;
          switch (tokenizer.charCode()) {
           case 42:
            tokenizer.pos++, range = {
              min: 0,
              max: 0
            };
            break;

           case 43:
            tokenizer.pos++, range = {
              min: 1,
              max: 0
            };
            break;

           case 63:
            tokenizer.pos++, range = {
              min: 0,
              max: 1
            };
            break;

           case 35:
            tokenizer.pos++, comma = !0, range = 123 === tokenizer.charCode() ? readMultiplierRange(tokenizer) : {
              min: 1,
              max: 0
            };
            break;

           case 123:
            range = readMultiplierRange(tokenizer);
            break;

           default:
            return null;
          }
          return {
            type: "Multiplier",
            comma: comma,
            min: range.min,
            max: range.max,
            term: null
          };
        }(tokenizer);
        return null !== multiplier ? (multiplier.term = node, multiplier) : node;
      }
      function maybeToken(tokenizer) {
        var ch = tokenizer.peek();
        return "" === ch ? null : {
          type: "Token",
          value: ch
        };
      }
      function readType(tokenizer) {
        var name, opts = null;
        return tokenizer.eat(60), name = scanWord(tokenizer), 40 === tokenizer.charCode() && 41 === tokenizer.nextCharCode() && (tokenizer.pos += 2, 
        name += "()"), 91 === tokenizer.charCodeAt(tokenizer.findWsEnd(tokenizer.pos)) && (scanSpaces(tokenizer), 
        opts = function(tokenizer) {
          var min = null, max = null, sign = 1;
          return tokenizer.eat(91), 45 === tokenizer.charCode() && (tokenizer.peek(), sign = -1), 
          -1 == sign && 8734 === tokenizer.charCode() ? tokenizer.peek() : min = sign * Number(scanNumber(tokenizer)), 
          scanSpaces(tokenizer), tokenizer.eat(44), scanSpaces(tokenizer), 8734 === tokenizer.charCode() ? tokenizer.peek() : (sign = 1, 
          45 === tokenizer.charCode() && (tokenizer.peek(), sign = -1), max = sign * Number(scanNumber(tokenizer))), 
          tokenizer.eat(93), null === min && null === max ? null : {
            type: "Range",
            min: min,
            max: max
          };
        }(tokenizer)), tokenizer.eat(62), maybeMultiplied(tokenizer, {
          type: "Type",
          name: name,
          opts: opts
        });
      }
      function regroupTerms(terms, combinators) {
        function createGroup(terms, combinator) {
          return {
            type: "Group",
            terms: terms,
            combinator: combinator,
            disallowEmpty: !1,
            explicit: !1
          };
        }
        for (combinators = Object.keys(combinators).sort((function(a, b) {
          return COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b];
        })); combinators.length > 0; ) {
          for (var combinator = combinators.shift(), i = 0, subgroupStart = 0; i < terms.length; i++) {
            var term = terms[i];
            "Combinator" === term.type && (term.value === combinator ? (-1 === subgroupStart && (subgroupStart = i - 1), 
            terms.splice(i, 1), i--) : (-1 !== subgroupStart && i - subgroupStart > 1 && (terms.splice(subgroupStart, i - subgroupStart, createGroup(terms.slice(subgroupStart, i), combinator)), 
            i = subgroupStart + 1), subgroupStart = -1));
          }
          -1 !== subgroupStart && combinators.length && terms.splice(subgroupStart, i - subgroupStart, createGroup(terms.slice(subgroupStart, i), combinator));
        }
        return combinator;
      }
      function readImplicitGroup(tokenizer) {
        for (var token, terms = [], combinators = {}, prevToken = null, prevTokenPos = tokenizer.pos; token = peek(tokenizer); ) "Spaces" !== token.type && ("Combinator" === token.type ? (null !== prevToken && "Combinator" !== prevToken.type || (tokenizer.pos = prevTokenPos, 
        tokenizer.error("Unexpected combinator")), combinators[token.value] = !0) : null !== prevToken && "Combinator" !== prevToken.type && (combinators[" "] = !0, 
        terms.push({
          type: "Combinator",
          value: " "
        })), terms.push(token), prevToken = token, prevTokenPos = tokenizer.pos);
        return null !== prevToken && "Combinator" === prevToken.type && (tokenizer.pos -= prevTokenPos, 
        tokenizer.error("Unexpected combinator")), {
          type: "Group",
          terms: terms,
          combinator: regroupTerms(terms, combinators) || " ",
          disallowEmpty: !1,
          explicit: !1
        };
      }
      function peek(tokenizer) {
        var code = tokenizer.charCode();
        if (code < 128 && 1 === NAME_CHAR[code]) return function(tokenizer) {
          var name;
          return name = scanWord(tokenizer), 40 === tokenizer.charCode() ? (tokenizer.pos++, 
          {
            type: "Function",
            name: name
          }) : maybeMultiplied(tokenizer, {
            type: "Keyword",
            name: name
          });
        }(tokenizer);
        switch (code) {
         case 93:
         case 42:
         case 43:
         case 63:
         case 35:
         case 33:
          break;

         case 91:
          return maybeMultiplied(tokenizer, function(tokenizer) {
            var result;
            return tokenizer.eat(91), result = readImplicitGroup(tokenizer), tokenizer.eat(93), 
            result.explicit = !0, 33 === tokenizer.charCode() && (tokenizer.pos++, result.disallowEmpty = !0), 
            result;
          }(tokenizer));

         case 60:
          return 39 === tokenizer.nextCharCode() ? function(tokenizer) {
            var name;
            return tokenizer.eat(60), tokenizer.eat(39), name = scanWord(tokenizer), tokenizer.eat(39), 
            tokenizer.eat(62), maybeMultiplied(tokenizer, {
              type: "Property",
              name: name
            });
          }(tokenizer) : readType(tokenizer);

         case 124:
          return {
            type: "Combinator",
            value: tokenizer.substringToPos(124 === tokenizer.nextCharCode() ? tokenizer.pos + 2 : tokenizer.pos + 1)
          };

         case 38:
          return tokenizer.pos++, tokenizer.eat(38), {
            type: "Combinator",
            value: "&&"
          };

         case 44:
          return tokenizer.pos++, {
            type: "Comma"
          };

         case 39:
          return maybeMultiplied(tokenizer, {
            type: "String",
            value: scanString(tokenizer)
          });

         case 32:
         case 9:
         case 10:
         case 13:
         case 12:
          return {
            type: "Spaces",
            value: scanSpaces(tokenizer)
          };

         case 64:
          return (code = tokenizer.nextCharCode()) < 128 && 1 === NAME_CHAR[code] ? (tokenizer.pos++, 
          {
            type: "AtKeyword",
            name: scanWord(tokenizer)
          }) : maybeToken(tokenizer);

         case 123:
          if ((code = tokenizer.nextCharCode()) < 48 || code > 57) return maybeToken(tokenizer);
          break;

         default:
          return maybeToken(tokenizer);
        }
      }
      function parse(source) {
        var tokenizer = new Tokenizer(source), result = readImplicitGroup(tokenizer);
        return tokenizer.pos !== source.length && tokenizer.error("Unexpected input"), 1 === result.terms.length && "Group" === result.terms[0].type && (result = result.terms[0]), 
        result;
      }
      parse("[a&&<b>#|<'c'>*||e() f{2} /,(% g#{1,2} h{2,})]!"), module.exports = parse;
    },
    3515: function(module, __unused_webpack_exports, __webpack_require__) {
      var SyntaxError = __webpack_require__(7062), Tokenizer = function(str) {
        this.str = str, this.pos = 0;
      };
      Tokenizer.prototype = {
        charCodeAt: function(pos) {
          return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
        },
        charCode: function() {
          return this.charCodeAt(this.pos);
        },
        nextCharCode: function() {
          return this.charCodeAt(this.pos + 1);
        },
        nextNonWsCode: function(pos) {
          return this.charCodeAt(this.findWsEnd(pos));
        },
        findWsEnd: function(pos) {
          for (;pos < this.str.length; pos++) {
            var code = this.str.charCodeAt(pos);
            if (13 !== code && 10 !== code && 12 !== code && 32 !== code && 9 !== code) break;
          }
          return pos;
        },
        substringToPos: function(end) {
          return this.str.substring(this.pos, this.pos = end);
        },
        eat: function(code) {
          this.charCode() !== code && this.error("Expect `" + String.fromCharCode(code) + "`"), 
          this.pos++;
        },
        peek: function() {
          return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
        },
        error: function(message) {
          throw new SyntaxError(message, this.str, this.pos);
        }
      }, module.exports = Tokenizer;
    },
    9766: function(module) {
      var noop = function() {};
      function ensureFunction(value) {
        return "function" == typeof value ? value : noop;
      }
      module.exports = function(node, options, context) {
        var enter = noop, leave = noop;
        if ("function" == typeof options ? enter = options : options && (enter = ensureFunction(options.enter), 
        leave = ensureFunction(options.leave)), enter === noop && leave === noop) throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
        !function walk(node) {
          switch (enter.call(context, node), node.type) {
           case "Group":
            node.terms.forEach(walk);
            break;

           case "Multiplier":
            walk(node.term);
            break;

           case "Type":
           case "Property":
           case "Keyword":
           case "AtKeyword":
           case "Function":
           case "String":
           case "Token":
           case "Comma":
            break;

           default:
            throw new Error("Unknown type: " + node.type);
          }
          leave.call(context, node);
        }(node);
      };
    },
    8975: function(module, __unused_webpack_exports, __webpack_require__) {
      var sourceMap = __webpack_require__(7625), hasOwnProperty = Object.prototype.hasOwnProperty;
      function processChildren(node, delimeter) {
        var list = node.children, prev = null;
        "function" != typeof delimeter ? list.forEach(this.node, this) : list.forEach((function(node) {
          null !== prev && delimeter.call(this, prev), this.node(node), prev = node;
        }), this);
      }
      module.exports = function(config) {
        function processNode(node) {
          if (!hasOwnProperty.call(types, node.type)) throw new Error("Unknown node type: " + node.type);
          types[node.type].call(this, node);
        }
        var types = {};
        if (config.node) for (var name in config.node) types[name] = config.node[name].generate;
        return function(node, options) {
          var buffer = "", handlers = {
            children: processChildren,
            node: processNode,
            chunk: function(chunk) {
              buffer += chunk;
            },
            result: function() {
              return buffer;
            }
          };
          return options && ("function" == typeof options.decorator && (handlers = options.decorator(handlers)), 
          options.sourceMap && (handlers = sourceMap(handlers))), handlers.node(node), handlers.result();
        };
      };
    },
    7625: function(module, __unused_webpack_exports, __webpack_require__) {
      var SourceMapGenerator = __webpack_require__(4433).h, trackNodes = {
        Atrule: !0,
        Selector: !0,
        Declaration: !0
      };
      module.exports = function(handlers) {
        var map = new SourceMapGenerator, line = 1, column = 0, generated = {
          line: 1,
          column: 0
        }, original = {
          line: 0,
          column: 0
        }, sourceMappingActive = !1, activatedGenerated = {
          line: 1,
          column: 0
        }, activatedMapping = {
          generated: activatedGenerated
        }, handlersNode = handlers.node;
        handlers.node = function(node) {
          if (node.loc && node.loc.start && trackNodes.hasOwnProperty(node.type)) {
            var nodeLine = node.loc.start.line, nodeColumn = node.loc.start.column - 1;
            original.line === nodeLine && original.column === nodeColumn || (original.line = nodeLine, 
            original.column = nodeColumn, generated.line = line, generated.column = column, 
            sourceMappingActive && (sourceMappingActive = !1, generated.line === activatedGenerated.line && generated.column === activatedGenerated.column || map.addMapping(activatedMapping)), 
            sourceMappingActive = !0, map.addMapping({
              source: node.loc.source,
              original: original,
              generated: generated
            }));
          }
          handlersNode.call(this, node), sourceMappingActive && trackNodes.hasOwnProperty(node.type) && (activatedGenerated.line = line, 
          activatedGenerated.column = column);
        };
        var handlersChunk = handlers.chunk;
        handlers.chunk = function(chunk) {
          for (var i = 0; i < chunk.length; i++) 10 === chunk.charCodeAt(i) ? (line++, column = 0) : column++;
          handlersChunk(chunk);
        };
        var handlersResult = handlers.result;
        return handlers.result = function() {
          return sourceMappingActive && map.addMapping(activatedMapping), {
            css: handlersResult(),
            map: map
          };
        }, handlers;
      };
    },
    7801: function(module, __unused_webpack_exports, __webpack_require__) {
      var SyntaxReferenceError = __webpack_require__(1628).SyntaxReferenceError, MatchError = __webpack_require__(1628).MatchError, names = __webpack_require__(5993), generic = __webpack_require__(3244), parse = __webpack_require__(7711), generate = __webpack_require__(1381), walk = __webpack_require__(9766), prepareTokens = __webpack_require__(9377), buildMatchGraph = __webpack_require__(5167).buildMatchGraph, matchAsTree = __webpack_require__(4583).matchAsTree, trace = __webpack_require__(2750), search = __webpack_require__(7445), getStructureFromConfig = __webpack_require__(5007).getStructureFromConfig, cssWideKeywords = buildMatchGraph("inherit | initial | unset"), cssWideKeywordsWithExpression = buildMatchGraph("inherit | initial | unset | <-ms-legacy-expression>");
      function dumpMapSyntax(map, compact, syntaxAsAst) {
        var result = {};
        for (var name in map) map[name].syntax && (result[name] = syntaxAsAst ? map[name].syntax : generate(map[name].syntax, {
          compact: compact
        }));
        return result;
      }
      function buildMatchResult(match, error, iterations) {
        return {
          matched: match,
          iterations: iterations,
          error: error,
          getTrace: trace.getTrace,
          isType: trace.isType,
          isProperty: trace.isProperty,
          isKeyword: trace.isKeyword
        };
      }
      function matchSyntax(lexer, syntax, value, useCommon) {
        var result, tokens = prepareTokens(value, lexer.syntax);
        return function(tokens) {
          for (var i = 0; i < tokens.length; i++) if ("var(" === tokens[i].value.toLowerCase()) return !0;
          return !1;
        }(tokens) ? buildMatchResult(null, new Error("Matching for a tree with var() is not supported")) : (useCommon && (result = matchAsTree(tokens, lexer.valueCommonSyntax, lexer)), 
        useCommon && result.match || (result = matchAsTree(tokens, syntax.match, lexer)).match ? buildMatchResult(result.match, null, result.iterations) : buildMatchResult(null, new MatchError(result.reason, syntax.syntax, value, result), result.iterations));
      }
      var Lexer = function(config, syntax, structure) {
        if (this.valueCommonSyntax = cssWideKeywords, this.syntax = syntax, this.generic = !1, 
        this.atrules = {}, this.properties = {}, this.types = {}, this.structure = structure || getStructureFromConfig(config), 
        config) {
          if (config.types) for (var name in config.types) this.addType_(name, config.types[name]);
          if (config.generic) for (var name in this.generic = !0, generic) this.addType_(name, generic[name]);
          if (config.atrules) for (var name in config.atrules) this.addAtrule_(name, config.atrules[name]);
          if (config.properties) for (var name in config.properties) this.addProperty_(name, config.properties[name]);
        }
      };
      Lexer.prototype = {
        structure: {},
        checkStructure: function(ast) {
          function collectWarning(node, message) {
            warns.push({
              node: node,
              message: message
            });
          }
          var structure = this.structure, warns = [];
          return this.syntax.walk(ast, (function(node) {
            structure.hasOwnProperty(node.type) ? structure[node.type].check(node, collectWarning) : collectWarning(node, "Unknown node type `" + node.type + "`");
          })), !!warns.length && warns;
        },
        createDescriptor: function(syntax, type, name) {
          var ref = {
            type: type,
            name: name
          }, descriptor = {
            type: type,
            name: name,
            syntax: null,
            match: null
          };
          return "function" == typeof syntax ? descriptor.match = buildMatchGraph(syntax, ref) : ("string" == typeof syntax ? Object.defineProperty(descriptor, "syntax", {
            get: function() {
              return Object.defineProperty(descriptor, "syntax", {
                value: parse(syntax)
              }), descriptor.syntax;
            }
          }) : descriptor.syntax = syntax, Object.defineProperty(descriptor, "match", {
            get: function() {
              return Object.defineProperty(descriptor, "match", {
                value: buildMatchGraph(descriptor.syntax, ref)
              }), descriptor.match;
            }
          })), descriptor;
        },
        addAtrule_: function(name, syntax) {
          this.atrules[name] = {
            prelude: syntax.prelude ? this.createDescriptor(syntax.prelude, "AtrulePrelude", name) : null,
            descriptors: syntax.descriptors ? Object.keys(syntax.descriptors).reduce(((res, name) => (res[name] = this.createDescriptor(syntax.descriptors[name], "AtruleDescriptor", name), 
            res)), {}) : null
          };
        },
        addProperty_: function(name, syntax) {
          this.properties[name] = this.createDescriptor(syntax, "Property", name);
        },
        addType_: function(name, syntax) {
          this.types[name] = this.createDescriptor(syntax, "Type", name), syntax === generic["-ms-legacy-expression"] && (this.valueCommonSyntax = cssWideKeywordsWithExpression);
        },
        matchAtrulePrelude: function(atruleName, prelude) {
          var atrule = names.keyword(atruleName), atrulePreludeSyntax = atrule.vendor ? this.getAtrulePrelude(atrule.name) || this.getAtrulePrelude(atrule.basename) : this.getAtrulePrelude(atrule.name);
          return atrulePreludeSyntax ? matchSyntax(this, atrulePreludeSyntax, prelude, !0) : atrule.basename in this.atrules ? buildMatchResult(null, new Error("At-rule `" + atruleName + "` should not contain a prelude")) : buildMatchResult(null, new SyntaxReferenceError("Unknown at-rule", atruleName));
        },
        matchAtruleDescriptor: function(atruleName, descriptorName, value) {
          var atrule = names.keyword(atruleName), descriptor = names.keyword(descriptorName), atruleEntry = atrule.vendor ? this.atrules[atrule.name] || this.atrules[atrule.basename] : this.atrules[atrule.name];
          if (!atruleEntry) return buildMatchResult(null, new SyntaxReferenceError("Unknown at-rule", atruleName));
          if (!atruleEntry.descriptors) return buildMatchResult(null, new Error("At-rule `" + atruleName + "` has no known descriptors"));
          var atruleDescriptorSyntax = descriptor.vendor ? atruleEntry.descriptors[descriptor.name] || atruleEntry.descriptors[descriptor.basename] : atruleEntry.descriptors[descriptor.name];
          return atruleDescriptorSyntax ? matchSyntax(this, atruleDescriptorSyntax, value, !0) : buildMatchResult(null, new SyntaxReferenceError("Unknown at-rule descriptor", descriptorName));
        },
        matchDeclaration: function(node) {
          return "Declaration" !== node.type ? buildMatchResult(null, new Error("Not a Declaration node")) : this.matchProperty(node.property, node.value);
        },
        matchProperty: function(propertyName, value) {
          var property = names.property(propertyName);
          if (property.custom) return buildMatchResult(null, new Error("Lexer matching doesn't applicable for custom properties"));
          var propertySyntax = property.vendor ? this.getProperty(property.name) || this.getProperty(property.basename) : this.getProperty(property.name);
          return propertySyntax ? matchSyntax(this, propertySyntax, value, !0) : buildMatchResult(null, new SyntaxReferenceError("Unknown property", propertyName));
        },
        matchType: function(typeName, value) {
          var typeSyntax = this.getType(typeName);
          return typeSyntax ? matchSyntax(this, typeSyntax, value, !1) : buildMatchResult(null, new SyntaxReferenceError("Unknown type", typeName));
        },
        match: function(syntax, value) {
          return "string" == typeof syntax || syntax && syntax.type ? ("string" != typeof syntax && syntax.match || (syntax = this.createDescriptor(syntax, "Type", "anonymous")), 
          matchSyntax(this, syntax, value, !1)) : buildMatchResult(null, new SyntaxReferenceError("Bad syntax"));
        },
        findValueFragments: function(propertyName, value, type, name) {
          return search.matchFragments(this, value, this.matchProperty(propertyName, value), type, name);
        },
        findDeclarationValueFragments: function(declaration, type, name) {
          return search.matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name);
        },
        findAllFragments: function(ast, type, name) {
          var result = [];
          return this.syntax.walk(ast, {
            visit: "Declaration",
            enter: function(declaration) {
              result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name));
            }.bind(this)
          }), result;
        },
        getAtrulePrelude: function(atruleName) {
          return this.atrules.hasOwnProperty(atruleName) ? this.atrules[atruleName].prelude : null;
        },
        getAtruleDescriptor: function(atruleName, name) {
          return this.atrules.hasOwnProperty(atruleName) && this.atrules.declarators && this.atrules[atruleName].declarators[name] || null;
        },
        getProperty: function(name) {
          return this.properties.hasOwnProperty(name) ? this.properties[name] : null;
        },
        getType: function(name) {
          return this.types.hasOwnProperty(name) ? this.types[name] : null;
        },
        validate: function() {
          function validate(syntax, name, broken, descriptor) {
            if (broken.hasOwnProperty(name)) return broken[name];
            broken[name] = !1, null !== descriptor.syntax && walk(descriptor.syntax, (function(node) {
              if ("Type" === node.type || "Property" === node.type) {
                var map = "Type" === node.type ? syntax.types : syntax.properties, brokenMap = "Type" === node.type ? brokenTypes : brokenProperties;
                map.hasOwnProperty(node.name) && !validate(syntax, node.name, brokenMap, map[node.name]) || (broken[name] = !0);
              }
            }), this);
          }
          var brokenTypes = {}, brokenProperties = {};
          for (var key in this.types) validate(this, key, brokenTypes, this.types[key]);
          for (var key in this.properties) validate(this, key, brokenProperties, this.properties[key]);
          return brokenTypes = Object.keys(brokenTypes).filter((function(name) {
            return brokenTypes[name];
          })), brokenProperties = Object.keys(brokenProperties).filter((function(name) {
            return brokenProperties[name];
          })), brokenTypes.length || brokenProperties.length ? {
            types: brokenTypes,
            properties: brokenProperties
          } : null;
        },
        dump: function(syntaxAsAst, pretty) {
          return {
            generic: this.generic,
            types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
            properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst)
          };
        },
        toString: function() {
          return JSON.stringify(this.dump());
        }
      }, module.exports = Lexer;
    },
    1628: function(module, __unused_webpack_exports, __webpack_require__) {
      var createCustomError = __webpack_require__(2451), generate = __webpack_require__(1381);
      function getLocation(node, point) {
        var loc = node && node.loc && node.loc[point];
        return loc ? {
          offset: loc.offset,
          line: loc.line,
          column: loc.column
        } : null;
      }
      module.exports = {
        SyntaxReferenceError: function(type, referenceName) {
          var error = createCustomError("SyntaxReferenceError", type + (referenceName ? " `" + referenceName + "`" : ""));
          return error.reference = referenceName, error;
        },
        MatchError: function(message, syntax, node, matchResult) {
          var error = createCustomError("SyntaxMatchError", message), details = function(matchResult) {
            for (var tokens = matchResult.tokens, longestMatch = matchResult.longestMatch, node = longestMatch < tokens.length ? tokens[longestMatch].node : null, mismatchOffset = -1, entries = 0, css = "", i = 0; i < tokens.length; i++) i === longestMatch && (mismatchOffset = css.length), 
            null !== node && tokens[i].node === node && (i <= longestMatch ? entries++ : entries = 0), 
            css += tokens[i].value;
            return {
              node: node,
              css: css,
              mismatchOffset: -1 === mismatchOffset ? css.length : mismatchOffset,
              last: null === node || entries > 1
            };
          }(matchResult), mismatchOffset = details.mismatchOffset || 0, badNode = details.node || node, end = getLocation(badNode, "end"), start = details.last ? end : getLocation(badNode, "start"), css = details.css;
          return error.rawMessage = message, error.syntax = syntax ? generate(syntax) : "<generic>", 
          error.css = css, error.mismatchOffset = mismatchOffset, error.loc = {
            source: badNode && badNode.loc && badNode.loc.source || "<unknown>",
            start: start,
            end: end
          }, error.line = start ? start.line : void 0, error.column = start ? start.column : void 0, 
          error.offset = start ? start.offset : void 0, error.message = message + "\n  syntax: " + error.syntax + "\n   value: " + (error.css || "<empty string>") + "\n  --------" + new Array(error.mismatchOffset + 1).join("-") + "^", 
          error;
        }
      };
    },
    1524: function(module, __unused_webpack_exports, __webpack_require__) {
      var isDigit = __webpack_require__(7093).isDigit, cmpChar = __webpack_require__(7093).cmpChar, TYPE = __webpack_require__(7093).TYPE, DELIM = TYPE.Delim, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment, IDENT = TYPE.Ident, NUMBER = TYPE.Number, DIMENSION = TYPE.Dimension;
      function isDelim(token, code) {
        return null !== token && token.type === DELIM && token.value.charCodeAt(0) === code;
      }
      function skipSC(token, offset, getNextToken) {
        for (;null !== token && (token.type === WHITESPACE || token.type === COMMENT); ) token = getNextToken(++offset);
        return offset;
      }
      function checkInteger(token, valueOffset, disallowSign, offset) {
        if (!token) return 0;
        var code = token.value.charCodeAt(valueOffset);
        if (43 === code || 45 === code) {
          if (disallowSign) return 0;
          valueOffset++;
        }
        for (;valueOffset < token.value.length; valueOffset++) if (!isDigit(token.value.charCodeAt(valueOffset))) return 0;
        return offset + 1;
      }
      function consumeB(token, offset_, getNextToken) {
        var sign = !1, offset = skipSC(token, offset_, getNextToken);
        if (null === (token = getNextToken(offset))) return offset_;
        if (token.type !== NUMBER) {
          if (!isDelim(token, 43) && !isDelim(token, 45)) return offset_;
          if (sign = !0, offset = skipSC(getNextToken(++offset), offset, getNextToken), null === (token = getNextToken(offset)) && token.type !== NUMBER) return 0;
        }
        if (!sign) {
          var code = token.value.charCodeAt(0);
          if (43 !== code && 45 !== code) return 0;
        }
        return checkInteger(token, sign ? 0 : 1, sign, offset);
      }
      module.exports = function(token, getNextToken) {
        var offset = 0;
        if (!token) return 0;
        if (token.type === NUMBER) return checkInteger(token, 0, false, offset);
        if (token.type === IDENT && 45 === token.value.charCodeAt(0)) {
          if (!cmpChar(token.value, 1, 110)) return 0;
          switch (token.value.length) {
           case 2:
            return consumeB(getNextToken(++offset), offset, getNextToken);

           case 3:
            return 45 !== token.value.charCodeAt(2) ? 0 : (offset = skipSC(getNextToken(++offset), offset, getNextToken), 
            checkInteger(token = getNextToken(offset), 0, true, offset));

           default:
            return 45 !== token.value.charCodeAt(2) ? 0 : checkInteger(token, 3, true, offset);
          }
        } else if (token.type === IDENT || isDelim(token, 43) && getNextToken(offset + 1).type === IDENT) {
          if (token.type !== IDENT && (token = getNextToken(++offset)), null === token || !cmpChar(token.value, 0, 110)) return 0;
          switch (token.value.length) {
           case 1:
            return consumeB(getNextToken(++offset), offset, getNextToken);

           case 2:
            return 45 !== token.value.charCodeAt(1) ? 0 : (offset = skipSC(getNextToken(++offset), offset, getNextToken), 
            checkInteger(token = getNextToken(offset), 0, true, offset));

           default:
            return 45 !== token.value.charCodeAt(1) ? 0 : checkInteger(token, 2, true, offset);
          }
        } else if (token.type === DIMENSION) {
          for (var code = token.value.charCodeAt(0), sign = 43 === code || 45 === code ? 1 : 0, i = sign; i < token.value.length && isDigit(token.value.charCodeAt(i)); i++) ;
          return i === sign ? 0 : cmpChar(token.value, i, 110) ? i + 1 === token.value.length ? consumeB(getNextToken(++offset), offset, getNextToken) : 45 !== token.value.charCodeAt(i + 1) ? 0 : i + 2 === token.value.length ? (offset = skipSC(getNextToken(++offset), offset, getNextToken), 
          checkInteger(token = getNextToken(offset), 0, true, offset)) : checkInteger(token, i + 2, true, offset) : 0;
        }
        return 0;
      };
    },
    7871: function(module, __unused_webpack_exports, __webpack_require__) {
      var isHexDigit = __webpack_require__(7093).isHexDigit, cmpChar = __webpack_require__(7093).cmpChar, TYPE = __webpack_require__(7093).TYPE, IDENT = TYPE.Ident, DELIM = TYPE.Delim, NUMBER = TYPE.Number, DIMENSION = TYPE.Dimension;
      function isDelim(token, code) {
        return null !== token && token.type === DELIM && token.value.charCodeAt(0) === code;
      }
      function startsWith(token, code) {
        return token.value.charCodeAt(0) === code;
      }
      function hexSequence(token, offset, allowDash) {
        for (var pos = offset, hexlen = 0; pos < token.value.length; pos++) {
          var code = token.value.charCodeAt(pos);
          if (45 === code && allowDash && 0 !== hexlen) return hexSequence(token, offset + hexlen + 1, !1) > 0 ? 6 : 0;
          if (!isHexDigit(code)) return 0;
          if (++hexlen > 6) return 0;
        }
        return hexlen;
      }
      function withQuestionMarkSequence(consumed, length, getNextToken) {
        if (!consumed) return 0;
        for (;isDelim(getNextToken(length), 63); ) {
          if (++consumed > 6) return 0;
          length++;
        }
        return length;
      }
      module.exports = function(token, getNextToken) {
        var length = 0;
        if (null === token || token.type !== IDENT || !cmpChar(token.value, 0, 117)) return 0;
        if (null === (token = getNextToken(++length))) return 0;
        if (isDelim(token, 43)) return null === (token = getNextToken(++length)) ? 0 : token.type === IDENT ? withQuestionMarkSequence(hexSequence(token, 0, !0), ++length, getNextToken) : isDelim(token, 63) ? withQuestionMarkSequence(1, ++length, getNextToken) : 0;
        if (token.type === NUMBER) {
          if (!startsWith(token, 43)) return 0;
          var consumedHexLength = hexSequence(token, 1, !0);
          return 0 === consumedHexLength ? 0 : null === (token = getNextToken(++length)) ? length : token.type === DIMENSION || token.type === NUMBER ? startsWith(token, 45) && hexSequence(token, 1, !1) ? length + 1 : 0 : withQuestionMarkSequence(consumedHexLength, length, getNextToken);
        }
        return token.type === DIMENSION && startsWith(token, 43) ? withQuestionMarkSequence(hexSequence(token, 1, !0), ++length, getNextToken) : 0;
      };
    },
    3244: function(module, __unused_webpack_exports, __webpack_require__) {
      var name, tokenizer = __webpack_require__(7093), isIdentifierStart = tokenizer.isIdentifierStart, isHexDigit = tokenizer.isHexDigit, isDigit = tokenizer.isDigit, cmpStr = tokenizer.cmpStr, consumeNumber = tokenizer.consumeNumber, TYPE = tokenizer.TYPE, anPlusB = __webpack_require__(1524), urange = __webpack_require__(7871), cssWideKeywords = [ "unset", "initial", "inherit" ], calcFunctionNames = [ "calc(", "-moz-calc(", "-webkit-calc(" ];
      function charCode(str, index) {
        return index < str.length ? str.charCodeAt(index) : 0;
      }
      function eqStr(actual, expected) {
        return cmpStr(actual, 0, actual.length, expected);
      }
      function eqStrAny(actual, expected) {
        for (var i = 0; i < expected.length; i++) if (eqStr(actual, expected[i])) return !0;
        return !1;
      }
      function isPostfixIeHack(str, offset) {
        return offset === str.length - 2 && (92 === str.charCodeAt(offset) && isDigit(str.charCodeAt(offset + 1)));
      }
      function outOfRange(opts, value, numEnd) {
        if (opts && "Range" === opts.type) {
          var num = Number(void 0 !== numEnd && numEnd !== value.length ? value.substr(0, numEnd) : value);
          if (isNaN(num)) return !0;
          if (null !== opts.min && num < opts.min) return !0;
          if (null !== opts.max && num > opts.max) return !0;
        }
        return !1;
      }
      function consumeFunction(token, getNextToken) {
        var startIdx = token.index, length = 0;
        do {
          if (length++, token.balance <= startIdx) break;
        } while (token = getNextToken(length));
        return length;
      }
      function calc(next) {
        return function(token, getNextToken, opts) {
          return null === token ? 0 : token.type === TYPE.Function && eqStrAny(token.value, calcFunctionNames) ? consumeFunction(token, getNextToken) : next(token, getNextToken, opts);
        };
      }
      function tokenType(expectedTokenType) {
        return function(token) {
          return null === token || token.type !== expectedTokenType ? 0 : 1;
        };
      }
      function dimension(type) {
        return function(token, getNextToken, opts) {
          if (null === token || token.type !== TYPE.Dimension) return 0;
          var numberEnd = consumeNumber(token.value, 0);
          if (null !== type) {
            var reverseSolidusOffset = token.value.indexOf("\\", numberEnd), unit = -1 !== reverseSolidusOffset && isPostfixIeHack(token.value, reverseSolidusOffset) ? token.value.substring(numberEnd, reverseSolidusOffset) : token.value.substr(numberEnd);
            if (!1 === type.hasOwnProperty(unit.toLowerCase())) return 0;
          }
          return outOfRange(opts, token.value, numberEnd) ? 0 : 1;
        };
      }
      function zero(next) {
        return "function" != typeof next && (next = function() {
          return 0;
        }), function(token, getNextToken, opts) {
          return null !== token && token.type === TYPE.Number && 0 === Number(token.value) ? 1 : next(token, getNextToken, opts);
        };
      }
      module.exports = {
        "ident-token": tokenType(TYPE.Ident),
        "function-token": tokenType(TYPE.Function),
        "at-keyword-token": tokenType(TYPE.AtKeyword),
        "hash-token": tokenType(TYPE.Hash),
        "string-token": tokenType(TYPE.String),
        "bad-string-token": tokenType(TYPE.BadString),
        "url-token": tokenType(TYPE.Url),
        "bad-url-token": tokenType(TYPE.BadUrl),
        "delim-token": tokenType(TYPE.Delim),
        "number-token": tokenType(TYPE.Number),
        "percentage-token": tokenType(TYPE.Percentage),
        "dimension-token": tokenType(TYPE.Dimension),
        "whitespace-token": tokenType(TYPE.WhiteSpace),
        "CDO-token": tokenType(TYPE.CDO),
        "CDC-token": tokenType(TYPE.CDC),
        "colon-token": tokenType(TYPE.Colon),
        "semicolon-token": tokenType(TYPE.Semicolon),
        "comma-token": tokenType(TYPE.Comma),
        "[-token": tokenType(TYPE.LeftSquareBracket),
        "]-token": tokenType(TYPE.RightSquareBracket),
        "(-token": tokenType(TYPE.LeftParenthesis),
        ")-token": tokenType(TYPE.RightParenthesis),
        "{-token": tokenType(TYPE.LeftCurlyBracket),
        "}-token": tokenType(TYPE.RightCurlyBracket),
        string: tokenType(TYPE.String),
        ident: tokenType(TYPE.Ident),
        "custom-ident": function(token) {
          if (null === token || token.type !== TYPE.Ident) return 0;
          var name = token.value.toLowerCase();
          return eqStrAny(name, cssWideKeywords) || eqStr(name, "default") ? 0 : 1;
        },
        "custom-property-name": function(token) {
          return null === token || token.type !== TYPE.Ident || 45 !== charCode(token.value, 0) || 45 !== charCode(token.value, 1) ? 0 : 1;
        },
        "hex-color": function(token) {
          if (null === token || token.type !== TYPE.Hash) return 0;
          var length = token.value.length;
          if (4 !== length && 5 !== length && 7 !== length && 9 !== length) return 0;
          for (var i = 1; i < length; i++) if (!isHexDigit(token.value.charCodeAt(i))) return 0;
          return 1;
        },
        "id-selector": function(token) {
          return null === token || token.type !== TYPE.Hash ? 0 : isIdentifierStart(charCode(token.value, 1), charCode(token.value, 2), charCode(token.value, 3)) ? 1 : 0;
        },
        "an-plus-b": anPlusB,
        urange: urange,
        "declaration-value": function(token, getNextToken) {
          if (!token) return 0;
          var length = 0, level = 0, startIdx = token.index;
          scan: do {
            switch (token.type) {
             case TYPE.BadString:
             case TYPE.BadUrl:
              break scan;

             case TYPE.RightCurlyBracket:
             case TYPE.RightParenthesis:
             case TYPE.RightSquareBracket:
              if (token.balance > token.index || token.balance < startIdx) break scan;
              level--;
              break;

             case TYPE.Semicolon:
              if (0 === level) break scan;
              break;

             case TYPE.Delim:
              if ("!" === token.value && 0 === level) break scan;
              break;

             case TYPE.Function:
             case TYPE.LeftParenthesis:
             case TYPE.LeftSquareBracket:
             case TYPE.LeftCurlyBracket:
              level++;
            }
            if (length++, token.balance <= startIdx) break;
          } while (token = getNextToken(length));
          return length;
        },
        "any-value": function(token, getNextToken) {
          if (!token) return 0;
          var startIdx = token.index, length = 0;
          scan: do {
            switch (token.type) {
             case TYPE.BadString:
             case TYPE.BadUrl:
              break scan;

             case TYPE.RightCurlyBracket:
             case TYPE.RightParenthesis:
             case TYPE.RightSquareBracket:
              if (token.balance > token.index || token.balance < startIdx) break scan;
            }
            if (length++, token.balance <= startIdx) break;
          } while (token = getNextToken(length));
          return length;
        },
        dimension: calc(dimension(null)),
        angle: calc(dimension({
          deg: !0,
          grad: !0,
          rad: !0,
          turn: !0
        })),
        decibel: calc(dimension({
          db: !0
        })),
        frequency: calc(dimension({
          hz: !0,
          khz: !0
        })),
        flex: calc(dimension({
          fr: !0
        })),
        length: calc(zero(dimension({
          px: !0,
          mm: !0,
          cm: !0,
          in: !0,
          pt: !0,
          pc: !0,
          q: !0,
          em: !0,
          ex: !0,
          ch: !0,
          rem: !0,
          vh: !0,
          vw: !0,
          vmin: !0,
          vmax: !0,
          vm: !0
        }))),
        resolution: calc(dimension({
          dpi: !0,
          dpcm: !0,
          dppx: !0,
          x: !0
        })),
        semitones: calc(dimension({
          st: !0
        })),
        time: calc(dimension({
          s: !0,
          ms: !0
        })),
        percentage: calc((function(token, getNextToken, opts) {
          return null === token || token.type !== TYPE.Percentage || outOfRange(opts, token.value, token.value.length - 1) ? 0 : 1;
        })),
        zero: zero(),
        number: calc((function(token, getNextToken, opts) {
          if (null === token) return 0;
          var numberEnd = consumeNumber(token.value, 0);
          return numberEnd === token.value.length || isPostfixIeHack(token.value, numberEnd) ? outOfRange(opts, token.value, numberEnd) ? 0 : 1 : 0;
        })),
        integer: calc((function(token, getNextToken, opts) {
          if (null === token || token.type !== TYPE.Number) return 0;
          for (var i = 43 === token.value.charCodeAt(0) || 45 === token.value.charCodeAt(0) ? 1 : 0; i < token.value.length; i++) if (!isDigit(token.value.charCodeAt(i))) return 0;
          return outOfRange(opts, token.value, i) ? 0 : 1;
        })),
        "-ms-legacy-expression": (name = "expression", name += "(", function(token, getNextToken) {
          return null !== token && eqStr(token.value, name) ? consumeFunction(token, getNextToken) : 0;
        })
      };
    },
    5167: function(module, __unused_webpack_exports, __webpack_require__) {
      var parse = __webpack_require__(7711), MATCH = {
        type: "Match"
      }, MISMATCH = {
        type: "Mismatch"
      }, DISALLOW_EMPTY = {
        type: "DisallowEmpty"
      };
      function createCondition(match, thenBranch, elseBranch) {
        return thenBranch === MATCH && elseBranch === MISMATCH || match === MATCH && thenBranch === MATCH && elseBranch === MATCH ? match : ("If" === match.type && match.else === MISMATCH && thenBranch === MATCH && (thenBranch = match.then, 
        match = match.match), {
          type: "If",
          match: match,
          then: thenBranch,
          else: elseBranch
        });
      }
      function isFunctionType(name) {
        return name.length > 2 && 40 === name.charCodeAt(name.length - 2) && 41 === name.charCodeAt(name.length - 1);
      }
      function isEnumCapatible(term) {
        return "Keyword" === term.type || "AtKeyword" === term.type || "Function" === term.type || "Type" === term.type && isFunctionType(term.name);
      }
      function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
        switch (combinator) {
         case " ":
          for (var result = MATCH, i = terms.length - 1; i >= 0; i--) {
            result = createCondition(term = terms[i], result, MISMATCH);
          }
          return result;

         case "|":
          result = MISMATCH;
          var map = null;
          for (i = terms.length - 1; i >= 0; i--) {
            if (isEnumCapatible(term = terms[i]) && (null === map && i > 0 && isEnumCapatible(terms[i - 1]) && (result = createCondition({
              type: "Enum",
              map: map = Object.create(null)
            }, MATCH, result)), null !== map)) {
              var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
              if (key in map == !1) {
                map[key] = term;
                continue;
              }
            }
            map = null, result = createCondition(term, MATCH, result);
          }
          return result;

         case "&&":
          if (terms.length > 5) return {
            type: "MatchOnce",
            terms: terms,
            all: !0
          };
          for (result = MISMATCH, i = terms.length - 1; i >= 0; i--) {
            var term = terms[i];
            thenClause = terms.length > 1 ? buildGroupMatchGraph(combinator, terms.filter((function(newGroupTerm) {
              return newGroupTerm !== term;
            })), !1) : MATCH, result = createCondition(term, thenClause, result);
          }
          return result;

         case "||":
          if (terms.length > 5) return {
            type: "MatchOnce",
            terms: terms,
            all: !1
          };
          for (result = atLeastOneTermMatched ? MATCH : MISMATCH, i = terms.length - 1; i >= 0; i--) {
            var thenClause;
            term = terms[i];
            thenClause = terms.length > 1 ? buildGroupMatchGraph(combinator, terms.filter((function(newGroupTerm) {
              return newGroupTerm !== term;
            })), !0) : MATCH, result = createCondition(term, thenClause, result);
          }
          return result;
        }
      }
      function buildMatchGraph(node) {
        if ("function" == typeof node) return {
          type: "Generic",
          fn: node
        };
        switch (node.type) {
         case "Group":
          var result = buildGroupMatchGraph(node.combinator, node.terms.map(buildMatchGraph), !1);
          return node.disallowEmpty && (result = createCondition(result, DISALLOW_EMPTY, MISMATCH)), 
          result;

         case "Multiplier":
          return function(node) {
            var result = MATCH, matchTerm = buildMatchGraph(node.term);
            if (0 === node.max) matchTerm = createCondition(matchTerm, DISALLOW_EMPTY, MISMATCH), 
            (result = createCondition(matchTerm, null, MISMATCH)).then = createCondition(MATCH, MATCH, result), 
            node.comma && (result.then.else = createCondition({
              type: "Comma",
              syntax: node
            }, result, MISMATCH)); else for (var i = node.min || 1; i <= node.max; i++) node.comma && result !== MATCH && (result = createCondition({
              type: "Comma",
              syntax: node
            }, result, MISMATCH)), result = createCondition(matchTerm, createCondition(MATCH, MATCH, result), MISMATCH);
            if (0 === node.min) result = createCondition(MATCH, MATCH, result); else for (i = 0; i < node.min - 1; i++) node.comma && result !== MATCH && (result = createCondition({
              type: "Comma",
              syntax: node
            }, result, MISMATCH)), result = createCondition(matchTerm, result, MISMATCH);
            return result;
          }(node);

         case "Type":
         case "Property":
          return {
            type: node.type,
            name: node.name,
            syntax: node
          };

         case "Keyword":
          return {
            type: node.type,
            name: node.name.toLowerCase(),
            syntax: node
          };

         case "AtKeyword":
          return {
            type: node.type,
            name: "@" + node.name.toLowerCase(),
            syntax: node
          };

         case "Function":
          return {
            type: node.type,
            name: node.name.toLowerCase() + "(",
            syntax: node
          };

         case "String":
          return 3 === node.value.length ? {
            type: "Token",
            value: node.value.charAt(1),
            syntax: node
          } : {
            type: node.type,
            value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, "'"),
            syntax: node
          };

         case "Token":
          return {
            type: node.type,
            value: node.value,
            syntax: node
          };

         case "Comma":
          return {
            type: node.type,
            syntax: node
          };

         default:
          throw new Error("Unknown node type:", node.type);
        }
      }
      module.exports = {
        MATCH: MATCH,
        MISMATCH: MISMATCH,
        DISALLOW_EMPTY: DISALLOW_EMPTY,
        buildMatchGraph: function(syntaxTree, ref) {
          return "string" == typeof syntaxTree && (syntaxTree = parse(syntaxTree)), {
            type: "MatchGraph",
            match: buildMatchGraph(syntaxTree),
            syntax: ref || null,
            source: syntaxTree
          };
        }
      };
    },
    4583: function(module, __unused_webpack_exports, __webpack_require__) {
      var hasOwnProperty = Object.prototype.hasOwnProperty, matchGraph = __webpack_require__(5167), MATCH = matchGraph.MATCH, MISMATCH = matchGraph.MISMATCH, DISALLOW_EMPTY = matchGraph.DISALLOW_EMPTY, TYPE = __webpack_require__(3786).TYPE, totalIterationCount = 0;
      function reverseList(list) {
        for (var prev = null, next = null, item = list; null !== item; ) next = item.prev, 
        item.prev = prev, prev = item, item = next;
        return prev;
      }
      function areStringsEqualCaseInsensitive(testStr, referenceStr) {
        if (testStr.length !== referenceStr.length) return !1;
        for (var i = 0; i < testStr.length; i++) {
          var testCode = testStr.charCodeAt(i);
          if (testCode >= 65 && testCode <= 90 && (testCode |= 32), testCode !== referenceStr.charCodeAt(i)) return !1;
        }
        return !0;
      }
      function isCommaContextStart(token) {
        return null === token || (token.type === TYPE.Comma || token.type === TYPE.Function || token.type === TYPE.LeftParenthesis || token.type === TYPE.LeftSquareBracket || token.type === TYPE.LeftCurlyBracket || token.type === TYPE.Delim);
      }
      function isCommaContextEnd(token) {
        return null === token || (token.type === TYPE.RightParenthesis || token.type === TYPE.RightSquareBracket || token.type === TYPE.RightCurlyBracket || token.type === TYPE.Delim);
      }
      function internalMatch(tokens, state, syntaxes) {
        function moveToNextToken() {
          do {
            tokenIndex++, token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
          } while (null !== token && (token.type === TYPE.WhiteSpace || token.type === TYPE.Comment));
        }
        function getNextToken(offset) {
          var nextIndex = tokenIndex + offset;
          return nextIndex < tokens.length ? tokens[nextIndex] : null;
        }
        function stateSnapshotFromSyntax(nextState, prev) {
          return {
            nextState: nextState,
            matchStack: matchStack,
            syntaxStack: syntaxStack,
            thenStack: thenStack,
            tokenIndex: tokenIndex,
            prev: prev
          };
        }
        function pushThenStack(nextState) {
          thenStack = {
            nextState: nextState,
            matchStack: matchStack,
            syntaxStack: syntaxStack,
            prev: thenStack
          };
        }
        function pushElseStack(nextState) {
          elseStack = stateSnapshotFromSyntax(nextState, elseStack);
        }
        function addTokenToMatch() {
          matchStack = {
            type: 1,
            syntax: state.syntax,
            token: token,
            prev: matchStack
          }, moveToNextToken(), syntaxStash = null, tokenIndex > longestMatch && (longestMatch = tokenIndex);
        }
        function closeSyntax() {
          matchStack = 2 === matchStack.type ? matchStack.prev : {
            type: 3,
            syntax: syntaxStack.syntax,
            token: matchStack.token,
            prev: matchStack
          }, syntaxStack = syntaxStack.prev;
        }
        var syntaxStack = null, thenStack = null, elseStack = null, syntaxStash = null, iterationCount = 0, exitReason = null, token = null, tokenIndex = -1, longestMatch = 0, matchStack = {
          type: 0,
          syntax: null,
          token: null,
          prev: null
        };
        for (moveToNextToken(); null === exitReason && ++iterationCount < 15e3; ) switch (state.type) {
         case "Match":
          if (null === thenStack) {
            if (null !== token && (tokenIndex !== tokens.length - 1 || "\\0" !== token.value && "\\9" !== token.value)) {
              state = MISMATCH;
              break;
            }
            exitReason = "Match";
            break;
          }
          if ((state = thenStack.nextState) === DISALLOW_EMPTY) {
            if (thenStack.matchStack === matchStack) {
              state = MISMATCH;
              break;
            }
            state = MATCH;
          }
          for (;thenStack.syntaxStack !== syntaxStack; ) closeSyntax();
          thenStack = thenStack.prev;
          break;

         case "Mismatch":
          if (null !== syntaxStash && !1 !== syntaxStash) (null === elseStack || tokenIndex > elseStack.tokenIndex) && (elseStack = syntaxStash, 
          syntaxStash = !1); else if (null === elseStack) {
            exitReason = "Mismatch";
            break;
          }
          state = elseStack.nextState, thenStack = elseStack.thenStack, syntaxStack = elseStack.syntaxStack, 
          matchStack = elseStack.matchStack, tokenIndex = elseStack.tokenIndex, token = tokenIndex < tokens.length ? tokens[tokenIndex] : null, 
          elseStack = elseStack.prev;
          break;

         case "MatchGraph":
          state = state.match;
          break;

         case "If":
          state.else !== MISMATCH && pushElseStack(state.else), state.then !== MATCH && pushThenStack(state.then), 
          state = state.match;
          break;

         case "MatchOnce":
          state = {
            type: "MatchOnceBuffer",
            syntax: state,
            index: 0,
            mask: 0
          };
          break;

         case "MatchOnceBuffer":
          var terms = state.syntax.terms;
          if (state.index === terms.length) {
            if (0 === state.mask || state.syntax.all) {
              state = MISMATCH;
              break;
            }
            state = MATCH;
            break;
          }
          if (state.mask === (1 << terms.length) - 1) {
            state = MATCH;
            break;
          }
          for (;state.index < terms.length; state.index++) {
            var matchFlag = 1 << state.index;
            if (0 == (state.mask & matchFlag)) {
              pushElseStack(state), pushThenStack({
                type: "AddMatchOnce",
                syntax: state.syntax,
                mask: state.mask | matchFlag
              }), state = terms[state.index++];
              break;
            }
          }
          break;

         case "AddMatchOnce":
          state = {
            type: "MatchOnceBuffer",
            syntax: state.syntax,
            index: 0,
            mask: state.mask
          };
          break;

         case "Enum":
          if (null !== token) if (-1 !== (name = token.value.toLowerCase()).indexOf("\\") && (name = name.replace(/\\[09].*$/, "")), 
          hasOwnProperty.call(state.map, name)) {
            state = state.map[name];
            break;
          }
          state = MISMATCH;
          break;

         case "Generic":
          var opts = null !== syntaxStack ? syntaxStack.opts : null, lastTokenIndex = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));
          if (!isNaN(lastTokenIndex) && lastTokenIndex > tokenIndex) {
            for (;tokenIndex < lastTokenIndex; ) addTokenToMatch();
            state = MATCH;
          } else state = MISMATCH;
          break;

         case "Type":
         case "Property":
          var syntaxDict = "Type" === state.type ? "types" : "properties", dictSyntax = hasOwnProperty.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;
          if (!dictSyntax || !dictSyntax.match) throw new Error("Bad syntax reference: " + ("Type" === state.type ? "<" + state.name + ">" : "<'" + state.name + "'>"));
          if (!1 !== syntaxStash && null !== token && "Type" === state.type) if ("custom-ident" === state.name && token.type === TYPE.Ident || "length" === state.name && "0" === token.value) {
            null === syntaxStash && (syntaxStash = stateSnapshotFromSyntax(state, elseStack)), 
            state = MISMATCH;
            break;
          }
          syntaxStack = {
            syntax: state.syntax,
            opts: state.syntax.opts || null !== syntaxStack && syntaxStack.opts || null,
            prev: syntaxStack
          }, matchStack = {
            type: 2,
            syntax: state.syntax,
            token: matchStack.token,
            prev: matchStack
          }, state = dictSyntax.match;
          break;

         case "Keyword":
          var name = state.name;
          if (null !== token) {
            var keywordName = token.value;
            if (-1 !== keywordName.indexOf("\\") && (keywordName = keywordName.replace(/\\[09].*$/, "")), 
            areStringsEqualCaseInsensitive(keywordName, name)) {
              addTokenToMatch(), state = MATCH;
              break;
            }
          }
          state = MISMATCH;
          break;

         case "AtKeyword":
         case "Function":
          if (null !== token && areStringsEqualCaseInsensitive(token.value, state.name)) {
            addTokenToMatch(), state = MATCH;
            break;
          }
          state = MISMATCH;
          break;

         case "Token":
          if (null !== token && token.value === state.value) {
            addTokenToMatch(), state = MATCH;
            break;
          }
          state = MISMATCH;
          break;

         case "Comma":
          null !== token && token.type === TYPE.Comma ? isCommaContextStart(matchStack.token) ? state = MISMATCH : (addTokenToMatch(), 
          state = isCommaContextEnd(token) ? MISMATCH : MATCH) : state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH : MISMATCH;
          break;

         case "String":
          var string = "";
          for (lastTokenIndex = tokenIndex; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) string += tokens[lastTokenIndex].value;
          if (areStringsEqualCaseInsensitive(string, state.value)) {
            for (;tokenIndex < lastTokenIndex; ) addTokenToMatch();
            state = MATCH;
          } else state = MISMATCH;
          break;

         default:
          throw new Error("Unknown node type: " + state.type);
        }
        switch (totalIterationCount += iterationCount, exitReason) {
         case null:
          console.warn("[csstree-match] BREAK after 15000 iterations"), exitReason = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", 
          matchStack = null;
          break;

         case "Match":
          for (;null !== syntaxStack; ) closeSyntax();
          break;

         default:
          matchStack = null;
        }
        return {
          tokens: tokens,
          reason: exitReason,
          iterations: iterationCount,
          match: matchStack,
          longestMatch: longestMatch
        };
      }
      module.exports = {
        matchAsList: function(tokens, matchGraph, syntaxes) {
          var matchResult = internalMatch(tokens, matchGraph, syntaxes || {});
          if (null !== matchResult.match) {
            var item = reverseList(matchResult.match).prev;
            for (matchResult.match = []; null !== item; ) {
              switch (item.type) {
               case 0:
                break;

               case 2:
               case 3:
                matchResult.match.push({
                  type: item.type,
                  syntax: item.syntax
                });
                break;

               default:
                matchResult.match.push({
                  token: item.token.value,
                  node: item.token.node
                });
              }
              item = item.prev;
            }
          }
          return matchResult;
        },
        matchAsTree: function(tokens, matchGraph, syntaxes) {
          var matchResult = internalMatch(tokens, matchGraph, syntaxes || {});
          if (null === matchResult.match) return matchResult;
          var item = matchResult.match, host = matchResult.match = {
            syntax: matchGraph.syntax || null,
            match: []
          }, hostStack = [ host ];
          for (item = reverseList(item).prev; null !== item; ) {
            switch (item.type) {
             case 2:
              host.match.push(host = {
                syntax: item.syntax,
                match: []
              }), hostStack.push(host);
              break;

             case 3:
              hostStack.pop(), host = hostStack[hostStack.length - 1];
              break;

             default:
              host.match.push({
                syntax: item.syntax || null,
                token: item.token.value,
                node: item.token.node
              });
            }
            item = item.prev;
          }
          return matchResult;
        },
        getTotalIterationCount: function() {
          return totalIterationCount;
        }
      };
    },
    9377: function(module, __unused_webpack_exports, __webpack_require__) {
      var tokenize = __webpack_require__(7093), tokenStream = new (__webpack_require__(2879)), astToTokens = {
        decorator: function(handlers) {
          var curNode = null, prev = {
            len: 0,
            node: null
          }, nodes = [ prev ], buffer = "";
          return {
            children: handlers.children,
            node: function(node) {
              var tmp = curNode;
              curNode = node, handlers.node.call(this, node), curNode = tmp;
            },
            chunk: function(chunk) {
              buffer += chunk, prev.node !== curNode ? nodes.push({
                len: chunk.length,
                node: curNode
              }) : prev.len += chunk.length;
            },
            result: function() {
              return prepareTokens(buffer, nodes);
            }
          };
        }
      };
      function prepareTokens(str, nodes) {
        var tokens = [], nodesOffset = 0, nodesIndex = 0, currentNode = nodes ? nodes[nodesIndex].node : null;
        for (tokenize(str, tokenStream); !tokenStream.eof; ) {
          if (nodes) for (;nodesIndex < nodes.length && nodesOffset + nodes[nodesIndex].len <= tokenStream.tokenStart; ) nodesOffset += nodes[nodesIndex++].len, 
          currentNode = nodes[nodesIndex].node;
          tokens.push({
            type: tokenStream.tokenType,
            value: tokenStream.getTokenValue(),
            index: tokenStream.tokenIndex,
            balance: tokenStream.balance[tokenStream.tokenIndex],
            node: currentNode
          }), tokenStream.next();
        }
        return tokens;
      }
      module.exports = function(value, syntax) {
        return "string" == typeof value ? prepareTokens(value, null) : syntax.generate(value, astToTokens);
      };
    },
    7445: function(module, __unused_webpack_exports, __webpack_require__) {
      var List = __webpack_require__(7467);
      function getFirstMatchNode(matchNode) {
        return "node" in matchNode ? matchNode.node : getFirstMatchNode(matchNode.match[0]);
      }
      function getLastMatchNode(matchNode) {
        return "node" in matchNode ? matchNode.node : getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
      }
      module.exports = {
        matchFragments: function(lexer, ast, match, type, name) {
          var fragments = [];
          return null !== match.matched && function findFragments(matchNode) {
            if (null !== matchNode.syntax && matchNode.syntax.type === type && matchNode.syntax.name === name) {
              var start = getFirstMatchNode(matchNode), end = getLastMatchNode(matchNode);
              lexer.syntax.walk(ast, (function(node, item, list) {
                if (node === start) {
                  var nodes = new List;
                  do {
                    if (nodes.appendData(item.data), item.data === end) break;
                    item = item.next;
                  } while (null !== item);
                  fragments.push({
                    parent: list,
                    nodes: nodes
                  });
                }
              }));
            }
            Array.isArray(matchNode.match) && matchNode.match.forEach(findFragments);
          }(match.matched), fragments;
        }
      };
    },
    5007: function(module, __unused_webpack_exports, __webpack_require__) {
      var List = __webpack_require__(7467), hasOwnProperty = Object.prototype.hasOwnProperty;
      function isValidNumber(value) {
        return "number" == typeof value && isFinite(value) && Math.floor(value) === value && value >= 0;
      }
      function isValidLocation(loc) {
        return Boolean(loc) && isValidNumber(loc.offset) && isValidNumber(loc.line) && isValidNumber(loc.column);
      }
      function createNodeStructureChecker(type, fields) {
        return function(node, warn) {
          if (!node || node.constructor !== Object) return warn(node, "Type of node should be an Object");
          for (var key in node) {
            var valid = !0;
            if (!1 !== hasOwnProperty.call(node, key)) {
              if ("type" === key) node.type !== type && warn(node, "Wrong node type `" + node.type + "`, expected `" + type + "`"); else if ("loc" === key) {
                if (null === node.loc) continue;
                if (node.loc && node.loc.constructor === Object) if ("string" != typeof node.loc.source) key += ".source"; else if (isValidLocation(node.loc.start)) {
                  if (isValidLocation(node.loc.end)) continue;
                  key += ".end";
                } else key += ".start";
                valid = !1;
              } else if (fields.hasOwnProperty(key)) {
                var i = 0;
                for (valid = !1; !valid && i < fields[key].length; i++) {
                  var fieldType = fields[key][i];
                  switch (fieldType) {
                   case String:
                    valid = "string" == typeof node[key];
                    break;

                   case Boolean:
                    valid = "boolean" == typeof node[key];
                    break;

                   case null:
                    valid = null === node[key];
                    break;

                   default:
                    "string" == typeof fieldType ? valid = node[key] && node[key].type === fieldType : Array.isArray(fieldType) && (valid = node[key] instanceof List);
                  }
                }
              } else warn(node, "Unknown field `" + key + "` for " + type + " node type");
              valid || warn(node, "Bad value for `" + type + "." + key + "`");
            }
          }
          for (var key in fields) hasOwnProperty.call(fields, key) && !1 === hasOwnProperty.call(node, key) && warn(node, "Field `" + type + "." + key + "` is missed");
        };
      }
      function processStructure(name, nodeType) {
        var structure = nodeType.structure, fields = {
          type: String,
          loc: !0
        }, docs = {
          type: '"' + name + '"'
        };
        for (var key in structure) if (!1 !== hasOwnProperty.call(structure, key)) {
          for (var docsTypes = [], fieldTypes = fields[key] = Array.isArray(structure[key]) ? structure[key].slice() : [ structure[key] ], i = 0; i < fieldTypes.length; i++) {
            var fieldType = fieldTypes[i];
            if (fieldType === String || fieldType === Boolean) docsTypes.push(fieldType.name); else if (null === fieldType) docsTypes.push("null"); else if ("string" == typeof fieldType) docsTypes.push("<" + fieldType + ">"); else {
              if (!Array.isArray(fieldType)) throw new Error("Wrong value `" + fieldType + "` in `" + name + "." + key + "` structure definition");
              docsTypes.push("List");
            }
          }
          docs[key] = docsTypes.join(" | ");
        }
        return {
          docs: docs,
          check: createNodeStructureChecker(name, fields)
        };
      }
      module.exports = {
        getStructureFromConfig: function(config) {
          var structure = {};
          if (config.node) for (var name in config.node) if (hasOwnProperty.call(config.node, name)) {
            var nodeType = config.node[name];
            if (!nodeType.structure) throw new Error("Missed `structure` field in `" + name + "` node type definition");
            structure[name] = processStructure(name, nodeType);
          }
          return structure;
        }
      };
    },
    2750: function(module) {
      function getTrace(node) {
        function shouldPutToTrace(syntax) {
          return null !== syntax && ("Type" === syntax.type || "Property" === syntax.type || "Keyword" === syntax.type);
        }
        var result = null;
        return null !== this.matched && function hasMatch(matchNode) {
          if (Array.isArray(matchNode.match)) {
            for (var i = 0; i < matchNode.match.length; i++) if (hasMatch(matchNode.match[i])) return shouldPutToTrace(matchNode.syntax) && result.unshift(matchNode.syntax), 
            !0;
          } else if (matchNode.node === node) return result = shouldPutToTrace(matchNode.syntax) ? [ matchNode.syntax ] : [], 
          !0;
          return !1;
        }(this.matched), result;
      }
      function testNode(match, node, fn) {
        var trace = getTrace.call(match, node);
        return null !== trace && trace.some(fn);
      }
      module.exports = {
        getTrace: getTrace,
        isType: function(node, type) {
          return testNode(this, node, (function(matchNode) {
            return "Type" === matchNode.type && matchNode.name === type;
          }));
        },
        isProperty: function(node, property) {
          return testNode(this, node, (function(matchNode) {
            return "Property" === matchNode.type && matchNode.name === property;
          }));
        },
        isKeyword: function(node) {
          return testNode(this, node, (function(matchNode) {
            return "Keyword" === matchNode.type;
          }));
        }
      };
    },
    2055: function(module, __unused_webpack_exports, __webpack_require__) {
      var OffsetToLocation = __webpack_require__(9971), SyntaxError = __webpack_require__(542), TokenStream = __webpack_require__(2879), List = __webpack_require__(7467), tokenize = __webpack_require__(7093), constants = __webpack_require__(3786), findWhiteSpaceStart = __webpack_require__(5951).findWhiteSpaceStart, sequence = __webpack_require__(8987), noop = function() {}, TYPE = constants.TYPE, NAME = constants.NAME, WHITESPACE = TYPE.WhiteSpace, IDENT = TYPE.Ident, FUNCTION = TYPE.Function, URL = TYPE.Url, HASH = TYPE.Hash, PERCENTAGE = TYPE.Percentage, NUMBER = TYPE.Number;
      function createParseContext(name) {
        return function() {
          return this[name]();
        };
      }
      module.exports = function(config) {
        var parser = {
          scanner: new TokenStream,
          locationMap: new OffsetToLocation,
          filename: "<unknown>",
          needPositions: !1,
          onParseError: noop,
          onParseErrorThrow: !1,
          parseAtrulePrelude: !0,
          parseRulePrelude: !0,
          parseValue: !0,
          parseCustomProperty: !1,
          readSequence: sequence,
          createList: function() {
            return new List;
          },
          createSingleNodeList: function(node) {
            return (new List).appendData(node);
          },
          getFirstListNode: function(list) {
            return list && list.first();
          },
          getLastListNode: function(list) {
            return list.last();
          },
          parseWithFallback: function(consumer, fallback) {
            var startToken = this.scanner.tokenIndex;
            try {
              return consumer.call(this);
            } catch (e) {
              if (this.onParseErrorThrow) throw e;
              var fallbackNode = fallback.call(this, startToken);
              return this.onParseErrorThrow = !0, this.onParseError(e, fallbackNode), this.onParseErrorThrow = !1, 
              fallbackNode;
            }
          },
          lookupNonWSType: function(offset) {
            do {
              var type = this.scanner.lookupType(offset++);
              if (type !== WHITESPACE) return type;
            } while (0 !== type);
            return 0;
          },
          eat: function(tokenType) {
            if (this.scanner.tokenType !== tokenType) {
              var offset = this.scanner.tokenStart, message = NAME[tokenType] + " is expected";
              switch (tokenType) {
               case IDENT:
                this.scanner.tokenType === FUNCTION || this.scanner.tokenType === URL ? (offset = this.scanner.tokenEnd - 1, 
                message = "Identifier is expected but function found") : message = "Identifier is expected";
                break;

               case HASH:
                this.scanner.isDelim(35) && (this.scanner.next(), offset++, message = "Name is expected");
                break;

               case PERCENTAGE:
                this.scanner.tokenType === NUMBER && (offset = this.scanner.tokenEnd, message = "Percent sign is expected");
                break;

               default:
                this.scanner.source.charCodeAt(this.scanner.tokenStart) === tokenType && (offset += 1);
              }
              this.error(message, offset);
            }
            this.scanner.next();
          },
          consume: function(tokenType) {
            var value = this.scanner.getTokenValue();
            return this.eat(tokenType), value;
          },
          consumeFunctionName: function() {
            var name = this.scanner.source.substring(this.scanner.tokenStart, this.scanner.tokenEnd - 1);
            return this.eat(FUNCTION), name;
          },
          getLocation: function(start, end) {
            return this.needPositions ? this.locationMap.getLocationRange(start, end, this.filename) : null;
          },
          getLocationFromList: function(list) {
            if (this.needPositions) {
              var head = this.getFirstListNode(list), tail = this.getLastListNode(list);
              return this.locationMap.getLocationRange(null !== head ? head.loc.start.offset - this.locationMap.startOffset : this.scanner.tokenStart, null !== tail ? tail.loc.end.offset - this.locationMap.startOffset : this.scanner.tokenStart, this.filename);
            }
            return null;
          },
          error: function(message, offset) {
            var location = void 0 !== offset && offset < this.scanner.source.length ? this.locationMap.getLocation(offset) : this.scanner.eof ? this.locationMap.getLocation(findWhiteSpaceStart(this.scanner.source, this.scanner.source.length - 1)) : this.locationMap.getLocation(this.scanner.tokenStart);
            throw new SyntaxError(message || "Unexpected input", this.scanner.source, location.offset, location.line, location.column);
          }
        };
        for (var key in config = function(config) {
          var parserConfig = {
            context: {},
            scope: {},
            atrule: {},
            pseudo: {}
          };
          if (config.parseContext) for (var name in config.parseContext) switch (typeof config.parseContext[name]) {
           case "function":
            parserConfig.context[name] = config.parseContext[name];
            break;

           case "string":
            parserConfig.context[name] = createParseContext(config.parseContext[name]);
          }
          if (config.scope) for (var name in config.scope) parserConfig.scope[name] = config.scope[name];
          if (config.atrule) for (var name in config.atrule) {
            var atrule = config.atrule[name];
            atrule.parse && (parserConfig.atrule[name] = atrule.parse);
          }
          if (config.pseudo) for (var name in config.pseudo) {
            var pseudo = config.pseudo[name];
            pseudo.parse && (parserConfig.pseudo[name] = pseudo.parse);
          }
          if (config.node) for (var name in config.node) parserConfig[name] = config.node[name].parse;
          return parserConfig;
        }(config || {})) parser[key] = config[key];
        return function(source, options) {
          var ast, context = (options = options || {}).context || "default";
          if (tokenize(source, parser.scanner), parser.locationMap.setSource(source, options.offset, options.line, options.column), 
          parser.filename = options.filename || "<unknown>", parser.needPositions = Boolean(options.positions), 
          parser.onParseError = "function" == typeof options.onParseError ? options.onParseError : noop, 
          parser.onParseErrorThrow = !1, parser.parseAtrulePrelude = !("parseAtrulePrelude" in options) || Boolean(options.parseAtrulePrelude), 
          parser.parseRulePrelude = !("parseRulePrelude" in options) || Boolean(options.parseRulePrelude), 
          parser.parseValue = !("parseValue" in options) || Boolean(options.parseValue), parser.parseCustomProperty = "parseCustomProperty" in options && Boolean(options.parseCustomProperty), 
          !parser.context.hasOwnProperty(context)) throw new Error("Unknown context `" + context + "`");
          return ast = parser.context[context].call(parser, options), parser.scanner.eof || parser.error(), 
          ast;
        };
      };
    },
    8987: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment;
      module.exports = function(recognizer) {
        var children = this.createList(), child = null, context = {
          recognizer: recognizer,
          space: null,
          ignoreWS: !1,
          ignoreWSAfter: !1
        };
        for (this.scanner.skipSC(); !this.scanner.eof; ) {
          switch (this.scanner.tokenType) {
           case COMMENT:
            this.scanner.next();
            continue;

           case WHITESPACE:
            context.ignoreWS ? this.scanner.next() : context.space = this.WhiteSpace();
            continue;
          }
          if (void 0 === (child = recognizer.getNode.call(this, context))) break;
          null !== context.space && (children.push(context.space), context.space = null), 
          children.push(child), context.ignoreWSAfter ? (context.ignoreWSAfter = !1, context.ignoreWS = !0) : context.ignoreWS = !1;
        }
        return children;
      };
    },
    5123: function(module) {
      module.exports = {
        parse: {
          prelude: null,
          block: function() {
            return this.Block(!0);
          }
        }
      };
    },
    4601: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, STRING = TYPE.String, IDENT = TYPE.Ident, URL = TYPE.Url, FUNCTION = TYPE.Function, LEFTPARENTHESIS = TYPE.LeftParenthesis;
      module.exports = {
        parse: {
          prelude: function() {
            var children = this.createList();
            switch (this.scanner.skipSC(), this.scanner.tokenType) {
             case STRING:
              children.push(this.String());
              break;

             case URL:
             case FUNCTION:
              children.push(this.Url());
              break;

             default:
              this.error("String or url() is expected");
            }
            return this.lookupNonWSType(0) !== IDENT && this.lookupNonWSType(0) !== LEFTPARENTHESIS || (children.push(this.WhiteSpace()), 
            children.push(this.MediaQueryList())), children;
          },
          block: null
        }
      };
    },
    4736: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        "font-face": __webpack_require__(5123),
        import: __webpack_require__(4601),
        media: __webpack_require__(4653),
        page: __webpack_require__(4571),
        supports: __webpack_require__(8021)
      };
    },
    4653: function(module) {
      module.exports = {
        parse: {
          prelude: function() {
            return this.createSingleNodeList(this.MediaQueryList());
          },
          block: function() {
            return this.Block(!1);
          }
        }
      };
    },
    4571: function(module) {
      module.exports = {
        parse: {
          prelude: function() {
            return this.createSingleNodeList(this.SelectorList());
          },
          block: function() {
            return this.Block(!0);
          }
        }
      };
    },
    8021: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment, IDENT = TYPE.Ident, FUNCTION = TYPE.Function, COLON = TYPE.Colon, LEFTPARENTHESIS = TYPE.LeftParenthesis;
      function consumeRaw() {
        return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, !1));
      }
      function parentheses() {
        return this.scanner.skipSC(), this.scanner.tokenType === IDENT && this.lookupNonWSType(1) === COLON ? this.createSingleNodeList(this.Declaration()) : readSequence.call(this);
      }
      function readSequence() {
        var child, children = this.createList(), space = null;
        this.scanner.skipSC();
        scan: for (;!this.scanner.eof; ) {
          switch (this.scanner.tokenType) {
           case WHITESPACE:
            space = this.WhiteSpace();
            continue;

           case COMMENT:
            this.scanner.next();
            continue;

           case FUNCTION:
            child = this.Function(consumeRaw, this.scope.AtrulePrelude);
            break;

           case IDENT:
            child = this.Identifier();
            break;

           case LEFTPARENTHESIS:
            child = this.Parentheses(parentheses, this.scope.AtrulePrelude);
            break;

           default:
            break scan;
          }
          null !== space && (children.push(space), space = null), children.push(child);
        }
        return children;
      }
      module.exports = {
        parse: {
          prelude: function() {
            var children = readSequence.call(this);
            return null === this.getFirstListNode(children) && this.error("Condition is expected"), 
            children;
          },
          block: function() {
            return this.Block(!1);
          }
        }
      };
    },
    8770: function(module, __unused_webpack_exports, __webpack_require__) {
      var data = __webpack_require__(7791);
      module.exports = {
        generic: !0,
        types: data.types,
        atrules: data.atrules,
        properties: data.properties,
        node: __webpack_require__(2723)
      };
    },
    279: function(module) {
      var hasOwnProperty = Object.prototype.hasOwnProperty, shape = {
        generic: !0,
        types: {},
        atrules: {},
        properties: {},
        parseContext: {},
        scope: {},
        atrule: [ "parse" ],
        pseudo: [ "parse" ],
        node: [ "name", "structure", "parse", "generate", "walkContext" ]
      };
      function isObject(value) {
        return value && value.constructor === Object;
      }
      function copy(value) {
        return isObject(value) ? Object.assign({}, value) : value;
      }
      function extend(dest, src) {
        for (var key in src) hasOwnProperty.call(src, key) && (isObject(dest[key]) ? extend(dest[key], copy(src[key])) : dest[key] = copy(src[key]));
      }
      function mix(dest, src, shape) {
        for (var key in shape) if (!1 !== hasOwnProperty.call(shape, key)) if (!0 === shape[key]) key in src && hasOwnProperty.call(src, key) && (dest[key] = copy(src[key])); else if (shape[key]) {
          if (isObject(shape[key])) extend(res = {}, dest[key]), extend(res, src[key]), dest[key] = res; else if (Array.isArray(shape[key])) {
            var res = {}, innerShape = shape[key].reduce((function(s, k) {
              return s[k] = !0, s;
            }), {});
            for (var name in dest[key]) hasOwnProperty.call(dest[key], name) && (res[name] = {}, 
            dest[key] && dest[key][name] && mix(res[name], dest[key][name], innerShape));
            for (var name in src[key]) hasOwnProperty.call(src[key], name) && (res[name] || (res[name] = {}), 
            src[key] && src[key][name] && mix(res[name], src[key][name], innerShape));
            dest[key] = res;
          }
        }
        return dest;
      }
      module.exports = function(dest, src) {
        return mix(dest, src, shape);
      };
    },
    3099: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        parseContext: {
          default: "StyleSheet",
          stylesheet: "StyleSheet",
          atrule: "Atrule",
          atrulePrelude: function(options) {
            return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
          },
          mediaQueryList: "MediaQueryList",
          mediaQuery: "MediaQuery",
          rule: "Rule",
          selectorList: "SelectorList",
          selector: "Selector",
          block: function() {
            return this.Block(!0);
          },
          declarationList: "DeclarationList",
          declaration: "Declaration",
          value: "Value"
        },
        scope: __webpack_require__(7813),
        atrule: __webpack_require__(4736),
        pseudo: __webpack_require__(1246),
        node: __webpack_require__(2723)
      };
    },
    9389: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        node: __webpack_require__(2723)
      };
    },
    187: function(__unused_webpack_module, exports, __webpack_require__) {
      var List = __webpack_require__(7467), SyntaxError = __webpack_require__(542), TokenStream = __webpack_require__(2879), Lexer = __webpack_require__(7801), definitionSyntax = __webpack_require__(171), tokenize = __webpack_require__(7093), createParser = __webpack_require__(2055), createGenerator = __webpack_require__(8975), createConvertor = __webpack_require__(3196), createWalker = __webpack_require__(2131), clone = __webpack_require__(6903), names = __webpack_require__(5993), mix = __webpack_require__(279);
      function createSyntax(config) {
        var parse = createParser(config), walk = createWalker(config), generate = createGenerator(config), convert = createConvertor(walk), syntax = {
          List: List,
          SyntaxError: SyntaxError,
          TokenStream: TokenStream,
          Lexer: Lexer,
          vendorPrefix: names.vendorPrefix,
          keyword: names.keyword,
          property: names.property,
          isCustomProperty: names.isCustomProperty,
          definitionSyntax: definitionSyntax,
          lexer: null,
          createLexer: function(config) {
            return new Lexer(config, syntax, syntax.lexer.structure);
          },
          tokenize: tokenize,
          parse: parse,
          walk: walk,
          generate: generate,
          find: walk.find,
          findLast: walk.findLast,
          findAll: walk.findAll,
          clone: clone,
          fromPlainObject: convert.fromPlainObject,
          toPlainObject: convert.toPlainObject,
          createSyntax: function(config) {
            return createSyntax(mix({}, config));
          },
          fork: function(extension) {
            var base = mix({}, config);
            return createSyntax("function" == typeof extension ? extension(base, Object.assign) : mix(base, extension));
          }
        };
        return syntax.lexer = new Lexer({
          generic: !0,
          types: config.types,
          atrules: config.atrules,
          properties: config.properties,
          node: config.node
        }, syntax), syntax;
      }
      exports.create = function(config) {
        return createSyntax(mix({}, config));
      };
    },
    3699: function(module) {
      module.exports = function() {
        this.scanner.skipSC();
        var children = this.createSingleNodeList(this.IdSelector());
        return this.scanner.skipSC(), children;
      };
    },
    9298: function(module) {
      module.exports = function() {
        return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, !1));
      };
    },
    8082: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, rawMode = __webpack_require__(5389).mode, COMMA = TYPE.Comma;
      module.exports = function() {
        var children = this.createList();
        return this.scanner.skipSC(), children.push(this.Identifier()), this.scanner.skipSC(), 
        this.scanner.tokenType === COMMA && (children.push(this.Operator()), children.push(this.parseCustomProperty ? this.Value(null) : this.Raw(this.scanner.tokenIndex, rawMode.exclamationMarkOrSemicolon, !1))), 
        children;
      };
    },
    2916: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = __webpack_require__(187).create(function() {
        for (var dest = {}, i = 0; i < arguments.length; i++) {
          var src = arguments[i];
          for (var key in src) dest[key] = src[key];
        }
        return dest;
      }(__webpack_require__(8770), __webpack_require__(3099), __webpack_require__(9389)));
    },
    2783: function(module, __unused_webpack_exports, __webpack_require__) {
      var cmpChar = __webpack_require__(7093).cmpChar, isDigit = __webpack_require__(7093).isDigit, TYPE = __webpack_require__(7093).TYPE, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment, IDENT = TYPE.Ident, NUMBER = TYPE.Number, DIMENSION = TYPE.Dimension, N = 110;
      function checkInteger(offset, disallowSign) {
        var pos = this.scanner.tokenStart + offset, code = this.scanner.source.charCodeAt(pos);
        for (43 !== code && 45 !== code || (disallowSign && this.error("Number sign is not allowed"), 
        pos++); pos < this.scanner.tokenEnd; pos++) isDigit(this.scanner.source.charCodeAt(pos)) || this.error("Integer is expected", pos);
      }
      function checkTokenIsInteger(disallowSign) {
        return checkInteger.call(this, 0, disallowSign);
      }
      function expectCharCode(offset, code) {
        if (!cmpChar(this.scanner.source, this.scanner.tokenStart + offset, code)) {
          var msg = "";
          switch (code) {
           case N:
            msg = "N is expected";
            break;

           case 45:
            msg = "HyphenMinus is expected";
          }
          this.error(msg, this.scanner.tokenStart + offset);
        }
      }
      function consumeB() {
        for (var offset = 0, sign = 0, type = this.scanner.tokenType; type === WHITESPACE || type === COMMENT; ) type = this.scanner.lookupType(++offset);
        if (type !== NUMBER) {
          if (!this.scanner.isDelim(43, offset) && !this.scanner.isDelim(45, offset)) return null;
          sign = this.scanner.isDelim(43, offset) ? 43 : 45;
          do {
            type = this.scanner.lookupType(++offset);
          } while (type === WHITESPACE || type === COMMENT);
          type !== NUMBER && (this.scanner.skip(offset), checkTokenIsInteger.call(this, true));
        }
        return offset > 0 && this.scanner.skip(offset), 0 === sign && 43 !== (type = this.scanner.source.charCodeAt(this.scanner.tokenStart)) && 45 !== type && this.error("Number sign is expected"), 
        checkTokenIsInteger.call(this, 0 !== sign), 45 === sign ? "-" + this.consume(NUMBER) : this.consume(NUMBER);
      }
      module.exports = {
        name: "AnPlusB",
        structure: {
          a: [ String, null ],
          b: [ String, null ]
        },
        parse: function() {
          var start = this.scanner.tokenStart, a = null, b = null;
          if (this.scanner.tokenType === NUMBER) checkTokenIsInteger.call(this, false), b = this.consume(NUMBER); else if (this.scanner.tokenType === IDENT && cmpChar(this.scanner.source, this.scanner.tokenStart, 45)) switch (a = "-1", 
          expectCharCode.call(this, 1, N), this.scanner.getTokenLength()) {
           case 2:
            this.scanner.next(), b = consumeB.call(this);
            break;

           case 3:
            expectCharCode.call(this, 2, 45), this.scanner.next(), this.scanner.skipSC(), checkTokenIsInteger.call(this, true), 
            b = "-" + this.consume(NUMBER);
            break;

           default:
            expectCharCode.call(this, 2, 45), checkInteger.call(this, 3, true), this.scanner.next(), 
            b = this.scanner.substrToCursor(start + 2);
          } else if (this.scanner.tokenType === IDENT || this.scanner.isDelim(43) && this.scanner.lookupType(1) === IDENT) {
            var sign = 0;
            switch (a = "1", this.scanner.isDelim(43) && (sign = 1, this.scanner.next()), expectCharCode.call(this, 0, N), 
            this.scanner.getTokenLength()) {
             case 1:
              this.scanner.next(), b = consumeB.call(this);
              break;

             case 2:
              expectCharCode.call(this, 1, 45), this.scanner.next(), this.scanner.skipSC(), checkTokenIsInteger.call(this, true), 
              b = "-" + this.consume(NUMBER);
              break;

             default:
              expectCharCode.call(this, 1, 45), checkInteger.call(this, 2, true), this.scanner.next(), 
              b = this.scanner.substrToCursor(start + sign + 1);
            }
          } else if (this.scanner.tokenType === DIMENSION) {
            for (var code = this.scanner.source.charCodeAt(this.scanner.tokenStart), i = (sign = 43 === code || 45 === code, 
            this.scanner.tokenStart + sign); i < this.scanner.tokenEnd && isDigit(this.scanner.source.charCodeAt(i)); i++) ;
            i === this.scanner.tokenStart + sign && this.error("Integer is expected", this.scanner.tokenStart + sign), 
            expectCharCode.call(this, i - this.scanner.tokenStart, N), a = this.scanner.source.substring(start, i), 
            i + 1 === this.scanner.tokenEnd ? (this.scanner.next(), b = consumeB.call(this)) : (expectCharCode.call(this, i - this.scanner.tokenStart + 1, 45), 
            i + 2 === this.scanner.tokenEnd ? (this.scanner.next(), this.scanner.skipSC(), checkTokenIsInteger.call(this, true), 
            b = "-" + this.consume(NUMBER)) : (checkInteger.call(this, i - this.scanner.tokenStart + 2, true), 
            this.scanner.next(), b = this.scanner.substrToCursor(i + 1)));
          } else this.error();
          return null !== a && 43 === a.charCodeAt(0) && (a = a.substr(1)), null !== b && 43 === b.charCodeAt(0) && (b = b.substr(1)), 
          {
            type: "AnPlusB",
            loc: this.getLocation(start, this.scanner.tokenStart),
            a: a,
            b: b
          };
        },
        generate: function(node) {
          var a = null !== node.a && void 0 !== node.a, b = null !== node.b && void 0 !== node.b;
          a ? (this.chunk("+1" === node.a ? "+n" : "1" === node.a ? "n" : "-1" === node.a ? "-n" : node.a + "n"), 
          b && ("-" === (b = String(node.b)).charAt(0) || "+" === b.charAt(0) ? (this.chunk(b.charAt(0)), 
          this.chunk(b.substr(1))) : (this.chunk("+"), this.chunk(b)))) : this.chunk(String(node.b));
        }
      };
    },
    4690: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, rawMode = __webpack_require__(5389).mode, ATKEYWORD = TYPE.AtKeyword, SEMICOLON = TYPE.Semicolon, LEFTCURLYBRACKET = TYPE.LeftCurlyBracket, RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;
      function consumeRaw(startToken) {
        return this.Raw(startToken, rawMode.leftCurlyBracketOrSemicolon, !0);
      }
      function isDeclarationBlockAtrule() {
        for (var type, offset = 1; type = this.scanner.lookupType(offset); offset++) {
          if (type === RIGHTCURLYBRACKET) return !0;
          if (type === LEFTCURLYBRACKET || type === ATKEYWORD) return !1;
        }
        return !1;
      }
      module.exports = {
        name: "Atrule",
        structure: {
          name: String,
          prelude: [ "AtrulePrelude", "Raw", null ],
          block: [ "Block", null ]
        },
        parse: function() {
          var name, nameLowerCase, start = this.scanner.tokenStart, prelude = null, block = null;
          switch (this.eat(ATKEYWORD), nameLowerCase = (name = this.scanner.substrToCursor(start + 1)).toLowerCase(), 
          this.scanner.skipSC(), !1 === this.scanner.eof && this.scanner.tokenType !== LEFTCURLYBRACKET && this.scanner.tokenType !== SEMICOLON && (this.parseAtrulePrelude ? "AtrulePrelude" === (prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name), consumeRaw)).type && null === prelude.children.head && (prelude = null) : prelude = consumeRaw.call(this, this.scanner.tokenIndex), 
          this.scanner.skipSC()), this.scanner.tokenType) {
           case SEMICOLON:
            this.scanner.next();
            break;

           case LEFTCURLYBRACKET:
            block = this.atrule.hasOwnProperty(nameLowerCase) && "function" == typeof this.atrule[nameLowerCase].block ? this.atrule[nameLowerCase].block.call(this) : this.Block(isDeclarationBlockAtrule.call(this));
          }
          return {
            type: "Atrule",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            prelude: prelude,
            block: block
          };
        },
        generate: function(node) {
          this.chunk("@"), this.chunk(node.name), null !== node.prelude && (this.chunk(" "), 
          this.node(node.prelude)), node.block ? this.node(node.block) : this.chunk(";");
        },
        walkContext: "atrule"
      };
    },
    4081: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, SEMICOLON = TYPE.Semicolon, LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
      module.exports = {
        name: "AtrulePrelude",
        structure: {
          children: [ [] ]
        },
        parse: function(name) {
          var children = null;
          return null !== name && (name = name.toLowerCase()), this.scanner.skipSC(), children = this.atrule.hasOwnProperty(name) && "function" == typeof this.atrule[name].prelude ? this.atrule[name].prelude.call(this) : this.readSequence(this.scope.AtrulePrelude), 
          this.scanner.skipSC(), !0 !== this.scanner.eof && this.scanner.tokenType !== LEFTCURLYBRACKET && this.scanner.tokenType !== SEMICOLON && this.error("Semicolon or block is expected"), 
          null === children && (children = this.createList()), {
            type: "AtrulePrelude",
            loc: this.getLocationFromList(children),
            children: children
          };
        },
        generate: function(node) {
          this.children(node);
        },
        walkContext: "atrulePrelude"
      };
    },
    2087: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, IDENT = TYPE.Ident, STRING = TYPE.String, COLON = TYPE.Colon, LEFTSQUAREBRACKET = TYPE.LeftSquareBracket, RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;
      function getAttributeName() {
        this.scanner.eof && this.error("Unexpected end of input");
        var start = this.scanner.tokenStart, expectIdent = !1, checkColon = !0;
        return this.scanner.isDelim(42) ? (expectIdent = !0, checkColon = !1, this.scanner.next()) : this.scanner.isDelim(124) || this.eat(IDENT), 
        this.scanner.isDelim(124) ? 61 !== this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) ? (this.scanner.next(), 
        this.eat(IDENT)) : expectIdent && this.error("Identifier is expected", this.scanner.tokenEnd) : expectIdent && this.error("Vertical line is expected"), 
        checkColon && this.scanner.tokenType === COLON && (this.scanner.next(), this.eat(IDENT)), 
        {
          type: "Identifier",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name: this.scanner.substrToCursor(start)
        };
      }
      function getOperator() {
        var start = this.scanner.tokenStart, code = this.scanner.source.charCodeAt(start);
        return 61 !== code && 126 !== code && 94 !== code && 36 !== code && 42 !== code && 124 !== code && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), 
        this.scanner.next(), 61 !== code && (this.scanner.isDelim(61) || this.error("Equal sign is expected"), 
        this.scanner.next()), this.scanner.substrToCursor(start);
      }
      module.exports = {
        name: "AttributeSelector",
        structure: {
          name: "Identifier",
          matcher: [ String, null ],
          value: [ "String", "Identifier", null ],
          flags: [ String, null ]
        },
        parse: function() {
          var name, start = this.scanner.tokenStart, matcher = null, value = null, flags = null;
          return this.eat(LEFTSQUAREBRACKET), this.scanner.skipSC(), name = getAttributeName.call(this), 
          this.scanner.skipSC(), this.scanner.tokenType !== RIGHTSQUAREBRACKET && (this.scanner.tokenType !== IDENT && (matcher = getOperator.call(this), 
          this.scanner.skipSC(), value = this.scanner.tokenType === STRING ? this.String() : this.Identifier(), 
          this.scanner.skipSC()), this.scanner.tokenType === IDENT && (flags = this.scanner.getTokenValue(), 
          this.scanner.next(), this.scanner.skipSC())), this.eat(RIGHTSQUAREBRACKET), {
            type: "AttributeSelector",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            matcher: matcher,
            value: value,
            flags: flags
          };
        },
        generate: function(node) {
          var flagsPrefix = " ";
          this.chunk("["), this.node(node.name), null !== node.matcher && (this.chunk(node.matcher), 
          null !== node.value && (this.node(node.value), "String" === node.value.type && (flagsPrefix = ""))), 
          null !== node.flags && (this.chunk(flagsPrefix), this.chunk(node.flags)), this.chunk("]");
        }
      };
    },
    9018: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, rawMode = __webpack_require__(5389).mode, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment, SEMICOLON = TYPE.Semicolon, ATKEYWORD = TYPE.AtKeyword, LEFTCURLYBRACKET = TYPE.LeftCurlyBracket, RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;
      function consumeRaw(startToken) {
        return this.Raw(startToken, null, !0);
      }
      function consumeRule() {
        return this.parseWithFallback(this.Rule, consumeRaw);
      }
      function consumeRawDeclaration(startToken) {
        return this.Raw(startToken, rawMode.semicolonIncluded, !0);
      }
      function consumeDeclaration() {
        if (this.scanner.tokenType === SEMICOLON) return consumeRawDeclaration.call(this, this.scanner.tokenIndex);
        var node = this.parseWithFallback(this.Declaration, consumeRawDeclaration);
        return this.scanner.tokenType === SEMICOLON && this.scanner.next(), node;
      }
      module.exports = {
        name: "Block",
        structure: {
          children: [ [ "Atrule", "Rule", "Declaration" ] ]
        },
        parse: function(isDeclaration) {
          var consumer = isDeclaration ? consumeDeclaration : consumeRule, start = this.scanner.tokenStart, children = this.createList();
          this.eat(LEFTCURLYBRACKET);
          scan: for (;!this.scanner.eof; ) switch (this.scanner.tokenType) {
           case RIGHTCURLYBRACKET:
            break scan;

           case WHITESPACE:
           case COMMENT:
            this.scanner.next();
            break;

           case ATKEYWORD:
            children.push(this.parseWithFallback(this.Atrule, consumeRaw));
            break;

           default:
            children.push(consumer.call(this));
          }
          return this.scanner.eof || this.eat(RIGHTCURLYBRACKET), {
            type: "Block",
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
          };
        },
        generate: function(node) {
          this.chunk("{"), this.children(node, (function(prev) {
            "Declaration" === prev.type && this.chunk(";");
          })), this.chunk("}");
        },
        walkContext: "block"
      };
    },
    6199: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, LEFTSQUAREBRACKET = TYPE.LeftSquareBracket, RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;
      module.exports = {
        name: "Brackets",
        structure: {
          children: [ [] ]
        },
        parse: function(readSequence, recognizer) {
          var children, start = this.scanner.tokenStart;
          return this.eat(LEFTSQUAREBRACKET), children = readSequence.call(this, recognizer), 
          this.scanner.eof || this.eat(RIGHTSQUAREBRACKET), {
            type: "Brackets",
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
          };
        },
        generate: function(node) {
          this.chunk("["), this.children(node), this.chunk("]");
        }
      };
    },
    6376: function(module, __unused_webpack_exports, __webpack_require__) {
      var CDC = __webpack_require__(7093).TYPE.CDC;
      module.exports = {
        name: "CDC",
        structure: [],
        parse: function() {
          var start = this.scanner.tokenStart;
          return this.eat(CDC), {
            type: "CDC",
            loc: this.getLocation(start, this.scanner.tokenStart)
          };
        },
        generate: function() {
          this.chunk("--\x3e");
        }
      };
    },
    9918: function(module, __unused_webpack_exports, __webpack_require__) {
      var CDO = __webpack_require__(7093).TYPE.CDO;
      module.exports = {
        name: "CDO",
        structure: [],
        parse: function() {
          var start = this.scanner.tokenStart;
          return this.eat(CDO), {
            type: "CDO",
            loc: this.getLocation(start, this.scanner.tokenStart)
          };
        },
        generate: function() {
          this.chunk("\x3c!--");
        }
      };
    },
    4258: function(module, __unused_webpack_exports, __webpack_require__) {
      var IDENT = __webpack_require__(7093).TYPE.Ident;
      module.exports = {
        name: "ClassSelector",
        structure: {
          name: String
        },
        parse: function() {
          return this.scanner.isDelim(46) || this.error("Full stop is expected"), this.scanner.next(), 
          {
            type: "ClassSelector",
            loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
            name: this.consume(IDENT)
          };
        },
        generate: function(node) {
          this.chunk("."), this.chunk(node.name);
        }
      };
    },
    4102: function(module, __unused_webpack_exports, __webpack_require__) {
      var IDENT = __webpack_require__(7093).TYPE.Ident;
      module.exports = {
        name: "Combinator",
        structure: {
          name: String
        },
        parse: function() {
          var start = this.scanner.tokenStart;
          switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
           case 62:
           case 43:
           case 126:
            this.scanner.next();
            break;

           case 47:
            this.scanner.next(), this.scanner.tokenType === IDENT && !1 !== this.scanner.lookupValue(0, "deep") || this.error("Identifier `deep` is expected"), 
            this.scanner.next(), this.scanner.isDelim(47) || this.error("Solidus is expected"), 
            this.scanner.next();
            break;

           default:
            this.error("Combinator is expected");
          }
          return {
            type: "Combinator",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start)
          };
        },
        generate: function(node) {
          this.chunk(node.name);
        }
      };
    },
    3104: function(module, __unused_webpack_exports, __webpack_require__) {
      var COMMENT = __webpack_require__(7093).TYPE.Comment;
      module.exports = {
        name: "Comment",
        structure: {
          value: String
        },
        parse: function() {
          var start = this.scanner.tokenStart, end = this.scanner.tokenEnd;
          return this.eat(COMMENT), end - start + 2 >= 2 && 42 === this.scanner.source.charCodeAt(end - 2) && 47 === this.scanner.source.charCodeAt(end - 1) && (end -= 2), 
          {
            type: "Comment",
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start + 2, end)
          };
        },
        generate: function(node) {
          this.chunk("/*"), this.chunk(node.value), this.chunk("*/");
        }
      };
    },
    6897: function(module, __unused_webpack_exports, __webpack_require__) {
      var isCustomProperty = __webpack_require__(5993).isCustomProperty, TYPE = __webpack_require__(7093).TYPE, rawMode = __webpack_require__(5389).mode, IDENT = TYPE.Ident, HASH = TYPE.Hash, COLON = TYPE.Colon, SEMICOLON = TYPE.Semicolon, DELIM = TYPE.Delim;
      function consumeValueRaw(startToken) {
        return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, !0);
      }
      function consumeCustomPropertyRaw(startToken) {
        return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, !1);
      }
      function consumeValue() {
        var startValueToken = this.scanner.tokenIndex, value = this.Value();
        return "Raw" !== value.type && !1 === this.scanner.eof && this.scanner.tokenType !== SEMICOLON && !1 === this.scanner.isDelim(33) && !1 === this.scanner.isBalanceEdge(startValueToken) && this.error(), 
        value;
      }
      function readProperty() {
        var start = this.scanner.tokenStart;
        if (this.scanner.tokenType === DELIM) switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
         case 42:
         case 36:
         case 43:
         case 35:
         case 38:
          this.scanner.next();
          break;

         case 47:
          this.scanner.next(), this.scanner.isDelim(47) && this.scanner.next();
        }
        return this.scanner.tokenType === HASH ? this.eat(HASH) : this.eat(IDENT), this.scanner.substrToCursor(start);
      }
      function getImportant() {
        this.eat(DELIM), this.scanner.skipSC();
        var important = this.consume(IDENT);
        return "important" === important || important;
      }
      module.exports = {
        name: "Declaration",
        structure: {
          important: [ Boolean, String ],
          property: String,
          value: [ "Value", "Raw" ]
        },
        parse: function() {
          var value, start = this.scanner.tokenStart, startToken = this.scanner.tokenIndex, property = readProperty.call(this), customProperty = isCustomProperty(property), parseValue = customProperty ? this.parseCustomProperty : this.parseValue, consumeRaw = customProperty ? consumeCustomPropertyRaw : consumeValueRaw, important = !1;
          return this.scanner.skipSC(), this.eat(COLON), customProperty || this.scanner.skipSC(), 
          value = parseValue ? this.parseWithFallback(consumeValue, consumeRaw) : consumeRaw.call(this, this.scanner.tokenIndex), 
          this.scanner.isDelim(33) && (important = getImportant.call(this), this.scanner.skipSC()), 
          !1 === this.scanner.eof && this.scanner.tokenType !== SEMICOLON && !1 === this.scanner.isBalanceEdge(startToken) && this.error(), 
          {
            type: "Declaration",
            loc: this.getLocation(start, this.scanner.tokenStart),
            important: important,
            property: property,
            value: value
          };
        },
        generate: function(node) {
          this.chunk(node.property), this.chunk(":"), this.node(node.value), node.important && this.chunk(!0 === node.important ? "!important" : "!" + node.important);
        },
        walkContext: "declaration"
      };
    },
    3745: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, rawMode = __webpack_require__(5389).mode, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment, SEMICOLON = TYPE.Semicolon;
      function consumeRaw(startToken) {
        return this.Raw(startToken, rawMode.semicolonIncluded, !0);
      }
      module.exports = {
        name: "DeclarationList",
        structure: {
          children: [ [ "Declaration" ] ]
        },
        parse: function() {
          for (var children = this.createList(); !this.scanner.eof; ) switch (this.scanner.tokenType) {
           case WHITESPACE:
           case COMMENT:
           case SEMICOLON:
            this.scanner.next();
            break;

           default:
            children.push(this.parseWithFallback(this.Declaration, consumeRaw));
          }
          return {
            type: "DeclarationList",
            loc: this.getLocationFromList(children),
            children: children
          };
        },
        generate: function(node) {
          this.children(node, (function(prev) {
            "Declaration" === prev.type && this.chunk(";");
          }));
        }
      };
    },
    4002: function(module, __unused_webpack_exports, __webpack_require__) {
      var consumeNumber = __webpack_require__(5951).consumeNumber, DIMENSION = __webpack_require__(7093).TYPE.Dimension;
      module.exports = {
        name: "Dimension",
        structure: {
          value: String,
          unit: String
        },
        parse: function() {
          var start = this.scanner.tokenStart, numberEnd = consumeNumber(this.scanner.source, start);
          return this.eat(DIMENSION), {
            type: "Dimension",
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start, numberEnd),
            unit: this.scanner.source.substring(numberEnd, this.scanner.tokenStart)
          };
        },
        generate: function(node) {
          this.chunk(node.value), this.chunk(node.unit);
        }
      };
    },
    4588: function(module, __unused_webpack_exports, __webpack_require__) {
      var RIGHTPARENTHESIS = __webpack_require__(7093).TYPE.RightParenthesis;
      module.exports = {
        name: "Function",
        structure: {
          name: String,
          children: [ [] ]
        },
        parse: function(readSequence, recognizer) {
          var children, start = this.scanner.tokenStart, name = this.consumeFunctionName(), nameLowerCase = name.toLowerCase();
          return children = recognizer.hasOwnProperty(nameLowerCase) ? recognizer[nameLowerCase].call(this, recognizer) : readSequence.call(this, recognizer), 
          this.scanner.eof || this.eat(RIGHTPARENTHESIS), {
            type: "Function",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
          };
        },
        generate: function(node) {
          this.chunk(node.name), this.chunk("("), this.children(node), this.chunk(")");
        },
        walkContext: "function"
      };
    },
    8739: function(module, __unused_webpack_exports, __webpack_require__) {
      var HASH = __webpack_require__(7093).TYPE.Hash;
      module.exports = {
        name: "HexColor",
        structure: {
          value: String
        },
        parse: function() {
          var start = this.scanner.tokenStart;
          return this.eat(HASH), {
            type: "HexColor",
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start + 1)
          };
        },
        generate: function(node) {
          this.chunk("#"), this.chunk(node.value);
        }
      };
    },
    3628: function(module, __unused_webpack_exports, __webpack_require__) {
      var HASH = __webpack_require__(7093).TYPE.Hash;
      module.exports = {
        name: "IdSelector",
        structure: {
          name: String
        },
        parse: function() {
          var start = this.scanner.tokenStart;
          return this.eat(HASH), {
            type: "IdSelector",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start + 1)
          };
        },
        generate: function(node) {
          this.chunk("#"), this.chunk(node.name);
        }
      };
    },
    9686: function(module, __unused_webpack_exports, __webpack_require__) {
      var IDENT = __webpack_require__(7093).TYPE.Ident;
      module.exports = {
        name: "Identifier",
        structure: {
          name: String
        },
        parse: function() {
          return {
            type: "Identifier",
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            name: this.consume(IDENT)
          };
        },
        generate: function(node) {
          this.chunk(node.name);
        }
      };
    },
    7363: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, IDENT = TYPE.Ident, NUMBER = TYPE.Number, DIMENSION = TYPE.Dimension, LEFTPARENTHESIS = TYPE.LeftParenthesis, RIGHTPARENTHESIS = TYPE.RightParenthesis, COLON = TYPE.Colon, DELIM = TYPE.Delim;
      module.exports = {
        name: "MediaFeature",
        structure: {
          name: String,
          value: [ "Identifier", "Number", "Dimension", "Ratio", null ]
        },
        parse: function() {
          var name, start = this.scanner.tokenStart, value = null;
          if (this.eat(LEFTPARENTHESIS), this.scanner.skipSC(), name = this.consume(IDENT), 
          this.scanner.skipSC(), this.scanner.tokenType !== RIGHTPARENTHESIS) {
            switch (this.eat(COLON), this.scanner.skipSC(), this.scanner.tokenType) {
             case NUMBER:
              value = this.lookupNonWSType(1) === DELIM ? this.Ratio() : this.Number();
              break;

             case DIMENSION:
              value = this.Dimension();
              break;

             case IDENT:
              value = this.Identifier();
              break;

             default:
              this.error("Number, dimension, ratio or identifier is expected");
            }
            this.scanner.skipSC();
          }
          return this.eat(RIGHTPARENTHESIS), {
            type: "MediaFeature",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            value: value
          };
        },
        generate: function(node) {
          this.chunk("("), this.chunk(node.name), null !== node.value && (this.chunk(":"), 
          this.node(node.value)), this.chunk(")");
        }
      };
    },
    1140: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment, IDENT = TYPE.Ident, LEFTPARENTHESIS = TYPE.LeftParenthesis;
      module.exports = {
        name: "MediaQuery",
        structure: {
          children: [ [ "Identifier", "MediaFeature", "WhiteSpace" ] ]
        },
        parse: function() {
          this.scanner.skipSC();
          var children = this.createList(), child = null, space = null;
          scan: for (;!this.scanner.eof; ) {
            switch (this.scanner.tokenType) {
             case COMMENT:
              this.scanner.next();
              continue;

             case WHITESPACE:
              space = this.WhiteSpace();
              continue;

             case IDENT:
              child = this.Identifier();
              break;

             case LEFTPARENTHESIS:
              child = this.MediaFeature();
              break;

             default:
              break scan;
            }
            null !== space && (children.push(space), space = null), children.push(child);
          }
          return null === child && this.error("Identifier or parenthesis is expected"), {
            type: "MediaQuery",
            loc: this.getLocationFromList(children),
            children: children
          };
        },
        generate: function(node) {
          this.children(node);
        }
      };
    },
    6705: function(module, __unused_webpack_exports, __webpack_require__) {
      var COMMA = __webpack_require__(7093).TYPE.Comma;
      module.exports = {
        name: "MediaQueryList",
        structure: {
          children: [ [ "MediaQuery" ] ]
        },
        parse: function(relative) {
          var children = this.createList();
          for (this.scanner.skipSC(); !this.scanner.eof && (children.push(this.MediaQuery(relative)), 
          this.scanner.tokenType === COMMA); ) this.scanner.next();
          return {
            type: "MediaQueryList",
            loc: this.getLocationFromList(children),
            children: children
          };
        },
        generate: function(node) {
          this.children(node, (function() {
            this.chunk(",");
          }));
        }
      };
    },
    4014: function(module) {
      module.exports = {
        name: "Nth",
        structure: {
          nth: [ "AnPlusB", "Identifier" ],
          selector: [ "SelectorList", null ]
        },
        parse: function(allowOfClause) {
          this.scanner.skipSC();
          var query, start = this.scanner.tokenStart, end = start, selector = null;
          return query = this.scanner.lookupValue(0, "odd") || this.scanner.lookupValue(0, "even") ? this.Identifier() : this.AnPlusB(), 
          this.scanner.skipSC(), allowOfClause && this.scanner.lookupValue(0, "of") ? (this.scanner.next(), 
          selector = this.SelectorList(), this.needPositions && (end = this.getLastListNode(selector.children).loc.end.offset)) : this.needPositions && (end = query.loc.end.offset), 
          {
            type: "Nth",
            loc: this.getLocation(start, end),
            nth: query,
            selector: selector
          };
        },
        generate: function(node) {
          this.node(node.nth), null !== node.selector && (this.chunk(" of "), this.node(node.selector));
        }
      };
    },
    2985: function(module, __unused_webpack_exports, __webpack_require__) {
      var NUMBER = __webpack_require__(7093).TYPE.Number;
      module.exports = {
        name: "Number",
        structure: {
          value: String
        },
        parse: function() {
          return {
            type: "Number",
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            value: this.consume(NUMBER)
          };
        },
        generate: function(node) {
          this.chunk(node.value);
        }
      };
    },
    3393: function(module) {
      module.exports = {
        name: "Operator",
        structure: {
          value: String
        },
        parse: function() {
          var start = this.scanner.tokenStart;
          return this.scanner.next(), {
            type: "Operator",
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start)
          };
        },
        generate: function(node) {
          this.chunk(node.value);
        }
      };
    },
    8044: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, LEFTPARENTHESIS = TYPE.LeftParenthesis, RIGHTPARENTHESIS = TYPE.RightParenthesis;
      module.exports = {
        name: "Parentheses",
        structure: {
          children: [ [] ]
        },
        parse: function(readSequence, recognizer) {
          var children, start = this.scanner.tokenStart;
          return this.eat(LEFTPARENTHESIS), children = readSequence.call(this, recognizer), 
          this.scanner.eof || this.eat(RIGHTPARENTHESIS), {
            type: "Parentheses",
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
          };
        },
        generate: function(node) {
          this.chunk("("), this.children(node), this.chunk(")");
        }
      };
    },
    5253: function(module, __unused_webpack_exports, __webpack_require__) {
      var consumeNumber = __webpack_require__(5951).consumeNumber, PERCENTAGE = __webpack_require__(7093).TYPE.Percentage;
      module.exports = {
        name: "Percentage",
        structure: {
          value: String
        },
        parse: function() {
          var start = this.scanner.tokenStart, numberEnd = consumeNumber(this.scanner.source, start);
          return this.eat(PERCENTAGE), {
            type: "Percentage",
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start, numberEnd)
          };
        },
        generate: function(node) {
          this.chunk(node.value), this.chunk("%");
        }
      };
    },
    5527: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, IDENT = TYPE.Ident, FUNCTION = TYPE.Function, COLON = TYPE.Colon, RIGHTPARENTHESIS = TYPE.RightParenthesis;
      module.exports = {
        name: "PseudoClassSelector",
        structure: {
          name: String,
          children: [ [ "Raw" ], null ]
        },
        parse: function() {
          var name, nameLowerCase, start = this.scanner.tokenStart, children = null;
          return this.eat(COLON), this.scanner.tokenType === FUNCTION ? (nameLowerCase = (name = this.consumeFunctionName()).toLowerCase(), 
          this.pseudo.hasOwnProperty(nameLowerCase) ? (this.scanner.skipSC(), children = this.pseudo[nameLowerCase].call(this), 
          this.scanner.skipSC()) : (children = this.createList()).push(this.Raw(this.scanner.tokenIndex, null, !1)), 
          this.eat(RIGHTPARENTHESIS)) : name = this.consume(IDENT), {
            type: "PseudoClassSelector",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
          };
        },
        generate: function(node) {
          this.chunk(":"), this.chunk(node.name), null !== node.children && (this.chunk("("), 
          this.children(node), this.chunk(")"));
        },
        walkContext: "function"
      };
    },
    7359: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, IDENT = TYPE.Ident, FUNCTION = TYPE.Function, COLON = TYPE.Colon, RIGHTPARENTHESIS = TYPE.RightParenthesis;
      module.exports = {
        name: "PseudoElementSelector",
        structure: {
          name: String,
          children: [ [ "Raw" ], null ]
        },
        parse: function() {
          var name, nameLowerCase, start = this.scanner.tokenStart, children = null;
          return this.eat(COLON), this.eat(COLON), this.scanner.tokenType === FUNCTION ? (nameLowerCase = (name = this.consumeFunctionName()).toLowerCase(), 
          this.pseudo.hasOwnProperty(nameLowerCase) ? (this.scanner.skipSC(), children = this.pseudo[nameLowerCase].call(this), 
          this.scanner.skipSC()) : (children = this.createList()).push(this.Raw(this.scanner.tokenIndex, null, !1)), 
          this.eat(RIGHTPARENTHESIS)) : name = this.consume(IDENT), {
            type: "PseudoElementSelector",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
          };
        },
        generate: function(node) {
          this.chunk("::"), this.chunk(node.name), null !== node.children && (this.chunk("("), 
          this.children(node), this.chunk(")"));
        },
        walkContext: "function"
      };
    },
    2294: function(module, __unused_webpack_exports, __webpack_require__) {
      var isDigit = __webpack_require__(7093).isDigit, TYPE = __webpack_require__(7093).TYPE, NUMBER = TYPE.Number, DELIM = TYPE.Delim;
      function consumeNumber() {
        this.scanner.skipWS();
        for (var value = this.consume(NUMBER), i = 0; i < value.length; i++) {
          var code = value.charCodeAt(i);
          isDigit(code) || 46 === code || this.error("Unsigned number is expected", this.scanner.tokenStart - value.length + i);
        }
        return 0 === Number(value) && this.error("Zero number is not allowed", this.scanner.tokenStart - value.length), 
        value;
      }
      module.exports = {
        name: "Ratio",
        structure: {
          left: String,
          right: String
        },
        parse: function() {
          var right, start = this.scanner.tokenStart, left = consumeNumber.call(this);
          return this.scanner.skipWS(), this.scanner.isDelim(47) || this.error("Solidus is expected"), 
          this.eat(DELIM), right = consumeNumber.call(this), {
            type: "Ratio",
            loc: this.getLocation(start, this.scanner.tokenStart),
            left: left,
            right: right
          };
        },
        generate: function(node) {
          this.chunk(node.left), this.chunk("/"), this.chunk(node.right);
        }
      };
    },
    5389: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, WhiteSpace = TYPE.WhiteSpace, Semicolon = TYPE.Semicolon, LeftCurlyBracket = TYPE.LeftCurlyBracket, Delim = TYPE.Delim;
      function getOffsetExcludeWS() {
        return this.scanner.tokenIndex > 0 && this.scanner.lookupType(-1) === WhiteSpace ? this.scanner.tokenIndex > 1 ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1) : this.scanner.firstCharOffset : this.scanner.tokenStart;
      }
      function balanceEnd() {
        return 0;
      }
      module.exports = {
        name: "Raw",
        structure: {
          value: String
        },
        parse: function(startToken, mode, excludeWhiteSpace) {
          var endOffset, startOffset = this.scanner.getTokenStart(startToken);
          return this.scanner.skip(this.scanner.getRawLength(startToken, mode || balanceEnd)), 
          endOffset = excludeWhiteSpace && this.scanner.tokenStart > startOffset ? getOffsetExcludeWS.call(this) : this.scanner.tokenStart, 
          {
            type: "Raw",
            loc: this.getLocation(startOffset, endOffset),
            value: this.scanner.source.substring(startOffset, endOffset)
          };
        },
        generate: function(node) {
          this.chunk(node.value);
        },
        mode: {
          default: balanceEnd,
          leftCurlyBracket: function(tokenType) {
            return tokenType === LeftCurlyBracket ? 1 : 0;
          },
          leftCurlyBracketOrSemicolon: function(tokenType) {
            return tokenType === LeftCurlyBracket || tokenType === Semicolon ? 1 : 0;
          },
          exclamationMarkOrSemicolon: function(tokenType, source, offset) {
            return tokenType === Delim && 33 === source.charCodeAt(offset) || tokenType === Semicolon ? 1 : 0;
          },
          semicolonIncluded: function(tokenType) {
            return tokenType === Semicolon ? 2 : 0;
          }
        }
      };
    },
    3416: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, rawMode = __webpack_require__(5389).mode, LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
      function consumeRaw(startToken) {
        return this.Raw(startToken, rawMode.leftCurlyBracket, !0);
      }
      function consumePrelude() {
        var prelude = this.SelectorList();
        return "Raw" !== prelude.type && !1 === this.scanner.eof && this.scanner.tokenType !== LEFTCURLYBRACKET && this.error(), 
        prelude;
      }
      module.exports = {
        name: "Rule",
        structure: {
          prelude: [ "SelectorList", "Raw" ],
          block: [ "Block" ]
        },
        parse: function() {
          var prelude, block, startToken = this.scanner.tokenIndex, startOffset = this.scanner.tokenStart;
          return prelude = this.parseRulePrelude ? this.parseWithFallback(consumePrelude, consumeRaw) : consumeRaw.call(this, startToken), 
          block = this.Block(!0), {
            type: "Rule",
            loc: this.getLocation(startOffset, this.scanner.tokenStart),
            prelude: prelude,
            block: block
          };
        },
        generate: function(node) {
          this.node(node.prelude), this.node(node.block);
        },
        walkContext: "rule"
      };
    },
    3198: function(module) {
      module.exports = {
        name: "Selector",
        structure: {
          children: [ [ "TypeSelector", "IdSelector", "ClassSelector", "AttributeSelector", "PseudoClassSelector", "PseudoElementSelector", "Combinator", "WhiteSpace" ] ]
        },
        parse: function() {
          var children = this.readSequence(this.scope.Selector);
          return null === this.getFirstListNode(children) && this.error("Selector is expected"), 
          {
            type: "Selector",
            loc: this.getLocationFromList(children),
            children: children
          };
        },
        generate: function(node) {
          this.children(node);
        }
      };
    },
    5310: function(module, __unused_webpack_exports, __webpack_require__) {
      var COMMA = __webpack_require__(7093).TYPE.Comma;
      module.exports = {
        name: "SelectorList",
        structure: {
          children: [ [ "Selector", "Raw" ] ]
        },
        parse: function() {
          for (var children = this.createList(); !this.scanner.eof && (children.push(this.Selector()), 
          this.scanner.tokenType === COMMA); ) this.scanner.next();
          return {
            type: "SelectorList",
            loc: this.getLocationFromList(children),
            children: children
          };
        },
        generate: function(node) {
          this.children(node, (function() {
            this.chunk(",");
          }));
        },
        walkContext: "selector"
      };
    },
    6218: function(module, __unused_webpack_exports, __webpack_require__) {
      var STRING = __webpack_require__(7093).TYPE.String;
      module.exports = {
        name: "String",
        structure: {
          value: String
        },
        parse: function() {
          return {
            type: "String",
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            value: this.consume(STRING)
          };
        },
        generate: function(node) {
          this.chunk(node.value);
        }
      };
    },
    6829: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, WHITESPACE = TYPE.WhiteSpace, COMMENT = TYPE.Comment, ATKEYWORD = TYPE.AtKeyword, CDO = TYPE.CDO, CDC = TYPE.CDC;
      function consumeRaw(startToken) {
        return this.Raw(startToken, null, !1);
      }
      module.exports = {
        name: "StyleSheet",
        structure: {
          children: [ [ "Comment", "CDO", "CDC", "Atrule", "Rule", "Raw" ] ]
        },
        parse: function() {
          for (var child, start = this.scanner.tokenStart, children = this.createList(); !this.scanner.eof; ) {
            switch (this.scanner.tokenType) {
             case WHITESPACE:
              this.scanner.next();
              continue;

             case COMMENT:
              if (33 !== this.scanner.source.charCodeAt(this.scanner.tokenStart + 2)) {
                this.scanner.next();
                continue;
              }
              child = this.Comment();
              break;

             case CDO:
              child = this.CDO();
              break;

             case CDC:
              child = this.CDC();
              break;

             case ATKEYWORD:
              child = this.parseWithFallback(this.Atrule, consumeRaw);
              break;

             default:
              child = this.parseWithFallback(this.Rule, consumeRaw);
            }
            children.push(child);
          }
          return {
            type: "StyleSheet",
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
          };
        },
        generate: function(node) {
          this.children(node);
        },
        walkContext: "stylesheet"
      };
    },
    8517: function(module, __unused_webpack_exports, __webpack_require__) {
      var IDENT = __webpack_require__(7093).TYPE.Ident;
      function eatIdentifierOrAsterisk() {
        this.scanner.tokenType !== IDENT && !1 === this.scanner.isDelim(42) && this.error("Identifier or asterisk is expected"), 
        this.scanner.next();
      }
      module.exports = {
        name: "TypeSelector",
        structure: {
          name: String
        },
        parse: function() {
          var start = this.scanner.tokenStart;
          return this.scanner.isDelim(124) ? (this.scanner.next(), eatIdentifierOrAsterisk.call(this)) : (eatIdentifierOrAsterisk.call(this), 
          this.scanner.isDelim(124) && (this.scanner.next(), eatIdentifierOrAsterisk.call(this))), 
          {
            type: "TypeSelector",
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start)
          };
        },
        generate: function(node) {
          this.chunk(node.name);
        }
      };
    },
    2545: function(module, __unused_webpack_exports, __webpack_require__) {
      var isHexDigit = __webpack_require__(7093).isHexDigit, cmpChar = __webpack_require__(7093).cmpChar, TYPE = __webpack_require__(7093).TYPE, NAME = __webpack_require__(7093).NAME, IDENT = TYPE.Ident, NUMBER = TYPE.Number, DIMENSION = TYPE.Dimension;
      function eatHexSequence(offset, allowDash) {
        for (var pos = this.scanner.tokenStart + offset, len = 0; pos < this.scanner.tokenEnd; pos++) {
          var code = this.scanner.source.charCodeAt(pos);
          if (45 === code && allowDash && 0 !== len) return 0 === eatHexSequence.call(this, offset + len + 1, !1) && this.error(), 
          -1;
          isHexDigit(code) || this.error(allowDash && 0 !== len ? "HyphenMinus" + (len < 6 ? " or hex digit" : "") + " is expected" : len < 6 ? "Hex digit is expected" : "Unexpected input", pos), 
          ++len > 6 && this.error("Too many hex digits", pos);
        }
        return this.scanner.next(), len;
      }
      function eatQuestionMarkSequence(max) {
        for (var count = 0; this.scanner.isDelim(63); ) ++count > max && this.error("Too many question marks"), 
        this.scanner.next();
      }
      function startsWith(code) {
        this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code && this.error(NAME[code] + " is expected");
      }
      function scanUnicodeRange() {
        var hexLength = 0;
        return this.scanner.isDelim(43) ? (this.scanner.next(), this.scanner.tokenType === IDENT ? void ((hexLength = eatHexSequence.call(this, 0, !0)) > 0 && eatQuestionMarkSequence.call(this, 6 - hexLength)) : this.scanner.isDelim(63) ? (this.scanner.next(), 
        void eatQuestionMarkSequence.call(this, 5)) : void this.error("Hex digit or question mark is expected")) : this.scanner.tokenType === NUMBER ? (startsWith.call(this, 43), 
        hexLength = eatHexSequence.call(this, 1, !0), this.scanner.isDelim(63) ? void eatQuestionMarkSequence.call(this, 6 - hexLength) : this.scanner.tokenType === DIMENSION || this.scanner.tokenType === NUMBER ? (startsWith.call(this, 45), 
        void eatHexSequence.call(this, 1, !1)) : void 0) : this.scanner.tokenType === DIMENSION ? (startsWith.call(this, 43), 
        void ((hexLength = eatHexSequence.call(this, 1, !0)) > 0 && eatQuestionMarkSequence.call(this, 6 - hexLength))) : void this.error();
      }
      module.exports = {
        name: "UnicodeRange",
        structure: {
          value: String
        },
        parse: function() {
          var start = this.scanner.tokenStart;
          return cmpChar(this.scanner.source, start, 117) || this.error("U is expected"), 
          cmpChar(this.scanner.source, start + 1, 43) || this.error("Plus sign is expected"), 
          this.scanner.next(), scanUnicodeRange.call(this), {
            type: "UnicodeRange",
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start)
          };
        },
        generate: function(node) {
          this.chunk(node.value);
        }
      };
    },
    6139: function(module, __unused_webpack_exports, __webpack_require__) {
      var isWhiteSpace = __webpack_require__(7093).isWhiteSpace, cmpStr = __webpack_require__(7093).cmpStr, TYPE = __webpack_require__(7093).TYPE, FUNCTION = TYPE.Function, URL = TYPE.Url, RIGHTPARENTHESIS = TYPE.RightParenthesis;
      module.exports = {
        name: "Url",
        structure: {
          value: [ "String", "Raw" ]
        },
        parse: function() {
          var value, start = this.scanner.tokenStart;
          switch (this.scanner.tokenType) {
           case URL:
            for (var rawStart = start + 4, rawEnd = this.scanner.tokenEnd - 1; rawStart < rawEnd && isWhiteSpace(this.scanner.source.charCodeAt(rawStart)); ) rawStart++;
            for (;rawStart < rawEnd && isWhiteSpace(this.scanner.source.charCodeAt(rawEnd - 1)); ) rawEnd--;
            value = {
              type: "Raw",
              loc: this.getLocation(rawStart, rawEnd),
              value: this.scanner.source.substring(rawStart, rawEnd)
            }, this.eat(URL);
            break;

           case FUNCTION:
            cmpStr(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") || this.error("Function name must be `url`"), 
            this.eat(FUNCTION), this.scanner.skipSC(), value = this.String(), this.scanner.skipSC(), 
            this.eat(RIGHTPARENTHESIS);
            break;

           default:
            this.error("Url or Function is expected");
          }
          return {
            type: "Url",
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: value
          };
        },
        generate: function(node) {
          this.chunk("url"), this.chunk("("), this.node(node.value), this.chunk(")");
        }
      };
    },
    9589: function(module) {
      module.exports = {
        name: "Value",
        structure: {
          children: [ [] ]
        },
        parse: function() {
          var start = this.scanner.tokenStart, children = this.readSequence(this.scope.Value);
          return {
            type: "Value",
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
          };
        },
        generate: function(node) {
          this.children(node);
        }
      };
    },
    9334: function(module, __unused_webpack_exports, __webpack_require__) {
      var WHITESPACE = __webpack_require__(7093).TYPE.WhiteSpace, SPACE = Object.freeze({
        type: "WhiteSpace",
        loc: null,
        value: " "
      });
      module.exports = {
        name: "WhiteSpace",
        structure: {
          value: String
        },
        parse: function() {
          return this.eat(WHITESPACE), SPACE;
        },
        generate: function(node) {
          this.chunk(node.value);
        }
      };
    },
    2723: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        AnPlusB: __webpack_require__(2783),
        Atrule: __webpack_require__(4690),
        AtrulePrelude: __webpack_require__(4081),
        AttributeSelector: __webpack_require__(2087),
        Block: __webpack_require__(9018),
        Brackets: __webpack_require__(6199),
        CDC: __webpack_require__(6376),
        CDO: __webpack_require__(9918),
        ClassSelector: __webpack_require__(4258),
        Combinator: __webpack_require__(4102),
        Comment: __webpack_require__(3104),
        Declaration: __webpack_require__(6897),
        DeclarationList: __webpack_require__(3745),
        Dimension: __webpack_require__(4002),
        Function: __webpack_require__(4588),
        HexColor: __webpack_require__(8739),
        Identifier: __webpack_require__(9686),
        IdSelector: __webpack_require__(3628),
        MediaFeature: __webpack_require__(7363),
        MediaQuery: __webpack_require__(1140),
        MediaQueryList: __webpack_require__(6705),
        Nth: __webpack_require__(4014),
        Number: __webpack_require__(2985),
        Operator: __webpack_require__(3393),
        Parentheses: __webpack_require__(8044),
        Percentage: __webpack_require__(5253),
        PseudoClassSelector: __webpack_require__(5527),
        PseudoElementSelector: __webpack_require__(7359),
        Ratio: __webpack_require__(2294),
        Raw: __webpack_require__(5389),
        Rule: __webpack_require__(3416),
        Selector: __webpack_require__(3198),
        SelectorList: __webpack_require__(5310),
        String: __webpack_require__(6218),
        StyleSheet: __webpack_require__(6829),
        TypeSelector: __webpack_require__(8517),
        UnicodeRange: __webpack_require__(2545),
        Url: __webpack_require__(6139),
        Value: __webpack_require__(9589),
        WhiteSpace: __webpack_require__(9334)
      };
    },
    9879: function(module) {
      module.exports = {
        parse: function() {
          return this.createSingleNodeList(this.Nth(false));
        }
      };
    },
    6991: function(module) {
      module.exports = {
        parse: function() {
          return this.createSingleNodeList(this.Nth(true));
        }
      };
    },
    7157: function(module) {
      module.exports = {
        parse: function() {
          return this.createSingleNodeList(this.SelectorList());
        }
      };
    },
    3109: function(module) {
      module.exports = {
        parse: function() {
          return this.createSingleNodeList(this.Identifier());
        }
      };
    },
    5003: function(module) {
      module.exports = {
        parse: function() {
          return this.createSingleNodeList(this.SelectorList());
        }
      };
    },
    1246: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        dir: __webpack_require__(3109),
        has: __webpack_require__(5003),
        lang: __webpack_require__(7385),
        matches: __webpack_require__(3221),
        not: __webpack_require__(1681),
        "nth-child": __webpack_require__(8492),
        "nth-last-child": __webpack_require__(6512),
        "nth-last-of-type": __webpack_require__(9869),
        "nth-of-type": __webpack_require__(3756),
        slotted: __webpack_require__(2139)
      };
    },
    7385: function(module) {
      module.exports = {
        parse: function() {
          return this.createSingleNodeList(this.Identifier());
        }
      };
    },
    3221: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = __webpack_require__(7157);
    },
    1681: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = __webpack_require__(7157);
    },
    8492: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = __webpack_require__(6991);
    },
    6512: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = __webpack_require__(6991);
    },
    9869: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = __webpack_require__(9879);
    },
    3756: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = __webpack_require__(9879);
    },
    2139: function(module) {
      module.exports = {
        parse: function() {
          return this.createSingleNodeList(this.Selector());
        }
      };
    },
    445: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        getNode: __webpack_require__(1603)
      };
    },
    1603: function(module, __unused_webpack_exports, __webpack_require__) {
      var cmpChar = __webpack_require__(7093).cmpChar, cmpStr = __webpack_require__(7093).cmpStr, TYPE = __webpack_require__(7093).TYPE, IDENT = TYPE.Ident, STRING = TYPE.String, NUMBER = TYPE.Number, FUNCTION = TYPE.Function, URL = TYPE.Url, HASH = TYPE.Hash, DIMENSION = TYPE.Dimension, PERCENTAGE = TYPE.Percentage, LEFTPARENTHESIS = TYPE.LeftParenthesis, LEFTSQUAREBRACKET = TYPE.LeftSquareBracket, COMMA = TYPE.Comma, DELIM = TYPE.Delim;
      module.exports = function(context) {
        switch (this.scanner.tokenType) {
         case HASH:
          return this.HexColor();

         case COMMA:
          return context.space = null, context.ignoreWSAfter = !0, this.Operator();

         case LEFTPARENTHESIS:
          return this.Parentheses(this.readSequence, context.recognizer);

         case LEFTSQUAREBRACKET:
          return this.Brackets(this.readSequence, context.recognizer);

         case STRING:
          return this.String();

         case DIMENSION:
          return this.Dimension();

         case PERCENTAGE:
          return this.Percentage();

         case NUMBER:
          return this.Number();

         case FUNCTION:
          return cmpStr(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, context.recognizer);

         case URL:
          return this.Url();

         case IDENT:
          return cmpChar(this.scanner.source, this.scanner.tokenStart, 117) && cmpChar(this.scanner.source, this.scanner.tokenStart + 1, 43) ? this.UnicodeRange() : this.Identifier();

         case DELIM:
          var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
          if (47 === code || 42 === code || 43 === code || 45 === code) return this.Operator();
          35 === code && this.error("Hex or identifier is expected", this.scanner.tokenStart + 1);
        }
      };
    },
    7813: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        AtrulePrelude: __webpack_require__(445),
        Selector: __webpack_require__(3388),
        Value: __webpack_require__(7274)
      };
    },
    3388: function(module, __unused_webpack_exports, __webpack_require__) {
      var TYPE = __webpack_require__(7093).TYPE, DELIM = TYPE.Delim, IDENT = TYPE.Ident, DIMENSION = TYPE.Dimension, PERCENTAGE = TYPE.Percentage, NUMBER = TYPE.Number, HASH = TYPE.Hash, COLON = TYPE.Colon, LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
      module.exports = {
        getNode: function(context) {
          switch (this.scanner.tokenType) {
           case LEFTSQUAREBRACKET:
            return this.AttributeSelector();

           case HASH:
            return this.IdSelector();

           case COLON:
            return this.scanner.lookupType(1) === COLON ? this.PseudoElementSelector() : this.PseudoClassSelector();

           case IDENT:
            return this.TypeSelector();

           case NUMBER:
           case PERCENTAGE:
            return this.Percentage();

           case DIMENSION:
            46 === this.scanner.source.charCodeAt(this.scanner.tokenStart) && this.error("Identifier is expected", this.scanner.tokenStart + 1);
            break;

           case DELIM:
            switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
             case 43:
             case 62:
             case 126:
              return context.space = null, context.ignoreWSAfter = !0, this.Combinator();

             case 47:
              return this.Combinator();

             case 46:
              return this.ClassSelector();

             case 42:
             case 124:
              return this.TypeSelector();

             case 35:
              return this.IdSelector();
            }
          }
        }
      };
    },
    7274: function(module, __unused_webpack_exports, __webpack_require__) {
      module.exports = {
        getNode: __webpack_require__(1603),
        "-moz-element": __webpack_require__(3699),
        element: __webpack_require__(3699),
        expression: __webpack_require__(9298),
        var: __webpack_require__(8082)
      };
    },
    6344: function(module) {
      function isDigit(code) {
        return code >= 48 && code <= 57;
      }
      function isUppercaseLetter(code) {
        return code >= 65 && code <= 90;
      }
      function isLowercaseLetter(code) {
        return code >= 97 && code <= 122;
      }
      function isLetter(code) {
        return isUppercaseLetter(code) || isLowercaseLetter(code);
      }
      function isNonAscii(code) {
        return code >= 128;
      }
      function isNameStart(code) {
        return isLetter(code) || isNonAscii(code) || 95 === code;
      }
      function isNonPrintable(code) {
        return code >= 0 && code <= 8 || 11 === code || code >= 14 && code <= 31 || 127 === code;
      }
      function isNewline(code) {
        return 10 === code || 13 === code || 12 === code;
      }
      function isWhiteSpace(code) {
        return isNewline(code) || 32 === code || 9 === code;
      }
      function isValidEscape(first, second) {
        return 92 === first && (!isNewline(second) && 0 !== second);
      }
      var CATEGORY = new Array(128);
      charCodeCategory.Eof = 128, charCodeCategory.WhiteSpace = 130, charCodeCategory.Digit = 131, 
      charCodeCategory.NameStart = 132, charCodeCategory.NonPrintable = 133;
      for (var i = 0; i < CATEGORY.length; i++) switch (!0) {
       case isWhiteSpace(i):
        CATEGORY[i] = charCodeCategory.WhiteSpace;
        break;

       case isDigit(i):
        CATEGORY[i] = charCodeCategory.Digit;
        break;

       case isNameStart(i):
        CATEGORY[i] = charCodeCategory.NameStart;
        break;

       case isNonPrintable(i):
        CATEGORY[i] = charCodeCategory.NonPrintable;
        break;

       default:
        CATEGORY[i] = i || charCodeCategory.Eof;
      }
      function charCodeCategory(code) {
        return code < 128 ? CATEGORY[code] : charCodeCategory.NameStart;
      }
      module.exports = {
        isDigit: isDigit,
        isHexDigit: function(code) {
          return isDigit(code) || code >= 65 && code <= 70 || code >= 97 && code <= 102;
        },
        isUppercaseLetter: isUppercaseLetter,
        isLowercaseLetter: isLowercaseLetter,
        isLetter: isLetter,
        isNonAscii: isNonAscii,
        isNameStart: isNameStart,
        isName: function(code) {
          return isNameStart(code) || isDigit(code) || 45 === code;
        },
        isNonPrintable: isNonPrintable,
        isNewline: isNewline,
        isWhiteSpace: isWhiteSpace,
        isValidEscape: isValidEscape,
        isIdentifierStart: function(first, second, third) {
          return 45 === first ? isNameStart(second) || 45 === second || isValidEscape(second, third) : !!isNameStart(first) || 92 === first && isValidEscape(first, second);
        },
        isNumberStart: function(first, second, third) {
          return 43 === first || 45 === first ? isDigit(second) ? 2 : 46 === second && isDigit(third) ? 3 : 0 : 46 === first ? isDigit(second) ? 2 : 0 : isDigit(first) ? 1 : 0;
        },
        isBOM: function(code) {
          return 65279 === code || 65534 === code ? 1 : 0;
        },
        charCodeCategory: charCodeCategory
      };
    },
    3786: function(module) {
      var TYPE = {
        EOF: 0,
        Ident: 1,
        Function: 2,
        AtKeyword: 3,
        Hash: 4,
        String: 5,
        BadString: 6,
        Url: 7,
        BadUrl: 8,
        Delim: 9,
        Number: 10,
        Percentage: 11,
        Dimension: 12,
        WhiteSpace: 13,
        CDO: 14,
        CDC: 15,
        Colon: 16,
        Semicolon: 17,
        Comma: 18,
        LeftSquareBracket: 19,
        RightSquareBracket: 20,
        LeftParenthesis: 21,
        RightParenthesis: 22,
        LeftCurlyBracket: 23,
        RightCurlyBracket: 24,
        Comment: 25
      }, NAME = Object.keys(TYPE).reduce((function(result, key) {
        return result[TYPE[key]] = key, result;
      }), {});
      module.exports = {
        TYPE: TYPE,
        NAME: NAME
      };
    },
    7093: function(module, __unused_webpack_exports, __webpack_require__) {
      var TokenStream = __webpack_require__(2879), adoptBuffer = __webpack_require__(3123), constants = __webpack_require__(3786), TYPE = constants.TYPE, charCodeDefinitions = __webpack_require__(6344), isNewline = charCodeDefinitions.isNewline, isName = charCodeDefinitions.isName, isValidEscape = charCodeDefinitions.isValidEscape, isNumberStart = charCodeDefinitions.isNumberStart, isIdentifierStart = charCodeDefinitions.isIdentifierStart, charCodeCategory = charCodeDefinitions.charCodeCategory, isBOM = charCodeDefinitions.isBOM, utils = __webpack_require__(5951), cmpStr = utils.cmpStr, getNewlineLength = utils.getNewlineLength, findWhiteSpaceEnd = utils.findWhiteSpaceEnd, consumeEscaped = utils.consumeEscaped, consumeName = utils.consumeName, consumeNumber = utils.consumeNumber, consumeBadUrlRemnants = utils.consumeBadUrlRemnants;
      function tokenize(source, stream) {
        function getCharCode(offset) {
          return offset < sourceLength ? source.charCodeAt(offset) : 0;
        }
        function consumeNumericToken() {
          return offset = consumeNumber(source, offset), isIdentifierStart(getCharCode(offset), getCharCode(offset + 1), getCharCode(offset + 2)) ? (type = TYPE.Dimension, 
          void (offset = consumeName(source, offset))) : 37 === getCharCode(offset) ? (type = TYPE.Percentage, 
          void offset++) : void (type = TYPE.Number);
        }
        function consumeIdentLikeToken() {
          const nameStartOffset = offset;
          return offset = consumeName(source, offset), cmpStr(source, nameStartOffset, offset, "url") && 40 === getCharCode(offset) ? 34 === getCharCode(offset = findWhiteSpaceEnd(source, offset + 1)) || 39 === getCharCode(offset) ? (type = TYPE.Function, 
          void (offset = nameStartOffset + 4)) : void function() {
            for (type = TYPE.Url, offset = findWhiteSpaceEnd(source, offset); offset < source.length; offset++) {
              var code = source.charCodeAt(offset);
              switch (charCodeCategory(code)) {
               case 41:
                return void offset++;

               case charCodeCategory.Eof:
                return;

               case charCodeCategory.WhiteSpace:
                return 41 === getCharCode(offset = findWhiteSpaceEnd(source, offset)) || offset >= source.length ? void (offset < source.length && offset++) : (offset = consumeBadUrlRemnants(source, offset), 
                void (type = TYPE.BadUrl));

               case 34:
               case 39:
               case 40:
               case charCodeCategory.NonPrintable:
                return offset = consumeBadUrlRemnants(source, offset), void (type = TYPE.BadUrl);

               case 92:
                if (isValidEscape(code, getCharCode(offset + 1))) {
                  offset = consumeEscaped(source, offset) - 1;
                  break;
                }
                return offset = consumeBadUrlRemnants(source, offset), void (type = TYPE.BadUrl);
              }
            }
          }() : 40 === getCharCode(offset) ? (type = TYPE.Function, void offset++) : void (type = TYPE.Ident);
        }
        function consumeStringToken(endingCodePoint) {
          for (endingCodePoint || (endingCodePoint = getCharCode(offset++)), type = TYPE.String; offset < source.length; offset++) {
            var code = source.charCodeAt(offset);
            switch (charCodeCategory(code)) {
             case endingCodePoint:
              return void offset++;

             case charCodeCategory.Eof:
              return;

             case charCodeCategory.WhiteSpace:
              if (isNewline(code)) return offset += getNewlineLength(source, offset, code), void (type = TYPE.BadString);
              break;

             case 92:
              if (offset === source.length - 1) break;
              var nextCode = getCharCode(offset + 1);
              isNewline(nextCode) ? offset += getNewlineLength(source, offset + 1, nextCode) : isValidEscape(code, nextCode) && (offset = consumeEscaped(source, offset) - 1);
            }
          }
        }
        stream || (stream = new TokenStream);
        for (var sourceLength = (source = String(source || "")).length, offsetAndType = adoptBuffer(stream.offsetAndType, sourceLength + 1), balance = adoptBuffer(stream.balance, sourceLength + 1), tokenCount = 0, start = isBOM(getCharCode(0)), offset = start, balanceCloseType = 0, balanceStart = 0, balancePrev = 0; offset < sourceLength; ) {
          var code = source.charCodeAt(offset), type = 0;
          switch (balance[tokenCount] = sourceLength, charCodeCategory(code)) {
           case charCodeCategory.WhiteSpace:
            type = TYPE.WhiteSpace, offset = findWhiteSpaceEnd(source, offset + 1);
            break;

           case 34:
            consumeStringToken();
            break;

           case 35:
            isName(getCharCode(offset + 1)) || isValidEscape(getCharCode(offset + 1), getCharCode(offset + 2)) ? (type = TYPE.Hash, 
            offset = consumeName(source, offset + 1)) : (type = TYPE.Delim, offset++);
            break;

           case 39:
            consumeStringToken();
            break;

           case 40:
            type = TYPE.LeftParenthesis, offset++;
            break;

           case 41:
            type = TYPE.RightParenthesis, offset++;
            break;

           case 43:
            isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2)) ? consumeNumericToken() : (type = TYPE.Delim, 
            offset++);
            break;

           case 44:
            type = TYPE.Comma, offset++;
            break;

           case 45:
            isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2)) ? consumeNumericToken() : 45 === getCharCode(offset + 1) && 62 === getCharCode(offset + 2) ? (type = TYPE.CDC, 
            offset += 3) : isIdentifierStart(code, getCharCode(offset + 1), getCharCode(offset + 2)) ? consumeIdentLikeToken() : (type = TYPE.Delim, 
            offset++);
            break;

           case 46:
            isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2)) ? consumeNumericToken() : (type = TYPE.Delim, 
            offset++);
            break;

           case 47:
            42 === getCharCode(offset + 1) ? (type = TYPE.Comment, 1 === (offset = source.indexOf("*/", offset + 2) + 2) && (offset = source.length)) : (type = TYPE.Delim, 
            offset++);
            break;

           case 58:
            type = TYPE.Colon, offset++;
            break;

           case 59:
            type = TYPE.Semicolon, offset++;
            break;

           case 60:
            33 === getCharCode(offset + 1) && 45 === getCharCode(offset + 2) && 45 === getCharCode(offset + 3) ? (type = TYPE.CDO, 
            offset += 4) : (type = TYPE.Delim, offset++);
            break;

           case 64:
            isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3)) ? (type = TYPE.AtKeyword, 
            offset = consumeName(source, offset + 1)) : (type = TYPE.Delim, offset++);
            break;

           case 91:
            type = TYPE.LeftSquareBracket, offset++;
            break;

           case 92:
            isValidEscape(code, getCharCode(offset + 1)) ? consumeIdentLikeToken() : (type = TYPE.Delim, 
            offset++);
            break;

           case 93:
            type = TYPE.RightSquareBracket, offset++;
            break;

           case 123:
            type = TYPE.LeftCurlyBracket, offset++;
            break;

           case 125:
            type = TYPE.RightCurlyBracket, offset++;
            break;

           case charCodeCategory.Digit:
            consumeNumericToken();
            break;

           case charCodeCategory.NameStart:
            consumeIdentLikeToken();
            break;

           case charCodeCategory.Eof:
            break;

           default:
            type = TYPE.Delim, offset++;
          }
          switch (type) {
           case balanceCloseType:
            for (balanceCloseType = (balanceStart = balance[balancePrev = 16777215 & balanceStart]) >> 24, 
            balance[tokenCount] = balancePrev, balance[balancePrev++] = tokenCount; balancePrev < tokenCount; balancePrev++) balance[balancePrev] === sourceLength && (balance[balancePrev] = tokenCount);
            break;

           case TYPE.LeftParenthesis:
           case TYPE.Function:
            balance[tokenCount] = balanceStart, balanceStart = (balanceCloseType = TYPE.RightParenthesis) << 24 | tokenCount;
            break;

           case TYPE.LeftSquareBracket:
            balance[tokenCount] = balanceStart, balanceStart = (balanceCloseType = TYPE.RightSquareBracket) << 24 | tokenCount;
            break;

           case TYPE.LeftCurlyBracket:
            balance[tokenCount] = balanceStart, balanceStart = (balanceCloseType = TYPE.RightCurlyBracket) << 24 | tokenCount;
          }
          offsetAndType[tokenCount++] = type << 24 | offset;
        }
        for (offsetAndType[tokenCount] = TYPE.EOF << 24 | offset, balance[tokenCount] = sourceLength, 
        balance[sourceLength] = sourceLength; 0 !== balanceStart; ) balanceStart = balance[balancePrev = 16777215 & balanceStart], 
        balance[balancePrev] = sourceLength;
        return stream.source = source, stream.firstCharOffset = start, stream.offsetAndType = offsetAndType, 
        stream.tokenCount = tokenCount, stream.balance = balance, stream.reset(), stream.next(), 
        stream;
      }
      Object.keys(constants).forEach((function(key) {
        tokenize[key] = constants[key];
      })), Object.keys(charCodeDefinitions).forEach((function(key) {
        tokenize[key] = charCodeDefinitions[key];
      })), Object.keys(utils).forEach((function(key) {
        tokenize[key] = utils[key];
      })), module.exports = tokenize;
    },
    5951: function(module, __unused_webpack_exports, __webpack_require__) {
      var charCodeDef = __webpack_require__(6344), isDigit = charCodeDef.isDigit, isHexDigit = charCodeDef.isHexDigit, isUppercaseLetter = charCodeDef.isUppercaseLetter, isName = charCodeDef.isName, isWhiteSpace = charCodeDef.isWhiteSpace, isValidEscape = charCodeDef.isValidEscape;
      function getCharCode(source, offset) {
        return offset < source.length ? source.charCodeAt(offset) : 0;
      }
      function getNewlineLength(source, offset, code) {
        return 13 === code && 10 === getCharCode(source, offset + 1) ? 2 : 1;
      }
      function cmpChar(testStr, offset, referenceCode) {
        var code = testStr.charCodeAt(offset);
        return isUppercaseLetter(code) && (code |= 32), code === referenceCode;
      }
      function findDecimalNumberEnd(source, offset) {
        for (;offset < source.length && isDigit(source.charCodeAt(offset)); offset++) ;
        return offset;
      }
      function consumeEscaped(source, offset) {
        if (isHexDigit(getCharCode(source, (offset += 2) - 1))) {
          for (var maxOffset = Math.min(source.length, offset + 5); offset < maxOffset && isHexDigit(getCharCode(source, offset)); offset++) ;
          var code = getCharCode(source, offset);
          isWhiteSpace(code) && (offset += getNewlineLength(source, offset, code));
        }
        return offset;
      }
      module.exports = {
        consumeEscaped: consumeEscaped,
        consumeName: function(source, offset) {
          for (;offset < source.length; offset++) {
            var code = source.charCodeAt(offset);
            if (!isName(code)) {
              if (!isValidEscape(code, getCharCode(source, offset + 1))) break;
              offset = consumeEscaped(source, offset) - 1;
            }
          }
          return offset;
        },
        consumeNumber: function(source, offset) {
          var code = source.charCodeAt(offset);
          if (43 !== code && 45 !== code || (code = source.charCodeAt(offset += 1)), isDigit(code) && (offset = findDecimalNumberEnd(source, offset + 1), 
          code = source.charCodeAt(offset)), 46 === code && isDigit(source.charCodeAt(offset + 1)) && (code = source.charCodeAt(offset += 2), 
          offset = findDecimalNumberEnd(source, offset)), cmpChar(source, offset, 101)) {
            var sign = 0;
            45 !== (code = source.charCodeAt(offset + 1)) && 43 !== code || (sign = 1, code = source.charCodeAt(offset + 2)), 
            isDigit(code) && (offset = findDecimalNumberEnd(source, offset + 1 + sign + 1));
          }
          return offset;
        },
        consumeBadUrlRemnants: function(source, offset) {
          for (;offset < source.length; offset++) {
            var code = source.charCodeAt(offset);
            if (41 === code) {
              offset++;
              break;
            }
            isValidEscape(code, getCharCode(source, offset + 1)) && (offset = consumeEscaped(source, offset));
          }
          return offset;
        },
        cmpChar: cmpChar,
        cmpStr: function(testStr, start, end, referenceStr) {
          if (end - start !== referenceStr.length) return !1;
          if (start < 0 || end > testStr.length) return !1;
          for (var i = start; i < end; i++) {
            var testCode = testStr.charCodeAt(i), referenceCode = referenceStr.charCodeAt(i - start);
            if (isUppercaseLetter(testCode) && (testCode |= 32), testCode !== referenceCode) return !1;
          }
          return !0;
        },
        getNewlineLength: getNewlineLength,
        findWhiteSpaceStart: function(source, offset) {
          for (;offset >= 0 && isWhiteSpace(source.charCodeAt(offset)); offset--) ;
          return offset + 1;
        },
        findWhiteSpaceEnd: function(source, offset) {
          for (;offset < source.length && isWhiteSpace(source.charCodeAt(offset)); offset++) ;
          return offset;
        }
      };
    },
    6903: function(module, __unused_webpack_exports, __webpack_require__) {
      var List = __webpack_require__(7467);
      module.exports = function clone(node) {
        var result = {};
        for (var key in node) {
          var value = node[key];
          value && (Array.isArray(value) || value instanceof List ? value = value.map(clone) : value.constructor === Object && (value = clone(value))), 
          result[key] = value;
        }
        return result;
      };
    },
    2451: function(module) {
      module.exports = function(name, message) {
        var error = Object.create(SyntaxError.prototype), errorStack = new Error;
        return error.name = name, error.message = message, Object.defineProperty(error, "stack", {
          get: function() {
            return (errorStack.stack || "").replace(/^(.+\n){1,3}/, name + ": " + message + "\n");
          }
        }), error;
      };
    },
    5993: function(module) {
      var hasOwnProperty = Object.prototype.hasOwnProperty, keywords = Object.create(null), properties = Object.create(null);
      function isCustomProperty(str, offset) {
        return offset = offset || 0, str.length - offset >= 2 && 45 === str.charCodeAt(offset) && 45 === str.charCodeAt(offset + 1);
      }
      function getVendorPrefix(str, offset) {
        if (offset = offset || 0, str.length - offset >= 3 && 45 === str.charCodeAt(offset) && 45 !== str.charCodeAt(offset + 1)) {
          var secondDashIndex = str.indexOf("-", offset + 2);
          if (-1 !== secondDashIndex) return str.substring(offset, secondDashIndex + 1);
        }
        return "";
      }
      module.exports = {
        keyword: function(keyword) {
          if (hasOwnProperty.call(keywords, keyword)) return keywords[keyword];
          var name = keyword.toLowerCase();
          if (hasOwnProperty.call(keywords, name)) return keywords[keyword] = keywords[name];
          var custom = isCustomProperty(name, 0), vendor = custom ? "" : getVendorPrefix(name, 0);
          return keywords[keyword] = Object.freeze({
            basename: name.substr(vendor.length),
            name: name,
            vendor: vendor,
            prefix: vendor,
            custom: custom
          });
        },
        property: function(property) {
          if (hasOwnProperty.call(properties, property)) return properties[property];
          var name = property, hack = property[0];
          "/" === hack ? hack = "/" === property[1] ? "//" : "/" : "_" !== hack && "*" !== hack && "$" !== hack && "#" !== hack && "+" !== hack && "&" !== hack && (hack = "");
          var custom = isCustomProperty(name, hack.length);
          if (!custom && (name = name.toLowerCase(), hasOwnProperty.call(properties, name))) return properties[property] = properties[name];
          var vendor = custom ? "" : getVendorPrefix(name, hack.length), prefix = name.substr(0, hack.length + vendor.length);
          return properties[property] = Object.freeze({
            basename: name.substr(prefix.length),
            name: name.substr(hack.length),
            hack: hack,
            vendor: vendor,
            prefix: prefix,
            custom: custom
          });
        },
        isCustomProperty: isCustomProperty,
        vendorPrefix: getVendorPrefix
      };
    },
    2131: function(module) {
      var hasOwnProperty = Object.prototype.hasOwnProperty, noop = function() {};
      function ensureFunction(value) {
        return "function" == typeof value ? value : noop;
      }
      function invokeForType(fn, type) {
        return function(node, item, list) {
          node.type === type && fn.call(this, node, item, list);
        };
      }
      function getWalkersFromStructure(name, nodeType) {
        var structure = nodeType.structure, walkers = [];
        for (var key in structure) if (!1 !== hasOwnProperty.call(structure, key)) {
          var fieldTypes = structure[key], walker = {
            name: key,
            type: !1,
            nullable: !1
          };
          Array.isArray(structure[key]) || (fieldTypes = [ structure[key] ]);
          for (var i = 0; i < fieldTypes.length; i++) {
            var fieldType = fieldTypes[i];
            null === fieldType ? walker.nullable = !0 : "string" == typeof fieldType ? walker.type = "node" : Array.isArray(fieldType) && (walker.type = "list");
          }
          walker.type && walkers.push(walker);
        }
        return walkers.length ? {
          context: nodeType.walkContext,
          fields: walkers
        } : null;
      }
      function createTypeIterator(config, reverse) {
        var fields = config.fields.slice(), contextName = config.context, useContext = "string" == typeof contextName;
        return reverse && fields.reverse(), function(node, context, walk) {
          var prevContextValue;
          useContext && (prevContextValue = context[contextName], context[contextName] = node);
          for (var i = 0; i < fields.length; i++) {
            var field = fields[i], ref = node[field.name];
            field.nullable && !ref || ("list" === field.type ? reverse ? ref.forEachRight(walk) : ref.forEach(walk) : walk(ref));
          }
          useContext && (context[contextName] = prevContextValue);
        };
      }
      function createFastTraveralMap(iterators) {
        return {
          Atrule: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block
          },
          Rule: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block
          },
          Declaration: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block,
            DeclarationList: iterators.DeclarationList
          }
        };
      }
      module.exports = function(config) {
        var types = function(config) {
          var types = {};
          for (var name in config.node) if (hasOwnProperty.call(config.node, name)) {
            var nodeType = config.node[name];
            if (!nodeType.structure) throw new Error("Missed `structure` field in `" + name + "` node type definition");
            types[name] = getWalkersFromStructure(0, nodeType);
          }
          return types;
        }(config), iteratorsNatural = {}, iteratorsReverse = {};
        for (var name in types) hasOwnProperty.call(types, name) && null !== types[name] && (iteratorsNatural[name] = createTypeIterator(types[name], !1), 
        iteratorsReverse[name] = createTypeIterator(types[name], !0));
        var fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural), fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse), walk = function(root, options) {
          var enter = noop, leave = noop, iterators = iteratorsNatural, context = {
            root: root,
            stylesheet: null,
            atrule: null,
            atrulePrelude: null,
            rule: null,
            selector: null,
            block: null,
            declaration: null,
            function: null
          };
          if ("function" == typeof options) enter = options; else if (options && (enter = ensureFunction(options.enter), 
          leave = ensureFunction(options.leave), options.reverse && (iterators = iteratorsReverse), 
          options.visit)) {
            if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) iterators = options.reverse ? fastTraversalIteratorsReverse[options.visit] : fastTraversalIteratorsNatural[options.visit]; else if (!types.hasOwnProperty(options.visit)) throw new Error("Bad value `" + options.visit + "` for `visit` option (should be: " + Object.keys(types).join(", ") + ")");
            enter = invokeForType(enter, options.visit), leave = invokeForType(leave, options.visit);
          }
          if (enter === noop && leave === noop) throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
          if (options.reverse) {
            var tmp = enter;
            enter = leave, leave = tmp;
          }
          !function walkNode(node, item, list) {
            enter.call(context, node, item, list), iterators.hasOwnProperty(node.type) && iterators[node.type](node, context, walkNode), 
            leave.call(context, node, item, list);
          }(root);
        };
        return walk.find = function(ast, fn) {
          var found = null;
          return walk(ast, (function(node, item, list) {
            null === found && fn.call(this, node, item, list) && (found = node);
          })), found;
        }, walk.findLast = function(ast, fn) {
          var found = null;
          return walk(ast, {
            reverse: !0,
            enter: function(node, item, list) {
              null === found && fn.call(this, node, item, list) && (found = node);
            }
          }), found;
        }, walk.findAll = function(ast, fn) {
          var found = [];
          return walk(ast, (function(node, item, list) {
            fn.call(this, node, item, list) && found.push(node);
          })), found;
        }, walk;
      };
    },
    8213: function(__unused_webpack_module, exports, __webpack_require__) {
      var util = __webpack_require__(2728), has = Object.prototype.hasOwnProperty, hasNativeMap = "undefined" != typeof Map;
      function ArraySet() {
        this._array = [], this._set = hasNativeMap ? new Map : Object.create(null);
      }
      ArraySet.fromArray = function(aArray, aAllowDuplicates) {
        for (var set = new ArraySet, i = 0, len = aArray.length; i < len; i++) set.add(aArray[i], aAllowDuplicates);
        return set;
      }, ArraySet.prototype.size = function() {
        return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
      }, ArraySet.prototype.add = function(aStr, aAllowDuplicates) {
        var sStr = hasNativeMap ? aStr : util.toSetString(aStr), isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr), idx = this._array.length;
        isDuplicate && !aAllowDuplicates || this._array.push(aStr), isDuplicate || (hasNativeMap ? this._set.set(aStr, idx) : this._set[sStr] = idx);
      }, ArraySet.prototype.has = function(aStr) {
        if (hasNativeMap) return this._set.has(aStr);
        var sStr = util.toSetString(aStr);
        return has.call(this._set, sStr);
      }, ArraySet.prototype.indexOf = function(aStr) {
        if (hasNativeMap) {
          var idx = this._set.get(aStr);
          if (idx >= 0) return idx;
        } else {
          var sStr = util.toSetString(aStr);
          if (has.call(this._set, sStr)) return this._set[sStr];
        }
        throw new Error('"' + aStr + '" is not in the set.');
      }, ArraySet.prototype.at = function(aIdx) {
        if (aIdx >= 0 && aIdx < this._array.length) return this._array[aIdx];
        throw new Error("No element indexed by " + aIdx);
      }, ArraySet.prototype.toArray = function() {
        return this._array.slice();
      }, exports.I = ArraySet;
    },
    6400: function(__unused_webpack_module, exports, __webpack_require__) {
      var base64 = __webpack_require__(7923);
      exports.encode = function(aValue) {
        var digit, encoded = "", vlq = function(aValue) {
          return aValue < 0 ? 1 + (-aValue << 1) : 0 + (aValue << 1);
        }(aValue);
        do {
          digit = 31 & vlq, (vlq >>>= 5) > 0 && (digit |= 32), encoded += base64.encode(digit);
        } while (vlq > 0);
        return encoded;
      }, exports.decode = function(aStr, aIndex, aOutParam) {
        var continuation, digit, aValue, shifted, strLen = aStr.length, result = 0, shift = 0;
        do {
          if (aIndex >= strLen) throw new Error("Expected more digits in base 64 VLQ value.");
          if (-1 === (digit = base64.decode(aStr.charCodeAt(aIndex++)))) throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
          continuation = !!(32 & digit), result += (digit &= 31) << shift, shift += 5;
        } while (continuation);
        aOutParam.value = (shifted = (aValue = result) >> 1, 1 == (1 & aValue) ? -shifted : shifted), 
        aOutParam.rest = aIndex;
      };
    },
    7923: function(__unused_webpack_module, exports) {
      var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
      exports.encode = function(number) {
        if (0 <= number && number < intToCharMap.length) return intToCharMap[number];
        throw new TypeError("Must be between 0 and 63: " + number);
      }, exports.decode = function(charCode) {
        return 65 <= charCode && charCode <= 90 ? charCode - 65 : 97 <= charCode && charCode <= 122 ? charCode - 97 + 26 : 48 <= charCode && charCode <= 57 ? charCode - 48 + 52 : 43 == charCode ? 62 : 47 == charCode ? 63 : -1;
      };
    },
    1188: function(__unused_webpack_module, exports, __webpack_require__) {
      var util = __webpack_require__(2728);
      function MappingList() {
        this._array = [], this._sorted = !0, this._last = {
          generatedLine: -1,
          generatedColumn: 0
        };
      }
      MappingList.prototype.unsortedForEach = function(aCallback, aThisArg) {
        this._array.forEach(aCallback, aThisArg);
      }, MappingList.prototype.add = function(aMapping) {
        var mappingA, mappingB, lineA, lineB, columnA, columnB;
        mappingA = this._last, mappingB = aMapping, lineA = mappingA.generatedLine, lineB = mappingB.generatedLine, 
        columnA = mappingA.generatedColumn, columnB = mappingB.generatedColumn, lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0 ? (this._last = aMapping, 
        this._array.push(aMapping)) : (this._sorted = !1, this._array.push(aMapping));
      }, MappingList.prototype.toArray = function() {
        return this._sorted || (this._array.sort(util.compareByGeneratedPositionsInflated), 
        this._sorted = !0), this._array;
      }, exports.H = MappingList;
    },
    4433: function(__unused_webpack_module, exports, __webpack_require__) {
      var base64VLQ = __webpack_require__(6400), util = __webpack_require__(2728), ArraySet = __webpack_require__(8213).I, MappingList = __webpack_require__(1188).H;
      function SourceMapGenerator(aArgs) {
        aArgs || (aArgs = {}), this._file = util.getArg(aArgs, "file", null), this._sourceRoot = util.getArg(aArgs, "sourceRoot", null), 
        this._skipValidation = util.getArg(aArgs, "skipValidation", !1), this._sources = new ArraySet, 
        this._names = new ArraySet, this._mappings = new MappingList, this._sourcesContents = null;
      }
      SourceMapGenerator.prototype._version = 3, SourceMapGenerator.fromSourceMap = function(aSourceMapConsumer) {
        var sourceRoot = aSourceMapConsumer.sourceRoot, generator = new SourceMapGenerator({
          file: aSourceMapConsumer.file,
          sourceRoot: sourceRoot
        });
        return aSourceMapConsumer.eachMapping((function(mapping) {
          var newMapping = {
            generated: {
              line: mapping.generatedLine,
              column: mapping.generatedColumn
            }
          };
          null != mapping.source && (newMapping.source = mapping.source, null != sourceRoot && (newMapping.source = util.relative(sourceRoot, newMapping.source)), 
          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          }, null != mapping.name && (newMapping.name = mapping.name)), generator.addMapping(newMapping);
        })), aSourceMapConsumer.sources.forEach((function(sourceFile) {
          var sourceRelative = sourceFile;
          null !== sourceRoot && (sourceRelative = util.relative(sourceRoot, sourceFile)), 
          generator._sources.has(sourceRelative) || generator._sources.add(sourceRelative);
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          null != content && generator.setSourceContent(sourceFile, content);
        })), generator;
      }, SourceMapGenerator.prototype.addMapping = function(aArgs) {
        var generated = util.getArg(aArgs, "generated"), original = util.getArg(aArgs, "original", null), source = util.getArg(aArgs, "source", null), name = util.getArg(aArgs, "name", null);
        this._skipValidation || this._validateMapping(generated, original, source, name), 
        null != source && (source = String(source), this._sources.has(source) || this._sources.add(source)), 
        null != name && (name = String(name), this._names.has(name) || this._names.add(name)), 
        this._mappings.add({
          generatedLine: generated.line,
          generatedColumn: generated.column,
          originalLine: null != original && original.line,
          originalColumn: null != original && original.column,
          source: source,
          name: name
        });
      }, SourceMapGenerator.prototype.setSourceContent = function(aSourceFile, aSourceContent) {
        var source = aSourceFile;
        null != this._sourceRoot && (source = util.relative(this._sourceRoot, source)), 
        null != aSourceContent ? (this._sourcesContents || (this._sourcesContents = Object.create(null)), 
        this._sourcesContents[util.toSetString(source)] = aSourceContent) : this._sourcesContents && (delete this._sourcesContents[util.toSetString(source)], 
        0 === Object.keys(this._sourcesContents).length && (this._sourcesContents = null));
      }, SourceMapGenerator.prototype.applySourceMap = function(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
        var sourceFile = aSourceFile;
        if (null == aSourceFile) {
          if (null == aSourceMapConsumer.file) throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.');
          sourceFile = aSourceMapConsumer.file;
        }
        var sourceRoot = this._sourceRoot;
        null != sourceRoot && (sourceFile = util.relative(sourceRoot, sourceFile));
        var newSources = new ArraySet, newNames = new ArraySet;
        this._mappings.unsortedForEach((function(mapping) {
          if (mapping.source === sourceFile && null != mapping.originalLine) {
            var original = aSourceMapConsumer.originalPositionFor({
              line: mapping.originalLine,
              column: mapping.originalColumn
            });
            null != original.source && (mapping.source = original.source, null != aSourceMapPath && (mapping.source = util.join(aSourceMapPath, mapping.source)), 
            null != sourceRoot && (mapping.source = util.relative(sourceRoot, mapping.source)), 
            mapping.originalLine = original.line, mapping.originalColumn = original.column, 
            null != original.name && (mapping.name = original.name));
          }
          var source = mapping.source;
          null == source || newSources.has(source) || newSources.add(source);
          var name = mapping.name;
          null == name || newNames.has(name) || newNames.add(name);
        }), this), this._sources = newSources, this._names = newNames, aSourceMapConsumer.sources.forEach((function(sourceFile) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          null != content && (null != aSourceMapPath && (sourceFile = util.join(aSourceMapPath, sourceFile)), 
          null != sourceRoot && (sourceFile = util.relative(sourceRoot, sourceFile)), this.setSourceContent(sourceFile, content));
        }), this);
      }, SourceMapGenerator.prototype._validateMapping = function(aGenerated, aOriginal, aSource, aName) {
        if (aOriginal && "number" != typeof aOriginal.line && "number" != typeof aOriginal.column) throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
        if ((!(aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0) || aOriginal || aSource || aName) && !(aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource)) throw new Error("Invalid mapping: " + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }, SourceMapGenerator.prototype._serializeMappings = function() {
        for (var next, mapping, nameIdx, sourceIdx, previousGeneratedColumn = 0, previousGeneratedLine = 1, previousOriginalColumn = 0, previousOriginalLine = 0, previousName = 0, previousSource = 0, result = "", mappings = this._mappings.toArray(), i = 0, len = mappings.length; i < len; i++) {
          if (next = "", (mapping = mappings[i]).generatedLine !== previousGeneratedLine) for (previousGeneratedColumn = 0; mapping.generatedLine !== previousGeneratedLine; ) next += ";", 
          previousGeneratedLine++; else if (i > 0) {
            if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) continue;
            next += ",";
          }
          next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn), previousGeneratedColumn = mapping.generatedColumn, 
          null != mapping.source && (sourceIdx = this._sources.indexOf(mapping.source), next += base64VLQ.encode(sourceIdx - previousSource), 
          previousSource = sourceIdx, next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine), 
          previousOriginalLine = mapping.originalLine - 1, next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn), 
          previousOriginalColumn = mapping.originalColumn, null != mapping.name && (nameIdx = this._names.indexOf(mapping.name), 
          next += base64VLQ.encode(nameIdx - previousName), previousName = nameIdx)), result += next;
        }
        return result;
      }, SourceMapGenerator.prototype._generateSourcesContent = function(aSources, aSourceRoot) {
        return aSources.map((function(source) {
          if (!this._sourcesContents) return null;
          null != aSourceRoot && (source = util.relative(aSourceRoot, source));
          var key = util.toSetString(source);
          return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
        }), this);
      }, SourceMapGenerator.prototype.toJSON = function() {
        var map = {
          version: this._version,
          sources: this._sources.toArray(),
          names: this._names.toArray(),
          mappings: this._serializeMappings()
        };
        return null != this._file && (map.file = this._file), null != this._sourceRoot && (map.sourceRoot = this._sourceRoot), 
        this._sourcesContents && (map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot)), 
        map;
      }, SourceMapGenerator.prototype.toString = function() {
        return JSON.stringify(this.toJSON());
      }, exports.h = SourceMapGenerator;
    },
    2728: function(__unused_webpack_module, exports) {
      exports.getArg = function(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) return aArgs[aName];
        if (3 === arguments.length) return aDefaultValue;
        throw new Error('"' + aName + '" is a required argument.');
      };
      var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, dataUrlRegexp = /^data:.+\,.+$/;
      function urlParse(aUrl) {
        var match = aUrl.match(urlRegexp);
        return match ? {
          scheme: match[1],
          auth: match[2],
          host: match[3],
          port: match[4],
          path: match[5]
        } : null;
      }
      function urlGenerate(aParsedUrl) {
        var url = "";
        return aParsedUrl.scheme && (url += aParsedUrl.scheme + ":"), url += "//", aParsedUrl.auth && (url += aParsedUrl.auth + "@"), 
        aParsedUrl.host && (url += aParsedUrl.host), aParsedUrl.port && (url += ":" + aParsedUrl.port), 
        aParsedUrl.path && (url += aParsedUrl.path), url;
      }
      function normalize(aPath) {
        var path = aPath, url = urlParse(aPath);
        if (url) {
          if (!url.path) return aPath;
          path = url.path;
        }
        for (var part, isAbsolute = exports.isAbsolute(path), parts = path.split(/\/+/), up = 0, i = parts.length - 1; i >= 0; i--) "." === (part = parts[i]) ? parts.splice(i, 1) : ".." === part ? up++ : up > 0 && ("" === part ? (parts.splice(i + 1, up), 
        up = 0) : (parts.splice(i, 2), up--));
        return "" === (path = parts.join("/")) && (path = isAbsolute ? "/" : "."), url ? (url.path = path, 
        urlGenerate(url)) : path;
      }
      function join(aRoot, aPath) {
        "" === aRoot && (aRoot = "."), "" === aPath && (aPath = ".");
        var aPathUrl = urlParse(aPath), aRootUrl = urlParse(aRoot);
        if (aRootUrl && (aRoot = aRootUrl.path || "/"), aPathUrl && !aPathUrl.scheme) return aRootUrl && (aPathUrl.scheme = aRootUrl.scheme), 
        urlGenerate(aPathUrl);
        if (aPathUrl || aPath.match(dataUrlRegexp)) return aPath;
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) return aRootUrl.host = aPath, 
        urlGenerate(aRootUrl);
        var joined = "/" === aPath.charAt(0) ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
        return aRootUrl ? (aRootUrl.path = joined, urlGenerate(aRootUrl)) : joined;
      }
      exports.urlParse = urlParse, exports.urlGenerate = urlGenerate, exports.normalize = normalize, 
      exports.join = join, exports.isAbsolute = function(aPath) {
        return "/" === aPath.charAt(0) || urlRegexp.test(aPath);
      }, exports.relative = function(aRoot, aPath) {
        "" === aRoot && (aRoot = "."), aRoot = aRoot.replace(/\/$/, "");
        for (var level = 0; 0 !== aPath.indexOf(aRoot + "/"); ) {
          var index = aRoot.lastIndexOf("/");
          if (index < 0) return aPath;
          if ((aRoot = aRoot.slice(0, index)).match(/^([^\/]+:\/)?\/*$/)) return aPath;
          ++level;
        }
        return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
      };
      var supportsNullProto = !("__proto__" in Object.create(null));
      function identity(s) {
        return s;
      }
      function isProtoString(s) {
        if (!s) return !1;
        var length = s.length;
        if (length < 9) return !1;
        if (95 !== s.charCodeAt(length - 1) || 95 !== s.charCodeAt(length - 2) || 111 !== s.charCodeAt(length - 3) || 116 !== s.charCodeAt(length - 4) || 111 !== s.charCodeAt(length - 5) || 114 !== s.charCodeAt(length - 6) || 112 !== s.charCodeAt(length - 7) || 95 !== s.charCodeAt(length - 8) || 95 !== s.charCodeAt(length - 9)) return !1;
        for (var i = length - 10; i >= 0; i--) if (36 !== s.charCodeAt(i)) return !1;
        return !0;
      }
      function strcmp(aStr1, aStr2) {
        return aStr1 === aStr2 ? 0 : null === aStr1 ? 1 : null === aStr2 ? -1 : aStr1 > aStr2 ? 1 : -1;
      }
      exports.toSetString = supportsNullProto ? identity : function(aStr) {
        return isProtoString(aStr) ? "$" + aStr : aStr;
      }, exports.fromSetString = supportsNullProto ? identity : function(aStr) {
        return isProtoString(aStr) ? aStr.slice(1) : aStr;
      }, exports.compareByOriginalPositions = function(mappingA, mappingB, onlyCompareOriginal) {
        var cmp = strcmp(mappingA.source, mappingB.source);
        return 0 !== cmp || 0 !== (cmp = mappingA.originalLine - mappingB.originalLine) || 0 !== (cmp = mappingA.originalColumn - mappingB.originalColumn) || onlyCompareOriginal || 0 !== (cmp = mappingA.generatedColumn - mappingB.generatedColumn) || 0 !== (cmp = mappingA.generatedLine - mappingB.generatedLine) ? cmp : strcmp(mappingA.name, mappingB.name);
      }, exports.compareByGeneratedPositionsDeflated = function(mappingA, mappingB, onlyCompareGenerated) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        return 0 !== cmp || 0 !== (cmp = mappingA.generatedColumn - mappingB.generatedColumn) || onlyCompareGenerated || 0 !== (cmp = strcmp(mappingA.source, mappingB.source)) || 0 !== (cmp = mappingA.originalLine - mappingB.originalLine) || 0 !== (cmp = mappingA.originalColumn - mappingB.originalColumn) ? cmp : strcmp(mappingA.name, mappingB.name);
      }, exports.compareByGeneratedPositionsInflated = function(mappingA, mappingB) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        return 0 !== cmp || 0 !== (cmp = mappingA.generatedColumn - mappingB.generatedColumn) || 0 !== (cmp = strcmp(mappingA.source, mappingB.source)) || 0 !== (cmp = mappingA.originalLine - mappingB.originalLine) || 0 !== (cmp = mappingA.originalColumn - mappingB.originalColumn) ? cmp : strcmp(mappingA.name, mappingB.name);
      }, exports.parseSourceMapInput = function(str) {
        return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
      }, exports.computeSourceURL = function(sourceRoot, sourceURL, sourceMapURL) {
        if (sourceURL = sourceURL || "", sourceRoot && ("/" !== sourceRoot[sourceRoot.length - 1] && "/" !== sourceURL[0] && (sourceRoot += "/"), 
        sourceURL = sourceRoot + sourceURL), sourceMapURL) {
          var parsed = urlParse(sourceMapURL);
          if (!parsed) throw new Error("sourceMapURL could not be parsed");
          if (parsed.path) {
            var index = parsed.path.lastIndexOf("/");
            index >= 0 && (parsed.path = parsed.path.substring(0, index + 1));
          }
          sourceURL = join(urlGenerate(parsed), sourceURL);
        }
        return normalize(sourceURL);
      };
    },
    4900: function(module) {
      "use strict";
      module.exports = JSON.parse('{"properties":{"-moz-background-clip":{"comment":"deprecated syntax in old Firefox, https://developer.mozilla.org/en/docs/Web/CSS/background-clip","syntax":"padding | border"},"-moz-border-radius-bottomleft":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-left-radius","syntax":"<\'border-bottom-left-radius\'>"},"-moz-border-radius-bottomright":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-right-radius","syntax":"<\'border-bottom-right-radius\'>"},"-moz-border-radius-topleft":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-left-radius","syntax":"<\'border-top-left-radius\'>"},"-moz-border-radius-topright":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-right-radius","syntax":"<\'border-bottom-right-radius\'>"},"-moz-control-character-visibility":{"comment":"firefox specific keywords, https://bugzilla.mozilla.org/show_bug.cgi?id=947588","syntax":"visible | hidden"},"-moz-osx-font-smoothing":{"comment":"misssed old syntax https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth","syntax":"auto | grayscale"},"-moz-user-select":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/user-select","syntax":"none | text | all | -moz-none"},"-ms-flex-align":{"comment":"misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-align","syntax":"start | end | center | baseline | stretch"},"-ms-flex-item-align":{"comment":"misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-align","syntax":"auto | start | end | center | baseline | stretch"},"-ms-flex-line-pack":{"comment":"misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-line-pack","syntax":"start | end | center | justify | distribute | stretch"},"-ms-flex-negative":{"comment":"misssed old syntax implemented in IE; TODO: find references for comfirmation","syntax":"<\'flex-shrink\'>"},"-ms-flex-pack":{"comment":"misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-pack","syntax":"start | end | center | justify | distribute"},"-ms-flex-order":{"comment":"misssed old syntax implemented in IE; https://msdn.microsoft.com/en-us/library/jj127303(v=vs.85).aspx","syntax":"<integer>"},"-ms-flex-positive":{"comment":"misssed old syntax implemented in IE; TODO: find references for comfirmation","syntax":"<\'flex-grow\'>"},"-ms-flex-preferred-size":{"comment":"misssed old syntax implemented in IE; TODO: find references for comfirmation","syntax":"<\'flex-basis\'>"},"-ms-interpolation-mode":{"comment":"https://msdn.microsoft.com/en-us/library/ff521095(v=vs.85).aspx","syntax":"nearest-neighbor | bicubic"},"-ms-grid-column-align":{"comment":"add this property first since it uses as fallback for flexbox, https://msdn.microsoft.com/en-us/library/windows/apps/hh466338.aspx","syntax":"start | end | center | stretch"},"-ms-grid-columns":{"comment":"misssed old syntax implemented in IE; https://www.w3.org/TR/2012/WD-css3-grid-layout-20120322/#grid-columns","syntax":"<track-list-v0>"},"-ms-grid-row-align":{"comment":"add this property first since it uses as fallback for flexbox, https://msdn.microsoft.com/en-us/library/windows/apps/hh466348.aspx","syntax":"start | end | center | stretch"},"-ms-grid-rows":{"comment":"misssed old syntax implemented in IE; https://www.w3.org/TR/2012/WD-css3-grid-layout-20120322/#grid-rows","syntax":"<track-list-v0>"},"-ms-hyphenate-limit-last":{"comment":"misssed old syntax implemented in IE; https://www.w3.org/TR/css-text-4/#hyphenate-line-limits","syntax":"none | always | column | page | spread"},"-webkit-appearance":{"comment":"webkit specific keywords","references":["http://css-infos.net/property/-webkit-appearance"],"syntax":"none | button | button-bevel | caps-lock-indicator | caret | checkbox | default-button | listbox | listitem | media-fullscreen-button | media-mute-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | push-button | radio | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbargripper-horizontal | scrollbargripper-vertical | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield"},"-webkit-background-clip":{"comment":"https://developer.mozilla.org/en/docs/Web/CSS/background-clip","syntax":"[ <box> | border | padding | content | text ]#"},"-webkit-column-break-after":{"comment":"added, http://help.dottoro.com/lcrthhhv.php","syntax":"always | auto | avoid"},"-webkit-column-break-before":{"comment":"added, http://help.dottoro.com/lcxquvkf.php","syntax":"always | auto | avoid"},"-webkit-column-break-inside":{"comment":"added, http://help.dottoro.com/lclhnthl.php","syntax":"always | auto | avoid"},"-webkit-font-smoothing":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth","syntax":"auto | none | antialiased | subpixel-antialiased"},"-webkit-mask-box-image":{"comment":"missed; https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-mask-box-image","syntax":"[ <url> | <gradient> | none ] [ <length-percentage>{4} <-webkit-mask-box-repeat>{2} ]?"},"-webkit-print-color-adjust":{"comment":"missed","references":["https://developer.mozilla.org/en/docs/Web/CSS/-webkit-print-color-adjust"],"syntax":"economy | exact"},"-webkit-text-security":{"comment":"missed; http://help.dottoro.com/lcbkewgt.php","syntax":"none | circle | disc | square"},"-webkit-user-drag":{"comment":"missed; http://help.dottoro.com/lcbixvwm.php","syntax":"none | element | auto"},"-webkit-user-select":{"comment":"auto is supported by old webkit, https://developer.mozilla.org/en-US/docs/Web/CSS/user-select","syntax":"auto | none | text | all"},"alignment-baseline":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/text.html#AlignmentBaselineProperty"],"syntax":"auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical"},"baseline-shift":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/text.html#BaselineShiftProperty"],"syntax":"baseline | sub | super | <svg-length>"},"behavior":{"comment":"added old IE property https://msdn.microsoft.com/en-us/library/ms530723(v=vs.85).aspx","syntax":"<url>+"},"clip-rule":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/masking.html#ClipRuleProperty"],"syntax":"nonzero | evenodd"},"cue":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<\'cue-before\'> <\'cue-after\'>?"},"cue-after":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<url> <decibel>? | none"},"cue-before":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<url> <decibel>? | none"},"cursor":{"comment":"added legacy keywords: hand, -webkit-grab. -webkit-grabbing, -webkit-zoom-in, -webkit-zoom-out, -moz-grab, -moz-grabbing, -moz-zoom-in, -moz-zoom-out","references":["https://www.sitepoint.com/css3-cursor-styles/"],"syntax":"[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing | hand | -webkit-grab | -webkit-grabbing | -webkit-zoom-in | -webkit-zoom-out | -moz-grab | -moz-grabbing | -moz-zoom-in | -moz-zoom-out ] ]"},"display":{"comment":"extended with -ms-flexbox","syntax":"block | contents | flex | flow | flow-root | grid | inline | inline-block | inline-flex | inline-grid | inline-list-item | inline-table | list-item | none | ruby | ruby-base | ruby-base-container | ruby-text | ruby-text-container | run-in | table | table-caption | table-cell | table-column | table-column-group | table-footer-group | table-header-group | table-row | table-row-group | -ms-flexbox | -ms-inline-flexbox | -ms-grid | -ms-inline-grid | -webkit-flex | -webkit-inline-flex | -webkit-box | -webkit-inline-box | -moz-inline-stack | -moz-box | -moz-inline-box"},"position":{"comment":"extended with -webkit-sticky","syntax":"static | relative | absolute | sticky | fixed | -webkit-sticky"},"dominant-baseline":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/text.html#DominantBaselineProperty"],"syntax":"auto | use-script | no-change | reset-size | ideographic | alphabetic | hanging | mathematical | central | middle | text-after-edge | text-before-edge"},"image-rendering":{"comment":"extended with <-non-standard-image-rendering>, added SVG keywords optimizeSpeed and optimizeQuality","references":["https://developer.mozilla.org/en/docs/Web/CSS/image-rendering","https://www.w3.org/TR/SVG/painting.html#ImageRenderingProperty"],"syntax":"auto | crisp-edges | pixelated | optimizeSpeed | optimizeQuality | <-non-standard-image-rendering>"},"fill":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#FillProperty"],"syntax":"<paint>"},"fill-opacity":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#FillProperty"],"syntax":"<number-zero-one>"},"fill-rule":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#FillProperty"],"syntax":"nonzero | evenodd"},"filter":{"comment":"extend with IE legacy syntaxes","syntax":"none | <filter-function-list> | <-ms-filter-function-list>"},"glyph-orientation-horizontal":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/text.html#GlyphOrientationHorizontalProperty"],"syntax":"<angle>"},"glyph-orientation-vertical":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/text.html#GlyphOrientationVerticalProperty"],"syntax":"<angle>"},"kerning":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/text.html#KerningProperty"],"syntax":"auto | <svg-length>"},"letter-spacing":{"comment":"fix syntax <length> -> <length-percentage>","references":["https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/letter-spacing"],"syntax":"normal | <length-percentage>"},"marker":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#MarkerProperties"],"syntax":"none | <url>"},"marker-end":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#MarkerProperties"],"syntax":"none | <url>"},"marker-mid":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#MarkerProperties"],"syntax":"none | <url>"},"marker-start":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#MarkerProperties"],"syntax":"none | <url>"},"max-width":{"comment":"extend by non-standard width keywords https://developer.mozilla.org/en-US/docs/Web/CSS/max-width","syntax":"<length> | <percentage> | none | max-content | min-content | fit-content | fill-available | <-non-standard-width>"},"min-width":{"comment":"extend by non-standard width keywords https://developer.mozilla.org/en-US/docs/Web/CSS/width","syntax":"<length> | <percentage> | auto | max-content | min-content | fit-content | fill-available | <-non-standard-width>"},"opacity":{"comment":"strict to 0..1 <number> -> <number-zero-one>","syntax":"<number-zero-one>"},"overflow":{"comment":"extend by vendor keywords https://developer.mozilla.org/en-US/docs/Web/CSS/overflow","syntax":"[ visible | hidden | clip | scroll | auto ]{1,2} | <-non-standard-overflow>"},"pause":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<\'pause-before\'> <\'pause-after\'>?"},"pause-after":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<time> | none | x-weak | weak | medium | strong | x-strong"},"pause-before":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<time> | none | x-weak | weak | medium | strong | x-strong"},"rest":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<\'rest-before\'> <\'rest-after\'>?"},"rest-after":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<time> | none | x-weak | weak | medium | strong | x-strong"},"rest-before":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<time> | none | x-weak | weak | medium | strong | x-strong"},"shape-rendering":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#ShapeRenderingPropert"],"syntax":"auto | optimizeSpeed | crispEdges | geometricPrecision"},"src":{"comment":"added @font-face\'s src property https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src","syntax":"[ <url> [ format( <string># ) ]? | local( <family-name> ) ]#"},"speak":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"auto | none | normal"},"speak-as":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"normal | spell-out || digits || [ literal-punctuation | no-punctuation ]"},"stroke":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#StrokeProperties"],"syntax":"<paint>"},"stroke-dasharray":{"comment":"added SVG property; a list of comma and/or white space separated <length>s and <percentage>s","references":["https://www.w3.org/TR/SVG/painting.html#StrokeProperties"],"syntax":"none | [ <svg-length>+ ]#"},"stroke-dashoffset":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#StrokeProperties"],"syntax":"<svg-length>"},"stroke-linecap":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#StrokeProperties"],"syntax":"butt | round | square"},"stroke-linejoin":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#StrokeProperties"],"syntax":"miter | round | bevel"},"stroke-miterlimit":{"comment":"added SVG property (<miterlimit> = <number-one-or-greater>) ","references":["https://www.w3.org/TR/SVG/painting.html#StrokeProperties"],"syntax":"<number-one-or-greater>"},"stroke-opacity":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#StrokeProperties"],"syntax":"<number-zero-one>"},"stroke-width":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/painting.html#StrokeProperties"],"syntax":"<svg-length>"},"text-anchor":{"comment":"added SVG property","references":["https://www.w3.org/TR/SVG/text.html#TextAlignmentProperties"],"syntax":"start | middle | end"},"unicode-bidi":{"comment":"added prefixed keywords https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi","syntax":"normal | embed | isolate | bidi-override | isolate-override | plaintext | -moz-isolate | -moz-isolate-override | -moz-plaintext | -webkit-isolate"},"unicode-range":{"comment":"added missed property https://developer.mozilla.org/en-US/docs/Web/CSS/%40font-face/unicode-range","syntax":"<urange>#"},"voice-balance":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<number> | left | center | right | leftwards | rightwards"},"voice-duration":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"auto | <time>"},"voice-family":{"comment":"<name> -> <family-name>, https://www.w3.org/TR/css3-speech/#property-index","syntax":"[ [ <family-name> | <generic-voice> ] , ]* [ <family-name> | <generic-voice> ] | preserve"},"voice-pitch":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<frequency> && absolute | [ [ x-low | low | medium | high | x-high ] || [ <frequency> | <semitones> | <percentage> ] ]"},"voice-range":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"<frequency> && absolute | [ [ x-low | low | medium | high | x-high ] || [ <frequency> | <semitones> | <percentage> ] ]"},"voice-rate":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"[ normal | x-slow | slow | medium | fast | x-fast ] || <percentage>"},"voice-stress":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"normal | strong | moderate | none | reduced"},"voice-volume":{"comment":"https://www.w3.org/TR/css3-speech/#property-index","syntax":"silent | [ [ x-soft | soft | medium | loud | x-loud ] || <decibel> ]"},"writing-mode":{"comment":"extend with SVG keywords","syntax":"horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr | <svg-writing-mode>"}},"syntaxes":{"-legacy-gradient":{"comment":"added collection of legacy gradient syntaxes","syntax":"<-webkit-gradient()> | <-legacy-linear-gradient> | <-legacy-repeating-linear-gradient> | <-legacy-radial-gradient> | <-legacy-repeating-radial-gradient>"},"-legacy-linear-gradient":{"comment":"like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient","syntax":"-moz-linear-gradient( <-legacy-linear-gradient-arguments> ) | -webkit-linear-gradient( <-legacy-linear-gradient-arguments> ) | -o-linear-gradient( <-legacy-linear-gradient-arguments> )"},"-legacy-repeating-linear-gradient":{"comment":"like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient","syntax":"-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> ) | -webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> ) | -o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )"},"-legacy-linear-gradient-arguments":{"comment":"like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient","syntax":"[ <angle> | <side-or-corner> ]? , <color-stop-list>"},"-legacy-radial-gradient":{"comment":"deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients","syntax":"-moz-radial-gradient( <-legacy-radial-gradient-arguments> ) | -webkit-radial-gradient( <-legacy-radial-gradient-arguments> ) | -o-radial-gradient( <-legacy-radial-gradient-arguments> )"},"-legacy-repeating-radial-gradient":{"comment":"deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients","syntax":"-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> ) | -webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> ) | -o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )"},"-legacy-radial-gradient-arguments":{"comment":"deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients","syntax":"[ <position> , ]? [ [ [ <-legacy-radial-gradient-shape> || <-legacy-radial-gradient-size> ] | [ <length> | <percentage> ]{2} ] , ]? <color-stop-list>"},"-legacy-radial-gradient-size":{"comment":"before a standard it contains 2 extra keywords (`contain` and `cover`) https://www.w3.org/TR/2011/WD-css3-images-20110908/#ltsize","syntax":"closest-side | closest-corner | farthest-side | farthest-corner | contain | cover"},"-legacy-radial-gradient-shape":{"comment":"define to double sure it doesn\'t extends in future https://www.w3.org/TR/2011/WD-css3-images-20110908/#ltshape","syntax":"circle | ellipse"},"-non-standard-font":{"comment":"non standard fonts","references":["https://webkit.org/blog/3709/using-the-system-font-in-web-content/"],"syntax":"-apple-system-body | -apple-system-headline | -apple-system-subheadline | -apple-system-caption1 | -apple-system-caption2 | -apple-system-footnote | -apple-system-short-body | -apple-system-short-headline | -apple-system-short-subheadline | -apple-system-short-caption1 | -apple-system-short-footnote | -apple-system-tall-body"},"-non-standard-color":{"comment":"non standard colors","references":["http://cssdot.ru/%D0%A1%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D1%87%D0%BD%D0%B8%D0%BA_CSS/color-i305.html","https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Mozilla_Color_Preference_Extensions"],"syntax":"-moz-ButtonDefault | -moz-ButtonHoverFace | -moz-ButtonHoverText | -moz-CellHighlight | -moz-CellHighlightText | -moz-Combobox | -moz-ComboboxText | -moz-Dialog | -moz-DialogText | -moz-dragtargetzone | -moz-EvenTreeRow | -moz-Field | -moz-FieldText | -moz-html-CellHighlight | -moz-html-CellHighlightText | -moz-mac-accentdarkestshadow | -moz-mac-accentdarkshadow | -moz-mac-accentface | -moz-mac-accentlightesthighlight | -moz-mac-accentlightshadow | -moz-mac-accentregularhighlight | -moz-mac-accentregularshadow | -moz-mac-chrome-active | -moz-mac-chrome-inactive | -moz-mac-focusring | -moz-mac-menuselect | -moz-mac-menushadow | -moz-mac-menutextselect | -moz-MenuHover | -moz-MenuHoverText | -moz-MenuBarText | -moz-MenuBarHoverText | -moz-nativehyperlinktext | -moz-OddTreeRow | -moz-win-communicationstext | -moz-win-mediatext | -moz-activehyperlinktext | -moz-default-background-color | -moz-default-color | -moz-hyperlinktext | -moz-visitedhyperlinktext | -webkit-activelink | -webkit-focus-ring-color | -webkit-link | -webkit-text"},"-non-standard-image-rendering":{"comment":"non-standard keywords http://phrogz.net/tmp/canvas_image_zoom.html","syntax":"optimize-contrast | -moz-crisp-edges | -o-crisp-edges | -webkit-optimize-contrast"},"-non-standard-overflow":{"comment":"non-standard keywords https://developer.mozilla.org/en-US/docs/Web/CSS/overflow","syntax":"-moz-scrollbars-none | -moz-scrollbars-horizontal | -moz-scrollbars-vertical | -moz-hidden-unscrollable"},"-non-standard-width":{"comment":"non-standard keywords https://developer.mozilla.org/en-US/docs/Web/CSS/width","syntax":"min-intrinsic | intrinsic | -moz-min-content | -moz-max-content | -webkit-min-content | -webkit-max-content"},"-webkit-gradient()":{"comment":"first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/ - TODO: simplify when after match algorithm improvement ( [, point, radius | , point] -> [, radius]? , point )","syntax":"-webkit-gradient( <-webkit-gradient-type>, <-webkit-gradient-point> [, <-webkit-gradient-point> | , <-webkit-gradient-radius>, <-webkit-gradient-point> ] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )"},"-webkit-gradient-color-stop":{"comment":"first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/","syntax":"from( <color> ) | color-stop( [ <number-zero-one> | <percentage> ] , <color> ) | to( <color> )"},"-webkit-gradient-point":{"comment":"first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/","syntax":"[ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]"},"-webkit-gradient-radius":{"comment":"first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/","syntax":"<length> | <percentage>"},"-webkit-gradient-type":{"comment":"first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/","syntax":"linear | radial"},"-webkit-mask-box-repeat":{"comment":"missed; https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-mask-box-image","syntax":"repeat | stretch | round"},"-webkit-mask-clip-style":{"comment":"missed; there is no enough information about `-webkit-mask-clip` property, but looks like all those keywords are working","syntax":"border | border-box | padding | padding-box | content | content-box | text"},"-ms-filter-function-list":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter","syntax":"<-ms-filter-function>+"},"-ms-filter-function":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter","syntax":"<-ms-filter-function-progid> | <-ms-filter-function-legacy>"},"-ms-filter-function-progid":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter","syntax":"\'progid:\' [ <ident-token> \'.\' ]* [ <ident-token> | <function-token> <any-value>? ) ]"},"-ms-filter-function-legacy":{"comment":"https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter","syntax":"<ident-token> | <function-token> <any-value>? )"},"-ms-filter":{"syntax":"<string>"},"age":{"comment":"https://www.w3.org/TR/css3-speech/#voice-family","syntax":"child | young | old"},"attr-name":{"syntax":"<wq-name>"},"attr-fallback":{"syntax":"<any-value>"},"border-radius":{"comment":"missed, https://drafts.csswg.org/css-backgrounds-3/#the-border-radius","syntax":"<length-percentage>{1,2}"},"bottom":{"comment":"missed; not sure we should add it, but no others except `shape` is using it so it\'s ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect","syntax":"<length> | auto"},"content-list":{"comment":"missed -> https://drafts.csswg.org/css-content/#typedef-content-list (document-url, <target> and leader() is omitted util stabilization)","syntax":"[ <string> | contents | <url> | <quote> | <attr()> | counter( <ident>, <\'list-style-type\'>? ) ]+"},"generic-voice":{"comment":"https://www.w3.org/TR/css3-speech/#voice-family","syntax":"[ <age>? <gender> <integer>? ]"},"gender":{"comment":"https://www.w3.org/TR/css3-speech/#voice-family","syntax":"male | female | neutral"},"generic-family":{"comment":"added -apple-system","references":["https://webkit.org/blog/3709/using-the-system-font-in-web-content/"],"syntax":"serif | sans-serif | cursive | fantasy | monospace | -apple-system"},"gradient":{"comment":"added legacy syntaxes support","syntax":"<linear-gradient()> | <repeating-linear-gradient()> | <radial-gradient()> | <repeating-radial-gradient()> | <conic-gradient()> | <-legacy-gradient>"},"left":{"comment":"missed; not sure we should add it, but no others except `shape` is using it so it\'s ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect","syntax":"<length> | auto"},"mask-image":{"comment":"missed; https://drafts.fxtf.org/css-masking-1/#the-mask-image","syntax":"<mask-reference>#"},"name-repeat":{"comment":"missed, and looks like obsolete, keep it as is since other property syntaxes should be changed too; https://www.w3.org/TR/2015/WD-css-grid-1-20150917/#typedef-name-repeat","syntax":"repeat( [ <positive-integer> | auto-fill ], <line-names>+)"},"named-color":{"comment":"added non standard color names","syntax":"transparent | aliceblue | antiquewhite | aqua | aquamarine | azure | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | cadetblue | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | green | greenyellow | grey | honeydew | hotpink | indianred | indigo | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | magenta | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | seagreen | seashell | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | tomato | turquoise | violet | wheat | white | whitesmoke | yellow | yellowgreen | <-non-standard-color>"},"paint":{"comment":"used by SVG https://www.w3.org/TR/SVG/painting.html#SpecifyingPaint","syntax":"none | <color> | <url> [ none | <color> ]? | context-fill | context-stroke"},"path()":{"comment":"missed, `motion` property was renamed, but left it as is for now; path() syntax was get from last draft https://drafts.fxtf.org/motion-1/#funcdef-offset-path-path","syntax":"path( <string> )"},"ratio":{"comment":"missed, https://drafts.csswg.org/mediaqueries-4/#typedef-ratio","syntax":"<integer> / <integer>"},"right":{"comment":"missed; not sure we should add it, but no others except `shape` is using it so it\'s ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect","syntax":"<length> | auto"},"shape":{"comment":"missed spaces in function body and add backwards compatible syntax","syntax":"rect( <top>, <right>, <bottom>, <left> ) | rect( <top> <right> <bottom> <left> )"},"svg-length":{"comment":"All coordinates and lengths in SVG can be specified with or without a unit identifier","references":["https://www.w3.org/TR/SVG11/coords.html#Units"],"syntax":"<percentage> | <length> | <number>"},"svg-writing-mode":{"comment":"SVG specific keywords (deprecated for CSS)","references":["https://developer.mozilla.org/en/docs/Web/CSS/writing-mode","https://www.w3.org/TR/SVG/text.html#WritingModeProperty"],"syntax":"lr-tb | rl-tb | tb-rl | lr | rl | tb"},"top":{"comment":"missed; not sure we should add it, but no others except `shape` is using it so it\'s ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect","syntax":"<length> | auto"},"track-group":{"comment":"used by old grid-columns and grid-rows syntax v0","syntax":"\'(\' [ <string>* <track-minmax> <string>* ]+ \')\' [ \'[\' <positive-integer> \']\' ]? | <track-minmax>"},"track-list-v0":{"comment":"used by old grid-columns and grid-rows syntax v0","syntax":"[ <string>* <track-group> <string>* ]+ | none"},"track-minmax":{"comment":"used by old grid-columns and grid-rows syntax v0","syntax":"minmax( <track-breadth> , <track-breadth> ) | auto | <track-breadth> | fit-content"},"x":{"comment":"missed; not sure we should add it, but no others except `cursor` is using it so it\'s ok for now; https://drafts.csswg.org/css-ui-3/#cursor","syntax":"<number>"},"y":{"comment":"missed; not sure we should add it, but no others except `cursor` is using so it\'s ok for now; https://drafts.csswg.org/css-ui-3/#cursor","syntax":"<number>"},"declaration":{"comment":"missed, restored by https://drafts.csswg.org/css-syntax","syntax":"<ident-token> : <declaration-value>? [ \'!\' important ]?"},"declaration-list":{"comment":"missed, restored by https://drafts.csswg.org/css-syntax","syntax":"[ <declaration>? \';\' ]* <declaration>?"},"url":{"comment":"https://drafts.csswg.org/css-values-4/#urls","syntax":"url( <string> <url-modifier>* ) | <url-token>"},"url-modifier":{"comment":"https://drafts.csswg.org/css-values-4/#typedef-url-modifier","syntax":"<ident> | <function-token> <any-value> )"},"number-zero-one":{"syntax":"<number [0,1]>"},"number-one-or-greater":{"syntax":"<number [1,∞]>"},"positive-integer":{"syntax":"<integer [0,∞]>"}}}');
    },
    4518: function(module) {
      "use strict";
      module.exports = JSON.parse('{"@charset":{"syntax":"@charset \\"<charset>\\";","groups":["CSS Charsets"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@charset"},"@counter-style":{"syntax":"@counter-style <counter-style-name> {\\n  [ system: <counter-system>; ] ||\\n  [ symbols: <counter-symbols>; ] ||\\n  [ additive-symbols: <additive-symbols>; ] ||\\n  [ negative: <negative-symbol>; ] ||\\n  [ prefix: <prefix>; ] ||\\n  [ suffix: <suffix>; ] ||\\n  [ range: <range>; ] ||\\n  [ pad: <padding>; ] ||\\n  [ speak-as: <speak-as>; ] ||\\n  [ fallback: <counter-style-name>; ]\\n}","interfaces":["CSSCounterStyleRule"],"groups":["CSS Counter Styles"],"descriptors":{"additive-symbols":{"syntax":"[ <integer> && <symbol> ]#","media":"all","initial":"N/A","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"},"fallback":{"syntax":"<counter-style-name>","media":"all","initial":"decimal","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"negative":{"syntax":"<symbol> <symbol>?","media":"all","initial":"\\"-\\" hyphen-minus","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"},"pad":{"syntax":"<integer> && <symbol>","media":"all","initial":"0 \\"\\"","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"prefix":{"syntax":"<symbol>","media":"all","initial":"\\"\\"","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"range":{"syntax":"[ [ <integer> | infinite ]{2} ]# | auto","media":"all","initial":"auto","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"},"speak-as":{"syntax":"auto | bullets | numbers | words | spell-out | <counter-style-name>","media":"all","initial":"auto","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"suffix":{"syntax":"<symbol>","media":"all","initial":"\\". \\"","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"symbols":{"syntax":"<symbol>+","media":"all","initial":"N/A","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"},"system":{"syntax":"cyclic | numeric | alphabetic | symbolic | additive | [ fixed <integer>? ] | [ extends <counter-style-name> ]","media":"all","initial":"symbolic","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"}},"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@counter-style"},"@document":{"syntax":"@document [ <url> | url-prefix(<string>) | domain(<string>) | media-document(<string>) | regexp(<string>) ]# {\\n  <group-rule-body>\\n}","interfaces":["CSSGroupingRule","CSSConditionRule"],"groups":["CSS Conditional Rules"],"status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@document"},"@font-face":{"syntax":"@font-face {\\n  [ font-family: <family-name>; ] ||\\n  [ src: <src>; ] ||\\n  [ unicode-range: <unicode-range>; ] ||\\n  [ font-variant: <font-variant>; ] ||\\n  [ font-feature-settings: <font-feature-settings>; ] ||\\n  [ font-variation-settings: <font-variation-settings>; ] ||\\n  [ font-stretch: <font-stretch>; ] ||\\n  [ font-weight: <font-weight>; ] ||\\n  [ font-style: <font-style>; ]\\n}","interfaces":["CSSFontFaceRule"],"groups":["CSS Fonts"],"descriptors":{"font-display":{"syntax":"[ auto | block | swap | fallback | optional ]","media":"visual","percentages":"no","initial":"auto","computed":"asSpecified","order":"uniqueOrder","status":"experimental"},"font-family":{"syntax":"<family-name>","media":"all","initial":"n/a (required)","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"font-feature-settings":{"syntax":"normal | <feature-tag-value>#","media":"all","initial":"normal","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"},"font-variation-settings":{"syntax":"normal | [ <string> <number> ]#","media":"all","initial":"normal","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"},"font-stretch":{"syntax":"<font-stretch-absolute>{1,2}","media":"all","initial":"normal","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"font-style":{"syntax":"normal | italic | oblique <angle>{0,2}","media":"all","initial":"normal","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"font-weight":{"syntax":"<font-weight-absolute>{1,2}","media":"all","initial":"normal","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"font-variant":{"syntax":"normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic(<feature-value-name>) || historical-forms || styleset(<feature-value-name>#) || character-variant(<feature-value-name>#) || swash(<feature-value-name>) || ornaments(<feature-value-name>) || annotation(<feature-value-name>) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]","media":"all","initial":"normal","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"},"src":{"syntax":"[ <url> [ format( <string># ) ]? | local( <family-name> ) ]#","media":"all","initial":"n/a (required)","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"},"unicode-range":{"syntax":"<unicode-range>#","media":"all","initial":"U+0-10FFFF","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"standard"}},"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@font-face"},"@font-feature-values":{"syntax":"@font-feature-values <family-name># {\\n  <feature-value-block-list>\\n}","interfaces":["CSSFontFeatureValuesRule"],"groups":["CSS Fonts"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@font-feature-values"},"@import":{"syntax":"@import [ <string> | <url> ] [ <media-query-list> ]?;","groups":["Media Queries"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@import"},"@keyframes":{"syntax":"@keyframes <keyframes-name> {\\n  <keyframe-block-list>\\n}","interfaces":["CSSKeyframeRule","CSSKeyframesRule"],"groups":["CSS Animations"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@keyframes"},"@media":{"syntax":"@media <media-query-list> {\\n  <group-rule-body>\\n}","interfaces":["CSSGroupingRule","CSSConditionRule","CSSMediaRule","CSSCustomMediaRule"],"groups":["CSS Conditional Rules","Media Queries"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@media"},"@namespace":{"syntax":"@namespace <namespace-prefix>? [ <string> | <url> ];","groups":["CSS Namespaces"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@namespace"},"@page":{"syntax":"@page <page-selector-list> {\\n  <page-body>\\n}","interfaces":["CSSPageRule"],"groups":["CSS Pages"],"descriptors":{"bleed":{"syntax":"auto | <length>","media":["visual","paged"],"initial":"auto","percentages":"no","computed":"asSpecified","order":"uniqueOrder","status":"experimental"},"marks":{"syntax":"none | [ crop || cross ]","media":["visual","paged"],"initial":"none","percentages":"no","computed":"asSpecified","order":"orderOfAppearance","status":"experimental"}},"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@page"},"@supports":{"syntax":"@supports <supports-condition> {\\n  <group-rule-body>\\n}","interfaces":["CSSGroupingRule","CSSConditionRule","CSSSupportsRule"],"groups":["CSS Conditional Rules"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@supports"},"@viewport":{"syntax":"@viewport {\\n  <group-rule-body>\\n}","interfaces":["CSSViewportRule"],"groups":["CSS Device Adaptation"],"descriptors":{"height":{"syntax":"<viewport-length>{1,2}","media":["visual","continuous"],"initial":["min-height","max-height"],"percentages":["min-height","max-height"],"computed":["min-height","max-height"],"order":"orderOfAppearance","status":"standard"},"max-height":{"syntax":"<viewport-length>","media":["visual","continuous"],"initial":"auto","percentages":"referToHeightOfInitialViewport","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard"},"max-width":{"syntax":"<viewport-length>","media":["visual","continuous"],"initial":"auto","percentages":"referToWidthOfInitialViewport","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard"},"max-zoom":{"syntax":"auto | <number> | <percentage>","media":["visual","continuous"],"initial":"auto","percentages":"the zoom factor itself","computed":"autoNonNegativeOrPercentage","order":"uniqueOrder","status":"standard"},"min-height":{"syntax":"<viewport-length>","media":["visual","continuous"],"initial":"auto","percentages":"referToHeightOfInitialViewport","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard"},"min-width":{"syntax":"<viewport-length>","media":["visual","continuous"],"initial":"auto","percentages":"referToWidthOfInitialViewport","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard"},"min-zoom":{"syntax":"auto | <number> | <percentage>","media":["visual","continuous"],"initial":"auto","percentages":"the zoom factor itself","computed":"autoNonNegativeOrPercentage","order":"uniqueOrder","status":"standard"},"orientation":{"syntax":"auto | portrait | landscape","media":["visual","continuous"],"initial":"auto","percentages":"referToSizeOfBoundingBox","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"user-zoom":{"syntax":"zoom | fixed","media":["visual","continuous"],"initial":"zoom","percentages":"referToSizeOfBoundingBox","computed":"asSpecified","order":"uniqueOrder","status":"standard"},"width":{"syntax":"<viewport-length>{1,2}","media":["visual","continuous"],"initial":["min-width","max-width"],"percentages":["min-width","max-width"],"computed":["min-width","max-width"],"order":"orderOfAppearance","status":"standard"},"zoom":{"syntax":"auto | <number> | <percentage>","media":["visual","continuous"],"initial":"auto","percentages":"the zoom factor itself","computed":"autoNonNegativeOrPercentage","order":"uniqueOrder","status":"standard"}},"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/@viewport"}}');
    },
    3050: function(module) {
      "use strict";
      module.exports = JSON.parse('{"--*":{"syntax":"<declaration-value>","media":"all","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Variables"],"initial":"seeProse","appliesto":"allElements","computed":"asSpecifiedWithVarsSubstituted","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/--*"},"-ms-accelerator":{"syntax":"false | true","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"false","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-accelerator"},"-ms-block-progression":{"syntax":"tb | rl | bt | lr","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"tb","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-block-progression"},"-ms-content-zoom-chaining":{"syntax":"none | chained","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"none","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-chaining"},"-ms-content-zooming":{"syntax":"none | zoom","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"zoomForTheTopLevelNoneForTheRest","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-content-zooming"},"-ms-content-zoom-limit":{"syntax":"<\'-ms-content-zoom-limit-min\'> <\'-ms-content-zoom-limit-max\'>","media":"interactive","inherited":false,"animationType":"discrete","percentages":["-ms-content-zoom-limit-max","-ms-content-zoom-limit-min"],"groups":["Microsoft Extensions"],"initial":["-ms-content-zoom-limit-max","-ms-content-zoom-limit-min"],"appliesto":"nonReplacedBlockAndInlineBlockElements","computed":["-ms-content-zoom-limit-max","-ms-content-zoom-limit-min"],"order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-limit"},"-ms-content-zoom-limit-max":{"syntax":"<percentage>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"maxZoomFactor","groups":["Microsoft Extensions"],"initial":"400%","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-limit-max"},"-ms-content-zoom-limit-min":{"syntax":"<percentage>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"minZoomFactor","groups":["Microsoft Extensions"],"initial":"100%","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-limit-min"},"-ms-content-zoom-snap":{"syntax":"<\'-ms-content-zoom-snap-type\'> || <\'-ms-content-zoom-snap-points\'>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":["-ms-content-zoom-snap-type","-ms-content-zoom-snap-points"],"appliesto":"nonReplacedBlockAndInlineBlockElements","computed":["-ms-content-zoom-snap-type","-ms-content-zoom-snap-points"],"order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-snap"},"-ms-content-zoom-snap-points":{"syntax":"snapInterval( <percentage>, <percentage> ) | snapList( <percentage># )","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"snapInterval(0%, 100%)","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-snap-points"},"-ms-content-zoom-snap-type":{"syntax":"none | proximity | mandatory","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"none","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-snap-type"},"-ms-filter":{"syntax":"<string>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"\\"\\"","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-filter"},"-ms-flow-from":{"syntax":"[ none | <custom-ident> ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"none","appliesto":"nonReplacedElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-flow-from"},"-ms-flow-into":{"syntax":"[ none | <custom-ident> ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"none","appliesto":"iframeElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-flow-into"},"-ms-high-contrast-adjust":{"syntax":"auto | none","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-high-contrast-adjust"},"-ms-hyphenate-limit-chars":{"syntax":"auto | <integer>{1,3}","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-hyphenate-limit-chars"},"-ms-hyphenate-limit-lines":{"syntax":"no-limit | <integer>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"no-limit","appliesto":"blockContainerElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-hyphenate-limit-lines"},"-ms-hyphenate-limit-zone":{"syntax":"<percentage> | <length>","media":"visual","inherited":true,"animationType":"discrete","percentages":"referToLineBoxWidth","groups":["Microsoft Extensions"],"initial":"0","appliesto":"blockContainerElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-hyphenate-limit-zone"},"-ms-ime-align":{"syntax":"auto | after","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-ime-align"},"-ms-overflow-style":{"syntax":"auto | none | scrollbar | -ms-autohiding-scrollbar","media":"interactive","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"auto","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-overflow-style"},"-ms-scrollbar-3dlight-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"dependsOnUserAgent","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-3dlight-color"},"-ms-scrollbar-arrow-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"ButtonText","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-arrow-color"},"-ms-scrollbar-base-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"dependsOnUserAgent","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-base-color"},"-ms-scrollbar-darkshadow-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"ThreeDDarkShadow","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-darkshadow-color"},"-ms-scrollbar-face-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"ThreeDFace","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-face-color"},"-ms-scrollbar-highlight-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"ThreeDHighlight","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-highlight-color"},"-ms-scrollbar-shadow-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"ThreeDDarkShadow","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-shadow-color"},"-ms-scrollbar-track-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"Scrollbar","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-track-color"},"-ms-scroll-chaining":{"syntax":"chained | none","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"chained","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-chaining"},"-ms-scroll-limit":{"syntax":"<\'-ms-scroll-limit-x-min\'> <\'-ms-scroll-limit-y-min\'> <\'-ms-scroll-limit-x-max\'> <\'-ms-scroll-limit-y-max\'>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":["-ms-scroll-limit-x-min","-ms-scroll-limit-y-min","-ms-scroll-limit-x-max","-ms-scroll-limit-y-max"],"appliesto":"nonReplacedBlockAndInlineBlockElements","computed":["-ms-scroll-limit-x-min","-ms-scroll-limit-y-min","-ms-scroll-limit-x-max","-ms-scroll-limit-y-max"],"order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit"},"-ms-scroll-limit-x-max":{"syntax":"auto | <length>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"auto","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit-x-max"},"-ms-scroll-limit-x-min":{"syntax":"<length>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"0","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit-x-min"},"-ms-scroll-limit-y-max":{"syntax":"auto | <length>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"auto","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit-y-max"},"-ms-scroll-limit-y-min":{"syntax":"<length>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"0","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit-y-min"},"-ms-scroll-rails":{"syntax":"none | railed","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"railed","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-rails"},"-ms-scroll-snap-points-x":{"syntax":"snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"snapInterval(0px, 100%)","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-points-x"},"-ms-scroll-snap-points-y":{"syntax":"snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"snapInterval(0px, 100%)","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-points-y"},"-ms-scroll-snap-type":{"syntax":"none | proximity | mandatory","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"none","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-type"},"-ms-scroll-snap-x":{"syntax":"<\'-ms-scroll-snap-type\'> <\'-ms-scroll-snap-points-x\'>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":["-ms-scroll-snap-type","-ms-scroll-snap-points-x"],"appliesto":"nonReplacedBlockAndInlineBlockElements","computed":["-ms-scroll-snap-type","-ms-scroll-snap-points-x"],"order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-x"},"-ms-scroll-snap-y":{"syntax":"<\'-ms-scroll-snap-type\'> <\'-ms-scroll-snap-points-y\'>","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":["-ms-scroll-snap-type","-ms-scroll-snap-points-y"],"appliesto":"nonReplacedBlockAndInlineBlockElements","computed":["-ms-scroll-snap-type","-ms-scroll-snap-points-y"],"order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-y"},"-ms-scroll-translation":{"syntax":"none | vertical-to-horizontal","media":"interactive","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-translation"},"-ms-text-autospace":{"syntax":"none | ideograph-alpha | ideograph-numeric | ideograph-parenthesis | ideograph-space","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-text-autospace"},"-ms-touch-select":{"syntax":"grippers | none","media":"interactive","inherited":true,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"grippers","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-touch-select"},"-ms-user-select":{"syntax":"none | element | text","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"text","appliesto":"nonReplacedElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-user-select"},"-ms-wrap-flow":{"syntax":"auto | both | start | end | maximum | clear","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"auto","appliesto":"blockLevelElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-wrap-flow"},"-ms-wrap-margin":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"0","appliesto":"exclusionElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-wrap-margin"},"-ms-wrap-through":{"syntax":"wrap | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Microsoft Extensions"],"initial":"wrap","appliesto":"blockLevelElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-ms-wrap-through"},"-moz-appearance":{"syntax":"none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"noneButOverriddenInUserAgentCSS","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-appearance"},"-moz-binding":{"syntax":"<url> | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"none","appliesto":"allElementsExceptGeneratedContentOrPseudoElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-binding"},"-moz-border-bottom-colors":{"syntax":"<color>+ | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-border-bottom-colors"},"-moz-border-left-colors":{"syntax":"<color>+ | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-border-left-colors"},"-moz-border-right-colors":{"syntax":"<color>+ | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-border-right-colors"},"-moz-border-top-colors":{"syntax":"<color>+ | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-border-top-colors"},"-moz-context-properties":{"syntax":"none | [ fill | fill-opacity | stroke | stroke-opacity ]#","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"none","appliesto":"allElementsThatCanReferenceImages","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-context-properties"},"-moz-float-edge":{"syntax":"border-box | content-box | margin-box | padding-box","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"content-box","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-float-edge"},"-moz-force-broken-image-icon":{"syntax":"<integer>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"0","appliesto":"images","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-force-broken-image-icon"},"-moz-image-region":{"syntax":"<shape> | auto","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"auto","appliesto":"xulImageElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-image-region"},"-moz-orient":{"syntax":"inline | block | horizontal | vertical","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"inline","appliesto":"anyElementEffectOnProgressAndMeter","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-orient"},"-moz-outline-radius":{"syntax":"<outline-radius>{1,4} [ / <outline-radius>{1,4} ]?","media":"visual","inherited":false,"animationType":["-moz-outline-radius-topleft","-moz-outline-radius-topright","-moz-outline-radius-bottomright","-moz-outline-radius-bottomleft"],"percentages":["-moz-outline-radius-topleft","-moz-outline-radius-topright","-moz-outline-radius-bottomright","-moz-outline-radius-bottomleft"],"groups":["Mozilla Extensions"],"initial":["-moz-outline-radius-topleft","-moz-outline-radius-topright","-moz-outline-radius-bottomright","-moz-outline-radius-bottomleft"],"appliesto":"allElements","computed":["-moz-outline-radius-topleft","-moz-outline-radius-topright","-moz-outline-radius-bottomright","-moz-outline-radius-bottomleft"],"order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius"},"-moz-outline-radius-bottomleft":{"syntax":"<outline-radius>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["Mozilla Extensions"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius-bottomleft"},"-moz-outline-radius-bottomright":{"syntax":"<outline-radius>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["Mozilla Extensions"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius-bottomright"},"-moz-outline-radius-topleft":{"syntax":"<outline-radius>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["Mozilla Extensions"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius-topleft"},"-moz-outline-radius-topright":{"syntax":"<outline-radius>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["Mozilla Extensions"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius-topright"},"-moz-stack-sizing":{"syntax":"ignore | stretch-to-fit","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"stretch-to-fit","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-stack-sizing"},"-moz-text-blink":{"syntax":"none | blink","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-text-blink"},"-moz-user-focus":{"syntax":"ignore | normal | select-after | select-before | select-menu | select-same | select-all | none","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-user-focus"},"-moz-user-input":{"syntax":"auto | none | enabled | disabled","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-user-input"},"-moz-user-modify":{"syntax":"read-only | read-write | write-only","media":"interactive","inherited":true,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"read-only","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-user-modify"},"-moz-window-dragging":{"syntax":"drag | no-drag","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"drag","appliesto":"allElementsCreatingNativeWindows","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-window-dragging"},"-moz-window-shadow":{"syntax":"default | menu | tooltip | sheet | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"default","appliesto":"allElementsCreatingNativeWindows","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-window-shadow"},"-webkit-appearance":{"syntax":"none | button | button-bevel | caret | checkbox | default-button | inner-spin-button | listbox | listitem | media-controls-background | media-controls-fullscreen-background | media-current-time-display | media-enter-fullscreen-button | media-exit-fullscreen-button | media-fullscreen-button | media-mute-button | media-overlay-play-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | media-time-remaining-display | media-toggle-closed-captions-button | media-volume-slider | media-volume-slider-container | media-volume-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | meter | progress-bar | progress-bar-value | push-button | radio | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"noneButOverriddenInUserAgentCSS","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-appearance"},"-webkit-border-before":{"syntax":"<\'border-width\'> || <\'border-style\'> || <\'color\'>","media":"visual","inherited":true,"animationType":"discrete","percentages":["-webkit-border-before-width"],"groups":["WebKit Extensions"],"initial":["border-width","border-style","color"],"appliesto":"allElements","computed":["border-width","border-style","color"],"order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-border-before"},"-webkit-border-before-color":{"syntax":"<\'color\'>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"nonstandard"},"-webkit-border-before-style":{"syntax":"<\'border-style\'>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard"},"-webkit-border-before-width":{"syntax":"<\'border-width\'>","media":"visual","inherited":true,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["WebKit Extensions"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthZeroIfBorderStyleNoneOrHidden","order":"uniqueOrder","status":"nonstandard"},"-webkit-box-reflect":{"syntax":"[ above | below | right | left ]? <length>? <image>?","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-box-reflect"},"-webkit-line-clamp":{"syntax":"none | <integer>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["WebKit Extensions","CSS Overflow"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-line-clamp"},"-webkit-mask":{"syntax":"[ <mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || [ <box> | border | padding | content | text ] || [ <box> | border | padding | content ] ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":["-webkit-mask-image","-webkit-mask-repeat","-webkit-mask-attachment","-webkit-mask-position","-webkit-mask-origin","-webkit-mask-clip"],"appliesto":"allElements","computed":["-webkit-mask-image","-webkit-mask-repeat","-webkit-mask-attachment","-webkit-mask-position","-webkit-mask-origin","-webkit-mask-clip"],"order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask"},"-webkit-mask-attachment":{"syntax":"<attachment>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"scroll","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-attachment"},"-webkit-mask-clip":{"syntax":"[ <box> | border | padding | content | text ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"border","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-clip"},"-webkit-mask-composite":{"syntax":"<composite-style>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"source-over","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-composite"},"-webkit-mask-image":{"syntax":"<mask-reference>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"none","appliesto":"allElements","computed":"absoluteURIOrNone","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-image"},"-webkit-mask-origin":{"syntax":"[ <box> | border | padding | content ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"padding","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-origin"},"-webkit-mask-position":{"syntax":"<position>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"referToSizeOfElement","groups":["WebKit Extensions"],"initial":"0% 0%","appliesto":"allElements","computed":"absoluteLengthOrPercentage","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-position"},"-webkit-mask-position-x":{"syntax":"[ <length-percentage> | left | center | right ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"referToSizeOfElement","groups":["WebKit Extensions"],"initial":"0%","appliesto":"allElements","computed":"absoluteLengthOrPercentage","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-position-x"},"-webkit-mask-position-y":{"syntax":"[ <length-percentage> | top | center | bottom ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"referToSizeOfElement","groups":["WebKit Extensions"],"initial":"0%","appliesto":"allElements","computed":"absoluteLengthOrPercentage","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-position-y"},"-webkit-mask-repeat":{"syntax":"<repeat-style>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"repeat","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-repeat"},"-webkit-mask-repeat-x":{"syntax":"repeat | no-repeat | space | round","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"repeat","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-repeat-x"},"-webkit-mask-repeat-y":{"syntax":"repeat | no-repeat | space | round","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"repeat","appliesto":"allElements","computed":"absoluteLengthOrPercentage","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-repeat-y"},"-webkit-mask-size":{"syntax":"<bg-size>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"relativeToBackgroundPositioningArea","groups":["WebKit Extensions"],"initial":"auto auto","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-size"},"-webkit-overflow-scrolling":{"syntax":"auto | touch","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"auto","appliesto":"scrollingBoxes","computed":"asSpecified","order":"orderOfAppearance","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-overflow-scrolling"},"-webkit-tap-highlight-color":{"syntax":"<color>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"black","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-tap-highlight-color"},"-webkit-text-fill-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"color","percentages":"no","groups":["WebKit Extensions"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-text-fill-color"},"-webkit-text-stroke":{"syntax":"<length> || <color>","media":"visual","inherited":true,"animationType":["-webkit-text-stroke-width","-webkit-text-stroke-color"],"percentages":"no","groups":["WebKit Extensions"],"initial":["-webkit-text-stroke-width","-webkit-text-stroke-color"],"appliesto":"allElements","computed":["-webkit-text-stroke-width","-webkit-text-stroke-color"],"order":"canonicalOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke"},"-webkit-text-stroke-color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"color","percentages":"no","groups":["WebKit Extensions"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke-color"},"-webkit-text-stroke-width":{"syntax":"<length>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"0","appliesto":"allElements","computed":"absoluteLength","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke-width"},"-webkit-touch-callout":{"syntax":"default | none","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"default","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-webkit-touch-callout"},"-webkit-user-modify":{"syntax":"read-only | read-write | read-write-plaintext-only","media":"interactive","inherited":true,"animationType":"discrete","percentages":"no","groups":["WebKit Extensions"],"initial":"read-only","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard"},"align-content":{"syntax":"normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":"normal","appliesto":"multilineFlexContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/align-content"},"align-items":{"syntax":"normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ]","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/align-items"},"align-self":{"syntax":"auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":"auto","appliesto":"flexItemsGridItemsAndAbsolutelyPositionedBoxes","computed":"autoOnAbsolutelyPositionedElementsValueOfAlignItemsOnParent","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/align-self"},"all":{"syntax":"initial | inherit | unset | revert","media":"noPracticalMedia","inherited":false,"animationType":"eachOfShorthandPropertiesExceptUnicodeBiDiAndDirection","percentages":"no","groups":["CSS Miscellaneous"],"initial":"noPracticalInitialValue","appliesto":"allElements","computed":"asSpecifiedAppliesToEachProperty","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/all"},"animation":{"syntax":"<single-animation>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":["animation-name","animation-duration","animation-timing-function","animation-delay","animation-iteration-count","animation-direction","animation-fill-mode","animation-play-state"],"appliesto":"allElementsAndPseudos","computed":["animation-name","animation-duration","animation-timing-function","animation-delay","animation-direction","animation-iteration-count","animation-fill-mode","animation-play-state"],"order":"orderOfAppearance","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation"},"animation-delay":{"syntax":"<time>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":"0s","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation-delay"},"animation-direction":{"syntax":"<single-animation-direction>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":"normal","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation-direction"},"animation-duration":{"syntax":"<time>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":"0s","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation-duration"},"animation-fill-mode":{"syntax":"<single-animation-fill-mode>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":"none","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation-fill-mode"},"animation-iteration-count":{"syntax":"<single-animation-iteration-count>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":"1","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation-iteration-count"},"animation-name":{"syntax":"[ none | <keyframes-name> ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":"none","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation-name"},"animation-play-state":{"syntax":"<single-animation-play-state>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":"running","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation-play-state"},"animation-timing-function":{"syntax":"<timing-function>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Animations"],"initial":"ease","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/animation-timing-function"},"appearance":{"syntax":"none | auto | button | textfield | <compat>","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/-moz-appearance"},"aspect-ratio":{"syntax":"auto | <ratio>","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"auto","appliesto":"allElementsExceptInlineBoxesAndInternalRubyOrTableBoxes","computed":"asSpecified","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/aspect-ratio"},"azimuth":{"syntax":"<angle> | [ [ left-side | far-left | left | center-left | center | center-right | right | far-right | right-side ] || behind ] | leftwards | rightwards","media":"aural","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Speech"],"initial":"center","appliesto":"allElements","computed":"normalizedAngle","order":"orderOfAppearance","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/azimuth"},"backdrop-filter":{"syntax":"none | <filter-function-list>","media":"visual","inherited":false,"animationType":"filterList","percentages":"no","groups":["Filter Effects"],"initial":"none","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/backdrop-filter"},"backface-visibility":{"syntax":"visible | hidden","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Transforms"],"initial":"visible","appliesto":"transformableElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/backface-visibility"},"background":{"syntax":"[ <bg-layer> , ]* <final-bg-layer>","media":"visual","inherited":false,"animationType":["background-color","background-image","background-clip","background-position","background-size","background-repeat","background-attachment"],"percentages":["background-position","background-size"],"groups":["CSS Backgrounds and Borders"],"initial":["background-image","background-position","background-size","background-repeat","background-origin","background-clip","background-attachment","background-color"],"appliesto":"allElements","computed":["background-image","background-position","background-size","background-repeat","background-origin","background-clip","background-attachment","background-color"],"order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background"},"background-attachment":{"syntax":"<attachment>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"scroll","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-attachment"},"background-blend-mode":{"syntax":"<blend-mode>#","media":"none","inherited":false,"animationType":"discrete","percentages":"no","groups":["Compositing and Blending"],"initial":"normal","appliesto":"allElementsSVGContainerGraphicsAndGraphicsReferencingElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-blend-mode"},"background-clip":{"syntax":"<box>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"border-box","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-clip"},"background-color":{"syntax":"<color>","media":"visual","inherited":false,"animationType":"color","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"transparent","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-color"},"background-image":{"syntax":"<bg-image>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"none","appliesto":"allElements","computed":"asSpecifiedURLsAbsolute","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-image"},"background-origin":{"syntax":"<box>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"padding-box","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-origin"},"background-position":{"syntax":"<bg-position>#","media":"visual","inherited":false,"animationType":"repeatableListOfSimpleListOfLpc","percentages":"referToSizeOfBackgroundPositioningAreaMinusBackgroundImageSize","groups":["CSS Backgrounds and Borders"],"initial":"0% 0%","appliesto":"allElements","computed":"listEachItemTwoKeywordsOriginOffsets","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-position"},"background-position-x":{"syntax":"[ center | [ left | right | x-start | x-end ]? <length-percentage>? ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"referToWidthOfBackgroundPositioningAreaMinusBackgroundImageHeight","groups":["CSS Backgrounds and Borders"],"initial":"left","appliesto":"allElements","computed":"listEachItemConsistingOfAbsoluteLengthPercentageAndOrigin","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-position-x"},"background-position-y":{"syntax":"[ center | [ top | bottom | y-start | y-end ]? <length-percentage>? ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"referToHeightOfBackgroundPositioningAreaMinusBackgroundImageHeight","groups":["CSS Backgrounds and Borders"],"initial":"top","appliesto":"allElements","computed":"listEachItemConsistingOfAbsoluteLengthPercentageAndOrigin","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-position-y"},"background-repeat":{"syntax":"<repeat-style>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"repeat","appliesto":"allElements","computed":"listEachItemHasTwoKeywordsOnePerDimension","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-repeat"},"background-size":{"syntax":"<bg-size>#","media":"visual","inherited":false,"animationType":"repeatableListOfSimpleListOfLpc","percentages":"relativeToBackgroundPositioningArea","groups":["CSS Backgrounds and Borders"],"initial":"auto auto","appliesto":"allElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/background-size"},"block-overflow":{"syntax":"clip | ellipsis | <string>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Overflow"],"initial":"clip","appliesto":"blockContainers","computed":"asSpecified","order":"perGrammar","status":"experimental"},"block-size":{"syntax":"<\'width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"blockSizeOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"sameAsWidthAndHeight","computed":"sameAsWidthAndHeight","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/block-size"},"border":{"syntax":"<line-width> || <line-style> || <color>","media":"visual","inherited":false,"animationType":["border-color","border-style","border-width"],"percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":["border-width","border-style","border-color"],"appliesto":"allElements","computed":["border-width","border-style","border-color"],"order":"orderOfAppearance","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border"},"border-block":{"syntax":"<\'border-top-width\'> || <\'border-top-style\'> || <\'color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":["border-top-width","border-top-style","border-top-color"],"appliesto":"allElements","computed":["border-top-width","border-top-style","border-top-color"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block"},"border-block-color":{"syntax":"<\'border-top-color\'>{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-color"},"border-block-style":{"syntax":"<\'border-top-style\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-style"},"border-block-width":{"syntax":"<\'border-top-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthZeroIfBorderStyleNoneOrHidden","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-width"},"border-block-end":{"syntax":"<\'border-top-width\'> || <\'border-top-style\'> || <\'color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":["border-top-width","border-top-style","border-top-color"],"appliesto":"allElements","computed":["border-top-width","border-top-style","border-top-color"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-end"},"border-block-end-color":{"syntax":"<\'border-top-color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-end-color"},"border-block-end-style":{"syntax":"<\'border-top-style\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-end-style"},"border-block-end-width":{"syntax":"<\'border-top-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthZeroIfBorderStyleNoneOrHidden","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-end-width"},"border-block-start":{"syntax":"<\'border-top-width\'> || <\'border-top-style\'> || <\'color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":["border-width","border-style","color"],"appliesto":"allElements","computed":["border-width","border-style","border-block-start-color"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-start"},"border-block-start-color":{"syntax":"<\'border-top-color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-start-color"},"border-block-start-style":{"syntax":"<\'border-top-style\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-start-style"},"border-block-start-width":{"syntax":"<\'border-top-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthZeroIfBorderStyleNoneOrHidden","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-block-start-width"},"border-bottom":{"syntax":"<line-width> || <line-style> || <color>","media":"visual","inherited":false,"animationType":["border-bottom-color","border-bottom-style","border-bottom-width"],"percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":["border-bottom-width","border-bottom-style","border-bottom-color"],"appliesto":"allElements","computed":["border-bottom-width","border-bottom-style","border-bottom-color"],"order":"orderOfAppearance","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-bottom"},"border-bottom-color":{"syntax":"<\'border-top-color\'>","media":"visual","inherited":false,"animationType":"color","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-bottom-color"},"border-bottom-left-radius":{"syntax":"<length-percentage>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["CSS Backgrounds and Borders"],"initial":"0","appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":"twoAbsoluteLengthOrPercentages","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-bottom-left-radius"},"border-bottom-right-radius":{"syntax":"<length-percentage>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["CSS Backgrounds and Borders"],"initial":"0","appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":"twoAbsoluteLengthOrPercentages","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-bottom-right-radius"},"border-bottom-style":{"syntax":"<line-style>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-bottom-style"},"border-bottom-width":{"syntax":"<line-width>","media":"visual","inherited":false,"animationType":"length","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthOr0IfBorderBottomStyleNoneOrHidden","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-bottom-width"},"border-collapse":{"syntax":"collapse | separate","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Table"],"initial":"separate","appliesto":"tableElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-collapse"},"border-color":{"syntax":"<color>{1,4}","media":"visual","inherited":false,"animationType":["border-bottom-color","border-left-color","border-right-color","border-top-color"],"percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":["border-top-color","border-right-color","border-bottom-color","border-left-color"],"appliesto":"allElements","computed":["border-bottom-color","border-left-color","border-right-color","border-top-color"],"order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-color"},"border-end-end-radius":{"syntax":"<length-percentage>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":"twoAbsoluteLengthOrPercentages","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-end-end-radius"},"border-end-start-radius":{"syntax":"<length-percentage>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":"twoAbsoluteLengthOrPercentages","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-end-start-radius"},"border-image":{"syntax":"<\'border-image-source\'> || <\'border-image-slice\'> [ / <\'border-image-width\'> | / <\'border-image-width\'>? / <\'border-image-outset\'> ]? || <\'border-image-repeat\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":["border-image-slice","border-image-width"],"groups":["CSS Backgrounds and Borders"],"initial":["border-image-source","border-image-slice","border-image-width","border-image-outset","border-image-repeat"],"appliesto":"allElementsExceptTableElementsWhenCollapse","computed":["border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width"],"order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-image"},"border-image-outset":{"syntax":"[ <length> | <number> ]{1,4}","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"0","appliesto":"allElementsExceptTableElementsWhenCollapse","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-image-outset"},"border-image-repeat":{"syntax":"[ stretch | repeat | round | space ]{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"stretch","appliesto":"allElementsExceptTableElementsWhenCollapse","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-image-repeat"},"border-image-slice":{"syntax":"<number-percentage>{1,4} && fill?","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"referToSizeOfBorderImage","groups":["CSS Backgrounds and Borders"],"initial":"100%","appliesto":"allElementsExceptTableElementsWhenCollapse","computed":"oneToFourPercentagesOrAbsoluteLengthsPlusFill","order":"percentagesOrLengthsFollowedByFill","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-image-slice"},"border-image-source":{"syntax":"none | <image>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"none","appliesto":"allElementsExceptTableElementsWhenCollapse","computed":"noneOrImageWithAbsoluteURI","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-image-source"},"border-image-width":{"syntax":"[ <length-percentage> | <number> | auto ]{1,4}","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"referToWidthOrHeightOfBorderImageArea","groups":["CSS Backgrounds and Borders"],"initial":"1","appliesto":"allElementsExceptTableElementsWhenCollapse","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-image-width"},"border-inline":{"syntax":"<\'border-top-width\'> || <\'border-top-style\'> || <\'color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":["border-top-width","border-top-style","border-top-color"],"appliesto":"allElements","computed":["border-top-width","border-top-style","border-top-color"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline"},"border-inline-end":{"syntax":"<\'border-top-width\'> || <\'border-top-style\'> || <\'color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":["border-width","border-style","color"],"appliesto":"allElements","computed":["border-width","border-style","border-inline-end-color"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-end"},"border-inline-color":{"syntax":"<\'border-top-color\'>{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-color"},"border-inline-style":{"syntax":"<\'border-top-style\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-style"},"border-inline-width":{"syntax":"<\'border-top-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthZeroIfBorderStyleNoneOrHidden","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-width"},"border-inline-end-color":{"syntax":"<\'border-top-color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-end-color"},"border-inline-end-style":{"syntax":"<\'border-top-style\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-end-style"},"border-inline-end-width":{"syntax":"<\'border-top-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthZeroIfBorderStyleNoneOrHidden","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-end-width"},"border-inline-start":{"syntax":"<\'border-top-width\'> || <\'border-top-style\'> || <\'color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":["border-width","border-style","color"],"appliesto":"allElements","computed":["border-width","border-style","border-inline-start-color"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-start"},"border-inline-start-color":{"syntax":"<\'border-top-color\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-start-color"},"border-inline-start-style":{"syntax":"<\'border-top-style\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Logical Properties"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-start-style"},"border-inline-start-width":{"syntax":"<\'border-top-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthZeroIfBorderStyleNoneOrHidden","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-inline-start-width"},"border-left":{"syntax":"<line-width> || <line-style> || <color>","media":"visual","inherited":false,"animationType":["border-left-color","border-left-style","border-left-width"],"percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":["border-left-width","border-left-style","border-left-color"],"appliesto":"allElements","computed":["border-left-width","border-left-style","border-left-color"],"order":"orderOfAppearance","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-left"},"border-left-color":{"syntax":"<color>","media":"visual","inherited":false,"animationType":"color","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-left-color"},"border-left-style":{"syntax":"<line-style>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-left-style"},"border-left-width":{"syntax":"<line-width>","media":"visual","inherited":false,"animationType":"length","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthOr0IfBorderLeftStyleNoneOrHidden","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-left-width"},"border-radius":{"syntax":"<length-percentage>{1,4} [ / <length-percentage>{1,4} ]?","media":"visual","inherited":false,"animationType":["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],"percentages":"referToDimensionOfBorderBox","groups":["CSS Backgrounds and Borders"],"initial":["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],"appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":["border-bottom-left-radius","border-bottom-right-radius","border-top-left-radius","border-top-right-radius"],"order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-radius"},"border-right":{"syntax":"<line-width> || <line-style> || <color>","media":"visual","inherited":false,"animationType":["border-right-color","border-right-style","border-right-width"],"percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":["border-right-width","border-right-style","border-right-color"],"appliesto":"allElements","computed":["border-right-width","border-right-style","border-right-color"],"order":"orderOfAppearance","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-right"},"border-right-color":{"syntax":"<color>","media":"visual","inherited":false,"animationType":"color","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-right-color"},"border-right-style":{"syntax":"<line-style>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-right-style"},"border-right-width":{"syntax":"<line-width>","media":"visual","inherited":false,"animationType":"length","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthOr0IfBorderRightStyleNoneOrHidden","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-right-width"},"border-spacing":{"syntax":"<length> <length>?","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Table"],"initial":"0","appliesto":"tableElements","computed":"twoAbsoluteLengths","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-spacing"},"border-start-end-radius":{"syntax":"<length-percentage>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":"twoAbsoluteLengthOrPercentages","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-start-end-radius"},"border-start-start-radius":{"syntax":"<length-percentage>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":"twoAbsoluteLengthOrPercentages","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-start-start-radius"},"border-style":{"syntax":"<line-style>{1,4}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":["border-top-style","border-right-style","border-bottom-style","border-left-style"],"appliesto":"allElements","computed":["border-bottom-style","border-left-style","border-right-style","border-top-style"],"order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-style"},"border-top":{"syntax":"<line-width> || <line-style> || <color>","media":"visual","inherited":false,"animationType":["border-top-color","border-top-style","border-top-width"],"percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":["border-top-width","border-top-style","border-top-color"],"appliesto":"allElements","computed":["border-top-width","border-top-style","border-top-color"],"order":"orderOfAppearance","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-top"},"border-top-color":{"syntax":"<color>","media":"visual","inherited":false,"animationType":"color","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-top-color"},"border-top-left-radius":{"syntax":"<length-percentage>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["CSS Backgrounds and Borders"],"initial":"0","appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":"twoAbsoluteLengthOrPercentages","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-top-left-radius"},"border-top-right-radius":{"syntax":"<length-percentage>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfBorderBox","groups":["CSS Backgrounds and Borders"],"initial":"0","appliesto":"allElementsUAsNotRequiredWhenCollapse","computed":"twoAbsoluteLengthOrPercentages","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-top-right-radius"},"border-top-style":{"syntax":"<line-style>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-top-style"},"border-top-width":{"syntax":"<line-width>","media":"visual","inherited":false,"animationType":"length","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"medium","appliesto":"allElements","computed":"absoluteLengthOr0IfBorderTopStyleNoneOrHidden","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-top-width"},"border-width":{"syntax":"<line-width>{1,4}","media":"visual","inherited":false,"animationType":["border-bottom-width","border-left-width","border-right-width","border-top-width"],"percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":["border-top-width","border-right-width","border-bottom-width","border-left-width"],"appliesto":"allElements","computed":["border-bottom-width","border-left-width","border-right-width","border-top-width"],"order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/border-width"},"bottom":{"syntax":"<length> | <percentage> | auto","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToContainingBlockHeight","groups":["CSS Positioning"],"initial":"auto","appliesto":"positionedElements","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/bottom"},"box-align":{"syntax":"start | center | end | baseline | stretch","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"stretch","appliesto":"elementsWithDisplayBoxOrInlineBox","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-align"},"box-decoration-break":{"syntax":"slice | clone","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Fragmentation"],"initial":"slice","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-decoration-break"},"box-direction":{"syntax":"normal | reverse | inherit","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"normal","appliesto":"elementsWithDisplayBoxOrInlineBox","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-direction"},"box-flex":{"syntax":"<number>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"0","appliesto":"directChildrenOfElementsWithDisplayMozBoxMozInlineBox","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-flex"},"box-flex-group":{"syntax":"<integer>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"1","appliesto":"inFlowChildrenOfBoxElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-flex-group"},"box-lines":{"syntax":"single | multiple","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"single","appliesto":"boxElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-lines"},"box-ordinal-group":{"syntax":"<integer>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"1","appliesto":"childrenOfBoxElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-ordinal-group"},"box-orient":{"syntax":"horizontal | vertical | inline-axis | block-axis | inherit","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"inlineAxisHorizontalInXUL","appliesto":"elementsWithDisplayBoxOrInlineBox","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-orient"},"box-pack":{"syntax":"start | center | end | justify","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions","WebKit Extensions"],"initial":"start","appliesto":"elementsWithDisplayMozBoxMozInlineBox","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-pack"},"box-shadow":{"syntax":"none | <shadow>#","media":"visual","inherited":false,"animationType":"shadowList","percentages":"no","groups":["CSS Backgrounds and Borders"],"initial":"none","appliesto":"allElements","computed":"absoluteLengthsSpecifiedColorAsSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-shadow"},"box-sizing":{"syntax":"content-box | border-box","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"content-box","appliesto":"allElementsAcceptingWidthOrHeight","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/box-sizing"},"break-after":{"syntax":"auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Fragmentation"],"initial":"auto","appliesto":"blockLevelElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/break-after"},"break-before":{"syntax":"auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Fragmentation"],"initial":"auto","appliesto":"blockLevelElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/break-before"},"break-inside":{"syntax":"auto | avoid | avoid-page | avoid-column | avoid-region","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Fragmentation"],"initial":"auto","appliesto":"blockLevelElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/break-inside"},"caption-side":{"syntax":"top | bottom | block-start | block-end | inline-start | inline-end","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Table"],"initial":"top","appliesto":"tableCaptionElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/caption-side"},"caret-color":{"syntax":"auto | <color>","media":"interactive","inherited":true,"animationType":"color","percentages":"no","groups":["CSS Basic User Interface"],"initial":"auto","appliesto":"allElements","computed":"asAutoOrColor","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/caret-color"},"clear":{"syntax":"none | left | right | both | inline-start | inline-end","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Positioning"],"initial":"none","appliesto":"blockLevelElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/clear"},"clip":{"syntax":"<shape> | auto","media":"visual","inherited":false,"animationType":"rectangle","percentages":"no","groups":["CSS Masking"],"initial":"auto","appliesto":"absolutelyPositionedElements","computed":"autoOrRectangle","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/clip"},"clip-path":{"syntax":"<clip-source> | [ <basic-shape> || <geometry-box> ] | none","media":"visual","inherited":false,"animationType":"basicShapeOtherwiseNo","percentages":"referToReferenceBoxWhenSpecifiedOtherwiseBorderBox","groups":["CSS Masking"],"initial":"none","appliesto":"allElementsSVGContainerElements","computed":"asSpecifiedURLsAbsolute","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/clip-path"},"color":{"syntax":"<color>","media":"visual","inherited":true,"animationType":"color","percentages":"no","groups":["CSS Color"],"initial":"variesFromBrowserToBrowser","appliesto":"allElements","computed":"translucentValuesRGBAOtherwiseRGB","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/color"},"color-adjust":{"syntax":"economy | exact","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Color"],"initial":"economy","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/color-adjust"},"column-count":{"syntax":"<integer> | auto","media":"visual","inherited":false,"animationType":"integer","percentages":"no","groups":["CSS Columns"],"initial":"auto","appliesto":"blockContainersExceptTableWrappers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-count"},"column-fill":{"syntax":"auto | balance | balance-all","media":"visualInContinuousMediaNoEffectInOverflowColumns","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Columns"],"initial":"balance","appliesto":"multicolElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-fill"},"column-gap":{"syntax":"normal | <length-percentage>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfContentArea","groups":["CSS Box Alignment"],"initial":"normal","appliesto":"multiColumnElementsFlexContainersGridContainers","computed":"asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-gap"},"column-rule":{"syntax":"<\'column-rule-width\'> || <\'column-rule-style\'> || <\'column-rule-color\'>","media":"visual","inherited":false,"animationType":["column-rule-color","column-rule-style","column-rule-width"],"percentages":"no","groups":["CSS Columns"],"initial":["column-rule-width","column-rule-style","column-rule-color"],"appliesto":"multicolElements","computed":["column-rule-color","column-rule-style","column-rule-width"],"order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-rule"},"column-rule-color":{"syntax":"<color>","media":"visual","inherited":false,"animationType":"color","percentages":"no","groups":["CSS Columns"],"initial":"currentcolor","appliesto":"multicolElements","computed":"computedColor","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-rule-color"},"column-rule-style":{"syntax":"<\'border-style\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Columns"],"initial":"none","appliesto":"multicolElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-rule-style"},"column-rule-width":{"syntax":"<\'border-width\'>","media":"visual","inherited":false,"animationType":"length","percentages":"no","groups":["CSS Columns"],"initial":"medium","appliesto":"multicolElements","computed":"absoluteLength0IfColumnRuleStyleNoneOrHidden","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-rule-width"},"column-span":{"syntax":"none | all","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Columns"],"initial":"none","appliesto":"inFlowBlockLevelElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-span"},"column-width":{"syntax":"<length> | auto","media":"visual","inherited":false,"animationType":"length","percentages":"no","groups":["CSS Columns"],"initial":"auto","appliesto":"blockContainersExceptTableWrappers","computed":"absoluteLengthZeroOrLarger","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-width"},"columns":{"syntax":"<\'column-width\'> || <\'column-count\'>","media":"visual","inherited":false,"animationType":["column-width","column-count"],"percentages":"no","groups":["CSS Columns"],"initial":["column-width","column-count"],"appliesto":"blockContainersExceptTableWrappers","computed":["column-width","column-count"],"order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/columns"},"contain":{"syntax":"none | strict | content | [ size || layout || style || paint ]","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Containment"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/contain"},"content":{"syntax":"normal | none | [ <content-replacement> | <content-list> ] [/ <string> ]?","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Generated Content"],"initial":"normal","appliesto":"beforeAndAfterPseudos","computed":"normalOnElementsForPseudosNoneAbsoluteURIStringOrAsSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/content"},"counter-increment":{"syntax":"[ <custom-ident> <integer>? ]+ | none","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Counter Styles"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/counter-increment"},"counter-reset":{"syntax":"[ <custom-ident> <integer>? ]+ | none","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Counter Styles"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/counter-reset"},"counter-set":{"syntax":"[ <custom-ident> <integer>? ]+ | none","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Counter Styles"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/counter-set"},"cursor":{"syntax":"[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing ] ]","media":["visual","interactive"],"inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"auto","appliesto":"allElements","computed":"asSpecifiedURLsAbsolute","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/cursor"},"direction":{"syntax":"ltr | rtl","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Writing Modes"],"initial":"ltr","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/direction"},"display":{"syntax":"[ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal> | <display-box> | <display-legacy>","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Display"],"initial":"inline","appliesto":"allElements","computed":"asSpecifiedExceptPositionedFloatingAndRootElementsKeywordMaybeDifferent","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/display"},"empty-cells":{"syntax":"show | hide","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Table"],"initial":"show","appliesto":"tableCellElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/empty-cells"},"filter":{"syntax":"none | <filter-function-list>","media":"visual","inherited":false,"animationType":"filterList","percentages":"no","groups":["Filter Effects"],"initial":"none","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/filter"},"flex":{"syntax":"none | [ <\'flex-grow\'> <\'flex-shrink\'>? || <\'flex-basis\'> ]","media":"visual","inherited":false,"animationType":["flex-grow","flex-shrink","flex-basis"],"percentages":"no","groups":["CSS Flexible Box Layout"],"initial":["flex-grow","flex-shrink","flex-basis"],"appliesto":"flexItemsAndInFlowPseudos","computed":["flex-grow","flex-shrink","flex-basis"],"order":"orderOfAppearance","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/flex"},"flex-basis":{"syntax":"content | <\'width\'>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToFlexContainersInnerMainSize","groups":["CSS Flexible Box Layout"],"initial":"auto","appliesto":"flexItemsAndInFlowPseudos","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"lengthOrPercentageBeforeKeywordIfBothPresent","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/flex-basis"},"flex-direction":{"syntax":"row | row-reverse | column | column-reverse","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Flexible Box Layout"],"initial":"row","appliesto":"flexContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/flex-direction"},"flex-flow":{"syntax":"<\'flex-direction\'> || <\'flex-wrap\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Flexible Box Layout"],"initial":["flex-direction","flex-wrap"],"appliesto":"flexContainers","computed":["flex-direction","flex-wrap"],"order":"orderOfAppearance","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/flex-flow"},"flex-grow":{"syntax":"<number>","media":"visual","inherited":false,"animationType":"number","percentages":"no","groups":["CSS Flexible Box Layout"],"initial":"0","appliesto":"flexItemsAndInFlowPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/flex-grow"},"flex-shrink":{"syntax":"<number>","media":"visual","inherited":false,"animationType":"number","percentages":"no","groups":["CSS Flexible Box Layout"],"initial":"1","appliesto":"flexItemsAndInFlowPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/flex-shrink"},"flex-wrap":{"syntax":"nowrap | wrap | wrap-reverse","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Flexible Box Layout"],"initial":"nowrap","appliesto":"flexContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/flex-wrap"},"float":{"syntax":"left | right | none | inline-start | inline-end","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Positioning"],"initial":"none","appliesto":"allElementsNoEffectIfDisplayNone","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/float"},"font":{"syntax":"[ [ <\'font-style\'> || <font-variant-css21> || <\'font-weight\'> || <\'font-stretch\'> ]? <\'font-size\'> [ / <\'line-height\'> ]? <\'font-family\'> ] | caption | icon | menu | message-box | small-caption | status-bar","media":"visual","inherited":true,"animationType":["font-style","font-variant","font-weight","font-stretch","font-size","line-height","font-family"],"percentages":["font-size","line-height"],"groups":["CSS Fonts"],"initial":["font-style","font-variant","font-weight","font-stretch","font-size","line-height","font-family"],"appliesto":"allElements","computed":["font-style","font-variant","font-weight","font-stretch","font-size","line-height","font-family"],"order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font"},"font-family":{"syntax":"[ <family-name> | <generic-family> ]#","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"dependsOnUserAgent","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-family"},"font-feature-settings":{"syntax":"normal | <feature-tag-value>#","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-feature-settings"},"font-kerning":{"syntax":"auto | normal | none","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-kerning"},"font-language-override":{"syntax":"normal | <string>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-language-override"},"font-optical-sizing":{"syntax":"auto | none","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-optical-sizing"},"font-variation-settings":{"syntax":"normal | [ <string> <number> ]#","media":"visual","inherited":true,"animationType":"transform","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-variation-settings"},"font-size":{"syntax":"<absolute-size> | <relative-size> | <length-percentage>","media":"visual","inherited":true,"animationType":"length","percentages":"referToParentElementsFontSize","groups":["CSS Fonts"],"initial":"medium","appliesto":"allElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-size"},"font-size-adjust":{"syntax":"none | <number>","media":"visual","inherited":true,"animationType":"number","percentages":"no","groups":["CSS Fonts"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-size-adjust"},"font-stretch":{"syntax":"<font-stretch-absolute>","media":"visual","inherited":true,"animationType":"fontStretch","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-stretch"},"font-style":{"syntax":"normal | italic | oblique <angle>?","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-style"},"font-synthesis":{"syntax":"none | [ weight || style ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"weight style","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-synthesis"},"font-variant":{"syntax":"normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-variant"},"font-variant-alternates":{"syntax":"normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-variant-alternates"},"font-variant-caps":{"syntax":"normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-variant-caps"},"font-variant-east-asian":{"syntax":"normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-variant-east-asian"},"font-variant-ligatures":{"syntax":"normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-variant-ligatures"},"font-variant-numeric":{"syntax":"normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-variant-numeric"},"font-variant-position":{"syntax":"normal | sub | super","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-variant-position"},"font-weight":{"syntax":"<font-weight-absolute> | bolder | lighter","media":"visual","inherited":true,"animationType":"fontWeight","percentages":"no","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"keywordOrNumericalValueBolderLighterTransformedToRealValue","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/font-weight"},"gap":{"syntax":"<\'row-gap\'> <\'column-gap\'>?","media":"visual","inherited":false,"animationType":["row-gap","column-gap"],"percentages":"no","groups":["CSS Box Alignment"],"initial":["row-gap","column-gap"],"appliesto":"gridContainers","computed":["row-gap","column-gap"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/gap"},"grid":{"syntax":"<\'grid-template\'> | <\'grid-template-rows\'> / [ auto-flow && dense? ] <\'grid-auto-columns\'>? | [ auto-flow && dense? ] <\'grid-auto-rows\'>? / <\'grid-template-columns\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":["grid-template-rows","grid-template-columns","grid-auto-rows","grid-auto-columns"],"groups":["CSS Grid Layout"],"initial":["grid-template-rows","grid-template-columns","grid-template-areas","grid-auto-rows","grid-auto-columns","grid-auto-flow","grid-column-gap","grid-row-gap","column-gap","row-gap"],"appliesto":"gridContainers","computed":["grid-template-rows","grid-template-columns","grid-template-areas","grid-auto-rows","grid-auto-columns","grid-auto-flow","grid-column-gap","grid-row-gap","column-gap","row-gap"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid"},"grid-area":{"syntax":"<grid-line> [ / <grid-line> ]{0,3}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":["grid-row-start","grid-column-start","grid-row-end","grid-column-end"],"appliesto":"gridItemsAndBoxesWithinGridContainer","computed":["grid-row-start","grid-column-start","grid-row-end","grid-column-end"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-area"},"grid-auto-columns":{"syntax":"<track-size>+","media":"visual","inherited":false,"animationType":"discrete","percentages":"referToDimensionOfContentArea","groups":["CSS Grid Layout"],"initial":"auto","appliesto":"gridContainers","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-auto-columns"},"grid-auto-flow":{"syntax":"[ row | column ] || dense","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":"row","appliesto":"gridContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-auto-flow"},"grid-auto-rows":{"syntax":"<track-size>+","media":"visual","inherited":false,"animationType":"discrete","percentages":"referToDimensionOfContentArea","groups":["CSS Grid Layout"],"initial":"auto","appliesto":"gridContainers","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-auto-rows"},"grid-column":{"syntax":"<grid-line> [ / <grid-line> ]?","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":["grid-column-start","grid-column-end"],"appliesto":"gridItemsAndBoxesWithinGridContainer","computed":["grid-column-start","grid-column-end"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-column"},"grid-column-end":{"syntax":"<grid-line>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":"auto","appliesto":"gridItemsAndBoxesWithinGridContainer","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-column-end"},"grid-column-gap":{"syntax":"<length-percentage>","media":"visual","inherited":false,"animationType":"length","percentages":"referToDimensionOfContentArea","groups":["CSS Grid Layout"],"initial":"0","appliesto":"gridContainers","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/column-gap"},"grid-column-start":{"syntax":"<grid-line>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":"auto","appliesto":"gridItemsAndBoxesWithinGridContainer","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-column-start"},"grid-gap":{"syntax":"<\'grid-row-gap\'> <\'grid-column-gap\'>?","media":"visual","inherited":false,"animationType":["grid-row-gap","grid-column-gap"],"percentages":"no","groups":["CSS Grid Layout"],"initial":["grid-row-gap","grid-column-gap"],"appliesto":"gridContainers","computed":["grid-row-gap","grid-column-gap"],"order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/gap"},"grid-row":{"syntax":"<grid-line> [ / <grid-line> ]?","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":["grid-row-start","grid-row-end"],"appliesto":"gridItemsAndBoxesWithinGridContainer","computed":["grid-row-start","grid-row-end"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-row"},"grid-row-end":{"syntax":"<grid-line>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":"auto","appliesto":"gridItemsAndBoxesWithinGridContainer","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-row-end"},"grid-row-gap":{"syntax":"<length-percentage>","media":"visual","inherited":false,"animationType":"length","percentages":"referToDimensionOfContentArea","groups":["CSS Grid Layout"],"initial":"0","appliesto":"gridContainers","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/row-gap"},"grid-row-start":{"syntax":"<grid-line>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":"auto","appliesto":"gridItemsAndBoxesWithinGridContainer","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-row-start"},"grid-template":{"syntax":"none | [ <\'grid-template-rows\'> / <\'grid-template-columns\'> ] | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?","media":"visual","inherited":false,"animationType":"discrete","percentages":["grid-template-columns","grid-template-rows"],"groups":["CSS Grid Layout"],"initial":["grid-template-columns","grid-template-rows","grid-template-areas"],"appliesto":"gridContainers","computed":["grid-template-columns","grid-template-rows","grid-template-areas"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-template"},"grid-template-areas":{"syntax":"none | <string>+","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Grid Layout"],"initial":"none","appliesto":"gridContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-template-areas"},"grid-template-columns":{"syntax":"none | <track-list> | <auto-track-list> | subgrid <line-name-list>?","media":"visual","inherited":false,"animationType":"simpleListOfLpcDifferenceLpc","percentages":"referToDimensionOfContentArea","groups":["CSS Grid Layout"],"initial":"none","appliesto":"gridContainers","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-template-columns"},"grid-template-rows":{"syntax":"none | <track-list> | <auto-track-list> | subgrid <line-name-list>?","media":"visual","inherited":false,"animationType":"simpleListOfLpcDifferenceLpc","percentages":"referToDimensionOfContentArea","groups":["CSS Grid Layout"],"initial":"none","appliesto":"gridContainers","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/grid-template-rows"},"hanging-punctuation":{"syntax":"none | [ first || [ force-end | allow-end ] || last ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/hanging-punctuation"},"height":{"syntax":"[ <length> | <percentage> ] && [ border-box | content-box ]? | available | min-content | max-content | fit-content | auto","media":"visual","inherited":false,"animationType":"lpc","percentages":"regardingHeightOfGeneratedBoxContainingBlockPercentagesRelativeToContainingBlock","groups":["CSS Box Model"],"initial":"auto","appliesto":"allElementsButNonReplacedAndTableColumns","computed":"percentageAutoOrAbsoluteLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/height"},"hyphens":{"syntax":"none | manual | auto","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"manual","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/hyphens"},"image-orientation":{"syntax":"from-image | <angle> | [ <angle>? flip ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Images"],"initial":"0deg","appliesto":"allElements","computed":"angleRoundedToNextQuarter","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/image-orientation"},"image-rendering":{"syntax":"auto | crisp-edges | pixelated","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Images"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/image-rendering"},"image-resolution":{"syntax":"[ from-image || <resolution> ] && snap?","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Images"],"initial":"1dppx","appliesto":"allElements","computed":"asSpecifiedWithExceptionOfResolution","order":"uniqueOrder","status":"experimental"},"ime-mode":{"syntax":"auto | normal | active | inactive | disabled","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"auto","appliesto":"textFields","computed":"asSpecified","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/ime-mode"},"initial-letter":{"syntax":"normal | [ <number> <integer>? ]","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Inline"],"initial":"normal","appliesto":"firstLetterPseudoElementsAndInlineLevelFirstChildren","computed":"asSpecified","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/initial-letter"},"initial-letter-align":{"syntax":"[ auto | alphabetic | hanging | ideographic ]","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Inline"],"initial":"auto","appliesto":"firstLetterPseudoElementsAndInlineLevelFirstChildren","computed":"asSpecified","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/initial-letter-align"},"inline-size":{"syntax":"<\'width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"inlineSizeOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"sameAsWidthAndHeight","computed":"sameAsWidthAndHeight","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/inline-size"},"inset":{"syntax":"<\'top\'>{1,4}","media":"visual","inherited":false,"animationType":"lpc","percentages":"logicalHeightOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"positionedElements","computed":"sameAsBoxOffsets","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/inset"},"inset-block":{"syntax":"<\'top\'>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"logicalHeightOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"positionedElements","computed":"sameAsBoxOffsets","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/inset-block"},"inset-block-end":{"syntax":"<\'top\'>","media":"visual","inherited":false,"animationType":"lpc","percentages":"logicalHeightOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"positionedElements","computed":"sameAsBoxOffsets","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/inset-block-end"},"inset-block-start":{"syntax":"<\'top\'>","media":"visual","inherited":false,"animationType":"lpc","percentages":"logicalHeightOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"positionedElements","computed":"sameAsBoxOffsets","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/inset-block-start"},"inset-inline":{"syntax":"<\'top\'>{1,2}","media":"visual","inherited":false,"animationType":"lpc","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"positionedElements","computed":"sameAsBoxOffsets","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/inset-inline"},"inset-inline-end":{"syntax":"<\'top\'>","media":"visual","inherited":false,"animationType":"lpc","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"positionedElements","computed":"sameAsBoxOffsets","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/inset-inline-end"},"inset-inline-start":{"syntax":"<\'top\'>","media":"visual","inherited":false,"animationType":"lpc","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"auto","appliesto":"positionedElements","computed":"sameAsBoxOffsets","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/inset-inline-start"},"isolation":{"syntax":"auto | isolate","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Compositing and Blending"],"initial":"auto","appliesto":"allElementsSVGContainerGraphicsAndGraphicsReferencingElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/isolation"},"justify-content":{"syntax":"normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":"normal","appliesto":"flexContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/justify-content"},"justify-items":{"syntax":"normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ] | legacy | legacy && [ left | right | center ]","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":"legacy","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/justify-items"},"justify-self":{"syntax":"auto | normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ]","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":"auto","appliesto":"blockLevelBoxesAndAbsolutelyPositionedBoxesAndGridItems","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/justify-self"},"left":{"syntax":"<length> | <percentage> | auto","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToWidthOfContainingBlock","groups":["CSS Positioning"],"initial":"auto","appliesto":"positionedElements","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/left"},"letter-spacing":{"syntax":"normal | <length>","media":"visual","inherited":true,"animationType":"length","percentages":"no","groups":["CSS Text"],"initial":"normal","appliesto":"allElements","computed":"optimumValueOfAbsoluteLengthOrNormal","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/letter-spacing"},"line-break":{"syntax":"auto | loose | normal | strict | anywhere","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/line-break"},"line-clamp":{"syntax":"none | <integer>","media":"visual","inherited":false,"animationType":"integer","percentages":"no","groups":["CSS Overflow"],"initial":"none","appliesto":"blockContainersExceptMultiColumnContainers","computed":"asSpecified","order":"perGrammar","status":"experimental"},"line-height":{"syntax":"normal | <number> | <length> | <percentage>","media":"visual","inherited":true,"animationType":"numberOrLength","percentages":"referToElementFontSize","groups":["CSS Fonts"],"initial":"normal","appliesto":"allElements","computed":"absoluteLengthOrAsSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/line-height"},"line-height-step":{"syntax":"<length>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fonts"],"initial":"0","appliesto":"blockContainers","computed":"absoluteLength","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/line-height-step"},"list-style":{"syntax":"<\'list-style-type\'> || <\'list-style-position\'> || <\'list-style-image\'>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Lists and Counters"],"initial":["list-style-type","list-style-position","list-style-image"],"appliesto":"listItems","computed":["list-style-image","list-style-position","list-style-type"],"order":"orderOfAppearance","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/list-style"},"list-style-image":{"syntax":"<url> | none","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Lists and Counters"],"initial":"none","appliesto":"listItems","computed":"noneOrImageWithAbsoluteURI","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/list-style-image"},"list-style-position":{"syntax":"inside | outside","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Lists and Counters"],"initial":"outside","appliesto":"listItems","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/list-style-position"},"list-style-type":{"syntax":"<counter-style> | <string> | none","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Lists and Counters"],"initial":"disc","appliesto":"listItems","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/list-style-type"},"margin":{"syntax":"[ <length> | <percentage> | auto ]{1,4}","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":["margin-bottom","margin-left","margin-right","margin-top"],"appliesto":"allElementsExceptTableDisplayTypes","computed":["margin-bottom","margin-left","margin-right","margin-top"],"order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin"},"margin-block":{"syntax":"<\'margin-left\'>{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"dependsOnLayoutModel","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsMargin","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-block"},"margin-block-end":{"syntax":"<\'margin-left\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"dependsOnLayoutModel","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsMargin","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-block-end"},"margin-block-start":{"syntax":"<\'margin-left\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"dependsOnLayoutModel","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsMargin","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-block-start"},"margin-bottom":{"syntax":"<length> | <percentage> | auto","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"0","appliesto":"allElementsExceptTableDisplayTypes","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-bottom"},"margin-inline":{"syntax":"<\'margin-left\'>{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"dependsOnLayoutModel","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsMargin","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-inline"},"margin-inline-end":{"syntax":"<\'margin-left\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"dependsOnLayoutModel","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsMargin","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-inline-end"},"margin-inline-start":{"syntax":"<\'margin-left\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"dependsOnLayoutModel","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsMargin","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-inline-start"},"margin-left":{"syntax":"<length> | <percentage> | auto","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"0","appliesto":"allElementsExceptTableDisplayTypes","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-left"},"margin-right":{"syntax":"<length> | <percentage> | auto","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"0","appliesto":"allElementsExceptTableDisplayTypes","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-right"},"margin-top":{"syntax":"<length> | <percentage> | auto","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"0","appliesto":"allElementsExceptTableDisplayTypes","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/margin-top"},"mask":{"syntax":"<mask-layer>#","media":"visual","inherited":false,"animationType":["mask-image","mask-mode","mask-repeat","mask-position","mask-clip","mask-origin","mask-size","mask-composite"],"percentages":["mask-position"],"groups":["CSS Masking"],"initial":["mask-image","mask-mode","mask-repeat","mask-position","mask-clip","mask-origin","mask-size","mask-composite"],"appliesto":"allElementsSVGContainerElements","computed":["mask-image","mask-mode","mask-repeat","mask-position","mask-clip","mask-origin","mask-size","mask-composite"],"order":"perGrammar","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask"},"mask-border":{"syntax":"<\'mask-border-source\'> || <\'mask-border-slice\'> [ / <\'mask-border-width\'>? [ / <\'mask-border-outset\'> ]? ]? || <\'mask-border-repeat\'> || <\'mask-border-mode\'>","media":"visual","inherited":false,"animationType":["mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width"],"percentages":["mask-border-slice","mask-border-width"],"groups":["CSS Masking"],"initial":["mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width"],"appliesto":"allElementsSVGContainerElements","computed":["mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width"],"order":"perGrammar","stacking":true,"status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-border"},"mask-border-mode":{"syntax":"luminance | alpha","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"alpha","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-border-mode"},"mask-border-outset":{"syntax":"[ <length> | <number> ]{1,4}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"0","appliesto":"allElementsSVGContainerElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-border-outset"},"mask-border-repeat":{"syntax":"[ stretch | repeat | round | space ]{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"stretch","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-border-repeat"},"mask-border-slice":{"syntax":"<number-percentage>{1,4} fill?","media":"visual","inherited":false,"animationType":"discrete","percentages":"referToSizeOfMaskBorderImage","groups":["CSS Masking"],"initial":"0","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-border-slice"},"mask-border-source":{"syntax":"none | <image>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"none","appliesto":"allElementsSVGContainerElements","computed":"asSpecifiedURLsAbsolute","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-border-source"},"mask-border-width":{"syntax":"[ <length-percentage> | <number> | auto ]{1,4}","media":"visual","inherited":false,"animationType":"discrete","percentages":"relativeToMaskBorderImageArea","groups":["CSS Masking"],"initial":"auto","appliesto":"allElementsSVGContainerElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-border-width"},"mask-clip":{"syntax":"[ <geometry-box> | no-clip ]#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"border-box","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-clip"},"mask-composite":{"syntax":"<compositing-operator>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"add","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-composite"},"mask-image":{"syntax":"<mask-reference>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"none","appliesto":"allElementsSVGContainerElements","computed":"asSpecifiedURLsAbsolute","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-image"},"mask-mode":{"syntax":"<masking-mode>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"match-source","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-mode"},"mask-origin":{"syntax":"<geometry-box>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"border-box","appliesto":"allElementsSVGContainerElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-origin"},"mask-position":{"syntax":"<position>#","media":"visual","inherited":false,"animationType":"repeatableListOfSimpleListOfLpc","percentages":"referToSizeOfMaskPaintingArea","groups":["CSS Masking"],"initial":"center","appliesto":"allElementsSVGContainerElements","computed":"consistsOfTwoKeywordsForOriginAndOffsets","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-position"},"mask-repeat":{"syntax":"<repeat-style>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"no-repeat","appliesto":"allElementsSVGContainerElements","computed":"consistsOfTwoDimensionKeywords","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-repeat"},"mask-size":{"syntax":"<bg-size>#","media":"visual","inherited":false,"animationType":"repeatableListOfSimpleListOfLpc","percentages":"no","groups":["CSS Masking"],"initial":"auto","appliesto":"allElementsSVGContainerElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-size"},"mask-type":{"syntax":"luminance | alpha","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Masking"],"initial":"luminance","appliesto":"maskElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mask-type"},"max-block-size":{"syntax":"<\'max-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"blockSizeOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsWidthAndHeight","computed":"sameAsMaxWidthAndMaxHeight","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/max-block-size"},"max-height":{"syntax":"<length> | <percentage> | none | max-content | min-content | fit-content | fill-available","media":"visual","inherited":false,"animationType":"lpc","percentages":"regardingHeightOfGeneratedBoxContainingBlockPercentagesNone","groups":["CSS Box Model"],"initial":"none","appliesto":"allElementsButNonReplacedAndTableColumns","computed":"percentageAsSpecifiedAbsoluteLengthOrNone","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/max-height"},"max-inline-size":{"syntax":"<\'max-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"inlineSizeOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsWidthAndHeight","computed":"sameAsMaxWidthAndMaxHeight","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/max-inline-size"},"max-lines":{"syntax":"none | <integer>","media":"visual","inherited":false,"animationType":"integer","percentages":"no","groups":["CSS Overflow"],"initial":"none","appliesto":"blockContainersExceptMultiColumnContainers","computed":"asSpecified","order":"perGrammar","status":"experimental"},"max-width":{"syntax":"<length> | <percentage> | none | max-content | min-content | fit-content | fill-available","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"none","appliesto":"allElementsButNonReplacedAndTableRows","computed":"percentageAsSpecifiedAbsoluteLengthOrNone","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/max-width"},"min-block-size":{"syntax":"<\'min-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"blockSizeOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsWidthAndHeight","computed":"sameAsMinWidthAndMinHeight","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/min-block-size"},"min-height":{"syntax":"<length> | <percentage> | auto | max-content | min-content | fit-content | fill-available","media":"visual","inherited":false,"animationType":"lpc","percentages":"regardingHeightOfGeneratedBoxContainingBlockPercentages0","groups":["CSS Box Model"],"initial":"auto","appliesto":"allElementsButNonReplacedAndTableColumns","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/min-height"},"min-inline-size":{"syntax":"<\'min-width\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"inlineSizeOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"sameAsWidthAndHeight","computed":"sameAsMinWidthAndMinHeight","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/min-inline-size"},"min-width":{"syntax":"<length> | <percentage> | auto | max-content | min-content | fit-content | fill-available","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"auto","appliesto":"allElementsButNonReplacedAndTableRows","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/min-width"},"mix-blend-mode":{"syntax":"<blend-mode>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Compositing and Blending"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/mix-blend-mode"},"object-fit":{"syntax":"fill | contain | cover | none | scale-down","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Images"],"initial":"fill","appliesto":"replacedElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/object-fit"},"object-position":{"syntax":"<position>","media":"visual","inherited":true,"animationType":"repeatableListOfSimpleListOfLpc","percentages":"referToWidthAndHeightOfElement","groups":["CSS Images"],"initial":"50% 50%","appliesto":"replacedElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/object-position"},"offset":{"syntax":"[ <\'offset-position\'>? [ <\'offset-path\'> [ <\'offset-distance\'> || <\'offset-rotate\'> ]? ]? ]! [ / <\'offset-anchor\'> ]?","media":"visual","inherited":false,"animationType":["offset-position","offset-path","offset-distance","offset-anchor","offset-rotate"],"percentages":["offset-position","offset-distance","offset-anchor"],"groups":["CSS Motion Path"],"initial":["offset-position","offset-path","offset-distance","offset-anchor","offset-rotate"],"appliesto":"transformableElements","computed":["offset-position","offset-path","offset-distance","offset-anchor","offset-rotate"],"order":"perGrammar","stacking":true,"status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/offset"},"offset-anchor":{"syntax":"auto | <position>","media":"visual","inherited":false,"animationType":"position","percentages":"relativeToWidthAndHeight","groups":["CSS Motion Path"],"initial":"auto","appliesto":"transformableElements","computed":"forLengthAbsoluteValueOtherwisePercentage","order":"perGrammar","status":"experimental"},"offset-distance":{"syntax":"<length-percentage>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToTotalPathLength","groups":["CSS Motion Path"],"initial":"0","appliesto":"transformableElements","computed":"forLengthAbsoluteValueOtherwisePercentage","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/offset-distance"},"offset-path":{"syntax":"none | ray( [ <angle> && <size>? && contain? ] ) | <path()> | <url> | [ <basic-shape> || <geometry-box> ]","media":"visual","inherited":false,"animationType":"angleOrBasicShapeOrPath","percentages":"no","groups":["CSS Motion Path"],"initial":"none","appliesto":"transformableElements","computed":"asSpecified","order":"perGrammar","stacking":true,"status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/offset-path"},"offset-position":{"syntax":"auto | <position>","media":"visual","inherited":false,"animationType":"position","percentages":"referToSizeOfContainingBlock","groups":["CSS Motion Path"],"initial":"auto","appliesto":"transformableElements","computed":"forLengthAbsoluteValueOtherwisePercentage","order":"perGrammar","status":"experimental"},"offset-rotate":{"syntax":"[ auto | reverse ] || <angle>","media":"visual","inherited":false,"animationType":"angleOrBasicShapeOrPath","percentages":"no","groups":["CSS Motion Path"],"initial":"auto","appliesto":"transformableElements","computed":"asSpecified","order":"perGrammar","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/offset-rotate"},"opacity":{"syntax":"<alpha-value>","media":"visual","inherited":false,"animationType":"number","percentages":"no","groups":["CSS Color"],"initial":"1.0","appliesto":"allElements","computed":"specifiedValueClipped0To1","order":"uniqueOrder","alsoAppliesTo":["::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/opacity"},"order":{"syntax":"<integer>","media":"visual","inherited":false,"animationType":"integer","percentages":"no","groups":["CSS Flexible Box Layout"],"initial":"0","appliesto":"flexItemsAndAbsolutelyPositionedFlexContainerChildren","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/order"},"orphans":{"syntax":"<integer>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fragmentation"],"initial":"2","appliesto":"blockContainerElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/orphans"},"outline":{"syntax":"[ <\'outline-color\'> || <\'outline-style\'> || <\'outline-width\'> ]","media":["visual","interactive"],"inherited":false,"animationType":["outline-color","outline-width","outline-style"],"percentages":"no","groups":["CSS Basic User Interface"],"initial":["outline-color","outline-style","outline-width"],"appliesto":"allElements","computed":["outline-color","outline-width","outline-style"],"order":"orderOfAppearance","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/outline"},"outline-color":{"syntax":"<color> | invert","media":["visual","interactive"],"inherited":false,"animationType":"color","percentages":"no","groups":["CSS Basic User Interface"],"initial":"invertOrCurrentColor","appliesto":"allElements","computed":"invertForTranslucentColorRGBAOtherwiseRGB","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/outline-color"},"outline-offset":{"syntax":"<length>","media":["visual","interactive"],"inherited":false,"animationType":"length","percentages":"no","groups":["CSS Basic User Interface"],"initial":"0","appliesto":"allElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/outline-offset"},"outline-style":{"syntax":"auto | <\'border-style\'>","media":["visual","interactive"],"inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/outline-style"},"outline-width":{"syntax":"<line-width>","media":["visual","interactive"],"inherited":false,"animationType":"length","percentages":"no","groups":["CSS Basic User Interface"],"initial":"medium","appliesto":"allElements","computed":"absoluteLength0ForNone","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/outline-width"},"overflow":{"syntax":"[ visible | hidden | clip | scroll | auto ]{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Overflow"],"initial":"visible","appliesto":"blockContainersFlexContainersGridContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/overflow"},"overflow-anchor":{"syntax":"auto | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Scroll Anchoring"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"experimental"},"overflow-block":{"syntax":"visible | hidden | clip | scroll | auto","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Overflow"],"initial":"auto","appliesto":"blockContainersFlexContainersGridContainers","computed":"asSpecified","order":"perGrammar","status":"experimental"},"overflow-clip-box":{"syntax":"padding-box | content-box","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Mozilla Extensions"],"initial":"padding-box","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Mozilla/CSS/overflow-clip-box"},"overflow-inline":{"syntax":"visible | hidden | clip | scroll | auto","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Overflow"],"initial":"auto","appliesto":"blockContainersFlexContainersGridContainers","computed":"asSpecified","order":"perGrammar","status":"experimental"},"overflow-wrap":{"syntax":"normal | break-word | anywhere","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"normal","appliesto":"nonReplacedInlineElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/overflow-wrap"},"overflow-x":{"syntax":"visible | hidden | clip | scroll | auto","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Overflow"],"initial":"visible","appliesto":"blockContainersFlexContainersGridContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/overflow-x"},"overflow-y":{"syntax":"visible | hidden | clip | scroll | auto","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Overflow"],"initial":"visible","appliesto":"blockContainersFlexContainersGridContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/overflow-y"},"overscroll-behavior":{"syntax":"[ contain | none | auto ]{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Model"],"initial":"auto","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior"},"overscroll-behavior-x":{"syntax":"contain | none | auto","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Model"],"initial":"auto","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-x"},"overscroll-behavior-y":{"syntax":"contain | none | auto","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Model"],"initial":"auto","appliesto":"nonReplacedBlockAndInlineBlockElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-y"},"padding":{"syntax":"[ <length> | <percentage> ]{1,4}","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":["padding-bottom","padding-left","padding-right","padding-top"],"appliesto":"allElementsExceptInternalTableDisplayTypes","computed":["padding-bottom","padding-left","padding-right","padding-top"],"order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding"},"padding-block":{"syntax":"<\'padding-left\'>{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElements","computed":"asLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-block"},"padding-block-end":{"syntax":"<\'padding-left\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElements","computed":"asLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-block-end"},"padding-block-start":{"syntax":"<\'padding-left\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElements","computed":"asLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-block-start"},"padding-bottom":{"syntax":"<length> | <percentage>","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"0","appliesto":"allElementsExceptInternalTableDisplayTypes","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-bottom"},"padding-inline":{"syntax":"<\'padding-left\'>{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElements","computed":"asLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-inline"},"padding-inline-end":{"syntax":"<\'padding-left\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElements","computed":"asLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-inline-end"},"padding-inline-start":{"syntax":"<\'padding-left\'>","media":"visual","inherited":false,"animationType":"discrete","percentages":"logicalWidthOfContainingBlock","groups":["CSS Logical Properties"],"initial":"0","appliesto":"allElements","computed":"asLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-inline-start"},"padding-left":{"syntax":"<length> | <percentage>","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"0","appliesto":"allElementsExceptInternalTableDisplayTypes","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-left"},"padding-right":{"syntax":"<length> | <percentage>","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"0","appliesto":"allElementsExceptInternalTableDisplayTypes","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-right"},"padding-top":{"syntax":"<length> | <percentage>","media":"visual","inherited":false,"animationType":"length","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"0","appliesto":"allElementsExceptInternalTableDisplayTypes","computed":"percentageAsSpecifiedOrAbsoluteLength","order":"uniqueOrder","alsoAppliesTo":["::first-letter"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/padding-top"},"page-break-after":{"syntax":"auto | always | avoid | left | right | recto | verso","media":["visual","paged"],"inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Pages"],"initial":"auto","appliesto":"blockElementsInNormalFlow","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/page-break-after"},"page-break-before":{"syntax":"auto | always | avoid | left | right | recto | verso","media":["visual","paged"],"inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Pages"],"initial":"auto","appliesto":"blockElementsInNormalFlow","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/page-break-before"},"page-break-inside":{"syntax":"auto | avoid","media":["visual","paged"],"inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Pages"],"initial":"auto","appliesto":"blockElementsInNormalFlow","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/page-break-inside"},"paint-order":{"syntax":"normal | [ fill || stroke || markers ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"normal","appliesto":"textElements","computed":"asSpecified","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/paint-order"},"perspective":{"syntax":"none | <length>","media":"visual","inherited":false,"animationType":"length","percentages":"no","groups":["CSS Transforms"],"initial":"none","appliesto":"transformableElements","computed":"absoluteLengthOrNone","order":"uniqueOrder","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/perspective"},"perspective-origin":{"syntax":"<position>","media":"visual","inherited":false,"animationType":"simpleListOfLpc","percentages":"referToSizeOfBoundingBox","groups":["CSS Transforms"],"initial":"50% 50%","appliesto":"transformableElements","computed":"forLengthAbsoluteValueOtherwisePercentage","order":"oneOrTwoValuesLengthAbsoluteKeywordsPercentages","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/perspective-origin"},"place-content":{"syntax":"<\'align-content\'> <\'justify-content\'>?","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":"normal","appliesto":"multilineFlexContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/place-content"},"place-items":{"syntax":"<\'align-items\'> <\'justify-items\'>?","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":["align-items","justify-items"],"appliesto":"allElements","computed":["align-items","justify-items"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/place-items"},"place-self":{"syntax":"<\'align-self\'> <\'justify-self\'>?","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Box Alignment"],"initial":["align-self","justify-self"],"appliesto":"blockLevelBoxesAndAbsolutelyPositionedBoxesAndGridItems","computed":["align-self","justify-self"],"order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/place-self"},"pointer-events":{"syntax":"auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["Pointer Events"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/pointer-events"},"position":{"syntax":"static | relative | absolute | sticky | fixed","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Positioning"],"initial":"static","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/position"},"quotes":{"syntax":"none | auto | [ <string> <string> ]+","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Generated Content"],"initial":"dependsOnUserAgent","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/quotes"},"resize":{"syntax":"none | both | horizontal | vertical | block | inline","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"none","appliesto":"elementsWithOverflowNotVisibleAndReplacedElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/resize"},"right":{"syntax":"<length> | <percentage> | auto","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToWidthOfContainingBlock","groups":["CSS Positioning"],"initial":"auto","appliesto":"positionedElements","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/right"},"rotate":{"syntax":"none | <angle> | [ x | y | z | <number>{3} ] && <angle>","media":"visual","inherited":false,"animationType":"transform","percentages":"no","groups":["CSS Transforms"],"initial":"none","appliesto":"transformableElements","computed":"asSpecified","order":"perGrammar","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/rotate"},"row-gap":{"syntax":"normal | <length-percentage>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToDimensionOfContentArea","groups":["CSS Box Alignment"],"initial":"normal","appliesto":"multiColumnElementsFlexContainersGridContainers","computed":"asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/row-gap"},"ruby-align":{"syntax":"start | center | space-between | space-around","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Ruby"],"initial":"space-around","appliesto":"rubyBasesAnnotationsBaseAnnotationContainers","computed":"asSpecified","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/ruby-align"},"ruby-merge":{"syntax":"separate | collapse | auto","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Ruby"],"initial":"separate","appliesto":"rubyAnnotationsContainers","computed":"asSpecified","order":"uniqueOrder","status":"experimental"},"ruby-position":{"syntax":"over | under | inter-character","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Ruby"],"initial":"over","appliesto":"rubyAnnotationsContainers","computed":"asSpecified","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/ruby-position"},"scale":{"syntax":"none | <number>{1,3}","media":"visual","inherited":false,"animationType":"transform","percentages":"no","groups":["CSS Transforms"],"initial":"none","appliesto":"transformableElements","computed":"asSpecified","order":"perGrammar","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scale"},"scrollbar-color":{"syntax":"auto | dark | light | <color>{2}","media":"visual","inherited":true,"animationType":"color","percentages":"no","groups":["CSS Scrollbars"],"initial":"auto","appliesto":"scrollingBoxes","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scrollbar-color"},"scrollbar-width":{"syntax":"auto | thin | none","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Scrollbars"],"initial":"auto","appliesto":"scrollingBoxes","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scrollbar-width"},"scroll-behavior":{"syntax":"auto | smooth","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSSOM View"],"initial":"auto","appliesto":"scrollingBoxes","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-behavior"},"scroll-margin":{"syntax":"<length>{1,4}","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin"},"scroll-margin-block":{"syntax":"<length>{1,2}","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block"},"scroll-margin-block-start":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-start"},"scroll-margin-block-end":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-end"},"scroll-margin-bottom":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-bottom"},"scroll-margin-inline":{"syntax":"<length>{1,2}","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline"},"scroll-margin-inline-start":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-start"},"scroll-margin-inline-end":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-end"},"scroll-margin-left":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-left"},"scroll-margin-right":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-right"},"scroll-margin-top":{"syntax":"<length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Scroll Snap"],"initial":"0","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-margin-top"},"scroll-padding":{"syntax":"[ auto | <length-percentage> ]{1,4}","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding"},"scroll-padding-block":{"syntax":"[ auto | <length-percentage> ]{1,2}","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block"},"scroll-padding-block-start":{"syntax":"auto | <length-percentage>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-start"},"scroll-padding-block-end":{"syntax":"auto | <length-percentage>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-end"},"scroll-padding-bottom":{"syntax":"auto | <length-percentage>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-bottom"},"scroll-padding-inline":{"syntax":"[ auto | <length-percentage> ]{1,2}","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline"},"scroll-padding-inline-start":{"syntax":"auto | <length-percentage>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline-start"},"scroll-padding-inline-end":{"syntax":"auto | <length-percentage>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline-end"},"scroll-padding-left":{"syntax":"auto | <length-percentage>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-left"},"scroll-padding-right":{"syntax":"auto | <length-percentage>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-right"},"scroll-padding-top":{"syntax":"auto | <length-percentage>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"relativeToTheScrollContainersScrollport","groups":["CSS Scroll Snap"],"initial":"auto","appliesto":"scrollContainers","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-padding-top"},"scroll-snap-align":{"syntax":"[ none | start | end | center ]{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Scroll Snap"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-align"},"scroll-snap-coordinate":{"syntax":"none | <position>#","media":"interactive","inherited":false,"animationType":"position","percentages":"referToBorderBox","groups":["CSS Scroll Snap"],"initial":"none","appliesto":"allElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-coordinate"},"scroll-snap-destination":{"syntax":"<position>","media":"interactive","inherited":false,"animationType":"position","percentages":"relativeToScrollContainerPaddingBoxAxis","groups":["CSS Scroll Snap"],"initial":"0px 0px","appliesto":"scrollContainers","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-destination"},"scroll-snap-points-x":{"syntax":"none | repeat( <length-percentage> )","media":"interactive","inherited":false,"animationType":"discrete","percentages":"relativeToScrollContainerPaddingBoxAxis","groups":["CSS Scroll Snap"],"initial":"none","appliesto":"scrollContainers","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-points-x"},"scroll-snap-points-y":{"syntax":"none | repeat( <length-percentage> )","media":"interactive","inherited":false,"animationType":"discrete","percentages":"relativeToScrollContainerPaddingBoxAxis","groups":["CSS Scroll Snap"],"initial":"none","appliesto":"scrollContainers","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-points-y"},"scroll-snap-stop":{"syntax":"normal | always","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Scroll Snap"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop"},"scroll-snap-type":{"syntax":"none | [ x | y | block | inline | both ] [ mandatory | proximity ]?","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Scroll Snap"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type"},"scroll-snap-type-x":{"syntax":"none | mandatory | proximity","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Scroll Snap"],"initial":"none","appliesto":"scrollContainers","computed":"asSpecified","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type-x"},"scroll-snap-type-y":{"syntax":"none | mandatory | proximity","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Scroll Snap"],"initial":"none","appliesto":"scrollContainers","computed":"asSpecified","order":"uniqueOrder","status":"obsolete","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type-y"},"shape-image-threshold":{"syntax":"<alpha-value>","media":"visual","inherited":false,"animationType":"number","percentages":"no","groups":["CSS Shapes"],"initial":"0.0","appliesto":"floats","computed":"specifiedValueNumberClipped0To1","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/shape-image-threshold"},"shape-margin":{"syntax":"<length-percentage>","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToWidthOfContainingBlock","groups":["CSS Shapes"],"initial":"0","appliesto":"floats","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/shape-margin"},"shape-outside":{"syntax":"none | <shape-box> || <basic-shape> | <image>","media":"visual","inherited":false,"animationType":"basicShapeOtherwiseNo","percentages":"no","groups":["CSS Shapes"],"initial":"none","appliesto":"floats","computed":"asDefinedForBasicShapeWithAbsoluteURIOtherwiseAsSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/shape-outside"},"tab-size":{"syntax":"<integer> | <length>","media":"visual","inherited":true,"animationType":"length","percentages":"no","groups":["CSS Text"],"initial":"8","appliesto":"blockContainers","computed":"specifiedIntegerOrAbsoluteLength","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/tab-size"},"table-layout":{"syntax":"auto | fixed","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Table"],"initial":"auto","appliesto":"tableElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/table-layout"},"text-align":{"syntax":"start | end | left | right | center | justify | match-parent","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"startOrNamelessValueIfLTRRightIfRTL","appliesto":"blockContainers","computed":"asSpecifiedExceptMatchParent","order":"orderOfAppearance","alsoAppliesTo":["::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-align"},"text-align-last":{"syntax":"auto | start | end | left | right | center | justify","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"auto","appliesto":"blockContainers","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-align-last"},"text-combine-upright":{"syntax":"none | all | [ digits <integer>? ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Writing Modes"],"initial":"none","appliesto":"nonReplacedInlineElements","computed":"keywordPlusIntegerIfDigits","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-combine-upright"},"text-decoration":{"syntax":"<\'text-decoration-line\'> || <\'text-decoration-style\'> || <\'text-decoration-color\'> || <\'text-decoration-thickness\'>","media":"visual","inherited":false,"animationType":["text-decoration-color","text-decoration-style","text-decoration-line","text-decoration-thickness"],"percentages":"no","groups":["CSS Text Decoration"],"initial":["text-decoration-color","text-decoration-style","text-decoration-line"],"appliesto":"allElements","computed":["text-decoration-line","text-decoration-style","text-decoration-color","text-decoration-thickness"],"order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-decoration"},"text-decoration-color":{"syntax":"<color>","media":"visual","inherited":false,"animationType":"color","percentages":"no","groups":["CSS Text Decoration"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-decoration-color"},"text-decoration-line":{"syntax":"none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Text Decoration"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-decoration-line"},"text-decoration-skip":{"syntax":"none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text Decoration"],"initial":"objects","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-decoration-skip"},"text-decoration-skip-ink":{"syntax":"auto | none","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text Decoration"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-decoration-skip-ink"},"text-decoration-style":{"syntax":"solid | double | dotted | dashed | wavy","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Text Decoration"],"initial":"solid","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-decoration-style"},"text-decoration-thickness":{"syntax":"auto | from-font | <length>","media":"visual","inherited":false,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Text Decoration"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-decoration-thickness"},"text-emphasis":{"syntax":"<\'text-emphasis-style\'> || <\'text-emphasis-color\'>","media":"visual","inherited":false,"animationType":["text-emphasis-color","text-emphasis-style"],"percentages":"no","groups":["CSS Text Decoration"],"initial":["text-emphasis-style","text-emphasis-color"],"appliesto":"allElements","computed":["text-emphasis-style","text-emphasis-color"],"order":"orderOfAppearance","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-emphasis"},"text-emphasis-color":{"syntax":"<color>","media":"visual","inherited":false,"animationType":"color","percentages":"no","groups":["CSS Text Decoration"],"initial":"currentcolor","appliesto":"allElements","computed":"computedColor","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-emphasis-color"},"text-emphasis-position":{"syntax":"[ over | under ] && [ right | left ]","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Text Decoration"],"initial":"over right","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-emphasis-position"},"text-emphasis-style":{"syntax":"none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Text Decoration"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-emphasis-style"},"text-indent":{"syntax":"<length-percentage> && hanging? && each-line?","media":"visual","inherited":true,"animationType":"lpc","percentages":"referToWidthOfContainingBlock","groups":["CSS Text"],"initial":"0","appliesto":"blockContainers","computed":"percentageOrAbsoluteLengthPlusKeywords","order":"lengthOrPercentageBeforeKeywords","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-indent"},"text-justify":{"syntax":"auto | inter-character | inter-word | none","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"auto","appliesto":"inlineLevelAndTableCellElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-justify"},"text-orientation":{"syntax":"mixed | upright | sideways","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Writing Modes"],"initial":"mixed","appliesto":"allElementsExceptTableRowGroupsRowsColumnGroupsAndColumns","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-orientation"},"text-overflow":{"syntax":"[ clip | ellipsis | <string> ]{1,2}","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"clip","appliesto":"blockContainerElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-overflow"},"text-rendering":{"syntax":"auto | optimizeSpeed | optimizeLegibility | geometricPrecision","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Miscellaneous"],"initial":"auto","appliesto":"textElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-rendering"},"text-shadow":{"syntax":"none | <shadow-t>#","media":"visual","inherited":true,"animationType":"shadowList","percentages":"no","groups":["CSS Text Decoration"],"initial":"none","appliesto":"allElements","computed":"colorPlusThreeAbsoluteLengths","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-shadow"},"text-size-adjust":{"syntax":"none | auto | <percentage>","media":"visual","inherited":true,"animationType":"discrete","percentages":"referToSizeOfFont","groups":["CSS Text"],"initial":"autoForSmartphoneBrowsersSupportingInflation","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"experimental","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-size-adjust"},"text-transform":{"syntax":"none | capitalize | uppercase | lowercase | full-width | full-size-kana","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"none","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-transform"},"text-underline-offset":{"syntax":"auto | from-font | <length>","media":"visual","inherited":true,"animationType":"byComputedValueType","percentages":"no","groups":["CSS Text Decoration"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-underline-offset"},"text-underline-position":{"syntax":"auto | [ under || [ left | right ] ]","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text Decoration"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"orderOfAppearance","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/text-underline-position"},"top":{"syntax":"<length> | <percentage> | auto","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToContainingBlockHeight","groups":["CSS Positioning"],"initial":"auto","appliesto":"positionedElements","computed":"lengthAbsolutePercentageAsSpecifiedOtherwiseAuto","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/top"},"touch-action":{"syntax":"auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["Pointer Events"],"initial":"auto","appliesto":"allElementsExceptNonReplacedInlineElementsTableRowsColumnsRowColumnGroups","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/touch-action"},"transform":{"syntax":"none | <transform-list>","media":"visual","inherited":false,"animationType":"transform","percentages":"referToSizeOfBoundingBox","groups":["CSS Transforms"],"initial":"none","appliesto":"transformableElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"uniqueOrder","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transform"},"transform-box":{"syntax":"border-box | fill-box | view-box","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Transforms"],"initial":"border-box ","appliesto":"transformableElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transform-box"},"transform-origin":{"syntax":"[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?","media":"visual","inherited":false,"animationType":"simpleListOfLpc","percentages":"referToSizeOfBoundingBox","groups":["CSS Transforms"],"initial":"50% 50% 0","appliesto":"transformableElements","computed":"forLengthAbsoluteValueOtherwisePercentage","order":"oneOrTwoValuesLengthAbsoluteKeywordsPercentages","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transform-origin"},"transform-style":{"syntax":"flat | preserve-3d","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Transforms"],"initial":"flat","appliesto":"transformableElements","computed":"asSpecified","order":"uniqueOrder","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transform-style"},"transition":{"syntax":"<single-transition>#","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Transitions"],"initial":["transition-delay","transition-duration","transition-property","transition-timing-function"],"appliesto":"allElementsAndPseudos","computed":["transition-delay","transition-duration","transition-property","transition-timing-function"],"order":"orderOfAppearance","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transition"},"transition-delay":{"syntax":"<time>#","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Transitions"],"initial":"0s","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transition-delay"},"transition-duration":{"syntax":"<time>#","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Transitions"],"initial":"0s","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transition-duration"},"transition-property":{"syntax":"none | <single-transition-property>#","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Transitions"],"initial":"all","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transition-property"},"transition-timing-function":{"syntax":"<timing-function>#","media":"interactive","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Transitions"],"initial":"ease","appliesto":"allElementsAndPseudos","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/transition-timing-function"},"translate":{"syntax":"none | <length-percentage> [ <length-percentage> <length>? ]?","media":"visual","inherited":false,"animationType":"transform","percentages":"referToSizeOfBoundingBox","groups":["CSS Transforms"],"initial":"none","appliesto":"transformableElements","computed":"asSpecifiedRelativeToAbsoluteLengths","order":"perGrammar","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/translate"},"unicode-bidi":{"syntax":"normal | embed | isolate | bidi-override | isolate-override | plaintext","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Writing Modes"],"initial":"normal","appliesto":"allElementsSomeValuesNoEffectOnNonInlineElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/unicode-bidi"},"user-select":{"syntax":"auto | text | none | contain | all","media":"visual","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Basic User Interface"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/user-select"},"vertical-align":{"syntax":"baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>","media":"visual","inherited":false,"animationType":"length","percentages":"referToLineHeight","groups":["CSS Table"],"initial":"baseline","appliesto":"inlineLevelAndTableCellElements","computed":"absoluteLengthOrKeyword","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/vertical-align"},"visibility":{"syntax":"visible | hidden | collapse","media":"visual","inherited":true,"animationType":"visibility","percentages":"no","groups":["CSS Box Model"],"initial":"visible","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/visibility"},"white-space":{"syntax":"normal | pre | nowrap | pre-wrap | pre-line | break-spaces","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/white-space"},"widows":{"syntax":"<integer>","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Fragmentation"],"initial":"2","appliesto":"blockContainerElements","computed":"asSpecified","order":"perGrammar","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/widows"},"width":{"syntax":"[ <length> | <percentage> ] && [ border-box | content-box ]? | available | min-content | max-content | fit-content | auto","media":"visual","inherited":false,"animationType":"lpc","percentages":"referToWidthOfContainingBlock","groups":["CSS Box Model"],"initial":"auto","appliesto":"allElementsButNonReplacedAndTableRows","computed":"percentageAutoOrAbsoluteLength","order":"lengthOrPercentageBeforeKeywordIfBothPresent","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/width"},"will-change":{"syntax":"auto | <animateable-feature>#","media":"all","inherited":false,"animationType":"discrete","percentages":"no","groups":["CSS Will Change"],"initial":"auto","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/will-change"},"word-break":{"syntax":"normal | break-all | keep-all | break-word","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/word-break"},"word-spacing":{"syntax":"normal | <length-percentage>","media":"visual","inherited":true,"animationType":"length","percentages":"referToWidthOfAffectedGlyph","groups":["CSS Text"],"initial":"normal","appliesto":"allElements","computed":"optimumMinAndMaxValueOfAbsoluteLengthPercentageOrNormal","order":"uniqueOrder","alsoAppliesTo":["::first-letter","::first-line","::placeholder"],"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/word-spacing"},"word-wrap":{"syntax":"normal | break-word","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Text"],"initial":"normal","appliesto":"nonReplacedInlineElements","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/overflow-wrap"},"writing-mode":{"syntax":"horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr","media":"visual","inherited":true,"animationType":"discrete","percentages":"no","groups":["CSS Writing Modes"],"initial":"horizontal-tb","appliesto":"allElementsExceptTableRowColumnGroupsTableRowsColumns","computed":"asSpecified","order":"uniqueOrder","status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/writing-mode"},"z-index":{"syntax":"auto | <integer>","media":"visual","inherited":false,"animationType":"integer","percentages":"no","groups":["CSS Positioning"],"initial":"auto","appliesto":"positionedElements","computed":"asSpecified","order":"uniqueOrder","stacking":true,"status":"standard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/z-index"},"zoom":{"syntax":"normal | reset | <number> | <percentage>","media":"visual","inherited":false,"animationType":"integer","percentages":"no","groups":["Microsoft Extensions"],"initial":"normal","appliesto":"allElements","computed":"asSpecified","order":"uniqueOrder","status":"nonstandard","mdn_url":"https://developer.mozilla.org/docs/Web/CSS/zoom"}}');
    },
    9262: function(module) {
      "use strict";
      module.exports = JSON.parse('{"absolute-size":{"syntax":"xx-small | x-small | small | medium | large | x-large | xx-large | xxx-large"},"alpha-value":{"syntax":"<number> | <percentage>"},"angle-percentage":{"syntax":"<angle> | <percentage>"},"angular-color-hint":{"syntax":"<angle-percentage>"},"angular-color-stop":{"syntax":"<color> && <color-stop-angle>?"},"angular-color-stop-list":{"syntax":"[ <angular-color-stop> [, <angular-color-hint>]? ]# , <angular-color-stop>"},"animateable-feature":{"syntax":"scroll-position | contents | <custom-ident>"},"attachment":{"syntax":"scroll | fixed | local"},"attr()":{"syntax":"attr( <attr-name> <type-or-unit>? [, <attr-fallback> ]? )"},"attr-matcher":{"syntax":"[ \'~\' | \'|\' | \'^\' | \'$\' | \'*\' ]? \'=\'"},"attr-modifier":{"syntax":"i | s"},"attribute-selector":{"syntax":"\'[\' <wq-name> \']\' | \'[\' <wq-name> <attr-matcher> [ <string-token> | <ident-token> ] <attr-modifier>? \']\'"},"auto-repeat":{"syntax":"repeat( [ auto-fill | auto-fit ] , [ <line-names>? <fixed-size> ]+ <line-names>? )"},"auto-track-list":{"syntax":"[ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>? <auto-repeat>\\n[ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>?"},"baseline-position":{"syntax":"[ first | last ]? baseline"},"basic-shape":{"syntax":"<inset()> | <circle()> | <ellipse()> | <polygon()>"},"bg-image":{"syntax":"none | <image>"},"bg-layer":{"syntax":"<bg-image> || <bg-position> [ / <bg-size> ]? || <repeat-style> || <attachment> || <box> || <box>"},"bg-position":{"syntax":"[ [ left | center | right | top | bottom | <length-percentage> ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ] | [ center | [ left | right ] <length-percentage>? ] && [ center | [ top | bottom ] <length-percentage>? ] ]"},"bg-size":{"syntax":"[ <length-percentage> | auto ]{1,2} | cover | contain"},"blur()":{"syntax":"blur( <length> )"},"blend-mode":{"syntax":"normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity"},"box":{"syntax":"border-box | padding-box | content-box"},"brightness()":{"syntax":"brightness( <number-percentage> )"},"calc()":{"syntax":"calc( <calc-sum> )"},"calc-sum":{"syntax":"<calc-product> [ [ \'+\' | \'-\' ] <calc-product> ]*"},"calc-product":{"syntax":"<calc-value> [ \'*\' <calc-value> | \'/\' <number> ]*"},"calc-value":{"syntax":"<number> | <dimension> | <percentage> | ( <calc-sum> )"},"cf-final-image":{"syntax":"<image> | <color>"},"cf-mixing-image":{"syntax":"<percentage>? && <image>"},"circle()":{"syntax":"circle( [ <shape-radius> ]? [ at <position> ]? )"},"clamp()":{"syntax":"clamp( <calc-sum>#{3} )"},"class-selector":{"syntax":"\'.\' <ident-token>"},"clip-source":{"syntax":"<url>"},"color":{"syntax":"<rgb()> | <rgba()> | <hsl()> | <hsla()> | <hex-color> | <named-color> | currentcolor | <deprecated-system-color>"},"color-stop":{"syntax":"<color-stop-length> | <color-stop-angle>"},"color-stop-angle":{"syntax":"<angle-percentage>{1,2}"},"color-stop-length":{"syntax":"<length-percentage>{1,2}"},"color-stop-list":{"syntax":"[ <linear-color-stop> [, <linear-color-hint>]? ]# , <linear-color-stop>"},"combinator":{"syntax":"\'>\' | \'+\' | \'~\' | [ \'||\' ]"},"common-lig-values":{"syntax":"[ common-ligatures | no-common-ligatures ]"},"compat":{"syntax":"searchfield | textarea | push-button | button-bevel | slider-horizontal | checkbox | radio | square-button | menulist | menulist-button | listbox | meter | progress-bar"},"composite-style":{"syntax":"clear | copy | source-over | source-in | source-out | source-atop | destination-over | destination-in | destination-out | destination-atop | xor"},"compositing-operator":{"syntax":"add | subtract | intersect | exclude"},"compound-selector":{"syntax":"[ <type-selector>? <subclass-selector>* [ <pseudo-element-selector> <pseudo-class-selector>* ]* ]!"},"compound-selector-list":{"syntax":"<compound-selector>#"},"complex-selector":{"syntax":"<compound-selector> [ <combinator>? <compound-selector> ]*"},"complex-selector-list":{"syntax":"<complex-selector>#"},"conic-gradient()":{"syntax":"conic-gradient( [ from <angle> ]? [ at <position> ]?, <angular-color-stop-list> )"},"contextual-alt-values":{"syntax":"[ contextual | no-contextual ]"},"content-distribution":{"syntax":"space-between | space-around | space-evenly | stretch"},"content-list":{"syntax":"[ <string> | contents | <image> | <quote> | <target> | <leader()> ]+"},"content-position":{"syntax":"center | start | end | flex-start | flex-end"},"content-replacement":{"syntax":"<image>"},"contrast()":{"syntax":"contrast( [ <number-percentage> ] )"},"counter()":{"syntax":"counter( <custom-ident>, <counter-style>? )"},"counter-style":{"syntax":"<counter-style-name> | symbols()"},"counter-style-name":{"syntax":"<custom-ident>"},"counters()":{"syntax":"counters( <custom-ident>, <string>, <counter-style>? )"},"cross-fade()":{"syntax":"cross-fade( <cf-mixing-image> , <cf-final-image>? )"},"cubic-bezier-timing-function":{"syntax":"ease | ease-in | ease-out | ease-in-out | cubic-bezier(<number>, <number>, <number>, <number>)"},"deprecated-system-color":{"syntax":"ActiveBorder | ActiveCaption | AppWorkspace | Background | ButtonFace | ButtonHighlight | ButtonShadow | ButtonText | CaptionText | GrayText | Highlight | HighlightText | InactiveBorder | InactiveCaption | InactiveCaptionText | InfoBackground | InfoText | Menu | MenuText | Scrollbar | ThreeDDarkShadow | ThreeDFace | ThreeDHighlight | ThreeDLightShadow | ThreeDShadow | Window | WindowFrame | WindowText"},"discretionary-lig-values":{"syntax":"[ discretionary-ligatures | no-discretionary-ligatures ]"},"display-box":{"syntax":"contents | none"},"display-inside":{"syntax":"flow | flow-root | table | flex | grid | ruby"},"display-internal":{"syntax":"table-row-group | table-header-group | table-footer-group | table-row | table-cell | table-column-group | table-column | table-caption | ruby-base | ruby-text | ruby-base-container | ruby-text-container"},"display-legacy":{"syntax":"inline-block | inline-list-item | inline-table | inline-flex | inline-grid"},"display-listitem":{"syntax":"<display-outside>? && [ flow | flow-root ]? && list-item"},"display-outside":{"syntax":"block | inline | run-in"},"drop-shadow()":{"syntax":"drop-shadow( <length>{2,3} <color>? )"},"east-asian-variant-values":{"syntax":"[ jis78 | jis83 | jis90 | jis04 | simplified | traditional ]"},"east-asian-width-values":{"syntax":"[ full-width | proportional-width ]"},"element()":{"syntax":"element( <id-selector> )"},"ellipse()":{"syntax":"ellipse( [ <shape-radius>{2} ]? [ at <position> ]? )"},"ending-shape":{"syntax":"circle | ellipse"},"env()":{"syntax":"env( <custom-ident> , <declaration-value>? )"},"explicit-track-list":{"syntax":"[ <line-names>? <track-size> ]+ <line-names>?"},"family-name":{"syntax":"<string> | <custom-ident>+"},"feature-tag-value":{"syntax":"<string> [ <integer> | on | off ]?"},"feature-type":{"syntax":"@stylistic | @historical-forms | @styleset | @character-variant | @swash | @ornaments | @annotation"},"feature-value-block":{"syntax":"<feature-type> \'{\' <feature-value-declaration-list> \'}\'"},"feature-value-block-list":{"syntax":"<feature-value-block>+"},"feature-value-declaration":{"syntax":"<custom-ident>: <integer>+;"},"feature-value-declaration-list":{"syntax":"<feature-value-declaration>"},"feature-value-name":{"syntax":"<custom-ident>"},"fill-rule":{"syntax":"nonzero | evenodd"},"filter-function":{"syntax":"<blur()> | <brightness()> | <contrast()> | <drop-shadow()> | <grayscale()> | <hue-rotate()> | <invert()> | <opacity()> | <saturate()> | <sepia()>"},"filter-function-list":{"syntax":"[ <filter-function> | <url> ]+"},"final-bg-layer":{"syntax":"<\'background-color\'> || <bg-image> || <bg-position> [ / <bg-size> ]? || <repeat-style> || <attachment> || <box> || <box>"},"fit-content()":{"syntax":"fit-content( [ <length> | <percentage> ] )"},"fixed-breadth":{"syntax":"<length-percentage>"},"fixed-repeat":{"syntax":"repeat( [ <positive-integer> ] , [ <line-names>? <fixed-size> ]+ <line-names>? )"},"fixed-size":{"syntax":"<fixed-breadth> | minmax( <fixed-breadth> , <track-breadth> ) | minmax( <inflexible-breadth> , <fixed-breadth> )"},"font-stretch-absolute":{"syntax":"normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | <percentage>"},"font-variant-css21":{"syntax":"[ normal | small-caps ]"},"font-weight-absolute":{"syntax":"normal | bold | <number>"},"frequency-percentage":{"syntax":"<frequency> | <percentage>"},"general-enclosed":{"syntax":"[ <function-token> <any-value> ) ] | ( <ident> <any-value> )"},"generic-family":{"syntax":"serif | sans-serif | cursive | fantasy | monospace"},"generic-name":{"syntax":"serif | sans-serif | cursive | fantasy | monospace"},"geometry-box":{"syntax":"<shape-box> | fill-box | stroke-box | view-box"},"gradient":{"syntax":"<linear-gradient()> | <repeating-linear-gradient()> | <radial-gradient()> | <repeating-radial-gradient()> | <conic-gradient()>"},"grayscale()":{"syntax":"grayscale( <number-percentage> )"},"grid-line":{"syntax":"auto | <custom-ident> | [ <integer> && <custom-ident>? ] | [ span && [ <integer> || <custom-ident> ] ]"},"historical-lig-values":{"syntax":"[ historical-ligatures | no-historical-ligatures ]"},"hsl()":{"syntax":"hsl( <hue> <percentage> <percentage> [ / <alpha-value> ]? ) | hsl( <hue>, <percentage>, <percentage>, <alpha-value>? )"},"hsla()":{"syntax":"hsla( <hue> <percentage> <percentage> [ / <alpha-value> ]? ) | hsla( <hue>, <percentage>, <percentage>, <alpha-value>? )"},"hue":{"syntax":"<number> | <angle>"},"hue-rotate()":{"syntax":"hue-rotate( <angle> )"},"id-selector":{"syntax":"<hash-token>"},"image":{"syntax":"<url> | <image()> | <image-set()> | <element()> | <paint()> | <cross-fade()> | <gradient>"},"image()":{"syntax":"image( <image-tags>? [ <image-src>? , <color>? ]! )"},"image-set()":{"syntax":"image-set( <image-set-option># )"},"image-set-option":{"syntax":"[ <image> | <string> ] <resolution>"},"image-src":{"syntax":"<url> | <string>"},"image-tags":{"syntax":"ltr | rtl"},"inflexible-breadth":{"syntax":"<length> | <percentage> | min-content | max-content | auto"},"inset()":{"syntax":"inset( <length-percentage>{1,4} [ round <\'border-radius\'> ]? )"},"invert()":{"syntax":"invert( <number-percentage> )"},"keyframes-name":{"syntax":"<custom-ident> | <string>"},"keyframe-block":{"syntax":"<keyframe-selector># {\\n  <declaration-list>\\n}"},"keyframe-block-list":{"syntax":"<keyframe-block>+"},"keyframe-selector":{"syntax":"from | to | <percentage>"},"leader()":{"syntax":"leader( <leader-type> )"},"leader-type":{"syntax":"dotted | solid | space | <string>"},"length-percentage":{"syntax":"<length> | <percentage>"},"line-names":{"syntax":"\'[\' <custom-ident>* \']\'"},"line-name-list":{"syntax":"[ <line-names> | <name-repeat> ]+"},"line-style":{"syntax":"none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset"},"line-width":{"syntax":"<length> | thin | medium | thick"},"linear-color-hint":{"syntax":"<length-percentage>"},"linear-color-stop":{"syntax":"<color> <color-stop-length>?"},"linear-gradient()":{"syntax":"linear-gradient( [ <angle> | to <side-or-corner> ]? , <color-stop-list> )"},"mask-layer":{"syntax":"<mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || <geometry-box> || [ <geometry-box> | no-clip ] || <compositing-operator> || <masking-mode>"},"mask-position":{"syntax":"[ <length-percentage> | left | center | right ] [ <length-percentage> | top | center | bottom ]?"},"mask-reference":{"syntax":"none | <image> | <mask-source>"},"mask-source":{"syntax":"<url>"},"masking-mode":{"syntax":"alpha | luminance | match-source"},"matrix()":{"syntax":"matrix( <number>#{6} )"},"matrix3d()":{"syntax":"matrix3d( <number>#{16} )"},"max()":{"syntax":"max( <calc-sum># )"},"media-and":{"syntax":"<media-in-parens> [ and <media-in-parens> ]+"},"media-condition":{"syntax":"<media-not> | <media-and> | <media-or> | <media-in-parens>"},"media-condition-without-or":{"syntax":"<media-not> | <media-and> | <media-in-parens>"},"media-feature":{"syntax":"( [ <mf-plain> | <mf-boolean> | <mf-range> ] )"},"media-in-parens":{"syntax":"( <media-condition> ) | <media-feature> | <general-enclosed>"},"media-not":{"syntax":"not <media-in-parens>"},"media-or":{"syntax":"<media-in-parens> [ or <media-in-parens> ]+"},"media-query":{"syntax":"<media-condition> | [ not | only ]? <media-type> [ and <media-condition-without-or> ]?"},"media-query-list":{"syntax":"<media-query>#"},"media-type":{"syntax":"<ident>"},"mf-boolean":{"syntax":"<mf-name>"},"mf-name":{"syntax":"<ident>"},"mf-plain":{"syntax":"<mf-name> : <mf-value>"},"mf-range":{"syntax":"<mf-name> [ \'<\' | \'>\' ]? \'=\'? <mf-value>\\n| <mf-value> [ \'<\' | \'>\' ]? \'=\'? <mf-name>\\n| <mf-value> \'<\' \'=\'? <mf-name> \'<\' \'=\'? <mf-value>\\n| <mf-value> \'>\' \'=\'? <mf-name> \'>\' \'=\'? <mf-value>"},"mf-value":{"syntax":"<number> | <dimension> | <ident> | <ratio>"},"min()":{"syntax":"min( <calc-sum># )"},"minmax()":{"syntax":"minmax( [ <length> | <percentage> | <flex> | min-content | max-content | auto ] , [ <length> | <percentage> | <flex> | min-content | max-content | auto ] )"},"named-color":{"syntax":"transparent | aliceblue | antiquewhite | aqua | aquamarine | azure | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | cadetblue | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | green | greenyellow | grey | honeydew | hotpink | indianred | indigo | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | magenta | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | seagreen | seashell | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | tomato | turquoise | violet | wheat | white | whitesmoke | yellow | yellowgreen"},"namespace-prefix":{"syntax":"<ident>"},"ns-prefix":{"syntax":"[ <ident-token> | \'*\' ]? \'|\'"},"number-percentage":{"syntax":"<number> | <percentage>"},"numeric-figure-values":{"syntax":"[ lining-nums | oldstyle-nums ]"},"numeric-fraction-values":{"syntax":"[ diagonal-fractions | stacked-fractions ]"},"numeric-spacing-values":{"syntax":"[ proportional-nums | tabular-nums ]"},"nth":{"syntax":"<an-plus-b> | even | odd"},"opacity()":{"syntax":"opacity( [ <number-percentage> ] )"},"overflow-position":{"syntax":"unsafe | safe"},"outline-radius":{"syntax":"<length> | <percentage>"},"page-body":{"syntax":"<declaration>? [ ; <page-body> ]? | <page-margin-box> <page-body>"},"page-margin-box":{"syntax":"<page-margin-box-type> \'{\' <declaration-list> \'}\'"},"page-margin-box-type":{"syntax":"@top-left-corner | @top-left | @top-center | @top-right | @top-right-corner | @bottom-left-corner | @bottom-left | @bottom-center | @bottom-right | @bottom-right-corner | @left-top | @left-middle | @left-bottom | @right-top | @right-middle | @right-bottom"},"page-selector-list":{"syntax":"[ <page-selector># ]?"},"page-selector":{"syntax":"<pseudo-page>+ | <ident> <pseudo-page>*"},"paint()":{"syntax":"paint( <ident>, <declaration-value>? )"},"perspective()":{"syntax":"perspective( <length> )"},"polygon()":{"syntax":"polygon( <fill-rule>? , [ <length-percentage> <length-percentage> ]# )"},"position":{"syntax":"[ [ left | center | right ] || [ top | center | bottom ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]? | [ [ left | right ] <length-percentage> ] && [ [ top | bottom ] <length-percentage> ] ]"},"pseudo-class-selector":{"syntax":"\':\' <ident-token> | \':\' <function-token> <any-value> \')\'"},"pseudo-element-selector":{"syntax":"\':\' <pseudo-class-selector>"},"pseudo-page":{"syntax":": [ left | right | first | blank ]"},"quote":{"syntax":"open-quote | close-quote | no-open-quote | no-close-quote"},"radial-gradient()":{"syntax":"radial-gradient( [ <ending-shape> || <size> ]? [ at <position> ]? , <color-stop-list> )"},"relative-selector":{"syntax":"<combinator>? <complex-selector>"},"relative-selector-list":{"syntax":"<relative-selector>#"},"relative-size":{"syntax":"larger | smaller"},"repeat-style":{"syntax":"repeat-x | repeat-y | [ repeat | space | round | no-repeat ]{1,2}"},"repeating-linear-gradient()":{"syntax":"repeating-linear-gradient( [ <angle> | to <side-or-corner> ]? , <color-stop-list> )"},"repeating-radial-gradient()":{"syntax":"repeating-radial-gradient( [ <ending-shape> || <size> ]? [ at <position> ]? , <color-stop-list> )"},"rgb()":{"syntax":"rgb( <percentage>{3} [ / <alpha-value> ]? ) | rgb( <number>{3} [ / <alpha-value> ]? ) | rgb( <percentage>#{3} , <alpha-value>? ) | rgb( <number>#{3} , <alpha-value>? )"},"rgba()":{"syntax":"rgba( <percentage>{3} [ / <alpha-value> ]? ) | rgba( <number>{3} [ / <alpha-value> ]? ) | rgba( <percentage>#{3} , <alpha-value>? ) | rgba( <number>#{3} , <alpha-value>? )"},"rotate()":{"syntax":"rotate( [ <angle> | <zero> ] )"},"rotate3d()":{"syntax":"rotate3d( <number> , <number> , <number> , [ <angle> | <zero> ] )"},"rotateX()":{"syntax":"rotateX( [ <angle> | <zero> ] )"},"rotateY()":{"syntax":"rotateY( [ <angle> | <zero> ] )"},"rotateZ()":{"syntax":"rotateZ( [ <angle> | <zero> ] )"},"saturate()":{"syntax":"saturate( <number-percentage> )"},"scale()":{"syntax":"scale( <number> , <number>? )"},"scale3d()":{"syntax":"scale3d( <number> , <number> , <number> )"},"scaleX()":{"syntax":"scaleX( <number> )"},"scaleY()":{"syntax":"scaleY( <number> )"},"scaleZ()":{"syntax":"scaleZ( <number> )"},"self-position":{"syntax":"center | start | end | self-start | self-end | flex-start | flex-end"},"shape-radius":{"syntax":"<length-percentage> | closest-side | farthest-side"},"skew()":{"syntax":"skew( [ <angle> | <zero> ] , [ <angle> | <zero> ]? )"},"skewX()":{"syntax":"skewX( [ <angle> | <zero> ] )"},"skewY()":{"syntax":"skewY( [ <angle> | <zero> ] )"},"sepia()":{"syntax":"sepia( <number-percentage> )"},"shadow":{"syntax":"inset? && <length>{2,4} && <color>?"},"shadow-t":{"syntax":"[ <length>{2,3} && <color>? ]"},"shape":{"syntax":"rect(<top>, <right>, <bottom>, <left>)"},"shape-box":{"syntax":"<box> | margin-box"},"side-or-corner":{"syntax":"[ left | right ] || [ top | bottom ]"},"single-animation":{"syntax":"<time> || <timing-function> || <time> || <single-animation-iteration-count> || <single-animation-direction> || <single-animation-fill-mode> || <single-animation-play-state> || [ none | <keyframes-name> ]"},"single-animation-direction":{"syntax":"normal | reverse | alternate | alternate-reverse"},"single-animation-fill-mode":{"syntax":"none | forwards | backwards | both"},"single-animation-iteration-count":{"syntax":"infinite | <number>"},"single-animation-play-state":{"syntax":"running | paused"},"single-transition":{"syntax":"[ none | <single-transition-property> ] || <time> || <timing-function> || <time>"},"single-transition-property":{"syntax":"all | <custom-ident>"},"size":{"syntax":"closest-side | farthest-side | closest-corner | farthest-corner | <length> | <length-percentage>{2}"},"step-position":{"syntax":"jump-start | jump-end | jump-none | jump-both | start | end"},"step-timing-function":{"syntax":"step-start | step-end | steps(<integer>[, <step-position>]?)"},"subclass-selector":{"syntax":"<id-selector> | <class-selector> | <attribute-selector> | <pseudo-class-selector>"},"supports-condition":{"syntax":"not <supports-in-parens> | <supports-in-parens> [ and <supports-in-parens> ]* | <supports-in-parens> [ or <supports-in-parens> ]*"},"supports-in-parens":{"syntax":"( <supports-condition> ) | <supports-feature> | <general-enclosed>"},"supports-feature":{"syntax":"<supports-decl> | <supports-selector-fn>"},"supports-decl":{"syntax":"( <declaration> )"},"supports-selector-fn":{"syntax":"selector( <complex-selector> )"},"symbol":{"syntax":"<string> | <image> | <custom-ident>"},"target":{"syntax":"<target-counter()> | <target-counters()> | <target-text()>"},"target-counter()":{"syntax":"target-counter( [ <string> | <url> ] , <custom-ident> , <counter-style>? )"},"target-counters()":{"syntax":"target-counters( [ <string> | <url> ] , <custom-ident> , <string> , <counter-style>? )"},"target-text()":{"syntax":"target-text( [ <string> | <url> ] , [ content | before | after | first-letter ]? )"},"time-percentage":{"syntax":"<time> | <percentage>"},"timing-function":{"syntax":"linear | <cubic-bezier-timing-function> | <step-timing-function>"},"track-breadth":{"syntax":"<length-percentage> | <flex> | min-content | max-content | auto"},"track-list":{"syntax":"[ <line-names>? [ <track-size> | <track-repeat> ] ]+ <line-names>?"},"track-repeat":{"syntax":"repeat( [ <positive-integer> ] , [ <line-names>? <track-size> ]+ <line-names>? )"},"track-size":{"syntax":"<track-breadth> | minmax( <inflexible-breadth> , <track-breadth> ) | fit-content( [ <length> | <percentage> ] )"},"transform-function":{"syntax":"<matrix()> | <translate()> | <translateX()> | <translateY()> | <scale()> | <scaleX()> | <scaleY()> | <rotate()> | <skew()> | <skewX()> | <skewY()> | <matrix3d()> | <translate3d()> | <translateZ()> | <scale3d()> | <scaleZ()> | <rotate3d()> | <rotateX()> | <rotateY()> | <rotateZ()> | <perspective()>"},"transform-list":{"syntax":"<transform-function>+"},"translate()":{"syntax":"translate( <length-percentage> , <length-percentage>? )"},"translate3d()":{"syntax":"translate3d( <length-percentage> , <length-percentage> , <length> )"},"translateX()":{"syntax":"translateX( <length-percentage> )"},"translateY()":{"syntax":"translateY( <length-percentage> )"},"translateZ()":{"syntax":"translateZ( <length> )"},"type-or-unit":{"syntax":"string | color | url | integer | number | length | angle | time | frequency | cap | ch | em | ex | ic | lh | rlh | rem | vb | vi | vw | vh | vmin | vmax | mm | Q | cm | in | pt | pc | px | deg | grad | rad | turn | ms | s | Hz | kHz | %"},"type-selector":{"syntax":"<wq-name> | <ns-prefix>? \'*\'"},"var()":{"syntax":"var( <custom-property-name> , <declaration-value>? )"},"viewport-length":{"syntax":"auto | <length-percentage>"},"wq-name":{"syntax":"<ns-prefix>? <ident-token>"}}');
    }
  }, __webpack_module_cache__ = {};
  var __webpack_exports__ = function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
    module.exports;
  }(2916);
  module.exports = __webpack_exports__;
}();