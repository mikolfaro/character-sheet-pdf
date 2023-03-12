export default interface InventoryItem {
  name: string;
  quantity?: number;
  bulk?: number;
  value?: number | string;
  invested?: boolean;
}
