export default interface InventoryItem {
  name: string;
  quantity?: number;
  bulk?: number;

  invested?: boolean;
}
