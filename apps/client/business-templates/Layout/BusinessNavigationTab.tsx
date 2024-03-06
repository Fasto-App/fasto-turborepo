import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { Center, VStack } from "native-base";
import Image from "next/image";
import { BusinessNavigationButton } from "../../components/atoms/NavigationButton";
import { businessRoute } from "fasto-route";
import type { AppNavigation } from "fasto-route";
import { LeftSideBar } from "../../components/LeftSideBar/LeftSideBar";
import { AccountMenu } from "../../components/MenuHamburguer";
import { useTranslation } from "next-i18next";
import { useGetSignUpSubscriptionsQuery } from "../../gen/generated";
import { ActivityLogIcon, CalendarIcon, ClipboardIcon, CubeIcon, DashboardIcon, GearIcon, IdCardIcon, Pencil1Icon, TableIcon, ChevronLeftIcon, CardStackPlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/shadcn/components/ui/button";
import logo from "@/public/ios/192.png"

const BusinessNavigationTab = () => {
  const router = useRouter();
  const useIsPageSelected = useMemo(() => (pathname: AppNavigation) =>
    pathname === router.pathname, [router.pathname])

  const { data } = useGetSignUpSubscriptionsQuery()
  const { t } = useTranslation("common")
  const [open, setOpen] = useState(true);

  const navigationItems = [
    {
      text: t("dashboard"),
      type: <DashboardIcon className=" h-8 w-8" />,
      route: businessRoute.dashboard,
    },
    {
      text: t("categoriesProducts"),
      type: <Pencil1Icon className=" h-8 w-8" />,
      route: businessRoute["add-products-categories"],
    },
    {
      text: t("menu"),
      type: <ActivityLogIcon className=" h-8 w-8" />,
      route: businessRoute.menu,
    },
    {
      text: t("tables"),
      type: <TableIcon className=" h-8 w-8" />,
      route: businessRoute.tables,
    },
    {
      text: t("placedOrders"),
      type: <ClipboardIcon className=" h-8 w-8" />,
      route: businessRoute.orders,
    },
    {
      text: t("payments"),
      type: <IdCardIcon className=" h-8 w-8" />,
      route: businessRoute.payments,
    },
    {
      text: t("subscriptions"),
      type: <CalendarIcon className=" h-8 w-8" />,
      route: businessRoute.subscriptions,
    },
    {
      text: t("settings"),
      type: <GearIcon className=" h-8 w-8" />,
      route: businessRoute.settings,
    },
  ];

  return (
    <aside
      className={`flex flex-col justify-between bg-gray-50 text-white shadow-lg shadow-gray-900/20 duration-200 ease-out ${open ? "w-[18.5rem]" : "w-[5rem]"} `}
    >
      <div className="flex relative justify-center items-center mx-1 py-2 px-1 transform duration-50">  
      {open
      ? 
      <Image src="/images/fasto-logo.svg" alt="Logo" height={36} width={180} /> 
      : 
      <Image src={logo} alt="Logo" height={36} width={36}/>
      }   
  
  <div
    onClick={() => setOpen(!open)}
    className={`absolute bg-[#f55135] z-10 rounded-lg text-3xl cursor-pointer text-white -right-4 top-[3.5rem] border-2 border-[#f55135] ${!open && 'trasition rotate-180'}`}
  >
    <ChevronLeftIcon className="h-10 w-10 text-white" /> 
  </div>
</div>
      <nav className="flex flex-col gap-2 items-start mx-2">
        {navigationItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            asChild
            className="flex items-start justify-start gap-2 text-md font-light text-black w-full cursor-pointer hover:bg-[#e0d0c8]"
            onClick={() => { router.push(item.route); }}
          >
            <div className="flex items-center gap-0">

              {open && (
                <div className="flex items-center justify-center gap-5 text-[18px]">
                  {item.type}
                  {item.text}
                </div>
              )}
              {!open && item.type}

            </div>
          </Button>
        ))}

      </nav>
      <div className="flex flex-col items-center justify-center p-4">
        {open ? 
         <Button
         disabled={!data?.getSignUpSubscription?.tier ||
           data?.getSignUpSubscription?.tier === "Basic Plan"}
         className="font-bold mb-4 p-6 text-[18px] bg-[#f55135]"
         onClick={() => router.push(businessRoute["add-to-order"])}>
         {t("quickSale")}
       </Button>
        :
        <Button
        disabled={!data?.getSignUpSubscription?.tier ||
          data?.getSignUpSubscription?.tier === "Basic Plan"}
        className="font-bold mb-4 p-6 text-[18px] bg-[#f55135]"
        onClick={() => router.push(businessRoute["add-to-order"])}>  
        <CardStackPlusIcon/>    
      </Button>
        }
       
        <AccountMenu />
      </div>

    </aside>
  );
};

export { BusinessNavigationTab };
