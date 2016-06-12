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
var router_deprecated_1 = require("@angular/router-deprecated");
var router_1 = require("nativescript-angular/router");
var cms_container_1 = require("./cms-container");
var cms_1 = require("../../shared/cms/cms");
var cms_sync_1 = require("./cms-sync");
var _a = require('file-system'), File = _a.File, knownFolders = _a.knownFolders, path = _a.path;
function createPage() {
    var MainPage = (function () {
        function MainPage(routeData, cms, containerService) {
            this.routeData = routeData;
            this.cms = cms;
            this.containerService = containerService;
            console.log('create page');
            var path = routeData.get('path');
            containerService.data.containers = this.cms.data.containerPage[path];
            this.cms.services[path] = this.containerService;
        }
        MainPage = __decorate([
            core_1.Component({
                selector: "main-page",
                template: "\n        <GridLayout rows=\"auto, *\">\n            <StackLayout row=\"0\" cmsSync *ngIf=\"!cms.alreadyLoaded\"></StackLayout>\n            <GridLayout row=\"1\">\n                <template row=\"1\" ngFor let-container [ngForOf]=\"containerService.data.containers\">\n                    <template [cmsContainer]=\"container.name\" ></template>\n                </template>\n            </GridLayout>\n        </GridLayout >\n        ",
                directives: [cms_container_1.CmsContainer, router_1.NS_ROUTER_DIRECTIVES, cms_sync_1.cmsSync],
                providers: [core_1.forwardRef(function () { return cms_1.ContainerService; })]
            }),
            __param(1, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; }))),
            __param(2, core_1.Inject(core_1.forwardRef(function () { return cms_1.ContainerService; }))), 
            __metadata('design:paramtypes', [router_deprecated_1.RouteData, cms_1.Cms, cms_1.ContainerService])
        ], MainPage);
        return MainPage;
    }());
    return MainPage;
}
exports.createPage = createPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFBNEMsZUFBZSxDQUFDLENBQUE7QUFDNUQsa0NBQXdCLDRCQUE0QixDQUFDLENBQUE7QUFDckQsdUJBQW1DLDZCQUE2QixDQUFDLENBQUE7QUFFakUsOEJBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0Msb0JBQW9DLHNCQUFzQixDQUFDLENBQUE7QUFDM0QseUJBQXNCLFlBQVksQ0FBQyxDQUFBO0FBRW5DLElBQUEsMkJBQXlELEVBQWxELGNBQUksRUFBRSw4QkFBWSxFQUFFLGNBQUksQ0FBMkI7QUFFMUQ7SUFnQkk7UUFDSSxrQkFBb0IsU0FBbUIsRUFDWSxHQUFPLEVBQ00sZ0JBQWlDO1lBRjdFLGNBQVMsR0FBVCxTQUFTLENBQVU7WUFDWSxRQUFHLEdBQUgsR0FBRyxDQUFJO1lBQ00scUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQjtZQUM3RixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNCLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ3BELENBQUM7UUF2Qkw7WUFBQyxnQkFBUyxDQUFDO2dCQUNQLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixRQUFRLEVBQUUsc2JBU1Q7Z0JBQ0QsVUFBVSxFQUFFLENBQUMsNEJBQVksRUFBRSw2QkFBb0IsRUFBRSxrQkFBTyxDQUFDO2dCQUN6RCxTQUFTLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLGNBQU0sT0FBQSxzQkFBZ0IsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO2FBQ2xELENBQUM7dUJBR2UsYUFBTSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLFNBQUcsRUFBSCxDQUFHLENBQUMsQ0FBQzt1QkFDN0IsYUFBTSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFnQixFQUFoQixDQUFnQixDQUFDLENBQUM7O29CQUp6RDtRQVVGLGVBQUM7SUFBRCxDQUFDLEFBVEQsSUFTQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsQ0FBQztBQTVCZSxrQkFBVSxhQTRCekIsQ0FBQSJ9