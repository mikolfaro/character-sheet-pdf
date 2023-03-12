export default interface InventoryItem {
  name: string;
  quantity?: number;
  bulk?: number;
  value?: number;
  invested?: boolean;
}
