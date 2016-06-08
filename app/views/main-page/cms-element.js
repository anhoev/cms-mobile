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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLWVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbXMtZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBYU8sZUFBZSxDQUFDLENBQUE7QUFDdkIsdUJBQXNCLGlCQUFpQixDQUFDLENBQUE7QUFDeEMsb0JBQThFLHNCQUFzQixDQUFDLENBQUE7QUFDckcsOEJBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0MsNEJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLHVCQUFtQyw2QkFBNkIsQ0FBQyxDQUFBO0FBQ2pFLDZCQUEwQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzNDLHFCQUF3QiwrQkFBK0IsQ0FBQyxDQUFBO0FBRXhELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFNUIscUJBQXFCLFFBQWUsRUFBRSxPQUFXLEVBQzVCLFVBQWU7SUFBZiwwQkFBZSxHQUFmLGVBQWU7SUFDekIsbUNBQVUsRUFBRSxtQkFBSSxFQUFFLHlCQUFPLEVBQUUsaUJBQUcsQ0FBYTtJQUNsRCxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDM0QsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBTyxFQUFFLDRCQUFZLEVBQUUsd0JBQVUsRUFBRSw2QkFBb0IsRUFBRSwwQkFBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBT2xHO1FBa0JJLDBCQUFvQixnQkFBaUMsRUFDakMsT0FBdUI7WUFuQi9DLGlCQThDQztZQTVCdUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQjtZQUNqQyxZQUFPLEdBQVAsT0FBTyxDQUFnQjtZQVpuQyxZQUFPLEdBQUcs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