import { useTranslation } from 'next-i18next'
import { Heading, HStack, ScrollView, Button } from 'native-base'
import React from 'react'
import { Tile } from '../../components/Tile'
import { UpperSection } from '../../components/UpperSection'
import { GetTabByIdQuery } from '../../gen/generated'

export const MenuUpperSection = ({
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
    <UpperSection>
      <Heading>{t("patrons")}</Heading>
      <HStack space={2}>
        <ScrollView horizontal={true} pb={2}>
          <HStack space={2}>
            <Tile
              selected={!selectedUser}
              onPress={() => setSelectedUser(undefined)}
            >
              {t("table")}
            </Tile>
            {tabData?.getTabByID?.users?.map((user, index) => (
              <Tile
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
    </UpperSection>
  )
}
