!function() {
  var __webpack_modules__ = {
    7283: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      const CoaParam = __webpack_require__(3965), chalk = __webpack_require__(4687);
      module.exports = class extends CoaParam {
        constructor(cmd) {
          super(cmd), this._cmd._args.push(this);
        }
        _saveVal(args, val) {
          this._val && (val = this._val(val));
          const name = this._name;
          return this._arr ? (args[name] || (args[name] = [])).push(val) : args[name] = val, 
          val;
        }
        _parse(arg, args) {
          return this._saveVal(args, arg);
        }
        _checkParsed(opts, args) {
          return !args.hasOwnProperty(this._name);
        }
        _usage() {
          const res = [];
          return res.push(chalk.magentaBright(this._name.toUpperCase()), " : ", this._title), 
          this._req && res.push(" ", chalk.redBright("(required)")), res.join("");
        }
        _requiredText() {
          return `Missing required argument:\n  ${this._usage()}`;
        }
      };
    },
    8503: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      const Q = __webpack_require__(8486);
      module.exports = class {
        constructor(cmd) {
          this._cmd = cmd, this._name = null, this._title = null, this._comp = null;
        }
        name(name) {
          return this._name = name, this;
        }
        title(title) {
          return this._title = title, this;
        }
        comp(comp) {
          return this._comp = comp, this;
        }
        apply(fn) {
          return arguments.length > 1 ? fn.apply(this, [].slice.call(arguments, 1)) : fn.call(this), 
          this;
        }
        reject(reason) {
          return Q.reject(reason);
        }
        end() {
          return this._cmd;
        }
      };
    },
    3965: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      const fs = __webpack_require__(7147), CoaObject = __webpack_require__(8503);
      module.exports = class extends CoaObject {
        constructor(cmd) {
          super(cmd), this._arr = !1, this._req = !1, this._val = void 0, this._def = void 0;
        }
        arr() {
          return this._arr = !0, this;
        }
        req() {
          return this._req = !0, this;
        }
        val(val) {
          return this._val = val, this;
        }
        def(def) {
          return this._def = def, this;
        }
        input() {
          return process.stdin.pause(), this.def(process.stdin).val((function(v) {
            if ("string" != typeof v) return v;
            if ("-" === v) return process.stdin;
            const s = fs.createReadStream(v, {
              encoding: "utf8"
            });
            return s.pause(), s;
          }));
        }
        output() {
          return this.def(process.stdout).val((function(v) {
            return "string" != typeof v ? v : "-" === v ? process.stdout : fs.createWriteStream(v, {
              encoding: "utf8"
            });
          }));
        }
      };
    },
    4714: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      const constants = __webpack_require__(2057), fs = __webpack_require__(7147), path = __webpack_require__(1017), Q = __webpack_require__(8486), shell = __webpack_require__(3048), escape = shell.escape, unescape = shell.unescape;
      module.exports = function() {
        return this.title("Shell completion").helpful().arg().name("raw").title("Completion words").arr().end().act(((opts, args) => {
          if ("win32" === process.platform) {
            const e = new Error("shell completion not supported on windows");
            return e.code = "ENOTSUP", e.errno = constants.ENOTSUP, this.reject(e);
          }
          if (null == process.env.COMP_CWORD || null == process.env.COMP_LINE || null == process.env.COMP_POINT) return function(name) {
            const defer = Q.defer();
            return fs.readFile(path.resolve(__dirname, "completion.sh"), "utf8", (function(err, d) {
              if (err) return defer.reject(err);
              d = d.replace(/{{cmd}}/g, path.basename(name)).replace(/^#!.*?\n/, ""), process.stdout.on("error", onError), 
              process.stdout.write(d, (() => defer.resolve()));
            })), defer.promise;
            function onError(err) {
              return err.errno !== constants.EPIPE ? defer.reject(err) : (process.stdout.removeListener("error", onError), 
              defer.resolve());
            }
          }(this._cmd._name);
          console.error("COMP_LINE:  %s", process.env.COMP_LINE), console.error("COMP_CWORD: %s", process.env.COMP_CWORD), 
          console.error("COMP_POINT: %s", process.env.COMP_POINT), console.error("args: %j", args.raw), 
          opts = function(argv) {
            const line = process.env.COMP_LINE, w = +process.env.COMP_CWORD, point = +process.env.COMP_POINT, words = argv.map(unescape), word = words[w], partialLine = line.substr(0, point), partialWords = words.slice(0, w);
            let partialWord = argv[w] || "", i = partialWord.length;
            for (;partialWord.substr(0, i) !== partialLine.substr(-1 * i) && i > 0; ) i--;
            return partialWord = unescape(partialWord.substr(0, i)), partialWord && partialWords.push(partialWord), 
            {
              line: line,
              w: w,
              point: point,
              words: words,
              word: word,
              partialLine: partialLine,
              partialWords: partialWords,
              partialWord: partialWord
            };
          }(args.raw);
          const parsed = this._cmd._parseCmd(opts.partialWords);
          return Q.when(function(cmd, opts) {
            let optWord, optPrefix, opt, compls = [];
            if (opts.partialWord.indexOf("-")) compls = Object.keys(cmd._cmdsByName); else {
              const m = opts.partialWord.match(/^(--\w[\w-_]*)=(.*)$/);
              m ? (optWord = m[1], optPrefix = optWord + "=") : compls = Object.keys(cmd._optsByKey);
            }
            return opts.partialWords[opts.w - 1].indexOf("-") || (optWord = opts.partialWords[opts.w - 1]), 
            optWord && (opt = cmd._optsByKey[optWord]) && !opt._flag && opt._comp && (compls = Q.join(compls, Q.when(opt._comp(opts), ((c, o) => c.concat(o.map((v => (optPrefix || "") + v))))))), 
            cmd._comp && (compls = Q.join(compls, Q.when(cmd._comp(opts)), ((c, o) => c.concat(o)))), 
            Q.when(compls, (complitions => (console.error("partialWord: %s", opts.partialWord), 
            console.error("compls: %j", complitions), compls.filter((c => 0 === c.indexOf(opts.partialWord))))));
          }(parsed.cmd, parsed.opts), (compls => (console.error("filtered: %j", compls), console.log(compls.map(escape).join("\n")))));
        }));
      };
    },
    594: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      const Q = __webpack_require__(8486), CoaParam = __webpack_require__(3965), chalk = __webpack_require__(4687);
      module.exports = class extends CoaParam {
        constructor(cmd) {
          super(cmd), this._short = null, this._long = null, this._flag = !1, this._only = !1, 
          this._cmd._opts.push(this);
        }
        short(short) {
          return this._short = short, this._cmd._optsByKey[`-${short}`] = this, this;
        }
        long(long) {
          return this._long = long, this._cmd._optsByKey[`--${long}`] = this, this;
        }
        flag() {
          return this._flag = !0, this;
        }
        only() {
          return this._only = !0, this;
        }
        act(act) {
          const opt = this;
          return this._cmd.act((function(opts) {
            if (!opts.hasOwnProperty(opt._name)) return;
            const res = act.apply(this, arguments);
            return opt._only ? Q.when(res, (out => this.reject({
              toString: () => out.toString(),
              exitCode: 0
            }))) : res;
          })), this;
        }
        _saveVal(opts, val) {
          this._val && (val = this._val(val));
          const name = this._name;
          return this._arr ? (opts[name] || (opts[name] = [])).push(val) : opts[name] = val, 
          val;
        }
        _parse(argv, opts) {
          return this._saveVal(opts, !!this._flag || argv.shift());
        }
        _checkParsed(opts) {
          return !opts.hasOwnProperty(this._name);
        }
        _usage() {
          const res = [], nameStr = this._name.toUpperCase();
          return this._short && (res.push("-", chalk.greenBright(this._short)), this._flag || res.push(" " + nameStr), 
          res.push(", ")), this._long && (res.push("--", chalk.green(this._long)), this._flag || res.push("=" + nameStr)), 
          res.push(" : ", this._title), this._req && res.push(" ", chalk.redBright("(required)")), 
          res.join("");
        }
        _requiredText() {
          return `Missing required option:\n  ${this._usage()}`;
        }
      };
    },
    3048: function(module) {
      module.exports = {
        escape: function(w) {
          return (w = w.replace(/(["'$`\\])/g, "\\$1")).match(/\s+/) ? `"${w}"` : w;
        },
        unescape: function(w) {
          return (w = '"' === w.charAt(0) ? w.replace(/^"|([^\\])"$/g, "$1") : w.replace(/\\ /g, " ")).replace(/\\("|'|\$|`|\\)/g, "$1");
        }
      };
    },
    8486: function(module) {
      !function(definition) {
        "use strict";
        "function" == typeof bootstrap ? bootstrap("promise", definition) : module.exports = definition();
      }((function() {
        "use strict";
        var hasStacks = !1;
        try {
          throw new Error;
        } catch (e) {
          hasStacks = !!e.stack;
        }
        var qFileName, qStartingLine = captureLine(), noop = function() {}, nextTick = function() {
          var head = {
            task: void 0,
            next: null
          }, tail = head, flushing = !1, requestTick = void 0, isNodeJS = !1, laterQueue = [];
          function flush() {
            for (var task, domain; head.next; ) task = (head = head.next).task, head.task = void 0, 
            (domain = head.domain) && (head.domain = void 0, domain.enter()), runSingle(task, domain);
            for (;laterQueue.length; ) runSingle(task = laterQueue.pop());
            flushing = !1;
          }
          function runSingle(task, domain) {
            try {
              task();
            } catch (e) {
              if (isNodeJS) throw domain && domain.exit(), setTimeout(flush, 0), domain && domain.enter(), 
              e;
              setTimeout((function() {
                throw e;
              }), 0);
            }
            domain && domain.exit();
          }
          if (nextTick = function(task) {
            tail = tail.next = {
              task: task,
              domain: isNodeJS && process.domain,
              next: null
            }, flushing || (flushing = !0, requestTick());
          }, "object" == typeof process && "[object process]" === process.toString() && process.nextTick) isNodeJS = !0, 
          requestTick = function() {
            process.nextTick(flush);
          }; else if ("function" == typeof setImmediate) requestTick = "undefined" != typeof window ? setImmediate.bind(window, flush) : function() {
            setImmediate(flush);
          }; else if ("undefined" != typeof MessageChannel) {
            var channel = new MessageChannel;
            channel.port1.onmessage = function() {
              requestTick = requestPortTick, channel.port1.onmessage = flush, flush();
            };
            var requestPortTick = function() {
              channel.port2.postMessage(0);
            };
            requestTick = function() {
              setTimeout(flush, 0), requestPortTick();
            };
          } else requestTick = function() {
            setTimeout(flush, 0);
          };
          return nextTick.runAfter = function(task) {
            laterQueue.push(task), flushing || (flushing = !0, requestTick());
          }, nextTick;
        }(), call = Function.call;
        function uncurryThis(f) {
          return function() {
            return call.apply(f, arguments);
          };
        }
        var QReturnValue, array_slice = uncurryThis(Array.prototype.slice), array_reduce = uncurryThis(Array.prototype.reduce || function(callback, basis) {
          var index = 0, length = this.length;
          if (1 === arguments.length) for (;;) {
            if (index in this) {
              basis = this[index++];
              break;
            }
            if (++index >= length) throw new TypeError;
          }
          for (;index < length; index++) index in this && (basis = callback(basis, this[index], index));
          return basis;
        }), array_indexOf = uncurryThis(Array.prototype.indexOf || function(value) {
          for (var i = 0; i < this.length; i++) if (this[i] === value) return i;
          return -1;
        }), array_map = uncurryThis(Array.prototype.map || function(callback, thisp) {
          var self = this, collect = [];
          return array_reduce(self, (function(undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
          }), void 0), collect;
        }), object_create = Object.create || function(prototype) {
          function Type() {}
          return Type.prototype = prototype, new Type;
        }, object_defineProperty = Object.defineProperty || function(obj, prop, descriptor) {
          return obj[prop] = descriptor.value, obj;
        }, object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty), object_keys = Object.keys || function(object) {
          var keys = [];
          for (var key in object) object_hasOwnProperty(object, key) && keys.push(key);
          return keys;
        }, object_toString = uncurryThis(Object.prototype.toString);
        function isStopIteration(exception) {
          return "[object StopIteration]" === object_toString(exception) || exception instanceof QReturnValue;
        }
        QReturnValue = "undefined" != typeof ReturnValue ? ReturnValue : function(value) {
          this.value = value;
        };
        function makeStackTraceLong(error, promise) {
          if (hasStacks && promise.stack && "object" == typeof error && null !== error && error.stack) {
            for (var stacks = [], p = promise; p; p = p.source) p.stack && (!error.__minimumStackCounter__ || error.__minimumStackCounter__ > p.stackCounter) && (object_defineProperty(error, "__minimumStackCounter__", {
              value: p.stackCounter,
              configurable: !0
            }), stacks.unshift(p.stack));
            stacks.unshift(error.stack);
            var stack = function(stackString) {
              for (var lines = stackString.split("\n"), desiredLines = [], i = 0; i < lines.length; ++i) {
                var line = lines[i];
                isInternalFrame(line) || isNodeFrame(line) || !line || desiredLines.push(line);
              }
              return desiredLines.join("\n");
            }(stacks.join("\nFrom previous event:\n"));
            object_defineProperty(error, "stack", {
              value: stack,
              configurable: !0
            });
          }
        }
        function isNodeFrame(stackLine) {
          return -1 !== stackLine.indexOf("(module.js:") || -1 !== stackLine.indexOf("(node.js:");
        }
        function getFileNameAndLineNumber(stackLine) {
          var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
          if (attempt1) return [ attempt1[1], Number(attempt1[2]) ];
          var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
          if (attempt2) return [ attempt2[1], Number(attempt2[2]) ];
          var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
          return attempt3 ? [ attempt3[1], Number(attempt3[2]) ] : void 0;
        }
        function isInternalFrame(stackLine) {
          var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
          if (!fileNameAndLineNumber) return !1;
          var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];
          return fileName === qFileName && lineNumber >= qStartingLine && lineNumber <= qEndingLine;
        }
        function captureLine() {
          if (hasStacks) try {
            throw new Error;
          } catch (e) {
            var lines = e.stack.split("\n"), fileNameAndLineNumber = getFileNameAndLineNumber(lines[0].indexOf("@") > 0 ? lines[1] : lines[2]);
            if (!fileNameAndLineNumber) return;
            return qFileName = fileNameAndLineNumber[0], fileNameAndLineNumber[1];
          }
        }
        function Q(value) {
          return value instanceof Promise ? value : isPromiseAlike(value) ? function(promise) {
            var deferred = defer();
            return Q.nextTick((function() {
              try {
                promise.then(deferred.resolve, deferred.reject, deferred.notify);
              } catch (exception) {
                deferred.reject(exception);
              }
            })), deferred.promise;
          }(value) : fulfill(value);
        }
        Q.resolve = Q, Q.nextTick = nextTick, Q.longStackSupport = !1;
        var longStackCounter = 1;
        function defer() {
          var resolvedPromise, messages = [], progressListeners = [], deferred = object_create(defer.prototype), promise = object_create(Promise.prototype);
          if (promise.promiseDispatch = function(resolve, op, operands) {
            var args = array_slice(arguments);
            messages ? (messages.push(args), "when" === op && operands[1] && progressListeners.push(operands[1])) : Q.nextTick((function() {
              resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            }));
          }, promise.valueOf = function() {
            if (messages) return promise;
            var nearerValue = nearer(resolvedPromise);
            return isPromise(nearerValue) && (resolvedPromise = nearerValue), nearerValue;
          }, promise.inspect = function() {
            return resolvedPromise ? resolvedPromise.inspect() : {
              state: "pending"
            };
          }, Q.longStackSupport && hasStacks) try {
            throw new Error;
          } catch (e) {
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1), promise.stackCounter = longStackCounter++;
          }
          function become(newPromise) {
            resolvedPromise = newPromise, Q.longStackSupport && hasStacks && (promise.source = newPromise), 
            array_reduce(messages, (function(undefined, message) {
              Q.nextTick((function() {
                newPromise.promiseDispatch.apply(newPromise, message);
              }));
            }), void 0), messages = void 0, progressListeners = void 0;
          }
          return deferred.promise = promise, deferred.resolve = function(value) {
            resolvedPromise || become(Q(value));
          }, deferred.fulfill = function(value) {
            resolvedPromise || become(fulfill(value));
          }, deferred.reject = function(reason) {
            resolvedPromise || become(reject(reason));
          }, deferred.notify = function(progress) {
            resolvedPromise || array_reduce(progressListeners, (function(undefined, progressListener) {
              Q.nextTick((function() {
                progressListener(progress);
              }));
            }), void 0);
          }, deferred;
        }
        function promise(resolver) {
          if ("function" != typeof resolver) throw new TypeError("resolver must be a function.");
          var deferred = defer();
          try {
            resolver(deferred.resolve, deferred.reject, deferred.notify);
          } catch (reason) {
            deferred.reject(reason);
          }
          return deferred.promise;
        }
        function race(answerPs) {
          return promise((function(resolve, reject) {
            for (var i = 0, len = answerPs.length; i < len; i++) Q(answerPs[i]).then(resolve, reject);
          }));
        }
        function Promise(descriptor, fallback, inspect) {
          void 0 === fallback && (fallback = function(op) {
            return reject(new Error("Promise does not support operation: " + op));
          }), void 0 === inspect && (inspect = function() {
            return {
              state: "unknown"
            };
          });
          var promise = object_create(Promise.prototype);
          if (promise.promiseDispatch = function(resolve, op, args) {
            var result;
            try {
              result = descriptor[op] ? descriptor[op].apply(promise, args) : fallback.call(promise, op, args);
            } catch (exception) {
              result = reject(exception);
            }
            resolve && resolve(result);
          }, promise.inspect = inspect, inspect) {
            var inspected = inspect();
            "rejected" === inspected.state && (promise.exception = inspected.reason), promise.valueOf = function() {
              var inspected = inspect();
              return "pending" === inspected.state || "rejected" === inspected.state ? promise : inspected.value;
            };
          }
          return promise;
        }
        function when(value, fulfilled, rejected, progressed) {
          return Q(value).then(fulfilled, rejected, progressed);
        }
        function nearer(value) {
          if (isPromise(value)) {
            var inspected = value.inspect();
            if ("fulfilled" === inspected.state) return inspected.value;
          }
          return value;
        }
        function isPromise(object) {
          return object instanceof Promise;
        }
        function isPromiseAlike(object) {
          return (value = object) === Object(value) && "function" == typeof object.then;
          var value;
        }
        "object" == typeof process && process && process.env && process.env.Q_DEBUG && (Q.longStackSupport = !0), 
        Q.defer = defer, defer.prototype.makeNodeResolver = function() {
          var self = this;
          return function(error, value) {
            error ? self.reject(error) : arguments.length > 2 ? self.resolve(array_slice(arguments, 1)) : self.resolve(value);
          };
        }, Q.Promise = promise, Q.promise = promise, promise.race = race, promise.all = all, 
        promise.reject = reject, promise.resolve = Q, Q.passByCopy = function(object) {
          return object;
        }, Promise.prototype.passByCopy = function() {
          return this;
        }, Q.join = function(x, y) {
          return Q(x).join(y);
        }, Promise.prototype.join = function(that) {
          return Q([ this, that ]).spread((function(x, y) {
            if (x === y) return x;
            throw new Error("Q can't join: not the same: " + x + " " + y);
          }));
        }, Q.race = race, Promise.prototype.race = function() {
          return this.then(Q.race);
        }, Q.makePromise = Promise, Promise.prototype.toString = function() {
          return "[object Promise]";
        }, Promise.prototype.then = function(fulfilled, rejected, progressed) {
          var self = this, deferred = defer(), done = !1;
          return Q.nextTick((function() {
            self.promiseDispatch((function(value) {
              done || (done = !0, deferred.resolve(function(value) {
                try {
                  return "function" == typeof fulfilled ? fulfilled(value) : value;
                } catch (exception) {
                  return reject(exception);
                }
              }(value)));
            }), "when", [ function(exception) {
              done || (done = !0, deferred.resolve(function(exception) {
                if ("function" == typeof rejected) {
                  makeStackTraceLong(exception, self);
                  try {
                    return rejected(exception);
                  } catch (newException) {
                    return reject(newException);
                  }
                }
                return reject(exception);
              }(exception)));
            } ]);
          })), self.promiseDispatch(void 0, "when", [ void 0, function(value) {
            var newValue, threw = !1;
            try {
              newValue = function(value) {
                return "function" == typeof progressed ? progressed(value) : value;
              }(value);
            } catch (e) {
              if (threw = !0, !Q.onerror) throw e;
              Q.onerror(e);
            }
            threw || deferred.notify(newValue);
          } ]), deferred.promise;
        }, Q.tap = function(promise, callback) {
          return Q(promise).tap(callback);
        }, Promise.prototype.tap = function(callback) {
          return callback = Q(callback), this.then((function(value) {
            return callback.fcall(value).thenResolve(value);
          }));
        }, Q.when = when, Promise.prototype.thenResolve = function(value) {
          return this.then((function() {
            return value;
          }));
        }, Q.thenResolve = function(promise, value) {
          return Q(promise).thenResolve(value);
        }, Promise.prototype.thenReject = function(reason) {
          return this.then((function() {
            throw reason;
          }));
        }, Q.thenReject = function(promise, reason) {
          return Q(promise).thenReject(reason);
        }, Q.nearer = nearer, Q.isPromise = isPromise, Q.isPromiseAlike = isPromiseAlike, 
        Q.isPending = function(object) {
          return isPromise(object) && "pending" === object.inspect().state;
        }, Promise.prototype.isPending = function() {
          return "pending" === this.inspect().state;
        }, Q.isFulfilled = function(object) {
          return !isPromise(object) || "fulfilled" === object.inspect().state;
        }, Promise.prototype.isFulfilled = function() {
          return "fulfilled" === this.inspect().state;
        }, Q.isRejected = function(object) {
          return isPromise(object) && "rejected" === object.inspect().state;
        }, Promise.prototype.isRejected = function() {
          return "rejected" === this.inspect().state;
        };
        var callback, name, alternative, unhandledReasons = [], unhandledRejections = [], reportedUnhandledRejections = [], trackUnhandledRejections = !0;
        function resetUnhandledRejections() {
          unhandledReasons.length = 0, unhandledRejections.length = 0, trackUnhandledRejections || (trackUnhandledRejections = !0);
        }
        function reject(reason) {
          var rejection = Promise({
            when: function(rejected) {
              return rejected && function(promise) {
                if (trackUnhandledRejections) {
                  var at = array_indexOf(unhandledRejections, promise);
                  -1 !== at && ("object" == typeof process && "function" == typeof process.emit && Q.nextTick.runAfter((function() {
                    var atReport = array_indexOf(reportedUnhandledRejections, promise);
                    -1 !== atReport && (process.emit("rejectionHandled", unhandledReasons[at], promise), 
                    reportedUnhandledRejections.splice(atReport, 1));
                  })), unhandledRejections.splice(at, 1), unhandledReasons.splice(at, 1));
                }
              }(this), rejected ? rejected(reason) : this;
            }
          }, (function() {
            return this;
          }), (function() {
            return {
              state: "rejected",
              reason: reason
            };
          }));
          return function(promise, reason) {
            trackUnhandledRejections && ("object" == typeof process && "function" == typeof process.emit && Q.nextTick.runAfter((function() {
              -1 !== array_indexOf(unhandledRejections, promise) && (process.emit("unhandledRejection", reason, promise), 
              reportedUnhandledRejections.push(promise));
            })), unhandledRejections.push(promise), reason && void 0 !== reason.stack ? unhandledReasons.push(reason.stack) : unhandledReasons.push("(no stack) " + reason));
          }(rejection, reason), rejection;
        }
        function fulfill(value) {
          return Promise({
            when: function() {
              return value;
            },
            get: function(name) {
              return value[name];
            },
            set: function(name, rhs) {
              value[name] = rhs;
            },
            delete: function(name) {
              delete value[name];
            },
            post: function(name, args) {
              return null == name ? value.apply(void 0, args) : value[name].apply(value, args);
            },
            apply: function(thisp, args) {
              return value.apply(thisp, args);
            },
            keys: function() {
              return object_keys(value);
            }
          }, void 0, (function() {
            return {
              state: "fulfilled",
              value: value
            };
          }));
        }
        function spread(value, fulfilled, rejected) {
          return Q(value).spread(fulfilled, rejected);
        }
        function dispatch(object, op, args) {
          return Q(object).dispatch(op, args);
        }
        function all(promises) {
          return when(promises, (function(promises) {
            var pendingCount = 0, deferred = defer();
            return array_reduce(promises, (function(undefined, promise, index) {
              var snapshot;
              isPromise(promise) && "fulfilled" === (snapshot = promise.inspect()).state ? promises[index] = snapshot.value : (++pendingCount, 
              when(promise, (function(value) {
                promises[index] = value, 0 == --pendingCount && deferred.resolve(promises);
              }), deferred.reject, (function(progress) {
                deferred.notify({
                  index: index,
                  value: progress
                });
              })));
            }), void 0), 0 === pendingCount && deferred.resolve(promises), deferred.promise;
          }));
        }
        function any(promises) {
          if (0 === promises.length) return Q.resolve();
          var deferred = Q.defer(), pendingCount = 0;
          return array_reduce(promises, (function(prev, current, index) {
            var promise = promises[index];
            pendingCount++, when(promise, (function(result) {
              deferred.resolve(result);
            }), (function(err) {
              if (0 === --pendingCount) {
                var rejection = err || new Error("" + err);
                rejection.message = "Q can't get fulfillment value from any promise, all promises were rejected. Last error message: " + rejection.message, 
                deferred.reject(rejection);
              }
            }), (function(progress) {
              deferred.notify({
                index: index,
                value: progress
              });
            }));
          }), void 0), deferred.promise;
        }
        function allResolved(promises) {
          return when(promises, (function(promises) {
            return promises = array_map(promises, Q), when(all(array_map(promises, (function(promise) {
              return when(promise, noop, noop);
            }))), (function() {
              return promises;
            }));
          }));
        }
        Q.resetUnhandledRejections = resetUnhandledRejections, Q.getUnhandledReasons = function() {
          return unhandledReasons.slice();
        }, Q.stopUnhandledRejectionTracking = function() {
          resetUnhandledRejections(), trackUnhandledRejections = !1;
        }, resetUnhandledRejections(), Q.reject = reject, Q.fulfill = fulfill, Q.master = function(object) {
          return Promise({
            isDef: function() {}
          }, (function(op, args) {
            return dispatch(object, op, args);
          }), (function() {
            return Q(object).inspect();
          }));
        }, Q.spread = spread, Promise.prototype.spread = function(fulfilled, rejected) {
          return this.all().then((function(array) {
            return fulfilled.apply(void 0, array);
          }), rejected);
        }, Q.async = function(makeGenerator) {
          return function() {
            function continuer(verb, arg) {
              var result;
              if ("undefined" == typeof StopIteration) {
                try {
                  result = generator[verb](arg);
                } catch (exception) {
                  return reject(exception);
                }
                return result.done ? Q(result.value) : when(result.value, callback, errback);
              }
              try {
                result = generator[verb](arg);
              } catch (exception) {
                return isStopIteration(exception) ? Q(exception.value) : reject(exception);
              }
              return when(result, callback, errback);
            }
            var generator = makeGenerator.apply(this, arguments), callback = continuer.bind(continuer, "next"), errback = continuer.bind(continuer, "throw");
            return callback();
          };
        }, Q.spawn = function(makeGenerator) {
          Q.done(Q.async(makeGenerator)());
        }, Q.return = function(value) {
          throw new QReturnValue(value);
        }, Q.promised = function(callback) {
          return function() {
            return spread([ this, all(arguments) ], (function(self, args) {
              return callback.apply(self, args);
            }));
          };
        }, Q.dispatch = dispatch, Promise.prototype.dispatch = function(op, args) {
          var self = this, deferred = defer();
          return Q.nextTick((function() {
            self.promiseDispatch(deferred.resolve, op, args);
          })), deferred.promise;
        }, Q.get = function(object, key) {
          return Q(object).dispatch("get", [ key ]);
        }, Promise.prototype.get = function(key) {
          return this.dispatch("get", [ key ]);
        }, Q.set = function(object, key, value) {
          return Q(object).dispatch("set", [ key, value ]);
        }, Promise.prototype.set = function(key, value) {
          return this.dispatch("set", [ key, value ]);
        }, Q.del = Q.delete = function(object, key) {
          return Q(object).dispatch("delete", [ key ]);
        }, Promise.prototype.del = Promise.prototype.delete = function(key) {
          return this.dispatch("delete", [ key ]);
        }, Q.mapply = Q.post = function(object, name, args) {
          return Q(object).dispatch("post", [ name, args ]);
        }, Promise.prototype.mapply = Promise.prototype.post = function(name, args) {
          return this.dispatch("post", [ name, args ]);
        }, Q.send = Q.mcall = Q.invoke = function(object, name) {
          return Q(object).dispatch("post", [ name, array_slice(arguments, 2) ]);
        }, Promise.prototype.send = Promise.prototype.mcall = Promise.prototype.invoke = function(name) {
          return this.dispatch("post", [ name, array_slice(arguments, 1) ]);
        }, Q.fapply = function(object, args) {
          return Q(object).dispatch("apply", [ void 0, args ]);
        }, Promise.prototype.fapply = function(args) {
          return this.dispatch("apply", [ void 0, args ]);
        }, Q.try = Q.fcall = function(object) {
          return Q(object).dispatch("apply", [ void 0, array_slice(arguments, 1) ]);
        }, Promise.prototype.fcall = function() {
          return this.dispatch("apply", [ void 0, array_slice(arguments) ]);
        }, Q.fbind = function(object) {
          var promise = Q(object), args = array_slice(arguments, 1);
          return function() {
            return promise.dispatch("apply", [ this, args.concat(array_slice(arguments)) ]);
          };
        }, Promise.prototype.fbind = function() {
          var promise = this, args = array_slice(arguments);
          return function() {
            return promise.dispatch("apply", [ this, args.concat(array_slice(arguments)) ]);
          };
        }, Q.keys = function(object) {
          return Q(object).dispatch("keys", []);
        }, Promise.prototype.keys = function() {
          return this.dispatch("keys", []);
        }, Q.all = all, Promise.prototype.all = function() {
          return all(this);
        }, Q.any = any, Promise.prototype.any = function() {
          return any(this);
        }, Q.allResolved = (callback = allResolved, name = "allResolved", alternative = "allSettled", 
        function() {
          return "undefined" != typeof console && "function" == typeof console.warn && console.warn(name + " is deprecated, use " + alternative + " instead.", new Error("").stack), 
          callback.apply(callback, arguments);
        }), Promise.prototype.allResolved = function() {
          return allResolved(this);
        }, Q.allSettled = function(promises) {
          return Q(promises).allSettled();
        }, Promise.prototype.allSettled = function() {
          return this.then((function(promises) {
            return all(array_map(promises, (function(promise) {
              function regardless() {
                return promise.inspect();
              }
              return (promise = Q(promise)).then(regardless, regardless);
            })));
          }));
        }, Q.fail = Q.catch = function(object, rejected) {
          return Q(object).then(void 0, rejected);
        }, Promise.prototype.fail = Promise.prototype.catch = function(rejected) {
          return this.then(void 0, rejected);
        }, Q.progress = function(object, progressed) {
          return Q(object).then(void 0, void 0, progressed);
        }, Promise.prototype.progress = function(progressed) {
          return this.then(void 0, void 0, progressed);
        }, Q.fin = Q.finally = function(object, callback) {
          return Q(object).finally(callback);
        }, Promise.prototype.fin = Promise.prototype.finally = function(callback) {
          if (!callback || "function" != typeof callback.apply) throw new Error("Q can't apply finally callback");
          return callback = Q(callback), this.then((function(value) {
            return callback.fcall().then((function() {
              return value;
            }));
          }), (function(reason) {
            return callback.fcall().then((function() {
              throw reason;
            }));
          }));
        }, Q.done = function(object, fulfilled, rejected, progress) {
          return Q(object).done(fulfilled, rejected, progress);
        }, Promise.prototype.done = function(fulfilled, rejected, progress) {
          var onUnhandledError = function(error) {
            Q.nextTick((function() {
              if (makeStackTraceLong(error, promise), !Q.onerror) throw error;
              Q.onerror(error);
            }));
          }, promise = fulfilled || rejected || progress ? this.then(fulfilled, rejected, progress) : this;
          "object" == typeof process && process && process.domain && (onUnhandledError = process.domain.bind(onUnhandledError)), 
          promise.then(void 0, onUnhandledError);
        }, Q.timeout = function(object, ms, error) {
          return Q(object).timeout(ms, error);
        }, Promise.prototype.timeout = function(ms, error) {
          var deferred = defer(), timeoutId = setTimeout((function() {
            error && "string" != typeof error || ((error = new Error(error || "Timed out after " + ms + " ms")).code = "ETIMEDOUT"), 
            deferred.reject(error);
          }), ms);
          return this.then((function(value) {
            clearTimeout(timeoutId), deferred.resolve(value);
          }), (function(exception) {
            clearTimeout(timeoutId), deferred.reject(exception);
          }), deferred.notify), deferred.promise;
        }, Q.delay = function(object, timeout) {
          return void 0 === timeout && (timeout = object, object = void 0), Q(object).delay(timeout);
        }, Promise.prototype.delay = function(timeout) {
          return this.then((function(value) {
            var deferred = defer();
            return setTimeout((function() {
              deferred.resolve(value);
            }), timeout), deferred.promise;
          }));
        }, Q.nfapply = function(callback, args) {
          return Q(callback).nfapply(args);
        }, Promise.prototype.nfapply = function(args) {
          var deferred = defer(), nodeArgs = array_slice(args);
          return nodeArgs.push(deferred.makeNodeResolver()), this.fapply(nodeArgs).fail(deferred.reject), 
          deferred.promise;
        }, Q.nfcall = function(callback) {
          var args = array_slice(arguments, 1);
          return Q(callback).nfapply(args);
        }, Promise.prototype.nfcall = function() {
          var nodeArgs = array_slice(arguments), deferred = defer();
          return nodeArgs.push(deferred.makeNodeResolver()), this.fapply(nodeArgs).fail(deferred.reject), 
          deferred.promise;
        }, Q.nfbind = Q.denodeify = function(callback) {
          if (void 0 === callback) throw new Error("Q can't wrap an undefined function");
          var baseArgs = array_slice(arguments, 1);
          return function() {
            var nodeArgs = baseArgs.concat(array_slice(arguments)), deferred = defer();
            return nodeArgs.push(deferred.makeNodeResolver()), Q(callback).fapply(nodeArgs).fail(deferred.reject), 
            deferred.promise;
          };
        }, Promise.prototype.nfbind = Promise.prototype.denodeify = function() {
          var args = array_slice(arguments);
          return args.unshift(this), Q.denodeify.apply(void 0, args);
        }, Q.nbind = function(callback, thisp) {
          var baseArgs = array_slice(arguments, 2);
          return function() {
            var nodeArgs = baseArgs.concat(array_slice(arguments)), deferred = defer();
            function bound() {
              return callback.apply(thisp, arguments);
            }
            return nodeArgs.push(deferred.makeNodeResolver()), Q(bound).fapply(nodeArgs).fail(deferred.reject), 
            deferred.promise;
          };
        }, Promise.prototype.nbind = function() {
          var args = array_slice(arguments, 0);
          return args.unshift(this), Q.nbind.apply(void 0, args);
        }, Q.nmapply = Q.npost = function(object, name, args) {
          return Q(object).npost(name, args);
        }, Promise.prototype.nmapply = Promise.prototype.npost = function(name, args) {
          var nodeArgs = array_slice(args || []), deferred = defer();
          return nodeArgs.push(deferred.makeNodeResolver()), this.dispatch("post", [ name, nodeArgs ]).fail(deferred.reject), 
          deferred.promise;
        }, Q.nsend = Q.nmcall = Q.ninvoke = function(object, name) {
          var nodeArgs = array_slice(arguments, 2), deferred = defer();
          return nodeArgs.push(deferred.makeNodeResolver()), Q(object).dispatch("post", [ name, nodeArgs ]).fail(deferred.reject), 
          deferred.promise;
        }, Promise.prototype.nsend = Promise.prototype.nmcall = Promise.prototype.ninvoke = function(name) {
          var nodeArgs = array_slice(arguments, 1), deferred = defer();
          return nodeArgs.push(deferred.makeNodeResolver()), this.dispatch("post", [ name, nodeArgs ]).fail(deferred.reject), 
          deferred.promise;
        }, Q.nodeify = function(object, nodeback) {
          return Q(object).nodeify(nodeback);
        }, Promise.prototype.nodeify = function(nodeback) {
          if (!nodeback) return this;
          this.then((function(value) {
            Q.nextTick((function() {
              nodeback(null, value);
            }));
          }), (function(error) {
            Q.nextTick((function() {
              nodeback(error);
            }));
          }));
        }, Q.noConflict = function() {
          throw new Error("Q.noConflict only works when Q is used as a global");
        };
        var qEndingLine = captureLine();
        return Q;
      }));
    },
    2384: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      const UTIL = __webpack_require__(3837), PATH = __webpack_require__(1017), EOL = __webpack_require__(2037).EOL, Q = __webpack_require__(8486), chalk = __webpack_require__(4687), CoaObject = __webpack_require__(8503), Opt = __webpack_require__(594), Arg = __webpack_require__(7283), completion = __webpack_require__(4714);
      class Cmd extends CoaObject {
        constructor(cmd) {
          super(cmd), this._parent(cmd), this._cmds = [], this._cmdsByName = {}, this._opts = [], 
          this._optsByKey = {}, this._args = [], this._api = null, this._ext = !1;
        }
        static create(cmd) {
          return new Cmd(cmd);
        }
        get api() {
          const _this = this;
          this._api || (this._api = function() {
            return _this.invoke.apply(_this, arguments);
          });
          const cmds = this._cmdsByName;
          return Object.keys(cmds).forEach((cmd => {
            this._api[cmd] = cmds[cmd].api;
          })), this._api;
        }
        _parent(cmd) {
          return this._cmd = cmd || this, this.isRootCmd || cmd._cmds.push(this) && this._name && (this._cmd._cmdsByName[this._name] = this), 
          this;
        }
        get isRootCmd() {
          return this._cmd === this;
        }
        name(name) {
          return super.name(name), this.isRootCmd || (this._cmd._cmdsByName[name] = this), 
          this;
        }
        cmd(cmd) {
          return cmd ? cmd._parent(this) : new Cmd(this);
        }
        opt() {
          return new Opt(this);
        }
        arg() {
          return new Arg(this);
        }
        act(act, force) {
          return act ? ((!this._act || force) && (this._act = []), this._act.push(act), this) : this;
        }
        helpful() {
          return this.opt().name("help").title("Help").short("h").long("help").flag().only().act((function() {
            return this.usage();
          })).end();
        }
        completable() {
          return this.cmd().name("completion").apply(completion).end();
        }
        extendable(pattern) {
          return this._ext = pattern || !0, this;
        }
        _exit(msg, code) {
          return process.once("exit", (function(exitCode) {
            msg && console[0 === code ? "log" : "error"](msg), process.exit(code || exitCode || 0);
          }));
        }
        usage() {
          const res = [];
          return this._title && res.push(this._fullTitle()), res.push("", "Usage:"), this._cmds.length && res.push([ "", "", chalk.redBright(this._fullName()), chalk.blueBright("COMMAND"), chalk.greenBright("[OPTIONS]"), chalk.magentaBright("[ARGS]") ].join(" ")), 
          this._opts.length + this._args.length && res.push([ "", "", chalk.redBright(this._fullName()), chalk.greenBright("[OPTIONS]"), chalk.magentaBright("[ARGS]") ].join(" ")), 
          res.push(this._usages(this._cmds, "Commands"), this._usages(this._opts, "Options"), this._usages(this._args, "Arguments")), 
          res.join(EOL);
        }
        _usage() {
          return chalk.blueBright(this._name) + " : " + this._title;
        }
        _usages(os, title) {
          if (os.length) return [ "", title + ":" ].concat(os.map((o => `  ${o._usage()}`))).join(EOL);
        }
        _fullTitle() {
          return `${this.isRootCmd ? "" : this._cmd._fullTitle() + EOL}${this._title}`;
        }
        _fullName() {
          return `${this.isRootCmd ? "" : this._cmd._fullName() + " "}${PATH.basename(this._name)}`;
        }
        _ejectOpt(opts, opt) {
          const pos = opts.indexOf(opt);
          if (-1 !== pos) return opts[pos]._arr ? opts[pos] : opts.splice(pos, 1)[0];
        }
        _checkRequired(opts, args) {
          if (this._opts.some((opt => opt._only && opts.hasOwnProperty(opt._name)))) return;
          const all = this._opts.concat(this._args);
          let i;
          for (;i = all.shift(); ) if (i._req && i._checkParsed(opts, args)) return this.reject(i._requiredText());
        }
        _parseCmd(argv, unparsed) {
          unparsed || (unparsed = []);
          let i, optSeen = !1;
          for (;i = argv.shift(); ) {
            if (i.indexOf("-") || (optSeen = !0), optSeen || !/^\w[\w-_]*$/.test(i)) {
              unparsed.push(i);
              continue;
            }
            let pkg, cmd = this._cmdsByName[i];
            if (!cmd && this._ext) {
              if (!0 === this._ext) {
                pkg = i;
                let c = this;
                for (;pkg = c._name + "-" + pkg, !c.isRootCmd; ) c = c._cmd;
              } else "string" == typeof this._ext && (pkg = ~this._ext.indexOf("%s") ? UTIL.format(this._ext, i) : this._ext + i);
              let cmdDesc;
              try {
                cmdDesc = __webpack_require__(5965)(pkg);
              } catch (e) {}
              if (cmdDesc) {
                if ("function" == typeof cmdDesc) this.cmd().name(i).apply(cmdDesc).end(); else {
                  if ("object" != typeof cmdDesc) throw new Error("Error: Unsupported command declaration type, should be a function or COA.Cmd() object");
                  this.cmd(cmdDesc), cmdDesc.name(i);
                }
                cmd = this._cmdsByName[i];
              }
            }
            if (cmd) return cmd._parseCmd(argv, unparsed);
            unparsed.push(i);
          }
          return {
            cmd: this,
            argv: unparsed
          };
        }
        _parseOptsAndArgs(argv) {
          const opts = {}, args = {}, nonParsedOpts = this._opts.concat(), nonParsedArgs = this._args.concat();
          let res, i;
          for (;i = argv.shift(); ) {
            if ("--" !== i && "-" === i[0]) {
              const m = i.match(/^(--\w[\w-_]*)=(.*)$/);
              m && (i = m[1], this._optsByKey[i]._flag || argv.unshift(m[2]));
              const opt = this._ejectOpt(nonParsedOpts, this._optsByKey[i]);
              if (!opt) return this.reject(`Unknown option: ${i}`);
              if (Q.isRejected(res = opt._parse(argv, opts))) return res;
              continue;
            }
            let a;
            for ("--" === i && (i = argv.splice(0)), Array.isArray(i) || (i = [ i ]); a = i.shift(); ) {
              let arg = nonParsedArgs.shift();
              if (!arg) return this.reject(`Unknown argument: ${a}`);
              if (arg._arr && nonParsedArgs.unshift(arg), Q.isRejected(res = arg._parse(a, args))) return res;
            }
          }
          return {
            opts: this._setDefaults(opts, nonParsedOpts),
            args: this._setDefaults(args, nonParsedArgs)
          };
        }
        _setDefaults(params, desc) {
          for (const item of desc) void 0 !== item._def && !params.hasOwnProperty(item._name) && item._saveVal(params, item._def);
          return params;
        }
        _processParams(params, desc) {
          const notExists = [];
          for (const item of desc) {
            const n = item._name;
            if (!params.hasOwnProperty(n)) {
              notExists.push(item);
              continue;
            }
            const vals = Array.isArray(params[n]) ? params[n] : [ params[n] ];
            let res;
            delete params[n];
            for (const v of vals) if (Q.isRejected(res = item._saveVal(params, v))) return res;
          }
          return this._setDefaults(params, notExists);
        }
        _parseArr(argv) {
          return Q.when(this._parseCmd(argv), (p => Q.when(p.cmd._parseOptsAndArgs(p.argv), (r => ({
            cmd: p.cmd,
            opts: r.opts,
            args: r.args
          })))));
        }
        _do(inputPromise) {
          return Q.when(inputPromise, (input => [ this._checkRequired ].concat(input.cmd._act || []).reduce(((res, act) => Q.when(res, (prev => act.call(input.cmd, input.opts, input.args, prev)))), void 0)));
        }
        run(argv) {
          argv || (argv = process.argv.slice(2));
          const cb = code => res => res ? this._exit(res.stack || res.toString(), (res.hasOwnProperty("exitCode") ? res.exitCode : code) || 0) : this._exit();
          return Q.when(this.do(argv), cb(0), cb(1)).done(), this;
        }
        invoke(cmds, opts, args) {
          return cmds || (cmds = []), opts || (opts = {}), args || (args = {}), "string" == typeof cmds && (cmds = cmds.split(" ")), 
          arguments.length < 3 && !Array.isArray(cmds) && (args = opts, opts = cmds, cmds = []), 
          Q.when(this._parseCmd(cmds), (p => p.argv.length ? this.reject(`Unknown command: ${cmds.join(" ")}`) : Q.all([ this._processParams(opts, this._opts), this._processParams(args, this._args) ]).spread(((_opts, _args) => this._do({
            cmd: p.cmd,
            opts: _opts,
            args: _args
          }).fail((res => res && 0 === res.exitCode ? res.toString() : this.reject(res)))))));
        }
      }
      Cmd.prototype.do = function(argv) {
        return this._do(this._parseArr(argv || []));
      }, module.exports = Cmd;
    },
    5079: function(module, __unused_webpack_exports, __webpack_require__) {
      const Cmd = __webpack_require__(2384), Opt = __webpack_require__(594), Arg = __webpack_require__(7283), shell = __webpack_require__(3048);
      module.exports = {
        Cmd: Cmd.create,
        Opt: Opt.create,
        Arg: Arg.create,
        classes: {
          Cmd: Cmd,
          Opt: Opt,
          Arg: Arg
        },
        shell: shell,
        require: __webpack_require__(5965)
      };
    },
    5965: function(module) {
      "use strict";
      module.exports = require;
    },
    4687: function(module) {
      "use strict";
      module.exports = require("./chalk");
    },
    2057: function(module) {
      "use strict";
      module.exports = require("constants");
    },
    7147: function(module) {
      "use strict";
      module.exports = require("fs");
    },
    2037: function(module) {
      "use strict";
      module.exports = require("os");
    },
    1017: function(module) {
      "use strict";
      module.exports = require("path");
    },
    3837: function(module) {
      "use strict";
      module.exports = require("util");
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
  }(5079);
  module.exports = __webpack_exports__;
}();