// Chess Openings Encyclopedia (ECO) & Recognition Engine

const OPENINGS_DATABASE = [
  // E4 Openings
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'], eco: 'C70', name: 'Ruy Lopez: Morphy Defense', tip: 'White pins the knight to apply indirect pressure on e5. Black challenges the bishop immediately.' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], eco: 'C60', name: 'Ruy Lopez (Spanish Opening)', tip: 'One of the oldest and most respected openings. Focuses on classical central pressure and rapid development.' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'], eco: 'C50', name: 'Italian Game: Giuoco Piano', tip: 'A quiet, strategic setup targeting Black\'s vulnerable f7 square while preparing d3 or c3-d4.' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'], eco: 'C55', name: 'Italian Game: Two Knights Defense', tip: 'Black counterattacks White\'s e4 pawn instead of copying bishop development.' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], eco: 'C50', name: 'Italian Game', tip: 'Directly targets the vulnerable f7 square and controls central diagonals.' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'], eco: 'C45', name: 'Scotch Game', tip: 'White immediately challenges the center by trading on d4 to open the board.' },
  { moves: ['e4', 'e5', 'Nf3', 'Nf6'], eco: 'C42', name: 'Petroff Defense (Russian Game)', tip: 'A hyper-solid counterattack ignoring White\'s threat on e5 to hit e4.' },
  { moves: ['e4', 'e5', 'f4'], eco: 'C30', name: 'King\'s Gambit', tip: 'A romantic, sacrificial attack offering a wing pawn to seize central dominance.' },
  { moves: ['e4', 'e5', 'Nc3'], eco: 'C25', name: 'Vienna Game', tip: 'Solid positional opening preparing f4 or Bc4 with flexible pawn structures.' },
  { moves: ['e4', 'e5', 'Nf3'], eco: 'C40', name: 'King\'s Knight Opening', tip: 'White develops knight with tempo attacking Black\'s e5 pawn.' },
  { moves: ['e4', 'e5'], eco: 'C20', name: 'Open Game (King\'s Pawn)', tip: 'The purest classical struggle for center control and open lines.' },

  // Sicilian Defenses
  { moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'], eco: 'B90', name: 'Sicilian: Najdorf Variation', tip: 'The favorite weapon of Kasparov and Fischer. Sharp tactical battle for queenside initiative.' },
  { moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'], eco: 'B70', name: 'Sicilian: Dragon Variation', tip: 'Black fianchettos the dark-squared bishop to breathe fire down the long a1-h8 diagonal.' },
  { moves: ['e4', 'c5', 'Nf3', 'Nc6'], eco: 'B30', name: 'Sicilian: Old / Classical', tip: 'Fights for control over the critical d4 square before committing pawns.' },
  { moves: ['e4', 'c5', 'c3'], eco: 'B22', name: 'Sicilian: Alapin Variation', tip: 'White aims to construct a classical pawn center with d4 supported by c3.' },
  { moves: ['e4', 'c5', 'Nc3'], eco: 'B23', name: 'Closed Sicilian', tip: 'Avoids opening the d-file immediately, opting for slow kingside build-up.' },
  { moves: ['e4', 'c5'], eco: 'B20', name: 'Sicilian Defense', tip: 'The most aggressive response to 1. e4, creating asymmetric imbalance immediately.' },

  // French, Caro-Kann, Scandinavian
  { moves: ['e4', 'e6', 'd4', 'd5'], eco: 'C00', name: 'French Defense', tip: 'Black constructs a sturdy pawn chain on e6-d5, seeking counterplay on the c-file.' },
  { moves: ['e4', 'e6'], eco: 'C00', name: 'French Defense', tip: 'Prepares an immediate ...d5 central challenge.' },
  { moves: ['e4', 'c6', 'd4', 'd5'], eco: 'B12', name: 'Caro-Kann Defense', tip: 'Ultra-resilient defense preparing ...d5 without trapping the light-squared bishop.' },
  { moves: ['e4', 'c6'], eco: 'B10', name: 'Caro-Kann Defense', tip: 'Solid structure aiming for a clean pawn break.' },
  { moves: ['e4', 'd5', 'exd5', 'Qxd5'], eco: 'B01', name: 'Scandinavian: Main Line', tip: 'Direct center challenge. Queen enters early with active piece play.' },
  { moves: ['e4', 'd5'], eco: 'B01', name: 'Scandinavian Defense', tip: 'Forces White into immediate central decisions on move 1.' },
  { moves: ['e4', 'd6'], eco: 'B07', name: 'Pirc Defense', tip: 'Hypermodern defense allowing White to occupy the center before counter-striking.' },
  { moves: ['e4', 'g6'], eco: 'B06', name: 'Modern Defense', tip: 'Flexible setup focusing on kingside fianchetto and queenside counter-attacks.' },
  { moves: ['e4'], eco: 'B00', name: 'King\'s Pawn Opening', tip: 'Controls central squares d5 and f5 while opening lines for Queen and Bishop.' },

  // D4 Openings
  { moves: ['d4', 'd5', 'c4', 'e6'], eco: 'D30', name: 'Queen\'s Gambit Declined', tip: 'Rock-solid classical setup supporting d5 firmly.' },
  { moves: ['d4', 'd5', 'c4', 'c6'], eco: 'D10', name: 'Slav Defense', tip: 'Protects d5 with the c-pawn, keeping the diagonal open for the bishop on c8.' },
  { moves: ['d4', 'd5', 'c4', 'dxc4'], eco: 'D20', name: 'Queen\'s Gambit Accepted', tip: 'Black accepts temporary pawn advantage to develop rapidly on the queenside.' },
  { moves: ['d4', 'd5', 'c4'], eco: 'D06', name: 'Queen\'s Gambit', tip: 'White offers a flank pawn to gain central space and dominance over d5.' },
  { moves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'], eco: 'D02', name: 'London System', tip: 'A fortress opening with quick piece coordination and reliable pyramid structure.' },
  { moves: ['d4', 'd5'], eco: 'D00', name: 'Closed Game (Queen\'s Pawn)', tip: 'Strategic, positional warfare with closed pawn structures.' },

  // Indian Defenses
  { moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'], eco: 'E60', name: 'King\'s Indian Defense', tip: 'Dynamic fighting defense. Black concedes space to launch a ferocious kingside attack.' },
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'], eco: 'E20', name: 'Nimzo-Indian Defense', tip: 'Black pins the c3 knight to prevent e4 and challenge White\'s pawn structure.' },
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6'], eco: 'E12', name: 'Queen\'s Indian Defense', tip: 'Positional system contesting the crucial e4 outpost via ...Bb7 and ...f5.' },
  { moves: ['d4', 'Nf6', 'c4', 'c5'], eco: 'A56', name: 'Benoni Defense', tip: 'Asymmetric pawn structure where Black trades c-pawn for dynamic queenside counterplay.' },
  { moves: ['d4', 'Nf6', 'c4', 'g6'], eco: 'E60', name: 'King\'s Indian / Grünfeld Setup', tip: 'Prepares kingside fianchetto.' },
  { moves: ['d4', 'Nf6'], eco: 'A45', name: 'Indian Defense', tip: 'Prevents White from immediately playing e4 while keeping options open.' },
  { moves: ['d4', 'f5'], eco: 'A80', name: 'Dutch Defense', tip: 'Uncompromising flank thrust fighting for control over the e4 square.' },
  { moves: ['d4'], eco: 'A40', name: 'Queen\'s Pawn Opening', tip: 'Directly secures d4 and protects against enemy piece intrusion.' },

  // Flank Openings
  { moves: ['c4', 'e5'], eco: 'A20', name: 'English Opening: Reversed Sicilian', tip: 'White plays a Sicilian structure with an extra tempo.' },
  { moves: ['c4'], eco: 'A10', name: 'English Opening', tip: 'Fights for d5 from the flank with flexible pawn transpositions.' },
  { moves: ['Nf3', 'd5', 'g3'], eco: 'A07', name: 'King\'s Indian Attack', tip: 'Universal setup preparing e4 and kingside pressure.' },
  { moves: ['Nf3'], eco: 'A04', name: 'Réti Opening (Zukertort)', tip: 'Flexible development delaying central pawn commitments.' },
  { moves: ['f4'], eco: 'A02', name: 'Bird\'s Opening', tip: 'Aggressive flank opening seizing control of e5.' },
  { moves: ['b3'], eco: 'A01', name: 'Nimzo-Larsen Attack', tip: 'Fianchettoes bishop to b2 to strike against the opposing king.' }
];

class OpeningExplorer {
  static identifyOpening(moveHistory) {
    if (!moveHistory || moveHistory.length === 0) {
      return {
        name: "Standard Initial Position",
        eco: "A00",
        tip: "All 32 pieces deployed. Control the 4 central squares (e4, d4, e5, d5) and develop minor pieces.",
        movesCount: 0
      };
    }

    const sans = moveHistory.map(m => m.san);

    // Find deepest matching opening
    let bestMatch = null;
    let maxMatchLen = -1;

    for (const op of OPENINGS_DATABASE) {
      if (op.moves.length <= sans.length) {
        let match = true;
        for (let i = 0; i < op.moves.length; i++) {
          if (op.moves[i] !== sans[i]) {
            match = false;
            break;
          }
        }
        if (match && op.moves.length > maxMatchLen) {
          bestMatch = op;
          maxMatchLen = op.moves.length;
        }
      }
    }

    if (bestMatch) {
      return {
        name: bestMatch.name,
        eco: bestMatch.eco,
        tip: bestMatch.tip,
        movesCount: bestMatch.moves.length
      };
    }

    return {
      name: `Custom Game (${sans.length} ply played)`,
      eco: 'Custom',
      tip: 'Transitioning through custom opening lines. Maintain king safety and piece coordination.',
      movesCount: sans.length
    };
  }
}

window.OpeningExplorer = OpeningExplorer;
