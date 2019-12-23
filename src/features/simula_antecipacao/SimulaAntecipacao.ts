import {
  State,
  SimuleAntecipacaoInputs,
  SimuleAntecipacaoOutputs,
  SimuleAntecipacaoState
} from "../../core/State";

import { SimulaAnteciapacaoForm } from "./SimulaAntecipacaoForm";
import { SimulaAnteciapacaoResults } from "./SimulaAntecipacaoResults";

export class SimulaAnteciapacao {
  private currentState: SimuleAntecipacaoState;
  public domChildNode: HTMLElement;
  private parent: HTMLElement;
  private formView: any;
  private resultView: any;

  /**
   * Inicializa Simula Antecipacao
   * @returns {boolean}
   */
  async init(parent: HTMLElement, state: SimuleAntecipacaoState) {
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
    container.classList.add("simula_antecipacao_container");
    this.formView = await new SimulaAnteciapacaoForm().init(
      container,
      this.currentState
    );
    this.formView.domChildNode.addEventListener(
      "change",
      (event: CustomEvent) => {
        if (event && event.detail) {
          this.updateState(event.detail);
        }
      }
    );

    this.resultView = await new SimulaAnteciapacaoResults().init(
      container,
      this.currentState.outputs
    );

    return container;
  }

  private async updateState(values: any) {
    if (!values) {
      return;
    }

    let newState = {
      inputs: {
        valor_venda: this.currentState.inputs.valor_venda,
        parcelas: this.currentState.inputs.parcelas,
        percentual: this.currentState.inputs.percentual
      }
    };
    newState.inputs[values.prop] = values.value;

    this.currentState = await State.getInstance().setSimuleAntecipacaoState(
      newState
    );
    await this.resultView.updateValues(this.currentState.outputs);
  }

  private async createContainer(): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const container = document.createElement("div");
      container.classList.add("hidden");
      container.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(container);
      });
      this.parent.appendChild(container);
    });
  }

  async updateValues(values: any): Promise<HTMLElement> {
    const child: HTMLElement = await this.render(values);
    return child;
  }
}

export default SimulaAnteciapacao;
