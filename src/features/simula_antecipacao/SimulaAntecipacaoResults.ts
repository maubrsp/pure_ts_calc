import {
  State,
  SimuleAntecipacaoInputs,
  SimuleAntecipacaoOutputs,
  SimuleAntecipacaoState
} from "../../core/State";

import { ResultIten } from "../../shared/components/ResultIten";

export class SimulaAnteciapacaoResults {
  private currentState: SimuleAntecipacaoOutputs;
  private domChildNode: HTMLElement;
  private parent: HTMLElement;
  private formView: any;

  private resultState: any = [
    { label: "Amanhã", stateProp: "amanha" },
    { label: "Em 15 dias", stateProp: "quinze_dias" },
    { label: "Em 30 dias", stateProp: "trinta_dias" },
    { label: "Em 90 dias", stateProp: "noventa_dias" }
  ];

  /**
   * Inicializa Simula Antecipacao
   * @returns {boolean}
   */
  public async init(parent: HTMLElement, state: SimuleAntecipacaoOutputs) {
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

    for (let index = 0; index < this.resultState.length; index++) {
      const forItem = this.resultState[index];
      forItem.component = await new ResultIten().init(
        container,
        this.currentState[forItem.stateProp],
        forItem
      );
    }

    return container;
  }

  private async createContainer(): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const container = document.createElement("div");
      container.classList.add("simula_antecipacao_result");
      container.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(container);
      });
      this.parent.appendChild(container);
    });
  }

  private async createTitle(container: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const title: HTMLElement = document.createElement("h1");
      title.innerText = "VOCÊ RECEBERÁ:";
      const hr: HTMLElement = document.createElement("hr");
      title.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(title);
      });
      container.appendChild(title);
      container.appendChild(hr);
    });
  }

  public async updateValues(values: any): Promise<HTMLElement> {
    const child = await this.render(values);
    this.currentState = values;
    for (let index = 0; index < this.resultState.length; index++) {
      const forItem = this.resultState[index];
      await forItem.component.updateValues(
        this.currentState[forItem.stateProp]
      );
    }
    return child;
  }
}

export default SimulaAnteciapacaoResults;
