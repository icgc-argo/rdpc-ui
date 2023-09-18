export const onFileClick = (clinicalType: string) => (e: Event) => {
  const states = fileStates === undefined ? [] : fileStates.filter(notNull);
  states.onFileSelect(
    states.find((file) => clinicalType === file.clinicalType).clinicalType,
  );
};

export const onClearClick = (clinicalType: string) => async (e) => {
  const fileType: string = fileStates.find(
    (file) => clinicalType === file.clinicalType,
  ).clinicalType;

  try {
    await clearClinicalEntitySubmission({
      variables: {
        programShortName,
        submissionVersion,
        fileType,
      },
    });
    toaster.addToast({
      variant: "SUCCESS",
      interactionType: "CLOSE",
      title: "Cleared",
      content: `Uploaded ${fileType.toUpperCase()} file has been cleared.`,
    });
  } catch (err) {
    await refetchClinicalSubmission();
    commonToaster.unknownErrorWithReloadMessage();
  }
};

export const onErrorClearClick = () => {
  clearDataError(selectedFile);
};
