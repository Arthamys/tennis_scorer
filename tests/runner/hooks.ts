import { Before, After } from '@cucumber/cucumber';
import { TennisWorld } from './world.js';

Before(function (this: TennisWorld) {
    this.match = null;
    this.lastState = null;
    this.lastStatistics = null;
    this.lastExport = null;
});

After(function (this: TennisWorld) {
    // Cleanup if needed
});
