import { Injectable } from '@angular/core';

declare var stepcounter: any;

@Injectable({
    providedIn: 'root'
})
export class StepCounterService {
    constructor() {}

    start(startingOffset: any) {
        return new Promise((resolve, reject) => {
            stepcounter.start(
                startingOffset,
              (                message: unknown) => {
                    resolve(message);
                },
                () => {
                    reject();
                }
            );
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            stepcounter.stop(
              (                message: unknown) => {
                    resolve(message);
                },
                () => {
                    reject();
                }
            );
        });
    }

    getTodayStepCount() {
        return new Promise((resolve, reject) => {
            stepcounter.getTodayStepCount(
              (                message: unknown) => {
                    resolve(message);
                },
                () => {
                    reject();
                }
            );
        });
    }

    getStepCount() {
        return new Promise((resolve, reject) => {
            stepcounter.getStepCount(
              (                message: unknown) => {
                    resolve(message);
                },
                () => {
                    reject();
                }
            );
        });
    }

    deviceCanCountSteps() {
        return new Promise((resolve, reject) => {
            stepcounter.deviceCanCountSteps(
              (                message: unknown) => {
                    resolve(message);
                },
                () => {
                    reject();
                }
            );
        });
    }

    getHistory() {
        return new Promise((resolve, reject) => {
            stepcounter.getHistory(
              (                message: unknown) => {
                    resolve(message);
                },
                () => {
                    reject();
                }
            );
        });
    }
}