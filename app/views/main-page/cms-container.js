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
var cms_1 = require("../../shared/cms/cms");
var cms_element_1 = require("./cms-element");
var CmsContainer = (function () {
    function CmsContainer(containerService, viewContainer, resolver) {
        this.containerService = containerService;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    CmsContainer.prototype.ngOnInit = function () {
        var _this = this;
        if (this.containerService) {
            console.log("container : " + this.name);
            var container = this.containerService.data.containers[this.name];
            if (container) {
                console.log("container exists: " + JSON.stringify(container));
                var _loop_1 = function(element) {
                    console.log("container-element: " + JSON.stringify(element));
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
        core_1.Input('cmsContainer'), 
        __metadata('design:type', String)
    ], CmsContainer.prototype, "name", void 0);
    CmsContainer = __decorate([
        core_1.Directive({
            selector: "[cmsContainer]"
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.ContainerService; }))), 
        __metadata('design:paramtypes', [cms_1.ContainerService, core_1.ViewContainerRef, core_1.ComponentResolver])
    ], CmsContainer);
    return CmsContainer;
}());
exports.CmsContainer = CmsContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNtcy1jb250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLG9CQUErQixzQkFBc0IsQ0FBQyxDQUFBO0FBQ3RELDRCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUt6QztJQUdJLHNCQUFnRSxnQkFBaUMsRUFDN0UsYUFBOEIsRUFDOUIsUUFBMEI7UUFGa0IscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQjtRQUM3RSxrQkFBYSxHQUFiLGFBQWEsQ0FBaUI7UUFDOUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7SUFDOUMsQ0FBQztJQUVELCtCQUFRLEdBQVI7UUFBQSxpQkFnQkM7UUFmRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWUsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFHLENBQUMsQ0FBQztnQkFDOUQ7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBc0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUcsQ0FBQyxDQUFDO29CQUM3RCxNQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLHdCQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUE2Qjt3QkFDMUUsSUFBSSxHQUFHLEdBQTRCLEtBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUMvRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7d0JBQy9CLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQzVCLENBQUMsQ0FBQyxDQUFDOzs7Z0JBTlAsR0FBRyxDQUFDLENBQWtCLFVBQWtCLEVBQWxCLEtBQUEsU0FBUyxDQUFDLFFBQVEsRUFBbEIsY0FBa0IsRUFBbEIsSUFBa0IsQ0FBQztvQkFBcEMsSUFBTSxPQUFPLFNBQUE7O2lCQU9qQjtZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQXZCRDtRQUFDLFlBQUssQ0FBQyxjQUFjLENBQUM7OzhDQUFBO0lBSjFCO1FBQUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxnQkFBZ0I7U0FDN0IsQ0FBQzttQkFJZSxhQUFNLENBQUMsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQWdCLEVBQWhCLENBQWdCLENBQUMsQ0FBQzs7b0JBSnpEO0lBMEJGLG1CQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQztBQXpCWSxvQkFBWSxlQXlCeEIsQ0FBQSJ9