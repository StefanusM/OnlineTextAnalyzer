import { Pipe, PipeTransform } from '@angular/core';
import {ResultType} from "../text-analyzer/text-analyzer.component";

@Pipe({
  name: 'resultToString'
})
export class ResultToStringPipe implements PipeTransform {

  /**
   * Creates a readable string from the result object
   * @param value Result Object from the Text Analysis
   * @param showZeros Should the zero values be shown or not
   */
  transform(value: ResultType, showZeros: boolean): string {
    let filteredOutput = new Map<string, number>();

    let resultString = value.date.toLocaleTimeString() + ": \"" + value.input + "\" ";
    resultString += value.isVowels ? " Vowels " : " Consonants ";
    resultString += value.online ? "(online) = " : "= ";

    if(!showZeros) {
      value.output.forEach((value, key) => {
        if(value > 0){
          filteredOutput.set(key, value);
        }
      })
    } else {
      filteredOutput = value.output
    }
    filteredOutput.forEach((value, character, resultMap) => {
      resultString += " " + character + ": " + value;
    })

    return resultString;
  }

}
