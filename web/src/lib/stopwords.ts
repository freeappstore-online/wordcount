// Common English stop words for frequency filtering.
// Source: union of NLTK/MIT-style lists, trimmed to high-signal exclusions.
export const STOP_WORDS: ReadonlySet<string> = new Set([
  "a", "an", "the", "and", "or", "but", "if", "while", "with", "of", "at",
  "by", "for", "to", "from", "in", "into", "on", "off", "out", "over",
  "under", "again", "further", "then", "once", "is", "am", "are", "was",
  "were", "be", "been", "being", "have", "has", "had", "having", "do",
  "does", "did", "doing", "will", "would", "shall", "should", "can",
  "could", "may", "might", "must", "ought", "i", "me", "my", "mine",
  "myself", "we", "us", "our", "ours", "ourselves", "you", "your", "yours",
  "yourself", "yourselves", "he", "him", "his", "himself", "she", "her",
  "hers", "herself", "it", "its", "itself", "they", "them", "their",
  "theirs", "themselves", "what", "which", "who", "whom", "whose", "this",
  "that", "these", "those", "as", "until", "because", "so", "than", "too",
  "very", "just", "also", "no", "nor", "not", "only", "own", "same", "such",
  "s", "t", "d", "ll", "m", "o", "re", "ve", "y", "ain", "aren", "couldn",
  "didn", "doesn", "hadn", "hasn", "haven", "isn", "ma", "mightn", "mustn",
  "needn", "shan", "shouldn", "wasn", "weren", "won", "wouldn",
  "about", "above", "after", "before", "below", "between", "during", "down",
  "up", "here", "there", "when", "where", "why", "how", "all", "any",
  "both", "each", "few", "more", "most", "other", "some",
]);

export function isStopWord(w: string): boolean {
  return STOP_WORDS.has(w.toLowerCase());
}
