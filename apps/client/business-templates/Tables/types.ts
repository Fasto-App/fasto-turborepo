import { GetSpacesFromBusinessQuery, TableStatus } from "../../gen/generated";

type SpaceFromSpacesQuery = NonNullable<GetSpacesFromBusinessQuery['getSpacesFromBusiness']>[number]

type TablesFromSpacesQuery = SpaceFromSpacesQuery["tables"]

type TableFromSpaceQuery = NonNullable<TablesFromSpacesQuery>[number]

export type SelectedTable = Exclude<TablesFromSpacesQuery, "tab"> & {
  _id?: TableFromSpaceQuery["_id"];
  tab?: SpaceFromSpacesQuery["_id"];
  status?: NonNullable<TableFromSpaceQuery["status"]>;
  tableNumber?: string;
  orders: NonNullable<TableFromSpaceQuery["tab"]>["orders"];
  users: NonNullable<TableFromSpaceQuery["tab"]>["users"];
}

