import { TestBed } from '@angular/core/testing';

import { TextAnalyzerService } from './text-analyzer.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('TextAnalyzerService', () => {
  let service: TextAnalyzerService;
  let httpMock: HttpClientTestingModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TextAnalyzerService);
    httpMock = TestBed.inject(HttpClientTestingModule)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('local vowel analyzis should return zero on empty text', () => {
    const result = service.analyzeTextLocal('', true);
    result.forEach((value) => {
      expect(value).toBe(0);
    })
  })

  it('local consonant analyzis should return zero on empty text', () => {
    const result = service.analyzeTextLocal('', false);
    result.forEach((value) => {
      expect(value).toBe(0);
    })
  })

  it('local vowel analyzis of only consonants and special characters should return zeros', () => {
    const result = service.analyzeTextLocal('bcdfghjklm;.+#?ß&21npqrstvwxyz', true);
    result.forEach((value) => {
      expect(value).toBe(0);
    })
  })

  it('local consonats analyzis of only vowels and special characters should return zeros', () => {
    const result = service.analyzeTextLocal('bcDfGHjklm;.+#?ß&21npQRsTVWxzy', true);
    result.forEach((value) => {
      expect(value).toBe(0);
    })
  })

  it('local vowels analyzis of text should return the right counts', () => {
    const result = service.analyzeTextLocal('bcdF?egHJak&lM*OnPäQorÖsTvÜWXi#yzBßUCD§fGhe!jKuL.mNi-pqRSetVEwxYZvuvsnwqrSs', true);
    result.forEach((value, key) => {
      switch(key){
        case 'A':
          expect(value).toBe(1);
          break;
        case 'E':
          expect(value).toBe(4);
          break;
        case 'I':
        case 'O':
          expect(value).toBe(2);
          break;
        case 'U':
          expect(value).toBe(3);
          break;
      }
    })
  })

  it('local consonat analyzis of text should return the right counts', () => {
    const result = service.analyzeTextLocal('bcdF?egHJak&lM*OnPäQorÖsTvÜWXi#yzBßUCD§fGhe!jKuL.mNi-pqRSetVEwxYZvuvsnwqrSs', false);
    result.forEach((value, key) => {
      switch(key){
        case 'B':
        case 'C':
        case 'D':
        case 'F':
        case 'G':
        case 'H':
        case 'J':
        case 'K':
        case 'L':
        case 'M':
        case 'P':
        case 'T':
        case 'X':
        case 'Y':
        case 'Z':
          expect(value).toBe(2);
          break;
        case 'N':
        case 'Q':
        case 'R':
        case 'W':
          expect(value).toBe(3);
          break;
        case 'V':
          expect(value).toBe(4);
          break;
        case 'Y':
          expect(value).toBe(7);
          break;
      }
    })
  })

});
