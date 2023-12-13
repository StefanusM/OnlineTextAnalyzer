import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const emptyVowelsCountMap = new Map<string, number>([
  ['A', 0],
  ['E', 0],
  ['I', 0],
  ['O', 0],
  ['U', 0]
])

const emptyConsonantsCountMap = new Map<string, number>([
  ['B', 0],
  ['C', 0],
  ['D', 0],
  ['F', 0],
  ['G', 0],
  ['H', 0],
  ['J', 0],
  ['K', 0],
  ['L', 0],
  ['M', 0],
  ['N', 0],
  ['P', 0],
  ['Q', 0],
  ['R', 0],
  ['S', 0],
  ['T', 0],
  ['V', 0],
  ['W', 0],
  ['X', 0],
  ['Y', 0],
  ['Z', 0],
])

@Injectable({
  providedIn: 'root'
})
export class TextAnalyzerService {
  constructor(private http: HttpClient) {}
  
  /**
   * Counts the number of times that either each vowel or each consonats is present in the text.
   * @param text The text to analyze
   * @param vowels defines if vowels or consonants are anlyzed (true = vowels, false = consonants)
   * @returns a Map that contains all vowels or consonants as keys and their counts as values
   */
  analyzeTextLocal(text: string, vowels: boolean) : Map<string, number> {
    return vowels ? this.analyzeTextForVowels(text) : this.analyzeTextForConsonants(text)
  }

  /**
   * Counts the number of times that each vowels is present in the text.
   * @param text The text to analyze
   * @returns a Map that contains all vowels as keys and their counts as values
   */
  analyzeTextForVowels(text: string) : Map<string, number> {
    let vowelsCountMap = new Map<string, number>(emptyVowelsCountMap);

    this.analyzeTextForMap(text, vowelsCountMap);

    return vowelsCountMap;
  }

  /**
   * Counts the number of times that each consonant is present in the text.
   * @param text The text to analyze
   * @returns a Map that contains all consonants as keys and their counts as values
   */
  analyzeTextForConsonants(text: string) : Map<string, number> {
    let consonantsCountMap = new Map<string, number>(emptyConsonantsCountMap);

    this.analyzeTextForMap(text, consonantsCountMap);

    return consonantsCountMap;
  }

  /**
   * Counts the number of times that the Characters, which are keys in the map, are present in the text.
   * @param text the text to analyze
   * @param emptyMap an HashMap with the concerned characters that should be counted as Keys and zero as the values
   * @returns a Map that contains the same characters as key as the emptyMap does with the counts of the letters as values
   */
  analyzeTextForMap(text: string, emptyMap: Map<string, number>){
    text = text.toUpperCase();
    Array.from(text).forEach(char => {
      const currentCount = emptyMap.get(char);
      if(currentCount !== undefined && currentCount !== null){
        emptyMap.set(char, currentCount + 1);
      }
    })
    
    return emptyMap;
  }

  /**
   * Sends a request to the server to count either consonants or vowels in the text
   * @param text the text to analyze
   * @param vowels defines if vowels or consonants are anlyzed (true = vowels, false = consonants)
   * @returns the response of the server which should contain a Map of the consonants or vowels with their counts
   */
  analyzeTextOnServer(text: string, vowels:boolean) {
    return vowels ? this.analyzeTextForVowelsOnServer(text) : this.analyzeTextForConsonantsOnServer(text);
  }

  /**
   * Sends a request to the server to count vowels in the text
   * @param text the text to analyze
   * @returns the response of the server which should contain a Map of vowels with their counts
   */
  analyzeTextForVowelsOnServer(text: string) {
    return this.http.post('http://localhost:8080/analyzeVowels', text);
    
  }

  /**
   * Sends a request to the server to count consonants in the text
   * @param text the text to analyze
   * @returns the response of the server which should contain a Map of consonants with their counts
   */
  analyzeTextForConsonantsOnServer(text: string) {
    return this.http.post('http://localhost:8080/analyzeConsonants', text);
  }

}
