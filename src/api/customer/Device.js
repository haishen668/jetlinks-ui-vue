import * as customerDevice from '../customerDevice';
import * as instance from '../device/instance';

export * from '../customerDevice';
export * from '../device/instance';

export const query = customerDevice.query;
export const queryPosition = customerDevice.queryPosition;
export const getLocation = customerDevice.getLocation;
export const syncState = customerDevice.syncState;
export const deployAll = customerDevice.deployAll;
export const update = customerDevice.update;
export const add = customerDevice.add;
export const batchUpdate = customerDevice.batchUpdate;
export const count = customerDevice.count;
export const importDevice = customerDevice.importDevice;
export const templateDownload = customerDevice.templateDownload;
export const templateUrl = customerDevice.templateUrl;
export const exportDevice = customerDevice.exportDevice;
export const execute = customerDevice.execute;
export const executeFunctions = customerDevice.executeFunctions;

export const _delete = instance._delete;
export const _deploy = instance._deploy;
export const _undeploy = instance._undeploy;
export const _disconnect = instance._disconnect;
export const batchDeployDevice = instance.batchDeployDevice;
export const batchUndeployDevice = instance.batchUndeployDevice;
export const batchDeleteDevice = instance.batchDeleteDevice;
