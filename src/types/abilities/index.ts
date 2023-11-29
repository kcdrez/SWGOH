import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

import C3POCHEWBACCA from "./C3POCHEWBACCA";
import AAYLASECURA from "./AAYLASECURA";
import CHEWBACCALEGENDARY from "./CHEWBACCALEGENDARY";
import COMMANDERLUKESKYWALKER from "./COMMANDERLUKESKYWALKER";
import HANSOLO from "./HANSOLO";
import OLDBENKENOBI from "./OLDBENKENOBI";
import C3POLEGENDARY from "./C3POLEGENDARY";
// import ADMIRALACKBAR from "./ADMIRALACKBAR";

const characterMapping: Record<
  string,
  Record<string, iAbility | iUniqueAbility>
> = {
  COMMANDERLUKESKYWALKER,
  OLDBENKENOBI,
  AAYLASECURA,
  HANSOLO,
  CHEWBACCALEGENDARY,
  C3POCHEWBACCA,
  C3POLEGENDARY,
};

export default characterMapping;
