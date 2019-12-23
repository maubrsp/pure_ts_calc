import {
  State,
  SimuleAntecipacaoInputs,
  SimuleAntecipacaoOutputs,
  SimuleAntecipacaoState
} from "../../core/State";

export class ResultIten {
  private currentState: number;
  private domChildNode: HTMLElement;
  private parent: HTMLElement;
  private resultIten: HTMLElement;
  private label: HTMLElement;
  private input: HTMLElement;
  private info: HTMLElement;
  private config: any;

  /**
   * Inicializa Simula Antecipacao
   * @returns {boolean}
   */
  public async init(parent: HTMLElement, state: number, config: any) {
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

  private async render(values?: any): Promise<HTMLElement> {
    if (this.domChildNode) {
      return this.domChildNode;
    }
    this.resultIten = await this.createContainer();
    this.label = await this.createLabel(this.resultIten);
    this.input = await this.createInput(this.resultIten);

    return this.resultIten;
  }

  private async createContainer(): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const container = document.createElement("div");
      container.classList.add("simula_antecipacao_form_output");
      container.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(container);
      });
      this.parent.appendChild(container);
    });
  }

  private async createLabel(container: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const title: HTMLElement = document.createElement("spam");
      title.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(title);
      });
      container.appendChild(title);
    });
  }

  private async createInput(container: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const input: HTMLElement = document.createElement("spam");
      input.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(input);
      });
      container.appendChild(input);
    });
  }

  async updateValues(values: any): Promise<HTMLElement> {
    const child = await this.render(values);
    this.label.innerText = this.config.label;
    const formatedValue = values
      ? values.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })
      : "";
    this.input.innerText = formatedValue;
    return child;
  }
}

export default ResultIten;
