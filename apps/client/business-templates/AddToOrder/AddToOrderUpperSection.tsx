import { useTranslation } from 'next-i18next'
import { Heading, HStack, ScrollView, Button } from 'native-base'
import React from 'react'
import { Tile } from '../../components/Tile'
import { GetTabByIdQuery } from '../../gen/generated'

export const AddToOrderUpperSection = ({
  tabData,
  selectedUser,
  setSelectedUser,
  isLoading,
  requestCloseTab
}: {
  isLoading: boolean,
  tabData?: GetTabByIdQuery,
  selectedUser?: string,
  requestCloseTab: () => void,
  setSelectedUser: React.Dispatch<React.SetStateAction<string | undefined>>,
}) => {
  const { t } = useTranslation("businessAddToOrder");

  return (
    <div className="row-span-1 p-4 m-4 border rounded-lg bg-white z-10">
      <Heading>{t("patrons")}</Heading>
      <HStack space={2}>
        <ScrollView horizontal={true} pb={2}>
          <HStack space={2}>
            <Tile
              variant={"outline"}
              selected={!selectedUser}
              onPress={() => setSelectedUser(undefined)}
            >
              {t("table")}
            </Tile>
            {tabData?.getTabByID?.users?.map((user, index) => (
              <Tile
                variant={"outline"}
                key={user._id}
                selected={user._id === selectedUser}
                onPress={() => setSelectedUser(user._id)}
              >
                {`Person ${index + 1}`}
              </Tile>
            ))}
          </HStack>
        </ScrollView>
      </HStack>
      {tabData?.getTabByID._id ? (
        <Button
          colorScheme={"primary"}
          width={"100px"}
          onPress={requestCloseTab}
          isLoading={isLoading}
        >
          {t("closeTab")}
        </Button>
      ) : null}
    </div>
  )
}
