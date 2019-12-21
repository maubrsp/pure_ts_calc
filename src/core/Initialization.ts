import {
  State,
  SimuleAntecipacaoInputs,
  SimuleAntecipacaoOutputs
} from "./State";

export class Initialization {
  /**
   * initialize application
   * @returns {boolean}
   */
  async init() {
    try {
      const body = await this.domContentLoaded_handler();
      if (!body) {
        throw new Error("dom body is undefined");
      }
      const state = State.getInstance();
      const init_result = await state.init();
      return init_result;
    } catch (error) {
      return error;
    }
  }

  /**
   * get document.body when ready
   */
  async domContentLoaded_handler() {
    return new Promise((resolve, reject) => {
      let body: any;
      const timeout = setTimeout(() => {
        if (!body) {
          reject("dom body is undefined!");
        }
      }, 1500);

      window.addEventListener("DOMContentLoaded", (event: any) => {
        clearTimeout(timeout);
        body = document.body;
        resolve(body);
      });
    });
  }

  /**
   * get state when ready
   */
  async stateReady_handler() {
    return new Promise((resolve, reject) => {});
  }

  /**
   * get simulaAntecipacao when ready
   */
  async simulaAntecipacaoReady_handler() {
    return new Promise((resolve, reject) => {});
  }
}

export default Initialization;
