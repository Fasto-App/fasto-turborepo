import { gql, useMutation, useQuery } from "@apollo/client";
import { useAppStore } from "../business-templates/UseAppStore";
import { useGetAllMenusByBusinessIdQuery, useCreateMenuMutation, useUpdateMenuMutation, useUpdateMenuInfoMutation, useDeleteMenuMutation, GetAllMenusByBusinessIdDocument } from "../gen/generated";

const useMenuMutationHook = () => {
  const [updateMenu] = useUpdateMenuMutation({
    onCompleted: (data) => {

    },
    updateQueries: {
      getAllMenusByBusinessID: (prev, { mutationResult }) => {
        return Object.assign({}, prev, {
          getAllMenusByBusinessID: mutationResult?.data?.updateMenu
        });
      }
    }
  });

  const [updateMenuInfo] = useUpdateMenuInfoMutation({
    onCompleted: (data) => {

    }
  });

  const [deleteMenu] = useDeleteMenuMutation({
    onCompleted: (data) => {

    },
    update: (cache, { data }) => {
      // @ts-ignore
      const { getAllMenusByBusinessID } = cache.readQuery({
        query: GetAllMenusByBusinessIdDocument
      });
      cache.writeQuery({
        query: GetAllMenusByBusinessIdDocument,
        data: {
          getAllMenusByBusinessID: getAllMenusByBusinessID.filter((menu: { _id: string | undefined; }) => menu._id !== data?.deleteMenu._id)
        }
      });
    }
  });


  return {
    updateMenu,
    updateMenuInfo,
    deleteMenu
  }

}



export { useMenuMutationHook }