import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TextAnalyzerService } from './service/text-analyzer.service';
import { ToastrService } from 'ngx-toastr';

type ResultType = {
  date: Date,
  isVowels: boolean,
  online: boolean,
  input: string,
  output: Map<string, number>,
}

@Component({
  selector: 'app-text-analyzer',
  templateUrl: './text-analyzer.component.html',
  styleUrl: './text-analyzer.component.css'
})

export class TextAnalyzerComponent {
  form: FormGroup;
  isOnline: boolean = false;
  isVowels: boolean = false;
  showZeros: boolean = false;
  results: Array<ResultType> = new Array();

  constructor(private fb: FormBuilder, private textAnalyzerService: TextAnalyzerService, private toastr: ToastrService) {
    this.form = this.fb.group({
      text:['']
    });
  }

  /**
   * Analyzes the user input in the textfield based on the settings.
   * If this.online is true the analyzis is done on the server, otherwise it is done local.
   * If the input is empty, a toast is shown to the user that asks him to enter a text.
   * The result is added to this.results
   */
  analyzeText() {
    const text : string = this.form.get('text')?.value;

    if(text.length == 0) {
      this.toastr.warning('Please enter a text to analyze', 'Empty Text');
    } else {

      const analyzeVowels = this.isVowels;
      const analyzeOnline = this.isOnline; 
      
      let self = this
      if(this.isOnline) {

        this.textAnalyzerService.analyzeTextOnServer(text, analyzeVowels).subscribe({
          next(value) {
            self.results.push({
              date: new Date(),
              isVowels: analyzeVowels,
              online: analyzeOnline,
              input: text,
              output: new Map<string, number>(Object.entries(value))
              });
          },
          error(err) {
            self.createErrorMessage(err);
            console.error(err);
          }
        })
      } else {
        const result = this.textAnalyzerService.analyzeTextLocal(text, analyzeVowels);
        this.results.push({
          date: new Date(),
          isVowels: analyzeVowels,
          online: analyzeOnline,
          input: text,
          output: result
        });
      }
    }
  }


  /**
   * Creates a readable string from the result object
   * @param result A Result Object from the Text Analyzis
   * @returns the readable string
   */
  resultToString(result: ResultType) : string {
    let filteredOutput = new Map<string, number>();

    let resultString = result.date.toLocaleTimeString() + ": \"" + result.input + "\" ";
    resultString += result.isVowels ? " Vowels " : " Consonats ";
    resultString += result.online ? "(online) = " : "= ";

    if(!this.showZeros) {
      result.output.forEach((value, key) => {
        if(value > 0){
          filteredOutput.set(key, value);
        }
      })
    } else {
      filteredOutput = result.output
    }
    filteredOutput.forEach((value, character, resultMap) => {
      resultString += " " + character + ": " + value;
    })

    return resultString;
  }

    /**
   * Takes an Error from the http Request and creates a Error Message for the User
   * @param error The error from the response of the server
   */
  // tslint:disable-next-line:typedef
  private createErrorMessage(error: any) {
    let errorMessage = '';
    if (error.status === 0) {
      errorMessage = 'The backend seems not to be reachable.';
    } else {
      errorMessage = 'There seems to be a problem with the server.';
    }
    this.toastr.error(errorMessage, 'An Error occured!');
  }


}
