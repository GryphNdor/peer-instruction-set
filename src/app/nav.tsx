'use client'
import { Group, UnstyledButton, rem } from '@mantine/core'
import { IconHome, IconZoom, IconUser, IconListCheck, IconDeviceTv } from '@tabler/icons-react'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import app from '../../config';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);

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
      <UnstyledButton>
        <IconUser style={{ width: rem(30), height: rem(30), color: checkPath("/user") }} />
      </UnstyledButton>
      <UnstyledButton>
        <IconListCheck style={{ width: rem(30), height: rem(30), color: checkPath("/user") }} />
      </UnstyledButton>
      <UnstyledButton onClick={() => router.push('/rooms')}>
        <IconDeviceTv style={{ width: rem(30), height: rem(30), color: checkPath("/rooms") }} />
      </UnstyledButton>
    </Group>
  )
}
