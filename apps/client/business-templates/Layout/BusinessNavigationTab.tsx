import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { businessRoute } from "fasto-route";
import type { AppNavigation } from "fasto-route";
import { useTranslation } from "next-i18next";
import { useGetBusinessInformationQuery, useGetSignUpSubscriptionsQuery } from "../../gen/generated";
import { ActivityLogIcon, CalendarIcon, ClipboardIcon, DashboardIcon, GearIcon, IdCardIcon, Pencil1Icon, TableIcon, ChevronLeftIcon, CardStackPlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/shadcn/components/ui/button";
import { DropdownMenuSideBar } from "./DropDownMenu";
import { cn } from "@/shadcn/lib/utils";
import { useSideBarOpen } from "@/localStorage/businessStorage";
import { SheetSideBar } from "./sheetSideBar";

const BusinessNavigationTab = () => {
  const router = useRouter();
  const { data: businessInfo } = useGetBusinessInformationQuery()

  const { t } = useTranslation("common")
  const { open, setOpen } = useSideBarOpen();

  const navigationItems = [
    {
      text: t("dashboard"),
      type: <DashboardIcon className=" h-6 w-6" />,
      route: businessRoute.dashboard,
    },
    {
      text: t("categoriesProducts"),
      type: <Pencil1Icon className=" h-6 w-6" />,
      route: businessRoute["add-products-categories"],
    },
    {
      text: t("menu"),
      type: <ActivityLogIcon className=" h-6 w-6" />,
      route: businessRoute.menu,
    },
    {
      text: t("tables"),
      type: <TableIcon className=" h-6 w-6" />,
      route: businessRoute.tables,
    },
    {
      text: t("placedOrders"),
      type: <ClipboardIcon className=" h-6 w-6" />,
      route: businessRoute.orders,
    },
    {
      text: t("payments"),
      type: <IdCardIcon className=" h-6 w-6" />,
      route: businessRoute.payments,
    },
    {
      text: t("subscriptions"),
      type: <CalendarIcon className=" h-6 w-6" />,
      route: businessRoute.subscriptions,
    },
    {
      text: t("settings"),
      type: <GearIcon className=" h-6 w-6" />,
      route: businessRoute.settings,
    },
  ];

  return (
    <>
    <aside
      className={`hidden sm:flex flex-col justify-between bg-gray-50 text-white shadow-lg shadow-gray-900/20 duration-200 ease-out ${open ? "w-[18.5rem]" : "w-[5rem]"} `}
    >
      <div className="flex relative justify-center items-center mx-1 py-2 px-1 transform duration-50">
        {open ?
          <Image src="/images/fasto-logo.svg" alt="Logo" height={36} width={180} /> :
          <Image src={"/ios/512.png"} alt="Logo" height={56} width={56} />}
        <div
          onClick={setOpen}
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
            className={cn("flex items-start justify-start gap-2 text-md font-light text-black w-full cursor-pointer hover:bg-[#e0d0c8]",
              item.route === router.pathname && "border border-[#f55135] text-[#f55135]"
            )}
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
      <div className="flex flex-col items-center justify-center p-4 gap-8">
        <Button
          className={cn("font-bold mb-4 p-6 text-[18px] bg-[#f55135]", open && "w-full")}
          onClick={() => router.push(businessRoute["add-to-order"])}>
          {open ? t("quickSale") : <CardStackPlusIcon className="h-6 w-6" />}
        </Button>

        <DropdownMenuSideBar
          isOpen={open}
          uri={businessInfo?.getBusinessInformation.picture}
          businessName={businessInfo?.getBusinessInformation.name}
        />
      </div>
    </aside>
    <div className="sm:hidden bg-[#f55135] top-0 w-full fixed h-[36px] z-20">
        <div className="flex flex-row justify-between mx-1 items-center">

          <h3 className={`pl-2 font-bold text-lg text-white`}>
            Fasto App
          </h3>
          <SheetSideBar />
        </div>
      </div>
    </>
    
  );
}; 

export { BusinessNavigationTab };
