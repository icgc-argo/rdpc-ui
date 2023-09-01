import { css, useTheme } from "@/lib/emotion";
import { ReactNode } from "react";

const ContentMain = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <div
      id="content"
      css={css`
		  display: flex;
			flex-direction: column;
			row-gap: 30px;  
			padding: 25px 30px;


    > div {
        background: white;
        border-radius: 8px;
        border: 1px solid ${theme.colors.grey_1}
`}
    >
      {children}
    </div>
  );
};

export default ContentMain;
