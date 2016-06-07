import {
    Component, Input, forwardRef, Inject, ComponentResolver,
    ComponentFactory,
    ViewContainerRef,
    ComponentRef
} from "@angular/core";
import {Cms, Container, StandardType, Types} from "../../shared/cms/cms";
import {_} from "../../global.lib";
import {CmsElement} from "./cms-element";


@Component({
    selector: '[cmsFragment]',
    template: ``
})
export class CmsFragment {
    @Input() model:any
    @Input() cmsFragment:string
    @Input() save:string
    public containers:Container[]
    public Layout:any
    public bind:any
    private BindType:string;

    constructor(@Inject(forwardRef(() => Cms)) private cms:Cms, private viewContainer:ViewContainerRef,
                private resolver:ComponentResolver) {
    }

    ngOnInit() {
        try {
            this.Layout = Types[StandardType.Layout];
            const layout = _.find(this.Layout.list, layout => layout.ID === this.cmsFragment);
            //noinspection TypeScriptUnresolvedVariable
            let {containers, bind, BindType} = this.save ? _.find(layout.SAVE, save => save.name === this.save) : layout.SAVE[0];
            this.BindType = BindType;
            this.bind = bind;
            this.containers = _.cloneDeep(containers);
            //noinspection TypeScriptUnresolvedFunction
            this.Layout.fn.getTreeWithBinding(this.containers, bind, this.model, BindType);
            const element = {ref: layout._id, type: StandardType.Layout, containers: this.containers};
            this.resolver.resolveComponent(CmsElement).then((factory:ComponentFactory<any>) => {
                let ref:ComponentRef<CmsElement> = this.viewContainer.createComponent(factory);
                ref.instance.element = element;
                ref.instance.ngOnInit();
            });
        } catch (e) {
            console.warn(e);
        }
    }

}
