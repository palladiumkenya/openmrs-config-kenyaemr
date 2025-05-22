import { ChartModel } from './model';
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
export declare class WordCloudModel extends ChartModel {
    constructor(services: any);
    getTabularDataArray(): any[];
}
