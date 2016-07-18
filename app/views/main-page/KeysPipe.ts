/**
 * Created by tran on 18/07/16.
 */

import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name: 'keys', pure: false})
export class KeysPipe implements PipeTransform {
    transform(value:any, args:any[] = null):any {
        if (!value) return [];
        return Object.keys(value);
    }
}