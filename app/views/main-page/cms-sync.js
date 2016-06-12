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
var cms_1 = require("../../shared/cms/cms");
var core_1 = require("@angular/core");
/**
 * Created by tran on 12/06/16.
 */
var cmsSync = (function () {
    function cmsSync(cms) {
        this.cms = cms;
    }
    cmsSync = __decorate([
        core_1.Component({
            selector: "[cmsSync]",
            template: "\n        <GridLayout row=\"0\" columns=\"3*,2*\" rows=\"auto\">\n            <TextField [(ngModel)]=\"cms.basePath\" col=\"0\"></TextField>\n            <Button text=\"Sync\" (tap)=\"cms.sync()\" col=\"1\" style=\"color:red\"></Button>\n        </GridLayout>\n        ",
            directives: []
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return cms_1.Cms; }))), 
        __metadata('design:paramtypes', [cms_1.Cms])
    ], cmsSync);
    return cmsSync;
}());
exports.cmsSync = cmsSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21zLXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbXMtc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsb0JBQWtCLHNCQUFzQixDQUFDLENBQUE7QUFDekMscUJBQTRDLGVBQWUsQ0FBQyxDQUFBO0FBQzVEOztHQUVHO0FBYUg7SUFDSSxpQkFBbUQsR0FBTztRQUFQLFFBQUcsR0FBSCxHQUFHLENBQUk7SUFDMUQsQ0FBQztJQVpMO1FBQUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFFBQVEsRUFBRSwrUUFLTDtZQUNMLFVBQVUsRUFBRSxFQUFFO1NBQ2pCLENBQUM7bUJBRWUsYUFBTSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLFNBQUcsRUFBSCxDQUFHLENBQUMsQ0FBQzs7ZUFGNUM7SUFJRixjQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSxlQUFPLFVBR25CLENBQUEifQ==