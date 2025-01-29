import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from '@/lib/utils';

export function Modal({ trigger, title, description, content, openModal, setOpenModal, className }) {
  const [internalOpen, setInternalOpen] = useState(false);

  useEffect(() => {
    if (openModal !== undefined) {
      setInternalOpen(openModal);
    }
  }, [openModal]);

  const handleOpenChange = (open) => {
    if (setOpenModal) {
      setOpenModal(open);
    }
    setInternalOpen(open);
  };

  return (
    <Dialog className={cn("w-[425px] sm:w-[90rem]", className)} open={internalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="w-[425px] sm:w-[90rem]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
