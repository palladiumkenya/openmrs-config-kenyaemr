import { ChartModelCartesian } from './cartesian-charts';
/**
 * Bullet chart model layer
 */
export declare class BulletChartModel extends ChartModelCartesian {
    constructor(services: any);
    /**
     * Determines the index of the performance area titles to use
     * @param datum
     * @returns number
     */
    getMatchingRangeIndexForDatapoint(datum: any): any;
    getTabularDataArray(): any[];
}
