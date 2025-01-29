import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from '@/lib/utils';

export function Modal({ trigger, title, description, content, openModal, setOpenModal, style }) {
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
    <Dialog  open={internalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger >
      <DialogContent className={cn("w-[425px] rounded sm:w-[90rem]", style)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
