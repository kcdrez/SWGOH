import { iAbility, iUniqueAbility } from "types/characters";

import AAYLASECURA from "./AAYLASECURA";
import CHEWBACCALEGENDARY from "./CHEWBACCALEGENDARY";
import COMMANDERLUKESKYWALKER from "./COMMANDERLUKESKYWALKER";
import HANSOLO from "./HANSOLO";
import OLDBENKENOBI from "./OLDBENKENOBI";

const characterMapping: Record<
  string,
  Record<string, iAbility | iUniqueAbility>
> = {
  COMMANDERLUKESKYWALKER,
  OLDBENKENOBI,
  AAYLASECURA,
  HANSOLO,
  CHEWBACCALEGENDARY,
};

export default characterMapping;
