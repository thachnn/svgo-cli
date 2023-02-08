#!/usr/bin/env node
require("v8-compile-cache"), function() {
  var __webpack_modules__ = {
    1890: function(module, __unused_webpack_exports, __webpack_require__) {
      var path = __webpack_require__(1017), fs = __webpack_require__(7147), _0777 = parseInt("0777", 8);
      function mkdirP(p, opts, f, made) {
        "function" == typeof opts ? (f = opts, opts = {}) : opts && "object" == typeof opts || (opts = {
          mode: opts
        });
        var mode = opts.mode, xfs = opts.fs || fs;
        void 0 === mode && (mode = _0777 & ~process.umask()), made || (made = null);
        var cb = f || function() {};
        p = path.resolve(p), xfs.mkdir(p, mode, (function(er) {
          if (!er) return cb(null, made = made || p);
          if ("ENOENT" === er.code) mkdirP(path.dirname(p), opts, (function(er, made) {
            er ? cb(er, made) : mkdirP(p, opts, cb, made);
          })); else xfs.stat(p, (function(er2, stat) {
            er2 || !stat.isDirectory() ? cb(er, made) : cb(null, made);
          }));
        }));
      }
      module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP, mkdirP.sync = function sync(p, opts, made) {
        opts && "object" == typeof opts || (opts = {
          mode: opts
        });
        var mode = opts.mode, xfs = opts.fs || fs;
        void 0 === mode && (mode = _0777 & ~process.umask()), made || (made = null), p = path.resolve(p);
        try {
          xfs.mkdirSync(p, mode), made = made || p;
        } catch (err0) {
          if ("ENOENT" === err0.code) made = sync(path.dirname(p), opts, made), sync(p, opts, made); else {
            var stat;
            try {
              stat = xfs.statSync(p);
            } catch (err1) {
              throw err0;
            }
            if (!stat.isDirectory()) throw err0;
          }
        }
        return made;
      };
    },
    635: function(module, __unused_webpack_exports, __webpack_require__) {
      "use strict";
      var svgo, FS = __webpack_require__(7147), PATH = __webpack_require__(1017), chalk = __webpack_require__(4687), mkdirp = __webpack_require__(1890), promisify = __webpack_require__(3837).promisify || __webpack_require__(8159), readdir = FS.promises ? FS.promises.readdir : promisify(FS.readdir), readFile = FS.promises ? FS.promises.readFile : promisify(FS.readFile), writeFile = FS.promises ? FS.promises.writeFile : promisify(FS.writeFile), SVGO = __webpack_require__(2565), YAML = __webpack_require__(5251), PKG = __webpack_require__(4318), encodeSVGDatauri = __webpack_require__(8665).By, decodeSVGDatauri = __webpack_require__(8665).rs, checkIsDir = __webpack_require__(8665).m3, regSVGFile = /\.svg$/, noop = () => {};
      function changePluginsState(names, state, config) {
        if (names.forEach(flattenPluginsCbk), config.plugins) for (var name of names) {
          var key, matched = !1;
          for (var plugin of config.plugins) (key = "object" == typeof plugin ? Object.keys(plugin)[0] : plugin) === name && ("object" == typeof plugin[key] && state || (plugin[key] = state), 
          matched = !0);
          matched || config.full || (config.plugins.push({
            [name]: state
          }), matched = !0);
        } else config.plugins = names.map((name => ({
          [name]: state
        })));
        return config;
      }
      function flattenPluginsCbk(name, index, names) {
        var split = name.split(",");
        split.length > 1 && (names[index] = split.shift(), names.push.apply(names, split));
      }
      function optimizeFolder(config, dir, output) {
        return config.quiet || console.log(`Processing directory '${dir}':\n`), readdir(dir).then((files => function(config, dir, files, output) {
          var svgFilesDescriptions = getFilesDescriptions(config, dir, files, output);
          return svgFilesDescriptions.length ? Promise.all(svgFilesDescriptions.map((fileDescription => optimizeFile(config, fileDescription.inputPath, fileDescription.outputPath)))) : Promise.reject(new Error(`No SVG files have been found in '${dir}' directory.`));
        }(config, dir, files, output)));
      }
      function getFilesDescriptions(config, dir, files, output) {
        const filesInThisFolder = files.filter((name => regSVGFile.test(name))).map((name => ({
          inputPath: PATH.resolve(dir, name),
          outputPath: PATH.resolve(output, name)
        })));
        return config.recursive ? [].concat(filesInThisFolder, files.filter((name => checkIsDir(PATH.resolve(dir, name)))).map((subFolderName => {
          const subFolderPath = PATH.resolve(dir, subFolderName), subFolderFiles = FS.readdirSync(subFolderPath), subFolderOutput = PATH.resolve(output, subFolderName);
          return getFilesDescriptions(config, subFolderPath, subFolderFiles, subFolderOutput);
        })).reduce(((a, b) => [].concat(a, b)), [])) : filesInThisFolder;
      }
      function optimizeFile(config, file, output) {
        return readFile(file, "utf8").then((data => processSVGData(config, {
          input: "file",
          path: file
        }, data, output, file)), (error => function(config, input, output, error) {
          if ("EISDIR" == error.code) return optimizeFolder(config, input, output);
          if ("ENOENT" == error.code) return Promise.reject(new Error(`Error: no such file or directory '${error.path}'.`));
          return Promise.reject(error);
        }(config, file, output, error)));
      }
      function processSVGData(config, info, data, output, input) {
        var startTime = Date.now(), prevFileSize = Buffer.byteLength(data, "utf8");
        return svgo.optimize(data, info).then((function(result) {
          config.datauri && (result.data = encodeSVGDatauri(result.data, config.datauri));
          var resultFileSize = Buffer.byteLength(result.data, "utf8"), processingTime = Date.now() - startTime;
          return function(input, output, data) {
            if ("-" == output) return console.log(data), Promise.resolve();
            return mkdirp.sync(PATH.dirname(output)), writeFile(output, data, "utf8").catch((error => function(input, output, data, error) {
              return "EISDIR" == error.code && input ? writeFile(PATH.resolve(output, PATH.basename(input)), data, "utf8") : Promise.reject(error);
            }(input, output, data, error)));
          }(input, output, result.data).then((function() {
            var inBytes, outBytes, profitPercents, time;
            config.quiet || "-" == output || (input && console.log(`\n${PATH.basename(input)}:`), 
            time = processingTime, console.log(`Done in ${time} ms!`), profitPercents = 100 - 100 * (outBytes = resultFileSize) / (inBytes = prevFileSize), 
            console.log(Math.round(inBytes / 1024 * 1e3) / 1e3 + " KiB" + (profitPercents < 0 ? " + " : " - ") + chalk.green(Math.abs(Math.round(10 * profitPercents) / 10) + "%") + " = " + Math.round(outBytes / 1024 * 1e3) / 1e3 + " KiB"));
          }), (error => Promise.reject(new Error("ENOTDIR" === error.code ? `Error: output '${output}' is not a directory.` : error))));
        }));
      }
      function printErrorAndExit(error) {
        return console.error(chalk.red(error)), process.exit(1), Promise.reject(error);
      }
      module.exports = __webpack_require__(9340).Cmd().helpful().name(PKG.name).title(PKG.description).opt().name("version").title("Version").short("v").long("version").only().flag().act((function() {
        return process.stdout.write(PKG.version + "\n"), "";
      })).end().opt().name("input").title('Input file, "-" for STDIN').short("i").long("input").arr().val((function(val) {
        return val || this.reject("Option '--input' must have a value.");
      })).end().opt().name("string").title("Input SVG data string").short("s").long("string").end().opt().name("folder").title("Input folder, optimize and rewrite all *.svg files").short("f").long("folder").val((function(val) {
        return val || this.reject("Option '--folder' must have a value.");
      })).end().opt().name("output").title('Output file or folder (by default the same as the input), "-" for STDOUT').short("o").long("output").arr().val((function(val) {
        return val || this.reject("Option '--output' must have a value.");
      })).end().opt().name("precision").title("Set number of digits in the fractional part, overrides plugins params").short("p").long("precision").val((function(val) {
        return isNaN(val) ? this.reject("Option '--precision' must be an integer number") : val;
      })).end().opt().name("config").title("Config file or JSON string to extend or replace default").long("config").val((function(val) {
        return val || this.reject("Option '--config' must have a value.");
      })).end().opt().name("disable").title('Disable plugin by name, "--disable={PLUGIN1,PLUGIN2}" for multiple plugins (*nix)').long("disable").arr().val((function(val) {
        return val || this.reject("Option '--disable' must have a value.");
      })).end().opt().name("enable").title('Enable plugin by name, "--enable={PLUGIN3,PLUGIN4}" for multiple plugins (*nix)').long("enable").arr().val((function(val) {
        return val || this.reject("Option '--enable' must have a value.");
      })).end().opt().name("datauri").title("Output as Data URI string (base64, URI encoded or unencoded)").long("datauri").val((function(val) {
        return val || this.reject("Option '--datauri' must have one of the following values: 'base64', 'enc' or 'unenc'");
      })).end().opt().name("multipass").title("Pass over SVGs multiple times to ensure all optimizations are applied").long("multipass").flag().end().opt().name("pretty").title("Make SVG pretty printed").long("pretty").flag().end().opt().name("indent").title("Indent number when pretty printing SVGs").long("indent").val((function(val) {
        return isNaN(val) ? this.reject("Option '--indent' must be an integer number") : val;
      })).end().opt().name("recursive").title("Use with '-f'. Optimizes *.svg files in folders recursively.").short("r").long("recursive").flag().end().opt().name("quiet").title("Only output error messages, not regular status messages").short("q").long("quiet").flag().end().opt().name("show-plugins").title("Show available plugins and exit").long("show-plugins").flag().end().arg().name("input").title("Alias to --input").arr().end().act((function(opts, args) {
        var input = opts.input || args.input, output = opts.output, config = {};
        if (opts["show-plugins"]) !function() {
          console.log("Currently available plugins:");
          var list = [].concat.apply([], (new SVGO).config.plugins).sort(((a, b) => a.name.localeCompare(b.name))).map((plugin => ` [ ${chalk.green(plugin.name)} ] ${plugin.description}`)).join("\n");
          console.log(list);
        }(); else {
          if (!(input && "-" !== input[0] || opts.string || opts.stdin || opts.folder || !0 !== process.stdin.isTTY)) return this.usage();
          if ("object" == typeof process && process.versions && process.versions.node && PKG && PKG.engines.node) {
            var nodeVersion = String(PKG.engines.node).match(/\d*(\.\d+)*/)[0];
            if (parseFloat(process.versions.node) < parseFloat(nodeVersion)) return printErrorAndExit(`Error: ${PKG.name} requires Node.js version ${nodeVersion} or higher.`);
          }
          if (opts.config) if ("{" === opts.config.charAt(0)) try {
            config = JSON.parse(opts.config);
          } catch (e) {
            return printErrorAndExit(`Error: Couldn't parse config JSON.\n${String(e)}`);
          } else {
            var configData, configPath = PATH.resolve(opts.config);
            try {
              configData = FS.readFileSync(configPath, "utf8"), config = JSON.parse(configData);
            } catch (err) {
              if ("ENOENT" === err.code) return printErrorAndExit(`Error: couldn't find config file '${opts.config}'.`);
              if ("EISDIR" === err.code) return printErrorAndExit(`Error: directory '${opts.config}' is not a config file.`);
              if ((config = YAML.safeLoad(configData)).__DIR = PATH.dirname(configPath), !config || Array.isArray(config)) return printErrorAndExit(`Error: invalid config file '${opts.config}'.`);
            }
          }
          if (opts.quiet && (config.quiet = opts.quiet), opts.recursive && (config.recursive = opts.recursive), 
          opts.precision) {
            var precision = Math.min(Math.max(0, parseInt(opts.precision)), 20);
            isNaN(precision) || (config.floatPrecision = precision);
          }
          var indent;
          if (opts.disable && changePluginsState(opts.disable, !1, config), opts.enable && changePluginsState(opts.enable, !0, config), 
          opts.multipass && (config.multipass = !0), opts.pretty) config.js2svg = config.js2svg || {}, 
          config.js2svg.pretty = !0, opts.indent && !isNaN(indent = parseInt(opts.indent)) && (config.js2svg.indent = indent);
          if (svgo = new SVGO(config), output) {
            if (input && "-" != input[0]) if (1 == output.length && checkIsDir(output[0])) for (var dir = output[0], i = 0; i < input.length; i++) output[i] = checkIsDir(input[i]) ? input[i] : PATH.resolve(dir, PATH.basename(input[i])); else output.length < input.length && (output = output.concat(input.slice(output.length)));
          } else input ? output = input : opts.string && (output = "-");
          if (opts.datauri && (config.datauri = opts.datauri), opts.folder) {
            var ouputFolder = output && output[0] || opts.folder;
            return optimizeFolder(config, opts.folder, ouputFolder).then(noop, printErrorAndExit);
          }
          if (input) return "-" === input[0] ? new Promise(((resolve, reject) => {
            var data = "", file = output[0];
            process.stdin.on("data", (chunk => data += chunk)).once("end", (() => processSVGData(config, {
              input: "string"
            }, data, file).then(resolve, reject)));
          })) : Promise.all(input.map(((file, n) => optimizeFile(config, file, output[n])))).then(noop, printErrorAndExit);
          if (opts.string) {
            var data = decodeSVGDatauri(opts.string);
            return processSVGData(config, {
              input: "string"
            }, data, output[0]);
          }
        }
      }));
    },
    8665: function(__unused_webpack_module, exports, __webpack_require__) {
      "use strict";
      var FS = __webpack_require__(7147);
      exports.By = function(str, type) {
        var prefix = "data:image/svg+xml";
        return type && "base64" !== type ? "enc" === type ? str = prefix + "," + encodeURIComponent(str) : "unenc" === type && (str = prefix + "," + str) : (prefix += ";base64,", 
        str = Buffer.from ? prefix + Buffer.from(str).toString("base64") : prefix + new Buffer(str).toString("base64")), 
        str;
      }, exports.rs = function(str) {
        var match = /data:image\/svg\+xml(;charset=[^;,]*)?(;base64)?,(.*)/.exec(str);
        if (!match) return str;
        var data = match[3];
        return match[2] ? str = new Buffer(data, "base64").toString("utf8") : "%" === data.charAt(0) ? str = decodeURIComponent(data) : "<" === data.charAt(0) && (str = data), 
        str;
      };
      var removeLeadingZero = function(num) {
        var strNum = num.toString();
        return 0 < num && num < 1 && 48 == strNum.charCodeAt(0) ? strNum = strNum.slice(1) : -1 < num && num < 0 && 48 == strNum.charCodeAt(1) && (strNum = strNum.charAt(0) + strNum.slice(2)), 
        strNum;
      };
      exports.m3 = function(path) {
        try {
          return FS.lstatSync(path).isDirectory();
        } catch (e) {
          return !1;
        }
      };
    },
    8159: function(module) {
      "use strict";
      module.exports = function(fn, options) {
        if ("function" != typeof fn) throw new TypeError("first parameter is not a function");
        const opts = Object.assign({
          context: {},
          multiArgs: !1
        }, options);
        return function() {
          const callArgs = Array.prototype.slice.call(arguments);
          return new Promise((function(resolve, reject) {
            callArgs.push((function(err) {
              err ? reject(err) : opts.multiArgs ? resolve(Array.prototype.slice.call(arguments, 1)) : resolve(arguments[1]);
            })), fn.apply(opts.context, callArgs);
          }));
        };
      };
    },
    2565: function(module) {
      "use strict";
      module.exports = require("./index");
    },
    4687: function(module) {
      "use strict";
      module.exports = require("./vendor/chalk");
    },
    9340: function(module) {
      "use strict";
      module.exports = require("./vendor/coa");
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
    },
    3837: function(module) {
      "use strict";
      module.exports = require("util");
    },
    4318: function(module) {
      "use strict";
      module.exports = JSON.parse('{"name":"svgo","version":"1.3.2","description":"Nodejs-based tool for optimizing SVG vector graphics files","engines":{"node":">=4"}}');
    }
  }, __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
    module.exports;
  }
  __webpack_require__(635).run();
}();