import { Container,  Stack, Title, Combobox, Button, useCombobox, InputBase, Input, Loader, Text, Alert, List } from "@mantine/core";
import { getDocs, collection } from "firebase/firestore";
import db from "@/config";
import { useEffect, useState } from "react"
import { IconInfoCircle } from "@tabler/icons-react";

const SessionOptionComponent = () => {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  const findRecipes = async (): Promise<string[]> => {
    const recipes = await getDocs(collection(db, 'recipes'))
    let ids: string[] = []
    recipes.forEach((recipe) => {
      ids.push(recipe.id)
    })
    return ids
  }

  const options = data.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
    },
    onDropdownOpen: () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        findRecipes().then((ids)=>{
          setLoading(false);
          setData(ids)
          combobox.resetSelectedOption();
        })
      }
    }
  })

  return(
    <Container size="xs" pt="10" >
      <Title order={3}>New Session Settings</Title>
      <Stack pb="md">
        <Combobox 
          store={combobox}
          onOptionSubmit={(val) => {
            setValue(val);
            combobox.closeDropdown();
          }}
        >

          <Combobox.Target>
            <InputBase
              component="button"
              label="Select a Recipe"
              description="Pick a recipe for the session"
              type="button"
              pointer
              rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
              onClick={() => combobox.toggleDropdown()}
              rightSectionPointerEvents="none"
            >
              {value || <Input.Placeholder>Pick value</Input.Placeholder>}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>
              {loading ? <Combobox.Empty>Loading....</Combobox.Empty> : options}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Stack>

      <Alert variant="light" color="blue" title="Configuration" icon={<IconInfoCircle/>}>
        Set up a room by selecting a recipe from the drop down, or join a room with the code
      </Alert>
    </Container>
  )
}

export default SessionOptionComponent;
