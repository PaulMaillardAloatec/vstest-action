import * as core from '@actions/core';
import { DefaultArtifactClient } from '@actions/artifact';
import { findFilesToUpload } from './search';
import { getInputs } from './input-helper';
import { NoFileOptions } from './constants';

export async function uploadArtifact() {
  try {
    const inputs = getInputs();
    const searchResult = await findFilesToUpload(inputs.searchPath);

    if (searchResult.filesToUpload.length === 0) {
      // Gestion des cas où aucun fichier n'est trouvé
      switch (inputs.ifNoFilesFound) {
        case NoFileOptions.warn:
          core.warning(`No files were found at path: ${inputs.searchPath}. No artifacts will be uploaded.`);
          break;
        case NoFileOptions.error:
          core.setFailed(`No files were found at path: ${inputs.searchPath}. No artifacts will be uploaded.`);
          return; // Arrêt de l'exécution
        case NoFileOptions.ignore:
          core.info(`No files were found at path: ${inputs.searchPath}. No artifacts will be uploaded.`);
          return; // Arrêt de l'exécution
      }
      return; // Ajouté pour éviter de continuer si aucun fichier n'est trouvé
    }

    const fileCount = searchResult.filesToUpload.length;
    core.info(`Found ${fileCount} file${fileCount === 1 ? '' : 's'} to upload.`);
    core.debug(`Root artifact directory: ${searchResult.rootDirectory}`);

    if (fileCount > 10000) {
      core.warning('There are over 10,000 files in this artifact. Consider creating an archive before uploading for better performance.');
    }

    const artifactClient = new DefaultArtifactClient(); // Correction de l'instanciation
    const options = {
      continueOnError: false,
      retentionDays: inputs.retentionDays || undefined,
    };

    const uploadResponse = await artifactClient.uploadArtifact(
      inputs.artifactName,
      searchResult.filesToUpload,
      searchResult.rootDirectory,
      options
    );

    core.info(`Artifact "${uploadResponse.id}" has been successfully uploaded!`);

  } catch (err: unknown) {
    if (err instanceof Error) {
      core.setFailed(`Error: ${err.message}`);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}