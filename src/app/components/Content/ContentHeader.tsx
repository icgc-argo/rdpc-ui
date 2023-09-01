import { css, useTheme } from "@/lib/emotion";
import { TitleBar, Link as UIKitLink } from "@icgc-argo/uikit";
import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";
import { Row } from "react-grid-system";

type ContentHeaderProps = {
  breadcrumb: string[];
  children?: ReactNode;
  helpUrl: string;
};

const ContentHeader: FunctionComponent<ContentHeaderProps> = ({
  breadcrumb,
  children,
  helpUrl,
}) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: flex;
        height: 56px;
        padding: 0 30px;
        align-items: center;
        background-color: ${theme.colors.white};
      `}
    >
      <TitleBar>
        <>{breadcrumb[0]}</>
        <Row nogutter align="center">
          <div
            css={css`
              margin-right: 20px;
            `}
          >
            {breadcrumb[1]}
          </div>
        </Row>
      </TitleBar>
      {children}
      <div
        css={css`
          margin-left: auto;
        `}
      >
        <Link href={helpUrl} legacyBehavior>
          <UIKitLink
            target="_blank"
            css={css`
              font-size: 14px;
            `}
            withChevron
            href={helpUrl}
            underline={false}
            bold
          >
            HELP
          </UIKitLink>
        </Link>
      </div>
    </div>
  );
};

export default ContentHeader;
