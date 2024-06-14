"use client";
import { ReactNode } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GeneralModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}

const GeneralModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  image,
}: GeneralModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] max-sm:w-2/3 flex-col gap-6 border-none bg-white px-6 py-9 text-dark-1">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
            {title}
          </h1>
          {children}
          
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralModal;
