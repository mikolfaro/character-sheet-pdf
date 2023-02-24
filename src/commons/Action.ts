export default interface Action {
  name?: string;
  actions?: number;
  reaction?: boolean;
  freeAction?: boolean;
  traits?: string[];
  page?: string;
  description?: string;
  trigger?: string;
  frequency?: string;
  requirements?: string;
}
