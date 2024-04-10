'use client'
import React from "react";
import { Button } from "@/shadcn/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/shadcn/components/ui/sheet";
import Image from "next/image";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { useRouter } from "next/router";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { businessRoute } from "fasto-route";
import { ActivityLogIcon, CalendarIcon, ClipboardIcon, DashboardIcon, GearIcon, IdCardIcon, Pencil1Icon, TableIcon, ChevronLeftIcon, CardStackPlusIcon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";
import { cn } from "@/shadcn/lib/utils";

export function SheetSideBar() {

    const router = useRouter();
    const { t } = useTranslation("common")
    const buttonsData = [
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
        <Sheet>
            <SheetTrigger asChild className="p-0 m-0 border-none">
                <Button variant={"ghost"}><HamburgerMenuIcon className="text-white w-6 h-6 mr-2" /></Button>
            </SheetTrigger>
            <SheetContent className="bg-white">
                <ScrollArea className="h-screen">
                    <SheetHeader>
                        <div className="flex relative items-center mx-3.5 py-4 px-3.5">
                            <Image src="/images/fasto-logo.svg" alt="Logo" height={36} width={180} />
                        </div>
                    </SheetHeader>
                    <nav className="flex flex-col gap-2 items-start mx-2">
                        {buttonsData.map((item, index) => (
                            <SheetClose key={item.route}>
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
                                        <div className="flex items-center justify-center gap-5 text-[18px]">
                                            {item.type}
                                            {item.text}
                                        </div>
                                    </div>
                                </Button>
                            </SheetClose>
                        ))}
                    </nav>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
