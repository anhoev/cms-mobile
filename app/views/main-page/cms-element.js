"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var cms_1 = require("../../shared/cms/cms");
var cms_container_1 = require("./cms-container");
var cms_wrapper_1 = require("./cms-wrapper");
var router_1 = require("nativescript-angular/router");
var cms_fragment_1 = require("./cms-fragment");
var lang_1 = require("@angular/core/src/facade/lang");
var http = require("http");
var _ = require('lodash');
function toComponent(template, element, directives) {
    if (directives === void 0) { directives = []; }
    var containers = element.containers, type = element.type, binding = element.binding, ref = element.ref;
    var model = _.find(cms_1.Types[element.type].list, { _id: ref });
    directives.push(common_1.NgStyle, cms_container_1.CmsContainer, cms_wrapper_1.CmsWrapper, router_1.NS_ROUTER_DIRECTIVES, cms_fragment_1.CmsFragment, CmsElement);
    var DynamicComponent = (function () {
        function DynamicComponent(containerService, differs) {
            var _this = this;
            this.containerService = containerService;
            this.differs = differs;
            this.watches = [];
            this.containerService.data = { containers: containers };
            if (binding) {
                this.model = _.cloneDeep(model);
                if (binding.binds) {
                    this.parentModel = binding.parentModel;
                    this.differ = this.differs.find(this.parentModel).create(null);
                    var _loop_1 = function(bind) {
                        if (bind.choice === 'model') {
                            var _a = bind.model, parentKey_1 = _a.parentKey, key_1 = _a.key;
                            this_1.model[key_1] = this_1.parentModel[parentKey_1];
                            this_1.watches.push(function (record) {
                                if (record.key === parentKey_1)
                                    _this.model[key_1] = _this.parentModel[parentKey_1];
                            });
                        }
                        else if (bind.choice === 'scope') {
                            var key = bind.scope.key;
                            this_1.model[key] = model[key].bind(this_1.parentModel);
                        }
                    };
                    var this_1 = this;
                    for (var _i = 0, _b = binding.binds; _i < _b.length; _i++) {
                        var bind = _b[_i];
                        _loop_1(bind);
                    }
                }
            }
            else {
                this.model = model;
            }
            cms_1.injectFnAndServerFn(this, type);
        }
        DynamicComponent.prototype.ngDoCheck = function () {
            var _this = this;
            if (lang_1.isPresent(this.differ)) {
                var changes = this.differ.diff(this.parentModel);
                if (lang_1.isPresent(changes)) {
                    changes.forEachChangedItem(function (record) { return _this.watches.forEach(function (watch) { return watch(record); }); });
                }
            }
        };
        DynamicComponent = __decorate([
            core_1.Component({
                selector: '[dynamic-component]',
                template: template,
                directives: directives,
                providers: [cms_1.ContainerService]
            })
        ], DynamicComponent);
        return DynamicComponent;
    }());
    return DynamicComponent;
}
function toArrayComponent(template, items, prepareElement, directives) {
    if (directives === void 0) { directives = []; }
    var PrepareElement = (function () {
        function PrepareElement() {
        }
        PrepareElement.prototype.transform = function (item) {
            return prepareElement(item);
        };
        PrepareElement = __decorate([
            core_1.Pipe({ name: 'prepareElement' })
        ], PrepareElement);
        return PrepareElement;
    }());
    directives.push(common_1.NgStyle, CmsElement);
    var DynamicComponent = (function () {
        function DynamicComponent() {
            this.items = items;
        }
        DynamicComponent = __decorate([
            core_1.Component({
                selector: '[dynamic-component]',
                template: template,
                directives: directives,
                pipes: [PrepareElement]
            })
        ], DynamicComponent);
        return DynamicComponent;
    }());
    return DynamicComponent;
}
var CmsElement = (function () {
    function CmsElement(cms, viewContainer, resolver) {
        this.cms = cms;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
        this.oneTime = false;
    }
    CmsElement.prototype.ngOnInit = function () {
        if (this.element && !this.oneTime) {
            this.ref = this.element.ref;
            this.oneTime = true;
            this.render();
        }
    };
    CmsElement.prototype.render = function () {
        var _this = this;
        try {
            if (this.element.type && _.find(cms_1.Types[this.element.type].list, { _id: this.element.ref })) {
                console.log('element :' + this.element.type);
                var template = cms_1.Types[this.element.type].template;
                var isList = false;
                var binding_1 = this.element.binding;
                if (binding_1 && binding_1.binds) {
                    var _loop_2 = function(bind) {
                        //noinspection TypeScriptUnresolvedVariable
                        if (bind.choice === 'array') {
                            isList = true;
                            var parentKey = bind.array.parentKey;
                            var prepareElement = function (item) {
                                var containers = _.clone(_this.element.containers);
                                //noinspection TypeScriptUnresolvedFunction
                                cms_1.Types[cms_1.StandardType.Layout].fn.getTreeWithBinding(containers, bind.array.bind, item, binding_1.BindType);
                                return { type: _this.element.type, ref: _this.element.ref, containers: containers, binding: {} };
                            };
                            template = "<StackLayout *ngFor=\"let item of items\" cmsElement [element]=\"item | prepareElement\"></StackLayout>";
                            if (binding_1.parentModel[parentKey])
                                this_2.resolver.resolveComponent(toArrayComponent(template, binding_1.parentModel[parentKey], prepareElement)).then(function (factory) {
                                    _this.compRef = _this.viewContainer.createComponent(factory);
                                });
                        }
                    };
                    var this_2 = this;
                    for (var _i = 0, _a = binding_1.binds; _i < _a.length; _i++) {
                        var bind = _a[_i];
                        _loop_2(bind);
                    }
                }
                if (!isList)
                    this.resolver.resolveComponent(toComponent(template, this.element)).then(function (factory) {
                        _this.compRef = _this.viewContainer.createComponent(factory);
                    });
            }
        }
        catch (e) {
            console.warn(e);
        }
    };
    CmsElement.prototype.ngDoCheck = function () {
        if (this.element && this.ref !== this.element.ref) {
            this.ref = this.element.ref;
            if (this.compRef)
                this.compRef.dispose();
            this.render();
        }
    };
    __decorate([
        core_1.Input()
    ], CmsElement.prototype, "element");
    CmsElement = __decorate([
        core_1.Component({
            selector: '[cmsElement]',
            template: ""
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; })))
    ], CmsElement);
    return CmsElement;
}());
exports.CmsElement = CmsElement;
