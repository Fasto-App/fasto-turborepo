import {
  GetSpacesFromBusinessDocument,
  useCreateTableMutation
} from "../gen/generated";


export const useTableMutationHook = () => {

  const [createTable] = useCreateTableMutation({
    refetchQueries: [{ query: GetSpacesFromBusinessDocument }],
    onCompleted: () => {
      console.log('table created')
    },
    onError: (error) => {
      console.error('error', error)
    }
  });

  return {
    createTable,
  }
}