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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var cms_1 = require("../../shared/cms/cms");
var cms_container_1 = require("./cms-container");
var router_1 = require("nativescript-angular/router");
var router_deprecated_1 = require("@angular/router-deprecated");
var cms_fragment_1 = require("./cms-fragment");
var global_lib_1 = require("../../global.lib");
var cms_element_1 = require("./cms-element");
var http = require("http");
function toComponent(template, name, containers, directives) {
    if (containers === void 0) { containers = []; }
    if (directives === void 0) { directives = []; }
    var Type = cms_1.Types['Wrapper'];
    var wrapper = Type.store[name];
    if (wrapper.directives)
        directives.push.apply(directives, wrapper.directives);
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
            }), 
            __metadata('design:paramtypes', [cms_1.ContainerService, (typeof (_a = typeof router_deprecated_1.Router !== 'undefined' && router_deprecated_1.Router) === 'function' && _a) || Object])
        ], DynamicComponent);
        return DynamicComponent;
        var _a;
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
            var wrapper = Type.store[this.name];
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
                                ref.instance.element.fn = global_lib_1._.mapValues(Fn_1(), function (f) { return f.bind(_this.element); });
                        });
                    }
                    else {
                        var template = "<StackLayout *ngFor=\"#element of result\" cmsElement [element]=\"{type:type,ref:element._id}\" ></StackLayout>";
                        this.resolver.resolveComponent(toComponent(template)).then(function (factory) {
                            var ref = _this.viewContainer.createComponent(factory);
                            ref.instance.result = list_1.query.bind(_this.element)() || cms_1.Types[list_1.BindType].list;
                            ref.instance.type = list_1.BindType;
                            if (Fn_1 && Fn_1())
                                ref.instance.element.fn = global_lib_1._.mapValues(Fn_1(), function (f) { return f.bind(_this.element); });
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
                            ref.instance.element.fn = global_lib_1._.mapValues(Fn_1(), function (f) { return f.bind(_this.element); });
                    });
                }
            }
        }
        catch (e) {
            console.warn(e);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CmsWrapper.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CmsWrapper.prototype, "element", void 0);
    CmsWrapper = __decorate([
        core_1.Component({
            selector: "[cms-wrapper]",
            template: ""
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; }))), 
        __metadata('design:paramtypes', [cms_1.Cms, core_1.ViewContainerRef, core_1.ComponentResolver])
    ], CmsWrapper);
    return CmsWrapper;
}());
exports.CmsWrapper = CmsWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLXdyYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbXMtd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBU08sZUFBZSxDQUFDLENBQUE7QUFDdkIsdUJBQXNCLGlCQUFpQixDQUFDLENBQUE7QUFDeEMsb0JBQXlFLHNCQUFzQixDQUFDLENBQUE7QUFDaEcsOEJBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0MsdUJBQW1DLDZCQUE2QixDQUFDLENBQUE7QUFDakUsa0NBQXFCLDRCQUE0QixDQUFDLENBQUE7QUFDbEQsNkJBQTBCLGdCQUFnQixDQUFDLENBQUE7QUFDM0MsMkJBQWdCLGtCQUFrQixDQUFDLENBQUE7QUFDbkMsNEJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU3QixxQkFBcUIsUUFBZSxFQUFFLElBQVcsRUFBRSxVQUFlLEVBQUUsVUFBZTtJQUFoQywwQkFBZSxHQUFmLGVBQWU7SUFBRSwwQkFBZSxHQUFmLGVBQWU7SUFDL0UsSUFBTSxJQUFJLEdBQUcsV0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQWYsVUFBVSxFQUFTLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvRCxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFPLEVBQUUsNEJBQVksRUFBRSw2QkFBb0IsRUFBRSwwQkFBVyxFQUFFLHdCQUFVLENBQUMsQ0FBQztJQU90RjtRQUlJLDBCQUFvQixnQkFBaUMsRUFBVSxNQUFhO1lBQXhELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBaUI7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFP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