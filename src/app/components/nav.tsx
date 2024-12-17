'use client'
import { Group, UnstyledButton, rem } from '@mantine/core'
import { IconHome, IconZoom, IconUser, IconListCheck, IconDeviceTv } from '@tabler/icons-react'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'


export default function Nav() {
  const router = useRouter()
  const currentPath = usePathname()

  const checkPath = (path: string): string => {
    if (currentPath === path) {
      return "black"
    }
    return "grey"
  }

  return (
    <Group justify='space-between'>
      <UnstyledButton onClick={() => router.push('/')}>
        <IconHome style={{ width: rem(30), height: rem(30), color: checkPath("/") }} />
      </UnstyledButton>
      <UnstyledButton onClick={() => router.push('/search')}>
        <IconZoom style={{ width: rem(30), height: rem(30), color: checkPath("/search") }} />
      </UnstyledButton>
      <UnstyledButton onClick={() => router.push('/home')}>
        <IconUser style={{ width: rem(30), height: rem(30), color: checkPath("/home") }} />
      </UnstyledButton>
      <UnstyledButton onClick={() => router.push('/rewards')}>
        <IconListCheck style={{ width: rem(30), height: rem(30), color: checkPath("/rewards") }} />
      </UnstyledButton>

      <UnstyledButton onClick={() => router.push('/rooms')}>
        <IconDeviceTv style={{ width: rem(30), height: rem(30), color: checkPath("/rooms") }} />
      </UnstyledButton>
    </Group>
  )
}
