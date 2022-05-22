import { DataFormatterItems, DataFormatterTypes, UserDocument } from ".";

export function DataFormatter<TData>(data: TData) {
  const formatObj: Partial<DataFormatterItems<TData>> = {
    data
  };

  return {
    formatUserData(data: UserDocument) {
      const { ...restProps } = data;
      return restProps;
    },
    format(type: DataFormatterTypes) {
      if (type === DataFormatterTypes.User) return this.formatUserData(formatObj.data as UserDocument)
    },
  }
}