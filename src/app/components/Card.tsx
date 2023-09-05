import { css } from "@/lib/emotion";
import { Typography } from "@icgc-argo/uikit";
import { FC, ReactNode } from "react";

type CardProps = { title: string; action?: ReactNode; children: ReactNode };
const Card: FC<CardProps> = ({ title, action, children }) => (
  <div
    css={css`
      padding: 9px;
    `}
  >
    <div
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      `}
    >
      <Typography
        css={css`
          margin: 0 0 8px 0;
        `}
        color="primary"
        variant="subtitle2"
        component="h2"
      >
        {title}
      </Typography>
      {action}
    </div>

    {children}
  </div>
);

export default Card;
