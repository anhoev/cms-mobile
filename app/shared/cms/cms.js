"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var main_1 = require("../../global.lib");
var core_1 = require("@angular/core");
var main_page_1 = require("../../views/main-page/main-page");
var _a = require('file-system'), File = _a.File, Folder = _a.Folder, knownFolders = _a.knownFolders, path = _a.path;
var http = require("http");
var toFile = require('../utils/to-file').toFile;
var CONTAINER_DIRECTORY = 'containerDirectory';
var cache = require('nativescript-cache');
(function (StandardType) {
    StandardType[StandardType["Wrapper"] = 'Wrapper'] = "Wrapper";
    StandardType[StandardType["Layout"] = 'Layout'] = "Layout";
})(exports.StandardType || (exports.StandardType = {}));
var StandardType = exports.StandardType;
var Cms = (function () {
    function Cms(dynamicRouteConfigurator /*, private router:Router*/) {
        this.dynamicRouteConfigurator = dynamicRouteConfigurator;
        this.basePath = 'http://localhost:8888';
        this.data = { containerPage: {}, types: {} };
        this.services = {};
        this.routes = [];
        this.cache = cache;
        //noinspection TypeScriptUnresolvedVariable
        exports.cms = global.cms = this;
    }
    Cms.prototype.sync = function () {
        var _this = this;
        http.request({ url: this.basePath + "/cms-mobile", method: "GET" }).then(function (res) {
            var _a = main_1.JsonFn.parse(res.content.toString()), content = _a.tree, Types = _a.Types;
            var basePath = path.normalize(knownFolders.documents().path + '/page');
            var root = {};
            function walk(path, node, _node) {
                if (node.file) {
                    toFile(basePath + "/" + path + (path !== '' ? '/' : '') + node.text, node.file);
                }
                else if (node.type === 'directory' || node.type === CONTAINER_DIRECTORY) {
                    var path2_1 = "" + path + (path !== '' ? '/' : '') + (node.text !== 'root' ? node.text : '');
                    if (node.text !== 'root') {
                        Folder.fromPath(basePath + "/" + path2_1);
                    }
                    if (node.type === CONTAINER_DIRECTORY || node.text === 'root') {
                        _node.type = CONTAINER_DIRECTORY;
                        _node.path = path2_1;
                        _node.text = node.text ? node.text : 'Root';
                    }
                    _node.children = [];
                    node.children.forEach(function (n) {
                        var subNode = {};
                        walk(path2_1, n, subNode);
                        if (subNode.hasOwnProperty('type'))
                            _node.children.push(subNode);
                    });
                }
            }
            walk('', content, root);
            File.fromPath(path.normalize(knownFolders.documents().path + '/data.json')).writeTextSync(main_1.JsonFn.stringify(Types));
            File.fromPath(path.normalize(knownFolders.documents().path + '/root.json')).writeTextSync(main_1.JsonFn.stringify(root));
            _this.load();
        });
    };
    Cms.prototype.load = function () {
        var _this = this;
        var basePath;
        if (File.exists(knownFolders.documents().path + '/page/index.json')) {
            basePath = path.normalize(knownFolders.documents().path);
        }
        else {
            basePath = path.normalize(knownFolders.currentApp().path);
        }
        var root = main_1.JsonFn.parse(File.fromPath(basePath + "/root.json").readTextSync());
        this.data.types = main_1.JsonFn.parse(File.fromPath(basePath + '/data.json').readTextSync());
        //noinspection TypeScriptUnresolvedVariable
        exports.Types = global.Types = this.data.types;
        var entry = function (node) {
            if (node.type === CONTAINER_DIRECTORY) {
                var index = File.fromPath(basePath + "/page/" + node.path + (node.path !== '' ? '/' : '') + "index.json").readTextSync();
                var containerPage = main_1.JsonFn.parse(index);
                var _path = node.path.charAt(0) === '/' ? main_1._.capitalize(node.path) : '/' + main_1._.capitalize(node.path);
                _this.data.containerPage[_path] = containerPage.containers;
                // todo: page
                if (_this.services[_path]) {
                    _this.services[_path].data.containers = _this.data.containerPage[_path];
                }
                // create Page
                var route = {
                    path: _path,
                    component: main_page_1.createPage(),
                    as: main_1._.capitalize(node.text),
                    data: { path: _path }
                };
                _this.routes.push(route);
            }
            node.children.forEach(function (n) { return entry(n); });
        };
        this.routes = [];
        entry(root);
        console.log(JSON.stringify(this.routes));
        this.dynamicRouteConfigurator.addRoutes(this.routes);
        // get data from cache (if element is not viewelement)
        for (var _i = 0, Types_1 = exports.Types; _i < Types_1.length; _i++) {
            var _a = Types_1[_i], type = _a[0], Type = _a[1];
            if (Type.info.isViewElement) {
                try {
                    Type.list = main_1.JsonFn.parse(cache.get("Types." + type)).list;
                }
                catch (e) {
                }
            }
        }
    };
    Cms.prototype.walkInContainers = function (containers, cb) {
        function walk(containers) {
            main_1._.each(containers, function (container) {
                main_1._.each(container.elements, function (element) {
                    //noinspection TypeScriptUnresolvedVariable
                    var Type = exports.Types[element.type];
                    var e = main_1._.find(Type.list, function (e) { return e._id === element.ref; });
                    cb(element, e, container);
                    if (element.containers && element.containers.length > 0) {
                        walk(element.containers);
                    }
                });
            });
        }
        walk(containers);
    };
    Cms.prototype.findFnByRef = function (type, ref) {
        var _this = this;
        var fn = main_1.JsonFn.clone(exports.Types[type].fn);
        main_1._.each(fn, function (f, k) { return fn[k] = f.bind(_this.findByRef(type, ref)); });
        return fn;
    };
    Cms.prototype.findFnByID = function (type, ID) {
        var fn = main_1.JsonFn.clone(exports.Types[type].fn);
        main_1._.each(fn, function (f, k) { return fn[k] = f.bind(main_1._.find(exports.Types[type].list, { ID: ID })); });
        return fn;
    };
    Cms.prototype.findByRef = function (type, ref) {
        return main_1._.find(exports.Types[type].list, { _id: ref });
    };
    Cms.prototype.findByID = function (type, ID) {
        return main_1._.find(exports.Types[type].list, { ID: ID });
    };
    Cms.prototype.createModel = function (type, cb, content) {
        http.request({
            url: this.basePath + "/cms-types/" + type,
            headers: { "Content-Type": "application/json" },
            method: "POST",
            content: main_1.JsonFn.stringify(content)
        }).then(function (res) {
            var e = main_1.JsonFn.parse(res.content.toString()).data;
            var ref = e._id;
            exports.Types[type].list.push(e);
            if (cb)
                cb(exports.Types[type], ref, main_1._.find(exports.Types[type].list, { _id: ref }));
        });
    };
    Cms = __decorate([
        core_1.Injectable()
    ], Cms);
    return Cms;
}());
exports.Cms = Cms;
var ContainerService = (function () {
    function ContainerService() {
        this.data = {};
    }
    ContainerService = __decorate([
        core_1.Injectable()
    ], ContainerService);
    return ContainerService;
}());
exports.ContainerService = ContainerService;
var FragmentService = (function () {
    function FragmentService() {
        this.data = {};
    }
    FragmentService = __decorate([
        core_1.Injectable()
    ], FragmentService);
    return FragmentService;
}());
exports.FragmentService = FragmentService;
function post(link, body) {
    return http.request({
        url: exports.cms.basePath + link,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: main_1.JsonFn.stringify(body)
    }).then(function (response) {
        return { data: response.content.toString() };
    });
}
function injectFnAndServerFn(scope, type) {
    scope.fn = {};
    main_1._.each(exports.Types[type].fn, function (f, k) { return scope.fn[k] = f.bind(scope.model); });
    scope.serverFn = {};
    main_1._.each(exports.Types[type].serverFn, function (fn, k) {
        fn(post, scope, type, k);
    });
}
exports.injectFnAndServerFn = injectFnAndServerFn;
function injectFnAndServerFnByWrapper(scope, name) {
    //noinspection TypeScriptUnresolvedVariable
    var wrapper = main_1._.find(exports.Types.Wrapper.store, function (wrapper, key) { return key === name; });
    scope.fn = {};
    main_1._.each(wrapper.fn, function (f, k) { return scope.fn[k] = f.bind(scope.model); });
    scope.serverFn = {};
    main_1._.each(wrapper.serverFn, function (fn, k) {
        fn(post, scope, name, k);
    });
}
exports.injectFnAndServerFnByWrapper = injectFnAndServerFnByWrapper;
