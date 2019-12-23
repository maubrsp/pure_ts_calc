import { SimuleAntecipacaoState } from "../../core/State";

import { Input } from "../../shared/components/Input";

export class SimulaAnteciapacaoForm {
  private currentState: SimuleAntecipacaoState;
  public domChildNode: HTMLElement;
  private parent: HTMLElement;
  private form: HTMLFormElement;

  private formState: any = [
    {
      label: "Informe o valor da venda*",
      type: "currency",
      stateProp: "valor_venda"
    },
    {
      label: "Em quantas parcelas*",
      type: "range",
      range: "1,12",
      info: "minimo de 12 parcelas",
      stateProp: "parcelas"
    },
    {
      label: "Informe o percentual de MDR*",
      type: "range",
      range: "1,99",
      stateProp: "percentual"
    }
  ];

  /**
   * Inicializa Simula Antecipacao
   * @returns {boolean}
   */
  public async init(parent: HTMLElement, state: SimuleAntecipacaoState) {
    try {
      this.currentState = state;
      this.parent = parent;
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
    const container: HTMLElement = await this.createContainer();
    const title: HTMLElement = await this.createTitle(container);
    this.form = document.createElement("form");
    container.appendChild(this.form);
    for (let index = 0; index < this.formState.length; index++) {
      const forItem = this.formState[index];
      const input: Input = await new Input().init(
        this.form,
        this.currentState[forItem.stateProp],
        forItem
      );
      forItem.component = input;
      input.domChildNode.addEventListener("change", (event: CustomEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (event && event.detail) {
          this.domChildNode.dispatchEvent(
            new CustomEvent("change", { detail: event.detail })
          );
        }
      });
    }

    return container;
  }

  private async createContainer(): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const container = document.createElement("div");
      container.classList.add("simula_antecipacao_form");
      container.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(container);
      });
      this.parent.appendChild(container);
    });
  }

  private async createTitle(container: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const title: HTMLElement = document.createElement("h1");
      title.innerText = "Simule sua Antecipação";
      title.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(title);
      });
      container.appendChild(title);
    });
  }

  async updateValues(values: any): Promise<HTMLElement> {
    const child = await this.render(values);
    for (let index = 0; index < this.formState.length; index++) {
      const forItem = this.formState[index];
      if (values && values[forItem.stateProp]) {
        forItem.component.updateValues(values[forItem.stateProp]);
      }
    }
    return child;
  }
}

export default SimulaAnteciapacaoForm;
