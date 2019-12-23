import { State } from "./State";
import { SimulaAnteciapacao } from "../features/simula_antecipacao/SimulaAntecipacao";

export class Initialization {
  private feature: any;
  private loader: HTMLElement;

  /**
   * initialize application
   * @returns {boolean}
   */
  async init(): Promise<boolean> {
    try {
      const body: HTMLBodyElement = await this.domContentLoaded_handler();
      if (!body) {
        throw new Error("dom body is undefined");
      }
      this.loader = body.querySelectorAll(".loader")[0] as HTMLElement;
      const state = State.getInstance();
      const initState = await state.init();
      const appDom: HTMLElement = await this.domAplicationNode(body);
      await this.asyncTimeout(1000);
      this.loader.classList.add("hidden");
      this.feature = await new SimulaAnteciapacao().init(appDom, initState);
      this.feature.domChildNode.classList.remove("hidden");
      return true;
    } catch (error) {
      return error;
    }
  }

  /**
   * get document.body when ready
   */
  async domContentLoaded_handler(): Promise<HTMLBodyElement> {
    return new Promise((resolve, reject) => {
      let body: HTMLBodyElement;
      const timeout = setTimeout(() => {
        if (!body) {
          reject("dom body is undefined!");
        }
      }, 1500);

      window.addEventListener("DOMContentLoaded", (event: any) => {
        clearTimeout(timeout);
        body = document.body as HTMLBodyElement;
        resolve(body);
      });
    });
  }

  async domAplicationNode(node: HTMLBodyElement): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const app = document.createElement("main");
      app.addEventListener("DOMNodeInserted", (event: any) => {
        resolve(app);
      });
      node.appendChild(app);
    });
  }

  /**
   * get state when ready
   */
  async asyncTimeout(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  /**
   * get simulaAntecipacao when ready
   */
  async simulaAntecipacaoReady_handler() {
    return new Promise((resolve, reject) => {});
  }
}

export default Initialization;
