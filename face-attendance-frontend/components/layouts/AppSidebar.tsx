'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/actions/auth.actions'
import { Separator } from '../ui/separator'
import { Loader } from 'lucide-react'

const routes = [
  {
    title: 'Dashboard',
    url: '/dashboard',
  },
  {
    title: 'Students',
    url: '/students',
  },
  {
    title: 'Attendances',
    url: '/attendances',
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoadingLogout, setIsLoadingLogout] = React.useState(false)
  const onLogout = async () => {
    setIsLoadingLogout(true)
    await logout()
    router.push('/login')
    setIsLoadingLogout(false)
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h3 className='my-4 text-2xl font-semibold'>Face Attendance</h3>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        <SidebarMenu>
          {routes.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                size='lg'
                asChild
                isActive={pathname.includes(item.url)}
              >
                <Link href={item.url}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <Separator className='my-4' />
          <SidebarMenuItem key='logout'>
            <SidebarMenuButton
              size='lg'
              className='cursor-pointer border border-red-50 bg-red-50 text-red-700 transition-colors hover:border-red-500 hover:bg-red-100 hover:text-red-800 active:bg-red-200 active:text-red-900'
              disabled={isLoadingLogout}
              onClick={onLogout}
            >
              <div className='flex items-center gap-2'>
                <p>Logout</p>
                {isLoadingLogout && (
                  <Loader size={18} className='animate-spin' />
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
