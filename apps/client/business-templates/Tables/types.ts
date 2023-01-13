import { GetSpacesFromBusinessQuery } from "../../gen/generated";

type SpaceFromSpacesQuery = GetSpacesFromBusinessQuery['getSpacesFromBusiness'][number]

type TableFromSpacesQuery = SpaceFromSpacesQuery["tables"][number]

export type SelectedTable = Omit<TableFromSpacesQuery, "tab"> & {
  tab?: SpaceFromSpacesQuery["_id"]
  orders: TableFromSpacesQuery["tab"]["orders"]
  users: TableFromSpacesQuery["tab"]["users"]
}

