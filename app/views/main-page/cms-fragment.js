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
var global_lib_1 = require("../../global.lib");
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
            var layout = global_lib_1._.find(this.Layout.list, function (layout) { return layout.ID === _this.cmsFragment; });
            //noinspection TypeScriptUnresolvedVariable
            var _a = this.save ? global_lib_1._.find(layout.SAVE, function (save) { return save.name === _this.save; }) : layout.SAVE[0], containers = _a.containers, bind = _a.bind, BindType = _a.BindType;
            this.BindType = BindType;
            this.bind = bind;
            this.containers = global_lib_1._.cloneDeep(containers);
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
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CmsFragment.prototype, "model", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CmsFragment.prototype, "cmsFragment", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CmsFragment.prototype, "save", void 0);
    CmsFragment = __decorate([
        core_1.Component({
            selector: '[cmsFragment]',
            template: ""
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; }))), 
        __metadata('design:paramtypes', [cms_1.Cms, core_1.ViewContainerRef, core_1.ComponentResolver])
    ], CmsFragment);
    return CmsFragment;
}());
exports.CmsFragment = CmsFragment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLWZyYWdtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY21zLWZyYWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFLTyxlQUFlLENBQUMsQ0FBQTtBQUN2QixvQkFBa0Qsc0JBQXNCLENBQUMsQ0FBQTtBQUN6RSwyQkFBZ0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNuQyw0QkFBeUIsZUFBZSxDQUFDLENBQUE7QUFPekM7SUFTSSxxQkFBbUQsR0FBTyxFQUFVLGFBQThCLEVBQzlFLFFBQTBCO1FBREssUUFBRyxHQUFILEdBQUcsQ0FBSTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFpQjtRQUM5RSxhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUM5QyxDQUFDO0lBRUQsOEJBQVEsR0FBUjtRQUFBLGlCQW9CQztRQW5CRyxJQUFJLENBQUM7WUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLFdBQUssQ0FBQyxrQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLElBQU0sTUFBTSxHQUFHLGNBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsRUFBRSxLQUFLLEtBQUksQ0FBQyxXQUFXLEVBQTlCLENBQThCLENBQUMsQ0FBQztZQUNsRiwyQ0FBMkM7WUFDM0MsSUFBQSx3SEFBb0gsRUFBL0csMEJBQVUsRUFBRSxjQUFJLEVBQUUsc0JBQVEsQ0FBc0Y7WUFDckgsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFDLDJDQUEyQztZQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9FLElBQU0sU0FBTyxHQUFHLEVBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLGtCQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDLENBQUM7WUFDMUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBNkI7Z0JBQzFFLElBQUksR0FBRyxHQUE0QixLQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0UsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsU0FBTyxDQUFDO2dCQUMvQixHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBRTtRQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLENBQUM7SUFDTCxDQUFDO0lBaENEO1FBQUMsWUFBSyxFQUFFOzs4Q0FBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOztvREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOzs2Q0FBQTtJQVBaO1FBQUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFFBQVEsRUFBRSxFQUFFO1NBQ2YsQ0FBQzttQkFVZSxhQUFNLENBQUMsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsU0FBRyxFQUFILENBQUcsQ0FBQyxDQUFDOzttQkFWNUM7SUFvQ0Ysa0JBQUM7QUFBRCxDQUFDLEFBbkNELElBbUNDO0FBbkNZLG1CQUFXLGNBbUN2QixDQUFBIn0=