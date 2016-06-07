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
var main_1 = require("../../global.lib");
var cms_element_1 = require("./cms-element");
var CmsFragment = (function () {
    function CmsFragment(cms, viewContainer, resolver) {
        this.cms = cms;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    CmsFragment.prototype.ngOnInit = function () {
        var _this = this;
        try {
            this.Layout = cms_1.Types[cms_1.StandardType.Layout];
            var layout = main_1._.find(this.Layout.list, function (layout) { return layout.ID === _this.cmsFragment; });
            //noinspection TypeScriptUnresolvedVariable
            var _a = this.save ? main_1._.find(layout.SAVE, function (save) { return save.name === _this.save; }) : layout.SAVE[0], containers = _a.containers, bind = _a.bind, BindType = _a.BindType;
            this.BindType = BindType;
            this.bind = bind;
            this.containers = main_1._.cloneDeep(containers);
            //noinspection TypeScriptUnresolvedFunction
            this.Layout.fn.getTreeWithBinding(this.containers, bind, this.model, BindType);
            var element_1 = { ref: layout._id, type: cms_1.StandardType.Layout, containers: this.containers };
            this.resolver.resolveComponent(cms_element_1.CmsElement).then(function (factory) {
                var ref = _this.viewContainer.createComponent(factory);
                ref.instance.element = element_1;
                ref.instance.ngOnInit();
            });
        }
        catch (e) {
            console.warn(e);
        }
    };
    __decorate([
        core_1.Input()
    ], CmsFragment.prototype, "model");
    __decorate([
        core_1.Input()
    ], CmsFragment.prototype, "cmsFragment");
    __decorate([
        core_1.Input()
    ], CmsFragment.prototype, "save");
    CmsFragment = __decorate([
        core_1.Component({
            selector: '[cmsFragment]',
            template: ""
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; })))
    ], CmsFragment);
    return CmsFragment;
}());
exports.CmsFragment = CmsFragment;
