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
    if (cms_1.Types[element.type].directives)
        directives.push.apply(directives, cms_1.Types[element.type].directives);
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
            }), 
            __metadata('design:paramtypes', [cms_1.ContainerService, core_1.KeyValueDiffers])
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
            core_1.Pipe({ name: 'prepareElement' }), 
            __metadata('design:paramtypes', [])
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
            }), 
            __metadata('design:paramtypes', [])
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
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CmsElement.prototype, "element", void 0);
    CmsElement = __decorate([
        core_1.Component({
            selector: '[cmsElement]',
            template: ""
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; }))), 
        __metadata('design:paramtypes', [cms_1.Cms, core_1.ViewContainerRef, core_1.ComponentResolver])
    ], CmsElement);
    return CmsElement;
}());
exports.CmsElement = CmsElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLWVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbXMtZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBYU8sZUFBZSxDQUFDLENBQUE7QUFDdkIsdUJBQXNCLGlCQUFpQixDQUFDLENBQUE7QUFDeEMsb0JBQThFLHNCQUFzQixDQUFDLENBQUE7QUFDckcsOEJBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0MsNEJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLHVCQUFtQyw2QkFBNkIsQ0FBQyxDQUFBO0FBQ2pFLDZCQUEwQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzNDLHFCQUF3QiwrQkFBK0IsQ0FBQyxDQUFBO0FBRXhELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFNUIscUJBQXFCLFFBQWUsRUFBRSxPQUFXLEVBQzVCLFVBQWU7SUFBZiwwQkFBZSxHQUFmLGVBQWU7SUFDekIsbUNBQVUsRUFBRSxtQkFBSSxFQUFFLHlCQUFPLEVBQUUsaUJBQUcsQ0FBYTtJQUNsRCxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDM0QsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBTyxFQUFFLDRCQUFZLEVBQUUsd0JBQVUsRUFBRSw2QkFBb0IsRUFBRSwwQkFBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2xHLEVBQUUsQ0FBQyxDQUFDLFdBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQUMsVUFBVSxDQUFDLElBQUksT0FBZixVQUFVLEVBQVMsV0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENB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