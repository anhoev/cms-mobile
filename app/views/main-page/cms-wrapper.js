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
var router_1 = require("nativescript-angular/router");
var cms_fragment_1 = require("./cms-fragment");
var main_1 = require("../../global.lib");
var cms_element_1 = require("./cms-element");
var http = require("http");
function toComponent(template, name, containers, directives) {
    if (containers === void 0) { containers = []; }
    if (directives === void 0) { directives = []; }
    directives.push(common_1.NgStyle, cms_container_1.CmsContainer, router_1.NS_ROUTER_DIRECTIVES, cms_fragment_1.CmsFragment, cms_element_1.CmsElement);
    var DynamicComponent = (function () {
        function DynamicComponent(containerService, router) {
            this.containerService = containerService;
            this.router = router;
            this.model = {};
            this.element = { element: { model: { _id: null } } };
            this.containerService.data = { containers: containers };
            this.model.router = router;
            if (name)
                cms_1.injectFnAndServerFnByWrapper(this, name);
        }
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
var CmsWrapper = (function () {
    function CmsWrapper(cms, viewContainer, resolver) {
        this.cms = cms;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    CmsWrapper.prototype.ngOnInit = function () {
        var _this = this;
        try {
            var Type = cms_1.Types['Wrapper'];
            var wrapper = main_1._.find(Type.store, function (wrapper, name) { return name === _this.name; });
            if (wrapper) {
                this.resolver.resolveComponent(toComponent(wrapper.template, this.name)).then(function (factory) {
                    _this.viewContainer.createComponent(factory);
                });
            }
            else {
                var _a = this.element, list_1 = _a.list, element = _a.element, Fn_1 = _a.Fn;
                if (!Type.store[this.name] && !list_1['null']) {
                    if (list_1.layout) {
                        var template = "<StackLayout *ngFor=\"#element of result\" [cmsFragment]=\"layout.ID\" [model]=\"element\"></StackLayout>";
                        this.resolver.resolveComponent(toComponent(template)).then(function (factory) {
                            var ref = _this.viewContainer.createComponent(factory);
                            ref.instance.result = list_1.query.bind(_this.element)() || cms_1.Types[list_1.BindType].list;
                            ref.instance.layout = list_1.layout;
                            if (Fn_1 && Fn_1())
                                ref.instance.element.fn = main_1._.mapValues(Fn_1(), function (f) { return f.bind(_this.element); });
                        });
                    }
                    else {
                        var template = "<StackLayout *ngFor=\"#element of result\" cmsElement [element]=\"{type:type,ref:element._id}\" ></StackLayout>";
                        this.resolver.resolveComponent(toComponent(template)).then(function (factory) {
                            var ref = _this.viewContainer.createComponent(factory);
                            ref.instance.result = list_1.query.bind(_this.element)() || cms_1.Types[list_1.BindType].list;
                            ref.instance.type = list_1.BindType;
                            if (Fn_1 && Fn_1())
                                ref.instance.element.fn = main_1._.mapValues(Fn_1(), function (f) { return f.bind(_this.element); });
                        });
                    }
                }
                else {
                    var BindType_1 = element.BindType, layout = element.layout, model = element.model;
                    var template = "<StackLayout cmsElement [element]=\"{type:type,ref:element.element.model._id}\"></StackLayout>";
                    this.resolver.resolveComponent(toComponent(template)).then(function (factory) {
                        var ref = _this.viewContainer.createComponent(factory);
                        ref.instance.element = _this.element;
                        ref.instance.type = BindType_1;
                        if (Fn_1 && Fn_1())
                            ref.instance.element.fn = main_1._.mapValues(Fn_1(), function (f) { return f.bind(_this.element); });
                    });
                }
            }
        }
        catch (e) {
            console.warn(e);
        }
    };
    __decorate([
        core_1.Input()
    ], CmsWrapper.prototype, "name");
    __decorate([
        core_1.Input()
    ], CmsWrapper.prototype, "element");
    CmsWrapper = __decorate([
        core_1.Component({
            selector: "[cms-wrapper]",
            template: ""
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; })))
    ], CmsWrapper);
    return CmsWrapper;
}());
exports.CmsWrapper = CmsWrapper;
