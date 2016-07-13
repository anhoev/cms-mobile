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
var router_1 = require("nativescript-angular/router");
var cms_container_1 = require("./cms-container");
var cms_1 = require("../../shared/cms/cms");
var cms_sync_1 = require("./cms-sync");
var MainPage = (function () {
    function MainPage(cms, containerService) {
        this.cms = cms;
        this.containerService = containerService;
        console.log('create page');
        containerService.data.containers = this.cms.data.containerPage[this.path];
        console.log(JSON.stringify(containerService.data.containers));
        this.cms.services[this.path] = this.containerService;
    }
    MainPage = __decorate([
        core_1.Component({
            selector: "main-page",
            template: "\n        <GridLayout rows=\"auto, *\">\n            <StackLayout row=\"0\" cmsSync *ngIf=\"!cms.alreadyLoaded\"></StackLayout>\n            <GridLayout row=\"1\">\n                <template row=\"1\" ngFor let-container [ngForOf]=\"containerService.data.containers\">\n                    <template [cmsContainer]=\"container.name\" ></template>\n                </template>\n            </GridLayout>\n        </GridLayout >\n        ",
            directives: [cms_container_1.CmsContainer, router_1.NS_ROUTER_DIRECTIVES, cms_sync_1.cmsSync],
            providers: [core_1.forwardRef(function () { return cms_1.ContainerService; })]
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; }))),
        __param(1, core_1.Inject(core_1.forwardRef(function () { return cms_1.ContainerService; }))), 
        __metadata('design:paramtypes', [cms_1.Cms, cms_1.ContainerService])
    ], MainPage);
    return MainPage;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFBNEMsZUFBZSxDQUFDLENBQUE7QUFDNUQsdUJBQW1DLDZCQUE2QixDQUFDLENBQUE7QUFDakUsOEJBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0Msb0JBQW9DLHNCQUFzQixDQUFDLENBQUE7QUFDM0QseUJBQXNCLFlBQVksQ0FBQyxDQUFBO0FBaUJuQztJQUdJLGtCQUFtRCxHQUFPLEVBQ00sZ0JBQWlDO1FBRDlDLFFBQUcsR0FBSCxHQUFHLENBQUk7UUFDTSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWlCO1FBQzdGLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ3pELENBQUM7SUF4Qkw7UUFBQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFdBQVc7WUFDckIsUUFBUSxFQUFFLHNiQVNMO1lBQ0wsVUFBVSxFQUFFLENBQUMsNEJBQVksRUFBRSw2QkFBb0IsRUFBRSxrQkFBTyxDQUFDO1lBQ3pELFNBQVMsRUFBRSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFnQixFQUFoQixDQUFnQixDQUFDLENBQUM7U0FDbEQsQ0FBQzttQkFJZSxhQUFNLENBQUMsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsU0FBRyxFQUFILENBQUcsQ0FBQyxDQUFDO21CQUM3QixhQUFNLENBQUMsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQWdCLEVBQWhCLENBQWdCLENBQUMsQ0FBQzs7Z0JBTHpEO0lBV0YsZUFBQztBQUFELENBQUMsQUFWRCxJQVVDIn0=