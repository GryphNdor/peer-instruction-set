'use client'
import app from "../../../config";
import { AppShell, Button, Container, Group, rem, Stack, TextInput, Image, Title, AspectRatio } from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import { IconHome, IconZoom, IconUser, IconListCheck, IconDeviceTv } from "@tabler/icons-react"

export default function Home() {
  const [loggedIn, toggleLogin] = useDisclosure()

  return (
    <Group gap="lg" justify="space-around">
      <Stack>
        <Stack>
          <Title order={3}>Create Room</Title>
          <Button>Create</Button>
        </Stack>
        <Stack>
          <Title order={3}>Join Room</Title>
          <TextInput></TextInput>
          <Button>Join</Button>
        </Stack>
      </Stack>

      <AspectRatio ratio={16 / 9}>
        <Image
          radius="md"
          h={200}
          w="auto"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
        />

      </AspectRatio>
    </Group >

  );
}
