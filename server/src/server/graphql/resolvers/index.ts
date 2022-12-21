import { MyDataLoader } from "../dataLoaders";
export { queryType } from "./query";
export { mutationType } from "./mutation";

export type ContextType = {
  loaders: MyDataLoader;
};
