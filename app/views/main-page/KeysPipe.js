/**
 * Created by tran on 18/07/16.
 */
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
var core_1 = require("@angular/core");
var KeysPipe = (function () {
    function KeysPipe() {
    }
    KeysPipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        if (!value)
            return [];
        return Object.keys(value);
    };
    KeysPipe = __decorate([
        core_1.Pipe({ name: 'keys', pure: false }), 
        __metadata('design:paramtypes', [])
    ], KeysPipe);
    return KeysPipe;
}());
exports.KeysPipe = KeysPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5c1BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJLZXlzUGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRzs7Ozs7Ozs7Ozs7QUFFSCxxQkFBa0MsZUFBZSxDQUFDLENBQUE7QUFHbEQ7SUFBQTtJQUtBLENBQUM7SUFKRyw0QkFBUyxHQUFULFVBQVUsS0FBUyxFQUFFLElBQWlCO1FBQWpCLG9CQUFpQixHQUFqQixXQUFpQjtRQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUxMO1FBQUMsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUM7O2dCQUFBO0lBTWxDLGVBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxZLGdCQUFRLFdBS3BCLENBQUEifQ==