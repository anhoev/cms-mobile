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
        //noinspection TypeScriptUnresolvedVariable
        exports.cms = global.cms = this;
    }
    Cms.prototype.sync = function () {
        var _this = this;
        cache.set('cms.basePath', exports.cms.basePath);
        http.request({ url: this.basePath + "/cms-mobile", method: "GET" }).then(function (res) {
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
        for (var _i = 0, Types_1 = exports.Types; _i < Types_1.length; _i++) {
            var _a = Types_1[_i], type = _a[0], Type = _a[1];
            if (Type.info.isViewElement) {
                try {
                    Type.list = global_lib_1.JsonFn.parse(cache.get("Types." + type + ".list"), true).list;
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
            var e = global_lib_1.JsonFn.parse(res.content.toString(), true).data;
            var ref = e._id;
            exports.Types[type].list.push(e);
            if (cb)
                cb(exports.Types[type], ref, global_lib_1._.find(exports.Types[type].list, { _id: ref }));
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY21zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwyQkFBd0Isa0JBQWtCLENBQUMsQ0FBQTtBQUMzQyxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFDekMsOEJBQXVDLHdCQUF3QixDQUFDLENBQUE7QUFDaEUsMEJBQXlCLGlDQUFpQyxDQUFDLENBQUE7QUFHM0QsSUFBQSwyQkFBaUUsRUFBMUQsY0FBSSxFQUFFLGtCQUFNLEVBQUUsOEJBQVksRUFBRSxjQUFJLENBQTJCO0FBQ2xFLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QiwrQ0FBTSxDQUFnQztBQUM3QyxJQUFNLG1CQUFtQixHQUFHLG9CQUFvQixDQUFDO0FBQ2pELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzVDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQXNDbEMsV0FBWSxZQUFZO0lBQ3BCLHVDQUFVLFNBQVMsYUFBQSxDQUFBO0lBQ25CLHNDQUFTLFFBQVEsWUFBQSxDQUFBO0FBQ3JCLENBQUMsRUFIVyxvQkFBWSxLQUFaLG9CQUFZLFFBR3ZCO0FBSEQsSUFBWSxZQUFZLEdBQVosb0JBR1gsQ0FBQTtBQUdEO0lBV0ksYUFBb0Isd0JBQWlELENBQUEsMkJBQTJCO1FBQTVFLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBeUI7UUFWOUQsYUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksdUJBQXVCLENBQUM7UUFDaEUsU0FBSSxHQUdQLEVBQUMsYUFBYSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUM7UUFDNUIsYUFBUSxHQUFvQyxFQUFFLENBQUM7UUFDL0MsV0FBTSxHQUE2QyxFQUFFLENBQUM7UUFDdEQsVUFBSyxHQUFHLEtBQUssQ0FBQztRQUlqQiwyQ0FBMkM7UUFDM0MsV0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFTSxrQkFBSSxHQUFYO1FBQUEsaUJBdUNDO1FBdENHLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLFdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDdEUsSUFBQSw0REFBd0UsRUFBakUsaUJBQVksRUFBRSxnQkFBSyxDQUErQztZQUN6RSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFDekUsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBRWhCLGNBQWMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBWSxJQUFJLElBQUcsSUFBSSxLQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxJQUFHLElBQUksQ0FBQyxJQUFNLENBQUMsQ0FBQzt3QkFDckUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFZLElBQUksSUFBRyxJQUFJLEtBQUssRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLElBQUcsSUFBSSxDQUFDLElBQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNqRyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE1BQU0sQ0FBSSxRQUFRLFNBQUksSUFBSSxJQUFHLElBQUksS0FBSyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsSUFBRyxJQUFJLENBQUMsSUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbEYsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFtQixDQUFDLENBQUMsQ0FBQztvQkFDeEUsSUFBSSxPQUFLLEdBQUcsS0FBRyxJQUFJLElBQUcsSUFBSSxLQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxLQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFFLENBQUM7b0JBQ3ZGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsTUFBTSxDQUFDLFFBQVEsQ0FBSSxRQUFRLFNBQUksT0FBTyxDQUFDLENBQUM7b0JBQzVDLENBQUM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzVELEtBQUssQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLENBQUM7d0JBQ2pDLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBSyxDQUFDO3dCQUNuQixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7b0JBQ2hELENBQUM7b0JBQ0QsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQzt3QkFDbkIsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO3dCQUNuQixJQUFJLENBQUMsT0FBSyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFDeEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckUsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9DLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLG1CQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVNLGtCQUFJLEdBQVg7UUFBQSxpQkFtREM7UUFsREcsSUFBTSxJQUFJLEdBQUcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSwyRkFBNkUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV4SSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVwRSwyQ0FBMkM7UUFDM0MsYUFBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVyQyxJQUFNLEtBQUssR0FBRyxVQUFBLElBQUk7WUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFtQixDQUFDLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBa0IsSUFBSSxDQUFDLElBQUksSUFBRyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxnQkFBWSxDQUFDLENBQUM7Z0JBQ25GLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBWSxJQUFJLENBQUMsSUFBSSxJQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLGdCQUFZLENBQUMsQ0FBQztnQkFDekYsSUFBTSxhQUFhLEdBQUcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLGNBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxjQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEcsS0FBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQztnQkFDMUQsYUFBYTtnQkFDYixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxRSxDQUFDO2dCQUVELGNBQWM7Z0JBQ2QsSUFBTSxLQUFLLEdBQUc7b0JBQ1YsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsU0FBUyxFQUFFLHNCQUFVLEVBQUU7b0JBQ3ZCLEVBQUUsRUFBRSxjQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQzNCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUM7aUJBQ3RCLENBQUM7Z0JBQ0YsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsQ0FBQztZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFSLENBQVEsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQTtRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVaLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyRCxzREFBc0Q7UUFFdEQsR0FBRyxDQUFDLENBQW9CLFVBQUssRUFBTCx1QkFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSyxDQUFDO1lBQXpCLG9CQUFlLEVBQVYsWUFBSSxFQUFDLFlBQUk7WUFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLElBQUksQ0FBQztvQkFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBUyxJQUFJLFVBQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDekUsQ0FBRTtnQkFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUViLENBQUM7WUFDTCxDQUFDO1NBQ0o7SUFDTCxDQUFDO0lBRU0sOEJBQWdCLEdBQXZCLFVBQXdCLFVBQVUsRUFBRSxFQUFFO1FBQ2xDLGNBQWMsVUFBVTtZQUNwQixjQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFBLFNBQVM7Z0JBQ3hCLGNBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxVQUFBLE9BQU87b0JBQzlCLDJDQUEyQztvQkFDM0MsSUFBTSxJQUFJLEdBQUcsYUFBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakMsSUFBTSxDQUFDLEdBQUcsY0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsR0FBRyxFQUFyQixDQUFxQixDQUFDLENBQUM7b0JBQ3hELEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUMxQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzdCLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVNLHlCQUFXLEdBQWxCLFVBQW1CLElBQUksRUFBRSxHQUFHO1FBQTVCLGlCQUlDO1FBSEcsSUFBTSxFQUFFLEdBQUcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLGNBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQXpDLENBQXlDLENBQUMsQ0FBQztRQUNoRSxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLHdCQUFVLEdBQWpCLFVBQWtCLElBQUksRUFBRSxFQUFFO1FBQ3RCLElBQU0sRUFBRSxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxjQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFDLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFBLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRU0sdUJBQVMsR0FBaEIsVUFBaUIsSUFBSSxFQUFFLEdBQUc7UUFDdEIsTUFBTSxDQUFDLGNBQUMsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxzQkFBUSxHQUFmLFVBQWdCLElBQUksRUFBRSxFQUFFO1FBQ3BCLE1BQU0sQ0FBQyxjQUFDLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFBLEVBQUUsRUFBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVNLHlCQUFXLEdBQWxCLFVBQW1CLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTztRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1QsR0FBRyxFQUFLLElBQUksQ0FBQyxRQUFRLG1CQUFjLElBQU07WUFDekMsT0FBTyxFQUFFLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDO1lBQzdDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLG1CQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUNyQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztZQUNBLG9FQUFNLENBQStDO1lBQzVELElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDbEIsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUFDLEVBQUUsQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLGNBQUMsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRU0sMEJBQVksR0FBbkIsVUFBb0IsSUFBSSxFQUFFLEVBQUU7UUFBNUIsaUJBTUM7UUFMRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFLLElBQUksQ0FBQyxRQUFRLGdCQUFXLElBQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxHQUFHO1lBQzFFLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFBQyxFQUFFLEVBQUUsQ0FBQztZQUNiLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBUyxJQUFJLFVBQU8sRUFBRSxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLDJCQUFhLEdBQXBCLFVBQXFCLElBQUksRUFBRSxLQUFLO1FBQzVCLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDVCxHQUFHLEVBQUssSUFBSSxDQUFDLFFBQVEsZ0JBQVcsSUFBSSxTQUFJLEtBQUssQ0FBQyxHQUFLO1lBQ25ELE9BQU8sRUFBRSxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQztZQUM3QyxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7U0FDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUc7WUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQXBMTDtRQUFDLGlCQUFVLEVBQUU7O1dBQUE7SUFxTGIsVUFBQztBQUFELENBQUMsQUFwTEQsSUFvTEM7QUFwTFksV0FBRyxNQW9MZixDQUFBO0FBR0Q7SUFBQTtRQUNXLFNBQUksR0FHUCxFQUFFLENBQUM7SUFDWCxDQUFDO0lBTkQ7UUFBQyxpQkFBVSxFQUFFOzt3QkFBQTtJQU1iLHVCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMWSx3QkFBZ0IsbUJBSzVCLENBQUE7QUFHRDtJQUFBO1FBQ1csU0FBSSxHQUNQLEVBQUUsQ0FBQztJQUNYLENBQUM7SUFKRDtRQUFDLGlCQUFVLEVBQUU7O3VCQUFBO0lBSWIsc0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLHVCQUFlLGtCQUczQixDQUFBO0FBRUQsY0FBYyxJQUFJLEVBQUUsSUFBSTtJQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNoQixHQUFHLEVBQUUsV0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJO1FBQ3hCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsT0FBTyxFQUFFLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDO1FBQzdDLE9BQU8sRUFBRSxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7S0FDbEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLFFBQVE7UUFDdEIsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFFRCw2QkFBb0MsS0FBSyxFQUFFLElBQUk7SUFDM0MsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDZCxjQUFDLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFBO0lBRW5FLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLGNBQUMsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxVQUFDLEVBQUUsRUFBRSxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFSZSwyQkFBbUIsc0JBUWxDLENBQUE7QUFFRCxzQ0FBNkMsS0FBSyxFQUFFLElBQUk7SUFDcEQsMkNBQTJDO0lBQzNDLElBQU0sT0FBTyxHQUFHLGNBQUMsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBQyxPQUFPLEVBQUUsR0FBRyxJQUFLLE9BQUEsR0FBRyxLQUFLLElBQUksRUFBWixDQUFZLENBQUMsQ0FBQztJQUM1RSxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNkLGNBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUE7SUFFL0QsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDcEIsY0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQUMsRUFBRSxFQUFFLENBQUM7UUFDM0IsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQztBQVZlLG9DQUE0QiwrQkFVM0MsQ0FBQSJ9