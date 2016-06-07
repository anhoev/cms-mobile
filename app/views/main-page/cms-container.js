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
var cms_1 = require("../../shared/cms/cms");
var cms_element_1 = require("./cms-element");
var main_1 = require("../../global.lib");
var CmsContainer = (function () {
    function CmsContainer(containerService, viewContainer, resolver) {
        this.containerService = containerService;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    CmsContainer.prototype.ngOnInit = function () {
        var _this = this;
        if (this.containerService) {
            var container = main_1._.find(this.containerService.data.containers, function (c) { return c.name === _this.name; });
            if (container) {
                var _loop_1 = function(element) {
                    this_1.resolver.resolveComponent(cms_element_1.CmsElement).then(function (factory) {
                        var ref = _this.viewContainer.createComponent(factory);
                        ref.instance.element = element;
                        ref.instance.ngOnInit();
                    });
                };
                var this_1 = this;
                for (var _i = 0, _a = container.elements; _i < _a.length; _i++) {
                    var element = _a[_i];
                    _loop_1(element);
                }
            }
        }
    };
    __decorate([
        core_1.Input('cmsContainer')
    ], CmsContainer.prototype, "name");
    CmsContainer = __decorate([
        core_1.Directive({
            selector: "[cmsContainer]"
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.ContainerService; })))
    ], CmsContainer);
    return CmsContainer;
}());
exports.CmsContainer = CmsContainer;
