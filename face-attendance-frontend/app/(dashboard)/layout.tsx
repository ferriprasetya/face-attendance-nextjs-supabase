import { AppSidebar } from '@/components/layouts/AppSidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <SidebarTrigger className='ml-1 cursor-pointer' size='lg' />
        </header>
        <main className='px-8'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
