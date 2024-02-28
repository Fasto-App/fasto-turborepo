import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

const NotForPhonesComponent = () => {
  const { t } = useTranslation("common");

  return (
    <div className='fixed md:hidden lg:hidden xl:hidden 2xl:hidden inset-0 flex items-center justify-center bg-black bg-opacity-50 bg-blur z-50 backdrop-blur-sm p-4'>
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>{t("headsUp")}</AlertTitle>
        <AlertDescription>
          {t("responsiveVersion")}
        </AlertDescription>
      </Alert>
    </div>
  );
};

const BusinessScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return <div
    // flex={1}
    // flexDirection={"row"}
    // backgroundColor={"white"}
    // borderWidth={8}
    // borderColor={"indigo.600"}
    className="flex flex-row h-screen w-screen bg-white border-4 border-red-300"
  >
    {children}
    <NotForPhonesComponent />
  </div>;
};

export { BusinessScreenContainer };
