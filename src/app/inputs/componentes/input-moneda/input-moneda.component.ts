import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-moneda',
  templateUrl: './input-moneda.component.html',
  styleUrls: ['./input-moneda.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMonedaComponent),
      multi: true
    }
  ]
})
export class InputMonedaComponent implements OnInit, ControlValueAccessor{
  @Input() cantidadDecimales: number = 0;
  @Input() valorInicial: string | number | null = null;
  @Input() placeholder: string = "";
  @Input() maxlength: number = 18;
  valor: number | null = null;
  valorInput: string = ""
  valorAnterior: string = ""
  deshabilitado: boolean = false
  regex: RegExp

  constructor() {
    // Se ajusta realmente en ngOnInit según cantidadDecimales
    this.regex = new RegExp(`^[0-9]+(\\.[0-9]*)?$`)
  }

  ngOnInit(): void {
    // Construye un regex válido incluso cuando cantidadDecimales = 0
    if (this.cantidadDecimales && this.cantidadDecimales > 0) {
      this.regex = new RegExp(`^[0-9]+(\\.[0-9]{0,${this.cantidadDecimales}})?$`)
    } else {
      this.regex = new RegExp(`^[0-9]+$`)
    }
    this.valorInput = this.valorInicial !== null ? this.formatear(this.valorInicial.toString()) : "";
    // Mantiene el mismo formato visual como valor anterior para evitar saltos al invalidar
    this.valorAnterior = this.valorInput;
  }

  formatear(valor: string) {
    // No usar Number() para evitar notación científica y redondeos
    // Limpia comas y espacios
    valor = (valor ?? '').toString().replace(/,/g, '').trim();
    if (valor === '') return '';

    // Permite sólo dígitos y un punto decimal
    // (si existe más de un punto, se ignoran los adicionales en el formateo)
    let cleaned = valor.replace(/[^\d.]/g, '');
    const firstDot = cleaned.indexOf('.');

    const formatMiles = (digits: string) => {
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    if (firstDot !== -1) {
      // Partes entero y decimal
      const intRaw = cleaned.slice(0, firstDot).replace(/\D/g, '');
      let decRaw = cleaned.slice(firstDot + 1).replace(/\D/g, '');
      // Limita la longitud de decimales
      if (this.cantidadDecimales > 0) {
        decRaw = decRaw.slice(0, this.cantidadDecimales);
      } else {
        decRaw = '';
      }

      const intFormatted = formatMiles(intRaw);
      // Si hay decimales o el usuario acaba de escribir el punto y se permiten decimales, conserva el punto
      if (decRaw !== '' || (valor.endsWith('.') && this.cantidadDecimales > 0)) {
        return `${intFormatted}.${decRaw}`;
      }
      return intFormatted;
    } else {
      const intRaw = cleaned.replace(/\D/g, '');
      return formatMiles(intRaw);
    }
  }

  desformatear(valor: string) {
    return valor.replace(/,/g, "")
  }

  alCambiarValor(valor: string) {
    // Remueve comas y limpia caracteres inválidos, permitiendo sólo un punto
    let crudo = (valor ?? '').toString().replace(/,/g, '').trim();
    crudo = crudo.replace(/[^\d.]/g, '');
    const dotIndex = crudo.indexOf('.');
    if (dotIndex !== -1) {
      // Elimina puntos adicionales dejando sólo el primero
      crudo = crudo.slice(0, dotIndex + 1) + crudo.slice(dotIndex + 1).replace(/\./g, '');
    }

    if (!this.regex.test(crudo) && crudo !== "") {
      this.valorInput = this.valorAnterior;
      return;
    }

    this.valorInput = this.formatear(crudo);
    this.valorAnterior = this.valorInput;

    const sinComas = this.desformatear(this.valorInput);
    this.valor = sinComas !== "" ? Number(sinComas) : null;
    this.onChange(this.valor);
  }

  //NgValueAccesor Interface
  onChange = (valor: number | null) => { }

  onTouched = () => { }

  writeValue(valor: number): void {
    this.valor = valor
    if(valor){this.valorInput = this.formatear(valor.toString())}
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.deshabilitado = isDisabled
  }

}
