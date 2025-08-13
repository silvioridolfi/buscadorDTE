"use client"

import React from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface DetailSectionProps {
  id: string
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function DetailSection({ id, title, icon, children, className }: DetailSectionProps) {
  return (
    <AccordionItem value={id} id={id} className={className}>
      <AccordionTrigger className="text-lg font-semibold text-white hover:text-[#00AEC3] transition-colors">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-[#00AEC3]">
              {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
            </div>
          )}
          <span>{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">{children}</div>
      </AccordionContent>
    </AccordionItem>
  )
}
