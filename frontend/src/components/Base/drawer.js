"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tableform } from "../Base/table";

export function Drawers({result}) {
  return (
    <Drawer >
      <DrawerTrigger asChild>
        <Button variant="outline">Scores</Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
           
              <DrawerTitle className="text-3xl font-bold text-center mt-3 text-zinc-600">Mark Allocation</DrawerTitle>
        
            <div className="p-4">
              <div className=" pb-1">
                <Tableform result = {result}/>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

export default Drawers;
