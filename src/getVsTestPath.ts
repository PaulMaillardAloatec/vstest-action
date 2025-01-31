import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';
import {findFilesToUpload} from './search';
import {getInputs} from './input-helper';
import {NoFileOptions} from './constants';

export function getVsTestPath(): string {
  let vstestLocationMethod = core.getInput('vstestLocationMethod')
  if(vstestLocationMethod && vstestLocationMethod.toUpperCase() === "LOCATION") {
    return core.getInput('vstestLocation')
  }

  return path.join(__dirname, 'TestPlatform/vstest.console.exe')
}
