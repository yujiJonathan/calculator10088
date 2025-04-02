import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  // properties
  title = 'Calculator';
  display = '';

  // add num to display
  appendInput(value: string): void {
    if (this.display.length >= 12) return;

    this.display += value;
  }

  // clear display
  clear(): void {
    this.display = '';
  }

  // calculate
  calculateEvent(): void {
    if (this.display.trim() === '') return;

    try {
      // 最後の文字が演算子かどうかをチェック
      const lastChar = this.display.slice(-1);
      const isOperator = /[+\-×÷]$/.test(lastChar);
      // × を * に、÷ を / に置換
      const expression = this.display.replace(/×/g, '*').replace(/÷/g, '/');

      // 演算子で終わる場合は計算せず,そのまま返す
      if (isOperator) return;

      // const result = evaluate(expression).toString();
      const result = eval(expression);

      // if (result.indexOf('.')) {
      //   this.display = this.truncateDecimal(result, 8);
      // } else {
      //   this.display = this.truncateInteger(result, 12);
      // }

      this.display = result;
    } catch(e) {
      this.display = '';
    }
  }

  // max decimal : 8
  // // [WIP]小数点最大値8位まで表示する処理↓
  private truncateDecimal(value: string, maxDecimal: number): string {
    const decimal = value.indexOf('.');
    if (decimal === -1) return value;
    const integerPart = value.substring(0, decimal + 1);
    const decimalPart = value.substring(decimal + 1, decimal + 1 + maxDecimal);

    return integerPart + decimalPart;
  }

  // max integer：12
      // [WIP]10億の桁まで計算可能にする処理
  private truncateInteger(value: string, maxInteger: number): string {
    const integerPart = value.split('.')[0];
    if (integerPart.length > maxInteger) {

      return integerPart.substring(0, maxInteger);

    }

    return value;
  }
}