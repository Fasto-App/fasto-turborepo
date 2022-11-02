import { GetSpacesFromBusinessDocument, useCreateTabMutation } from "../gen/generated"

export const useTabMutationHook = () => {
  const [createTab] = useCreateTabMutation({
    refetchQueries: [{ query: GetSpacesFromBusinessDocument }],
  })

  return {
    createTab,
  }
}