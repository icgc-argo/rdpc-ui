export const NoContentPlaceholder = () => (
  <div
    css={css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    `}
  >
    <ContentPlaceholder
      title="You do not have any data uploaded."
      subtitle="Follow the instructions above to get started."
    />
  </div>
);

export const Error = ({ onErrorClearClick, errors, displayName }) => (
  <div
    id="error-submit-clinical-data"
    css={css`
      padding: 16px;
    `}
  >
    <ErrorNotification
      level={NOTIFICATION_VARIANTS.ERROR}
      onClearClick={onErrorClearClick}
      title={`${
        errors.length
      } error(s) found in uploaded ${displayName.toLowerCase()} file`}
      errors={errors.map(toDisplayError)}
      subtitle={
        "Your file cannot be processed. Please correct the following errors and reupload your file."
      }
      columnConfig={getDefaultColumns(NOTIFICATION_VARIANTS.ERROR)}
    />
  </div>
);

export const VerticalTabsSection = (fileStates) => (
  <div
    css={css`
      width: 170px;
      max-width: 170px;
      min-width: 170px;
      overflow: visible;
    `}
  >
    <VerticalTabs
      css={css`
        height: 100%;
      `}
    >
      {fileStates.filter(notNull).map((fileState) => (
        <VerticalTabs.Item
          key={fileState.clinicalType}
          active={selectedFile.clinicalType === fileState.clinicalType}
          onClick={onFileClick(fileState.clinicalType)}
        >
          <div
            css={css`
              text-align: left;
            `}
          >
            {fileState.displayName}
          </div>
          {!!fileState.recordsCount &&
            fileState.status !== "NONE" &&
            fileState.status !== "ERROR" && (
              <VerticalTabs.Tag variant={fileState.status}>
                {fileState.recordsCount}
              </VerticalTabs.Tag>
            )}
          {fileState.status === "ERROR" && (
            <VerticalTabs.Tag variant="ERROR">
              <Icon name="exclamation" fill="#fff" height="10px" width="10px" />
            </VerticalTabs.Tag>
          )}
        </VerticalTabs.Item>
      ))}
    </VerticalTabs>
  </div>
);
