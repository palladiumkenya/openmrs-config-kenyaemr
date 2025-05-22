import { Axis } from './axis';
import { ChartModel } from '../../model/model';
export declare class HoverAxis extends Axis {
    constructor(model: ChartModel, services: any, configs?: any);
    render(animate?: boolean): void;
    addEventListeners(): void;
    private goNext;
    private goPrevious;
    destroy(): void;
}
