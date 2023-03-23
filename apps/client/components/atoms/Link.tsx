import React, { FC } from "react";
import { Link as NBLink } from "native-base";
import NextLink from 'next/link';
import { InterfaceLinkProps } from "native-base/lib/typescript/components/primitives/Link/types";

type LinkProps = {
  href: string;
  fontSize?: InterfaceLinkProps["fontSize"];
}

export const Link: FC<LinkProps> = ({ children, href, fontSize }) => {
  return (<NextLink href={href}>
    <NBLink
      alignSelf={"flex-end"}
      _text={{
        fontSize,
        fontWeight: "500",
        color: "indigo.500"
      }}>
      {children}
    </NBLink>
  </NextLink>)
}