import * as React from "react";
import { Dialog } from "radix-ui";

import "./style.css";

import { RxCross2 } from "react-icons/rx";
import { SignIn, SignInButton } from "@clerk/nextjs";



interface PopupContentProps {
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
        <Dialog.Title className="DialogTitle">Just want to check in on you</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          
        </Dialog.Description>
        <div className="venues_cart_auth flex flex-col ">
          <p className="max-w-[400px] DialogDescription">H1,  we hope you are finding information helpful during this difficcult time, if you would like to take a break, please enter your email below with a password, and we can pick up wher you left off. If you would like to continue, please do so, clicking below</p>
<SignIn
  routing="virtual"
  signUpUrl="/sign-up"
/>
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
