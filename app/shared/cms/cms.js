"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var global_lib_1 = require("../../global.lib");
var core_1 = require("@angular/core");
var dynamic_route_1 = require("../route/dynamic-route");
var main_page_1 = require("../../views/main-page/main-page");
var _a = require('file-system'), File = _a.File, Folder = _a.Folder, knownFolders = _a.knownFolders, path = _a.path;
var http = require("http");
var toFile = require('../utils/to-file').toFile;
var CONTAINER_DIRECTORY = 'containerDirectory';
var cache = require('nativescript-cache');
var base64 = require('base-64');
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
            var _a = global_lib_1.JsonFn.parse(res.content.toString()), content = _a.tree, Types = _a.Types;
            var basePath = path.normalize(knownFolders.documents().path + '/page');
            var root = {};
            function walk(path, node, _node) {
                if (node.file) {
                    if (node.text.endsWith('index.json')) {
                        console.log("cms.page/" + path + (path !== '' ? '/' : '') + node.text);
                        cache.set("cms.page/" + path + (path !== '' ? '/' : '') + node.text, base64.decode(node.file));
                    }
                    else {
                        toFile(basePath + "/" + path + (path !== '' ? '/' : '') + node.text, node.file);
                    }
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
            cache.set('cms.data', global_lib_1.JsonFn.stringify(Types));
            cache.set('cms.root', global_lib_1.JsonFn.stringify(root));
            _this.load();
        });
    };
    Cms.prototype.load = function () {
        var _this = this;
        var root = global_lib_1.JsonFn.parse(cache.get('cms.root') || "{\"path\": \"/\", \"type\": \"containerDirectory\", \"text\": \"Root\", \"children\": []}");
        this.data.types = global_lib_1.JsonFn.parse(cache.get('cms.data') || "{}");
        //noinspection TypeScriptUnresolvedVariable
        exports.Types = global.Types = this.data.types;
        var entry = function (node) {
            if (node.type === CONTAINER_DIRECTORY) {
                console.log("test: cms.page/" + node.path + (node.path !== '' ? '/' : '') + "index.json");
                var index = cache.get("cms.page/" + node.path + (node.path !== '' ? '/' : '') + "index.json");
                var containerPage = global_lib_1.JsonFn.parse(index || '{}');
                var _path = node.path.charAt(0) === '/' ? global_lib_1._.capitalize(node.path) : '/' + global_lib_1._.capitalize(node.path);
                _this.data.containerPage[_path] = containerPage.containers;
                // todo: page
                if (_this.services[_path]) {
                    _this.services[_path].data.containers = _this.data.containerPage[_path];
                }
                // create Page
                var route = {
                    path: _path,
                    component: main_page_1.createPage(),
                    as: global_lib_1._.capitalize(node.text),
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
                    Type.list = global_lib_1.JsonFn.parse(cache.get("Types." + type)).list;
                }
                catch (e) {
                }
            }
        }
    };
    Cms.prototype.walkInContainers = function (containers, cb) {
        function walk(containers) {
            global_lib_1._.each(containers, function (container) {
                global_lib_1._.each(container.elements, function (element) {
                    //noinspection TypeScriptUnresolvedVariable
                    var Type = exports.Types[element.type];
                    var e = global_lib_1._.find(Type.list, function (e) { return e._id === element.ref; });
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
        var fn = global_lib_1.JsonFn.clone(exports.Types[type].fn);
        global_lib_1._.each(fn, function (f, k) { return fn[k] = f.bind(_this.findByRef(type, ref)); });
        return fn;
    };
    Cms.prototype.findFnByID = function (type, ID) {
        var fn = global_lib_1.JsonFn.clone(exports.Types[type].fn);
        global_lib_1._.each(fn, function (f, k) { return fn[k] = f.bind(global_lib_1._.find(exports.Types[type].list, { ID: ID })); });
        return fn;
    };
    Cms.prototype.findByRef = function (type, ref) {
        return global_lib_1._.find(exports.Types[type].list, { _id: ref });
    };
    Cms.prototype.findByID = function (type, ID) {
        return global_lib_1._.find(exports.Types[type].list, { ID: ID });
    };
    Cms.prototype.createModel = function (type, cb, content) {
        http.request({
            url: this.basePath + "/cms-types/" + type,
            headers: { "Content-Type": "application/json" },
            method: "POST",
            content: global_lib_1.JsonFn.stringify(content)
        }).then(function (res) {
            var e = global_lib_1.JsonFn.parse(res.content.toString()).data;
            var ref = e._id;
            exports.Types[type].list.push(e);
            if (cb)
                cb(exports.Types[type], ref, global_lib_1._.find(exports.Types[type].list, { _id: ref }));
        });
    };
    Cms = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [dynamic_route_1.DynamicRouteConfigurator])
    ], Cms);
    return Cms;
}());
exports.Cms = Cms;
var ContainerService = (function () {
    function ContainerService() {
        this.data = {};
    }
    ContainerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ContainerService);
    return ContainerService;
}());
exports.ContainerService = ContainerService;
var FragmentService = (function () {
    function FragmentService() {
        this.data = {};
    }
    FragmentService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], FragmentService);
    return FragmentService;
}());
exports.FragmentService = FragmentService;
function post(link, body) {
    return http.request({
        url: exports.cms.basePath + link,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: global_lib_1.JsonFn.stringify(body)
    }).then(function (response) {
        return { data: response.content.toString() };
    });
}
function injectFnAndServerFn(scope, type) {
    scope.fn = {};
    global_lib_1._.each(exports.Types[type].fn, function (f, k) { return scope.fn[k] = f.bind(scope.model); });
    scope.serverFn = {};
    global_lib_1._.each(exports.Types[type].serverFn, function (fn, k) {
        fn(post, scope, type, k);
    });
}
exports.injectFnAndServerFn = injectFnAndServerFn;
function injectFnAndServerFnByWrapper(scope, name) {
    //noinspection TypeScriptUnresolvedVariable
    var wrapper = global_lib_1._.find(exports.Types.Wrapper.store, function (wrapper, key) { return key === name; });
    scope.fn = {};
    global_lib_1._.each(wrapper.fn, function (f, k) { return scope.fn[k] = f.bind(scope.model); });
    scope.serverFn = {};
    global_lib_1._.each(wrapper.serverFn, function (fn, k) {
        fn(post, scope, name, k);
    });
}
exports.injectFnAndServerFnByWrapper = injectFnAndServerFnByWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY21zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwyQkFBd0Isa0JBQWtCLENBQUMsQ0FBQTtBQUMzQyxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFDekMsOEJBQXVDLHdCQUF3QixDQUFDLENBQUE7QUFDaEUsMEJBQXlCLGlDQUFpQyxDQUFDLENBQUE7QUFHM0QsSUFBQSwyQkFBaUUsRUFBMUQsY0FBSSxFQUFFLGtCQUFNLEVBQUUsOEJBQVksRUFBRSxjQUFJLENBQTJCO0FBQ2xFLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QiwrQ0FBTSxDQUFnQztBQUM3QyxJQUFNLG1CQUFtQixHQUFHLG9CQUFvQixDQUFDO0FBQ2pELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzVDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQXFDbEMsV0FBWSxZQUFZO0lBQ3BCLHVDQUFVLFNBQVMsYUFBQSxDQUFBO0lBQ25CLHNDQUFTLFFBQVEsWUFBQSxDQUFBO0FBQ3JCLENBQUMsRUFIVyxvQkFBWSxLQUFaLG9CQUFZLFFBR3ZCO0FBSEQsSUFBWSxZQUFZLEdBQVosb0JBR1gsQ0FBQTtBQUdEO0lBVUksYUFBb0Isd0JBQWlELENBQUEsMkJBQTJCO1FBQTVFLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBeUI7UUFUOUQsYUFBUSxHQUFHLHVCQUF1QixDQUFDO1FBQ25DLFNBQUksR0FHUCxFQUFDLGFBQWEsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBQyxDQUFDO1FBQzVCLGFBQVEsR0FBb0MsRUFBRSxDQUFDO1FBQy9DLFdBQU0sR0FBNkMsRUFBRSxDQUFDO1FBQ3RELFVBQUssR0FBRyxLQUFLLENBQUM7UUFHakIsMkNBQTJDO1FBQzNDLFdBQUcsR0FBRyxNQUFNLENBQUMsR0FB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