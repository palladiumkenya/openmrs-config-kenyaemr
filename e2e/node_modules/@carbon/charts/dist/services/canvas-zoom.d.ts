import { Service } from './service';
export declare class CanvasZoom extends Service {
    protected model: any;
    /**
     * focal:  object to zoom into
     * canvasElements: all the elements to translate and zoom on the chart area
     * zoomSettings: object containing duration, easing and zoomlevel for the zoom behaviours
     *  */
    zoomIn(focal: any, canvasElements: any, zoomSettings?: any): void;
    zoomOut(canvasElements: any, zoomSettings?: any): void;
}
