import * as React from "react";
import { Dialog } from "radix-ui";

import "./style.css";

import { RxCross2 } from "react-icons/rx";
import { BiCurrentLocation } from "react-icons/bi";


type PopupContentProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopupContent: React.FC<PopupContentProps> = ({ open, setOpen }) => {
  	

  return (
    <div>
       <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>
      {/* <button className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ">
        <BiCurrentLocation />
      </button> */}
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle"></Dialog.Title>
        <Dialog.Description className="DialogDescription">
  
        </Dialog.Description>
         <div className="w-full max-w-xl bg-white rounded-2xl  p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Subscribe to our newsletter
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Get the latest updates, offers, and news delivered to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>

        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <RxCross2 />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
    </div>
  )
}

export default PopupContent
