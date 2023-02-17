enum Proficiency {
  U = 'U',
  T = 'T',
  E = 'E',
  M = 'M',
  L = 'L',
}

namespace Proficiency {
  const VALUES = {
    U: 0,
    T: 2,
    E: 4,
    M: 6,
    L: 8,
  };

  export function bonus(proficiency: Proficiency, level: number) {
    return proficiency === Proficiency.U ? 0 : VALUES[proficiency] + level;
  }
}

export default Proficiency;
