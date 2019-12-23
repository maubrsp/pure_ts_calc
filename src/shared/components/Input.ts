import {
  State,
  SimuleAntecipacaoInputs,
  SimuleAntecipacaoOutputs,
  SimuleAntecipacaoState
} from "../../core/State";

export class Input {
  private currentState: SimuleAntecipacaoState;
  public domChildNode: HTMLElement;
  private parent: HTMLFormElement;
  private config: any;
  private formIten: HTMLElement;
  private label: HTMLElement;
  private input: HTMLInputElement;
  private inputText: HTMLElement;
  private info: HTMLElement;
  private data: any;
  private changeTimeout: any;

  private _value: string = "";
  /**
   * Get/Set Trata o valor setado pelo usuário, armazena na memoria e atualiza o input com valor formatado conforme o tipo
   */
  public get value(): string {
    return this._value;
  }

  public set value(val: string) {
    const intVal = parseFloat(val.replace(",", "."));
    if (this.config.type === "currency") {
      this.input.value = isNaN(intVal)
        ? ""
        : intVal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          });
      this._value = isNaN(intVal)
        ? ""
        : parseFloat(intVal.toString()).toFixed(2);
    } else if (this.config.type === "range") {
      this.input.value = val;
      this._value = val;
    }
  }

  /**
   * Inicializa Simula Antecipacao
   * @returns {boolean}
   */
  public async init(
    parent: HTMLFormElement,
    state: SimuleAntecipacaoState,
    config: any
  ) {
    try {
      this.currentState = state;
      this.parent = parent;
      this.config = config;
      this.domChildNode = await this.updateValues(this.currentState);
      return this;
    } catch (error) {
      return error;
    }
  }

  /**
   * Adiciona ao dom os elementos necessários conforme congfiguração
   * @param values configurações do input
   */
  private async render(values?: any): Promise<HTMLElement> {
    if (this.domChildNode) {
      return this.domChildNode;
    }
    this.formIten = await this.createContainer();
    this.label = await this.createLabel(this.formIten);
    this.input = await this.createInput(this.formIten);
    this.input.addEventListener("input", (event: InputEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      if (
        !parseInt(event.data) &&
        event.data !== "," &&
        this.config.type === "currency"
      ) {
        this.value = this.getNumberFromCurrency(this.input.value);
        return;
      } else if (this.config.type === "range") {
        const values = this.config.range.split(",");
        if (parseInt(values[1]) <= parseInt(this.input.value)) {
          this.value = values[1];
        } else if (parseInt(values[0]) >= parseInt(this.input.value)) {
          this.value = values[0];
        }
      }

      this.onInputChange(event);
    });
    this.info = await this.createInfo(this.formIten);

    return this.formIten;
  }

  /**
   * Converte o valor em string de um número válido
   * @param value
   */
  private getNumberFromCurrency(value: string): string {
    value = value.replace(/[^0-9,]/g, "");
    return value;
  }

  /**
   * Trata delay de digutação contínua e atualiza valor do input
   * @param {InputEvent} event
   */
  private onInputChange(event: InputEvent) {
    if (this.changeTimeout) {
      clearTimeout(this.changeTimeout);
    }

    this.changeTimeout = setTimeout(() => {
      if (this.config.type === "currency") {
        this.value =
          event.data === null
            ? this.value
            : this.getNumberFromCurrency(this.input.value);
      } else if (
        this.config.type === "range" &&
        this.value !== this.input.value
      ) {
        this.value = this.input.value;
      }
      this.domChildNode.dispatchEvent(
        new CustomEvent("change", {
          detail: { prop: this.config.stateProp, value: parseFloat(this.value) }
        })
      );
    }, 600);
  }

  /**
   * Cria div para o input
   */
  private async createContainer(): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const container = document.createElement("div");
      container.classList.add("simula_antecipacao_form_input");
      container.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(container);
      });
      this.parent.appendChild(container);
    });
  }

  /**
   * Cria label para o input
   * @param {HTMLElement} container parent onde elemento será adicionado
   * @returns {HTMLElement} title/label
   */
  private async createLabel(container: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const title: HTMLElement = document.createElement("spam");
      title.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(title);
      });
      container.appendChild(title);
    });
  }

  /**
   * Cria input
   * @param {HTMLElement} container parent onde elemento será adicionado
   * @returns {HTMLInputElement} input
   */
  private async createInput(container: HTMLElement): Promise<HTMLInputElement> {
    return new Promise((resolve, reject) => {
      const input: HTMLInputElement = document.createElement("input");
      if (this.config.type === "currency") {
        input.type = "text";
      } else if (this.config.type === "range") {
        input.type = "number";
        const rangeValues = this.config.range.split(",");
        input.min = rangeValues[0];
        input.max = rangeValues[1];
        input.step = "1";
      }
      input.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(input);
      });
      container.appendChild(input);
    });
  }

  /**
   * Cria campo de informações adicionais, errors e feedbacks ao usuário
   * @param {HTMLElement} container parent onde elemento será adicionado
   * @returns {HTMLElement} text
   */
  private async createInfo(container: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const info: HTMLElement = document.createElement("spam");
      info.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(info);
      });
      container.appendChild(info);
    });
  }

  /**
   * Atualiza valores do campo
   * @param values
   */
  async updateValues(values: any): Promise<HTMLElement> {
    const child = await this.render(values);
    this.label.innerText = this.config.label;
    if (this.config.info) {
      this.info.innerText = this.config.info;
    }
    if (values) {
      this.value = values;
    }
    return child;
  }
}

export default Input;
