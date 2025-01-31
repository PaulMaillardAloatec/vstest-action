import * as core from '@actions/core';
import * as path from 'path';

export function getVsTestPath(): string {
  let vstestLocationMethod = core.getInput('vstestLocationMethod')
  if(vstestLocationMethod && vstestLocationMethod.toUpperCase() === "LOCATION") {
    return core.getInput('vstestLocation')
  }

  return path.join(__dirname, 'TestPlatform/vstest.console.exe')
}
