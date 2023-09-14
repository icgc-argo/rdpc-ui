import { css } from "@/lib/emotion";
import { InstructionBox } from "@icgc-argo/uikit";

const Instructions = () => {
  return (
    <div
      css={css`
        padding: 8px 8px 0;
      `}
    >
      <InstructionBox steps={[]} />
    </div>
  );
};

export default Instructions;
