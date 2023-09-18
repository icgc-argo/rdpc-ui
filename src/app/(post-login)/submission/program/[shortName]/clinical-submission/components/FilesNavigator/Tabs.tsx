import { notNull } from "@/global/utils";
import { css } from "@/lib/emotion";
import { Icon, VerticalTabs } from "@icgc-argo/uikit";
import { FC } from "react";
import { ClinicalEntities, ClinicalSubmissionEntity } from "../../types";
import { onFileClick } from "./handlers";

export const VerticalTabsSection: FC<{
  fileStates: ClinicalEntities;
  selectedFile: ClinicalSubmissionEntity;
}> = ({ fileStates, selectedFile }) => {
  console.log("v tabs", fileStates);
  return (
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
        {fileStates?.filter(notNull).map((fileState) => (
          <VerticalTabs.Item
            key={fileState.clinicalType}
            active={selectedFile?.clinicalType === fileState.clinicalType}
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
                <Icon
                  name="exclamation"
                  fill="#fff"
                  height="10px"
                  width="10px"
                />
              </VerticalTabs.Tag>
            )}
          </VerticalTabs.Item>
        ))}
      </VerticalTabs>
    </div>
  );
};

export default VerticalTabsSection;
