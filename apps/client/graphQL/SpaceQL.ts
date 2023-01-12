import {
  GetSpacesFromBusinessDocument,
  useCreateSpaceMutation,
  useGetSpacesFromBusinessQuery
} from "../gen/generated";


export const useSpacesMutationHook = (onGetSucess: (spaceId?: string) => void) => {

  const { data } = useGetSpacesFromBusinessQuery({
    onCompleted: (data) => {
      onGetSucess(data.getSpacesFromBusiness?.[0]._id)
    },
  });

  const [createSpace] = useCreateSpaceMutation({
    onCompleted: () => {
      console.log('space created')
    },
    update: (cache, { data: { createSpace } }) => {
      console.log('space created', createSpace)

      // @ts-ignore
      const { getSpacesFromBusiness } = cache.readQuery({ query: GetSpacesFromBusinessDocument });
      cache.writeQuery({
        query: GetSpacesFromBusinessDocument,
        data: { getSpacesFromBusiness: [createSpace, ...getSpacesFromBusiness] }
      });
    }
  });

  return {
    allSpaces: data?.getSpacesFromBusiness ?? [],
    createSpace,
  }
}


