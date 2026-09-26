export type HFItem = {
  id: string; // ar5entum/<repo>
  kind: "model" | "dataset";
  title: string;
  blurb: string;
  tags: string[];
};

export const opensource: HFItem[] = [
  {
    id: "ar5entum/marianMT_hin_eng_cs",
    kind: "model",
    title: "Hindi → Hinglish code-switch",
    blurb: "MarianMT fine-tuned to keep Hindi words in Devanagari and romanise English ones. BLEU 77.9 on a self-curated 100k set.",
    tags: ["MarianMT", "code-switching"],
  },
  {
    id: "ar5entum/marianMT_bi_dev_rom_tl",
    kind: "model",
    title: "Bidirectional Devanagari ↔ Roman",
    blurb: "One MarianMT model that transliterates in both directions.",
    tags: ["MarianMT", "transliteration"],
  },
  {
    id: "ar5entum/bart_rom_dev_tl",
    kind: "model",
    title: "Roman → Devanagari",
    blurb: "BART transliteration model, Roman script in, Devanagari out.",
    tags: ["BART", "transliteration"],
  },
  {
    id: "ar5entum/bart_dev_rom_tl",
    kind: "model",
    title: "Devanagari → Roman",
    blurb: "BART transliteration model, the reverse direction.",
    tags: ["BART", "transliteration"],
  },
  {
    id: "ar5entum/bart_eng_hin_mt",
    kind: "model",
    title: "English → Hindi",
    blurb: "BART machine translation.",
    tags: ["BART", "translation"],
  },
  {
    id: "ar5entum/bart_hin_eng_mt",
    kind: "model",
    title: "Hindi → English",
    blurb: "BART machine translation.",
    tags: ["BART", "translation"],
  },
  {
    id: "ar5entum/hindi-english-code-mixed",
    kind: "dataset",
    title: "Hindi–English code-mixed corpus",
    blurb: "100k verified rows pairing Devanagari Hindi with its code-mixed form.",
    tags: ["dataset", "100k rows"],
  },
  {
    id: "ar5entum/hindi-english-roman-devnagiri-transliteration-corpus",
    kind: "dataset",
    title: "Roman ↔ Devanagari transliteration corpus",
    blurb: "Parallel transliteration pairs used to train the models above.",
    tags: ["dataset", "transliteration"],
  },
];

export const projects = [
  {
    title: "Semantic segmentation of plants",
    blurb: "Detectron2 and YOLOv8 segmenting leaves, fruits and flowers on a hand-labelled dataset.",
    href: "https://www.kaggle.com/code/ar5entum/semantic-segmentation-of-plants-with-detectron-2",
    year: "2023",
  },
  {
    title: "Brain tumor detection on MRI",
    blurb: "PyTorch CNN on 12k scans, wrapped in an Electron + Flask app.",
    href: "https://github.com/ar5entum",
    year: "2023",
  },
  {
    title: "Cancer data PCA + SVC",
    blurb: "97% accuracy classifier, with the PCA walk-through.",
    href: "https://www.kaggle.com/code/ar5entum/cancer-data-pca-with-svc-97-accuracy",
    year: "2023",
  },
];
