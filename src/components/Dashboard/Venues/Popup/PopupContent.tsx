import * as React from "react";
import { Dialog } from "radix-ui";

import "./style.css";

import { RxCross2 } from "react-icons/rx";
import { BiCurrentLocation } from "react-icons/bi";

const PopupContent = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ">
        <BiCurrentLocation />
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Select the Location</Dialog.Title>
        <Dialog.Description className="DialogDescription">
  
        </Dialog.Description>
        <div className=" overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d347981.8230478231!2d-120.01194939391205!3d36.1913146204813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e1!3m2!1sen!2snp!4v1746588439112!5m2!1sen!2snp"
            width="600"
            height="450"
        
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <RxCross2 />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default PopupContent;
