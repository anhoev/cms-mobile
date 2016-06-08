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
var global_lib_1 = require("../../global.lib");
var CmsContainer = (function () {
    function CmsContainer(containerService, viewContainer, resolver) {
        this.containerService = containerService;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
    }
    CmsContainer.prototype.ngOnInit = function () {
        var _this = this;
        if (this.containerService) {
            var container = global_lib_1._.find(this.containerService.data.containers, function (c) { return c.name === _this.name; });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNtcy1jb250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLG9CQUErQixzQkFBc0IsQ0FBQyxDQUFBO0FBQ3RELDRCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUN6QywyQkFBZ0Isa0JBQWtCLENBQUMsQ0FBQTtBQUtuQztJQUdJLHNCQUFnRSxnQkFBaUMsRUFDN0UsYUFBK0IsRUFDL0IsUUFBMEI7UUFGa0IscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQjtRQUM3RSxrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFDL0IsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7SUFDOUMsQ0FBQztJQUVELCtCQUFRLEdBQVI7UUFBQSxpQkFhQztRQVpHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBTSxTQUFTLEdBQUcsY0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSSxDQUFDLElBQUksRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO1lBQzNGLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1o7b0JBQ0ksTUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBNkI7d0JBQzFFLElBQUksR0FBRyxHQUE0QixLQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDL0UsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO3dCQUMvQixHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUM1QixDQUFDLENBQUMsQ0FBQzs7O2dCQUxQLEdBQUcsQ0FBQyxDQUFrQixVQUFrQixFQUFsQixLQUFBLFNBQVMsQ0FBQyxRQUFRLEVBQWxCLGNBQWtCLEVBQWxCLElBQWtCLENBQUM7b0JBQXBDLElBQU0sT0FBTyxTQUFBOztpQkFNakI7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFwQkQ7UUFBQyxZQUFLLENBQUMsY0FBYyxDQUFDOzs4Q0FBQTtJQUoxQjtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsZ0JBQWdCO1NBQzdCLENBQUM7bUJBSWUsYUFBTSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFnQixFQUFoQixDQUFnQixDQUFDLENBQUM7O29CQUp6RDtJQXVCRixtQkFBQztBQUFELENBQUMsQUF0QkQsSUFzQkM7QUF0Qlksb0JBQVksZUFzQnhCLENBQUEifQ==