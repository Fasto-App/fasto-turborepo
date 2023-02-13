import React from "react";
import { Link as NBLink } from "native-base";
import NextLink from 'next/link';

export const Link: React.FC<{ href: string }> = ({ children, href }) => {
  return (<NextLink href={href}>
    <NBLink
      alignSelf={"flex-end"}
      _text={{
        fontSize: "sm",
        fontWeight: "500",
        color: "indigo.500"
      }}>
      {children}
    </NBLink>
  </NextLink>)
}