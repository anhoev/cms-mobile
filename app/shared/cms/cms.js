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
        this.basePath = cache.get('cms.basePath') || 'http://localhost:8888';
        this.data = { containerPage: {}, types: {} };
        this.services = {};
        this.routes = [];
        this.cache = cache;
        this.alreadyLoaded = cache.get('cms.alreadyLoaded') === 'true';
        //noinspection TypeScriptUnresolvedVariable
        exports.cms = global.cms = this;
    }
    Cms.prototype.sync = function () {
        var _this = this;
        cache.set('cms.basePath', exports.cms.basePath);
        http.request({ url: this.basePath + "/cms-mobile", method: "GET" }).then(function (res) {
            _this.alreadyLoaded = true;
            cache.set('cms.alreadyLoaded', 'true');
            var _a = global_lib_1.JsonFn.parse(res.content.toString(), true), content = _a.tree, Types = _a.Types;
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
        var root = global_lib_1.JsonFn.parse(cache.get('cms.root') || "{\"path\": \"/\", \"type\": \"containerDirectory\", \"text\": \"Root\", \"children\": []}", true);
        this.data.types = global_lib_1.JsonFn.parse(cache.get('cms.data') || "{}", true);
        //noinspection TypeScriptUnresolvedVariable
        exports.Types = global.Types = this.data.types;
        if (this.initTypes)
            this.initTypes();
        var entry = function (node) {
            if (node.type === CONTAINER_DIRECTORY) {
                console.log("test: cms.page/" + node.path + (node.path !== '' ? '/' : '') + "index.json");
                var index = cache.get("cms.page/" + node.path + (node.path !== '' ? '/' : '') + "index.json");
                var containerPage = global_lib_1.JsonFn.parse(index || '{}', true);
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
        for (var type in exports.Types) {
            //noinspection TypeScriptUnresolvedVariable
            if (!exports.Types[type].info.isViewElement) {
                console.log('Get list for ' + type);
                try {
                    exports.Types[type].list = global_lib_1.JsonFn.parse(cache.get("Types." + type + ".list"), true);
                }
                catch (e) {
                    console.warn(e);
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
    Cms.prototype.createElement = function (type, content, cb) {
        http.request({
            url: this.basePath + "/cms-types/" + type,
            headers: { "Content-Type": "application/json" },
            method: "POST",
            content: global_lib_1.JsonFn.stringify(content)
        }).then(function (res) {
            var e = global_lib_1.JsonFn.parse(res.content.toString(), true).data;
            var ref = e._id;
            exports.Types[type].list = exports.Types[type].list || [];
            exports.Types[type].list.push(e);
            if (cb)
                cb(global_lib_1._.find(exports.Types[type].list, { _id: ref }));
        }, function (e) { return console.log(e); });
    };
    Cms.prototype.loadElements = function (type, cb) {
        var _this = this;
        http.request({ url: this.basePath + "/api/v1/" + type, method: 'GET' }).then(function (res) {
            _this.data.types[type].list = global_lib_1.JsonFn.parse(res.content.toString(), true);
            if (cb)
                cb();
            cache.set("Types." + type + ".list", global_lib_1.JsonFn.stringify(_this.data.types[type].list));
        });
    };
    Cms.prototype.updateElement = function (type, model) {
        http.request({
            url: this.basePath + "/api/v1/" + type + "/" + model._id,
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            content: global_lib_1.JsonFn.stringify(model)
        }).then(function (res) {
            console.log('update element successful');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY21zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwyQkFBd0Isa0JBQWtCLENBQUMsQ0FBQTtBQUMzQyxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFDekMsOEJBQXVDLHdCQUF3QixDQUFDLENBQUE7QUFDaEUsMEJBQXlCLGlDQUFpQyxDQUFDLENBQUE7QUFHM0QsSUFBQSwyQkFBaUUsRUFBMUQsY0FBSSxFQUFFLGtCQUFNLEVBQUUsOEJBQVksRUFBRSxjQUFJLENBQTJCO0FBQ2xFLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QiwrQ0FBTSxDQUFnQztBQUM3QyxJQUFNLG1CQUFtQixHQUFHLG9CQUFvQixDQUFDO0FBQ2pELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzVDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQXNDbEMsV0FBWSxZQUFZO0lBQ3BCLHVDQUFVLFNBQVMsYUFBQSxDQUFBO0lBQ25CLHNDQUFTLFFBQVEsWUFBQSxDQUFBO0FBQ3JCLENBQUMsRUFIVyxvQkFBWSxLQUFaLG9CQUFZLFFBR3ZCO0FBSEQsSUFBWSxZQUFZLEdBQVosb0JBR1gsQ0FBQTtBQUdEO0lBWUksYUFBb0Isd0JBQWlELENBQUEsMkJBQTJCO1FBQTVFLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBeUI7UUFYOUQsYUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksdUJBQXVCLENBQUM7UUFDaEUsU0FBSSxHQUdQLEVBQUMsYUFBYSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUM7UUFDNUIsYUFBUSxHQUFvQyxFQUFFLENBQUM7UUFDL0MsV0FBTSxHQUE2QyxFQUFFLENBQUM7UUFDdEQsVUFBSyxHQUFHLEtBQUssQ0FBQztRQUVkLGtCQUFhLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLE1BQU0sQ0FBQztRQUc3RCwyQ0FBMkM7UUFDM0MsV0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFTSxrQkFBSSxHQUFYO1FBQUEsaUJBeUNDO1FBeENHLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLFdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDdEUsS0FBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2QyxJQUFBLDREQUF3RSxFQUFqRSxpQkFBWSxFQUFFLGdCQUFLLENBQStDO1lBQ3pFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztZQUN6RSxJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7WUFFaEIsY0FBYyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUs7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFZLElBQUksSUFBRyxJQUFJLEtBQUssRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLElBQUcsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO3dCQUNyRSxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQVksSUFBSSxJQUFHLElBQUksS0FBSyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsSUFBRyxJQUFJLENBQUMsSUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2pHLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osTUFBTSxDQUFJLFFBQVEsU0FBSSxJQUFJLElBQUcsSUFBSSxLQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxJQUFHLElBQUksQ0FBQyxJQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsRixDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQW1CLENBQUMsQ0FBQyxDQUFDO29CQUN4RSxJQUFJLE9BQUssR0FBRyxLQUFHLElBQUksSUFBRyxJQUFJLEtBQUssRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEtBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUUsQ0FBQztvQkFDdkYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixNQUFNLENBQUMsUUFBUSxDQUFJLFFBQVEsU0FBSSxPQUFPLENBQUMsQ0FBQztvQkFDNUMsQ0FBQztvQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFtQixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDNUQsS0FBSyxDQUFDLElBQUksR0FBRyxtQkFBbUIsQ0FBQzt3QkFDakMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFLLENBQUM7d0JBQ25CLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztvQkFDaEQsQ0FBQztvQkFDRCxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO3dCQUNuQixJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7d0JBQ25CLElBQUksQ0FBQyxPQUFLLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyRSxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLG1CQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDL0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsbUJBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5QyxLQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRU0sa0JBQUksR0FBWDtRQUFBLGlCQXFEQztRQXBERyxJQUFNLElBQUksR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLDJGQUE2RSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXhJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBFLDJDQUEyQztRQUMzQyxhQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUV2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXJDLElBQU0sS0FBSyxHQUFHLFVBQUEsSUFBSTtZQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQW1CLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFrQixJQUFJLENBQUMsSUFBSSxJQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLGdCQUFZLENBQUMsQ0FBQztnQkFDbkYsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFZLElBQUksQ0FBQyxJQUFJLElBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsZ0JBQVksQ0FBQyxDQUFDO2dCQUN6RixJQUFNLGFBQWEsR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4RCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsY0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLGNBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwRyxLQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDO2dCQUMxRCxhQUFhO2dCQUNiLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QixLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFFLENBQUM7Z0JBRUQsY0FBYztnQkFDZCxJQUFNLEtBQUssR0FBRztvQkFDVixJQUFJLEVBQUUsS0FBSztvQkFDWCxTQUFTLEVBQUUsc0JBQVUsRUFBRTtvQkFDdkIsRUFBRSxFQUFFLGNBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDM0IsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQztpQkFDdEIsQ0FBQztnQkFDRixLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixDQUFDO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQVIsQ0FBUSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFBO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRVosT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJELHNEQUFzRDtRQUV0RCxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxhQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLDJDQUEyQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQztvQkFDRCxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBUyxJQUFJLFVBQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzRSxDQUFFO2dCQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVNLDhCQUFnQixHQUF2QixVQUF3QixVQUFVLEVBQUUsRUFBRTtRQUNsQyxjQUFjLFVBQVU7WUFDcEIsY0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQSxTQUFTO2dCQUN4QixjQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBQSxPQUFPO29CQUM5QiwyQ0FBMkM7b0JBQzNDLElBQU0sSUFBSSxHQUFHLGFBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2pDLElBQU0sQ0FBQyxHQUFHLGNBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDLEdBQUcsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO29CQUN4RCxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDMUIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUM3QixDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFTSx5QkFBVyxHQUFsQixVQUFtQixJQUFJLEVBQUUsR0FBRztRQUE1QixpQkFJQztRQUhHLElBQU0sRUFBRSxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxjQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUF6QyxDQUF5QyxDQUFDLENBQUM7UUFDaEUsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSx3QkFBVSxHQUFqQixVQUFrQixJQUFJLEVBQUUsRUFBRTtRQUN0QixJQUFNLEVBQUUsR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsY0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBQyxDQUFDLElBQUksQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBQSxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQTlDLENBQThDLENBQUMsQ0FBQztRQUNyRSxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLHVCQUFTLEdBQWhCLFVBQWlCLElBQUksRUFBRSxHQUFHO1FBQ3RCLE1BQU0sQ0FBQyxjQUFDLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sc0JBQVEsR0FBZixVQUFnQixJQUFJLEVBQUUsRUFBRTtRQUNwQixNQUFNLENBQUMsY0FBQyxDQUFDLElBQUksQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBQSxFQUFFLEVBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSwyQkFBYSxHQUFwQixVQUFxQixJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNULEdBQUcsRUFBSyxJQUFJLENBQUMsUUFBUSxtQkFBYyxJQUFNO1lBQ3pDLE9BQU8sRUFBRSxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQztZQUM3QyxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FDckMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDQSxvRUFBTSxDQUErQztZQUM1RCxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ2xCLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDMUMsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUFDLEVBQUUsQ0FBQyxjQUFDLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUMsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVNLDBCQUFZLEdBQW5CLFVBQW9CLElBQUksRUFBRSxFQUFFO1FBQTVCLGlCQU1DO1FBTEcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBSyxJQUFJLENBQUMsUUFBUSxnQkFBVyxJQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztZQUMxRSxLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4RSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQUMsRUFBRSxFQUFFLENBQUM7WUFDYixLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVMsSUFBSSxVQUFPLEVBQUUsbUJBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsRixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSwyQkFBYSxHQUFwQixVQUFxQixJQUFJLEVBQUUsS0FBSztRQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1QsR0FBRyxFQUFLLElBQUksQ0FBQyxRQUFRLGdCQUFXLElBQUksU0FBSSxLQUFLLENBQUMsR0FBSztZQUNuRCxPQUFPLEVBQUUsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUM7WUFDN0MsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUUsbUJBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1NBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUExTEw7UUFBQyxpQkFBVSxFQUFFOztXQUFBO0lBMkxiLFVBQUM7QUFBRCxDQUFDLEFBMUxELElBMExDO0FBMUxZLFdBQUcsTUEwTGYsQ0FBQTtBQUdEO0lBQUE7UUFDVyxTQUFJLEdBR1AsRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQU5EO1FBQUMsaUJBQVUsRUFBRTs7d0JBQUE7SUFNYix1QkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksd0JBQWdCLG1CQUs1QixDQUFBO0FBR0Q7SUFBQTtRQUNXLFNBQUksR0FDUCxFQUFFLENBQUM7SUFDWCxDQUFDO0lBSkQ7UUFBQyxpQkFBVSxFQUFFOzt1QkFBQTtJQUliLHNCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSx1QkFBZSxrQkFHM0IsQ0FBQTtBQUVELGNBQWMsSUFBSSxFQUFFLElBQUk7SUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDaEIsR0FBRyxFQUFFLFdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSTtRQUN4QixNQUFNLEVBQUUsTUFBTTtRQUNkLE9BQU8sRUFBRSxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQztRQUM3QyxPQUFPLEVBQUUsbUJBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0tBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxRQUFRO1FBQ3RCLE1BQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsNkJBQW9DLEtBQUssRUFBRSxJQUFJO0lBQzNDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ2QsY0FBQyxDQUFDLElBQUksQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQWpDLENBQWlDLENBQUMsQ0FBQTtJQUVuRSxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNwQixjQUFDLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBQyxFQUFFLEVBQUUsQ0FBQztRQUMvQixFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBUmUsMkJBQW1CLHNCQVFsQyxDQUFBO0FBRUQsc0NBQTZDLEtBQUssRUFBRSxJQUFJO0lBQ3BELDJDQUEyQztJQUMzQyxJQUFNLE9BQU8sR0FBRyxjQUFDLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSyxPQUFBLEdBQUcsS0FBSyxJQUFJLEVBQVosQ0FBWSxDQUFDLENBQUM7SUFDNUUsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDZCxjQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFBO0lBRS9ELEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLGNBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFWZSxvQ0FBNEIsK0JBVTNDLENBQUEifQ==