import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

let INPUT_ELEMENT: HTMLInputElement;
let PREVIEW_ELEMENT: HTMLInputElement;
let PREV_SYMBOL: string;
let HAS_CALCULATED: boolean = true;
let STACK: number;

@Component({
  selector: 'app-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent implements OnInit {
  // initializetion
  ngOnInit(): void {
    this.handleOnLoad();
  }

  addFigure(numVal: string): string {
    // 空の場合そのまま返却
    if (numVal == '') {
      return '';
    }
    // 全角から半角へ変換し、既にカンマが入力されていたら事前に削除
    numVal = numVal.replace(/,/g, '').trim();
    // 数値でなければそのまま返却
    if (!/^[+|-]?(\d*)(\.\d*)?$/.test(numVal)) {
      return numVal;
    }
    // 整数部分と小数部分に分割
    const numData: string[] = numVal.toString().split('.');
    // 整数部分を3桁カンマ区切りへ
    numData[0] = Number(numData[0])
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // 小数部分と結合して返却
    return numData.join('.');
  }

  delFigure(strVal: string): string {
    return strVal.replace(/,/g, '');
  }

  handleOnLoad = () => {
    INPUT_ELEMENT = document.getElementById('input') as HTMLInputElement;
    PREVIEW_ELEMENT = document.getElementById('preview') as HTMLInputElement;
    const deleteButton: HTMLDivElement = document.getElementById('circle') as HTMLDivElement;
    const buttonContainer: HTMLDivElement = document.getElementById('buttons') as HTMLDivElement;
    const buttons: HTMLLinkElement[] = (buttonContainer.getElementsByTagName(
      'a'
    ) as unknown) as HTMLLinkElement[];
  
    for (let i: number = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', this.handleOnButtonClick);
    }
    deleteButton.addEventListener('click', this.handleOnDeleteClick);
  };

  handleOnDeleteClick = (): void => {
    let value: string = INPUT_ELEMENT.value;
    value = value.slice(0, -1);
    INPUT_ELEMENT.value = this.addFigure(value);
  };

  handleOnButtonClick = (event: MouseEvent): void => {
    let value: string = INPUT_ELEMENT.value;
    let text: string = (event.currentTarget as HTMLLinkElement).textContent!.replace(/\s+/g, '');
    if (value === 'overFlow') {
      return;
    }
    if (HAS_CALCULATED) {
      //初期化された状態
      switch (text) {
        case 'C':
          this.reset();
          break;
        case '.':
          if (value.indexOf('.') === -1) {
            INPUT_ELEMENT.value += '.';
          }
          break;
        case '=':
          break;
        case '÷':
        case '×':
        case '-':
        case '+':
          this.removeSelect();
          ((event.currentTarget as HTMLLinkElement).parentElement as HTMLDivElement).classList.add(
            'select'
          );
          if (value.split('.')[0].length > 13 || value === '') {
            this.removeSelect();
            return;
          } else {
            STACK = parseFloat(this.delFigure(value));
            PREV_SYMBOL = text;
            PREVIEW_ELEMENT.value = value;
            INPUT_ELEMENT.value = '';
            HAS_CALCULATED = false;
          }
          break;
        default:
          this.addNumber(text);
      }
    } else {
      let result: number | string | void;
      switch (text) {
        case 'C':
          this.reset();
          this.removeSelect();
          break;
        case '.':
          if (value.indexOf('.') === -1) {
            INPUT_ELEMENT.value += '.';
          }
          break;
        case '=':
          PREVIEW_ELEMENT.value = '';
          INPUT_ELEMENT.value = this.addFigure(String(this.math(PREV_SYMBOL, parseFloat(this.delFigure(value)))));
          // STACK = 0;
          PREV_SYMBOL = text;
          HAS_CALCULATED = true;
          this.removeSelect();
          // TODO: inputElementの削除アニメーション作成
          break;
        case '÷':
        case '×':
        case '-':
        case '+':
          this.removeSelect();
          ((event.currentTarget as HTMLLinkElement).parentElement as HTMLDivElement).classList.add(
            'select'
          );
          if (value === '') {
            PREV_SYMBOL = text;
            break;
          }
          result = this.math(PREV_SYMBOL, parseFloat(this.delFigure(value)));
          if (result === null || result === undefined) {
            result = 'error';
          } else {
            STACK = result as number;
            PREV_SYMBOL = text;
            INPUT_ELEMENT.value = '';
          }
          PREVIEW_ELEMENT.value = this.addFigure(String(result));
          break;
        default:
          this.addNumber(text);
          result = this.math(PREV_SYMBOL, parseFloat(this.delFigure(value)));
          if (result !== null || result !== undefined) {
            result = 'error';
          } else {
            if (result > 10 * 13) {
              result = 'overflow';
            } else {
              STACK = result as number;
            }
          }
          PREVIEW_ELEMENT.value = this.addFigure(String(result));
          PREVIEW_ELEMENT.value = this.addFigure(
            String(this.math(PREV_SYMBOL, parseFloat(this.delFigure(INPUT_ELEMENT.value))))
          );
      }
    }
  };

  // remove select
  removeSelect = (): void => {
    const buttonContainer: HTMLDivElement = document.getElementById('buttons') as HTMLDivElement;
    const buttons: HTMLLinkElement[] = (buttonContainer.getElementsByTagName(
      'div'
    ) as unknown) as HTMLLinkElement[];
  
    for (let i: number = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('select');
    }
  };

  // reset
  reset = (): void => {
    INPUT_ELEMENT.value = '0';
    PREVIEW_ELEMENT.value = '';
    STACK = 0;
    PREV_SYMBOL = '';
    HAS_CALCULATED = true;
  };

  // add
  addNumber = (num: string): void => {
    const integerPart: string = INPUT_ELEMENT.value.split('.')[0];
    const decimalPart: string = INPUT_ELEMENT.value.split('.')[1];
    // 少数部分: 最大8桁
    if (INPUT_ELEMENT.value.indexOf('.') !== -1) {
      if (decimalPart.length < 8) {
      INPUT_ELEMENT.value = this.addFigure(INPUT_ELEMENT.value + num);
      }
    }
    // 整数部分: 最大13桁
    else if (integerPart.length < 13) {
      INPUT_ELEMENT.value = this.addFigure(INPUT_ELEMENT.value + num);
    }
  };

  // 計算用
  math = (symbol: string, num: number): number | void => {
    switch (symbol) {
      case '÷':
        return STACK / num;
      case '×':
        return STACK * num;
      case '-':
        return STACK - num;
      case '+':
        return STACK + num;
      default:
        return;
    }
  };
}