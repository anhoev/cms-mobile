import { Cms, ContainerService } from "../../shared/cms/cms";
import { ActivatedRoute } from "@angular/router";
export declare class MainPage {
    private cms;
    private containerService;
    private router;
    path: any;
    constructor(cms: Cms, containerService: ContainerService, router: ActivatedRoute);
}
