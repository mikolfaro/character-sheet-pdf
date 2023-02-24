import SaveType from './SaveType';

export default interface Save {
  type: SaveType;
  flat?: boolean;
}
