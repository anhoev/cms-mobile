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
            __metadata('design:paramtypes', [cms_1.ContainerService, router_deprecated_1.Router])
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