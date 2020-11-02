import React from "react"
import { Layout } from "antd"
import { LayoutProps } from "antd/lib/layout"
import styled, {css} from "styled-components";

const LayoutWithStyled = styled(Layout)`
  background-color: transparent;
  height: 100%;
`;

export const Container = (props: LayoutProps) => <LayoutWithStyled {...props} />;