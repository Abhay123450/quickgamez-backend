import { Filter } from "bad-words";

const hindiBadWords: string[] = [
    // "bhenchod" variations
    "bhenchod",
    "behnchod",
    "bhen ch*d",
    "bhench*d",
    "bhenc**d",
    "bhnchd",
    "bhnch*d",
    "bhench0d",
    "bhenchud",
    "bhnchod",
    "bhnchud",
    "bhnc0d",
    "bhe*nchod",
    "b3hnchod",

    // "madarchod" variations
    "madarchod",
    "madar ch*d",
    "madarch*d",
    "m*darchod",
    "mdrchd",
    "madarch0d",
    "madrchud",
    "m@darchod",
    "m@drchod",
    "maadarchod",
    "maadarchod",
    "madarchoot",

    // Short forms
    "mc",
    "bc",
    "m c",
    "b c",
    "m@c",
    "b@c",
    "m-c",
    "b-c",

    // "chutiya" variations
    "chutiya",
    "chutya",
    "ch*tiya",
    "ch**iya",
    "chootiya",
    "ch00tiya",
    "chotiya",
    "chuty@",
    "chu***a",
    "chutiy@",
    "chutyia",
    "chutiaa",

    // Sexual terms
    "chodd",
    "chod",
    "ch*d",
    "ch0d",
    "chodna",
    "choda",
    "chudai",
    "chudana",
    "chodne",
    "chudwane",
    "chudwaye",
    "ch*dwaya",

    // Genital references
    "lund",
    "l*nd",
    "l***",
    "lundra",
    "l0nd",
    "loond",
    "londa",
    "lauda",
    "lawda",
    "la*da",
    "l***a",

    // Anus-related
    "gaand",
    "gand",
    "gaandu",
    "gandu",
    "g*ndu",
    "g***du",
    "g@ndu",
    "g@andu",
    "gandu*",
    "ganndu",

    // "suar" variations
    "suar",
    "sooar",
    "suwar",
    "suvar",
    "swar",
    "su@r",
    "swine",
    "swr",

    // "harami" & similar
    "haraami",
    "harami",
    "haraamzade",
    "haramzade",
    "haraami ke",
    "haraam ka",
    "h@rami",
    "h@raami",
    "h@ramzade",

    // Animal insults
    "kutte",
    "kuttiya",
    "kutti",
    "kaminey",
    "kutta",
    "kuttiya",
    "kamine",
    "kamin@",

    // "randi" / prostitute slurs
    "r***i",
    "raand",
    "raandii",
    "randi",
    "r**di",
    "raandi",
    "ra@ndi",
    "r@ndi",
    "r*ndi",

    // Slurs like "saala"
    "saala",
    "sala",
    "saalaa",
    "s@la",
    "sa@la",
    "salaa",
    "saaaala",

    // Pimp-related
    "bhadwa",
    "bhadve",
    "bhadwaa",
    "bhadw@",
    "bhadva",
    "bh@dwa",

    // Other common Hindi slurs
    "chinal",
    "ch***l",
    "chinnal",
    "ch1nal",
    "chynal",
    "ch@nal",
    "rakhail",
    "rakhel",
    "r@khail",
    "r@khel",
    "rakel",

    // Insulting mother/sister phrases
    "teri maa",
    "teri behan",
    "maa ka",
    "behan ka",
    "maa chudaye",
    "behan chudaye",
    "maa ki",
    "behan ki",
    "m@a ki",
    "bhn ki",
    "maaki",
    "bhnki",
    "m*k",
    "b*k"
];

export function censorBadWords(text: string): string {
    const filter = new Filter();
    filter.addWords(...hindiBadWords);
    return filter.clean(text);
}
